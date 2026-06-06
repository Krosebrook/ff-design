/* ─────────────────────────────────────────────────────────────────────────────
   FlashFusion · Direction B — The Operator OS · single-page infographic
   1600 × 2200
   ───────────────────────────────────────────────────────────────────────────── */

const opLanes = [
  {
    id: 'sell',     name: 'SELL',     color: 'var(--ff-purple)',
    pitch: 'Win the room',
    tools: [
      { n: '01', name: 'ROI Calculator' },
      { n: '02', name: 'Discovery Scorecard' },
      { n: '05', name: 'Proposal Builder' },
      { n: '09', name: 'Outreach Tracker' },
      { n: '10', name: 'Battle Cards' },
    ],
  },
  {
    id: 'deliver',  name: 'DELIVER',  color: 'var(--ff-cyan)',
    pitch: 'Ship the work',
    tools: [
      { n: '03', name: 'Skills Browser' },
      { n: '04', name: 'Sprint Tracker' },
      { n: '06', name: 'Audit Report Gen' },
      { n: '11', name: 'Client Dashboard' },
      { n: '13', name: 'Skills Gap Detector' },
      { n: '14', name: 'Onboarding Hub' },
      { n: '15', name: 'Agent Builder' },
    ],
  },
  {
    id: 'office',   name: 'OFFICE',   color: 'var(--ff-pink)',
    pitch: 'Compound it',
    tools: [
      { n: '07', name: 'Pipeline Dashboard' },
      { n: '08', name: 'Revenue Tracker' },
      { n: '12', name: 'Newsletter Gen' },
      { n: '16', name: 'Daily Dispatch' },
    ],
  },
];

