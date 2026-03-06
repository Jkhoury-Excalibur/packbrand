'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Plus, ChevronRight, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { getProductIcon } from '@/lib/utils/icons';
import { reorderProductsAction } from '@/lib/actions/products';
import { cn } from '@/lib/utils/cn';

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

function SortableProductRow({ product, categoryId, categoryIconName }: { product: ProductRow; categoryId: string; categoryIconName: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getProductIcon(product.iconName || categoryIconName);

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0 hover:bg-pbs-gray-50 dark:hover:bg-pbs-gray-800/50 transition-colors',
        isDragging && 'opacity-50 bg-pbs-gray-50 dark:bg-pbs-gray-800/50',
      )}
    >
      <td className="px-2 py-3.5 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-pbs-gray-400 hover:text-pbs-gray-600 dark:hover:text-pbs-gray-300 hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <td className="px-4 py-3.5 text-pbs-gray-700 dark:text-pbs-gray-300 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-pbs-gray-500 dark:text-pbs-gray-400" />
          </div>
          <div>
            <p className="font-semibold text-pbs-gray-900 dark:text-white">{product.name}</p>
            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 truncate max-w-[200px]">{product.shortDescription.slice(0, 50)}…</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-pbs-gray-700 dark:text-pbs-gray-300 whitespace-nowrap">
        <span className="font-semibold">${product.basePrice.toFixed(2)}</span>
      </td>
      <td className="px-4 py-3.5 text-pbs-gray-700 dark:text-pbs-gray-300 whitespace-nowrap">
        <span className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
          {product.sizes.length > 0 ? product.sizes.join(', ') : '—'}
        </span>
      </td>
      <td className="px-4 py-3.5 text-pbs-gray-700 dark:text-pbs-gray-300 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-pbs-gray-100 text-pbs-gray-500 dark:bg-pbs-gray-800'}`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3.5 text-pbs-gray-700 dark:text-pbs-gray-300 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Link href={`/admin/products/${categoryId}/${product.id}`} className="text-xs font-medium text-pbs-red hover:underline">Edit</Link>
          <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-pbs-gray-500 hover:underline">View</a>
        </div>
      </td>
    </tr>
  );
}

export function AdminCategoryProductsClient({ categoryId, categoryName, categoryIconName, products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q);
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((p) => p.id === active.id);
    const newIndex = filtered.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filtered, oldIndex, newIndex);

    // Optimistic update
    const orderMap = new Map(reordered.map((p, i) => [p.id, i]));
    setProducts((prev) =>
      [...prev].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999)),
    );

    await reorderProductsAction(reordered.map((p) => p.id));
  };

  const headers = ['', 'Product', 'Base Price', 'Sizes', 'Status', ''];

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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pbs-gray-100 dark:border-pbs-gray-800">
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filtered.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                    <tbody>
                      {filtered.map((product) => (
                        <SortableProductRow
                          key={product.id}
                          product={product}
                          categoryId={categoryId}
                          categoryIconName={categoryIconName}
                        />
                      ))}
                    </tbody>
                  </SortableContext>
                </DndContext>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
