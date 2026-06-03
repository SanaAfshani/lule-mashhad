'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Layers, FileText, HelpCircle,
  Star, Building2, MessageSquare, Settings, Users, LogOut,
  Menu, X, Palette, ChevronLeft, Globe,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import toast from 'react-hot-toast';

const navGroups = [
  {
    label: 'داشبورد',
    items: [
      { href: '/admin', label: 'داشبورد', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'محتوا',
    items: [
      { href: '/admin/products', label: 'محصولات', icon: Package },
      { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: Layers },
      { href: '/admin/blog', label: 'وبلاگ', icon: FileText },
      { href: '/admin/projects', label: 'پروژه‌ها', icon: Building2 },
    ],
  },
  {
    label: 'مدیریت',
    items: [
      { href: '/admin/messages', label: 'پیام‌ها', icon: MessageSquare },
      { href: '/admin/testimonials', label: 'نظرات', icon: Star },
      { href: '/admin/faq', label: 'سوالات متداول', icon: HelpCircle },
      { href: '/admin/users', label: 'کاربران', icon: Users },
    ],
  },
  {
    label: 'تنظیمات',
    items: [
      { href: '/admin/theme', label: 'رنگ‌بندی سایت', icon: Palette },
      { href: '/admin/settings', label: 'تنظیمات عمومی', icon: Settings },
    ],
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        collapsed ? 'justify-center px-2' : '',
        active
          ? 'bg-amber-500/15 text-amber-400'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white',
      )}
    >
      {active && (
        <motion.span
          layoutId="activeNav"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-amber-400"
        />
      )}
      <Icon
        className={cn(
          'flex-shrink-0 transition-colors',
          active ? 'text-amber-400' : 'text-slate-500 group-hover:text-white',
          collapsed ? 'w-5 h-5' : 'w-4 h-4',
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && active && (
        <ChevronLeft className="w-3.5 h-3.5 mr-auto text-amber-400/60" />
      )}

      {collapsed && (
        <div className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 shadow-lg z-50">
          {label}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
        </div>
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
    toast.success('با موفقیت خارج شدید');
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800/80">
      {/* Logo + Toggle */}
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-slate-800/80 flex-shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white text-sm truncate">لوله آنلاین </div>
              <div className="text-slate-500 text-xs">پنل مدیریت</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 rounded-lg items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all flex-shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} {...item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div
        className={cn(
          'p-3 border-t border-slate-800/80 space-y-0.5',
          collapsed && 'flex flex-col items-center',
        )}
      >
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-950/60 hover:text-red-400 transition-all w-full',
            collapsed && 'justify-center px-2 w-auto',
          )}
          title={collapsed ? 'خروج' : undefined}
        >
          <LogOut className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
          {!collapsed && 'خروج از حساب'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.div
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:block fixed right-0 top-0 bottom-0 z-30 overflow-hidden"
      >
        <SidebarContent />
      </motion.div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-lg"
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="m"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-64 z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
