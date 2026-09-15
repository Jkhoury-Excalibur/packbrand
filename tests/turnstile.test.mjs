import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyTurnstile } from '../lib/turnstile.ts';
import { captcha } from 'better-auth/plugins';

test('missing configuration and malformed tokens fail before contacting Cloudflare', async () => {
  const original = process.env.TURNSTILE_SECRET_KEY;
  const fetcher = globalThis.fetch;
  try {
    globalThis.fetch = () => assert.fail('No verification request expected');
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.equal(await verifyTurnstile('token', 'inquiry'), false);
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    for (const token of [undefined, null, '', ' ', {}, 'a'.repeat(2049)]) assert.equal(await verifyTurnstile(token, 'inquiry'), false);
  } finally {
    globalThis.fetch = fetcher;
    if (original === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = original;
  }
});

test('only a successful verification for the intended form action is accepted', async () => {
  const original = process.env.TURNSTILE_SECRET_KEY;
  const fetcher = globalThis.fetch;
  try {
    process.env.TURNSTILE_SECRET_KEY = 'test-secret';
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      assert.equal(options.cache, 'no-store');
      assert.equal(options.redirect, 'error');
      assert.deepEqual(JSON.parse(options.body), { secret: 'test-secret', response: 'token' });
      return Response.json({ success: true, action: 'inquiry' });
    };
    assert.equal(await verifyTurnstile('token', 'inquiry'), true);
    assert.equal(await verifyTurnstile('token', 'checkout'), false);
    for (const payload of [{ success: false, 'error-codes': ['timeout-or-duplicate'] }, { success: true }, { success: 'true', action: 'inquiry' }, null]) {
      globalThis.fetch = async () => Response.json(payload);
      assert.equal(await verifyTurnstile('token', 'inquiry'), false);
    }
    globalThis.fetch = async () => new Response('Invalid JSON');
    assert.equal(await verifyTurnstile('token', 'inquiry'), false);
    globalThis.fetch = async () => new Response('', { status: 503 });
    assert.equal(await verifyTurnstile('token', 'inquiry'), false);
    globalThis.fetch = async () => { throw new Error('Network unavailable'); };
    assert.equal(await verifyTurnstile('token', 'inquiry'), false);
  } finally {
    globalThis.fetch = fetcher;
    if (original === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = original;
  }
});

test('authentication captcha blocks direct requests without tokens, while session reads remain available', async () => {
  const endpoints = ['/sign-in/email', '/sign-up/email', '/request-password-reset', '/forget-password', '/reset-password', '/send-verification-email'];
  const plugin = captcha({ provider: 'cloudflare-turnstile', secretKey: 'test-secret', endpoints });
  const context = { options: {}, logger: { error() {} } };
  for (const endpoint of endpoints) {
    const result = await plugin.onRequest(new Request(`https://example.com/api/auth${endpoint}`, { method: 'POST' }), context);
    assert.equal(result.response.status, 400);
  }
  assert.equal(await plugin.onRequest(new Request('https://example.com/api/auth/get-session'), context), undefined);
});
