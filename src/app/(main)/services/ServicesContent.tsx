'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, HeadphonesIcon, Wrench, FileText, Shield, Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import { PageHero } from '@/shared/ui/PageHero';

const services = [
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: 'مشاوره تخصصی رایگان',
    desc: 'کارشناسان فنی ما با بیش از ۲۰ سال تجربه، آماده ارائه مشاوره رایگان در انتخاب مناسب‌ترین لوله و اتصالات برای پروژه شما هستند.',
    features: ['مشاوره تلفنی رایگان', 'بررسی مدارک فنی', 'پیشنهاد بهینه محصول', 'محاسبه نیاز پروژه'],
    color: 'amber',
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'خدمات برش و تبدیل',
    desc: 'برش لوله در ابعاد و اندازه‌های دلخواه با تجهیزات پیشرفته CNC. دقت بالا و کیفیت برش تضمین شده.',
    features: ['برش با دقت بالا', 'تجهیزات CNC', 'ابعاد سفارشی', 'صدور گواهینامه'],
    color: 'green',
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'مستندات فنی',
    desc: 'ارائه آنالیز مواد، گواهینامه کیفیت Mill Certificate، تست‌های فنی و سایر مستندات مورد نیاز پروژه.',
    features: ['Mill Certificate', 'آنالیز شیمیایی', 'گواهی کیفیت', 'تست هیدرواستاتیک'],
    color: 'purple',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'گارانتی و پشتیبانی',
    desc: 'تضمین کیفیت تمامی محصولات و خدمات پس از فروش. در صورت عدم تطابق با مشخصات، تعویض یا استرداد وجه.',
    features: ['گارانتی کیفیت', 'خدمات پس از فروش', 'امکان مرجوعی', 'پشتیبانی ۲۴ ساعته'],
    color: 'red',
  },
];

const colorMap: Record<string, string> = {
  amber: 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  green: 'bg-green-500/10 text-green-500 border-green-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

export function ServicesContent() {
  return (
    <>
      <PageHero
        label="خدمات ما"
        title="خدمات جامع آب و فاضلاب"
        description="از مشاوره تخصصی تا تحویل درب کارگاه — همه مراحل را با تیم ما طی کنید"
      />

      <section className="section-padding">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border ${colorMap[service.color]}`}>
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{service.title}</h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-4">{service.desc}</p>
                <div className="space-y-2">
                  {service.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-sm bg-[var(--muted)]/30">
        <div className="container-main text-center">
          <h2 className="text-2xl font-black text-[var(--foreground)] mb-3">برای مشاوره رایگان تماس بگیرید</h2>
          <p className="text-[var(--muted-foreground)] mb-6">تیم کارشناسان ما شنبه تا پنجشنبه آماده پاسخگویی هستند</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] font-bold hover:-translate-y-0.5 transition-all shadow-accent"
          >
            درخواست مشاوره رایگان
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
