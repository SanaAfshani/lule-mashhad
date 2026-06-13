import type { MetadataRoute } from 'next';
import {
  getPublishedBlogPosts,
  getPublishedCategories,
  getPublishedProducts,
  getPublishedProjects,
} from '@/shared/lib/data';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ghadirlouleonline.ir';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const [categories, products, posts, projects] = await Promise.all([
    getPublishedCategories(),
    getPublishedProducts(),
    getPublishedBlogPosts(),
    getPublishedProjects(),
  ]);

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/products/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${encodeURIComponent(p.category)}/${encodeURIComponent(p.slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages, ...projectPages];
}
