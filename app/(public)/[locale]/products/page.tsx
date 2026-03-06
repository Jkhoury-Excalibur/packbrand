import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { getActiveProducts } from '@/lib/db/products';
import { getVisibleCategories } from '@/lib/db/categories';
import { getProductIcon } from '@/lib/utils/icons';
import { cn } from '@/lib/utils/cn';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category: categorySlug } = await searchParams;
  setRequestLocale(locale);

  const [allProducts, categories] = await Promise.all([
    getActiveProducts(),
    getVisibleCategories(),
  ]);

  // Build slug → categoryId map
  const slugToCategoryId = new Map(categories.map((c) => [c.slug, c._id.toString()]));
  const categoryIdToName = new Map(categories.map((c) => [c._id.toString(), locale === 'es' && c.nameEs ? c.nameEs : c.name]));

  const activeCategoryId = categorySlug ? slugToCategoryId.get(categorySlug) : undefined;

  const all = allProducts.map((p) => ({
    _id: p._id.toString(),
    categoryId: p.categoryId,
    iconName: p.iconName ?? '',
    name: locale === 'es' && p.nameEs ? p.nameEs : p.name,
    shortDescription: locale === 'es' && p.shortDescEs ? p.shortDescEs : p.shortDescription,
    tags: p.tags,
  }));

  const filtered = (!categorySlug || categorySlug === 'all' || !activeCategoryId)
    ? all
    : all.filter((p) => p.categoryId === activeCategoryId);

  // Build filter pills from DB categories
  const filterPills = [
    { key: 'all', slug: 'all', label: locale === 'es' ? 'Todos' : 'All' },
    ...categories.map((c) => ({
      key: c._id.toString(),
      slug: c.slug,
      label: locale === 'es' && c.nameEs ? c.nameEs : c.name,
    })),
  ];

  return <ProductsContent products={filtered} filterPills={filterPills} activeSlug={categorySlug ?? 'all'} categories={categories.map((c) => ({ id: c._id.toString(), iconName: c.iconName }))} />;
}

type ProductForGrid = {
  _id: string;
  categoryId: string;
  iconName: string;
  name: string;
  shortDescription: string;
  tags: string[];
};

type FilterPill = { key: string; slug: string; label: string };
type CategoryInfo = { id: string; iconName: string };

function ProductsContent({ products, filterPills, activeSlug, categories }: {
  products: ProductForGrid[];
  filterPills: FilterPill[];
  activeSlug: string;
  categories: CategoryInfo[];
}) {
  const t = useTranslations('Products');

  // Build a map of categoryId → iconName for fallback
  const catIconMap = new Map(categories.map((c) => [c.id, c.iconName]));

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
          {filterPills.map((f) => {
            const isActive = activeSlug === f.slug;
            const href = f.slug === 'all' ? '/products' : `/products?category=${f.slug}`;
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
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      {products.length === 0 ? (
        <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-16 text-center border border-pbs-gray-100 dark:border-pbs-gray-800">
          <p className="text-pbs-gray-500 dark:text-pbs-gray-400">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const iconName = product.iconName || catIconMap.get(product.categoryId) || 'Package';
            const Icon = getProductIcon(iconName);
            const pid = product._id.toString();
            return (
              <div
                key={pid}
                className="relative bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                <Link href={`/products/${pid}` as any} className="absolute inset-0 z-0" aria-label={product.name} />

                <div className="h-44 bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center">
                  <Icon className="h-16 w-16 text-pbs-gray-300 dark:text-pbs-gray-600 group-hover:text-pbs-red/40 transition-colors duration-300" strokeWidth={1} />
                </div>

                <div className="p-6 flex flex-col flex-1">
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

                  <h2 className="text-lg font-bold text-pbs-gray-900 dark:text-white mb-2 group-hover:text-pbs-red transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-sm text-pbs-gray-500 dark:text-pbs-gray-400 leading-relaxed flex-1">
                    {product.shortDescription}
                  </p>

                  <div className="mt-6 pt-4 border-t border-pbs-gray-100 dark:border-pbs-gray-800 relative z-10">
                    <Link href={`/products/${pid}` as any}>
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
