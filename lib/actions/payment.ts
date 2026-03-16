'use server';

import { checkoutSchema } from '../validators';
import { getSession } from '../auth-helpers';
import { getSettings } from '../db/settings';
import { updateCartCheckout } from '../db/carts';
import { generateTransactionId } from '../utils/transaction';
import { initiatePayment, generateWebhookToken } from '../payment/enhanced-gateway';

export async function initiateCheckoutPayment(formData: unknown) {
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { cartId, contact, shippingAddress, items, specialInstructions } = parsed.data;

  const session = await getSession();
  const customerId = session?.user?.id;

  // Compute totals
  const settings = await getSettings();
  const taxRate = settings.taxRate ?? 0;
  const shippingRate = settings.shippingRate ?? 49.99;
  const freeShippingThreshold = settings.freeShippingThreshold ?? 500;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shipping + tax;

  const transactionId = generateTransactionId();

  // Save checkout data to cart doc
  await updateCartCheckout(cartId, {
    contact,
    shippingAddress,
    specialInstructions,
    items,
    subtotal,
    shipping,
    tax,
    total,
    transactionId,
    customerId,
  });

  // Build webhook URL with HMAC token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://packbrandsolutions.com';
  const webhookToken = generateWebhookToken(transactionId);
  const webhookUrl = webhookToken
    ? `${baseUrl}/api/webhooks/payment?token=${webhookToken}`
    : `${baseUrl}/api/webhooks/payment`;

  const successUrl = `${baseUrl}/checkout/payment-complete?session=${cartId}`;
  const failureUrl = `${baseUrl}/checkout/payment-complete?session=${cartId}&error=failed`;

  console.log('[payment] ===== INITIATING PAYMENT =====');
  console.log('[payment] CartId:', cartId);
  console.log('[payment] TransactionId:', transactionId);
  console.log('[payment] Amount:', total);
  console.log('[payment] WebhookUrl:', webhookUrl);

  const paymentResult = await initiatePayment({
    transactionId,
    amount: total,
    webhookUrl,
    successUrl,
    failureUrl,
  });

  console.log('[payment] Gateway response:', JSON.stringify(paymentResult, null, 2));

  if (!paymentResult.success) {
    return { error: { payment: [paymentResult.error || 'Payment initialization failed'] } };
  }

  return {
    success: true,
    cartId,
    iframeUrl: paymentResult.iframeUrl,
  };
}
