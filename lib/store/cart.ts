import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;          // `${productId}-${size}` for uniqueness
  productId: string;
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
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
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

      addItem: (item) =>
        set((state) => {
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
    }),
    {
      name: 'pbs-cart',
      version: 3,
      migrate: (persisted) => {
        const state = persisted as Record<string, unknown>;
        return {
          items: Array.isArray(state.items) ? state.items : [],
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
