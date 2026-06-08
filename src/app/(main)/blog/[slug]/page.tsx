import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPostView } from '@/features/blog/BlogPostView';
import { getBlogPostBySlug } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'مقاله یافت نشد' };
  return {
    title: `${post.title} | وبلاگ قدیر لوله آنلاین`,
    description: post.excerpt,
    alternates: {
      canonical: `${siteConfig.url}/blog/${encodeURIComponent(slug)}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author?.name ?? siteConfig.name],
      ...(post.coverImage ? { images: [`${siteConfig.url}${post.coverImage}`] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author?.name ?? siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${siteConfig.url}/blog/${encodeURIComponent(slug)}`,
    ...(post.coverImage ? { image: `${siteConfig.url}${post.coverImage}` } : {}),
    inLanguage: 'fa-IR',
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <BlogPostView post={post} />
    </>
  );
}
