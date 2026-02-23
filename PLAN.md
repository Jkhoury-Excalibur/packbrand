# Pack Brand Solutions - E-Commerce Website Build Plan

## Context
Pack Brand Solutions (PBS) is a custom-branded packaging company based in Hackensack, NJ, run by founder Sebastian Perez. They currently operate entirely through Facebook/Instagram and WhatsApp with manual order processing. We're building a full e-commerce website so customers can browse products, customize packaging (upload logos, pick sizes/colors), pay online, and Sebastian just ships. The project is a fresh Next.js 16 + Tailwind CSS v4 + TypeScript setup.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, MongoDB Atlas, AWS S3, Better Auth, Zustand, next-intl, Zod
**Payments:** Abstracted/pluggable interface with placeholder (no processor chosen yet)
**Languages:** Bilingual EN/ES with `next-intl`

---

## Phase 0: Project Foundation

### 0.1 Install Dependencies
```
npm install
npm install mongoose @aws-sdk/client-s3 @aws-sdk/s3-request-presigner next-intl better-auth zod lucide-react sharp zustand sonner
```

### 0.2 Create `.env.local`
MongoDB URI, AWS credentials, S3 bucket name, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_BASE_URL

### 0.3 Update `next.config.ts`
- Wrap with `next-intl` plugin
- Add S3 image remote patterns (`*.amazonaws.com`)

### 0.4 Update `globals.css` with PBS Brand Theme
Brand tokens via Tailwind v4 `@theme inline`:
- `--color-pbs-red: #E63946`, `--color-pbs-black: #000`, `--color-pbs-gold: #FFD700`
- Gray scale for UI elements

### 0.5 Create Full Folder Structure
```
app/
  [locale]/              -- All public pages (homepage, products, cart, checkout, about, contact, order-tracking)
  admin/                 -- Admin dashboard (English-only, outside locale)
  api/                   -- API routes (products, orders, upload, contact, auth via Better Auth catch-all)
components/
  ui/                    -- Button, Input, Select, Badge, Card, Modal, Spinner, Textarea
  layout/                -- Header, Footer, MobileNav, AdminSidebar, AdminHeader
  products/              -- ProductCard, ProductGrid, ProductGallery, ProductCustomizer, CategoryFilter
  cart/                  -- CartItem, CartSummary
  checkout/              -- ShippingForm, OrderSummary, PaymentPlaceholder
  home/                  -- Hero, FeaturedProducts, ValueProps, Testimonials, CallToAction
  admin/                 -- OrdersTable, ProductForm, ProductsTable, AnalyticsCards, etc.
  shared/                -- LanguageToggle, WhatsAppButton, LogoUploader, ImageUploader
lib/
  db/connection.ts       -- Mongoose singleton
  db/models/             -- Product, Order, Customer, AdminUser
  s3/                    -- S3 client + presigned URL helpers
  auth/                  -- Better Auth config (email+password for admin, MongoDB adapter)
  payments/              -- Payment abstraction layer + placeholder provider
  validators/            -- Zod schemas (product, order, checkout, contact)
  utils/                 -- cn(), formatCurrency(), formatDate(), constants
store/cart.ts            -- Zustand cart (client-side, localStorage persist)
i18n/                    -- next-intl config (routing.ts, request.ts)
messages/en.json, es.json -- Translation files
proxy.ts                 -- Next.js 16 proxy (locale routing + admin auth protection)
types/                   -- Shared TS interfaces (product, order, cart, payment)
```

---

## Phase 1: Data Layer

### 1.1 MongoDB Connection (`lib/db/connection.ts`)
Mongoose singleton cached on `globalThis` to prevent connection leaks during hot reload.

