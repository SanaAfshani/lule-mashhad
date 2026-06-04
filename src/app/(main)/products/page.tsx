export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ProductsPageClient } from '@/features/products/ProductsPageClient';
import { getPublishedCategories, getPublishedProducts } from '@/shared/lib/data';

export const metadata: Metadata = {
  title: 'محصولات | قدیر لوله آنلاین ',
  description: 'انواع لوله فولادی، مانیسمان، اتصالات، فلنج و شیرآلات صنعتی',
};

export default async function ProductsPage() {
  const [dbCategories, products] = await Promise.all([
    getPublishedCategories(),
    getPublishedProducts(),
  ]);

  const categories = [
    { slug: 'all', name: 'همه محصولات' },
    ...dbCategories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return <ProductsPageClient categories={categories} products={products} />;
}
