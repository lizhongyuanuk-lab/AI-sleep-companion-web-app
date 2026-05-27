# Technical Review Checklist

## 1. Purpose

Use this checklist before recommending merge for AI Sleep Companion changes.

Reviews should enforce Stage 3 product truth and Stage 4 architecture rules without redesigning product behavior.

## 2. Scope Checks

Verify:

1. task classification is stated
2. changed files match the stated classification
3. forbidden areas were not touched
4. route/product scope did not expand
5. mock behavior is not presented as real backend behavior

Block when a worker changes product behavior during an architecture-docs, content-only, or review-only task.

## 3. Source Trace Checks

Verify the worker used the right sources:

1. `AGENTS.md`
2. relevant page spec pair if product behavior or UI changed
3. locked Stage 3 docs
4. Stage 4 architecture docs
5. process docs when needed

If `docs/stage-3/` is absent on the branch, verify branch/worktree state before treating it as a product gap.

## 4. Architecture Boundary Checks

Verify code follows:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

Check that:

1. domain imports contracts only
2. route files stay thin
3. components do not own product decisions
4. policies/config hold adjustable decisions and stable catalogs
5. experience builders return typed view models, not React elements
6. future API communication is not wired directly into components

## 5. Contract Checks

Verify:

1. canonical Stage 3 field names are preserved
2. `session`, `message`, and `memory` remain separate concepts
3. Room uses `RoomOption`, `RoomView`, and `RoomSession` distinctly
4. Talk uses `TalkEntryContext`
5. `OnboardingPreset` lifecycle is preserved
6. `MemoryFeedback` and `MemoryItem` are separate
7. hidden memory exclusion uses explicit contract fields
8. Sleep insight traceability uses source IDs
9. Home recommendation has source, source ID when required, fallback kind, and CTA

## 6. Product Guardrail Checks

Block if any implementation:

1. makes Home a dashboard, feed, transcript, or manager page
2. adds onboarding-to-Talk direct entry
3. uses onboarding answers to rank or highlight Room options
4. uses onboarding answers directly for Sleep suggestions
5. collapses `RoomView` and `RoomSession`
6. reconstructs a different onboarding preset from `presetId` when full preset should be carried
7. exposes Memory Delete as canonical V1 behavior
8. lets hidden memory influence Talk, Sleep, or Home
9. implies medical-grade or passive sleep monitoring
10. claims backend, database, auth, analytics, or AI memory wiring when only mock/local data exists

## 7. TypeScript Checks

Verify:

1. no unexplained `any`
2. lifecycle and fallback strings use typed unions
3. optional fields have clear absence semantics
4. no broad object maps replace known product contracts
5. event names are centralized

## 8. Fallback and Mock Checks

Verify:

1. fallback behavior is typed and explicit
2. fallback copy does not expose technical errors
3. mocks satisfy contracts
4. mocks cover non-happy paths when the task touches data
5. unresolved real data sources are documented

## 9. Verification Checks

Implementation tasks should report:

1. `npm run build`
2. `npm run lint`
3. `npm run type-check`

Documentation-only tasks may skip runtime validation only if no runtime files changed and the worker says so explicitly.

If a command fails for existing reasons, the exact command and result must be recorded.

## 10. Severity Guide

P1 blockers usually include:

- contract-breaking field rename
- product behavior changed without source approval
- domain logic embedded in page/component code
- hidden fallback that changes behavior
- scope violation
- unverified implementation presented as complete

P2 concerns usually include:

- weak naming
- partial event coverage
- unclear mock labels
- missing non-blocking test coverage
- code that is valid but harder to migrate later

P3 notes usually include:

- polish
- follow-up documentation
- optional cleanup
