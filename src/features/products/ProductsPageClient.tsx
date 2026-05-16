'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';
import { SearchInput } from '@/shared/ui/SearchInput';
import type { ProductListItem } from '@/shared/lib/serializers';

type CategoryTab = { slug: string; name: string };

type ProductsPageClientProps = {
  categories: CategoryTab[];
  products: ProductListItem[];
};

/* Category-themed SVG thumbnails */
const categoryThumb: Record<string, { bg: string; svg: () => React.ReactNode }> = {
  'pvc-pipes': {
    bg: 'from-blue-950 to-slate-900',
    svg: () => (
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <rect x="4" y="16" width="72" height="18" rx="9" fill="#1E40AF" opacity="0.9"/>
        <rect x="4" y="16" width="72" height="5" rx="3" fill="rgba(255,255,255,0.15)"/>
        <rect x="0" y="10" width="10" height="30" rx="3" fill="#3B82F6"/>
        <rect x="70" y="10" width="10" height="30" rx="3" fill="#3B82F6"/>
        <circle cx="26" cy="25" r="3.5" fill="#60A5FA" opacity="0.8"/>
        <circle cx="42" cy="25" r="3" fill="#93C5FD" opacity="0.7"/>
        <circle cx="58" cy="25" r="3.5" fill="#60A5FA" opacity="0.8"/>
      </svg>
    ),
  },
  'polyethylene-pipes': {
    bg: 'from-teal-950 to-slate-900',
    svg: () => (
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <rect x="4" y="17" width="72" height="16" rx="8" fill="#0F172A"/>
        <rect x="4" y="17" width="72" height="5" rx="3" fill="rgba(255,255,255,0.08)"/>
        <rect x="4" y="23" width="72" height="3" fill="#14B8A6" opacity="0.7"/>
        <rect x="0" y="10" width="9" height="30" rx="3" fill="#1E293B" stroke="#14B8A6" strokeWidth="1"/>
        <rect x="71" y="10" width="9" height="30" rx="3" fill="#1E293B" stroke="#14B8A6" strokeWidth="1"/>
        <text x="40" y="10" textAnchor="middle" fill="#2DD4BF" fontSize="7" fontFamily="Arial">PE 100</text>
      </svg>
    ),
  },
  'cast-iron-pipes': {
    bg: 'from-slate-800 to-slate-950',
    svg: () => (
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="cig" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#374151"/>
            <stop offset="50%" stopColor="#6B7280"/>
            <stop offset="100%" stopColor="#374151"/>
          </linearGradient>
        </defs>
        <rect x="10" y="18" width="60" height="14" fill="url(#cig)"/>
        <rect x="3" y="12" width="12" height="26" rx="2" fill="#4B5563"/>
        <rect x="65" y="12" width="12" height="26" rx="2" fill="#4B5563"/>
        {[18, 24, 30].map((y, i) => <circle key={i} cx="9" cy={y} r="2" fill="#94A3B8"/>)}
        {[18, 24, 30].map((y, i) => <circle key={i} cx="71" cy={y} r="2" fill="#94A3B8"/>)}
      </svg>
    ),
  },
  manholes: {
    bg: 'from-stone-900 to-slate-950',
    svg: () => (
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <circle cx="40" cy="25" r="20" fill="#292524" stroke="#78716C" strokeWidth="2"/>
        <circle cx="40" cy="25" r="14" fill="none" stroke="#57534E" strokeWidth="1"/>
        {[0,60,120,180,240,300].map((a, i) => (
          <line key={i} x1="40" y1="25"
            x2={40 + 19 * Math.cos(a * Math.PI / 180)}
            y2={25 + 19 * Math.sin(a * Math.PI / 180)}
            stroke="#57534E" strokeWidth="1"/>
        ))}
        <circle cx="40" cy="25" r="4" fill="#1C1917" stroke="#78716C" strokeWidth="1"/>
      </svg>
    ),
  },
  fittings: {
    bg: 'from-indigo-950 to-slate-900',
    svg: () => (
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <rect x="0" y="19" width="46" height="12" rx="6" fill="#3730A3"/>
        <rect x="56" y="19" width="24" height="12" rx="6" fill="#3730A3"/>
        <rect x="37" y="0" width="12" height="34" rx="6" fill="#3730A3"/>
        <rect x="0" y="19" width="46" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
        <rect x="39" y="0" width="4" height="34" rx="2" fill="rgba(255,255,255,0.1)"/>
        <rect x="39" y="0" width="12" height="6" rx="2" fill="#6366F1"/>
        <rect x="0" y="15" width="7" height="20" rx="2" fill="#6366F1"/>
        <rect x="73" y="15" width="7" height="20" rx="2" fill="#6366F1"/>
      </svg>
    ),
  },
  valves: {
    bg: 'from-amber-950 to-slate-900',
    svg: () => (
      <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
        <rect x="0" y="20" width="22" height="10" rx="5" fill="#78350F"/>
        <rect x="58" y="20" width="22" height="10" rx="5" fill="#78350F"/>
        <rect x="20" y="14" width="40" height="22" rx="5" fill="#1C1917" stroke="var(--accent)" strokeWidth="1"/>
        <rect x="36" y="2" width="8" height="16" rx="3" fill="#78350F"/>
        <circle cx="40" cy="6" r="6" fill="none" stroke="var(--accent)" strokeWidth="2"/>
        <line x1="40" y1="0" x2="40" y2="12" stroke="var(--accent)" strokeWidth="1.5"/>
        <line x1="34" y1="6" x2="46" y2="6" stroke="var(--accent)" strokeWidth="1.5"/>
        <circle cx="40" cy="6" r="2" fill="var(--accent)"/>
      </svg>
    ),
  },
};

