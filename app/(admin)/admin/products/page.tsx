'use client';

import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { ALL_PRODUCTS, type Product } from '@/lib/data/products';
import { cn } from '@/lib/utils/cn';

const CATEGORY_LABELS: Record<string, string> = {
  'cups':            'Cups',
  'bags':            'Bags',
  'boxes':           'Boxes',
  'food-containers': 'Food Containers',
  'labels':          'Labels',
};

const MIN_ORDER_MAP: Record<number, string> = {
  1: '250 units', 2: '500 units', 3: '250 units', 4: '500 units',
  5: '250 units', 6: '100 units', 7: '500 units', 8: '500 units',
  9: '100 units', 10: '500 units',
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchCat  = activeCategory === 'all' || p.category === activeCategory;
    const q         = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

  const columns = [
    {
      key: 'name', header: 'Product',
      render: (p: Product) => {
        const Icon = p.icon;
        return (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-pbs-gray-500 dark:text-pbs-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-pbs-gray-900 dark:text-white">{p.name}</p>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 truncate max-w-[200px]">{p.shortDescription.slice(0, 50)}…</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'category', header: 'Category',
      render: (p: Product) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-700 dark:text-pbs-gray-300">
          {CATEGORY_LABELS[p.category] ?? p.category}
        </span>
      ),
    },
    { key: 'minOrder', header: 'Min. Order', render: (p: Product) => <span className="text-pbs-gray-600 dark:text-pbs-gray-400">{MIN_ORDER_MAP[p.id]}</span> },
    {
      key: 'status', header: 'Status',
      render: () => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Active
        </span>
      ),
    },
    {
      key: 'actions', header: '',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <button className="text-xs font-medium text-pbs-red hover:underline">Edit</button>
          <a href={`/products/${p.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-pbs-gray-500 hover:underline">View</a>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Products" subtitle={`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-1 bg-white dark:bg-pbs-gray-900 border border-pbs-gray-100 dark:border-pbs-gray-800 rounded-2xl p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-sm font-medium transition-colors capitalize',
                  activeCategory === cat
                    ? 'bg-pbs-red text-white'
                    : 'text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-gray-900 dark:hover:text-white',
                )}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-pbs-gray-400">
              <Package className="h-10 w-10 mb-3" strokeWidth={1} />
              <p className="text-sm">No products match your filters.</p>
            </div>
          ) : (
            <AdminTable columns={columns as any} rows={filtered as any} />
          )}
        </div>

      </main>
    </>
  );
}
