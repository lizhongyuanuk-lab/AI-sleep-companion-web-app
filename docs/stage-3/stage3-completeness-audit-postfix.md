# Stage 3 Completeness Audit Post-Fix

## Verdict
BLOCKED

## Previous Blockers

- Missing canonical contract objects: Resolved.
  - `OnboardingDraft`, `OnboardingContextCard`, `MemoryExtractionRun`, `SuggestionRuleResult`, and `ProductEvent` now exist in `src/contracts` and are exported through `src/contracts/index.ts`.
- Home behavior conflict: Resolved in the Stage 3 baseline.
  - `docs/stage-3/product-logic.md`, `docs/stage-3/data-contract.md`, `docs/stage-3/page-logic/home.md`, `src/contracts/home.ts`, mocks, and local data now agree that normal Stage 3 Home has one primary recommendation and one primary CTA into `Talk`.
  - active onboarding preset recovery is handled by `AppEntryResolver` / entry-guard logic rather than normal Home recommendation behavior.
- Canonical naming drift in the Stage 3 baseline: Resolved.
  - `SleepLog`, `TalkSession`, and `MemoryFeedback` are now the canonical Stage 3 names.
  - legacy names remain only in explicitly marked compatibility reads or explanatory legacy notes.
- Runtime Memory Delete residue in `app/memory/*`: Resolved.
  - the runtime now exposes `Agree`, `Disagree`, and `Hide`, and local hide behavior marks the item hidden and sets `exclude_from_personalization = true` in the page mock state.
- Room source enum mismatch: Resolved.
  - the canonical shared Room entry source set is now `onboarding`, `home`, `manual`, `memory_cta`, and `sleep_suggestion`.
- Talk memory-extraction idempotency gap: Resolved at the contract/mock/local-data level.
  - `MemoryExtractionRun` exists, `userMessageCount = 0` is represented by a skipped run, and the docs/contracts now define the one-completed-run-per-`TalkSession` rule.
- Sleep naming split and `sleepLogIds` mismatch: Resolved in contracts, mocks, and local data.
- Home recommendation traceability / ProductEvent payload gap: Resolved.

## New Findings

- The active `/memory` page source docs outside `docs/stage-3/` are still stale:
  - `docs/MEMORY_SPEC.md` still defines `is_deleted`, `memory_delete_capability`, and expanded-item `Agree` / `Delete` behavior.
  - `docs/MEMORY_UI_SPEC.md` still says expanded recurring items may expose `Agree` / `Delete`.
- Auxiliary repo docs are also stale:
  - `docs/TRACKING.md` still describes the current Memory runtime as `Agree` / `Delete`.
  - `docs/HANDOFF.md` still describes `/memory` as exposing `Agree` / `Delete`.
- `docs/stage-3/data-flow-audit.md` still contains a few pre-fix statements claiming the runtime uses local Delete behavior or lacks a hide model. Those passages no longer match the checked-out runtime.
- The current worktree is dirty. The audited post-fix state is present in the checked-out files, not a clean branch tip.

## Remaining Blockers

- The branch is not ready for page implementation as a single implementation truth because the active `/memory` source-of-truth docs still prescribe Delete-style behavior that conflicts with the Stage 3 baseline requirement of `Agree / Disagree / Hide` only.

## Non-blocking Cleanup

- Refresh stale commentary in `docs/stage-3/data-flow-audit.md` so it no longer says the runtime still exposes Delete or lacks a hide model.
- Refresh `docs/TRACKING.md` and `docs/HANDOFF.md` so their Memory runtime notes match the current checked-out implementation.
- Commit the current post-fix worktree before merge review so the audited state exists at a clean branch tip.

## Static Check Results

- `npm run type-check`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS

## Recommendation

Do not merge this branch into the Stage 3 integration baseline yet.

The Stage 3 core baseline under `docs/stage-3/`, `src/contracts/`, `src/mocks/`, and `src/data/stage3/` is materially fixed and internally coherent. However, the branch is still not ready to serve as the implementation baseline because the active `/memory` page specs in `docs/MEMORY_SPEC.md` and `docs/MEMORY_UI_SPEC.md` still tell implementers to build `Delete` behavior that the Stage 3 baseline explicitly forbids.
