'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

function PaymentCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const orderNumber = searchParams.get('order') ?? '';
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error && orderNumber) {
      clearCart();
      // Short delay to allow webhook to process before showing success page
      const timer = setTimeout(() => {
        router.replace(`/checkout/success?order=${orderNumber}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, orderNumber, clearCart, router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
        <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertCircle className="h-9 w-9 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Payment Failed</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
            Your payment could not be processed. Please try again.
          </p>
          {orderNumber && (
            <p className="text-sm text-pbs-gray-400 dark:text-pbs-gray-500 mt-1">
              Order reference: {orderNumber}
            </p>
          )}
        </div>
        <Link href="/checkout">
          <Button variant="primary" size="lg">Return to Checkout</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <Loader2 className="h-12 w-12 text-pbs-red animate-spin" />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-pbs-gray-900 dark:text-white">Processing Payment...</h1>
        <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">
          Please wait while we confirm your payment.
        </p>
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense>
      <PaymentCompleteContent />
    </Suspense>
  );
}
