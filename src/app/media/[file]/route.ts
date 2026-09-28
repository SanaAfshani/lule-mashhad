import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

type Props = { params: Promise<{ file: string }> };

/**
 * سرو تصاویر آپلودی از دیتابیس: /media/<id>.webp
 * محتوای هر آدرس هرگز عوض نمی‌شود (آپلود جدید = id جدید)، پس کش یک‌ساله immutable امن است.
 */
export async function GET(_request: Request, { params }: Props) {
  const { file } = await params;
  const id = file.replace(/\.[a-z0-9]+$/i, '');
  if (!/^[a-z0-9]{20,40}$/i.test(id)) return new NextResponse('Not found', { status: 404 });

  const media = await prisma.media.findUnique({ where: { id }, select: { data: true, mime: true } });
  if (!media) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      'Content-Type': media.mime,
      'Content-Length': String(media.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
