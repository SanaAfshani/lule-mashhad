'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Building2, ChevronDown, Clock, Factory, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useSiteSettings } from '@/shared/providers/SiteSettingsProvider';
import { siteConfig } from '@/shared/config/site';
import { phoneHref as toTel } from '@/shared/lib/site-settings';
import { faDigits } from '@/shared/lib/utils';
import type { NavCategory } from '@/shared/lib/data';

const QUICK_LINKS = [
  { href: '/prices', label: 'لیست قیمت روز' },
  { href: '/services', label: 'خدمات ما' },
  { href: '/blog', label: 'مجله تخصصی' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/contact', label: 'تماس با ما' },
];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      {/* موبایل: تاشو */}
      <details className="lg:hidden group border-b border-white/10">
        <summary className="flex items-center justify-between h-14 cursor-pointer list-none font-bold text-white">
          {title}
          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="pb-4">{children}</div>
      </details>
      {/* دسکتاپ */}
      <div className="hidden lg:block">
        <h3 className="font-bold text-white mb-5">{title}</h3>
        {children}
      </div>
    </>
  );
}

export function Footer({ categories }: { categories: NavCategory[] }) {
  const { siteName, siteDescription, phone, phoneHref, mobile, mobileHref, email, address, companyPhones, factoryAddress, mapUrl, whatsappUrl } = useSiteSettings();
  const year = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());

  const linkCls = 'block py-1.5 text-sm text-slate-400 hover:text-[var(--accent)] transition-colors';

  return (
    <footer className="relative mt-16 bg-[var(--ink)] text-slate-300 overflow-hidden pb-bottom-nav">
      <div className="absolute inset-0 bp-grid opacity-40" />
      {/* نوار هشدار صنعتی لبه بالای فوتر */}
      <div className="relative h-1.5 hazard opacity-90" aria-hidden />

      <div className="relative container-main pt-14 lg:pt-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-2 lg:gap-12">
          <div className="pb-6 lg:pb-0">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="" width={52} height={52} className="w-12 h-12 object-contain" />
              <span className="text-xl font-black text-white">{siteName}</span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-400 max-w-sm">{siteDescription}</p>
            <div className="mt-5 flex gap-2">
              <a href={whatsappUrl} target="_blank" rel="noopener" aria-label="واتس‌اپ" className="grid place-items-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#25D366] hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`mailto:${email}`} aria-label="ایمیل" className="grid place-items-center w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <Column title="دسته‌بندی محصولات">
            <ul>
              {categories.map((c) => (
                <li key={c.slug}><Link href={`/products/${c.slug}`} className={linkCls}>{c.name}</Link></li>
              ))}
            </ul>
          </Column>

          <Column title="دسترسی سریع">
            <ul>
              {QUICK_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </Column>

          <Column title="ارتباط با ما">
            <ul className="space-y-3 text-sm">
              <li>
                <a href={phoneHref} className="flex items-center gap-3 hover:text-white">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5"><Phone className="w-4 h-4 text-[var(--accent)]" /></span>
                  <span dir="ltr" className="num font-bold">{faDigits(phone)}</span>
                </a>
              </li>
              {mobile && mobile !== phone && (
                <li>
                  <a href={mobileHref} className="flex items-center gap-3 hover:text-white">
                    <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5"><Phone className="w-4 h-4 text-[var(--accent)]" /></span>
                    <span dir="ltr" className="num font-bold">{faDigits(mobile)}</span>
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5"><Clock className="w-4 h-4 text-[var(--accent)]" /></span>
                {siteConfig.workingHours}
              </li>
              {companyPhones.length > 0 && (
                <li className="flex items-start gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 shrink-0"><Phone className="w-4 h-4 text-[var(--accent)]" /></span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 pt-1.5">
                    {companyPhones.map((p) => (
                      <a key={p} href={toTel(p)} dir="ltr" className="num font-bold hover:text-white">{faDigits(p)}</a>
                    ))}
                  </span>
                </li>
              )}
              {address?.trim() && (
                <li className="flex items-start gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 shrink-0"><Building2 className="w-4 h-4 text-[var(--accent)]" /></span>
                  <span className="leading-7"><span className="block text-xs text-slate-500">دفتر مرکزی</span>{faDigits(address)}</span>
                </li>
              )}
              {factoryAddress?.trim() && (
                <li className="flex items-start gap-3">
                  <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 shrink-0"><Factory className="w-4 h-4 text-[var(--accent)]" /></span>
                  <span className="leading-7">
                    <span className="block text-xs text-slate-500">کارخانه و انبار</span>
                    {factoryAddress}
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline">
                      <MapPin className="w-3.5 h-3.5" /> مسیریابی روی نقشه
                    </a>
                  </span>
                </li>
              )}
            </ul>
          </Column>
        </div>

        <div className="mt-10 lg:mt-16 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© <span className="num">{year}</span> {siteName} — فروش آنلاین {siteConfig.legalName}. تمامی حقوق محفوظ است.</p>
          <nav aria-label="قوانین" className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">قوانین و شرایط خرید</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">حریم خصوصی</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
