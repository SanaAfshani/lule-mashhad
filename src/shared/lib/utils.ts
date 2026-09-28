import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** decode پارامتر آدرس؛ آدرس خراب (مثل «%E0») به جای خطای ۵۰۰ همان متن خام را برمی‌گرداند تا صفحه ۴۰۴ شود */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function formatPersianNumber(num: number): string {
  return num.toLocaleString('fa-IR');
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** حروف فارسی/عربی با تلفظ ثابت. «و»، «ه» و «ی» به جایگاهشان در کلمه بستگی دارند و در transliterateWord حل می‌شوند */
const FA_TO_LATIN: Record<string, string> = {
  'ا': 'a', 'آ': 'a', 'أ': 'a', 'إ': 'e', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's',
  'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
  'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': '',
  'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'ك': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm',
  'ن': 'n', 'ؤ': 'o', 'ئ': 'y', 'ء': '', 'ة': 'e',
};

function transliterateWord(word: string): string {
  if (word === 'و') return 'va';
  const chars = [...word];
  return chars
    .map((ch, i) => {
      const first = i === 0;
      const last = i === chars.length - 1;
      if (ch === 'و') return first ? 'v' : 'o';
      if (ch === 'ه') return last ? 'e' : 'h';
      if (ch === 'ی' || ch === 'ي' || ch === 'ى') return first ? 'y' : 'i';
      return FA_TO_LATIN[ch] ?? ch;
    })
    .join('');
}

/**
 * اسلاگ انگلیسی برای آدرس صفحه: فقط a-z، 0-9 و خط تیره.
 * متن فارسی نویسه‌گردانی می‌شود (لوله پلیکا ← lole-plika). چون مصوت‌های کوتاه
 * در خط فارسی نوشته نمی‌شوند، نتیجه تقریبی است و ادمین می‌تواند اصلاحش کند.
 */
export function slugify(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, '') // اعراب و کشیده
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[ء-يپچژکگیآ]+/g, transliterateWord)
    .replace(/[^a-z0-9]+/g, '-') // نیم‌فاصله، علائم نگارشی و هر نویسه دیگر
    .replace(/^-+|-+$/g, '');

  return slug || `post-${Date.now()}`;
}

export function estimateReadTimeMinutes(content: string): number {
  const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/** حذف تگ‌های HTML و نرمال‌سازی فاصله‌ها — برای تحلیل متن و ساخت خلاصه */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * ارقام متن را فارسی می‌کند — به‌جز عددی که به حروف لاتین چسبیده است
 * (کدهای فنی مثل PE100، DN200، SDR11 یا 110mm طبق رسم نگارش فارسی لاتین می‌مانند).
 */
export function faDigits(value: string | number): string {
  return String(value)
    .replace(/[٠-٩]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)])
    .replace(/(?<![A-Za-z0-9.])\d+(?:\.\d+)?(?![A-Za-z0-9])/g, (n) => n.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]).replace('.', '٫'));
}

/** همه ارقام را لاتین می‌کند — برای مقایسه و جستجو که باید مستقل از نوع رقم باشد */
export function latinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

/** قیمت تومانی با جداکننده هزارگان فارسی؛ null یعنی قیمت اعلام‌نشده */
export function formatToman(price: number | null | undefined): string {
  if (price == null || price <= 0) return 'استعلام قیمت';
  return `${price.toLocaleString('fa-IR')} تومان`;
}
