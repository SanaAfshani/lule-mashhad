import { prisma } from '@/shared/lib/prisma';
import {
  serializeBlogPost,
  serializeProduct,
  serializeProject,
  toProductListItem,
} from '@/shared/lib/serializers';

export async function getPublishedCategories() {
  return prisma.category.findMany({
    where: { published: true },
    include: { _count: { select: { products: { where: { published: true } } } } },
    orderBy: { order: 'asc' },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, published: true },
    include: { _count: { select: { products: { where: { published: true } } } } },
  });
}

export async function getPublishedProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}) {
  const where: {
    published: boolean;
    featured?: boolean;
    category?: { slug: string };
    OR?: { name?: { contains: string }; shortDescription?: { contains: string } }[];
  } = { published: true };

  if (options?.categorySlug && options.categorySlug !== 'all') {
    where.category = { slug: options.categorySlug };
  }
  if (options?.featured) where.featured = true;
  if (options?.search) {
    where.OR = [
      { name: { contains: options.search } },
      { shortDescription: { contains: options.search } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: options?.limit,
  });

  return products.map(toProductListItem);
}

export async function getProductBySlug(slug: string, categorySlug?: string) {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      published: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
  });

  return product ? serializeProduct(product) : null;
}

export async function getFeaturedProducts(limit = 6) {
  return getPublishedProducts({ featured: true, limit });
}

export async function getPublishedBlogPosts(options?: { featured?: boolean; limit?: number }) {
  const posts = await prisma.blogPost.findMany({
    where: { published: true, ...(options?.featured ? { featured: true } : {}) },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: options?.limit,
  });

  return posts.map(serializeBlogPost);
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { id: true, name: true, email: true } } },
  });

  if (!post || !post.published) return null;

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return serializeBlogPost(post);
}

export async function getPublishedFaqs() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  const seen = new Set<string>();
  return faqs.filter((f) => {
    const key = f.question.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getPublishedTestimonials(limit?: number) {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getPublishedProjects(options?: { featured?: boolean; limit?: number }) {
  const projects = await prisma.project.findMany({
    where: { published: true, ...(options?.featured ? { featured: true } : {}) },
    orderBy: [{ featured: 'desc' }, { year: 'desc' }],
    take: options?.limit,
  });

  return projects.map(serializeProject);
}

export async function getProjectBySlug(slug: string) {
  const project = await prisma.project.findFirst({
    where: { slug, published: true },
  });

  return project ? serializeProject(project) : null;
}

export async function getSiteSettingsMap() {
  const settings = await prisma.siteSettings.findMany();
  return settings.reduce(
    (acc, s) => ({ ...acc, [s.key]: s.value }),
    {} as Record<string, string>,
  );
}
