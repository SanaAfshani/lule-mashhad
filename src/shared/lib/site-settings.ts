import { siteConfig } from '@/shared/config/site';

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  phoneHref: string;
  mobileHref: string;
  whatsappUrl: string;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: siteConfig.name,
  siteDescription: siteConfig.description,
  phone: siteConfig.phone,
  mobile: siteConfig.mobile,
  email: siteConfig.email,
  address: siteConfig.address,
  heroTitle: 'تامین کامل لوله آب و فاضلاب',
  heroSubtitle:
    'عرضه‌کننده انواع لوله پلیکا، پلی‌اتیلن، چدن داکتیل، منهول و اتصالات آب و فاضلاب — تامین پروژه‌های شهری، صنعتی و کشاورزی در مشهد و سراسر ایران.',
  phoneHref: phoneHref(siteConfig.phone),
  mobileHref: phoneHref(siteConfig.mobile),
  whatsappUrl: whatsappFromMobile(siteConfig.mobile) ?? siteConfig.socials.whatsapp,
};

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/\D/g, '')}`;
}

export function whatsappFromMobile(mobile: string) {
  const digits = mobile.replace(/\D/g, '');
  if (!digits) return undefined;
  const normalized = digits.startsWith('98') ? digits : `98${digits.replace(/^0/, '')}`;
  return `https://wa.me/${normalized}`;
}

export function mergeSiteSettings(raw: Record<string, string>): SiteSettings {
  const phone = raw.contact_phone || defaultSiteSettings.phone;
  const mobile = raw.contact_mobile || defaultSiteSettings.mobile;

  return {
    siteName: raw.site_title || defaultSiteSettings.siteName,
    siteDescription: raw.site_description || defaultSiteSettings.siteDescription,
    phone,
    mobile,
    email: raw.contact_email || defaultSiteSettings.email,
    address: raw.contact_address || defaultSiteSettings.address,
    heroTitle: raw.hero_title || defaultSiteSettings.heroTitle,
    heroSubtitle: raw.hero_subtitle || defaultSiteSettings.heroSubtitle,
    phoneHref: phoneHref(phone),
    mobileHref: phoneHref(mobile),
    whatsappUrl: whatsappFromMobile(mobile) ?? defaultSiteSettings.whatsappUrl,
  };
}
