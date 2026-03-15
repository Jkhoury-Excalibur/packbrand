'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ShoppingBag, ArrowRight, CreditCard, Lock, ChevronLeft } from 'lucide-react';
import CardBrandLogos from '@/components/checkout/CardBrandLogos';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';
import { createOrderAndInitiatePayment } from '@/lib/actions/payment';

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
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [iframeUrl, setIframeUrl] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const items = useCartStore((s) => s.items);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingRate;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.target as HTMLFormElement;
    const get = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';

    const orderData = {
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
    };

    const result = await createOrderAndInitiatePayment(orderData);
    setSubmitting(false);

    if ('error' in result) {
      setError('Please fill in all required fields.');
      return;
    }

    setOrderNumber(result.orderNumber!);
    setIframeUrl(result.iframeUrl!);
    setStep('payment');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center gap-6 py-24">
        <ShoppingBag className="h-16 w-16 text-pbs-gray-300 dark:text-pbs-gray-600" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Nothing to check out</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">Add items to your cart first.</p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  // ── Order Summary (shared between both steps) ──
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

        {step === 'form' && (
          <>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Processing...' : 'Continue to Payment'}
              {!submitting && <CreditCard className="ml-2 h-4 w-4" />}
            </Button>

            <CardBrandLogos className="justify-center" />

            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 text-center leading-relaxed">
              By placing your order, you agree to our{' '}
              <Link href="/terms" className="text-pbs-red hover:underline font-medium">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-pbs-red hover:underline font-medium">Privacy Policy</Link>.
            </p>
          </>
        )}

        {step === 'payment' && (
          <div className="flex items-center justify-center gap-2 text-xs text-pbs-gray-500 dark:text-pbs-gray-400">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure payment powered by Enhanced Gateway</span>
          </div>
        )}
      </div>
    </div>
  );

  // ── Step 2: Payment Iframe ──
  if (step === 'payment') {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Details
          </button>
          <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Complete Payment</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Order {orderNumber} — Enter your card details below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <CardBrandLogos className="mb-4" />
            <iframe
              src={iframeUrl}
              className="w-full border-0 rounded-2xl bg-white dark:bg-pbs-gray-900 overflow-hidden"
              style={{ minHeight: '750px' }}
              title="Payment Form"
              scrolling="no"
              sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation"
            />
          </div>

          {orderSummary}
        </div>
      </div>
    );
  }

  // ── Step 1: Checkout Form ──
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Checkout</h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Complete your order details below.</p>
      </div>

      <form onSubmit={handleContinueToPayment}>
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

          </div>

          {/* Right — sticky summary */}
          {orderSummary}

        </div>
      </form>
    </div>
  );
}
