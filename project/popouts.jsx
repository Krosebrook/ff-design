/* FlashFusion Canvas — popouts.
 * Command palette (⌘K), notification drawer, modal wizard, toast system, context menu.
 */
const { useEffect: poUseEffect, useRef: poUseRef, useState: poUseState, useCallback: poUseCallback, useMemo: poUseMemo, createContext: poCreateContext, useContext: poUseContext } = React;

/* ═══════════════════════════════════════════════════════════════════════
   PORTAL HELPER — render into body so we sit above sidebar/topbar
   ═══════════════════════════════════════════════════════════════════════ */
function PortalHost({ id = "ff-portal" }) {
  poUseEffect(() => {
    if (!document.getElementById(id)) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  }, [id]);
  return null;
}
function Portal({ children, id = "ff-portal" }) {
  const elRef = poUseRef(null);
  if (!elRef.current) {
    let host = document.getElementById(id);
    if (!host) { host = document.createElement("div"); host.id = id; document.body.appendChild(host); }
    elRef.current = host;
  }
  return ReactDOM.createPortal(children, elRef.current);
}

/* ─── useFocusTrap — traps Tab within a container, restores focus on close ─ */
function useFocusTrap(ref, active) {
  poUseEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;
    const prevFocused = document.activeElement;
    const SEL = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const list = () => Array.from(root.querySelectorAll(SEL)).filter(el => el.offsetParent !== null);
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const f = list();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("keydown", onKey);
      if (prevFocused && prevFocused.focus) { try { prevFocused.focus(); } catch (e) {} }
    };
  }, [active]);
}

/* ═══════════════════════════════════════════════════════════════════════
   TOAST SYSTEM — useToast hook + ToastViewport
   ═══════════════════════════════════════════════════════════════════════ */
const ToastCtx = poCreateContext({ toast: () => {} });

function ToastProvider({ children }) {
  const [items, setItems] = poUseState([]);
  const idRef = poUseRef(0);
  const toast = poUseCallback((opts) => {
    const id = ++idRef.current;
    const t = { id, kind: "info", duration: 3800, ...opts };
    setItems((curr) => [...curr, t]);
    setTimeout(() => {
      setItems((curr) => curr.map(x => x.id === id ? { ...x, leaving: true } : x));
      setTimeout(() => setItems((curr) => curr.filter(x => x.id !== id)), 260);
    }, t.duration);
    return id;
  }, []);
  const dismiss = poUseCallback((id) => {
    setItems((curr) => curr.map(x => x.id === id ? { ...x, leaving: true } : x));
    setTimeout(() => setItems((curr) => curr.filter(x => x.id !== id)), 260);
  }, []);
  return (
    <ToastCtx.Provider value={{ toast, dismiss }}>
      {children}
      <Portal>
        <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2.5">
          {items.map((t) => <ToastItem key={t.id} t={t} onClose={() => dismiss(t.id)} />)}
        </div>
      </Portal>
    </ToastCtx.Provider>
  );
}
function useToast() { return poUseContext(ToastCtx); }

