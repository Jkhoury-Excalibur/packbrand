import { getAllReviews } from '@/lib/db/reviews';
import { getActiveProducts } from '@/lib/db/products';
import { AdminReviewsClient } from '@/components/admin/AdminReviewsClient';

export default async function ReviewsPage() {
  const [rawReviews, products] = await Promise.all([getAllReviews(), getActiveProducts()]);

  const productMap = new Map(products.map((p) => [p._id.toString(), p.name]));

  const reviews = rawReviews.map((r) => ({
    id: r._id.toString(),
    productId: r.productId,
    productName: productMap.get(r.productId) ?? r.productId,
    author: r.author,
    company: r.company ?? '',
    rating: r.rating,
    text: r.text,
    status: r.status,
    date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  }));

  return <AdminReviewsClient reviews={reviews} />;
}
