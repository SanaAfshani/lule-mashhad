'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeColorProvider } from './ThemeColorProvider';
import { MotionProvider } from './MotionProvider';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ThemeColorProvider>
        <MotionProvider>{children}</MotionProvider>
      </ThemeColorProvider>
    </NextThemesProvider>
  );
}
