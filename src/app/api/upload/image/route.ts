import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const maxDuration = 30;

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';

  // ── Client-upload token flow (Vercel Blob) ────────────────────────────────
  if (contentType.includes('application/json') && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { handleUpload } = await import('@vercel/blob/client');
      const body = await request.json();
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
        }),
        onUploadCompleted: async ({ blob }) => {
          console.log('Image uploaded:', blob.url);
        },
      });
      return NextResponse.json(jsonResponse);
    } catch (err) {
      console.error('Blob handleUpload error:', err);
      return NextResponse.json({ success: false, error: 'خطا در تولید توکن آپلود' }, { status: 500 });
    }
  }

  // ── FormData fallback ─────────────────────────────────────────────────────
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ success: false, error: 'فایلی انتخاب نشده' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type))
      return NextResponse.json({ success: false, error: 'فقط JPG، PNG و WebP مجاز است' }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ success: false, error: 'حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد' }, { status: 400 });

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const ext = file.name.split('.').pop() ?? 'jpg';
      const blob = await put(`images/${Date.now()}.${ext}`, file, { access: 'public' });
      return NextResponse.json({ success: true, url: blob.url });
    }

    const bytes = await file.arrayBuffer();
    const ext = file.name.split('.').pop() ?? 'jpg';
    const filename = `${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
    return NextResponse.json({ success: true, url: `/uploads/images/${filename}` });
  } catch (err) {
    console.error('Image upload error:', err);
    return NextResponse.json({ success: false, error: 'خطا در آپلود تصویر' }, { status: 500 });
  }
}
