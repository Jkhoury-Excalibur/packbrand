import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { StaffInput } from '../validators';

export type DbStaff = StaffInput & {
  _id: ObjectId;
  lastActive: Date;
  ordersHandled: number;
};

async function col() {
  const db = await getDb();
  return db.collection<DbStaff>('staff');
}

export async function getStaff() {
  const c = await col();
  return c.find().sort({ name: 1 }).toArray();
}

export async function getStaffById(id: string) {
  const c = await col();
  return c.findOne({ _id: new ObjectId(id) });
}

export async function createStaff(data: StaffInput) {
  const c = await col();
  const result = await c.insertOne({
    ...data,
    _id: new ObjectId(),
    lastActive: new Date(),
    ordersHandled: 0,
  });
  return result.insertedId;
}

export async function updateStaff(id: string, data: Partial<StaffInput>) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, lastActive: new Date() } },
  );
}

export async function deleteStaff(id: string) {
  const c = await col();
  return c.deleteOne({ _id: new ObjectId(id) });
}
