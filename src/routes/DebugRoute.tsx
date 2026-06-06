import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';
import { runSmokeChecks } from '../lib/smoke-checks';
import { SmokeCheckPanel } from '../components/system/SmokeCheckPanel';
import { SystemPanel } from '../components/ui/SystemPanel';

export function DebugRoute() {
  if (import.meta.env.PROD) return <Navigate to="/" replace />;

  const { agents, events, state, transitionLog, droppedEvents, progressViolations } = useSimulatedAgentRuntime();
  const checks = useMemo(
    () => runSmokeChecks({ agents, transitionLog, droppedEvents, progressViolations }),
    [agents, transitionLog, droppedEvents, progressViolations]
  );

  return (
    <main className="ff-page min-h-screen pb-20">
      <header className="mx-auto max-w-6xl px-6 pt-12">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300/80">Debug — non-production only</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Runtime introspection</h1>
      </header>

      <section className="mx-auto mt-8 max-w-6xl px-6">
        <SmokeCheckPanel checks={checks} />
      </section>

      <section className="mx-auto mt-6 max-w-6xl px-6">
        <SystemPanel as="section">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">State inspector</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Live runtime state</h2>
          </header>
          <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-4 font-mono text-xs leading-5 text-slate-300">
            {JSON.stringify({ state, agentCount: agents.length, eventCount: events.length, agents }, null, 2)}
          </pre>
        </SystemPanel>
      </section>
    </main>
  );
}
