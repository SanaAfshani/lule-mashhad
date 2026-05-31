import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { serverErrorResponse } from '@/shared/lib/api-errors';

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name != null && { name: String(body.name) }),
        ...(body.slug != null && { slug: String(body.slug) }),
        ...(body.description != null && { description: body.description }),
        ...(body.image != null && { image: body.image }),
        ...(body.icon != null && { icon: body.icon }),
        ...(body.order != null && { order: Number(body.order) }),
        ...(body.published != null && { published: Boolean(body.published) }),
      },
    });

    revalidatePath('/categories');
    revalidatePath('/products', 'layout');

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return serverErrorResponse(error, 'Category PUT error:');
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: 'دسته‌بندی یافت نشد' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      if (category._count.products > 0) {
        await tx.product.deleteMany({ where: { categoryId: id } });
      }
      await tx.category.delete({ where: { id } });
    });

    revalidatePath('/categories');
    revalidatePath('/products', 'layout');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      deletedProducts: category._count.products,
    });
  } catch (error) {
    return serverErrorResponse(error, 'Category DELETE error:');
  }
}