const fallbackThumb = {
  bg: 'from-slate-800 to-slate-900',
  svg: () => (
    <svg viewBox="0 0 80 50" fill="none" className="w-full h-full">
      <rect x="8" y="18" width="64" height="14" rx="7" fill="#334155"/>
      <rect x="0" y="12" width="12" height="26" rx="3" fill="#475569"/>
      <rect x="68" y="12" width="12" height="26" rx="3" fill="#475569"/>
    </svg>
  ),
};

export function ProductsPageClient({ categories, products: allProducts }: ProductsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const displayed = allProducts.filter((p) => {
    const matchCategory =
      activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !search || p.name.includes(search) || p.categoryName.includes(search);
    return matchCategory && matchSearch;
  });

  return (
    <>
      <PageHero
        label="کاتالوگ محصولات"
        title="لوله، اتصالات و شیرآلات"
        description="بیش از ۵۰۰۰ نوع محصول — پلیکا، پلی اتیلن، چدن داکتیل، منهول و اتصالات با کیفیت تضمین شده"
      />

      <div className="container-main py-8 md:py-12">

        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="جستجو در محصولات..."
          wrapperClassName="mb-6"
          className="h-12"
        />

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-md'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <p className="mb-5 text-sm text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">{displayed.length}</span> محصول
          {activeCategory !== 'all' && (
            <span>
              {' '}
              در دسته «{categories.find((c) => c.slug === activeCategory)?.name}»
            </span>
          )}
        </p>

        {/* ── Products grid ── */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
          >
            {displayed.map((product, i) => {
              const thumb = categoryThumb[product.category] ?? fallbackThumb;
              const SvgComp = thumb.svg;
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.025 }}
                >
                  <Link
                    href={`/products/${product.category}/${product.slug}`}
                    className="group flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <motion.div className={`relative h-36 sm:h-40 bg-gradient-to-br ${thumb.bg} flex items-center justify-center overflow-hidden p-5`}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full relative z-10">
                          <SvgComp />
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2.5 right-2.5 flex gap-1.5">
                        {product.featured && (
                          <span className="bg-[var(--accent)] text-[var(--accent-foreground)] text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
                            ویژه
                          </span>
                        )}
                        {!product.inStock && (
                          <span className="bg-red-500/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full leading-tight">
                            ناموجود
                          </span>
                        )}
                      </div>
                    </motion.div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 p-4 gap-2.5">
                      <div>
                        <p className="text-xs text-[var(--accent)] font-medium mb-1">{product.categoryName}</p>
                        <h3 className="font-semibold text-[var(--foreground)] text-sm leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      {/* Specs */}
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
                          <span key={k} className="text-[11px] bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-md">
                            {k}: {v}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex items-center gap-1.5">
                          {product.inStock ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                          )}
                          {product.price !== '۰' ? (
                            <span className="text-sm font-bold text-[var(--accent)]">{product.price} ت</span>
                          ) : (
                            <span className="text-xs text-[var(--muted-foreground)]">استعلام قیمت</span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 group-hover:bg-[var(--accent)] flex items-center justify-center transition-colors">
                          <ArrowLeft className="w-4 h-4 text-[var(--accent)] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Empty state ── */}
        {displayed.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-[var(--foreground)] font-semibold mb-1">محصولی پیدا نشد</p>
            <p className="text-[var(--muted-foreground)] text-sm">
              دسته یا کلمه جستجو را تغییر دهید
            </p>
          </div>
        )}
      </div>
    </>
  );
}
