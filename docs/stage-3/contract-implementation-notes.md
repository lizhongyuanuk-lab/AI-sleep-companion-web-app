# Stage 3 Contract Implementation Notes

## Source order

1. `docs/stage-3/product-logic.md` is the P0 product source of truth.
2. `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-contract-spec/docs/stage-3/data-contract.md` is the canonical TypeScript contract source.
3. `docs/stage-3/page-logic/home.md` is the secondary Home-specific reference.
4. Current runtime naming is compatibility-only and is not canonical.

## What this patch implements

- Canonical Stage 3 contracts in `src/contracts/`
- MVP mock data in `src/mocks/stage3MockData.ts`
- No UI wiring
- No runtime route changes
- No storage implementation changes

## Canonical decisions preserved

- Canonical Home route remains `"/home"` even though the current runtime still renders root `"/"` in [app/page.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-skeleton/app/page.tsx).
- `RouteDecision` preserves stale preset handling as a derived state rather than a persisted preset status.
- `HomeEntryContext` includes route trace fields plus `latestSleepCheckInId`, `eligibleMemoryId`, `missingDataKeys`, and `staleDataKeys`.
- `HomeRecommendation` is the only active Stage 3 recommendation contract. `Recommendation` is an alias, not a second domain object.
- `HomeRecommendation.fallbackKind` explicitly models:
  - `system_default_fallback`
  - `data_partial_fallback`
  - `error_safe_fallback`
- `HomeCTA` preserves canonical Home-to-Talk handoff rules through `TalkEntryContext`.
- `MemoryItem` preserves canonical persisted statuses:
  - `active`
  - `weakened`
  - `contradicted`
  - `hidden`
  - `archived`
- `blocked`, `expired`, and `disagreed` are not introduced as persisted memory statuses. In the mock file they are represented only as derived exclusion scenarios.
- `SleepGoal` and `Ritual` remain explicit future-only placeholders.

## Naming and field mapping notes

The canonical contract document is written in TypeScript-style field names, so the implementation kept camelCase names directly.

Equivalent trace fields requested for review:

- `latest_sleep_check_in_id` -> `latestSleepCheckInId`
- `eligible_memory_id` -> `eligibleMemoryId`
- `missing_data_keys` -> `missingDataKeys`
- `stale_data_keys` -> `staleDataKeys`

## Runtime boundary

- Contracts are not wired into UI components or route handlers yet.
- No runtime behavior changed in this patch.
- Current runtime code should be treated as a future integration target, not as the naming authority.

## Worker sequencing boundary

- Worker E `local-data-foundation` must not start until Worker D passes source trace review.
- These files establish logical shapes first; persistence adapters and runtime translation belong to the next stage.

## Validation and caveats

- This branch did not contain an existing `src/` tree, so `src/contracts/` and `src/mocks/` were created from scratch within the allowed scope.
- `SleepInsight` is referenced by product logic and by some contract ids, but it was not listed among Worker D's required top-level files or required domains. The contracts therefore preserve `latestSleepInsightId` references without inventing a separate `SleepInsight` contract here.
- Validation results are recorded after lint, type-check, and build are run for this branch.
