import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { stripe, TIER_PRICE_IDS } from '@/lib/stripe';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();

  const priceId = TIER_PRICE_IDS[tier];
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: 'User email not found. Please add an email to your account.' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { userId, tier },
      subscription_data: { metadata: { userId, tier } },
      success_url: `${appUrl}/profile?upgraded=true`,
      cancel_url: `${appUrl}/pricing?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session. Please try again.' }, { status: 500 });
  }
}
