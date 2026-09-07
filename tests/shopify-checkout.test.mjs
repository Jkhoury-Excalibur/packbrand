import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createShopifyCheckout } from '../lib/shopify/checkout-data.ts';

const variantId = 'gid://shopify/ProductVariant/123';
const input = { lines: [{ variantId, quantity: 1 }] };
const variant = { id: variantId, availableForSale: true, quantityRule: { minimum: 1, maximum: null, increment: 1 } };

test('checkout attaches only server-generated payment correlation while preserving artwork', async () => {
  const { request, calls } = mock();
  await createShopifyCheckout(request, { ...input, checkoutId: 'forged', logoUrls: ['https://artwork.example/logo.png'] }, undefined, 'server-checkout');
  assert.deepEqual(calls[1].variables.input.attributes, [
    { key: 'Artwork 1', value: 'https://artwork.example/logo.png' },
    { key: '_pbs_checkout_id', value: 'server-checkout' },
  ]);
});

test('checkout prefills only the server-supplied verified email, ignoring client buyer identity', async () => {
  const { request, calls } = mock();
  await createShopifyCheckout(request, { ...input, buyerIdentity: { email: 'forged@example.com' } }, 'verified@example.com');
  assert.deepEqual(calls[1].variables.input.buyerIdentity, { email: 'verified@example.com' });
  const guest = mock();
  await createShopifyCheckout(guest.request, { ...input, buyerIdentity: { email: 'forged@example.com' } });
  assert.equal('buyerIdentity' in guest.calls[1].variables.input, false);
});
function mock({ nodes = [variant], warnings = [], userErrors = [], accepted, url = 'https://store.example/checkouts/test', nullCart = false } = {}) {
  const calls = [];
  const request = async (query, variables) => {
    calls.push({ query, variables });
    if (query.includes('CheckoutValidation')) return { nodes, shop: { primaryDomain: { url: 'https://store.example' } } };
    return { cartCreate: { warnings, userErrors, cart: nullCart ? null : {
      checkoutUrl: url,
      lines: { nodes: accepted ?? variables.input.lines.map(l => ({ quantity: l.quantity, merchandise: { id: l.merchandiseId } })), pageInfo: { hasNextPage: false } },
    } } };
  };
  return { request, calls };
}

test('one bulk variant stays one complete batch; client-supplied prices never enter the Shopify cart', async () => {
  const { request, calls } = mock();
  const result = await createShopifyCheckout(request, {
    ...input, lines: [{ variantId, quantity: 1, unitPrice: 0.01, lineTotal: 0.01 }],
    note: 'Use the attached logo.', logoUrls: ['https://artwork.example/logo.png'], locale: 'es',
  });
  assert.equal(result.checkoutUrl, 'https://store.example/checkouts/test');
  assert.deepEqual(calls[1].variables.input, {
    lines: [{ merchandiseId: variantId, quantity: 1 }], note: 'Use the attached logo.',
    attributes: [{ key: 'Artwork 1', value: 'https://artwork.example/logo.png' }],
  });
  assert.equal(calls[0].variables.language, 'ES');
  assert.equal(calls[1].variables.language, 'ES');
});

test('rejects empty, legacy, fractional, negative, zero and excessively large carts before contacting Shopify', async () => {
  for (const invalid of [{ lines: [] }, { lines: [{ variantId: 'mongo-id', quantity: 1 }] }, ...[0, -1, 0.5, 2147483648].map(quantity => ({ lines: [{ variantId, quantity }] })), { lines: Array(101).fill(input.lines[0]) }]) {
    await assert.rejects(createShopifyCheckout(async () => assert.fail('No network request expected'), invalid), { code: 'INVALID_CART' });
  }
});

test('combines repeated variant IDs before validating quantity rules', async () => {
  const { request, calls } = mock();
  await createShopifyCheckout(request, { lines: [input.lines[0], { variantId, quantity: 2 }] });
  assert.deepEqual(calls[1].variables.input.lines, [{ merchandiseId: variantId, quantity: 3 }]);
});

test('rejects removed or sold-out products using a fresh read before creating checkout', async () => {
  for (const nodes of [[null], [], [{ ...variant, availableForSale: false }]]) {
    const { request, calls } = mock({ nodes });
    await assert.rejects(createShopifyCheckout(request, input), { code: 'UNAVAILABLE' });
    assert.equal(calls.length, 1);
  }
});

test('enforces live minimum, maximum and quantity increments', async () => {
  for (const quantity of [1, 3, 8]) {
    const { request, calls } = mock({ nodes: [{ ...variant, quantityRule: { minimum: 2, maximum: 6, increment: 2 } }] });
    await assert.rejects(createShopifyCheckout(request, { lines: [{ variantId, quantity }] }), { code: 'QUANTITY' });
    assert.equal(calls.length, 1);
  }
  const { request } = mock({ nodes: [{ ...variant, quantityRule: { minimum: 2, maximum: 6, increment: 2 } }] });
  await createShopifyCheckout(request, { lines: [{ variantId, quantity: 4 }] });
});

test('does not redirect when Shopify reports warnings, errors or no cart', async () => {
  for (const options of [{ warnings: [{ code: 'MERCHANDISE_NOT_ENOUGH_STOCK' }] }, { userErrors: [{ code: 'INVALID' }] }, { nullCart: true }]) {
    await assert.rejects(createShopifyCheckout(mock(options).request, input), { code: 'CART_CHANGED' });
  }
});

test('does not redirect to a partial or silently adjusted cart', async () => {
  for (const accepted of [[], [{ quantity: 2, merchandise: { id: variantId } }], [{ quantity: 1, merchandise: { id: 'gid://shopify/ProductVariant/999' } }]]) {
    await assert.rejects(createShopifyCheckout(mock({ accepted }).request, input), { code: 'CART_CHANGED' });
  }
});

test('rejects unsafe checkout destinations', async () => {
  for (const url of ['http://store.example/checkouts/test', 'https://attacker.example/pay', 'https://store.example@attacker.example/pay']) {
    await assert.rejects(createShopifyCheckout(mock({ url }).request, input), { code: 'CHECKOUT_UNAVAILABLE' });
  }
});

test('transport failures propagate to the action boundary without creating another cart', async () => {
  let calls = 0;
  await assert.rejects(createShopifyCheckout(async () => { calls++; throw new Error('Network unavailable'); }, input));
  assert.equal(calls, 1);
});
