export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price?: number;
  images: string[];
  category: Category;
  categoryId: string;
  specifications: Record<string, string>;
  inStock: boolean;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  _count?: { products: number };
  published: boolean;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  pdfUrl?: string;
  author: User;
  authorId: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readTime: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  location: string;
  year: number;
  client?: string;
  published: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  position?: string;
  content: string;
  rating: number;
  avatar?: string;
  published: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatar?: string;
  createdAt: Date;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'json' | 'boolean' | 'number';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
