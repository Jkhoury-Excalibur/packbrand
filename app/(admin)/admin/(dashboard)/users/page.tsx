import { getUsers, getUserStats } from '@/lib/db/users';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';

export default async function UsersPage() {
  const [rawUsers, stats] = await Promise.all([getUsers(), getUserStats()]);

  const users = rawUsers.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    company: u.company ?? '',
    role: u.role ?? 'customer',
    emailVerified: u.emailVerified,
    createdAt: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  return <AdminUsersClient users={users} stats={stats} />;
}
