# Source of Truth Map

## 1. Purpose

This document tells workers where product, contract, architecture, and review truth lives before they code or review.

Runtime code and mock data cannot override Stage 3 product logic or canonical contracts.

## 2. Highest-Priority Worker Rules

1. `AGENTS.md`
2. This file
3. `docs/engineering/worktree-branch-map.md`
4. Task-specific user instructions

If worker rules conflict with product behavior docs, stop and mark `Needs Product Decision` or `Needs Engineering Decision` based on the conflict.

## 3. Locked Stage 3 Product Sources

Primary Stage 3 sources:

1. `docs/stage-3/product-logic.md`
2. `docs/stage-3/data-contract.md`
3. `docs/stage-3/data-flow-audit.md`
4. `docs/stage-3/acceptance-checklist.md`
5. `docs/stage-3/contract-implementation-notes.md`
6. `docs/stage-3/page-logic/`

Conflict order:

1. `product-logic.md` wins for product behavior.
2. `data-contract.md` wins for canonical field names and type shapes.
3. `data-flow-audit.md` describes implementation gaps and current runtime status.
4. `acceptance-checklist.md` defines review gates.
5. `page-logic/*` bridges page-specific behavior into Stage 3 contracts.

Current branch note:

- If these files are missing in this worktree, verify the branch and worktree first.
- `stage3/core-data-integration-v04` is the observed integration branch containing the required Stage 3 documents.
- Do not use sibling worktree files as implementation source of truth; use the current repo, current branch, or Git refs inside this repo.

## 4. Page-Level Product Sources

For route-specific UX and visual behavior:

| Route | Primary source | Secondary source |
| --- | --- | --- |
| `/` and `/onboarding` | `docs/FIRST_LAUNCH_SPEC.md` | `docs/FIRST_LAUNCH_UI_SPEC.md` |
| `/talk` | `docs/SPEC.md` | `docs/TALK_UI_SPEC.md` |
| `/room` | `docs/ROOM_SPEC.md` | `docs/ROOM_UI_SPEC.md` |
| `/memory` | `docs/MEMORY_SPEC.md` | `docs/MEMORY_UI_SPEC.md` |
| `/sleep-monitoring` | `docs/SLEEP_SPEC.md` | `docs/SLEEP_UI_SPEC.md` |

Page specs define page experience and UI. Stage 3 docs define cross-page data and behavior. If the two conflict:

1. do not invent a merged behavior
2. cite both files
3. mark `Needs Product Decision`

## 5. Stage 4 Engineering Sources

Use these for implementation architecture:

1. `docs/stage-4/application-architecture.md`
2. `docs/engineering/coding-architecture-rules.md`
3. `docs/engineering/review-checklist.md`
4. `docs/engineering/technical-review-writing-rules.md`
5. `docs/engineering/worktree-branch-map.md`

Stage 4 docs define where code should live. They do not change Stage 3 behavior.

## 6. Shared Process Sources

Use these for repository status and handoff context:

- `docs/ACCEPTANCE.md`
- `docs/TRACKING.md`
- `docs/HANDOFF.md`

These files are useful context but cannot override locked Stage 3 product logic or canonical contracts.

## 7. Code Source Hierarchy

When implementation exists, use code this way:

1. `src/contracts` for canonical TypeScript shapes.
2. `src/domain` for pure business rules.
3. `src/policies` and `src/config` for Stage 3 decision rules and stable local catalogs.
4. `src/experience` for page-facing view models.
5. `src/mocks` for clearly labeled local data.
6. `app` for route entries.
7. `components` for presentational UI.
8. `lib` for legacy or generic helpers only.

If current runtime code conflicts with Stage 3 contracts, record the gap and adapt toward the contract rather than redefining the contract.

## 8. Conflict Handling

Use this exact handling:

1. Product behavior conflict: `Needs Product Decision`.
2. Contract field or type conflict: `Needs Data Contract Alignment`.
3. Architecture layer conflict: `Needs Engineering Decision`.
4. Missing source file on current branch: `Needs Branch Verification`.

Do not resolve conflicts by adding a new product feature, changing route structure, or broadening scope.
