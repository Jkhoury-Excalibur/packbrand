import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, RotateCcw, Truck, MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { OrderTimeline } from '@/components/account/OrderTimeline';
import { Button } from '@/components/ui/Button';
import { ACCOUNT_ORDERS } from '@/lib/data/mock-account-orders';

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return ACCOUNT_ORDERS.map((o) => ({ id: o.id }));
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = ACCOUNT_ORDERS.find((o) => o.id === id);
  if (!order) notFound();

  return (
    <div className="space-y-6">

      {/* Back + header */}
      <div>
        <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">{order.id}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Placed on {order.date}</p>
          </div>
          <Link href="/account/orders">
            <Button variant="primary" size="md" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reorder
            </Button>
          </Link>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <h2 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-6">Order Status</h2>
        <OrderTimeline status={order.status} />
        {order.trackingNumber && order.status !== 'Pending' && order.status !== 'Processing' && (
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
          <h2 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Order Items</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="h-14 w-14 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0 text-2xl">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-pbs-gray-900 dark:text-white">{order.product}</p>
                <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                  Size: {order.size} · Qty: {order.qty.toLocaleString()} units
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-pbs-gray-900 dark:text-white">${order.total.toLocaleString()}</p>
                <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                  ${order.unitPrice.toFixed(2)} × {order.qty}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800 space-y-2 text-sm">
            <div className="flex justify-between text-pbs-gray-500 dark:text-pbs-gray-400">
              <span>Subtotal</span><span>${order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-pbs-gray-500 dark:text-pbs-gray-400">
              <span>Shipping</span><span>Free</span>
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
              <p className="font-semibold text-pbs-gray-900 dark:text-white">Maria Lopez</p>
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">Go Picadera</p>
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">22 Ward Street</p>
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">Hackensack, NJ 07601</p>
              <p className="text-pbs-gray-500 dark:text-pbs-gray-400">United States</p>
            </div>
          </div>

          {order.estimatedDelivery && (
            <div className="mt-5 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
              <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-1">
                {order.status === 'Delivered' ? 'Delivered On' : 'Est. Delivery'}
              </p>
              <p className="font-semibold text-pbs-gray-900 dark:text-white text-sm">{order.estimatedDelivery}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
