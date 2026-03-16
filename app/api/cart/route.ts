import { NextResponse } from 'next/server';
import { upsertCart } from '@/lib/db/carts';
import { getSession } from '@/lib/auth-helpers';

export async function POST(request: Request) {
  try {
    const { cartId, items } = await request.json();

    if (!cartId || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Attach customerId if user is logged in
    let customerId: string | undefined;
    try {
      const session = await getSession();
      customerId = session?.user?.id;
    } catch {
      // Not authenticated — that's fine
    }

    await upsertCart(cartId, items, customerId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[cart-api] Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
