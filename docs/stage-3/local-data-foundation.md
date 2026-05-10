# Stage 3 Local Data Foundation

## Purpose

This document records the Worker E local-first storage skeleton for Stage 3.

It creates a reusable, browser-safe data foundation for canonical Stage 3 contract objects without wiring that foundation into routes, UI components, or backend APIs.

## Source docs used

- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/data-flow-audit.md`
- `docs/stage-3/acceptance-checklist.md`
- `docs/stage-3/contract-implementation-notes.md`
- `docs/stage-3/page-logic/home.md`
- `src/contracts/*`
- `src/mocks/stage3MockData.ts`

## Files created

- `src/data/stage3/keys.ts`
- `src/data/stage3/defaults.ts`
- `src/data/stage3/storage.ts`
- `src/data/stage3/migration.ts`
- `src/data/stage3/selectors.ts`
- `src/data/stage3/index.ts`
- `docs/stage-3/local-data-foundation.md`

## LocalStorage key strategy

- Keys are namespaced under `ai-companion-web.stage3.local-data.v1`.
- Storage is split by stable state domain instead of using one untyped blob:
  - `user-profile`
  - `onboarding`
  - `home`
  - `conversation`
  - `memory`
  - `sleep`
  - `room`
  - `migration`
- Legacy runtime keys such as `ai-companion-web.first-launch.completed` and `ai-companion-web.first-launch.preset` are treated as migration inputs only.
- Current runtime localStorage naming is not reused as the canonical Stage 3 storage model.

## Default state strategy

- Defaults are created through factory functions, not shared mutable objects.
- First-launch-safe defaults are used:
  - guest-style `UserProfile`
  - `hasCompletedOnboarding = false`
  - `OnboardingState.status = "not_started"`
  - no active preset
  - no assumed continuity data
  - no assumed recommendation snapshot
- A safe system-default Home recommendation helper exists, but the composite default app state does not pretend that a recommendation snapshot has already been exposed.

## Safe parse/stringify behavior

- `storage.ts` never touches `window` or `localStorage` at module import time.
- `readJson()` returns the caller’s fallback on missing or malformed JSON.
- `writeJson()` and `removeKey()` fail closed and return booleans instead of throwing technical errors into UI.
- `clearStage3LocalData()` clears only Stage 3 keys by default, with optional legacy-key cleanup for dev/reset scenarios.

## Migration/version behavior

- Canonical contract version stays `stage3-canonical-v1`.
- Local storage metadata uses `STAGE3_LOCAL_DATA_VERSION = 1`.
- Missing version metadata triggers normalization/migration.
- Future-version local data fails closed to safe defaults instead of attempting a downgrade.
- Legacy first-launch migration currently maps:
  - completion flag
  - onboarding preset
- Legacy preset migration normalizes runtime enum names into canonical Stage 3 contract names and derives `expiresAt` from the legacy preset creation time plus the documented 30-minute TTL.
- `stale` remains derived behavior, not a persisted onboarding preset status.

## Selectors

Selectors are read-only and intentionally lightweight:

- `isFirstLaunch`
- `hasCompletedOnboarding`
- `hasActivePreset`
- `getRouteDecision`
- `getHomeEntryContext`
- `getPrimaryHomeRecommendation`
- `getHomeCTA`
- `getEligibleVisibleMemory`
- `getLatestSleepCheckIn`
- `getRoomContinuity`
- `getConversationContinuity`
- `getMissingDataKeys`
- `getStaleDataKeys`

Derived selector rules stay within accepted contract behavior:

- route decision follows canonical `/onboarding -> /room -> /home` gating
- memory eligibility uses `status + excludeFromPersonalization`
- active preset staleness is derived from `expiresAt`
- Home selectors do not carry transcript payloads
- stale sleep/memory thresholds are not invented here beyond explicit contract-safe derivations

## SSR/browser-safety rules

- No browser APIs are read at import time.
- All storage access is gated through runtime checks.
- The module can be imported during SSR, `npm run build`, or `npm run type-check` without requiring `window`.

## What is intentionally not implemented

- route wiring into `/`, `/onboarding`, `/room`, `/talk`, `/memory`, or `/sleep-monitoring`
- React hooks or component integration
- backend sync
- API routes
- auth ownership merge
- recommendation ranking beyond safe selector fallback
- room/scene UI preference migration
- message transcript persistence

## Future UI integration boundary

- Future route/page work can call `loadStage3State()`, `saveStage3State()`, and the selectors from this foundation.
- UI code should treat the data layer as the storage/derivation boundary rather than re-creating ad hoc localStorage helpers.
- Home, Room, Talk, Memory, and Sleep integrations should keep using canonical contract types from `src/contracts/`.

## Future backend/API boundary

- The storage model keeps persistent, session-scoped, and derived snapshot domains separate so later backend adapters can replace local storage without changing page-level contract names.
- This worker does not claim the local storage schema is the final backend schema.
- Migration metadata is local-only and does not redefine the canonical Stage 3 contract.

## Validation results

Validation was deferred until after implementation.

Worker E should run:

- `git status --short`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`
- `npm run lint`
- `npm run type-check`
- `npm run build`

## E unlock / next steps

- Run Worker E validation and scope check.
- Run Worker E source trace review against the created files.
- If review passes, Worker E can create the single local commit requested by the task.
