'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SETTINGS_KEYS = {
  siteName: 'site_title',
  siteDescription: 'site_description',
  phone: 'contact_phone',
  mobile: 'contact_mobile',
  email: 'contact_email',
  address: 'contact_address',
  heroTitle: 'hero_title',
  heroSubtitle: 'hero_subtitle',
} as const;

type SettingsForm = {
  siteName: string;
  siteDescription: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
};

const emptySettings: SettingsForm = {
  siteName: '',
  siteDescription: '',
  phone: '',
  mobile: '',
  email: '',
  address: '',
  heroTitle: '',
  heroSubtitle: '',
};

const inputCls =
  'w-full h-11 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white placeholder:text-slate-500 focus:outline-none transition-colors';

function SettingsField({
  label,
  type = 'text',
  icon,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} ${icon ? 'pr-10' : ''}`}
        />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings');
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data as Record<string, string>;
          setSettings({
            siteName: data.site_title ?? '',
            siteDescription: data.site_description ?? '',
            phone: data.contact_phone ?? '',
            mobile: data.contact_mobile ?? '',
            email: data.contact_email ?? '',
            address: data.contact_address ?? '',
            heroTitle: data.hero_title ?? '',
            heroSubtitle: data.hero_subtitle ?? '',
          });
        } else {
          toast.error(json.error || 'بارگذاری تنظیمات ناموفق بود');
        }
      } catch {
        toast.error('خطا در ارتباط با سرور');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateField = (fieldKey: keyof SettingsForm) => (value: string) => {
    setSettings((s) => ({ ...s, [fieldKey]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, string> = {};
    (Object.entries(SETTINGS_KEYS) as [keyof SettingsForm, string][]).forEach(([formKey, dbKey]) => {
      payload[dbKey] = settings[formKey];
    });

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.error || 'ذخیره تنظیمات ناموفق بود');
        return;
      }

      toast.success('تنظیمات ذخیره شد!');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        بارگذاری تنظیمات...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">تنظیمات سایت</h1>
        <p className="text-slate-400 text-sm mt-1">اطلاعات عمومی سایت را ویرایش کنید</p>
      </div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-bold flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            اطلاعات عمومی
          </h2>
          <SettingsField label="نام سایت" value={settings.siteName} onChange={updateField('siteName')} />
          <SettingsField label="توضیحات سایت" value={settings.siteDescription} onChange={updateField('siteDescription')} />
          <SettingsField label="عنوان هیرو (صفحه اصلی)" value={settings.heroTitle} onChange={updateField('heroTitle')} />
          <SettingsField label="زیرعنوان هیرو" value={settings.heroSubtitle} onChange={updateField('heroSubtitle')} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-bold flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-400" />
            اطلاعات تماس
          </h2>
          <SettingsField label="تلفن" type="tel" icon={<Phone className="w-4 h-4" />} value={settings.phone} onChange={updateField('phone')} />
          <SettingsField label="موبایل" type="tel" icon={<Phone className="w-4 h-4" />} value={settings.mobile} onChange={updateField('mobile')} />
          <SettingsField label="ایمیل" type="email" icon={<Mail className="w-4 h-4" />} value={settings.email} onChange={updateField('email')} />
          <SettingsField label="آدرس" icon={<MapPin className="w-4 h-4" />} value={settings.address} onChange={updateField('address')} />
        </motion.div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          ذخیره تنظیمات
        </button>
      </div>
    </div>
  );
}
