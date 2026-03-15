'use server';

import { createOrder as dbCreateOrder } from '../db/orders';
import { createOrderSchema } from '../validators';
import { getSession } from '../auth-helpers';
import { getSettings } from '../db/settings';
import { initiatePayment, generateWebhookToken } from '../payment/enhanced-gateway';

export async function createOrderAndInitiatePayment(formData: unknown) {
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

  // Build webhook URL with HMAC token
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://packbrandsolutions.com';
  const webhookToken = generateWebhookToken(order.transactionId);
  const webhookUrl = webhookToken
    ? `${baseUrl}/api/webhooks/payment?token=${webhookToken}`
    : `${baseUrl}/api/webhooks/payment`;

  // Build success/failure redirect URLs
  const successUrl = `${baseUrl}/checkout/payment-complete?order=${order.orderNumber}`;
  const failureUrl = `${baseUrl}/checkout/payment-complete?order=${order.orderNumber}&error=failed`;

  const paymentResult = await initiatePayment({
    transactionId: order.transactionId,
    amount: order.total,
    webhookUrl,
    successUrl,
    failureUrl,
  });

  if (!paymentResult.success) {
    return { error: { payment: [paymentResult.error || 'Payment initialization failed'] } };
  }

  return {
    success: true,
    orderNumber: order.orderNumber,
    iframeUrl: paymentResult.iframeUrl,
  };
}
