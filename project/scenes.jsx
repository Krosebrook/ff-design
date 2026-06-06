// scenes.jsx — Five scenes for the Claude Design briefing video.
// Loaded after animations.jsx, so Stage/Sprite/useSprite/Easing/clamp/interpolate are on window.

const COLORS = {
  paper: '#F6F4EF',
  ink: '#141414',
  clay: '#C97B5A',
  muted: '#8A857C',
  hairline: 'rgba(20,20,20,0.14)',
};

const FONTS = {
  display: "'Inter Tight', Inter, system-ui, sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

// ── Shared chrome (top + bottom bars + grain) ───────────────────────────────

function Grain() {
  return (
    <svg
      width="1080" height="1920"
      style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.18, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <filter id="grainfilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 0.08
                                0 0 0 0 0.08
                                0 0 0 0 0.08
                                0 0 0 0.6 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grainfilter)" />
    </svg>
  );
}

function TopBar({ sceneLabel = '01' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 84,
      padding: '36px 56px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: FONTS.mono, fontSize: 18, color: COLORS.ink, letterSpacing: '0.04em',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 18, height: 18, background: COLORS.clay }} />
        <span style={{ textTransform: 'uppercase' }}>Anthropic · Briefing</span>
      </div>
      <span style={{ color: COLORS.muted, textTransform: 'uppercase' }}>APR 17 · 2026</span>
    </div>
  );
}

function BottomBar({ label }) {
  const t = useTime();
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 84,
      padding: '0 56px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: FONTS.mono, fontSize: 18, color: COLORS.muted, letterSpacing: '0.04em',
    }}>
      <span style={{ textTransform: 'uppercase' }}>{label}</span>
      <span style={{
        display: 'inline-block', width: 18, height: 22,
        background: COLORS.ink,
        opacity: Math.floor(t * 2) % 2 ? 1 : 0,
      }} />
    </div>
  );
}

// ── Tiny entry helpers ──────────────────────────────────────────────────────

function entry({ at, dur = 0.45, localTime, dy = 24, ease = Easing.easeOutCubic }) {
  if (localTime < at) return { opacity: 0, ty: dy };
  const p = ease(clamp((localTime - at) / dur, 0, 1));
  return { opacity: p, ty: (1 - p) * dy };
}

// ── Scene 01: Wrong headline ───────────────────────────────────────────────

function Scene01() {
  const { localTime } = useSprite();

  const kicker = entry({ at: 0.0, localTime, dy: 16 });
  const l1 = entry({ at: 0.25, localTime });
  const l2 = entry({ at: 0.45, localTime });
  const l3 = entry({ at: 0.65, localTime });
  const l4 = entry({ at: 0.85, localTime });

  // wrong-take phrases
  const wrong1 = entry({ at: 1.4, localTime, dy: 20 });
  const wrong2 = entry({ at: 1.7, localTime, dy: 20 });

  // strikethrough scaleX
  const strike1 = clamp((localTime - 2.0) / 0.45, 0, 1);
  const strike2 = clamp((localTime - 2.3) / 0.45, 0, 1);

  const arrow = entry({ at: 2.85, localTime, dy: 12 });

  return (
    <>
      <TopBar />

      <div style={{ position: 'absolute', top: 200, left: 56, right: 56 }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 22, color: COLORS.clay, letterSpacing: '0.08em',
          textTransform: 'uppercase',
          opacity: kicker.opacity, transform: `translateY(${kicker.ty}px)`,
          marginBottom: 60,
        }}>
          Hot take · thread 01
        </div>

        {[
          { t: 'Everyone\u2019s', a: l1, italic: false },
          { t: 'writing the', a: l2, italic: false },
          { t: 'wrong', a: l3, italic: true, color: COLORS.clay },
          { t: 'headline.', a: l4, italic: false },
        ].map((line, i) => (
          <div key={i} style={{
            fontFamily: FONTS.display, fontSize: 108, fontWeight: 800,
            lineHeight: 1.02, letterSpacing: '-0.035em',
            color: line.color || COLORS.ink,
            fontStyle: line.italic ? 'italic' : 'normal',
            opacity: line.a.opacity, transform: `translateY(${line.a.ty}px)`,
            marginBottom: 4,
          }}>
            {line.t}
          </div>
        ))}
      </div>

      {/* Wrong takes */}
      <div style={{ position: 'absolute', top: 1180, left: 56, right: 56 }}>
        <PhraseStrike text="Canva killer" entry={wrong1} strike={strike1} />
        <div style={{ height: 28 }} />
        <PhraseStrike text="Figma replacement" entry={wrong2} strike={strike2} />
      </div>

      <div style={{
        position: 'absolute', bottom: 200, left: 56,
        fontFamily: FONTS.mono, fontSize: 22, color: COLORS.ink, letterSpacing: '0.08em',
        opacity: arrow.opacity, transform: `translateY(${arrow.ty}px)`,
        textTransform: 'uppercase',
      }}>
        ↓ Actually →
      </div>

      <BottomBar label="01 / Wrong headline" />
    </>
  );
}

