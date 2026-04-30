import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { sendWelcomeEmail } from '@/lib/email';
import { db, ensureDB } from '@/lib/db';

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const name = user?.fullName || user?.firstName || 'Educator';

  if (!email) {
    return NextResponse.json({ error: 'No email found' }, { status: 400 });
  }

  // Idempotency check: have we already sent a welcome email?
  // We can track this in the subscriptions table or a new metadata column.
  // For now, let's just check if they have a subscription record at all.
  await ensureDB();
  const result = await db.execute({
    sql: `SELECT welcome_sent FROM subscriptions WHERE user_id = ?`,
    args: [userId],
  });

  if (result.rows[0]?.welcome_sent) {
    return NextResponse.json({ success: true, alreadySent: true });
  }

  // Send the email
  await sendWelcomeEmail(email, name);

  // Update DB to mark as sent
  await db.execute({
    sql: `INSERT INTO subscriptions (user_id, tier, welcome_sent, updated_at) 
          VALUES (?, 'free', 1, datetime('now'))
          ON CONFLICT(user_id) DO UPDATE SET welcome_sent = 1, updated_at = datetime('now')`,
    args: [userId],
  });

  return NextResponse.json({ success: true });
}
