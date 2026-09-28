import { cache } from 'react';
import { prisma } from '@/shared/lib/prisma';

/** با cache: layout، صفحه، متادیتا و وضعیت بازار در یک درخواست فقط یک بار به دیتابیس می‌روند */
export const getSiteSettingsMap = cache(async function getSiteSettingsMap() {
  const settings = await prisma.siteSettings.findMany();
  return settings.reduce(
    (acc, s) => ({ ...acc, [s.key]: s.value }),
    {} as Record<string, string>,
  );
});
