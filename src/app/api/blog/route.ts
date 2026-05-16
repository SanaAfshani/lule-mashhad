import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { estimateReadTimeMinutes, slugify } from '@/shared/lib/utils';

function mapPost<T extends { tags: string }>(post: T) {
  let tags: string[] = [];
  try {
    tags = JSON.parse(post.tags) as string[];
  } catch {
    tags = [];
  }
  return { ...post, tags };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const featured = searchParams.get('featured') === 'true';
    const admin = searchParams.get('admin') === 'true';

    const where: { published?: boolean; featured?: boolean } = {};
    if (!admin) where.published = true;
    if (featured) where.featured = true;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { author: { select: { id: true, name: true, email: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: posts.map(mapPost),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();

    if (!title) {
      return NextResponse.json({ success: false, error: 'عنوان الزامی است' }, { status: 400 });
    }

    const content = String(body.content || '').trim();
    const slug = String(body.slug || '').trim() || slugify(title);

    let authorId = body.authorId as string | undefined;
    if (!authorId) {
      const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'asc' },
      });
      authorId = adminUser?.id;
    }

    if (!authorId) {
      return NextResponse.json(
        { success: false, error: 'نویسنده یافت نشد. ابتدا seed یا کاربر ادمین بسازید.' },
        { status: 400 },
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: body.excerpt ? String(body.excerpt) : null,
        content: content || '<p></p>',
        coverImage: body.coverImage ? String(body.coverImage) : null,
        tags: JSON.stringify(body.tags || []),
        published: Boolean(body.published),
        featured: Boolean(body.featured),
        readTime: body.readTime ? Number(body.readTime) : estimateReadTimeMinutes(content),
        authorId,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ success: true, data: mapPost(post) }, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    const message =
      error instanceof Error && error.message.includes('Unique constraint')
        ? 'این آدرس (slug) قبلاً استفاده شده است'
        : 'خطای سرور';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
