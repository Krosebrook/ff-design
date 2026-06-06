import { useMemo } from 'react';
import { Hero } from '../components/marketing/Hero';
import { ArchitectureStrip } from '../components/marketing/ArchitectureStrip';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';

export function HomeRoute() {
  const { agents } = useSimulatedAgentRuntime();
  const running   = useMemo(() => agents.filter((a) => a.status === 'running').length,  [agents]);
  const completed = useMemo(() => agents.filter((a) => a.status === 'success').length, [agents]);

  return (
    <main className="ff-page min-h-screen pb-20">
      <Hero completed={completed} running={running} />
      <ArchitectureStrip />
    </main>
  );
}
