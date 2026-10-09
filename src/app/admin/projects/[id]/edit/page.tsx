'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    content: '',
    year: 1403,
    published: true,
    featured: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          toast.error('پروژه یافت نشد');
          router.push('/admin/projects');
          return;
        }
        const p = json.data;
        setForm({
          title: p.title,
          location: p.location || '',
          description: p.description || '',
          content: p.content || '',
          year: p.year,
          published: p.published,
          featured: p.featured,
        });
      } catch {
        toast.error('خطا در بارگذاری');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || 'ذخیره ناموفق بود');
        return;
      }
      toast.success('پروژه به‌روزرسانی شد');
      router.push('/admin/projects');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full h-11 bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--muted-foreground)] gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        بارگذاری پروژه...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">ویرایش پروژه</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">عنوان *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">موقعیت</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">توضیحات</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">سال</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className={inputCls}
          />
        </div>
        <label className="flex items-center gap-2 text-[var(--foreground)] text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          منتشر شده
        </label>
        <label className="flex items-center gap-2 text-[var(--foreground)] text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          پروژه ویژه
        </label>
        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
