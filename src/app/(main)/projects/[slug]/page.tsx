export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProjectDetailView } from '@/features/projects/ProjectDetailView';
import { getProjectBySlug } from '@/shared/lib/data';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'پروژه یافت نشد' };
  return { title: `${project.title} | پروژه‌ها`, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetailView project={project} />;
}
