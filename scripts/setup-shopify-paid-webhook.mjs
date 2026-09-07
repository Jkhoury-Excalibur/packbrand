import { shopifyAdmin } from '../lib/shopify/admin.ts';

// Shopify disallows callback hosts registered as its store domains. This existing
// Vercel production alias serves the same app without changing customer-facing URLs.
const uri = 'https://packbrand.vercel.app/api/shopify/webhooks/orders-paid';
const existing = await shopifyAdmin(`query PaidWebhooks {
  webhookSubscriptions(first: 100, topics: [ORDERS_PAID]) { nodes { id uri } pageInfo { hasNextPage } }
}`);
if (existing.webhookSubscriptions.pageInfo.hasNextPage) throw new Error('More subscriptions need review before registration.');
if (existing.webhookSubscriptions.nodes.some(webhook => webhook.uri === uri)) {
  console.log('Paid-order webhook is already registered:', uri);
} else if (process.argv.includes('--apply')) {
  const result = await shopifyAdmin(`mutation RegisterPaidWebhook($input: WebhookSubscriptionInput!) {
    webhookSubscriptionCreate(topic: ORDERS_PAID, webhookSubscription: $input) {
      webhookSubscription { id uri } userErrors { field message }
    }
  }`, { input: { uri, format: 'JSON' } });
  if (result.webhookSubscriptionCreate.userErrors.length) {
    console.error(result.webhookSubscriptionCreate.userErrors);
    process.exitCode = 1;
  } else console.log('Registered paid-order webhook:', result.webhookSubscriptionCreate.webhookSubscription.uri);
} else {
  console.log('Paid-order webhook is not registered. Run with --apply after deploying the endpoint.');
}
