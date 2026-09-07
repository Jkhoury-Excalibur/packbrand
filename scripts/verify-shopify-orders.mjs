import { shopifyAdmin } from '../lib/shopify/admin.ts';
import { loadCustomerOrders, loadOwnedOrder } from '../lib/shopify/orders-data.ts';

try {
  const result = await shopifyAdmin(`query VerifyOrderAccess {
    currentAppInstallation { accessScopes { handle } }
    orders(first: 1, sortKey: CREATED_AT, reverse: true) { nodes { id email } }
  }`);
  const scopes = result.currentAppInstallation.accessScopes.map(scope => scope.handle);
  for (const scope of ['read_orders', 'read_all_orders', 'read_products']) {
    if (!scopes.includes(scope)) throw new Error(`Missing ${scope}`);
  }
  console.log('Order-reading permissions verified:', scopes.join(', '));
  const sample = result.orders.nodes.find(order => order.email);
  // Exercise the production query without logging customer details, order IDs or tokens.
  const page = await loadCustomerOrders(shopifyAdmin, sample?.email || 'connection-check@example.invalid', true, null);
  console.log('Customer order-history query verified. Returned orders:', page.nodes.length);
  if (sample) {
    const order = await loadOwnedOrder(shopifyAdmin, sample.id, sample.email, true);
    console.log('Owned-order query verified. Line items:', order.lineItems.nodes.length);
  } else {
    console.log('No existing order with email is available for the ownership read check.');
  }
} catch (error) {
  console.error('Order API verification failed:', error.message);
  process.exitCode = 1;
}
