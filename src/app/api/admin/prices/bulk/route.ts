import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/admin-auth';
import { serverErrorResponse } from '@/shared/lib/api-errors';

/** افزایش/کاهش درصدی همه قیمت‌های یک محصول — برای وقتی کل بازار یک کالا جابه‌جا می‌شود */
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const { productId, percent, roundTo = 1 } = await request.json();
    const pct = Number(percent);
    const step = [1, 10, 100, 1000].includes(Number(roundTo)) ? Number(roundTo) : 1;
    if (!productId || !Number.isFinite(pct) || pct === 0 || pct <= -90 || pct > 500) {
      return NextResponse.json({ success: false, error: 'درصد معتبر نیست' }, { status: 400 });
    }
    const items = await prisma.priceItem.findMany({ where: { productId: String(productId), price: { not: null } } });
    const now = new Date();
    await prisma.$transaction(
      items.map((i) => {
        const price = Math.max(step, Math.round((i.price! * (1 + pct / 100)) / step) * step);
        return prisma.priceItem.update({
          where: { id: i.id },
          data: { previousPrice: i.price, price, priceChangedAt: now, history: { create: { price, recordedAt: now } } },
        });
      }),
    );
    return NextResponse.json({ success: true, data: { updated: items.length } });
  } catch (error) {
    return serverErrorResponse(error, 'Admin prices bulk error:');
  }
}
