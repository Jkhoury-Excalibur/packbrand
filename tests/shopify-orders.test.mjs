import test from 'node:test';
import assert from 'node:assert/strict';
import { loadCustomerOrders, loadOwnedOrder, ownsShopifyOrder, reorderInput } from '../lib/shopify/orders-data.ts';

const owned = {
  id: 'gid://shopify/Order/100', email: 'buyer@example.com', note: 'Use approved artwork',
  customAttributes: [{ key: 'Artwork 1', value: 'https://example.com/logo.png' }],
  lineItems: { nodes: [{ id: 'line1', title: 'Custom bags', quantity: 2, variant: { id: 'gid://shopify/ProductVariant/123' } }], pageInfo: { hasNextPage: false } },
};

test('only an exact verified email owns an order; guest orders without email are private', () => {
  assert.equal(ownsShopifyOrder(owned, 'BUYER@example.com', true), true);
  for (const [order, email, verified] of [[owned, 'buyer@example.com', false], [owned, 'other@example.com', true], [{ email: null }, 'buyer@example.com', true], [{ email: '' }, '', true]]) {
    assert.equal(ownsShopifyOrder(order, email, verified), false);
  }
});

test('search results are filtered for exact ownership and pagination is retained', async () => {
  const pageInfo = { hasNextPage: true, endCursor: 'next-page' };
  const result = await loadCustomerOrders(async (_query, variables) => {
    assert.equal(variables.query, 'email:"buyer@example.com"');
    assert.equal(variables.after, 'previous-page');
    return { orders: { nodes: [owned, { ...owned, email: 'other@example.com' }], pageInfo } };
  }, 'buyer@example.com', true, 'previous-page');
  assert.deepEqual(result.nodes, [owned]);
  assert.deepEqual(result.pageInfo, pageInfo);
});

test('unverified accounts never request order data', async () => {
  await assert.rejects(() => loadCustomerOrders(() => assert.fail('Must not call Shopify'), 'buyer@example.com', false, null), /EMAIL_UNVERIFIED/);
});

test('reordering fetches the order server-side and rejects another customer or a forged ID', async () => {
  assert.deepEqual(await loadOwnedOrder(async () => ({ order: owned }), owned.id, 'buyer@example.com', true), owned);
  await assert.rejects(() => loadOwnedOrder(async () => ({ order: owned }), owned.id, 'other@example.com', true), /ORDER_NOT_FOUND/);
  await assert.rejects(() => loadOwnedOrder(() => assert.fail('Must not call Shopify'), 'invalid', 'buyer@example.com', true), /ORDER_NOT_FOUND/);
  await assert.rejects(() => loadOwnedOrder(async () => ({ order: null }), owned.id, 'buyer@example.com', true), /ORDER_NOT_FOUND/);
});

test('reorder retains batch counts, artwork and notes, never copies historical prices', () => {
  const input = reorderInput(owned, 'en');
  assert.deepEqual(input.lines, [{ variantId: 'gid://shopify/ProductVariant/123', quantity: 2 }]);
  assert.equal(input.note, owned.note);
  assert.deepEqual(input.logoUrls, ['https://example.com/logo.png']);
  assert.equal('price' in input.lines[0], false);
});

test('deleted variants, empty orders and incomplete line lists cannot create partial reorders', () => {
  for (const lineItems of [
    { nodes: [], pageInfo: { hasNextPage: false } },
    { nodes: [{ ...owned.lineItems.nodes[0], variant: null }], pageInfo: { hasNextPage: false } },
    { ...owned.lineItems, pageInfo: { hasNextPage: true } },
  ]) assert.throws(() => reorderInput({ ...owned, lineItems }, 'en'), /REORDER_UNAVAILABLE/);
});
