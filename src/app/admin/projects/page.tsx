'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Search, Trash2, Building2, MapPin, Loader2, Pencil, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPersianNumber } from '@/shared/lib/utils';
import type { Project } from '@/shared/types';

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const togglePublished = async (project: Project) => {
    setTogglingId(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !project.published }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || 'به‌روزرسانی ناموفق بود');
        return;
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p)),
      );
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setTogglingId(null);
    }
  };

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?admin=true');
      const json = await res.json();
      if (json.success) {
        setProjects(json.data);
      } else {
        toast.error(json.error || 'بارگذاری پروژه‌ها ناموفق بود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filtered = projects.filter(
    (p) =>
      p.title.includes(search) ||
      (p.location && p.location.includes(search)),
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`پروژه «${title}» حذف شود؟`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'حذف ناموفق بود');
        return;
      }

      toast.success('پروژه حذف شد');
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت پروژه‌ها</h1>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'در حال بارگذاری...' : `${projects.length} پروژه در سیستم`}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          پروژه جدید
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در پروژه‌ها..."
          className="w-full h-11 bg-slate-900 border border-slate-800 rounded-xl pr-12 pl-4 text-white placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            بارگذاری پروژه‌ها...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">پروژه‌ای یافت نشد.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-right">
                  <th className="px-6 py-4 font-medium">پروژه</th>
                  <th className="px-6 py-4 font-medium">موقعیت</th>
                  <th className="px-6 py-4 font-medium">سال</th>
                  <th className="px-6 py-4 font-medium">وضعیت</th>
                  <th className="px-6 py-4 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project, i) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{project.title}</div>
                          {project.featured && <span className="text-xs text-amber-400">⭐ ویژه</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatPersianNumber(project.year)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          project.published ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-500'
                        }`}
                      >
                        {project.published ? 'منتشر شده' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {project.published && (
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={togglingId === project.id}
                          onClick={() => togglePublished(project)}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
                        >
                          {togglingId === project.id ? '...' : project.published ? 'پیش‌نویس' : 'انتشار'}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === project.id}
                          onClick={() => handleDelete(project.id, project.title)}
                          className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-400 disabled:opacity-50"
                        >
                          {deletingId === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
    </div>
  );
}
