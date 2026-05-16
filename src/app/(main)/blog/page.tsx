import type { Metadata } from 'next';
import { BlogListClient } from '@/features/blog/BlogListClient';
import { getPublishedBlogPosts } from '@/shared/lib/data';
import { formatDate } from '@/shared/lib/utils';

export const metadata: Metadata = {
  title: 'وبلاگ | لوله آنلاین مشهد',
  description: 'مقالات تخصصی لوله آب و فاضلاب، پلیکا، پلی اتیلن و چدن',
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  const cards = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    readTime: p.readTime,
    tag: p.tags[0] || 'مقاله',
    date: formatDate(p.createdAt),
    featured: p.featured,
    coverImage: p.coverImage || undefined,
  }));

  return <BlogListClient posts={cards} />;
}
