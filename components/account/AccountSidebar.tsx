'use client';

import { Link, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { authClient } from '@/lib/auth-client';

export function AccountSidebar({ name, email, isAdmin }: { name: string; email: string; isAdmin: boolean }) {
  const router = useRouter();
  const es = useLocale() === 'es';
  return <aside className="bg-white dark:bg-pbs-gray-900 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-800 p-5 space-y-4">
    <div><p className="font-semibold break-words">{name}</p><p className="text-xs text-pbs-gray-500 break-all mt-1">{email}</p></div>
    <nav className="flex flex-col gap-4 text-sm"><Link href="/account" className="font-semibold text-pbs-red">{es ? 'Historial de pedidos' : 'Order history'}</Link>
      {isAdmin && <Link href="/admin/users">{es ? 'Administrar usuarios' : 'User management'}</Link>}
    </nav>
    <button className="text-sm text-pbs-gray-500" onClick={async () => { await authClient.signOut(); router.push('/login'); router.refresh(); }}>{es ? 'Cerrar sesión' : 'Sign out'}</button>
  </aside>;
}
