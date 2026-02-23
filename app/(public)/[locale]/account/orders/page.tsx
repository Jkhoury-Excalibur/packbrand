'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ACCOUNT_ORDERS } from '@/lib/data/mock-account-orders';
import type { OrderStatus } from '@/lib/data/mock-orders';
import { cn } from '@/lib/utils/cn';

const TABS: { key: OrderStatus | 'All'; label: string }[] = [
  { key: 'All',        label: 'All'        },
  { key: 'Pending',    label: 'Pending'    },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped',    label: 'Shipped'    },
  { key: 'Delivered',  label: 'Delivered'  },
];

export default function AccountOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
  const [reordered, setReordered] = useState<string | null>(null);

  const filtered = activeTab === 'All'
    ? ACCOUNT_ORDERS
    : ACCOUNT_ORDERS.filter((o) => o.status === activeTab);

  const handleReorder = (id: string) => {
    setReordered(id);
    setTimeout(() => setReordered(null), 2500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">My Orders</h1>
        <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">{ACCOUNT_ORDERS.length} orders total</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 bg-white dark:bg-pbs-gray-900 border border-pbs-gray-100 dark:border-pbs-gray-800 rounded-2xl p-1 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-sm font-medium transition-colors',
              activeTab === key
                ? 'bg-pbs-red text-white'
                : 'text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-gray-900 dark:hover:text-white',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Reorder toast */}
      {reordered && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl px-4 py-3 text-sm text-green-800 dark:text-green-300 font-medium">
          ✓ Reorder request for {reordered} submitted — our team will be in touch shortly.
        </div>
      )}

      {/* Orders */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-12 text-center text-pbs-gray-400">
            No orders in this category.
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{order.id}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="font-semibold text-pbs-gray-900 dark:text-white mt-1">{order.product}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-pbs-gray-500 dark:text-pbs-gray-400">
                    <span>Size: {order.size}</span>
                    <span>Qty: {order.qty.toLocaleString()} units</span>
                    <span>Date: {order.date}</span>
                  </div>
                </div>

                {/* Total + actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-lg font-bold text-pbs-gray-900 dark:text-white">${order.total.toLocaleString()}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pbs-gray-600 dark:text-pbs-gray-400 gap-1.5"
                    onClick={() => handleReorder(order.id)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reorder
                  </Button>
                  <Link href={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
