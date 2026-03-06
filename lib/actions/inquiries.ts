'use server';

import { createInquiry as dbCreate } from '../db/inquiries';
import { inquirySchema } from '../validators';
import { sendEmail } from '../email';
import { escapeHtml } from '../utils/escapeHtml';
import { getSettings } from '../db/settings';

export async function submitInquiry(formData: unknown) {
  const parsed = inquirySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbCreate(parsed.data);

  // Notify admin using the configured store email
  const { type, firstName, lastName, email, businessName } = parsed.data;
  const settings = await getSettings();
  await sendEmail({
    to: settings.storeEmail,
    subject: `New ${type} inquiry from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">New Inquiry</h2>
        <p><strong>Type:</strong> ${escapeHtml(type)}</p>
        <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${businessName ? `<p><strong>Business:</strong> ${escapeHtml(businessName)}</p>` : ''}
        ${parsed.data.message ? `<p><strong>Message:</strong> ${escapeHtml(parsed.data.message)}</p>` : ''}
      </div>
    `,
  }).catch((err) => {
    console.error('[email] Inquiry notification failed:', err);
  });

  return { success: true };
}
