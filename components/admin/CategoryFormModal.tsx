'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AVAILABLE_ICONS, getProductIcon } from '@/lib/utils/icons';
import { createCategoryAction, updateCategoryAction } from '@/lib/actions/categories';
import { cn } from '@/lib/utils/cn';

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS = 'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

type CategoryData = {
  id: string;
  name: string;
  nameEs: string;
  slug: string;
  description: string;
  descriptionEs: string;
  iconName: string;
  sortOrder: number;
  isVisible: boolean;
} | null;

type Props = {
  category: CategoryData;
  onClose: () => void;
  onSaved: () => void;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CategoryFormModal({ category, onClose, onSaved }: Props) {
  const isNew = !category;
  const [name, setName] = useState(category?.name ?? '');
  const [nameEs, setNameEs] = useState(category?.nameEs ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [descriptionEs, setDescriptionEs] = useState(category?.descriptionEs ?? '');
  const [iconName, setIconName] = useState(category?.iconName ?? 'Package');
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(category?.isVisible ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from name for new categories
  useEffect(() => {
    if (isNew) {
      setSlug(slugify(name));
    }
  }, [name, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const data = {
      name,
      nameEs: nameEs || undefined,
      slug,
      description: description || undefined,
      descriptionEs: descriptionEs || undefined,
      iconName,
      sortOrder,
      isVisible,
    };

    const result = isNew
      ? await createCategoryAction(data)
      : await updateCategoryAction(category!.id, data);

    setSaving(false);

    if ('error' in result) {
      setError('Please fill in all required fields.');
      return;
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white">
            {isNew ? 'New Category' : 'Edit Category'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-pbs-gray-400 hover:text-pbs-gray-900 dark:hover:text-white hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Name EN */}
          <div>
            <label className={LABEL_CLS}>Category Name (EN) *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={INPUT_CLS} placeholder="e.g. Cups" />
          </div>

          {/* Name ES */}
          <div>
            <label className={LABEL_CLS}>Category Name (ES)</label>
            <input type="text" value={nameEs} onChange={(e) => setNameEs(e.target.value)} className={INPUT_CLS} placeholder="e.g. Vasos" />
          </div>

          {/* Slug */}
          <div>
            <label className={LABEL_CLS}>URL Slug *</label>
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className={INPUT_CLS} placeholder="e.g. cups" />
            <p className="text-xs text-pbs-gray-400 mt-1">Used in URLs: /products?category={slug || '...'}</p>
          </div>

          {/* Description EN */}
          <div>
            <label className={LABEL_CLS}>Description (EN)</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={`${INPUT_CLS} resize-none`} placeholder="Short description for this category" />
          </div>

          {/* Description ES */}
          <div>
            <label className={LABEL_CLS}>Description (ES)</label>
            <textarea rows={2} value={descriptionEs} onChange={(e) => setDescriptionEs(e.target.value)} className={`${INPUT_CLS} resize-none`} />
          </div>

          {/* Icon Picker */}
          <div>
            <label className={LABEL_CLS}>Icon</label>
            <div className="grid grid-cols-8 gap-1.5">
              {AVAILABLE_ICONS.map((icoName) => {
                const Ico = getProductIcon(icoName);
                const selected = iconName === icoName;
                return (
                  <button
                    key={icoName}
                    type="button"
                    onClick={() => setIconName(icoName)}
                    title={icoName}
                    className={cn(
                      'h-10 w-10 rounded-xl flex items-center justify-center transition-all',
                      selected
                        ? 'bg-pbs-red text-white ring-2 ring-pbs-red ring-offset-2 dark:ring-offset-pbs-gray-900'
                        : 'bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-red/10',
                    )}
                  >
                    <Ico className="h-4.5 w-4.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className={LABEL_CLS}>Sort Order</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={`${INPUT_CLS} max-w-[120px]`} />
          </div>

          {/* Visibility */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={cn('h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors', isVisible ? 'bg-pbs-red border-pbs-red' : 'border-pbs-gray-300 dark:border-pbs-gray-600 group-hover:border-pbs-red')}>
              {isVisible && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-sm font-medium text-pbs-gray-900 dark:text-white">Visible</p>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Category appears on the public store</p>
            </div>
            <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="sr-only" />
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={saving}>
              {saving ? 'Saving...' : isNew ? 'Create Category' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
