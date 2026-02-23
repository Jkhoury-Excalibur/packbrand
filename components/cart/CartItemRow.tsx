'use client';

import { Package, X } from 'lucide-react';
import { useCartStore, type CartItem } from '@/lib/store/cart';

export function CartItemRow({ item }: { item: CartItem }) {
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 items-start py-5 border-b border-pbs-gray-100 dark:border-pbs-gray-800 last:border-0">
      {/* Icon thumbnail */}
      <div className="h-14 w-14 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center shrink-0">
        <Package className="h-7 w-7 text-pbs-gray-400 dark:text-pbs-gray-500" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-pbs-gray-900 dark:text-white leading-tight">{item.name}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-pbs-gray-500 dark:text-pbs-gray-400">
          {item.size && item.size !== 'Standard' && <span>Size: {item.size}</span>}
          <span>Qty: {item.qtyLabel}</span>
          <span>${item.unitPrice.toFixed(2)}/unit</span>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex items-start gap-3 shrink-0">
        <div className="text-right">
          <p className="font-bold text-pbs-gray-900 dark:text-white">
            ${item.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="p-1.5 rounded-lg text-pbs-gray-400 hover:text-pbs-red hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 transition-colors"
          aria-label={`Remove ${item.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
