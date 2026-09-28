import type { FaqItem } from '@/shared/types';

/**
 * آماده‌سازی سوالات متداول یک صفحه (مقاله یا محصول) برای ذخیره در دیتابیس (JSON String).
 * ردیف‌های ناقص (بدون سوال یا بدون پاسخ) حذف می‌شوند تا FAQPage schema معتبر بماند.
 */
export function serializeFaqs(input: unknown): string {
  if (!Array.isArray(input)) return '[]';

  const items: FaqItem[] = input
    .map((item) => ({
      question: String((item as FaqItem)?.question ?? '').trim(),
      answer: String((item as FaqItem)?.answer ?? '').trim(),
    }))
    .filter((item) => item.question && item.answer)
    // گوگل بیش از این تعداد را در rich result نشان نمی‌دهد
    .slice(0, 20);

  return JSON.stringify(items);
}
