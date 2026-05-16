'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowLeft, ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { SearchInput } from '@/shared/ui/SearchInput';
import type { ProductListItem } from '@/shared/lib/serializers';
import { formatPersianNumber } from '@/shared/lib/utils';

type CategoryInfo = {
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  productCount: number;
};

const categoryStyles: Record<string, string> = {
  'pvc-pipes': 'from-blue-950 to-slate-900',
  'polyethylene-pipes': 'from-teal-950 to-slate-900',
  'cast-iron-pipes': 'from-slate-800 to-slate-950',
  manholes: 'from-stone-900 to-slate-950',
  fittings: 'from-indigo-950 to-slate-900',
  valves: 'from-amber-950 to-slate-900',
};

type Props = {
  category: CategoryInfo;
  products: ProductListItem[];
};

export function CategoryProductsClient({ category, products }: Props) {
  const [search, setSearch] = useState('');
  const bg = categoryStyles[category.slug] ?? 'from-slate-800 to-slate-900';

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.includes(search) ||
      Object.values(p.specs).some((v) => v.includes(search)),
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className={`relative bg-gradient-to-br ${bg} overflow-hidden`}>
        <div className="container-main relative z-10 py-8 sm:py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 flex-wrap">
            <Link href="/" className="hover:text-slate-300 transition-colors">خانه</Link>
            <ChevronLeft className="w-3 h-3" />
            <Link href="/products" className="hover:text-slate-300 transition-colors">محصولات</Link>
            <ChevronLeft className="w-3 h-3" />
            <Link href="/categories" className="hover:text-slate-300 transition-colors">دسته‌ها</Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-[var(--accent)]">{category.name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]">
              {formatPersianNumber(filtered.length)} محصول
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">{category.description}</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container-main py-8">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder={`جستجو در ${category.name}...`}
          wrapperClassName="mb-7"
        />

        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link
                  href={`/products/${category.slug}/${product.slug}`}
                  className="group flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  <div className={`relative h-32 bg-gradient-to-br ${bg}`}>
                    {product.image ? (
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="25vw" />
                    ) : category.image ? (
                      <Image src={category.image} alt={product.name} fill className="object-cover opacity-60" sizes="25vw" />
                    ) : null}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-[var(--accent)] text-[var(--accent-foreground)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ویژه
                      </span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">ناموجود</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-sm line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      {product.inStock ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                      {product.price !== '۰' ? (
                        <span className="text-sm font-bold text-[var(--accent)]">{product.price} ت</span>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">استعلام</span>
                      )}
                      <ArrowLeft className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--accent)]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div className="text-center py-20 text-[var(--muted-foreground)]">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="font-semibold text-[var(--foreground)]">محصولی یافت نشد</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
