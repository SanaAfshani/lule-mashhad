import { siteConfig } from '@/shared/config/site';

/** وضعیت دسته‌ها در کاتالوگ — بدون وابستگی سرور، قابل استفاده در کامپوننت‌های کلاینت */

const active: readonly string[] = siteConfig.activeCategorySlugs;

/** دسته فعلاً فروش ندارد و «به زودی» نمایش داده می‌شود */
export function isComingSoon(categorySlug: string) {
  return !active.includes(categorySlug);
}

/** رتبه نمایش: دسته‌های فعال به ترتیب siteConfig اول، بقیه بعد از آن‌ها */
export function categoryRank(categorySlug: string) {
  const i = active.indexOf(categorySlug);
  return i === -1 ? active.length : i;
}
