'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, Users, Package, Building2, Target, Eye, Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';

const stats = [
  { value: '+۲۰', label: 'سال تجربه',    icon: Award },
  { value: '+۵۰۰', label: 'مشتری فعال',  icon: Users },
  { value: '+۵۰۰۰', label: 'نوع محصول',  icon: Package },
  { value: '+۲۰۰', label: 'پروژه موفق', icon: Building2 },
];

const values = [
  {
    icon: Target,
    title: 'ماموریت ما',
    desc: 'تامین با کیفیت‌ترین لوله آب و فاضلاب — پلیکا، پلی‌اتیلن، چدن داکتیل و منهول — با قیمت رقابتی و خدمات حرفه‌ای.',
    color: 'amber',
  },
  {
    icon: Eye,
    title: 'چشم‌انداز ما',
    desc: 'تبدیل شدن به بزرگ‌ترین و معتمدترین تامین‌کننده لوله آب و فاضلاب در خراسان رضوی و سراسر ایران.',
    color: 'blue',
  },
  {
    icon: Heart,
    title: 'ارزش‌های ما',
    desc: 'صداقت، کیفیت تضمین‌شده، تحویل به‌موقع و رضایت مشتری اصول اساسی ما هستند.',
    color: 'green',
  },
];

const colorMap: Record<string, string> = {
  amber: 'bg-[var(--accent)]/10 text-[var(--accent)]',
  blue:  'bg-blue-500/10  text-blue-400',
  green: 'bg-green-500/10 text-green-500',
};

const team = [
  { name: 'مهندس الهی',   role: 'مدیرعامل',  desc: '۲۰ سال تجربه در صنعت لوله آب و فاضلاب' },
  { name: 'مهندس کاظمی', role: 'مدیر فنی',   desc: 'متخصص در انواع لوله‌های PVC، PE و چدن' },
  { name: 'خانم محمدی',  role: 'مدیر فروش', desc: 'کارشناس ارشد فروش با ۱۵ سال تجربه' },
];

const advantages = [
  'تامین مستقیم از کارخانه‌های معتبر ایران و اروپا',
  'ارائه گواهینامه کیفیت (Mill Certificate) برای تمام محصولات',
  'انبار با موجودی بالا برای تحویل فوری',
  'تیم مشاوره فنی متخصص',
  'ارسال به سراسر ایران با حمل‌ونقل اختصاصی',
  'قیمت‌گذاری شفاف و رقابتی',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="درباره ما"
        title="قدیر لوله آنلاین "
        description="بیش از ۲۰ سال تجربه در تامین انواع لوله آب و فاضلاب، اتصالات و شیرآلات صنعتی برای پروژه‌های عمرانی و ساختمانی"
      />

      {/* Stats */}
      <section className="section-padding-sm border-b border-[var(--border)]">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-2 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <s.icon className="w-7 h-7 text-[var(--accent)]" />
                <div className="text-3xl font-black text-[var(--accent)]">{s.value}</div>
                <div className="text-sm text-[var(--muted-foreground)]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-[var(--accent)] text-sm font-semibold flex items-center gap-2 mb-3">
                <span className="w-6 h-0.5 bg-[var(--accent)]" />
                داستان ما
              </div>
              <h2 className="text-3xl font-black text-[var(--foreground)] mb-5 leading-tight">
                از انبار کوچک تا تامین‌کننده بزرگ خراسان
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                قدیر لوله آنلاین مشهد در سال ۱۳۸۳ با هدف تامین لوله‌های با کیفیت برای پروژه‌های عمرانی مشهد تاسیس شد. در ابتدا با تمرکز بر لوله‌های PVC (پلیکا) فعالیت آغاز کردیم.
              </p>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-6">
                امروز با گسترش دامنه محصولات به لوله پلی‌اتیلن، چدن داکتیل، منهول، اتصالات و شیرآلات صنعتی، به یکی از بزرگ‌ترین عرضه‌کنندگان آب و فاضلاب در شمال‌شرق ایران تبدیل شده‌ایم.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {advantages.map((adv, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                    <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    {adv}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {values.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)] mb-1">{title}</h3>
                    <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-[var(--muted)]/30">
        <div className="container-main">
          <div className="text-center mb-10">
            <div className="text-[var(--accent)] text-sm font-semibold flex items-center justify-center gap-2 mb-2">
              <span className="w-6 h-0.5 bg-[var(--accent)]" />تیم ما<span className="w-6 h-0.5 bg-[var(--accent)]" />
            </div>
            <h2 className="text-3xl font-black text-[var(--foreground)]">متخصصان ما</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 border-2 border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-4 text-2xl font-black text-[var(--accent)]">
                  {member.name[0]}
                </div>
                <div className="font-bold text-[var(--foreground)]">{member.name}</div>
                <div className="text-[var(--accent)] text-sm mb-2">{member.role}</div>
                <div className="text-[var(--muted-foreground)] text-xs">{member.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm">
        <div className="container-main text-center">
          <h2 className="text-2xl font-black text-[var(--foreground)] mb-3">با ما در تماس باشید</h2>
          <p className="text-[var(--muted-foreground)] mb-6">برای استعلام قیمت و مشاوره رایگان با کارشناسان ما تماس بگیرید</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] font-bold hover:-translate-y-0.5 transition-all shadow-accent"
          >
            تماس با ما
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
