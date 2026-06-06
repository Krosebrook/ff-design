import { useState, useMemo, useCallback } from "react";

// ─── Data from Notion (WSJF Backlog + Recurring Work OS Tasks) ───
const INITIAL_TASKS = [
  // WSJF Backlog Items (sorted by WSJF score)
  { id: "w1", title: "Send fortnightly update to Jackie Miles", track: "Staff+", trackColor: "#F472B6", wsjf: 27.0, size: 1, status: "open", source: "wsjf", priority: "P0", area: "Work", notes: "OVERDUE — include Q1 ROI (~$354K)", due: "2026-03-14", bv: 9, tc: 10, rr: 8 },
  { id: "w2", title: "Start shutdown log — first entry today", track: "Personal OS", trackColor: "#A78BFA", wsjf: 25.0, size: 1, status: "open", source: "wsjf", priority: "P0", area: "Health", notes: "Habit starts today or not at all", due: null, bv: 8, tc: 10, rr: 7 },
  { id: "w3", title: "Verify PT-20260314-004: webhook HMAC validation", track: "Security", trackColor: "#EF4444", wsjf: 25.0, size: 1, status: "open", source: "wsjf", priority: "P0", area: "Work", notes: "P1 — unverified HIGH risk", due: null, bv: 7, tc: 9, rr: 9 },
  { id: "w4", title: "n8n D1 written acknowledgment — Cloud data exposure", track: "Security", trackColor: "#EF4444", wsjf: 25.0, size: 1, status: "open", source: "wsjf", priority: "P0", area: "Work", notes: "Blocker from EVAL-003", due: null, bv: 8, tc: 8, rr: 9 },
  { id: "w5", title: "Recurring Work OS — run duplicate test", track: "Marketplace", trackColor: "#6B7280", wsjf: 22.0, size: 1, status: "open", source: "wsjf", priority: "P1", area: "Creator", notes: "Most critical QA step; blocks submission", due: null, bv: 7, tc: 9, rr: 6 },
  { id: "w6", title: "Install gitleaks pre-commit hook on active repos", track: "Security", trackColor: "#EF4444", wsjf: 22.0, size: 1, status: "open", source: "wsjf", priority: "P1", area: "Work", notes: "Closes T-09 from Threat Model", due: null, bv: 6, tc: 8, rr: 8 },
  { id: "w7", title: "Create #ai-wins Slack channel", track: "AI Enablement", trackColor: "#EAB308", wsjf: 21.0, size: 1, status: "open", source: "wsjf", priority: "P1", area: "Work", notes: "Before next all-hands", due: null, bv: 7, tc: 8, rr: 6 },
  { id: "w8", title: "Lock week numbering convention", track: "Newsletter", trackColor: "#22C55E", wsjf: 21.0, size: 1, status: "open", source: "wsjf", priority: "P1", area: "Work", notes: "Blocks historical log backfill", due: null, bv: 7, tc: 9, rr: 5 },
  { id: "w9", title: "Fill Week 11 calendar — Security as priority", track: "Newsletter", trackColor: "#22C55E", wsjf: 20.0, size: 1, status: "open", source: "wsjf", priority: "P1", area: "Work", notes: "Cat 3 gap flagged by gap tracker", due: null, bv: 6, tc: 9, rr: 5 },
  { id: "w10", title: "Identify Slack/Teams channel for each tier", track: "Newsletter", trackColor: "#22C55E", wsjf: 20.0, size: 1, status: "open", source: "wsjf", priority: "P1", area: "Work", notes: "Blocks reaction instrument", due: null, bv: 7, tc: 8, rr: 5 },
  { id: "w11", title: "Add reaction block to Week 11 edition footer", track: "Newsletter", trackColor: "#22C55E", wsjf: 19.0, size: 1, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "2 min copy-paste before publish", due: null, bv: 6, tc: 9, rr: 4 },
  { id: "w12", title: "Build pulse survey (Notion/Google Form)", track: "AI Enablement", trackColor: "#EAB308", wsjf: 11.5, size: 2, status: "open", source: "wsjf", priority: "P1", area: "Work", notes: "Foundation of all adoption data", due: null, bv: 8, tc: 8, rr: 7 },
  { id: "w13", title: "Create workshop attendance tracker", track: "AI Enablement", trackColor: "#EAB308", wsjf: 10.0, size: 2, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "Needed for stage classification", due: null, bv: 7, tc: 7, rr: 6 },
  { id: "w14", title: "Update LinkedIn with Staff+ scope + CAR framing", track: "Staff+", trackColor: "#F472B6", wsjf: 9.5, size: 2, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "External optionality baseline", due: null, bv: 6, tc: 6, rr: 7 },
  { id: "w15", title: "Schedule first IR tabletop drill", track: "Security", trackColor: "#EF4444", wsjf: 7.0, size: 3, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "Book 2026-06-13 now", due: "2026-06-13", bv: 7, tc: 6, rr: 8 },
  { id: "w16", title: "n8n self-hosted setup on Zeabur (migration)", track: "Security", trackColor: "#EF4444", wsjf: 7.0, size: 3, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "EVAL-004: proceed or stay Cloud", due: null, bv: 7, tc: 5, rr: 9 },
  { id: "w17", title: "Recurring Work OS — ship (QA → publish → submit)", track: "Marketplace", trackColor: "#6B7280", wsjf: 7.0, size: 3, status: "open", source: "wsjf", priority: "P1", area: "Creator", notes: "~2.5 hrs to submission after dup test", due: null, bv: 7, tc: 7, rr: 7 },
  { id: "w18", title: "Research salary benchmark (Levels.fyi, Glassdoor)", track: "Staff+", trackColor: "#F472B6", wsjf: 6.0, size: 3, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "Before friction check triggers", due: null, bv: 6, tc: 5, rr: 7 },
  { id: "w19", title: "Run first Module 1 workshop", track: "AI Enablement", trackColor: "#EAB308", wsjf: 4.6, size: 5, status: "open", source: "wsjf", priority: "P2", area: "Work", notes: "Needs pulse survey + tracker first", due: null, bv: 9, tc: 6, rr: 8 },
  { id: "w20", title: "Run 2-week chronotype observation protocol", track: "Personal OS", trackColor: "#A78BFA", wsjf: 4.25, size: 4, status: "open", source: "wsjf", priority: "P2", area: "Health", notes: "Log first session time + quality", due: null, bv: 6, tc: 5, rr: 6 },
  { id: "w21", title: "Build source library + credibility tier doc", track: "Newsletter", trackColor: "#22C55E", wsjf: 4.33, size: 3, status: "open", source: "wsjf", priority: "P3", area: "Work", notes: "Quality improvement, not blocking", due: null, bv: 5, tc: 4, rr: 4 },
  { id: "w22", title: "Backfill topic log Weeks 1–9", track: "Newsletter", trackColor: "#22C55E", wsjf: 3.75, size: 4, status: "open", source: "wsjf", priority: "P3", area: "Work", notes: "Useful but not urgent", due: null, bv: 5, tc: 5, rr: 5 },
  // Recurring Work OS Tasks (active/not done)
  { id: "r1", title: "Tool + subscription audit", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 2, status: "backlog", source: "recurring", priority: "P2", area: "Admin", notes: "Monthly", due: "2026-03-11", recurrence: "Monthly" },
  { id: "r2", title: "Weekly home reset (laundry + trash)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "backlog", source: "recurring", priority: "P2", area: "Home", notes: "Weekly", due: "2026-03-09", recurrence: "Weekly" },
  { id: "r3", title: "Home maintenance checklist", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 2, status: "backlog", source: "recurring", priority: "P2", area: "Home", notes: "Monthly", due: "2026-03-18", recurrence: "Monthly" },
  { id: "r4", title: "Monthly retrospective (work + personal)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 3, status: "backlog", source: "recurring", priority: "P1", area: "Work", notes: "Monthly", due: "2026-03-31", recurrence: "Monthly" },
  { id: "r5", title: "Monthly content planning (pillars + themes)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 2, status: "backlog", source: "recurring", priority: "P1", area: "Creator", notes: "Monthly — overdue", due: "2026-03-15", recurrence: "Monthly" },
  { id: "r6", title: "Meal plan + grocery list", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "backlog", source: "recurring", priority: "P2", area: "Home", notes: "Weekly", due: "2026-03-07", recurrence: "Weekly" },
  { id: "r7", title: "Content idea capture (5 ideas)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "backlog", source: "recurring", priority: "P2", area: "Creator", notes: "Weekly", due: "2026-03-06", recurrence: "Weekly" },
  { id: "r8", title: "Weekly review (wins + stucks + top 3)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "planned", source: "recurring", priority: "P1", area: "Work", notes: "Weekly", due: "2026-03-08", recurrence: "Weekly" },
  { id: "r9", title: "Backlog grooming (set next 5)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "planned", source: "recurring", priority: "P1", area: "Work", notes: "Weekly", due: "2026-03-10", recurrence: "Weekly" },
  { id: "r10", title: "Water + 10 min walk", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "planned", source: "recurring", priority: "P1", area: "Health", notes: "Daily", due: "2026-03-04", recurrence: "Daily" },
  { id: "r11", title: "Daily admin reset (inbox + quick wins)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "planned", source: "recurring", priority: "P2", area: "Admin", notes: "Daily", due: "2026-03-04", recurrence: "Daily" },
  { id: "r12", title: "Monthly money check (bills + subs)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 2, status: "planned", source: "recurring", priority: "P1", area: "Admin", notes: "Monthly — overdue", due: "2026-03-13", recurrence: "Monthly" },
  { id: "r13", title: "Clear one loose end from backlog", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "backlog", source: "recurring", priority: "P2", area: "Work", notes: "One-off", due: "2026-03-03", recurrence: "None" },
  { id: "r14", title: "30-min focused deep work block", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "planned", source: "recurring", priority: "P0", area: "Work", notes: "Daily", due: "2026-03-04", recurrence: "Daily" },
  { id: "r15", title: "Overdue triage (pick 1, reschedule rest)", track: "Recurring", trackColor: "#94A3B8", wsjf: null, size: 1, status: "doing", source: "recurring", priority: "P1", area: "Admin", notes: "Weekly — in progress", due: "2026-03-02", recurrence: "Weekly" },
];

const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "#64748B" },
  { id: "planned", label: "Planned", color: "#3B82F6" },
  { id: "doing", label: "In Progress", color: "#F59E0B" },
  { id: "done", label: "Done", color: "#22C55E" },
];

const STATUS_MAP = { open: "backlog", backlog: "backlog", planned: "planned", doing: "doing", done: "done" };

const TRACK_FILTERS = ["All", "Security", "AI Enablement", "Staff+", "Newsletter", "Personal OS", "Marketplace", "Recurring"];
const PRIORITY_FILTERS = ["All", "P0", "P1", "P2", "P3"];
const SOURCE_FILTERS = ["All", "WSJF Backlog", "Recurring OS"];

// ─── Hidden Gems Generator ───
function generateHiddenGems(task) {
  const gems = [];
  // Pattern-based gem generation
  if (task.wsjf && task.wsjf >= 20 && task.size <= 1) {
    gems.push({ icon: "⚡", gem: "Quick Win Multiplier — This is a high-impact, low-effort item. Batch it with 2-3 similar Size-1 tasks in a single peak window for a dopamine cascade that compounds momentum." });
  }
  if (task.track === "Security" && task.rr >= 8) {
    gems.push({ icon: "🛡️", gem: "Portfolio Proof Point — This security item has high RR/OE. Document the before/after state as a CAR story for your Staff+ fortnightly update to Jackie." });
  }
  if (task.track === "Newsletter" && task.size <= 1) {
    gems.push({ icon: "📰", gem: "Thursday Batch Candidate — Per your Bio-Cognitive Schedule, Thursdays are Stakeholder+Comms. Queue all Size-1 newsletter items into a single Thursday peak window instead of letting them float as individual WSJF items." });
  }
  if (task.track === "AI Enablement") {
    gems.push({ icon: "🧠", gem: "Adoption Flywheel Fuel — Every AI Enablement task feeds your KPI framework metrics. Screenshot completion evidence for the pulse survey baseline and your ROI methodology." });
  }
  if (task.notes && task.notes.toLowerCase().includes("block")) {
    gems.push({ icon: "🔗", gem: "Dependency Unlocker — This task is blocking downstream work. Completing it may cascade-unblock 2-3 other items, effectively multiplying your WSJF throughput for the week." });
  }
  if (task.track === "Staff+" && task.title.toLowerCase().includes("linkedin")) {
    gems.push({ icon: "🌐", gem: "Optionality Insurance — Update this with specific metrics ($354K ROI, 50-200 eng org scope). Recruiters index on quantified impact. This is your external leverage even if you never use it." });
  }
  if (task.recurrence === "Daily" || task.recurrence === "Weekly") {
    gems.push({ icon: "🔄", gem: "Habit Anchor Point — Recurring tasks are Fogg B=MAP triggers. Attach this to an existing habit (after coffee, after standup) rather than scheduling it cold. Completion rate jumps 40%." });
  }
  if (task.wsjf && task.wsjf >= 25) {
    gems.push({ icon: "🔥", gem: "WSJF Critical Mass — Score ≥25 means every day of delay burns significant value. If you haven't started this in 48 hours, re-score TC — it may have increased." });
  }
  if (task.size >= 3 && task.wsjf && task.wsjf <= 7) {
    gems.push({ icon: "🪓", gem: "Decomposition Candidate — High effort + moderate WSJF. Split this into 2-3 subtasks. The first subtask likely scores much higher on its own and can be done in a trough window." });
  }
  if (task.track === "Marketplace") {
    gems.push({ icon: "💰", gem: "Revenue Pipeline Item — Every Marketplace task feeds your passive income stream. Track time-to-ship and use it as a benchmark for pricing future Notion products." });
  }
  if (task.area === "Health") {
    gems.push({ icon: "🧬", gem: "Bio-Cognitive Enabler — Health tasks aren't separate from work performance. This directly impacts your peak window quality. Treat it as infrastructure, not a nice-to-have." });
  }
  if (task.track === "Personal OS" && task.title.toLowerCase().includes("chronotype")) {
    gems.push({ icon: "⏰", gem: "Meta-Optimization — This observation data will let you reschedule ALL other tasks to the right energy window. It's the task that makes every other task more efficient." });
  }
  // Always return exactly 5
  const fallbacks = [
    { icon: "🎯", gem: "Definition of Done — Before starting, write a single sentence: 'This is done when ___.' Prevents scope creep and gives you a clean archive entry for your WSJF closed items." },
    { icon: "📸", gem: "Evidence Capture — Take a screenshot or save the artifact when complete. You'll need this for your monthly retro, Staff+ portfolio, or client proof-of-work." },
    { icon: "🤖", gem: "Automation Candidate — After completing this manually once, ask: 'Can Claude/n8n/Zapier do this next time?' Build the automation while the context is fresh." },
    { icon: "🔀", gem: "Cross-Track Synergy — Check if completing this creates material for another track. Security work → newsletter content. Newsletter → Staff+ visibility. Everything compounds." },
    { icon: "📊", gem: "Metric Connection — Link this task's completion to a measurable KPI in your AI Adoption framework or Staff+ growth path. Untracked work is invisible work." },
  ];
  while (gems.length < 5) {
    const next = fallbacks.find(f => !gems.some(g => g.icon === f.icon));
    if (next) gems.push(next);
    else break;
  }
  return gems.slice(0, 5);
}

// ─── Components ───
function PriorityBadge({ priority }) {
  const colors = { P0: "bg-red-600 text-white", P1: "bg-orange-500 text-white", P2: "bg-yellow-400 text-gray-900", P3: "bg-gray-300 text-gray-700" };
  return <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colors[priority] || colors.P3}`}>{priority}</span>;
}

function WsjfBadge({ score }) {
  if (!score) return null;
  const color = score >= 25 ? "text-red-400" : score >= 20 ? "text-orange-400" : score >= 10 ? "text-yellow-400" : "text-gray-400";
  return <span className={`text-xs font-mono font-bold ${color}`}>WSJF {score}</span>;
}

function TaskCard({ task, onMove, onSelect, isSelected }) {
  const overdue = task.due && new Date(task.due) < new Date("2026-03-21");
  return (
    <div
      onClick={() => onSelect(task.id)}
      className={`group relative bg-gray-800 border rounded-lg p-3 mb-2 cursor-pointer transition-all hover:bg-gray-750 hover:border-gray-500 ${isSelected ? "border-indigo-500 ring-1 ring-indigo-500/50" : "border-gray-700"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: task.trackColor + "22", color: task.trackColor }}>{task.track}</span>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-sm text-gray-100 font-medium leading-snug mb-1.5">{task.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <WsjfBadge score={task.wsjf} />
        {task.size && <span className="text-xs text-gray-500">Size {task.size}</span>}
        {overdue && <span className="text-xs text-red-400 font-semibold animate-pulse">OVERDUE</span>}
        {task.due && !overdue && <span className="text-xs text-gray-500">Due {task.due}</span>}
        {task.recurrence && task.recurrence !== "None" && <span className="text-xs text-blue-400">{task.recurrence}</span>}
      </div>
      {task.notes && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{task.notes}</p>}
      {/* Move buttons on hover */}
      <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
        {COLUMNS.map(col => {
          const currentStatus = STATUS_MAP[task.status] || task.status;
          if (col.id === currentStatus) return null;
          const arrows = { backlog: "◀◀", planned: "◀", doing: "▶", done: "▶▶" };
          return (
            <button key={col.id} onClick={e => { e.stopPropagation(); onMove(task.id, col.id); }} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded px-1 py-0.5" title={`Move to ${col.label}`}>
              {arrows[col.id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HiddenGemsPanel({ task, onClose }) {
  const gems = useMemo(() => generateHiddenGems(task), [task]);
  return (
    <div className="bg-gray-850 border border-indigo-500/30 rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-indigo-300">Hidden Gems</h3>
          <p className="text-xs text-gray-500 mt-0.5">5 non-obvious ways to leverage this task</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg">✕</button>
      </div>
      <div className="text-sm font-medium text-gray-200 mb-3 px-2 py-1.5 bg-gray-800 rounded" style={{ borderLeft: `3px solid ${task.trackColor}` }}>
        {task.title}
      </div>
      <div className="space-y-3">
        {gems.map((g, i) => (
          <div key={i} className="flex gap-3 items-start bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600 transition-colors">
            <span className="text-lg flex-shrink-0 mt-0.5">{g.icon}</span>
            <p className="text-sm text-gray-300 leading-relaxed">{g.gem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Board ───
export default function KanbanBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState(null);
  const [trackFilter, setTrackFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("wsjf");
  const [showGems, setShowGems] = useState(null);

  const moveTask = useCallback((taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (trackFilter !== "All" && t.track !== trackFilter) return false;
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      if (sourceFilter === "WSJF Backlog" && t.source !== "wsjf") return false;
      if (sourceFilter === "Recurring OS" && t.source !== "recurring") return false;
      return true;
    });
  }, [tasks, trackFilter, priorityFilter, sourceFilter]);

  const sortedInColumn = useCallback((colId) => {
    const colTasks = filteredTasks.filter(t => (STATUS_MAP[t.status] || t.status) === colId);
    return colTasks.sort((a, b) => {
      if (sortBy === "wsjf") return (b.wsjf || 0) - (a.wsjf || 0);
      if (sortBy === "priority") {
        const pOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
        return (pOrder[a.priority] ?? 9) - (pOrder[b.priority] ?? 9);
      }
      if (sortBy === "size") return (a.size || 99) - (b.size || 99);
      return 0;
    });
  }, [filteredTasks, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => (STATUS_MAP[t.status] || t.status) === "done").length;
    const overdue = tasks.filter(t => t.due && new Date(t.due) < new Date("2026-03-21") && (STATUS_MAP[t.status] || t.status) !== "done").length;
    const p0Open = tasks.filter(t => t.priority === "P0" && (STATUS_MAP[t.status] || t.status) !== "done").length;
    const avgWsjf = tasks.filter(t => t.wsjf).reduce((s, t) => s + t.wsjf, 0) / (tasks.filter(t => t.wsjf).length || 1);
    return { total, done, overdue, p0Open, avgWsjf: avgWsjf.toFixed(1) };
  }, [tasks]);

  const gemsTask = showGems ? tasks.find(t => t.id === showGems) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold text-white">Cross-Project Kanban</h1>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-medium">WSJF + Recurring OS</span>
        </div>
        <p className="text-xs text-gray-500">Last synced from Notion: 2026-03-21 · {stats.total} tasks · {stats.overdue} overdue · {stats.p0Open} P0 open · Avg WSJF: {stats.avgWsjf}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-xs text-gray-500 font-medium">Track:</span>
        {TRACK_FILTERS.map(f => (
          <button key={f} onClick={() => setTrackFilter(f)} className={`text-xs px-2 py-1 rounded transition-colors ${trackFilter === f ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{f}</button>
        ))}
        <span className="text-xs text-gray-600 mx-1">|</span>
        <span className="text-xs text-gray-500 font-medium">Priority:</span>
        {PRIORITY_FILTERS.map(f => (
          <button key={f} onClick={() => setPriorityFilter(f)} className={`text-xs px-2 py-1 rounded transition-colors ${priorityFilter === f ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{f}</button>
        ))}
        <span className="text-xs text-gray-600 mx-1">|</span>
        <span className="text-xs text-gray-500 font-medium">Source:</span>
        {SOURCE_FILTERS.map(f => (
          <button key={f} onClick={() => setSourceFilter(f)} className={`text-xs px-2 py-1 rounded transition-colors ${sourceFilter === f ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{f}</button>
        ))}
        <span className="text-xs text-gray-600 mx-1">|</span>
        <span className="text-xs text-gray-500 font-medium">Sort:</span>
        {["wsjf", "priority", "size"].map(s => (
          <button key={s} onClick={() => setSortBy(s)} className={`text-xs px-2 py-1 rounded transition-colors ${sortBy === s ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>{s === "wsjf" ? "WSJF ↓" : s === "priority" ? "Priority" : "Size ↑"}</button>
        ))}
      </div>

      {/* Gems Panel */}
      {gemsTask && <HiddenGemsPanel task={gemsTask} onClose={() => setShowGems(null)} />}

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const colTasks = sortedInColumn(col.id);
          return (
            <div key={col.id} className="bg-gray-850 rounded-xl p-3 min-h-96" style={{ backgroundColor: "#111827" }}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-semibold text-gray-300">{col.label}</span>
                </div>
                <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{colTasks.length}</span>
              </div>
              <div className="space-y-0">
                {colTasks.map(task => (
                  <div key={task.id}>
                    <TaskCard
                      task={task}
                      onMove={moveTask}
                      isSelected={selectedTask === task.id}
                      onSelect={(id) => {
                        setSelectedTask(id === selectedTask ? null : id);
                        setShowGems(id === showGems ? null : id);
                      }}
                    />
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-700 text-xs">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600">Click any card to reveal 5 Hidden Gems · Hover to move between columns · WSJF = (BV + TC + RR/OE) / Size</p>
      </div>
    </div>
  );
}
