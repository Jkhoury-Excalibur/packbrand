// Exercises local HTTP handlers with isolated records; never submits a Shopify order.
import assert from 'node:assert/strict';
import { randomUUID, createHmac } from 'node:crypto';
import { MongoClient } from 'mongodb';

const base = process.argv[2] || 'http://localhost:3108';
if (new URL(base).hostname !== 'localhost') throw new Error('Use a local server for this synthetic webhook check.');
const client = new MongoClient(process.env.MONGODB_URI);
const cartId = randomUUID();
const checkoutId = randomUUID();
const purchased = { id: 'payment-verification', revision: randomUUID(), variantId: 'gid://shopify/ProductVariant/123', qty: 1 };
const newItem = { ...purchased, id: 'added-after-checkout', revision: randomUUID() };
const order = {
  financial_status: 'paid', admin_graphql_api_id: 'gid://shopify/Order/123',
  note_attributes: [{ name: '_pbs_checkout_id', value: checkoutId }],
  line_items: [{ variant_id: 123, quantity: 1 }],
};
let db;
async function sync(items) {
  const result = await fetch(`${base}/api/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cartId, items }) });
  assert.equal(result.status, 200);
}
async function deliver(payload, valid = true) {
  const body = JSON.stringify(payload);
  return fetch(`${base}/api/shopify/webhooks/orders-paid`, {
    method: 'POST', body,
    headers: {
      'Content-Type': 'application/json', 'x-shopify-topic': 'orders/paid',
      'x-shopify-shop-domain': process.env.SHOPIFY_STORE_DOMAIN,
      'x-shopify-hmac-sha256': createHmac('sha256', valid ? process.env.SHOPIFY_ADMIN_CLIENT_SECRET : 'forged').update(body).digest('base64'),
    },
  });
}
try {
  await client.connect();
  db = client.db(process.env.MONGODB_DATABASE);
  await db.collection('checkoutPayments').insertOne({
    _id: checkoutId, cartId, createdAt: new Date(),
    lines: [{ id: purchased.id, revision: purchased.revision, variantId: purchased.variantId, quantity: purchased.qty }],
  });
  await sync([purchased, newItem]);
  assert.equal((await deliver(order, false)).status, 401);
  assert.equal((await deliver({ ...order, financial_status: 'pending' })).status, 204);
  assert.equal((await db.collection('carts').findOne({ cartId })).items.length, 2);
  assert.equal((await deliver(order)).status, 204);
  let cart = await db.collection('carts').findOne({ cartId });
  assert.deepEqual(cart.items.map(item => item.id), [newItem.id]);
  assert.equal(cart.status, 'active');
  const status = await fetch(`${base}/api/cart/status?cartId=${cartId}`);
  assert.equal(status.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await status.json(), { paidItemRevisions: [purchased.revision] });
  await sync([purchased, newItem]);
  assert.deepEqual((await db.collection('carts').findOne({ cartId })).items.map(item => item.id), [newItem.id]);
  assert.equal((await deliver(order)).status, 204);
  const readded = { ...purchased, revision: randomUUID() };
  await Promise.all([sync([purchased, newItem]), deliver(order)]);
  assert.deepEqual((await db.collection('carts').findOne({ cartId })).items.map(item => item.id), [newItem.id]);
  await sync([readded]);
  assert.equal((await deliver(order)).status, 204);
  assert.equal((await db.collection('carts').findOne({ cartId })).items[0].revision, readded.revision);
  await sync([purchased]);
  cart = await db.collection('carts').findOne({ cartId });
  assert.equal(cart.items.length, 0);
  assert.equal(cart.status, 'completed');
  console.log('PASS: signed payment, rejected forgery/unpaid events, database and browser status, duplicate delivery, stale sync, later additions and empty-cart completion.');
} finally {
  if (db) {
    await db.collection('carts').deleteMany({ cartId });
    await db.collection('checkoutPayments').deleteOne({ _id: checkoutId });
  }
  await client.close();
}
