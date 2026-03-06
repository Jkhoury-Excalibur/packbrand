import { ObjectId } from 'mongodb';
import { getDb } from './client';
import type { AddressInput } from '../validators';

export type DbAddress = AddressInput & {
  _id: ObjectId;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

async function col() {
  const db = await getDb();
  return db.collection<DbAddress>('addresses');
}

export async function getUserAddresses(userId: string) {
  const c = await col();
  return c.find({ userId }).sort({ isDefault: -1, createdAt: -1 }).toArray();
}

export async function getAddressById(id: string) {
  const c = await col();
  return c.findOne({ _id: new ObjectId(id) });
}

export async function createAddress(userId: string, data: AddressInput) {
  const c = await col();
  const now = new Date();

  if (data.isDefault) {
    await c.updateMany(
      { userId, type: data.type },
      { $set: { isDefault: false } }
    );
  }

  const result = await c.insertOne({
    ...data,
    _id: new ObjectId(),
    userId,
    createdAt: now,
    updatedAt: now,
  });
  return result.insertedId;
}

export async function updateAddress(id: string, data: Partial<AddressInput>) {
  const c = await col();
  if (data.isDefault) {
    const existing = await c.findOne({ _id: new ObjectId(id) });
    if (existing) {
      await c.updateMany(
        { userId: existing.userId, type: existing.type },
        { $set: { isDefault: false } }
      );
    }
  }
  return c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deleteAddress(id: string) {
  const c = await col();
  return c.deleteOne({ _id: new ObjectId(id) });
}

export async function setDefaultAddress(id: string) {
  const c = await col();
  const addr = await c.findOne({ _id: new ObjectId(id) });
  if (!addr) return;

  await c.updateMany(
    { userId: addr.userId, type: addr.type },
    { $set: { isDefault: false } }
  );
  await c.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isDefault: true, updatedAt: new Date() } }
  );
}
