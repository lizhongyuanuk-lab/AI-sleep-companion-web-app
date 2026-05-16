# Stage 3 Page Logic: Talk

## 1. Document Role

This document is a Stage 3 data-flow and contract bridge for the Talk page.

It does not replace `docs/SPEC.md` or `docs/TALK_UI_SPEC.md`. Those root specs remain the authority for Talk page UX, visual behavior, layout, and copy. This document only defines how Talk participates in the Stage 3 data contract, routing, memory extraction lifecycle, cross-page effects, and forbidden logic.

If a UI detail appears to conflict with this document, follow the root Talk specs. If a data contract or lifecycle detail appears to conflict, follow `docs/stage-3/data-contract.md` and `src/contracts`.

## 2. Page Role in Stage 3

Talk is the core conversation surface. It consumes a `TalkEntryContext`, creates or updates a `TalkSession`, and may trigger an idempotent `MemoryExtractionRun` when the session ends.

## 3. Primary Source Specs

- `docs/SPEC.md`
- `docs/TALK_UI_SPEC.md`
- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`

## 4. Canonical Contract Dependencies

Talk may use these existing Stage 3 contract concepts:

- `TalkEntryContext`
- `TalkSession`
- `RoomSession`
- `OnboardingPreset`
- `MemoryExtractionRun`
- `MemoryItem`
- `ProductEvent`

This document does not introduce new canonical type names.

## 5. Data Read

Talk may read:

- `TalkEntryContext`
- active `RoomSession` information if included in the entry context
- full active `OnboardingPreset` if included in the entry context
- eligible non-hidden Memory data if Stage 3 personalization uses Memory context
- local mock conversation data if real LLM integration is not in scope

Talk must not read hidden Memory as personalization context.

## 6. Data Write

Talk may write:

- `TalkSession`
- session message / turn metadata where represented by the existing contracts
- `MemoryExtractionRun` when the Talk session ends
- `MemoryItem` only through the defined memory extraction flow
- optional Talk-related `ProductEvent` entries

Talk must not write:

- `SleepLog`
- `SleepInsight`
- `HomeRecommendation`
- new onboarding profile data

## 7. Entry Conditions

The user enters Talk through a valid `TalkEntryContext`.

Valid Talk entry may come from:

- Room selection after onboarding / room flow
- Home primary CTA into Talk
- other explicitly supported Stage 3 Talk entry points

Talk should not reconstruct a different onboarding preset from `onboardingPresetId` if the full preset was already passed in the entry context.

## 8. Exit / Navigation Payload

When Talk ends:

- update or close `TalkSession`
- evaluate whether `MemoryExtractionRun` should start
- skip memory extraction if `userMessageCount = 0`
- avoid duplicate completed extraction runs for the same `TalkSession`

Talk may route the user to Memory, Home, or another supported page according to existing page specs, but it must not invent a new post-talk product flow.

## 9. User Actions

- Starting Talk creates or resumes `TalkSession`.
- Sending user messages updates the session message count / session state according to existing contracts.
- Ending Talk may trigger `MemoryExtractionRun`.
- If extraction succeeds, a `MemoryItem` may be created.
- If extraction fails, retry behavior must create a new run rather than duplicating a completed run.

## 10. Cross-page Effects

Talk can create Memory candidates only through the canonical `MemoryExtractionRun` lifecycle.

Created Memory can later affect Talk, Sleep, or Home only if it is not hidden and is eligible for personalization.

Talk must respect hidden Memory exclusion.

## 11. Forbidden Behavior

Talk must not:

- directly use hidden Memory for prompt or personalization context
- create duplicate completed `MemoryExtractionRun` records for the same `TalkSession`
- extract Memory from sessions with `userMessageCount = 0`
- reconstruct a different onboarding preset using only `onboardingPresetId`
- invent real LLM completion claims
- add backend, API, database, auth, or payment scope
- create Sleep logs or medical tracking output

## 12. Acceptance Checks

A review worker should verify:

- Talk uses `TalkEntryContext`.
- Talk creates or updates `TalkSession`.
- Talk end may trigger idempotent `MemoryExtractionRun`.
- Extraction skips when `userMessageCount = 0`.
- Duplicate completed extraction runs are prevented.
- Hidden Memory does not influence Talk.
- Talk does not reconstruct a different onboarding preset from `onboardingPresetId`.
- No new canonical type names are introduced by this page logic.
