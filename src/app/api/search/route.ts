import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { serializeBlogPost, toProductListItem } from '@/shared/lib/serializers';

export async function GET(request: NextRequest) {
  try {
    const q = new URL(request.url).searchParams.get('q')?.trim() || '';

    if (!q) {
      return NextResponse.json({
        success: true,
        data: { products: [], posts: [], projects: [] },
      });
    }

    const [products, posts, projects] = await Promise.all([
      prisma.product.findMany({
        where: {
          published: true,
          OR: [
            { name: { contains: q } },
            { shortDescription: { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: { category: true },
        take: 12,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.blogPost.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
          ],
        },
        include: { author: { select: { id: true, name: true, email: true } } },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
            { location: { contains: q } },
          ],
        },
        take: 6,
        orderBy: [{ featured: 'desc' }, { year: 'desc' }],
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products: products.map(toProductListItem),
        posts: posts.map(serializeBlogPost),
        projects: projects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description ?? '',
          location: p.location ?? '',
          year: p.year,
        })),
      },
    });
  } catch (error) {
    console.error('Search GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
