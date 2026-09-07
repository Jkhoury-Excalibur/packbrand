# PackBrand

This is a [Next.js](https://nextjs.org) storefront for PackBrand Solutions.

## Current state

The commerce admin dashboard, its management actions, and admin product-upload endpoints have been removed. `/admin/users` now contains only website user management: search accounts, edit name/company/phone, and assign customer/admin roles. Admin access is checked against the current database role; role input is blocked during public signup/profile updates, and admins cannot remove their own access. Customer `/account` is order history and reorder only; profile/address URLs redirect there. The public storefront uses Shopify for its catalog and paid checkout. Website logins and historical MongoDB records remain in place.

The packaging category cards, product filters, product listings, and product detail pages read Shopify collections and products. Shopify manages category membership, variant options, prices, and availability. `PLAN.md` describes the original build and includes dashboard features that have since been removed.

Checkout sends Shopify variant IDs and whole batch counts to the server, validates current availability and quantity rules without caching, and creates a Shopify cart. Client-supplied prices are not used for payment. Shopify calculates final prices, shipping, taxes and discounts, collects payment, and creates the order. Artwork instructions become the cart/order note; uploaded artwork URLs become order attributes. Legacy MongoDB-only cart items must be removed and re-added from the current catalog. Checkout no longer calls the local work-order submission action or sends its confirmation emails.

The customer completes payment and sees confirmation in Shopify checkout. Local cart contents are retained when opening checkout so an interrupted purchase does not lose the selection. The account page reads Shopify orders using a separate server-only Admin API connection, matching the current website user's verified email exactly. It does not cache customer order data in the shared catalog cache. Reorder reads and authorizes the original order server-side, keeps its variant batch counts, artwork and notes, then validates fresh availability/quantity rules and creates a new checkout using current Shopify prices. Customers review the total before paying. No live order or payment is created by the automated unit tests.

Order-history connection status (September 7, 2026): **PackBrand Order History** version 3 is released and installed with the approved `read_orders,read_all_orders,read_products` scopes. Its private credentials are configured in the local `.env.local`. Live verification confirmed both scopes and the production customer-history query. The completed $1 test payment is confirmed as PAID with a successful Shopify Payments transaction, and the order is returned by the matching verified website account history and owned-order queries. The project owner has confirmed that the Vercel credentials are configured. If the API is unavailable, the account displays a retryable unavailable state, never a misleading empty history. `read_all_orders` includes orders older than Shopify's default 60-day window. Re-run the read-only check with `npm run shopify:verify-orders`; it logs no customer details or credentials.

Configure private server environment variables `SHOPIFY_ADMIN_CLIENT_ID` and `SHOPIFY_ADMIN_CLIENT_SECRET` from the same-organization **PackBrand Order History** app after installation. The server obtains and refreshes its 24-hour token through the client credentials grant. `SHOPIFY_ADMIN_API_VERSION` defaults to `2026-07`; an existing `SHOPIFY_ADMIN_ACCESS_TOKEN` can be used instead where applicable. Never prefix these secrets with `NEXT_PUBLIC_`. The `read_products` scope is also required to resolve purchased variants for reordering; the integration does not write Shopify orders or customers. Verified website email is prefilled at checkout when signed in. If a buyer changes it at Shopify checkout, the order appears under the website account that verifies that checkout email.

Shopify's Online Store primary domain is its existing `akndhk-dx.myshopify.com` address. Customers leave the Vercel storefront only to complete Shopify-hosted checkout. The root and `www` DNS records continue to point to the existing Vercel storefront. The custom checkout subdomain and its DNS record have been removed. No checkout URL rewriting is needed.

Verification on September 5, 2026: build, focused lint and 22 unit tests pass. The local product → cart → checkout flow successfully opens Shopify's HTTPS payment page on `akndhk-dx.myshopify.com`, with one 3,000-bag variant priced at $1,470. Shopify Payments reports that it is accepting payments, and the checkout displays card and express-payment options. No payment or completed test order was submitted. On September 7, 2026, the Shopify homepage was configured and browser-verified to forward to https://www.packbrandsolutions.com/. This handles the destination used by Continue shopping. It does not automatically leave the Shopify payment confirmation page. The applied homepage-only snippet is recorded in shopify/checkout-return.liquid.

Public category and product content is cached on the server for five minutes. Variant prices and availability are cached for one minute. These caches are shared across visitors, separated by store, API version, and language, and refresh on demand after the interval. Failed refreshes retain the last successful cache entry. The underlying API transport remains uncached, so cart mutations and other buyer-specific requests are never shared. Publishing a product or collection to the Headless channel makes it available to these pages after cache refresh.

## Shopify API connection

The server-only client is in `lib/shopify/client.ts`. It uses the Pack Brand Solutions Headless storefront on `akndhk-dx.myshopify.com`, with the stable `2026-07` Storefront API.

Set these server environment variables in `.env.local` for local development, or in the hosting provider's secret settings when deploying the integration:

```dotenv
SHOPIFY_STORE_DOMAIN=akndhk-dx.myshopify.com
SHOPIFY_STOREFRONT_API_VERSION=2026-07
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=<private Storefront API token>
```

The local credentials have been configured. `.env.local` is ignored by Git. Never use a `NEXT_PUBLIC_` prefix for the private token or import the client into a client component. Manage the token in Shopify → Headless → Pack Brand Solutions Headless → Storefront API.

Enabled Storefront scopes: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_read_product_tags`, `unauthenticated_read_checkouts`, and `unauthenticated_write_checkouts`.

This connection reads published products, collections, prices, and stock availability and supports Storefront carts/checkout. It does not grant Admin API access to edit catalog or inventory records, or access customer accounts/order history. Those integrations are separate. When wiring server-side buyer cart requests, forward the verified buyer IP using Shopify's documented `Shopify-Storefront-Buyer-IP` header.

With Node.js 22.6 or later, verify the live connection without changing store data:

```bash
npm run shopify:verify
```

Optionally verify cart permissions by creating one empty Shopify cart. This generates a checkout URL but does not create an order or payment; cart IDs and checkout URLs are not logged:

```bash
node --experimental-strip-types --conditions=react-server --env-file=.env.local scripts/verify-shopify.mjs --cart
```

Run the isolated API-client tests (no network or real credentials needed):

```bash
npm run test:shopify
```

References: [Shopify Headless channel](https://shopify.dev/docs/storefronts/headless/bring-your-own-stack), [Storefront carts and checkout](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
