import { siteConfig } from '@/shared/config/site';
import type { SiteSettings } from '@/shared/lib/site-settings';

/** حذف تگ‌های HTML و کوتاه‌سازی برای meta description */
export function toMetaDescription(input: string | null | undefined, max = 158): string {
  if (!input) return siteConfig.description;
  const text = input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function absoluteUrl(path: string): string {
  if (!path) return siteConfig.url;
  if (path.startsWith('http')) return path;
  return `${siteConfig.url}${path.startsWith('/') ? '' : '/'}${path}`;
}

type Crumb = { name: string; path: string };

/**
 * BreadcrumbList — گوگل مسیر صفحه را به جای URL خام در نتایج نشان می‌دهد.
 * همیشه با «خانه» شروع می‌شود.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  const items = [{ name: 'خانه', path: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** FAQPage — واجد شرایط rich result آکاردئونی در نتایج گوگل */
export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
      },
    })),
  };
}

/** WebSite + SearchAction — شرط لازم برای sitelinks searchbox */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    inLanguage: 'fa-IR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** شماره به فرمت بین‌المللی برای schema: 02186038220 → +982186038220 */
function e164(phone: string) {
  const d = phone.replace(/[۰-۹]/g, (x) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(x))).replace(/\D/g, '');
  return d.startsWith('98') ? `+${d}` : `+98${d.replace(/^0/, '')}`;
}

type ContactSettings = Pick<SiteSettings, 'phone' | 'mobile' | 'email' | 'address' | 'companyPhones' | 'factoryAddress' | 'mapUrl'>;

const officeAddress = (s: ContactSettings) => ({
  '@type': 'PostalAddress',
  streetAddress: s.address,
  addressLocality: siteConfig.office.city,
  addressRegion: siteConfig.office.region,
  addressCountry: 'IR',
});

const factoryPlace = (s: ContactSettings) => ({
  '@type': 'Place',
  name: `کارخانه ${siteConfig.legalName}`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: s.factoryAddress,
    addressLocality: siteConfig.factory.city,
    addressRegion: siteConfig.factory.region,
    addressCountry: 'IR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: siteConfig.factory.lat, longitude: siteConfig.factory.lng },
  hasMap: s.mapUrl,
});

/** Organization — شرکت مادر (قدیر لوله پاسارگاد) با دفتر مرکزی و کارخانه */
export function organizationSchema(s: ContactSettings) {
  const phones = s.companyPhones.map(e164);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: [siteConfig.nameEn, siteConfig.legalName, siteConfig.legalNameEn],
    url: siteConfig.url,
    logo: absoluteUrl('/images/logo.png'),
    image: absoluteUrl('/images/logo.png'),
    description: siteConfig.description,
    email: s.email,
    telephone: phones[0] ?? e164(s.phone),
    address: officeAddress(s),
    location: [factoryPlace(s)],
    contactPoint: [
      ...phones.map((telephone) => ({
        '@type': 'ContactPoint',
        telephone,
        contactType: 'sales',
        areaServed: 'IR',
        availableLanguage: ['fa'],
      })),
      { '@type': 'ContactPoint', telephone: e164(s.mobile), contactType: 'customer service', areaServed: 'IR', availableLanguage: ['fa'] },
    ],
    sameAs: [s.mapUrl, ...Object.values(siteConfig.socials)].filter(Boolean),
  };
}

/**
 * LocalBusiness — مهم‌ترین schema برای سئوی محلی و نقشه:
 * دفتر فروش تهران + کارخانه و انبار گرمسار (همان مکان ثبت‌شده در گوگل مپ).
 */
export function localBusinessSchema(s: ContactSettings) {
  const phones = s.companyPhones.map(e164);
  const factory = factoryPlace(s);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HardwareStore',
        '@id': `${siteConfig.url}/#localbusiness`,
        name: siteConfig.name,
        url: siteConfig.url,
        image: absoluteUrl('/images/logo.png'),
        telephone: phones[0] ?? e164(s.phone),
        email: s.email,
        description: `فروش آنلاین مستقیم از کارخانه ${siteConfig.legalName} — ${siteConfig.description}`,
        address: officeAddress(s),
        priceRange: '$$',
        currenciesAccepted: 'IRR',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '08:00',
            closes: '18:00',
          },
        ],
        areaServed: { '@type': 'Country', name: siteConfig.serviceArea },
        parentOrganization: { '@id': `${siteConfig.url}/#organization` },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.url}/#factory`,
        name: factory.name,
        url: `${siteConfig.url}/contact`,
        image: absoluteUrl('/images/logo.png'),
        telephone: phones[0] ?? e164(s.phone),
        description: `کارخانه تولید لوله دوجداره پلی اتیلن و انبار ${siteConfig.legalName}`,
        address: factory.address,
        geo: factory.geo,
        hasMap: factory.hasMap,
        parentOrganization: { '@id': `${siteConfig.url}/#organization` },
      },
    ],
  };
}
