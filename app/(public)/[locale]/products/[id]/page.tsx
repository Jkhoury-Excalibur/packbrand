import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, ChevronRight } from 'lucide-react';
import { getProductById, getActiveProducts } from '@/lib/db/products';
import { getCategoryById } from '@/lib/db/categories';
import { getApprovedReviewsByProduct } from '@/lib/db/reviews';
import { getProductIcon } from '@/lib/utils/icons';
import { ProductOptions } from '@/components/shared/ProductOptions';
import { ProductReviews } from '@/components/shared/ProductReviews';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = await getProductById(id);
  if (!product || !product.isActive) notFound();

  // Fetch category for breadcrumb and related products
  const category = await getCategoryById(product.categoryId);
  const categoryName = category
    ? (locale === 'es' && category.nameEs ? category.nameEs : category.name)
    : '';
  const categorySlug = category?.slug ?? '';
  const categoryIconName = category?.iconName ?? 'Package';

  const pid = product._id.toString();

  const [allProducts, dbReviews] = await Promise.all([
    getActiveProducts(),
    getApprovedReviewsByProduct(pid),
  ]);
  const related = allProducts
    .filter((p) => p.categoryId === product.categoryId && p._id.toString() !== product._id.toString())
    .slice(0, 3);

  const reviews = dbReviews.map((r) => ({
    id: r._id.toString(),
    author: r.author,
    company: r.company,
    rating: r.rating,
    date: r.createdAt.toISOString().slice(0, 10),
    text: r.text,
    helpful: r.helpful,
  }));
  const iconName = product.iconName || categoryIconName;
  const Icon = getProductIcon(iconName);

  // Resolve locale-aware product fields
  const localizedName = locale === 'es' && product.nameEs ? product.nameEs : product.name;
  const localizedShortDesc = locale === 'es' && product.shortDescEs ? product.shortDescEs : product.shortDescription;
  const localizedDesc = locale === 'es' && product.descEs ? product.descEs : product.description;

  // Localize related products
  const localizedRelated = related.map((rp: any) => ({
    ...rp,
    name: locale === 'es' && rp.nameEs ? rp.nameEs : rp.name,
    shortDescription: locale === 'es' && rp.shortDescEs ? rp.shortDescEs : rp.shortDescription,
  }));

  return (
    <ProductDetailContent
      product={product}
      pid={pid}
      Icon={Icon}
      related={localizedRelated}
      categoryName={categoryName}
      categorySlug={categorySlug}
      categoryId={product.categoryId}
      categoryIconName={categoryIconName}
      localizedName={localizedName}
      localizedShortDesc={localizedShortDesc}
      localizedDesc={localizedDesc}
      reviews={reviews}
    />
  );
}

function ProductDetailContent({ product, pid, Icon, related, categoryName, categorySlug, categoryId, categoryIconName, localizedName, localizedShortDesc, localizedDesc, reviews }: {
  product: any;
  pid: string;
  Icon: any;
  related: any[];
  categoryName: string;
  categorySlug: string;
  categoryId: string;
  categoryIconName: string;
  localizedName: string;
  localizedShortDesc: string;
  localizedDesc: string;
  reviews: { id: string; author: string; company: string; rating: number; date: string; text: string; helpful: number }[];
}) {
  const t = useTranslations('ProductDetail');

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-1.5 text-sm text-pbs-gray-500 dark:text-pbs-gray-400">
        <Link href="/" className="hover:text-pbs-red transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/products" className="hover:text-pbs-red transition-colors">
          {t('breadcrumb')}
        </Link>
        {categoryName && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href={`/products?category=${categorySlug}` as any} className="hover:text-pbs-red transition-colors">
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-pbs-gray-900 dark:text-white font-medium truncate">{localizedName}</span>
      </nav>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

        {/* Left — image area */}
        <div className="space-y-3">
          <div className="bg-pbs-gray-100 dark:bg-pbs-gray-800/60 rounded-3xl aspect-square flex items-center justify-center border border-pbs-gray-200 dark:border-pbs-gray-700">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={localizedName} className="object-cover w-full h-full rounded-3xl" />
            ) : (
              <Icon className="h-36 w-36 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={0.75} />
            )}
          </div>
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
                {product.images && product.images[i] ? (
                  <img src={product.images[i]} alt="" className="object-cover w-full h-full rounded-2xl" />
                ) : (
                  <Icon className="h-8 w-8 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={1} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — product details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">
              {product.tags[0]}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mt-2 leading-tight">
              {localizedName}
            </h1>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-3 leading-relaxed">
              {localizedShortDesc}
            </p>
          </div>

          <hr className="border-pbs-gray-100 dark:border-pbs-gray-800" />

          <div>
            <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-4">
              {t('featuresTitle')}
            </p>
            <ul className="space-y-3">
              {product.features.map((feature: string) => (
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

          <ProductOptions
            id={pid}
            name={localizedName}
            categoryId={categoryId}
            categoryName={categoryName}
            sizes={product.sizes}
            basePrice={product.basePrice}
          />
        </div>
      </div>

      {/* ── DESCRIPTION + SPECS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-4">
            {t('descriptionTitle')}
          </h2>
          <p className="text-pbs-gray-600 dark:text-pbs-gray-400 leading-relaxed">
            {localizedDesc}
          </p>
        </div>

        <div className="bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl p-8 sm:p-10 border border-pbs-gray-100 dark:border-pbs-gray-800">
          <h2 className="text-xl font-bold text-pbs-gray-900 dark:text-white mb-4">
            {t('specsTitle')}
          </h2>
          <div className="space-y-3">
            {product.specs.map((spec: { label: string; value: string }) => (
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

      {/* ── REVIEWS ── */}
      <ProductReviews productId={pid} reviews={reviews} />

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-pbs-gray-900 dark:text-white mb-5">
            {t('relatedTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rp) => {
              const rIconName = rp.iconName || categoryIconName;
              const RIcon = getProductIcon(rIconName);
              const rpid = rp._id.toString();
              return (
                <Link
                  key={rpid}
                  href={`/products/${rpid}` as any}
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
