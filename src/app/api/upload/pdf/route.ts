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

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: 'حجم فایل نباید بیشتر از ۲۰ مگابایت باشد' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${timestamp}-${safeName}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/pdfs/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('PDF upload error:', error);
    return NextResponse.json({ success: false, error: 'خطا در آپلود فایل' }, { status: 500 });
  }
}
