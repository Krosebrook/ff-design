import { Link } from 'react-router-dom';
import { Hero } from '../components/marketing/Hero';
import { ArchitectureStrip } from '../components/marketing/ArchitectureStrip';
import { Icon } from '../components/ui/Icon';

/**
 * Public marketing surface. Read-only. No simulator, no debug tells.
 * Stats are intentionally static — running/completed are seeded values
 * representing aggregate platform metrics, not the visitor's session.
 */
export function HomeRoute() {
  return (
    <main className="min-h-screen pb-20">
      <Hero completed={142} running={3} />
      <ArchitectureStrip />

      <section className="mx-auto mt-8 max-w-3xl px-6 text-center">
        <Link
          to="/console"
          className="inline-flex items-center gap-2 rounded-lg gradient-fill px-6 py-3 font-[var(--font-heading)] text-sm font-semibold text-white shadow-[var(--glow-primary)] transition hover:opacity-95"
        >
          Open console <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs text-[var(--text-tertiary)]">
          Live execution view — agents, timeline, runtime controls.
        </p>
      </section>
    </main>
  );
}
