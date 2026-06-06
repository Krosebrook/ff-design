import type { AgentStatus } from './types';

interface StatusMeta {
  label: string;
  dot: string;
  text: string;
  border: string;
  glow: string;
  pulse: boolean;
}

export const STATUS_META: Record<AgentStatus, StatusMeta> = {
  running: { label: 'Running',  dot: 'bg-cyan-300',    text: 'text-cyan-200',    border: 'border-cyan-300/30',    glow: 'shadow-[0_0_34px_rgba(34,211,238,0.18)]',  pulse: true  },
  success: { label: 'Verified', dot: 'bg-emerald-300', text: 'text-emerald-200', border: 'border-emerald-300/30', glow: 'shadow-[0_0_34px_rgba(16,185,129,0.16)]',  pulse: false },
  idle:    { label: 'Queued',   dot: 'bg-slate-400',   text: 'text-slate-300',   border: 'border-white/10',       glow: 'shadow-[0_0_26px_rgba(124,58,237,0.12)]',  pulse: false },
  error:   { label: 'Blocked',  dot: 'bg-pink-400',    text: 'text-pink-200',    border: 'border-pink-300/30',    glow: 'shadow-[0_0_34px_rgba(244,114,182,0.18)]', pulse: false },
};

export function statusMeta(status: AgentStatus): StatusMeta {
  return STATUS_META[status] ?? STATUS_META.idle;
}