function PhraseStrike({ text, entry, strike }) {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      fontFamily: FONTS.display, fontSize: 64, fontWeight: 600,
      color: COLORS.muted, letterSpacing: '-0.02em',
      opacity: entry.opacity, transform: `translateY(${entry.ty}px)`,
    }}>
      <span style={{ display: 'inline-block', padding: '2px 0' }}>{text}</span>
      <span style={{
        position: 'absolute', left: 0, right: 0, top: '52%',
        height: 8, background: COLORS.clay,
        transform: `scaleX(${strike})`,
        transformOrigin: 'left center',
      }} />
    </div>
  );
}

// ── Scene 02: Gap filler ───────────────────────────────────────────────────

function Scene02() {
  const { localTime } = useSprite();

  const its_a = entry({ at: 0.0, localTime, dy: 14 });
  const gap = entry({ at: 0.25, localTime, dy: 30, ease: Easing.easeOutBack });
  const bracketL = clamp((localTime - 0.45) / 0.5, 0, 1);
  const bracketR = clamp((localTime - 0.55) / 0.5, 0, 1);
  const filler = entry({ at: 1.0, localTime, dy: 18 });

  const persons = [
    { n: '01', label: 'Founders', at: 1.6 },
    { n: '02', label: 'PMs', at: 1.85 },
    { n: '03', label: 'Marketers', at: 2.1 },
  ];

  return (
    <>
      <TopBar />

      <div style={{
        position: 'absolute', top: 260, left: 56,
        fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted, letterSpacing: '0.08em',
        textTransform: 'uppercase',
        opacity: its_a.opacity, transform: `translateY(${its_a.ty}px)`,
      }}>
        It's a
      </div>

      {/* GAP with brackets */}
      <div style={{
        position: 'absolute', top: 320, left: 56, right: 56,
        height: 240,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{
          width: 12, height: 200, background: COLORS.clay,
          transform: `scaleY(${bracketL})`, transformOrigin: 'top',
        }} />
        <div style={{
          fontFamily: FONTS.display, fontSize: 200, fontWeight: 800,
          letterSpacing: '-0.04em', lineHeight: 1, color: COLORS.ink,
          opacity: gap.opacity, transform: `translateY(${gap.ty}px)`,
        }}>
          GAP
        </div>
        <div style={{
          width: 12, height: 200, background: COLORS.clay,
          transform: `scaleY(${bracketR})`, transformOrigin: 'bottom',
        }} />
      </div>

      <div style={{
        position: 'absolute', top: 580, left: 56,
        fontFamily: FONTS.serif, fontStyle: 'italic',
        fontSize: 168, lineHeight: 1, color: COLORS.ink,
        letterSpacing: '-0.02em',
        opacity: filler.opacity, transform: `translateY(${filler.ty}px)`,
      }}>
        filler.
      </div>

      {/* Persona list */}
      <div style={{ position: 'absolute', top: 1080, left: 56, right: 56 }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 18, color: COLORS.muted,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: 32,
        }}>
          Built for
        </div>
        {persons.map((p, i) => {
          const e = entry({ at: p.at, localTime, dy: 24 });
          return (
            <div key={i} style={{
              opacity: e.opacity, transform: `translateY(${e.ty}px)`,
              borderTop: `1px solid ${COLORS.hairline}`,
              padding: '28px 0',
              display: 'flex', alignItems: 'baseline', gap: 32,
              ...(i === persons.length - 1 ? { borderBottom: `1px solid ${COLORS.hairline}` } : {}),
            }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 28, color: COLORS.clay, width: 80 }}>
                {p.n}
              </span>
              <span style={{
                fontFamily: FONTS.display, fontSize: 84, fontWeight: 700,
                letterSpacing: '-0.025em', color: COLORS.ink,
              }}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>

      <BottomBar label="02 / Gap filler" />
    </>
  );
}

// ── Scene 03: Three things ─────────────────────────────────────────────────

function Scene03() {
  const { localTime } = useSprite();

  const header = entry({ at: 0.0, localTime, dy: 16 });
  const c1 = entry({ at: 0.6, localTime, dy: 36 });
  const c2 = entry({ at: 3.0, localTime, dy: 36 });
  const c3 = entry({ at: 5.6, localTime, dy: 36 });

  return (
    <>
      <TopBar />

      <div style={{ position: 'absolute', top: 200, left: 56, right: 56 }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 22, color: COLORS.clay,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: header.opacity, transform: `translateY(${header.ty}px)`,
          marginBottom: 24,
        }}>
          Three things hiding in plain sight
        </div>
        <div style={{
          fontFamily: FONTS.display, fontSize: 76, fontWeight: 700,
          lineHeight: 1.05, letterSpacing: '-0.03em', color: COLORS.ink,
          opacity: header.opacity, transform: `translateY(${header.ty}px)`,
        }}>
          What it actually <span style={{ fontStyle: 'italic', color: COLORS.clay }}>does.</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 460, left: 56, right: 56, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CapabilityCard num="01" title="Context on arrival"
          desc="Reads your codebase + design files during onboarding."
          entry={c1} localTime={localTime - 0.6}>
          <CodebaseToTokens t={localTime - 0.6} />
        </CapabilityCard>

        <CapabilityCard num="02" title="Any starting point"
          desc="Prompt, document, or live URL — it meets you where you are."
          entry={c2} localTime={localTime - 3.0}>
          <SourcePills t={localTime - 3.0} />
        </CapabilityCard>

        <CapabilityCard num="03" title="Design → code, one loop" inverted
          desc="Completed designs export to a handoff bundle for Claude Code."
          entry={c3} localTime={localTime - 5.6}>
          <DesignToCode t={localTime - 5.6} />
        </CapabilityCard>
      </div>

      <BottomBar label="03 / Capabilities" />
    </>
  );
}

function CapabilityCard({ num, title, desc, entry, children, inverted }) {
  return (
    <div style={{
      opacity: entry.opacity, transform: `translateY(${entry.ty}px)`,
      background: inverted ? COLORS.ink : 'transparent',
      color: inverted ? COLORS.paper : COLORS.ink,
      border: `1px solid ${inverted ? COLORS.ink : COLORS.hairline}`,
      padding: '24px 28px 28px',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 8 }}>
        <span style={{
          fontFamily: FONTS.mono, fontSize: 22,
          color: COLORS.clay, letterSpacing: '0.06em',
        }}>
          {num}
        </span>
        <span style={{
          fontFamily: FONTS.display, fontSize: 44, fontWeight: 700,
          letterSpacing: '-0.025em', lineHeight: 1.05,
        }}>
          {title}
        </span>
      </div>
      <div style={{
        fontFamily: FONTS.display, fontSize: 22, fontWeight: 400,
        color: inverted ? 'rgba(246,244,239,0.7)' : COLORS.muted,
        marginBottom: 20, maxWidth: 760,
      }}>
        {desc}
      </div>
      <div>{children}</div>
    </div>
  );
}

function CodebaseToTokens({ t }) {
  // Files appear staggered, then arrow draws, then tokens reveal
  const files = ['theme.ts', 'colors.css', 'tokens.json', 'Button.tsx', 'logo.svg'];
  const arrowP = clamp((t - 0.9) / 0.5, 0, 1);
  const tokensP = clamp((t - 1.3) / 0.6, 0, 1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 240 }}>
      <div style={{ flex: '0 0 320px' }}>
        {files.map((f, i) => {
          const e = clamp((t - 0.2 - i * 0.1) / 0.4, 0, 1);
          return (
            <div key={f} style={{
              fontFamily: FONTS.mono, fontSize: 20, color: COLORS.ink,
              padding: '8px 12px',
              borderLeft: `2px solid ${COLORS.clay}`,
              opacity: e, transform: `translateX(${(1 - e) * 12}px)`,
              marginBottom: 4, background: 'rgba(201,123,90,0.06)',
            }}>
              {f}
            </div>
          );
        })}
      </div>

      {/* arrow */}
      <div style={{ position: 'relative', height: 4, flex: '0 0 80px' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: '100%', height: 2, background: COLORS.ink,
          transform: `scaleX(${arrowP})`, transformOrigin: 'left',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: -7,
          width: 0, height: 0,
          borderLeft: `12px solid ${COLORS.ink}`,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          opacity: arrowP > 0.95 ? 1 : 0,
        }} />
      </div>

      {/* tokens panel */}
      <div style={{
        flex: 1, opacity: tokensP, transform: `translateX(${(1 - tokensP) * 12}px)`,
        border: `1px solid ${COLORS.hairline}`, padding: 16,
        background: COLORS.paper,
      }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 14, color: COLORS.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          Brand tokens
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[COLORS.clay, COLORS.ink, COLORS.muted, '#E8DFCF'].map((c, i) => (
            <div key={i} style={{ width: 36, height: 36, background: c, border: `1px solid ${COLORS.hairline}` }} />
          ))}
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: COLORS.ink }}>Aa</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <div style={{ width: 30, height: 14, border: `1.5px solid ${COLORS.ink}`, borderRadius: 0 }} />
          <div style={{ width: 30, height: 14, border: `1.5px solid ${COLORS.ink}`, borderRadius: 4 }} />
          <div style={{ width: 30, height: 14, border: `1.5px solid ${COLORS.ink}`, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

function SourcePills({ t }) {
  const labels = ['PROMPT', 'DOCX', 'PPTX', 'XLSX', 'URL'];
  // cycling highlight
  const cycle = Math.floor((t * 1.4) % labels.length);

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', height: 80, alignItems: 'center' }}>
      {labels.map((l, i) => {
        const e = clamp((t - 0.15 - i * 0.08) / 0.35, 0, 1);
        const active = i === cycle;
        return (
          <div key={l} style={{
            opacity: e, transform: `translateY(${(1 - e) * 12}px)`,
            padding: '14px 24px',
            border: `1.5px solid ${active ? COLORS.clay : COLORS.ink}`,
            background: active ? COLORS.clay : 'transparent',
            color: active ? COLORS.paper : COLORS.ink,
            fontFamily: FONTS.mono, fontSize: 22, letterSpacing: '0.08em',
            transition: 'background 200ms, color 200ms, border-color 200ms',
          }}>
            {l}
          </div>
        );
      })}
    </div>
  );
}

function DesignToCode({ t }) {
  const tile1 = clamp((t - 0.2) / 0.5, 0, 1);
  const pipe = clamp((t - 0.7) / 0.6, 0, 1);
  const tile2 = clamp((t - 1.2) / 0.5, 0, 1);
  const cap = clamp((t - 1.7) / 0.4, 0, 1);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 180 }}>
        {/* Design tile */}
        <div style={{
          flex: 1, height: 160, opacity: tile1,
          transform: `translateX(${(1 - tile1) * -12}px)`,
          border: `1px solid rgba(246,244,239,0.25)`,
          padding: 14, background: 'rgba(246,244,239,0.04)',
        }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.clay, letterSpacing: '0.08em', marginBottom: 10 }}>DESIGN</div>
          <div style={{ width: '70%', height: 14, background: COLORS.clay, marginBottom: 8 }} />
          <div style={{ width: '90%', height: 8, background: 'rgba(246,244,239,0.4)', marginBottom: 6 }} />
          <div style={{ width: '60%', height: 8, background: 'rgba(246,244,239,0.25)', marginBottom: 14 }} />
          <div style={{ width: 100, height: 32, background: COLORS.clay }} />
        </div>

        {/* pipe */}
        <div style={{ position: 'relative', flex: '0 0 120px', height: 6 }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: 4, width: '100%',
            background: COLORS.clay, transform: `scaleX(${pipe})`, transformOrigin: 'left',
          }} />
          {/* moving dot */}
          {pipe > 0.4 && (
            <div style={{
              position: 'absolute',
              left: `${((t * 80) % 100)}%`, top: -3,
              width: 10, height: 10, background: COLORS.paper, borderRadius: 1,
            }} />
          )}
        </div>

        {/* Code tile */}
        <div style={{
          flex: 1, height: 160, opacity: tile2,
          transform: `translateX(${(1 - tile2) * 12}px)`,
          border: `1px solid rgba(246,244,239,0.25)`,
          padding: 14, fontFamily: FONTS.mono, fontSize: 14, color: 'rgba(246,244,239,0.85)',
          background: 'rgba(246,244,239,0.04)', lineHeight: 1.5,
        }}>
          <div style={{ fontSize: 13, color: COLORS.clay, letterSpacing: '0.08em', marginBottom: 10 }}>CODE</div>
          <div><span style={{ color: COLORS.clay }}>&lt;Button</span></div>
          <div style={{ paddingLeft: 16 }}>variant=<span style={{ color: COLORS.clay }}>"primary"</span></div>
          <div style={{ paddingLeft: 16 }}>onClick={'{handle}'}</div>
          <div><span style={{ color: COLORS.clay }}>&gt;</span> Ship it <span style={{ color: COLORS.clay }}>&lt;/Button&gt;</span></div>
        </div>
      </div>
      <div style={{
        marginTop: 16, opacity: cap,
        fontFamily: FONTS.mono, fontSize: 18, letterSpacing: '0.18em',
        color: COLORS.clay,
      }}>
        ── ONE CONTEXT WINDOW ──
      </div>
    </div>
  );
}

