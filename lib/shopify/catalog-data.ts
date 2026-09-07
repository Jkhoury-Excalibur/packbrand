export type StorefrontRequest = <T>(query: string, variables?: Record<string, unknown>) => Promise<T>;
export type CatalogImage = { url: string; altText: string | null };
export type CatalogCollection = { id: string; handle: string; title: string; description: string; image: CatalogImage | null };
export type PageInfo = { hasNextPage: boolean; endCursor: string | null };
export type CatalogProductCard = {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  featuredImage: CatalogImage | null;
};
export type ProductPage = { nodes: CatalogProductCard[]; pageInfo: PageInfo };
export type CatalogProduct = CatalogProductCard & {
  productType: string;
  vendor: string;
  images: { nodes: CatalogImage[] };
  options: { name: string; optionValues: { name: string }[] }[];
  collections: { nodes: Pick<CatalogCollection, 'id' | 'handle' | 'title'>[] };
};
export type CatalogVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: { name: string; value: string }[];
  quantityRule: { minimum: number; maximum: number | null; increment: number };
};

export function catalogLanguage(locale: string) {
  return locale === 'es' ? 'ES' : 'EN';
}

function nextCursor(info: PageInfo, previous: string | null): string | null {
  if (!info.hasNextPage) return null;
  if (!info.endCursor || info.endCursor === previous) throw new Error('Shopify returned an invalid pagination cursor.');
  return info.endCursor;
}

export async function loadCollections(request: StorefrontRequest, locale: string): Promise<CatalogCollection[]> {
  const collections: CatalogCollection[] = [];
  let after: string | null = null;
  do {
    const result: { collections: { nodes: CatalogCollection[]; pageInfo: PageInfo } } = await request(`
      query CatalogCollections($after: String, $language: LanguageCode!) @inContext(language: $language) {
        collections(first: 100, after: $after, sortKey: ID) {
          nodes { id handle title description image { url altText } }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { after, language: catalogLanguage(locale) });
    collections.push(...result.collections.nodes);
    after = nextCursor(result.collections.pageInfo, after);
  } while (after);
  return collections;
}

const PRODUCT_CARD_FIELDS = 'id handle title description(truncateAt: 180) tags featuredImage { url altText }';

export async function loadProductPage(request: StorefrontRequest, locale: string, handle: string | null, after: string | null): Promise<ProductPage | null> {
  const variables = { language: catalogLanguage(locale), handle, after };
  if (handle) {
    const result = await request<{ collection: { products: ProductPage } | null }>(`
      query CollectionProducts($handle: String!, $after: String, $language: LanguageCode!) @inContext(language: $language) {
        collection(handle: $handle) {
          products(first: 24, after: $after, sortKey: COLLECTION_DEFAULT) {
            nodes { ${PRODUCT_CARD_FIELDS} }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    `, variables);
    return result.collection?.products ?? null;
  }
  const result = await request<{ products: ProductPage }>(`
    query CatalogProducts($after: String, $language: LanguageCode!) @inContext(language: $language) {
      products(first: 24, after: $after, sortKey: TITLE) {
        nodes { ${PRODUCT_CARD_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }
  `, { after, language: variables.language });
  return result.products;
}

export async function loadProduct(request: StorefrontRequest, locale: string, handle: string): Promise<CatalogProduct | null> {
  const result = await request<{ product: CatalogProduct | null }>(`
    query CatalogProduct($handle: String!, $language: LanguageCode!) @inContext(language: $language) {
      product(handle: $handle) {
        id handle title description tags productType vendor featuredImage { url altText }
        images(first: 50) { nodes { url altText } }
        options { name optionValues { name } }
        collections(first: 100) { nodes { id handle title } }
      }
    }
  `, { handle, language: catalogLanguage(locale) });
  return result.product;
}

export async function loadVariants(request: StorefrontRequest, locale: string, handle: string): Promise<CatalogVariant[]> {
  const variants: CatalogVariant[] = [];
  let after: string | null = null;
  do {
    const result: { product: { variants: { nodes: CatalogVariant[]; pageInfo: PageInfo } } | null } = await request(`
      query CatalogVariants($handle: String!, $after: String, $language: LanguageCode!) @inContext(language: $language) {
        product(handle: $handle) {
          variants(first: 100, after: $after) {
            nodes {
              id title availableForSale price { amount currencyCode }
              selectedOptions { name value }
              quantityRule { minimum maximum increment }
            }
            pageInfo { hasNextPage endCursor }
          }
        }
      }
    `, { handle, after, language: catalogLanguage(locale) });
    if (!result.product) return [];
    variants.push(...result.product.variants.nodes);
    after = nextCursor(result.product.variants.pageInfo, after);
  } while (after);
  return variants;
}
