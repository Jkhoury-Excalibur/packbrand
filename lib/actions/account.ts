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

  // Better Auth stores users with a string `id` field in MongoDB
  await db.collection('user').updateOne(
    { id: session.user.id },
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
