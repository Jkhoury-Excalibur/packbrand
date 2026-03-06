'use server';

import {
  createAddress as dbCreate,
  updateAddress as dbUpdate,
  deleteAddress as dbDelete,
  setDefaultAddress as dbSetDefault,
  getAddressById,
} from '../db/addresses';
import { addressSchema } from '../validators';
import { requireAuth } from '../auth-helpers';

export async function createAddressAction(formData: unknown) {
  const session = await requireAuth();

  const parsed = addressSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const id = await dbCreate(session.user.id, parsed.data);
  return { success: true, id: id.toString() };
}

export async function updateAddressAction(addressId: string, formData: unknown) {
  const session = await requireAuth();

  const address = await getAddressById(addressId);
  if (!address || address.userId !== session.user.id) return { error: 'Not found' };

  const parsed = addressSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbUpdate(addressId, parsed.data);
  return { success: true };
}

export async function deleteAddressAction(addressId: string) {
  const session = await requireAuth();
  const address = await getAddressById(addressId);
  if (!address || address.userId !== session.user.id) return { error: 'Not found' };
  await dbDelete(addressId);
  return { success: true };
}

export async function setDefaultAddressAction(addressId: string) {
  const session = await requireAuth();
  const address = await getAddressById(addressId);
  if (!address || address.userId !== session.user.id) return { error: 'Not found' };
  await dbSetDefault(addressId);
  return { success: true };
}
