import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, ChevronRight } from 'lucide-react';
import { ALL_PRODUCTS, type Product } from '@/lib/data/products';
import { ProductOptions } from '@/components/shared/ProductOptions';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = ALL_PRODUCTS.find((p) => p.id === Number(id));
  if (!product) notFound();

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const t = useTranslations('ProductDetail');
  const Icon = product.icon;

  const related = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
        <Link href="/" className="hover:text-pbs-red transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/products" className="hover:text-pbs-red transition-colors">
          {t('breadcrumb')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-pbs-gray-900 dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

        {/* Left — image area */}
        <div className="space-y-3">
          {/* Main image placeholder */}
          <div className="bg-pbs-gray-100 dark:bg-pbs-gray-800/60 rounded-3xl aspect-square flex items-center justify-center border border-pbs-gray-200 dark:border-pbs-gray-700">
            <Icon className="h-36 w-36 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={0.75} />
          </div>
          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-pbs-gray-100 dark:bg-pbs-gray-800/60 rounded-2xl aspect-square flex items-center justify-center border-2 transition-colors ${
                  i === 0
                    ? 'border-pbs-red'
                    : 'border-transparent hover:border-pbs-gray-300 dark:hover:border-pbs-gray-600 cursor-pointer'
                }`}
              >
                <Icon className="h-8 w-8 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={1} />
              </div>
            ))}
          </div>
        </div>

        {/* Right — product details */}
        <div className="space-y-6">
          {/* Category tag + name */}
          <div>
            <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">
              {product.tags[0]}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mt-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-3 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <hr className="border-pbs-gray-100 dark:border-pbs-gray-800" />

          {/* Key features */}
          <div>
            <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-4">
              {t('featuresTitle')}
            </p>
            <ul className="space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-pbs-gray-700 dark:text-pbs-gray-300">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-pbs-red" strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-pbs-gray-100 dark:border-pbs-gray-800" />

          {/* Options: size picker, quantity, CTAs, trust — client component */}
          <ProductOptions
            id={product.id}
            name={product.name}
            category={product.category}
            sizes={product.sizes}
            basePrice={product.basePrice}
          />
        </div>
      </div>

      {/* ── DESCRIPTION + SPECS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Long description */}
        <div className="lg:col-span-2 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-4">
            {t('descriptionTitle')}
          </h2>
          <p className="text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specs table */}
        <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-4">
            {t('specsTitle')}
          </h2>
          <div className="space-y-3">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between gap-4 text-sm border-b border-pbs-gray-100 dark:border-pbs-gray-800 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-pbs-gray-500 dark:text-pbs-gray-400 shrink-0">{spec.label}</span>
                <span className="font-semibold text-pbs-gray-900 dark:text-white text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-5">
            {t('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rp) => {
              const RIcon = rp.icon;
              return (
                <Link
                  key={rp.id}
                  href={`/products/${rp.id}` as any}
                  className="group bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-36 bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center">
                    <RIcon className="h-12 w-12 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={1} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-pbs-gray-900 dark:text-white group-hover:text-pbs-red transition-colors">
                      {rp.name}
                    </h3>
                    <p className="text-xs text-pbs-gray-500 dark:text-pbs-gray-400 mt-1 line-clamp-2">
                      {rp.shortDescription}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
