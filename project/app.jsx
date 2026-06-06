/* FlashFusion Canvas — root shell.
 * Sidebar + topbar + hash router + global popouts.
 */
const { useState: appUseState, useEffect: appUseEffect, useMemo: appUseMemo, useCallback: appUseCallback } = React;

function FlashFusionCanvas() {
  const { route, navigate } = useRoute();
  const [paletteOpen, setPaletteOpen] = appUseState(false);
  const [drawerOpen, setDrawerOpen]   = appUseState(false);
  const [mobileOpen, setMobileOpen]   = appUseState(false);
  const [collapsed, setCollapsed]     = appUseState(() => {
    try { return localStorage.getItem("ff-sidebar-collapsed") === "1"; } catch (e) { return false; }
  });
  const toggleCollapse = appUseCallback(() => {
    setCollapsed(v => {
      const next = !v;
      try { localStorage.setItem("ff-sidebar-collapsed", next ? "1" : "0"); } catch (e) {}
      return next;
    });
  }, []);

  /* Close the mobile nav whenever the route changes */
  appUseEffect(() => { setMobileOpen(false); }, [route.raw]);

  /* Global keybinds */
  appUseEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      // Quick nav: g then a/s/p/c/u
      if (e.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Build the command-palette item set */
  const paletteItems = appUseMemo(() => {
    const pages = SIDEBAR_ITEMS.map(i => ({ id: "page-" + i.id, label: i.label, icon: i.icon, hint: i.hint, group: "Pages", path: `/${i.id}` }));
    const skills = SKILLS.map(s => ({ id: "skill-" + s.id, label: s.name, icon: s.icon, hint: s.lane, group: "Skills", path: `/skills/${s.id}` }));
    const pipes = PIPELINES.map(p => ({ id: "pipe-" + p.id, label: p.name, icon: "rocket", hint: p.runtime, group: "Pipelines", path: `/pipelines/${p.id}` }));
    const actions = [
      { id: "act-deploy", label: "Deploy a skill…", icon: "rocket", group: "Actions", kbd: "D", action: () => navigate("/skills") },
      { id: "act-restart", label: "Restart runtime", icon: "play", group: "Actions", kbd: "R", action: () => { window.dispatchEvent(new CustomEvent("ff:restart")); } },
      { id: "act-audit", label: "Open audit log", icon: "shield", group: "Actions", path: "/audit" },
      { id: "act-settings", label: "Open settings", icon: "lock", group: "Actions", path: "/settings" },
    ];
    return [...pages, ...actions, ...skills, ...pipes];
  }, [navigate]);

  const onPick = appUseCallback((item) => {
    if (item.path) navigate(item.path);
    else if (item.action) item.action();
  }, [navigate]);

  /* Compute breadcrumbs */
  const crumbs = appUseMemo(() => buildCrumbs(route.path), [route.path]);
  /* Current sidebar selection */
  const current = route.path[0] || "console";
  /* Is runtime active? Synthetic flag — true unless on settings */
  const runtimeLive = current !== "settings";

  return (
    <ToastProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black">Skip to content</a>

      {/* Background layers */}
      <BackgroundLayers />

      {/* Shell */}
      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          current={current}
          onCmdK={() => setPaletteOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar crumbs={crumbs} onCmdK={() => setPaletteOpen(true)} onOpenDrawer={() => setDrawerOpen(true)} onOpenMobile={() => setMobileOpen(true)} running={runtimeLive} />
          <main id="main" className="relative flex-1">
            <RoutedPage route={route} navigate={navigate} />
          </main>
        </div>
      </div>

      {/* Popouts */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={paletteItems}
        onPick={onPick}
      />
      <NotificationsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </ToastProvider>
  );
}

/* ─── Route dispatcher ──────────────────────────────────────────────────── */
function RoutedPage({ route, navigate }) {
  const [top, ...rest] = route.path;
  const key = route.raw; // remount on route change → page transition fires
  switch (top) {
    case undefined:
    case "":
    case "console":
      return <div key={key}><ConsolePage /></div>;
    case "agents":
      if (rest[0]) return <div key={key}><AgentDetailPage id={rest[0]} navigate={navigate} /></div>;
      return <div key={key}><AgentsPage navigate={navigate} /></div>;
    case "skills":
      if (rest[0] && !rest[0].startsWith("?")) return <div key={key}><SkillDetailPage id={rest[0]} navigate={navigate} /></div>;
      return <div key={key}><SkillsPage navigate={navigate} /></div>;
    case "pipelines":
      if (rest[0]) return <div key={key}><PipelineDetailPage id={rest[0]} /></div>;
      return <div key={key}><PipelinesPage /></div>;
    case "audit":     return <div key={key}><AuditPage /></div>;
    case "settings":  return <div key={key}><SettingsPage /></div>;
    default:          return <div key={key}><NotFound /></div>;
  }
}

/* ─── Breadcrumb builder ────────────────────────────────────────────────── */
function buildCrumbs(parts) {
  const [top, sub] = parts;
  const known = { console: "Console", agents: "Agents", skills: "Skills", pipelines: "Pipelines", audit: "Audit log", settings: "Settings" };
  const out = [{ label: "FlashFusion", href: "#/console" }];
  if (!top || top === "console") out.push({ label: "Console" });
  else if (known[top]) {
    out.push({ label: known[top], href: sub ? `#/${top}` : undefined });
    if (sub) {
      let label = sub;
      if (top === "skills") {
        const sk = SKILLS.find(s => s.id === sub);
        if (sk) label = sk.name;
      } else if (top === "pipelines") {
        const p = PIPELINES.find(x => x.id === sub);
        if (p) label = p.name;
      } else if (top === "agents") {
        label = sub.charAt(0).toUpperCase() + sub.slice(1);
      }
      out.push({ label });
    }
  } else {
    out.push({ label: "Not found" });
  }
  return out;
}

/* ─── Notifications Drawer ──────────────────────────────────────────────── */
function NotificationsDrawer({ open, onClose }) {
  const items = [
    { kind: "success", title: "Skill deployed", body: "Audit Report Gen → MCP. HITL enabled.", t: "just now", icon: "rocket" },
    { kind: "info",    title: "Pipeline scheduled", body: "Weekly Office Loop · Fri 4pm.",      t: "5m",       icon: "activity" },
    { kind: "warn",    title: "Rate limit reached", body: "Outreach Tracker paused for 90s.",   t: "12m",      icon: "alert" },
    { kind: "info",    title: "New audit event",    body: "agent.retried · codegen.",           t: "1h",       icon: "shield" },
    { kind: "success", title: "Smoke check passed", body: "Build artifact verified.",           t: "yday",     icon: "check" },
  ];
  return (
    <Drawer open={open} onClose={onClose} title="Notifications" width={400}>
      <div className="space-y-3">
        {items.map((n, i) => {
          const tone = { success: "emerald", info: "cyan", warn: "amber", error: "pink" }[n.kind];
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
          <li><a href="#/audit"    className="text-slate-300 hover:text-white">→ Full audit log</a></li>
          <li><a href="#/settings" className="text-slate-300 hover:text-white">→ Notification settings</a></li>
        </ul>
      </div>
    </Drawer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<FlashFusionCanvas />);
