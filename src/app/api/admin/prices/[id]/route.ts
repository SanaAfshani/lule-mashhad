import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/admin-auth';
import { serverErrorResponse } from '@/shared/lib/api-errors';
import { text, toPrice } from '@/shared/lib/price-admin';

type Props = { params: Promise<{ id: string }> };

/** ویرایش تک‌سلولی از تابلوی قیمت — با تغییر قیمت، قیمت قبلی نگه داشته می‌شود */
export async function PATCH(request: NextRequest, { params }: Props) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const { id } = await params;
    const body = await request.json();
    const current = await prisma.priceItem.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ success: false, error: 'ردیف یافت نشد' }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = text(body.title) || current.title;
    if (body.weight !== undefined) data.weight = text(body.weight, 40);
    if (body.note !== undefined) data.note = text(body.note);
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;
    if (body.price !== undefined) {
      const price = toPrice(body.price);
      if (price !== current.price) {
        data.price = price;
        data.previousPrice = current.price;
        data.priceChangedAt = new Date();
        // هر تغییر قیمت یک نقطه در نمودار نوسان — در همان کوئری، اتمیک
        if (price != null) data.history = { create: { price } };
      }
    }
    const item = await prisma.priceItem.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return serverErrorResponse(error, 'Admin price PATCH error:');
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  await prisma.priceItem.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ success: true });
}
