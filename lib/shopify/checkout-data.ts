import { z } from 'zod';
import type { StorefrontRequest } from './catalog-data';

const checkoutSchema = z.object({
  lines: z.array(z.object({
    variantId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/),
    quantity: z.number().int().positive().max(2147483647),
  })).min(1).max(100),
  note: z.string().trim().max(5000).default(''),
  logoUrls: z.array(z.string().url().max(2000).refine(value => new URL(value).protocol === 'https:')).max(3).default([]),
  locale: z.enum(['en', 'es']).default('en'),
});

export class CheckoutError extends Error {
  code: string;
  constructor(code: string) { super(code); this.code = code; }
}

type Variant = {
  id: string;
  availableForSale: boolean;
  quantityRule: { minimum: number; maximum: number | null; increment: number };
};

/** Only variant IDs and whole batch counts become merchandise inputs; client prices are never trusted. */
export async function createShopifyCheckout(request: StorefrontRequest, input: unknown, verifiedEmail?: string, checkoutId?: string) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) throw new CheckoutError('INVALID_CART');
  const { lines, note, logoUrls, locale } = parsed.data;
  const quantities = new Map<string, number>();
  for (const line of lines) quantities.set(line.variantId, (quantities.get(line.variantId) ?? 0) + line.quantity);
  if ([...quantities.values()].some(qty => qty > 2147483647)) throw new CheckoutError('INVALID_CART');
  const language = locale === 'es' ? 'ES' : 'EN';
  const current = await request<{ nodes: (Variant | null)[]; shop: { primaryDomain: { url: string } } }>(`
    query CheckoutValidation($ids: [ID!]!, $language: LanguageCode!) @inContext(language: $language) {
      nodes(ids: $ids) { ... on ProductVariant { id availableForSale quantityRule { minimum maximum increment } } }
      shop { primaryDomain { url } }
    }
  `, { ids: [...quantities.keys()], language });
  const variants = new Map(current.nodes.filter((node): node is Variant => Boolean(node?.id)).map(node => [node.id, node]));
  for (const [id, quantity] of quantities) {
    const variant = variants.get(id);
    if (!variant?.availableForSale) throw new CheckoutError('UNAVAILABLE');
    const rule = variant.quantityRule;
    if (quantity < rule.minimum || (rule.maximum !== null && quantity > rule.maximum) || (quantity - rule.minimum) % rule.increment !== 0) {
      throw new CheckoutError('QUANTITY');
    }
  }
  const result = await request<{ cartCreate: {
    cart: { checkoutUrl: string; lines: { nodes: { quantity: number; merchandise: { id: string } }[]; pageInfo: { hasNextPage: boolean } } } | null;
    userErrors: { code: string | null }[];
    warnings: { code: string }[];
  } }>(`
    mutation StorefrontCheckout($input: CartInput!, $language: LanguageCode!) @inContext(language: $language) {
      cartCreate(input: $input) {
        cart { checkoutUrl lines(first: 100) { nodes { quantity merchandise { ... on ProductVariant { id } } } pageInfo { hasNextPage } } }
        userErrors { code }
        warnings { code }
      }
    }
  `, {
    language,
    input: {
      ...(verifiedEmail ? { buyerIdentity: { email: verifiedEmail } } : {}),
      lines: [...quantities].map(([merchandiseId, quantity]) => ({ merchandiseId, quantity })),
      note,
      attributes: [
        ...logoUrls.map((value, i) => ({ key: `Artwork ${i + 1}`, value })),
        ...(checkoutId ? [{ key: '_pbs_checkout_id', value: checkoutId }] : []),
      ],
    },
  });
  const { cart, userErrors, warnings } = result.cartCreate;
  if (userErrors.length || warnings.length || !cart) throw new CheckoutError('CART_CHANGED');
  // Do not silently send a buyer to pay for a partial or quantity-adjusted cart.
  const accepted = new Map<string, number>();
  for (const line of cart.lines.nodes) accepted.set(line.merchandise.id, (accepted.get(line.merchandise.id) ?? 0) + line.quantity);
  if (cart.lines.pageInfo.hasNextPage || accepted.size !== quantities.size || [...quantities].some(([id, qty]) => accepted.get(id) !== qty)) {
    throw new CheckoutError('CART_CHANGED');
  }
  const url = new URL(cart.checkoutUrl);
  const storeUrl = new URL(current.shop.primaryDomain.url);
  if (url.protocol !== 'https:' || url.username || url.password || (url.hostname !== storeUrl.hostname && !url.hostname.endsWith('.myshopify.com'))) {
    throw new CheckoutError('CHECKOUT_UNAVAILABLE');
  }
  return { checkoutUrl: url.toString() };
}
