import type { Metadata } from 'next';
import {
  ContactPageClient,
  type ContactInfoItem,
} from '@/features/contact/ContactPageClient';
import { getSiteSettingsMap } from '@/shared/lib/data';
import { mergeSiteSettings } from '@/shared/lib/site-settings';

export const metadata: Metadata = {
  title: 'تماس با ما | لوله آنلاین مشهد',
  description: 'راه‌های ارتباط با لوله آنلاین مشهد — تلفن، ایمیل و فرم تماس',
};

export default async function ContactPage() {
  const raw = await getSiteSettingsMap();
  const settings = mergeSiteSettings(raw);

  const contactInfo: ContactInfoItem[] = [
    {
      icon: 'phone',
      title: 'تلفن',
      items: [settings.phone, settings.mobile],
      href: settings.phoneHref,
      color: 'amber',
    },
    {
      icon: 'mail',
      title: 'ایمیل',
      items: [settings.email],
      href: `mailto:${settings.email}`,
      color: 'blue',
    },
    // {
    //   icon: 'map',
    //   title: 'آدرس',
    //   items: [settings.address],
    //   color: 'green',
    // },
    {
      icon: 'clock',
      title: 'ساعت کاری',
      items: ['شنبه تا پنجشنبه: ۸ صبح تا ۶ عصر', 'جمعه: تعطیل'],
      color: 'purple',
    },
  ];

  return (
    <ContactPageClient
      contactInfo={contactInfo}
      whatsappUrl={settings.whatsappUrl}
    />
  );
}
