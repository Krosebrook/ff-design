import { Link, useMatches } from 'react-router-dom';
import { Tooltip } from '../ui/Tooltip';

interface Crumb {
  label: string;
  to?: string;
}

interface TopbarProps {
  crumbs: Crumb[];
  onCmdK: () => void;
  onOpenDrawer: () => void;
  onOpenMobile: () => void;
  running: boolean;
}

export function Topbar({ crumbs, onCmdK, onOpenDrawer, onOpenMobile, running }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/8 bg-[#070912]/85 px-4 backdrop-blur-xl sm:px-6">
      {/* Mobile hamburger */}
      <button type="button" onClick={onOpenMobile} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[12px] text-slate-400 sm:flex">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-slate-600" aria-hidden>/</span>}
            {c.to ? (
              <Link to={c.to} className="hover:text-white">{c.label}</Link>
            ) : (
              <span className="font-semibold text-white" aria-current="page">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <span className="text-sm font-semibold text-white sm:hidden">{crumbs[crumbs.length - 1]?.label}</span>

      <div className="flex-1" />

      <Tooltip label="Runtime state">
        <span className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:inline-flex ${running ? 'border-emerald-300/30 bg-emerald-500/8 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-400'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${running ? 'ff-dot-pulse bg-emerald-300' : 'bg-slate-500'}`} />
          {running ? 'Runtime live' : 'Paused'}
        </span>
      </Tooltip>

      <Tooltip label="Search (⌘K)">
        <button type="button" onClick={onCmdK} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
        </button>
      </Tooltip>

      <Tooltip label="Notifications">
        <button type="button" onClick={onOpenDrawer} className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Notifications">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-pink-300" />
        </button>
      </Tooltip>

      <Tooltip label="Operator">
        <button type="button" className="ml-1 hidden h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[12px] font-bold text-white sm:grid" aria-label="Operator profile">KR</button>
      </Tooltip>
    </header>
  );
}
