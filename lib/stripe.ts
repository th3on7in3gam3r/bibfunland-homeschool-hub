import 'server-only';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('CRITICAL: STRIPE_SECRET_KEY is missing from environment variables!');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover' as any,
});




// Map tier keys to Stripe Price IDs
export const TIER_PRICE_IDS: Record<string, string> = {
  student: process.env.STRIPE_PRICE_STUDENT!,
  teacher: process.env.STRIPE_PRICE_TEACHER!,
  educator: process.env.STRIPE_PRICE_EDUCATOR!,
};

// Map Stripe Price IDs back to tier keys
export function getTierFromPriceId(priceId: string): string | null {
  for (const [tier, id] of Object.entries(TIER_PRICE_IDS)) {
    if (id === priceId) return tier;
  }
  return null;
}
