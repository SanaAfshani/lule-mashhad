'use client';

import { motion } from 'framer-motion';

interface PageHeroProps {
  label?: string;
  title: string;
  description?: string;
  /** Optional right-side element (e.g. breadcrumb or illustration) */
  aside?: React.ReactNode;
}

/**
 * سربرگ یکسان صفحات داخلی — همان زبان بصری هیرو صفحه اصلی:
 * زمینه تیره با شبکه ملایم نقشه مهندسی.
 */
export function PageHero({ label, title, description, aside }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-[var(--ink)] text-white">
      <div className="absolute inset-0 bp-grid bp-grid-fade" />

      <div className="container-main page-hero relative z-10">
        <div className="flex items-start justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            {label && <span className="eyebrow mb-2 sm:mb-3">{label}</span>}
            <h1 className="text-[1.65rem] sm:text-3xl md:text-[2.6rem] font-black text-white leading-snug sm:leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-slate-300 text-sm sm:text-base md:text-lg leading-8">{description}</p>
            )}
          </motion.div>
          {aside && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block shrink-0"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>

      {/* لبه پایین: خط فولادی + تکه نوار هشدار در شروع (راست) */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-white/10" aria-hidden />
      <div className="absolute bottom-0 right-0 h-1.5 w-28 sm:w-40 hazard" aria-hidden />
    </div>
  );
}
