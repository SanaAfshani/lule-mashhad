import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/admin-auth';
import { getLeadReport } from '@/shared/lib/lead-events';
import { serverErrorResponse } from '@/shared/lib/api-errors';

const RANGES = [7, 30, 90] as const;

/** ?days=7|30|90 — گزارش تماس‌ها و درخواست‌های مشتری به تفکیک صفحه و روز */
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const requested = Number(request.nextUrl.searchParams.get('days'));
    const days = RANGES.find((r) => r === requested) ?? 30;
    return NextResponse.json({ success: true, data: await getLeadReport(days) });
  } catch (error) {
    return serverErrorResponse(error, 'Lead report error:');
  }
}
