'use server';

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-helpers';
import { getClient, getDb } from '@/lib/db/client';
import { verifyTurnstile, turnstileError } from '@/lib/turnstile';

const schema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().max(200),
  phone: z.string().trim().max(50),
  role: z.enum(['customer', 'admin']),
});

export async function saveUser(input: unknown, token?: string) {
  if (!await verifyTurnstile(token, 'user_edit')) return { error: turnstileError };
  const session = await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: 'Check the user details and try again.' };
  const { id, ...changes } = parsed.data;
  if (id === session.user.id && changes.role !== 'admin') return { error: 'You cannot remove your own admin access.' };
  const db = await getDb();
  const transaction = (await getClient()).startSession();
  try {
    await transaction.withTransaction(async () => {
      // Writing the actor as well as the target prevents simultaneous mutual demotions
      // and a stale admin request racing a revocation.
      const actor = await db.collection('user').updateOne(
        { _id: new ObjectId(session.user.id), role: 'admin', emailVerified: true },
        { $set: { adminActionAt: new Date() } }, { session: transaction },
      );
      if (!actor.matchedCount) throw new Error('Access changed');
      const result = await db.collection('user').updateOne({ _id: new ObjectId(id) }, { $set: { ...changes, updatedAt: new Date() } }, { session: transaction });
      if (!result.matchedCount) throw new Error('User missing');
    });
  } catch {
    return { error: 'Unable to update this user. Refresh the page and check your admin access.' };
  } finally {
    await transaction.endSession();
  }
  revalidatePath('/admin/users');
  return { success: true };
}
