'use client';

import { ChevronDown, ChevronUp, HelpCircle, Plus, Trash2 } from 'lucide-react';
import type { FaqItem } from '@/shared/types';
import { formatPersianNumber } from '@/shared/lib/utils';

type Props = {
  value: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
  /** «مقاله» یا «محصول» — فقط در متن‌های راهنما استفاده می‌شود */
  entityLabel?: string;
};

const inputCls =
  'w-full h-11 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-colors';
const textareaCls =
  'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 resize-none transition-colors';

export function FaqEditor({ value, onChange, entityLabel = 'مقاله' }: Props) {
  const update = (index: number, patch: Partial<FaqItem>) =>
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  const add = () => onChange([...value, { question: '', answer: '' }]);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  // ردیف ناقص هنگام ذخیره حذف می‌شود — به ادمین هشدار می‌دهیم
  const incomplete = value.filter((f) => !f.question.trim() || !f.answer.trim()).length;

  return (
    <div className="bg-slate-900 border-2 border-sky-500/30 rounded-2xl overflow-hidden">
      <div className="bg-sky-500/10 border-b border-sky-500/20 px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h2 className="text-white font-bold">سوالات متداول {entityLabel}</h2>
          <p className="text-sky-200/60 text-xs mt-0.5">
            در انتهای صفحه {entityLabel} به صورت آکاردئون نمایش داده می‌شود و شانس نمایش در گوگل
            را بالا می‌برد
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {value.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-700 rounded-xl">
            <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">هنوز سوالی اضافه نشده است</p>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed max-w-md mx-auto">
              ۳ تا ۶ سوال واقعی مشتریان درباره این {entityLabel} بنویسید. گوگل این سوالات را
              مستقیماً زیر نتیجه نمایش می‌دهد.
            </p>
          </div>
        ) : (
          value.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-sky-400">سوال {formatPersianNumber(index + 1)}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="انتقال به بالا"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    aria-label="انتقال به پایین"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label="حذف سوال"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={faq.question}
                onChange={(e) => update(index, { question: e.target.value })}
                placeholder="سوال — مثال: لوله پلی اتیلن چند سال عمر می‌کند؟"
                className={inputCls}
              />
              <textarea
                value={faq.answer}
                onChange={(e) => update(index, { answer: e.target.value })}
                rows={3}
                placeholder="پاسخ کوتاه و مستقیم در ۲ تا ۴ جمله..."
                className={textareaCls}
              />
            </div>
          ))
        )}

        {incomplete > 0 && (
          <p className="text-xs text-amber-400 leading-relaxed">
            {formatPersianNumber(incomplete)} سوال ناقص است. ردیف‌هایی که سوال یا پاسخ خالی دارند هنگام ذخیره حذف
            می‌شوند.
          </p>
        )}

        <button
          type="button"
          onClick={add}
          className="w-full h-11 rounded-xl border border-dashed border-slate-600 text-slate-400 text-sm font-medium flex items-center justify-center gap-2 hover:border-sky-500 hover:text-sky-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن سوال
        </button>
      </div>
    </div>
  );
}
