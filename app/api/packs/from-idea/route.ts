import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { generateWorksheetPack } from '@/lib/ai';
import { getUserTier, getMonthlyUsage } from '@/lib/subscription';
import { TIERS, canAccessGrade, canGeneratePack } from '@/lib/tiers';
import { randomUUID } from 'crypto';

export const maxDuration = 120;

// Simple in-memory rate limit — mirrors /api/packs rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// POST /api/packs/from-idea — generate a full new pack from an idea card
export async function POST(req: NextRequest) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, gradeLevel, category } = await req.json();

    if (!title || !gradeLevel) {
      return NextResponse.json(
        { error: 'title and gradeLevel are required' },
        { status: 400 }
      );
    }

    // Rate limit check
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'You have reached the limit of 5 packs per hour. Please try again later.' },
        { status: 429 }
      );
    }

    // Tier-based generation limit
    const tier = await getUserTier(userId);
    const used = await getMonthlyUsage(userId);
    if (!canGeneratePack(tier, used)) {
      const limit = TIERS[tier].limits.packsPerMonth;
      return NextResponse.json(
        {
          error: `You've used all ${limit} pack generation${(limit as number) === 1 ? '' : 's'} for this month on the ${TIERS[tier].name} plan.`,
          upgradeRequired: true,
          tier,
        },
        { status: 403 }
      );
    }

    // Grade access check
    if (!canAccessGrade(tier, gradeLevel)) {
      return NextResponse.json(
        {
          error: `Your ${TIERS[tier].name} plan doesn't include ${gradeLevel}. Upgrade to access all grade ranges.`,
          upgradeRequired: true,
          tier,
        },
        { status: 403 }
      );
    }

    // Worksheet count based on tier
    const worksheetCount = TIERS[tier].limits.worksheetsPerPack;

    // Use the idea title as the theme to generate a full pack
    const packData = await generateWorksheetPack(title, gradeLevel, worksheetCount);

    const packId = randomUUID();
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO packs (id, title, overview, grade_range, theme, category, created_by, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        packId,
        packData.title,
        packData.overview,
        gradeLevel,
        title,
        category ?? 'Bible Story',
        userId,
        now,
      ],
    });

    for (let i = 0; i < packData.worksheets.length; i++) {
      const ws = packData.worksheets[i];
      await db.execute({
        sql: `INSERT INTO worksheets (id, pack_id, title, grade_level, objective, parent_instructions, content_markup, bible_verse, sort_order, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          randomUUID(),
          packId,
          ws.title,
          ws.gradeLevel,
          ws.objective,
          ws.parentInstructions,
          ws.contentMarkup,
          ws.bibleVerse,
          i,
          now,
        ],
      });
    }

    return NextResponse.json({ packId });
  } catch (err: unknown) {
    console.error('Pack from idea error:', err);
    const message =
      (err as { error?: { error?: { message?: string } } })?.error?.error?.message ??
      (err instanceof Error ? err.message : 'Generation failed');
    const status = (err as { status?: number })?.status === 400 ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
