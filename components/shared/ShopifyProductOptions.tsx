'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Check, ShoppingCart } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/store/cart';
import type { CatalogVariant } from '@/lib/shopify/catalog-data';

type Props = { productId: string; name: string; categoryId: string; categoryName: string; variants: CatalogVariant[] };

export function ShopifyProductOptions({ productId, name, categoryId, categoryName, variants }: Props) {
  const locale = useLocale();
  const es = locale === 'es';
  const [selectedId, setSelectedId] = useState(() => (variants.find(v => v.availableForSale) ?? variants[0])?.id ?? '');
  const selected = variants.find(v => v.id === selectedId) ?? variants[0];
  const [quantity, setQuantity] = useState(() => selected?.quantityRule.minimum ?? 1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  if (!selected) return <p>{es ? 'Este producto no está disponible.' : 'This product is currently unavailable.'}</p>;

  const { minimum, maximum, increment } = selected.quantityRule;
  const batchOption = selected.selectedOptions.find(option => /^(quantity|cantidad)$/i.test(option.name));
  const validQuantity = Number.isInteger(quantity) && quantity >= minimum && (maximum === null || quantity <= maximum) && (quantity - minimum) % increment === 0;
  const price = Number(selected.price.amount);
  const formatMoney = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: selected.price.currencyCode }).format(value);
  const variantLabel = selected.title === 'Default Title' ? 'Standard' : selected.selectedOptions.map(o => `${o.name}: ${o.value}`).join(' / ');

  function addToCart() {
    if (!selected?.availableForSale || !validQuantity) return;
    addItem({
      id: selected.id,
      variantId: selected.id,
      productId,
      name,
      categoryId: categoryId || 'shopify',
      categoryName: categoryName || (es ? 'Productos' : 'Products'),
      size: variantLabel,
      qtyLabel: batchOption ? `${quantity} × ${batchOption.value}` : String(quantity),
      qty: quantity,
      unitPrice: price,
      lineTotal: Math.round(price * quantity * 100) / 100,
    });
    setAdded(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="shopify-variant" className="block text-sm font-semibold mb-2">{batchOption ? (es ? 'Cantidad por lote' : 'Quantity per batch') : (es ? 'Opción' : 'Option')}</label>
        <select id="shopify-variant" value={selected.id} onChange={event => {
          const variant = variants.find(v => v.id === event.target.value);
          if (variant) { setSelectedId(variant.id); setQuantity(variant.quantityRule.minimum); setAdded(false); }
        }} className="w-full rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 p-3">
          {variants.map(variant => <option key={variant.id} value={variant.id}>{variant.title === 'Default Title' ? (es ? 'Estándar' : 'Standard') : variant.title}{variant.availableForSale ? '' : (es ? ' — Agotado' : ' — Sold out')}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="shopify-quantity" className="block text-sm font-semibold mb-2">{batchOption ? (es ? 'Número de lotes completos' : 'Number of complete batches') : (es ? 'Cantidad' : 'Quantity')}</label>
        <input id="shopify-quantity" type="number" min={minimum} max={maximum ?? undefined} step={increment} value={Number.isNaN(quantity) ? '' : quantity} onChange={event => { setQuantity(event.target.valueAsNumber); setAdded(false); }} aria-invalid={!validQuantity} aria-describedby="shopify-quantity-help" className="w-full rounded-xl border-2 border-pbs-gray-200 dark:border-pbs-gray-700 bg-white dark:bg-pbs-gray-800 p-3" />
        <p id="shopify-quantity-help" className="mt-2 text-xs text-pbs-gray-500 dark:text-pbs-gray-400">{batchOption
          ? (es ? `Cada lote contiene ${batchOption.value}. Solo se venden lotes completos; no unidades individuales.` : `Each batch contains ${batchOption.value}. Sold in complete batches, not individual pieces.`)
          : (es ? 'El precio corresponde a la opción completa seleccionada.' : 'The price is for the complete selected option.')}</p>
      </div>
      <div className="rounded-2xl bg-pbs-gray-50 dark:bg-pbs-gray-800/50 p-5 flex justify-between items-center">
        <div><p className="text-sm">{es ? 'Total estimado' : 'Estimated total'}</p><p className="text-2xl font-bold">{formatMoney(price * (validQuantity ? quantity : minimum))}</p></div>
        <p className="text-sm text-right">{formatMoney(price)}<br />{batchOption ? (es ? 'por lote completo' : 'per complete batch') : (es ? 'por opción' : 'per option')}</p>
      </div>
      <p role="status" className="text-sm">{selected.availableForSale ? (es ? 'Disponible' : 'Available') : (es ? 'Agotado' : 'Sold out')}</p>
      <Button variant="primary" size="lg" className="w-full" disabled={!selected.availableForSale || !validQuantity} onClick={addToCart}>
        {added ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
        {added ? (es ? 'Añadido al carrito' : 'Added to cart') : (es ? 'Añadir al carrito' : 'Add to cart')}
      </Button>
      <Link href="/contact" className="block text-center text-pbs-red font-semibold">{es ? 'Solicitar una cotización' : 'Request a bulk quote'}</Link>
    </div>
  );
}
