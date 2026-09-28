/**
 * آیا آپلود مستقیم به CDN (Vercel Blob) در این محیط فعال است؟
 *
 * قبلاً این موضوع از روی متن پیام خطا حدس زده می‌شد که شکننده بود و باعث
 * شکست کامل آپلود در محیط بدون توکن می‌شد. حالا مستقیم از سرور می‌پرسیم.
 * نتیجه در سطح ماژول کش می‌شود تا فقط یک بار پرسیده شود.
 */
const cache = new Map<string, Promise<boolean>>();

export function isBlobEnabled(endpoint: string): Promise<boolean> {
  const cached = cache.get(endpoint);
  if (cached) return cached;

  const probe = fetch(endpoint, { method: 'GET' })
    .then((res) => (res.ok ? res.json() : { blobEnabled: false }))
    .then((json: { blobEnabled?: boolean }) => Boolean(json?.blobEnabled))
    // اگر probe به هر دلیلی شکست خورد، مسیر مطمئن (آپلود از طریق سرور) را انتخاب کن
    .catch(() => false);

  cache.set(endpoint, probe);
  return probe;
}
