# Stage 3 Page Logic: Onboarding

## 1. Document Role

This document is a Stage 3 data-flow and contract bridge for the Onboarding / First Launch flow.

It does not replace `docs/FIRST_LAUNCH_SPEC.md` or `docs/FIRST_LAUNCH_UI_SPEC.md`. Those root specs remain the authority for page-level UX, visual behavior, and copy. This document only defines how the Onboarding flow participates in the Stage 3 data contract, routing, cross-page lifecycle, and forbidden logic.

If a UI detail appears to conflict with this document, follow the root page specs. If a data contract or lifecycle detail appears to conflict, follow `docs/stage-3/data-contract.md` and `src/contracts`.

## 2. Page Role in Stage 3

Onboarding collects the short first-launch answers needed to create a temporary `OnboardingPreset`. It prepares the first Room and Talk entry context without creating a long-term profile, memory item, room recommendation, sleep suggestion, or direct Talk session.

## 3. Primary Source Specs

- `docs/FIRST_LAUNCH_SPEC.md`
- `docs/FIRST_LAUNCH_UI_SPEC.md`
- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`

## 4. Canonical Contract Dependencies

Onboarding may use these existing Stage 3 contract concepts:

- `OnboardingDraft`
- `OnboardingPreset`
- `OnboardingContextCard`
- `ProductEvent`

This document does not introduce new canonical type names.

## 5. Data Read

Onboarding may read:

- the current `OnboardingDraft`, if one exists
- whether the user has completed onboarding
- whether an active and unexpired `OnboardingPreset` already exists
- static onboarding question / answer configuration from the relevant page spec or local data source

Onboarding must not read Memory, Sleep, Home recommendation, or Talk session data as part of first-launch answer collection.

## 6. Data Write

Onboarding may write:

- `OnboardingDraft` while the user is answering onboarding questions
- `OnboardingPreset` when onboarding is completed
- optional onboarding-related `ProductEvent` entries if Stage 3 analytics are active

Onboarding must not write:

- `MemoryItem`
- `MemoryFeedback`
- `RoomSession`
- `TalkSession`
- `MemoryExtractionRun`
- `SleepLog`
- `SleepInsight`
- `HomeRecommendation`

## 7. Entry Conditions

The user enters Onboarding when the app entry logic determines that onboarding is incomplete.

Onboarding may also display an in-progress draft if the user has started but not completed the flow.

If onboarding has already been completed and an active and unexpired `OnboardingPreset` exists, routing should send the user to Room through the app entry / route resolver logic, not through a new onboarding action.

## 8. Exit / Navigation Payload

Onboarding completion creates an active `OnboardingPreset`.

After completion, the user should proceed to Room through the Stage 3 entry flow.

Onboarding itself must not directly construct a final Talk session or directly enter Talk.

## 9. User Actions

- Selecting or editing an onboarding answer updates `OnboardingDraft`.
- Completing onboarding creates `OnboardingPreset`.
- Continuing after onboarding leads to Room through the entry logic.

## 10. Cross-page Effects

The active `OnboardingPreset` may be carried forward into Room and then into Talk as part of `TalkEntryContext`.

The preset is session-scoped. It is not a permanent user profile.

Onboarding must not directly influence Sleep suggestions, Memory visibility, Home recommendations, or room ordering.

## 11. Forbidden Behavior

Onboarding must not:

- create a long-term profile object
- create `MemoryItem`
- create `SleepLog`
- create `SleepInsight`
- directly start Talk
- create `TalkSession`
- recommend, rank, reorder, or auto-highlight rooms
- directly influence Sleep suggestions
- imply backend, account, real LLM, wearable, or medical tracking completion

## 12. Acceptance Checks

A review worker should verify:

- Onboarding uses `OnboardingDraft` for in-progress answers.
- Completion creates an active `OnboardingPreset`.
- Onboarding does not create Memory, Sleep, RoomSession, or TalkSession data.
- Onboarding does not directly enter Talk.
- Onboarding does not recommend or reorder rooms.
- Active preset routing to Room is handled by entry / route logic.
- No new canonical type names are introduced by this page logic.
