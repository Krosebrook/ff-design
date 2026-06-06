# FlashFusion Canvas v4 — Rebuild

Split-route rebuild of `flashfusion-canvas-v3.tsx`. Resolves the audit findings
from the previous turn. Locked to FlashFusion design tokens (frontend-design
skill v2.0.0 / FlashFusion-tokens.md).

---

## File tree

```
flashfusion-canvas/
├── package.json
├── README.md
├── src/
│   ├── main.tsx
│   ├── App.tsx                              # router shell + top nav + atmospheric bg
│   ├── styles/
│   │   ├── tokens.css                       # FlashFusion locked design tokens
│   │   └── flow.css                         # CSS keyframes (replaces GSAP)
│   ├── lib/
│   │   ├── types.ts                         # Agent, ExecutionEvent, IconName, SmokeCheck
│   │   ├── agents-data.ts                   # initialAgents + simulatedEvents
│   │   ├── statusMeta.ts                    # status → tailwind classes
│   │   └── smoke-checks.ts                  # pure validator, no React
│   ├── hooks/
│   │   └── useSimulatedAgentRuntime.ts      # pause / resume / reset state machine
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Icon.tsx                     # local inline SVGs, fixed aria-hidden
│   │   │   └── SystemPanel.tsx              # the glass card primitive
│   │   ├── agent/
│   │   │   ├── AgentCard.tsx                # error UI + retry, glow only when running
│   │   │   └── agentIconMap.ts
│   │   ├── runtime/
│   │   │   ├── DataFlowLine.tsx             # CSS-animated flow path
│   │   │   ├── RuntimeTimeline.tsx          # aria-live polite
│   │   │   └── CommandInput.tsx             # pause + reset, separate
│   │   ├── marketing/
│   │   │   ├── Hero.tsx                     # specific headline, gradient highlight
│   │   │   └── ArchitectureStrip.tsx
│   │   └── system/
│   │       ├── BackendBlueprint.tsx         # flat dl, no nested cards
│   │       └── SmokeCheckPanel.tsx          # debug-only
│   └── routes/
│       ├── HomeRoute.tsx                    # /          marketing surface
│       ├── ConsoleRoute.tsx                 # /console   operational dashboard
│       └── DebugRoute.tsx                   # /_debug    env-gated, 404 in prod
└── tests/
    └── smoke-checks.test.ts                 # vitest unit tests
```

---

## What changed vs v3

| Issue from audit                  | Fix                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `ariaHidden: true` invalid prop   | Replaced with `aria-hidden` in `Icon.tsx`; decorative-by-default with optional label |
| GSAP for one stroke animation     | Removed entirely; CSS `@keyframes` in `styles/flow.css`                              |
| Pause/restart conflated           | `pause()` / `resume()` / `reset()` are three distinct hook actions                   |
| Smoke check label misleading      | Renamed "Source event references" + "Source-data integrity"; clearer scope           |
| Marketing + ops in one route      | Split: `/`, `/console`, `/_debug`                                                    |
| Debug surface leaking to public   | `DebugRoute` returns `<Navigate />` in `import.meta.env.PROD`                        |
| Generic violet→cyan gradient      | Locked to `--gradient-accent` (purple → pink → cyan, the FlashFusion triad)          |
| Off-spec surface color `#0B0F1A`  | Replaced with `--surface-base` `#0F0618`                                              |
| Glow on every card                | Glow earned: only running agents + primary CTA                                        |
| Nested cards everywhere           | Flat panels; inner regions use border-divided `dl`/`ol` instead                       |
| Vague headline                    | "Six agents. One execution graph. Every step verified."                              |
| No live region for timeline       | `<ol aria-live="polite" aria-relevant="additions">`                                  |
| No error UI on agent.error        | `AgentCard` renders error detail + retry button when `status === 'error'`             |
| No reduced-motion handling        | `tokens.css` honors `prefers-reduced-motion`                                         |
| No tests                          | Six vitest cases covering smoke-check edge cases                                     |

---

## Drop-in instructions

This expects an existing Vite + React 18 + Tailwind project. If you don't
have one, scaffold it first:

```bash
pnpm create vite@latest flashfusion-canvas -- --template react-ts
cd flashfusion-canvas
pnpm add framer-motion react-router-dom
pnpm add -D vitest
```

Then copy `src/` and `tests/` into your project, and update `package.json`
scripts to include `"test": "vitest run"`.

Tailwind config: arbitrary values like `bg-[var(--surface-base)]` are
supported in Tailwind 3+ out of the box. No custom theme extension required.

If you're on Next.js App Router instead of Vite:

1. Replace `import.meta.env.PROD` → `process.env.NODE_ENV === 'production'`
   in `routes/DebugRoute.tsx` and `App.tsx`.
2. Move routes from `react-router-dom` to file-system routing under `app/`.
3. Add `'use client'` to `ConsoleRoute` and `DebugRoute` (they use hooks).
4. Move font `@import` from `tokens.css` to `next/font/google` in
   `app/layout.tsx`.

---

## Verification

```bash
pnpm install
pnpm tsc --noEmit                # zero type errors
pnpm test                        # 6 passing
pnpm dev                         # localhost:5173
```

Manual smoke:

- [ ] `/` renders hero, architecture strip, "Open console" CTA. No simulator running.
- [ ] `/console` renders 6 agent cards, simulator advances every 1.7s, timeline accumulates.
- [ ] Pause stops the simulator without resetting progress. Resume continues from cursor.
- [ ] Reset returns to initialAgents and clears the timeline.
- [ ] `/_debug` only renders when `import.meta.env.PROD === false`. Try `pnpm build && pnpm preview` and visit `/_debug` — should redirect to `/`.
- [ ] Tab through the page with keyboard. Focus rings visible on every interactive element.
- [ ] Reduce motion in OS settings. Animations collapse to instant.
- [ ] Run axe DevTools on `/` and `/console`. Zero critical issues.
- [ ] Screen reader (VoiceOver / NVDA) announces new timeline entries as they arrive.

---

## Known gaps (not fixed in this rebuild)

- **No real backend.** `useSimulatedAgentRuntime` cycles a hardcoded array. Replacing with Supabase Realtime requires the `agent_events` table, RLS policies, and a per-tenant rate limiter — out of scope for a UI rebuild.
- **Static homepage stats.** Hero shows `running: 3, completed: 142` as seeded values. Wire to a server-rendered metric endpoint when the backend exists.
- **No abort during run.** Pause halts the simulator tick but doesn't model an in-flight agent abort. When a real backend is wired, add an `AbortController` per `agent_run` and a cancel button per card.
- **No tenant scoping.** All data is single-tenant. When wiring Supabase, every query needs `tenant_id` enforcement at the RLS layer — service role key never client-side.
- **Bundle analysis not run.** GSAP removal is verified at the dependency-manifest level; actual bundle delta should be measured with `vite-bundle-visualizer` or similar before claiming a specific KB savings.
