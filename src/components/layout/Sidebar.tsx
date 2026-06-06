import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FFLogoMark } from './FFLogoMark';
import { Icon } from '../ui/Icon';
import { Tooltip } from '../ui/Tooltip';
import { SIDEBAR_ITEMS, LANES } from '../../lib/agents-data';

const LANE_DOT: Record<string, string> = {
  violet:  'bg-violet-400',
  cyan:    'bg-cyan-400',
  amber:   'bg-amber-400',
  emerald: 'bg-emerald-400',
};

interface SidebarProps {
  onCmdK: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ onCmdK, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const wide = !collapsed;

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseMobile(); };
    window.addEventListener('keydown', onKey);
    setTimeout(() => navRef.current?.querySelector<HTMLElement>('a,button')?.focus(), 60);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      {mobileOpen && (
        <div className="ff-backdrop fixed inset-0 z-40 bg-black/55 lg:hidden" onClick={onCloseMobile} aria-hidden />
      )}

      <aside
        ref={navRef}
        aria-label="Primary navigation"
        style={{ width: collapsed ? 76 : 244 }}
        className={[
          'fixed left-0 top-0 z-50 flex h-screen shrink-0 flex-col border-r border-white/8 bg-[#070912]/95 backdrop-blur-xl',
          'transition-[transform,width] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:z-20 lg:translate-x-0 lg:bg-[#070912]/85',
        ].join(' ')}
      >
        {/* Brand + collapse toggle */}
        <div className={`flex h-16 items-center border-b border-white/8 ${collapsed ? 'justify-center px-2' : 'gap-2.5 px-5'}`}>
          <NavLink to="/" onClick={onCloseMobile} className="flex items-center gap-2.5" aria-label="FlashFusion home">
            <FFLogoMark />
            {wide && (
              <span className="leading-tight">
                <span className="block text-[14px] font-semibold tracking-tight text-white">FlashFusion</span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Operator OS</span>
              </span>
            )}
          </NavLink>
          {wide && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="ml-auto hidden h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-white/5 hover:text-white lg:grid"
              aria-label="Collapse sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              </svg>
            </button>
          )}
          <button type="button" onClick={onCloseMobile} className="ml-auto grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Search → command palette */}
        {wide ? (
          <button
            type="button"
            onClick={onCmdK}
            className="mx-3 mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-400 transition hover:bg-white/[0.07] hover:text-slate-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
            <span className="flex-1">Jump to…</span>
            <kbd className="ff-kbd">⌘K</kbd>
          </button>
        ) : (
          <Tooltip label="Search (⌘K)">
            <button type="button" onClick={onCmdK} className="mx-auto mt-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07] hover:text-white" aria-label="Search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
            </button>
          </Tooltip>
        )}

        {/* Nav */}
        <nav className="mt-5 flex-1 overflow-y-auto overflow-x-hidden px-2" aria-label="Sections">
          <ul className="space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const link = (
                <NavLink
                  to={`/${item.id}`}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `ff-nav-item flex items-center rounded-lg text-sm hover:bg-white/5 hover:text-white ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'} ${isActive ? 'text-white' : 'text-slate-300'}`
                  }
                >
                  <Icon name={item.icon} className="h-4 w-4 shrink-0 text-slate-400" />
                  {wide && <span className="flex-1">{item.label}</span>}
                  {wide && <span className="text-[10px] text-slate-600">{item.hint}</span>}
                </NavLink>
              );
              return (
                <li key={item.id}>
                  {collapsed ? <Tooltip label={item.label}>{link}</Tooltip> : link}
                </li>
              );
            })}
          </ul>

          {wide ? (
            <div className="mt-6 px-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">Lanes</div>
          ) : (
            <div className="mx-auto mt-6 h-px w-8 bg-white/10" />
          )}
          <ul className="mt-2 space-y-0.5">
            {LANES.map((lane) => {
              const link = (
                <NavLink
                  to={`/skills?lane=${lane.id}`}
                  onClick={onCloseMobile}
                  className="flex items-center rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white"
                  style={{ padding: collapsed ? '0.375rem 0.5rem' : '0.375rem 0.75rem' }}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${LANE_DOT[lane.tone] || 'bg-slate-400'}`} />
                  {wide && <span className="ml-3 flex-1">{lane.name}</span>}
                  {wide && <span className="text-[10px] text-slate-600">{lane.pitch}</span>}
                </NavLink>
              );
              return (
                <li key={lane.id} className={collapsed ? 'flex justify-center' : ''}>
                  {collapsed ? <Tooltip label={`${lane.name} · ${lane.pitch}`}>{link}</Tooltip> : link}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Expand toggle when collapsed */}
        {collapsed && (
          <button type="button" onClick={onToggleCollapse} className="mx-auto mb-2 hidden h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white/5 hover:text-white lg:grid" aria-label="Expand sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            </svg>
          </button>
        )}

        {/* Footer */}
        <div className="border-t border-white/8 px-3 py-3">
          <div className={`flex items-center rounded-xl bg-white/[0.04] ${collapsed ? 'justify-center px-1.5 py-2' : 'gap-2.5 px-2.5 py-2'}`}>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[11px] font-bold text-white">KR</div>
            {wide && (
              <>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="truncate text-[12px] font-semibold text-white">Kyle Rosebrook</div>
                  <div className="truncate text-[10px] text-slate-500">Operator · v4</div>
                </div>
                <span className="ff-dot-pulse h-2 w-2 rounded-full bg-emerald-300" aria-label="Status: online" />
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
