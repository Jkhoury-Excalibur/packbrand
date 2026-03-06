import { notFound } from 'next/navigation';
import { getCategoryById } from '@/lib/db/categories';
import { getProductById } from '@/lib/db/products';
import { AdminProductEditClient } from '@/components/admin/AdminProductEditClient';

type Props = { params: Promise<{ categoryId: string; id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { categoryId, id } = await params;

  const category = await getCategoryById(categoryId);
  if (!category) notFound();

  const isNew = id === 'new';

  if (isNew) {
    return (
      <AdminProductEditClient
        isNew
        product={null}
        categoryId={categoryId}
        categoryName={category.name}
      />
    );
  }

  const raw = await getProductById(id);
  if (!raw) notFound();

  const product = {
    id: raw._id.toString(),
    name: raw.name,
    nameEs: raw.nameEs || '',
    shortDescription: raw.shortDescription,
    shortDescEs: raw.shortDescEs || '',
    description: raw.description,
    descEs: raw.descEs || '',
    sizes: raw.sizes ?? [],
    features: raw.features,
    basePrice: raw.basePrice,
    pricingTiers: (raw.pricingTiers ?? []).map((t) => ({
      minQty: t.minQty,
      maxQty: t.maxQty ?? 0,
      pricePerUnit: t.unitPrice,
    })),
    isActive: raw.isActive,
    isFeatured: raw.isFeatured,
    allowLogoUpload: raw.allowLogoUpload,
    allowCustomText: raw.allowCustomText,
    images: raw.images,
  };

  return (
    <AdminProductEditClient
      isNew={false}
      product={product}
      categoryId={categoryId}
      categoryName={category.name}
    />
  );
}
