'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MOCK_USERS, type MockUser } from '@/lib/data/mock-users';

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'name', header: 'Customer',
      render: (u: MockUser) => (
        <div>
          <p className="font-semibold text-pbs-gray-900 dark:text-white">{u.name}</p>
          <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{u.email}</p>
        </div>
      ),
    },
    { key: 'company',      header: 'Company',       render: (u: MockUser) => <span className="font-medium">{u.company}</span> },
    { key: 'totalOrders',  header: 'Orders',        render: (u: MockUser) => <span>{u.totalOrders}</span> },
    { key: 'totalSpend',   header: 'Total Spend',   render: (u: MockUser) => <span className="font-semibold">${u.totalSpend.toLocaleString()}</span> },
    { key: 'lastOrder',    header: 'Last Order',    render: (u: MockUser) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{u.lastOrder}</span> },
    { key: 'status',       header: 'Status',        render: (u: MockUser) => <StatusBadge status={u.status} /> },
    { key: 'actions',      header: '',              render: () => <button className="text-xs font-medium text-pbs-red hover:underline">View</button> },
  ];

  return (
    <>
      <AdminHeader title="Customers" subtitle={`${filtered.length} customer${filtered.length !== 1 ? 's' : ''}`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: MOCK_USERS.length },
            { label: 'Active',          value: MOCK_USERS.filter((u) => u.status === 'Active').length },
            { label: 'Inactive',        value: MOCK_USERS.filter((u) => u.status === 'Inactive').length },
            { label: 'Total Revenue',   value: `$${MOCK_USERS.reduce((s, u) => s + u.totalSpend, 0).toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-pbs-gray-900 rounded-2xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-4">
              <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-black text-pbs-gray-900 dark:text-white mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
          <input
            type="search"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <AdminTable columns={columns as any} rows={filtered as any} emptyMessage="No customers found." />
        </div>

      </main>
    </>
  );
}
