import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { ProductInput } from '../validators';

export type DbProduct = ProductInput & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbProduct>('products');
}

export async function getProducts(filter?: { categoryId?: string; isActive?: boolean }) {
  const c = await col();
  const query: Record<string, unknown> = {};
  if (filter?.categoryId) query.categoryId = filter.categoryId;
  if (filter?.isActive !== undefined) query.isActive = filter.isActive;
  return c.find(query).sort({ sortOrder: 1, createdAt: -1 }).toArray();
}

export async function getActiveProducts() {
  return getProducts({ isActive: true });
}

export async function getProductsByCategory(categoryId: string) {
  return getProducts({ categoryId });
}

export async function getFeaturedProducts() {
  const c = await col();
  return c.find({ isActive: true, isFeatured: true }).sort({ sortOrder: 1, createdAt: -1 }).toArray();
}

export async function getProductById(id: string) {
  const c = await col();
  return c.findOne({ _id: new ObjectId(id) });
}

export async function getProductCountsByCategory(): Promise<Record<string, number>> {
  const c = await col();
  const results = await c.aggregate<{ _id: string; count: number }>([
    { $group: { _id: '$categoryId', count: { $sum: 1 } } },
  ]).toArray();
  const map: Record<string, number> = {};
  for (const r of results) {
    map[r._id] = r.count;
  }
  return map;
}

export async function createProduct(data: ProductInput) {
  const c = await col();
  const now = new Date();
  const result = await c.insertOne({
    ...data,
    _id: new ObjectId(),
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId;
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteProduct(id: string) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isActive: false, updatedAt: new Date() } }
  );
}