function FFInfographic() {
  return (
    <AmbientBG style={{ width: '100%', height: '100%' }} dots blooms vignette>
      <div style={{ padding: '80px 88px 80px' }}>

        {/* Title block */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, marginBottom: 80 }}>
          <FFMark size={64} glow />
          <div style={{ flex: 1 }}>
            <Eyebrow color="var(--ff-cyan)">The Operator OS · explained in one page</Eyebrow>
            <h1 className="poppins" style={{
              fontSize: 88, fontWeight: 800, lineHeight: 0.96,
              letterSpacing: '-0.04em', margin: '20px 0 24px'
            }}>
              How <span className="serif gtxt">one operator</span> runs a whole <span className="serif" style={{ color: 'var(--ff-cyan)' }}>consulting practice.</span>
            </h1>
            <p style={{ fontSize: 22, lineHeight: 1.45, color: 'var(--ff-text-2)', maxWidth: 1100, margin: 0 }}>
              FlashFusion is an agency-in-a-box. The same 3-Rule turns a Tuesday afternoon into a portable Skill, the Skill into an Agent, and the Agent into a line item on next month's invoice. Here's the whole map.
            </p>
          </div>
        </div>

        {/* The 3-Rule flow */}
        <div style={{ marginBottom: 80, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
            <Tag color="var(--ff-purple)" filled>I.</Tag>
            <div className="poppins" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
              The 3-Rule · <span style={{ color: 'var(--ff-text-3)' }}>the engine underneath everything</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr 60px 1fr', gap: 0, alignItems: 'center' }}>
            {/* IDENTIFY */}
            <FlowStep n="01" name="IDENTIFY" color="var(--ff-purple)"
              caption="Pattern recognition"
              body="A repeating Tuesday. The same proposal three times. The audit you've now written for six clients. Find the shape."
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/></svg>}
            />
            <Arrow color="var(--ff-purple)" toColor="var(--ff-pink)" />
            <FlowStep n="02" name="ENCODE" color="var(--ff-pink)"
              caption=".md · MCP-ready"
              body="Write the judgment down. Constraints, examples, edge cases, the exact voice. Make it portable — markdown that lives anywhere Claude lives."
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h12l4 4v12H4zM14 4v6h6"/><path d="M8 14h8M8 18h5"/></svg>}
            />
            <Arrow color="var(--ff-pink)" toColor="var(--ff-cyan)" />
            <FlowStep n="03" name="DEPLOY" color="var(--ff-cyan)"
              caption="MCP · SDK · n8n"
              body="Push the Skill into your stack. Pair it with triggers and HITL gates. Now it runs without you. Now you go build the next one."
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M5 9l7-7 7 7M5 15l7 7 7-7"/></svg>}
            />
          </div>
        </div>

        {/* The Library — three lanes */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
            <Tag color="var(--ff-pink)" filled>II.</Tag>
            <div className="poppins" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
              The Library · <span style={{ color: 'var(--ff-text-3)' }}>16 tools, three lanes, one operator</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {opLanes.map(lane => (
              <div key={lane.id} style={{
                background: 'linear-gradient(180deg, rgba(26,11,46,0.6), rgba(15,6,24,0.4))',
                border: `1px solid var(--ff-border)`,
                borderTop: `3px solid ${lane.color}`,
                borderRadius: 16,
                padding: 28,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
                  <div className="mono" style={{ fontSize: 13, color: lane.color, letterSpacing: '0.16em', fontWeight: 700 }}>{lane.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ff-text-3)' }}>·</div>
                  <div className="serif" style={{ fontSize: 20, color: 'var(--ff-text-2)' }}>{lane.pitch}</div>
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)', letterSpacing: '0.1em', marginBottom: 20 }}>
                  {lane.tools.length} TOOLS · ALL MARKDOWN · PORTABLE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lane.tools.map(t => (
                    <div key={t.n} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(15,6,24,0.55)',
                      border: '1px solid var(--ff-border)',
                    }}>
                      <span className="mono" style={{
                        fontSize: 11, fontWeight: 700, color: lane.color,
                        background: `${lane.color}1a`, padding: '3px 7px', borderRadius: 4,
                        minWidth: 32, textAlign: 'center'
                      }}>{t.n}</span>
                      <span className="poppins" style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{t.name}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)' }}>.md</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Loop arrow back */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
            marginTop: 30, padding: '14px 28px',
            border: '1px dashed var(--ff-border-strong)',
            borderRadius: 999,
            background: 'rgba(168,85,247,0.04)',
            width: 'fit-content', margin: '30px auto 0'
          }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--ff-text-3)', letterSpacing: '0.12em' }}>OFFICE → SELL · OUTPUTS BECOME INPUTS</span>
            <span style={{ color: 'var(--ff-cyan)', fontSize: 18 }}>↻</span>
          </div>
        </div>

        {/* The Iceberg + Signal callout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 24, marginBottom: 80 }}>
          {/* Iceberg */}
          <GlassCard accent padding={36} style={{ position: 'relative', minHeight: 460 }}>
            <Tag color="var(--ff-cyan)" filled>III.</Tag>
            <div className="poppins" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 18 }}>
              The Iceberg <span className="serif" style={{ color: 'var(--ff-cyan)' }}>Principle</span>
            </div>
            <p style={{ fontSize: 15.5, lineHeight: 1.55, color: 'var(--ff-text-2)', margin: '20px 0 24px', maxWidth: 480 }}>
              The visible tip — the part of knowledge work today's models can already do — is the easy part. The mass below the waterline is where the consulting fee lives: judgment, context, sequencing, taste.
            </p>
            {/* Iceberg illustration */}
            <div style={{ position: 'relative', height: 220, marginTop: 8 }}>
              <svg viewBox="0 0 600 220" width="100%" height="100%">
                <defs>
                  <linearGradient id="ice-above" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#22D3EE" stopOpacity="0.9"/>
                    <stop offset="1" stopColor="#22D3EE" stopOpacity="0.5"/>
                  </linearGradient>
                  <linearGradient id="ice-below" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#A855F7" stopOpacity="0.55"/>
                    <stop offset="1" stopColor="#A855F7" stopOpacity="0.15"/>
                  </linearGradient>
                </defs>
                {/* waterline */}
                <line x1="0" y1="70" x2="600" y2="70" stroke="rgba(34,211,238,0.5)" strokeDasharray="4 4"/>
                <text x="0" y="60" fontFamily="JetBrains Mono" fontSize="11" fill="#22D3EE" letterSpacing="2">WATERLINE · WHAT MODELS DO TODAY</text>
                <text x="540" y="60" fontFamily="JetBrains Mono" fontSize="11" fill="#22D3EE" textAnchor="end">VISIBLE</text>
                {/* above */}
                <polygon points="245,30 285,15 320,40 350,18 380,40 240,70 370,70" fill="url(#ice-above)" stroke="#22D3EE" strokeWidth="1"/>
                {/* below */}
                <polygon points="240,70 370,70 410,130 380,180 320,205 260,200 220,170 200,120" fill="url(#ice-below)" stroke="#A855F7" strokeWidth="1" opacity="0.9"/>
                {/* below labels */}
                <text x="280" y="105" fontFamily="Poppins" fontSize="13" fill="#F8FAFC" fontWeight="600">Judgment</text>
                <text x="270" y="135" fontFamily="Poppins" fontSize="13" fill="#F8FAFC" fontWeight="600">Context ownership</text>
                <text x="285" y="165" fontFamily="Poppins" fontSize="13" fill="#F8FAFC" fontWeight="600">Sequencing</text>
                <text x="305" y="190" fontFamily="Poppins" fontSize="13" fill="#F8FAFC" fontWeight="600">Taste</text>
                {/* annotation */}
                <text x="430" y="170" fontFamily="JetBrains Mono" fontSize="11" fill="#A855F7" letterSpacing="2">THE FEE</text>
                <text x="430" y="184" fontFamily="JetBrains Mono" fontSize="10" fill="#64748B" letterSpacing="1">LIVES DOWN HERE</text>
              </svg>
            </div>
          </GlassCard>

          {/* Signal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <GlassCard padding={32} style={{
              background: 'linear-gradient(135deg, rgba(244,114,182,0.16), rgba(168,85,247,0.08))',
              flex: 1
            }}>
              <Eyebrow color="var(--ff-pink)" dot={false}>THE REAL LESSON</Eyebrow>
              <div className="poppins" style={{
                fontSize: 36, fontWeight: 700, lineHeight: 1.1,
                letterSpacing: '-0.025em', marginTop: 14
              }}>
                <span style={{ color: 'var(--ff-text-3)' }}>A</span> <span className="serif gtxt">tool</span> <span style={{ color: 'var(--ff-text-3)' }}>changes every</span> six months.<br />
                <span style={{ color: 'var(--ff-text-3)' }}>The</span> <span className="serif" style={{ color: 'var(--ff-cyan)' }}>skill</span> <span style={{ color: 'var(--ff-text-3)' }}>of reading a system</span> <em style={{ color: 'var(--ff-pink)', fontStyle: 'italic' }}>doesn't.</em>
              </div>
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px dashed var(--ff-border)', fontSize: 13, color: 'var(--ff-text-3)' }}>
                Shape skills, not tools. The library survives the model swap.
              </div>
            </GlassCard>
            <GlassCard padding={28}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ff-acid)', letterSpacing: '0.16em', marginBottom: 14 }}>
                ● FIVE SHIFTS RESHAPING KNOWLEDGE WORK
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Execution inverts',    'Humans frame, models do.'],
                  ['Cognitive partnership', 'Pairing, not commanding.'],
                  ['Token economics arrive','Compute is a line item.'],
                  ['Context is the moat',   'Whoever owns the data wins.'],
                  ['Domain boundaries blur','Verticals melt; skills travel.'],
                ].map(([h, s], i) => (
                  <div key={h} style={{ display: 'flex', gap: 14, paddingBottom: 8, borderBottom: i < 4 ? '1px solid var(--ff-border)' : 'none' }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)', minWidth: 24 }}>0{i+1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="poppins" style={{ fontSize: 14, fontWeight: 600 }}>{h}</div>
                      <div style={{ fontSize: 13, color: 'var(--ff-text-2)' }}>{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom strip — system map, not metrics */}
        <div style={{
          padding: '32px 40px',
          background: 'linear-gradient(90deg, rgba(168,85,247,0.08), rgba(34,211,238,0.05))',
          border: '1px solid var(--ff-border-strong)',
          borderRadius: 16,
          display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr) 1.4fr', gap: 28, alignItems: 'center'
        }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ff-purple)', letterSpacing: '0.14em', marginBottom: 4 }}>FILED BY</div>
            <div className="poppins" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em' }}>Kyle Rosebrook</div>
            <div style={{ fontSize: 13, color: 'var(--ff-text-3)' }}>FlashFusion · The Register</div>
          </div>
          {[
            ['16',    'TOOLS',  'one for every part of the practice'],
            ['3',     'LANES',  'sell · deliver · office'],
            ['3-Rule','METHOD', 'identify · encode · deploy'],
          ].map(([v, l, sub]) => (
            <div key={l} style={{ borderLeft: '1px solid var(--ff-border)', paddingLeft: 20 }}>
              <div className="poppins" style={{ fontSize: v === '3-Rule' ? 28 : 36, fontWeight: 800, letterSpacing: '-0.03em', fontFeatureSettings: '"tnum"' }}>{v}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ff-text-3)', letterSpacing: '0.14em' }}>{l}</div>
              <div style={{ fontSize: 11, color: 'var(--ff-text-3)', marginTop: 4, lineHeight: 1.35 }}>{sub}</div>
            </div>
          ))}
          <div style={{ textAlign: 'right' }}>
            <Btn kind="primary" size="md">Read the full register →</Btn>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)', letterSpacing: '0.1em', marginTop: 10 }}>flashfusion.io/register</div>
          </div>
        </div>

      </div>
    </AmbientBG>
  );
}

