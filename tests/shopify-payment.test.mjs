import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { verifyWebhook, parsePaidOrder, coversCheckout } from '../lib/shopify/payment-data.ts';

const checkoutId = randomUUID();
const order = {
  financial_status: 'paid', admin_graphql_api_id: 'gid://shopify/Order/123',
  note_attributes: [{ name: '_pbs_checkout_id', value: checkoutId }],
  line_items: [{ variant_id: 123, quantity: 2 }],
};

test('verifies the exact signed body and rejects missing, malformed and forged signatures', () => {
  const body = Buffer.from(JSON.stringify(order));
  const signature = createHmac('sha256', 'test-secret').update(body).digest('base64');
  assert.equal(verifyWebhook(body, signature, 'test-secret'), true);
  for (const bad of [null, '', 'x', signature.slice(1)]) assert.equal(verifyWebhook(body, bad, 'test-secret'), false);
  assert.equal(verifyWebhook(Buffer.concat([body, Buffer.from(' ')]), signature, 'test-secret'), false);
  assert.equal(verifyWebhook(body, signature, 'other-secret'), false);
});

test('only paid orders with website checkout correlation are accepted', () => {
  assert.equal(parsePaidOrder(order).checkoutId, checkoutId);
  for (const status of ['pending', 'authorized', 'partially_paid', 'refunded']) {
    assert.equal(parsePaidOrder({ ...order, financial_status: status }), null);
  }
  assert.equal(parsePaidOrder({ ...order, note_attributes: [] }), null);
  assert.equal(parsePaidOrder({ ...order, note_attributes: [{ name: '_pbs_checkout_id', value: {} }] }), null);
  assert.equal(parsePaidOrder(null), null);
});

test('a paid order must cover the checked-out variants and quantities, including duplicate lines', () => {
  const line = { id: 'a', revision: randomUUID(), variantId: 'gid://shopify/ProductVariant/123', quantity: 1 };
  const snapshot = { cartId: randomUUID(), lines: [line, { ...line, id: 'b' }] };
  assert.equal(coversCheckout(parsePaidOrder(order), snapshot), true);
  assert.equal(coversCheckout(parsePaidOrder({ ...order, line_items: [{ variant_id: 123, quantity: 1 }] }), snapshot), false);
  assert.equal(coversCheckout(parsePaidOrder({ ...order, line_items: [{ variant_id: 456, quantity: 2 }] }), snapshot), false);
});
