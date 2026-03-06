'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { ShoppingCart, ArrowRight, Package, Truck, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCartStore } from '@/lib/store/cart';

const DEFAULT_QUANTITY_OPTIONS = [
  { label: '1–50 units',    qty: 25  },
  { label: '51–100 units',  qty: 75  },
  { label: '101–250 units', qty: 175 },
  { label: '251–500 units', qty: 375 },
  { label: '500+ units',    qty: 500 },
];

type PricingTier = {
  minQty: number;
  maxQty?: number;
  unitPrice: number;
};

// Only serializable fields — no LucideIcon, no methods
type ProductOptionsProps = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  sizes?: string[];
  basePrice: number;
  pricingTiers?: PricingTier[];
};

function buildTierOptions(tiers: PricingTier[]) {
  return tiers.map((tier) => {
    const label = tier.maxQty
      ? `${tier.minQty.toLocaleString()}–${tier.maxQty.toLocaleString()} units`
      : `${tier.minQty.toLocaleString()}+ units`;
    // Representative qty: midpoint of range, or minQty for open-ended tiers
    const qty = tier.maxQty
      ? Math.round((tier.minQty + tier.maxQty) / 2)
      : tier.minQty;
    return { label, qty, unitPrice: tier.unitPrice };
  });
}

export function ProductOptions({ id, name, categoryId, categoryName, sizes, basePrice, pricingTiers }: ProductOptionsProps) {
  const t = useTranslations('ProductDetail');

  const hasTiers = pricingTiers && pricingTiers.length > 0;
  const quantityOptions = hasTiers
    ? buildTierOptions(pricingTiers)
    : DEFAULT_QUANTITY_OPTIONS.map((o) => ({ ...o, unitPrice: basePrice }));

  const [selectedSize, setSelectedSize] = useState(sizes?.[0] ?? '');
  const [selectedQty, setSelectedQty] = useState(quantityOptions[0]);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const unitPrice = selectedQty.unitPrice;
  const lineTotal = unitPrice * selectedQty.qty;

  const handleAddToCart = () => {
    addItem({
      id: `${id}-${selectedSize || 'default'}`,
      productId: id,
      name,
      categoryId,
      categoryName,
      size: selectedSize || 'Standard',
      qtyLabel: selectedQty.label,
      qty: selectedQty.qty,
      unitPrice,
      lineTotal,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const trust = [
    { icon: Package, key: 'trustMoq' as const },
    { icon: Truck,   key: 'trustDelivery' as const },
    { icon: Users,   key: 'trustBilingual' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Size selector */}
      {sizes && sizes.length > 0 && (
        <div>
          <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-3">
            {t('sizeLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                  selectedSize === size
                    ? 'bg-pbs-red border-pbs-red text-white'
                    : 'border-pbs-gray-200 dark:border-pbs-gray-700 text-pbs-gray-700 dark:text-pbs-gray-300 hover:border-pbs-red hover:text-pbs-red dark:hover:border-pbs-red dark:hover:text-pbs-red',
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-3">
          {t('quantityLabel')}
        </p>
        <select
          value={selectedQty.label}
          onChange={(e) => {
            const found = quantityOptions.find((o) => o.label === e.target.value);
            if (found) setSelectedQty(found);
          }}
          className="w-full rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 px-4 py-3 text-sm text-pbs-gray-900 dark:text-white focus:outline-none focus:border-pbs-red transition-colors appearance-none cursor-pointer"
        >
          {quantityOptions.map((opt) => (
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Estimated price */}
      <div className="rounded-2xl bg-pbs-gray-50 dark:bg-pbs-gray-800/50 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest">Est. Total</p>
          <p className="text-2xl font-bold text-pbs-gray-900 dark:text-white mt-0.5">
            ${lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 text-right">
          ${unitPrice.toFixed(2)}<br />per unit
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        {/* Primary: Add to Cart */}
        <Button variant="primary" size="lg" className="w-full" onClick={handleAddToCart}>
          {added ? (
            <><Check className="mr-2 h-4 w-4" />Added to Cart!</>
          ) : (
            <><ShoppingCart className="mr-2 h-4 w-4" />{t('ctaAddToCart')}</>
          )}
        </Button>

        {/* Secondary: Bulk Quote */}
        <Link href="/contact" className="block">
          <Button variant="outline" size="lg" className="w-full">
            {t('ctaBulkQuote')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2 border-t border-pbs-gray-100 dark:border-pbs-gray-800">
        {trust.map(({ icon: Icon, key }) => (
          <div key={key} className="flex items-center gap-2">
            <div className="shrink-0 h-7 w-7 rounded-lg bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
              <Icon className="h-3.5 w-3.5 text-pbs-red" />
            </div>
            <span className="text-xs text-pbs-gray-600 dark:text-pbs-gray-400 font-medium">{t(key)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
