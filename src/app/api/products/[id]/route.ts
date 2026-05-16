import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { serializeProduct } from '@/shared/lib/serializers';

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const admin = new URL(request.url).searchParams.get('admin') === 'true';

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        ...(admin ? {} : { published: true }),
      },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'محصول یافت نشد' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeProduct(product) });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.name != null) data.name = String(body.name);
    if (body.slug != null) data.slug = String(body.slug);
    if (body.description != null) data.description = body.description;
    if (body.shortDescription != null) data.shortDescription = body.shortDescription;
    if (body.categoryId != null) data.categoryId = body.categoryId;
    if (body.inStock != null) data.inStock = Boolean(body.inStock);
    if (body.featured != null) data.featured = Boolean(body.featured);
    if (body.published != null) data.published = Boolean(body.published);
    if (body.images != null) data.images = JSON.stringify(body.images);
    if (body.specifications != null) data.specifications = JSON.stringify(body.specifications);
    if (body.price !== undefined) {
      data.price = body.price != null && body.price !== '' ? parseFloat(String(body.price)) : null;
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: serializeProduct(product) });
  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'محصول حذف شد' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
