import { useEffect, useRef } from 'react';
import { Portal } from './Portal';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="ff-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/65" onClick={onClose}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal
          aria-labelledby={title ? 'ff-modal-title' : undefined}
          className={`ff-pop relative mx-4 w-full ${SIZES[size]} rounded-3xl border border-white/10 bg-[#0B0F1A]/95 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
              <h2 id="ff-modal-title" className="text-base font-semibold text-white">{title}</h2>
              <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
          {footer && <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-3.5">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}
