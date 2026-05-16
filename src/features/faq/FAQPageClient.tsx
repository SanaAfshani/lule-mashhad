'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { PageHero } from '@/shared/ui/PageHero';
import { SearchInput } from '@/shared/ui/SearchInput';
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
        <div className="container-main max-w-4xl">
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder="جستجو در سوالات..."
            wrapperClassName="mb-6"
            className="h-12"
          />

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-accent'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-[var(--muted-foreground)]">
                سوالی با این مشخصات یافت نشد.
              </div>
            ) : (
              filtered.map((faq, i) => {
                const isOpen = openId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--card)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-right"
                    >
                      <span className="font-semibold text-[var(--foreground)]">{faq.q}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-full">
                          {faq.cat}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-[var(--accent)]" />
                        </motion.div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 text-[var(--muted-foreground)] text-sm leading-relaxed border-t border-[var(--border)] pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4 p-6 md:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)] text-center sm:text-right"
          >
            <MessageCircle className="w-10 h-10 text-[var(--accent)] flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-[var(--foreground)] mb-1">سوال دیگری دارید؟</h3>
              <p className="text-[var(--muted-foreground)] text-sm">کارشناسان ما آماده پاسخگویی هستند</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-accent flex-shrink-0"
            >
              تماس با ما
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
