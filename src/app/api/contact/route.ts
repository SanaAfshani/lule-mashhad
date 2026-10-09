import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/admin-auth';
import { prisma } from '@/shared/lib/prisma';
import { recordLead } from '@/shared/lib/lead-events';
import { cleanPath } from '@/shared/lib/leads';

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'نام و پیام الزامی است' }, { status: 400 });
    }

    const sourcePath = cleanPath(body.sourcePath) || null;
    const msg = await prisma.contactMessage.create({
      data: { name, email: email || '', phone, subject, message, sourcePath },
    });
    // گزارش «کدام صفحه مشتری می‌آورد»؛ خطای آن نباید ثبت پیام مشتری را خراب کند
    await recordLead('form', sourcePath ?? '', typeof subject === 'string' ? subject : '').catch((e) => console.error('Lead record error:', e));

    return NextResponse.json(
      { success: true, data: msg, message: 'پیام با موفقیت ارسال شد' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
