# Post-Audit Suggestions

_Started 2026-05-09 15:01 UTC_

---

## User



## Assistant

I see you've shared a FlashFusion Canvas React component. What would you like me to do with it? A few options:

1. **Build it as a working HTML prototype** in this project (with live agent simulation, animations, etc.)
2. **Redesign or restyle it** — different aesthetic direction, layout variants, etc.
3. **Extract specific pieces** (the agent cards, timeline, command center) as standalone explorations
4. **Something else** — debug, extend, mock up new screens around it

Let me know which direction you'd like and I'll get started.

## User

suggest after audit

## Assistant

# Audit: FlashFusion Canvas v3

## What's working well
- **Clean separation** — runtime hook (`useSimulatedAgentRuntime`), pure data (initial agents, events), UI components. Easy to swap simulation for real backend.
- **Self-contained icons** — inline SVG removes CDN flakiness. Good call.
- **Smoke checks panel** — surfacing integrity tests in-product is a nice debugging affordance.
- **State-driven visuals** — `intensity`, `running`, `completed` derived from agent state and fed into the data-flow animation. That's the right pattern.

## Issues worth fixing

**1. Smoke checks are decorative, not dynamic**
`runSmokeChecks(agents, simulatedEvents)` is wrapped in `useMemo` over `[agents]`, but the checks only validate static invariants (length, bounds, kind mapping). They'll never fail at runtime — they're really build-time assertions in disguise. Either move them to a test file, or make them genuinely runtime (e.g. detect stale agents, dropped events, progress regressions, status transitions that violate the state machine).

**2. Status state machine is implicit**
An agent can jump `idle → success → running → idle` and nothing complains. Define legal transitions (`idle → running → success|error`, `error → running` on retry) and validate them in the reducer. This is also where smoke checks would earn their keep.

**3. Progress logic is brittle**
`Math.min(agent.progress + 24, 88)` for non-success events caps at 88 forever if `success` never fires. And `success` always slams to 100 regardless of prior progress. Better: progress should be authored per-event, or interpolated based on milestone position in the plan.

**4. `restart()` doesn't actually restart cleanly**
It resets `cursorRef`, `agents`, `events`, but if `isRunning` was already true the existing interval keeps ticking with the old closure briefly. Low-impact, but worth a `setIsRunning(false)` → next-tick `setIsRunning(true)` to be safe.

**5. Two unused imports**
`framer-motion`'s `motion` is used, but check the bundle — `gsap` is used only for the data-flow line (one tween). You could replace it with a CSS `@keyframes` `stroke-dashoffset` animation and drop the dependency entirely.

**6. Accessibility gaps**
- The "Run Again / Runtime Active" button toggles meaning but has no `aria-pressed` or `aria-live` region announcing state.
- Live timeline updates aren't announced to screen readers — wrap in `aria-live="polite"`.
- Color-only status (cyan/emerald/pink dots) — add text labels everywhere or `aria-label` on the dot.
- Icon SVGs have `ariaHidden` (camelCase) which React passes through but isn't a real attribute. Should be `aria-hidden`.

**7. `IconName` type duplication**
`IconName` enum + `paths` record + `agentIconMap` all reference the same set. One source of truth (an `icons` object) would tighten this and let TS infer `IconName` automatically.

**8. Layout: `grid-cols-[76px_1fr]` for timestamps will truncate**
On narrower viewports the timestamp column squeezes the title. Use `auto 1fr` or stack on mobile.

**9. Performance: `useSimulatedAgentRuntime` re-renders all 6 cards every 1.7s**
Each event update triggers a top-level state change → all `AgentCard` instances reconcile. `motion.div layout` makes that more expensive than necessary. Memoize `AgentCard` on `agent.id + agent.progress + agent.status + agent.lastEvent`.

**10. Backend blueprint is aspirational filler**
It promises Supabase/Socket.IO but the component is pure simulation. Either gate it behind a "Reference architecture" disclosure, or wire even a fake WebSocket so the panel reflects something real.

## Suggestions (ranked)

| # | Suggestion | Impact | Effort |
|---|---|---|---|
| 1 | Define agent state machine + validate transitions | High | Low |
| 2 | Make smoke checks genuinely runtime (transition violations, event drops) | High | Med |
| 3 | Drop `gsap` for CSS keyframes | Med | Low |
| 4 | Memoize `AgentCard`; throttle re-renders | Med | Low |
| 5 | A11y pass: `aria-live`, `aria-pressed`, fix `ariaHidden` | High | Low |
| 6 | Per-event authored progress instead of `+24` heuristic | Med | Med |
| 7 | Single icon registry → derive `IconName` | Low | Low |
| 8 | Replace BackendBlueprint with real (or convincingly faked) realtime | Med | High |

Want me to apply any of these? I'd suggest starting with **#1, #2, #5** as one pass — they tighten correctness without changing the visual design.

## User

approved

## Assistant

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Applied:

- **State machine** — `LEGAL_TRANSITIONS` graph in `state.jsx`; the runtime hook validates every status change and logs illegal ones.
- **Runtime smoke checks** — now check live state: transition legality, progress monotonicity, dropped events, plus the prior structural invariants. The "All passing / N failing" pill reflects actual runtime conditions.
- **A11y pass** — `aria-pressed` on toggle, `aria-live="polite"` on the timeline + stat counters + smoke status pill, `role="progressbar"` with `aria-valuenow`, fixed `aria-hidden` casing on icons + decorative backgrounds, skip-to-content link, semantic `<ol>` for the architecture strip, and a `StatusDot` component that always carries a screen-reader label.

Bonus: dropped `gsap` for a CSS keyframe (and framer-motion turned out to be the source of the spurious key warnings, so it's gone too — replaced with CSS transitions). Pause/Resume + Restart split into two buttons since they were doing different things.

