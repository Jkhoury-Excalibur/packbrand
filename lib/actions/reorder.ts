'use server';

import { requireAuth } from '@/lib/auth-helpers';
import { findUser } from '@/lib/db/users';
import { shopifyAdmin } from '@/lib/shopify/admin';
import { loadOwnedOrder, reorderInput } from '@/lib/shopify/orders-data';
import { shopifyStorefront } from '@/lib/shopify/client';
import { createShopifyCheckout } from '@/lib/shopify/checkout-data';

export async function reorderShopifyOrder(id: string, locale: 'en' | 'es') {
  const session = await requireAuth();
  try {
    const user = await findUser(session.user.id);
    if (!user?.emailVerified || typeof user.email !== 'string') return { error: 'Verify your email before reordering.' };
    const order = await loadOwnedOrder(shopifyAdmin, id, user.email, user.emailVerified === true);
    return await createShopifyCheckout(shopifyStorefront, reorderInput(order, locale), user.email);
  } catch {
    return { error: 'This order cannot be reordered right now. An item may be unavailable or its minimum quantity may have changed. Please choose your products from the catalog.' };
  }
}
