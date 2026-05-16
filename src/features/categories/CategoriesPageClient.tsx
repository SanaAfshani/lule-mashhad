'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';
import { formatPersianNumber } from '@/shared/lib/utils';

export type CategoryCard = {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  productCount: number;
};

const gradients = [
  'from-blue-950 to-slate-900',
  'from-teal-950 to-slate-900',
  'from-slate-800 to-slate-950',
  'from-stone-900 to-slate-950',
  'from-indigo-950 to-slate-900',
  'from-amber-950 to-slate-900',
];

export function CategoriesPageClient({ categories }: { categories: CategoryCard[] }) {
  return (
    <>
      <PageHero
        label="دسته‌بندی محصولات"
        title="همه دسته‌های لوله و اتصالات"
        description="از پلیکا و پلی‌اتیلن تا چدن داکتیل، منهول و شیرآلات — مستقیم به محصولات هر دسته"
      />

      <section className="section-padding">
        <motion.div className="container-main">
          {categories.length === 0 ? (
            <p className="text-center text-[var(--muted-foreground)] py-16">دسته‌بندی‌ای ثبت نشده است.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {categories.map((cat, i) => {
                const image = cat.image || `/images/categories/${cat.slug}.jpg`;
                return (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={`/products/${cat.slug}`}
                      className="group block rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    >
                      <div className={`relative h-48 bg-gradient-to-br ${gradients[i % gradients.length]}`}>
                        <Image
                          src={image}
                          alt={cat.name}
                          fill
                          className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {cat.icon && (
                          <span className="absolute top-4 right-4 text-2xl">{cat.icon}</span>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {cat.name}
                        </h2>
                        {cat.description && (
                          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4 leading-relaxed">
                            {cat.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                            <Package className="w-3.5 h-3.5" />
                            {formatPersianNumber(cat.productCount)} محصول
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
                            مشاهده
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
