'use client';

import { Bell, User, LogOut, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
    toast.success('با موفقیت خارج شدید');
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <p className="text-white font-semibold text-sm">پنل مدیریت قدیر لوله آنلاین </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">مشاهده سایت</span>
        </Link>
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>
        <div className="flex items-center gap-2 h-9 bg-slate-800 rounded-lg px-3 text-sm text-slate-300">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">مدیر سیستم</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-all"
          title="خروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
