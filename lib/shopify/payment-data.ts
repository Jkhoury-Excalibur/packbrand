import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export const checkoutTrackingSchema = z.object({
  cartId: z.string().uuid(),
  lines: z.array(z.object({
    id: z.string().min(1).max(500),
    revision: z.string().uuid(),
    variantId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/),
    quantity: z.number().int().positive(),
  })).min(1).max(100),
});

export type CheckoutSnapshot = z.infer<typeof checkoutTrackingSchema>;

export function verifyWebhook(body: Buffer, signature: string | null, secret: string) {
  if (!signature || !secret || !/^[A-Za-z0-9+/]{43}=$/.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(body).digest();
  const actual = Buffer.from(signature, 'base64');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const paidOrderSchema = z.object({
  financial_status: z.literal('paid'),
  admin_graphql_api_id: z.string().regex(/^gid:\/\/shopify\/Order\/\d+$/),
  note_attributes: z.array(z.object({ name: z.string(), value: z.unknown() })),
  line_items: z.array(z.object({ variant_id: z.number().int().nullable(), quantity: z.number().int().positive() })),
});

export function parsePaidOrder(input: unknown) {
  const parsed = paidOrderSchema.safeParse(input);
  if (!parsed.success) return null;
  const checkoutId = z.string().uuid().safeParse(parsed.data.note_attributes.find(a => a.name === '_pbs_checkout_id')?.value);
  return checkoutId.success ? { ...parsed.data, checkoutId: checkoutId.data } : null;
}

// A modified/partial Shopify checkout must not clear products that weren't purchased.
export function coversCheckout(order: NonNullable<ReturnType<typeof parsePaidOrder>>, snapshot: CheckoutSnapshot) {
  const paid = new Map<string, number>();
  const expected = new Map<string, number>();
  for (const line of order.line_items) {
    const id = `gid://shopify/ProductVariant/${line.variant_id}`;
    paid.set(id, (paid.get(id) ?? 0) + line.quantity);
  }
  for (const line of snapshot.lines) expected.set(line.variantId, (expected.get(line.variantId) ?? 0) + line.quantity);
  return [...expected].every(([id, quantity]) => (paid.get(id) ?? 0) >= quantity);
}
