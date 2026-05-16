'use client';

import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'center' | 'right' | 'left';
}

export function SectionHeading({ label, title, description, className, align = 'center' }: SectionHeadingProps) {
  const alignClass = {
    center: 'text-center mx-auto',
    right: 'text-right',
    left: 'text-left',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('max-w-2xl mb-6 sm:mb-8 md:mb-10 w-full', alignClass[align], className)}
    >
      {label && (
        <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[var(--accent)] text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
          <span className="hidden sm:block w-6 sm:w-8 h-0.5 bg-[var(--accent)]" />
          {label}
          <span className="hidden sm:block w-6 sm:w-8 h-0.5 bg-[var(--accent)]" />
        </span>
      )}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--foreground)] leading-snug sm:leading-tight mb-3 sm:mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-[var(--muted-foreground)] text-sm sm:text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
