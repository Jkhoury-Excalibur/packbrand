import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;          // `${productId}-${size}` for uniqueness
  productId: number;
  name: string;
  category: string;
  size: string;
  qtyLabel: string;    // display string e.g. "251–500 units"
  qty: number;         // numeric e.g. 375
  unitPrice: number;
  lineTotal: number;   // unitPrice × qty
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            // Replace with new selection (same product+size, different qty)
            return {
              items: state.items.map((i) =>
                i.id === item.id ? item : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'pbs-cart' },
  ),
);
