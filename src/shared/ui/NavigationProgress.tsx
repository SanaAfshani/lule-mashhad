'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathname = useRef(pathname);

  // Intercept all internal link clicks → start bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      if (href === pathname) return;
      start();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  // When pathname changes → complete bar
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      complete();
    }
  }, [pathname]);

  function start() {
    clear();
    setVisible(true);
    setWidth(10);

    let w = 10;
    animRef.current = setInterval(() => {
      // Slow down as it approaches 85%
      const step = w < 40 ? 8 : w < 65 ? 4 : w < 80 ? 1.5 : 0.3;
      w = Math.min(w + step, 85);
      setWidth(w);
    }, 200);
  }

  function complete() {
    clear();
    setWidth(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
  }

  function clear() {
    if (animRef.current) clearInterval(animRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ background: 'transparent' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: 'var(--accent, #f59e0b)',
          transition: width === 100 ? 'width 0.2s ease-out' : 'width 0.2s linear',
          boxShadow: '0 0 8px var(--accent, #f59e0b)',
        }}
      />
    </div>
  );
}
