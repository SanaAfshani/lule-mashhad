'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import type { BlogPost } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';
import { PdfViewer } from '@/shared/ui/PdfViewer';

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
          {/* Cover image */}
          <div className="relative h-52 sm:h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
            <Image src={coverImage} alt={post.title} fill className="object-cover" priority />
            {!post.coverImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-slate-900/60 flex items-center justify-center">
                <div className="text-center">
                  <img src="/images/logo.png" alt="قدیر لوله آنلاین" className="h-16 mx-auto mb-3 drop-shadow-lg" />
                  <span className="text-white/80 text-sm font-medium bg-black/30 px-4 py-1.5 rounded-full">{tag}</span>
                </div>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="mb-8">
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              {tag}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--foreground)] mb-5 leading-tight">
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

          {/* Text content */}
          {!isPdfOnly && (
            <div
              className="prose prose-lg max-w-none text-[var(--foreground)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:mr-6 [&_li]:mb-2 mb-10"
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
