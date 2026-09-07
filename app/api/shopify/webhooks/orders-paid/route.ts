import { completePaidCheckout } from '@/lib/db/checkout-payments';
import { parsePaidOrder, verifyWebhook } from '@/lib/shopify/payment-data';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
  if (!secret) return new Response('Unavailable', { status: 503 });
  const body = Buffer.from(await request.arrayBuffer());
  if (!verifyWebhook(body, request.headers.get('x-shopify-hmac-sha256'), secret)) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (request.headers.get('x-shopify-shop-domain') !== process.env.SHOPIFY_STORE_DOMAIN?.trim()
    || request.headers.get('x-shopify-topic') !== 'orders/paid') {
    return new Response('Invalid delivery', { status: 400 });
  }
  let payload: unknown;
  try { payload = JSON.parse(body.toString('utf8')); }
  catch { return new Response('Invalid JSON', { status: 400 }); }
  const order = parsePaidOrder(payload);
  if (!order) return new Response(null, { status: 204 });
  try {
    await completePaidCheckout(order);
    return new Response(null, { status: 204 });
  } catch {
    // Non-2xx asks Shopify to retry; never acknowledge a failed database write.
    return new Response('Retry delivery', { status: 503 });
  }
}
