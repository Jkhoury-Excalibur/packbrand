'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, User, MapPin, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/account',           label: 'Overview',    icon: LayoutDashboard, exact: true  },
  { href: '/account/orders',    label: 'My Orders',   icon: ShoppingCart,    exact: false },
  { href: '/account/profile',   label: 'Profile',     icon: User,            exact: true  },
  { href: '/account/addresses', label: 'Addresses',   icon: MapPin,          exact: true  },
];

export function AccountSidebar() {
  const pathname = usePathname();

  // Strip locale prefix (/es/account → /account)
  const bare = pathname.replace(/^\/(en|es)/, '') || '/';

  return (
    <aside className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-4 h-fit lg:sticky lg:top-24">

      {/* User info */}
      <div className="flex items-center gap-3 px-2 py-3 mb-3 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
        <div className="h-10 w-10 rounded-full bg-pbs-red flex items-center justify-center text-white text-sm font-bold shrink-0">
          ML
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-pbs-gray-900 dark:text-white text-sm truncate">Maria Lopez</p>
          <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 truncate">Go Picadera</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? bare === href : bare.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-pbs-red/10 dark:bg-pbs-red/20 text-pbs-red font-semibold'
                  : 'text-pbs-gray-600 dark:text-pbs-gray-400 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800 hover:text-pbs-gray-900 dark:hover:text-white font-medium',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="mt-3 pt-3 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-pbs-gray-500 dark:text-pbs-gray-400 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800 hover:text-pbs-red transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
