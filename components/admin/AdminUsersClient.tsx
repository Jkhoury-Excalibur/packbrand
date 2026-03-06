'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';

type UserRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
};

type UserStats = {
  total: number;
  verified: number;
  admins: number;
  customers: number;
};

export function AdminUsersClient({ users, stats }: { users: UserRow[]; stats: UserStats }) {
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'name', header: 'Customer',
      render: (u: UserRow) => (
        <div>
          <p className="font-semibold text-pbs-gray-900 dark:text-white">{u.name}</p>
          <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{u.email}</p>
        </div>
      ),
    },
    { key: 'company', header: 'Company', render: (u: UserRow) => <span className="font-medium">{u.company || '—'}</span> },
    {
      key: 'role', header: 'Role',
      render: (u: UserRow) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          u.role === 'admin' ? 'bg-pbs-red/10 text-pbs-red dark:bg-pbs-red/20' : 'bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-700 dark:text-pbs-gray-300'
        }`}>
          {u.role === 'admin' ? 'Admin' : 'Customer'}
        </span>
      ),
    },
    {
      key: 'verified', header: 'Verified',
      render: (u: UserRow) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          u.emailVerified ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-pbs-gray-100 text-pbs-gray-500 dark:bg-pbs-gray-800'
        }`}>
          {u.emailVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Joined', render: (u: UserRow) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{u.createdAt}</span> },
  ];

  return (
    <>
      <AdminHeader title="Customers" subtitle={`${filtered.length} customer${filtered.length !== 1 ? 's' : ''}`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.total },
            { label: 'Verified', value: stats.verified },
            { label: 'Customers', value: stats.customers },
            { label: 'Admins', value: stats.admins },
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
          <AdminTable columns={columns as never[]} rows={filtered as never[]} emptyMessage="No customers found." />
        </div>

      </main>
    </>
  );
}
