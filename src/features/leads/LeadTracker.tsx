'use client';

import { useEffect } from 'react';
import type { LeadType } from '@/shared/lib/leads';

function leadType(href: string): LeadType | null {
  if (href.startsWith('tel:')) return 'phone';
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) return 'whatsapp';
  return null;
}

/**
 * کلیک روی هر لینک تلفن یا واتس‌اپ در سایت را ثبت می‌کند (event delegation؛ لینک‌ها دست نمی‌خورند).
 * sendBeacon حتی وقتی کلیک صفحه را ترک می‌کند (اپ تلفن یا واتس‌اپ باز می‌شود) ارسال را تضمین می‌کند.
 */
export function LeadTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      const href = a?.getAttribute('href') ?? '';
      const type = leadType(href);
      if (!type) return;
      const body = JSON.stringify({ type, path: window.location.pathname, target: href.replace(/^tel:/, '') });
      navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }));
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
