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

export const metadata: Metadata = {
  title: 'لوله آنلاین مشهد | تامین کننده لوله و اتصالات صنعتی',
  description: 'تامین کننده معتبر انواع لوله، اتصالات و تجهیزات صنعتی در مشهد. با بیش از ۲۰ سال تجربه.',
};

export default async function HomePage() {
  const [categories, posts, testimonials] = await Promise.all([
    getPublishedCategories(),
    getPublishedBlogPosts({ limit: 3 }),
    getPublishedTestimonials(3),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <ServicesSection />
      <BlogPreview posts={posts} />
      <BrandsSection />
      <CTASection />
    </>
  );
}
