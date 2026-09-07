import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;          // `${productId}-${size}` for uniqueness
  revision?: string;   // Identifies this addition, so payment cannot clear a later re-add.
  productId: string;
  variantId?: string;  // Shopify's sellable variant, including any pack/quantity option
  name: string;
  categoryId: string;
  categoryName: string;
  size: string;
  qtyLabel: string;    // display string e.g. "251–500 units"
  qty: number;         // numeric e.g. 375
  unitPrice: number;
  lineTotal: number;   // unitPrice × qty
};

type CartStore = {
  cartId: string;
  items: CartItem[];
  awaitingPayment: boolean;
  trackCheckout: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  clearPaidItems: (revisions: string[]) => void;
};

function generateCartId(): string {
  return crypto.randomUUID();
}

let syncTimer: ReturnType<typeof setTimeout> | null = null;

function syncToServer(cartId: string, items: CartItem[]) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId, items }),
    }).catch((err) => {
      console.error('[cart] Sync failed:', err);
    });
  }, 500);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartId: '',
      items: [],
      awaitingPayment: false,
      trackCheckout: () => set({ awaitingPayment: true }),

      addItem: (item) =>
        set((state) => {
          item = { ...item, revision: crypto.randomUUID() };
          const existing = state.items.find((i) => i.id === item.id);
          const newItems = existing
            ? state.items.map((i) => (i.id === item.id ? item : i))
            : [...state.items, item];
          syncToServer(state.cartId, newItems);
          return { items: newItems };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          syncToServer(state.cartId, newItems);
          return { items: newItems };
        }),

      clearCart: () => {
        const { cartId } = get();
        syncToServer(cartId, []);
        set({ items: [] });
      },
      clearPaidItems: (revisions) => {
        const { cartId, items } = get();
        const paid = new Set(revisions);
        const remaining = items.filter(item => !item.revision || !paid.has(item.revision));
        if (remaining.length === items.length) return;
        syncToServer(cartId, remaining);
        set({ items: remaining, awaitingPayment: remaining.length > 0 });
      },
    }),
    {
      name: 'pbs-cart',
      version: 4,
      migrate: (persisted) => {
        const state = persisted as Record<string, unknown>;
        return {
          items: Array.isArray(state.items) ? state.items.map(item => ({ ...item, revision: item.revision || generateCartId() })) : [],
          cartId: (state.cartId as string) || generateCartId(),
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state && !state.cartId) {
          state.cartId = generateCartId();
        }
      },
    },
  ),
);
