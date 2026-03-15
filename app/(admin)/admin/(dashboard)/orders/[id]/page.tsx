import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/db/orders';
import { AdminOrderDetailClient } from '@/components/admin/AdminOrderDetailClient';

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const serialized = {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    customer: `${order.contact.firstName} ${order.contact.lastName}`,
    company: order.contact.company || '',
    email: order.contact.email,
    phone: order.contact.phone,
    date: new Date(order.createdAt).toLocaleDateString(),
    total: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    status: order.status,
    trackingNumber: order.trackingNumber || '',
    notes: order.notes || '',
    items: order.items,
    shippingAddress: order.shippingAddress,
    paymentStatus: order.paymentStatus || 'pending',
    paymentId: order.paymentId || '',
    paymentAuthCode: order.paymentAuthCode || '',
    paymentMethod: order.paymentMethod || null,
    transactionId: order.transactionId || '',
  };

  return <AdminOrderDetailClient order={serialized} />;
}
