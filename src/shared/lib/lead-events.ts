import { prisma } from '@/shared/lib/prisma';
import { LEAD_TYPES, type LeadType } from '@/shared/lib/leads';

export async function recordLead(type: LeadType, path: string, target = '') {
  await prisma.leadEvent.create({ data: { type, path, target: target.slice(0, 200) } });
}

export type LeadReport = {
  days: number;
  totals: Record<LeadType, number>;
  /** پرتکرارترین صفحه‌ها با تعداد هر نوع اقدام */
  pages: { path: string; total: number; counts: Record<LeadType, number> }[];
  /** هر روز (به وقت تهران، YYYY-MM-DD) تعداد هر نوع */
  daily: { day: string; counts: Record<LeadType, number> }[];
  recent: { id: string; type: LeadType; path: string; target: string; createdAt: string }[];
};

const empty = (): Record<LeadType, number> => ({ phone: 0, whatsapp: 0, form: 0 });
const tehranDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran' });

export async function getLeadReport(days: number): Promise<LeadReport> {
  const since = new Date(Date.now() - days * 86_400_000);
  // حجم کم است (چند ده تا چند صد رویداد در ماه)؛ گروه‌بندی در حافظه ساده‌تر از SQL خام با منطقه زمانی است
  const events = await prisma.leadEvent.findMany({
    where: { createdAt: { gte: since }, type: { in: [...LEAD_TYPES] } },
    orderBy: { createdAt: 'desc' },
    take: 20_000,
  });

  const totals = empty();
  const byPath = new Map<string, Record<LeadType, number>>();
  const byDay = new Map<string, Record<LeadType, number>>();
  for (const e of events) {
    const type = e.type as LeadType;
    totals[type]++;
    const p = byPath.get(e.path || '—') ?? empty();
    p[type]++;
    byPath.set(e.path || '—', p);
    const day = tehranDay.format(e.createdAt);
    const d = byDay.get(day) ?? empty();
    d[type]++;
    byDay.set(day, d);
  }

  const daily: LeadReport['daily'] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = tehranDay.format(new Date(Date.now() - i * 86_400_000));
    daily.push({ day, counts: byDay.get(day) ?? empty() });
  }

  return {
    days,
    totals,
    pages: [...byPath.entries()]
      .map(([path, counts]) => ({ path, counts, total: counts.phone + counts.whatsapp + counts.form }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 30),
    daily,
    recent: events.slice(0, 50).map((e) => ({
      id: e.id, type: e.type as LeadType, path: e.path, target: e.target, createdAt: e.createdAt.toISOString(),
    })),
  };
}
