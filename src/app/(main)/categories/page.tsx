export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { CategoriesPageClient } from '@/features/categories/CategoriesPageClient';
import { getPublishedCategories, resolveCategoryImage } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';
import { breadcrumbSchema } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: 'دسته‌بندی محصولات | لوله، اتصالات و شیرآلات',
  description:
    'دسته‌بندی کامل محصولات: لوله پلیکا، پلی اتیلن، چدن داکتیل، منهول، اتصالات و شیرآلات صنعتی. انتخاب سریع دسته و مشاهده قیمت.',
  alternates: { canonical: `${siteConfig.url}/categories` },
};

export default async function CategoriesPage() {
  const categories = await getPublishedCategories();

  const cards = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: resolveCategoryImage(c),
    icon: c.icon,
    productCount: c._count?.products ?? 0,
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'دسته‌بندی محصولات', path: '/categories' }])} />
      <CategoriesPageClient categories={cards} />
    </>
  );
}
