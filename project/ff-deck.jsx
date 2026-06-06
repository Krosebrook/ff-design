/* ─────────────────────────────────────────────────────────────────────────────
   FlashFusion · Direction C — 6-slide pitch deck
   1280 × 720 each
   ───────────────────────────────────────────────────────────────────────────── */

// Slide chrome — corner brand + slide counter
function SlideChrome({ n, total = 6, label, color = 'var(--ff-purple)' }) {
  return (
    <>
      <div style={{
        position: 'absolute', top: 28, left: 36,
        display: 'flex', alignItems: 'center', gap: 10, zIndex: 5
      }}>
        <FFMark size={26} />
        <div className="poppins" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Flash<span className="gtxt">Fusion</span>
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 32, right: 36, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ff-text-3)', letterSpacing: '0.14em'
      }}>
        <span style={{ color }}>{label}</span>
        <span style={{ width: 1, height: 12, background: 'var(--ff-border)' }} />
        <span>{String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, zIndex: 5,
        background: 'rgba(168,85,247,0.1)'
      }}>
        <div style={{
          width: `${(n / total) * 100}%`, height: '100%',
          background: 'var(--ff-gradient)'
        }} />
      </div>
    </>
  );
}

function SlideFrame({ children, chrome }) {
  return (
    <AmbientBG style={{ width: '100%', height: '100%', position: 'relative' }}>
      {chrome}
      <div style={{ position: 'absolute', inset: '80px 64px 56px' }}>
        {children}
      </div>
    </AmbientBG>
  );
}

// ─── Slide 1 · Cover ────────────────────────────────────────────────────────
function Slide1() {
  return (
    <SlideFrame chrome={<SlideChrome n={1} label="COVER" />}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', maxWidth: 980 }}>
        <Eyebrow color="var(--ff-cyan)">A pitch · by Kyle Rosebrook</Eyebrow>
        <h1 className="poppins" style={{
          fontSize: 110, fontWeight: 900, lineHeight: 0.92,
          letterSpacing: '-0.045em', margin: '32px 0 28px'
        }}>
          The <span className="serif" style={{ color: 'var(--ff-purple)' }}>operator OS</span><br />
          for AI <span className="gtxt">consultants.</span>
        </h1>
        <p style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--ff-text-2)', maxWidth: 780, margin: 0 }}>
          One library. Sixteen tools. A method that makes every Tuesday compound — shipped, billed, and explainable to the client.
        </p>
        <div style={{
          marginTop: 48, display: 'flex', alignItems: 'center', gap: 24,
          paddingTop: 24, borderTop: '1px solid var(--ff-border)',
          color: 'var(--ff-text-3)'
        }}>
          <FFMark size={48} glow />
          <div>
            <div className="poppins" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ff-text)', letterSpacing: '-0.01em' }}>
              Flash<span className="gtxt">Fusion</span>
            </div>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.16em', marginTop: 4 }}>POWER IDEAS · FUSE POTENTIAL · DRIVE IMPACT</div>
          </div>
        </div>
      </div>
      {/* Decorative bolt watermark, right side */}
      <div style={{ position: 'absolute', right: -40, bottom: 0, opacity: 0.25, pointerEvents: 'none' }}>
        <svg width="520" height="640" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="big-bolt" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#A855F7" stopOpacity="0.9"/>
              <stop offset="0.55" stopColor="#F472B6" stopOpacity="0.6"/>
              <stop offset="1" stopColor="#22D3EE" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 L15 2 Z" fill="url(#big-bolt)" />
        </svg>
      </div>
    </SlideFrame>
  );
}

