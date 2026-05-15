# Stage 3 Final Baseline Review

## Verdict
PASS WITH FOLLOW-UP

## Completion Decision
Stage 3 can enter page implementation from the current branch HEAD.

The canonical Stage 3 source docs, contract layer, mock layer, and local data helper layer are coherent enough to serve as the implementation baseline. The remaining issues found in this review are cleanup-only and do not make page implementation unsafe.

## Confirmed Evidence
- The required Stage 3 source set exists and is reviewable: `docs/stage-3/product-logic.md`, `docs/stage-3/data-contract.md`, `docs/stage-3/acceptance-checklist.md`, `docs/stage-3/data-flow-audit.md`, `docs/stage-3/page-logic/home.md`, `docs/stage-3/stage3-baseline-consistency-fix.md`, `docs/stage-3/stage3-completeness-audit-postfix.md`, `docs/stage-3/stage3-memory-doc-alignment-review.md`, `src/contracts/`, `src/mocks/stage3MockData.ts`, and `src/data/stage3/`.
- The required canonical Stage 3 contract objects are present in `src/contracts` and available through `src/contracts/index.ts`, including `OnboardingDraft`, `OnboardingContextCard`, `RoomView`, `RoomSession`, `TalkEntryContext`, `TalkSession`, `MemoryExtractionRun`, `MemoryItem`, `MemoryFeedback`, `SleepLog`, `SleepInsight`, `SuggestionRuleResult`, `HomeRecommendation`, and `ProductEvent`.
- The previous missing-object blocker remains resolved: the contract and mock layers now include concrete fixtures for `OnboardingDraft`, `OnboardingContextCard`, `MemoryExtractionRun`, `SuggestionRuleResult`, and `ProductEvent`.
- The previous Home CTA blocker remains resolved: the canonical Home CTA contract in `src/contracts/home.ts` targets `Talk` only, and the Stage 3 Home mock recommendations all hand off through `TalkEntryContext` into `/talk`.
- The previous naming-drift blocker remains resolved for the names explicitly normalized by the fix: `SleepLog`, `TalkSession`, and `MemoryFeedback` are the active names across docs, contracts, mocks, and local Stage 3 data helpers.
- The previous Memory Delete blocker remains resolved: the active Memory docs now limit Stage 3 feedback to `Agree / Disagree / Hide`, the UI spec explicitly forbids a user-facing Delete CTA, and `app/memory/page.tsx` exposes `Agree`, `Disagree`, and `Hide` only.
- Hide behavior remains resolved correctly: `docs/MEMORY_SPEC.md` and `docs/MEMORY_UI_SPEC.md` require Hide to exclude the item from personalization, `src/contracts/memory.ts` models `excludeFromPersonalization`, `src/data/stage3/selectors.ts` excludes such items from eligible memory continuity, and the Memory page mock state marks hidden items with `exclude_from_personalization = true`.
- The required Stage 3 flows are explainable from docs plus contracts plus mocks:
  new user resolves to onboarding, active preset resolves to room, Room view and Room session are modeled separately, Room -> Talk carries `TalkEntryContext`, Talk completion links to `MemoryExtractionRun`, Memory feedback supports `agree / disagree / hide`, Sleep check-in is modeled as `SleepLog`, `SleepInsight.basedOn.sleepLogIds` is canonical, and Home carries one traceable recommendation with one CTA into Talk.
- The forbidden logic search did not find active Stage 3 implementation of `MemoryCandidate`, `deleteMemory`, `OnboardingSeedSignal`, `onboarding_start_talk_click`, or `onboarding_talk_enter_success` in `src/contracts`, `src/mocks`, `src/data/stage3`, or active route code. Matches found in docs are explicit prohibitions, not active product logic.
- The Stage 3 layering is clear enough to implement against:
  `src/contracts` holds canonical Stage 3 contract shapes, `src/mocks/stage3MockData.ts` holds contract-shaped mock scenarios, `src/data/stage3` holds local defaults/selectors/migration/storage helpers, and the current baseline does not require backend DTOs, Gin handlers, use cases, repositories, or database models yet.
- App route files do not define duplicate canonical Stage 3 type names. Existing runtime page-specific mock types remain outside the Stage 3 contract layer and do not override it.

## Remaining Blockers
- None.

## Non-blocking Follow-up
- `docs/stage-3/data-flow-audit.md` still contains stale pre-fix commentary, including old runtime-delete wording and an outdated note that the canonical onboarding preset naming is still unresolved.
- Exact first-session preset name parity is still partial: `product-logic.md` uses `OnboardingSessionPreset`, while the contract/mocks/local data layers consistently use `OnboardingPreset` for that same session-scoped object. The semantic mapping is clear enough to proceed, but a literal alias or naming cleanup would reduce worker confusion.
- Existing runtime pages still rely on legacy page-local mock/state modules outside the new Stage 3 local data foundation. That is expected before page implementation starts, but the implementation phase should migrate toward `src/contracts` and `src/data/stage3` rather than treat old page-local runtime shapes as canonical.

## Static Check Results
- `npm run type-check`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS

## Recommendation
This branch can be used as the Stage 3 implementation baseline.

Page implementation should use `docs/stage-3/product-logic.md` as the primary Stage 3 truth, `docs/stage-3/page-logic/home.md` as the secondary Home-specific truth, and `src/contracts/*` plus `src/data/stage3/*` as the implementation-facing baseline. The follow-up items above should be cleaned up, but they do not block implementation kickoff.
