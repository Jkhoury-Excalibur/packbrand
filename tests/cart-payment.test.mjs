import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const persisted = new Map([['pbs-cart', JSON.stringify({ version: 3, state: {
  cartId: randomUUID(), items: [{ id: 'old-cart-item', qty: 1 }],
} })]]);
globalThis.localStorage = {
  getItem: key => persisted.get(key) ?? null,
  setItem: (key, value) => persisted.set(key, value),
  removeItem: key => persisted.delete(key),
};
globalThis.window = { localStorage: globalThis.localStorage };
globalThis.fetch = async () => new Response('{}');
const { useCartStore } = await import('../lib/store/cart.ts');

test('existing saved carts gain an item revision without losing their contents', () => {
  const item = useCartStore.getState().items[0];
  assert.equal(item.id, 'old-cart-item');
  assert.match(item.revision, /^[0-9a-f-]{36}$/);
});

test('opening checkout preserves the cart; payment clears only the matching addition', () => {
  useCartStore.setState({ items: [], awaitingPayment: false });
  useCartStore.getState().addItem({ id: 'purchased', qty: 1 });
  const purchased = useCartStore.getState().items[0];
  useCartStore.getState().trackCheckout();
  assert.equal(useCartStore.getState().items.length, 1);
  useCartStore.getState().addItem({ id: 'new-item', qty: 1 });
  useCartStore.getState().clearPaidItems([purchased.revision]);
  assert.deepEqual(useCartStore.getState().items.map(item => item.id), ['new-item']);
  useCartStore.getState().clearPaidItems([purchased.revision]);
  assert.equal(useCartStore.getState().items.length, 1);
});

test('a delayed or repeated payment does not clear a re-added copy of the same product', () => {
  useCartStore.setState({ items: [] });
  useCartStore.getState().addItem({ id: 'same-product', qty: 1 });
  const original = useCartStore.getState().items[0];
  useCartStore.getState().removeItem(original.id);
  useCartStore.getState().addItem({ id: original.id, qty: 1 });
  useCartStore.getState().clearPaidItems([original.revision]);
  assert.equal(useCartStore.getState().items.length, 1);
  const replacement = useCartStore.getState().items[0];
  assert.notEqual(replacement.revision, original.revision);
  useCartStore.getState().clearPaidItems([replacement.revision]);
  assert.equal(useCartStore.getState().items.length, 0);
  assert.equal(useCartStore.getState().awaitingPayment, false);
});
