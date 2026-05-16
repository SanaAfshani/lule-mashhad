import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const admin = new URL(request.url).searchParams.get('admin') === 'true';

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!post || (!admin && !post.published)) {
      return NextResponse.json({ success: false, error: 'مقاله یافت نشد' }, { status: 404 });
    }

    let tags: string[] = [];
    try {
      tags = JSON.parse(post.tags) as string[];
    } catch {
      tags = [];
    }

    if (!admin) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true, data: { ...post, tags } });
  } catch (error) {
    console.error('Blog slug GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(body.title != null && { title: String(body.title) }),
        ...(body.slug != null && { slug: String(body.slug) }),
        ...(body.excerpt != null && { excerpt: body.excerpt }),
        ...(body.content != null && { content: String(body.content) }),
        ...(body.coverImage != null && { coverImage: body.coverImage }),
        ...(body.tags != null && { tags: JSON.stringify(body.tags) }),
        ...(body.published != null && { published: Boolean(body.published) }),
        ...(body.featured != null && { featured: Boolean(body.featured) }),
        ...(body.readTime != null && { readTime: Number(body.readTime) }),
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    let tags: string[] = [];
    try {
      tags = JSON.parse(post.tags) as string[];
    } catch {
      tags = [];
    }

    return NextResponse.json({ success: true, data: { ...post, tags } });
  } catch (error) {
    console.error('Blog slug GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    await prisma.blogPost.delete({ where: { slug } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog slug DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
