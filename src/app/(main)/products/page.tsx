export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ProductsPageClient } from '@/features/products/ProductsPageClient';
import { getPublishedCategories, getPublishedProducts } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';
import { breadcrumbSchema } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: 'محصولات | خرید لوله، اتصالات و شیرآلات صنعتی',
  description:
    'فهرست کامل محصولات: انواع لوله فولادی، مانیسمان، پلیکا، پلی اتیلن، اتصالات، فلنج و شیرآلات صنعتی با قیمت روز و ارسال سریع به سراسر ایران.',
  alternates: { canonical: `${siteConfig.url}/products` },
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

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'محصولات', path: '/products' }])} />
      <ProductsPageClient categories={categories} products={products} />
    </>
  );
}