### 1.2 Mongoose Models
- **Product**: bilingual name/description `{en, es}`, slug, category enum (cups/bags/boxes/food-containers/napkins/labels/other), variants `[{size, sku}]`, pricingTiers `[{minQty, maxQty, pricePerUnit}]`, customizationOptions `{allowLogoUpload, availableColors, allowCustomText}`, images `string[]`, isActive, isFeatured
- **Order**: orderNumber (auto "PBS-YYYYMMDD-XXX"), customer embed, shippingAddress embed, items array with customization, totals, paymentStatus, fulfillmentStatus, trackingNumber
- **Customer**: email (unique), name, phone, addresses, preferredLanguage
- **User/Session/Account**: Managed automatically by Better Auth's MongoDB adapter (user, session, account collections)

### 1.3 S3 Setup (`lib/s3/`)
- S3Client singleton from env vars
- `generateUploadUrl(key, contentType)` -> presigned PUT URL (5-min expiry)
- `getPublicUrl(key)` -> public S3 URL

### 1.4 Better Auth (`lib/auth/`)
- **`lib/auth/auth.ts`** -- Better Auth server instance with:
  - MongoDB adapter (uses same MONGODB_URI, auto-manages user/session/account collections)
  - Email + password plugin enabled (for admin login)
  - Admin role via `admin` plugin or custom `role` field on user
- **`lib/auth/auth-client.ts`** -- Better Auth client instance (`createAuthClient`) for use in client components
- **`app/api/auth/[...all]/route.ts`** -- Catch-all route handler that delegates to Better Auth's `toNextJsHandler()`
- **Proxy protection** -- `proxy.ts` checks session via Better Auth's `getSession()` for `/admin/*` routes
- No separate AdminUser model needed — Better Auth manages users with its own collections, we add a `role: 'admin'` field

### 1.5 Zod Validators (`lib/validators/`)
Schemas for: product create/edit, order placement, checkout form, contact form

### 1.6 Payment Abstraction (`lib/payments/`)
- `PaymentProvider` interface: `createPaymentIntent`, `confirmPayment`, `getPaymentStatus`, `refundPayment`
- `PlaceholderProvider`: mock that returns success (allows full checkout flow without real processor)
- Factory `getPaymentProvider()`: reads `PAYMENT_PROVIDER` env var, returns appropriate provider

---

## Phase 2: i18n Foundation

### 2.1 Config (`i18n/routing.ts`, `i18n/request.ts`)
- Locales: `['en', 'es']`, default: `'en'`, prefix: `'as-needed'` (English = `/about`, Spanish = `/es/about`)

### 2.2 Translation Files (`messages/en.json`, `messages/es.json`)
Organized by: common (nav, footer, CTAs), home, products, product, cart, checkout, about, contact, orderTracking

### 2.3 Proxy (`proxy.ts`)
- Apply `next-intl` locale routing to public routes
- Apply Better Auth session check to protect `/admin/*` (except `/admin/login`)
- Skip for `/api/*` and static assets

### 2.4 Locale Layout (`app/[locale]/layout.tsx`)
- `NextIntlClientProvider` wrapper, loads messages, renders Header + Footer + WhatsAppButton

---

## Phase 3: Storefront (Customer-Facing Pages)

### 3.1 UI Components (`components/ui/`)
Button (primary/secondary/outline/gold variants), Input, Select, Badge, Card, Modal, Spinner, Textarea + `cn()` utility

### 3.2 Layout (`components/layout/`)
- **Header**: PBS logo, nav (Home/Products/About/Contact), language toggle, cart icon with count, mobile hamburger
- **Footer**: Logo, tagline, quick links, contact info, social links, credits
- **MobileNav**: Slide-in drawer

### 3.3 Cart Store (`store/cart.ts`)
Zustand + persist middleware. Tracks items with product info, variant, quantity, customizations, logo URL.

### 3.4 Homepage (`app/[locale]/page.tsx`)
- Hero (tagline + CTA)
- Featured Products (from DB)
- Value Props (custom branding, shipping, bilingual, wholesale pricing)
- Testimonials
- CTA section

### 3.5 Products Page (`app/[locale]/products/page.tsx`)
- Category filter pills + product grid
- Fetches from MongoDB, filterable by `?category=`

