'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCheck,
  Package,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview',   icon: LayoutDashboard },
  { href: '/admin/orders',    label: 'Orders',     icon: ShoppingCart     },
  { href: '/admin/users',     label: 'Customers',  icon: Users            },
  { href: '/admin/staff',     label: 'Staff',      icon: UserCheck        },
  { href: '/admin/products',  label: 'Products',   icon: Package          },
  { href: '/admin/analytics', label: 'Analytics',  icon: BarChart3        },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-pbs-black min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-pbs-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-pbs-red flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight tracking-tight">PACKBRAND</p>
            <p className="text-pbs-gray-500 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 text-[10px] font-bold text-pbs-gray-600 uppercase tracking-widest mb-2">
          Main Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-pbs-red text-white'
                  : 'text-pbs-gray-400 hover:text-white hover:bg-pbs-gray-800',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-pbs-gray-800 space-y-0.5">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-pbs-gray-400 hover:text-white hover:bg-pbs-gray-800 transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
