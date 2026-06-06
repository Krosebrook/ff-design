import { useState } from 'react';
import { AUDIT_EVENTS } from '../lib/agents-data';
import { SectionHead } from '../components/ui/SectionHead';
import { Pill } from '../components/ui/Pill';
import { SystemPanel } from '../components/ui/SystemPanel';
import type { AuditEvent } from '../lib/types';

type FilterKind = 'all' | AuditEvent['kind'];

const TONE_MAP: Record<string, 'slate' | 'emerald' | 'amber' | 'pink'> = {
  info: 'slate', success: 'emerald', warn: 'amber', error: 'pink',
};

export function AuditRoute() {
  const [filter, setFilter] = useState<FilterKind>('all');
  const [q, setQ] = useState('');

  const filtered = AUDIT_EVENTS.filter(
    (e) =>
      (filter === 'all' || e.kind === filter) &&
      (!q || (e.action + e.actor + e.target).toLowerCase().includes(q.toLowerCase()))
  );

  const counts = {
    all:     AUDIT_EVENTS.length,
    info:    AUDIT_EVENTS.filter((e) => e.kind === 'info').length,
    success: AUDIT_EVENTS.filter((e) => e.kind === 'success').length,
    warn:    AUDIT_EVENTS.filter((e) => e.kind === 'warn').length,
    error:   AUDIT_EVENTS.filter((e) => e.kind === 'error').length,
  };

  const FILTER_OPTS: { id: FilterKind; label: string }[] = [
    { id: 'all',     label: 'All'     },
    { id: 'info',    label: 'Info'    },
    { id: 'success', label: 'Success' },
    { id: 'warn',    label: 'Warn'    },
    { id: 'error',   label: 'Error'   },
  ];

  return (
    <main className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="Runtime"
        title="Audit log"
        sub="Every agent action, every transition. Security-sensitive events are double-flagged and never trimmed."
        right={<Pill tone="cyan">{AUDIT_EVENTS.length} events</Pill>}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTER_OPTS.map(({ id, label }) => {
          const tone = TONE_MAP[id] || 'slate';
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${active ? `border-${tone}-300/40 bg-${tone}-500/10 text-${tone}-100` : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'}`}
            >
              {label} <span className="text-[10px] text-slate-500">{counts[id as keyof typeof counts]}</span>
            </button>
          );
        })}
        <div className="relative ml-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events…"
            className="w-60 rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-300/50"
          />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-2.5 top-2.5 text-slate-500" aria-hidden>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
        </div>
      </div>

      <SystemPanel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                <th className="border-b border-white/8 px-5 py-3">When</th>
                <th className="border-b border-white/8 px-5 py-3">Actor</th>
                <th className="border-b border-white/8 px-5 py-3">Action</th>
                <th className="border-b border-white/8 px-5 py-3">Target</th>
                <th className="border-b border-white/8 px-5 py-3 text-right">Kind</th>
              </tr>
            </thead>
            <tbody className="ff-stagger">
              {filtered.map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="border-b border-white/5 px-5 py-3 font-mono text-[11px] text-slate-500">{e.t}</td>
                  <td className="border-b border-white/5 px-5 py-3 font-mono text-xs text-slate-300">{e.actor}</td>
                  <td className="border-b border-white/5 px-5 py-3 font-mono text-xs text-cyan-200">{e.action}</td>
                  <td className="border-b border-white/5 px-5 py-3 text-xs text-slate-400">{e.target}</td>
                  <td className="border-b border-white/5 px-5 py-3 text-right">
                    <Pill tone={TONE_MAP[e.kind] || 'slate'}>{e.kind}</Pill>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">No events match.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SystemPanel>
    </main>
  );
}
