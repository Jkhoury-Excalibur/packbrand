'use client';

import { useState } from 'react';
import { Search, Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { StaffFormModal } from '@/components/admin/StaffFormModal';
import { deleteStaffAction } from '@/lib/actions/staff';
import { cn } from '@/lib/utils/cn';

const ROLE_COLORS: Record<string, string> = {
  Owner:       'bg-pbs-gold/20 text-pbs-gold-dark dark:text-pbs-gold',
  Sales:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Fulfillment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Design:      'bg-pbs-red/10 text-pbs-red dark:bg-pbs-red/20',
};

type StaffRow = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  lastActive: string;
  ordersHandled: number;
};

export function AdminStaffClient({ staff }: { staff: StaffRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [modalStaff, setModalStaff] = useState<StaffRow | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = staff.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
  });

  const active = staff.filter((s) => s.status === 'Active').length;
  const inactive = staff.filter((s) => s.status === 'Inactive').length;
  const uniqueRoles = new Set(staff.map((s) => s.role)).size;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    setDeleting(id);
    await deleteStaffAction(id);
    router.refresh();
    setDeleting(null);
  };

  const columns = [
    {
      key: 'name', header: 'Staff Member',
      render: (s: StaffRow) => (
        <div>
          <p className="font-semibold text-pbs-gray-900 dark:text-white">{s.name}</p>
          <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{s.email}</p>
        </div>
      ),
    },
    {
      key: 'role', header: 'Role',
      render: (s: StaffRow) => (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', ROLE_COLORS[s.role] ?? '')}>
          {s.role}
        </span>
      ),
    },
    { key: 'phone', header: 'Phone', render: (s: StaffRow) => <span className="text-pbs-gray-600 dark:text-pbs-gray-400">{s.phone}</span> },
    { key: 'ordersHandled', header: 'Orders Handled', render: (s: StaffRow) => <span className="font-semibold">{s.ordersHandled}</span> },
    { key: 'lastActive', header: 'Last Active', render: (s: StaffRow) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{s.lastActive}</span> },
    { key: 'status', header: 'Status', render: (s: StaffRow) => <StatusBadge status={s.status as 'Active' | 'Inactive'} /> },
    {
      key: 'actions', header: '',
      render: (s: StaffRow) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModalStaff(s)}
            className="p-1.5 rounded-lg text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(s.id)}
            disabled={deleting === s.id}
            className="p-1.5 rounded-lg text-pbs-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Staff" subtitle={`${staff.length} team member${staff.length !== 1 ? 's' : ''}`} />

      <div className="px-6 pt-6">
        <Button variant="primary" size="sm" className="gap-2" onClick={() => setModalStaff(null)}>
          <Plus className="h-4 w-4" /> Add Staff
        </Button>
      </div>

      <main className="flex-1 p-6 space-y-5 overflow-auto">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Staff', value: staff.length },
            { label: 'Active', value: active },
            { label: 'Inactive', value: inactive },
            { label: 'Roles', value: uniqueRoles },
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
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-pbs-gray-400">
              <Users className="h-10 w-10 mb-3" strokeWidth={1} />
              <p className="text-sm">No staff members found.</p>
            </div>
          ) : (
            <AdminTable columns={columns as never[]} rows={filtered as never[]} />
          )}
        </div>
      </main>

      {/* Modal — null = new, object = edit, undefined = closed */}
      {modalStaff !== undefined && (
        <StaffFormModal
          staff={modalStaff ? { id: modalStaff.id, name: modalStaff.name, email: modalStaff.email, phone: modalStaff.phone, role: modalStaff.role, status: modalStaff.status } : null}
          onClose={() => setModalStaff(undefined)}
          onSaved={() => { setModalStaff(undefined); router.refresh(); }}
        />
      )}
    </>
  );
}
