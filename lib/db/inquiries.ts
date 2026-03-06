import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { InquiryInput } from '../validators';

export type DbInquiry = InquiryInput & {
  _id: ObjectId;
  createdAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbInquiry>('inquiries');
}

export async function createInquiry(data: InquiryInput) {
  const c = await col();
  const result = await c.insertOne({
    ...data,
    _id: new ObjectId(),
    createdAt: new Date(),
  });
  return result.insertedId;
}

export async function getInquiries(filter?: { type?: string }) {
  const c = await col();
  const query: Record<string, unknown> = {};
  if (filter?.type) query.type = filter.type;
  return c.find(query).sort({ createdAt: -1 }).toArray();
}

export async function getInquiryById(id: string) {
  const c = await col();
  return c.findOne({ _id: new ObjectId(id) });
}