function ToastItem({ t, onClose }) {
  const tones = {
    info:    { bar: "bg-cyan-300",    icon: "sparkles", label: "text-cyan-200" },
    success: { bar: "bg-emerald-300", icon: "check",    label: "text-emerald-200" },
    warn:    { bar: "bg-amber-300",   icon: "alert",    label: "text-amber-200" },
    error:   { bar: "bg-pink-300",    icon: "alert",    label: "text-pink-200" }
  }[t.kind] || { bar: "bg-cyan-300", icon: "sparkles", label: "text-cyan-200" };
  return (
    <div className={`pointer-events-auto overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/95 backdrop-blur-xl shadow-2xl ${t.leaving ? "ff-toast-out" : "ff-toast-in"}`}>
      <div className="flex gap-3 p-3.5">
        <span className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${tones.bar}`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          {t.title ? <p className="text-sm font-semibold text-white">{t.title}</p> : null}
          {t.body  ? <p className="mt-0.5 text-xs leading-5 text-slate-400">{t.body}</p> : null}
          {t.action ? (
            <button
              type="button"
              onClick={() => { t.action.onClick && t.action.onClick(); onClose(); }}
              className={`mt-2 text-xs font-semibold ${tones.label} hover:underline`}
            >{t.action.label}</button>
          ) : null}
        </div>
        <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Dismiss notification">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MODAL
   ═══════════════════════════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children, footer, size = "md" }) {
  const dialogRef = poUseRef(null);
  useFocusTrap(dialogRef, open);
  poUseEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <Portal>
      <div className="ff-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/65" onClick={onClose}>
        <div
          ref={dialogRef}
          role="dialog" aria-modal="true" aria-labelledby="ff-modal-title"
          className={`ff-pop relative mx-4 w-full ${sizes[size] || sizes.md} rounded-3xl border border-white/10 bg-[#0B0F1A]/95 shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {title ? (
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4">
              <h2 id="ff-modal-title" className="text-base font-semibold text-white">{title}</h2>
              <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
          ) : null}
          <div className="px-6 py-5">{children}</div>
          {footer ? <div className="flex items-center justify-end gap-2 border-t border-white/10 px-6 py-3.5">{footer}</div> : null}
        </div>
      </div>
    </Portal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DRAWER — slides in from right
   ═══════════════════════════════════════════════════════════════════════ */
function Drawer({ open, onClose, title, children, width = 420 }) {
  const dialogRef = poUseRef(null);
  const [mounted, setMounted] = poUseState(open);
  const [leaving, setLeaving] = poUseState(false);
  useFocusTrap(dialogRef, open && mounted);
  poUseEffect(() => {
    if (open) { setMounted(true); setLeaving(false); }
    else if (mounted) {
      setLeaving(true);
      const id = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(id);
    }
  }, [open]);
  poUseEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!mounted) return null;
  return (
    <Portal>
      <div className="fixed inset-0 z-[70]">
        <div
          className={`absolute inset-0 ${leaving ? "" : "ff-backdrop"} bg-black/55`}
          onClick={onClose}
          style={leaving ? { opacity: 0, transition: "opacity 200ms" } : {}}
        />
        <aside
          ref={dialogRef}
          role="dialog" aria-modal="true"
          className={`absolute right-0 top-0 h-full ${leaving ? "ff-drawer-out" : "ff-drawer-in"} border-l border-white/10 bg-[#0B0F1A]/96 shadow-2xl backdrop-blur-xl`}
          style={{ width: Math.min(width, typeof window !== "undefined" ? window.innerWidth - 24 : width) }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close panel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div className="h-[calc(100%-49px)] overflow-y-auto px-5 py-4">{children}</div>
        </aside>
      </div>
    </Portal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   COMMAND PALETTE — ⌘K
   ═══════════════════════════════════════════════════════════════════════ */
function CommandPalette({ open, onClose, items, onPick }) {
  const [q, setQ] = poUseState("");
  const [active, setActive] = poUseState(0);
  const inputRef = poUseRef(null);

  poUseEffect(() => {
    if (open) {
      setQ(""); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = poUseMemo(() => {
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items.filter(it =>
      it.label.toLowerCase().includes(needle) ||
      (it.hint || "").toLowerCase().includes(needle) ||
      (it.group || "").toLowerCase().includes(needle)
    );
  }, [items, q]);

  poUseEffect(() => { setActive(0); }, [q, open]);

  poUseEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(filtered.length - 1, a + 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
      if (e.key === "Enter")     {
        e.preventDefault();
        const pick = filtered[active];
        if (pick) { onPick(pick); onClose(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose, onPick]);

  if (!open) return null;

  // Group results
  const groups = filtered.reduce((acc, it) => {
    const g = it.group || "Actions";
    if (!acc[g]) acc[g] = [];
    acc[g].push(it);
    return acc;
  }, {});
  let cursor = 0;

  return (
    <Portal>
      <div className="ff-backdrop fixed inset-0 z-[80] flex items-start justify-center bg-black/65 pt-[12vh]" onClick={onClose}>
        <div
          role="dialog" aria-modal="true"
          className="ff-pop relative mx-4 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/96 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/>
            </svg>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools, skills, agents, pipelines…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
            />
            <kbd className="ff-kbd">esc</kbd>
          </div>
          <div className="max-h-[58vh] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">No matches for <span className="text-slate-300">"{q}"</span></div>
            ) : (
              Object.entries(groups).map(([groupName, list]) => (
                <div key={groupName} className="mb-2">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{groupName}</div>
                  <ul>
                    {list.map(it => {
                      const idx = cursor++;
                      const isActive = idx === active;
                      return (
                        <li key={it.id}>
                          <button
                            type="button"
                            onClick={() => { onPick(it); onClose(); }}
                            onMouseEnter={() => setActive(idx)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${isActive ? "bg-violet-500/14 text-white" : "text-slate-300 hover:bg-white/5"}`}
                          >
                            {it.icon ? <span className={`grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 ${isActive ? "text-cyan-200" : "text-slate-400"}`}><Icon name={it.icon} className="h-3.5 w-3.5" /></span> : null}
                            <span className="flex-1 truncate">{it.label}</span>
                            {it.hint ? <span className="text-[11px] text-slate-500">{it.hint}</span> : null}
                            {it.kbd ? <kbd className="ff-kbd">{it.kbd}</kbd> : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <kbd className="ff-kbd">↑</kbd><kbd className="ff-kbd">↓</kbd>
              <span>navigate</span>
              <span className="mx-1 text-slate-700">•</span>
              <kbd className="ff-kbd">enter</kbd>
              <span>open</span>
            </div>
            <span>FlashFusion · jump</span>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CONTEXT MENU — anchored popover
   ═══════════════════════════════════════════════════════════════════════ */
function ContextMenu({ anchor, open, onClose, items }) {
  const ref = poUseRef(null);
  poUseEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open || !anchor) return null;
  const { x, y } = anchor;
  return (
    <Portal>
      <div
        ref={ref}
        className="ff-menu fixed z-[75] min-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-[#0B0F1A]/96 shadow-2xl backdrop-blur-xl"
        style={{ left: x, top: y }}
      >
        <ul className="py-1.5">
          {items.map((it, i) => (
            it.divider ? (
              <li key={i} className="my-1 border-t border-white/10" />
            ) : (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => { it.onClick && it.onClick(); onClose(); }}
                  disabled={it.disabled}
                  className={`flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm ${it.danger ? "text-pink-200 hover:bg-pink-500/10" : "text-slate-200 hover:bg-white/5"} disabled:opacity-40 disabled:hover:bg-transparent`}
                >
                  {it.icon ? <Icon name={it.icon} className="h-3.5 w-3.5 text-slate-400" /> : <span className="w-3.5" />}
                  <span className="flex-1">{it.label}</span>
                  {it.kbd ? <kbd className="ff-kbd">{it.kbd}</kbd> : null}
                </button>
              </li>
            )
          ))}
        </ul>
      </div>
    </Portal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   POPOVER — anchored popup positioned relative to a host element
   ═══════════════════════════════════════════════════════════════════════ */
function Popover({ open, onClose, anchorRef, children, placement = "bottom-end" }) {
  const [pos, setPos] = poUseState(null);
  poUseEffect(() => {
    if (!open || !anchorRef?.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const top = r.bottom + 8;
    const left = placement === "bottom-end" ? Math.max(8, r.right - 320) : r.left;
    setPos({ top, left });
    const onScroll = () => onClose();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open, anchorRef, onClose, placement]);
  poUseEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      onClose();
    };
    setTimeout(() => window.addEventListener("mousedown", onDown), 0);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open, onClose, anchorRef]);
  if (!open || !pos) return null;
  return (
    <Portal>
      <div
        className="ff-menu fixed z-[75] w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1A]/96 shadow-2xl backdrop-blur-xl"
        style={pos}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </Portal>
  );
}

Object.assign(window, {
  Portal, PortalHost, ToastProvider, useToast,
  Modal, Drawer, CommandPalette, ContextMenu, Popover
});
