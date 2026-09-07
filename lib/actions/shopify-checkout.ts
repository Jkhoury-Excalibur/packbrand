'use server';

import { shopifyStorefront } from '@/lib/shopify/client';
import { CheckoutError, createShopifyCheckout } from '@/lib/shopify/checkout-data';
import { getSession } from '@/lib/auth-helpers';
import { findUser } from '@/lib/db/users';

export async function startShopifyCheckout(input: unknown) {
  let verifiedEmail: string | undefined;
  // Account prefill is optional; a temporary login-service failure must not block guest checkout.
  try {
    const session = await getSession();
    const user = session ? await findUser(session.user.id) : null;
    if (user?.emailVerified === true && typeof user.email === 'string') verifiedEmail = user.email;
  } catch { /* Shopify still collects the buyer's email at checkout. */ }
  try {
    return await createShopifyCheckout(shopifyStorefront, input, verifiedEmail);
  } catch (error) {
    return { error: error instanceof CheckoutError ? error.code : 'CHECKOUT_UNAVAILABLE' };
  }
}
