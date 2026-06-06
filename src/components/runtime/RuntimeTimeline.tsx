import type { ExecutionEvent } from '../../lib/types';
import { statusMeta } from '../../lib/statusMeta';
import { SystemPanel } from '../ui/SystemPanel';
import { Icon } from '../ui/Icon';

interface RuntimeTimelineProps {
  events: ExecutionEvent[];
}

export function RuntimeTimeline({ events }: RuntimeTimelineProps) {
  return (
    <SystemPanel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Execution Feed</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Live Agent Timeline</h2>
        </div>
        <Icon name="terminal" className="h-5 w-5 text-violet-200" />
      </div>
      <div className="space-y-3" aria-live="polite" aria-relevant="additions" aria-label="Live agent execution events">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-400">
            Waiting for the first orchestration event…
          </div>
        ) : (
          events.map((event) => {
            const meta = statusMeta(event.status);
            return (
              <div key={event.id} className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                <span className="whitespace-nowrap text-xs tabular-nums text-slate-500">{event.timestamp}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} aria-hidden />
                    <p className="truncate text-sm font-medium text-white">{event.title}</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{event.detail}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SystemPanel>
  );
}
