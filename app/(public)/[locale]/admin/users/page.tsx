import { requireAdmin } from '@/lib/auth-helpers';
import { listUsers } from '@/lib/db/users';
import { AdminUsersClient } from '@/components/admin/AdminUsersClient';
import { Link } from '@/i18n/navigation';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const session = await requireAdmin();
  const query = await searchParams;
  const search = (query.q || '').slice(0, 200);
  const page = Math.max(1, Math.min(10000, Number.parseInt(query.page || '1', 10) || 1));
  const { users, total } = await listUsers(search, page);
  return <div className="space-y-6">
    <div><h1 className="text-3xl font-bold">User management</h1><p className="text-pbs-gray-500 mt-2">Manage website accounts and admin access.</p></div>
    <form className="flex gap-3"><input aria-label="Search users" name="q" defaultValue={search} placeholder="Search name, email, or company" className="border rounded-xl p-3 bg-transparent flex-1" /><button className="bg-pbs-red text-white rounded-xl px-5">Search</button></form>
    <AdminUsersClient users={users} currentUserId={session.user.id} />
    <div className="flex gap-5 items-center text-sm"><span>{total} users · Page {page}</span>
      {page > 1 && <Link href={{ pathname: '/admin/users', query: { q: search, page: page - 1 } }}>Previous</Link>}
      {page * 25 < total && <Link href={{ pathname: '/admin/users', query: { q: search, page: page + 1 } }}>Next</Link>}
    </div>
  </div>;
}
