import 'server-only';

let cachedToken: { value: string; expiresAt: number } | undefined;

export class ShopifyOrdersError extends Error {
  constructor(publicCode: string) { super(publicCode); }
}

function configuration() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const version = process.env.SHOPIFY_ADMIN_API_VERSION?.trim() || '2026-07';
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain) || !/^\d{4}-(01|04|07|10)$/.test(version)) throw new ShopifyOrdersError('CONFIGURATION');
  return { domain, version };
}

async function accessToken(domain: string) {
  if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) return process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new ShopifyOrdersError('CONFIGURATION');
  const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
  });
  if (!response.ok) throw new ShopifyOrdersError('AUTHENTICATION');
  const token = await response.json();
  if (typeof token.access_token !== 'string' || typeof token.expires_in !== 'number') throw new ShopifyOrdersError('AUTHENTICATION');
  cachedToken = { value: token.access_token, expiresAt: Date.now() + Math.max(0, token.expires_in - 60) * 1000 };
  return cachedToken.value;
}

/** Private order data is never put in the shared catalog cache. */
export async function shopifyAdmin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const { domain, version } = configuration();
  try {
    const token = await accessToken(domain);
    const response = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) throw new ShopifyOrdersError('UNAVAILABLE');
    const body = await response.json();
    if (body.errors?.length || !body.data) throw new ShopifyOrdersError('UNAVAILABLE');
    return body.data;
  } catch (error) {
    if (error instanceof ShopifyOrdersError) throw error;
    throw new ShopifyOrdersError('UNAVAILABLE');
  }
}
