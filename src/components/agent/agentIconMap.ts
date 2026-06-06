import type { AgentKind, IconName } from '../../lib/types';

export const agentIconMap: Record<AgentKind, IconName> = {
  orchestrator: 'brain',
  planner:      'activity',
  codegen:      'code',
  security:     'shield',
  database:     'database',
  deploy:       'rocket',
};

export const mappedKinds = new Set<string>(Object.keys(agentIconMap));
