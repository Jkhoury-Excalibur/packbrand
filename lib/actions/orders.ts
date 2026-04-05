'use server';

import { updateOrder as dbUpdateOrder, getOrderById } from '../db/orders';
import { updateOrderSchema } from '../validators';
import { requireAdmin } from '../auth-helpers';
import { sendEmail } from '../email';
import { escapeHtml } from '../utils/escapeHtml';

export async function updateOrderAction(orderId: string, formData: unknown) {
  await requireAdmin();

  const parsed = updateOrderSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await dbUpdateOrder(orderId, parsed.data);

  // Send shipping email if status changed to Shipped
  if (parsed.data.status === 'Shipped') {
    const order = await getOrderById(orderId);
    if (order) {
      await sendEmail({
        to: order.contact.email,
        subject: `Your Work Order Has Shipped — ${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Your Work Order Has Shipped!</h2>
            <p>Hi ${escapeHtml(order.contact.firstName)},</p>
            <p>Your work order <strong>${escapeHtml(order.orderNumber)}</strong> is on its way.</p>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${escapeHtml(order.trackingNumber)}</p>` : ''}
            <p>Thank you for choosing PackBrand Solutions!</p>
            <p style="color: #999; font-size: 12px;">— PackBrand Solutions</p>
          </div>
        `,
      }).catch((err) => {
        console.error('[email] Shipping notification failed:', err);
      });
    }
  }

  return { success: true };
}
