import { getOrders } from '@/lib/db/orders';
import { AdminOrdersClient } from '@/components/admin/AdminOrdersClient';

export default async function OrdersPage() {
  const raw = await getOrders();

  const orders = raw.map((o) => ({
    id: o.orderNumber,
    customer: `${o.contact.firstName} ${o.contact.lastName}`,
    email: o.contact.email,
    phone: o.contact.phone,
    company: o.contact.company || '',
    product: o.items[0]?.name ?? '—',
    category: o.items[0]?.categoryName ?? '',
    size: o.items[0]?.size ?? '',
    qty: o.items.reduce((sum, i) => sum + i.qty, 0),
    unitPrice: o.items[0]?.unitPrice ?? 0,
    date: new Date(o.createdAt).toLocaleDateString(),
    total: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus || 'pending',
  }));

  return <AdminOrdersClient orders={orders} />;
}
