'use server';

import { getOrderById } from '../db/orders';

export async function lookupOrder(orderNumber: string) {
  const order = await getOrderById(orderNumber);
  if (!order) return null;

  return {
    id: order.orderNumber,
    customer: `${order.contact.firstName} ${order.contact.lastName}`,
    email: order.contact.email,
    product: order.items[0]?.name ?? '',
    size: order.items[0]?.size ?? '',
    qty: order.items[0]?.qty ?? 0,
    unitPrice: order.items[0]?.unitPrice ?? 0,
    total: order.total,
    status: order.status as 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled',
    date: order.createdAt.toISOString().split('T')[0],
    trackingNumber: order.trackingNumber,
    shippingAddress: order.shippingAddress,
  };
}
