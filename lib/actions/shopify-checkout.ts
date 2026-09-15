'use server';

import { shopifyStorefront } from '@/lib/shopify/client';
import { CheckoutError, createShopifyCheckout } from '@/lib/shopify/checkout-data';
import { getSession } from '@/lib/auth-helpers';
import { findUser } from '@/lib/db/users';
import { randomUUID } from 'node:crypto';
import { checkoutTrackingSchema } from '@/lib/shopify/payment-data';
import { recordCheckout } from '@/lib/db/checkout-payments';
import { verifyTurnstile } from '@/lib/turnstile';

export async function startShopifyCheckout(input: unknown, token?: string) {
  if (!await verifyTurnstile(token, 'checkout')) return { error: 'TURNSTILE_FAILED' };
  const snapshot = checkoutTrackingSchema.safeParse(input);
  if (!snapshot.success) return { error: 'INVALID_CART' };
  let verifiedEmail: string | undefined;
  // Account prefill is optional; a temporary login-service failure must not block guest checkout.
  try {
    const session = await getSession();
    const user = session ? await findUser(session.user.id) : null;
    if (user?.emailVerified === true && typeof user.email === 'string') verifiedEmail = user.email;
  } catch { /* Shopify still collects the buyer's email at checkout. */ }
  try {
    const checkoutId = randomUUID();
    const checkout = await createShopifyCheckout(shopifyStorefront, input, verifiedEmail, checkoutId);
    await recordCheckout(checkoutId, snapshot.data);
    return checkout;
  } catch (error) {
    return { error: error instanceof CheckoutError ? error.code : 'CHECKOUT_UNAVAILABLE' };
  }
}
