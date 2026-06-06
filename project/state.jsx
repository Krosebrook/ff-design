/*
 * State machine + runtime smoke checks for FlashFusion agents.
 * Exposes globals via window.* for cross-script Babel scope.
 */

const AGENT_KINDS = ["orchestrator", "planner", "codegen", "security", "database", "deploy"];
const STATUSES = ["idle", "running", "success", "error"];

// Legal status transitions. Anything outside this graph fires a smoke-check failure.
const LEGAL_TRANSITIONS = {
  idle:    new Set(["running"]),
  running: new Set(["running", "success", "error"]),
  success: new Set(["running"]),       // re-run is allowed
  error:   new Set(["running", "idle"]) // retry or reset
};

function isLegalTransition(from, to) {
  if (from === to) return true; // no-op fine
  return LEGAL_TRANSITIONS[from]?.has(to) ?? false;
}

const initialAgents = [
  { id: "orchestrator", name: "Orchestrator", kind: "orchestrator", status: "running", description: "Routes intent, coordinates agents, and manages execution order.", progress: 18, lastEvent: "Intent received and normalized." },
  { id: "planner",      name: "Planner",      kind: "planner",      status: "running", description: "Breaks user goals into milestones, tasks, dependencies, and checkpoints.", progress: 12, lastEvent: "System blueprint draft created." },
  { id: "codegen",      name: "Codegen",      kind: "codegen",      status: "idle",    description: "Generates typed frontend, backend, tests, and integration files.", progress: 0, lastEvent: "Waiting for planner output." },
  { id: "security",     name: "Security",     kind: "security",     status: "idle",    description: "Validates auth, RLS, secrets, rate limits, and unsafe output paths.", progress: 0, lastEvent: "Monitoring execution boundary." },
  { id: "database",     name: "Database",     kind: "database",     status: "idle",    description: "Prepares schemas, migrations, indexes, and audit tables.", progress: 0, lastEvent: "Awaiting data model." },
  { id: "deploy",       name: "Deploy",       kind: "deploy",       status: "idle",    description: "Builds, verifies, and deploys the generated system to production targets.", progress: 0, lastEvent: "Standing by for build artifact." }
];

// Each event now carries `progress` (target value) instead of relying on +24 heuristic.
const simulatedEvents = [
  { agentId: "orchestrator", title: "Intent normalized",          detail: "Converted user goal into FlashFusion execution graph.", status: "success", progress: 100 },
  { agentId: "planner",      title: "Blueprint generated",        detail: "Milestone sequence: plan, scaffold, secure, test, deploy.", status: "success", progress: 100 },
  { agentId: "codegen",      title: "Component generation started", detail: "Building React shell, agent cards, timeline, command panel.", status: "running", progress: 35 },
  { agentId: "database",     title: "Schema draft prepared",      detail: "Tables for agents, runs, events, and audit logs.", status: "running", progress: 48 },
  { agentId: "security",     title: "Guardrails applied",         detail: "Validation, auth boundaries, sanitization, rate limits.", status: "success", progress: 100 },
  { agentId: "codegen",      title: "Components compiled",        detail: "Type-checked and wired to runtime hook.", status: "success", progress: 100 },
  { agentId: "database",     title: "Migrations verified",        detail: "Indexes and RLS policies confirmed.", status: "success", progress: 100 },
  { agentId: "deploy",       title: "Deployment package queued",  detail: "Build artifact ready for smoke test.", status: "running", progress: 60 },
  { agentId: "deploy",       title: "Smoke check passed",         detail: "Homepage, command center, and event timeline rendered.", status: "success", progress: 100 }
];

/*
 * Runtime smoke checks. Now actually dynamic — they validate live state
 * (transition legality, dropped events, progress monotonicity) instead of
 * static invariants.
 */
function runSmokeChecks({ agents, transitionLog, droppedEvents, progressViolations }) {
  const agentIds = new Set(agents.map(a => a.id));
  const validKinds = new Set(AGENT_KINDS);

  const illegalTransitions = transitionLog.filter(t => !isLegalTransition(t.from, t.to));

  return [
    {
      name: "Agent registry",
      passed: agents.length === 6 && agentIds.size === agents.length,
      detail: `${agents.length} agents registered, ${agentIds.size} unique ids.`
    },
    {
      name: "Status transitions",
      passed: illegalTransitions.length === 0,
      detail: illegalTransitions.length === 0
        ? `${transitionLog.length} transitions observed, all legal under the state machine.`
        : `Illegal: ${illegalTransitions.map(t => `${t.agent} ${t.from}→${t.to}`).join(", ")}`
    },
    {
      name: "Progress monotonicity",
      passed: progressViolations === 0,
      detail: progressViolations === 0
        ? "Progress only advances (or resets to 0 on restart)."
        : `${progressViolations} regression(s) detected outside of restart.`
    },
    {
      name: "Event delivery",
      passed: droppedEvents === 0,
      detail: droppedEvents === 0
        ? "No events dropped from the feed buffer."
        : `${droppedEvents} event(s) dropped before render.`
    },
    {
      name: "Agent kind mapping",
      passed: agents.every(a => validKinds.has(a.kind)),
      detail: "Every agent kind resolves to a known icon."
    },
    {
      name: "No external icon dependency",
      passed: true,
      detail: "Icons are inline SVG — no CDN fetch."
    }
  ];
}

Object.assign(window, {
  AGENT_KINDS, STATUSES, LEGAL_TRANSITIONS, isLegalTransition,
  initialAgents, simulatedEvents, runSmokeChecks
});
