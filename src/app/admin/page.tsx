'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package, FileText, MessageSquare, Building2, TrendingUp,
  TrendingDown, Eye, ArrowLeft,
} from 'lucide-react';

const stats = [
  { title: 'کل محصولات', value: '۵۲', sub: '+۳ این ماه', trend: 'up', icon: Package, color: 'amber', href: '/admin/products' },
  { title: 'مقالات منتشر شده', value: '۱۸', sub: '+۲ این هفته', trend: 'up', icon: FileText, color: 'blue', href: '/admin/blog' },
  { title: 'پیام‌های خوانده نشده', value: '۷', sub: '۳ تا اضطراری', trend: 'neutral', icon: MessageSquare, color: 'rose', href: '/admin/messages' },
  { title: 'پروژه‌های ثبت شده', value: '۱۵', sub: '+۱ این ماه', trend: 'up', icon: Building2, color: 'green', href: '/admin/projects' },
];

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-400',  ring: 'ring-amber-500/20' },
  blue:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   ring: 'ring-blue-500/20' },
  rose:   { bg: 'bg-rose-500/10',   text: 'text-rose-400',   ring: 'ring-rose-500/20' },
  green:  { bg: 'bg-green-500/10',  text: 'text-green-400',  ring: 'ring-green-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', ring: 'ring-purple-500/20' },
};

const recentMessages = [
  { id: 1, name: 'مهندس صادقی', subject: 'استعلام لوله پلیکا ۱۶۰', time: '۲ ساعت پیش', read: false, urgent: true },
  { id: 2, name: 'شرکت عمران پایدار', subject: 'سفارش لوله پلی اتیلن', time: '۴ ساعت پیش', read: false, urgent: false },
  { id: 3, name: 'مهندس رضایی', subject: 'استعلام منهول پلیمری', time: 'دیروز', read: true, urgent: false },
  { id: 4, name: 'اداره آب مشهد', subject: 'قرارداد تامین لوله فاضلاب', time: 'دیروز', read: true, urgent: false },
];

const recentActivity = [
  { text: 'محصول جدید "لوله پلیکا ۲۵۰" اضافه شد', time: '۱ ساعت پیش', type: 'add' },
  { text: 'مقاله "مقایسه لوله پلیکا و پلی اتیلن" منتشر شد', time: '۳ ساعت پیش', type: 'publish' },
  { text: 'پیام جدید از شرکت عمران پایدار', time: '۴ ساعت پیش', type: 'message' },
  { text: 'دسته‌بندی "لوله آب‌رسانی" به‌روز شد', time: 'دیروز', type: 'edit' },
  { text: 'پروژه "شبکه آب رسانی رضوی" اضافه شد', time: 'دیروز', type: 'add' },
];

const quickActions = [
  { href: '/admin/products/new', label: 'محصول جدید', icon: Package, color: 'amber' },
  { href: '/admin/blog/new', label: 'مقاله جدید', icon: FileText, color: 'blue' },
  { href: '/admin/projects/new', label: 'پروژه جدید', icon: Building2, color: 'green' },
  { href: '/admin/messages', label: 'مشاهده پیام‌ها', icon: MessageSquare, color: 'rose' },
];

const weeklyData = [40, 65, 45, 80, 55, 90, 72];
const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">داشبورد</h1>
          <p className="text-slate-500 text-sm mt-0.5">خوش آمدید! وضعیت کلی سایت را مشاهده کنید.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm transition-colors"
        >
          <Eye className="w-4 h-4" />
          مشاهده سایت
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const colors = colorMap[stat.color];
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={stat.href}
                className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                  {stat.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                </div>
                <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                <div className="text-slate-500 text-xs">{stat.title}</div>
                <div className="text-slate-600 text-xs mt-1">{stat.sub}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Weekly visits chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">بازدیدهای هفتگی</h2>
            <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">۷ روز گذشته</span>
          </div>
          {mounted && (
            <div className="flex items-end gap-3 h-32">
              {weeklyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '96px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: i * 0.05 + 0.4, duration: 0.5 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 to-amber-400 relative group cursor-pointer"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {val * 12} بازدید
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-slate-600 text-xs">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="font-semibold text-white mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((action) => {
              const colors = colorMap[action.color];
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all group text-center"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-slate-400 text-xs font-medium group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Recent messages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">آخرین پیام‌ها</h2>
            <Link
              href="/admin/messages"
              className="text-amber-400 hover:text-amber-300 text-xs transition-colors flex items-center gap-1"
            >
              مشاهده همه <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentMessages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.45 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${!msg.read ? 'bg-amber-400' : 'bg-slate-700'}`}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${!msg.read ? 'text-white' : 'text-slate-400'}`}>
                    {msg.name}
                  </div>
                  <div className="text-slate-500 text-xs truncate">{msg.subject}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {msg.urgent && (
                    <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">
                      فوری
                    </span>
                  )}
                  <span className="text-slate-600 text-xs">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="font-semibold text-white mb-4">فعالیت‌های اخیر</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'add'
                      ? 'bg-green-400'
                      : activity.type === 'publish'
                        ? 'bg-blue-400'
                        : activity.type === 'message'
                          ? 'bg-amber-400'
                          : 'bg-slate-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs leading-relaxed">{activity.text}</p>
                  <span className="text-slate-600 text-xs">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
