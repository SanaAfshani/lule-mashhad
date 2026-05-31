import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';
import { getSiteSettingsMap } from '@/shared/lib/data';
import { mergeSiteSettings } from '@/shared/lib/site-settings';
import { SiteSettingsProvider } from '@/shared/providers/SiteSettingsProvider';

/** Render at request time — required for Prisma/Postgres on Vercel */
export const dynamic = 'force-dynamic';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const raw = await getSiteSettingsMap();
  const settings = mergeSiteSettings(raw);

  return (
    <SiteSettingsProvider settings={settings}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-[var(--nav-height)] pb-20 sm:pb-0">
          {children}
        </main>
        <Footer />
      </div>
    </SiteSettingsProvider>
  );
}
