export const dynamic = 'force-dynamic';

import { HeroSection } from '@/widgets/home/HeroSection';
import { StatsSection } from '@/widgets/home/StatsSection';
import { CategoriesSection } from '@/widgets/home/CategoriesSection';
import { ServicesSection } from '@/widgets/home/ServicesSection';
import { TestimonialsSection } from '@/widgets/home/TestimonialsSection';
import { BlogPreview } from '@/widgets/home/BlogPreview';
import { BrandsSection } from '@/widgets/home/BrandsSection';
import { CTASection } from '@/widgets/home/CTASection';
import {
  getPublishedBlogPosts,
  getPublishedCategories,
  getPublishedTestimonials,
} from '@/shared/lib/data';
import type { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';

export const metadata: Metadata = {
  title: 'قدیر لوله آنلاین | تامین کننده لوله و اتصالات صنعتی در مشهد',
  description: 'تامین کننده معتبر انواع لوله، اتصالات و تجهیزات صنعتی در مشهد. لوله پلیکا، پلی اتیلن، چدن داکتیل، منهول، شیرآلات و فلنج. با بیش از ۲۰ سال تجربه.',
  alternates: { canonical: siteConfig.url },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/images/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.phone,
    contactType: 'sales',
    areaServed: 'IR',
    availableLanguage: 'Persian',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'مشهد',
    addressRegion: 'خراسان رضوی',
    addressCountry: 'IR',
  },
  sameAs: [siteConfig.socials.whatsapp],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: siteConfig.name,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  openingHours: 'Sa-Th 08:00-18:00',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'مشهد',
    addressRegion: 'خراسان رضوی',
    addressCountry: 'IR',
  },
  priceRange: '﷼﷼﷼',
  description: siteConfig.description,
};

export default async function HomePage() {
  const [categories, posts, testimonials] = await Promise.all([
    getPublishedCategories(),
    getPublishedBlogPosts({ limit: 3 }),
    getPublishedTestimonials(3),
  ]);

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <ServicesSection />
      <BlogPreview posts={posts} />
      <BrandsSection />
      {/*<CTASection />*/}
    </>
  );
}
