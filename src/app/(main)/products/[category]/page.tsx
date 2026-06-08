export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryProductsClient } from '@/features/products/CategoryProductsClient';
import { getCategoryBySlug, getPublishedProducts } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'دسته‌بندی یافت نشد' };
  const desc = category.description ?? `خرید ${category.name} در مشهد — قیمت مناسب، تحویل سریع`;
  return {
    title: `${category.name} | قدیر لوله آنلاین`,
    description: desc,
    alternates: {
      canonical: `${siteConfig.url}/products/${encodeURIComponent(slug)}`,
    },
    openGraph: { title: `${category.name} | قدیر لوله آنلاین`, description: desc },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
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
