'use server';

import { requireAdmin } from '../auth-helpers';
import { getOrderById, updateOrder } from '../db/orders';
import { voidTransaction, refundTransaction } from '../payment/enhanced-gateway';

export async function voidOrderPayment(orderId: string) {
  await requireAdmin();

  const order = await getOrderById(orderId);
  if (!order || !order.paymentId) {
    return { error: 'Order not found or no payment to void' };
  }
  if (order.paymentStatus !== 'paid') {
    return { error: 'Can only void paid orders' };
  }

  const result = await voidTransaction(order.paymentId);
  if (result.success) {
    await updateOrder(order._id.toString(), { paymentStatus: 'voided', status: 'Cancelled' });
    return { success: true };
  }
  return { error: result.error || 'Void failed' };
}

export async function refundOrderPayment(orderId: string, amount?: number) {
  await requireAdmin();

  const order = await getOrderById(orderId);
  if (!order || !order.paymentId) {
    return { error: 'Order not found or no payment to refund' };
  }
  if (order.paymentStatus !== 'paid') {
    return { error: 'Can only refund paid orders' };
  }

  const refundAmount = amount ?? order.total;
  const result = await refundTransaction({
    gatewayTransactionId: order.paymentId,
    amount: refundAmount,
    reason: `Refund ${order.orderNumber}`,
  });

  if (result.success) {
    await updateOrder(order._id.toString(), { paymentStatus: 'refunded' });
    return { success: true, refundId: result.refundId };
  }
  return { error: result.error || 'Refund failed' };
}
