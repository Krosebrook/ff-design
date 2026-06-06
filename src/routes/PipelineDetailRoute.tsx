import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PIPELINES, SKILLS } from '../lib/agents-data';
import { useToast } from '../components/ui/ToastSystem';
import { SystemPanel } from '../components/ui/SystemPanel';
import { Pill } from '../components/ui/Pill';
import { Icon } from '../components/ui/Icon';
import type { PipelineStage } from '../lib/types';

export function PipelineDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const pipeline = PIPELINES.find((p) => p.id === id);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(-1);
  const { toast } = useToast();

  useEffect(() => {
    if (!running || !pipeline) return;
    if (step >= pipeline.stages.length) {
      setRunning(false);
      toast({ title: 'Pipeline complete', body: pipeline.name, kind: 'success' });
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [running, step, pipeline]);

  if (!pipeline) {
    return (
      <main className="ff-page mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-300">404 · pipeline not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">No record of that pipeline.</h1>
        <Link to="/pipelines" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
          <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> Back to pipelines
        </Link>
      </main>
    );
  }

  return (
    <main className="ff-page mx-auto max-w-6xl px-6 py-8">
      <Link to="/pipelines" className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <Icon name="arrowRight" className="h-3 w-3 rotate-180" /> All pipelines
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Pipeline</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{pipeline.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{pipeline.desc}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setStep(0); setRunning(true); toast({ title: `Running · ${pipeline.name}`, kind: 'info' }); }}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400 disabled:opacity-60"
          >
            <Icon name="play" className="h-3.5 w-3.5" /> {running ? 'Running…' : 'Run pipeline'}
          </button>
          <button type="button" onClick={() => toast({ title: 'Schedule saved', body: 'Trigger: ' + pipeline.triggers[0], kind: 'success' })} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
            <Icon name="rocket" className="h-3.5 w-3.5" /> Schedule
          </button>
        </div>
      </div>

      <SystemPanel className="mt-6 overflow-hidden">
        <PipelineGraph stages={pipeline.stages} active={step} running={running} />
      </SystemPanel>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SystemPanel>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Triggers</p>
          <ul className="mt-3 space-y-2 text-sm">
            {pipeline.triggers.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <Icon name="zap" className="h-3.5 w-3.5 text-amber-200" />
                <span className="text-slate-300">{t}</span>
              </li>
            ))}
          </ul>
        </SystemPanel>

        <SystemPanel>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Stages</p>
          <ol className="mt-3 space-y-2.5 text-sm">
            {pipeline.stages.map((st, i) => {
              const sk = st.skill ? SKILLS.find((s) => s.id === st.skill) : null;
              return (
                <li key={st.id} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/8 font-mono text-[10px] text-slate-300">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-slate-200">{st.name}</p>
                    {sk ? (
                      <Link to={`/skills/${sk.id}`} className="text-xs text-cyan-200 hover:underline">↳ {sk.name}</Link>
                    ) : (
                      <p className="text-xs text-slate-500">{st.body}</p>
                    )}
                  </div>
                  {st.hitl && <Pill tone="pink">HITL</Pill>}
                </li>
              );
            })}
          </ol>
        </SystemPanel>
      </div>
    </main>
  );
}

function PipelineGraph({ stages, active, running }: { stages: PipelineStage[]; active: number; running: boolean }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-fit items-stretch gap-3">
        {stages.map((st, i) => {
          const sk = st.skill ? SKILLS.find((s) => s.id === st.skill) : null;
          const isActive  = running && active >= i;
          const isCurrent = running && active === i;
          return (
            <span key={st.id} className="flex items-center gap-3">
              <div className={`ff-node ${isCurrent ? 'active' : ''} w-[200px] shrink-0 p-4 transition-colors`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                  {st.hitl ? <Pill tone="pink">HITL</Pill> : isActive ? <Pill tone="emerald">done</Pill> : <Pill tone="slate">queued</Pill>}
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{st.name}</div>
                {sk ? (
                  <Link to={`/skills/${sk.id}`} className="mt-1.5 block text-[11px] text-cyan-200 hover:underline">↳ {sk.name}</Link>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-400">{st.body}</p>
                )}
              </div>
              {i < stages.length - 1 && (
                <svg width="48" height="14" viewBox="0 0 48 14" className="shrink-0 overflow-visible" aria-hidden>
                  <line x1="0" y1="7" x2="42" y2="7" stroke={isActive ? '#22D3EE' : 'rgba(255,255,255,0.18)'} strokeWidth="2" strokeDasharray="6 4" className={isActive ? 'ff-dashflow' : ''} style={isActive ? { ['--ff-flow-duration' as string]: '1.4s' } : {}} />
                  <polygon points="42,2 48,7 42,12" fill={isActive ? '#22D3EE' : 'rgba(255,255,255,0.30)'} />
                </svg>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
