import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { generateWorksheetIdeas } from '@/lib/ai';
import { getUserTier, getMonthlyUsage } from '@/lib/subscription';
import { TIERS, canGeneratePack } from '@/lib/tiers';

export const maxDuration = 60;

// POST /api/packs/[id]/ideas — generate AI worksheet ideas for a pack
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Ownership check — verify the pack belongs to the requesting user
    const packResult = await db.execute({
      sql: `SELECT title, overview, grade_range, created_by FROM packs WHERE id = ?`,
      args: [id],
    });

    if (packResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    const pack = packResult.rows[0];
    if (pack.created_by !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Tier check — user must have aiIdeas quota > 0
    const tier = await getUserTier(userId);
    const aiIdeasQuota = TIERS[tier].limits.aiIdeas;
    if (aiIdeasQuota === 0) {
      return NextResponse.json(
        {
          error: `Your ${TIERS[tier].name} plan does not include AI worksheet ideas. Upgrade to access this feature.`,
          upgradeRequired: true,
          tier,
        },
        { status: 403 }
      );
    }

    // Monthly usage check — ensure the user hasn't exceeded their pack generation limit
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

    const ideas = await generateWorksheetIdeas(
      pack.title as string,
      pack.overview as string,
      pack.grade_range as string
    );

    return NextResponse.json({ ideas });
  } catch (err: unknown) {
    console.error('Ideas generation error:', err);
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
