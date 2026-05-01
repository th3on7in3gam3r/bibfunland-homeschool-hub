import 'server-only';
import { db } from './db';
import { isAdmin } from './admin';
import type { TierKey } from './tiers';

// Server-side only — never import in client components

/**
 * Returns the effective tier for a user.
 * Admin always gets 'educator'. Otherwise reads from subscriptions table.
 */
export async function getUserTier(userId: string): Promise<TierKey> {
  // Admin bypass
  if (isAdmin(userId)) return 'educator';

  try {
    const result = await db.execute({
      sql: `SELECT tier, status, current_period_end FROM subscriptions WHERE user_id = ?`,
      args: [userId],
    });

    if (result.rows.length === 0) return 'free';

    const row = result.rows[0];
    const status = row.status as string;
    const tier = row.tier as TierKey;
    const periodEnd = row.current_period_end as string | null;

    // Check if subscription is still valid
    if (status === 'active' || status === 'trialing') {
      if (!periodEnd || new Date(periodEnd) > new Date()) {
        return tier;
      }
    }

    return 'free';
  } catch {
    return 'free';
  }
}

/**
 * Returns how many packs the user has generated in the current calendar month.
 */
export async function getMonthlyUsage(userId: string): Promise<number> {
  const firstOfMonth = new Date();
  firstOfMonth.setUTCDate(1);
  firstOfMonth.setUTCHours(0, 0, 0, 0);

  const result = await db.execute({
    sql: `SELECT COUNT(*) as count FROM packs WHERE created_by = ? AND created_at >= ?`,
    args: [userId, firstOfMonth.toISOString()],
  });

  return Number(result.rows[0]?.count ?? 0);
}
