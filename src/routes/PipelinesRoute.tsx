import { Link } from 'react-router-dom';
import { PIPELINES } from '../lib/agents-data';
import { SectionHead } from '../components/ui/SectionHead';
import { Pill } from '../components/ui/Pill';
import { Icon } from '../components/ui/Icon';
import type { Pipeline } from '../lib/types';

export function PipelinesRoute() {
  return (
    <main className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="Pipelines"
        title="Skills composed end-to-end"
        sub="Pipelines turn one-off skills into recurring practice. Triggers, HITL gates, and runtime targets all live here."
        right={<Pill tone="cyan">{PIPELINES.length} pipelines</Pill>}
      />
      <div className="ff-stagger grid grid-cols-1 gap-5 md:grid-cols-2">
        {PIPELINES.map((p) => <PipelineCard key={p.id} pipeline={p} />)}
      </div>
    </main>
  );
}

function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  return (
    <Link to={`/pipelines/${pipeline.id}`} className="block">
      <div className="ff-hover-lift relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/85 p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">{pipeline.runtime}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{pipeline.name}</h3>
            <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-400">{pipeline.desc}</p>
          </div>
          <Icon name="rocket" className="h-5 w-5 shrink-0 text-violet-200" />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {pipeline.stages.map((st, i) => (
            <span key={st.id} className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1.5 rounded-full border bg-white/[0.04] px-2.5 py-1 text-[11px] ${st.hitl ? 'border-pink-300/30 text-pink-200' : 'border-white/10 text-slate-300'}`}>
                {st.hitl && <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />}
                {st.name}
              </span>
              {i < pipeline.stages.length - 1 && <span className="text-slate-600">→</span>}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-xs text-slate-500">
          <span>Triggers: <span className="text-slate-300">{pipeline.triggers.join(' · ')}</span></span>
          <span className="text-cyan-200">Open →</span>
        </div>
      </div>
    </Link>
  );
}
