import type { Agent } from '../../lib/types';
import { statusMeta } from '../../lib/statusMeta';
import { Icon } from '../ui/Icon';
import { agentIconMap } from './agentIconMap';

interface AgentCardProps {
  agent: Agent;
  onRetry?: (agentId: string) => void;
}

export function AgentCard({ agent, onRetry }: AgentCardProps) {
  const meta = statusMeta(agent.status);
  const iconName = agentIconMap[agent.kind];

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border ${meta.border} ${meta.glow} bg-[#0B0F1A]/85 p-5 backdrop-blur-xl transition-transform hover:-translate-y-1`}
      aria-labelledby={`agent-${agent.id}-name`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),transparent_38%)]" aria-hidden />

      <header className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200">
            <Icon name={iconName} className="h-5 w-5" />
          </div>
          <div>
            <h3 id={`agent-${agent.id}-name`} className="text-base font-semibold text-white">{agent.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${meta.dot} ${meta.pulse ? 'ff-dot-pulse' : ''}`} aria-hidden />
              <span className={`text-xs font-medium ${meta.text}`}>{meta.label}</span>
            </div>
          </div>
        </div>
        {agent.status === 'success' && <Icon name="check" className="h-5 w-5 text-emerald-300" labelled title="Verified" />}
        {agent.status === 'error'   && <Icon name="alert" className="h-5 w-5 text-pink-300"    labelled title="Blocked"  />}
      </header>

      <p className="relative mt-4 text-sm leading-6 text-slate-400">{agent.description}</p>

      <div className="relative mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Execution</span>
          <span aria-live="polite" aria-atomic>{agent.progress}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-white/5"
          role="progressbar"
          aria-valuenow={agent.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${agent.name} execution progress`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-all duration-500 ease-out"
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      </div>

      <div className="relative mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-400">
        {agent.lastEvent}
      </div>

      {agent.status === 'error' && agent.errorDetail && (
        <div className="relative mt-3 rounded-lg border border-pink-300/30 bg-[var(--color-error-bg)] p-3 text-xs text-pink-200">
          <p className="font-semibold">Error detail</p>
          <p className="mt-1 leading-5">{agent.errorDetail}</p>
          {onRetry && (
            <button type="button" onClick={() => onRetry(agent.id)} className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-pink-300/40 bg-pink-300/10 px-2.5 py-1 text-xs font-medium text-pink-100 transition hover:bg-pink-300/20">
              <Icon name="reset" className="h-3 w-3" /> Retry
            </button>
          )}
        </div>
      )}
    </article>
  );
}
