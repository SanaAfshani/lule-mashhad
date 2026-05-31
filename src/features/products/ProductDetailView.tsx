'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Phone, Check, X, ChevronLeft, MessageCircle, Package, ShieldCheck, Truck } from 'lucide-react';
import type { Product } from '@/shared/types';
import { formatProductPrice } from '@/shared/lib/serializers';
import { useSiteSettings } from '@/shared/providers/SiteSettingsProvider';

type TabKey = 'specs' | 'description';

const highlights = [
  { icon: ShieldCheck, label: 'کیفیت ISO تضمین‌شده' },
  { icon: Truck, label: 'ارسال سراسر ایران' },
  { icon: Package, label: 'موجود در انبار' },
];

export function ProductDetailView({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<TabKey>('specs');
  const { phoneHref, whatsappUrl } = useSiteSettings();
  const priceDisplay = formatProductPrice(product.price);
  const specEntries = Object.entries(product.specifications);
  const image = product.images[0] || product.category.image;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="container-main py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] flex-wrap">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">خانه</Link>
            <ChevronLeft className="w-3 h-3 flex-shrink-0" />
            <Link href="/products" className="hover:text-[var(--accent)] transition-colors">محصولات</Link>
            <ChevronLeft className="w-3 h-3 flex-shrink-0" />
            <Link href={`/products/${product.category.slug}`} className="hover:text-[var(--accent)] transition-colors">
              {product.category.name}
            </Link>
            <ChevronLeft className="w-3 h-3 flex-shrink-0" />
            <span className="text-[var(--foreground)] truncate max-w-[160px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="rounded-3xl bg-[var(--muted)] border border-[var(--border)] aspect-[4/3] relative overflow-hidden">
              {image ? (
                <Image src={image} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">بدون تصویر</div>
              )}
              {product.featured && (
                <span className="absolute top-4 right-4 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-3 py-1 rounded-full">
                  محصول ویژه
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {highlights.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-[11px] text-[var(--muted-foreground)] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] self-start">
              {product.category.name}
            </span>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] leading-tight mb-3">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{product.shortDescription}</p>
              )}
            </div>

            <motion.div
              className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-xl text-sm font-medium ${
                product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}
            >
              {product.inStock ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {product.inStock ? 'موجود در انبار' : 'ناموجود'}
            </motion.div>

            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">قیمت</div>
              {priceDisplay !== '۰' ? (
                <div className="text-3xl font-black text-[var(--accent)]">{priceDisplay} تومان</div>
              ) : (
                <div className="text-lg font-semibold text-[var(--muted-foreground)]">استعلام قیمت</div>
              )}
            </div>

            {specEntries.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {specEntries.slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                    <div className="text-[10px] text-[var(--muted-foreground)] mb-0.5">{k}</div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{v}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <a
                href={phoneHref}
                className="flex items-center justify-center gap-2.5 h-13 px-6 rounded-xl font-bold text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 transition-opacity"
              >
                <Phone className="w-5 h-5" />
                تماس برای استعلام قیمت
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 h-11 px-6 rounded-xl border-2 border-green-500 text-green-500 font-semibold text-sm hover:bg-green-500 hover:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                واتساپ
              </a>
            </div>
          </motion.div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
          <div className="flex border-b border-[var(--border)]">
            {(
              [
                { key: 'specs' as const, label: 'مشخصات فنی' },
                { key: 'description' as const, label: 'توضیحات' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specEntries.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                    <span className="text-[var(--muted-foreground)] text-sm">{k}</span>
                    <span className="font-semibold text-[var(--foreground)] text-sm">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'description' && product.description && (
              <div
                className="prose prose-sm max-w-none text-[var(--foreground)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
