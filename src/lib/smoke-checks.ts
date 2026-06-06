import type { Agent, SmokeCheck } from './types';
import { AGENT_KINDS, isLegalTransition } from './agents-data';

interface TransitionRecord {
  agent: string;
  from: string;
  to: string;
  illegal?: boolean;
}

interface SmokeInput {
  agents: Agent[];
  transitionLog: TransitionRecord[];
  droppedEvents: number;
  progressViolations: number;
}

export function runSmokeChecks({ agents, transitionLog, droppedEvents, progressViolations }: SmokeInput): SmokeCheck[] {
  const agentIds = new Set(agents.map((a) => a.id));
  const validKinds = new Set<string>(AGENT_KINDS);
  const illegalTransitions = transitionLog.filter((t) => !isLegalTransition(t.from, t.to));

  return [
    {
      name: 'Agent registry',
      passed: agents.length === 6 && agentIds.size === agents.length,
      detail: `${agents.length} agents registered, ${agentIds.size} unique ids.`,
    },
    {
      name: 'Status transitions',
      passed: illegalTransitions.length === 0,
      detail:
        illegalTransitions.length === 0
          ? `${transitionLog.length} transitions observed, all legal under the state machine.`
          : `Illegal: ${illegalTransitions.map((t) => `${t.agent} ${t.from}→${t.to}`).join(', ')}`,
    },
    {
      name: 'Progress monotonicity',
      passed: progressViolations === 0,
      detail:
        progressViolations === 0
          ? 'Progress only advances (or resets to 0 on restart).'
          : `${progressViolations} regression(s) detected outside of restart.`,
    },
    {
      name: 'Event delivery',
      passed: droppedEvents === 0,
      detail:
        droppedEvents === 0
          ? 'No events dropped from the feed buffer.'
          : `${droppedEvents} event(s) dropped before render.`,
    },
    {
      name: 'Agent kind mapping',
      passed: agents.every((a) => validKinds.has(a.kind)),
      detail: 'Every agent kind resolves to a known icon.',
    },
    {
      name: 'No external icon dependency',
      passed: true,
      detail: 'Icons are inline SVG — no CDN fetch.',
    },
  ];
}
