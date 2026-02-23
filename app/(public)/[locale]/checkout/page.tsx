'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';

const INPUT_CLS = 'w-full px-4 py-3 rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 text-pbs-gray-900 dark:text-white text-sm focus:outline-none focus:border-pbs-red transition-colors';
const LABEL_CLS = 'block text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-2';

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    router.push('/checkout/success');
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Checkout</h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">Complete your order details below.</p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left column — forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Information */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className={LABEL_CLS}>First Name</label>
                  <input id="firstName" type="text" required placeholder="Maria" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="lastName" className={LABEL_CLS}>Last Name</label>
                  <input id="lastName" type="text" required placeholder="Lopez" className={INPUT_CLS} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={LABEL_CLS}>Email Address</label>
                  <input id="email" type="email" required placeholder="maria@example.com" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="phone" className={LABEL_CLS}>Phone Number</label>
                  <input id="phone" type="tel" placeholder="(555) 000-0000" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="company" className={LABEL_CLS}>Company Name</label>
                  <input id="company" type="text" placeholder="Your Business" className={INPUT_CLS} />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label htmlFor="address1" className={LABEL_CLS}>Address Line 1</label>
                  <input id="address1" type="text" required placeholder="123 Main Street" className={INPUT_CLS} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address2" className={LABEL_CLS}>Address Line 2 <span className="normal-case font-normal">(optional)</span></label>
                  <input id="address2" type="text" placeholder="Suite, floor, unit..." className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="city" className={LABEL_CLS}>City</label>
                  <input id="city" type="text" required placeholder="New York" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="state" className={LABEL_CLS}>State</label>
                  <input id="state" type="text" required placeholder="NY" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="zip" className={LABEL_CLS}>ZIP Code</label>
                  <input id="zip" type="text" required placeholder="10001" className={INPUT_CLS} />
                </div>
                <div>
                  <label htmlFor="country" className={LABEL_CLS}>Country</label>
                  <input id="country" type="text" defaultValue="United States" className={INPUT_CLS} />
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
                  rows={4}
                  placeholder="e.g. Please use Pantone 485 for the logo. Artwork file will be emailed separately..."
                  className={`${INPUT_CLS} resize-none`}
                />
              </div>
            </div>

          </div>

          {/* Right — sticky summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 space-y-5">
              <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Order Summary</h2>

              {/* Items */}
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
                  <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-pbs-gray-900 dark:text-white text-base border-t border-pbs-gray-100 dark:border-pbs-gray-800 pt-2">
                  <span>Total</span>
                  <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Place Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 text-center leading-relaxed">
                We'll send you an invoice after confirming your order details.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
