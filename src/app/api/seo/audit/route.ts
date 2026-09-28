import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/admin-auth';
import { runAudit } from '@/shared/lib/seo-audit';
import { serverErrorResponse } from '@/shared/lib/api-errors';

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    return NextResponse.json({ success: true, data: await runAudit() });
  } catch (error) {
    return serverErrorResponse(error, 'SEO audit error:');
  }
}
