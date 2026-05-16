'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import type { Project } from '@/shared/types';
import { formatPersianNumber } from '@/shared/lib/utils';

const gradients = [
  'from-slate-900 via-blue-950 to-slate-900',
  'from-slate-900 via-orange-950 to-slate-900',
  'from-slate-900 via-teal-950 to-slate-900',
];

type Props = {
  projects: Project[];
};

export function ProjectsPreview({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <section className="home-section bg-[var(--muted)]/20">
      <div className="container-main">
        <SectionHeading
          label="پروژه‌های ما"
          title="نمونه پروژه‌های انجام شده"
          description="نگاهی به پروژه‌های موفق تامین لوله و اتصالات در مشهد و سراسر ایران"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className={`surface-dark group block rounded-3xl bg-gradient-to-br ${gradients[index % gradients.length]} overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-xl`}
              >
                <div className="aspect-[4/3] relative p-6 flex flex-col justify-end">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent-hover)]/10 transition-all duration-500" />

                  <div className="absolute top-5 right-5 flex gap-2">
                    <span className="bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-3 py-1 rounded-full">
                      {formatPersianNumber(project.year)}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {project.location}
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center group-hover:bg-[var(--accent-hover)] transition-colors">
                        <ArrowLeft className="w-4 h-4 text-[var(--accent)] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-10"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl border-2 border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300 hover:-translate-y-0.5"
          >
            مشاهده همه پروژه‌ها
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
