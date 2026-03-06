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
  total: number;
  status: string;
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
  const c = await col();
  const last = await c.find().sort({ createdAt: -1 }).limit(1).toArray();
  if (last.length === 0) return 'ORD-1001';
  const lastNum = parseInt(last[0].orderNumber.replace('ORD-', ''), 10);
  return `ORD-${lastNum + 1}`;
}

export async function createOrder(data: CreateOrderInput, customerId?: string) {
  const c = await col();
  const now = new Date();
  const subtotal = data.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= 500 ? 0 : 49.99;
  const total = subtotal + shipping;
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
    total,
    status: 'Pending',
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
  const all = await c.find().toArray();
  const totalRevenue = all.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = all.length;
  const pending = all.filter((o) => o.status === 'Pending').length;
  const processing = all.filter((o) => o.status === 'Processing').length;
  const shipped = all.filter((o) => o.status === 'Shipped').length;
  const delivered = all.filter((o) => o.status === 'Delivered').length;
  return { totalRevenue, totalOrders, pending, processing, shipped, delivered };
}
