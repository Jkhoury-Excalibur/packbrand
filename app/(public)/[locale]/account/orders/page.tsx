import { requireAuth } from '@/lib/auth-helpers';
import { getUserOrders } from '@/lib/db/orders';
import { OrdersListClient } from '@/components/account/OrdersListClient';

export default async function AccountOrdersPage() {
  const session = await requireAuth();
  const raw = await getUserOrders(session.user.id);

  const orders = raw.map((o) => ({
    id: o.orderNumber,
    product: o.items[0]?.name ?? '—',
    category: o.items[0]?.categoryName ?? '',
    size: o.items[0]?.size ?? '',
    qty: o.items.reduce((sum, i) => sum + i.qty, 0),
    unitPrice: o.items[0]?.unitPrice ?? 0,
    total: o.total,
    date: new Date(o.createdAt).toLocaleDateString(),
    status: o.status,
  }));

  return <OrdersListClient orders={orders} />;
}
