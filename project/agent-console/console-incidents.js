/* FlashFusion Agent Console — Incidents view */
window.FFIncidents = (function () {
  let C, byId, DOMAINS, INCIDENTS;
  let selectedId = null;

  const SEV_LABEL = { P0: "Critical", P1: "Major", P2: "Minor", P3: "Low" };
  const STATUS_LABEL = { active: "Active", monitoring: "Monitoring", resolved: "Resolved" };

  function init(api) {
    C = api; byId = api.byId; DOMAINS = api.DOMAINS;
    INCIDENTS = window.FF.INCIDENTS;
    selectedId = INCIDENTS[0].id;
    render();
  }

  function select(id) { selectedId = id; render(); }

  function render() {
    const view = document.getElementById("view-incidents");
    const open = INCIDENTS.filter(i => i.status !== "resolved").length;
    const resolved = INCIDENTS.filter(i => i.status === "resolved");
    const p0p1 = INCIDENTS.filter(i => i.sev === "P0" || i.sev === "P1").length;

    view.innerHTML = `
      <div class="inc-head">
        <div>
          <h1>Incident <em>log</em></h1>
          <p>How the swarm responds when something breaks — who leads, who's pulled in, and the handoffs that resolved it.</p>
        </div>
        <div class="grow"></div>
        <div class="inc-kpis">
          <div class="inc-kpi"><div class="v" style="color:${open ? "var(--warm)" : "var(--ok)"}">${open}</div><div class="l">Open</div></div>
          <div class="inc-kpi"><div class="v">18m</div><div class="l">Median TTR</div></div>
          <div class="inc-kpi"><div class="v">${p0p1}</div><div class="l">P0 / P1 · 30d</div></div>
        </div>
      </div>
      <div class="inc-layout">
        <div class="inc-list" id="incList"></div>
        <div class="inc-detail" id="incDetail"></div>
      </div>`;

    const list = document.getElementById("incList");
    INCIDENTS.forEach(inc => list.appendChild(card(inc)));
    renderDetail();
  }

  function card(inc) {
    const el = C.el("button", `inc-card sev-${inc.sev} st-${inc.status}` + (inc.id === selectedId ? " sel" : ""));
    const avatars = inc.agents.slice(0, 5).map(id => {
      const a = byId[id];
      return `<span style="color:${C.hueVar(DOMAINS[a.domain].hue)}">${a.glyph}</span>`;
    }).join("");
    const more = inc.agents.length > 5 ? `<span style="color:var(--text-3)">+${inc.agents.length - 5}</span>` : "";
    el.innerHTML = `
      <div class="ic-top">
        <span class="inc-sev" style="font:700 9.5px 'JetBrains Mono';padding:2px 6px;border-radius:5px">${inc.sev}</span>
        <span class="ic-id">${inc.id}</span>
        <span class="ic-status"><span class="d"></span>${STATUS_LABEL[inc.status]}</span>
      </div>
      <div class="ic-title">${inc.title}</div>
      <div class="ic-meta">
        <div class="ic-avatars">${avatars}${more}</div>
        <span>·</span><span>${inc.age}</span>
      </div>`;
    el.querySelector(".inc-sev").classList.add("x");
    el.onclick = () => { selectedId = inc.id; render(); };
    // sev chip color
    const chip = el.querySelector(".inc-sev");
    chip.style.color = sevColor(inc.sev);
    chip.style.background = sevBg(inc.sev);
    return el;
  }

  function sevColor(s) { return { P0: "var(--bad)", P1: "var(--warm)", P2: "var(--accent)", P3: "var(--text-2)" }[s]; }
  function sevBg(s) { return { P0: "rgba(239,68,68,0.14)", P1: "rgba(245,165,36,0.14)", P2: "var(--accent-soft)", P3: "rgba(255,255,255,0.05)" }[s]; }

  function renderDetail() {
    const inc = INCIDENTS.find(i => i.id === selectedId) || INCIDENTS[0];
    const detail = document.getElementById("incDetail");
    const statusColor = inc.status === "resolved" ? "var(--ok)" : inc.status === "active" ? "var(--warm)" : "var(--accent)";

    const roster = inc.agents.map(id => {
      const a = byId[id];
      const lead = id === inc.lead ? " lead" : "";
      return `<button class="ir-chip${lead}" data-jump="${id}"><span class="g" style="color:${C.hueVar(DOMAINS[a.domain].hue)};border:1px solid var(--line)">${a.glyph}</span>${a.name}</button>`;
    }).join("");

    // build timeline with synthetic clock starting at opened time
    const steps = inc.timeline.map((s, i) => {
      const [from, to, msg, , running] = s;
      const fa = byId[from], ta = byId[to];
      const fromChip = `<span class="tl-who" data-jump="${from}" style="color:${C.hueVar(DOMAINS[fa.domain].hue)}">${fa.name}</span>`;
      const toChip = ta ? `<span class="tl-who" data-jump="${to}" style="color:${C.hueVar(DOMAINS[ta.domain].hue)}">${ta.name}</span>` : C.prettyName(to);
      const t = clockFor(inc, i);
      return `<div class="tl-step${running ? " running" : ""}">
        <span class="tl-dot"></span>
        <div class="tl-row">${fromChip}<span class="tl-arrow">→</span>${toChip}<span class="tl-msg"> &nbsp;${msg}</span></div>
        <div class="tl-time">${t}${running ? " · in progress" : ""}</div>
      </div>`;
    }).join("");

    detail.innerHTML = `
      <div class="ind-top">
        <span class="ind-sev" style="color:${sevColor(inc.sev)};background:${sevBg(inc.sev)}">${inc.sev}</span>
        <div>
          <div class="ind-h">${inc.title}</div>
          <div class="ind-sub">${inc.id} · opened ${inc.opened} · ${SEV_LABEL[inc.sev]}</div>
        </div>
        <span class="ind-status-badge" style="color:${statusColor}"><span style="width:7px;height:7px;border-radius:50%;background:${statusColor};display:inline-block"></span>${STATUS_LABEL[inc.status]}</span>
      </div>
      <div class="ind-grid">
        <div class="ind-cell"><h6>Impact</h6><p>${inc.impact}</p></div>
        <div class="ind-cell"><h6>${inc.status === "resolved" ? "Root cause" : "Working theory"}</h6><p>${inc.cause}</p></div>
      </div>
      <div class="ind-tl-h">Responders</div>
      <div class="ind-roster">${roster}</div>
      <div class="ind-tl-h">Response timeline${inc.patternRef ? ` · pattern ${inc.patternRef}` : ""}</div>
      <div class="timeline">${steps}</div>`;

    detail.querySelectorAll("[data-jump]").forEach(r => r.onclick = () => C.openDrawer(r.dataset.jump));
  }

  function clockFor(inc, i) {
    // parse "Jun 3 · 14:22" -> base minutes, add small offsets per step
    const m = inc.opened.match(/(\d{1,2}):(\d{2})/);
    let base = m ? (+m[1]) * 60 + (+m[2]) : 0;
    const t = base + i * Math.max(1, Math.round(2 + i * 0.6));
    const hh = String(Math.floor(t / 60) % 24).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return { init, select };
})();
