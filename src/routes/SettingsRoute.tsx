import { useState } from 'react';
import { PROVIDERS } from '../lib/agents-data';
import { useToast } from '../components/ui/ToastSystem';
import { SectionHead } from '../components/ui/SectionHead';
import { Tabs } from '../components/ui/Tabs';
import { SystemPanel } from '../components/ui/SystemPanel';
import { Icon } from '../components/ui/Icon';

type SettingsTab = 'providers' | 'appearance' | 'keys';

export function SettingsRoute() {
  const [tab, setTab] = useState<SettingsTab>('providers');
  const { toast } = useToast();

  const tabs = [
    { id: 'providers',  label: 'Providers',  count: PROVIDERS.length },
    { id: 'appearance', label: 'Appearance'  },
    { id: 'keys',       label: 'API keys'    },
  ];

  return (
    <main className="ff-page mx-auto max-w-5xl px-6 py-8">
      <SectionHead
        eyebrow="Settings"
        title="Configure the operator"
        sub="Manage providers, keys, and the appearance of the workspace."
      />
      <Tabs tabs={tabs} value={tab} onChange={(v) => setTab(v as SettingsTab)} />

      <div className="mt-6">
        {tab === 'providers' && (
          <div className="ff-stagger grid grid-cols-1 gap-3 md:grid-cols-2">
            {PROVIDERS.map((p) => (
              <SystemPanel key={p.id} className="flex items-center gap-4 p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-cyan-200">
                  <Icon name={p.icon} className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast({ title: p.connected ? `${p.name} disconnected` : `${p.name} connected`, kind: p.connected ? 'warn' : 'success' })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${p.connected ? 'border-emerald-300/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'}`}
                >
                  {p.connected ? 'Connected' : 'Connect'}
                </button>
              </SystemPanel>
            ))}
          </div>
        )}

        {tab === 'appearance' && (
          <SystemPanel>
            <p className="text-sm text-slate-400">Workspace appearance follows the FlashFusion dark theme. Future: light mode and high-contrast.</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {([['Dark', 'default', true], ['High contrast', 'wip', false], ['Light', 'wip', false]] as const).map(([label, sub, on]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => !on && toast({ title: 'Theme not yet available', kind: 'info' })}
                  className={`rounded-xl border p-4 text-left transition ${on ? 'border-violet-300/40 bg-violet-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}
                >
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </button>
              ))}
            </div>
          </SystemPanel>
        )}

        {tab === 'keys' && (
          <SystemPanel>
            <p className="text-sm text-slate-400">API keys are masked. Use the rotate button to roll a new value — the old one stays valid for 24h.</p>
            <ul className="mt-4 space-y-2.5">
              {([['FF_API_KEY', 'ff_live_••••••••••••a91c'], ['MCP_TRANSPORT_TOKEN', 'mcp_••••••••3b21'], ['SUPABASE_SERVICE', 'sb_••••••••0e44']] as const).map(([k, v]) => (
                <li key={k} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="font-mono text-[12px] text-slate-400">{k}</span>
                  <span className="font-mono text-[12px] text-slate-200">{v}</span>
                  <div className="ml-auto flex gap-2">
                    <button type="button" onClick={() => toast({ title: 'Copied', kind: 'success' })} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10">Copy</button>
                    <button type="button" onClick={() => toast({ title: 'Key rotated', body: 'New key issued. Old key valid 24h.', kind: 'warn' })} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10">Rotate</button>
                  </div>
                </li>
              ))}
            </ul>
          </SystemPanel>
        )}
      </div>
    </main>
  );
}
