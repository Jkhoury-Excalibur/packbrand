'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Loader2 } from 'lucide-react';

function PaymentCompleteContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') ?? '';
  const locale = useLocale();

  useEffect(() => {
    const successUrl = `/${locale}/checkout/success?session=${sessionId}`;

    const timer = setTimeout(() => {
      if (window.top && window.top !== window) {
        window.top.location.href = successUrl;
      } else {
        window.location.href = successUrl;
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [sessionId, locale]);

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
