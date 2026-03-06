import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { getStaff } from '@/lib/db/staff';

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[s.role] ?? ''}`}>
        {s.role}
      </span>
    ),
  },
  { key: 'phone',          header: 'Phone',           render: (s: StaffRow) => <span className="text-pbs-gray-600 dark:text-pbs-gray-400">{s.phone}</span> },
  { key: 'ordersHandled',  header: 'Orders Handled',  render: (s: StaffRow) => <span className="font-semibold">{s.ordersHandled}</span> },
  { key: 'lastActive',     header: 'Last Active',     render: (s: StaffRow) => <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{s.lastActive}</span> },
  { key: 'status',         header: 'Status',          render: (s: StaffRow) => <StatusBadge status={s.status as 'Active' | 'Inactive'} /> },
];

export default async function StaffPage() {
  const rawStaff = await getStaff();

  const staff: StaffRow[] = rawStaff.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    role: s.role,
    email: s.email,
    phone: s.phone,
    status: s.status,
    lastActive: new Date(s.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    ordersHandled: s.ordersHandled,
  }));

  const active = staff.filter((s) => s.status === 'Active').length;
  const inactive = staff.filter((s) => s.status === 'Inactive').length;
  const uniqueRoles = new Set(staff.map((s) => s.role)).size;

  return (
    <>
      <AdminHeader title="Staff" subtitle={`${staff.length} team members`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Staff',  value: staff.length },
            { label: 'Active',       value: active },
            { label: 'Inactive',     value: inactive },
            { label: 'Roles',        value: uniqueRoles },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-pbs-gray-900 rounded-2xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-4">
              <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-black text-pbs-gray-900 dark:text-white mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <AdminTable columns={columns as never[]} rows={staff as never[]} />
        </div>

      </main>
    </>
  );
}
