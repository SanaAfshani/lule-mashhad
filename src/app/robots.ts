import { MetadataRoute } from 'next';
import { siteConfig } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // صفحات جستجو محتوای تکراری تولید می‌کنند و بودجه خزش را هدر می‌دهند
        disallow: ['/admin/', '/api/', '/search?'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
