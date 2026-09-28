export const dynamic = 'force-dynamic';

import { notFound, permanentRedirect } from 'next/navigation';
import { safeDecode } from '@/shared/lib/utils';
import { findRedirect } from '@/shared/lib/redirects';
import type { Metadata } from 'next';
import { CategoryProductsClient } from '@/features/products/CategoryProductsClient';
import { getCategoryBySlug, getPublishedProducts, resolveCategoryImage } from '@/shared/lib/data';
import { getPriceBoard } from '@/shared/lib/price-board';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';
import { absoluteUrl, breadcrumbSchema, toMetaDescription } from '@/shared/lib/seo';

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'دسته‌بندی یافت نشد', robots: { index: false, follow: true } };
  const desc = toMetaDescription(
    category.description ??
      `خرید انواع ${category.name} با قیمت مناسب و تحویل سریع به سراسر کشور. استعلام قیمت و مشاوره رایگان از ${siteConfig.name}.`
  );
  const canonical = `${siteConfig.url}/products/${encodeURIComponent(slug)}`;
  const image = category.image ? absoluteUrl(category.image) : undefined;
  return {
    title: `خرید ${category.name} | قیمت روز و مشخصات`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${category.name} | ${siteConfig.name}`,
      description: desc,
      url: canonical,
      type: 'website',
      ...(image ? { images: [{ url: image, alt: category.name }] } : {}),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const category = await getCategoryBySlug(slug);
  if (!category) {
    const moved = await findRedirect(`/products/${slug}`);
    if (moved) permanentRedirect(moved);
    notFound();
  }

  const [products, board] = await Promise.all([getPublishedProducts({ categorySlug: slug }), getPriceBoard()]);
  const priceProductIds = board.lines.filter((l) => l.categorySlug === slug).map((l) => l.productId);

  const canonical = `${siteConfig.url}/products/${encodeURIComponent(slug)}`;

  /** ItemList — به گوگل می‌گوید این صفحه فهرستی از محصولات است و ترتیب آن‌ها چیست */
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description ?? undefined,
    url: canonical,
    inLanguage: 'fa-IR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `${siteConfig.url}/products/${encodeURIComponent(slug)}/${encodeURIComponent(p.slug)}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'محصولات', path: '/products' },
          { name: category.name, path: `/products/${encodeURIComponent(slug)}` },
        ])}
      />
    <CategoryProductsClient
      category={{
        slug: category.slug,
        name: category.name,
        description: category.description,
        image: resolveCategoryImage(category),
        productCount: category._count?.products ?? 0,
      }}
      products={products}
      board={board}
      priceProductIds={priceProductIds}
    />
    </>
  );
}
