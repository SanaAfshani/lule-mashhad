import { HeroSection } from '@/widgets/home/HeroSection';
import { StatsSection } from '@/widgets/home/StatsSection';
import { CategoriesSection } from '@/widgets/home/CategoriesSection';
import { ServicesSection } from '@/widgets/home/ServicesSection';
import { ProjectsPreview } from '@/widgets/home/ProjectsPreview';
import { TestimonialsSection } from '@/widgets/home/TestimonialsSection';
import { BlogPreview } from '@/widgets/home/BlogPreview';
import { BrandsSection } from '@/widgets/home/BrandsSection';
import { CTASection } from '@/widgets/home/CTASection';
import {
  getPublishedBlogPosts,
  getPublishedCategories,
  getPublishedProjects,
  getPublishedTestimonials,
} from '@/shared/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوله آنلاین مشهد | تامین کننده لوله و اتصالات صنعتی',
  description: 'تامین کننده معتبر انواع لوله، اتصالات و تجهیزات صنعتی در مشهد. با بیش از ۲۰ سال تجربه.',
};

export default async function HomePage() {
  const [categories, posts, testimonials, projects] = await Promise.all([
    getPublishedCategories(),
    getPublishedBlogPosts({ limit: 3 }),
    getPublishedTestimonials(3),
    getPublishedProjects({ limit: 3 }),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <ServicesSection />
      <ProjectsPreview projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogPreview posts={posts} />
      <BrandsSection />
      <CTASection />
    </>
  );
}
