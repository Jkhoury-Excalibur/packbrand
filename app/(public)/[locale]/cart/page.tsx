'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          <div className="h-24 w-24 rounded-3xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-pbs-gray-300 dark:text-pbs-gray-600" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Your cart is empty</h1>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">Browse our products and add items to get started.</p>
          </div>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Your Cart</h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-1">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Item list */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 px-6">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400 hover:text-pbs-red transition-colors"
            >
              <Package className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 space-y-5">
            <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-pbs-gray-600 dark:text-pbs-gray-400">
                <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-pbs-gray-600 dark:text-pbs-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
              </div>
              <div className="border-t border-pbs-gray-100 dark:border-pbs-gray-800 pt-3 flex justify-between font-bold text-pbs-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 text-center leading-relaxed">
              Custom packaging — we'll confirm your order details before production begins.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
