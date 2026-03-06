import { getDb } from './client';

export type DbUser = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbUser>('user');
}

export async function getUsers() {
  const c = await col();
  return c.find().sort({ createdAt: -1 }).toArray();
}

export async function getUserStats() {
  const c = await col();
  const all = await c.find().toArray();
  const total = all.length;
  const verified = all.filter((u) => u.emailVerified).length;
  const admins = all.filter((u) => u.role === 'admin').length;
  const customers = total - admins;
  return { total, verified, admins, customers };
}
