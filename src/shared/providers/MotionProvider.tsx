'use client';

import { LazyMotion } from 'framer-motion';

const loadFeatures = () => import('./motion-features').then((mod) => mod.default);

/**
 * framer-motion به شکل سبک: همه‌جا کامپوننت m (به نام محلی motion) استفاده می‌شود و قابلیت‌های انیمیشن
 * بعد از رندر صفحه جدا دانلود می‌شوند — حدود ۴۰ کیلوبایت جاوااسکریپت کمتر در بارگذاری اول.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
