import { notFound, permanentRedirect } from 'next/navigation';
import { safeDecode } from '@/shared/lib/utils';
import { findRedirect } from '@/shared/lib/redirects';
import type { Metadata } from 'next';
import { BlogPostView } from '@/features/blog/BlogPostView';
import { getBlogPostBySlug, getNavCategories } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';
import { absoluteUrl, breadcrumbSchema, faqPageSchema, toMetaDescription } from '@/shared/lib/seo';
import { stripHtml } from '@/shared/lib/utils';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'مقاله یافت نشد', robots: { index: false, follow: true } };

  // مقادیر ست‌شده در پنل ادمین اولویت دارند؛ در صورت خالی بودن از محتوای مقاله fallback می‌شود
  const description = toMetaDescription(post.metaDescription || post.excerpt || post.content);
  const ogTitle = post.ogTitle || post.metaTitle || post.title;
  const ogDescription = toMetaDescription(post.ogDescription || description);
  const canonical = `${siteConfig.url}/blog/${encodeURIComponent(slug)}`;
  const image = post.coverImage ? absoluteUrl(post.coverImage) : undefined;

  return {
    // metaTitle دقیقاً همان چیزی است که ادمین در پیش‌نمایش گوگل دیده — پس template سایت روی آن اعمال نمی‌شود
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description,
    ...(post.focusKeyword ? { keywords: [post.focusKeyword] } : {}),
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author?.name ?? siteConfig.name],
      ...(image ? { images: [{ url: image, alt: ogTitle }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    const moved = await findRedirect(`/blog/${slug}`);
    if (moved) permanentRedirect(moved);
    notFound();
  }

  // مقاله اطلاعاتی بن‌بست نباشد: دسته‌هایی که نامشان در مقاله آمده، به صفحه خرید همان دسته لینک می‌شوند
  const norm = (s: string) => s.replace(/[\u200c\s]+/g, ' ');
  const text = norm(`${post.title} ${post.tags.join(' ')} ${stripHtml(post.content)}`);
  const relatedCategories = (await getNavCategories())
    .filter((c) => text.includes(norm(c.name)))
    .slice(0, 4)
    .map((c) => ({ slug: c.slug, name: c.name }));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metaTitle || post.title,
    name: post.title,
    description: toMetaDescription(post.metaDescription || post.excerpt || post.content, 400),
    ...(post.focusKeyword ? { keywords: post.focusKeyword } : {}),
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${encodeURIComponent(slug)}`,
    },
    ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
    ...(post.content
      ? { wordCount: post.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length }
      : {}),
    isPartOf: { '@type': 'Blog', name: `وبلاگ ${siteConfig.name}`, url: `${siteConfig.url}/blog` },
    inLanguage: 'fa-IR',
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      {/* سوالات متداول اختصاصی مقاله — واجد شرایط rich result آکاردئونی */}
      {post.faqs.length > 0 && <JsonLd data={faqPageSchema(post.faqs)} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: 'وبلاگ', path: '/blog' },
          { name: post.title, path: `/blog/${encodeURIComponent(slug)}` },
        ])}
      />
      <BlogPostView post={post} relatedCategories={relatedCategories} />
    </>
  );
}
