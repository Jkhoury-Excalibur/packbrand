import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { MOCK_ORDERS } from '@/lib/data/mock-orders';

const MONTHLY_REVENUE = [
  { month: 'Mar', value: 4200 },
  { month: 'Apr', value: 5100 },
  { month: 'May', value: 4800 },
  { month: 'Jun', value: 6300 },
  { month: 'Jul', value: 5900 },
  { month: 'Aug', value: 7200 },
  { month: 'Sep', value: 6800 },
  { month: 'Oct', value: 8100 },
  { month: 'Nov', value: 9400 },
  { month: 'Dec', value: 11200 },
  { month: 'Jan', value: 9800 },
  { month: 'Feb', value: 12600 },
];

const BY_CATEGORY = [
  { label: 'Cups',             orders: 62, pct: 100 },
  { label: 'Bags',             orders: 34, pct: 55  },
  { label: 'Boxes',            orders: 28, pct: 45  },
  { label: 'Food Containers',  orders: 24, pct: 39  },
  { label: 'Labels',           orders: 18, pct: 29  },
];

const TOP_PRODUCTS = [
  { name: 'Custom Printed Coffee Cups', revenue: 14880, orders: 34 },
  { name: 'Cold Beverage Cups',         revenue: 12320, orders: 28 },
  { name: 'Custom Pizza Boxes',         revenue: 10150, orders: 22 },
  { name: 'Kraft Paper Bags',           revenue: 6840,  orders: 18 },
  { name: 'Custom Food Bowls',          revenue: 5340,  orders: 14 },
];

const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.value));
const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
const avgOrder = Math.round(totalRevenue / MOCK_ORDERS.length);

export default function AnalyticsPage() {
  return (
    <>
      <AdminHeader title="Analytics" subtitle="Last 12 months" />

      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Revenue"        value={`$${totalRevenue.toLocaleString()}`}  trend="+21% YoY" trendUp icon={DollarSign} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
          <StatCard title="Total Orders"         value={String(MOCK_ORDERS.length)}            trend="+12% YoY" trendUp icon={ShoppingCart} />
          <StatCard title="Avg. Order Value"     value={`$${avgOrder}`}                        trend="+5% YoY"  trendUp icon={TrendingUp} iconBg="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" />
          <StatCard title="Returning Customers"  value="70%"                                   trend="+8% YoY"  trendUp icon={Users}      iconBg="bg-blue-100 dark:bg-blue-900/30"   iconColor="text-blue-600 dark:text-blue-400" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Monthly Revenue Bar Chart */}
          <div className="xl:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-1">Monthly Revenue</h2>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mb-6">Mar 2025 – Feb 2026</p>
            <div className="flex items-end gap-2 h-44">
              {MONTHLY_REVENUE.map(({ month, value }) => {
                const heightPct = (value / maxRevenue) * 100;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="relative w-full flex justify-center">
                      <div
                        className="w-full rounded-t-lg bg-pbs-red/20 dark:bg-pbs-red/30 group-hover:bg-pbs-red transition-colors duration-200 cursor-default"
                        style={{ height: `${(heightPct / 100) * 160}px` }}
                        title={`$${value.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-[10px] text-pbs-gray-400 font-medium">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders by Category */}
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-1">Orders by Category</h2>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mb-6">All time</p>
            <div className="space-y-4">
              {BY_CATEGORY.map(({ label, orders, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-pbs-gray-700 dark:text-pbs-gray-300">{label}</span>
                    <span className="text-pbs-gray-500 dark:text-pbs-gray-400">{orders}</span>
                  </div>
                  <div className="h-2 bg-pbs-gray-100 dark:bg-pbs-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pbs-red rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <div className="px-6 pt-6 pb-4 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Top Products by Revenue</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pbs-gray-100 dark:border-pbs-gray-800">
                {['#', 'Product', 'Orders', 'Revenue'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => (
                <tr key={p.name} className="border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800/50 transition-colors">
                  <td className="px-6 py-3.5 text-pbs-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="px-6 py-3.5 font-medium text-pbs-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-3.5 text-pbs-gray-600 dark:text-pbs-gray-400">{p.orders}</td>
                  <td className="px-6 py-3.5 font-semibold text-pbs-gray-900 dark:text-white">${p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </>
  );
}
