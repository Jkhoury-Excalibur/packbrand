import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './client';

export type ManagedUser = {
  id: string; name: string; email: string; company: string; phone: string;
  role: string; emailVerified: boolean; createdAt: string;
};

export async function findUser(id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return (await getDb()).collection('user').findOne({ _id: new ObjectId(id) });
}

export async function listUsers(search: string, page: number) {
  const db = await getDb();
  const pattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = search ? { $or: ['name', 'email', 'company'].map(key => ({ [key]: { $regex: pattern, $options: 'i' } })) } : {};
  const [rows, total] = await Promise.all([
    db.collection('user').find(filter, { projection: { name: 1, email: 1, company: 1, phone: 1, role: 1, emailVerified: 1, createdAt: 1 } })
      .sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 25).limit(25).toArray(),
    db.collection('user').countDocuments(filter),
  ]);
  return { total, users: rows.map(row => ({
    id: row._id.toString(), name: row.name || '', email: row.email || '',
    company: row.company || '', phone: row.phone || '', role: row.role || 'customer',
    emailVerified: row.emailVerified === true, createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : '',
  })) as ManagedUser[] };
}
