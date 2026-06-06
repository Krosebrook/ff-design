/* FlashFusion Canvas — data for skills, pipelines, audit events, providers.
 * No fabricated metrics — structural facts only.
 */

/* ─── The 16 Skills (mapped to real uploads) ────────────────────────────── */
const SKILLS = [
  { id: "01-roi-calculator",       name: "ROI Calculator",      lane: "sell",    tone: "violet",  icon: "activity",   desc: "Executive ROI narrative — payback, year-1 net, cost of waiting.", inputs: ["client", "spend baseline", "target outcome"], outputs: ["narrative .md", "csv model"], runtime: "MCP · SDK · Desktop", complexity: "medium" },
  { id: "02-discovery-scorecard",  name: "Discovery Scorecard", lane: "sell",    tone: "violet",  icon: "shield",     desc: "ICP fit, urgency, decision-maker access, budget signal — one pass.", inputs: ["call notes", "transcript"], outputs: ["scorecard .md"], runtime: "MCP · Desktop", complexity: "low" },
  { id: "03-skills-browser",       name: "Skills Browser",      lane: "platform",tone: "cyan",    icon: "brain",      desc: "Search the skill library by category, complexity, deploy time.", inputs: ["query"], outputs: ["skill manifest"], runtime: "MCP · SDK", complexity: "low" },
  { id: "04-sprint-tracker",       name: "Sprint Tracker",      lane: "deliver", tone: "cyan",    icon: "activity",   desc: "Sprint board with milestones, blockers, weekly stakeholder update.", inputs: ["sprint plan"], outputs: ["status memo", "blocker log"], runtime: "MCP · n8n", complexity: "medium" },
  { id: "05-proposal-builder",     name: "Proposal Builder",    lane: "sell",    tone: "violet",  icon: "code",       desc: "Audit → Sprint → Retainer proposal in your voice. SOW-ready.", inputs: ["scorecard", "tier"], outputs: ["proposal .md", "SOW draft"], runtime: "MCP · Desktop", complexity: "high" },
  { id: "06-audit-report-generator", name: "Audit Report Gen",  lane: "deliver", tone: "cyan",    icon: "shield",     desc: "Setup scorecard → gaps, priority matrix, recommended next step.", inputs: ["audit scorecard"], outputs: ["audit deck", "gap matrix"], runtime: "MCP · SDK", complexity: "high" },
  { id: "07-pipeline-dashboard",   name: "Pipeline Dashboard",  lane: "office",  tone: "amber",   icon: "activity",   desc: "Deals by stage, weighted forecast, days-in-stage drift.", inputs: ["pipeline export"], outputs: ["dashboard"], runtime: "Desktop", complexity: "low" },
  { id: "08-revenue-tracker",      name: "Revenue Tracker",     lane: "office",  tone: "amber",   icon: "database",   desc: "Track MRR, ARR, retainer churn, upsell. Monthly close in two clicks.", inputs: ["invoices"], outputs: ["close report"], runtime: "Desktop", complexity: "medium" },
  { id: "09-outreach-tracker",     name: "Outreach Tracker",    lane: "sell",    tone: "violet",  icon: "rocket",     desc: "First-touch + follow-up cadence by channel. Reply rate, drop-off.", inputs: ["sequence"], outputs: ["cadence csv"], runtime: "n8n", complexity: "medium" },
  { id: "10-battle-card-browser",  name: "Battle Cards",        lane: "sell",    tone: "violet",  icon: "shield",     desc: "Competitor positioning, win/lose conditions, current objections.", inputs: ["competitor", "stage"], outputs: ["card .md"], runtime: "MCP", complexity: "low" },
  { id: "11-client-dashboard",     name: "Client Dashboard",    lane: "deliver", tone: "cyan",    icon: "database",   desc: "Per-client view: sprint stage, deliverables, activity, health score.", inputs: ["client id"], outputs: ["dashboard"], runtime: "Desktop", complexity: "medium" },
  { id: "12-newsletter-generator", name: "Newsletter Gen",      lane: "office",  tone: "amber",   icon: "sparkles",   desc: "Draft The Prompt — signals, skill spotlight, close. 400-word cap.", inputs: ["edition number"], outputs: ["draft .md"], runtime: "MCP · Desktop", complexity: "medium" },
  { id: "13-skills-gap-detector",  name: "Skills Gap Detector", lane: "deliver", tone: "cyan",    icon: "brain",      desc: "Reads client stack + use case, returns top 5 pain-causing gaps.", inputs: ["tool list", "goal"], outputs: ["gap report"], runtime: "MCP · SDK", complexity: "high" },
  { id: "14-onboarding-hub",       name: "Onboarding Hub",      lane: "deliver", tone: "cyan",    icon: "check",      desc: "Client-facing kickoff: checklist, week-by-week expectations, escalations.", inputs: ["sprint scope"], outputs: ["onboarding pack"], runtime: "Desktop", complexity: "low" },
  { id: "15-agent-builder-ui",     name: "Agent Builder",       lane: "platform",tone: "cyan",    icon: "code",       desc: "Compose triggers, steps, guardrails, HITL gates. n8n-ready spec.", inputs: ["spec sketch"], outputs: ["agent.json", "n8n flow"], runtime: "n8n · SDK", complexity: "high" },
  { id: "16-chaos-club-daily-dispatch", name: "Daily Dispatch", lane: "office",  tone: "pink",    icon: "sparkles",   desc: "Chaos Club's daily peer-support post. No clichés, ends with one doable thing.", inputs: ["topic"], outputs: ["post .md"], runtime: "Desktop", complexity: "low" }
];

