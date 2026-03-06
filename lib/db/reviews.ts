import { ObjectId } from 'mongodb';
import { getDb } from './client';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type DbReview = {
  _id: ObjectId;
  productId: string;
  author: string;
  company: string;
  rating: number;
  text: string;
  helpful: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbReview>('reviews');
}

export async function getAllReviews() {
  const c = await col();
  return c.find().sort({ createdAt: -1 }).toArray();
}

export async function getApprovedReviewsByProduct(productId: string) {
  const c = await col();
  return c.find({ productId, status: 'approved' }).sort({ createdAt: -1 }).toArray();
}

export async function getReviewsByProduct(productId: string) {
  const c = await col();
  return c.find({ productId }).sort({ createdAt: -1 }).toArray();
}

export async function createReview(data: {
  productId: string;
  author: string;
  company: string;
  rating: number;
  text: string;
}) {
  const c = await col();
  const now = new Date();
  const result = await c.insertOne({
    ...data,
    _id: new ObjectId(),
    helpful: 0,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId;
}

export async function updateReviewStatus(id: string, status: ReviewStatus) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );
}

export async function incrementHelpful(id: string) {
  const c = await col();
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { helpful: 1 }, $set: { updatedAt: new Date() } }
  );
}
