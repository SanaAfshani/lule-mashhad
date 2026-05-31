import { NextResponse } from 'next/server';

type PrismaKnownError = {
  code: string;
};

function getPrismaError(error: unknown): PrismaKnownError | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as PrismaKnownError).code === 'string'
  ) {
    return error as PrismaKnownError;
  }
  return null;
}

const prismaMessages: Record<string, { status: number; error: string }> = {
  P2002: { status: 409, error: 'این مقدار قبلاً ثبت شده است (تکراری است)' },
  P2003: { status: 409, error: 'این رکورد به داده‌های دیگر وابسته است و قابل حذف نیست' },
  P2025: { status: 404, error: 'رکورد یافت نشد' },
};

export function prismaErrorResponse(error: unknown): NextResponse | null {
  const prismaError = getPrismaError(error);
  if (!prismaError) return null;

  const mapped = prismaMessages[prismaError.code];
  if (!mapped) return null;

  return NextResponse.json({ success: false, error: mapped.error }, { status: mapped.status });
}

export function serverErrorResponse(error: unknown, logLabel: string) {
  console.error(logLabel, error);
  return prismaErrorResponse(error) ?? NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
}
