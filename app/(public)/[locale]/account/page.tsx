import { ArrowRight, ShoppingCart, User, MapPin, MessageCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ACCOUNT_ORDERS } from '@/lib/data/mock-account-orders';

const recentOrders = ACCOUNT_ORDERS.slice(0, 3);
const totalSpend   = ACCOUNT_ORDERS.reduce((s, o) => s + o.total, 0);

const quickLinks = [
  { href: '/account/orders',    label: 'View All Orders',     icon: ShoppingCart, desc: `${ACCOUNT_ORDERS.length} orders placed`          },
  { href: '/account/profile',   label: 'Edit Profile',        icon: User,         desc: 'Update your info'                                 },
  { href: '/account/addresses', label: 'Manage Addresses',    icon: MapPin,       desc: '2 saved addresses'                                },
  { href: '/contact',           label: 'Contact Support',     icon: MessageCircle, desc: 'We reply within 24h'                             },
];

export default function AccountOverviewPage() {
  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.07] translate-x-8 -translate-y-8" aria-hidden="true">
          <Package className="h-48 w-48" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight">Maria Lopez</h1>
          <p className="text-white/70 mt-1">Go Picadera · Member since July 2025</p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/15">
          {[
            { label: 'Total Orders',  value: String(ACCOUNT_ORDERS.length) },
            { label: 'Total Spent',   value: `$${totalSpend.toLocaleString()}` },
            { label: 'Last Order',    value: ACCOUNT_ORDERS[0]?.date ?? '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white/60 text-xs font-medium">{label}</p>
              <p className="text-white font-bold text-lg mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/account/orders" className="flex items-center gap-1 text-xs font-medium text-pbs-red hover:gap-2 transition-all">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pbs-gray-100 dark:border-pbs-gray-800">
                {['Order', 'Product', 'Date', 'Total', 'Status', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{order.id}</td>
                  <td className="px-6 py-3.5 font-medium text-pbs-gray-900 dark:text-white max-w-[180px] truncate">{order.product}</td>
                  <td className="px-6 py-3.5 text-pbs-gray-500 dark:text-pbs-gray-400">{order.date}</td>
                  <td className="px-6 py-3.5 font-semibold text-pbs-gray-900 dark:text-white">${order.total.toLocaleString()}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-3.5">
                    <Link href={`/account/orders/${order.id}`} className="text-xs font-medium text-pbs-red hover:underline whitespace-nowrap">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white dark:bg-pbs-gray-900 rounded-2xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-5 flex items-center gap-4 hover:border-pbs-red hover:shadow-md transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center shrink-0 group-hover:bg-pbs-red transition-colors duration-200">
              <Icon className="h-5 w-5 text-pbs-red group-hover:text-white transition-colors duration-200" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-pbs-gray-900 dark:text-white text-sm">{label}</p>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-pbs-gray-300 dark:text-pbs-gray-600 group-hover:text-pbs-red group-hover:translate-x-1 transition-all ml-auto shrink-0" />
          </Link>
        ))}
      </div>

    </div>
  );
}
