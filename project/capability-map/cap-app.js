/* Capability Map — standalone app logic (vanilla JS) */
(function () {
  const { CATS, CONNECTIONS } = window.CAP_DATA;

  const AV = {
    bundled:     { label: "bundled",  cls: "bundled",     name: "Bundled",  dot: "var(--av-bundled-fg)" },
    builtin:     { label: "built-in", cls: "builtin",     name: "Built-in", dot: "var(--av-builtin-fg)" },
    cdn:         { label: "cdn",      cls: "cdn",         name: "CDN",      dot: "var(--av-cdn-fg)" },
    manual:      { label: "manual",   cls: "manual",      name: "Manual",   dot: "var(--av-manual-fg)" },
    unavailable: { label: "n/a",      cls: "unavailable", name: "N/A",      dot: "var(--av-unavailable-fg)" },
  };
  const FILTER_ORDER = ["all", "bundled", "builtin", "cdn", "manual", "unavailable"];

  // ---- persisted state ----
  const LS = "ff-capmap:";
  const load = (k, d) => { try { const v = localStorage.getItem(LS + k); return v === null ? d : JSON.parse(v); } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch {} };

  const state = {
    view: load("view", "caps"),
    q: load("q", ""),
    filter: load("filter", "all"),
    collapsed: load("collapsed", { na: true, libs: true }),
  };

  // ---- helpers ----
  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const matches = (item, ql) =>
    !ql ||
    item.name.toLowerCase().includes(ql) ||
    item.desc.toLowerCase().includes(ql) ||
    (item.label || "").toLowerCase().includes(ql) ||
    (item.prompt || "").toLowerCase().includes(ql);

  function copyText(text, btn, copiedLabel) {
    const original = btn.dataset.orig || btn.textContent;
    btn.dataset.orig = original;
    const done = () => {
      btn.classList.add("copied");
      btn.textContent = copiedLabel || "✓ copied";
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { btn.classList.remove("copied"); btn.textContent = original; }, 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => { legacyCopy(text); done(); });
    } else { legacyCopy(text); done(); }
  }
  function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:absolute;left:-9999px;top:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(ta);
  }

  // ---- counts ----
  function computeCounts(ql) {
    const c = { all: 0 };
    CATS.forEach((cat) => cat.items.forEach((item) => {
      if (matches(item, ql)) { c.all++; c[item.avail] = (c[item.avail] || 0) + 1; }
    }));
    return c;
  }

  // ---- stats strip ----
  function renderStats() {
    const c = computeCounts("");
    const total = c.all;
    const parts = [`<div class="stat"><span class="n">${total}</span><span class="l">capabilities</span></div>`];
    ["bundled", "builtin", "cdn", "manual"].forEach((k) => {
      parts.push(`<div class="stat"><span class="dot" style="background:${AV[k].dot}"></span><span class="n">${c[k] || 0}</span><span class="l">${AV[k].name}</span></div>`);
    });
    el("stats").innerHTML = parts.join("");
  }

  // ---- filter chips ----
  function renderFilters(counts) {
    el("filters").innerHTML = FILTER_ORDER.map((f) => {
      const active = state.filter === f;
      const cfg = AV[f];
      const dot = cfg ? `<span class="dot" style="background:${cfg.dot}"></span>` : "";
      const style = active && cfg ? `style="background:${cfg.dot.replace("var(--av-", "var(--av-").replace("-fg)", "-bg)")};color:${cfg.dot}"` : (active ? `style="background:rgba(168,85,247,0.16);color:var(--text-primary)"` : "");
      const label = f === "all" ? "All" : cfg.name;
      return `<button class="chip" data-filter="${f}" aria-pressed="${active}" ${style}>${dot}${label}<span class="c">${counts[f] || 0}</span></button>`;
    }).join("");
  }

  // ---- capability list ----
  function renderList() {
    const ql = state.q.toLowerCase().trim();
    const counts = computeCounts(ql);
    renderFilters(counts);

    const filtered = CATS.map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => (state.filter === "all" || item.avail === state.filter) && matches(item, ql)),
    })).filter((cat) => cat.items.length > 0);

    if (filtered.length === 0) {
      el("catList").innerHTML = `<p class="empty">No capabilities match “${esc(state.q)}”.</p>`;
      return;
    }

    el("catList").innerHTML = filtered.map((cat) => {
      const collapsed = state.collapsed[cat.id] && !ql; // expand all when searching
      const rows = cat.items.map((item) => {
        const cfg = AV[item.avail];
        const isNa = item.avail === "unavailable";
        const copyBtn = (!isNa && (item.prompt || item.label))
          ? `<button class="copy-btn" data-copy="1" title="Copy implementation prompt">${esc(item.label || item.name)}</button>` : "";
        const demoBtn = item.demo ? `<button class="demo-btn" data-demo="1" title="See demo prompt">▶</button>` : "";
        return `<div class="row${isNa ? " na" : ""}" data-cat="${cat.id}" data-name="${esc(item.name)}">
            <span class="badge ${cfg.cls}">${cfg.label}</span>
            <span class="r-name">${esc(item.name)}</span>
            <span class="r-desc">${esc(item.desc)}</span>
            <span class="r-actions">${copyBtn}${demoBtn}</span>
          </div>`;
      }).join("");
      return `<section class="cat${collapsed ? " collapsed" : ""}" data-id="${cat.id}">
          <button class="cat-head" data-toggle="${cat.id}">
            <span class="cat-emoji">${cat.emoji}</span>
            <span class="cat-title">${esc(cat.label)}</span>
            <span class="cat-count">${cat.items.length}</span>
            <span class="cat-chevron">▼</span>
          </button>
          <div class="cat-body">${rows}</div>
        </section>`;
    }).join("");
  }

  // ---- connections ----
  function renderConnections() {
    el("connGrid").innerHTML = CONNECTIONS.map((c, i) => `
      <div class="conn-card">
        <span class="conn-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="conn-body">
          <p class="conn-title">${esc(c.title)}</p>
          <p class="conn-text">${esc(c.text)}</p>
        </div>
        <button class="conn-demo" data-conn="${i}">▶ Build prompt</button>
      </div>`).join("");
  }

  // ---- drawer ----
  function lookupItem(catId, name) {
    const cat = CATS.find((c) => c.id === catId);
    return cat ? cat.items.find((it) => it.name === name) : null;
  }

  function openDrawerItem(item, catLabel) {
    const cfg = AV[item.avail];
    el("drawerBadgeRow").innerHTML =
      `<span class="drawer-badge badge ${cfg.cls}">${cfg.label}</span><span class="drawer-cat">${esc(catLabel)}</span>`;
    el("drawerTitle").textContent = item.name;
    el("drawerDesc").textContent = item.desc;

    let body = "";
    if (item.prompt) {
      body += `<p class="block-label">Implementation prompt <button class="block-copy" data-blockcopy="prompt">Copy</button></p>
        <div class="code-block" data-block="prompt">${esc(item.prompt)}</div>`;
    } else if (item.label && item.avail !== "unavailable") {
      body += `<p class="block-label">Reference <button class="block-copy" data-blockcopy="prompt">Copy</button></p>
        <div class="code-block" data-block="prompt">${esc(item.label)}</div>`;
    }
    if (item.demo) {
      body += `<p class="block-label">Demo prompt <button class="block-copy" data-blockcopy="demo">Copy</button></p>
        <div class="code-block" data-block="demo">${esc(item.demo)}</div>
        <p class="demo-note">Paste this into a chat to have Claude build a live demo of this capability.</p>`;
    }
    if (item.avail === "unavailable") {
      body += `<p class="demo-note" style="margin-top:0">This is not available in the artifact sandbox. ${esc(item.desc)}</p>`;
    }
    el("drawerBody").innerHTML = body;
    showDrawer();
  }

  function openDrawerConn(conn, idx) {
    el("drawerBadgeRow").innerHTML = `<span class="drawer-cat mono">Compound move · ${String(idx + 1).padStart(2, "0")}</span>`;
    el("drawerTitle").textContent = conn.title;
    el("drawerDesc").textContent = conn.text;
    el("drawerBody").innerHTML =
      `<p class="block-label">Build prompt <button class="block-copy" data-blockcopy="demo">Copy</button></p>
       <div class="code-block" data-block="demo">${esc(conn.demo)}</div>
       <p class="demo-note">Paste this into a chat to build the full combination in one shot.</p>`;
    showDrawer();
  }

  function showDrawer() { el("scrim").classList.add("open"); el("drawer").classList.add("open"); el("drawer").setAttribute("aria-hidden", "false"); }
  function closeDrawer() { el("scrim").classList.remove("open"); el("drawer").classList.remove("open"); el("drawer").setAttribute("aria-hidden", "true"); }

  // ---- view switching ----
  function setView(v) {
    state.view = v; save("view", v);
    document.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.view === v)));
    el("capsView").style.display = v === "caps" ? "" : "none";
    el("connView").style.display = v === "conn" ? "block" : "none";
  }

  // ---- events ----
  function bind() {
    document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => setView(t.dataset.view)));

    const search = el("search");
    search.value = state.q;
    search.addEventListener("input", () => { state.q = search.value; save("q", state.q); renderList(); });

    el("filters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      state.filter = b.dataset.filter; save("filter", state.filter); renderList();
    });

    el("catList").addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-toggle]");
      if (toggle) {
        const id = toggle.dataset.toggle;
        state.collapsed[id] = !state.collapsed[id]; save("collapsed", state.collapsed);
        toggle.closest(".cat").classList.toggle("collapsed");
        return;
      }
      const copyBtn = e.target.closest("[data-copy]");
      if (copyBtn) {
        e.stopPropagation();
        const row = copyBtn.closest(".row");
        const item = lookupItem(row.dataset.cat, row.dataset.name);
        if (item) copyText(item.prompt || item.label || item.name, copyBtn);
        return;
      }
      const demoBtn = e.target.closest("[data-demo]");
      if (demoBtn) {
        e.stopPropagation();
        const row = demoBtn.closest(".row");
        const cat = CATS.find((c) => c.id === row.dataset.cat);
        const item = lookupItem(row.dataset.cat, row.dataset.name);
        if (item) openDrawerItem(item, cat.label);
        return;
      }
      const row = e.target.closest(".row:not(.na)");
      if (row) {
        const cat = CATS.find((c) => c.id === row.dataset.cat);
        const item = lookupItem(row.dataset.cat, row.dataset.name);
        if (item) openDrawerItem(item, cat.label);
      }
    });

    el("connGrid").addEventListener("click", (e) => {
      const b = e.target.closest("[data-conn]"); if (!b) return;
      const idx = +b.dataset.conn; openDrawerConn(CONNECTIONS[idx], idx);
    });

    el("drawerBody").addEventListener("click", (e) => {
      const b = e.target.closest("[data-blockcopy]"); if (!b) return;
      const block = el("drawerBody").querySelector(`[data-block="${b.dataset.blockcopy}"]`);
      if (block) copyText(block.textContent, b, "✓ copied");
    });

    el("drawerClose").addEventListener("click", closeDrawer);
    el("scrim").addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "/" && document.activeElement !== search) { e.preventDefault(); search.focus(); search.select(); }
    });
  }

  // ---- init ----
  renderStats();
  renderConnections();
  setView(state.view);
  renderList();
  bind();
})();
