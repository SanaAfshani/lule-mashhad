'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Factory, Headphones, Search, ShieldCheck, Truck } from 'lucide-react';
import { siteConfig } from '@/shared/config/site';
import { useSiteSettings } from '@/shared/providers/SiteSettingsProvider';
import { useConsult } from '@/features/consult/ConsultProvider';
import { HeroBoard } from '@/features/prices/HeroBoard';
import type { NavCategory } from '@/shared/lib/data';
import type { PriceBoard } from '@/shared/lib/price-board-types';

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ categories, board }: { categories: NavCategory[]; board: PriceBoard }) {
  const { heroTitle, heroSubtitle } = useSiteSettings();
  const { open } = useConsult();
  const router = useRouter();
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[var(--ink)] text-white">
      {/* عکس واقعی کارگاه — با پوشش تیره از سمت متن (راست) */}
      <Image
        src="/images/categories/polyethylene-pipes.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[30%_center] -z-20 opacity-60"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(270deg,var(--ink)_0%,rgba(14,18,23,0.94)_38%,rgba(14,18,23,0.72)_70%,rgba(14,18,23,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 -z-10 bg-gradient-to-t from-[var(--ink)] to-transparent" />

      <div className="container-main grid lg:grid-cols-[1fr_470px] items-center gap-8 lg:gap-14 pt-8 pb-10 sm:pt-12 lg:py-20">
        <div className="min-w-0">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="eyebrow">
            فروش مستقیم از کارخانه {siteConfig.legalName}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-3 text-[1.85rem] leading-[1.4] sm:text-[2.6rem] lg:text-[3.1rem] lg:leading-[1.3] font-black tracking-tight text-white"
          >
            {heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease }} className="mt-4 text-[15px] sm:text-lg leading-8 text-slate-300 max-w-xl">
            {heroSubtitle}
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }} onSubmit={submit} className="mt-7 relative max-w-xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="نام محصول یا سایز…"
              enterKeyHint="search"
              aria-label="جستجوی محصول"
              className="w-full h-14 rounded-2xl bg-white text-[var(--ink)] placeholder:text-slate-400 pr-12 pl-28 shadow-2xl"
            />
            <button type="submit" className="absolute left-2 top-2 bottom-2 px-5 rounded-xl bg-[var(--ink)] text-white font-bold text-sm">
              جستجو
            </button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-4 -mx-4 px-4 snap-row sm:mx-0 sm:px-0 sm:flex-wrap">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.slug} href={`/products/${c.slug}`} className="h-9 px-3.5 rounded-lg border border-white/15 text-[13px] text-slate-200 flex items-center hover:bg-white hover:text-[var(--ink)] transition-colors">
                {c.name}
              </Link>
            ))}
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8 hidden sm:flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><Factory className="w-4.5 h-4.5 text-[var(--accent)]" />بارگیری از انبار کارخانه گرمسار</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4.5 h-4.5 text-[var(--accent)]" />خرید بدون واسطه از تولیدکننده</li>
            <li className="flex items-center gap-2"><Truck className="w-4.5 h-4.5 text-[var(--accent)]" />ارسال به سراسر کشور</li>
          </motion.ul>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }} className="min-w-0">
          <HeroBoard initial={board} />
          <button onClick={() => open()} className="mt-3 w-full h-12 rounded-2xl border border-white/15 bg-white/5 backdrop-blur text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <Headphones className="w-4.5 h-4.5 text-[var(--accent)]" />
            مشاوره رایگان و استعلام قیمت عمده
          </button>
        </motion.div>
      </div>
    </section>
  );
}