// ─── Slide 2 · Problem ──────────────────────────────────────────────────────
function Slide2() {
  return (
    <SlideFrame chrome={<SlideChrome n={2} label="THE PROBLEM" color="var(--ff-pink)" />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, height: '100%', alignItems: 'center' }}>
        <div>
          <Eyebrow color="var(--ff-pink)">The problem</Eyebrow>
          <h2 className="poppins" style={{
            fontSize: 82, fontWeight: 800, lineHeight: 0.98,
            letterSpacing: '-0.04em', margin: '20px 0 32px',
          }}>
            <span style={{ color: 'var(--ff-text-3)' }}>A tool changes every</span>{' '}
            <span className="serif gtxt">six months.</span>{' '}
            <br />
            <span style={{ color: 'var(--ff-text-3)' }}>The skill of reading a system</span>{' '}
            <span className="serif" style={{ color: 'var(--ff-cyan)' }}>doesn't.</span>
          </h2>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--ff-text-2)', maxWidth: 620, margin: 0 }}>
            Consultants spend their lives re-learning vendor menus. FlashFusion bets the other way: encode the judgment once, port the skill across every model and stack.
          </p>
        </div>
        <GlassCard accent padding={28}>
          <Eyebrow color="var(--ff-cyan)">THE ICEBERG INDEX</Eyebrow>
          <div className="poppins" style={{ fontSize: 18, fontWeight: 600, marginTop: 12, color: 'var(--ff-text-2)' }}>
            What today's models can already do
          </div>
          <div style={{ position: 'relative', height: 230, marginTop: 16 }}>
            <svg viewBox="0 0 360 220" width="100%" height="100%">
              <line x1="0" y1="60" x2="360" y2="60" stroke="rgba(34,211,238,0.5)" strokeDasharray="4 4"/>
              <text x="0" y="50" fontFamily="JetBrains Mono" fontSize="9" fill="#22D3EE" letterSpacing="1.5">WATERLINE</text>
              <text x="320" y="50" fontFamily="JetBrains Mono" fontSize="9" fill="#22D3EE" fontWeight="600" textAnchor="end">VISIBLE</text>
              <polygon points="150,25 170,12 195,32 220,15 245,32 145,60 230,60" fill="rgba(34,211,238,0.7)" stroke="#22D3EE"/>
              <polygon points="145,60 230,60 260,120 240,170 195,195 155,190 125,160 110,110" fill="rgba(168,85,247,0.35)" stroke="#A855F7"/>
              <text x="155" y="95"  fontFamily="Poppins" fontSize="12" fill="#F8FAFC" fontWeight="600">Judgment</text>
              <text x="148" y="120" fontFamily="Poppins" fontSize="12" fill="#F8FAFC" fontWeight="600">Context</text>
              <text x="152" y="145" fontFamily="Poppins" fontSize="12" fill="#F8FAFC" fontWeight="600">Sequencing</text>
              <text x="170" y="170" fontFamily="Poppins" fontSize="12" fill="#F8FAFC" fontWeight="600">Taste</text>
              <text x="270" y="170" fontFamily="JetBrains Mono" fontSize="10" fill="#A855F7" letterSpacing="1">THE FEE</text>
              <text x="270" y="184" fontFamily="JetBrains Mono" fontSize="8"  fill="#64748B" letterSpacing="0.5">LIVES</text>
              <text x="270" y="195" fontFamily="JetBrains Mono" fontSize="8"  fill="#64748B" letterSpacing="0.5">DOWN HERE</text>
            </svg>
          </div>
        </GlassCard>
      </div>
    </SlideFrame>
  );
}

