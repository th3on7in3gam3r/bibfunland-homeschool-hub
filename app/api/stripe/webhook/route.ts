import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, getTierFromPriceId } from '@/lib/stripe';
import { db, ensureDB } from '@/lib/db';
import type Stripe from 'stripe';

// Required: raw body for Stripe signature verification
export const config = { api: { bodyParser: false } };

async function upsertSubscription(
  userId: string,
  tier: string,
  subscription: Stripe.Subscription,
  customerId: string,
) {
  await ensureDB();
  const item = subscription.items.data[0];
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000).toISOString()
    : null;

  await db.execute({
    sql: `INSERT INTO subscriptions
            (user_id, tier, stripe_customer_id, stripe_subscription_id, status, current_period_end, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(user_id) DO UPDATE SET
            tier = excluded.tier,
            stripe_customer_id = excluded.stripe_customer_id,
            stripe_subscription_id = excluded.stripe_subscription_id,
            status = excluded.status,
            current_period_end = excluded.current_period_end,
            updated_at = datetime('now')`,
    args: [userId, tier, customerId, subscription.id, subscription.status, periodEnd],
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Payment succeeded — activate subscription
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;
        if (!userId || !tier || !session.subscription) break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await upsertSubscription(userId, tier, sub, session.customer as string);
        console.log(`[Stripe] Activated ${tier} for ${userId}`);
        break;
      }

      // Subscription renewed or updated
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price?.id;
        const tier = getTierFromPriceId(priceId) ?? 'free';
        await upsertSubscription(userId, tier, sub, sub.customer as string);
        console.log(`[Stripe] Updated subscription for ${userId} → ${tier}`);
        break;
      }

      // Subscription cancelled or payment failed
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await ensureDB();
        await db.execute({
          sql: `UPDATE subscriptions SET tier = 'free', status = 'cancelled', updated_at = datetime('now') WHERE user_id = ?`,
          args: [userId],
        });
        console.log(`[Stripe] Subscription cancelled for ${userId} → downgraded to free`);
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event: ${event.type}`);
    }
  } catch (err: any) {
    console.error('[Stripe webhook] Handler error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
