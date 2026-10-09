'use client';

import { m as motion } from 'framer-motion';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { ProductCard } from '@/features/products/ProductCard';
import type { ProductListItem } from '@/shared/lib/serializers';

/** پرفروش‌ترین‌ها — موبایل: کاروسل افقی، دسکتاپ: شبکه ۴ ستونه */
export function FeaturedProducts({ products }: { products: ProductListItem[] }) {
  if (!products.length) return null;
  return (
    <section className="section-padding" aria-labelledby="featured-title">
      <div className="container-main">
        <SectionHeading
          id="featured-title"
          align="right"
          label="پرفروش‌ها"
          title="محصولات پرطرفدار"
          description="لوله و اتصالاتی که پیمانکاران بیشتر از همه سفارش می‌دهند."
          action={{ href: '/products', label: 'همه محصولات' }}
        />
        <div className="snap-row -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              // فقط opacity: جابه‌جایی عمودی داخل ردیف افقی، ارتفاع ردیف را بیشتر از کادر می‌کرد
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="w-[74%] sm:w-auto"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
