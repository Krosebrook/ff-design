import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Portal } from '../ui/Portal';
import { Icon } from '../ui/Icon';
import { SIDEBAR_ITEMS, SKILLS, PIPELINES } from '../../lib/agents-data';
import type { IconName } from '../../lib/types';

interface PaletteItem {
  id: string;
  label: string;
  icon?: IconName;
  hint?: string;
  group: string;
  path?: string;
  action?: () => void;
  kbd?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: PaletteItem[] = useMemo(() => {
    const pages = SIDEBAR_ITEMS.map((i) => ({
      id: 'page-' + i.id,
      label: i.label,
      icon: i.icon,
      hint: i.hint,
      group: 'Pages',
      path: `/${i.id}`,
    }));
    const skills = SKILLS.map((s) => ({
      id: 'skill-' + s.id,
      label: s.name,
      icon: s.icon,
      hint: s.lane,
      group: 'Skills',
      path: `/skills/${s.id}`,
    }));
    const pipes = PIPELINES.map((p) => ({
      id: 'pipe-' + p.id,
      label: p.name,
      icon: 'rocket' as IconName,
      hint: p.runtime,
      group: 'Pipelines',
      path: `/pipelines/${p.id}`,
    }));
    const actions: PaletteItem[] = [
      { id: 'act-deploy',   label: 'Deploy a skill…', icon: 'rocket',   group: 'Actions', kbd: 'D', action: () => navigate('/skills') },
      { id: 'act-audit',    label: 'Open audit log',  icon: 'shield',   group: 'Actions', path: '/audit' },
      { id: 'act-settings', label: 'Open settings',   icon: 'lock',     group: 'Actions', path: '/settings' },
    ];
    return [...pages, ...actions, ...skills, ...pipes];
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items.filter((it) =>
      it.label.toLowerCase().includes(needle) ||
      (it.hint || '').toLowerCase().includes(needle) ||
      it.group.toLowerCase().includes(needle)
    );
  }, [items, q]);

  useEffect(() => { if (open) { setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => { setActive(0); }, [q, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')    { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      if (e.key === 'Enter')     { e.preventDefault(); pick(filtered[active]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, active]);

  function pick(item?: PaletteItem) {
    if (!item) return;
    if (item.path) navigate(item.path);
    else item.action?.();
    onClose();
  }

  const groups = filtered.reduce<Record<string, PaletteItem[]>>((acc, it) => {
    const g = it.group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(it);
    return acc;
  }, {});

  let cursor = 0;

  if (!open) return null;

  return (
    <Portal>
      <div className="ff-backdrop fixed inset-0 z-[80] flex items-start justify-center bg-black/65 pt-[12vh]" onClick={onClose}>
        <div
          role="dialog"
          aria-modal
          aria-label="Command palette"
          className="ff-pop relative mx-4 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/96 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools, skills, agents, pipelines…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
            />
            <kbd className="ff-kbd">esc</kbd>
          </div>

          <div className="max-h-[58vh] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">No matches for <span className="text-slate-300">"{q}"</span></div>
            ) : (
              Object.entries(groups).map(([groupName, list]) => (
                <div key={groupName} className="mb-2">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{groupName}</div>
                  <ul>
                    {list.map((it) => {
                      const idx = cursor++;
                      const isActive = idx === active;
                      return (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => pick(it)}
                            onMouseEnter={() => setActive(idx)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${isActive ? 'bg-violet-500/14 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                          >
                            {it.icon && (
                              <span className={`grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`}>
                                <Icon name={it.icon} className="h-3.5 w-3.5" />
                              </span>
                            )}
                            <span className="flex-1 truncate">{it.label}</span>
                            {it.hint && <span className="text-[11px] text-slate-500">{it.hint}</span>}
                            {it.kbd  && <kbd className="ff-kbd">{it.kbd}</kbd>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <kbd className="ff-kbd">↑</kbd><kbd className="ff-kbd">↓</kbd>
              <span>navigate</span>
              <span className="mx-1 text-slate-700">•</span>
              <kbd className="ff-kbd">enter</kbd>
              <span>open</span>
            </div>
            <span>FlashFusion · jump</span>
          </div>
        </div>
      </div>
    </Portal>
  );
}
