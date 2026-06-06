import { describe, it, expect } from 'vitest';
import { runSmokeChecks } from '../src/lib/smoke-checks';
import { initialAgents, simulatedEvents } from '../src/lib/agents-data';
import { mappedKinds } from '../src/components/agent/agentIconMap';
import type { Agent } from '../src/lib/types';

describe('runSmokeChecks', () => {
  it('all checks pass on the canonical source data', () => {
    const checks = runSmokeChecks(initialAgents, simulatedEvents, mappedKinds);
    const failed = checks.filter((c) => !c.passed);
    expect(failed).toEqual([]);
  });

  it('flags out-of-bounds progress', () => {
    const broken: Agent[] = [
      { ...initialAgents[0], progress: 150 },
      ...initialAgents.slice(1),
    ];
    const checks = runSmokeChecks(broken, simulatedEvents, mappedKinds);
    const bounds = checks.find((c) => c.name === 'Progress bounds');
    expect(bounds?.passed).toBe(false);
  });

  it('flags duplicate agent ids', () => {
    const dup: Agent[] = [
      { ...initialAgents[0] },
      { ...initialAgents[0] },
      ...initialAgents.slice(2),
    ];
    const checks = runSmokeChecks(dup, simulatedEvents, mappedKinds);
    const size = checks.find((c) => c.name === 'Agent registry size');
    expect(size?.passed).toBe(false);
  });

  it('flags events referencing unknown agents', () => {
    const orphanEvent = [
      ...simulatedEvents,
      {
        agentId: 'phantom',
        title: 'Should fail',
        detail: 'Unknown agent reference.',
        status: 'success' as const,
      },
    ];
    const checks = runSmokeChecks(initialAgents, orphanEvent, mappedKinds);
    const refs = checks.find((c) => c.name === 'Source event references');
    expect(refs?.passed).toBe(false);
  });

  it('flags missing icon map entries', () => {
    const partialMap = new Set(['orchestrator', 'planner']) as ReadonlySet<
      Parameters<typeof runSmokeChecks>[2] extends ReadonlySet<infer K> ? K : never
    >;
    const checks = runSmokeChecks(initialAgents, simulatedEvents, partialMap);
    const cov = checks.find((c) => c.name === 'Icon registry coverage');
    expect(cov?.passed).toBe(false);
  });

  it('rejects NaN progress', () => {
    const broken: Agent[] = [
      { ...initialAgents[0], progress: Number.NaN },
      ...initialAgents.slice(1),
    ];
    const checks = runSmokeChecks(broken, simulatedEvents, mappedKinds);
    const bounds = checks.find((c) => c.name === 'Progress bounds');
    expect(bounds?.passed).toBe(false);
  });
});
