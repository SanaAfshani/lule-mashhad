'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, ImagePlus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { slugify } from '@/shared/lib/utils';
import type { Category } from '@/shared/types';

type Spec = { key: string; value: string };

interface FormState {
  name: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: string;
  inStock: boolean;
  featured: boolean;
  published: boolean;
  specs: Spec[];
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormState>({
    name: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    price: '',
    inStock: true,
    featured: false,
    published: true,
    specs: [{ key: '', value: '' }],
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories?admin=true');
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        } else {
          toast.error(json.error || 'بارگذاری دسته‌بندی‌ها ناموفق بود');
        }
      } catch {
        toast.error('خطا در ارتباط با سرور');
      } finally {
        setCategoriesLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      toast.error('دسته‌بندی را انتخاب کنید');
      return;
    }

    setLoading(true);
    const specifications = Object.fromEntries(
      form.specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()]),
    );

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: slugify(form.name),
          categoryId: form.categoryId,
          shortDescription: form.shortDescription || undefined,
          description: form.description || undefined,
          price: form.price || null,
          specifications,
          inStock: form.inStock,
          featured: form.featured,
          published: form.published,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'ذخیره محصول ناموفق بود');
        return;
      }

      toast.success('محصول با موفقیت ذخیره شد!');
      router.push('/admin/products');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const addSpec = () =>
    setForm((f) => ({ ...f, specs: [...f.specs, { key: '', value: '' }] }));

  const updateSpec = (i: number, field: keyof Spec, val: string) => {
    const specs = [...form.specs];
    specs[i][field] = val;
    setForm((f) => ({ ...f, specs }));
  };

  const toggleField = (key: 'inStock' | 'featured' | 'published') =>
    setForm((f) => ({ ...f, [key]: !f[key] }));

  const inputCls =
    'w-full h-11 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white placeholder:text-slate-500 focus:outline-none transition-colors';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">افزودن محصول جدید</h1>
          <p className="text-slate-400 text-sm">اطلاعات محصول جدید را وارد کنید</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold">اطلاعات اصلی</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">نام محصول *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: لوله فولادی ۲ اینچ API"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">دسته‌بندی *</label>
                {categoriesLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    بارگذاری دسته‌بندی‌ها...
                  </div>
                ) : (
                  <select
                    required
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">انتخاب دسته‌بندی...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">توضیح کوتاه</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="یک جمله کوتاه درباره محصول..."
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">توضیحات کامل</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  placeholder="توضیحات کامل محصول..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold">مشخصات فنی</h2>
                <button
                  type="button"
                  onClick={addSpec}
                  className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  + افزودن ردیف
                </button>
              </div>
              <div className="space-y-3">
                {form.specs.map((spec, i) => (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => updateSpec(i, 'key', e.target.value)}
                      placeholder="مثال: قطر"
                      className="h-10 bg-slate-800 border border-slate-700 rounded-xl px-3 text-white placeholder:text-slate-500 focus:outline-none text-sm"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpec(i, 'value', e.target.value)}
                      placeholder="مثال: ۲ اینچ"
                      className="h-10 bg-slate-800 border border-slate-700 rounded-xl px-3 text-white placeholder:text-slate-500 focus:outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">تصویر محصول</h2>
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-500">
                <ImagePlus className="w-8 h-8" />
                <div className="text-sm text-center">
                  <div>آپلود تصویر</div>
                  <div className="text-xs mt-1 text-slate-600">JPG, PNG تا ۵ مگابایت</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold">تنظیمات</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">قیمت (تومان)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="خالی = استعلام"
                  className={inputCls}
                />
              </div>

              {(
                [
                  { key: 'inStock', label: 'موجود در انبار' },
                  { key: 'featured', label: 'محصول ویژه' },
                  { key: 'published', label: 'منتشر شده' },
                ] as { key: 'inStock' | 'featured' | 'published'; label: string }[]
              ).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => toggleField(key)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form[key] ? 'bg-amber-500' : 'bg-slate-700'}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form[key] ? 'right-1' : 'left-1'}`}
                    />
                  </button>
                  <span className="text-slate-300 text-sm">{label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || categoriesLoading}
              className="w-full h-12 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              ذخیره محصول
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
