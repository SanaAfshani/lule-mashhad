import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/admin-auth';
import { serverErrorResponse } from '@/shared/lib/api-errors';
import { getSiteSettingsMap } from '@/shared/lib/site-settings-store';
import { getMarketStatus, parseMarketConfig, type MarketSchedule } from '@/shared/lib/market';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  const config = parseMarketConfig(await getSiteSettingsMap());
  return NextResponse.json({ success: true, data: { ...config, status: getMarketStatus(config) } });
}

export async function PUT(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await request.json();
    const writes: Promise<unknown>[] = [];
    const set = (key: string, value: string) =>
      writes.push(prisma.siteSettings.upsert({ where: { key }, update: { value }, create: { key, value, type: 'text' } }));

    if (body.mode !== undefined) {
      if (!['auto', 'open', 'closed'].includes(body.mode)) return NextResponse.json({ success: false, error: 'حالت نامعتبر' }, { status: 400 });
      set('market_mode', body.mode);
    }
    if (body.schedule !== undefined) {
      const schedule: MarketSchedule = {};
      for (const [day, slot] of Object.entries(body.schedule ?? {})) {
        if (!/^[0-6]$/.test(day) || !Array.isArray(slot)) continue;
        const [open, close] = slot as string[];
        if (!TIME.test(open) || !TIME.test(close) || open >= close) {
          return NextResponse.json({ success: false, error: 'ساعت باز باید قبل از ساعت بسته باشد' }, { status: 400 });
        }
        schedule[day as keyof MarketSchedule] = [open, close];
      }
      set('market_schedule', JSON.stringify(schedule));
    }
    await Promise.all(writes);
    // وضعیت تازه بعد از نوشتن (کش درخواست قبلی را دور می‌زنیم)
    const rows = await prisma.siteSettings.findMany({ where: { key: { in: ['market_mode', 'market_schedule'] } } });
    const config = parseMarketConfig(Object.fromEntries(rows.map((r) => [r.key, r.value])));
    return NextResponse.json({ success: true, data: { ...config, status: getMarketStatus(config) } });
  } catch (error) {
    return serverErrorResponse(error, 'Market PUT error:');
  }
}
