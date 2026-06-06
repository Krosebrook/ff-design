import { SystemPanel } from '../ui/SystemPanel';
import { Icon } from '../ui/Icon';

const ROWS: [string, string][] = [
  ['agents',       'Agent registry, role, status, limits'],
  ['agent_runs',   'One execution request from prompt to deployment'],
  ['agent_events', 'Realtime progress events for timeline UI'],
  ['audit_logs',   'Security-sensitive action history'],
];

export function BackendBlueprint() {
  return (
    <SystemPanel>
      <div className="mb-5 flex items-center gap-3">
        <Icon name="lock" className="h-5 w-5 text-cyan-200" />
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Reference architecture</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Production Data Model</h2>
        </div>
      </div>
      <div className="space-y-3">
        {ROWS.map(([table, purpose]) => (
          <div key={table} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="font-mono text-sm text-cyan-100">{table}</p>
            <p className="mt-1 text-sm text-slate-400">{purpose}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100/90">
        Wire to Supabase Realtime or Socket.IO after auth, RLS, validation, and rate limits are active.
      </p>
    </SystemPanel>
  );
}
