import type { BlogPost, Category, Product, Project } from '@/shared/types';
import { formatPersianNumber } from '@/shared/lib/utils';

export function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function parseJsonObject(value: string): Record<string, string> {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export function formatProductPrice(price: number | null | undefined): string {
  if (price == null || price === 0) return '۰';
  return formatPersianNumber(price);
}

type DbProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number | null;
  images: string;
  specifications: string;
  inStock: boolean;
  featured: boolean;
  published: boolean;
  categoryId: string;
  category: { slug: string; name: string; image?: string | null };
  createdAt: Date;
  updatedAt: Date;
};

export function serializeProduct(p: DbProduct): Product {
  return {
    ...p,
    description: p.description ?? '',
    shortDescription: p.shortDescription ?? '',
    price: p.price ?? undefined,
    images: parseJsonArray(p.images),
    specifications: parseJsonObject(p.specifications),
  } as Product;
}

export type ProductListItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  price: string;
  inStock: boolean;
  featured: boolean;
  specs: Record<string, string>;
  image?: string;
};

export function toProductListItem(p: DbProduct): ProductListItem {
  const specs = parseJsonObject(p.specifications);
  const images = parseJsonArray(p.images);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category.slug,
    categoryName: p.category.name,
    price: formatProductPrice(p.price),
    inStock: p.inStock,
    featured: p.featured,
    specs,
    image: images[0] || p.category.image || undefined,
  };
}

export function serializeCategory(c: Category & { _count?: { products: number } }): Category {
  return c;
}

type DbBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string;
  published: boolean;
  featured: boolean;
  readTime: number;
  viewCount: number;
  authorId: string;
  author?: { id: string; name: string; email?: string };
  createdAt: Date;
  updatedAt: Date;
};

export function serializeBlogPost(p: DbBlogPost): BlogPost {
  return {
    ...p,
    excerpt: p.excerpt ?? '',
    coverImage: p.coverImage ?? '',
    tags: parseJsonArray(p.tags),
    author: p.author as BlogPost['author'],
  };
}

export function serializeProject(p: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  images: string;
  location: string | null;
  year: number;
  client: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
}): Project {
  return {
    ...p,
    description: p.description ?? '',
    content: p.content ?? '',
    images: parseJsonArray(p.images),
    location: p.location ?? '',
    client: p.client ?? undefined,
  };
}
