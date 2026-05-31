import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { serverErrorResponse } from '@/shared/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const admin = new URL(request.url).searchParams.get('admin') === 'true';
    const categories = await prisma.category.findMany({
      where: admin ? {} : { published: true },
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return serverErrorResponse(error, 'Categories GET error:');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await prisma.category.create({ data: body });

    revalidatePath('/categories');
    revalidatePath('/products', 'layout');

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return serverErrorResponse(error, 'Categories POST error:');
  }
}
