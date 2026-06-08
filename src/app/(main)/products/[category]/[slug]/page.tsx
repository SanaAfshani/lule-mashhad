export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetailView } from '@/features/products/ProductDetailView';
import { getProductBySlug } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: rawCat, slug: rawSlug } = await params;
  const category = decodeURIComponent(rawCat);
  const slug = decodeURIComponent(rawSlug);
  const product = await getProductBySlug(slug, category);
  if (!product) return { title: 'محصول یافت نشد' };

  const desc = product.shortDescription || product.description?.slice(0, 160) || '';
  const images = (() => {
    try { return JSON.parse(product.images as unknown as string) as string[]; } catch { return [] as string[]; }
  })();
  const image = images[0] ? `${siteConfig.url}${images[0]}` : undefined;

  return {
    title: `${product.name} | قدیر لوله آنلاین`,
    description: desc,
    alternates: {
      canonical: `${siteConfig.url}/products/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`,
    },
    openGraph: {
      title: `${product.name} | قدیر لوله آنلاین`,
      description: desc,
      ...(image ? { images: [image] } : {}),
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category: rawCat, slug: rawSlug } = await params;
  const category = decodeURIComponent(rawCat);
  const slug = decodeURIComponent(rawSlug);
  const product = await getProductBySlug(slug, category);
  if (!product) notFound();

  const images = (() => {
    try { return JSON.parse(product.images as unknown as string) as string[]; } catch { return [] as string[]; }
  })();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description || '',
    sku: product.slug,
    brand: { '@type': 'Brand', name: siteConfig.name },
    ...(images[0] ? { image: `${siteConfig.url}${images[0]}` } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: siteConfig.name },
    },
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetailView product={product} />
    </>
  );
}
