'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, EyeOff, Pencil, Trash2, Package } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { getProductIcon } from '@/lib/utils/icons';
import { deleteCategoryAction } from '@/lib/actions/categories';
import { cn } from '@/lib/utils/cn';

type CategoryRow = {
  id: string;
  name: string;
  nameEs: string;
  slug: string;
  description: string;
  descriptionEs: string;
  iconName: string;
  sortOrder: number;
  isVisible: boolean;
  productCount: number;
};

export function AdminCategoriesClient({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [modalCategory, setModalCategory] = useState<CategoryRow | null | 'new'>(null);

  const filtered = categories.filter((c) => {
    if (!showHidden && !c.isVisible) return false;
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.slug.toLowerCase().includes(q)) return false;
    return true;
  });

  const handleDelete = async (cat: CategoryRow) => {
    if (!confirm(`Hide "${cat.name}" category? Products in this category will remain but the category won't appear on the public store.`)) return;
    await deleteCategoryAction(cat.id);
    router.refresh();
  };

  return (
    <>
      <AdminHeader title="Products" subtitle={`${categories.filter((c) => c.isVisible).length} categories`} />

      <main className="flex-1 p-6 space-y-5 overflow-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pbs-gray-400" />
              <input
                type="search"
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-900 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 cursor-pointer select-none">
              <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} className="sr-only peer" />
              <div className={cn('h-5 w-9 rounded-full transition-colors relative', showHidden ? 'bg-pbs-red' : 'bg-pbs-gray-200 dark:bg-pbs-gray-700')}>
                <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', showHidden ? 'translate-x-4' : 'translate-x-0.5')} />
              </div>
              Show hidden
            </label>
          </div>
          <Button variant="primary" size="sm" className="gap-2" onClick={() => setModalCategory('new')}>
            <Plus className="h-4 w-4" /> New Category
          </Button>
        </div>

        {/* Category Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col items-center justify-center py-16 text-pbs-gray-400">
            <Package className="h-10 w-10 mb-3" strokeWidth={1} />
            <p className="text-sm">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((cat) => {
              const Icon = getProductIcon(cat.iconName);
              return (
                <div
                  key={cat.id}
                  className={cn(
                    'relative bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 flex flex-col gap-4 group hover:shadow-lg transition-shadow cursor-pointer',
                    !cat.isVisible && 'opacity-60',
                  )}
                  onClick={() => router.push(`/admin/products/${cat.id}`)}
                >
                  {/* Icon + Visibility badge */}
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-pbs-red" />
                    </div>
                    <div className="flex items-center gap-1">
                      {!cat.isVisible && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-500">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name + count */}
                  <div>
                    <h3 className="text-base font-bold text-pbs-gray-900 dark:text-white group-hover:text-pbs-red transition-colors">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                    )}
                    <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
                      {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
                    <button
                      onClick={(e) => { e.stopPropagation(); setModalCategory(cat); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-pbs-gray-500 dark:text-pbs-gray-400 hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 hover:text-pbs-red transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(cat); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-pbs-gray-500 dark:text-pbs-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Hide
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalCategory !== null && (
        <CategoryFormModal
          category={modalCategory === 'new' ? null : modalCategory}
          onClose={() => setModalCategory(null)}
          onSaved={() => { setModalCategory(null); router.refresh(); }}
        />
      )}
    </>
  );
}
