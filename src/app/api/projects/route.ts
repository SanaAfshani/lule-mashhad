import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { serializeProject } from '@/shared/lib/serializers';
import { slugify } from '@/shared/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const admin = new URL(request.url).searchParams.get('admin') === 'true';
    const projects = await prisma.project.findMany({
      where: admin ? {} : { published: true },
      orderBy: [{ featured: 'desc' }, { year: 'desc' }],
    });
    return NextResponse.json({
      success: true,
      data: projects.map(serializeProject),
    });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ success: false, error: 'عنوان الزامی است' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: String(body.slug || '').trim() || slugify(title),
        description: body.description || null,
        content: body.content || null,
        images: JSON.stringify(body.images || []),
        location: body.location || null,
        year: body.year ? Number(body.year) : new Date().getFullYear(),
        client: body.client || null,
        published: body.published ?? true,
        featured: body.featured ?? false,
      },
    });

    return NextResponse.json({ success: true, data: serializeProject(project) }, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
