export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { CategoriesPageClient } from '@/features/categories/CategoriesPageClient';
import { getPublishedCategories } from '@/shared/lib/data';

export const metadata: Metadata = {
  title: 'دسته‌بندی محصولات | قدیر لوله آنلاین ',
  description: 'دسته‌بندی لوله پلیکا، پلی اتیلن، چدن داکتیل، منهول، اتصالات و شیرآلات',
};

export default async function CategoriesPage() {
  const categories = await getPublishedCategories();

  const cards = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    icon: c.icon,
    productCount: c._count?.products ?? 0,
  }));

  return <CategoriesPageClient categories={cards} />;
}
