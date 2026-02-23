'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MOCK_ORDERS, type Order, type OrderStatus } from '@/lib/data/mock-orders';
import { cn } from '@/lib/utils/cn';

const STATUS_TABS: { key: OrderStatus | 'All'; label: string }[] = [
  { key: 'All',        label: 'All'        },
  { key: 'Pending',    label: 'Pending'    },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped',    label: 'Shipped'    },
  { key: 'Delivered',  label: 'Delivered'  },
];

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchStatus = activeStatus === 'All' || o.status === activeStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.company.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const columns = [
    { key: 'id',       header: 'Order ID', className: 'font-mono text-xs text-pbs-gray-500 dark:text-pbs-gray-400' },
    { key: 'customer', header: 'Customer',  render: (o: Order) => (
      <div>
        <p className="font-medium text-pbs-gray-900 dark:text-white">{o.customer}</p>
        <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{o.company}</p>
      </div>
    )},
    { key: 'product',  header: 'Product',   render: (o: Order) => <span className="truncate max-w-[200px] block">{o.product}</span> },
    { key: 'qty',      header: 'Qty',       render: (o: Order) => <span>{o.qty.toLocaleString()}</span> },
    { key: 'date',     header: 'Date',      render: (o: Order) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{o.date}</span> },
    { key: 'total',    header: 'Total',     render: (o: Order) => <span className="font-semibold">${o.total.toLocaleString()}</span> },
    { key: 'status',   header: 'Status',    render: (o: Order) => <StatusBadge status={o.status} /> },
    { key: 'actions',  header: '',          render: () => (
      <button className="text-xs font-medium text-pbs-red hover:underline">View</button>
    )},
  ];

  return (
    <>
      <AdminHeader title="Orders" subtitle={`${filtered.length} order${filtered.length !== 1 ? 's' : ''} found`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status tabs */}
          <div className="flex gap-1 bg-white dark:bg-pbs-gray-900 border border-pbs-gray-100 dark:border-pbs-gray-800 rounded-2xl p-1">
            {STATUS_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveStatus(key)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-sm font-medium transition-colors',
                  activeStatus === key
                    ? 'bg-pbs-red text-white'
                    : 'text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-gray-900 dark:hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
            <input
              type="search"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm font-medium text-pbs-gray-600 dark:text-pbs-gray-400 hover:border-pbs-red hover:text-pbs-red transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <AdminTable columns={columns as any} rows={filtered as any} emptyMessage="No orders match your filters." />
        </div>

      </main>
    </>
  );
}
