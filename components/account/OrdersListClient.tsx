'use client';

import { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CustomerOrder } from '@/lib/shopify/orders-data';
import { reorderShopifyOrder } from '@/lib/actions/reorder';

function statusLabel(status: string | null) {
  return (status || '').toLowerCase().replaceAll('_', ' ');
}

export function OrdersListClient({ orders }: { orders: CustomerOrder[] }) {
  const locale = useLocale() === 'es' ? 'es' : 'en';
  const es = locale === 'es';
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState('');
  if (!orders.length) return <div className="border rounded-2xl p-10 text-center space-y-4"><p>{es ? 'No hay pedidos en esta página.' : 'No orders found on this page.'}</p><Link className="text-pbs-red" href="/products">{es ? 'Ver productos' : 'Browse products'}</Link></div>;
  return <div className="space-y-4">
    {error && <p role="alert" className="border border-pbs-red rounded-xl p-4">{error}</p>}
    {orders.map(order => {
      const money = order.totalPriceSet.shopMoney;
      const reorderable = !order.lineItems.pageInfo.hasNextPage && order.lineItems.nodes.length > 0 && order.lineItems.nodes.every(item => item.variant);
      return <article key={order.id} className="border border-pbs-gray-200 dark:border-pbs-gray-800 bg-white dark:bg-pbs-gray-900 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold text-lg">{order.name}</h2><p className="text-sm text-pbs-gray-500">{new Date(order.createdAt).toLocaleDateString(es ? 'es-US' : 'en-US', { timeZone: 'America/New_York' })}</p></div><p className="font-bold">{new Intl.NumberFormat(locale, { style: 'currency', currency: money.currencyCode }).format(Number(money.amount))}</p></div>
        <div className="flex flex-wrap gap-2 text-xs capitalize">{[order.cancelledAt ? (es ? 'Cancelado' : 'Cancelled') : null, statusLabel(order.displayFinancialStatus), statusLabel(order.displayFulfillmentStatus)].filter(Boolean).map(status => <span key={status} className="rounded-full px-3 py-1 bg-pbs-gray-100 dark:bg-pbs-gray-800">{status}</span>)}</div>
        <ul className="divide-y divide-pbs-gray-200 dark:divide-pbs-gray-800">{order.lineItems.nodes.map(item => <li key={item.id} className="py-3"><p className="font-medium">{item.title}</p><p className="text-sm text-pbs-gray-500">{item.quantity} × {item.variantTitle && item.variantTitle !== 'Default Title' ? item.variantTitle : (es ? 'unidad' : 'item')}</p></li>)}</ul>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between"><p className="text-xs text-pbs-gray-500">{es ? 'Revisa los precios y la disponibilidad actuales antes de pagar.' : 'Review current prices and availability before paying.'}</p><button disabled={pending || !reorderable} className="bg-pbs-red rounded-xl text-white py-2 px-5 text-sm font-semibold disabled:opacity-50 shrink-0" onClick={() => {
          setActiveId(order.id); setError('');
          startTransition(async () => {
            try {
              const result = await reorderShopifyOrder(order.id, locale);
              if ('error' in result) { setError(es ? 'No se puede repetir este pedido ahora. Revisa los productos y las cantidades disponibles en el catálogo.' : result.error); return; }
              window.location.assign(result.checkoutUrl);
            } catch { setError(es ? 'Inténtalo de nuevo en unos momentos.' : 'Please try again in a moment.'); }
          });
        }}>{pending && activeId === order.id ? (es ? 'Preparando…' : 'Preparing…') : (es ? 'Volver a pedir' : 'Reorder')}</button></div>
        {!reorderable && <p className="text-sm text-pbs-gray-500">{es ? 'Este pedido necesita una nueva selección de productos.' : 'This order needs a new product selection.'} <Link href="/products" className="text-pbs-red">{es ? 'Ver catálogo' : 'Browse catalog'}</Link></p>}
      </article>;
    })}
  </div>;
}
