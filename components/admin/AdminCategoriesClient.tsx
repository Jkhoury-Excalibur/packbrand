'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, EyeOff, Pencil, Trash2, Package, GripVertical } from 'lucide-react';
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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { getProductIcon } from '@/lib/utils/icons';
import { deleteCategoryAction, reorderCategoriesAction } from '@/lib/actions/categories';
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

function SortableCategoryCard({
  cat,
  onEdit,
  onDelete,
  onClick,
}: {
  cat: CategoryRow;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getProductIcon(cat.iconName);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 flex flex-col gap-4 group hover:shadow-lg transition-shadow cursor-pointer',
        !cat.isVisible && 'opacity-60',
        isDragging && 'opacity-50 shadow-2xl z-50',
      )}
      onClick={onClick}
    >
      {/* Icon + Drag handle + Visibility badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-lg text-pbs-gray-400 hover:text-pbs-gray-600 dark:hover:text-pbs-gray-300 hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="h-12 w-12 rounded-2xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
            <Icon className="h-6 w-6 text-pbs-red" />
          </div>
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
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-pbs-gray-500 dark:text-pbs-gray-400 hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 hover:text-pbs-red transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-pbs-gray-500 dark:text-pbs-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Hide
        </button>
      </div>
    </div>
  );
}

export function AdminCategoriesClient({ categories: initialCategories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [modalCategory, setModalCategory] = useState<CategoryRow | null | 'new'>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const filtered = categories.filter((c) => {
    if (!showHidden && !c.isVisible) return false;
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.slug.toLowerCase().includes(q)) return false;
    return true;
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((c) => c.id === active.id);
    const newIndex = filtered.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(filtered, oldIndex, newIndex);

    // Update full categories list with new sort orders
    const sortMap = new Map(reordered.map((c, i) => [c.id, i]));
    setCategories((prev) =>
      prev.map((c) => (sortMap.has(c.id) ? { ...c, sortOrder: sortMap.get(c.id)! } : c))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    );

    await reorderCategoriesAction(reordered.map((c) => c.id));
  };

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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filtered.map((c) => c.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((cat) => (
                  <SortableCategoryCard
                    key={cat.id}
                    cat={cat}
                    onEdit={() => setModalCategory(cat)}
                    onDelete={() => handleDelete(cat)}
                    onClick={() => router.push(`/admin/products/${cat.id}`)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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
