import { getCategories } from '@/lib/db/categories';
import { getProductCountsByCategory } from '@/lib/db/products';
import { AdminCategoriesClient } from '@/components/admin/AdminCategoriesClient';

export default async function AdminProductsPage() {
  const [rawCategories, productCounts] = await Promise.all([
    getCategories(),
    getProductCountsByCategory(),
  ]);

  const categories = rawCategories.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    nameEs: c.nameEs ?? '',
    slug: c.slug,
    description: c.description ?? '',
    descriptionEs: c.descriptionEs ?? '',
    iconName: c.iconName,
    sortOrder: c.sortOrder,
    isVisible: c.isVisible,
    productCount: productCounts[c._id.toString()] ?? 0,
  }));

  return <AdminCategoriesClient categories={categories} />;
}
