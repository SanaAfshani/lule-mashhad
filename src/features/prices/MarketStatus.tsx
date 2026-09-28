'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import type { MarketStatus as Status } from '@/shared/lib/market';
import { cn } from '@/shared/lib/utils';

function remaining(iso: string | null, now: number) {
  if (!iso) return null;
  const mins = Math.max(0, Math.round((new Date(iso).getTime() - now) / 60000));
  if (mins > 24 * 60) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const fa = (n: number) => n.toLocaleString('fa-IR');
  if (h && m) return `${fa(h)} ساعت و ${fa(m)} دقیقه`;
  if (h) return `${fa(h)} ساعت`;
  return `${fa(Math.max(m, 1))} دقیقه`;
}

/** وضعیت بازار: «باز است · تا ۱۷:۰۰» یا «بسته است · بازگشایی فردا ۰۹:۰۰» */
export function MarketStatus({ market, tone = 'light', className }: { market: Status; tone?: 'light' | 'dark'; className?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const left = remaining(market.nextChangeAt, now);
  const dark = tone === 'dark';

  const detail = market.open
    ? market.mode === 'open'
      ? 'قیمت‌ها لحظه‌ای به‌روز می‌شوند'
      : `تا ساعت ${market.nextChangeLabel}${left ? ` · ${left} دیگر` : ''}`
    : market.mode === 'closed'
      ? 'تعطیل — استعلام قیمت فعال است'
      : market.nextOpenDay
        ? `بازگشایی ${market.nextOpenDay} ساعت ${market.nextChangeLabel}`
        : 'استعلام قیمت فعال است';

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full ps-2.5 pe-3.5 h-9 text-xs border',
        dark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-[var(--background)] border-[var(--border)] text-[var(--muted-foreground)]',
        className,
      )}
    >
      <span className="relative flex w-2.5 h-2.5">
        {market.open && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />}
        <span className={cn('relative w-2.5 h-2.5 rounded-full', market.open ? 'bg-emerald-500' : 'bg-slate-400')} />
      </span>
      <span className={cn('font-bold', market.open ? (dark ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400') : dark ? 'text-white' : 'text-[var(--foreground)]')}>
        {market.open ? 'فروش باز است' : 'فروش بسته است'}
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 opacity-80">
        <Clock className="w-3.5 h-3.5" />
        {detail}
      </span>
    </div>
  );
}

/** همان توضیح، برای نمایش جدا زیر نشان در موبایل */
export function marketDetail(market: Status) {
  if (market.open) return market.nextChangeLabel ? `فروش تا ساعت ${market.nextChangeLabel}` : 'قیمت‌ها لحظه‌ای به‌روز می‌شوند';
  if (market.nextOpenDay) return `بازگشایی ${market.nextOpenDay} ساعت ${market.nextChangeLabel}`;
  return 'استعلام قیمت فعال است';
}
