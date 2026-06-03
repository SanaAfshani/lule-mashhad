'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, ImagePlus, FileText, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { slugify } from '@/shared/lib/utils';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', coverImage: '',
    pdfUrl: '', featured: false, published: true,
  });

  const handlePdfUpload = async (file: File) => {
    setPdfUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload/pdf', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error || 'آپلود PDF ناموفق بود');
        return;
      }
      setForm((f) => ({ ...f, pdfUrl: json.url }));
      toast.success('فایل PDF با موفقیت آپلود شد');
    } catch {
      toast.error('خطا در آپلود فایل');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const meRes = await fetch('/api/auth/me');
      const meJson = await meRes.json();
      const authorId = meJson?.data?.id as string | undefined;

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || slugify(form.title),
          excerpt: form.excerpt || undefined,
          content: form.content,
          coverImage: form.coverImage || undefined,
          pdfUrl: form.pdfUrl || undefined,
          featured: form.featured,
          published: form.published,
          authorId,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'ذخیره مقاله ناموفق بود');
        return;
      }

      toast.success('مقاله با موفقیت ذخیره شد!');
      router.push('/admin/blog');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full h-11 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white placeholder:text-slate-500 focus:outline-none transition-colors';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">نوشتن مقاله جدید</h1>
          <p className="text-slate-400 text-sm">اطلاعات مقاله جدید را وارد کنید</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold">محتوای مقاله</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">عنوان *</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: slugTouched ? f.slug : slugify(title),
                    }));
                  }}
                  placeholder="عنوان مقاله..."
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">آدرس (slug)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm({ ...form, slug: e.target.value });
                  }}
                  placeholder="مثال: راهنمای-انتخاب-لوله"
                  className={inputCls}
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">خلاصه</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  placeholder="خلاصه‌ای کوتاه از مقاله..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none resize-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">متن کامل مقاله</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={12}
                  placeholder="متن کامل مقاله را اینجا بنویسید..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover image */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">تصویر شاخص</h2>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-amber-500 hover:text-amber-400 transition-colors cursor-pointer">
                <ImagePlus className="w-8 h-8" />
                <div className="text-sm text-center">
                  <div>آپلود تصویر</div>
                  <div className="text-xs mt-1 text-slate-600">JPG, PNG تا ۵ مگابایت</div>
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">فایل PDF مقاله</h2>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfUpload(file);
                }}
              />
              {form.pdfUrl ? (
                <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3">
                  <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300 flex-1 truncate" dir="ltr">
                    {form.pdfUrl.split('/').pop()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, pdfUrl: '' }))}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={pdfUploading}
                  className="w-full border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-slate-500 hover:border-amber-500 hover:text-amber-400 transition-colors disabled:opacity-50"
                >
                  {pdfUploading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <FileText className="w-7 h-7" />
                  )}
                  <div className="text-sm text-center">
                    <div>{pdfUploading ? 'در حال آپلود...' : 'آپلود فایل PDF'}</div>
                    <div className="text-xs mt-1 text-slate-600">حداکثر ۲۰ مگابایت</div>
                  </div>
                </button>
              )}
            </div>

            {/* Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold">تنظیمات</h2>

              {(
                [
                  { key: 'featured', label: 'مقاله ویژه' },
                  { key: 'published', label: 'منتشر شده' },
                ] as { key: 'featured' | 'published'; label: string }[]
              ).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form[key] ? 'bg-amber-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form[key] ? 'right-1' : 'left-1'}`} />
                  </button>
                  <span className="text-slate-300 text-sm">{label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <Save className="w-5 h-5" />
              )}
              ذخیره مقاله
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