// ─── Slide 3 · The 3-Rule ───────────────────────────────────────────────────
function Slide3() {
  const steps = [
    { n: '01', name: 'Identify', color: 'var(--ff-purple)', body: 'Find the repeating shape in your week.' },
    { n: '02', name: 'Encode',   color: 'var(--ff-pink)',   body: 'Write the judgment down. Portable .md.' },
    { n: '03', name: 'Deploy',   color: 'var(--ff-cyan)',   body: 'Push it to MCP, SDK, n8n. Run forever.' },
  ];
  return (
    <SlideFrame chrome={<SlideChrome n={3} label="THE METHOD" color="var(--ff-cyan)" />}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Eyebrow color="var(--ff-cyan)">The 3-Rule</Eyebrow>
        <h2 className="poppins" style={{
          fontSize: 64, fontWeight: 800, lineHeight: 1.0,
          letterSpacing: '-0.035em', margin: '12px 0 6px'
        }}>
          Make it <span className="serif gtxt">once.</span> Use it <span className="serif" style={{ color: 'var(--ff-cyan)' }}>forever.</span>
        </h2>
        <p style={{ fontSize: 17, color: 'var(--ff-text-2)', margin: '0 0 36px', maxWidth: 720 }}>
          Three moves separate the consultants who repeat themselves from the ones who compound. They are not complicated.
        </p>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch', position: 'relative' }}>
          {/* connector line */}
          <div style={{
            position: 'absolute', top: 50, left: '14%', right: '14%', height: 2,
            background: 'linear-gradient(90deg, var(--ff-purple), var(--ff-pink), var(--ff-cyan))',
            opacity: 0.4, zIndex: 0
          }} />
          {steps.map(s => (
            <div key={s.n} style={{
              position: 'relative', zIndex: 1,
              background: 'rgba(26,11,46,0.6)',
              border: `1px solid ${s.color}55`,
              borderRadius: 16,
              padding: 28,
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: `2px solid ${s.color}`,
                display: 'grid', placeItems: 'center',
                background: 'var(--ff-base)',
                boxShadow: `0 0 24px ${s.color}55`,
                marginBottom: 20
              }}>
                <span className="mono" style={{ color: s.color, fontWeight: 700, fontSize: 14 }}>{s.n}</span>
              </div>
              <div className="poppins" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 12 }}>
                {s.name}
              </div>
              <p style={{ fontSize: 16, color: 'var(--ff-text-2)', margin: 0, lineHeight: 1.45 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

// ─── Slide 4 · The Library ──────────────────────────────────────────────────
function Slide4() {
  const lanes = [
    { name: 'SELL', color: 'var(--ff-purple)', items: ['ROI Calculator', 'Discovery Scorecard', 'Proposal Builder', 'Outreach Tracker', 'Battle Cards'] },
    { name: 'DELIVER', color: 'var(--ff-cyan)', items: ['Skills Browser', 'Sprint Tracker', 'Audit Report Gen', 'Client Dashboard', 'Skills Gap Detector', 'Onboarding Hub', 'Agent Builder'] },
    { name: 'OFFICE', color: 'var(--ff-pink)', items: ['Pipeline Dashboard', 'Revenue Tracker', 'Newsletter Gen', 'Daily Dispatch'] },
  ];
  return (
    <SlideFrame chrome={<SlideChrome n={4} label="THE LIBRARY" color="var(--ff-purple)" />}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <Eyebrow>The library</Eyebrow>
            <h2 className="poppins" style={{
              fontSize: 64, fontWeight: 800, lineHeight: 1.0,
              letterSpacing: '-0.035em', margin: '12px 0 6px'
            }}>
              Sixteen tools. <span className="serif" style={{ color: 'var(--ff-pink)' }}>One operator.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'var(--ff-text-2)', margin: 0, maxWidth: 720 }}>
              Sixteen tools, three lanes. Every tool is a Skill — portable .md, MCP-ready, runs anywhere Claude does.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="poppins" style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', fontFeatureSettings: '"tnum"', background: 'var(--ff-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>16</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ff-text-3)', letterSpacing: '0.18em' }}>TOOLS · SELL · DELIVER · OFFICE</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 28 }}>
          {lanes.map(lane => (
            <div key={lane.name} style={{
              background: 'rgba(26,11,46,0.5)',
              border: `1px solid var(--ff-border)`,
              borderTop: `3px solid ${lane.color}`,
              borderRadius: 14,
              padding: 20,
              display: 'flex', flexDirection: 'column', gap: 8
            }}>
              <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: lane.color, letterSpacing: '0.18em', marginBottom: 6 }}>{lane.name}</div>
              {lane.items.map((t, i) => (
                <div key={t} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(15,6,24,0.55)',
                  border: '1px solid var(--ff-border)',
                  fontSize: 13.5,
                }}>
                  <span className="mono" style={{ color: lane.color, fontSize: 10, fontWeight: 700, minWidth: 18 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="poppins" style={{ fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

// ─── Slide 5 · What ships ───────────────────────────────────────────────────
function Slide5() {
  const ships = [
    { l: 'AUDIT',    color: 'var(--ff-cyan)',   title: 'AI readiness scorecard', body: 'Tool & workflow audit · prioritized gap matrix · 30-day roadmap deck.' },
    { l: 'SKILLS',   color: 'var(--ff-purple)', title: 'Portable .md skills',    body: 'Judgment encoded in markdown. Lives in MCP, Agent SDK, Desktop, n8n.' },
    { l: 'AGENTS',   color: 'var(--ff-pink)',   title: 'Production agents',      body: 'Triggers, steps, guardrails, HITL gates. Running on the client\'s stack.' },
    { l: 'HANDOFF',  color: 'var(--ff-acid)',   title: 'Team training',          body: 'Two sessions. Loom library. Slack channel. The keys, not the lock-in.' },
  ];
  return (
    <SlideFrame chrome={<SlideChrome n={5} label="WHAT SHIPS" color="var(--ff-acid)" />}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, height: '100%', alignItems: 'center' }}>
        <div>
          <Eyebrow color="var(--ff-acid)">What ships in a sprint</Eyebrow>
          <h2 className="poppins" style={{
            fontSize: 60, fontWeight: 800, lineHeight: 1.0,
            letterSpacing: '-0.035em', margin: '12px 0 20px'
          }}>
            The deliverables. <span className="serif gtxt">No mystery.</span>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: 'var(--ff-text-2)', margin: 0 }}>
            Every engagement leaves the client with four things. They keep all of them. No platform lock-in, no recurring license, no rented intelligence.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {ships.map(s => (
            <div key={s.l} style={{
              padding: 20, borderRadius: 12,
              background: 'rgba(15,6,24,0.55)',
              border: '1px solid var(--ff-border)',
              borderTop: `3px solid ${s.color}`,
              display: 'flex', flexDirection: 'column', gap: 8
            }}>
              <div className="mono" style={{ fontSize: 10, color: s.color, letterSpacing: '0.18em', fontWeight: 700 }}>{s.l}</div>
              <div className="poppins" style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ff-text-2)' }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

// ─── Slide 6 · Call to action ───────────────────────────────────────────────
function Slide6() {
  return (
    <SlideFrame chrome={<SlideChrome n={6} label="WHAT'S NEXT" color="var(--ff-cyan)" />}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', maxWidth: 1100 }}>
        <Eyebrow color="var(--ff-cyan)">What's next</Eyebrow>
        <h2 className="poppins" style={{
          fontSize: 96, fontWeight: 900, lineHeight: 0.94,
          letterSpacing: '-0.045em', margin: '24px 0 16px'
        }}>
          Your next agent ships<br />
          <span className="serif" style={{ color: 'var(--ff-pink)' }}>this sprint.</span> Not <span className="serif gtxt">next quarter.</span>
        </h2>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--ff-text-2)', maxWidth: 760, margin: '0 0 36px' }}>
          Or you can keep doing it the way you did last week. We send the audit either way.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { step: 'WK 1-2',  title: 'Audit',    sub: 'Score readiness · 30-day map' },
            { step: 'WK 3-7',  title: 'Sprint',   sub: 'Ship two production agents' },
            { step: 'ONGOING', title: 'Retainer', sub: 'vCAIO seat · monthly skill' },
          ].map((s, i) => (
            <div key={s.title} style={{
              padding: 20, borderRadius: 12,
              background: 'rgba(26,11,46,0.5)',
              border: `1px solid ${i === 0 ? 'var(--ff-border-strong)' : 'var(--ff-border)'}`,
            }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ff-cyan)', letterSpacing: '0.14em' }}>{s.step}</div>
              <div className="poppins" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ff-text-2)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Btn kind="primary" size="lg">Book the audit →</Btn>
          <div className="mono" style={{ fontSize: 13, color: 'var(--ff-text-3)', letterSpacing: '0.12em' }}>
            FLASHFUSION.IO · KYLE@FLASHFUSION.IO
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function FFSlide({ n }) {
  switch (n) {
    case 1: return <Slide1 />;
    case 2: return <Slide2 />;
    case 3: return <Slide3 />;
    case 4: return <Slide4 />;
    case 5: return <Slide5 />;
    case 6: return <Slide6 />;
    default: return null;
  }
}

Object.assign(window, { FFSlide });
