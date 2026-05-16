'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';

export function BlogPostView({ post }: { post: BlogPost }) {
  const tag = post.tags[0] || 'مقاله';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container-main py-10 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-8 flex-wrap">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">خانه</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">وبلاگ</Link>
          <span>/</span>
          <span className="text-[var(--foreground)] truncate">{post.title}</span>
        </nav>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {post.coverImage && (
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="mb-8">
            <span className="inline-block bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              {tag}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] mb-5 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime} دقیقه مطالعه
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
              {post.author?.name && <span>نویسنده: {post.author.name}</span>}
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none text-[var(--foreground)] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4 [&_ul]:mr-6 [&_li]:mb-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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
