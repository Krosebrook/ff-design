/* UI components for FlashFusion Canvas. */
const { useEffect, useMemo, useRef, useState, memo } = React;

const agentIconMap = {
  orchestrator: "brain",
  planner: "activity",
  codegen: "code",
  security: "shield",
  database: "database",
  deploy: "rocket"
};

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false"
  };

  const paths = {
    activity: ["M22 12h-4l-3 8L9 4l-3 8H2"],
    alert: ["M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z", "M12 9v4", "M12 17h.01"],
    arrowRight: ["M5 12h14", "m13 5 7 7-7 7"],
    brain: ["M9.5 2a3.5 3.5 0 0 0-3.3 4.7A3.8 3.8 0 0 0 4 10a4 4 0 0 0 2 3.5V16a4 4 0 0 0 4 4h1V2H9.5Z", "M14.5 2a3.5 3.5 0 0 1 3.3 4.7A3.8 3.8 0 0 1 20 10a4 4 0 0 1-2 3.5V16a4 4 0 0 1-4 4h-1V2h1.5Z", "M8 7h3", "M13 7h3", "M7 13h4", "M13 13h4"],
    check: ["M21 12a9 9 0 1 1-5.2-8.2", "m9 12 2 2 7-7"],
    code: ["m16 18 6-6-6-6", "m8 6-6 6 6 6", "m14 4-4 16"],
    lock: [["rect", { x: 4, y: 11, width: 16, height: 10, rx: 2 }], "M8 11V7a4 4 0 0 1 8 0v4"],
    database: [["ellipse", { cx: 12, cy: 5, rx: 8, ry: 3 }], "M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5", "M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"],
    play: ["m8 5 12 7-12 7V5Z"],
    rocket: ["M4.5 16.5c-1.2 1.2-1.6 3.8-1.6 3.8s2.6-.4 3.8-1.6c.7-.7.7-1.8 0-2.5s-1.8-.7-2.5 0Z", "M9 15 5 11l4-1 6-6c2-2 5-2 7-2 0 2 0 5-2 7l-6 6-1 4-4-4Z", "M15 9h.01"],
    shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z", "m9 12 2 2 4-5"],
    sparkles: ["m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z", "m5 15 .9 2.1L8 18l-2.1.9L5 21l-.9-2.1L2 18l2.1-.9L5 15Z", "m19 14 .7 1.6L21 16l-1.3.4L19 18l-.7-1.6L17 16l1.3-.4L19 14Z"],
    terminal: ["m4 17 5-5-5-5", "M12 19h8"],
    zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"]
  };

  const items = (paths[name] || []).map((entry, i) => {
    if (typeof entry === "string") return <path key={i} d={entry} />;
    const [tag, attrs] = entry;
    return React.createElement(tag, { key: i, ...attrs });
  });
  return <svg {...common}>{items}</svg>;
}

const STATUS_META = {
  running: { label: "Running",  dot: "bg-cyan-300",    text: "text-cyan-200",    border: "border-cyan-300/30",   glow: "shadow-[0_0_34px_rgba(34,211,238,0.18)]",  pulse: true  },
  success: { label: "Verified", dot: "bg-emerald-300", text: "text-emerald-200", border: "border-emerald-300/30", glow: "shadow-[0_0_34px_rgba(16,185,129,0.16)]", pulse: false },
  idle:    { label: "Queued",   dot: "bg-slate-400",   text: "text-slate-300",   border: "border-white/10",      glow: "shadow-[0_0_26px_rgba(124,58,237,0.12)]",  pulse: false },
  error:   { label: "Blocked",  dot: "bg-pink-400",    text: "text-pink-200",    border: "border-pink-300/30",   glow: "shadow-[0_0_34px_rgba(244,114,182,0.18)]", pulse: false }
};

function StatusDot({ status, withLabel = false, size = "h-2.5 w-2.5" }) {
  const meta = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`${size} rounded-full ${meta.dot} ${meta.pulse ? "ff-dot-pulse" : ""}`}
        aria-hidden="true"
      />
      {withLabel
        ? <span className={`text-xs font-medium ${meta.text}`}>{meta.label}</span>
        : <span className="sr-only">{meta.label}</span>}
    </span>
  );
}

