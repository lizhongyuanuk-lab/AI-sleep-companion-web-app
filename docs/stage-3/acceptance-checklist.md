# Stage 3 Acceptance Checklist

This checklist is the review gate for Stage 3 documentation, contract alignment, mock alignment, and downstream worker readiness.

Primary source of truth for this checklist:

1. `docs/stage-3/product-logic.md`
2. `docs/stage-3/page-logic/home.md`
3. current app implementation
4. existing repo docs

Rule:

- If `docs/stage-3/product-logic.md` conflicts with `docs/stage-3/page-logic/home.md`, `product-logic.md` wins.
- If `product-logic.md` defines broader Stage 3 product rules than `home.md`, follow `product-logic.md` and explicitly document the relationship in review notes.
- Workers must cite `product-logic.md` in their source-read report and implementation summary.

## 1. Stage 3 Source-of-Truth Gate

Pass all checks:

- `PASS` if `docs/stage-3/product-logic.md` exists. `FAIL` if missing.
- `PASS` if `docs/stage-3/page-logic/home.md` exists. `FAIL` if missing.
- `PASS` if review output states `product-logic.md` is the primary source. `FAIL` otherwise.
- `PASS` if review output states `home.md` is secondary. `FAIL` otherwise.
- `PASS` if review output states `product-logic.md` wins on conflict. `FAIL` otherwise.
- `PASS` if any conflict between `product-logic.md` and `home.md` is documented explicitly. `FAIL` if conflict is resolved silently.
- `PASS` if workers cite `product-logic.md` in the source-read gate and final summary. `FAIL` otherwise.

Required source-read checks:

- `pwd`
- `git branch --show-current`
- `git rev-parse --show-toplevel`
- `ls -la docs/stage-3/product-logic.md`
- `ls -la docs/stage-3/page-logic/home.md`
- `wc -l docs/stage-3/product-logic.md`
- `wc -l docs/stage-3/page-logic/home.md`
- `git hash-object docs/stage-3/product-logic.md`
- `git hash-object docs/stage-3/page-logic/home.md`

Required canonical rule extraction:

- app entry and route decision
- Home route and scope
- first launch and onboarding boundary
- active preset redirect
- returning-user path
- one recommendation and one CTA
- Home-to-Talk entry context
- memory eligibility and forbidden memory
- sleep continuity
- room continuity
- fallback behavior
- storage and persistence assumptions
- backend and API future boundary

## 2. Required Docs

All of the following must exist and be reviewable:

- `docs/stage-3/product-logic.md`
- `docs/stage-3/page-logic/home.md`
- `docs/stage-3/data-flow-audit.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`
- `docs/stage-3/contract-implementation-notes.md`

Review rule:

- `FAIL` if any required document is missing.
- `FAIL` if any required document is present but contradicts `product-logic.md` without an explicit conflict note.

## 3. Required Contract Files

All of the following files are required review targets for contract alignment:

- `src/contracts/shared.ts`
- `src/contracts/user.ts`
- `src/contracts/onboarding.ts`
- `src/contracts/home.ts`
- `src/contracts/sleep.ts`
- `src/contracts/conversation.ts`
- `src/contracts/memory.ts`
- `src/contracts/room.ts`
- `src/contracts/index.ts`

Review rule:

- `FAIL` if any required contract file is missing.
- `FAIL` if any required contract file uses runtime-invented naming that is not supported by `docs/stage-3/data-contract.md`.

## 4. Required Mock File

Required mock review target:

- `src/mocks/stage3MockData.ts`

Review rule:

- `FAIL` if the mock file is missing.
- `FAIL` if the mock file mirrors ad hoc runtime naming instead of canonical contract naming.
- `FAIL` if fallback states, route decisions, or eligibility states cannot be represented by the mock layer.

## 5. Canonical Contract Checks

The contract layer must explicitly define or clearly alias all of the following:

- `RouteDecision`
- `HomeState`
- `HomeEntryContext`
- `HomeRecommendation` or a documented canonical `Recommendation` alias
- `HomeCTA`
- `OnboardingPreset` with expiry and stale behavior
- status-driven `MemoryItem` eligibility
- `SleepGoal`, `SleepSession`, and `SleepCheckIn` shaped according to `docs/stage-3/data-contract.md`
- `RoomState` as the continuity contract
- `Ritual` status with active vs future behavior explicitly decided

Pass/fail rules:

- `FAIL` if route decision is implicit instead of modeled.
- `FAIL` if Home state is derived only from runtime view state and not from canonical contract rules.
- `FAIL` if `HomeEntryContext` cannot represent present, missing, partial, stale, or expired upstream state.
- `FAIL` if `OnboardingPreset` expiry or stale handling is undefined.
- `FAIL` if `MemoryItem` eligibility is not status-driven.
- `FAIL` if sleep contracts drift from the contract document or from worker B's accepted contract output.
- `FAIL` if `RoomState` is missing as the continuity-facing shape.
- `FAIL` if `Ritual` active vs future semantics are left ambiguous.

