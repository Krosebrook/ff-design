# Agent Integration Matrix

How agents coordinate. Read row → column: "From row's perspective, what does column do for me?"

| From ↓ / To → | Tessa | Agent K | Conductor | Sentinel | Forge | Pipeline | Atlas | Inspector | Guardian | Prime | Ethica | Watchtower | Validator | Strategos | Archivist | Ambassador |
|---------------|-------|---------|-----------|----------|-------|----------|-------|-----------|----------|-------|--------|------------|-----------|-----------|-----------|------------|
| **Tessa** | — | escalate P0 | request ADR | request agent review | route code task | coordinate deploy | request schema | request tests | request sec review | request compliance check | request AI review | check SLO health | plan experiment | strategic input | log workflow | user feedback in |
| **Agent K** | report incident | — | post-incident ADR | post-incident agent review | hand fix to | trigger rollback | emergency restore | skip in emergency | bypass with sign-off | defer with sign-off | bypass with sign-off | confirm metrics | pause experiments | report business impact | post-mortem | user comms |
| **Conductor** | hand off ADR | — | — | request agent review | implementation breakdown | deploy strategy | data model | test strategy | sec implications | compliance impact | AI risk tier | SLO targets | experiment design | OKR alignment | ADR archive | — |
| **Sentinel** | — | — | escalate spec issue | — | code change review | deploy of agent file | — | spec test | sec audit | compliance audit | AI policy review | — | — | — | changelog | — |
| **Forge** | report completion | — | request ADR clarity | spec review | — | submit PR for deploy | request schema | submit for test | submit for review | — | submit AI feature | perf check | implement flag | — | document patterns | — |
| **Pipeline** | report deploy | trigger if blocks | — | — | deploy code | — | run migrations | run tests | scan results | — | — | post-deploy SLO | feature rollout | — | deploy log | — |
| **Atlas** | schema ready | emergency restore | data implications | — | provide schema | migration script | — | query tests | RLS audit | data privacy | — | query perf | — | — | doc schema | — |
| **Inspector** | test results | skip in P0 | — | — | test feedback | gate result | test queries | — | sec tests | compliance tests | AI bias tests | perf tests | experiment validation | — | flaky-test patterns | — |
| **Guardian** | sec status | active threat | sec architecture | — | approve PR | block deploy | RLS audit | — | — | sec controls | AI safety | sec monitoring | — | — | threat model | — |
| **Prime** | compliance status | — | compliance impact | — | — | — | data privacy | compliance tests | implement controls | — | AI governance | compliance metrics | — | — | policy archive | privacy req handling |
| **Ethica** | AI status | — | AI architecture | — | AI approval | — | — | AI tests | AI security | AI governance | — | AI monitoring | AI experiment | — | AI policy | user-reported AI issue |
| **Watchtower** | route alert | page on SLO breach | — | — | regression alert | post-deploy baseline | query perf | perf tests | sec monitoring | compliance monitoring | AI monitoring | — | guardrail metrics | OKR dashboard | — | outage alert |
| **Validator** | report decision | pause on incident | — | — | implement experiment | feature flag | — | experiment validation | — | — | AI experiment review | guardrail check | — | inform OKR | experiment learning | — |
| **Strategos** | priority order | — | strategic ADR | — | priority signal | — | — | — | — | — | — | OKR vs SLO | hypothesis to test | — | OKR archive | customer priority |
| **Archivist** | surface prior art | — | ADR collection | changelog source | pattern library | runbook archive | schema docs | flaky-test register | threat model archive | policy archive | AI policy archive | dashboard owners | experiment learnings | OKR archive | — | research notes |
| **Ambassador** | customer themes | customer-detected outage | customer-driven ADR | — | bug repro | — | — | — | sec report | privacy req | AI complaint | outage from users | hypothesis source | NPS / themes | research notes | — |

## Reading the matrix

- **Empty cell (—)** = no direct interaction in normal workflow
- **Cell content** = what the column agent does for the row agent
- **Escalation paths** are documented in each agent's `escalates_to` field

## Common multi-agent patterns

### Pattern A: Code change with full quality gates
`Conductor → Forge → Atlas → Inspector → Guardian → Pipeline → Watchtower`

### Pattern B: Incident response
`Watchtower → Agent K → Guardian → Pipeline → Archivist → Forge → Inspector`

### Pattern C: Customer-driven feature
`Ambassador → Strategos → Conductor → Tessa → Forge → Validator → Ambassador`

### Pattern D: Compliance-driven change
`Prime → Conductor → Atlas + Guardian → Forge → Inspector → Pipeline`

### Pattern E: AI feature launch
`Conductor → Ethica → Forge → Inspector → Guardian → Pipeline → Watchtower → Validator`
