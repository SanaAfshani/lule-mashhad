'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowLeft } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';

export type BlogPostCard = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: number;
  tag: string;
  date: string;
  featured: boolean;
  coverImage?: string;
};

export function BlogListClient({ posts }: { posts: BlogPostCard[] }) {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        label="وبلاگ تخصصی"
        title="مقالات و راهنماها"
        description="آموزش، راهنمای فنی و اخبار دنیای لوله آب و فاضلاب، پلیکا، پلی‌اتیلن و چدن"
      />

      <div className="container-main section-padding space-y-8">
        {featured && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="h-64 md:h-auto relative bg-slate-900">
                  {featured.coverImage ? (
                    <Image src={featured.coverImage} alt={featured.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-slate-900 flex items-center justify-center">
                      <img src="/images/logo.png" alt="لوله مشهد" className="h-20 opacity-60 drop-shadow-lg" />
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-3 py-1.5 rounded-full mb-4 w-fit">
                    ویژه
                  </span>
                  <h2 className="text-2xl font-black text-white mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-slate-400 mb-5 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-slate-500 text-sm mb-5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime} دقیقه
                    </span>
                    <span>{featured.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--accent)] font-semibold group-hover:gap-4 transition-all">
                    ادامه مطلب <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-44 relative bg-slate-800">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-slate-800 flex items-center justify-center">
                      <img src="/images/logo.png" alt="لوله مشهد" className="h-14 opacity-60 drop-shadow-md" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-bold px-2.5 py-1 rounded-full">
                    {post.tag}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} دقیقه
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-bold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors leading-relaxed">
                    {post.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-sm line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium">
                    ادامه مطلب <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-[var(--muted-foreground)] py-16">هنوز مقاله‌ای منتشر نشده است.</p>
        )}
      </div>
    </>
  );
}
