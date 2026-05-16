'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/widgets/admin/AdminSidebar';
import { AdminHeader } from '@/widgets/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Login page must render standalone — no sidebar, no header
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64 transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 p-5 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
