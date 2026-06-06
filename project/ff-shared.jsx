/* ─────────────────────────────────────────────────────────────────────────────
   FlashFusion · shared brand atoms
   ───────────────────────────────────────────────────────────────────────────── */

// Lightning-bolt logo mark, scalable. Uses brand triad.
function FFMark({ size = 32, glow = false }) {
  return (
    <div className="ff-mark" style={{
      width: size, height: size,
      boxShadow: glow
        ? '0 0 0 1px rgba(0,0,0,0.4), 0 0 24px rgba(168,85,247,0.6), 0 10px 30px -10px rgba(244,114,182,0.5)'
        : '0 0 0 1px rgba(0,0,0,0.4), 0 10px 30px -10px rgba(168,85,247,0.5)',
    }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id={`ff-bolt-${size}`} x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A855F7" />
            <stop offset="0.55" stopColor="#F472B6" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 L15 2 Z"
              fill={`url(#ff-bolt-${size})`} stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function FFWordmark({ size = 18 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <FFMark size={size * 1.7} />
      <div className="ff-wordmark" style={{ fontSize: size }}>
        Flash<span className="a">Fusion</span>
      </div>
    </div>
  );
}

// Eyebrow label — mono caps with bullet
function Eyebrow({ children, color = 'var(--ff-purple)', dot = true }) {
  return (
    <div className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontSize: 12, fontWeight: 600, letterSpacing: '0.18em',
      textTransform: 'uppercase', color
    }}>
      {dot && <span style={{
        width: 6, height: 6, borderRadius: '50%', background: color,
        boxShadow: `0 0 8px ${color}`
      }} />}
      {children}
    </div>
  );
}

// Glassy card with thin gradient top edge
function GlassCard({ children, style = {}, accent = false, padding = 24 }) {
  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, rgba(26,11,46,0.7), rgba(15,6,24,0.55))',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${accent ? 'var(--ff-border-strong)' : 'var(--ff-border)'}`,
      borderRadius: 16,
      padding,
      overflow: 'hidden',
      ...style
    }}>
      {accent && (
        <div style={{
          position: 'absolute', inset: '0 0 auto 0', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)'
        }} />
      )}
      {children}
    </div>
  );
}

// Reusable "ambient" deep-space background — purple/cyan blooms + dot grid
function AmbientBG({ children, style = {}, dots = true, blooms = true, vignette = true }) {
  return (
    <div style={{
      position: 'relative',
      background: 'var(--ff-base)',
      color: 'var(--ff-text)',
      overflow: 'hidden',
      ...style
    }}>
      {blooms && (
        <>
          <div style={{
            position: 'absolute', width: 700, height: 700, top: -200, left: -200,
            background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 60%)',
            filter: 'blur(40px)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', width: 600, height: 600, top: 200, right: -150,
            background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 60%)',
            filter: 'blur(40px)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', width: 500, height: 500, bottom: -100, left: '30%',
            background: 'radial-gradient(circle, rgba(244,114,182,0.16), transparent 60%)',
            filter: 'blur(40px)', pointerEvents: 'none'
          }} />
        </>
      )}
      {dots && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(168,85,247,0.18) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent 80%)',
          pointerEvents: 'none', opacity: 0.6
        }} />
      )}
      {vignette && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, transparent, rgba(6,3,12,0.6) 100%)',
          pointerEvents: 'none'
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

// CTA button — gradient or ghost variant
function Btn({ kind = 'primary', children, size = 'md', icon }) {
  const sizes = {
    sm: { h: 36, px: 16, fs: 13 },
    md: { h: 46, px: 22, fs: 14 },
    lg: { h: 56, px: 28, fs: 15 },
  };
  const s = sizes[size];
  if (kind === 'primary') {
    return (
      <button style={{
        height: s.h, padding: `0 ${s.px}px`, borderRadius: 999,
        background: 'var(--ff-gradient)',
        color: '#0F0618', border: 0, cursor: 'pointer',
        font: `700 ${s.fs}px 'Poppins', sans-serif`,
        letterSpacing: '-0.005em',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1) inset, 0 12px 40px -10px rgba(168,85,247,0.6)'
      }}>
        {children} {icon && <span>{icon}</span>}
      </button>
    );
  }
  return (
    <button style={{
      height: s.h, padding: `0 ${s.px}px`, borderRadius: 999,
      background: 'rgba(168,85,247,0.06)',
      color: 'var(--ff-text)', border: '1px solid var(--ff-border-strong)',
      cursor: 'pointer',
      font: `600 ${s.fs}px 'Poppins', sans-serif`,
      display: 'inline-flex', alignItems: 'center', gap: 10,
    }}>
      {children} {icon && <span>{icon}</span>}
    </button>
  );
}

// Small stat block (number + label + delta)
function StatBlock({ label, value, sub, deltaPositive }) {
  return (
    <div style={{
      borderTop: '1px solid var(--ff-border)',
      paddingTop: 18,
    }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ff-text-3)' }}>{label}</div>
      <div className="poppins" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 6, fontFeatureSettings: '"tnum"' }}>
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: 4, fontSize: 13, color: deltaPositive === undefined ? 'var(--ff-text-3)' : (deltaPositive ? 'var(--ff-acid)' : 'var(--ff-pink)') }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// Section header (eyebrow + title + optional kicker)
function SectionHead({ eyebrow, title, kicker, align = 'left', maxWidth = 720 }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? maxWidth : undefined, margin: align === 'center' ? '0 auto' : undefined }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="poppins" style={{
        fontSize: 56, fontWeight: 700, lineHeight: 1.04,
        letterSpacing: '-0.035em', margin: '12px 0 14px',
      }}>{title}</h2>
      {kicker && (
        <p style={{ fontSize: 17, color: 'var(--ff-text-2)', lineHeight: 1.5, margin: 0, maxWidth: 620 }}>{kicker}</p>
      )}
    </div>
  );
}

// Pill tag
function Tag({ children, color = 'var(--ff-purple)', filled = false }) {
  return (
    <span className="mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
      background: filled ? color : `${color === 'var(--ff-purple)' ? 'rgba(168,85,247,0.12)' : color === 'var(--ff-cyan)' ? 'rgba(34,211,238,0.12)' : color === 'var(--ff-pink)' ? 'rgba(244,114,182,0.12)' : 'rgba(199,247,63,0.12)'}`,
      color: filled ? '#0F0618' : color,
      border: filled ? 'none' : `1px solid ${color === 'var(--ff-purple)' ? 'rgba(168,85,247,0.3)' : color === 'var(--ff-cyan)' ? 'rgba(34,211,238,0.3)' : color === 'var(--ff-pink)' ? 'rgba(244,114,182,0.3)' : 'rgba(199,247,63,0.3)'}`
    }}>
      {children}
    </span>
  );
}

Object.assign(window, { FFMark, FFWordmark, Eyebrow, GlassCard, AmbientBG, Btn, StatBlock, SectionHead, Tag });
