import { getStaff } from '@/lib/db/staff';
import { AdminStaffClient } from '@/components/admin/AdminStaffClient';

export default async function StaffPage() {
  const rawStaff = await getStaff();

  const staff = rawStaff.map((s) => ({
    id: s._id.toString(),
    name: s.name,
    role: s.role,
    email: s.email,
    phone: s.phone,
    status: s.status,
    lastActive: new Date(s.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    ordersHandled: s.ordersHandled,
  }));

  return <AdminStaffClient staff={staff} />;
}
