import { ObjectId } from 'mongodb';
import { getDb } from './client';

export type DbStaff = {
  _id: ObjectId;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
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
