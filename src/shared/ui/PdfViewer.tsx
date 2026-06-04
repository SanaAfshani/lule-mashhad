'use client';

import { useState } from 'react';
import { FileText, Download, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title?: string;
}

export function PdfViewer({ url, title }: PdfViewerProps) {
  const [expanded, setExpanded] = useState(true);

  // For external URLs (Vercel Blob), use directly.
  // For local /uploads paths, build full URL for Google Docs viewer.
  const isAbsolute = url.startsWith('http');
  const fullUrl = isAbsolute
    ? url
    : typeof window !== 'undefined'
      ? `${window.location.origin}${url}`
      : url;

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;

  return (
    <div className="mt-10 rounded-2xl border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--foreground)] font-semibold text-sm sm:text-base">
          <FileText className="w-5 h-5 text-[var(--accent)] flex-shrink-0" />
          <span>{title ?? 'فایل PDF مقاله'}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            باز کردن
          </a>
          <a
            href={url}
            download
            className="flex items-center gap-1.5 text-sm bg-[var(--accent)] text-[var(--accent-foreground)] px-3 py-1.5 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            دانلود
          </a>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title={expanded ? 'بستن نمایش' : 'نمایش PDF'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Viewer */}
      {expanded && (
        <>
          {/* Desktop: native iframe */}
          <div className="hidden md:block">
            <iframe
              src={url}
              className="w-full border-0"
              style={{ height: '780px' }}
              title={title ?? 'PDF Viewer'}
            />
          </div>

          {/* Mobile: Google Docs viewer (scrollable) + fallback open button */}
          <div className="block md:hidden">
            <iframe
              src={googleViewerUrl}
              className="w-full border-0"
              style={{ height: '520px' }}
              title={title ?? 'PDF Viewer'}
              allow="autoplay"
            />
            {/* Fallback if Google Docs viewer fails on mobile */}
            <div className="bg-[var(--card)] px-4 py-3 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <span className="text-xs text-[var(--muted-foreground)]">
                اگر PDF نمایش داده نمیشه، مستقیم باز کنید
              </span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-[var(--accent)] text-[var(--accent-foreground)] px-3 py-2 rounded-lg font-bold whitespace-nowrap hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                مشاهده PDF
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
