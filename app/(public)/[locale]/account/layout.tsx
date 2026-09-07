import { AccountSidebar } from '@/components/account/AccountSidebar';
import { requireAuth } from '@/lib/auth-helpers';
import { findUser } from '@/lib/db/users';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  const user = await findUser(session.user.id);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
        <AccountSidebar name={user?.name || session.user.name} email={user?.email || session.user.email} isAdmin={user?.role === 'admin' && user?.emailVerified === true} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
