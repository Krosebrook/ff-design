import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SKILLS, LANES } from '../lib/agents-data';
import { SectionHead } from '../components/ui/SectionHead';
import { Pill } from '../components/ui/Pill';
import { Tabs } from '../components/ui/Tabs';
import { Icon } from '../components/ui/Icon';
import type { Skill } from '../lib/types';

export function SkillsRoute() {
  const [searchParams] = useSearchParams();
  const [lane, setLane] = useState(searchParams.get('lane') || 'all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => SKILLS.filter((s) => {
    const laneOk = lane === 'all' || s.lane === lane;
    const qq = q.trim().toLowerCase();
    const qOk = !qq || s.name.toLowerCase().includes(qq) || s.desc.toLowerCase().includes(qq);
    return laneOk && qOk;
  }), [lane, q]);

  const tabs = [
    { id: 'all', label: 'All', count: SKILLS.length },
    ...LANES.map((l) => ({ id: l.id, label: l.name, count: SKILLS.filter((s) => s.lane === l.id).length })),
  ];

  return (
    <main className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="The Library"
        title="Sixteen skills. One operator."
        sub="Every skill is portable markdown — MCP-ready, runs anywhere Claude lives. Filter by lane, search by intent."
        right={
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search skills…"
              className="w-56 rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-cyan-300/50"
            />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-2.5 top-2.5 text-slate-500" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
            </svg>
          </div>
        }
      />

      <Tabs tabs={tabs} value={lane} onChange={setLane} />

      <div className="ff-stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((s) => <SkillCard key={s.id} skill={s} />)}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-sm text-slate-500">
            No skills match those filters.
          </div>
        )}
      </div>
    </main>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const GLOW_COLOR: Record<string, string> = {
    violet: 'rgba(168,85,247,0.20)',
    cyan:   'rgba(34,211,238,0.18)',
    amber:  'rgba(245,158,11,0.16)',
    pink:   'rgba(244,114,182,0.16)',
  };

  return (
    <Link to={`/skills/${skill.id}`} className="group block">
      <div className="ff-hover-lift relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/85 p-5 backdrop-blur-sm">
        <div
          className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: `radial-gradient(closest-side, ${GLOW_COLOR[skill.tone] || GLOW_COLOR.violet}, transparent 70%)`, filter: 'blur(2px)' }}
          aria-hidden
        />
        <div className="relative flex items-start gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl border bg-white/[0.04] text-${skill.tone}-200 border-${skill.tone}-300/25`}>
            <Icon name={skill.icon} className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[10px] text-slate-500">{skill.id.split('-')[0]}</span>
              <h3 className="truncate text-[14px] font-semibold text-white">{skill.name}</h3>
            </div>
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-400">{skill.desc}</p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between border-t border-white/8 pt-3">
          <Pill tone={skill.tone}>{skill.lane.toUpperCase()}</Pill>
          <span className="font-mono text-[10px] text-slate-500">{skill.runtime}</span>
        </div>
      </div>
    </Link>
  );
}
