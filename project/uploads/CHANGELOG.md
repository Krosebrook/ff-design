# Agent System Changelog

## v4.0.0 — 2026-05-08
**Author:** Kyle Rosebrook (with Claude)

### Changed (vs v3.0.0 design)
- All 16 agent files now instantiated as `.agent.md` files (v3 had 4/16)
- Hard boundaries are specific and enforceable, not aspirational
- Every agent has explicit YAML `permissions: { read, write, execute }`
- Every agent has a "Self-check before responding" section
- Frameworks now have phase tables with concrete actions, not just acronym definitions

### Added
- INTEGRATION_MATRIX.md with full 16x16 coordination grid
- Per-agent escalation paths in YAML frontmatter
- Idempotency requirements on Improve/quality-lock patterns
- EU AI Act tier classification in Ethica
- ISO 42001 Q3 2026 target in Prime

### Removed
- Vague "production-ready" claims without specifics
- "RLS Validator" and other named-but-undefined agents from v2 list

### Migration from v3 design
The v3.0.0 README/DELIVERY-SUMMARY documented all 16 agents as "complete" but only 4 files were actually written before session compaction. v4 instantiates the missing 12 fresh, using the v3 design as a contract.

## v3.0.0 — 2025-12-27 (design only)
- 16-agent architecture designed
- Master README + DELIVERY-SUMMARY written
- 4 of 16 agent files instantiated before session compaction
- Status corrected from "✅ COMPLETE" to "design only"

## v2.x — deprecated
Initial agent concepts. Superseded.

## v1.x — deprecated
Prototype phase. Superseded.
