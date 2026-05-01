import 'server-only';

/**
 * Server-only admin utility.
 * Checks whether userId matches the ADMIN_USER_ID environment variable.
 */
export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const adminId = process.env.ADMIN_USER_ID;
  if (!adminId) return false;
  return userId === adminId;
}
