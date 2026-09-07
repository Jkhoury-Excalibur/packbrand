import 'server-only';
import { getDb } from './client';
import { cartCollection } from './carts';
import { coversCheckout, type CheckoutSnapshot, type parsePaidOrder } from '../shopify/payment-data';

type CheckoutPayment = CheckoutSnapshot & { _id: string; createdAt: Date; paidOrderId?: string };

export async function recordCheckout(id: string, snapshot: CheckoutSnapshot) {
  const db = await getDb();
  await db.collection<CheckoutPayment>('checkoutPayments').insertOne({ _id: id, ...snapshot, createdAt: new Date() });
}

export async function completePaidCheckout(order: NonNullable<ReturnType<typeof parsePaidOrder>>) {
  const db = await getDb();
  const payments = db.collection<CheckoutPayment>('checkoutPayments');
  const checkout = await payments.findOne({ _id: order.checkoutId });
  if (!checkout || !coversCheckout(order, checkout)) return;

  // Both updates are replay-safe. Retry deliveries finish a previously interrupted update.
  await payments.updateOne({ _id: checkout._id }, { $set: { paidOrderId: order.admin_graphql_api_id } });
  const carts = await cartCollection();
  await carts.updateOne({ cartId: checkout.cartId }, [
    { $set: {
      cartId: checkout.cartId,
      createdAt: { $ifNull: ['$createdAt', '$$NOW'] },
      paidItemRevisions: { $setUnion: [{ $ifNull: ['$paidItemRevisions', []] }, checkout.lines.map(line => line.revision)] },
    } },
    { $set: { items: { $filter: {
      input: { $ifNull: ['$items', []] }, as: 'item',
      cond: { $not: [{ $in: ['$$item.revision', '$paidItemRevisions'] }] },
    } }, updatedAt: '$$NOW' } },
    { $set: { status: { $cond: [{ $eq: [{ $size: '$items' }, 0] }, 'completed', 'active'] } } },
  ], { upsert: true });
}
