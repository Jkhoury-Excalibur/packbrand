import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { StatCard } from '@/components/admin/StatCard';
import { getAnalyticsData } from '@/lib/db/analytics';

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.value), 1);

  return (
    <>
      <AdminHeader title="Analytics" subtitle="Last 12 months" />

      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`$${data.totalRevenue.toLocaleString()}`} icon={DollarSign} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
          <StatCard title="Total Orders" value={String(data.totalOrders)} icon={ShoppingCart} />
          <StatCard title="Avg. Order Value" value={`$${data.avgOrderValue}`} icon={TrendingUp} iconBg="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" />
          <StatCard title="Repeat Customers" value={`${data.repeatCustomerPct}%`} icon={Users} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Monthly Revenue Bar Chart */}
          <div className="xl:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-1">Monthly Revenue</h2>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mb-6">Last 12 months</p>
            {data.monthlyRevenue.every((m) => m.value === 0) ? (
              <div className="flex items-center justify-center h-44 text-sm text-pbs-gray-400">No revenue data yet.</div>
            ) : (
              <div className="flex items-end gap-2 h-44">
                {data.monthlyRevenue.map(({ month, value }) => {
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
            )}
          </div>

          {/* Orders by Category */}
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-1">Orders by Category</h2>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mb-6">All time</p>
            {data.categoryBreakdown.length === 0 ? (
              <p className="text-sm text-pbs-gray-400">No category data yet.</p>
            ) : (
              <div className="space-y-4">
                {data.categoryBreakdown.map(({ label, orders, pct }) => (
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
            )}
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          <div className="px-6 pt-6 pb-4 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Top Products by Revenue</h2>
          </div>
          {data.topProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-pbs-gray-400">No product data yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pbs-gray-100 dark:border-pbs-gray-800">
                  {['#', 'Product', 'Orders', 'Revenue'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p, i) => (
                  <tr key={p.name} className="border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800/50 transition-colors">
                    <td className="px-6 py-3.5 text-pbs-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-3.5 font-medium text-pbs-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-3.5 text-pbs-gray-600 dark:text-pbs-gray-400">{p.orders}</td>
                    <td className="px-6 py-3.5 font-semibold text-pbs-gray-900 dark:text-white">${p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </>
  );
}
