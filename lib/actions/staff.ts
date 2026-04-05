'use server';

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

  // Check if a Better Auth user already exists for this email
  const existingUser = await userCol.findOne({ email: staff.email });

  if (existingUser) {
    // Update the existing account's password
    await accountCol.updateOne(
      { userId: existingUser._id.toString(), providerId: 'credential' },
      {
        $set: {
          password: hashed,
          updatedAt: new Date().toISOString(),
        },
      },
    );
  } else {
    // Create a new Better Auth user with role 'staff'
    const now = new Date().toISOString();
    const userId = staffId; // Link staff record ID to user ID

    await userCol.insertOne({
      _id: userId as unknown as import('mongodb').ObjectId,
      name: staff.name,
      email: staff.email,
      emailVerified: true,
      role: 'staff',
      phone: staff.phone,
      createdAt: now,
      updatedAt: now,
    });

    await accountCol.insertOne({
      _id: new (await import('mongodb')).ObjectId(),
      accountId: userId,
      providerId: 'credential',
      userId,
      password: hashed,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { success: true };
}
