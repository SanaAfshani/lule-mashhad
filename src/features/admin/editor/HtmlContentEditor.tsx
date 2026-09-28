'use client';

import { useRef, useState } from 'react';
import { Code2, Eye, Megaphone, Sparkles, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { markdownToHtml, looksLikeMarkdown } from '@/shared/lib/markdown-to-html';
import { sanitizePastedHtml, plainTextToHtml } from '@/shared/lib/html-paste';
import { BannerDialog } from './BannerDialog';

type Props = {
  value: string;
  onChange: (html: string) => void;
  rows?: number;
  placeholder?: string;
  label?: string;
};

/**
 * ویرایشگر محتوای HTML با پیست هوشمند.
 *
 * ابزارهای تولید محتوا (مثل seobot) خروجی Markdown می‌دهند و متن کپی‌شده از
 * Word/Docs هم HTML کثیف دارد. هنگام پیست، نوع ورودی تشخیص داده و به HTML
 * تمیز تبدیل می‌شود تا `##` و `**` خام در صفحه مقاله ظاهر نشوند.
 */
export function HtmlContentEditor({ value, onChange, rows = 14, placeholder, label }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  /** درج در موقعیت مکان‌نما، تا پیست وسط متن هم درست کار کند */
  const insert = (text: string) => {
    const el = ref.current;
    if (!el) return onChange(value + text);
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + text.length;
      el.focus();
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData('text/html');
    const plain = e.clipboardData.getData('text/plain');

    // ۱) Markdown — خروجی ابزارهای تولید محتوا
    if (plain && looksLikeMarkdown(plain)) {
      e.preventDefault();
      insert(markdownToHtml(plain));
      toast.success('Markdown به HTML تبدیل شد');
      return;
    }

    // ۲) HTML فرمت‌دار — کپی از Word، Google Docs، وردپرس یا یک صفحه وب
    if (html && /<(p|h[1-6]|ul|ol|li|table|strong|b|em|i|a|img)\b/i.test(html)) {
      e.preventDefault();
      insert(sanitizePastedHtml(html));
      toast.success('HTML تمیز و وارد شد');
      return;
    }

    // ۳) متن ساده چندپاراگرافی
    if (plain && /\n\s*\n/.test(plain)) {
      e.preventDefault();
      insert(plainTextToHtml(plain));
      return;
    }

    // ۴) متن کوتاه — رفتار عادی مرورگر
  };

  /** تبدیل دستی، برای محتوایی که قبلاً به صورت Markdown ذخیره شده است */
  const convertExisting = () => {
    if (!value.trim()) return;
    if (!looksLikeMarkdown(value)) {
      toast('نشانه‌ای از Markdown پیدا نشد');
      return;
    }
    onChange(markdownToHtml(value));
    toast.success('محتوا به HTML تبدیل شد');
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setBannerOpen(true)}
            title="درج بنر تبلیغاتی با دکمه و لینک در محل مکان‌نما"
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Megaphone className="w-3.5 h-3.5" />
            افزودن بنر
          </button>
          <button
            type="button"
            onClick={convertExisting}
            title="تبدیل محتوای فعلی از Markdown به HTML"
            className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            تبدیل Markdown
          </button>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs transition-colors ${
              preview ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {preview ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? 'کد' : 'پیش‌نمایش'}
          </button>
        </div>
      </div>

      {preview ? (
        <div
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white overflow-auto [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:mr-6 [&_ol]:mr-6 [&_li]:mb-1 [&_a]:text-amber-400 [&_a]:underline [&_strong]:font-bold [&_table]:w-full [&_th]:border [&_td]:border [&_th]:border-slate-600 [&_td]:border-slate-600 [&_th]:p-2 [&_td]:p-2"
          style={{ minHeight: rows * 24 }}
          dangerouslySetInnerHTML={{ __html: value || '<p class="text-slate-500">محتوایی وارد نشده است.</p>' }}
        />
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          rows={rows}
          placeholder={placeholder}
          dir="auto"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-y transition-colors font-mono text-[13px] leading-relaxed"
        />
      )}

      <BannerDialog
        open={bannerOpen}
        onClose={() => setBannerOpen(false)}
        onInsert={(html) => insert(`\n\n${html}\n\n`)}
      />

      <p className="flex items-start gap-1.5 text-xs text-slate-500 mt-1.5 leading-relaxed">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500/70" />
        متن را مستقیم از ابزار تولید محتوا، Word یا Google Docs پیست کن — خودکار به HTML تمیز تبدیل می‌شود.
      </p>
    </div>
  );
}