// ── Scene 04: Pull quote ───────────────────────────────────────────────────

function Scene04() {
  const { localTime } = useSprite();

  // Word-by-word reveal
  const words = [
    { w: 'What', highlight: false },
    { w: 'used', highlight: false },
    { w: 'to', highlight: false },
    { w: 'take', highlight: false },
    { w: 'a', highlight: false },
    { w: 'week', highlight: true },
    { w: 'of', highlight: false },
    { w: 'back-and-forth', highlight: false },
    { w: 'now', highlight: false },
    { w: 'happens', highlight: false },
    { w: 'in', highlight: false },
    { w: 'a', highlight: false },
    { w: 'single', highlight: true },
    { w: 'conversation.', highlight: true },
  ];

  const quoteMark = entry({ at: 0.0, localTime, dy: 24 });
  const rule = clamp((localTime - 2.6) / 0.5, 0, 1);
  const attr = entry({ at: 3.0, localTime, dy: 12 });

  return (
    <div style={{ position: 'absolute', inset: 0, background: COLORS.ink, color: COLORS.paper }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 84,
        padding: '36px 56px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FONTS.mono, fontSize: 18, letterSpacing: '0.04em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: COLORS.paper }}>
          <div style={{ width: 18, height: 18, background: COLORS.clay }} />
          <span style={{ textTransform: 'uppercase' }}>Anthropic · Briefing</span>
        </div>
        <span style={{ color: 'rgba(246,244,239,0.55)', textTransform: 'uppercase' }}>APR 17 · 2026</span>
      </div>

      {/* Massive serif curly quote */}
      <div style={{
        position: 'absolute', top: 80, left: 36,
        fontFamily: FONTS.serif, fontStyle: 'italic',
        fontSize: 480, lineHeight: 0.7, color: COLORS.clay,
        opacity: quoteMark.opacity, transform: `translateY(${quoteMark.ty}px)`,
      }}>
        “
      </div>

      {/* Quote */}
      <div style={{
        position: 'absolute', top: 560, left: 56, right: 56,
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: 92, lineHeight: 1.05, letterSpacing: '-0.03em',
      }}>
        {words.map((wd, i) => {
          const at = 0.4 + i * 0.13;
          const e = entry({ at, localTime, dy: 14 });
          return (
            <span key={i} style={{
              display: 'inline-block', marginRight: 18, marginBottom: 4,
              opacity: e.opacity, transform: `translateY(${e.ty}px)`,
              color: wd.highlight ? COLORS.clay : COLORS.paper,
              fontStyle: wd.highlight ? 'italic' : 'normal',
            }}>
              {wd.w}
            </span>
          );
        })}
      </div>

      {/* Hairline + attribution */}
      <div style={{ position: 'absolute', bottom: 220, left: 56, right: 56 }}>
        <div style={{
          height: 1, background: 'rgba(246,244,239,0.4)',
          transform: `scaleX(${rule})`, transformOrigin: 'left',
          marginBottom: 20,
        }} />
        <div style={{
          fontFamily: FONTS.mono, fontSize: 22, letterSpacing: '0.08em',
          color: 'rgba(246,244,239,0.7)', textTransform: 'uppercase',
          opacity: attr.opacity, transform: `translateY(${attr.ty}px)`,
        }}>
          Product Manager · Observability team
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 84,
        padding: '0 56px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FONTS.mono, fontSize: 18, color: 'rgba(246,244,239,0.55)', letterSpacing: '0.04em',
      }}>
        <span style={{ textTransform: 'uppercase' }}>04 / Field quote</span>
        <span style={{
          display: 'inline-block', width: 18, height: 22,
          background: COLORS.paper,
          opacity: Math.floor(localTime * 2) % 2 ? 1 : 0,
        }} />
      </div>
    </div>
  );
}

