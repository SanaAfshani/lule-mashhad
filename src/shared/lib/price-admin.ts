import { latinDigits } from '@/shared/lib/utils';

/** قیمت ورودی ادمین: «۲٬۲۹۸٬۶۴۸»، «2,298,648» یا عدد — خالی/صفر یعنی «استعلام» */
export function toPrice(value: unknown): number | null {
  if (value == null || value === '') return null;
  const n = Number(latinDigits(String(value)).replace(/[^\d]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export const text = (value: unknown, max = 300) => String(value ?? '').trim().slice(0, max);
