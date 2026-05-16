'use client';

import { motion } from 'framer-motion';

const brands = [
  'ذوب آهن اصفهان',
  'فولاد مبارکه',
  'لوله و ماشین‌سازی ایران',
  'کوپکو',
  'پارس خزر',
  'شرکت ملی گاز ایران',
  'پتروشیمی مشهد',
  'آبفا خراسان رضوی',
];

export function BrandsSection() {
  return (
    <section className="home-section-compact bg-[var(--background)] border-y border-[var(--border)] overflow-hidden">
      <div className="container-main">
        <p className="text-center text-sm text-[var(--muted-foreground)] mb-6 md:mb-8 font-medium uppercase tracking-widest">
          برندها و مشتریان معتمد ما
        </p>

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [0, '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8"
            style={{ width: 'max-content' }}
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 h-16 px-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] font-semibold text-sm whitespace-nowrap hover:border-[var(--accent)]/40 hover:text-[var(--accent)] transition-all duration-300"
              >
                {brand}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
