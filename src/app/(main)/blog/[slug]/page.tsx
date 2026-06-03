import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPostView } from '@/features/blog/BlogPostView';
import { getBlogPostBySlug } from '@/shared/lib/data';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'مقاله یافت نشد' };
  return { title: `${post.title} | وبلاگ`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  return <BlogPostView post={post} />;
}
