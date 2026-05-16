import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetailView } from '@/features/products/ProductDetailView';
import { getProductBySlug } from '@/shared/lib/data';

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug, category);
  if (!product) return { title: 'محصول یافت نشد' };
  return {
    title: `${product.name} | لوله آنلاین مشهد`,
    description: product.shortDescription || product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProductBySlug(slug, category);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
