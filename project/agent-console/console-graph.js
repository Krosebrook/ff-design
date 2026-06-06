/* FlashFusion Agent Console — Coordination graph (matrix as a node map) */
window.FFGraph = (function () {
  const NS = "http://www.w3.org/2000/svg";
  const VB = 720, CEN = 360, R = 292, NR = 26;
  let C, RELATIONS, AGENTS, byId, DOMAINS;
  let selected = null, mode = "out"; // out | in | both
  let positions = {};

  function hex(hue) { return getComputedStyle(document.documentElement).getPropertyValue("--" + hue).trim() || "#A78BFA"; }
  function svgEl(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }

  function init(api) {
    C = api; byId = api.byId; DOMAINS = api.DOMAINS;
    RELATIONS = window.FF.RELATIONS; AGENTS = window.FF.AGENTS;
    render();
  }

  function render() {
    const view = document.getElementById("view-graph");
    view.innerHTML = `
      <div class="graph-head">
        <div class="gtitle">
          <h1>Coordination <em>graph</em></h1>
          <p>Every line is a real working relationship from the integration matrix. Select an agent to trace who it hands work to — and who depends on it.</p>
        </div>
        <div class="grow"></div>
        <div class="gmode" id="gmode">
          <button data-m="out">Sends to</button>
          <button data-m="in">Receives from</button>
          <button data-m="both">Both</button>
        </div>
      </div>
      <div class="graph-layout">
        <div class="graph-stage"><svg id="gsvg" viewBox="0 0 ${VB} ${VB}" role="img" aria-label="Agent coordination graph"></svg></div>
        <div class="gpanel" id="gpanel"></div>
      </div>`;

    layout();
    drawSvg();
    document.querySelectorAll("#gmode button").forEach(b => {
      b.classList.toggle("on", b.dataset.m === mode);
      b.onclick = () => { mode = b.dataset.m; document.querySelectorAll("#gmode button").forEach(x => x.classList.toggle("on", x.dataset.m === mode)); paint(); renderPanel(); };
    });
    selected = "tessa";
    paint(); renderPanel();
  }

  function layout() {
    positions = {};
    const n = AGENTS.length;
    AGENTS.forEach((a, i) => {
      const ang = -Math.PI / 2 + (i / n) * Math.PI * 2;
      positions[a.id] = { x: CEN + R * Math.cos(ang), y: CEN + R * Math.sin(ang), ang };
    });
  }

  function curve(a, b) {
    const p1 = positions[a], p2 = positions[b];
    // pull control point toward centre for a chord-like arc
    const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    const cx = mx + (CEN - mx) * 0.55, cy = my + (CEN - my) * 0.55;
    return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  function drawSvg() {
    const svg = document.getElementById("gsvg");
    svg.innerHTML = "";
    const gEdges = svgEl("g", { id: "gEdges" });
    const gNodes = svgEl("g", { id: "gNodes" });

    // all directed edges (base layer)
    Object.entries(RELATIONS).forEach(([from, m]) => {
      Object.keys(m).forEach(to => {
        if (!positions[to]) return;
        const p = svgEl("path", { d: curve(from, to), class: "gedge", "data-from": from, "data-to": to });
        gEdges.appendChild(p);
      });
    });

    // nodes
    AGENTS.forEach(a => {
      const pos = positions[a.id], col = hex(DOMAINS[a.domain].hue);
      const g = svgEl("g", { class: "gnode", "data-id": a.id, transform: `translate(${pos.x.toFixed(1)} ${pos.y.toFixed(1)})` });
      const ring = svgEl("circle", { class: "gring", r: NR, cx: 0, cy: 0 });
      ring.style.stroke = col;
      const glyph = svgEl("text", { class: "gglyph", x: 0, y: 1 });
      glyph.style.fill = col; glyph.textContent = a.glyph;
      // label position pushed outward
      const lx = Math.cos(pos.ang) * (NR + 14), ly = Math.sin(pos.ang) * (NR + 14);
      const onLeft = Math.cos(pos.ang) < -0.3, onRight = Math.cos(pos.ang) > 0.3;
      const label = svgEl("text", { class: "glabel", x: lx.toFixed(1), y: (ly + 4).toFixed(1) });
      label.setAttribute("text-anchor", onLeft ? "end" : onRight ? "start" : "middle");
      label.textContent = a.name;
      g.appendChild(ring); g.appendChild(glyph); g.appendChild(label);
      g.addEventListener("click", () => { selected = a.id; paint(); renderPanel(); });
      g.addEventListener("mouseenter", () => { if (!selected) { hoverPaint(a.id); } });
      gNodes.appendChild(g);
    });

    svg.appendChild(gEdges);
    svg.appendChild(gNodes);
  }

  function connectedSet(id) {
    const out = new Set(Object.keys(RELATIONS[id] || {}));
    const inc = new Set(Object.entries(RELATIONS).filter(([, m]) => m[id]).map(([f]) => f));
    let set;
    if (mode === "out") set = out;
    else if (mode === "in") set = inc;
    else set = new Set([...out, ...inc]);
    return { out, inc, set };
  }

  function paint() {
    const svg = document.getElementById("gsvg");
    const edges = svg.querySelectorAll(".gedge");
    const nodes = svg.querySelectorAll(".gnode");
    if (!selected) { edges.forEach(e => e.classList.remove("hot", "inflow")); nodes.forEach(n => n.classList.remove("dim", "sel", "conn")); return; }
    const { out, inc, set } = connectedSet(selected);

    edges.forEach(e => {
      const f = e.getAttribute("data-from"), t = e.getAttribute("data-to");
      let hot = false, inflow = false, col = null;
      if ((mode === "out" || mode === "both") && f === selected && out.has(t)) { hot = true; col = hex(DOMAINS[byId[t].domain].hue); }
      if ((mode === "in" || mode === "both") && t === selected && inc.has(f)) { hot = true; inflow = true; col = hex(DOMAINS[byId[f].domain].hue); }
      e.classList.toggle("hot", hot);
      e.classList.toggle("inflow", inflow && mode !== "both" ? true : (inflow && f !== selected));
      e.style.stroke = hot ? col : "";
      e.style.strokeOpacity = hot ? "" : "0.05";
    });

    nodes.forEach(n => {
      const nid = n.getAttribute("data-id");
      n.classList.toggle("sel", nid === selected);
      n.classList.toggle("conn", set.has(nid));
      n.classList.toggle("dim", nid !== selected && !set.has(nid));
    });
  }

  function hoverPaint(id) {
    const prev = selected; selected = id; paint(); selected = prev;
  }

  function renderPanel() {
    const panel = document.getElementById("gpanel");
    if (!selected) { panel.innerHTML = `<div class="gp-hint">Select any agent in the graph to see its coordination relationships.</div>`; return; }
    const a = byId[selected], d = DOMAINS[a.domain];
    panel.style.setProperty("--dc", hex(d.hue));
    const sends = RELATIONS[selected] || {};
    const recv = Object.entries(RELATIONS).filter(([, m]) => m[selected]);
    const sendRows = Object.entries(sends).map(([cid, label]) => relRow(cid, label)).join("");
    const recvRows = recv.map(([fid, m]) => relRow(fid, m[selected])).join("");

    let body = "";
    if (mode === "out") body = `<div class="gp-sec">Sends work to · ${Object.keys(sends).length}</div><div class="rel-list" style="max-height:none">${sendRows}</div>`;
    else if (mode === "in") body = `<div class="gp-sec">Depended on by · ${recv.length}</div><div class="rel-list" style="max-height:none">${recvRows}</div>`;
    else body = `<div class="gp-sec">Sends to · ${Object.keys(sends).length}</div><div class="rel-list">${sendRows}</div><div class="gp-sec" style="margin-top:16px">Receives from · ${recv.length}</div><div class="rel-list">${recvRows}</div>`;

    panel.innerHTML = `
      <div class="gpanel-head">
        <div class="gp-glyph">${a.glyph}</div>
        <div><div class="gp-name">${a.name}</div><div class="gp-role">${a.role}</div></div>
      </div>
      <div class="gp-counts">
        <div class="gpc out"><div class="v">${Object.keys(sends).length}</div><div class="l">Sends to</div></div>
        <div class="gpc in"><div class="v">${recv.length}</div><div class="l">Receives</div></div>
      </div>
      ${body}
      <button class="gp-open" id="gpOpen">Open full profile →</button>`;
    panel.querySelectorAll("[data-jump]").forEach(r => r.onclick = () => { selected = r.dataset.jump; paint(); renderPanel(); });
    document.getElementById("gpOpen").onclick = () => C.openDrawer(selected);
  }

  function relRow(id, label) {
    const t = byId[id]; if (!t) return "";
    return `<div class="rel-row" data-jump="${id}"><span class="cg" style="color:${C.hueVar(DOMAINS[t.domain].hue)}">${t.glyph}</span><span class="cn">${t.name}</span><span class="rel-lbl">${label}</span></div>`;
  }

  return { init };
})();
