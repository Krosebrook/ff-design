import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SKILLS, PIPELINES } from '../lib/agents-data';
import { useToast } from '../components/ui/ToastSystem';
import { SystemPanel } from '../components/ui/SystemPanel';
import { Pill } from '../components/ui/Pill';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';

export function SkillDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const skill = SKILLS.find((s) => s.id === id);
  const [deployOpen, setDeployOpen] = useState(false);
  const { toast } = useToast();

  if (!skill) {
    return (
      <main className="ff-page mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-300">404 · skill not found</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">No record of that skill.</h1>
        <Link to="/skills" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
          <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> Back to skills
        </Link>
      </main>
    );
  }

  const usedInPipelines = PIPELINES.filter((p) => p.stages.some((st) => st.skill === skill.id));

  return (
    <main className="ff-page mx-auto max-w-6xl px-6 py-8">
      <Link to="/skills" className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <Icon name="arrowRight" className="h-3 w-3 rotate-180" /> All skills
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <SystemPanel className="relative overflow-hidden">
          <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full opacity-25 blur-3xl" style={{ background: skill.tone === 'violet' ? 'rgba(168,85,247,1)' : skill.tone === 'cyan' ? 'rgba(34,211,238,1)' : skill.tone === 'amber' ? 'rgba(245,158,11,1)' : 'rgba(244,114,182,1)' }} aria-hidden />
          <div className="relative flex items-center gap-3">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl border bg-white/[0.04] text-${skill.tone}-200 border-${skill.tone}-300/25`}>
              <Icon name={skill.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] text-slate-500">skill · {skill.id}</p>
              <h1 className="text-2xl font-semibold text-white">{skill.name}</h1>
            </div>
          </div>
          <p className="relative mt-5 max-w-2xl text-sm leading-7 text-slate-400">{skill.desc}</p>

          <div className="relative mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Inputs</p>
              <ul className="mt-2 space-y-1.5">
                {skill.inputs.map((i) => <li key={i} className="font-mono text-xs text-slate-300">· {i}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Outputs</p>
              <ul className="mt-2 space-y-1.5">
                {skill.outputs.map((o) => <li key={o} className="font-mono text-xs text-slate-300">· {o}</li>)}
              </ul>
            </div>
          </div>

          <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-[12px] leading-6 text-slate-300">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <Icon name="terminal" className="h-3 w-3" /> skill.md · preview
            </div>
            <pre className="whitespace-pre-wrap">{`---\nid: ${skill.id}\nlane: ${skill.lane}\nruntime: ${skill.runtime}\ncomplexity: ${skill.complexity}\n---\n\n# ${skill.name}\n\n${skill.desc}\n\n## Inputs\n${skill.inputs.map((i) => '- ' + i).join('\n')}\n\n## Outputs\n${skill.outputs.map((o) => '- ' + o).join('\n')}`}</pre>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => setDeployOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400">
              <Icon name="rocket" className="h-3.5 w-3.5" /> Deploy skill
            </button>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(`flashfusion skill run ${skill.id}`); toast({ title: 'Command copied', body: `flashfusion skill run ${skill.id}`, kind: 'success' }); }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              <Icon name="code" className="h-3.5 w-3.5" /> Copy run command
            </button>
          </div>
        </SystemPanel>

        <div className="space-y-5">
          <SystemPanel>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Manifest</p>
            <dl className="mt-3 space-y-2 text-sm">
              {([['Lane', skill.lane], ['Runtime', skill.runtime], ['Complexity', skill.complexity], ['Format', 'markdown'], ['MCP-ready', 'yes']] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="font-mono text-xs text-slate-200">{v}</dd>
                </div>
              ))}
            </dl>
          </SystemPanel>

          <SystemPanel>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Used in pipelines</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {usedInPipelines.map((p) => (
                <li key={p.id}>
                  <Link to={`/pipelines/${p.id}`} className="flex items-center gap-2 text-slate-300 hover:text-white">
                    <Icon name="rocket" className="h-3 w-3 text-cyan-200" /> {p.name}
                  </Link>
                </li>
              ))}
              {usedInPipelines.length === 0 && <li className="text-xs text-slate-500">— not yet wired into a pipeline</li>}
            </ul>
          </SystemPanel>
        </div>
      </div>

      <DeployModal open={deployOpen} onClose={() => setDeployOpen(false)} skillName={skill.name} skillId={skill.id} skillRuntime={skill.runtime} />
    </main>
  );
}

