import { NextRequest, NextResponse } from 'next/server';
import { recordLead } from '@/shared/lib/lead-events';
import { cleanPath, isLeadType } from '@/shared/lib/leads';

/** ربات‌ها کلیک نمی‌کنند، ولی پیش‌نمایش‌گرها و اسکنرها ممکن است درخواست بفرستند */
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|curl|wget|python|axios/i;

/**
 * ثبت کلیک روی تلفن یا واتس‌اپ (با navigator.sendBeacon از سایت عمومی).
 * فرم‌ها اینجا ثبت نمی‌شوند؛ /api/contact خودش هنگام ذخیره پیام ثبت می‌کند.
 */
export async function POST(request: NextRequest) {
  try {
    if (BOT.test(request.headers.get('user-agent') ?? '')) return new NextResponse(null, { status: 204 });
    const body = await request.json().catch(() => null);
    const path = cleanPath(body?.path);
    if (!isLeadType(body?.type) || body.type === 'form' || !path) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    await recordLead(body.type, path, typeof body.target === 'string' ? body.target : '');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Lead track error:', error);
    return new NextResponse(null, { status: 204 });
  }
}
