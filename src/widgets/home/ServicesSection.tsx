'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Truck, HeadphonesIcon, Wrench, FileText, ShieldCheck, Zap } from 'lucide-react';

const services = [
  {
    icon: HeadphonesIcon,
    title: 'مشاوره تخصصی رایگان',
    desc: 'کارشناسان با بیش از ۲۰ سال تجربه در انتخاب لوله و اتصالات مناسب برای هر پروژه راهنمایی می‌کنند.',
    color: 'amber',
  },
  {
    icon: Truck,
    title: 'تحویل سراسر ایران',
    desc: 'ارسال به تمام استان‌ها با بسته‌بندی ایمن. برای پروژه‌های بزرگ، حمل با ماشین‌آلات اختصاصی.',
    color: 'blue',
  },
  {
    icon: Wrench,
    title: 'برش و سایزبندی',
    desc: 'برش لوله در هر اندازه با دقت بالا. سرویس قلاف‌کاری (Chamfering) برای اتصال مناسب.',
    color: 'green',
  },
  {
    icon: FileText,
    title: 'گواهینامه کیفیت',
    desc: 'ارائه تمام گواهینامه‌های کیفی (ISIRI, ISO, EN) و برگه آزمایش کارخانه برای همه محصولات.',
    color: 'purple',
  },
  {
    icon: ShieldCheck,
    title: 'ضمانت اصالت کالا',
    desc: 'تمام محصولات مستقیم از کارخانه‌های معتبر ایرانی و خارجی تأمین می‌شوند.',
    color: 'teal',
  },
  {
    icon: Zap,
    title: 'تامین فوری',
    desc: 'برای پروژه‌های اورژانسی، موجودی انبار ما آماده تحویل فوری است. ۲۴ ساعت پشتیبانی.',
    color: 'rose',
  },
];

const colorMap: Record<string, string> = {
  amber:  'bg-[var(--accent)]/10  text-[var(--accent)]',
  blue:   'bg-blue-500/10   text-blue-500',
  green:  'bg-green-500/10  text-green-500',
  purple: 'bg-purple-500/10 text-purple-500',
  teal:   'bg-teal-500/10   text-teal-500',
  rose:   'bg-rose-500/10   text-rose-500',
};

export function ServicesSection() {
  return (
    <section className="home-section">
      <div className="container-main">
        <SectionHeading
          label="خدمات ما"
          title="چرا لوله آنلاین مشهد؟"
          description="فراتر از فروش محصول، خدمات جامعی ارائه می‌دهیم تا پروژه شما با کمترین دغدغه پیش برود"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group p-7 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-2">{title}</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
