'use client';

import { useState } from 'react';
import { FileText, Download, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title?: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [expanded, setExpanded] = useState(true);

  const label = title ?? 'فایل PDF مقاله';

  return (
    <div className="mt-10 rounded-2xl border border-[var(--border)] overflow-hidden shadow-lg">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[var(--foreground)] font-semibold text-sm leading-tight">{label}</p>
            <p className="text-[var(--muted-foreground)] text-xs mt-0.5">کاتالوگ PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={url}
            download
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-amber-500 text-black px-3 py-2 rounded-xl font-bold hover:bg-amber-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دانلود PDF</span>
            <span className="sm:hidden">دانلود</span>
          </a>

          {/* collapse toggle — desktop only */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="hidden md:flex w-9 h-9 rounded-xl bg-slate-800/50 items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title={expanded ? 'بستن' : 'نمایش PDF'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Desktop: native iframe ── */}
      {expanded && (
        <div className="hidden md:block bg-slate-100 dark:bg-slate-900">
          <iframe
            src={`${url}#toolbar=1&view=FitH`}
            className="w-full border-0"
            style={{ height: '800px' }}
            title={label}
          />
        </div>
      )}

      {/* ── Mobile: open-in-browser card ── */}
      <div className="md:hidden px-5 py-8 flex flex-col items-center gap-5 bg-[var(--card)]">
        {/* icon */}
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-amber-500" />
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-[var(--foreground)] font-bold text-base">{label}</p>
          <p className="text-[var(--muted-foreground)] text-sm">
            برای مشاهده کاتالوگ، دکمه زیر را لمس کنید
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-amber-500 text-black px-5 py-3.5 rounded-xl font-bold text-sm hover:bg-amber-400 transition-colors w-full"
          >
            <ExternalLink className="w-4 h-4" />
            مشاهده کاتالوگ
          </a>
          <a
            href={url}
            download
            className="flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground)] px-5 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-800/40 transition-colors w-full"
          >
            <Download className="w-4 h-4" />
            دانلود فایل
          </a>
        </div>
      </div>

    </div>
  );
}
