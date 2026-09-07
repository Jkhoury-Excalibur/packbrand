import type { StorefrontRequest, PageInfo } from './catalog-data';

export type CustomerOrder = {
  id: string; name: string; email: string | null; createdAt: string; cancelledAt: string | null;
  displayFinancialStatus: string | null; displayFulfillmentStatus: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  note: string | null; customAttributes: { key: string; value: string }[];
  lineItems: { nodes: { id: string; title: string; variantTitle: string | null; quantity: number; variant: { id: string } | null }[]; pageInfo: { hasNextPage: boolean } };
};

const fields = `id name email createdAt cancelledAt displayFinancialStatus displayFulfillmentStatus
  totalPriceSet { shopMoney { amount currencyCode } } note customAttributes { key value }
  lineItems(first: 100) { nodes { id title variantTitle quantity variant { id } } pageInfo { hasNextPage } }`;

export function ownsShopifyOrder(order: Pick<CustomerOrder, 'email'>, email: string, verified: boolean) {
  return verified && Boolean(email.trim()) && order.email?.trim().toLowerCase() === email.trim().toLowerCase();
}

export async function loadCustomerOrders(request: StorefrontRequest, email: string, verified: boolean, after: string | null) {
  if (!verified || !email.trim()) throw new Error('EMAIL_UNVERIFIED');
  const escaped = email.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const result = await request<{ orders: { nodes: CustomerOrder[]; pageInfo: PageInfo } }>(`
    query WebsiteOrderHistory($query: String!, $after: String) {
      orders(first: 5, after: $after, query: $query, sortKey: CREATED_AT, reverse: true) {
        nodes { ${fields} } pageInfo { hasNextPage endCursor }
      }
    }
  `, { query: `email:"${escaped}"`, after });
  // Shopify search is not an authorization boundary. Verify every returned order.
  return { ...result.orders, nodes: result.orders.nodes.filter(order => ownsShopifyOrder(order, email, verified)) };
}

export async function loadOwnedOrder(request: StorefrontRequest, id: string, email: string, verified: boolean) {
  if (!verified || !/^gid:\/\/shopify\/Order\/\d+$/.test(id)) throw new Error('ORDER_NOT_FOUND');
  const result = await request<{ order: CustomerOrder | null }>(`query WebsiteReorder($id: ID!) { order(id: $id) { ${fields} } }`, { id });
  if (!result.order || !ownsShopifyOrder(result.order, email, verified)) throw new Error('ORDER_NOT_FOUND');
  return result.order;
}

export function reorderInput(order: CustomerOrder, locale: 'en' | 'es') {
  if (order.lineItems.pageInfo.hasNextPage || !order.lineItems.nodes.length || order.lineItems.nodes.some(item => !item.variant)) throw new Error('REORDER_UNAVAILABLE');
  return {
    lines: order.lineItems.nodes.map(item => ({ variantId: item.variant!.id, quantity: item.quantity })),
    note: order.note || '',
    logoUrls: order.customAttributes.filter(attr => /^Artwork [1-3]$/.test(attr.key)).map(attr => attr.value),
    locale,
  };
}
