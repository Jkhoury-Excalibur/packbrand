import { shopifyStorefront, ShopifyStorefrontError } from '../lib/shopify/client.ts';

// Read-only unless --cart is supplied. Never print API tokens, cart IDs, or checkout URLs.
try {
  const data = await shopifyStorefront(`
    query VerifyShopifyConnection {
      shop { name primaryDomain { url } }
      products(first: 10) {
        nodes {
          variants(first: 10) {
            nodes { availableForSale quantityAvailable price { amount currencyCode } }
          }
        }
        pageInfo { hasNextPage }
      }
      collections(first: 10) { nodes { id } pageInfo { hasNextPage } }
    }
  `);
  console.log(JSON.stringify({
    connected: true,
    store: data.shop.name,
    storefront: data.shop.primaryDomain.url,
    productsInSample: data.products.nodes.length,
    moreProducts: data.products.pageInfo.hasNextPage,
    collectionsInSample: data.collections.nodes.length,
    moreCollections: data.collections.pageInfo.hasNextPage,
    inventoryQuery: 'passed',
  }, null, 2));

  if (data.products.nodes.length === 0) {
    console.log('No products are visible to the Headless channel. Product publishing is a separate step.');
  }

  if (process.argv.includes('--cart')) {
    const result = await shopifyStorefront(`
      mutation VerifyEmptyCart {
        cartCreate(input: {}) {
          cart { id checkoutUrl totalQuantity }
          userErrors { code }
        }
      }
    `);
    const { cart, userErrors } = result.cartCreate;
    if (userErrors.length || !cart?.id || !cart.checkoutUrl || cart.totalQuantity !== 0) {
      throw new ShopifyStorefrontError('Shopify did not return a valid empty cart and checkout URL.', 'CART_VERIFICATION');
    }
    console.log('Empty cart creation and checkout URL generation passed. No order or payment was created.');
  }
} catch (error) {
  console.error(error instanceof ShopifyStorefrontError ? `${error.code}: ${error.message}` : 'Shopify verification failed unexpectedly.');
  process.exitCode = 1;
}
