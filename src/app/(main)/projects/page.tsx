export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ProjectsPageClient } from '@/features/projects/ProjectsPageClient';
import { getPublishedProjects } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';
import { breadcrumbSchema } from '@/shared/lib/seo';

export const metadata: Metadata = {
  title: 'پروژه‌ها | نمونه‌کارهای تامین لوله و اتصالات',
  description:
    'نمونه پروژه‌های اجراشده تامین لوله آب و فاضلاب، اتصالات و شیرآلات صنعتی در سراسر ایران توسط قدیر لوله آنلاین.',
  alternates: { canonical: `${siteConfig.url}/projects` },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'پروژه‌ها', path: '/projects' }])} />
      <ProjectsPageClient projects={projects} />
    </>
  );
}