### 3.6 Product Detail (`app/[locale]/products/[slug]/page.tsx`)
- Image gallery + Product Customizer
- **Customizer**: size selector, quantity input with tier pricing display, color swatches, logo upload (S3 presigned), custom text, dynamic price calc, Add to Cart

### 3.7 Cart Page (`app/[locale]/cart/page.tsx`)
- Cart items list (qty adjusters, remove), summary with subtotal, proceed to checkout

### 3.8 Checkout (`app/[locale]/checkout/page.tsx`)
- Shipping form (validated with Zod) -> Order review -> Payment placeholder -> Place Order
- Creates Order via `POST /api/orders`, calls payment provider, redirects to confirmation

### 3.9 Order Confirmation (`app/[locale]/order-confirmation/[orderId]/page.tsx`)
- Thank you page with order details

### 3.10 Order Tracking (`app/[locale]/order-tracking/page.tsx`)
- Lookup by order number, visual status progress bar

### 3.11 About Page - Company story, Sebastian's story, values, CTA
### 3.12 Contact Page - Form + contact info sidebar + WhatsApp link

---

## Phase 4: API Routes

- `api/products/` - GET (public, filterable), POST (admin)
- `api/products/[productId]/` - GET/PUT/DELETE (admin for write ops)
- `api/orders/` - GET (admin, paginated), POST (public checkout)
- `api/orders/[orderId]/` - GET (public by order#), PUT (admin status update)
- `api/upload/` - POST (generates S3 presigned URL)
- `api/contact/` - POST (validates + stores/notifies)

---

## Phase 5: Admin Dashboard

### 5.1 Admin Layout (`app/admin/layout.tsx`)
Sidebar nav + header, auth-protected

### 5.2 Login (`app/admin/login/page.tsx`)
Email/password form -> Better Auth `signIn.email()` client method

### 5.3 Dashboard Home (`app/admin/page.tsx`)
Analytics cards (orders, revenue, pending, products count) + recent activity feed

### 5.4 Orders Management
- Orders list with table, filters, pagination
- Order detail with status update, tracking number input, notes

### 5.5 Products Management
- Products table with edit/delete
- Add/Edit form: bilingual names, descriptions, variants, pricing tiers, image uploads, customization options, active/featured toggles

### 5.6 Admin Seed Script (`scripts/seed-admin.ts`)
CLI script to create initial admin user via Better Auth's `signUp.email()` API + set role to `admin`

---

## Phase 6: Polish
- SEO metadata on all pages + `robots.ts` + `sitemap.ts`
- `loading.tsx` and `error.tsx` for each route group
- Mobile-first responsive audit
- Dark mode support via Tailwind `dark:` variants

---

## Key Architecture Decisions
1. **Server Components by default** - only `'use client'` for interactivity
2. **Bilingual product data in MongoDB** (`{en, es}` fields) - static UI text in translation JSON files
3. **Client-side cart only** (Zustand + localStorage) - converts to Order at checkout
4. **Admin outside `[locale]`** - English-only, simpler routing
5. **Presigned URL uploads** - files go directly from browser to S3, never through our server
6. **Quantity-based pricing tiers** - array of `{minQty, maxQty, pricePerUnit}` per product

## Build Execution Order
0 -> Foundation/deps -> 1 -> DB + S3 + Auth + Payments -> 2 -> i18n -> 3.1-3.2 -> UI + Layout -> 3.3 -> Cart store -> 3.4 -> Homepage -> 4.1 -> Product APIs -> 3.5-3.6 -> Products pages -> 3.7 -> Cart -> 4.2-4.3 -> Order/Upload APIs -> 3.8-3.9 -> Checkout + Confirmation -> 3.10-3.12 -> Remaining pages -> 4.4 -> Contact API -> 5 -> Admin dashboard -> 6 -> Polish

## Verification
1. `npm run dev` - site runs without errors
2. Homepage loads with bilingual toggle working
3. Products page shows seeded products
4. Full checkout flow works end-to-end with placeholder payment
5. Admin login works, can manage products and orders
6. File uploads to S3 work (logo + product images)
7. `npm run build` - production build succeeds
