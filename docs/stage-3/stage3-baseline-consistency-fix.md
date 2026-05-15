# Stage 3 Baseline Consistency Fix

## Blockers Fixed

- Added the missing canonical Stage 3 contract exports in `src/contracts/`:
  - `OnboardingDraft`
  - `OnboardingContextCard`
  - `MemoryExtractionRun`
  - `SuggestionRuleResult`
  - `ProductEvent`
- Normalized Stage 3 canonical naming across contracts, mocks, local data docs, and implementation-facing notes:
  - `SleepLog`
  - `TalkSession`
  - `MemoryFeedback`
- Resolved the Home CTA conflict:
  - normal Stage 3 Home shows one primary recommendation and one primary CTA
  - the primary CTA always enters `Talk`
  - onboarding recovery and active-preset recovery stay in `AppEntryResolver` / entry-guard logic rather than normal Home recommendation types
- Removed Stage 3 user-facing Delete memory behavior from `app/memory/*` and replaced it with local mock `Agree / Disagree / Hide` behavior.
- Updated Stage 3 mocks so they match the corrected contracts and scenarios:
  - hidden memory example keeps `excludeFromPersonalization = true`
  - `SleepInsight.basedOn.sleepLogIds` is canonical
  - Home recommendations keep traceable `source` / `sourceId` unless `system_default`
  - Home CTA payloads hand off to `Talk`

## Canonical Naming Decisions

- `SleepLog` is the canonical morning check-in object name.
- `TalkSession` is the canonical Talk session object name.
- `MemoryFeedback` is the canonical memory feedback object name.
- `RoomEntrySource` stays canonical as:
  - `onboarding`
  - `home`
  - `manual`
  - `memory_cta`
  - `sleep_suggestion`
- Legacy local-storage reads remain only in `src/data/stage3/migration.ts` and are explicitly marked as legacy compatibility.

## Home CTA Decision

- Stage 3 Home is not a Room selection page, dashboard, feed, report page, or multi-card analytics page.
- Normal Home recommendation types remain:
  - `review_memory`
  - `sleep_checkin`
  - `tonight_suggestion`
  - `start_talk`
- Normal Home primary CTA always enters `Talk` through `TalkEntryContext`.
- `complete_onboarding` and active-preset recovery do not remain as normal Home recommendation types; they are handled by `RouteDecision` / entry guard before normal Home render.

## Needs Product Decision

- None identified after this consistency fix.

## Validation Results

- `npm run type-check`: passed
- `npm run lint`: passed
- `npm run build`: passed
