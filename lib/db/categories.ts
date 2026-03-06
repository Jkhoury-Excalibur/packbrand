import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { CategoryInput } from '../validators';

export type DbCategory = CategoryInput & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbCategory>('categories');
}

export async function getCategories(filter?: { isVisible?: boolean }) {
  const c = await col();
  const query: Record<string, unknown> = {};
  if (filter?.isVisible !== undefined) query.isVisible = filter.isVisible;
  return c.find(query).sort({ sortOrder: 1, name: 1 }).toArray();
}

export async function getVisibleCategories() {
  return getCategories({ isVisible: true });
}

export async function getCategoryById(id: string) {
  const c = await col();
  return c.findOne({ _id: new ObjectId(id) });
}

export async function getCategoryBySlug(slug: string) {
  const c = await col();
  return c.findOne({ slug });
}

export async function createCategory(data: CategoryInput) {
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

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteCategory(id: string) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isVisible: false, updatedAt: new Date() } }
  );
}

export async function reorderCategories(orderedIds: string[]) {
  const c = await col();
  const ops = orderedIds.map((id, i) => ({
    updateOne: {
      filter: { _id: new ObjectId(id) },
      update: { $set: { sortOrder: i, updatedAt: new Date() } },
    },
  }));
  if (ops.length > 0) {
    return c.bulkWrite(ops);
  }
}
