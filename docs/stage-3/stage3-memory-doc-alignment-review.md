# Stage 3 Memory Doc Alignment Review

## Verdict
PASS

## Summary
Within the requested review set, the remaining Stage 3 Memory documentation blocker is resolved. `docs/MEMORY_SPEC.md` and `docs/MEMORY_UI_SPEC.md` now match the Stage 3 baseline defined by `docs/stage-3/product-logic.md`, `docs/stage-3/data-contract.md`, `src/contracts/memory.ts`, and the current `/memory` runtime surface in `app/memory/page.tsx`.

## Verified Alignment
- Stage 3 Memory supports `Agree`, `Disagree`, and `Hide`.
- Stage 3 does not expose a user-facing Delete memory action in the checked docs or runtime page.
- `Hide` is explicitly defined as different from `Delete`.
- `Hide` marks the memory as hidden.
- `Hide` excludes the memory from personalization.
- Hidden memory is defined as ineligible for Talk, Sleep, and Home influence.

## Evidence
- `docs/MEMORY_SPEC.md` now states that Stage 3 per-memory feedback is limited to `Agree`, `Disagree`, and `Hide`, that `Hide` must set `status = "hidden"` and `exclude_from_personalization = true`, that `influenceWeight = 0` applies when the upstream canonical field exists, and that hidden memories must not be used by Talk, Sleep, or Home personalization or CTA generation.
- `docs/MEMORY_UI_SPEC.md` now limits lightweight local actions to `Agree / Disagree / Hide`, states that `Hide` is an exclusion action rather than delete, and explicitly forbids a user-facing Delete CTA for Stage 3 Memory UI.
- `docs/stage-3/data-contract.md` defines canonical `MemoryFeedback.action` as `"agree" | "disagree" | "hide"` and requires `hide` to set `MemoryItem.status = "hidden"` and `excludeFromPersonalization = true`; hidden or contradicted memory must not influence Home, Talk, Sleep, or Room personalization.
- `docs/stage-3/product-logic.md` defines the Stage 3 Memory rule set as `Agree / Disagree / Hide`, states that V1 does not do Delete, and specifies `Hide` updates: `status = "hidden"`, `influenceWeight = 0`, `excludeFromPersonalization = true`, and `hiddenAt = now()`.
- `src/contracts/memory.ts` exposes canonical `MemoryFeedbackAction = "agree" | "disagree" | "hide"` and `MemoryItem` fields including `influenceWeight`, `status`, `excludeFromPersonalization`, and `hiddenAt`.
- `app/memory/page.tsx` exposes `Agree`, `Disagree`, and `Hide` controls, filters hidden items out of the displayed list, and applies `status: "hidden"` plus `exclude_from_personalization: true` when `Hide` is triggered.

## Static Check Results
- `npm run type-check`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS

## Conclusion
The specific blocker recorded in `docs/stage-3/stage3-completeness-audit-postfix.md` is resolved. Based on the requested files, no active Memory source document still conflicts with the Stage 3 baseline.
