/* FlashFusion Canvas — pages & child pages.
 * ConsolePage / AgentsPage(+ detail) / SkillsPage(+ detail) /
 * PipelinesPage(+ detail) / AuditPage / SettingsPage / NotFound.
 */
const { useEffect: pUseEffect, useState: pUseState, useMemo: pUseMemo, useRef: pUseRef } = React;

/* ═══════════════════════════════════════════════════════════════════════
   CONSOLE PAGE — wraps existing live runtime
   ═══════════════════════════════════════════════════════════════════════ */
function ConsolePage() {
  const {
    agents, events, isRunning, setIsRunning, restart,
    transitionLog, droppedEvents, progressViolations
  } = useSimulatedAgentRuntime();
  const { toast } = useToast();

  const completed = pUseMemo(() => agents.filter(a => a.status === "success").length, [agents]);
  const running   = pUseMemo(() => agents.filter(a => a.status === "running").length, [agents]);
  const intensity = pUseMemo(() => Math.max(0.6, running / 3 + completed / 8), [running, completed]);
  const smokeChecks = pUseMemo(
    () => runSmokeChecks({ agents, transitionLog, droppedEvents, progressViolations }),
    [agents, transitionLog, droppedEvents, progressViolations]
  );

  // Context menu state for agent cards
  const [ctx, setCtx] = pUseState({ open: false, anchor: null, agent: null });
  const onAgentContext = (e, agent) => {
    e.preventDefault();
    setCtx({ open: true, anchor: { x: e.clientX, y: e.clientY }, agent });
  };

  return (
    <div className="ff-page mx-auto max-w-7xl px-6 pb-12 pt-6">
      <ConsoleHero completed={completed} running={running} />
      <ArchitectureStrip />

      <section className="py-4">
        <CommandInput
          isRunning={isRunning}
          onToggle={() => { setIsRunning(r => !r); toast({ title: isRunning ? "Runtime paused" : "Runtime resumed", kind: isRunning ? "warn" : "success" }); }}
          onRestart={() => { restart(); toast({ title: "Runtime restarted", body: "All agents reset to initial state.", kind: "info" }); }}
        />
      </section>

      <section className="py-4" aria-hidden="true">
        <DataFlowLine intensity={intensity} />
      </section>

      <section className="ff-stagger grid grid-cols-1 gap-5 py-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Agent fleet">
        {agents.map(agent => (
          <div key={agent.id} onContextMenu={(e) => onAgentContext(e, agent)}>
            <AgentCard agent={agent} />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <RuntimeTimeline events={events} />
        <BackendBlueprint />
      </section>

      <section className="pb-6">
        <SmokeCheckPanel checks={smokeChecks} />
      </section>

      <ContextMenu
        open={ctx.open}
        anchor={ctx.anchor}
        onClose={() => setCtx({ open: false, anchor: null, agent: null })}
        items={[
          { label: "Open agent",  icon: "arrowRight", onClick: () => { window.location.hash = `#/agents/${ctx.agent?.id}`; } },
          { label: "Rerun",       icon: "play",  kbd: "R",  onClick: () => toast({ title: `Rerun queued · ${ctx.agent?.name}`, kind: "info" }) },
          { label: "Pause",       icon: "zap",   onClick: () => toast({ title: `${ctx.agent?.name} paused`, kind: "warn" }) },
          { divider: true },
          { label: "View logs",   icon: "terminal", onClick: () => toast({ title: "Logs panel", body: "Open Audit log for full history." }) },
          { label: "Disconnect",  icon: "alert", danger: true, onClick: () => toast({ title: `Disconnected ${ctx.agent?.name}`, kind: "error" }) },
        ]}
      />
    </div>
  );
}

function ConsoleHero({ completed, running }) {
  return (
    <section className="relative pt-2 text-center">
      <GlowOrb size={520} color="rgba(124,58,237,0.32)" style={{ left: "50%", top: "-40px", transform: "translateX(-50%)" }} />
      <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
        <Icon name="sparkles" className="h-4 w-4" />
        <span>FlashFusion Agentic Execution Layer</span>
      </div>
      <h1 className="mx-auto max-w-5xl text-balance text-5xl font-semibold tracking-tight text-white md:text-6xl">
        Transform intent into <span className="bg-gradient-to-r from-violet-300 via-pink-200 to-cyan-300 bg-clip-text text-transparent">production systems</span>.
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-400">
        Six specialized agents coordinate across planning, code, security, data and deploy. The interface shows real execution — no automation theater.
      </p>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 md:grid-cols-3">
        <Panel className="p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Specialized</p>
          <p className="mt-2 text-3xl font-semibold text-white"><CountUp value={6} /></p>
          <p className="mt-1 text-sm text-slate-400">agents in the fleet</p>
        </Panel>
        <Panel className="p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Live</p>
          <p className="mt-2 text-3xl font-semibold text-cyan-100"><CountUp value={running} /></p>
          <p className="mt-1 text-sm text-slate-400">currently running</p>
        </Panel>
        <Panel className="p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-200/70">Verified</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-100"><CountUp value={completed} /></p>
          <p className="mt-1 text-sm text-slate-400">outputs this run</p>
        </Panel>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   AGENTS PAGE — list
   ═══════════════════════════════════════════════════════════════════════ */
function AgentsPage({ navigate }) {
  const { agents } = useSimulatedAgentRuntime();
  return (
    <div className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="The Fleet"
        title="Six specialized agents"
        sub="Each agent owns one phase of the execution graph. Click any card to inspect runs, config and deploy targets."
        right={<Pill tone="violet">{agents.length} agents</Pill>}
      />
      <div className="ff-stagger grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {agents.map(a => (
          <a key={a.id} href={`#/agents/${a.id}`} className="ff-hover-lift block rounded-2xl">
            <AgentCard agent={a} />
          </a>
        ))}
      </div>
    </div>
  );
}

function AgentDetailPage({ id, navigate }) {
  const { agents, events } = useSimulatedAgentRuntime();
  const { toast } = useToast();
  const agent = agents.find(a => a.id === id);
  if (!agent) return <NotFound back="#/agents" />;
  const meta = STATUS_META[agent.status];
  const lastEvents = events.filter(e => e.id.startsWith(agent.id)).slice(0, 6);
  // Synthetic "intensity" — last-7 mini chart from a deterministic sin
  const spark = Array.from({ length: 18 }, (_, i) => 4 + Math.round(3.5 * Math.sin(i * 0.6 + agent.progress * 0.04) + Math.cos(i * 0.3) * 2));

  return (
    <div className="ff-page mx-auto max-w-6xl px-6 py-8">
      <a href="#/agents" className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        All agents
      </a>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="relative overflow-hidden p-7">
          <GlowOrb size={300} color="rgba(124,58,237,0.32)" style={{ right: -60, top: -60 }} />
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
              <Icon name={agent.kind === "orchestrator" ? "brain" : agent.kind === "planner" ? "activity" : agent.kind === "codegen" ? "code" : agent.kind === "security" ? "shield" : agent.kind === "database" ? "database" : "rocket"} className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-white">{agent.name}</h1>
              <p className="text-xs text-slate-500">id: <span className="font-mono text-slate-300">{agent.id}</span></p>
            </div>
            <StatusDot status={agent.status} withLabel />
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-400">{agent.description}</p>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Execution</span><span><CountUp value={agent.progress} format={v => v + "%"} /></span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-all duration-500" style={{ width: `${agent.progress}%` }} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-slate-400">
            <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Last event</p>
            {agent.lastEvent}
          </div>

          <div className="mt-6 flex gap-2">
            <Ripple
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400"
              onClick={() => toast({ title: `Rerun queued · ${agent.name}`, body: "The orchestrator will pick this up at the next tick.", kind: "info" })}
            ><Icon name="play" className="h-3.5 w-3.5" />Rerun agent</Ripple>
            <Ripple
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => toast({ title: "Config saved", kind: "success" })}
            ><Icon name="lock" className="h-3.5 w-3.5" />Save config</Ripple>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Recent activity</p>
            <p className="mt-1 text-sm text-slate-400">Last 18 ticks · normalized</p>
            <div className="mt-3"><Sparkline data={spark} height={48} color="#22D3EE" /></div>
          </Panel>
          <Panel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Permissions</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[["Read", "skill library, audit log"], ["Write", "agent_runs, agent_events"], ["Network", "MCP transport only"], ["HITL gate", agent.kind === "codegen" || agent.kind === "deploy" ? "Required for prod targets" : "None"]].map(([k, v]) => (
                <li key={k} className="flex items-start justify-between gap-3">
                  <span className="text-slate-300">{k}</span>
                  <span className="text-right text-xs text-slate-500">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Wired to</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone="cyan">MCP</Pill>
              <Pill tone="violet">Agent SDK</Pill>
              {agent.kind === "deploy" ? <Pill tone="emerald">n8n</Pill> : null}
              {agent.kind === "database" ? <Pill tone="emerald">Supabase</Pill> : null}
              {agent.kind === "security" ? <Pill tone="pink">Guardrails</Pill> : null}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SKILLS PAGE — 16 skill grid with lane filter
   ═══════════════════════════════════════════════════════════════════════ */
function SkillsPage({ navigate }) {
  // Parse `?lane=` out of hash
  const hash = window.location.hash;
  const initialLane = (hash.match(/lane=([a-z]+)/) || [])[1] || "all";
  const [lane, setLane] = pUseState(initialLane);
  const [q, setQ] = pUseState("");

  const filtered = pUseMemo(() => SKILLS.filter(s => {
    const laneOk = lane === "all" || s.lane === lane;
    const qq = q.trim().toLowerCase();
    const qOk = !qq || s.name.toLowerCase().includes(qq) || s.desc.toLowerCase().includes(qq);
    return laneOk && qOk;
  }), [lane, q]);

  const tabs = [
    { id: "all",      label: "All",      count: SKILLS.length },
    ...LANES.map(l => ({ id: l.id, label: l.name, count: SKILLS.filter(s => s.lane === l.id).length }))
  ];

  return (
    <div className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="The Library"
        title="Sixteen skills. One operator."
        sub="Every skill is portable markdown — MCP-ready, runs anywhere Claude lives. Filter by lane, search by intent."
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search skills…"
                className="w-56 rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-300/50"
              />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-2.5 top-2.5 text-slate-500"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            </div>
          </div>
        }
      />

      <Tabs tabs={tabs} value={lane} onChange={setLane} />

      <div className="ff-stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(s => <SkillCard key={s.id} skill={s} />)}
        {filtered.length === 0 ? <Panel className="col-span-full p-10 text-center text-sm text-slate-500">No skills match those filters.</Panel> : null}
      </div>
    </div>
  );
}

function SkillCard({ skill }) {
  return (
    <a href={`#/skills/${skill.id}`} className="group block">
      <Panel className="ff-hover-lift relative h-full overflow-hidden p-5">
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full" style={{ background: `radial-gradient(closest-side, ${skill.tone === "violet" ? "rgba(168,85,247,0.20)" : skill.tone === "cyan" ? "rgba(34,211,238,0.18)" : skill.tone === "amber" ? "rgba(245,158,11,0.16)" : "rgba(244,114,182,0.16)"}, transparent 70%)`, filter: "blur(2px)" }} />
        </div>
        <div className="relative flex items-start gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-xl border bg-white/[0.04] text-${skill.tone}-200 border-${skill.tone}-300/25`}>
            <Icon name={skill.icon} className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[10px] text-slate-500">{skill.id.split("-")[0]}</span>
              <h3 className="truncate text-[14px] font-semibold text-white">{skill.name}</h3>
            </div>
            <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-400">{skill.desc}</p>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between border-t border-white/8 pt-3">
          <Pill tone={skill.tone}>{skill.lane.toUpperCase()}</Pill>
          <span className="font-mono text-[10px] text-slate-500">{skill.runtime}</span>
        </div>
      </Panel>
    </a>
  );
}

function SkillDetailPage({ id, navigate }) {
  const skill = SKILLS.find(s => s.id === id);
  const [deployOpen, setDeployOpen] = pUseState(false);
  const { toast } = useToast();
  if (!skill) return <NotFound back="#/skills" />;

  return (
    <div className="ff-page mx-auto max-w-6xl px-6 py-8">
      <a href="#/skills" className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        All skills
      </a>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Panel className="relative overflow-hidden p-7">
          <GlowOrb size={300} color={skill.tone === "violet" ? "rgba(168,85,247,0.30)" : skill.tone === "cyan" ? "rgba(34,211,238,0.26)" : skill.tone === "amber" ? "rgba(245,158,11,0.24)" : "rgba(244,114,182,0.26)"} style={{ right: -80, top: -60 }} />
          <div className="flex items-center gap-3">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl border bg-white/[0.04] text-${skill.tone}-200 border-${skill.tone}-300/25`}>
              <Icon name={skill.icon} className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] text-slate-500">skill · {skill.id}</p>
              <h1 className="text-2xl font-semibold text-white">{skill.name}</h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">{skill.desc}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Inputs</p>
              <ul className="mt-2 space-y-1.5">
                {skill.inputs.map(i => <li key={i} className="font-mono text-xs text-slate-300">· {i}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Outputs</p>
              <ul className="mt-2 space-y-1.5">
                {skill.outputs.map(o => <li key={o} className="font-mono text-xs text-slate-300">· {o}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4 font-mono text-[12px] leading-6 text-slate-300">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
              <Icon name="terminal" className="h-3 w-3" /> skill.md · preview
            </div>
            <pre className="whitespace-pre-wrap">
{`---
id: ${skill.id}
lane: ${skill.lane}
runtime: ${skill.runtime}
complexity: ${skill.complexity}
---

# ${skill.name}

${skill.desc}

## Inputs
${skill.inputs.map(i => "- " + i).join("\n")}

## Outputs
${skill.outputs.map(o => "- " + o).join("\n")}

## Method
1. Identify the repeating shape.
2. Encode the judgment as portable markdown.
3. Deploy across MCP, SDK, or n8n.
`}
            </pre>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Ripple
              className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400"
              onClick={() => setDeployOpen(true)}
            ><Icon name="rocket" className="h-3.5 w-3.5" />Deploy skill</Ripple>
            <Ripple
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => { navigator.clipboard?.writeText(`flashfusion skill run ${skill.id}`); toast({ title: "Command copied", body: `flashfusion skill run ${skill.id}`, kind: "success" }); }}
            ><Icon name="code" className="h-3.5 w-3.5" />Copy run command</Ripple>
            <Ripple
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => toast({ title: "Forked", body: `${skill.name} → ${skill.id}-copy`, kind: "info" })}
            ><Icon name="sparkles" className="h-3.5 w-3.5" />Fork</Ripple>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Manifest</p>
            <dl className="mt-3 space-y-2 text-sm">
              {[["Lane", skill.lane], ["Runtime", skill.runtime], ["Complexity", skill.complexity], ["Format", "markdown"], ["MCP-ready", "yes"]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="font-mono text-xs text-slate-200">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Used in pipelines</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {PIPELINES.filter(p => p.stages.some(st => st.skill === skill.id)).map(p => (
                <li key={p.id}>
                  <a href={`#/pipelines/${p.id}`} className="flex items-center gap-2 text-slate-300 hover:text-white">
                    <Icon name="rocket" className="h-3 w-3 text-cyan-200" /> {p.name}
                  </a>
                </li>
              ))}
              {PIPELINES.filter(p => p.stages.some(st => st.skill === skill.id)).length === 0 ? (
                <li className="text-xs text-slate-500">— not yet wired into a pipeline</li>
              ) : null}
            </ul>
          </Panel>
        </div>
      </div>

      <DeploySkillModal open={deployOpen} onClose={() => setDeployOpen(false)} skill={skill} />
    </div>
  );
}

/* ─── Deploy Skill Modal (3-step wizard) ────────────────────────────────── */
function DeploySkillModal({ open, onClose, skill }) {
  const [step, setStep] = pUseState(1);
  const [target, setTarget] = pUseState("mcp");
  const [hitl, setHitl] = pUseState(true);
  const { toast } = useToast();
  pUseEffect(() => { if (open) { setStep(1); setTarget("mcp"); setHitl(true); } }, [open]);
  if (!skill) return null;
  const targets = [
    { id: "mcp",     label: "MCP server",   sub: "Skill ships as resource + prompt", icon: "code" },
    { id: "sdk",     label: "Agent SDK",    sub: "Loaded into the agent's skill list", icon: "brain" },
    { id: "desktop", label: "Claude Desktop", sub: "Personal workspace · single user", icon: "terminal" },
    { id: "n8n",     label: "n8n flow",     sub: "Trigger-based, multi-step", icon: "rocket" }
  ];
  return (
    <Modal
      open={open} onClose={onClose}
      title={`Deploy · ${skill.name}`}
      size="lg"
      footer={
        <>
          {step > 1 ? <button type="button" onClick={() => setStep(s => s - 1)} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white">Back</button> : null}
          {step < 3 ? (
            <Ripple onClick={() => setStep(s => s + 1)} className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400">Continue<Icon name="arrowRight" className="h-3.5 w-3.5" /></Ripple>
          ) : (
            <Ripple onClick={() => { toast({ title: `${skill.name} deployed`, body: `Target: ${target.toUpperCase()} · HITL: ${hitl ? "on" : "off"}`, kind: "success" }); onClose(); }} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"><Icon name="check" className="h-3.5 w-3.5" />Confirm deploy</Ripple>
          )}
        </>
      }
    >
      {/* Stepper */}
      <div className="mb-5 flex items-center gap-2">
        {[1,2,3].map(n => (
          <React.Fragment key={n}>
            <div className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${step >= n ? "bg-violet-500 text-white" : "bg-white/8 text-slate-500"}`}>{n}</div>
            {n < 3 ? <div className={`h-px flex-1 ${step > n ? "bg-violet-500/60" : "bg-white/10"}`} /> : null}
          </React.Fragment>
        ))}
      </div>

      {step === 1 ? (
        <div>
          <p className="text-sm text-slate-400">Pick a deploy target. The skill will be packaged as portable markdown for whichever runtime you select.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {targets.map(t => (
              <button key={t.id} type="button" onClick={() => setTarget(t.id)} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${target === t.id ? "border-violet-300/50 bg-violet-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-cyan-200"><Icon name={t.icon} className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{t.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : step === 2 ? (
        <div>
          <p className="text-sm text-slate-400">Configure guardrails. HITL (human-in-the-loop) gates pause the agent for your approval before producing irreversible output.</p>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
              <input type="checkbox" checked={hitl} onChange={(e) => setHitl(e.target.checked)} className="mt-0.5 h-4 w-4 accent-violet-500" />
              <div>
                <p className="text-sm font-semibold text-white">Require HITL approval</p>
                <p className="mt-0.5 text-xs text-slate-400">The skill will pause and wait for sign-off before producing outputs you can't easily undo (proposals, sends, deploys).</p>
              </div>
            </label>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Always on</p>
              <ul className="mt-2 space-y-1">
                <li>· Input validation & schema check</li>
                <li>· Rate limiting per agent · per run</li>
                <li>· Audit log entry on every step</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-400">Review and confirm. The package will be written to the registry and the orchestrator will pick it up on the next tick.</p>
          <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs">
            <div className="flex justify-between"><span className="text-slate-500">skill</span><span className="text-white">{skill.id}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">target</span><span className="text-cyan-200">{target.toUpperCase()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">hitl</span><span className={hitl ? "text-emerald-200" : "text-pink-200"}>{hitl ? "enabled" : "disabled"}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">runtime</span><span className="text-slate-300">{skill.runtime}</span></div>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PIPELINES — list + detail (node graph)
   ═══════════════════════════════════════════════════════════════════════ */
function PipelinesPage() {
  return (
    <div className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="Pipelines"
        title="Skills composed end-to-end"
        sub="Pipelines turn one-off skills into recurring practice. Triggers, HITL gates, and runtime targets all live here."
        right={<Pill tone="cyan">{PIPELINES.length} pipelines</Pill>}
      />
      <div className="ff-stagger grid grid-cols-1 gap-5 md:grid-cols-2">
        {PIPELINES.map(p => <PipelineCard key={p.id} pipeline={p} />)}
      </div>
    </div>
  );
}

function PipelineCard({ pipeline }) {
  return (
    <a href={`#/pipelines/${pipeline.id}`} className="block">
      <Panel className="ff-hover-lift relative overflow-hidden p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">{pipeline.runtime}</p>
            <h3 className="mt-1 text-lg font-semibold text-white">{pipeline.name}</h3>
            <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-400">{pipeline.desc}</p>
          </div>
          <Icon name="rocket" className="h-5 w-5 text-violet-200" />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {pipeline.stages.map((st, i) => {
            const sk = st.skill ? SKILLS.find(s => s.id === st.skill) : null;
            return (
              <React.Fragment key={st.id}>
                <span className={`inline-flex items-center gap-1.5 rounded-full border bg-white/[0.04] px-2.5 py-1 text-[11px] ${st.hitl ? "border-pink-300/30 text-pink-200" : "border-white/10 text-slate-300"}`}>
                  {st.hitl ? <span className="h-1.5 w-1.5 rounded-full bg-pink-300" /> : null}
                  {st.name}
                </span>
                {i < pipeline.stages.length - 1 ? <span className="text-slate-600">→</span> : null}
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-xs text-slate-500">
          <span>Triggers: <span className="text-slate-300">{pipeline.triggers.join(" · ")}</span></span>
          <span className="text-cyan-200">Open →</span>
        </div>
      </Panel>
    </a>
  );
}

function PipelineDetailPage({ id }) {
  const p = PIPELINES.find(x => x.id === id);
  const { toast } = useToast();
  const [running, setRunning] = pUseState(false);
  const [step, setStep] = pUseState(-1);
  pUseEffect(() => {
    if (!running) return;
    if (step >= p.stages.length) { setRunning(false); toast({ title: "Pipeline complete", body: p.name, kind: "success" }); return; }
    const id = setTimeout(() => setStep(s => s + 1), 900);
    return () => clearTimeout(id);
  }, [running, step, p]);
  if (!p) return <NotFound back="#/pipelines" />;

  return (
    <div className="ff-page mx-auto max-w-6xl px-6 py-8">
      <a href="#/pipelines" className="mb-5 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        All pipelines
      </a>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Pipeline</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{p.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{p.desc}</p>
        </div>
        <div className="flex gap-2">
          <Ripple
            onClick={() => { setStep(0); setRunning(true); toast({ title: `Running · ${p.name}`, kind: "info" }); }}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400"
          ><Icon name="play" className="h-3.5 w-3.5" />Run pipeline</Ripple>
          <Ripple
            onClick={() => toast({ title: "Schedule saved", body: "Trigger: " + p.triggers[0], kind: "success" })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
          ><Icon name="rocket" className="h-3.5 w-3.5" />Schedule</Ripple>
        </div>
      </div>

      <Panel className="mt-6 overflow-hidden p-6">
        <PipelineGraph stages={p.stages} active={step} running={running} />
      </Panel>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Triggers</p>
          <ul className="mt-3 space-y-2 text-sm">
            {p.triggers.map(t => (
              <li key={t} className="flex items-center gap-3"><Icon name="zap" className="h-3.5 w-3.5 text-amber-200" /><span className="text-slate-300">{t}</span></li>
            ))}
          </ul>
        </Panel>
        <Panel className="p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Stages</p>
          <ol className="mt-3 space-y-2.5 text-sm">
            {p.stages.map((st, i) => {
              const sk = st.skill ? SKILLS.find(s => s.id === st.skill) : null;
              return (
                <li key={st.id} className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/8 font-mono text-[10px] text-slate-300">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-slate-200">{st.name}</p>
                    {sk ? <a href={`#/skills/${sk.id}`} className="text-xs text-cyan-200 hover:underline">↳ {sk.name}</a>
                        : <p className="text-xs text-slate-500">{st.body}</p>}
                  </div>
                  {st.hitl ? <Pill tone="pink">HITL</Pill> : null}
                </li>
              );
            })}
          </ol>
        </Panel>
      </div>
    </div>
  );
}

/* Node-graph layout — horizontal flow with animated edges */
function PipelineGraph({ stages, active, running }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-fit items-stretch gap-3">
        {stages.map((st, i) => {
          const sk = st.skill ? SKILLS.find(s => s.id === st.skill) : null;
          const isActive = running && active >= i;
          const isCurrent = running && active === i;
          return (
            <React.Fragment key={st.id}>
              <div className={`ff-node ${isCurrent ? "active" : ""} w-[200px] shrink-0 rounded-2xl p-4 transition-colors`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                  {st.hitl ? <Pill tone="pink">HITL</Pill> : isActive ? <Pill tone="emerald">done</Pill> : <Pill tone="slate">queued</Pill>}
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{st.name}</div>
                {sk ? (
                  <a href={`#/skills/${sk.id}`} className="mt-1.5 block text-[11px] text-cyan-200 hover:underline">↳ {sk.name}</a>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-400">{st.body}</p>
                )}
              </div>
              {i < stages.length - 1 ? (
                <div className="flex w-12 items-center justify-center">
                  <svg width="48" height="14" viewBox="0 0 48 14" className="overflow-visible">
                    <line x1="0" y1="7" x2="42" y2="7" stroke={isActive ? "#22D3EE" : "rgba(255,255,255,0.18)"} strokeWidth="2" strokeDasharray="6 4" className={isActive ? "ff-dashflow" : ""} style={{ "--ff-flow-duration": "1.4s" }} />
                    <polygon points="42,2 48,7 42,12" fill={isActive ? "#22D3EE" : "rgba(255,255,255,0.30)"} />
                  </svg>
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   AUDIT LOG — filterable table
   ═══════════════════════════════════════════════════════════════════════ */
function AuditPage() {
  const [filter, setFilter] = pUseState("all");
  const [q, setQ] = pUseState("");
  const filtered = AUDIT_EVENTS.filter(e =>
    (filter === "all" || e.kind === filter) &&
    (!q || (e.action + e.actor + e.target).toLowerCase().includes(q.toLowerCase()))
  );
  const counts = {
    all:     AUDIT_EVENTS.length,
    info:    AUDIT_EVENTS.filter(e => e.kind === "info").length,
    success: AUDIT_EVENTS.filter(e => e.kind === "success").length,
    warn:    AUDIT_EVENTS.filter(e => e.kind === "warn").length,
    error:   AUDIT_EVENTS.filter(e => e.kind === "error").length,
  };
  return (
    <div className="ff-page mx-auto max-w-7xl px-6 py-8">
      <SectionHead
        eyebrow="Runtime"
        title="Audit log"
        sub="Every agent action, every transition. Security-sensitive events are double-flagged and never trimmed."
        right={<Pill tone="cyan">{AUDIT_EVENTS.length} events</Pill>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[["all", "All", "slate"], ["info", "Info", "slate"], ["success", "Success", "emerald"], ["warn", "Warn", "amber"], ["error", "Error", "pink"]].map(([id, label, tone]) => (
          <button key={id} type="button" onClick={() => setFilter(id)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${filter === id ? `border-${tone}-300/40 bg-${tone}-500/10 text-${tone}-100` : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"}`}>
            {label} <span className="text-[10px] text-slate-500">{counts[id]}</span>
          </button>
        ))}
        <div className="relative ml-auto">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="w-60 rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-300/50" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-2.5 top-2.5 text-slate-500"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
        </div>
      </div>
      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              <th className="border-b border-white/8 px-5 py-3">When</th>
              <th className="border-b border-white/8 px-5 py-3">Actor</th>
              <th className="border-b border-white/8 px-5 py-3">Action</th>
              <th className="border-b border-white/8 px-5 py-3">Target</th>
              <th className="border-b border-white/8 px-5 py-3 text-right">Kind</th>
            </tr>
          </thead>
          <tbody className="ff-stagger">
            {filtered.map(e => (
              <tr key={e.id} className="text-sm transition-colors hover:bg-white/[0.03]">
                <td className="border-b border-white/5 px-5 py-3 font-mono text-[11px] text-slate-500">{e.t}</td>
                <td className="border-b border-white/5 px-5 py-3 font-mono text-xs text-slate-300">{e.actor}</td>
                <td className="border-b border-white/5 px-5 py-3 font-mono text-xs text-cyan-200">{e.action}</td>
                <td className="border-b border-white/5 px-5 py-3 text-xs text-slate-400">{e.target}</td>
                <td className="border-b border-white/5 px-5 py-3 text-right"><AuditPill kind={e.kind} /></td>
              </tr>
            ))}
            {filtered.length === 0 ? <tr><td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-500">No events match.</td></tr> : null}
          </tbody>
        </table>
        </div>
      </Panel>
    </div>
  );
}
function AuditPill({ kind }) {
  const m = { info: "slate", success: "emerald", warn: "amber", error: "pink" }[kind] || "slate";
  return <Pill tone={m}>{kind}</Pill>;
}

/* ═══════════════════════════════════════════════════════════════════════
   SETTINGS PAGE
   ═══════════════════════════════════════════════════════════════════════ */
function SettingsPage() {
  const [tab, setTab] = pUseState("providers");
  const { toast } = useToast();
  return (
    <div className="ff-page mx-auto max-w-5xl px-6 py-8">
      <SectionHead eyebrow="Settings" title="Configure the operator" sub="Manage providers, keys, and the appearance of the workspace." />
      <Tabs
        tabs={[
          { id: "providers", label: "Providers", count: PROVIDERS.length },
          { id: "appearance", label: "Appearance" },
          { id: "keys", label: "API keys" }
        ]}
        value={tab} onChange={setTab}
      />
      <div className="mt-6">
        {tab === "providers" ? (
          <div className="ff-stagger grid grid-cols-1 gap-3 md:grid-cols-2">
            {PROVIDERS.map(p => (
              <Panel key={p.id} className="flex items-center gap-4 p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-cyan-200"><Icon name={p.icon} className="h-4 w-4" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.role}</p>
                </div>
                <button type="button" onClick={() => toast({ title: p.connected ? `${p.name} disconnected` : `${p.name} connected`, kind: p.connected ? "warn" : "success" })} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${p.connected ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20" : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"}`}>
                  {p.connected ? "Connected" : "Connect"}
                </button>
              </Panel>
            ))}
          </div>
        ) : tab === "appearance" ? (
          <Panel className="p-6">
            <p className="text-sm text-slate-400">Workspace appearance follows the FlashFusion dark theme. Future: light mode and high-contrast.</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[["Dark", "default", true], ["High contrast", "wip", false], ["Light", "wip", false]].map(([label, sub, on]) => (
                <button key={label} type="button" onClick={() => !on && toast({ title: "Theme not yet available", kind: "info" })} className={`rounded-xl border p-4 text-left transition ${on ? "border-violet-300/40 bg-violet-500/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </button>
              ))}
            </div>
          </Panel>
        ) : (
          <Panel className="p-6">
            <p className="text-sm text-slate-400">API keys are masked. Use the rotate button to roll a new value — the old one stays valid for 24h.</p>
            <ul className="mt-4 space-y-2.5">
              {[["FF_API_KEY", "ff_live_••••••••••••a91c"], ["MCP_TRANSPORT_TOKEN", "mcp_••••••••3b21"], ["SUPABASE_SERVICE", "sb_••••••••0e44"]].map(([k, v]) => (
                <li key={k} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <span className="font-mono text-[12px] text-slate-400">{k}</span>
                  <span className="font-mono text-[12px] text-slate-200">{v}</span>
                  <div className="ml-auto flex gap-2">
                    <button type="button" onClick={() => toast({ title: "Copied", kind: "success" })} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10">Copy</button>
                    <button type="button" onClick={() => toast({ title: "Key rotated", body: "New key issued. Old key valid 24h.", kind: "warn" })} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10">Rotate</button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   NOT FOUND
   ═══════════════════════════════════════════════════════════════════════ */
function NotFound({ back = "#/console" }) {
  return (
    <div className="ff-page mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-300">404 · not in registry</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">No record of that destination.</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">The skill or pipeline you're looking for may have been renamed, or the link may be stale.</p>
      <a href={back} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.34)] hover:bg-violet-400">
        <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> Take me back
      </a>
    </div>
  );
}

Object.assign(window, {
  ConsolePage, AgentsPage, AgentDetailPage,
  SkillsPage, SkillDetailPage,
  PipelinesPage, PipelineDetailPage,
  AuditPage, SettingsPage, NotFound
});
