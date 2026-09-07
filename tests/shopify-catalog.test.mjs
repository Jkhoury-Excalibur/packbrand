import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCollections, loadProductPage, loadProduct, loadVariants } from '../lib/shopify/catalog-data.ts';

test('collections include all pages and retain Shopify handles and authored titles', async () => {
  const calls = [];
  const request = async (_query, variables) => {
    calls.push(variables);
    return { collections: variables.after === null
      ? { nodes: [{ id: 'one', handle: 'frontpage', title: 'Home page' }], pageInfo: { hasNextPage: true, endCursor: 'next' } }
      : { nodes: [{ id: 'two', handle: 'custom-bags', title: 'Bolsas | Bags' }], pageInfo: { hasNextPage: false, endCursor: 'last' } } };
  };
  assert.deepEqual((await loadCollections(request, 'es')).map(c => c.handle), ['frontpage', 'custom-bags']);
  assert.deepEqual(calls, [{ after: null, language: 'ES' }, { after: 'next', language: 'ES' }]);
});

test('pagination errors fail instead of caching an incomplete category list', async () => {
  await assert.rejects(loadCollections(async () => ({ collections: { nodes: [], pageInfo: { hasNextPage: true, endCursor: null } } }), 'en'), /pagination cursor/);
});

test('category results come from the collection membership and forward its pagination cursor', async () => {
  const product = { id: 'product-in-two-collections', handle: 'paper-bags' };
  const request = async (query, variables) => {
    assert.match(query, /collection\(handle: \$handle\)/);
    assert.equal(variables.handle, 'for-restaurants');
    assert.equal(variables.after, 'page-2');
    return { collection: { products: { nodes: [product], pageInfo: { hasNextPage: false, endCursor: 'end' } } } };
  };
  const result = await loadProductPage(request, 'en', 'for-restaurants', 'page-2');
  assert.deepEqual(result.nodes, [product]);
});

test('missing collections do not silently display unrelated products', async () => {
  assert.equal(await loadProductPage(async () => ({ collection: null }), 'en', 'missing', null), null);
  assert.equal(await loadProduct(async () => ({ product: null }), 'en', 'missing'), null);
});

test('empty collections remain empty and the all-products view uses the catalog query', async () => {
  const emptyPage = { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
  assert.deepEqual(await loadProductPage(async () => ({ collection: { products: emptyPage } }), 'en', 'empty', null), emptyPage);
  await loadProductPage(async (query, variables) => {
    assert.match(query, /query CatalogProducts/);
    assert.equal(variables.language, 'EN');
    return { products: emptyPage };
  }, 'en', null, null);
});

test('variant pagination preserves Shopify pack pricing and sold-out status', async () => {
  const pack = { id: 'variant-1', title: '3,000 units', price: { amount: '1470.0', currencyCode: 'USD' }, availableForSale: true, quantityRule: { minimum: 1, maximum: null, increment: 1 } };
  const soldOut = { ...pack, id: 'variant-2', availableForSale: false };
  const result = await loadVariants(async (_query, { after }) => ({ product: { variants: after === null
    ? { nodes: [pack], pageInfo: { hasNextPage: true, endCursor: 'next' } }
    : { nodes: [soldOut], pageInfo: { hasNextPage: false, endCursor: 'last' } } } }), 'en', 'paper-bags');
  assert.deepEqual(result, [pack, soldOut]);
});

test('API errors propagate instead of being converted into a cached empty catalog', async () => {
  const failure = new Error('Unavailable');
  await assert.rejects(loadCollections(async () => { throw failure; }, 'en'), error => error === failure);
});
