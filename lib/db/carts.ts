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
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbCart>('carts');
}

/** Upsert cart items (called on every cart change from client). */
export async function upsertCart(
  cartId: string,
  items: CartItem[],
  customerId?: string,
) {
  const c = await col();
  const now = new Date();
  const update: Record<string, unknown> = {
    items,
    updatedAt: now,
  };
  if (customerId) update.customerId = customerId;

  await c.updateOne(
    { cartId },
    {
      $set: update,
      $setOnInsert: {
        _id: new ObjectId(),
        cartId,
        status: 'active',
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

/** Get cart by cartId. */
export async function getCart(cartId: string) {
  const c = await col();
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
  const c = await col();
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
  const c = await col();
  return c.updateOne(
    { cartId },
    { $set: { status: 'completed' as const, orderNumber, updatedAt: new Date() } },
  );
}
