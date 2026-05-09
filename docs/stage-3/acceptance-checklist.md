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

## 3. Stage 3 Exit Criteria

Stage 3 is complete only when all of the following are true.

Primary completion basis from `docs/stage-3/product-logic.md`:

- product logic is clear
- canonical data contract is clear
- page data matrix or equivalent data-flow audit is clear
- memory rules are clear
- sleep rules are clear
- Home rules are clear
- analytics and retention rules are clear
- Store and API contract draft is clear
- acceptance checklist is clear
- a review worker can independently judge whether the implementation is acceptable

Stage 3 review completion also requires:

- A, B, C, and D outputs are all present
- A, B, C, and D outputs are reviewed together
- no contradiction remains between `product-logic.md`, `home.md`, `data-flow-audit.md`, `data-contract.md`, contract files, and mocks
- required mock scenarios cover both normal flow and non-happy-path continuity and fallback states
- final review explicitly states whether Stage 3 is complete, not merely whether E is unlocked

Hard fail:

- `FAIL` if Stage 3 is declared complete before all Stage 3 Exit Criteria pass.
- `FAIL` if E unlock is treated as equivalent to Stage 3 completion.

## 4. Changed-File Scope Allowlist by Worker

Allowed changed-file scope:

- A may only edit `docs/stage-3/data-flow-audit.md`
- B may only edit `docs/stage-3/data-contract.md`
- C may only edit `docs/stage-3/acceptance-checklist.md`
- D may only edit `src/contracts/*`, `src/mocks/stage3MockData.ts`, and `docs/stage-3/contract-implementation-notes.md`
- review workers may not change files unless explicitly requested

Hard fail:

- `FAIL` if any worker changes files outside the allowlist for that worker.
- `FAIL` if review workers modify files without explicit request.

## 5. Required Contract Files

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

## 6. Required Mock File

Required mock review target:

- `src/mocks/stage3MockData.ts`

Review rule:

- `FAIL` if the mock file is missing.
- `FAIL` if the mock file mirrors ad hoc runtime naming instead of canonical contract naming.
- `FAIL` if fallback states, route decisions, or eligibility states cannot be represented by the mock layer.

## 7. Required Mock Scenario Matrix

The mock layer must be able to represent all of the following review scenarios:

- first launch -> `/onboarding`
- active onboarding preset -> `/room`
- returning completed user -> `/home`
- new memory not reviewed
- missing morning sleep check-in
- usable sleep insight
- strong memory continuity to Talk
- system or default fallback
- hidden memory
- disagreed memory
- expired memory
- blocked memory
- deleted memory
- complete upstream data
- missing upstream data
- partial upstream data
- stale upstream data
- expired upstream data
- error-safe upstream data
- Home payload excludes raw transcript
- Home payload excludes full sleep report
- Home payload excludes full memory manager object

Hard fail:

- `FAIL` if mocks cover only the happy path.
- `FAIL` if the scenario matrix cannot represent fallback, status, stale, expired, or blocked states.

## 8. Canonical Contract Checks

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

## 9. A-Specific Checks

Worker A must pass review for `docs/stage-3/data-flow-audit.md` only if all of the following are true:

- the file cites `product-logic.md` as primary and `home.md` as secondary
- the file traces the canonical app-entry route decision
- the file traces onboarding completion, active preset redirect, and returning-user Home flow
- the file traces Room, Talk, Memory, Sleep, and Home continuity boundaries without inventing runtime semantics
- the file distinguishes persistent business objects from derived snapshots and pure runtime view-models
- the file traces hidden, contradicted, excluded, stale, partial, expired, and fallback states where relevant
- the file does not replace contract definitions with runtime-named guesses
- the file documents any conflict with the primary source explicitly

Hard fail:

- `FAIL` if A omits route decision coverage.
- `FAIL` if A silently resolves source conflicts.
- `FAIL` if A invents data-contract semantics not supported by source docs.

## 10. B-Specific Checks

Worker B must pass review for `docs/stage-3/data-contract.md` only if all of the following are true:

- the file cites `product-logic.md` as primary and `home.md` as secondary
- the file defines or clearly aliases `RouteDecision`
- the file defines or clearly aliases `HomeState`
- the file defines or clearly aliases `HomeEntryContext`
- the file defines `HomeRecommendation` or a documented canonical `Recommendation` alias
- the file defines `HomeCTA`
- the file defines `OnboardingPreset` expiry and stale behavior
- the file defines status-driven `MemoryItem` eligibility
- the file defines `SleepGoal`, `SleepSession`, and `SleepCheckIn` in the canonical contract shape
- the file defines `RoomState` as continuity-facing state
- the file explicitly decides `Ritual` active vs future status behavior
- the file preserves traceability requirements for `SleepInsight` and `HomeRecommendation`

Hard fail:

- `FAIL` if B uses runtime naming as canonical contract naming without explicit alias rationale.
- `FAIL` if B omits expiry, stale, partial, or fallback-relevant contract semantics.
- `FAIL` if B conflicts with `product-logic.md` without explicit conflict documentation.

## 11. C-Specific Checks

Worker C must pass review for `docs/stage-3/acceptance-checklist.md` only if all of the following are true:

- the checklist cites `product-logic.md` as primary and `home.md` as secondary
- the checklist states that `product-logic.md` wins on conflict
- the checklist contains Stage 3 Exit Criteria
- the checklist contains A-, B-, C-, and D-specific checks
- the checklist contains E unlock checks and states E unlock is not Stage 3 completion
- the checklist contains the changed-file scope allowlist by worker
- the checklist contains the required mock scenario matrix
- the checklist contains validation commands for docs-only and code or contract workers
- the checklist contains contract freeze and change-control rules
- the checklist contains the integration gate
- the checklist contains hard-fail rules for out-of-scope edits, happy-path-only mocks, silent frozen-contract changes, and premature Stage 3 completion

Hard fail:

- `FAIL` if C remains D-only or Home-only instead of a full Stage 3 review gate.
- `FAIL` if C omits any required worker-specific gate.
- `FAIL` if C omits the distinction between E unlock and Stage 3 completion.

## 12. Home Checks

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

## 13. D-Specific Checks

Worker D must fail review if any of the following are true:

- `src/contracts/home.ts` differs from `docs/stage-3/data-contract.md`
- mocks mirror runtime naming instead of canonical contract naming
- route values drift from the canonical route decision
- `HomeEntryContext` omits missing-data keys, stale-data keys, partial-data keys, or expired upstream keys required by contract behavior
- `MemoryItem` uses non-canonical eligibility logic
- sleep contracts do not match worker B's accepted contract output
- `docs/stage-3/contract-implementation-notes.md` contains stale factual errors
- D changes files outside the worker D allowlist
- D silently modifies frozen contract semantics after freeze
- D leaves mock coverage on happy-path-only scenarios

Source-trace expectations for D:

- D must cite `product-logic.md`
- D must cite `data-contract.md`
- D must cite `data-flow-audit.md`
- D must explain any aliasing between runtime names and contract names
- D must fail closed on ambiguity rather than inventing contract fields

Strengthened fail rules:

- `FAIL` if D implements runtime-shaped contracts instead of data-contract-shaped contracts.
- `FAIL` if D changes canonical route values, recommendation source semantics, memory eligibility semantics, or sleep continuity semantics without explicit approval.
- `FAIL` if D does not prove mock coverage for fallback, status, stale, partial, expired, and blocked cases.

## 14. E Unlock Checks

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
- E unlock is a downstream readiness gate only.
- E unlock is not evidence that Stage 3 is complete.

Hard fail:

- `FAIL` if any review report equates E unlock with Stage 3 completion.

## 15. Contract Freeze and Change Control

Freeze rule:

- after B and D are accepted, `docs/stage-3/data-contract.md` and `src/contracts/*` are frozen for Stage 3

Any later semantic contract change requires:

- reason for change
- affected docs
- affected files
- affected downstream workers
- explicit approval

Hard fail:

- `FAIL` if later workers silently modify frozen contract semantics.
- `FAIL` if frozen contract changes are made without the required impact statement and approval.

## 16. Integration Gate

Stage 3 may be marked complete only after joint review of A, B, C, and D outputs.

Integration requirements:

- A, B, C, and D outputs must be reviewed together before Stage 3 is marked complete
- no contradiction may remain between `product-logic.md`, `home.md`, `data-flow-audit.md`, `data-contract.md`, contract files, and mocks
- source priority and any conflicts must be documented explicitly
- route decision, continuity, fallback, eligibility, traceability, and payload-boundary rules must agree across docs, contracts, and mocks

Hard fail:

- `FAIL` if outputs are reviewed in isolation and Stage 3 is still declared complete.
- `FAIL` if contradictions remain across source docs, contract docs, contract files, or mocks.

## 17. Merge and Review Order

Required order:

1. source trace review before integration
2. merge or review order: C, A, B, D
3. D and E code branches require validation before any integration decision
4. no merge to `main` until integration passes

Review rule:

- `FAIL` if source trace review is skipped.
- `FAIL` if D or E is integrated without validation.
- `FAIL` if `main` merge is proposed before integration acceptance.

## 18. Rejection Criteria

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
- Stage 3 is declared complete without Stage 3 Exit Criteria passing
- E unlock is treated as Stage 3 completion
- a worker changes files outside the allowlist
- mocks cover only the happy path
- later workers silently modify frozen contract semantics

Additional rejection triggers:

- route decision checks are missing
- fallback mock checks are missing
- status-driven memory eligibility checks are missing
- `src/contracts/home.ts` is not included in required contract review
- source priority is not documented
- conflicts are resolved by assumption rather than by explicit trace to `product-logic.md`

## 19. Validation Commands

Docs-only workers must run:

- `git status --short`
- `git diff --name-only`
- source-read gate commands listed in Section 1

Code and contract workers must run:

- `git status --short`
- `git diff --name-only`
- `npm run lint`
- `npm run build`
- `npm run type-check` if available

Reviewer rule:

- if no `type-check` script exists, the reviewer must state whether `build` performs TypeScript validation

Delivery rule:

- `FAIL` if the final review cannot prove changed-file scope.
- `FAIL` if the final review cannot prove source-read alignment.

## 20. Worker Deliverables

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
