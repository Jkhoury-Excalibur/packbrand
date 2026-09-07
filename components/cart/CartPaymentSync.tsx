'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';

/** Refresh persisted browser carts after the paid webhook, including return via Back/bfcache. */
export function CartPaymentSync() {
  useEffect(() => {
    let checking = false;
    const controller = new AbortController();
    async function reconcile() {
      const { cartId, items, awaitingPayment } = useCartStore.getState();
      if (checking || !awaitingPayment || !cartId || !items.length || document.visibilityState === 'hidden') return;
      checking = true;
      try {
        const response = await fetch(`/api/cart/status?cartId=${encodeURIComponent(cartId)}`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && useCartStore.getState().cartId === cartId
          && Array.isArray(data.paidItemRevisions) && data.paidItemRevisions.every((value: unknown) => typeof value === 'string')) {
          useCartStore.getState().clearPaidItems(data.paidItemRevisions);
        }
      } catch { /* Preserve the cart while offline or if payment confirmation is delayed. */ }
      finally { checking = false; }
    }
    async function refreshOtherTab(event: StorageEvent) {
      if (event.key !== 'pbs-cart') return;
      await useCartStore.persist?.rehydrate();
      void reconcile();
    }
    void reconcile();
    const unsubscribe = useCartStore.persist?.onFinishHydration(() => void reconcile());
    const timer = window.setInterval(reconcile, 15000);
    window.addEventListener('pageshow', reconcile);
    window.addEventListener('focus', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    window.addEventListener('storage', refreshOtherTab);
    return () => {
      controller.abort();
      unsubscribe?.();
      window.clearInterval(timer);
      window.removeEventListener('pageshow', reconcile);
      window.removeEventListener('focus', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
      window.removeEventListener('storage', refreshOtherTab);
    };
  }, []);
  return null;
}
