import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { CartItem } from '../store/cart';
import type { CreateOrderInput } from '../validators';

export type DbCart = {
  _id: ObjectId;
  cartId: string;
  customerId?: string;
  items: CartItem[] | CreateOrderInput['items'];
  // Filled at submission:
  contact?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
  };
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  specialInstructions?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
  status: 'active' | 'submitted' | 'completed';
  orderNumber?: string;
  paidItemRevisions?: string[];
  createdAt: Date;
  updatedAt: Date;
};

let indexReady: Promise<string> | undefined;

export async function cartCollection() {
  const db = await getDb();
  const collection = db.collection<DbCart>('carts');
  indexReady ??= collection.createIndex({ cartId: 1 }, { unique: true }).catch(error => {
    indexReady = undefined;
    throw error;
  });
  await indexReady;
  return collection;
}

/** Upsert cart items (called on every cart change from client). */
export async function upsertCart(
  cartId: string,
  items: CartItem[],
  customerId?: string,
) {
  const c = await cartCollection();
  const now = new Date();
  await c.updateOne(
    { cartId },
    [
      { $set: {
        cartId: { $literal: cartId },
        ...(customerId ? { customerId: { $literal: customerId } } : {}),
        createdAt: { $ifNull: ['$createdAt', now] },
        updatedAt: now,
        // A delayed browser sync must never put paid items back into the cart.
        items: { $filter: {
          input: { $literal: items }, as: 'item',
          cond: { $not: [{ $in: ['$$item.revision', { $ifNull: ['$paidItemRevisions', []] }] }] },
        } },
      } },
      { $set: { status: { $cond: [{ $eq: [{ $size: '$items' }, 0] }, 'completed', 'active'] } } },
    ],
    { upsert: true },
  );
}

/** Get cart by cartId. */
export async function getCart(cartId: string) {
  const c = await cartCollection();
  return c.findOne({ cartId });
}

/** Attach submission data to the cart when user submits the work order form. */
export async function updateCartSubmission(
  cartId: string,
  data: {
    contact: DbCart['contact'];
    shippingAddress: DbCart['shippingAddress'];
    specialInstructions?: string;
    items: CreateOrderInput['items'];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    customerId?: string;
  },
) {
  const c = await cartCollection();
  return c.updateOne(
    { cartId },
    {
      $set: {
        ...data,
        status: 'submitted' as const,
        updatedAt: new Date(),
      },
    },
  );
}

/** Mark cart as completed after work order is created. */
export async function markCartCompleted(cartId: string, orderNumber: string) {
  const c = await cartCollection();
  return c.updateOne(
    { cartId },
    { $set: { status: 'completed' as const, orderNumber, updatedAt: new Date() } },
  );
}
