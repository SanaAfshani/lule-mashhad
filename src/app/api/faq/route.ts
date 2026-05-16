import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const admin = new URL(request.url).searchParams.get('admin') === 'true';
    const faqs = await prisma.fAQ.findMany({
      where: admin ? {} : { published: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('FAQ GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const faq = await prisma.fAQ.create({ data: body });
    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    console.error('FAQ POST error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
