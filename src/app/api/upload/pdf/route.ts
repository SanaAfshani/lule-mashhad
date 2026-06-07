import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';

  // ── Client-upload token flow (Vercel Blob) ──────────────────────────────
  // @vercel/blob/client sends a JSON body to get an upload token,
  // then uploads the file DIRECTLY to the CDN (bypasses 4.5 MB limit).
  if (contentType.includes('application/json') && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { handleUpload } = await import('@vercel/blob/client');
      const body = await request.json();

      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100 MB
        }),
        onUploadCompleted: async ({ blob }) => {
          console.log('PDF uploaded to blob:', blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (err) {
      console.error('Blob handleUpload error:', err);
      return NextResponse.json({ success: false, error: 'خطا در تولید توکن آپلود' }, { status: 500 });
    }
  }

  // ── Server-side FormData fallback (local dev / no BLOB token) ───────────
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'فایلی انتخاب نشده' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'فقط فایل PDF مجاز است' }, { status: 400 });
    }
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'حجم فایل نباید بیشتر از ۱۰۰ مگابایت باشد' }, { status: 400 });
    }

    // If BLOB token exists but file came as FormData, use server-side put()
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const blob = await put(`pdfs/${timestamp}-${safeName}`, file, { access: 'public' });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Local filesystem
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, `${timestamp}-${safeName}`), buffer);
    return NextResponse.json({ success: true, url: `/uploads/pdfs/${timestamp}-${safeName}` });

  } catch (err) {
    console.error('PDF upload error:', err);
    return NextResponse.json({ success: false, error: 'خطا در آپلود فایل' }, { status: 500 });
  }
}
