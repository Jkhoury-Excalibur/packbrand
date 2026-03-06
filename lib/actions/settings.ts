'use server';

import { updateSettings as dbUpdate } from '../db/settings';
import { settingsSchema } from '../validators';
import { requireAdmin } from '../auth-helpers';

export async function updateSettingsAction(formData: unknown) {
  await requireAdmin();

  const parsed = settingsSchema.partial().safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbUpdate(parsed.data);
  return { success: true };
}
