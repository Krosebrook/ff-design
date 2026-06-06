import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

interface HeroProps {
  completed: number;
  running: number;
}

export function Hero({ completed, running }: HeroProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-16 text-center md:pt-24">
      <div className="absolute left-1/2 top-8 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" aria-hidden />

      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
        <Icon name="sparkles" className="h-4 w-4" />
        <span>FlashFusion Agentic Execution Layer</span>
      </div>

      <h1 className="mx-auto max-w-5xl text-balance text-5xl font-semibold tracking-tight text-white md:text-7xl">
        Transform intent into{' '}
        <span className="gradient-text">production systems.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
        FlashFusion coordinates specialized agents across planning, code generation, security, database design, and deployment — so the interface shows real execution, not decorative automation theater.
      </p>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Specialized</p>
          <p className="mt-2 text-3xl font-semibold text-white">6</p>
          <p className="mt-1 text-sm text-slate-400">agents in the fleet</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Live</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-100" aria-live="polite">{running}</p>
          <p className="mt-1 text-sm text-slate-400">currently running</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-200/70">Verified</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-100" aria-live="polite">{completed}</p>
          <p className="mt-1 text-sm text-slate-400">outputs this run</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link to="/console" className="inline-flex items-center gap-2 rounded-xl gradient-fill px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-primary)] transition hover:opacity-95">
          Open console <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
        <Link to="/skills" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
          Browse skills
        </Link>
      </div>
    </section>
  );
}
