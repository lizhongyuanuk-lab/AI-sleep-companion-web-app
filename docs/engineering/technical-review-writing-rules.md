# Technical Review Writing Rules

## 1. Purpose

This document defines how to write technical review output for the AI Sleep Companion repository.

Reviews must be evidence-based, source-traceable, and scoped to the current task.

## 2. Required Verdict

Every technical review must start with one status:

- `pass`
- `pass-with-notes`
- `blocked`

Use `blocked` only when merge should not proceed.

## 3. Review Is Not Product Redesign

A review checks whether a change follows current source-of-truth documents.

Do not block for:

- personal visual preference
- speculative backend needs
- future-stage work not required by the task
- product behavior you would have designed differently

If sources conflict, mark the conflict:

- `Needs Product Decision`
- `Needs Data Contract Alignment`
- `Needs Engineering Decision`
- `Needs Branch Verification`

## 4. Evidence Requirement

Every finding must include evidence.

Valid evidence includes:

- file path and line or narrow section reference
- summarized code snippet
- failing command output
- cited source-of-truth rule
- changed-file scope mismatch

Do not write unsupported claims.

## 5. Severity Levels

### P1 Blocker

Must be fixed before merge.

Use for clear correctness, contract, architecture, verification, or scope violations.

### P2 Concern

Should be fixed soon but does not block by itself.

Use for maintainability, partial event coverage, weak mock labeling, or non-blocking validation gaps.

### P3 Note

Informational note or follow-up.

## 6. Required Finding Format

Each finding should include:

- `Title`
- `File`
- `Evidence`
- `Violated rule`
- `Risk`
- `Required fix`
- `Validation`

For P1 blockers, all fields are mandatory.

## 7. Required Review Output

Use this structure:

```text
Status: pass | pass-with-notes | blocked

Scope reviewed:

P1 blockers:

P2 concerns:

P3 notes:

Architecture compliance:

Contract compliance:

Mock vs real behavior:

Commands run:

Merge recommendation:

Open questions:
```

If a section has no findings, write `None`.

## 8. P1 Discipline

P1 should be rare and concrete.

Appropriate P1 examples:

- Home implemented as dashboard/feed despite Stage 3 guardrail
- Room options reordered based on onboarding
- hidden memory used in Talk/Sleep/Home personalization
- `RoomView` and `RoomSession` collapsed into one object
- TypeScript contract field renamed without source approval
- runtime code changed during a documentation-only task
- required validation not run and task reported as complete

Not P1 by default:

- missing future Go Gin backend
- missing real database
- missing auth
- missing production analytics provider
- future visual polish

## 9. Review Boundaries

When reviewing architecture docs:

- do not perform runtime implementation review unless asked
- check source mapping, branch safety, and rule completeness

When reviewing UI implementation:

- check page specs and Stage 3 behavior
- do not demand new product features

When reviewing data wiring:

- check contracts, mocks, source trace, fallback, and mock-vs-real labeling

When reviewing technical reviews:

- check evidence, severity, source trace, and actionable fixes
