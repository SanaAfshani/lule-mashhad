'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, FileText, Download, ExternalLink, BookOpen } from 'lucide-react';
import type { BlogPost } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';

const DEFAULT_COVER = '/images/blog-default.jpg';

export function BlogPostView({ post }: { post: BlogPost }) {
  const tag = post.tags[0] || 'مقاله';
  const isPdfOnly = !post.content || post.content === '<p></p>' || post.content.trim() === '';
  const coverImage = post.coverImage || DEFAULT_COVER;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-main py-10 max-w-5xl">
        <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-8 flex-wrap">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">وبلاگ</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] truncate">{post.title}</span>
        </nav>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image src={coverImage} alt={post.title} fill className="object-cover" priority />
            {!post.coverImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-slate-900/60 flex items-center justify-center">
                <div className="text-center">
                  <img src="/images/logo.png" alt="لوله مشهد" className="h-16 mx-auto mb-3 drop-shadow-lg" />
                  <span className="text-white/80 text-sm font-medium bg-black/30 px-4 py-1.5 rounded-full">{tag}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              {tag}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] mb-5 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
              {!isPdfOnly && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime} دقیقه مطالعه
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
              {post.author?.name && <span>نویسنده: {post.author.name}</span>}
              {post.pdfUrl && (
                <span className="flex items-center gap-1.5 text-[var(--accent)]">
                  <BookOpen className="w-4 h-4" />
                  کاتالوگ PDF
                </span>
              )}
            </div>
          </div>

          {!isPdfOnly && (
            <div
              className="prose prose-lg max-w-none text-[var(--foreground)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:mr-6 [&_li]:mb-2 mb-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {/* PDF Catalog Viewer */}
          {post.pdfUrl && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-lg"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-4 bg-[var(--card)] border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <div className="text-[var(--foreground)] font-semibold text-sm">کاتالوگ محصول</div>
                    <div className="text-[var(--muted-foreground)] text-xs">{post.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={post.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    باز کردن
                  </a>
                  <a
                    href={post.pdfUrl}
                    download
                    className="flex items-center gap-1.5 text-sm bg-[var(--accent)] text-[var(--accent-foreground)] px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    دانلود PDF
                  </a>
                </div>
              </div>

              {/* PDF iframe viewer */}
              <div className="relative bg-slate-100 dark:bg-slate-900">
                <iframe
                  src={`${post.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  className="w-full border-0"
                  style={{ height: '85vh', minHeight: '600px' }}
                  title={post.title}
                />
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-[var(--card)] border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>برای مشاهده بهتر، فایل را دانلود کنید</span>
                <a
                  href={post.pdfUrl}
                  download
                  className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  دانلود
                </a>
              </div>
            </motion.div>
          )}

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:gap-3 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت به وبلاگ
            </Link>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