function DeployModal({ open, onClose, skillName, skillId, skillRuntime }: { open: boolean; onClose: () => void; skillName: string; skillId: string; skillRuntime: string }) {
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState('mcp');
  const [hitl, setHitl] = useState(true);
  const { toast } = useToast();

  const targets = [
    { id: 'mcp',     label: 'MCP server',    sub: 'Skill ships as resource + prompt',     icon: 'code'     as const },
    { id: 'sdk',     label: 'Agent SDK',     sub: 'Loaded into the agent skill list',      icon: 'brain'    as const },
    { id: 'desktop', label: 'Claude Desktop', sub: 'Personal workspace · single user',    icon: 'terminal' as const },
    { id: 'n8n',     label: 'n8n flow',      sub: 'Trigger-based, multi-step',             icon: 'rocket'   as const },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Deploy · ${skillName}`}
      size="lg"
      footer={
        <>
          {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white">Back</button>}
          {step < 3 ? (
            <button type="button" onClick={() => setStep((s) => s + 1)} className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">
              Continue <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button type="button" onClick={() => { toast({ title: `${skillName} deployed`, body: `Target: ${target.toUpperCase()} · HITL: ${hitl ? 'on' : 'off'}`, kind: 'success' }); onClose(); }} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400">
              <Icon name="check" className="h-3.5 w-3.5" /> Confirm deploy
            </button>
          )}
        </>
      }
    >
      <div className="mb-5 flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <span key={n} className="flex items-center gap-2">
            <span className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${step >= n ? 'bg-violet-500 text-white' : 'bg-white/8 text-slate-500'}`}>{n}</span>
            {n < 3 && <span className={`h-px w-8 ${step > n ? 'bg-violet-500/60' : 'bg-white/10'}`} />}
          </span>
        ))}
      </div>
      {step === 1 && (
        <div>
          <p className="text-sm text-slate-400">Pick a deploy target. The skill will be packaged as portable markdown.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {targets.map((t) => (
              <button key={t.id} type="button" onClick={() => setTarget(t.id)} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${target === t.id ? 'border-violet-300/50 bg-violet-500/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}`}>
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-cyan-200"><Icon name={t.icon} className="h-4 w-4" /></span>
                <div><p className="text-sm font-semibold text-white">{t.label}</p><p className="mt-0.5 text-xs text-slate-400">{t.sub}</p></div>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <p className="text-sm text-slate-400">Configure guardrails. HITL gates pause the agent for your approval before irreversible output.</p>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
              <input type="checkbox" checked={hitl} onChange={(e) => setHitl(e.target.checked)} className="mt-0.5 h-4 w-4 accent-violet-500" />
              <div><p className="text-sm font-semibold text-white">Require HITL approval</p><p className="mt-0.5 text-xs text-slate-400">Pause and wait for sign-off before producing irreversible outputs.</p></div>
            </label>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <p className="text-sm text-slate-400">Review and confirm. The package will be written to the registry.</p>
          <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs">
            <div className="flex justify-between"><span className="text-slate-500">skill</span><span className="text-white">{skillId}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">target</span><span className="text-cyan-200">{target.toUpperCase()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">hitl</span><span className={hitl ? 'text-emerald-200' : 'text-pink-200'}>{hitl ? 'enabled' : 'disabled'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">runtime</span><span className="text-slate-300">{skillRuntime}</span></div>
          </div>
        </div>
      )}
    </Modal>
  );
}
