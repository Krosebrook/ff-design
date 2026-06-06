import { useEffect, useRef, useState } from 'react';
import { Portal } from './Portal';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

export function Drawer({ open, onClose, title, children, width = 420 }: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (open) { setMounted(true); setLeaving(false); }
    else if (mounted) {
      setLeaving(true);
      const id = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const safeWidth = Math.min(width, typeof window !== 'undefined' ? window.innerWidth - 24 : width);

  return (
    <Portal>
      <div className="fixed inset-0 z-[70]">
        <div
          className={`absolute inset-0 ${leaving ? '' : 'ff-backdrop'} bg-black/55`}
          onClick={onClose}
          style={leaving ? { opacity: 0, transition: 'opacity 200ms' } : {}}
        />
        <aside
          role="dialog"
          aria-modal
          className={`absolute right-0 top-0 h-full ${leaving ? 'ff-drawer-out' : 'ff-drawer-in'} border-l border-white/10 bg-[#0B0F1A]/96 shadow-2xl backdrop-blur-xl`}
          style={{ width: safeWidth }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close panel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="h-[calc(100%-49px)] overflow-y-auto px-5 py-4">{children}</div>
        </aside>
      </div>
    </Portal>
  );
}