const LANES = [
  { id: "sell",     name: "Sell",     tone: "violet",  pitch: "Win the room",       desc: "Discovery, proposals, outreach, battle cards." },
  { id: "deliver",  name: "Deliver",  tone: "cyan",    pitch: "Ship the work",      desc: "Audit, sprint, client dashboards, onboarding." },
  { id: "office",   name: "Office",   tone: "amber",   pitch: "Compound it",        desc: "Pipeline, revenue, newsletter, daily ops." },
  { id: "platform", name: "Platform", tone: "emerald", pitch: "Build the engine",   desc: "Skill library, agent builder — the infra layer." },
];

/* ─── Pipelines (skill compositions) ────────────────────────────────────── */
const PIPELINES = [
  {
    id: "audit-sprint",
    name: "Audit → Sprint",
    desc: "From cold lead to signed sprint. Five-stage flow with HITL gates at proposal and SOW.",
    stages: [
      { id: "discover",  name: "Discover",  skill: "02-discovery-scorecard",  kind: "skill" },
      { id: "audit",     name: "Audit",     skill: "06-audit-report-generator", kind: "skill" },
      { id: "scope",     name: "Scope",     skill: "13-skills-gap-detector",  kind: "skill" },
      { id: "propose",   name: "Propose",   skill: "05-proposal-builder",     kind: "skill", hitl: true },
      { id: "kickoff",   name: "Kickoff",   skill: "14-onboarding-hub",       kind: "skill" }
    ],
    triggers: ["Inbound form", "Calendar booking", "Manual run"],
    runtime: "MCP · Desktop · n8n"
  },
  {
    id: "weekly-ops",
    name: "Weekly Office Loop",
    desc: "Friday close. Three skills run end-to-end, write outputs to your weekly note.",
    stages: [
      { id: "revenue", name: "Revenue",    skill: "08-revenue-tracker",     kind: "skill" },
      { id: "pipe",    name: "Pipeline",   skill: "07-pipeline-dashboard",  kind: "skill" },
      { id: "newsletter", name: "The Prompt", skill: "12-newsletter-generator", kind: "skill", hitl: true }
    ],
    triggers: ["Cron · Fri 4pm"],
    runtime: "n8n · Desktop"
  },
  {
    id: "agent-factory",
    name: "Agent Factory",
    desc: "Sketch → spec → n8n flow. The 3-Rule encoded as a pipeline.",
    stages: [
      { id: "identify", name: "Identify",   kind: "step",  body: "Find the repeating shape" },
      { id: "encode",   name: "Encode",     skill: "03-skills-browser", kind: "skill" },
      { id: "build",    name: "Build",      skill: "15-agent-builder-ui", kind: "skill", hitl: true },
      { id: "deploy",   name: "Deploy",     kind: "step",  body: "Push to MCP / n8n" }
    ],
    triggers: ["Manual run"],
    runtime: "SDK · n8n"
  },
  {
    id: "daily-dispatch",
    name: "Daily Dispatch",
    desc: "Chaos Club's daily peer post — drafted, edited, queued for 7am.",
    stages: [
      { id: "topic",  name: "Pick topic",   kind: "step", body: "Surface from the week" },
      { id: "draft",  name: "Draft",        skill: "16-chaos-club-daily-dispatch", kind: "skill" },
      { id: "edit",   name: "Edit",         kind: "step", body: "HITL review", hitl: true },
      { id: "queue",  name: "Queue · 7am",  kind: "step", body: "Buffer / Substack" }
    ],
    triggers: ["Cron · Daily 6:30am"],
    runtime: "Desktop · n8n"
  }
];

