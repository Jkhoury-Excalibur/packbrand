'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { getCheckoutStatus } from '@/lib/actions/orders';
import { Link } from '@/i18n/navigation';
import {
  CheckCircle, Package, Palette, Factory, Truck,
  ArrowRight, ShoppingBag, Loader2, XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STEPS = [
  { icon: CheckCircle, label: 'Payment Confirmed', desc: 'Your payment was successful' },
  { icon: Palette,     label: 'Design Review',     desc: 'Our team reviews your artwork' },
  { icon: Factory,     label: 'Production',         desc: 'Your items are printed & made' },
  { icon: Truck,       label: 'Shipping',           desc: 'Delivered to your door' },
];

type Status = 'loading' | 'active' | 'checkout' | 'completed' | 'failed' | 'not_found';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') ?? '';
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<Status>('loading');
  const [orderNumber, setOrderNumber] = useState('');

  const checkStatus = useCallback(async () => {
    if (!sessionId) { setStatus('not_found'); return; }
    const result = await getCheckoutStatus(sessionId);
    setStatus(result.status);
    if (result.orderNumber) setOrderNumber(result.orderNumber);
  }, [sessionId]);

  // Initial check
  useEffect(() => { checkStatus(); }, [checkStatus]);

  // Poll every 3s while still processing
  useEffect(() => {
    if (status !== 'checkout' && status !== 'loading' && status !== 'active') return;
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [status, checkStatus]);

  // Clear cart once completed
  useEffect(() => {
    if (status === 'completed') clearCart();
  }, [status, clearCart]);

  // --- Loading ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <Loader2 className="h-12 w-12 text-pbs-red animate-spin" />
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400">Checking payment status…</p>
      </div>
    );
  }

  // --- Checkout (webhook hasn't processed yet) ---
  if (status === 'checkout') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Processing Payment…</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
            We&apos;re confirming your payment. This usually takes a few seconds.
          </p>
        </div>
      </div>
    );
  }

  // --- Failed ---
  if (status === 'failed' || status === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Payment Failed</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
            Your payment could not be processed. Please try again.
          </p>
        </div>
        <Link href="/checkout">
          <Button variant="primary" size="lg">Return to Checkout</Button>
        </Link>
      </div>
    );
  }

  // --- Completed (success) ---
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">

      {/* Hero card */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-3xl p-8 sm:p-12 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <CheckCircle className="h-9 w-9 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Order Confirmed!</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">Your payment has been processed. Here&apos;s what happens next.</p>
        </div>
        {orderNumber && (
          <div className="inline-flex items-center gap-2 bg-white dark:bg-pbs-gray-900 border border-pbs-gray-200 dark:border-pbs-gray-700 rounded-2xl px-5 py-3">
            <Package className="h-4 w-4 text-pbs-red shrink-0" />
            <span className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400">Order number:</span>
            <span className="font-mono font-bold text-pbs-gray-900 dark:text-white">{orderNumber}</span>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 p-6 sm:p-8">
        <h2 className="text-base font-bold text-pbs-gray-900 dark:text-white mb-8">What happens next</h2>

        <div className="relative">
          <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-pbs-gray-100 dark:bg-pbs-gray-800" aria-hidden="true" />

          <div className="space-y-6">
            {STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="relative flex gap-4 items-start">
                <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center z-10 ${
                  i === 0
                    ? 'bg-pbs-red text-white'
                    : 'bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-400 dark:text-pbs-gray-500'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="pt-1.5">
                  <p className={`font-semibold text-sm ${i === 0 ? 'text-pbs-red' : 'text-pbs-gray-900 dark:text-white'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/products" className="flex-1">
          <Button variant="primary" size="lg" className="w-full">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
        <Link href="/account/orders" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            View My Orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
