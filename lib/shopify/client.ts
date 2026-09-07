import 'server-only';

export class ShopifyStorefrontError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(
    message: string,
    code: string,
    status?: number,
  ) {
    super(message);
    this.name = 'ShopifyStorefrontError';
    this.code = code;
    this.status = status;
  }
}

function getConfiguration() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() || '2026-07';

  // Keep private credentials on Shopify's canonical API host.
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new ShopifyStorefrontError('Set SHOPIFY_STORE_DOMAIN to the store hostname ending in .myshopify.com.', 'CONFIGURATION');
  }
  if (!token) {
    throw new ShopifyStorefrontError('Set SHOPIFY_STOREFRONT_PRIVATE_TOKEN in the server environment.', 'CONFIGURATION');
  }
  if (!/^\d{4}-(01|04|07|10)$/.test(version)) {
    throw new ShopifyStorefrontError('SHOPIFY_STOREFRONT_API_VERSION must be a stable quarterly API version.', 'CONFIGURATION');
  }

  return { endpoint: `https://${domain}/api/${version}/graphql.json`, token };
}

/** Server-only Storefront GraphQL transport. Never pass the private token to a client component. */
export async function shopifyStorefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const { endpoint, token } = getConfiguration();
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    // Do not propagate request objects, headers, or upstream bodies into logs.
    throw new ShopifyStorefrontError('Unable to reach the Shopify Storefront API.', 'NETWORK');
  }

  if (!response.ok) {
    throw new ShopifyStorefrontError(`Shopify Storefront API returned HTTP ${response.status}.`, 'HTTP', response.status);
  }

  let body: { data?: T; errors?: unknown[] };
  try {
    body = await response.json();
  } catch {
    throw new ShopifyStorefrontError('Shopify returned an invalid JSON response.', 'INVALID_RESPONSE');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new ShopifyStorefrontError('Shopify returned an invalid response.', 'INVALID_RESPONSE');
  }
  if (body.errors?.length) {
    throw new ShopifyStorefrontError('Shopify rejected the GraphQL request. Check the query and API permissions.', 'GRAPHQL');
  }
  if (body.data == null) {
    throw new ShopifyStorefrontError('Shopify returned no data.', 'INVALID_RESPONSE');
  }
  return body.data;
}
