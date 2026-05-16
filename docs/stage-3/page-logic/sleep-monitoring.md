# Stage 3 Page Logic: Sleep Monitoring

## 1. Document Role

This document is a Stage 3 data-flow and contract bridge for the Sleep Monitoring page.

It does not replace `docs/SLEEP_SPEC.md` or `docs/SLEEP_UI_SPEC.md`. Those root specs remain the authority for Sleep page UX, visual behavior, layout, and copy. This document only defines how Sleep Monitoring participates in the Stage 3 data contract, insight lifecycle, suggestion rules, cross-page effects, and forbidden logic.

If a UI detail appears to conflict with this document, follow the root Sleep specs. If a data contract or lifecycle detail appears to conflict, follow `docs/stage-3/data-contract.md` and `src/contracts`.

## 2. Page Role in Stage 3

Sleep Monitoring collects user-entered sleep check-in data as `SleepLog`, derives `SleepInsight` from existing SleepLog IDs, and may produce a suggestion through `SuggestionRuleResult` according to Stage 3 rules.

## 3. Primary Source Specs

- `docs/SLEEP_SPEC.md`
- `docs/SLEEP_UI_SPEC.md`
- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`

## 4. Canonical Contract Dependencies

Sleep Monitoring may use these existing Stage 3 contract concepts:

- `SleepLog`
- `SleepInsight`
- `SuggestionRuleResult`
- `MemoryItem`
- `ProductEvent`

This document does not introduce new canonical type names.

## 5. Data Read

Sleep Monitoring may read:

- previous `SleepLog` records
- existing `SleepInsight` records
- eligible non-hidden Memory data only if Stage 3 rules allow it for suggestion context
- local mock Sleep data when real backend persistence is not in scope

Sleep suggestion logic must not directly read onboarding answers.

Sleep must not read hidden Memory for suggestion or personalization context.

## 6. Data Write

Sleep Monitoring may write:

- `SleepLog`
- `SleepInsight`
- `SuggestionRuleResult`, if represented as a stored or derived Stage 3 object
- optional Sleep-related `ProductEvent` entries

Sleep Monitoring must not write:

- `OnboardingPreset`
- `RoomSession`
- `TalkSession`
- `MemoryExtractionRun`
- `HomeRecommendation` directly unless the existing Stage 3 Home flow explicitly derives from a Sleep source

## 7. Entry Conditions

The user may enter Sleep Monitoring through supported app navigation or page-specific CTA behavior.

Sleep Monitoring does not require an active onboarding preset.

Sleep check-ins should be interpreted as user-entered information, not passive automatic tracking.

## 8. Exit / Navigation Payload

Sleep Monitoring may link to a suggestion CTA if defined by existing Sleep specs and Stage 3 rules.

Any suggestion CTA must remain traceable to its source data, especially relevant `SleepLog` IDs where `SleepInsight` is involved.

## 9. User Actions

- Entering sleep data creates or updates `SleepLog`.
- Submitting enough Sleep data may generate or update `SleepInsight`.
- Suggestion logic may produce `SuggestionRuleResult`.
- User navigation from a suggestion must preserve source traceability where defined by the contract.

## 10. Cross-page Effects

Sleep insights or suggestions may influence Home recommendation only through a traceable Stage 3 source path.

Sleep data must not directly rewrite onboarding, room ordering, Talk sessions, or Memory feedback.

If Sleep uses Memory context, hidden Memory must be excluded.

## 11. Forbidden Behavior

Sleep Monitoring must not:

- claim medical-grade sleep tracking
- imply passive automatic sleep monitoring
- imply wearable integration unless explicitly marked as future scope
- directly read onboarding answers for Sleep suggestion logic
- use hidden Memory for suggestion or personalization context
- create Talk sessions directly
- create Memory extraction runs directly
- imply backend, database, real API, or clinical diagnosis completion

## 12. Acceptance Checks

A review worker should verify:

- Sleep Monitoring writes `SleepLog`.
- `SleepInsight` is based on `SleepLog` IDs.
- Suggestion logic may use `SuggestionRuleResult`.
- Sleep suggestion does not directly read onboarding answers.
- Hidden Memory does not influence Sleep.
- Sleep does not claim medical-grade tracking.
- Sleep does not imply wearable or passive automatic monitoring.
- No new canonical type names are introduced by this page logic.
