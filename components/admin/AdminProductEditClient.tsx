'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save, Check, Plus, Trash2, ImagePlus, X } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { createProductAction, updateProductAction } from '@/lib/actions/products';
import { cn } from '@/lib/utils/cn';

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS = 'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

type PricingTier = { minQty: number; maxQty: number; pricePerUnit: number };

type ProductData = {
  id: string;
  name: string;
  nameEs: string;
  shortDescription: string;
  shortDescEs: string;
  description: string;
  descEs: string;
  sizes: string[];
  features: string[];
  basePrice: number;
  pricingTiers: PricingTier[];
  isActive: boolean;
  isFeatured: boolean;
  allowLogoUpload: boolean;
  allowCustomText: boolean;
  images: string[];
} | null;

type Props = {
  isNew: boolean;
  product: ProductData;
  categoryId: string;
  categoryName: string;
};

export function AdminProductEditClient({ isNew, product, categoryId, categoryName }: Props) {
  const router = useRouter();
  const [nameEn, setNameEn] = useState(product?.name ?? '');
  const [nameEs, setNameEs] = useState(product?.nameEs ?? '');
  const [shortDescEn, setShortDescEn] = useState(product?.shortDescription ?? '');
  const [shortDescEs, setShortDescEs] = useState(product?.shortDescEs ?? '');
  const [descEn, setDescEn] = useState(product?.description ?? '');
  const [descEs, setDescEs] = useState(product?.descEs ?? '');
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? ['']);
  const [tiers, setTiers] = useState<PricingTier[]>(
    product?.pricingTiers?.length
      ? product.pricingTiers
      : [{ minQty: 1, maxQty: 250, pricePerUnit: 0 }],
  );
  const [features, setFeatures] = useState<string[]>(product?.features ?? ['']);
  const [allowLogoUpload, setAllowLogoUpload] = useState(product?.allowLogoUpload ?? true);
  const [allowCustomText, setAllowCustomText] = useState(product?.allowCustomText ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'en' | 'es'>('en');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const res = await fetch('/api/upload-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, fileSize: file.size }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        const putRes = await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!putRes.ok) throw new Error('Upload to storage failed');

        newUrls.push(data.publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setUploading(false);
        e.target.value = '';
        return;
      }
    }

    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const data = {
      name: nameEn,
      nameEs: nameEs || undefined,
      categoryId,
      shortDescription: shortDescEn,
      shortDescEs: shortDescEs || undefined,
      description: descEn,
      descEs: descEs || undefined,
      sizes: sizes.filter(Boolean),
      features: features.filter(Boolean),
      basePrice: tiers[0]?.pricePerUnit ?? 0,
      pricingTiers: tiers.map((t) => ({
        minQty: t.minQty,
        maxQty: t.maxQty || undefined,
        unitPrice: t.pricePerUnit,
      })),
      isActive,
      isFeatured,
      allowLogoUpload,
      allowCustomText,
      images,
      tags: [],
      specs: [],
    };

    const result = isNew
      ? await createProductAction(data)
      : await updateProductAction(product!.id, data);

    setSaving(false);

    if ('error' in result) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (isNew) router.push(`/admin/products/${categoryId}`);
    }, 1500);
  };

  const addSize = () => setSizes([...sizes, '']);
  const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i));
  const updateSize = (i: number, val: string) => setSizes(sizes.map((s, idx) => idx === i ? val : s));
  const addTier = () => setTiers([...tiers, { minQty: 0, maxQty: 0, pricePerUnit: 0 }]);
  const removeTier = (i: number) => setTiers(tiers.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof PricingTier, val: number) => setTiers(tiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (i: number) => setFeatures(features.filter((_, idx) => idx !== i));
  const updateFeature = (i: number, val: string) => setFeatures(features.map((f, idx) => idx === i ? val : f));

  return (
    <>
      <AdminHeader title={isNew ? 'New Product' : 'Edit Product'} subtitle={isNew ? `Adding to ${categoryName}` : product!.name} />

      <main className="flex-1 p-6 overflow-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 mb-6">
          <Link href="/admin/products" className="hover:text-pbs-red transition-colors">Products</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href={`/admin/products/${categoryId}`} className="hover:text-pbs-red transition-colors">{categoryName}</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-pbs-gray-900 dark:text-white font-medium">{isNew ? 'New' : product!.name}</span>
        </nav>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Images */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">Images</h3>
                  <label
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                      uploading
                        ? 'text-pbs-gray-400 cursor-not-allowed'
                        : 'text-pbs-red hover:bg-pbs-red/10 cursor-pointer',
                    )}
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    {uploading ? 'Uploading...' : 'Add Images'}
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp,.svg"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                  </label>
                </div>
                {images.length === 0 ? (
                  <div className="border-2 border-dashed border-pbs-gray-200 dark:border-pbs-gray-700 rounded-2xl p-8 text-center text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
                    No images yet. The first image you add will be the main display.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((url, i) => (
                      <div
                        key={url}
                        className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-pbs-gray-100 dark:border-pbs-gray-800 bg-pbs-gray-50 dark:bg-pbs-gray-800"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-pbs-red text-white text-[10px] font-bold uppercase tracking-widest">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">Product Details</h3>
                  <div className="flex gap-1 bg-pbs-gray-100 dark:bg-pbs-gray-800 rounded-xl p-0.5">
                    {(['en', 'es'] as const).map((lang) => (
                      <button key={lang} type="button" onClick={() => setActiveTab(lang)} className={cn('px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors', activeTab === lang ? 'bg-white dark:bg-pbs-gray-700 text-pbs-gray-900 dark:text-white shadow-sm' : 'text-pbs-gray-500 dark:text-pbs-gray-400')}>{lang}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className={LABEL_CLS}>Product Name ({activeTab.toUpperCase()})</label>
                    <input type="text" required value={activeTab === 'en' ? nameEn : nameEs} onChange={(e) => activeTab === 'en' ? setNameEn(e.target.value) : setNameEs(e.target.value)} className={INPUT_CLS} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Short Description ({activeTab.toUpperCase()})</label>
                    <textarea rows={2} value={activeTab === 'en' ? shortDescEn : shortDescEs} onChange={(e) => activeTab === 'en' ? setShortDescEn(e.target.value) : setShortDescEs(e.target.value)} className={`${INPUT_CLS} resize-none`} />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Full Description ({activeTab.toUpperCase()})</label>
                    <textarea rows={5} value={activeTab === 'en' ? descEn : descEs} onChange={(e) => activeTab === 'en' ? setDescEn(e.target.value) : setDescEs(e.target.value)} className={`${INPUT_CLS} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">Sizes / Variants</h3>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-pbs-red" onClick={addSize}><Plus className="h-3.5 w-3.5" /> Add Size</Button>
                </div>
                <div className="space-y-2">
                  {sizes.map((size, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={size} onChange={(e) => updateSize(i, e.target.value)} placeholder='e.g. 12oz' className={INPUT_CLS} />
                      {sizes.length > 1 && <button type="button" onClick={() => removeSize(i)} className="shrink-0 p-2.5 rounded-xl text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-red/10 transition-colors"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">Pricing Tiers</h3>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-pbs-red" onClick={addTier}><Plus className="h-3.5 w-3.5" /> Add Tier</Button>
                </div>
                <div className="grid grid-cols-[1fr_1fr_1fr_2.5rem] gap-2 mb-2">
                  <span className="text-[10px] font-bold text-pbs-gray-400 uppercase tracking-widest">Min Qty</span>
                  <span className="text-[10px] font-bold text-pbs-gray-400 uppercase tracking-widest">Max Qty</span>
                  <span className="text-[10px] font-bold text-pbs-gray-400 uppercase tracking-widest">Price / Unit</span>
                  <span />
                </div>
                <div className="space-y-2">
                  {tiers.map((tier, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr_2.5rem] gap-2">
                      <input type="number" min={0} value={tier.minQty || ''} onChange={(e) => updateTier(i, 'minQty', Number(e.target.value))} className={INPUT_CLS} />
                      <input type="number" min={0} value={tier.maxQty || ''} onChange={(e) => updateTier(i, 'maxQty', Number(e.target.value))} className={INPUT_CLS} />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pbs-gray-400 text-sm">$</span>
                        <input type="number" min={0} step={0.01} value={tier.pricePerUnit || ''} onChange={(e) => updateTier(i, 'pricePerUnit', Number(e.target.value))} className={`${INPUT_CLS} pl-7`} />
                      </div>
                      {tiers.length > 1 && <button type="button" onClick={() => removeTier(i)} className="shrink-0 p-2.5 rounded-xl text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-red/10 transition-colors"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">Key Features</h3>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-pbs-red" onClick={addFeature}><Plus className="h-3.5 w-3.5" /> Add Feature</Button>
                </div>
                <div className="space-y-2">
                  {features.map((feat, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" value={feat} onChange={(e) => updateFeature(i, e.target.value)} placeholder="e.g. Full-color logo print" className={INPUT_CLS} />
                      {features.length > 1 && <button type="button" onClick={() => removeFeature(i)} className="shrink-0 p-2.5 rounded-xl text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-red/10 transition-colors"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Category badge (read-only) */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-3">Category</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 text-pbs-red font-semibold text-sm">
                  {categoryName}
                </div>
              </div>

              {/* Status */}
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6">
                <h3 className="text-sm font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-5">Status</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn('h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors', isActive ? 'bg-pbs-red border-pbs-red' : 'border-pbs-gray-300 dark:border-pbs-gray-600 group-hover:border-pbs-red')}>
                      {isActive && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </div>
                    <div><p className="text-sm font-medium text-pbs-gray-900 dark:text-white">Active</p><p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Product is visible to customers</p></div>
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only" />
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={cn('h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors', isFeatured ? 'bg-pbs-gold border-pbs-gold' : 'border-pbs-gray-300 dark:border-pbs-gray-600 group-hover:border-pbs-gold')}>
                      {isFeatured && <Check className="h-3 w-3 text-pbs-black" strokeWidth={3} />}
                    </div>
                    <div><p className="text-sm font-medium text-pbs-gray-900 dark:text-white">Featured</p><p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">Show on homepage</p></div>
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="sr-only" />
                  </label>
                </div>
              </div>

              {/* Save */}
              <Button type="submit" variant="primary" size="lg" className="w-full gap-2" disabled={saving}>
                {saved ? <><Check className="h-4 w-4" /> Saved!</> : saving ? 'Saving...' : <><Save className="h-4 w-4" /> {isNew ? 'Create Product' : 'Save Changes'}</>}
              </Button>
              {saved && <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">Product {isNew ? 'created' : 'updated'} successfully.</p>}
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
