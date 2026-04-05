'use client';

import { useState } from 'react';
import { Search, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { OrderTimeline } from '@/components/account/OrderTimeline';
import { lookupOrder } from '@/lib/actions/tracking';

type TrackedOrder = {
  id: string;
  customer: string;
  product: string;
  size: string;
  qty: number;
  unitPrice: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  trackingNumber?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
};

export default function OrderTrackingPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setNotFound(false);
    setResult(null);

    const order = await lookupOrder(query.trim().toUpperCase());
    if (order) {
      setResult(order as TrackedOrder);
    } else {
      setNotFound(true);
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.06] translate-x-16 -translate-y-16" aria-hidden="true">
          <Package className="h-80 w-80" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/10 mb-5">
            Work Order Tracking
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Track Your Work Order
          </h1>
          <p className="text-white/80 text-base max-w-md leading-relaxed">
            Enter your work order number to see the current status of your custom packaging order.
          </p>
        </div>
      </div>

      {/* Search form */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter work order number (e.g. WO-1021)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" disabled={!query.trim() || searching}>
            {searching ? 'Searching...' : 'Track Work Order'}
          </Button>
        </form>
        <p className="text-xs text-pbs-gray-400 mt-3">
          Your work order number was included in your confirmation email. Format: WO-XXXX
        </p>
      </div>

      {/* Not found */}
      {notFound && (
        <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-8 sm:p-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center">
              <Package className="h-7 w-7 text-pbs-gray-400" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white">Work Order Not Found</h2>
            <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">
              We couldn&apos;t find a work order with that number. Double-check the number and try again, or contact our team for help.
            </p>
          </div>
          <a
            href="https://wa.me/15513893188"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-pbs-red hover:underline"
          >
            Contact us on WhatsApp
          </a>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">
                    {result.id}
                  </h2>
                  <StatusBadge status={result.status} />
                </div>
                <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">
                  Placed on {result.date}
                </p>
              </div>
              <p className="text-2xl font-bold text-pbs-gray-900 dark:text-white">
                ${result.total.toLocaleString()}
              </p>
            </div>

            <OrderTimeline status={result.status} />

            {result.trackingNumber && result.status !== 'Pending' && result.status !== 'Processing' && (
              <div className="mt-6 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800 flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-pbs-gray-400 shrink-0" />
                <span className="text-pbs-gray-500 dark:text-pbs-gray-400">Tracking:</span>
                <span className="font-mono font-semibold text-pbs-gray-900 dark:text-white">
                  {result.trackingNumber}
                </span>
              </div>
            )}
          </div>

          {/* Order details */}
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
            <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">
              Work Order Details
            </h3>

            <div className="flex gap-4 items-start">
              <div className="h-14 w-14 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0 text-2xl">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-pbs-gray-900 dark:text-white">{result.product}</p>
                <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                  Size: {result.size} · Qty: {result.qty.toLocaleString()} units
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-pbs-gray-900 dark:text-white">
                  ${result.total.toLocaleString()}
                </p>
                <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">
                  ${result.unitPrice.toFixed(2)} × {result.qty.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
              <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-3">
                Shipping To
              </p>
              <div className="text-sm text-pbs-gray-600 dark:text-pbs-gray-400 space-y-0.5">
                <p className="font-semibold text-pbs-gray-900 dark:text-white">{result.customer}</p>
                <p>{result.shippingAddress.line1}</p>
                {result.shippingAddress.line2 && <p>{result.shippingAddress.line2}</p>}
                <p>{result.shippingAddress.city}, {result.shippingAddress.state} {result.shippingAddress.zip}</p>
              </div>
            </div>
          </div>

          <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 text-center">
            <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
              Need help with your work order? Reach us at{' '}
              <a
                href="https://wa.me/15513893188"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pbs-red font-medium hover:underline"
              >
                WhatsApp
              </a>{' '}
              or{' '}
              <a
                href="mailto:info@packbrandsolutions.com"
                className="text-pbs-red font-medium hover:underline"
              >
                info@packbrandsolutions.com
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
