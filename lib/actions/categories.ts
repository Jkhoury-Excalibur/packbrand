'use server';

import {
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  reorderCategories as dbReorderCategories,
} from '../db/categories';
import { categorySchema } from '../validators';
import { requireAdmin } from '../auth-helpers';

export async function createCategoryAction(formData: unknown) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const id = await dbCreateCategory(parsed.data);
  return { success: true, id: id.toString() };
}

export async function updateCategoryAction(categoryId: string, formData: unknown) {
  await requireAdmin();

  const parsed = categorySchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbUpdateCategory(categoryId, parsed.data);
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAdmin();
  await dbDeleteCategory(categoryId);
  return { success: true };
}

export async function reorderCategoriesAction(orderedIds: string[]) {
  await requireAdmin();
  await dbReorderCategories(orderedIds);
  return { success: true };
}
