import { useCallback, useEffect, useRef, useState } from 'react';
import type { Agent, ExecutionEvent } from '../lib/types';
import { initialAgents, simulatedEvents, isLegalTransition } from '../lib/agents-data';

const TICK_MS = 1700;
const TIMELINE_LIMIT = 8;

export type RuntimeState = 'running' | 'paused' | 'idle';

interface TransitionRecord { agent: string; from: string; to: string; illegal?: boolean; }

export interface RuntimeApi {
  agents: Agent[];
  events: ExecutionEvent[];
  state: RuntimeState;
  transitionLog: TransitionRecord[];
  droppedEvents: number;
  progressViolations: number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

function timestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function useSimulatedAgentRuntime(): RuntimeApi {
  const [agents, setAgents] = useState<Agent[]>(() => initialAgents.map((a) => ({ ...a })));
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [state, setState] = useState<RuntimeState>('running');
  const [transitionLog, setTransitionLog] = useState<TransitionRecord[]>([]);
  const [droppedEvents, setDroppedEvents] = useState(0);
  const [progressViolations, setProgressViolations] = useState(0);
  const cursorRef = useRef(0);
  const pendingRef = useRef(0);

  useEffect(() => {
    if (state !== 'running') return;

    const interval = window.setInterval(() => {
      pendingRef.current += 1;
      if (pendingRef.current > 1) setDroppedEvents((d) => d + 1);

      const next = simulatedEvents[cursorRef.current % simulatedEvents.length];
      const event: ExecutionEvent = {
        ...next,
        id: `${next.agentId}-${Date.now()}-${cursorRef.current}`,
        timestamp: timestamp(),
      };

      setEvents((curr) => [event, ...curr].slice(0, TIMELINE_LIMIT));
      setAgents((curr) =>
        curr.map((agent) => {
          if (agent.id !== next.agentId) return agent;

          if (!isLegalTransition(agent.status, next.status)) {
            setTransitionLog((log) =>
              [...log, { agent: agent.id, from: agent.status, to: next.status, illegal: true }].slice(-40)
            );
          } else if (agent.status !== next.status) {
            setTransitionLog((log) =>
              [...log, { agent: agent.id, from: agent.status, to: next.status }].slice(-40)
            );
          }

          if (next.progress < agent.progress) {
            setProgressViolations((v) => v + 1);
          }

          return {
            ...agent,
            status: next.status,
            progress: Math.max(agent.progress, next.progress),
            lastEvent: next.detail,
          };
        })
      );

      cursorRef.current += 1;
      pendingRef.current -= 1;
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [state]);

  const pause = useCallback(() => setState('paused'), []);
  const resume = useCallback(() => setState('running'), []);
  const reset = useCallback(() => {
    cursorRef.current = 0;
    pendingRef.current = 0;
    setState('paused');
    setTimeout(() => {
      setAgents(initialAgents.map((a) => ({ ...a })));
      setEvents([]);
      setTransitionLog([]);
      setDroppedEvents(0);
      setProgressViolations(0);
      setState('running');
    }, 16);
  }, []);

  return { agents, events, state, transitionLog, droppedEvents, progressViolations, pause, resume, reset };
}
