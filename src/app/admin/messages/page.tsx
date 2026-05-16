'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, MailOpen, Trash2, Phone, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/shared/lib/utils';

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      } else {
        toast.error(json.error || 'بارگذاری پیام‌ها ناموفق بود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filtered = messages.filter(
    (m) =>
      m.name.includes(search) ||
      (m.subject && m.subject.includes(search)),
  );
  const selectedMsg = messages.find((m) => m.id === selected);

  const markRead = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg || msg.read) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read: true } : m)));
      }
    } catch {
      /* silent */
    }
  };

  const handleSelect = (id: string) => {
    setSelected(id);
    markRead(id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این پیام حذف شود؟')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'حذف ناموفق بود');
        return;
      }

      toast.success('پیام حذف شد');
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected === id) setSelected(null);
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        بارگذاری پیام‌ها...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">پیام‌های ورودی</h1>
        <p className="text-slate-400 text-sm mt-1">
          {messages.filter((m) => !m.read).length} پیام خوانده نشده
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو..."
              className="w-full h-10 bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-3 text-white placeholder:text-slate-500 focus:outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((msg, i) => (
              <motion.button
                key={msg.id}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(msg.id)}
                className={`w-full text-right p-4 rounded-xl border transition-all ${
                  selected === msg.id
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                      <span className={`text-sm font-medium ${!msg.read ? 'text-white' : 'text-slate-300'}`}>
                        {msg.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{msg.subject || 'بدون موضوع'}</div>
                  </div>
                  <div className="text-xs text-slate-600 flex-shrink-0">{formatDate(msg.createdAt)}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {selectedMsg ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg">{selectedMsg.subject || 'بدون موضوع'}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span>{selectedMsg.name}</span>
                    {selectedMsg.email && (
                      <a href={`mailto:${selectedMsg.email}`} className="hover:text-amber-400 transition-colors">
                        {selectedMsg.email}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{formatDate(selectedMsg.createdAt)}</span>
              </div>

              <div className="bg-slate-800 rounded-xl p-4 text-slate-300 text-sm leading-relaxed mb-6">
                {selectedMsg.message}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {selectedMsg.phone && (
                  <a
                    href={`tel:${selectedMsg.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-sm hover:bg-green-500/20 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedMsg.phone}
                  </a>
                )}
                {selectedMsg.email && (
                  <a
                    href={`mailto:${selectedMsg.email}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm hover:bg-amber-500/20 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    پاسخ دادن
                  </a>
                )}
                <button
                  type="button"
                  disabled={deletingId === selectedMsg.id}
                  onClick={() => handleDelete(selectedMsg.id)}
                  className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {deletingId === selectedMsg.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <MailOpen className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-slate-500">یک پیام را برای مشاهده انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
