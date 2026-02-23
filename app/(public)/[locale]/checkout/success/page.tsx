'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CheckCircle, Package, Palette, Factory, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STEPS = [
  { icon: CheckCircle, label: 'Order Received',  desc: 'We\'ve got your order' },
  { icon: Palette,     label: 'Design Review',   desc: 'Our team reviews your artwork' },
  { icon: Factory,     label: 'Production',       desc: 'Your items are printed & made' },
  { icon: Truck,       label: 'Shipping',         desc: 'Delivered to your door' },
];

export default function OrderSuccessPage() {
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    setOrderNumber(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

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
          <h1 className="text-3xl font-bold text-pbs-gray-900 dark:text-white tracking-tight">Order Received!</h1>
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-2">We'll be in touch within 24 hours to confirm your order.</p>
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
          {/* Connector line */}
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
