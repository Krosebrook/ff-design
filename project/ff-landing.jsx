/* ─────────────────────────────────────────────────────────────────────────────
   FlashFusion · Direction A — Marketing landing page
   1440 × 3400
   ───────────────────────────────────────────────────────────────────────────── */

const landingNav = ['Platform', 'Library', 'Sprints', 'Pricing', 'Operator'];

const threeRule = [
  { n: '01', title: 'Identify', body: 'Find the pattern in your week — the meeting prep, the proposal, the audit report. The thing you do over and over.', color: 'var(--ff-purple)' },
  { n: '02', title: 'Encode',   body: 'Turn the pattern into a portable Skill. Markdown in, structured judgment out. Lives anywhere Claude lives.', color: 'var(--ff-pink)' },
  { n: '03', title: 'Deploy',   body: 'Inject the Skill into MCP, Agent SDK, Desktop, n8n. Run it 100 more times. Then build the next one.', color: 'var(--ff-cyan)' },
];

const libraryTools = [
  { n: '01', name: 'ROI Calculator',      tag: 'SALES',    color: 'var(--ff-purple)', desc: 'Executive ROI narrative — payback, year-1 net, cost of waiting.' },
  { n: '02', name: 'Discovery Scorecard', tag: 'SALES',    color: 'var(--ff-purple)', desc: 'ICP fit, urgency, decision-maker access, budget signal — one pass.' },
  { n: '03', name: 'Skills Browser',      tag: 'PLATFORM', color: 'var(--ff-cyan)',   desc: 'Search your skill library by category, complexity, deploy time.' },
  { n: '04', name: 'Sprint Tracker',      tag: 'DELIVERY', color: 'var(--ff-acid)',   desc: 'Five-week sprint board with weekly stakeholder update generator.' },
  { n: '05', name: 'Proposal Builder',    tag: 'SALES',    color: 'var(--ff-purple)', desc: 'Audit → Sprint → Retainer proposal in your voice. SOW-ready.' },
  { n: '06', name: 'Audit Report Gen',    tag: 'DELIVERY', color: 'var(--ff-acid)',   desc: 'Setup scorecard → gaps, priority matrix, recommended next step.' },
  { n: '07', name: 'Pipeline Dashboard',  tag: 'OFFICE',   color: 'var(--ff-warm)',   desc: 'Deals by stage, weighted forecast, days-in-stage drift.' },
  { n: '08', name: 'Revenue Tracker',     tag: 'OFFICE',   color: 'var(--ff-warm)',   desc: 'MRR, ARR, retainer churn, upsell ratio. Monthly close in two clicks.' },
  { n: '15', name: 'Agent Builder',       tag: 'PLATFORM', color: 'var(--ff-cyan)',   desc: 'Compose triggers, steps, guardrails, HITL gates. n8n-ready spec.' },
];

const liveAgents = [
  { name: 'audit-readiness',   status: 'running',   glyph: '◐' },
  { name: 'proposal-drafter',  status: 'running',   glyph: '▷' },
  { name: 'sprint-update',     status: 'idle',      glyph: '◇' },
  { name: 'newsletter-weekly', status: 'scheduled', glyph: '✦' },
];

