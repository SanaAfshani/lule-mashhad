'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import type { BlogPost } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';

const BLOG_IMAGE_HEIGHT = 'h-48';

type Props = {
  posts: BlogPost[];
};

export function BlogPreview({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="home-section bg-[var(--muted)]/20">
      <div className="container-main">
        <SectionHeading
          label="وبلاگ تخصصی"
          title="آخرین مقالات و راهنماها"
          description="اطلاعات فنی، راهنماهای کاربردی و اخبار صنعت لوله و تأسیسات آب و فاضلاب"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, i) => {
            const image = post.coverImage || '/images/blog/guide-pipes.jpg';
            const tag = post.tags[0] || 'مقاله';

            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl h-full"
                >
                  <div className={`relative w-full shrink-0 overflow-hidden ${BLOG_IMAGE_HEIGHT}`}>
                    <Image
                      src={image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      priority={i < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime} دقیقه
                      </span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors leading-relaxed">
                      {post.title}
                    </h3>
                    <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 text-[var(--accent)] text-sm font-medium mt-4 pt-4 border-t border-[var(--border)]">
                      ادامه مطلب{' '}
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl border-2 border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300 hover:-translate-y-0.5"
          >
            مشاهده همه مقالات <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
