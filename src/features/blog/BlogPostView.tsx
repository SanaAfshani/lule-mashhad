'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import type { BlogPost } from '@/shared/types';
import { faDigits, formatDate } from '@/shared/lib/utils';
import { PdfViewer } from '@/shared/ui/PdfViewer';
import { FaqAccordion } from '@/shared/ui/FaqAccordion';

export function BlogPostView({ post }: { post: BlogPost }) {
  const tag = post.tags[0] || 'مقاله';
  const isPdfOnly = !post.content || post.content === '<p></p>' || post.content.trim() === '';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-main py-10 max-w-5xl">
        <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-8 flex-wrap">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">وبلاگ</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] truncate min-w-0 max-w-full">{faDigits(post.title)}</span>
        </nav>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Meta */}
          <header className="max-w-3xl mb-8">
            <span className="text-sm font-bold text-[var(--accent)]">{tag}</span>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-[2.5rem] font-black text-[var(--foreground)] leading-snug md:leading-tight">
              {faDigits(post.title)}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--muted-foreground)] num">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
              {!isPdfOnly && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {faDigits(post.readTime)} دقیقه مطالعه
                </span>
              )}
              {post.author?.name && <span>نویسنده: {post.author.name}</span>}
              {post.pdfUrl && (
                <span className="flex items-center gap-1.5 text-[var(--foreground)] font-bold">
                  <BookOpen className="w-4 h-4" />
                  کاتالوگ PDF
                </span>
              )}
            </div>
          </header>

          {/* Cover image — بدون کاور، جای خالی نمی‌گذاریم */}
          {post.coverImage && (
            <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-3xl overflow-hidden mb-10 bg-[var(--muted)]">
              <Image src={post.coverImage} alt={post.title} fill sizes="(max-width:1024px) 100vw, 1024px" className="object-cover" priority />
            </div>
          )}

          <div className="max-w-3xl">
            {/* Text content */}
            {!isPdfOnly && (
              <div
                className="article-content mb-10"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* PDF Viewer */}
            {post.pdfUrl && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <PdfViewer url={post.pdfUrl} title={`کاتالوگ — ${post.title}`} />
              </motion.div>
            )}

            {/* سوالات متداول اختصاصی مقاله — در انتهای محتوا */}
            <FaqAccordion faqs={post.faqs ?? []} />

            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:gap-3 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت به وبلاگ
              </Link>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
