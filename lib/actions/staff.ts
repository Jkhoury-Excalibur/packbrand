'use server';

import {
  createStaff as dbCreateStaff,
  updateStaff as dbUpdateStaff,
  deleteStaff as dbDeleteStaff,
} from '../db/staff';
import { staffSchema } from '../validators';
import { requireAdmin } from '../auth-helpers';

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
