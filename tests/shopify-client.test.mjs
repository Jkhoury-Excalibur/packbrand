import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { shopifyStorefront } from '../lib/shopify/client.ts';

const originalFetch = globalThis.fetch;
const keys = ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_PRIVATE_TOKEN', 'SHOPIFY_STOREFRONT_API_VERSION'];
const originalEnvironment = Object.fromEntries(keys.map(key => [key, process.env[key]]));
function configure() {
  process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
  process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN = 'test-private-token';
  process.env.SHOPIFY_STOREFRONT_API_VERSION = '2026-07';
}
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (originalEnvironment[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnvironment[key];
  }
});

test('sends the private token only to the canonical Shopify host and disables redirects/caching', async () => {
  configure();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://test-store.myshopify.com/api/2026-07/graphql.json');
    assert.equal(options.headers['Shopify-Storefront-Private-Token'], 'test-private-token');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.deepEqual(JSON.parse(options.body).variables, { first: 5 });
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ data: { shop: { name: 'Test Store' } } });
  };
  assert.deepEqual(await shopifyStorefront('query Test { shop { name } }', { first: 5 }), { shop: { name: 'Test Store' } });
});

test('rejects missing credentials and non-Shopify hosts before making a request', async () => {
  configure();
  globalThis.fetch = async () => { assert.fail('Must not send a request'); };
  process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com.attacker.test';
  await assert.rejects(shopifyStorefront('query { shop { name } }'), { code: 'CONFIGURATION' });
  process.env.SHOPIFY_STORE_DOMAIN = 'test-store.myshopify.com';
  delete process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  await assert.rejects(shopifyStorefront('query { shop { name } }'), { code: 'CONFIGURATION' });
});

test('rejects invalid API versions before making a request', async () => {
  configure();
  process.env.SHOPIFY_STOREFRONT_API_VERSION = 'unstable';
  globalThis.fetch = async () => { assert.fail('Must not send a request'); };
  await assert.rejects(shopifyStorefront('query { shop { name } }'), { code: 'CONFIGURATION' });
});

test('rejects HTTP and GraphQL failures without returning partial data or upstream secrets', async () => {
  configure();
  globalThis.fetch = async () => new Response('test-private-token', { status: 401 });
  await assert.rejects(shopifyStorefront('query { shop { name } }'), { code: 'HTTP', status: 401 });
  globalThis.fetch = async () => Response.json({ data: { shop: null }, errors: [{ message: 'test-private-token' }] });
  await assert.rejects(shopifyStorefront('query { shop { name } }'), error => {
    assert.equal(error.code, 'GRAPHQL');
    assert.ok(!error.message.includes('test-private-token'));
    return true;
  });
});

test('rejects invalid JSON, missing data, and null envelopes', async () => {
  configure();
  for (const response of [new Response('<html>'), Response.json({}), Response.json(null)]) {
    globalThis.fetch = async () => response;
    await assert.rejects(shopifyStorefront('query { shop { name } }'), { code: 'INVALID_RESPONSE' });
  }
});

test('sanitizes network failures without exposing the original request', async () => {
  configure();
  globalThis.fetch = async () => { throw new Error('test-private-token'); };
  await assert.rejects(shopifyStorefront('query { shop { name } }'), error => {
    assert.equal(error.code, 'NETWORK');
    assert.ok(!error.message.includes('test-private-token'));
    assert.equal(error.cause, undefined);
    return true;
  });
});
