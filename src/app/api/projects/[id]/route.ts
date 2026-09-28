import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { serializeProject } from '@/shared/lib/serializers';
import { slugify } from '@/shared/lib/utils';
import { recordRedirect } from '@/shared/lib/redirects';

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: 'پروژه یافت نشد' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeProject(project) });
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const before = await prisma.project.findUnique({ where: { id }, select: { slug: true } });

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.title != null && { title: String(body.title) }),
        ...(body.slug != null && { slug: slugify(String(body.slug)) }),
        ...(body.description != null && { description: body.description }),
        ...(body.content != null && { content: body.content }),
        ...(body.images != null && { images: JSON.stringify(body.images) }),
        ...(body.location != null && { location: body.location }),
        ...(body.year != null && { year: Number(body.year) }),
        ...(body.client != null && { client: body.client }),
        ...(body.published != null && { published: Boolean(body.published) }),
        ...(body.featured != null && { featured: Boolean(body.featured) }),
      },
    });

    if (before && before.slug !== project.slug) {
      await recordRedirect(`/projects/${before.slug}`, `/projects/${project.slug}`);
    }

    return NextResponse.json({ success: true, data: serializeProject(project) });
  } catch (error) {
    console.error('Project PUT error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
