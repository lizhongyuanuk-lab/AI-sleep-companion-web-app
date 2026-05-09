# Stage 3 Contract Implementation Notes

## Source-of-truth docs used

- `docs/stage-3/product-logic.md`
- `docs/stage-3/page-logic/home.md`
- `docs/stage-3/data-flow-audit.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`

## Mapping summary

- `RouteDecision`
  - Mapped from canonical app-entry routing in `docs/stage-3/data-contract.md`, including stale preset handling and canonical `"/home"` rather than runtime `"/"`.
- `HomeState`
  - Mapped to the local contract’s simplified top-level Home render states: `entry_guard_redirect`, `recommendation_ready`, and `fallback_ready`, with optional `continuitySource` and non-visual `diagnosticsNavTargets`.
- `HomeEntryContext`
  - Mapped with route trace, source recommendation trace, `latestSleepCheckInId`, `eligibleMemoryId`, `missingDataKeys`, `staleDataKeys`, and active preset state.
- `HomeRecommendation`
  - Mapped as the only active recommendation domain, with `source`, `sourceId`, `sourceDomain`, `surface`, `fallbackKind`, and one linked CTA.
- `Onboarding`
  - Mapped through `OnboardingState` and `OnboardingPreset` with completion state, active/consumed/expired lifecycle, and stale-as-derived behavior.
- `Room`
  - Mapped across `RoomOption`, `RoomView`, `RoomSession`, and `RoomState` so room catalog, entry exposure, selected-room session, and continuity state remain separate.
- `SleepCheckIn`
  - Mapped as the canonical morning check-in object backing `SleepLog` semantics, with lightweight `SleepSession` and `SleepInsight` continuity support.
- `MemoryItem`
  - Mapped with canonical persisted statuses plus `excludeFromPersonalization`, and with `MemoryFeedbackEvent` for auditable agree/disagree/hide history.
- `Conversation/Talk`
  - Mapped through `TalkEntryContext`, `CompanionConversation`, and `ConversationMessage`, keeping session/message/memory separate and preserving handoff traceability.

## Skeleton-only boundaries

This worker implemented contracts and mock data only.

It did not implement:

- runtime routing
- UI behavior
- persistence
- API calls
- recommendation algorithms
- memory scoring
- runtime storage adapters

## Known implementation notes

- Current runtime root `"/"` is treated only as a compatibility surface; canonical Home remains `"/home"`.
- `Recommendation` exists only as an alias to `HomeRecommendation`.
- `HomeCTA` follows the current local canonical contract where normal Stage 3 Home handoff targets Talk only.
- `blocked`, `expired`, and `disagreed` are not persisted `MemoryItem.status` values. They are represented only as derived exclusion scenarios or feedback history.
- The local data contract uses `MemoryFeedbackEvent`; this skeleton follows that canonical shape rather than inventing a separate runtime-only feedback model.

## Validation

Commands run:

- `npm run lint`
- `npm run build`

Results:

- `npm run lint`: failed
  - Error: `Cannot find package 'eslint-config-next' imported from .../eslint.config.mjs`
  - Assessment: this is a pre-existing workspace/dependency-resolution issue, not caused by the contract or mock files added here.
- `npm run build`: failed
  - Error: `next: command not found`
  - Assessment: this is a pre-existing environment/dependency availability issue, not caused by the contract or mock files added here.
