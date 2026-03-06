'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import type { OrderStatus } from '@/lib/types/order';
import { cn } from '@/lib/utils/cn';

const PAGE_SIZE = 25;

type OrderRow = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  company: string;
  product: string;
  qty: number;
  date: string;
  total: number;
  status: string;
};

const STATUS_TABS: { key: OrderStatus | 'All'; label: string }[] = [
  { key: 'All',        label: 'All'        },
  { key: 'Pending',    label: 'Pending'    },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped',    label: 'Shipped'    },
  { key: 'Delivered',  label: 'Delivered'  },
];

export function AdminOrdersClient({ orders }: { orders: OrderRow[] }) {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = orders.filter((o) => {
    const matchStatus = activeStatus === 'All' || o.status === activeStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.company.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleFilterChange = (status: OrderStatus | 'All') => {
    setActiveStatus(status);
    setPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setPage(1);
  };

  const columns = [
    { key: 'id',       header: 'Order ID', className: 'font-mono text-xs text-pbs-gray-500 dark:text-pbs-gray-400' },
    { key: 'customer', header: 'Customer',  render: (o: OrderRow) => (
      <div>
        <p className="font-medium text-pbs-gray-900 dark:text-white">{o.customer}</p>
        <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{o.company}</p>
      </div>
    )},
    { key: 'product',  header: 'Product',   render: (o: OrderRow) => <span className="truncate max-w-[200px] block">{o.product}</span> },
    { key: 'qty',      header: 'Qty',       render: (o: OrderRow) => <span>{o.qty.toLocaleString()}</span> },
    { key: 'date',     header: 'Date',      render: (o: OrderRow) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{o.date}</span> },
    { key: 'total',    header: 'Total',     render: (o: OrderRow) => <span className="font-semibold">${o.total.toLocaleString()}</span> },
    { key: 'status',   header: 'Status',    render: (o: OrderRow) => <StatusBadge status={o.status as OrderStatus} /> },
    { key: 'actions',  header: '',          render: (o: OrderRow) => (
      <Link href={`/admin/orders/${o.id}`} className="text-xs font-medium text-pbs-red hover:underline">View</Link>
    )},
  ];

  return (
    <>
      <AdminHeader title="Orders" subtitle={`${filtered.length} order${filtered.length !== 1 ? 's' : ''} found`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-white dark:bg-pbs-gray-900 border border-pbs-gray-100 dark:border-pbs-gray-800 rounded-2xl p-1">
            {STATUS_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
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

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
            <input
              type="search"
              placeholder="Search orders…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <AdminTable columns={columns as never[]} rows={paginated as never[]} emptyMessage="No orders match your filters." />
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
            <span>
              Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-medium text-pbs-gray-900 dark:text-white">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
