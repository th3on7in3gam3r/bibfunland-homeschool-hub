import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { generateWorksheetPack } from '@/lib/ai';
import { getUserTier, getMonthlyUsage } from '@/lib/subscription';
import { TIERS, canAccessGrade, canGeneratePack } from '@/lib/tiers';
import { sendPackReadyEmail } from '@/lib/email';

import { randomUUID } from 'crypto';

// Extend Vercel/Koyeb function timeout for AI generation (up to 120s)
export const maxDuration = 120;

// Simple in-memory rate limit: max 5 pack generations per user per hour
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

// GET /api/packs — list recent packs (optional ?category= and ?featured=true filters)
// Library access is tier-gated: free users only see first N packs
export async function GET(req: NextRequest) {
  await ensureDB();
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') ?? '50');
    const category = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';
    const mineOnly = searchParams.get('mine') === 'true';
    const { userId } = await auth();

    // Determine how many packs this user can see (only applies to library browsing, not "mine")
    const tier = userId ? await getUserTier(userId) : 'free';
    const visibleLimit = TIERS[tier].limits.visibleLibraryPacks;
    const effectiveLimit = (visibleLimit === null || mineOnly) ? limit : Math.min(limit, visibleLimit);

    let sql = `
      SELECT p.*, COUNT(f.pack_id) as favorite_count 
      FROM packs p 
      LEFT JOIN favorites f ON p.id = f.pack_id
    `;
    const args: (string | number)[] = [];
    const conditions: string[] = [];

    if (mineOnly) {
      if (!userId) return NextResponse.json({ error: 'Sign in to see your packs' }, { status: 401 });
      conditions.push(`p.created_by = ?`);
      args.push(userId);
    } else {
      if (featuredOnly) conditions.push(`p.is_featured = 1`);
      if (category) { conditions.push(`p.category = ?`); args.push(category); }
    }

    if (conditions.length) sql += ` WHERE ` + conditions.join(' AND ');
    sql += ` GROUP BY p.id ORDER BY p.created_at DESC LIMIT ?`;
    args.push(effectiveLimit);

    const result = await db.execute({ sql, args });


    const packs = result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      overview: r.overview,
      gradeRange: r.grade_range,
      theme: r.theme,
      category: r.category ?? 'Bible Story',
      isFeatured: Boolean(r.is_featured),
      createdBy: r.created_by,
      createdAt: r.created_at,
      favoriteCount: Number(r.favorite_count || 0),
    }));


    return NextResponse.json({ packs, tier, visibleLimit });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/packs — generate + save a new pack
export async function POST(req: NextRequest) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { theme, gradeRange, category } = await req.json();

    if (!theme || !gradeRange) {
      return NextResponse.json(
        { error: 'theme and gradeRange are required' },
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
    if (!canAccessGrade(tier, gradeRange)) {
      return NextResponse.json(
        {
          error: `Your ${TIERS[tier].name} plan doesn't include ${gradeRange}. Upgrade to access all grade ranges.`,
          upgradeRequired: true,
          tier,
        },
        { status: 403 }
      );
    }

    // Worksheet count based on tier
    const worksheetCount = TIERS[tier].limits.worksheetsPerPack;

    // Generate with Claude
    const packData = await generateWorksheetPack(theme, gradeRange, worksheetCount);

    const packId = randomUUID();
    const now = new Date().toISOString();
    const resolvedCategory = category ?? 'Bible Story';

    // Build all inserts and execute them atomically in a single batch (transaction)
    const statements = [
      {
        sql: `INSERT INTO packs (id, title, overview, grade_range, theme, category, created_by, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [packId, packData.title, packData.overview, gradeRange, theme, resolvedCategory, userId, now] as (string | number | null)[],
      },
      ...packData.worksheets.map((ws, i) => ({
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
        ] as (string | number | null)[],
      })),
    ];

    await db.batch(statements, 'write');

    // Send email notification (fire and forget)
    try {
      const user = await currentUser();
      const email = user?.emailAddresses?.[0]?.emailAddress;
      if (email) {
        sendPackReadyEmail(email, packData.title, packId).catch(console.error);
      }
    } catch (e) {
      console.error('Failed to trigger pack ready email:', e);
    }

    return NextResponse.json({ packId });

  } catch (err: unknown) {
    console.error('Pack generation error:', err);
    const message =
      (err as { error?: { error?: { message?: string } } })?.error?.error?.message ??
      (err instanceof Error ? err.message : 'Generation failed');
    const status = (err as { status?: number })?.status === 400 ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
