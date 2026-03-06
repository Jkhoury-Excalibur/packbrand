import { getDb } from './client';
import type { DbOrder } from './orders';
import { getCategories } from './categories';

export type MonthlyRevenue = { month: string; value: number };
export type CategoryBreakdown = { label: string; orders: number; pct: number };
export type TopProduct = { name: string; revenue: number; orders: number };

export async function getAnalyticsData() {
  const db = await getDb();
  const [orders, categories] = await Promise.all([
    db.collection<DbOrder>('orders').find().toArray(),
    getCategories(),
  ]);

  // Build dynamic category label map from DB
  const categoryLabels: Record<string, string> = {};
  for (const c of categories) {
    categoryLabels[c._id.toString()] = c.name;
    // Also support old slug-based category strings for legacy orders
    categoryLabels[c.slug] = c.name;
  }

  // Total stats
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Unique customers
  const uniqueCustomers = new Set(orders.map((o) => o.contact.email)).size;
  const repeatCustomers = totalOrders > 0 && uniqueCustomers > 0
    ? Math.round(((totalOrders - uniqueCustomers) / totalOrders) * 100)
    : 0;

  // Monthly revenue (last 12 months)
  const now = new Date();
  const monthlyRevenue: MonthlyRevenue[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= d && created <= monthEnd;
    });
    const value = monthOrders.reduce((s, o) => s + o.total, 0);
    monthlyRevenue.push({
      month: d.toLocaleString('en-US', { month: 'short' }),
      value,
    });
  }

  // Orders by category — handles both legacy `category` string and new `categoryId`/`categoryName`
  const catCounts: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.items) {
      const orderItem = item as Record<string, unknown>;
      const catKey = (orderItem.categoryName as string)
        ?? (orderItem.categoryId as string)
        ?? (orderItem.category as string)
        ?? 'other';
      catCounts[catKey] = (catCounts[catKey] ?? 0) + 1;
    }
  }
  const maxCatOrders = Math.max(...Object.values(catCounts), 1);
  const categoryBreakdown: CategoryBreakdown[] = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, count]) => ({
      label: categoryLabels[cat] ?? cat,
      orders: count,
      pct: Math.round((count / maxCatOrders) * 100),
    }));

  // Top products by revenue
  const productMap: Record<string, { revenue: number; orders: number }> = {};
  for (const order of orders) {
    for (const item of order.items) {
      if (!productMap[item.name]) productMap[item.name] = { revenue: 0, orders: 0 };
      productMap[item.name].revenue += item.lineTotal;
      productMap[item.name].orders += 1;
    }
  }
  const topProducts: TopProduct[] = Object.entries(productMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([name, data]) => ({ name, ...data }));

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    repeatCustomerPct: repeatCustomers,
    monthlyRevenue,
    categoryBreakdown,
    topProducts,
  };
}
