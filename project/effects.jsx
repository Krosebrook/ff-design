/* FlashFusion Canvas — visual primitives & effects.
 * Particles, ripple, ticker, marching ants, tooltip, kbd hints, glow orbs.
 */
const { useEffect: fxUseEffect, useRef: fxUseRef, useState: fxUseState, useMemo: fxUseMemo } = React;

/* ─── ParticleField — canvas dot grid with parallax pulse ───────────────── */
function ParticleField({ density = 0.00012, color = "rgba(168,85,247,0.55)", linkColor = "rgba(34,211,238,0.18)" }) {
  const ref = fxUseRef(null);
  fxUseEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, particles = [], w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(40, Math.floor(w * h * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.2 + 0.4
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        // Mouse attraction (subtle)
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx*dx + dy*dy;
        if (d2 < 12000) { p.vx += dx * 0.00002; p.vy += dy * 0.00002; }
        // friction
        p.vx *= 0.985; p.vy *= 0.985;
        // base drift
        p.vx += (Math.random() - 0.5) * 0.012;
        p.vy += (Math.random() - 0.5) * 0.012;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      // links
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx*dx + dy*dy;
          if (d2 < 6500) {
            ctx.globalAlpha = 1 - d2 / 6500;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    function onMove(e) { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }
    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, color, linkColor]);
  return <canvas ref={ref} className="ff-particles" aria-hidden="true" />;
}

/* ─── BackgroundLayers — aurora + grid + particles in one ───────────────── */
function BackgroundLayers() {
  return (
    <>
      <div className="ff-aurora" aria-hidden="true" />
      <div className="ff-grid" aria-hidden="true" />
      <ParticleField />
    </>
  );
}

/* ─── Ripple — attaches click ripple to any wrapper ─────────────────────── */
function Ripple({ as: Tag = "button", className = "", children, onClick, ...rest }) {
  const ref = fxUseRef(null);
  function handle(e) {
    const el = ref.current;
    if (el) {
      const burst = document.createElement("span");
      burst.className = "ff-ripple-burst";
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      burst.style.width = burst.style.height = size + "px";
      burst.style.left = (e.clientX - rect.left - size / 2) + "px";
      burst.style.top  = (e.clientY - rect.top  - size / 2) + "px";
      el.appendChild(burst);
      setTimeout(() => burst.remove(), 620);
    }
    if (onClick) onClick(e);
  }
  return (
    <Tag ref={ref} {...rest} onClick={handle} className={`ff-ripple ${className}`}>
      {children}
    </Tag>
  );
}

/* ─── CountUp — animates from prev value to next over `dur` ms ──────────── */
function CountUp({ value, dur = 600, format = (v) => v }) {
  const [shown, setShown] = fxUseState(value);
  const fromRef = fxUseRef(value);
  const startRef = fxUseRef(0);
  const rafRef = fxUseRef(0);
  fxUseEffect(() => {
    fromRef.current = shown;
    startRef.current = performance.now();
    const target = value;
    function step(now) {
      const t = Math.min(1, (now - startRef.current) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = fromRef.current + (target - fromRef.current) * eased;
      setShown(Math.round(v));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line
  }, [value]);
  return <span className="ff-ticker">{format(shown)}</span>;
}

/* ─── Tooltip — wrap any child ──────────────────────────────────────────── */
function Tooltip({ label, children }) {
  return (
    <span className="ff-tip-host relative inline-flex" tabIndex={0}>
      {children}
      <span className="ff-tip">{label}</span>
    </span>
  );
}

/* ─── Kbd hint ──────────────────────────────────────────────────────────── */
function Kbd({ children }) {
  return <kbd className="ff-kbd">{children}</kbd>;
}

/* ─── MarchingAnts wrapper ──────────────────────────────────────────────── */
function Marching({ active = true, className = "", children, ...rest }) {
  return (
    <div {...rest} className={`${active ? "ff-ants" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* ─── GlowOrb — decorative drifting orb ─────────────────────────────────── */
function GlowOrb({ size = 280, color = "rgba(124,58,237,0.35)", style = {} }) {
  return (
    <div
      aria-hidden="true"
      className="ff-orb pointer-events-none absolute rounded-full"
      style={{
        width: size, height: size,
        background: `radial-gradient(closest-side, ${color}, transparent 70%)`,
        filter: "blur(12px)",
        ...style
      }}
    />
  );
}

/* ─── Sparkline — tiny inline activity bars ─────────────────────────────── */
function Sparkline({ data, height = 28, color = "#22D3EE" }) {
  const max = Math.max(1, ...data);
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${data.length * 6} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {data.map((v, i) => {
        const h = (v / max) * (height - 4);
        return <rect key={i} x={i * 6} y={height - h - 2} width="4" height={Math.max(2, h)} rx="1" fill={color} opacity="0.75" />;
      })}
    </svg>
  );
}

/* ─── Glassy panel — used everywhere ────────────────────────────────────── */
function Panel({ className = "", children, ...rest }) {
  return (
    <div {...rest} className={`rounded-3xl border border-white/10 bg-[#0B0F1A]/78 shadow-2xl backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

/* ─── Pill tag ──────────────────────────────────────────────────────────── */
function Pill({ tone = "violet", children, className = "" }) {
  const tones = {
    violet:  "bg-violet-500/12 text-violet-200 border-violet-300/20",
    cyan:    "bg-cyan-500/12 text-cyan-200 border-cyan-300/20",
    pink:    "bg-pink-500/12 text-pink-200 border-pink-300/20",
    emerald: "bg-emerald-500/12 text-emerald-200 border-emerald-300/20",
    amber:   "bg-amber-500/12 text-amber-200 border-amber-300/20",
    slate:   "bg-white/5 text-slate-300 border-white/10",
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tones[tone] || tones.slate} ${className}`}>{children}</span>;
}

/* ─── Section heading helper ────────────────────────────────────────────── */
function SectionHead({ eyebrow, title, sub, right }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-6">
      <div>
        {eyebrow ? <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">{eyebrow}</p> : null}
        <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
        {sub ? <p className="mt-1 max-w-xl text-sm text-slate-400">{sub}</p> : null}
      </div>
      {right}
    </div>
  );
}

Object.assign(window, {
  ParticleField, BackgroundLayers, Ripple, CountUp, Tooltip, Kbd,
  Marching, GlowOrb, Sparkline, Panel, Pill, SectionHead
});