function FFLanding() {
  return (
    <AmbientBG style={{ width: '100%', height: '100%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 64px' }}>

        {/* ─── Top nav ─────────────────────────────────────────────────── */}
        <nav style={{
          display: 'flex', alignItems: 'center', gap: 32,
          padding: '32px 0', borderBottom: '1px solid var(--ff-border)'
        }}>
          <FFWordmark size={20} />
          <div style={{ display: 'flex', gap: 28, marginLeft: 40 }}>
            {landingNav.map(l => (
              <a key={l} style={{
                color: 'var(--ff-text-2)', textDecoration: 'none',
                font: '500 14px Inter, sans-serif'
              }}>{l}</a>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div className="mono" style={{ fontSize: 12, color: 'var(--ff-text-3)', letterSpacing: '0.1em' }}>
            <span style={{ color: 'var(--ff-acid)' }}>●</span> OPERATOR HUB · LIVE
          </div>
          <a style={{ color: 'var(--ff-text-2)', font: '500 14px Inter, sans-serif' }}>Sign in</a>
          <Btn kind="primary" size="sm">Book audit →</Btn>
        </nav>

        {/* ─── Hero ────────────────────────────────────────────────────── */}
        <section style={{
          display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 56,
          padding: '88px 0 100px', alignItems: 'center'
        }}>
          <div>
            <Eyebrow color="var(--ff-cyan)">The Operator OS · v4</Eyebrow>
            <h1 className="poppins" style={{
              fontSize: 96, fontWeight: 800, lineHeight: 0.95,
              letterSpacing: '-0.045em', margin: '20px 0 28px'
            }}>
              Power <span className="serif" style={{ color: 'var(--ff-purple)' }}>ideas.</span><br />
              Fuse <span className="serif" style={{ color: 'var(--ff-pink)' }}>potential.</span><br />
              <span className="gtxt">Drive impact.</span>
            </h1>
            <p style={{
              fontSize: 19, lineHeight: 1.55, color: 'var(--ff-text-2)',
              maxWidth: 560, margin: '0 0 36px'
            }}>
              FlashFusion is where AI consultants run their whole practice — the audit, the sprint, the agents you build for clients, and the agents you build for <em>yourself</em>. One library. Sixteen tools. Every step verified.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
              <Btn kind="primary" size="lg">Start the 30-day sprint →</Btn>
              <Btn kind="ghost" size="lg">Watch a 4-min demo</Btn>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--ff-text-3)', fontSize: 13 }}>
              <span className="mono" style={{ letterSpacing: '0.08em' }}>BUILT IN PUBLIC BY</span>
              <span style={{ color: 'var(--ff-text-2)', font: '600 14px Poppins' }}>Kyle Rosebrook</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--ff-text-3)' }} />
              <span className="mono" style={{ letterSpacing: '0.08em' }}>OPEN SOURCE · MIT</span>
            </div>
          </div>

          {/* Live operator card */}
          <GlassCard accent padding={26} style={{ alignSelf: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <FFMark size={28} glow />
              <div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ff-purple)' }}>LIVE · OPERATOR HUB</div>
                <div className="poppins" style={{ fontSize: 15, fontWeight: 600 }}>Kyle's workspace</div>
              </div>
              <div style={{ flex: 1 }} />
              <div className="mono" style={{ fontSize: 11, color: 'var(--ff-acid)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ff-acid)', boxShadow: '0 0 8px var(--ff-acid)' }} />
                LIVE
              </div>
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ff-text-3)', letterSpacing: '0.14em', marginBottom: 10 }}>AGENTS · CURRENT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {liveAgents.map(a => (
                <div key={a.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: 'rgba(15,6,24,0.6)',
                  border: '1px solid var(--ff-border)',
                  borderRadius: 10,
                }}>
                  <span style={{ fontSize: 16, color: a.status === 'running' ? 'var(--ff-acid)' : a.status === 'idle' ? 'var(--ff-text-3)' : 'var(--ff-cyan)' }}>{a.glyph}</span>
                  <span className="mono" style={{ fontSize: 13, flex: 1 }}>{a.name}</span>
                  <span className="mono" style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.08em',
                    background: a.status === 'running' ? 'rgba(199,247,63,0.12)' : 'rgba(168,85,247,0.08)',
                    color: a.status === 'running' ? 'var(--ff-acid)' : 'var(--ff-text-3)',
                    textTransform: 'uppercase'
                  }}>{a.status}</span>
                </div>
              ))}
            </div>
            <div style={{
              padding: 14, borderRadius: 10,
              border: '1px dashed var(--ff-border-strong)',
              background: 'rgba(168,85,247,0.04)',
            }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ff-purple)', marginBottom: 6 }}>QUEUED</div>
              <div style={{ fontSize: 14, color: 'var(--ff-text)' }}>
                Draft this week's audit deck — runs on the Audit Report skill
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(168,85,247,0.15)' }} />
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ff-text-3)' }}>6 sections · ready to run</div>
            </div>
          </GlassCard>
        </section>

        {/* ─── System strip — structural, not metric ───────────────────── */}
        <section style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
          padding: '40px 0', borderTop: '1px solid var(--ff-border)', borderBottom: '1px solid var(--ff-border)',
          margin: '0 0 120px'
        }}>
          {[
            { label: 'TOOLS IN THE LIBRARY', value: '16', sub: 'one for every part of the practice' },
            { label: 'LANES OF WORK',        value: '3',  sub: 'sell · deliver · office' },
            { label: 'THE METHOD',           value: '3-Rule', sub: 'identify · encode · deploy', wide: true },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: '0 32px',
              borderRight: i < 2 ? '1px solid var(--ff-border)' : 'none'
            }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ff-text-3)' }}>{s.label}</div>
              <div className="poppins" style={{ fontSize: s.wide ? 42 : 48, fontWeight: 700, letterSpacing: '-0.035em', marginTop: 8, fontFeatureSettings: '"tnum"' }}>
                {s.value}
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--ff-text-3)' }}>{s.sub}</div>
            </div>
          ))}
        </section>

        {/* ─── The 3-Rule ──────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 120 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
            <SectionHead
              eyebrow="The method"
              title={<>Make it <span className="serif gtxt">once.</span><br />Use it <span className="serif" style={{ color: 'var(--ff-cyan)' }}>forever.</span></>}
            />
            <p style={{ maxWidth: 360, fontSize: 15, lineHeight: 1.55, color: 'var(--ff-text-2)', margin: 0 }}>
              Every consultant's day repeats. The 3-Rule turns that repetition into compound leverage — a portable Skill instead of a one-off output.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }}>
            {/* connector line */}
            <div style={{
              position: 'absolute', top: 50, left: '12%', right: '12%', height: 2,
              background: 'linear-gradient(90deg, var(--ff-purple), var(--ff-pink), var(--ff-cyan))',
              opacity: 0.35, zIndex: 0
            }} />
            {threeRule.map((r) => (
              <GlassCard key={r.n} accent padding={32} style={{ minHeight: 320, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    border: `2px solid ${r.color}`,
                    display: 'grid', placeItems: 'center',
                    background: 'rgba(15,6,24,0.9)',
                    boxShadow: `0 0 20px ${r.color}40`
                  }}>
                    <span className="mono" style={{ fontSize: 14, color: r.color, fontWeight: 700 }}>{r.n}</span>
                  </div>
                  <div className="poppins" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{r.title}</div>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--ff-text-2)', margin: 0 }}>{r.body}</p>
                <div style={{
                  marginTop: 32, paddingTop: 20, borderTop: '1px dashed var(--ff-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)', letterSpacing: '0.1em' }}>
                    {r.n === '01' ? 'PATTERN RECOGNITION' : r.n === '02' ? '.md · MCP-READY' : 'MCP · SDK · DESKTOP'}
                  </span>
                  <Tag color={r.color}>STEP {r.n}</Tag>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ─── The Library ─────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 120 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <SectionHead
              eyebrow="The library"
              title={<>Sixteen tools.<br />One <span className="serif" style={{ color: 'var(--ff-pink)' }}>operator.</span></>}
            />
            <Btn kind="ghost" size="md">Browse the library →</Btn>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {libraryTools.map(t => (
              <div key={t.n} style={{
                padding: 22,
                background: 'rgba(26,11,46,0.4)',
                border: '1px solid var(--ff-border)',
                borderRadius: 14,
                minHeight: 170,
                position: 'relative',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: `${t.color}14`,
                    border: `1px solid ${t.color}55`,
                    display: 'grid', placeItems: 'center',
                    color: t.color,
                    font: '700 14px JetBrains Mono'
                  }}>{t.n}</div>
                  <div className="poppins" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em', flex: 1, paddingTop: 4 }}>
                    {t.name}
                  </div>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ff-text-2)', margin: '14px 0 auto' }}>{t.desc}</p>
                <div style={{
                  marginTop: 14, paddingTop: 12,
                  borderTop: '1px dashed var(--ff-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <Tag color={t.color}>{t.tag}</Tag>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ff-text-3)' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── The Manifesto block (no fake testimonials) ──────────────── */}
        <section style={{ paddingBottom: 120 }}>
          <GlassCard accent padding={64} style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(34,211,238,0.08))',
          }}>
            <div className="serif" style={{
              fontSize: 220, lineHeight: 0.5, color: 'var(--ff-purple)', opacity: 0.4,
              position: 'absolute', top: 30, left: 50, pointerEvents: 'none'
            }}>“</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 56, alignItems: 'center', position: 'relative' }}>
              <div>
                <Eyebrow color="var(--ff-pink)">The thesis</Eyebrow>
                <blockquote className="poppins" style={{
                  fontSize: 38, lineHeight: 1.2, fontWeight: 500,
                  letterSpacing: '-0.025em', margin: '14px 0 0'
                }}>
                  A <span className="serif gtxt">tool</span> changes every six months.<br />
                  The <span className="serif" style={{ color: 'var(--ff-cyan)' }}>skill</span> of reading a system <em style={{ color: 'var(--ff-pink)' }}>doesn't.</em>
                </blockquote>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ff-text-2)', marginTop: 24, maxWidth: 540 }}>
                  FlashFusion is the bet that the consulting fee lives below the waterline — in judgment, sequencing, context, taste. The library is what survives the model swap.
                </p>
                <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F472B6, #A855F7)',
                    display: 'grid', placeItems: 'center', font: '700 14px Poppins', color: '#fff'
                  }}>KR</div>
                  <div>
                    <div className="poppins" style={{ fontWeight: 600, fontSize: 15 }}>Kyle Rosebrook</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ff-text-3)', letterSpacing: '0.08em' }}>FOUNDER · FLASHFUSION</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'WHAT YOU OWN', value: 'Skills', sub: 'portable .md files' },
                  { label: 'WHAT YOU RENT', value: 'Tools',  sub: 'swap them like SaaS' },
                  { label: 'WHAT YOU SHIP', value: 'Agents', sub: 'on your stack, your data' },
                  { label: 'WHAT YOU LEARN', value: 'Reps', sub: 'one Tuesday at a time' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: 18, borderRadius: 10,
                    border: '1px solid var(--ff-border)',
                    background: 'rgba(15,6,24,0.5)'
                  }}>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--ff-text-3)', letterSpacing: '0.12em' }}>{s.label}</div>
                    <div className="poppins" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 6, color: 'var(--ff-text)' }}>{s.value}</div>
                    <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ff-text-3)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ─── Pricing ─────────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 120 }}>
          <SectionHead
            eyebrow="Engagements"
            title={<>One <span className="serif" style={{ color: 'var(--ff-purple)' }}>path.</span> Three <span className="serif" style={{ color: 'var(--ff-cyan)' }}>doors.</span></>}
            kicker="Every FlashFusion engagement starts with the audit. From there: a sprint, or a retainer, or you take the playbook and run."
            align="center"
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 56 }}>
            {[
              {
                tier: 'AUDIT', price: '$4,500', dur: '2 weeks',
                pitch: 'Find the gaps. Score readiness. Get a 30-day roadmap.',
                features: ['AI readiness scorecard', 'Tool & workflow audit', 'Prioritized gap matrix', '30-day roadmap deck', 'One discovery workshop'],
                cta: 'Start with the audit', highlight: false
              },
              {
                tier: 'SPRINT', price: '$28,000', dur: '5 weeks',
                pitch: 'Ship two production agents. Hand the team the keys.',
                features: ['Everything in Audit', '2 production agents shipped', 'Skill packs encoded to .md', 'Team training (2 sessions)', 'Weekly stakeholder update'],
                cta: 'Run a sprint', highlight: true
              },
              {
                tier: 'RETAINER', price: '$6,500', dur: 'per month',
                pitch: 'vCAIO seat. Monthly memo. Continuous shipping.',
                features: ['Standing weekly office hour', 'Monthly vCAIO memo', 'New skill shipped monthly', 'Slack / Teams channel access', 'Quarterly strategy review'],
                cta: 'Reserve a seat', highlight: false
              },
            ].map(p => (
              <div key={p.tier} style={{
                padding: 32, borderRadius: 18,
                background: p.highlight
                  ? 'linear-gradient(180deg, rgba(168,85,247,0.18), rgba(34,211,238,0.08))'
                  : 'rgba(26,11,46,0.45)',
                border: `1px solid ${p.highlight ? 'var(--ff-border-strong)' : 'var(--ff-border)'}`,
                position: 'relative',
                display: 'flex', flexDirection: 'column'
              }}>
                {p.highlight && (
                  <Tag color="var(--ff-acid)" filled>★ Most popular</Tag>
                )}
                <div className="mono" style={{
                  fontSize: 13, letterSpacing: '0.16em', fontWeight: 600,
                  color: p.highlight ? 'var(--ff-cyan)' : 'var(--ff-purple)',
                  marginTop: p.highlight ? 18 : 0, marginBottom: 18
                }}>{p.tier}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                  <div className="poppins" style={{ fontSize: 54, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1, fontFeatureSettings: '"tnum"' }}>{p.price}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ff-text-3)' }}>{p.dur}</div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--ff-text-2)', lineHeight: 1.5, margin: '0 0 24px' }}>{p.pitch}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'var(--ff-text-2)' }}>
                      <span style={{ color: 'var(--ff-cyan)', fontSize: 13, lineHeight: 1.5 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto' }}>
                  {p.highlight
                    ? <Btn kind="primary" size="md">{p.cta} →</Btn>
                    : <Btn kind="ghost" size="md">{p.cta} →</Btn>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Final CTA + footer ──────────────────────────────────────── */}
        <section style={{
          textAlign: 'center', padding: '100px 0 80px',
          borderTop: '1px solid var(--ff-border)'
        }}>
          <Eyebrow color="var(--ff-cyan)">Ready when you are</Eyebrow>
          <h2 className="poppins" style={{
            fontSize: 76, fontWeight: 800, letterSpacing: '-0.04em',
            lineHeight: 1.0, margin: '20px auto 28px', maxWidth: 900
          }}>
            Your next agent ships <span className="serif" style={{ color: 'var(--ff-pink)' }}>this sprint.</span><br />Not <span className="serif gtxt">next quarter.</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--ff-text-2)', maxWidth: 540, margin: '0 auto 40px' }}>
            Or you can keep doing it the way you did last week. We send the audit either way.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Btn kind="primary" size="lg">Book the audit →</Btn>
            <Btn kind="ghost" size="lg">Read the prompt library</Btn>
          </div>
        </section>

        <footer style={{
          padding: '36px 0', borderTop: '1px solid var(--ff-border)',
          display: 'flex', alignItems: 'center', gap: 24, color: 'var(--ff-text-3)', fontSize: 13
        }}>
          <FFWordmark size={16} />
          <div className="mono" style={{ marginLeft: 'auto', letterSpacing: '0.08em' }}>© 2026 FlashFusion · Built by Kyle Rosebrook</div>
          <a style={{ color: 'var(--ff-text-3)' }}>Manifesto</a>
          <a style={{ color: 'var(--ff-text-3)' }}>Newsletter</a>
          <a style={{ color: 'var(--ff-text-3)' }}>Console →</a>
        </footer>
      </div>
    </AmbientBG>
  );
}

Object.assign(window, { FFLanding });
