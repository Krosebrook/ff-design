# 16-Agent MCP Orchestration System

**Version:** 4.0.0  
**Built:** 2026-05-08  
**Author:** Kyle Rosebrook  
**License:** Internal use, INT Inc / GenoFusion stack

---

## What this is

A complete 16-agent specification covering orchestration, build, security, reliability, and customer engagement. Each agent is a specialized AI persona with explicit tools, permissions, hard boundaries, and coordination contracts.

This is the rebuild of the FlashFusion 16-agent MCP system that was designed in late 2025 but only partially instantiated due to session compaction. **All 16 agent files now exist.**

## Why this version is different

| Previous attempt | This rebuild |
|---|---|
| 4 of 16 files instantiated | 16 of 16 |
| Generic "FlashFusion code examples" | Real production patterns (RLS, HMAC verification, rollback playbooks) |
| Aspirational hard boundaries | Specific, enforceable boundaries per agent |
| No idempotent self-check | Every agent has a "Self-check before responding" section |
| Permission matrix theoretical | YAML frontmatter with explicit `permissions: { read, write, execute }` |
| Frameworks named, not defined | Each framework has a phase table with explicit actions |

## Agent inventory

### Orchestration & Governance (4)
| Agent | Framework | Purpose | Tools |
|-------|-----------|---------|-------|
| **Tessa** | RAIN | Master orchestrator. Routes tasks. | linear, github, slack |
| **Agent K** | RAPID | Emergency executor. P0/P1 only. | vercel, supabase, stripe, cloudflare |
| **Conductor** | ALIGN | System architect. Writes ADRs. | github, notion, figma |
| **Sentinel** | GUARD | Agent-system QA. Audits other agents. | github, notion |

### Build, Infra & Quality (4)
| Agent | Framework | Purpose | Tools |
|-------|-----------|---------|-------|
| **Forge** | BUILD | Production code generation. Small diffs. | github, typescript, prisma |
| **Pipeline** | SHIP | Deploys, rollbacks, env management. | vercel, github-actions, sentry |
| **Atlas** | DATA | Schema, RLS, migrations. | prisma, supabase, postgresql |
| **Inspector** | VALIDATE | Tests, coverage, quality gates. | vitest, playwright, codecov |

### Security, Risk & Compliance (3)
| Agent | Framework | Purpose | Tools |
|-------|-----------|---------|-------|
| **Guardian** | SHIELD | AppSec. OWASP Top 10. | snyk, semgrep, gitleaks |
| **Prime** | COMPLY | SOC2, GDPR, ISO 42001, EU AI Act. | vanta, drata, supabase |
| **Ethica** | ETHIC | AI governance. Bias, safety, EU AI Act tier. | openai-moderation, fairlearn |

### Reliability, Insights & Business (3)
| Agent | Framework | Purpose | Tools |
|-------|-----------|---------|-------|
| **Watchtower** | MONITOR | SLOs, alerts, dashboards. | datadog, sentry, prometheus |
| **Validator** | TESTLOOP | A/B experiments with statistical rigor. | posthog, statsig, growthbook |
| **Strategos** | STRATEGIC | OKRs, North Star, roadmap. | notion, posthog, stripe |

### Knowledge & Customer (2)
| Agent | Framework | Purpose | Tools |
|-------|-----------|---------|-------|
| **Archivist** | LEARN | Post-mortems, ADRs, pattern library. | notion, confluence, context7 |
| **Ambassador** | LISTEN | Support, NPS, user research. | intercom, typeform, dovetail |

## How to use this

### As Claude Project knowledge
1. Upload all 16 `.agent.md` files to a Claude Project
2. Add a system instruction: "When the user invokes `@<agent-name>`, follow that agent's spec strictly. Default to Tessa for routing."
3. Tessa decomposes user requests; specialized agents execute.

### As a sub-agent library (Claude Code)
1. Drop the agent files in `.claude/agents/` 
2. Reference by `@agent-name` in conversation
3. Each agent has YAML frontmatter compatible with Claude's sub-agent format

### As MCP tool definitions
The `permissions` and `tools` blocks map directly to MCP server scopes. Use them to scope MCP server access per agent.

## Workflow examples

### Ship a feature
```
Tessa → Atlas (schema) → Forge (code) → Inspector (tests) 
      → Guardian (security review) → Pipeline (deploy) 
      → Watchtower (SLO baseline) → Validator (experiment) 
      → Ambassador (collect feedback) → Archivist (learnings)
```

### Handle a P0
```
Watchtower (SLO breach) → Agent K (rollback) 
                       → Guardian (verify no breach) 
                       → Watchtower (confirm recovery) 
                       → Archivist (post-mortem) 
                       → Forge (permanent fix) 
                       → Inspector (regression test)
```

### Quarterly planning
```
Ambassador (customer themes) → Strategos (OKRs) 
                            → Validator (experiments to run) 
                            → Conductor (architecture review) 
                            → Tessa (sequence)
```

## Hard rules across all agents

1. **Every agent has a Self-check section.** Run it before responding.
2. **Every agent has Hard boundaries.** Specific, not aspirational.
3. **Every handoff is contracted.** Inputs, outputs, acceptance criteria, escalation path.
4. **Every privileged action is logged.** Audit log is immutable.
5. **No agent has `permissions.write: [all]`** without Conductor sign-off (Agent K is the documented exception).
6. **No agent silences its monitoring** to "stop the noise." Tune or escalate.

## Files

```
agents-project/
├── README.md                          (this file)
├── INTEGRATION_MATRIX.md              (cross-agent coordination grid)
├── CHANGELOG.md                       (version history)
├── orchestration/
│   ├── tessa.agent.md
│   ├── agent-k.agent.md
│   ├── conductor.agent.md
│   └── sentinel.agent.md
├── build-infra/
│   ├── forge.agent.md
│   ├── pipeline.agent.md
│   ├── atlas.agent.md
│   └── inspector.agent.md
├── security-risk/
│   ├── guardian.agent.md
│   ├── prime.agent.md
│   └── ethica.agent.md
├── reliability-insights/
│   ├── watchtower.agent.md
│   ├── validator.agent.md
│   └── strategos.agent.md
├── knowledge-innovation/
│   └── archivist.agent.md
└── customer-market/
    └── ambassador.agent.md
```

## Next steps

1. **Validate**: read each spec. Push back where the boundaries are wrong for your context.
2. **Wire up**: drop into `.claude/agents/` or upload to a Claude Project.
3. **Test**: run a real workflow through Tessa. See if the handoffs stick.
4. **Tune**: per-agent triggers may need adjustment based on actual usage patterns.
5. **Schedule Sentinel quarterly review**: 90 days from deployment.
