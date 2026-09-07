import { z } from 'zod';
import { getCart } from '@/lib/db/carts';

export async function GET(request: Request) {
  const cartId = z.string().uuid().safeParse(new URL(request.url).searchParams.get('cartId'));
  if (!cartId.success) return new Response('Invalid cart', { status: 400 });
  try {
    const cart = await getCart(cartId.data);
    // The random cart ID is a guest capability; expose no customer or order details.
    return Response.json({ paidItemRevisions: cart?.paidItemRevisions ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return new Response('Unavailable', { status: 503 }); }
}
