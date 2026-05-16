'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import type { ProductListItem } from '@/shared/lib/serializers';

const PRODUCT_IMAGE_HEIGHT = 'h-48';

const badgeStyles: Record<string, string> = {
  پرفروش: 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/20',
  موجود: 'bg-green-500/15 text-green-500 border-green-500/20',
  استعلام: 'bg-blue-500/15 text-blue-500 border-blue-500/20',
};

function productBadge(product: ProductListItem): string {
  if (product.featured) return 'پرفروش';
  if (product.inStock) return 'موجود';
  return 'استعلام';
}

type Props = {
  products: ProductListItem[];
};

export function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="home-section bg-[var(--muted)]/30">
      <div className="container-main">
        <SectionHeading
          label="محصولات ویژه"
          title="پرفروش‌ترین محصولات"
          description="برگزیده‌ترین لوله‌ها، منهول‌ها و اتصالات با کیفیت تایید شده و موجودی در انبار"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, index) => {
            const badge = productBadge(product);
            const image = product.image || '/images/featured/pvc-pipe-160mm.jpg';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.5 }}
                className="h-full"
              >
                <Link
                  href={`/products/${product.category}/${product.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/8"
                >
                  <div className={`relative w-full shrink-0 overflow-hidden ${PRODUCT_IMAGE_HEIGHT}`}>
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(var(--accent-rgb),0.08), transparent)',
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeStyles[badge] ?? badgeStyles['استعلام']}`}
                      >
                        {badge}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="text-xs text-[var(--accent)] font-medium mb-1">{product.categoryName}</div>
                    <h3 className="font-semibold text-[var(--foreground)] text-sm mb-3 line-clamp-2 group-hover:text-[var(--accent)] transition-colors leading-relaxed">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {Object.entries(product.specs)
                        .slice(0, 3)
                        .map(([k, v]) => (
                          <span
                            key={k}
                            className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-lg"
                          >
                            {k}: {v}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <span className="text-sm text-[var(--muted-foreground)]">قیمت: استعلام</span>
                      <div className="w-8 h-8 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center group-hover:bg-[var(--accent)] transition-colors">
                        <ArrowLeft className="w-4 h-4 text-[var(--accent)] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-10"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold hover:bg-[var(--accent-hover)] transition-all duration-300 hover:-translate-y-0.5 shadow-accent"
          >
            مشاهده همه محصولات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
