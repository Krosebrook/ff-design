import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';
import { runSmokeChecks } from '../lib/smoke-checks';
import { simulatedEvents } from '../lib/agents-data';
import { mappedKinds } from '../components/agent/agentIconMap';
import { SmokeCheckPanel } from '../components/system/SmokeCheckPanel';
import { SystemPanel } from '../components/ui/SystemPanel';

/**
 * Builder-only debug surface. Returns 404 in production builds.
 *
 * Vite exposes import.meta.env.PROD as true on `vite build`. If you switch
 * to Next.js, replace with `process.env.NODE_ENV === 'production'`.
 */
export function DebugRoute() {
  if (import.meta.env.PROD) {
    return <Navigate to="/" replace />;
  }

  const { agents, events, state } = useSimulatedAgentRuntime();
  const checks = useMemo(
    () => runSmokeChecks(agents, simulatedEvents, mappedKinds),
    [agents],
  );

  return (
    <main className="min-h-screen pb-20">
      <header className="mx-auto max-w-6xl px-6 pt-12">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-warning)]/80">
          Debug — non-production only
        </p>
        <h1 className="mt-2 font-[var(--font-heading)] text-3xl font-bold text-[var(--text-primary)]">
          Runtime introspection
        </h1>
      </header>

      <section className="mx-auto mt-8 max-w-6xl px-6">
        <SmokeCheckPanel checks={checks} />
      </section>

      <section className="mx-auto mt-6 max-w-6xl px-6">
        <SystemPanel as="section">
          <header className="mb-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-cyan)]/70">
              State inspector
            </p>
            <h2 className="mt-1 font-[var(--font-heading)] text-xl font-semibold text-[var(--text-primary)]">
              Live runtime state
            </h2>
          </header>
          <pre className="overflow-x-auto rounded-lg border border-[var(--border-primary)] bg-[var(--surface-base)]/80 p-4 font-[var(--font-code)] text-xs leading-5 text-[var(--text-secondary)]">
            {JSON.stringify({ state, agentCount: agents.length, eventCount: events.length, agents }, null, 2)}
          </pre>
        </SystemPanel>
      </section>
    </main>
  );
}
