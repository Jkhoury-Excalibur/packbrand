'use server';

import { createOrder as dbCreateOrder, updateOrder as dbUpdateOrder, getOrderById } from '../db/orders';
import { createOrderSchema, updateOrderSchema } from '../validators';
import { requireAdmin, getSession } from '../auth-helpers';
import { sendEmail } from '../email';
import { escapeHtml } from '../utils/escapeHtml';
import { getSettings } from '../db/settings';

export async function createOrder(formData: unknown) {
  const parsed = createOrderSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const session = await getSession();
  const customerId = session?.user?.id;

  const settings = await getSettings();
  const order = await dbCreateOrder(
    parsed.data,
    customerId,
    settings.taxRate ?? 0,
    settings.shippingRate ?? 49.99,
    settings.freeShippingThreshold ?? 500,
  );

  // Send confirmation email
  const { contact } = parsed.data;
  await sendEmail({
    to: contact.email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Order Confirmed!</h2>
        <p>Hi ${escapeHtml(contact.firstName)},</p>
        <p>Thank you for your order. Here are your details:</p>
        <p><strong>Order Number:</strong> ${escapeHtml(order.orderNumber)}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> ${escapeHtml(order.status)}</p>
        <p>We'll send you an update when your order ships.</p>
        <p style="color: #999; font-size: 12px;">— PackBrand Solutions</p>
      </div>
    `,
  }).catch((err) => {
    console.error('[email] Order confirmation failed:', err);
  });

  return { success: true, orderNumber: order.orderNumber };
}

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
        subject: `Your Order Has Shipped — ${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">Your Order Has Shipped!</h2>
            <p>Hi ${escapeHtml(order.contact.firstName)},</p>
            <p>Your order <strong>${escapeHtml(order.orderNumber)}</strong> is on its way.</p>
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
