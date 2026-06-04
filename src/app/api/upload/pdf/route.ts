import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'فایلی انتخاب نشده' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, error: 'فقط فایل PDF مجاز است' }, { status: 400 });
    }
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `pdfs/${timestamp}-${safeName}`;

    // On Vercel: use Blob Storage; locally: save to public/uploads
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const blob = await put(filename, file, { access: 'public' });
      return NextResponse.json({ success: true, url: blob.url });
    }

    // Local fallback
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, `${timestamp}-${safeName}`), buffer);
    return NextResponse.json({ success: true, url: `/uploads/pdfs/${timestamp}-${safeName}` });
  } catch (error) {
    console.error('PDF upload error:', error);
    return NextResponse.json({ success: false, error: 'خطا در آپلود فایل' }, { status: 500 });
  }
}
