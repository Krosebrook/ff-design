import type { SmokeCheck } from '../../lib/types';
import { SystemPanel } from '../ui/SystemPanel';
import { Icon } from '../ui/Icon';

interface SmokeCheckPanelProps {
  checks: SmokeCheck[];
}

export function SmokeCheckPanel({ checks }: SmokeCheckPanelProps) {
  const failed = checks.filter((c) => !c.passed);
  return (
    <SystemPanel>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/70">Runtime smoke checks</p>
          <h2 className="mt-1 text-xl font-semibold text-white">State-machine integrity</h2>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`rounded-full px-3 py-1 text-xs font-semibold ${failed.length === 0 ? 'bg-emerald-300/10 text-emerald-200' : 'bg-pink-300/10 text-pink-200'}`}
        >
          {failed.length === 0 ? 'All passing' : `${failed.length} failing`}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {checks.map((check) => (
          <div key={check.name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-2">
              <Icon name={check.passed ? 'check' : 'alert'} className={`h-4 w-4 ${check.passed ? 'text-emerald-300' : 'text-pink-300'}`} />
              <p className="text-sm font-medium text-white">{check.name}</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{check.detail}</p>
          </div>
        ))}
      </div>
    </SystemPanel>
  );
}
