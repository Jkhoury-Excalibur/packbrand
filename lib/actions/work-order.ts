'use server';

import { checkoutSchema } from '../validators';
import { getSession } from '../auth-helpers';
import { getSettings } from '../db/settings';
import { updateCartSubmission, markCartCompleted } from '../db/carts';
import { createOrder } from '../db/orders';
import { sendEmail } from '../email';
import { escapeHtml } from '../utils/escapeHtml';

export async function submitWorkOrder(formData: unknown) {
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { cartId, contact, shippingAddress, items, specialInstructions } = parsed.data;

  const session = await getSession();
  const customerId = session?.user?.id;

  const settings = await getSettings();
  const taxRate = settings.taxRate ?? 0;
  const shippingRate = settings.shippingRate ?? 49.99;
  const freeShippingThreshold = settings.freeShippingThreshold ?? 500;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shipping + tax;

  // Save submission data to cart
  await updateCartSubmission(cartId, {
    contact,
    shippingAddress,
    specialInstructions,
    items,
    subtotal,
    shipping,
    tax,
    total,
    customerId,
  });

  // Create work order directly
  const order = await createOrder(
    { contact, shippingAddress, items, specialInstructions },
    customerId,
    taxRate,
    shippingRate,
    freeShippingThreshold,
  );

  // Mark cart completed
  await markCartCompleted(cartId, order.orderNumber);

  // Build items table for emails
  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;">${escapeHtml(item.name)}${item.size !== 'Standard' ? ` (${escapeHtml(item.size)})` : ''}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">$${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>`
    )
    .join('');

  const itemsTable = `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:8px 12px;text-align:left;">Item</th>
          <th style="padding:8px 12px;text-align:center;">Qty</th>
          <th style="padding:8px 12px;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr><td colspan="2" style="padding:6px 12px;text-align:right;font-weight:bold;">Subtotal</td><td style="padding:6px 12px;text-align:right;">$${order.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td colspan="2" style="padding:6px 12px;text-align:right;">Shipping</td><td style="padding:6px 12px;text-align:right;">${order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</td></tr>
        ${order.tax > 0 ? `<tr><td colspan="2" style="padding:6px 12px;text-align:right;">Tax</td><td style="padding:6px 12px;text-align:right;">$${order.tax.toFixed(2)}</td></tr>` : ''}
        <tr><td colspan="2" style="padding:6px 12px;text-align:right;font-weight:bold;border-top:2px solid #333;">Total</td><td style="padding:6px 12px;text-align:right;font-weight:bold;border-top:2px solid #333;">$${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
      </tfoot>
    </table>
  `;

  // Send emails (don't block response on email failures)
  await Promise.allSettled([
    // Customer confirmation
    sendEmail({
      to: contact.email,
      subject: `Work Order Received — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1a1a1a;">Work Order Received!</h2>
          <p>Hi ${escapeHtml(contact.firstName)},</p>
          <p>Thank you for submitting your work order <strong>${escapeHtml(order.orderNumber)}</strong>. Our team will review your order and reach out to you shortly.</p>
          ${itemsTable}
          ${specialInstructions ? `<p style="margin-top:16px;"><strong>Special Instructions:</strong> ${escapeHtml(specialInstructions)}</p>` : ''}
          <p style="margin-top:24px;">We'll be in touch soon to discuss the details and next steps.</p>
          <p style="color:#999;font-size:12px;">— PackBrand Solutions</p>
        </div>
      `,
    }),
    // Admin/client notification
    sendEmail({
      to: settings.storeEmail,
      subject: `New Work Order — ${order.orderNumber}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1a1a1a;">New Work Order Submitted</h2>
          <p><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
          <p><strong>Customer:</strong> ${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(contact.phone)}</p>
          ${contact.company ? `<p><strong>Company:</strong> ${escapeHtml(contact.company)}</p>` : ''}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
          <h3 style="color:#333;">Shipping Address</h3>
          <p>${escapeHtml(shippingAddress.line1)}${shippingAddress.line2 ? `<br/>${escapeHtml(shippingAddress.line2)}` : ''}<br/>${escapeHtml(shippingAddress.city)}, ${escapeHtml(shippingAddress.state)} ${escapeHtml(shippingAddress.zip)}<br/>${escapeHtml(shippingAddress.country)}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
          <h3 style="color:#333;">Items</h3>
          ${itemsTable}
          ${specialInstructions ? `<hr style="border:none;border-top:1px solid #eee;margin:16px 0;" /><h3 style="color:#333;">Special Instructions</h3><p>${escapeHtml(specialInstructions)}</p>` : ''}
        </div>
      `,
    }),
  ]);

  return {
    success: true,
    orderNumber: order.orderNumber,
  };
}
