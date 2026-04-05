import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { CreateOrderInput, UpdateOrderInput } from '../validators';

export type DbOrder = {
  _id: ObjectId;
  orderNumber: string;
  customerId?: string;
  contact: CreateOrderInput['contact'];
  shippingAddress: CreateOrderInput['shippingAddress'];
  items: CreateOrderInput['items'];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  logoUrls?: string[];
  trackingNumber?: string;
  notes?: string;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbOrder>('orders');
}

async function generateOrderNumber(): Promise<string> {
  const db = await getDb();
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: 'orders' as unknown as import('mongodb').ObjectId },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return `WO-${1000 + (result?.seq ?? 1)}`;
}

export async function createOrder(
  data: CreateOrderInput,
  customerId?: string,
  taxRate = 0,
  shippingRate = 49.99,
  freeShippingThreshold = 500,
) {
  const c = await col();
  const now = new Date();
  const subtotal = data.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shipping + tax;
  const orderNumber = await generateOrderNumber();

  const doc: DbOrder = {
    _id: new ObjectId(),
    orderNumber,
    customerId,
    contact: data.contact,
    shippingAddress: data.shippingAddress,
    items: data.items,
    subtotal,
    shipping,
    tax,
    total,
    status: 'Pending',
    logoUrls: data.logoUrls,
    specialInstructions: data.specialInstructions,
    createdAt: now,
    updatedAt: now,
  };

  await c.insertOne(doc);
  return doc;
}

export async function getOrders(filter?: { status?: string }) {
  const c = await col();
  const query: Record<string, unknown> = {};
  if (filter?.status) query.status = filter.status;
  return c.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getOrderById(id: string) {
  const c = await col();
  if (ObjectId.isValid(id)) {
    return c.findOne({ _id: new ObjectId(id) });
  }
  return c.findOne({ orderNumber: id });
}

export async function getUserOrders(customerId: string) {
  const c = await col();
  return c.find({ customerId }).sort({ createdAt: -1 }).toArray();
}

export async function updateOrder(id: string, data: UpdateOrderInput) {
  const c = await col();
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (data.status) update.status = data.status;
  if (data.trackingNumber !== undefined) update.trackingNumber = data.trackingNumber;
  if (data.notes !== undefined) update.notes = data.notes;

  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
}

export async function getOrderStats() {
  const c = await col();
  const [result] = await c.aggregate<{
    _id: null;
    totalRevenue: number;
    totalOrders: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  }>([{
    $group: {
      _id: null,
      totalRevenue: { $sum: '$total' },
      totalOrders: { $sum: 1 },
      pending:    { $sum: { $cond: [{ $eq: ['$status', 'Pending'] },    1, 0] } },
      processing: { $sum: { $cond: [{ $eq: ['$status', 'Processing'] }, 1, 0] } },
      shipped:    { $sum: { $cond: [{ $eq: ['$status', 'Shipped'] },    1, 0] } },
      delivered:  { $sum: { $cond: [{ $eq: ['$status', 'Delivered'] },  1, 0] } },
    },
  }]).toArray();
  return result ?? { totalRevenue: 0, totalOrders: 0, pending: 0, processing: 0, shipped: 0, delivered: 0 };
}
