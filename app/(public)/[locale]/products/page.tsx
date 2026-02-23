import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { ALL_PRODUCTS } from '@/lib/data/products';
import { cn } from '@/lib/utils/cn';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

const CATEGORY_FILTERS = [
  { key: 'all',             labelKey: 'filterAll' as const },
  { key: 'cups',            labelKey: 'filterCups' as const },
  { key: 'bags',            labelKey: 'filterBags' as const },
  { key: 'boxes',           labelKey: 'filterBoxes' as const },
  { key: 'food-containers', labelKey: 'filterContainers' as const },
  { key: 'labels',          labelKey: 'filterLabels' as const },
];

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  return <ProductsContent activeCategory={category ?? 'all'} />;
}

function ProductsContent({ activeCategory }: { activeCategory: string }) {
  const t = useTranslations('Products');

  const filtered = activeCategory === 'all'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="bg-gradient-to-br from-pbs-red via-pbs-red-dark to-pbs-black rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.06] translate-x-16 -translate-y-16" aria-hidden="true">
          <Sparkles className="h-80 w-80" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <span className="inline-block bg-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/10 mb-5">
            {t('badge')}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-white/80 text-lg max-w-xl leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* ── FILTER PILLS ── */}
      <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-4 border border-pbs-gray-100 dark:border-pbs-gray-800">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((f) => {
            const isActive = activeCategory === f.key;
            const href = f.key === 'all' ? '/products' : `/products?category=${f.key}`;
            return (
              <Link
                key={f.key}
                href={href as any}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-pbs-red text-white'
                    : 'text-pbs-gray-600 dark:text-pbs-gray-400 hover:bg-pbs-gray-100 dark:hover:bg-pbs-gray-800 hover:text-pbs-red',
                )}
              >
                {t(f.labelKey)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      {filtered.length === 0 ? (
        <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-16 text-center border border-pbs-gray-100 dark:border-pbs-gray-800">
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="relative bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                {/* Stretched link covers the whole card */}
                <Link href={`/products/${product.id}` as any} className="absolute inset-0 z-0" aria-label={product.name} />

                {/* Placeholder image area */}
                <div className="h-44 bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center">
                  <Icon className="h-16 w-16 text-pbs-gray-300 dark:text-pbs-gray-600 group-hover:text-pbs-red/40 transition-colors duration-300" strokeWidth={1} />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-pbs-gray-100 dark:bg-pbs-gray-800 text-pbs-gray-600 dark:text-pbs-gray-400 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Name & description */}
                  <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-2 group-hover:text-pbs-red transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 leading-relaxed flex-1">
                    {product.shortDescription}
                  </p>

                  {/* View Details */}
                  <div className="mt-6 pt-4 border-t border-pbs-gray-100 dark:border-pbs-gray-800 relative z-10">
                    <Link href={`/products/${product.id}` as any}>
                      <Button variant="primary" size="sm" className="w-full">
                        {t('viewDetails')}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── BOTTOM CTA ── */}
      <div className="bg-pbs-black rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 opacity-[0.06] translate-x-8 translate-y-8" aria-hidden="true">
          <Package className="h-48 w-48" strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight mb-2">{t('ctaTitle')}</h2>
          <p className="text-pbs-gray-400 max-w-md">{t('ctaDescription')}</p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link href="/contact">
            <Button variant="gold" size="lg">
              {t('ctaButton')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
