'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger: دکمه قرمز برای حذف و کارهای برگشت‌ناپذیر */
  tone?: 'danger' | 'default';
};

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

/**
 * جایگزین confirm() مرورگر: `if (!(await confirm({ title: '...' }))) return;`
 * دسکتاپ پنجره وسط صفحه، موبایل bottom sheet (همان الگوی PriceChartDialog).
 */
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const confirmBtn = useRef<HTMLButtonElement>(null);
  const cancelBtn = useRef<HTMLButtonElement>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setPending({ ...options, resolve })),
    [],
  );

  const close = useCallback(
    (ok: boolean) => {
      pending?.resolve(ok);
      setPending(null);
    },
    [pending],
  );

  useEffect(() => {
    if (!pending) return;
    // برای حذف، فوکوس روی «انصراف» تا Enter اشتباهی چیزی را پاک نکند
    ((pending.tone ?? 'danger') === 'danger' ? cancelBtn : confirmBtn).current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pending, close]);

  const danger = (pending?.tone ?? 'danger') === 'danger';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {pending && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => close(false)} />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby={pending.message ? 'confirm-message' : undefined}
              className="relative w-full sm:max-w-md bg-[var(--background)] text-[var(--foreground)] rounded-t-[var(--radius-sheet,1.25rem)] sm:rounded-[var(--radius-panel,1rem)] shadow-2xl border-t sm:border border-[var(--border)] p-5 sm:p-6 pb-[max(env(safe-area-inset-bottom),1.25rem)]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 380 }}
            >
              {/* دستگیره bottom sheet — فقط موبایل */}
              <span className="sm:hidden block mx-auto -mt-1 mb-4 w-10 h-1 rounded-full bg-[var(--border)]" aria-hidden />
              <div className="flex items-start gap-3">
                {danger && (
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                )}
                <div className="min-w-0 pt-1">
                  <h2 id="confirm-title" className="font-bold text-base leading-7">{pending.title}</h2>
                  {pending.message && <p id="confirm-message" className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{pending.message}</p>}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:flex sm:justify-end gap-2">
                <button ref={cancelBtn} type="button" onClick={() => close(false)} className="h-11 px-5 rounded-xl bg-[var(--muted)] text-sm font-bold">
                  {pending.cancelLabel ?? 'انصراف'}
                </button>
                <button
                  ref={confirmBtn}
                  type="button"
                  onClick={() => close(true)}
                  className={cn('h-11 px-5 rounded-xl text-sm font-bold', danger ? 'bg-red-600 text-white' : 'bg-[var(--accent)] text-[var(--accent-foreground)]')}
                >
                  {pending.confirmLabel ?? (danger ? 'حذف' : 'تایید')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
