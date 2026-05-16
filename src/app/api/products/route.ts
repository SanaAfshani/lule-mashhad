import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { serializeProduct, toProductListItem } from '@/shared/lib/serializers';
import { slugify } from '@/shared/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const admin = searchParams.get('admin') === 'true';

    const where: Record<string, unknown> = {};
    if (!admin) where.published = true;
    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }
    if (featured) where.featured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: admin ? products.map(serializeProduct) : products.map(toProductListItem),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name || !body.categoryId) {
      return NextResponse.json({ success: false, error: 'نام و دسته‌بندی الزامی است' }, { status: 400 });
    }

    const slug = String(body.slug || '').trim() || slugify(name);
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: body.description ? String(body.description) : null,
        shortDescription: body.shortDescription ? String(body.shortDescription) : null,
        price: body.price != null && body.price !== '' ? parseFloat(String(body.price)) : null,
        images: JSON.stringify(body.images || []),
        specifications: JSON.stringify(body.specifications || {}),
        inStock: body.inStock ?? true,
        featured: body.featured ?? false,
        published: body.published ?? true,
        categoryId: body.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
