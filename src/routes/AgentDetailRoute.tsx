import { Link, useParams } from 'react-router-dom';
import { useSimulatedAgentRuntime } from '../hooks/useSimulatedAgentRuntime';
import { statusMeta } from '../lib/statusMeta';
import { agentIconMap } from '../components/agent/agentIconMap';
import { Icon } from '../components/ui/Icon';
import { SystemPanel } from '../components/ui/SystemPanel';
import { Pill } from '../components/ui/Pill';
import type { AgentKind } from '../lib/types';

export function AgentDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const { agents } = useSimulatedAgentRuntime();
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <main className="ff-page mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-300">404 · agent not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">No record of that agent.</h1>
        <Link to="/agents" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400">
          <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> Back to agents
        </Link>
      </main>
    );
  }

  const meta = statusMeta(agent.status);
  const iconName = agentIconMap[agent.kind as AgentKind];
  const spark = Array.from({ length: 18 }, (_, i) =>
    4 + Math.round(3.5 * Math.sin(i * 0.6 + agent.progress * 0.04) + Math.cos(i * 0.3) * 2)
  );
  const maxSpark = Math.max(...spark);

  const PERMISSIONS = [
    ['Read',       'skill library, audit log'],
    ['Write',      'agent_runs, agent_events'],
    ['Network',    'MCP transport only'],
    ['HITL gate',  agent.kind === 'codegen' || agent.kind === 'deploy' ? 'Required for prod targets' : 'None'],
  ] as const;

  const WIRED_TO = [
    { label: 'MCP',       tone: 'cyan' as const,    always: true },
    { label: 'Agent SDK', tone: 'violet' as const,  always: true },
    { label: 'n8n',       tone: 'emerald' as const, show: agent.kind === 'deploy' },
    { label: 'Supabase',  tone: 'emerald' as const, show: agent.kind === 'database' },
    { label: 'Guardrails',tone: 'pink' as const,    show: agent.kind === 'security' },
  ];

  return (
    <main className="ff-page mx-auto max-w-6xl px-6 py-8">
      <Link to="/agents" className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <Icon name="arrowRight" className="h-3 w-3 rotate-180" /> All agents
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <SystemPanel className="relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(124,58,237,0.5), transparent)' }} aria-hidden />
          <div className="relative flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
              <Icon name={iconName} className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-white">{agent.name}</h1>
              <p className="text-xs text-slate-500">id: <span className="font-mono text-slate-300">{agent.id}</span></p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${meta.border} ${meta.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${meta.pulse ? 'ff-dot-pulse' : ''}`} aria-hidden />
              {meta.label}
            </span>
          </div>

          <p className="relative mt-5 text-sm leading-7 text-slate-400">{agent.description}</p>

          <div className="relative mt-6">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Execution</span>
              <span>{agent.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={agent.progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-all duration-500" style={{ width: `${agent.progress}%` }} />
            </div>
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-slate-400">
            <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Last event</p>
            {agent.lastEvent}
          </div>
        </SystemPanel>

        <div className="space-y-5">
          <SystemPanel>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Recent activity</p>
            <p className="mt-1 text-sm text-slate-400">Last 18 ticks · normalized</p>
            <div className="mt-4 flex items-end gap-1" aria-label="Activity sparkline" role="img">
              {spark.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-cyan-400/60 transition-all duration-300"
                  style={{ height: `${Math.round((v / maxSpark) * 48)}px` }}
                />
              ))}
            </div>
          </SystemPanel>

          <SystemPanel>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Permissions</p>
            <ul className="mt-3 space-y-2 text-sm">
              {PERMISSIONS.map(([k, v]) => (
                <li key={k} className="flex items-start justify-between gap-3">
                  <span className="text-slate-300">{k}</span>
                  <span className="text-right text-xs text-slate-500">{v}</span>
                </li>
              ))}
            </ul>
          </SystemPanel>

          <SystemPanel>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Wired to</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {WIRED_TO.filter((w) => w.always || w.show).map((w) => (
                <Pill key={w.label} tone={w.tone}>{w.label}</Pill>
              ))}
            </div>
          </SystemPanel>
        </div>
      </div>
    </main>
  );
}
