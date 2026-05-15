# Source of Truth Map

## Purpose

This document defines the documentation hierarchy for the AI Sleep Companion repository so future workers can find the right source before coding, reviewing, or escalating a conflict.

## Source-of-Truth Hierarchy

1. `AGENTS.md` for agent execution behavior
2. `docs/engineering/source-of-truth-map.md` for documentation hierarchy and conflict resolution
3. `docs/stage-3/product-logic.md` for canonical cross-flow product behavior when present on the current branch
4. `docs/stage-3/data-contract.md` for canonical data fields, states, and naming when present on the current branch
5. `docs/stage-3/acceptance-checklist.md` for acceptance gates when present on the current branch
6. `docs/stage-4/application-architecture.md` for Stage 4 architecture intent
7. `docs/engineering/coding-architecture-rules.md` for code-writing rules
8. `docs/engineering/review-checklist.md` for technical review checks
9. `docs/engineering/technical-review-writing-rules.md` for review output format

## Product Behavior Source

Use `docs/stage-3/product-logic.md` as the canonical cross-route product behavior source when it exists on the current branch.

For page-specific behavior, the current page PRD and UI specs remain authoritative:

- `/` and `/onboarding`: `docs/FIRST_LAUNCH_SPEC.md` and `docs/FIRST_LAUNCH_UI_SPEC.md`
- `/talk`: `docs/SPEC.md` and `docs/TALK_UI_SPEC.md`
- `/room`: `docs/ROOM_SPEC.md` and `docs/ROOM_UI_SPEC.md`
- `/memory`: `docs/MEMORY_SPEC.md` and `docs/MEMORY_UI_SPEC.md`
- `/sleep-monitoring`: `docs/SLEEP_SPEC.md` and `docs/SLEEP_UI_SPEC.md`

## Page-Level Behavior Source

Page PRD and UI spec files define the intended behavior, interaction flow, and visual baseline for each route. They are the runtime product truth for route-specific decisions.

## Data Contract Source

Use `docs/stage-3/data-contract.md` as the canonical contract source for field names, states, and shared entity meaning when it exists on the current branch.

Do not let page files or mock data invent alternate contract names.

## Acceptance Source

Use `docs/stage-3/acceptance-checklist.md` for stage acceptance when present.

For the current repository-wide handoff context, also read:

- `docs/ACCEPTANCE.md`
- `docs/TRACKING.md`
- `docs/HANDOFF.md`

## Engineering Coding Source

Use:

- `docs/stage-4/application-architecture.md` for Stage 4 architecture intent
- `docs/engineering/coding-architecture-rules.md` for implementation structure and code-writing rules

## Technical Review Source

Use:

- `docs/engineering/review-checklist.md` for what reviewers inspect
- `docs/engineering/technical-review-writing-rules.md` for how findings must be written

## Agent Behavior Source

Use `AGENTS.md` for worker startup behavior, scope rules, reporting rules, verification rules, and branch/worktree safety expectations.

## Conflict Handling Rule

If two product documents conflict:

1. do not choose arbitrarily
2. mark the conflict as `Needs Product Decision`
3. cite the conflicting files
4. stop short of inventing new product behavior

If a Stage 3 or Stage 4 document is missing on the current branch, verify the branch and worktree before treating the absence as a product blocker.
