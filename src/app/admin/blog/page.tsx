'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, Eye, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/shared/lib/utils';

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  author?: { name: string };
};

export default function AdminBlogPage() {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?admin=true&limit=100');
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
      } else {
        toast.error(json.error || 'بارگذاری مقالات ناموفق بود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filtered = posts.filter((p) => p.title.includes(search));

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`مقاله «${title}» حذف شود؟`)) return;

    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'حذف ناموفق بود');
        return;
      }

      toast.success('مقاله حذف شد');
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  return (
    <motion.div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت وبلاگ</h1>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'در حال بارگذاری...' : `${posts.length} مقاله در سیستم`}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          مقاله جدید
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در مقالات..."
          className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pr-12 pl-4 text-white placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <motion.div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            بارگذاری مقالات...
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div className="text-center py-16 text-slate-500">
            مقاله‌ای یافت نشد. اولین مقاله را بسازید.
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-right">
                  <th className="px-6 py-4 font-medium">عنوان</th>
                  <th className="px-6 py-4 font-medium">نویسنده</th>
                  <th className="px-6 py-4 font-medium">تاریخ</th>
                  <th className="px-6 py-4 font-medium">بازدید</th>
                  <th className="px-6 py-4 font-medium">وضعیت</th>
                  <th className="px-6 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, i) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="text-white font-medium line-clamp-1">{post.title}</div>
                          {post.featured && <span className="text-xs text-amber-400">⭐ ویژه</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{post.author?.name ?? '—'}</td>
                    <td className="px-6 py-4 text-slate-400">{formatDate(post.createdAt)}</td>
                    <td className="px-6 py-4 text-slate-400">{post.viewCount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          post.published ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-500'
                        }`}
                      >
                        {post.published ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.published && (
                          <Link
                            href={`/blog/${encodeURIComponent(post.slug)}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${encodeURIComponent(post.slug)}/edit`}
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.slug, post.title)}
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
