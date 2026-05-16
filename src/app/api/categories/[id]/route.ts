import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

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

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Category PUT error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
