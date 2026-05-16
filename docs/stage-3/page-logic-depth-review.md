# Stage 3 Page Logic Depth Review

## Verdict

PASS WITH FOLLOW-UP

## Summary

The expanded non-Home page-logic docs are safe to merge before Stage 4 implementation.

They do not match `docs/stage-3/page-logic/home.md` in length, but they now provide enough implementation-facing depth for Stage 4 workers to preserve Stage 3 data boundaries, canonical type names, route handoffs, hidden-memory exclusion, and forbidden behavior.

The remaining issues are cleanup-grade source wording and naming hygiene. They do not require blocking this branch, but they should be cleaned up before or during Stage 4 worker onboarding to reduce ambiguity.

## Home Depth Comparison

Home remains the deepest page-logic document and includes a fuller product-logic treatment of page state, recommendation rules, fallbacks, and cross-page ownership.

The non-Home docs are shorter but sufficiently aligned with Home's implementation-readiness pattern. Each reviewed non-Home doc now covers:

- document role and source priority
- page role / page definition
- Stage 3 contract bridge responsibility
- canonical contract dependencies
- data reads and writes
- runtime / mock / local data boundary where relevant
- user actions and data effects
- entry conditions
- exit or navigation payload expectations
- cross-page effects
- forbidden behavior
- review / acceptance checklist

The non-Home docs do not always use separate headings for non-goals, lifecycle / state rules, fallback states, or Stage 4 implementation notes. That is acceptable for merge because the required constraints are present in the read/write, entry/exit, cross-page, forbidden behavior, and acceptance sections. A later polish pass could add explicit heading parity, but line-count parity with Home is not required.

## Confirmed Alignment

- `OnboardingPreset` is the canonical Stage 3 term. `OnboardingSessionPreset` appears only in historical or compatibility context outside the expanded non-Home page-logic docs.
- `SleepLog`, `TalkSession`, and `MemoryFeedback` remain canonical. The reviewed page-logic docs do not introduce `SleepCheckIn`, `CompanionConversation`, or `MemoryFeedbackEvent` as active canonical types.
- No new canonical Stage 3 type is introduced by the expanded page-logic docs.
- Onboarding uses `OnboardingDraft` and `OnboardingPreset`, does not create long-term profile data, does not create `MemoryItem`, does not create `TalkSession`, does not create `RoomSession`, does not directly start Talk, and does not rank, reorder, preselect, recommend, or auto-highlight rooms.
- Active onboarding route handoff is constrained to active and unexpired presets in the expanded Onboarding and Room docs.
- Room keeps the `RoomOption` list fixed, keeps `RoomView` and `RoomSession` distinct, creates `RoomView` on page view, and creates `RoomSession` only on user room selection.
- Room may carry the full active `OnboardingPreset` into `TalkEntryContext`; it does not use onboarding to personalize room options.
- Talk uses `TalkEntryContext`, preserves `TalkSession`, and describes idempotent `MemoryExtractionRun` behavior, including skip behavior for `userMessageCount = 0` and prevention of duplicate completed runs.
- Talk excludes hidden Memory from personalization and does not claim real LLM completion.
- Memory keeps visible Memory distinct from personalization-eligible Memory, supports Agree / Disagree / Hide, and does not expose a user-facing Delete action.
- Hide is not Delete. The Memory doc requires hidden state, `excludeFromPersonalization = true`, and `influenceWeight = 0` only when supported by the existing contract. `src/contracts/memory.ts` does support `influenceWeight`.
- Hidden Memory is excluded from Talk, Sleep, and Home influence.
- Sleep Monitoring uses `SleepLog`, `SleepInsight`, and `SuggestionRuleResult`, preserves data-insufficient behavior, requires traceability to `SleepLog` IDs, excludes hidden Memory, and does not directly read onboarding answers.
- Sleep Monitoring does not introduce medical-grade, wearable, passive monitoring, or clinical diagnosis scope.
- The reviewed docs preserve the Stage 3 separation between root UI specs and Stage 3 data / contract docs.

## Source-of-truth Conflicts

No active conflict was found that would make Stage 4 implementation unsafe.

Cleanup-grade source drift remains:

- `docs/stage-3/page-logic/home.md` still shows an older route snippet that redirects to `/room` when `activeOnboardingPreset.status === "active"` without the explicit `expiresAt > now` check. `docs/stage-3/product-logic.md`, `docs/stage-3/data-contract.md`, and the expanded non-Home docs are stricter and require active plus unexpired.
- `docs/stage-3/data-contract.md` still contains historical source wording that references `OnboardingSessionPreset` from older product language. The canonical contract and current product logic name is `OnboardingPreset`.
- `docs/FIRST_LAUNCH_SPEC.md` and `docs/FIRST_LAUNCH_UI_SPEC.md` still use older `postOnboardingSessionPreset` wording. The expanded Onboarding doc correctly maps Stage 3 page logic to `OnboardingPreset`.
- `docs/SLEEP_SPEC.md` still contains older recommended-room / preselected-room payload wording. Stage 3 data-contract and page-logic docs govern data lifecycle and routing payloads, so Stage 4 workers should not invent new recommended-room DTOs from the root Sleep spec.
- `docs/stage-3/page-logic/talk.md` uses the phrase "Memory candidates" as prose. It does not introduce the forbidden canonical `MemoryCandidate` type, but this wording should be tightened later to `MemoryItem` to avoid confusion.

## Remaining Blockers

None.

## Non-blocking Follow-up

- Add explicit non-goals, lifecycle / state, fallback / defensive-state, and Stage 4 implementation-note headings to the non-Home docs if strict structural parity with Home becomes desirable.
- Refresh older first-launch wording from `postOnboardingSessionPreset` to `OnboardingPreset` where the documents are discussing Stage 3 data contracts rather than UI copy.
- Tighten the Talk prose from "Memory candidates" to `MemoryItem`.
- Clarify the Sleep root spec's recommended-room wording against the canonical Stage 3 `SleepInsight`, `SuggestionRuleResult`, `RoomView`, and `RoomSession` contracts.
- Update stale local file links in `docs/stage-3/data-contract.md` source-priority notes if those links are intended to be clickable in this repository.

## Forbidden Logic Findings

No active forbidden Stage 3 behavior remains in the reviewed expanded page-logic docs.

Forbidden terms and old concepts appear only as prohibition text, historical review notes, or legacy migration compatibility:

- `MemoryCandidate` appears in Stage 3 product / review docs only as a forbidden or historical concept.
- `deleteMemory` and user-facing Delete Memory appear only as forbidden behavior.
- `OnboardingSeedSignal`, `onboarding_start_talk_click`, and `onboarding_talk_enter_success` appear only as forbidden or historical review terms.
- Onboarding-driven room recommendation, ranking, reordering, preselection, and auto-highlight are explicitly forbidden.
- Sleep suggestion directly reading onboarding answers is explicitly forbidden.
- Hidden Memory personalization is explicitly forbidden for Talk, Sleep, and Home.
- Medical-grade sleep tracking, wearable claims, passive monitoring claims, fake backend completion claims, and fake real LLM completion claims are not active guidance.

## Static Check Results

- `npm run type-check`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS

## Merge Recommendation

This branch is safe to merge into `stage3/core-data-integration-v04`.

Stage 4 implementation workers can use the expanded non-Home page-logic docs without needing to invent new types, duplicate page-local canonical models, reintroduce Delete Memory behavior, mix UI specs with data contracts, or add premature backend / API / DTO / database scope.
