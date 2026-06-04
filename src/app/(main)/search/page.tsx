import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchPageClient } from '@/features/search/SearchPageClient';

export const metadata: Metadata = {
  title: 'جستجو | قدیر لوله آنلاین ',
  description: 'جستجو در محصولات، مقالات و پروژه‌های قدیر لوله آنلاین ',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="container-main relative z-10 py-10 md:py-14">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-slate-300 transition-colors">خانه</Link>
            <span>/</span>
            <span className="text-[var(--accent)]">جستجو</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">جستجو</h1>
          <p className="text-slate-400 text-sm">جستجو در محصولات، مقالات و پروژه‌ها</p>
        </div>
      </div>
      <SearchPageClient />
    </div>
  );
}