/* useSimulatedAgentRuntime — now tracks transitions, drops, progress regressions. */
function useSimulatedAgentRuntime() {
  const [agents, setAgents] = useState(initialAgents);
  const [events, setEvents] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [transitionLog, setTransitionLog] = useState([]);
  const [droppedEvents, setDroppedEvents] = useState(0);
  const [progressViolations, setProgressViolations] = useState(0);
  const cursorRef = useRef(0);
  const pendingRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      // Track events that arrive while a render is still in flight as "dropped"
      // for the smoke checks. (Synthetic — but illustrates the pattern.)
      pendingRef.current += 1;
      if (pendingRef.current > 1) {
        setDroppedEvents(d => d + 1);
      }

      const next = simulatedEvents[cursorRef.current % simulatedEvents.length];
      const now = new Date();
      const event = {
        ...next,
        id: `${next.agentId}-${now.getTime()}-${cursorRef.current}`,
        timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      };

      setEvents(curr => [event, ...curr].slice(0, 8));
      setAgents(curr => curr.map(agent => {
        if (agent.id !== next.agentId) return agent;

        // Validate transition
        if (!isLegalTransition(agent.status, next.status)) {
          setTransitionLog(log => [...log, { agent: agent.id, from: agent.status, to: next.status, illegal: true }].slice(-40));
        } else if (agent.status !== next.status) {
          setTransitionLog(log => [...log, { agent: agent.id, from: agent.status, to: next.status }].slice(-40));
        }

        // Validate progress monotonicity (within a run)
        if (next.progress < agent.progress) {
          setProgressViolations(v => v + 1);
        }

        return {
          ...agent,
          status: next.status,
          progress: Math.max(agent.progress, next.progress),
          lastEvent: next.detail
        };
      }));

      cursorRef.current += 1;
      pendingRef.current -= 1;
    }, 1700);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  function restart() {
    cursorRef.current = 0;
    pendingRef.current = 0;
    setIsRunning(false);
    setTimeout(() => {
      setAgents(initialAgents.map(a => ({ ...a })));
      setEvents([]);
      setTransitionLog([]);
      setDroppedEvents(0);
      setProgressViolations(0);
      setIsRunning(true);
    }, 16);
  }

  return { agents, events, isRunning, setIsRunning, restart, transitionLog, droppedEvents, progressViolations };
}

function DataFlowLine({ intensity }) {
  const duration = Math.max(1.1, 2.5 - intensity);
  return (
    <svg width="100%" height="90" viewBox="0 0 900 90" className="overflow-visible" role="img" aria-label="FlashFusion execution data flow">
      <path d="M18 45 C185 5 270 88 440 45 S710 5 882 45" stroke="rgba(124,58,237,0.22)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path
        className="ff-dashflow"
        style={{ "--ff-flow-duration": `${duration}s` }}
        d="M18 45 C185 5 270 88 440 45 S710 5 882 45"
        stroke="#22D3EE" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="18 28"
      />
    </svg>
  );
}

