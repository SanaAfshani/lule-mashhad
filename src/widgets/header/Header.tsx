'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, Sun, Moon, Phone, ChevronDown, MessageCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/shared/lib/utils';

type NavCategory = { href: string; label: string; icon: string };

const defaultCategories: NavCategory[] = [
  { href: '/products/pvc-pipes', label: 'لوله پلیکا (PVC)', icon: '💧' },
  { href: '/products/polyethylene-pipes', label: 'لوله پلی‌اتیلن', icon: '🔵' },
  { href: '/products/cast-iron-pipes', label: 'لوله چدن داکتیل', icon: '⚙️' },
  { href: '/products/manholes', label: 'منهول و دریچه', icon: '🔩' },
  { href: '/products/fittings', label: 'اتصالات آب و فاضلاب', icon: '🔧' },
  { href: '/products/valves', label: 'شیرآلات صنعتی', icon: '🚰' },
];

const baseNavItems = [
  { href: '/', label: 'خانه' },
  {
    href: '/products',
    label: 'محصولات',
    mega: true as const,
  },
  { href: '/services', label: 'خدمات' },
  { href: '/blog',     label: 'وبلاگ' },
  { href: '/about',    label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [productCategories, setProductCategories] = useState<NavCategory[]>(defaultCategories);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = baseNavItems.map((item) =>
    'mega' in item && item.mega
      ? { ...item, categories: productCategories }
      : item,
  );

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProductCategories(
            json.data.map((c: { slug: string; name: string; icon?: string | null }) => ({
              href: `/products/${c.slug}`,
              label: c.name,
              icon: c.icon || '📦',
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ─── Main Header ─── */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[var(--background)]/95 backdrop-blur-xl shadow-sm shadow-black/8 border-b border-[var(--border)]'
            : 'bg-[var(--background)]/80 backdrop-blur-md'
        )}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-[var(--nav-height)] gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-md shadow-[var(--accent)]/30 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h14M3 5h14M3 15h14" strokeLinecap="round"/>
                  <circle cx="7" cy="5" r="1.5" fill="white" stroke="none"/>
                  <circle cx="13" cy="15" r="1.5" fill="white" stroke="none"/>
                </svg>
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm sm:text-base text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  لوله آنلاین مشهد
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)] hidden sm:block">
                  تامین‌کننده لوله آب و فاضلاب
                </div>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.mega ? (
                    <button
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                      className={cn(
                        'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                        'hover:text-[var(--accent)] hover:bg-[var(--accent)]/8',
                        pathname.startsWith('/products')
                          ? 'text-[var(--accent)] bg-[var(--accent)]/8'
                          : 'text-[var(--foreground)]'
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', megaOpen && 'rotate-180')} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-3.5 py-2 rounded-lg text-sm font-medium transition-all',
                        'hover:text-[var(--accent)] hover:bg-[var(--accent)]/8',
                        pathname === item.href
                          ? 'text-[var(--accent)] bg-[var(--accent)]/8'
                          : 'text-[var(--foreground)]'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Mega Menu */}
                  {item.mega && (
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          onMouseEnter={() => setMegaOpen(true)}
                          onMouseLeave={() => setMegaOpen(false)}
                          className="absolute top-[calc(100%+8px)] right-0 w-72 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/12 p-3 z-50"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            {item.categories?.map((cat) => (
                              <Link
                                key={cat.href}
                                href={cat.href}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[var(--accent)]/8 hover:text-[var(--accent)] transition-all group"
                              >
                                <span className="text-lg leading-none">{cat.icon}</span>
                                <span className="text-xs font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] leading-snug">
                                  {cat.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-[var(--border)]">
                            <Link
                              href="/products"
                              className="flex items-center justify-center w-full py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                              مشاهده همه محصولات
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Actions ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Phone — lg+ */}
              <a
                href="tel:05112345678"
                className="hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/8 transition-all font-mono"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xl:inline">051-12345678</span>
              </a>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="جستجو"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--accent)] transition-all"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  aria-label="تغییر تم"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--accent)] transition-all"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}

              {/* CTA button — sm+ */}
              <Link
                href="/contact"
                className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-semibold hover:opacity-90 transition-all hover:-translate-y-px shadow-md shadow-[var(--accent)]/25"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>استعلام قیمت</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="منو"
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="m" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                      <Menu className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[var(--card)] z-50 lg:hidden border-l border-[var(--border)] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-[var(--nav-height)] border-b border-[var(--border)] flex-shrink-0">
                <span className="font-bold text-[var(--foreground)]">لوله آنلاین مشهد</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-4 py-3.5 rounded-xl text-base sm:text-sm font-medium transition-all min-h-[44px]',
                        pathname === item.href || (item.mega && pathname.startsWith('/products'))
                          ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                          : 'text-[var(--foreground)] hover:bg-[var(--muted)]'
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.mega && (
                      <div className="mr-4 mt-0.5 mb-1 space-y-0.5">
                        {item.categories?.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--muted)] transition-all"
                          >
                            <span className="text-base">{cat.icon}</span>
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="p-4 border-t border-[var(--border)] space-y-2.5 flex-shrink-0">
                <a
                  href="tel:05112345678"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--muted)] text-[var(--foreground)] text-sm"
                >
                  <Phone className="w-4 h-4 text-[var(--accent)]" />
                  051-12345678
                </a>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  استعلام قیمت
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Search Overlay ─── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-0 inset-x-0 z-50 bg-[var(--card)] border-b border-[var(--border)] shadow-2xl"
            >
              <div className="container-main py-5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                        }
                        if (e.key === 'Escape') setSearchOpen(false);
                      }}
                      placeholder="جستجو در محصولات، مقالات و ..."
                      className="w-full h-13 bg-[var(--muted)] rounded-2xl pr-12 pl-4 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none text-base"
                    />
                  </div>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="w-13 h-13 rounded-2xl flex items-center justify-center bg-[var(--muted)] hover:bg-[var(--accent)] hover:text-white text-[var(--foreground)] transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-[var(--muted-foreground)] ml-1">جستجوهای رایج:</span>
                  {['لوله پلیکا', 'پلی اتیلن', 'منهول', 'شیرآلات', 'اتصالات'].map((term) => (
                    <button
                      key={term}
                      onClick={() => { window.location.href = `/search?q=${encodeURIComponent(term)}`; }}
                      className="text-xs px-3 py-1.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Floating Action Buttons ─── */}
      <div className="fixed left-3 sm:left-4 bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6 z-40 flex flex-col gap-2.5">
        <motion.a
          href="https://wa.me/989151234567"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          aria-label="واتساپ"
          className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40 hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.759.459 3.411 1.265 4.845L2 22l5.293-1.254A9.937 9.937 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>
        </motion.a>
        <motion.a
          href="tel:05112345678"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, type: 'spring' }}
          aria-label="تماس"
          className="w-11 h-11 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/40 hover:scale-110 transition-transform"
        >
          <Phone className="w-4.5 h-4.5 text-white" />
        </motion.a>
      </div>
    </>
  );
}
