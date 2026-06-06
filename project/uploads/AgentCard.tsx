import { motion } from 'framer-motion';
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
  const showGlow = agent.status === 'running'; // Glow is earned. Running only.

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className={`glass-card glass-card--interactive p-5 border-l-2 ${meta.border} ${
        showGlow ? 'shadow-[var(--glow-subtle)]' : ''
      }`}
      aria-labelledby={`agent-${agent.id}-name`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--surface-raised)]/50 p-2.5 text-[var(--accent-cyan)]">
            <Icon name={iconName} className="h-5 w-5" />
          </div>
          <div>
            <h3
              id={`agent-${agent.id}-name`}
              className="font-[var(--font-heading)] text-base font-semibold text-[var(--text-primary)]"
            >
              {agent.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden />
              <span className={`text-xs font-medium ${meta.text}`}>{meta.label}</span>
            </div>
          </div>
        </div>
        {agent.status === 'success' ? (
          <Icon name="check" className="h-5 w-5 text-emerald-300" labelled title="Verified" />
        ) : null}
        {agent.status === 'error' ? (
          <Icon name="alert" className="h-5 w-5 text-pink-300" labelled title="Blocked" />
        ) : null}
      </header>

      <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{agent.description}</p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>Execution</span>
          <span aria-live="polite" aria-atomic="true">
            {agent.progress}%
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-white/5"
          role="progressbar"
          aria-valuenow={agent.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${agent.name} execution progress`}
        >
          <motion.div
            className="h-full rounded-full gradient-fill"
            initial={{ width: 0 }}
            animate={{ width: `${agent.progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 text-xs text-[var(--text-secondary)]">
        {agent.lastEvent}
      </div>

      {agent.status === 'error' && agent.errorDetail ? (
        <div className="mt-3 rounded-lg border border-pink-300/30 bg-[var(--color-error-bg)] p-3 text-xs text-pink-200">
          <p className="font-semibold">Error detail</p>
          <p className="mt-1 leading-5">{agent.errorDetail}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={() => onRetry(agent.id)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-pink-300/40 bg-pink-300/10 px-2.5 py-1 text-xs font-medium text-pink-100 transition hover:bg-pink-300/20"
            >
              <Icon name="reset" className="h-3 w-3" /> Retry
            </button>
          ) : null}
        </div>
      ) : null}
    </motion.article>
  );
}
