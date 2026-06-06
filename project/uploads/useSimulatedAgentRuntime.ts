import { useCallback, useEffect, useRef, useState } from 'react';
import type { Agent, ExecutionEvent } from '../lib/types';
import { initialAgents, simulatedEvents, type SimulatedEvent } from '../lib/agents-data';

const TICK_MS = 1700;
const TIMELINE_LIMIT = 8;
const RUNNING_PROGRESS_CAP = 88;
const RUNNING_PROGRESS_STEP = 24;

export type RuntimeState = 'running' | 'paused' | 'idle';

export interface RuntimeApi {
  agents: Agent[];
  events: ExecutionEvent[];
  state: RuntimeState;
  /** Pause without losing progress. */
  pause: () => void;
  /** Resume from current cursor. */
  resume: () => void;
  /** Hard reset — restore initialAgents, clear events, rewind cursor. */
  reset: () => void;
}

function timestamp(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function applyEventToAgents(agents: Agent[], next: SimulatedEvent): Agent[] {
  return agents.map((agent) => {
    if (agent.id !== next.agentId) return agent;
    const nextProgress =
      next.status === 'success'
        ? 100
        : Math.min(agent.progress + RUNNING_PROGRESS_STEP, RUNNING_PROGRESS_CAP);
    return {
      ...agent,
      status: next.status,
      progress: nextProgress,
      lastEvent: next.detail,
    };
  });
}

export function useSimulatedAgentRuntime(): RuntimeApi {
  const [agents, setAgents] = useState<Agent[]>(() => initialAgents.map((a) => ({ ...a })));
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [state, setState] = useState<RuntimeState>('running');
  const cursorRef = useRef(0);

  useEffect(() => {
    if (state !== 'running') return;

    const interval = window.setInterval(() => {
      const next = simulatedEvents[cursorRef.current % simulatedEvents.length];
      const event: ExecutionEvent = {
        ...next,
        id: `${next.agentId}-${Date.now()}-${cursorRef.current}`,
        timestamp: timestamp(),
      };

      setEvents((current) => [event, ...current].slice(0, TIMELINE_LIMIT));
      setAgents((current) => applyEventToAgents(current, next));

      cursorRef.current += 1;
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [state]);

  const pause = useCallback(() => setState('paused'), []);
  const resume = useCallback(() => setState('running'), []);
  const reset = useCallback(() => {
    cursorRef.current = 0;
    setAgents(initialAgents.map((a) => ({ ...a })));
    setEvents([]);
    setState('running');
  }, []);

  return { agents, events, state, pause, resume, reset };
}
