/* FlashFusion Agent Console — app logic */
(function () {
  const { DOMAINS, AGENTS, PATTERNS, CHATTER } = window.FF;
  const byId = Object.fromEntries(AGENTS.map(a => [a.id, a]));
  const hueVar = h => `var(--${h})`;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  const STATUS_LABEL = { active: "Active", queued: "Queued", standby: "Standby", blocked: "Blocked", idle: "Idle" };

  // ---------- state ----------
  let activeDomain = null;     // domain filter
  let searchTerm = "";
  let selectedPattern = PATTERNS[0];
  let running = false;
  let feedTimer = null;
  let feedSpeed = 3500;

  // ============================================================ LEGEND
  function renderLegend() {
    const wrap = $("#legend");
    wrap.innerHTML = "";
    Object.entries(DOMAINS).forEach(([key, d]) => {
      const n = AGENTS.filter(a => a.domain === key).length;
      const b = el("button", "legend-item" + (activeDomain === key ? " active" : ""));
      b.innerHTML = `<span class="sw" style="background:${hueVar(d.hue)}"></span>${d.label}<span class="n">${n}</span>`;
      b.onclick = () => { activeDomain = activeDomain === key ? null : key; renderLegend(); renderRoster(); };
      wrap.appendChild(b);
    });
  }

  // ============================================================ STATS
  function renderStats() {
    const counts = AGENTS.reduce((m, a) => (m[a.status] = (m[a.status] || 0) + 1, m), {});
    const online = AGENTS.length;
    const active = counts.active || 0;
    const cards = [
      { lbl: "Agents online", val: online, sub: `<span style="color:var(--acid)">${active} active</span> · ${(counts.idle||0)+(counts.standby||0)} on standby`, cls: "ok" },
      { lbl: "Tasks in flight", val: 7, sub: `2 deploys · 1 experiment ramping`, cls: "ok" },
      { lbl: "Open incidents", val: 0, sub: `<span style="color:var(--ok)">▲</span> Agent K armed on standby`, cls: "ok" },
      { lbl: "Error budget", val: `92<small>%</small>`, sub: `All SLOs green · p95 218ms`, cls: "ok" },
    ];
    const wrap = $("#stats");
    wrap.innerHTML = "";
    cards.forEach(c => {
      const e = el("div", "stat " + c.cls);
      e.innerHTML = `<div class="lbl">${c.lbl}</div><div class="val">${c.val}</div><div class="sub">${c.sub}</div>`;
      wrap.appendChild(e);
    });
  }

  // ============================================================ ROSTER
  function matchesSearch(a) {
    if (!searchTerm) return true;
    const hay = (a.name + " " + a.role + " " + a.framework + " " + a.tools.join(" ") + " " + a.triggers.join(" ")).toLowerCase();
    return hay.includes(searchTerm);
  }

  function agentCard(a) {
    const d = DOMAINS[a.domain];
    const card = el("button", `agent st-${a.status}`);
    card.style.setProperty("--dc", hueVar(d.hue));
    card.dataset.agent = a.id;
    card.innerHTML = `
      <div class="a-top">
        <div class="glyph">${a.glyph}</div>
        <div class="a-id">
          <div class="a-name">${a.name}</div>
          <div class="a-role">${a.role}</div>
        </div>
        <div class="fw">${a.framework}</div>
      </div>
      <div class="a-now">${a.now}</div>
      <div class="a-foot">
        <span class="status-dot"></span>
        <span class="status-lbl">${STATUS_LABEL[a.status]}</span>
        <span class="toolcount">${a.tools.length} tools</span>
      </div>`;
    card.onclick = () => openDrawer(a.id);
    return card;
  }

  function renderRoster() {
    const wrap = $("#rosterWrap");
    wrap.innerHTML = "";
    let shown = 0;
    Object.entries(DOMAINS).forEach(([key, d]) => {
      if (activeDomain && activeDomain !== key) return;
      const list = AGENTS.filter(a => a.domain === key);
      const visible = list.filter(matchesSearch);
      if (visible.length === 0 && searchTerm) return;
      const group = el("div", "domain-group");
      group.innerHTML = `<div class="domain-label">
        <span class="sw" style="background:${hueVar(d.hue)}"></span>
        <span class="t">${d.label}</span>
        <span class="b">${d.blurb}</span>
        <span class="line"></span>
      </div>`;
      const grid = el("div", "roster");
      list.forEach(a => {
        const c = agentCard(a);
        if (!matchesSearch(a)) c.classList.add("dim");
        else shown++;
        grid.appendChild(c);
      });
      group.appendChild(grid);
      wrap.appendChild(group);
    });
    $("#rosterMeta").textContent = searchTerm ? `${shown} match${shown === 1 ? "" : "es"}` : `${AGENTS.length} agents`;
  }

  // ============================================================ DRAWER
  function openDrawer(id) {
    const a = byId[id];
    const d = DOMAINS[a.domain];
    const body = $("#drawerBody");
    body.style.setProperty("--dc", hueVar(d.hue));

    const coordList = a.escalates.map(eid => {
      const t = byId[eid];
      if (!t) return `<div class="coord-row"><span class="cg esc">↑</span><span class="cn">${prettyName(eid)}</span><span class="cr">escalation</span></div>`;
      return `<div class="coord-row" data-jump="${eid}"><span class="cg" style="color:${hueVar(DOMAINS[t.domain].hue)}">${t.glyph}</span><span class="cn">${t.name}</span><span class="cr esc">escalates to</span></div>`;
    }).join("");

    // matrix relations — what THIS agent asks of others (outgoing) and what others ask of it (incoming)
    const { RELATIONS, INCIDENTS } = window.FF;
    const sends = RELATIONS[id] || {};
    const sendRows = Object.entries(sends).map(([cid, label]) => {
      const t = byId[cid]; if (!t) return "";
      return `<div class="rel-row" data-jump="${cid}"><span class="cg" style="color:${hueVar(DOMAINS[t.domain].hue)}">${t.glyph}</span><span class="cn">${t.name}</span><span class="rel-lbl">${label}</span></div>`;
    }).join("");
    const recv = Object.entries(RELATIONS).filter(([, m]) => m[id]).map(([fid, m]) => {
      const t = byId[fid]; if (!t) return "";
      return `<div class="rel-row" data-jump="${fid}"><span class="cg" style="color:${hueVar(DOMAINS[t.domain].hue)}">${t.glyph}</span><span class="cn">${t.name}</span><span class="rel-lbl">${m[id]}</span></div>`;
    }).join("");
    const sendN = Object.keys(sends).length;
    const recvN = Object.values(RELATIONS).filter(m => m[id]).length;
    const incs = INCIDENTS.filter(inc => inc.agents.includes(id));
    const incRows = incs.map(inc => `<div class="inc-mini sev-${inc.sev}" data-inc="${inc.id}"><span class="inc-sev">${inc.sev}</span><span class="inc-mini-t">${inc.title}</span><span class="inc-mini-id">${inc.id}</span></div>`).join("") || `<div class="d-identity" style="color:var(--text-3);font-size:12.5px">No incident involvement on record.</div>`;

    body.innerHTML = `
      <div class="d-head">
        <div class="d-glyph">${a.glyph}</div>
        <div>
          <div class="d-name">${a.name}</div>
          <div class="d-role">${a.role}</div>
          <div class="d-meta">
            <span class="d-badge fw">${a.framework}</span>
            <span class="d-badge">${d.label}</span>
          </div>
        </div>
      </div>
      <div class="d-now st-${a.status}">
        <span class="status-dot"></span>
        <span>${a.now}</span>
        <span class="status-lbl">${STATUS_LABEL[a.status]}</span>
      </div>
      <div class="d-sec"><h5>Identity</h5><div class="d-identity">${a.identity}</div></div>
      <div class="d-sec"><h5>Triggers</h5><div class="chips">${a.triggers.map(t => `<span class="chip">${t}</span>`).join("")}</div></div>
      <div class="d-sec"><h5>Tooling</h5><div class="chips">${a.tools.map(t => `<span class="chip t">${t}</span>`).join("")}</div></div>
      <div class="d-sec"><h5>Permissions</h5>
        <div class="perm-grid">
          <div class="pk">Read</div><div class="pv">${a.perms.read.map(p => `<span class="chip">${p}</span>`).join("")}</div>
          <div class="pk w">Write</div><div class="pv">${a.perms.write.map(p => `<span class="chip">${p}</span>`).join("")}</div>
          <div class="pk x">Exec</div><div class="pv">${a.perms.execute.map(p => `<span class="chip">${p}</span>`).join("")}</div>
        </div>
      </div>
      <div class="d-sec"><h5>Coordination</h5>
        <div class="rel-cols">
          <div class="rel-block"><h6>Sends to <span class="n">${sendN}</span></h6><div class="rel-list">${sendRows}</div></div>
          <div class="rel-block"><h6>Receives from <span class="n">${recvN}</span></h6><div class="rel-list">${recv}</div></div>
        </div>
      </div>
      <div class="d-sec"><h5>Incident history</h5>${incRows}</div>
      <div class="d-sec"><h5>Escalation path</h5><div class="coord">${coordList}</div></div>
    `;
    body.querySelectorAll("[data-jump]").forEach(r => r.onclick = () => openDrawer(r.dataset.jump));
    body.querySelectorAll("[data-inc]").forEach(r => r.onclick = () => { closeDrawer(); setView("incidents"); window.FFIncidents && window.FFIncidents.select(r.dataset.inc); });
    $("#scrim").classList.add("open");
    $("#drawer").classList.add("open");
  }
  function closeDrawer() { $("#scrim").classList.remove("open"); $("#drawer").classList.remove("open"); }
  function prettyName(id) { return id.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" "); }

  // ============================================================ FEED
  let feedCount = 0;
  function timeStamp(offsetSec = 0) {
    const d = new Date(Date.now() - offsetSec * 1000);
    return d.toTimeString().slice(0, 8);
  }
  function feedRow(from, to, msg, fresh) {
    const fa = byId[from], ta = byId[to];
    const row = el("div", "feed-row" + (fresh ? " fresh" : ""));
    const fromChip = fa ? `<span class="who-chip" data-jump="${from}" style="color:${hueVar(DOMAINS[fa.domain].hue)}">${fa.name}</span>` : prettyName(from);
    const toChip = ta ? `<span class="who-chip" data-jump="${to}" style="color:${hueVar(DOMAINS[ta.domain].hue)}">${ta.name}</span>` : prettyName(to);
    row.innerHTML = `<div class="stamp">${timeStamp()}</div><div class="fbody">${fromChip}<span class="arrow">→</span>${toChip}<br>${msg}</div>`;
    row.querySelectorAll("[data-jump]").forEach(c => c.onclick = e => { e.stopPropagation(); openDrawer(c.dataset.jump); });
    return row;
  }
  function seedFeed() {
    const feed = $("#feed");
    feed.innerHTML = "";
    // seed with a handful, oldest pushed first so newest ends on top
    const seed = CHATTER.slice(0, 6);
    seed.forEach((c) => feed.appendChild(feedRow(c[0], c[1], c[2], false)));
    feedCount = seed.length;
    // re-stamp seeds with descending times for realism
    [...feed.children].forEach((row, i) => { row.querySelector(".stamp").textContent = timeStamp((i + 1) * 37); });
  }
  function pushFeed(from, to, msg) {
    const feed = $("#feed");
    const row = feedRow(from, to, msg, true);
    feed.insertBefore(row, feed.firstChild);
    setTimeout(() => row.classList.remove("fresh"), 1200);
    while (feed.children.length > 40) feed.removeChild(feed.lastChild);
    feedCount++;
  }
  function tickFeed() {
    const c = CHATTER[Math.floor(Math.random() * CHATTER.length)];
    pushFeed(c[0], c[1], c[2]);
  }
  function startFeed() { stopFeed(); feedTimer = setInterval(tickFeed, feedSpeed); }
  function stopFeed() { if (feedTimer) clearInterval(feedTimer); feedTimer = null; }

  // ============================================================ DISPATCH
  function renderPatterns() {
    const grid = $("#patGrid");
    grid.innerHTML = "";
    PATTERNS.forEach(p => {
      const c = el("button", "pat-card" + (p === selectedPattern ? " sel" : ""));
      c.style.setProperty("--ptone", hueVar(p.tone));
      c.innerHTML = `
        <div class="pi"><span class="pbadge">${p.id}</span><span class="pttl">${p.title}</span><span class="plen">${p.chain.length}★</span></div>
        <div class="ptrig">${p.trigger}</div>`;
      c.onclick = () => { if (running) return; selectedPattern = p; renderPatterns(); renderRunner(); };
      grid.appendChild(c);
    });
  }

  function renderRunner() {
    const p = selectedPattern;
    const r = $("#runner");
    r.style.setProperty("--ptone", hueVar(p.tone));
    const flow = p.chain.map((id, i) => {
      const a = byId[id], dh = DOMAINS[a.domain].hue;
      const node = `<div class="flow-node" data-i="${i}" style="--dc:${hueVar(dh)}"><div class="fg">${a.glyph}</div><div class="fn">${a.name}</div></div>`;
      const arrow = i < p.chain.length - 1 ? `<div class="flow-arrow" data-arrow="${i}">→</div>` : "";
      return node + arrow;
    }).join("");
    r.innerHTML = `
      <div class="runner-head">
        <div class="rtitle"><span class="pb">Pattern ${p.id}</span> · ${p.title}</div>
        <div class="grow"></div>
        <button class="run-btn reset" id="resetBtn">Reset</button>
        <button class="run-btn" id="runBtn">▶ Run dispatch</button>
      </div>
      <div class="trigger-line">Trigger: <b>"${p.trigger}"</b></div>
      <div class="flow" id="flow">${flow}</div>
      <div class="dispatch-log" id="dispatchLog"><div class="dl-empty">Press <b>Run dispatch</b> to send the request through the swarm…</div></div>`;
    $("#runBtn").onclick = runDispatch;
    $("#resetBtn").onclick = () => { if (!running) renderRunner(); };
  }

  function runDispatch() {
    if (running) return;
    running = true;
    const p = selectedPattern;
    const flow = $("#flow");
    const nodes = [...flow.querySelectorAll(".flow-node")];
    const arrows = [...flow.querySelectorAll(".flow-arrow")];
    const log = $("#dispatchLog");
    log.innerHTML = "";
    $("#runBtn").disabled = true; $("#runBtn").textContent = "● Running…";
    nodes.forEach(n => n.classList.remove("lit", "done"));
    arrows.forEach(n => n.classList.remove("lit"));
    // light first node
    nodes[0].classList.add("lit");
    pingRosterAgent(p.chain[0]);

    let i = 0;
    const step = () => {
      const s = p.steps[i];
      const [from, to, msg] = s;
      // mark nodes
      const fromIdx = p.chain.indexOf(from, i === 0 ? 0 : 0);
      // light "to" node (next in chain) and arrow
      const toNodeIdx = p.chain.indexOf(to);
      if (i < arrows.length) arrows[i].classList.add("lit");
      nodes[i] && nodes[i].classList.add("done");
      if (toNodeIdx >= 0 && nodes[toNodeIdx]) nodes[toNodeIdx].classList.add("lit");
      pingRosterAgent(to);

      // log row
      const fa = byId[from], ta = byId[to];
      const row = el("div", "dl-row");
      const fromChip = `<span class="who-chip" data-jump="${from}" style="color:${hueVar(DOMAINS[fa.domain].hue)}">${fa.name}</span>`;
      const toChip = ta ? `<span class="who-chip" data-jump="${to}" style="color:${hueVar(DOMAINS[ta.domain].hue)}">${ta.name}</span>` : prettyName(to);
      row.innerHTML = `<div class="step-n">${String(i + 1).padStart(2, "0")}</div><div class="dl-body">${fromChip}<span class="arrow" style="color:var(--text-3);margin:0 4px">→</span>${toChip} &nbsp;${msg}</div>`;
      row.querySelectorAll("[data-jump]").forEach(c => c.onclick = () => openDrawer(c.dataset.jump));
      log.appendChild(row);
      // mirror into the live activity feed
      pushFeed(from, to, msg);

      i++;
      if (i < p.steps.length) {
        setTimeout(step, 950);
      } else {
        nodes[nodes.length - 1].classList.add("done");
        const done = el("div", "dl-row");
        done.innerHTML = `<div class="step-n" style="color:var(--acid)">✓</div><div class="dl-body" style="color:var(--acid)">Workflow complete — ${p.chain.length} agents, ${p.steps.length} handoffs, 0 dropped context.</div>`;
        log.appendChild(done);
        running = false;
        $("#runBtn").disabled = false; $("#runBtn").textContent = "▶ Run again";
      }
    };
    setTimeout(step, 600);
  }

  function pingRosterAgent(id) {
    const card = document.querySelector(`.agent[data-agent="${id}"]`);
    if (!card) return;
    card.classList.add("pinging");
    setTimeout(() => card.classList.remove("pinging"), 1100);
  }

  // ============================================================ VIEWS
  const VIEW_LABELS = { ops: "console", graph: "coordination", dispatch: "dispatch", incidents: "incidents" };
  function setView(v) {
    document.querySelectorAll(".nav-item[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === v));
    document.querySelectorAll(".view").forEach(s => s.classList.toggle("active", s.id === "view-" + v));
    $("#crumb").textContent = VIEW_LABELS[v] || v;
    $(".scroller").scrollTop = 0;
  }

  // ============================================================ CLOCK
  function tickClock() {
    $("#clock").textContent = new Date().toTimeString().slice(0, 8) + " UTC";
  }

  // ============================================================ TWEAKS
  const ACCENTS = [
    { name: "violet", a: "#A78BFA", a2: "#7C3AED" },
    { name: "teal", a: "#2DD4BF", a2: "#0D9488" },
    { name: "rose", a: "#F472B6", a2: "#DB2777" },
    { name: "amber", a: "#F5A524", a2: "#D97706" },
    { name: "acid", a: "#C7F73F", a2: "#84CC16" },
  ];
  const TW = loadTweaks();
  function loadTweaks() {
    try { return Object.assign({ accent: "violet", density: "regular", motion: "on", speed: 3500 }, JSON.parse(localStorage.getItem("ff-console-tweaks") || "{}")); }
    catch { return { accent: "violet", density: "regular", motion: "on", speed: 3500 }; }
  }
  function saveTweaks() { localStorage.setItem("ff-console-tweaks", JSON.stringify(TW)); }
  function applyTweaks() {
    const acc = ACCENTS.find(x => x.name === TW.accent) || ACCENTS[0];
    const root = document.documentElement.style;
    root.setProperty("--accent", acc.a);
    root.setProperty("--accent-2", acc.a2);
    root.setProperty("--accent-soft", hexA(acc.a, 0.10));
    root.setProperty("--accent-line", hexA(acc.a, 0.28));
    root.setProperty("--line", hexA(acc.a, 0.14));
    root.setProperty("--line-strong", hexA(acc.a, 0.28));
    root.setProperty("--row", TW.density === "compact" ? "0.72" : "1");
    document.body.classList.toggle("no-motion", TW.motion === "off");
    feedSpeed = TW.speed;
    if (TW.motion === "off") stopFeed(); else startFeed();
    // reflect control states
    $("#twAccent").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.v === TW.accent));
    $("#twDensity").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.v === TW.density));
    $("#twMotion").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.v === TW.motion));
    $("#twSpeed").value = TW.speed;
  }
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function buildTweakControls() {
    const accWrap = $("#twAccent");
    ACCENTS.forEach(a => {
      const b = el("button");
      b.dataset.v = a.name; b.style.background = a.a;
      b.title = a.name;
      b.onclick = () => { TW.accent = a.name; saveTweaks(); applyTweaks(); };
      accWrap.appendChild(b);
    });
    $("#twDensity").querySelectorAll("button").forEach(b => b.onclick = () => { TW.density = b.dataset.v; saveTweaks(); applyTweaks(); });
    $("#twMotion").querySelectorAll("button").forEach(b => b.onclick = () => { TW.motion = b.dataset.v; saveTweaks(); applyTweaks(); });
    $("#twSpeed").oninput = e => { TW.speed = +e.target.value; saveTweaks(); applyTweaks(); };
  }
  // host protocol
  function initTweaksHost() {
    const panel = $("#tweaks");
    window.addEventListener("message", e => {
      const t = e?.data?.type;
      if (t === "__activate_edit_mode") panel.classList.add("show");
      else if (t === "__deactivate_edit_mode") panel.classList.remove("show");
    });
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    $("#twClose").onclick = () => { panel.classList.remove("show"); try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {} };
    // draggable
    const head = $("#twHead"); let drag = null;
    head.addEventListener("mousedown", e => {
      if (e.target.id === "twClose") return;
      const r = panel.getBoundingClientRect();
      drag = { x: e.clientX, y: e.clientY, l: r.left, t: r.top };
      panel.style.right = "auto"; panel.style.bottom = "auto"; panel.style.left = r.left + "px"; panel.style.top = r.top + "px";
      e.preventDefault();
    });
    window.addEventListener("mousemove", e => {
      if (!drag) return;
      panel.style.left = (drag.l + e.clientX - drag.x) + "px";
      panel.style.top = (drag.t + e.clientY - drag.y) + "px";
    });
    window.addEventListener("mouseup", () => drag = null);
  }

  // ============================================================ INIT
  function init() {
    // expose a small API for the graph + incidents modules
    window.FFC = { byId, DOMAINS, hueVar, el, openDrawer, closeDrawer, setView, pushFeed, STATUS_LABEL, prettyName };

    renderLegend();
    renderStats();
    renderRoster();
    seedFeed();
    renderPatterns();
    renderRunner();
    buildTweakControls();
    initTweaksHost();
    applyTweaks();

    // boot the optional view modules
    if (window.FFGraph) window.FFGraph.init(window.FFC);
    if (window.FFIncidents) window.FFIncidents.init(window.FFC);

    // incident count badge
    const openInc = window.FF.INCIDENTS.filter(i => i.status !== "resolved").length;
    const badge = $("#incCount");
    if (badge && openInc) { badge.textContent = openInc; badge.style.color = "var(--warm)"; }

    document.querySelectorAll(".nav-item[data-view]").forEach(b => b.onclick = () => setView(b.dataset.view));
    $("#scrim").onclick = closeDrawer;
    $("#drawerClose").onclick = closeDrawer;
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") { closeDrawer(); }
      if (e.key === "/" && document.activeElement !== $("#search")) { e.preventDefault(); $("#search").focus(); }
    });
    $("#search").addEventListener("input", e => { searchTerm = e.target.value.trim().toLowerCase(); renderRoster(); });
    $("#feed").querySelectorAll("[data-jump]").forEach(c => c.onclick = () => openDrawer(c.dataset.jump));

    tickClock(); setInterval(tickClock, 1000);
  }
  document.addEventListener("DOMContentLoaded", init);
})();
