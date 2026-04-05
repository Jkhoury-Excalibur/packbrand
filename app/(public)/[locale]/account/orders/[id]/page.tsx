import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Truck, MapPin, Download } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { OrderTimeline } from '@/components/account/OrderTimeline';
import { requireAuth } from '@/lib/auth-helpers';
import { getOrderById } from '@/lib/db/orders';
import type { OrderStatus } from '@/lib/types/order';

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const session = await requireAuth();
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  // Ownership check: only the customer who placed the order can view it
  if (order.customerId && order.customerId !== session.user.id) notFound();

  const addr = order.shippingAddress;
  const status = order.status as OrderStatus;

  return (
    <div className="space-y-6">

      {/* Back + header */}
      <div>
        <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to Work Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">{order.orderNumber}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">
              Submitted on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <a
            href={`/api/orders/${order._id.toString()}/invoice`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pbs-red text-white text-sm font-medium hover:bg-pbs-red/90 transition-colors shrink-0"
          >
            <Download className="h-4 w-4" /> Download Invoice
          </a>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <h2 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-6">Work Order Status</h2>
        <OrderTimeline status={status} />
        {order.trackingNumber && status !== 'Pending' && status !== 'Processing' && (
          <div className="mt-6 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800 flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-pbs-gray-400 shrink-0" />
            <span className="text-pbs-gray-500 dark:text-pbs-gray-400">Tracking:</span>
            <span className="font-mono font-semibold text-pbs-gray-900 dark:text-white">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Order items */}
        <div className="lg:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
          <h2 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Work Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="h-14 w-14 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0 text-2xl">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-pbs-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                    Size: {item.size} · Qty: {item.qty.toLocaleString()} units
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-pbs-gray-900 dark:text-white">${item.lineTotal.toLocaleString()}</p>
                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                    ${item.unitPrice.toFixed(2)} × {item.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800 space-y-2 text-sm">
            <div className="flex justify-between text-pbs-gray-500 dark:text-pbs-gray-400">
              <span>Subtotal</span><span>${order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-pbs-gray-500 dark:text-pbs-gray-400">
              <span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-pbs-gray-900 dark:text-white text-base pt-2 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
              <span>Total</span><span>${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping info */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
          <h2 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Shipping Info</h2>
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-pbs-red" />
            </div>
            <div className="text-sm space-y-0.5">
              <p className="font-semibold text-pbs-gray-900 dark:text-white">
                {order.contact.firstName} {order.contact.lastName}
              </p>
              {order.contact.company && <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{order.contact.company}</p>}
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.city}, {addr.state} {addr.zip}</p>
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{addr.country}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
