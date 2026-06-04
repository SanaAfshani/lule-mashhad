'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from '@/shared/ui/SectionHeading';
type TestimonialItem = {
  id: string;
  name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
};

type Props = {
  testimonials: TestimonialItem[];
};

export function TestimonialsSection({ testimonials }: Props) {
  if (testimonials.length === 0) return null;

  return (
    <section className="home-section bg-[var(--background)]">
      <div className="container-main">
        <SectionHeading
          label="نظر مشتریان"
          title="آنچه مشتریان می‌گویند"
          description="رضایت مشتریان ما، بهترین معرف کیفیت خدمات و محصولات قدیر لوله آنلاین است"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute top-6 left-6 text-[var(--accent)]/20 group-hover:text-[var(--accent)]/40 transition-colors">
                <Quote className="w-8 h-8" />
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                ))}
              </div>

              <p className="text-[var(--foreground)] leading-relaxed mb-6 text-sm">
                &quot;{t.content}&quot;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[var(--foreground)] text-sm">{t.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {[t.position, t.company].filter(Boolean).join(' - ')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
