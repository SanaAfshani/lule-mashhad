import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { hashPassword } from '@/shared/lib/auth';

type Props = { params: Promise<{ id: string }> };

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: {
      name?: string;
      email?: string;
      role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
      password?: string;
    } = {};

    if (body.name != null) data.name = String(body.name).trim();
    if (body.email != null) data.email = String(body.email).trim().toLowerCase();
    if (body.role != null && ['ADMIN', 'EDITOR', 'VIEWER'].includes(body.role)) {
      data.role = body.role;
    }
    if (body.password) {
      if (String(body.password).length < 6) {
        return NextResponse.json(
          { success: false, error: 'رمز عبور حداقل ۶ کاراکتر باشد' },
          { status: 400 },
        );
      }
      data.password = await hashPassword(String(body.password));
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('User PUT error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ success: false, error: 'کاربر یافت نشد' }, { status: 404 });
    }

    if (target.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'حداقل یک مدیر باید در سیستم باقی بماند' },
          { status: 400 },
        );
      }
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User DELETE error:', error);
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}
