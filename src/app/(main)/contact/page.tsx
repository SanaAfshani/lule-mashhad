import type { Metadata } from 'next';
import {
  ContactPageClient,
  type ContactInfoItem,
} from '@/features/contact/ContactPageClient';
import { getSiteSettingsMap } from '@/shared/lib/data';

export const metadata: Metadata = {
  title: 'تماس با ما | لوله آنلاین مشهد',
  description: 'راه‌های ارتباط با لوله آنلاین مشهد — تلفن، ایمیل و فرم تماس',
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/\D/g, '')}`;
}

function whatsappFromMobile(mobile: string) {
  const digits = mobile.replace(/\D/g, '');
  if (!digits) return undefined;
  const normalized = digits.startsWith('98') ? digits : `98${digits.replace(/^0/, '')}`;
  return `https://wa.me/${normalized}`;
}

export default async function ContactPage() {
  const settings = await getSiteSettingsMap();

  const phone = settings.contact_phone || '051-12345678';
  const mobile = settings.contact_mobile || '0915-1234567';
  const email = settings.contact_email || 'info@luleonline-mashhad.ir';
  const address = settings.contact_address || 'مشهد، خیابان امام رضا، پلاک ۱۲۳';

  const contactInfo: ContactInfoItem[] = [
    {
      icon: 'phone',
      title: 'تلفن',
      items: [phone, mobile],
      href: phoneHref(phone),
      color: 'amber',
    },
    {
      icon: 'mail',
      title: 'ایمیل',
      items: [email],
      href: `mailto:${email}`,
      color: 'blue',
    },
    {
      icon: 'map',
      title: 'آدرس',
      items: [address],
      color: 'green',
    },
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
      whatsappUrl={whatsappFromMobile(mobile)}
    />
  );
}
