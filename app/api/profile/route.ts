import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { getUserTier, getMonthlyUsage } from '@/lib/subscription';
import { TIERS } from '@/lib/tiers';

// GET /api/profile — current user's packs + stats + tier
export async function GET() {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [packsResult, wsCountResult, effectiveTier, used] = await Promise.all([
      db.execute({
        sql: `SELECT * FROM packs WHERE created_by = ? ORDER BY created_at DESC`,
        args: [userId],
      }),
      db.execute({
        sql: `SELECT COUNT(*) as total FROM worksheets WHERE pack_id IN (SELECT id FROM packs WHERE created_by = ?)`,
        args: [userId],
      }),
      getUserTier(userId),
      getMonthlyUsage(userId),
    ]);

    const packs = packsResult.rows.map((r) => ({
      id: r.id,
      title: r.title,
      overview: r.overview,
      gradeRange: r.grade_range,
      theme: r.theme,
      createdAt: r.created_at,
    }));

    const totalWorksheets = wsCountResult.rows[0]?.total ?? 0;
    const tierInfo = TIERS[effectiveTier];

    return NextResponse.json({
      packs,
      stats: {
        totalPacks: packs.length,
        totalWorksheets,
      },
      subscription: {
        tier: effectiveTier,
        tierName: tierInfo.name,
        packsUsedThisMonth: used,
        packsLimit: tierInfo.limits.packsPerMonth,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
