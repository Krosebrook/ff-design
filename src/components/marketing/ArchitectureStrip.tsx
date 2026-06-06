import { Icon } from '../ui/Icon';

const STEPS = ['Intent', 'Plan', 'Generate', 'Secure', 'Deploy'];

export function ArchitectureStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm text-violet-100">{i + 1}</span>
            <span className="text-sm font-medium text-white">{step}</span>
            {i < STEPS.length - 1 && <Icon name="arrowRight" className="ml-auto hidden h-4 w-4 text-slate-600 md:block" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
