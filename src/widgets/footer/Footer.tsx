'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useSiteSettings } from '@/shared/providers/SiteSettingsProvider';

const footerLinks = {
  company: {
    title: 'شرکت',
    links: [
      { href: '/about', label: 'درباره ما' },
      { href: '/services', label: 'خدمات ما' },
      { href: '/projects', label: 'پروژه‌ها' },
      { href: '/blog', label: 'وبلاگ' },
      { href: '/faq', label: 'سوالات متداول' },
    ],
  },
  products: {
    title: 'محصولات',
    links: [
      { href: '/categories', label: 'همه دسته‌بندی‌ها' },
      { href: '/products', label: 'کاتالوگ محصولات' },
      { href: '/products/pvc-pipes',          label: 'لوله پلیکا (PVC)' },
      { href: '/products/polyethylene-pipes', label: 'لوله پلی اتیلن' },
      { href: '/products/cast-iron-pipes',    label: 'لوله چدن داکتیل' },
      { href: '/products/manholes',           label: 'منهول و دریچه' },
      { href: '/products/fittings',           label: 'اتصالات' },
    ],
  },
  support: {
    title: 'پشتیبانی',
    links: [
      { href: '/contact', label: 'تماس با ما' },
      { href: '/faq', label: 'راهنمای خرید' },
      { href: '/search', label: 'جستجو' },
    ],
  },
};

export function Footer() {
  const { siteName, siteDescription, phone, phoneHref, email, address, whatsappUrl } = useSiteSettings();

  return (
    <footer className="surface-dark bg-[#060B14] dark:bg-[#040810] text-white">
      {/* Main Footer */}
      <div className="container-main py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-accent">
                <img src={'/images/logo.png'} />
              </div>
              <div>
                <div className="font-bold text-xl text-white leading-tight">{siteName}</div>
                <div className="text-xs text-slate-300">عرضه کننده لوله های دوجداره اتصالات صنعتی</div>
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xs">
              {siteDescription}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href={phoneHref} className="flex items-center gap-3 text-sm text-slate-300 hover:text-[var(--accent)] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-[var(--accent-hover)]/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-[var(--accent)] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-[var(--accent-hover)]/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                {email}
              </a>
              {/*<div className="flex items-start gap-3 text-sm text-slate-300">*/}
              {/*  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mt-0.5 flex-shrink-0">*/}
              {/*    <MapPin className="w-4 h-4" />*/}
              {/*  </div>*/}
              {/*  {address}*/}
              {/*</div>*/}
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                شنبه تا پنجشنبه: ۸ صبح تا ۶ عصر
              </div>
            </div>

            {/* Socials */}
            {/*<div className="flex items-center gap-3 mt-6">*/}
            {/*  {[*/}
            {/*    // {*/}
            {/*    //   href: 'https://instagram.com/luleonlinemashhad',*/}
            {/*    //   icon: (*/}
            {/*    //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">*/}
            {/*    //       <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>*/}
            {/*    //       <circle cx="12" cy="12" r="4"/>*/}
            {/*    //       <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>*/}
            {/*    //     </svg>*/}
            {/*    //   ),*/}
            {/*    //   label: 'اینستاگرام'*/}
            {/*    // },*/}
            {/*    // {*/}
            {/*    //   href: 'https://t.me/luleonlinemashhad',*/}
            {/*    //   icon: <Send className="w-4 h-4" />,*/}
            {/*    //   label: 'تلگرام'*/}
            {/*    // },*/}
            {/*    // {*/}
            {/*    //   href: whatsappUrl,*/}
            {/*    //   icon: (*/}
            {/*    //       <Send className="w-4 h-4" />*/}
            {/*    //   ),*/}
            {/*    //   label: 'واتساپ'*/}
            {/*    // },*/}
            {/*    // {*/}
            {/*    //   href: 'https://linkedin.com/company/luleonlinemashhad',*/}
            {/*    //   icon: (*/}
            {/*    //     <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">*/}
            {/*    //       <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>*/}
            {/*    //       <circle cx="4" cy="4" r="2"/>*/}
            {/*    //     </svg>*/}
            {/*    //   ),*/}
            {/*    //   label: 'لینکدین'*/}
            {/*    // },*/}
            {/*  ].map((social) => (*/}
            {/*    <a*/}
            {/*      key={social.href}*/}
            {/*      href={social.href}*/}
            {/*      target="_blank"*/}
            {/*      rel="noopener noreferrer"*/}
            {/*      aria-label={social.label}*/}
            {/*      className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-[var(--accent-hover)] hover:text-white transition-all duration-300 hover:-translate-y-0.5"*/}
            {/*    >*/}
            {/*      {social.icon}*/}
            {/*    </a>*/}
            {/*  ))}*/}
            {/*</div>*/}
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-[var(--accent)] transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-[var(--accent-hover)] transition-colors flex-shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-white mb-1">خبرنامه ما</h4>
              <p className="text-sm text-slate-300">برای دریافت آخرین اخبار و قیمت‌ها عضو شوید</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="آدرس ایمیل شما"
                className="flex-1 md:w-64 h-11 bg-slate-800 border border-slate-700 rounded-xl px-4 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors flex-shrink-0"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-main py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
            <p>© ۱۴۰۳ لوله آنلاین مشهد. تمامی حقوق محفوظ است.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">حریم خصوصی</Link>
              <Link href="/terms" className="hover:text-[var(--accent)] transition-colors">قوانین استفاده</Link>
              <Link href="/sitemap.xml" className="hover:text-[var(--accent)] transition-colors">نقشه سایت</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
