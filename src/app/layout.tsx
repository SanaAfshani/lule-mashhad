import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/shared/config/site';
import { getSiteSettingsMap } from '@/shared/lib/data';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { NavigationProgress } from '@/shared/ui/NavigationProgress';

const baseMetadata: Metadata = {
  title: {
    default: siteConfig.name + ' | خرید لوله و اتصالات آب و فاضلاب',
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  metadataBase: new URL(siteConfig.url),
  // canonical اینجا تعریف نمی‌شود: به همه صفحه‌های بدون canonical ارث می‌رسید و آن‌ها را «نسخه دیگر صفحه اصلی» معرفی می‌کرد.
  // هر صفحه canonical خودش را می‌گذارد (صفحه اصلی هم).
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: siteConfig.url,
    title: siteConfig.name + ' | خرید لوله و اتصالات آب و فاضلاب',
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  applicationName: siteConfig.name,
  publisher: siteConfig.name,
  creator: siteConfig.name,
  category: 'business',
  // شماره تلفن‌ها خودمان لینک شده‌اند؛ تشخیص خودکار مرورگر باعث hydration mismatch می‌شود
  formatDetection: { telephone: false, address: false, email: false },
};

/** کد تایید Search Console از پنل «مرکز سئو» (یا متغیر محیطی) در <head> همه صفحات قرار می‌گیرد */
export async function generateMetadata(): Promise<Metadata> {
  let google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  try {
    google = (await getSiteSettingsMap()).google_site_verification || google;
  } catch {
    // دیتابیس در دسترس نیست — متادیتای پایه کافی است
  }
  return google ? { ...baseMetadata, verification: { google } } : baseMetadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem('site-theme-color');if(c)document.documentElement.setAttribute('data-theme-color',c);}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <NavigationProgress />
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                fontFamily: 'Vazirmatn, sans-serif',
                direction: 'rtl',
              },
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
