import { Header } from '@/widgets/header/Header';
import { Footer } from '@/widgets/footer/Footer';

/** Render at request time — required for Prisma/Postgres on Vercel */
export const dynamic = 'force-dynamic';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[var(--nav-height)] pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
