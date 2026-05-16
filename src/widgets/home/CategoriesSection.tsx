'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { formatPersianNumber } from '@/shared/lib/utils';

const CATEGORY_IMAGE_HEIGHT = 'h-48';

const styleBySlug: Record<string, { from: string; to: string; accent: string }> = {
  'pvc-pipes': { from: 'from-blue-950', to: 'to-slate-900', accent: '#3B82F6' },
  'polyethylene-pipes': { from: 'from-teal-950', to: 'to-slate-900', accent: '#14B8A6' },
  'cast-iron-pipes': { from: 'from-slate-800', to: 'to-slate-950', accent: '#94A3B8' },
  manholes: { from: 'from-stone-900', to: 'to-slate-950', accent: '#A8A29E' },
  fittings: { from: 'from-indigo-950', to: 'to-slate-900', accent: '#6366F1' },
  valves: { from: 'from-amber-950', to: 'to-slate-900', accent: '#F59E0B' },
};

const defaultStyle = { from: 'from-slate-800', to: 'to-slate-950', accent: 'var(--accent)' };

export type HomeCategory = {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
};

type Props = {
  categories: HomeCategory[];
};

export function CategoriesSection({ categories }: Props) {
  if (categories.length === 0) return null;

  return (
    <section className="home-section bg-[var(--background)]">
      <div className="container-main">
        <SectionHeading
          label="دسته‌بندی محصولات"
          title="کاتالوگ کامل لوله و اتصالات"
          description="از لوله‌های پلیکا تا چدن داکتیل؛ هر آنچه برای پروژه آب و فاضلاب نیاز دارید"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, index) => {
            const style = styleBySlug[cat.slug] ?? defaultStyle;
            const image = cat.image || `/images/categories/${cat.slug}.jpg`;

            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="h-full"
              >
                <Link
                  href={`/products/${cat.slug}`}
                  className={`surface-dark group relative flex h-full flex-col rounded-2xl bg-gradient-to-br ${style.from} ${style.to} overflow-hidden border border-white/5 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
                  style={{ ['--accent' as string]: style.accent }}
                >
                  <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 110%, color-mix(in srgb, var(--accent) 19%, transparent), transparent 70%)',
                    }}
                  />

                  <div className={`relative w-full shrink-0 overflow-hidden ${CATEGORY_IMAGE_HEIGHT}`}>
                    <Image
                      src={image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-900/10" />
                    <div className="absolute top-0 inset-x-0 h-0.5 opacity-50 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col p-5">
                    <h3 className="mb-1.5 text-base font-bold leading-snug text-white">{cat.name}</h3>
                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-300">
                      {cat.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                        {formatPersianNumber(cat._count.products)}+ محصول
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition-all group-hover:gap-2.5">
                        مشاهده
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center md:mt-10"
        >
          <Link
            href="/products"
            className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-[var(--accent)] px-8 font-semibold text-[var(--accent)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            مشاهده همه محصولات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
