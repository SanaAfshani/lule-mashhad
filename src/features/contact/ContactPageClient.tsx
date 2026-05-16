'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, type LucideIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHero } from '@/shared/ui/PageHero';

export type ContactInfoItem = {
  icon: 'phone' | 'mail' | 'map' | 'clock';
  title: string;
  items: string[];
  href?: string;
  color: string;
};

const iconMap: Record<ContactInfoItem['icon'], LucideIcon> = {
  phone: Phone,
  mail: Mail,
  map: MapPin,
  clock: Clock,
};

const colorMap: Record<string, string> = {
  amber: 'bg-[var(--accent)]/10  text-[var(--accent)]',
  blue: 'bg-blue-500/10   text-blue-400',
  green: 'bg-green-500/10  text-green-500',
  purple: 'bg-purple-500/10 text-purple-400',
};

type Props = {
  contactInfo: ContactInfoItem[];
  whatsappUrl?: string;
};

export function ContactPageClient({ contactInfo, whatsappUrl }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('لطفاً نام و پیام خود را وارد کنید');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || 'ارسال پیام با خطا مواجه شد');
        return;
      }
      toast.success(data.message || 'پیام شما ارسال شد! به‌زودی با شما تماس می‌گیریم.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const field = (
    id: keyof typeof form,
    label: string,
    placeholder: string,
    type = 'text',
  ) => (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">{label}</label>
      <input
        type={type}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        placeholder={placeholder}
        className="input-base"
      />
    </div>
  );

  return (
    <>
      <PageHero
        label="تماس با ما"
        title="با ما در تماس باشید"
        description="تیم کارشناسی ما آماده پاسخگویی به سوالات فنی و استعلام قیمت شما است"
      />

      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map(({ icon, title, items, href, color }, i) => {
                const Icon = iconMap[icon];
                return (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--foreground)] mb-1">{title}</div>
                      {items.map((item) =>
                        href ? (
                          <a
                            key={item}
                            href={href}
                            className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
                          >
                            {item}
                          </a>
                        ) : (
                          <div key={item} className="text-sm text-[var(--muted-foreground)]">
                            {item}
                          </div>
                        ),
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-5 rounded-2xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-green-500 text-sm">واتساپ</div>
                    <div className="text-[var(--muted-foreground)] text-xs">پاسخ سریع در واتساپ</div>
                  </div>
                </a>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">ارسال پیام</h2>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  {field('name', 'نام و نام‌خانوادگی *', 'نام کامل شما')}
                  {field('phone', 'شماره موبایل', '09xxxxxxxxx', 'tel')}
                </div>
                {field('email', 'ایمیل', 'example@email.com', 'email')}
                {field('subject', 'موضوع', 'مثلاً: استعلام لوله پلیکا ۱۶۰')}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                    پیام *
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="پیام یا سوال خود را بنویسید..."
                    className="input-base resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-accent disabled:opacity-60"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? 'در حال ارسال...' : 'ارسال پیام'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
