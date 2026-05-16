'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, HelpCircle, ChevronDown, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { FAQ } from '@/shared/types';

type FaqForm = {
  question: string;
  answer: string;
  published: boolean;
  order: number;
};

const emptyForm: FaqForm = { question: '', answer: '', published: true, order: 0 };

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faq?admin=true');
      const json = await res.json();
      if (json.success) {
        setFaqs(json.data);
      } else {
        toast.error(json.error || 'بارگذاری سوالات ناموفق بود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order: faqs.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      published: faq.published,
      order: faq.order,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/faq/${editingId}` : '/api/faq';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'ذخیره ناموفق بود');
        return;
      }

      toast.success(editingId ? 'سوال به‌روزرسانی شد' : 'سوال اضافه شد');
      setModalOpen(false);
      loadFaqs();
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این سوال حذف شود؟')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'حذف ناموفق بود');
        return;
      }

      toast.success('سوال حذف شد');
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      if (expanded === id) setExpanded(null);
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
          <h1 className="text-2xl font-bold text-white">مدیریت سوالات متداول</h1>
          <p className="text-slate-400 text-sm mt-1">
            {loading ? 'در حال بارگذاری...' : `${faqs.length} سوال در سیستم`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          سوال جدید
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          بارگذاری سوالات...
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                className="w-full flex items-center gap-4 px-6 py-4 text-right hover:bg-slate-800/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                </div>
                <span className="flex-1 text-white font-medium">{faq.question}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      faq.published ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {faq.published ? 'فعال' : 'غیرفعال'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${expanded === faq.id ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {expanded === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 border-t border-slate-800">
                      <p className="text-slate-400 text-sm leading-relaxed py-3">{faq.answer}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => openEdit(faq)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all text-xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          ویرایش
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === faq.id}
                          onClick={() => handleDelete(faq.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs disabled:opacity-50"
                        >
                          {deletingId === faq.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          حذف
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setModalOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold">{editingId ? 'ویرایش سوال' : 'سوال جدید'}</h2>
                <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1.5">سوال *</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1.5">پاسخ *</label>
                <textarea
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded"
                  />
                  منتشر شده
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-slate-400 text-sm">ترتیب</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-20 h-9 bg-slate-800 border border-slate-700 rounded-lg px-2 text-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full h-11 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                ذخیره
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
