'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Plus, ChevronRight } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTable } from '@/components/admin/AdminTable';
import { Button } from '@/components/ui/Button';
import { getProductIcon } from '@/lib/utils/icons';

type ProductRow = {
  id: string;
  name: string;
  shortDescription: string;
  iconName: string;
  isActive: boolean;
  isFeatured: boolean;
  sizes: string[];
  basePrice: number;
};

type Props = {
  categoryId: string;
  categoryName: string;
  categoryIconName: string;
  products: ProductRow[];
};

export function AdminCategoryProductsClient({ categoryId, categoryName, categoryIconName, products }: Props) {
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q);
  });

  const columns = [
    {
      key: 'name', header: 'Product',
      render: (p: ProductRow) => {
        const Icon = getProductIcon(p.iconName || categoryIconName);
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
    { key: 'price', header: 'Base Price', render: (p: ProductRow) => <span className="font-semibold">${p.basePrice.toFixed(2)}</span> },
    {
      key: 'sizes', header: 'Sizes',
      render: (p: ProductRow) => (
        <span className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
          {p.sizes.length > 0 ? p.sizes.join(', ') : '—'}
        </span>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (p: ProductRow) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-pbs-gray-100 text-pbs-gray-500 dark:bg-pbs-gray-800'}`}>
          {p.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions', header: '',
      render: (p: ProductRow) => (
        <div className="flex items-center gap-3">
          <Link href={`/admin/products/${categoryId}/${p.id}`} className="text-xs font-medium text-pbs-red hover:underline">Edit</Link>
          <a href={`/products/${p.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-pbs-gray-500 hover:underline">View</a>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title={categoryName} subtitle={`${filtered.length} product${filtered.length !== 1 ? 's' : ''}`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
          <Link href="/admin/products" className="hover:text-pbs-red transition-colors">Products</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-pbs-gray-900 dark:text-white font-medium">{categoryName}</span>
        </nav>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
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
          <Link href={`/admin/products/${categoryId}/new`}>
            <Button variant="primary" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-pbs-gray-400">
              <Package className="h-10 w-10 mb-3" strokeWidth={1} />
              <p className="text-sm">No products in this category yet.</p>
            </div>
          ) : (
            <AdminTable columns={columns as never[]} rows={filtered as never[]} />
          )}
        </div>
      </main>
    </>
  );
}
