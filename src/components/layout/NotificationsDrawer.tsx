import { Link } from 'react-router-dom';
import { Drawer } from '../ui/Drawer';
import { Icon } from '../ui/Icon';
import type { IconName } from '../../lib/types';

const NOTIFICATIONS = [
  { kind: 'success', title: 'Skill deployed',     body: 'Audit Report Gen → MCP. HITL enabled.',     t: 'just now', icon: 'rocket'   as IconName },
  { kind: 'info',    title: 'Pipeline scheduled',  body: 'Weekly Office Loop · Fri 4pm.',             t: '5m',       icon: 'activity' as IconName },
  { kind: 'warn',    title: 'Rate limit reached',  body: 'Outreach Tracker paused for 90s.',          t: '12m',      icon: 'alert'    as IconName },
  { kind: 'info',    title: 'New audit event',     body: 'agent.retried · codegen.',                  t: '1h',       icon: 'shield'   as IconName },
  { kind: 'success', title: 'Smoke check passed',  body: 'Build artifact verified.',                  t: 'yday',     icon: 'check'    as IconName },
];

const TONE: Record<string, string> = {
  success: 'emerald',
  info:    'cyan',
  warn:    'amber',
  error:   'pink',
};

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Notifications" width={400}>
      <div className="space-y-3">
        {NOTIFICATIONS.map((n, i) => {
          const tone = TONE[n.kind];
          return (
            <div key={i} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border bg-white/5 text-${tone}-200 border-${tone}-300/25`}>
                <Icon name={n.icon} className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{n.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">{n.body}</p>
                <p className="mt-1.5 font-mono text-[10px] text-slate-600">{n.t}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 border-t border-white/8 pt-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Configure</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li><Link to="/audit"    onClick={onClose} className="text-slate-300 hover:text-white">→ Full audit log</Link></li>
          <li><Link to="/settings" onClick={onClose} className="text-slate-300 hover:text-white">→ Notification settings</Link></li>
        </ul>
      </div>
    </Drawer>
  );
}
