'use server';

import { createProduct as dbCreateProduct, updateProduct as dbUpdateProduct, deleteProduct as dbDeleteProduct } from '../db/products';
import { productSchema } from '../validators';
import { requireAdmin } from '../auth-helpers';

export async function createProductAction(formData: unknown) {
  await requireAdmin();

  const parsed = productSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const id = await dbCreateProduct(parsed.data);
  return { success: true, id: id.toString() };
}

export async function updateProductAction(productId: string, formData: unknown) {
  await requireAdmin();

  const parsed = productSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbUpdateProduct(productId, parsed.data);
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await dbDeleteProduct(productId);
  return { success: true };
}
