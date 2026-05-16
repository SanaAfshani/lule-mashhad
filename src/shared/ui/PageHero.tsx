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
 * Consistent page-top hero banner for all inner pages.
 * Uses .page-hero spacing so it aligns with the navbar perfectly.
 */
export function PageHero({ label, title, description, aside }: PageHeroProps) {
  return (
    <div className="surface-dark bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#080F1A] dark:to-slate-900 relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Accent glow */}
      <div className="absolute -top-32 right-0 w-96 h-96 bg-[var(--accent)]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container-main page-hero relative z-10">
        <div className="flex items-start justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            {label && (
              <div className="flex items-center gap-2 text-[var(--accent)] text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                <span className="w-6 h-0.5 bg-[var(--accent)]" />
                {label}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug sm:leading-tight mb-2 sm:mb-3">
              {title}
            </h1>
            {description && (
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed">
                {description}
              </p>
            )}
          </motion.div>
          {aside && (
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block flex-shrink-0"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
