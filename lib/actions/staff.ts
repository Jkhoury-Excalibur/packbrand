'use server';

import { ObjectId } from 'mongodb';
import {
  createStaff as dbCreateStaff,
  updateStaff as dbUpdateStaff,
  deleteStaff as dbDeleteStaff,
} from '../db/staff';
import { staffSchema } from '../validators';
import { requireAdmin } from '../auth-helpers';
import { getDb } from '../db/client';
import { hashPassword } from 'better-auth/crypto';

export async function createStaffAction(formData: unknown) {
  await requireAdmin();

  const parsed = staffSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const id = await dbCreateStaff(parsed.data);
  return { success: true, id: id.toString() };
}

export async function updateStaffAction(staffId: string, formData: unknown) {
  await requireAdmin();

  const parsed = staffSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbUpdateStaff(staffId, parsed.data);
  return { success: true };
}

export async function deleteStaffAction(staffId: string) {
  await requireAdmin();
  await dbDeleteStaff(staffId);
  return { success: true };
}

/** Admin-only: set a staff member's login password. Creates or updates a Better Auth user+account. */
export async function setStaffPasswordAction(staffId: string, password: string) {
  await requireAdmin();

  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const staff = await (await import('../db/staff')).getStaffById(staffId);
  if (!staff) return { error: 'Staff member not found.' };

  const db = await getDb();
  const userCol = db.collection('user');
  const accountCol = db.collection('account');

  const hashed = await hashPassword(password);
  const now = new Date();

  // Check if a Better Auth user already exists for this email
  let existingUser = await userCol.findOne({ email: staff.email });

  // Repair legacy-broken records from an earlier version that stored user._id
  // as a string. Better Auth's MongoDB adapter expects ObjectId for _id and
  // for reference fields (account.userId), so a string-typed _id breaks
  // session lookups even if we patch the account. Delete and recreate.
  if (existingUser && !(existingUser._id instanceof ObjectId)) {
    const brokenId = existingUser._id as unknown as string;
    await userCol.deleteOne({ _id: brokenId as unknown as ObjectId });
    await accountCol.deleteMany({ userId: brokenId });
    existingUser = null;
  }

  if (existingUser) {
    const userObjectId = existingUser._id;

    const result = await accountCol.updateOne(
      { userId: userObjectId, providerId: 'credential' },
      { $set: { password: hashed, updatedAt: now } },
    );

    // No credential account yet (e.g., OAuth-only user) — create one.
    if (result.matchedCount === 0) {
      await accountCol.insertOne({
        _id: new ObjectId(),
        accountId: userObjectId.toHexString(),
        providerId: 'credential',
        userId: userObjectId,
        password: hashed,
        createdAt: now,
        updatedAt: now,
      });
    }
  } else {
    // Create a new Better Auth user with role 'staff', reusing the staff record's
    // ObjectId as the user _id so the two records share an id.
    const userObjectId = new ObjectId(staffId);

    await userCol.insertOne({
      _id: userObjectId,
      name: staff.name,
      email: staff.email,
      emailVerified: true,
      role: 'staff',
      phone: staff.phone,
      createdAt: now,
      updatedAt: now,
    });

    await accountCol.insertOne({
      _id: new ObjectId(),
      accountId: staffId,
      providerId: 'credential',
      userId: userObjectId,
      password: hashed,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { success: true };
}