## 6. Home Checks

Home must pass all of the following:

- canonical route is defined according to `docs/stage-3/product-logic.md`
- Home is not a dashboard
- Home is not a feed
- Home is not a transcript surface
- Home is not a memory manager
- Home has one main recommendation
- Home has one main CTA
- recommendation priority is defined
- recommendation traceability is required
- hidden memory cannot drive Home
- disagreed memory cannot drive Home
- expired memory cannot drive Home
- blocked memory cannot drive Home
- deleted memory cannot drive Home
- raw transcripts cannot be passed through Home entry payloads
- full sleep reports cannot be passed through Home entry payloads
- fallback states are defined:
  - `system_default_fallback`
  - `data_partial_fallback`
  - `error_safe_fallback`
- fallback copy does not expose technical errors

Canonical Home route decision:

1. `hasCompletedOnboarding = false` -> `/onboarding`
2. active onboarding preset with `status = "active"` -> `/room`
3. otherwise -> `/home`

Canonical normal Home recommendation priority:

1. new `MemoryItem` not yet reviewed
2. missing morning sleep check-in
3. usable `SleepInsight`
4. strong memory continuity back to Talk
5. otherwise Room or `system_default`

Defensive fallback only:

- `complete_onboarding`
- `enter_room` for active preset recovery

Review rule:

- `FAIL` if defensive fallback states are treated as normal Home flow.
- `FAIL` if Home payloads carry raw transcript data.
- `FAIL` if Home payloads carry full memory management objects or full sleep report payloads.
- `FAIL` if fallback copy exposes `undefined`, `null`, `fetch failed`, `query error`, `contract missing`, or equivalent technical wording.

## 7. D-Specific Checks

Worker D must fail review if any of the following are true:

- `src/contracts/home.ts` differs from `docs/stage-3/data-contract.md`
- mocks mirror runtime naming instead of canonical contract naming
- route values drift from the canonical route decision
- `HomeEntryContext` omits missing-data keys, stale-data keys, partial-data keys, or expired upstream keys required by contract behavior
- `MemoryItem` uses non-canonical eligibility logic
- sleep contracts do not match worker B's accepted contract output
- `docs/stage-3/contract-implementation-notes.md` contains stale factual errors

Source-trace expectations for D:

- D must cite `product-logic.md`
- D must cite `data-contract.md`
- D must cite `data-flow-audit.md`
- D must explain any aliasing between runtime names and contract names
- D must fail closed on ambiguity rather than inventing contract fields

## 8. E Unlock Checks

Worker E `local-data-foundation` can start only if all conditions are true:

- B `PASS`
- C `PASS`
- D `PASS`
- D compile and build validation is clearly reported
- Source Trace Review is `STRONG`, or `PARTIAL` with no blocking issues

Source Trace Review rating:

- `STRONG`: canonical sources cited, no blocking drift, no unresolved contract contradiction
- `PARTIAL`: minor trace gaps exist, but no blocking contract or route drift remains
- `FAIL`: source gaps or drift are still blocking

Unlock rule:

- `FAIL` if E starts while D is not yet accepted.
- `FAIL` if trace review is blocking.

## 9. Merge and Review Order

Required order:

1. source trace review before integration
2. merge or review order: C, A, B, D
3. D and E code branches require validation before any integration decision
4. no merge to `main` until integration passes

Review rule:

- `FAIL` if source trace review is skipped.
- `FAIL` if D or E is integrated without validation.
- `FAIL` if `main` merge is proposed before integration acceptance.

## 10. Rejection Criteria

Reject the work immediately if any of the following are true:

- `docs/stage-3/product-logic.md` is missing
- a worker does not cite `product-logic.md`
- forbidden files were touched
- `package.json` changed
- lockfiles changed
- UI changed unexpectedly
- runtime behavior changed unexpectedly
- no commit hash is provided
- working tree is dirty at delivery time
- D diverges from B
- E starts before D passes

Additional rejection triggers:

- route decision checks are missing
- fallback mock checks are missing
- status-driven memory eligibility checks are missing
- `src/contracts/home.ts` is not included in required contract review
- source priority is not documented
- conflicts are resolved by assumption rather than by explicit trace to `product-logic.md`

## 11. Review Commands

Minimum review commands:

- `git status --short`
- `git diff --name-only`
- source-read gate commands listed in Section 1

Delivery rule:

- `FAIL` if the final review cannot prove changed-file scope.
- `FAIL` if the final review cannot prove source-read alignment.

## 12. Worker Deliverables

Each worker delivery should include:

- worker name
- worktree
- branch
- result
- source alignment summary
- actual changed files
- forbidden files touched: yes or no
- commit created: yes or no
- commit hash
- next safe action

For documentation and contract workers, also include:

- cited primary sources
- explicit conflict notes
- unverified assumptions
- known risks
