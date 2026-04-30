import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserTier, getMonthlyUsage } from '@/lib/subscription';
import { TIERS } from '@/lib/tiers';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ tier: 'free' });
  }

  try {
    const effectiveTier = await getUserTier(userId);
    const used = await getMonthlyUsage(userId);
    const tierInfo = TIERS[effectiveTier];

    return NextResponse.json({
      tier: effectiveTier,
      tierName: tierInfo.name,
      packsUsedThisMonth: used,
      packsLimit: tierInfo.limits.packsPerMonth,
      worksheetsLimit: tierInfo.limits.worksheetsPerPack,
      gradeRangeLabel: tierInfo.limits.grades.length === 4 ? 'All grades' : tierInfo.limits.grades.join(' & '),
    });
  } catch (err: any) {
    return NextResponse.json({ tier: 'free' });
  }
}
