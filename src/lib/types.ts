export type AgentKind = 'orchestrator' | 'planner' | 'codegen' | 'security' | 'database' | 'deploy';
export type AgentStatus = 'idle' | 'running' | 'success' | 'error';

export interface Agent {
  id: string;
  name: string;
  kind: AgentKind;
  status: AgentStatus;
  description: string;
  progress: number;
  lastEvent: string;
  errorDetail?: string;
}

export interface ExecutionEvent {
  id: string;
  agentId: string;
  title: string;
  detail: string;
  status: AgentStatus;
  progress: number;
  timestamp: string;
}

export type IconName =
  | 'activity' | 'alert' | 'arrowRight' | 'brain' | 'check'
  | 'code' | 'database' | 'lock' | 'pause' | 'play' | 'reset'
  | 'rocket' | 'shield' | 'sparkles' | 'terminal' | 'zap';

export type LaneId = 'sell' | 'deliver' | 'office' | 'platform';

export interface Skill {
  id: string;
  name: string;
  lane: LaneId;
  tone: 'violet' | 'cyan' | 'amber' | 'pink' | 'emerald';
  icon: IconName;
  desc: string;
  inputs: string[];
  outputs: string[];
  runtime: string;
  complexity: 'low' | 'medium' | 'high';
}

export interface PipelineStage {
  id: string;
  name: string;
  skill?: string;
  kind: 'skill' | 'step';
  body?: string;
  hitl?: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  desc: string;
  stages: PipelineStage[];
  triggers: string[];
  runtime: string;
}

export interface AuditEvent {
  id: string;
  t: string;
  actor: string;
  action: string;
  target: string;
  kind: 'info' | 'success' | 'warn' | 'error';
}

export interface Provider {
  id: string;
  name: string;
  role: string;
  connected: boolean;
  icon: IconName;
}

export interface Lane {
  id: LaneId;
  name: string;
  tone: 'violet' | 'cyan' | 'amber' | 'emerald';
  pitch: string;
  desc: string;
}

export interface SmokeCheck {
  name: string;
  passed: boolean;
  detail: string;
}
