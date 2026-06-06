import { Link } from 'react-router-dom';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';
import { AgentCard } from '../components/agent/AgentCard';
import { SectionHead } from '../components/ui/SectionHead';
import { Pill } from '../components/ui/Pill';

export function AgentsRoute() {
  const { agents } = useSimulatedAgentRuntime();

  return (
    <main className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="The Fleet"
        title="Six specialized agents"
        sub="Each agent owns one phase of the execution graph. Click any card to inspect runs, config, and deploy targets."
        right={<Pill tone="violet">{agents.length} agents</Pill>}
      />
      <div className="ff-stagger grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Link key={agent.id} to={`/agents/${agent.id}`} className="ff-hover-lift block rounded-2xl">
            <AgentCard agent={agent} />
          </Link>
        ))}
      </div>
    </main>
  );
}
