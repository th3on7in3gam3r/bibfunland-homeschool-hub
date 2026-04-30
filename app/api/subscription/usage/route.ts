import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ensureDB } from '@/lib/db';
import { getUserTier, getMonthlyUsage } from '@/lib/subscription';
import { TIERS } from '@/lib/tiers';

// GET /api/subscription/usage — current user's tier + monthly usage
export async function GET() {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tier = await getUserTier(userId);
  const used = await getMonthlyUsage(userId);
  const limit = TIERS[tier].limits.packsPerMonth;

  return NextResponse.json({ tier, used, limit });
}
