import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { shopifyStorefront } from './client';
import { loadCollections, loadProductPage, loadProduct, loadVariants } from './catalog-data';

// Cache only successful, public catalog reads. The transport and cart mutations stay uncached.
function catalogCache<T>(key: string[], read: () => Promise<T>, revalidate = 300) {
  return unstable_cache(read, [
    'shopify-catalog-v1',
    process.env.SHOPIFY_STORE_DOMAIN ?? '',
    process.env.SHOPIFY_STOREFRONT_API_VERSION ?? '2026-07',
    ...key,
  ], { revalidate, tags: ['shopify-catalog'] })();
}

export const getShopifyCollections = cache((locale: string) =>
  catalogCache(['collections', locale], () => loadCollections(shopifyStorefront, locale)),
);

export const getShopifyProductPage = cache((locale: string, handle: string | null, after: string | null) =>
  catalogCache(['products', locale, handle ?? '', after ?? ''], () => loadProductPage(shopifyStorefront, locale, handle, after)),
);

export const getShopifyProduct = cache((locale: string, handle: string) =>
  catalogCache(['product', locale, handle], () => loadProduct(shopifyStorefront, locale, handle)),
);

export const getShopifyVariants = cache((locale: string, handle: string) =>
  catalogCache(['variants', locale, handle], () => loadVariants(shopifyStorefront, locale, handle), 60),
);
