'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Star, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Testimonial } from '@/shared/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
        />
      ))}
    </div>
  );
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    company: '',
    content: '',
    rating: 5,
    published: true,
  });

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials?admin=true');
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      } else {
        toast.error(json.error || 'بارگذاری نظرات ناموفق بود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'افزودن نظر ناموفق بود');
        return;
      }

      toast.success('نظر اضافه شد');
      setModalOpen(false);
      setForm({ name: '', company: '', content: '', rating: 5, published: true });
      loadItems();
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item: Testimonial) => {
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/testimonials/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'به‌روزرسانی ناموفق بود');
        return;
      }

      setItems((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, published: !t.published } : t)),
      );
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این نظر حذف شود؟')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'حذف ناموفق بود');
        return;
      }

      toast.success('نظر حذف شد');
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls =
    'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت نظرات</h1>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'در حال بارگذاری...' : `${items.length} نظر در سیستم`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          نظر جدید
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          بارگذاری نظرات...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white font-semibold">{item.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{item.company}</div>
                </div>
                <button
                  type="button"
                  disabled={togglingId === item.id}
                  onClick={() => togglePublished(item)}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    item.published ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-500'
                  } disabled:opacity-50`}
                >
                  {togglingId === item.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : item.published ? (
                    'منتشر شده'
                  ) : (
                    'پیش‌نویس'
                  )}
                </button>
              </div>

              <StarRating rating={item.rating} />

              <p className="text-slate-400 text-sm leading-relaxed mt-3 line-clamp-3">{item.content}</p>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs disabled:opacity-50"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setModalOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAdd}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold">نظر جدید</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">نام *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">شرکت</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">متن نظر *</label>
              <textarea
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">امتیاز (۱–۵)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className={inputCls}
              />
            </div>

            <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              منتشر شده
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-11 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              ذخیره
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