const AgentCard = memo(function AgentCard({ agent }) {
  const meta = STATUS_META[agent.status];
  const iconName = agentIconMap[agent.kind];
  return (
    <div
      role="group"
      aria-label={`${agent.name} agent — ${meta.label}, ${agent.progress}% complete`}
      className={`relative overflow-hidden rounded-2xl border ${meta.border} ${meta.glow} bg-[#0B0F1A]/85 p-5 backdrop-blur-xl transition-transform hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),transparent_38%)]" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200">
            <Icon name={iconName} className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{agent.name}</h3>
            <div className="mt-1"><StatusDot status={agent.status} withLabel /></div>
          </div>
        </div>
        {agent.status === "success" ? <Icon name="check" className="h-5 w-5 text-emerald-300" /> : null}
        {agent.status === "error" ? <Icon name="alert" className="h-5 w-5 text-pink-300" /> : null}
      </div>

      <p className="relative mt-4 text-sm leading-6 text-slate-400">{agent.description}</p>

      <div className="relative mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Execution</span>
          <span>{agent.progress}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-white/5"
          role="progressbar"
          aria-valuenow={agent.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${agent.name} execution progress`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-all duration-500 ease-out"
            style={{ width: `${agent.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="relative mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-400">
        {agent.lastEvent}
      </div>
    </div>
  );
});

function SystemPanel({ children, className = "", ...rest }) {
  return (
    <div {...rest} className={`rounded-3xl border border-white/10 bg-[#0B0F1A]/78 p-6 shadow-2xl backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

function RuntimeTimeline({ events }) {
  return (
    <SystemPanel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Execution Feed</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Live Agent Timeline</h2>
        </div>
        <Icon name="terminal" className="h-5 w-5 text-violet-200" />
      </div>
      <div className="space-y-3" aria-live="polite" aria-relevant="additions" aria-label="Live agent execution events">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-400">
            Waiting for the first orchestration event…
          </div>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-white/10 bg-black/25 p-3"
            >
              <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">{event.timestamp}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <StatusDot status={event.status} size="h-2 w-2" />
                  <p className="text-sm font-medium text-white truncate">{event.title}</p>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{event.detail}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </SystemPanel>
  );
}

function BackendBlueprint() {
  const rows = [
    ["agents",       "Agent registry, role, status, limits"],
    ["agent_runs",   "One execution request from prompt to deployment"],
    ["agent_events", "Realtime progress events for timeline UI"],
    ["audit_logs",   "Security-sensitive action history"]
  ];
  return (
    <SystemPanel>
      <div className="mb-5 flex items-center gap-3">
        <Icon name="lock" className="h-5 w-5 text-cyan-200" />
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">Reference architecture</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Production Data Model</h2>
        </div>
      </div>
      <div className="space-y-3">
        {rows.map(([table, purpose]) => (
          <div key={table} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="font-mono text-sm text-cyan-100">{table}</p>
            <p className="mt-1 text-sm text-slate-400">{purpose}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 rounded-2xl border border-violet-300/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100/90">
        Wire to Supabase Realtime or Socket.IO after auth, RLS, validation, and rate limits are active.
      </p>
    </SystemPanel>
  );
}

function SmokeCheckPanel({ checks }) {
  const failed = checks.filter(c => !c.passed);
  return (
    <SystemPanel>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/70">Runtime smoke checks</p>
          <h2 className="mt-1 text-xl font-semibold text-white">State-machine integrity</h2>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`rounded-full px-3 py-1 text-xs font-semibold ${failed.length === 0 ? "bg-emerald-300/10 text-emerald-200" : "bg-pink-300/10 text-pink-200"}`}
        >
          {failed.length === 0 ? "All passing" : `${failed.length} failing`}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {checks.map(check => (
          <div key={check.name} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center gap-2">
              <Icon name={check.passed ? "check" : "alert"} className={`h-4 w-4 ${check.passed ? "text-emerald-300" : "text-pink-300"}`} />
              <p className="text-sm font-medium text-white">{check.name}</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{check.detail}</p>
          </div>
        ))}
      </div>
    </SystemPanel>
  );
}

function CommandInput({ onToggle, onRestart, isRunning }) {
  return (
    <SystemPanel className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.18),transparent_34%)]" aria-hidden="true" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="ff-command" className="mb-2 block text-xs uppercase tracking-[0.28em] text-cyan-200/70">Command</label>
          <div id="ff-command" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-sm text-slate-300">
            Build a secure AI agent workspace with live orchestration, deployment visibility, and cinematic execution UI.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={isRunning}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.34)] transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Icon name={isRunning ? "zap" : "play"} className="h-4 w-4" />
            {isRunning ? "Pause runtime" : "Resume runtime"}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/70 focus:ring-offset-2 focus:ring-offset-black"
          >
            Restart
          </button>
        </div>
      </div>
    </SystemPanel>
  );
}

function Hero({ completed, running }) {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-16 text-center md:pt-24">
      <div className="absolute left-1/2 top-8 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" aria-hidden="true"></div>
      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
        <Icon name="sparkles" className="h-4 w-4" />
        <span>FlashFusion Agentic Execution Layer</span>
      </div>
      <h1 className="mx-auto max-w-5xl text-balance text-5xl font-semibold tracking-tight text-white md:text-7xl">
        Transform intent into production systems.
      </h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
        FlashFusion coordinates specialized agents across planning, code generation, security, database design, and deployment — so the interface shows real execution, not decorative automation theater.
      </p>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-3xl font-semibold text-white">6</p><p className="mt-1 text-sm text-slate-400">Specialized agents</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-3xl font-semibold text-cyan-100" aria-live="polite">{running}</p><p className="mt-1 text-sm text-slate-400">Currently running</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-3xl font-semibold text-emerald-100" aria-live="polite">{completed}</p><p className="mt-1 text-sm text-slate-400">Verified outputs</p></div>
      </div>
    </section>
  );
}

function ArchitectureStrip() {
  const steps = ["Intent", "Plan", "Generate", "Secure", "Deploy"];
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <ol className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-sm text-violet-100">{i + 1}</span>
            <span className="text-sm font-medium text-white">{step}</span>
            {i < steps.length - 1 ? <Icon name="arrowRight" className="ml-auto hidden h-4 w-4 text-slate-600 md:block" /> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

Object.assign(window, {
  Icon, StatusDot, useSimulatedAgentRuntime, DataFlowLine, AgentCard,
  SystemPanel, RuntimeTimeline, BackendBlueprint, SmokeCheckPanel,
  CommandInput, Hero, ArchitectureStrip
});
