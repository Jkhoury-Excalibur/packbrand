import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, ChevronRight } from 'lucide-react';
import { getShopifyProduct, getShopifyProductPage, getShopifyVariants } from '@/lib/shopify/catalog';
import type { CatalogVariant } from '@/lib/shopify/catalog-data';
import { getApprovedReviewsByProduct } from '@/lib/db/reviews';
import { getProductIcon } from '@/lib/utils/icons';
import { ShopifyProductOptions } from '@/components/shared/ShopifyProductOptions';
import { ProductReviews } from '@/components/shared/ProductReviews';
import { ProductImageGallery } from '@/components/shared/ProductImageGallery';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [source, variants] = await Promise.all([
    getShopifyProduct(locale, id),
    getShopifyVariants(locale, id),
  ]);
  if (!source) notFound();
  const category = source.collections.nodes.find(c => c.handle !== 'frontpage') ?? source.collections.nodes[0];
  const categoryName = category?.title ?? '';
  const categorySlug = category?.handle ?? '';
  const pid = source.id;
  const [relatedPage, dbReviews] = await Promise.all([
    getShopifyProductPage(locale, category?.handle ?? null, null),
    getApprovedReviewsByProduct(pid),
  ]);
  const product: ProductView = {
    name: source.title,
    description: source.description,
    images: source.images.nodes.map(image => image.url),
    tags: source.tags,
    specs: [
      ...(source.productType ? [{ label: locale === 'es' ? 'Tipo' : 'Type', value: source.productType }] : []),
      ...source.options.filter(option => option.name !== 'Title').map(option => ({ label: option.name, value: option.optionValues.map(value => value.name).join(', ') })),
    ],
  };
  const related = (relatedPage?.nodes ?? []).filter(p => p.id !== pid).slice(0, 3).map(p => ({
    id: p.handle,
    name: p.title,
    shortDescription: p.description,
    image: p.featuredImage?.url,
  }));

  const reviews = dbReviews.map((r) => ({
    id: r._id.toString(),
    author: r.author,
    company: r.company,
    rating: r.rating,
    date: r.createdAt.toISOString().slice(0, 10),
    text: r.text,
    helpful: r.helpful,
  }));
  return (
    <ProductDetailContent
      product={product}
      pid={pid}
      related={related}
      categoryName={categoryName}
      categorySlug={categorySlug}
      categoryId={category?.id ?? ''}
      variants={variants}
      reviews={reviews}
    />
  );
}

type ProductView = { name: string; description: string; images: string[]; tags: string[]; specs: { label: string; value: string }[] };
type RelatedProduct = { id: string; name: string; shortDescription: string; image?: string };

function ProductDetailContent({ product, pid, related, categoryName, categorySlug, categoryId, variants, reviews }: {
  product: ProductView;
  pid: string;
  related: RelatedProduct[];
  categoryName: string;
  categorySlug: string;
  categoryId: string;
  variants: CatalogVariant[];
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
            <Link href={{ pathname: '/products', query: { category: categorySlug } }} className="hover:text-pbs-red transition-colors">
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-pbs-gray-900 dark:text-white font-medium truncate">{product.name}</span>
      </nav>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

        {/* Left — image area */}
        <ProductImageGallery
          images={product.images ?? []}
          alt={product.name}
          iconName="Package"
        />

        {/* Right — product details */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-pbs-red uppercase tracking-widest">
              {product.tags[0]}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-pbs-gray-900 dark:text-white tracking-tight mt-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-pbs-gray-500 dark:text-pbs-gray-400 mt-3 leading-relaxed">
              {product.description.length > 180 ? `${product.description.slice(0, 180)}…` : product.description}
            </p>
          </div>

          <hr className="border-pbs-gray-100 dark:border-pbs-gray-800" />

          {product.tags.length > 0 && <div>
            <p className="text-xs font-bold text-pbs-gray-500 dark:text-pbs-gray-400 uppercase tracking-widest mb-4">
              {t('featuresTitle')}
            </p>
            <ul className="space-y-3">
              {product.tags.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-pbs-gray-700 dark:text-pbs-gray-300">
                  <span className="shrink-0 h-5 w-5 rounded-full bg-pbs-red/10 dark:bg-pbs-red/20 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-pbs-red" strokeWidth={2.5} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>}

          <hr className="border-pbs-gray-100 dark:border-pbs-gray-800" />

          <ShopifyProductOptions
            key={pid}
            productId={pid}
            name={product.name}
            categoryId={categoryId}
            categoryName={categoryName}
            variants={variants}
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
            {product.description}
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
              const RIcon = getProductIcon('Package');
              const rpid = rp.id;
              const rpImg = rp.image;
              return (
                <Link
                  key={rpid}
                  href={`/products/${rpid}`}
                  className="group bg-pbs-gray-50 dark:bg-pbs-gray-900 rounded-3xl border border-pbs-gray-100 dark:border-pbs-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-36 bg-pbs-gray-100 dark:bg-pbs-gray-800 flex items-center justify-center overflow-hidden">
                    {rpImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rpImg} alt={rp.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <RIcon className="h-12 w-12 text-pbs-gray-300 dark:text-pbs-gray-600" strokeWidth={1} />
                    )}
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
