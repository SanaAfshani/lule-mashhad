export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ProjectsPageClient } from '@/features/projects/ProjectsPageClient';
import { getPublishedProjects } from '@/shared/lib/data';

export const metadata: Metadata = {
  title: 'پروژه‌ها | قدیر لوله آنلاین ',
  description: 'نمونه پروژه‌های تامین لوله آب و فاضلاب در مشهد و خراسان',
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <ProjectsPageClient projects={projects} />;
}
