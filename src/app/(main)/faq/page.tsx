export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { FAQPageClient } from '@/features/faq/FAQPageClient';
import { getPublishedFaqs } from '@/shared/lib/data';

export const metadata: Metadata = {
  title: 'سوالات متداول | لوله آنلاین ',
  description: 'پاسخ پرتکرارترین سوالات درباره محصولات، سفارش و تحویل',
};

export default async function FAQPage() {
  const faqs = await getPublishedFaqs();
  return <FAQPageClient faqs={faqs} />;
}
