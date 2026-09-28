'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/shared/ui/PageHero';
import { SearchInput } from '@/shared/ui/SearchInput';
import { useConsult } from '@/features/consult/ConsultProvider';
import { faDigits } from '@/shared/lib/utils';

type FaqItem = {
  id: string;
  q: string;
  a: string;
  cat: string;
};

type FaqInput = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

type Props = {
  faqs: FaqInput[];
};

export function FAQPageClient({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('همه');
  const [search, setSearch] = useState('');
  const { open } = useConsult();

  const items: FaqItem[] = useMemo(
    () =>
      faqs.map((f) => ({
        id: f.id,
        q: f.question,
        a: f.answer,
        cat: f.category || 'عمومی',
      })),
    [faqs],
  );

  const categories = useMemo(
    () => ['همه', ...Array.from(new Set(items.map((f) => f.cat)))],
    [items],
  );

  const filtered = items.filter((f) => {
    const matchCat = activeCategory === 'همه' || f.cat === activeCategory;
    const matchSearch = !search || f.q.includes(search) || f.a.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <>
      <PageHero
        label="سوالات متداول"
        title="پاسخ سوالات شما"
        description="پرتکرارترین سوالات مشتریان درباره محصولات، سفارش، تحویل و خدمات"
      />

      <section className="section-padding">
        <div className="container-main max-w-3xl">
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="جستجو در سوالات..."
            wrapperClassName="mb-5"
            className="h-12"
          />

          {/* موبایل: یک ردیف اسکرول‌شونده؛ دسکتاپ: چند خطی */}
          <div className="no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex sm:flex-wrap gap-2 overflow-x-auto mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`shrink-0 h-9 px-4 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                    : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-12 text-[var(--muted-foreground)]">سوالی با این مشخصات یافت نشد.</p>
          ) : (
            <div className="rounded-3xl border border-[var(--border)] divide-y divide-[var(--border)]">
              {filtered.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 text-right"
                    >
                      <span className="font-bold leading-7">{faDigits(faq.q)}</span>
                      <span className={`grid place-items-center w-8 h-8 rounded-full shrink-0 transition-colors ${isOpen ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--muted)]'}`}>
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 sm:px-7 pb-6 -mt-1 text-[15px] leading-8 text-[var(--muted-foreground)]">{faDigits(faq.a)}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 rounded-[var(--radius-panel)] bg-[var(--ink)] text-white p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <h2 className="text-xl font-black text-white">سوال دیگری دارید؟</h2>
              <p className="mt-1.5 text-sm text-slate-300">کارشناسان ما آماده پاسخگویی هستند</p>
            </div>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 sm:flex shrink-0">
              <button type="button" onClick={() => open()} className="h-12 px-5 rounded-2xl bg-white text-[var(--ink)] font-bold whitespace-nowrap">
                درخواست مشاوره
              </button>
              <Link href="/contact" className="h-12 px-5 rounded-2xl border border-white/20 font-bold flex items-center justify-center whitespace-nowrap hover:bg-white/10 transition-colors">
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