/* ─── Audit events (no fake usage counts, descriptive only) ─────────────── */
const AUDIT_EVENTS = [
  { id: "e0001", t: "NOW",   actor: "orchestrator", action: "intent.normalized",  target: "—",                       kind: "info" },
  { id: "e0002", t: "NOW",   actor: "planner",      action: "blueprint.drafted",  target: "audit-sprint",            kind: "info" },
  { id: "e0003", t: "NOW",   actor: "codegen",      action: "skill.compiled",     target: "06-audit-report-generator", kind: "success" },
  { id: "e0004", t: "EARLIER", actor: "security",  action: "guardrails.applied",  target: "audit-sprint",            kind: "success" },
  { id: "e0005", t: "EARLIER", actor: "database",  action: "schema.verified",     target: "agent_runs",              kind: "success" },
  { id: "e0006", t: "EARLIER", actor: "deploy",    action: "package.queued",      target: "weekly-ops",              kind: "info" },
  { id: "e0007", t: "YDAY",  actor: "security",     action: "rate.limited",       target: "outreach-tracker",         kind: "warn" },
  { id: "e0008", t: "YDAY",  actor: "orchestrator", action: "agent.retried",      target: "codegen",                 kind: "warn" },
  { id: "e0009", t: "YDAY",  actor: "deploy",       action: "smoke.passed",       target: "audit-sprint",            kind: "success" },
  { id: "e0010", t: "WEEK",  actor: "planner",      action: "transition.illegal", target: "deploy: success→idle",    kind: "error" },
  { id: "e0011", t: "WEEK",  actor: "system",       action: "version.bumped",     target: "ff-runtime@4.2.0",        kind: "info" },
  { id: "e0012", t: "WEEK",  actor: "system",       action: "registry.synced",    target: "skill library",           kind: "info" }
];

/* ─── Providers / settings ──────────────────────────────────────────────── */
const PROVIDERS = [
  { id: "anthropic", name: "Anthropic Claude", role: "Reasoning · default", connected: true,  icon: "brain" },
  { id: "openai",    name: "OpenAI",           role: "Embeddings · fallback", connected: true, icon: "sparkles" },
  { id: "n8n",       name: "n8n",              role: "Workflow runtime",     connected: true,  icon: "rocket" },
  { id: "supabase",  name: "Supabase",         role: "Postgres · RLS · realtime", connected: true, icon: "database" },
  { id: "mcp",       name: "MCP",              role: "Skill transport",      connected: true,  icon: "code" },
  { id: "linear",    name: "Linear",           role: "Issue tracking",       connected: false, icon: "activity" }
];

Object.assign(window, { SKILLS, LANES, PIPELINES, AUDIT_EVENTS, PROVIDERS });
