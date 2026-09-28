import { prisma } from '@/shared/lib/prisma';

/**
 * ثبت انتقال آدرس بعد از تغییر اسلاگ.
 * مسیرها به صورت decode‌شده ذخیره می‌شوند (همان شکلی که صفحه‌ها بعد از decodeURIComponent می‌بینند).
 */
export async function recordRedirect(fromPath: string, toPath: string): Promise<void> {
  if (fromPath === toPath) return;

  await prisma.$transaction([
    // زنجیره نسازیم: هر آدرسی که به fromPath می‌رفت، حالا مستقیم به toPath برود
    prisma.redirect.updateMany({ where: { toPath: fromPath }, data: { toPath } }),
    // اگر آدرس جدید قبلاً خودش ریدایرکت بوده (برگشت به اسلاگ قدیمی)، آن ریدایرکت باید حذف شود
    prisma.redirect.deleteMany({ where: { fromPath: toPath } }),
    prisma.redirect.upsert({
      where: { fromPath },
      create: { fromPath, toPath },
      update: { toPath },
    }),
  ]);
}

export async function findRedirect(path: string): Promise<string | null> {
  const row = await prisma.redirect.findUnique({ where: { fromPath: path } });
  return row?.toPath ?? null;
}
