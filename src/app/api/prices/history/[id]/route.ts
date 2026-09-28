import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getMarketNow } from '@/shared/lib/price-board';
import { getDailyHistory, HISTORY_RANGES } from '@/shared/lib/price-history';
import { serverErrorResponse } from '@/shared/lib/api-errors';
import type { HistoryRange } from '@/shared/lib/price-board-types';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

/**
 * نمودار نوسان قیمت یک ردیف. مثل خود تابلو، وقتی فروش بسته است قیمتی (حتی تاریخچه) برنمی‌گردد.
 * ?range=7|30|90|365
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const requested = Number(request.nextUrl.searchParams.get('range'));
    const range: HistoryRange = HISTORY_RANGES.includes(requested as HistoryRange) ? (requested as HistoryRange) : 30;
    const headers = { 'Cache-Control': 'no-store, max-age=0' };

    const [market, item] = await Promise.all([
      getMarketNow(),
      prisma.priceItem.findUnique({
        where: { id: id.slice(0, 64) },
        select: { price: true, product: { select: { published: true } } },
      }),
    ]);
    if (!item || !item.product.published) {
      return NextResponse.json({ success: false, error: 'ردیف یافت نشد' }, { status: 404, headers });
    }
    if (!market.open) return NextResponse.json({ success: true, data: { closed: true } }, { headers });
    if (item.price == null) return NextResponse.json({ success: true, data: { inquiry: true } }, { headers });

    return NextResponse.json({ success: true, data: { range, points: await getDailyHistory(id, range) } }, { headers });
  } catch (error) {
    return serverErrorResponse(error, 'Price history error:');
  }
}
