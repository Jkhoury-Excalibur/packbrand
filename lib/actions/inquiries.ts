'use server';

import { createInquiry as dbCreate } from '../db/inquiries';
import { inquirySchema } from '../validators';
import { sendEmail } from '../email';

export async function submitInquiry(formData: unknown) {
  const parsed = inquirySchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbCreate(parsed.data);

  // Notify admin
  const { type, firstName, lastName, email, businessName } = parsed.data;
  await sendEmail({
    to: 'info@packbrandsolutions.com',
    subject: `New ${type} inquiry from ${firstName} ${lastName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">New Inquiry</h2>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${businessName ? `<p><strong>Business:</strong> ${businessName}</p>` : ''}
        ${parsed.data.message ? `<p><strong>Message:</strong> ${parsed.data.message}</p>` : ''}
      </div>
    `,
  }).catch(() => {});

  return { success: true };
}
