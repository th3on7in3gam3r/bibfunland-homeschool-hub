import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, ensureDB } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function GET() {
  await ensureDB();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'));
  }

  const result = await db.execute({
    sql: `SELECT stripe_customer_id FROM subscriptions WHERE user_id = ?`,
    args: [userId],
  });

  const customerId = result.rows[0]?.stripe_customer_id as string | undefined;

  if (!customerId) {
    return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'));
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/profile`,
  });

  return NextResponse.redirect(session.url);
}
