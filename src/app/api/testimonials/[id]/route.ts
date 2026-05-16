import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(body.name != null && { name: String(body.name) }),
        ...(body.company != null && { company: body.company }),
        ...(body.position != null && { position: body.position }),
        ...(body.content != null && { content: String(body.content) }),
        ...(body.rating != null && { rating: Number(body.rating) }),
        ...(body.avatar != null && { avatar: body.avatar }),
        ...(body.published != null && { published: Boolean(body.published) }),
      },
    });

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Testimonial PUT error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Testimonial DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
