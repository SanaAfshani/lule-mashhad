'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Phone, ShieldCheck, Truck, Clock, Award } from 'lucide-react';
import { useSiteSettings } from '@/shared/providers/SiteSettingsProvider';

const features = [
  { icon: ShieldCheck, label: 'کیفیت ISO تضمین‌شده' },
  { icon: Truck,       label: 'تحویل سراسر ایران' },
  { icon: Clock,       label: 'مشاوره فوری رایگان' },
  { icon: Award,       label: '۲۰+ سال تجربه' },
];

const stats = [
  { value: '+۵۰۰۰', label: 'نوع محصول' },
  { value: '+۵۰۰',  label: 'مشتری راضی' },
  { value: '+۲۰۰',  label: 'پروژه موفق' },
];

export function HeroSection() {
  const { phone, phoneHref, heroTitle, heroSubtitle } = useSiteSettings();

  return (
    <section className="home-hero relative flex items-center overflow-hidden bg-[var(--background)]">
      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-teal-50/30 dark:from-blue-950/20 dark:to-slate-900/50" />

        {/* Animated blobs */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/5 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-400/8 to-blue-400/6 blur-3xl"
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="container-main relative z-10 flex flex-col justify-center py-8 sm:py-12 lg:py-16 w-full min-h-0 sm:min-h-[calc(100svh-var(--nav-height))]">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 xl:gap-16 items-center">

          {/* Left (RTL: right) — Text */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Label badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 self-start px-3 py-1.5 sm:px-4 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs sm:text-sm font-semibold mb-4 sm:mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              تامین‌کننده تخصصی لوله آب و فاضلاب
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.6 }}
              className="text-[1.65rem] leading-[1.25] sm:text-4xl md:text-5xl xl:text-6xl font-black text-[var(--foreground)] mb-4 sm:mb-5"
            >
              {heroTitle}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="text-[var(--muted-foreground)] text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-7 max-w-[520px]"
            >
              {heroSubtitle}
            </motion.p>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.36 }}
              className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8"
            >
              {features.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)]"
                >
                  <Icon className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
                  {label}
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 sm:px-7 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 shadow-accent w-full sm:w-auto"
              >
                درخواست قیمت رایگان
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 rounded-xl border-2 border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                مشاهده محصولات
              </Link>
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-5 rounded-xl bg-[var(--muted)] text-[var(--foreground)] font-medium text-sm hover:bg-[var(--border)] transition-all duration-200 w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                {phone}
              </a>
            </motion.div>
          </motion.div>

          {/* Right (RTL: left) — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="relative p-5 sm:p-6">
              {/* Main illustration card */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/70 shadow-2xl shadow-black/30 aspect-[4/3] flex items-center justify-center p-8">
                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                  }}
                />
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-teal-500/8 blur-3xl" />

                {/* Pipe Network SVG */}
                <svg
                  viewBox="0 0 480 360"
                  fill="none"
                  className="w-full h-full max-w-[420px] relative z-10"
                >
                  <defs>
                    <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#64748B" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="pipeGradV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="50%" stopColor="#64748B" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" />
                      <stop offset="100%" stopColor="var(--accent-hover)" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* ── Horizontal main pipe ── */}
                  <rect x="40" y="150" width="400" height="56" rx="28" fill="url(#pipeGrad)" />
                  {/* Highlight top */}
                  <rect x="40" y="150" width="400" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
                  {/* Shadow bottom */}
                  <rect x="40" y="186" width="400" height="12" rx="6" fill="rgba(0,0,0,0.18)" />

                  {/* ── Vertical branch pipe ── */}
                  <rect x="210" y="40" width="56" height="116" rx="28" fill="url(#pipeGradV)" />
                  <rect x="210" y="40" width="12" height="116" rx="6" fill="rgba(255,255,255,0.08)" />

                  {/* ── Second vertical branch (right side) ── */}
                  <rect x="340" y="200" width="44" height="100" rx="22" fill="url(#pipeGradV)" />
                  <rect x="340" y="200" width="10" height="100" rx="5" fill="rgba(255,255,255,0.08)" />

                  {/* ── Flanges (accent color) ── */}
                  {/* Left flange */}
                  <rect x="32" y="138" width="20" height="80" rx="6" fill="url(#accentGrad)" />
                  {/* Right flange */}
                  <rect x="428" y="138" width="20" height="80" rx="6" fill="url(#accentGrad)" />
                  {/* Middle flange 1 */}
                  <rect x="148" y="144" width="12" height="68" rx="4" fill="#64748B" />
                  {/* Middle flange 2 */}
                  <rect x="316" y="144" width="12" height="68" rx="4" fill="#64748B" />
                  {/* Vertical top flange */}
                  <rect x="202" y="30" width="72" height="18" rx="6" fill="url(#accentGrad)" />

                  {/* ── Gate Valve body ── */}
                  <rect x="196" y="118" width="84" height="62" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
                  <rect x="200" y="122" width="76" height="8" rx="4" fill="#334155" />
                  {/* Valve stem */}
                  <rect x="226" y="78" width="24" height="46" rx="6" fill="#64748B" />
                  {/* Valve handwheel */}
                  <rect x="206" y="72" width="64" height="14" rx="5" fill="url(#accentGrad)" />
                  <circle cx="238" cy="79" r="4" fill="#FCD34D" />

                  {/* ── Bolts on left flange ── */}
                  {[150, 168, 186, 204].map((y, i) => (
                    <circle key={i} cx="42" cy={y} r="5" fill="url(#accentGrad)" />
                  ))}
                  {/* ── Bolts on right flange ── */}
                  {[150, 168, 186, 204].map((y, i) => (
                    <circle key={i} cx="438" cy={y} r="5" fill="url(#accentGrad)" />
                  ))}

                  {/* ── Water flow dots (animated would need CSS) ── */}
                  <circle cx="90"  cy="178" r="6" fill="#3B82F6" opacity="0.7" filter="url(#glow)" />
                  <circle cx="170" cy="178" r="5" fill="#06B6D4" opacity="0.6" />
                  <circle cx="300" cy="178" r="6" fill="#3B82F6" opacity="0.65" filter="url(#glow)" />
                  <circle cx="400" cy="178" r="5" fill="#06B6D4" opacity="0.5" />

                  {/* ── Spec labels ── */}
                  <rect x="60"  y="120" width="64" height="24" rx="6" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="0.7" />
                  <text x="92" y="135" fontSize="10" fill="#93C5FD" textAnchor="middle" fontFamily="Vazirmatn, Arial">DN 200</text>

                  <rect x="348" y="120" width="64" height="24" rx="6" fill="color-mix(in srgb, var(--accent) 18%, transparent)" stroke="var(--accent)" strokeWidth="0.7" />
                  <text x="380" y="135" fontSize="10" fill="#FCD34D" textAnchor="middle" fontFamily="Vazirmatn, Arial">PN 16</text>

                  {/* ── PE100 label on vertical pipe ── */}
                  <rect x="216" y="58" width="44" height="20" rx="5" fill="rgba(20,184,166,0.2)" stroke="#14B8A6" strokeWidth="0.7" />
                  <text x="238" y="71" fontSize="9" fill="#2DD4BF" textAnchor="middle" fontFamily="Vazirmatn, Arial">PE100</text>
                </svg>
              </div>

              {/* ── Floating stat cards ── */}
              {stats.map((stat, i) => {
                const positions = [
                  'absolute top-2 right-2 sm:top-3 sm:right-3',
                  'absolute bottom-2 left-2 sm:bottom-3 sm:left-3',
                  'absolute top-1/2 -translate-y-1/2 left-2 sm:left-3',
                ];
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.15, type: 'spring' }}
                    className={`${positions[i]} glass-card rounded-2xl px-4 py-3 m-1 shadow-xl shadow-black/12 z-10`}
                  >
                    <div className="text-xl font-black text-[var(--accent)] leading-none">{stat.value}</div>
                    <div className="text-[var(--muted-foreground)] text-xs mt-0.5 whitespace-nowrap">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
