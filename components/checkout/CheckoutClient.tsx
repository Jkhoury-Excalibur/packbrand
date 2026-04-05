'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ShoppingBag, Send, Upload, X, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';
import { submitWorkOrder } from '@/lib/actions/work-order';

const INPUT_CLS = 'w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS = 'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

type Props = {
  shippingRate: number;
  freeShippingThreshold: number;
  taxRate: number;
};

export function CheckoutClient({ shippingRate, freeShippingThreshold, taxRate }: Props) {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [logoFiles, setLogoFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const cartId = useCartStore((s) => s.cartId);
  const items = useCartStore((s) => s.items);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 3 - logoFiles.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    setError('');

    for (const file of toUpload) {
      try {
        const res = await fetch('/api/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, fileSize: file.size }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Upload failed.'); continue; }

        await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
        setLogoFiles((prev) => [...prev, { name: file.name, url: data.publicUrl }]);
      } catch {
        setError('Failed to upload file. Please try again.');
      }
    }

    setUploading(false);
    e.target.value = '';
  };

  const removeLogo = (index: number) => {
    setLogoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.target as HTMLFormElement;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';

    const workOrderData = {
      cartId,
      contact: {
        firstName: get('firstName'),
        lastName: get('lastName'),
        email: get('email'),
        phone: get('phone'),
        company: get('company') || undefined,
      },
      shippingAddress: {
        line1: get('address1'),
        line2: get('address2') || undefined,
        city: get('city'),
        state: get('state'),
        zip: get('zip'),
        country: get('country') || 'United States',
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        size: item.size,
        qty: item.qty,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      specialInstructions: get('instructions') || undefined,
      logoUrls: logoFiles.length > 0 ? logoFiles.map((f) => f.url) : undefined,
    };

    const result = await submitWorkOrder(workOrderData);
    setSubmitting(false);

    if ('error' in result) {
      setError('Please fill in all required fields.');
      return;
    }

    router.push(`/checkout/success?order=${result.orderNumber}`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center gap-6 py-24">
        <ShoppingBag className="h-16 w-16 text-pbs-gray-300 dark:text-pbs-gray-600" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Nothing to submit</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">Add items to your cart first.</p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const orderSummary = (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 space-y-5">
        <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Order Summary</h2>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-pbs-gray-900 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400">
                  {item.size !== 'Standard' && `${item.size} · `}{item.qtyLabel}
                </p>
              </div>
              <span className="shrink-0 font-semibold text-pbs-gray-900 dark:text-white">
                ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t border-pbs-gray-100 dark:border-pbs-gray-800 pt-4">
          <div className="flex justify-between text-pbs-gray-600 dark:text-pbs-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-pbs-gray-600 dark:text-pbs-gray-400">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          {tax > 0 && (
            <div className="flex justify-between text-pbs-gray-600 dark:text-pbs-gray-400">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-pbs-gray-900 dark:text-white text-base border-t border-pbs-gray-100 dark:border-pbs-gray-800 pt-2">
            <span>Total</span>
            <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Work Order'}
          {!submitting && <Send className="ml-2 h-4 w-4" />}
        </Button>

        <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 text-center leading-relaxed">
          By submitting your work order, you agree to our{' '}
          <Link href="/terms" className="text-pbs-red hover:underline font-medium">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-pbs-red hover:underline font-medium">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Submit Work Order</h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Complete your work order details below.</p>
      </div>

      <form onSubmit={handleSubmitWorkOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left column — forms */}
          <div className="lg:col-span-2 space-y-6">

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className={LABEL_CLS}>First Name</label>
                  <input id="firstName" name="firstName" type="text" required placeholder="Maria" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="lastName" className={LABEL_CLS}>Last Name</label>
                  <input id="lastName" name="lastName" type="text" required placeholder="Lopez" className={INPUT_CLS} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={LABEL_CLS}>Email Address</label>
                  <input id="email" name="email" type="email" required placeholder="maria@example.com" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="phone" className={LABEL_CLS}>Phone Number</label>
                  <input id="phone" name="phone" type="tel" required placeholder="(555) 000-0000" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="company" className={LABEL_CLS}>Company Name</label>
                  <input id="company" name="company" type="text" placeholder="Your Business" className={INPUT_CLS} />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="address1" className={LABEL_CLS}>Address Line 1</label>
                  <input id="address1" name="address1" type="text" required placeholder="123 Main Street" className={INPUT_CLS} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address2" className={LABEL_CLS}>Address Line 2 <span className="normal-case font-normal">(optional)</span></label>
                  <input id="address2" name="address2" type="text" placeholder="Suite, floor, unit..." className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="city" className={LABEL_CLS}>City</label>
                  <input id="city" name="city" type="text" required placeholder="New York" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="state" className={LABEL_CLS}>State</label>
                  <input id="state" name="state" type="text" required placeholder="NY" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="zip" className={LABEL_CLS}>ZIP Code</label>
                  <input id="zip" name="zip" type="text" required placeholder="10001" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="country" className={LABEL_CLS}>Country</label>
                  <input id="country" name="country" type="text" defaultValue="United States" className={INPUT_CLS} />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Special Instructions</h2>
              <div>
                <label htmlFor="instructions" className={LABEL_CLS}>Print notes, artwork details, or special requests <span className="normal-case font-normal">(optional)</span></label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={4}
                  placeholder="e.g. Please use Pantone 485 for the logo. Artwork file will be emailed separately..."
                  className={`${INPUT_CLS} resize-none`}
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-2">Logo Upload</h2>
              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mb-5">
                Upload up to 3 logo files (PNG, JPG, SVG, WebP, or PDF). Optional — you can also email them later.
              </p>

              {/* Uploaded files list */}
              {logoFiles.length > 0 && (
                <div className="space-y-2 mb-4">
                  {logoFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 bg-pbs-gray-50 dark:bg-pbs-gray-800 rounded-xl px-4 py-2.5">
                      <FileImage className="h-4 w-4 text-pbs-red shrink-0" />
                      <span className="text-sm text-pbs-gray-700 dark:text-pbs-gray-300 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeLogo(i)}
                        className="p-1 rounded-lg text-pbs-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {logoFiles.length < 3 && (
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-pbs-gray-300 dark:border-pbs-gray-600 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 hover:border-pbs-red hover:text-pbs-red cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading...' : `Choose file${logoFiles.length > 0 ? ` (${3 - logoFiles.length} remaining)` : 's'}`}
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
                    multiple
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

          </div>

          {/* Right — sticky summary */}
          {orderSummary}

        </div>
      </form>
    </div>
  );
}
