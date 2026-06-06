import { useMemo } from 'react';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';
import { runSmokeChecks } from '../lib/smoke-checks';
import { AgentCard } from '../components/agent/AgentCard';
import { CommandInput } from '../components/runtime/CommandInput';
import { DataFlowLine } from '../components/runtime/DataFlowLine';
import { RuntimeTimeline } from '../components/runtime/RuntimeTimeline';
import { BackendBlueprint } from '../components/system/BackendBlueprint';
import { SmokeCheckPanel } from '../components/system/SmokeCheckPanel';

export function ConsoleRoute() {
  const { agents, events, state, transitionLog, droppedEvents, progressViolations, pause, resume, reset } = useSimulatedAgentRuntime();

  const running   = useMemo(() => agents.filter((a) => a.status === 'running').length,  [agents]);
  const completed = useMemo(() => agents.filter((a) => a.status === 'success').length, [agents]);
  const intensity = useMemo(() => Math.max(0.6, running / 3 + completed / 8), [running, completed]);
  const checks    = useMemo(() => runSmokeChecks({ agents, transitionLog, droppedEvents, progressViolations }), [agents, transitionLog, droppedEvents, progressViolations]);

  return (
    <main className="ff-page min-h-screen pb-20">
      <header className="mx-auto max-w-7xl px-6 pt-12">
        <div className="relative text-center">
          <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" aria-hidden />
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <span aria-hidden>⚡</span>
            <span>FlashFusion Agentic Execution Layer</span>
          </div>
          <h1 className="mx-auto max-w-5xl text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Transform intent into{' '}
            <span className="gradient-text">production systems.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-400">
            Six specialized agents coordinate across planning, code, security, data and deploy.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Specialized</p>
              <p className="mt-2 text-3xl font-semibold text-white">6</p>
              <p className="mt-1 text-sm text-slate-400">agents in the fleet</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Live</p>
              <p className="mt-2 text-3xl font-semibold text-cyan-100" aria-live="polite">{running}</p>
              <p className="mt-1 text-sm text-slate-400">currently running</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-200/70">Verified</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-100" aria-live="polite">{completed}</p>
              <p className="mt-1 text-sm text-slate-400">outputs this run</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-8 max-w-7xl px-6">
        <CommandInput state={state} onPause={pause} onResume={resume} onReset={reset} />
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-6" aria-hidden>
        <DataFlowLine intensity={intensity} />
      </section>

      <section className="ff-stagger mx-auto mt-2 grid max-w-7xl grid-cols-1 gap-5 px-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Agent fleet">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RuntimeTimeline events={events} />
        <BackendBlueprint />
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-6">
        <SmokeCheckPanel checks={checks} />
      </section>
    </main>
  );
}
