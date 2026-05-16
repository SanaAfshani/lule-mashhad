import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(body.question != null && { question: String(body.question) }),
        ...(body.answer != null && { answer: String(body.answer) }),
        ...(body.category != null && { category: body.category }),
        ...(body.order != null && { order: Number(body.order) }),
        ...(body.published != null && { published: Boolean(body.published) }),
      },
    });

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error('FAQ PUT error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.fAQ.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('FAQ DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
