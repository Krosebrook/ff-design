import { useMemo } from 'react';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';
import { AgentCard } from '../components/agent/AgentCard';
import { CommandInput } from '../components/runtime/CommandInput';
import { DataFlowLine } from '../components/runtime/DataFlowLine';
import { RuntimeTimeline } from '../components/runtime/RuntimeTimeline';
import { BackendBlueprint } from '../components/system/BackendBlueprint';

export function ConsoleRoute() {
  const { agents, events, state, pause, resume, reset } = useSimulatedAgentRuntime();

  const running = useMemo(() => agents.filter((a) => a.status === 'running').length, [agents]);
  const completed = useMemo(() => agents.filter((a) => a.status === 'success').length, [agents]);
  const intensity = useMemo(
    () => Math.max(0.6, running / 3 + completed / 8),
    [running, completed],
  );

  return (
    <main className="min-h-screen pb-20">
      <header className="mx-auto max-w-6xl px-6 pt-12">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-cyan)]/70">
          Operational console
        </p>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Agent runtime
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
          Live execution graph for the active run. {running} running, {completed} verified.
        </p>
      </header>

      <section className="mx-auto mt-8 max-w-6xl px-6">
        <CommandInput state={state} onPause={pause} onResume={resume} onReset={reset} />
      </section>

      <section className="mx-auto mt-6 max-w-6xl px-6" aria-hidden>
        <DataFlowLine intensity={intensity} />
      </section>

      <section
        className="mx-auto mt-2 grid max-w-6xl grid-cols-1 gap-5 px-6 md:grid-cols-2 lg:grid-cols-3"
        aria-label="Active agents"
      >
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RuntimeTimeline events={events} />
        <BackendBlueprint />
      </section>
    </main>
  );
}
