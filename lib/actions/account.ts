'use server';

import { getDb } from '../db/client';
import { requireAuth } from '../auth-helpers';

export async function updateProfile(formData: {
  name: string;
  company?: string;
  phone?: string;
}) {
  const session = await requireAuth();
  const db = await getDb();

  // Better Auth stores user _id as string in MongoDB
  await db.collection('user').updateOne(
    { _id: session.user.id as unknown as import('mongodb').ObjectId },
    {
      $set: {
        name: formData.name,
        company: formData.company || '',
        phone: formData.phone || '',
        updatedAt: new Date(),
      },
    }
  );

  return { success: true };
}
