import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_EMAIL || 'do-not-reply@excaliburinteractive.io';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: `PackBrand Solutions <${fromEmail}>`,
    to,
    subject,
    html,
  });
}