function FlowStep({ n, name, color, caption, body, icon }) {
  return (
    <div style={{
      padding: 36, borderRadius: 18,
      background: 'rgba(26,11,46,0.55)',
      border: `1px solid ${color}55`,
      position: 'relative',
      minHeight: 320,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        position: 'absolute', top: -1, left: 24, right: 24, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 14,
          background: `${color}18`,
          border: `1px solid ${color}66`,
          color, display: 'grid', placeItems: 'center',
          boxShadow: `0 0 24px ${color}22`
        }}>
          {icon}
        </div>
        <div>
          <div className="mono" style={{ fontSize: 12, color, letterSpacing: '0.18em', fontWeight: 700 }}>{n}</div>
          <div className="poppins" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>{name}</div>
        </div>
      </div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)', letterSpacing: '0.14em', marginBottom: 12 }}>
        — {caption.toUpperCase()}
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ff-text-2)', margin: 0 }}>{body}</p>
    </div>
  );
}

function Arrow({ color, toColor }) {
  return (
    <div style={{ height: 60, display: 'grid', placeItems: 'center', position: 'relative' }}>
      <svg viewBox="0 0 60 12" width="60" height="20">
        <defs>
          <linearGradient id={`arr-${color}-${toColor}`.replace(/[(),\s]/g, '_')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={color.replace('var(--ff-', '').replace(')', '') === 'purple' ? '#A855F7' : color.replace('var(--ff-', '').replace(')', '') === 'pink' ? '#F472B6' : '#22D3EE'}/>
            <stop offset="1" stopColor={toColor.replace('var(--ff-', '').replace(')', '') === 'purple' ? '#A855F7' : toColor.replace('var(--ff-', '').replace(')', '') === 'pink' ? '#F472B6' : '#22D3EE'}/>
          </linearGradient>
        </defs>
        <line x1="0" y1="6" x2="48" y2="6" stroke={`url(#arr-${color}-${toColor}`.replace(/[(),\s]/g, '_') + ')'} strokeWidth="2"/>
        <polygon points="48,1 60,6 48,11" fill={toColor.replace('var(--ff-', '').replace(')', '') === 'purple' ? '#A855F7' : toColor.replace('var(--ff-', '').replace(')', '') === 'pink' ? '#F472B6' : '#22D3EE'}/>
      </svg>
    </div>
  );
}

Object.assign(window, { FFInfographic });
