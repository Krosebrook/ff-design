import type { RuntimeState } from '../../hooks/useSimulatedAgentRuntime';
import { SystemPanel } from '../ui/SystemPanel';
import { Icon } from '../ui/Icon';

interface CommandInputProps {
  state: RuntimeState;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function CommandInput({ state, onPause, onResume, onReset }: CommandInputProps) {
  const isRunning = state === 'running';
  return (
    <SystemPanel className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.18),transparent_34%)]" aria-hidden />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="ff-command" className="mb-2 block text-xs uppercase tracking-[0.28em] text-cyan-200/70">Command</label>
          <div id="ff-command" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-sm text-slate-300">
            Build a secure AI agent workspace with live orchestration, deployment visibility, and cinematic execution UI.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={isRunning ? onPause : onResume}
            aria-pressed={isRunning}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.34)] transition hover:bg-violet-400 focus-visible:ring-2 focus-visible:ring-cyan-300/70"
          >
            <Icon name={isRunning ? 'pause' : 'play'} className="h-4 w-4" />
            {isRunning ? 'Pause runtime' : 'Resume runtime'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Restart
          </button>
        </div>
      </div>
    </SystemPanel>
  );
}