// ── Scene 05: Landing ─────────────────────────────────────────────────────

function Scene05() {
  const { localTime } = useSprite();

  const kicker = entry({ at: 0.0, localTime, dy: 14 });
  const l1 = entry({ at: 0.35, localTime, dy: 30 });
  const l2 = entry({ at: 0.6, localTime, dy: 30 });
  const l3 = entry({ at: 0.85, localTime, dy: 30 });
  const l4 = entry({ at: 1.1, localTime, dy: 30 });

  const availLabel = entry({ at: 1.6, localTime, dy: 14 });
  const tiers = ['Pro', 'Max', 'Team', 'Enterprise'];

  const footer = entry({ at: 3.4, localTime, dy: 10 });

  return (
    <>
      <TopBar />

      <div style={{ position: 'absolute', top: 200, left: 56, right: 56 }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 22, color: COLORS.clay,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: kicker.opacity, transform: `translateY(${kicker.ty}px)`,
          marginBottom: 56,
        }}>
          Rolling out today
        </div>

        {[
          { t: 'The blank-page', e: l1, italic: false },
          { t: 'problem just got', e: l2, italic: false },
          { t: 'a lot', e: l3, italic: true, color: COLORS.clay },
          { t: 'smaller.', e: l4, italic: false },
        ].map((line, i) => (
          <div key={i} style={{
            fontFamily: FONTS.display, fontSize: 132, fontWeight: 800,
            lineHeight: 1.0, letterSpacing: '-0.04em',
            color: line.color || COLORS.ink,
            fontStyle: line.italic ? 'italic' : 'normal',
            opacity: line.e.opacity, transform: `translateY(${line.e.ty}px)`,
            marginBottom: 4,
          }}>
            {line.t}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 1240, left: 56, right: 56 }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 20, color: COLORS.muted,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          opacity: availLabel.opacity, transform: `translateY(${availLabel.ty}px)`,
          marginBottom: 24,
        }}>
          Available on
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {tiers.map((t, i) => {
            const e = entry({ at: 1.95 + i * 0.18, localTime, dy: 18 });
            return (
              <div key={t} style={{
                opacity: e.opacity, transform: `translateY(${e.ty}px)`,
                padding: '20px 32px',
                border: `2px solid ${COLORS.ink}`,
                fontFamily: FONTS.display, fontSize: 32, fontWeight: 700,
                letterSpacing: '-0.02em',
                color: COLORS.ink,
              }}>
                {t}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer overrides default bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 84,
        padding: '0 56px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FONTS.mono, fontSize: 18, color: COLORS.muted, letterSpacing: '0.04em',
        textTransform: 'uppercase',
        opacity: footer.opacity, transform: `translateY(${footer.ty}px)`,
      }}>
        <span>Powered by Claude Opus 4.7</span>
        <span>Filed by Kyle Rosebrook</span>
      </div>
    </>
  );
}

// ── Wrapper ────────────────────────────────────────────────────────────────

function VideoScenes() {
  return (
    <>
      <Sprite start={0} end={3.2}><Scene01 /></Sprite>
      <Sprite start={3.2} end={6.8}><Scene02 /></Sprite>
      <Sprite start={6.8} end={15.5}><Scene03 /></Sprite>
      <Sprite start={15.5} end={19.5}><Scene04 /></Sprite>
      <Sprite start={19.5} end={25}><Scene05 /></Sprite>
      <Grain />
    </>
  );
}

window.VideoScenes = VideoScenes;
