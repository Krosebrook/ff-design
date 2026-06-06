import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Portal } from './Portal';
import { Icon } from './Icon';
import type { IconName } from '../../lib/types';

interface ToastOptions {
  title?: string;
  body?: string;
  kind?: 'info' | 'success' | 'warn' | 'error';
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastOptions {
  id: number;
  leaving?: boolean;
}

interface ToastCtxValue {
  toast: (opts: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastCtx = createContext<ToastCtxValue>({ toast: () => 0, dismiss: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((curr) => curr.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    setTimeout(() => setItems((curr) => curr.filter((x) => x.id !== id)), 260);
  }, []);

  const toast = useCallback((opts: ToastOptions) => {
    const id = ++idRef.current;
    const t: ToastItem = { id, kind: 'info', duration: 3800, ...opts };
    setItems((curr) => [...curr, t]);
    setTimeout(() => dismiss(id), t.duration ?? 3800);
    return id;
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={{ toast, dismiss }}>
      {children}
      <Portal>
        <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2.5">
          {items.map((t) => <ToastItem key={t.id} t={t} onClose={() => dismiss(t.id)} />)}
        </div>
      </Portal>
    </ToastCtx.Provider>
  );
}

export function useToast() { return useContext(ToastCtx); }

const TONE_MAP = {
  info:    { bar: 'bg-cyan-300',    icon: 'sparkles' as IconName, label: 'text-cyan-200'    },
  success: { bar: 'bg-emerald-300', icon: 'check'    as IconName, label: 'text-emerald-200' },
  warn:    { bar: 'bg-amber-300',   icon: 'alert'    as IconName, label: 'text-amber-200'   },
  error:   { bar: 'bg-pink-300',    icon: 'alert'    as IconName, label: 'text-pink-200'    },
};

function ToastItem({ t, onClose }: { t: ToastItem; onClose: () => void }) {
  const tones = TONE_MAP[t.kind ?? 'info'];
  return (
    <div className={`pointer-events-auto overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/95 shadow-2xl backdrop-blur-xl ${t.leaving ? 'ff-toast-out' : 'ff-toast-in'}`}>
      <div className="flex gap-3 p-3.5">
        <span className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${tones.bar}`} aria-hidden />
        <div className="min-w-0 flex-1">
          {t.title && <p className="text-sm font-semibold text-white">{t.title}</p>}
          {t.body  && <p className="mt-0.5 text-xs leading-5 text-slate-400">{t.body}</p>}
          {t.action && (
            <button type="button" onClick={() => { t.action!.onClick(); onClose(); }} className={`mt-2 text-xs font-semibold ${tones.label} hover:underline`}>
              {t.action.label}
            </button>
          )}
        </div>
        <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
