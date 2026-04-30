# Implementation Brief Template

Use this template for a single task or implementation round. It is intentionally narrower than repository rules and narrower than product docs.

## 1. Task Type

Choose one:

- `ui-only`
- `data-wiring`
- `api-contract`
- `bugfix`
- `content-only`
- `approved-refactor`

## 2. Current Goal

State exactly what this round should deliver.

## 3. Current Phase

Choose one:

- visual prototype
- UI implementation with mock data
- real data wiring
- runtime-complete feature

## 4. Source of Truth

List the exact docs this round must follow.

## 5. Allowed Files

List the files that may be modified in this round.

## 6. Protected Areas

List pages, shared components, routes, contracts, or token sets that must not be changed.

## 7. Mock vs Real

State clearly:

- which parts are allowed to remain mock
- which parts must be real
- which parts are unresolved dependencies

## 8. Required Output

State what the implementation must achieve in this round only.

## 9. Out of Scope

State what must not be attempted in this round.

## 10. Delivery Report Format

Require:

- modified files
- what changed in each file
- what is still mock
- whether any shared component was touched
- whether any contract changed
- manual verification steps
- regression risk

## 11. Self-Check Before Final Report

Before finalizing the task, perform a scoped self-check.

Rules:

1. Check only against the current task goal and current phase.
2. Do not expand into redesign or unrelated improvements.
3. Explicitly identify:
   - anything still mock
   - anything visually present but not runtime-complete
   - any unresolved dependency that would matter in a later phase
4. If the current task is `ui-only`, do not treat missing backend/runtime implementation as a failure of this round.
5. If the current task is `data-wiring`, do not redesign visual structure while solving data hookup.

## 12. Placeholder vs Completion Rule

A placeholder implementation is acceptable only if the current phase explicitly allows it.

If a placeholder is used, the implementation must say:

- what it is standing in for
- why it is still placeholder
- what later phase is expected to replace it

A task must not present placeholder behavior as completed production behavior.
