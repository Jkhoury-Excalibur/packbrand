import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/db/categories';
import { getProductsByCategory } from '@/lib/db/products';
import { AdminCategoryProductsClient } from '@/components/admin/AdminCategoryProductsClient';

type Props = {
  params: Promise<{ categoryId: string }>;
};

export default async function AdminCategoryProductsPage({ params }: Props) {
  const { categoryId } = await params;

  const category = await getCategoryById(categoryId);
  if (!category) notFound();

  const rawProducts = await getProductsByCategory(categoryId);

  const products = rawProducts.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    shortDescription: p.shortDescription,
    iconName: p.iconName ?? '',
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    sizes: p.sizes ?? [],
    basePrice: p.basePrice,
  }));

  return (
    <AdminCategoryProductsClient
      categoryId={categoryId}
      categoryName={category.name}
      categoryIconName={category.iconName}
      products={products}
    />
  );
}
