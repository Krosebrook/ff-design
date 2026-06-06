/* FlashFusion Canvas — sidebar nav, topbar, hash router.
 */
const { useEffect: nvUseEffect, useState: nvUseState, useRef: nvUseRef, useCallback: nvUseCallback, useMemo: nvUseMemo } = React;

/* ─── Hash router ───────────────────────────────────────────────────────── */
function parseHash() {
  const raw = (window.location.hash || "#/console").slice(2);
  const parts = raw.split("/").filter(Boolean);
  return { path: parts, raw };
}

function useRoute() {
  const [route, setRoute] = nvUseState(parseHash());
  nvUseEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) window.location.hash = "#/console";
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const navigate = nvUseCallback((to) => {
    if (typeof to === "string") {
      const next = to.startsWith("#") ? to : "#" + (to.startsWith("/") ? to : "/" + to);
      if (next !== window.location.hash) window.location.hash = next;
    }
  }, []);
  return { route, navigate };
}

/* Render a link that updates the hash. */
function NavLink({ to, current, children, className = "", onClick, ...rest }) {
  const active = current === to.replace(/^\//, "");
  return (
    <a
      href={"#" + to}
      aria-current={active ? "page" : undefined}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────────────── */
const SIDEBAR_ITEMS = [
  { id: "console",   label: "Console",     icon: "terminal", hint: "live runtime" },
  { id: "agents",    label: "Agents",      icon: "brain",    hint: "6 specialized" },
  { id: "skills",    label: "Skills",      icon: "sparkles", hint: "16 in library" },
  { id: "pipelines", label: "Pipelines",   icon: "rocket",   hint: "compositions" },
  { id: "audit",     label: "Audit log",   icon: "shield",   hint: "runtime events" },
  { id: "settings",  label: "Settings",    icon: "lock",     hint: "providers + keys" }
];

const LANE_DOT = { violet: "bg-violet-400", cyan: "bg-cyan-400", amber: "bg-amber-400", emerald: "bg-emerald-400" };

function Sidebar({ current, onCmdK, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const navRef = nvUseRef(null);
  // Trap focus inside the mobile drawer when open
  nvUseEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onCloseMobile(); };
    window.addEventListener("keydown", onKey);
    setTimeout(() => navRef.current?.querySelector("a,button")?.focus(), 60);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onCloseMobile]);

  const wide = !collapsed;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen ? (
        <div className="ff-backdrop fixed inset-0 z-40 bg-black/55 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      ) : null}

      <aside
        ref={navRef}
        aria-label="Primary"
        style={{ width: collapsed ? 76 : 244 }}
        className={[
          "fixed left-0 top-0 z-50 flex h-screen shrink-0 flex-col border-r border-white/8 bg-[#070912]/95 backdrop-blur-xl",
          "transition-[transform,width] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:z-20 lg:translate-x-0 lg:bg-[#070912]/85"
        ].join(" ")}
      >
        {/* Brand + collapse toggle */}
        <div className={`flex h-16 items-center border-b border-white/8 ${collapsed ? "justify-center px-2" : "gap-2.5 px-5"}`}>
          <a href="#/console" onClick={onCloseMobile} className="flex items-center gap-2.5" aria-label="FlashFusion home">
            <FFLogoMark />
            {wide ? (
              <span className="leading-tight">
                <span className="block text-[14px] font-semibold tracking-tight text-white">FlashFusion</span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Operator OS</span>
              </span>
            ) : null}
          </a>
          {wide ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="ml-auto hidden h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-white/5 hover:text-white lg:grid"
              aria-label="Collapse sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/></svg>
            </button>
          ) : null}
          {/* Mobile close */}
          <button type="button" onClick={onCloseMobile} className="ml-auto grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/5 hover:text-white lg:hidden" aria-label="Close menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {/* Search prompt → opens command palette */}
        {wide ? (
          <button
            type="button"
            onClick={onCmdK}
            className="mx-3 mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-400 transition hover:bg-white/[0.07] hover:text-slate-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            <span className="flex-1">Jump to…</span>
            <kbd className="ff-kbd">⌘K</kbd>
          </button>
        ) : (
          <Tooltip label="Search (⌘K)">
            <button type="button" onClick={onCmdK} className="mx-auto mt-4 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07] hover:text-white" aria-label="Search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
            </button>
          </Tooltip>
        )}

        {/* Nav */}
        <nav className="mt-5 flex-1 overflow-y-auto overflow-x-hidden px-2" aria-label="Sections">
          <ul className="space-y-0.5">
            {SIDEBAR_ITEMS.map(item => {
              const link = (
                <a
                  href={"#/" + item.id}
                  onClick={onCloseMobile}
                  aria-current={current === item.id ? "page" : undefined}
                  className={`ff-nav-item flex items-center rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2"}`}
                >
                  <Icon name={item.icon} className="h-4 w-4 shrink-0 text-slate-400" />
                  {wide ? <span className="flex-1">{item.label}</span> : null}
                  {wide ? <span className="text-[10px] text-slate-600">{item.hint}</span> : null}
                </a>
              );
              return <li key={item.id}>{collapsed ? <Tooltip label={item.label}>{link}</Tooltip> : link}</li>;
            })}
          </ul>

          {/* Lanes shortcut */}
          {wide ? <div className="mt-6 px-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">Lanes</div> : <div className="mx-auto mt-6 h-px w-8 bg-white/10" />}
          <ul className="mt-2 space-y-0.5">
            {LANES.map(lane => {
              const link = (
                <a
                  href={`#/skills?lane=${lane.id}`}
                  onClick={onCloseMobile}
                  className={`flex items-center rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white ${collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-1.5"}`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${LANE_DOT[lane.tone] || "bg-slate-400"}`} />
                  {wide ? <span className="flex-1">{lane.name}</span> : null}
                  {wide ? <span className="text-[10px] text-slate-600">{lane.pitch}</span> : null}
                </a>
              );
              return <li key={lane.id}>{collapsed ? <Tooltip label={`${lane.name} · ${lane.pitch}`}>{link}</Tooltip> : link}</li>;
            })}
          </ul>
        </nav>

        {/* Expand toggle when collapsed */}
        {collapsed ? (
          <button type="button" onClick={onToggleCollapse} className="mx-auto mb-2 hidden h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white/5 hover:text-white lg:grid" aria-label="Expand sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
          </button>
        ) : null}

        {/* Footer / operator */}
        <div className="border-t border-white/8 px-3 py-3">
          <div className={`flex items-center rounded-xl bg-white/[0.04] ${collapsed ? "justify-center px-1.5 py-2" : "gap-2.5 px-2.5 py-2"}`}>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[11px] font-bold text-white">KR</div>
            {wide ? (
              <>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="truncate text-[12px] font-semibold text-white">Kyle Rosebrook</div>
                  <div className="truncate text-[10px] text-slate-500">Operator · v4</div>
                </div>
                <Tooltip label="Status: online">
                  <span className="ff-dot-pulse h-2 w-2 rounded-full bg-emerald-300" />
                </Tooltip>
              </>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
}

/* Logo mark (compact bolt-in-ring) */
function FFLogoMark() {
  return (
    <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-violet-400/40 bg-gradient-to-br from-violet-700/40 to-black">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="ff-mini-bolt" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A855F7"/><stop offset="0.5" stopColor="#F472B6"/><stop offset="1" stopColor="#22D3EE"/>
          </linearGradient>
        </defs>
        <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 L15 2 Z" fill="url(#ff-mini-bolt)"/>
      </svg>
    </span>
  );
}

/* ─── Topbar ────────────────────────────────────────────────────────────── */
function Topbar({ crumbs, onCmdK, onOpenDrawer, onOpenMobile, running }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/8 bg-[#070912]/85 px-4 backdrop-blur-xl sm:px-6">
      {/* Mobile hamburger */}
      <button type="button" onClick={onOpenMobile} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>

      {/* Breadcrumb (hidden on xs) */}
      <nav aria-label="Breadcrumb" className="hidden items-center gap-2 text-[12px] text-slate-400 sm:flex">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <span className="text-slate-600" aria-hidden="true">/</span> : null}
            {c.href ? (
              <a href={c.href} className="hover:text-white">{c.label}</a>
            ) : (
              <span className="font-semibold text-white" aria-current="page">{c.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
      {/* xs: just current page */}
      <span className="text-sm font-semibold text-white sm:hidden">{crumbs[crumbs.length - 1]?.label}</span>

      <div className="flex-1" />

      {/* Live runtime indicator (hidden on xs) */}
      <Tooltip label="Runtime state">
        <span className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-[11px] sm:inline-flex ${running ? "border-emerald-300/30 bg-emerald-500/8 text-emerald-200" : "border-white/10 bg-white/5 text-slate-400"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${running ? "ff-dot-pulse bg-emerald-300" : "bg-slate-500"}`} />
          {running ? "Runtime live" : "Paused"}
        </span>
      </Tooltip>

      <Tooltip label="Search (⌘K)">
        <button type="button" onClick={onCmdK} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
        </button>
      </Tooltip>

      <Tooltip label="Notifications">
        <button type="button" onClick={onOpenDrawer} className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white" aria-label="Notifications">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-pink-300" />
        </button>
      </Tooltip>

      <Tooltip label="Operator">
        <button type="button" className="ml-1 hidden h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-[12px] font-bold text-white sm:grid" aria-label="Operator profile">KR</button>
      </Tooltip>
    </header>
  );
}

/* ─── Tabs (slides indicator) ───────────────────────────────────────────── */
function Tabs({ tabs, value, onChange }) {
  const wrapRef = nvUseRef(null);
  const refs = nvUseRef({});
  const [bar, setBar] = nvUseState({ left: 0, width: 0 });
  nvUseEffect(() => {
    const el = refs.current[value];
    if (!el) return;
    const w = el.offsetWidth;
    const l = el.offsetLeft;
    setBar({ left: l, width: w });
  }, [value, tabs.length]);

  return (
    <div ref={wrapRef} className="ff-tabs relative flex items-center gap-1 border-b border-white/8 px-1">
      {tabs.map(t => (
        <button
          key={t.id}
          type="button"
          ref={(el) => { refs.current[t.id] = el; }}
          onClick={() => onChange(t.id)}
          className={`relative px-3 py-2.5 text-[13px] font-medium transition ${value === t.id ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
        >
          {t.label}
          {t.count != null ? <span className="ml-1.5 rounded-full bg-white/8 px-1.5 py-0.5 text-[10px] text-slate-300">{t.count}</span> : null}
        </button>
      ))}
      <span className="ff-tab-indicator" style={{ transform: `translateX(${bar.left}px)`, width: bar.width }} />
    </div>
  );
}

Object.assign(window, {
  useRoute, NavLink, Sidebar, Topbar, Tabs, FFLogoMark, SIDEBAR_ITEMS
});
