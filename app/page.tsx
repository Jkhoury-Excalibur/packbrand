import Link from 'next/link';
import {
  Package,
  Coffee,
  ShoppingBag,
  Box,
  UtensilsCrossed,
  Sticker,
  Star,
  Paintbrush,
  Truck,
  Users,
  ArrowRight,
  MessageCircle,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

/* -------------------------------------------------------------------------- */
/*  Product category data                                                     */
/* -------------------------------------------------------------------------- */

const productCategories = [
  {
    name: 'Custom Cups',
    description: 'Branded paper & plastic cups for hot and cold beverages.',
    icon: Coffee,
    href: '/products?category=cups',
    accent: 'from-pbs-red to-pbs-red-dark',
  },
  {
    name: 'Branded Bags',
    description: 'Paper bags with your logo for takeout & retail.',
    icon: ShoppingBag,
    href: '/products?category=bags',
    accent: 'from-pbs-gray-900 to-pbs-gray-700',
  },
  {
    name: 'Packaging Boxes',
    description: 'Custom boxes for food delivery & gift packaging.',
    icon: Box,
    href: '/products?category=boxes',
    accent: 'from-pbs-gold-dark to-pbs-gold',
  },
  {
    name: 'Food Containers',
    description: 'Bowls, trays, and containers with your branding.',
    icon: UtensilsCrossed,
    href: '/products?category=food-containers',
    accent: 'from-pbs-red-light to-pbs-red',
  },
  {
    name: 'Labels & Stickers',
    description: 'Custom stickers and labels for any product.',
    icon: Sticker,
    href: '/products?category=labels',
    accent: 'from-pbs-gray-800 to-pbs-gray-600',
  },
] as const;

const valueProps = [
  {
    icon: Paintbrush,
    title: 'Free Design',
    description: 'We design your packaging at no extra cost with your first order.',
  },
  {
    icon: Package,
    title: 'Low Minimums',
    description: 'Start small. We offer the lowest minimums in the industry.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick turnaround times so you never run out of stock.',
  },
  {
    icon: Users,
    title: 'Bilingual Support',
    description: 'Full service in English and Spanish. We speak your language.',
  },
] as const;

const clients = [
  'Go Picadera',
  'La Fortaleza',
  'Kimchi Smoke',
  'Parriyas',
] as const;

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* ------------------------------------------------------------------ */}
      {/*  BENTO GRID                                                        */}
      {/* ------------------------------------------------------------------ */}
      <main className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6 mb-12">

        {/* ================================================================ */}
        {/*  HERO CARD -- spans 2 cols x 2 rows on md, 4 cols on lg          */}
        {/* ================================================================ */}
        <div className="col-span-1 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2 bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 sm:p-10 lg:p-12 text-white flex flex-col justify-between shadow-lg hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group min-h-[360px] lg:min-h-[440px]">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 opacity-[0.07] transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700" aria-hidden="true">
            <Package className="h-72 w-72 lg:h-96 lg:w-96" strokeWidth={1} />
          </div>
          <div className="absolute bottom-0 left-0 opacity-[0.05] transform -translate-x-10 translate-y-10" aria-hidden="true">
            <Sparkles className="h-48 w-48" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-sm border border-white/10">
              Custom Packaging
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-6 mb-4 tracking-tight leading-tight">
              We Dress Brands
              <br />
              <span className="text-pbs-gold">for Success</span>
            </h1>
            <p className="text-white/80 text-lg sm:text-xl max-w-lg leading-relaxed">
              Premium custom-branded packaging for restaurants, food trucks, and
              food &amp; beverage brands. Your logo. Your colors. Your identity.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <Link href="/products">
              <Button variant="gold" size="lg" className="group/btn">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40"
              >
                Get a Free Quote
              </Button>
            </Link>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  STATS / TRUST CARD                                              */}
        {/* ================================================================ */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          {/* Decorative background */}
          <div className="absolute bottom-0 right-0 opacity-5" aria-hidden="true">
            <Star className="h-32 w-32" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-pbs-gold uppercase tracking-widest">
              Trusted by Businesses
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black text-pbs-gray-900 dark:text-white tracking-tight">
                1000+
              </span>
            </div>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 text-sm mt-2">
              Brands served across the United States
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 text-pbs-gold fill-pbs-gold"
              />
            ))}
            <span className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 ml-1">
              Quality Guaranteed
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/*  FREE DESIGN HIGHLIGHT CARD                                      */}
        {/* ================================================================ */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-pbs-black rounded-3xl p-6 sm:p-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[200px]">
          <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-15 transition-opacity" aria-hidden="true">
            <Paintbrush className="h-28 w-28" strokeWidth={1} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 bg-pbs-gold rounded-lg flex items-center justify-center">
                <Paintbrush className="h-4 w-4 text-pbs-black" />
              </div>
              <span className="text-xs font-bold text-pbs-gold uppercase tracking-widest">
                Included Free
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Free Design</h3>
            <p className="text-pbs-gray-400 text-sm mt-2 leading-relaxed">
              We create your packaging design at no extra cost with your first
              order. Send us your logo and we handle the rest.
            </p>
          </div>

          <Link
            href="/contact"
            className="relative z-10 text-pbs-gold text-sm font-medium flex items-center gap-1 mt-4 hover:gap-2 transition-all group/link"
          >
            Start your design
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ================================================================ */}
        {/*  PRODUCT CATEGORY CARDS                                          */}
        {/* ================================================================ */}
        {productCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.name}
              href={category.href}
              className="col-span-1 md:col-span-1 lg:col-span-2 group"
            >
              <div className="bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 h-full flex flex-col justify-between min-h-[180px] relative overflow-hidden hover:-translate-y-1">
                {/* Gradient accent on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                  aria-hidden="true"
                />

                {/* Normal state content */}
                <div className="relative z-10 group-hover:text-white transition-colors duration-300">
                  <div className="h-12 w-12 rounded-2xl bg-pbs-gray-100 dark:bg-pbs-gray-800 group-hover:bg-white/20 flex items-center justify-center mb-4 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-pbs-red group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-lg font-bold text-pbs-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 group-hover:text-white/80 mt-1.5 transition-colors duration-300">
                    {category.description}
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-1 text-pbs-red group-hover:text-white text-sm font-medium mt-4 transition-colors duration-300">
                  <span>View Products</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}

        {/* ================================================================ */}
        {/*  LAST PRODUCT CARD + WHY PBS CARD (share last row on lg)         */}
        {/* ================================================================ */}

        {/* WHY PBS CARD -- spans full width on md, 4 cols on lg */}
        <div className="col-span-1 md:col-span-4 lg:col-span-4 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-pbs-gray-100 dark:border-pbs-gray-800 relative overflow-hidden">
          <h3 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-6">
            Why Pack Brand Solutions?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <div key={prop.title} className="flex items-start gap-3">
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-pbs-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-pbs-gray-900 dark:text-white">
                      {prop.title}
                    </h4>
                    <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-0.5 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CLIENT SHOWCASE CARD */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-pbs-gray-900 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">
              Our Clients
            </span>
            <h3 className="text-xl font-bold text-pbs-gray-900 dark:text-white mt-2 mb-4">
              Trusted by Top Brands
            </h3>
          </div>

          <div className="space-y-2.5">
            {clients.map((client) => (
              <div
                key={client}
                className="flex items-center gap-2.5 text-sm text-pbs-gray-700 dark:text-pbs-gray-300"
              >
                <CheckCircle2 className="h-4 w-4 text-pbs-red shrink-0" />
                <span className="font-medium">{client}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/*  CTA / CONTACT CARD -- full width                                */}
        {/* ================================================================ */}
        <div className="col-span-1 md:col-span-4 lg:col-span-6 bg-gradient-to-r from-pbs-red to-pbs-red-dark rounded-3xl p-8 sm:p-10 lg:p-12 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 opacity-[0.08] transform translate-x-20 -translate-y-10 group-hover:scale-105 transition-transform duration-700" aria-hidden="true">
            <MessageCircle className="h-64 w-64" strokeWidth={1} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ready to brand your packaging?
              </h3>
              <p className="text-white/80 mt-2 text-base sm:text-lg max-w-xl">
                Get a free quote today. We&apos;ll design your custom packaging and
                deliver it fast. Call, email, or WhatsApp us &mdash; we&apos;re here for you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <Button variant="gold" size="lg" className="group/btn">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <a
                href="https://wa.me/15513893188"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 border border-white/25 hover:border-white/50"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>

              <a href="tel:+15513893188">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 border border-white/25 hover:border-white/50"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </Button>
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
