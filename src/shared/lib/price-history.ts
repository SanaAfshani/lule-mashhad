import { prisma } from '@/shared/lib/prisma';
import type { HistoryPoint, HistoryRange } from '@/shared/lib/price-board-types';

export const HISTORY_RANGES: readonly HistoryRange[] = [7, 30, 90, 365];

const DAY = 24 * 60 * 60 * 1000;
const tehranDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit' });

/** کلید روز به وقت تهران (YYYY-MM-DD) — مقایسه رشته‌ای همان ترتیب زمانی است */
const dayKey = (d: Date) => tehranDay.format(d);

/**
 * سری روزانه قیمت یک ردیف: برای هر روز بازه، آخرین قیمت ثبت‌شده تا پایان آن روز.
 * روزهای قبل از اولین ثبت قیمت خالی می‌مانند — داده‌ای ساخته نمی‌شود.
 */
export async function getDailyHistory(priceItemId: string, range: HistoryRange, now = new Date()) {
  const start = new Date(now.getTime() - (range - 1) * DAY);
  const [baseline, rows] = await Promise.all([
    prisma.priceHistory.findFirst({
      where: { priceItemId, recordedAt: { lt: start } },
      orderBy: { recordedAt: 'desc' },
      select: { price: true, recordedAt: true },
    }),
    prisma.priceHistory.findMany({
      where: { priceItemId, recordedAt: { gte: start, lte: now } },
      orderBy: { recordedAt: 'asc' },
      select: { price: true, recordedAt: true },
    }),
  ]);

  const records = baseline ? [baseline, ...rows] : rows;
  const points: HistoryPoint[] = [];
  let cursor = 0;
  let last: number | null = null;
  for (let i = 0; i < range; i++) {
    const key = dayKey(new Date(start.getTime() + i * DAY));
    while (cursor < records.length && dayKey(records[cursor].recordedAt) <= key) last = records[cursor++].price;
    if (last != null && points.at(-1)?.day !== key) points.push({ day: key, price: last });
  }
  return points;
}
