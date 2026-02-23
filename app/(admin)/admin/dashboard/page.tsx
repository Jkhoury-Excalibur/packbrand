import { ShoppingCart, DollarSign, Users, Package, ArrowRight, Plus, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/Button';
import { MOCK_ORDERS } from '@/lib/data/mock-orders';
import { ALL_PRODUCTS } from '@/lib/data/products';

const recentOrders = MOCK_ORDERS.slice(0, 5);

const topProducts = [
  { name: 'Custom Printed Coffee Cups', orders: 34, pct: 100 },
  { name: 'Cold Beverage Cups',         orders: 28, pct: 82  },
  { name: 'Custom Pizza Boxes',         orders: 22, pct: 65  },
  { name: 'Kraft Paper Bags',           orders: 18, pct: 53  },
  { name: 'Custom Food Bowls',          orders: 14, pct: 41  },
];

export default function DashboardPage() {
  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <AdminHeader title="Overview" subtitle="Welcome back, Rafael" />

      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Orders"
            value={String(MOCK_ORDERS.length)}
            trend="+12% vs last month"
            trendUp
            icon={ShoppingCart}
          />
          <StatCard
            title="Revenue (MTD)"
            value={`$${totalRevenue.toLocaleString()}`}
            trend="+8% vs last month"
            trendUp
            icon={DollarSign}
            iconBg="bg-green-100 dark:bg-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
          />
          <StatCard
            title="Active Customers"
            value="10"
            trend="+3 new this month"
            trendUp
            icon={Users}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            title="Products Listed"
            value={String(ALL_PRODUCTS.length)}
            icon={Package}
            iconBg="bg-pbs-gold/20"
            iconColor="text-pbs-gold-dark"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Orders */}
          <div className="xl:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Recent Orders</h2>
              <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-medium text-pbs-red hover:gap-2 transition-all">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pbs-gray-100 dark:border-pbs-gray-800">
                    {['Order ID', 'Customer', 'Product', 'Total', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{order.id}</td>
                      <td className="px-6 py-3.5 font-medium text-pbs-gray-900 dark:text-white">{order.customer}</td>
                      <td className="px-6 py-3.5 text-pbs-gray-600 dark:text-pbs-gray-400 max-w-[160px] truncate">{order.product}</td>
                      <td className="px-6 py-3.5 font-semibold text-pbs-gray-900 dark:text-white">${order.total.toLocaleString()}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">

            {/* Quick Actions */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2.5">
                <Link href="/admin/orders" className="block">
                  <Button variant="primary" size="sm" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" /> New Order
                  </Button>
                </Link>
                <Link href="/admin/products" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" /> New Product
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-pbs-gray-600 dark:text-pbs-gray-400">
                  <Download className="h-4 w-4" /> Export Report
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-pbs-gray-600 dark:text-pbs-gray-400">
                  <FileText className="h-4 w-4" /> View Invoices
                </Button>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 flex-1">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-4">Top Products</h2>
              <div className="space-y-3.5">
                {topProducts.map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-pbs-gray-700 dark:text-pbs-gray-300 truncate pr-2">{p.name}</span>
                      <span className="shrink-0 text-pbs-gray-500 dark:text-pbs-gray-400">{p.orders} orders</span>
                    </div>
                    <div className="h-1.5 bg-pbs-gray-100 dark:bg-pbs-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pbs-red rounded-full" style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
