'use client';

import { motion } from 'framer-motion';

const brands = [
  'ذوب آهن اصفهان',
  'فولاد مبارکه',
  'لوله و ماشین‌سازی ایران',
  'کوپکو',
  'پارس خزر',
  'شرکت ملی گاز ایران',
  'صنایع پتروشیمی',
  'آبفا خراسان رضوی',
];

export function BrandsSection() {
  return (
    <section className="py-10 sm:py-14 overflow-hidden" aria-label="برندها و مشتریان">
      <p className="text-center text-xs sm:text-sm text-[var(--muted-foreground)] mb-6 font-bold">
        تامین‌کنندگان و مشتریان معتمد ما
      </p>
      {/* لبه‌های محو + حرکت به راست: در RTL محتوا از لبه راست شروع می‌شود و حرکت به چپ لبه راست را خالی می‌کرد */}
      <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <motion.div
          animate={{ x: ['0%', '50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex gap-3 sm:gap-4"
          style={{ width: 'max-content' }}
        >
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="shrink-0 h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] font-bold text-sm whitespace-nowrap"
            >
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
