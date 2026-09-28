export const dynamic = 'force-dynamic';

import { notFound, permanentRedirect } from 'next/navigation';
import { safeDecode } from '@/shared/lib/utils';
import { findRedirect } from '@/shared/lib/redirects';
import type { Metadata } from 'next';
import { ProjectDetailView } from '@/features/projects/ProjectDetailView';
import { getProjectBySlug } from '@/shared/lib/data';
import { siteConfig } from '@/shared/config/site';
import { JsonLd } from '@/shared/ui/JsonLd';
import { absoluteUrl, breadcrumbSchema, toMetaDescription } from '@/shared/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'پروژه یافت نشد', robots: { index: false, follow: true } };

  const desc = toMetaDescription(
    project.description ||
      project.content ||
      `پروژه ${project.title}${project.location ? ` در ${project.location}` : ''} — تامین لوله و اتصالات توسط ${siteConfig.name}.`
  );
  const canonical = `${siteConfig.url}/projects/${encodeURIComponent(slug)}`;
  const image = project.images?.[0] ? absoluteUrl(project.images[0]) : undefined;

  return {
    title: `${project.title} | پروژه‌ها`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} | ${siteConfig.name}`,
      description: desc,
      url: canonical,
      type: 'article',
      ...(image ? { images: [{ url: image, alt: project.title }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = safeDecode(rawSlug);
  const project = await getProjectBySlug(slug);
  if (!project) {
    const moved = await findRedirect(`/projects/${slug}`);
    if (moved) permanentRedirect(moved);
    notFound();
  }

  const canonical = `${siteConfig.url}/projects/${encodeURIComponent(slug)}`;
  const images = (project.images ?? []).map((src) => absoluteUrl(src));

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: toMetaDescription(project.description || project.content, 400),
    url: canonical,
    inLanguage: 'fa-IR',
    ...(images.length ? { image: images } : {}),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.location ? { locationCreated: { '@type': 'Place', name: project.location } } : {}),
    creator: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <JsonLd data={projectSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'پروژه‌ها', path: '/projects' },
          { name: project.title, path: `/projects/${encodeURIComponent(slug)}` },
        ])}
      />
      <ProjectDetailView project={project} />
    </>
  );
}
