export const dynamic = 'force-dynamic';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { prisma } from '@/shared/lib/prisma';
import { AdminDashboardClient } from './AdminDashboardClient';

async function getDashboardData() {
  const [
    productCount,
    publishedProductCount,
    blogCount,
    publishedBlogCount,
    messageCount,
    unreadMessageCount,
    projectCount,
    categoryCount,
    recentMessages,
    recentProducts,
    recentPosts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.project.count(),
    prisma.category.count(),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, subject: true, createdAt: true, read: true },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { id: true, title: true, createdAt: true, published: true },
    }),
  ]);

  return {
    productCount,
    publishedProductCount,
    blogCount,
    publishedBlogCount,
    messageCount,
    unreadMessageCount,
    projectCount,
    categoryCount,
    recentMessages,
    recentProducts,
    recentPosts,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();
  return <AdminDashboardClient data={data} />;
}
