'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';
import type { Project } from '@/shared/types';
import { formatPersianNumber } from '@/shared/lib/utils';

const gradients = [
  'from-slate-900 via-blue-950',
  'from-slate-900 via-orange-950',
  'from-slate-900 via-teal-950',
  'from-slate-900 via-purple-950',
  'from-slate-900 via-green-950',
  'from-slate-900 via-red-950',
];

type Props = {
  projects: Project[];
};

export function ProjectsPageClient({ projects }: Props) {
  return (
    <>
      <PageHero
        label="پورتفوی"
        title="پروژه‌های اجرا شده"
        description="نگاهی به بزرگ‌ترین پروژه‌های تامین لوله آب و فاضلاب در مشهد و خراسان رضوی"
      />

      <section className="section-padding">
        <div className="container-main">
          {projects.length === 0 ? (
            <p className="text-center text-[var(--muted-foreground)] py-16">پروژه‌ای ثبت نشده است.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`group block rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} to-slate-900 overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-lg`}
                  >
                    <div className="h-44 relative flex flex-col justify-between p-5">
                      <div
                        className="absolute inset-0 opacity-5"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                      <div className="relative z-10 flex items-start justify-between">
                        {project.client && (
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-700/80 text-slate-300">
                            {project.client}
                          </span>
                        )}
                        {project.featured && (
                          <span className="text-xs text-slate-500 bg-slate-900/50 px-2.5 py-1 rounded-full mr-auto">
                            پروژه ویژه
                          </span>
                        )}
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-white font-bold text-base mb-2 group-hover:text-[var(--accent)] transition-colors leading-tight">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          {project.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {project.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatPersianNumber(project.year)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium">
                        جزئیات بیشتر
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
