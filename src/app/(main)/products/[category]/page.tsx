export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryProductsClient } from '@/features/products/CategoryProductsClient';
import { getCategoryBySlug, getPublishedProducts } from '@/shared/lib/data';

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'دسته‌بندی یافت نشد' };
  return {
    title: `${category.name} | محصولات`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getPublishedProducts({ categorySlug: slug });

  return (
    <CategoryProductsClient
      category={{
        slug: category.slug,
        name: category.name,
        description: category.description,
        image: category.image,
        productCount: category._count?.products ?? 0,
      }}
      products={products}
    />
  );
}
