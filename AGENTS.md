# AGENTS.md -- ai-companion-web execution rules

## 0. Scope

1. These rules apply to this repository root and all child paths.
2. Current V1 product scope is limited to `/`, `/onboarding`, `/talk`, `/room`, `/memory`, and `/sleep-monitoring`.
3. Do not expand into new product areas, new routes, backend migrations, or design-system rewrites unless the task explicitly requires it.

---

## 1. Repository Boundary Rules

1. All reads, writes, creates, moves, and deletes must stay inside this repository root.
2. Do not use sibling worktrees or the parent `Playground` directory as implementation source of truth.
3. Do not create shadow projects or parallel copies unless the user explicitly asks.

---

## 2. Source of Truth

### Page-level product source

- `/` and `/onboarding`: `docs/FIRST_LAUNCH_SPEC.md`, then `docs/FIRST_LAUNCH_UI_SPEC.md`
- `/talk`: `docs/SPEC.md`, then `docs/TALK_UI_SPEC.md`
- `/room`: `docs/ROOM_SPEC.md`, then `docs/ROOM_UI_SPEC.md`
- `/memory`: `docs/MEMORY_SPEC.md`, then `docs/MEMORY_UI_SPEC.md`
- `/sleep-monitoring`: `docs/SLEEP_SPEC.md`, then `docs/SLEEP_UI_SPEC.md`

### Shared process source

- `docs/ACCEPTANCE.md`
- `docs/TRACKING.md`
- `docs/HANDOFF.md`

### Engineering source

- `docs/engineering/source-of-truth-map.md`
- `docs/engineering/worktree-branch-map.md`
- `docs/stage-4/application-architecture.md`
- `docs/engineering/coding-architecture-rules.md`
- `docs/engineering/review-checklist.md`
- `docs/engineering/technical-review-writing-rules.md`

### Conflict rule

1. If source documents conflict, do not invent product behavior.
2. Mark the conflict as `Needs Product Decision`.
3. Do not silently expand scope to resolve the conflict.

---

## 3. Pre-flight Checks

Before making changes, every Codex worker must report:

1. `pwd`
2. `git branch --show-current`
3. `git status`
4. intended task scope
5. allowed files

Required startup commands:

1. `pwd`
2. `git rev-parse --show-toplevel`
3. `git branch --show-current`
4. `git status`
5. `git worktree list`

Only continue when `pwd` and `git rev-parse --show-toplevel` both point to this repository root.

Before implementation work, also read:

1. `AGENTS.md`
2. the active page's primary spec pair when the task touches product behavior
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. relevant engineering docs for architecture, contract, or review tasks

When Next.js framework behavior matters, read the relevant local guide under `node_modules/next/dist/docs/` first.

---

## 4. Mandatory Task Classification

Every task must be classified before coding as one of:

- `ui-only`
- `data-wiring`
- `api-contract`
- `architecture-docs`
- `technical-review`
- `bugfix`
- `content-only`
- `approved-refactor`

Rules:

1. Stay inside the selected task class unless the user explicitly approves cross-scope work.
2. `architecture-docs` may update repository rules and engineering docs only.
3. `technical-review` may review diffs, branches, or PRs, but must not modify files unless the user explicitly asks for fixes.
4. `ui-only` must not change API shapes or route structure.
5. `data-wiring` must not redesign page layout or visual hierarchy.

---

## 5. Pre-Implementation Report

Before editing files, provide a short implementation report that includes:

1. task classification
2. task goal
3. allowed files to modify
4. likely files to inspect
5. forbidden files or areas
6. expected contract or data shape involved
7. assumptions or blockers

Do not start implementation until the report is internally consistent with the task.

---

## 6. Scope Control

1. Keep changes tightly scoped to the active task.
2. If a task is documentation-only, do not modify `src/`, `app/`, `components/`, `public/`, package files, lock files, backend files, or Go files.
3. If allowed files are specified, modify only those files.
4. Do not silently expand scope.
5. Do not perform runtime implementation review during a coding-rules or documentation-consolidation task.
6. Do not refactor for elegance, cleanup, or abstraction unless the user explicitly asks.

---

## 7. Branch and Worktree Safety

1. If required files appear missing, first verify the current branch and worktree.
2. Do not declare the product blocked before checking whether the current branch is audit-only, spec-only, or otherwise outdated.
3. Missing `src/contracts`, `src/mocks`, or Stage 3 docs on an audit-only branch does not automatically mean the full project lacks them.
4. Do not start Stage 4 implementation from Stage 3 audit branches.
5. Stage 4 implementation should start from the verified Stage 3 integration baseline.
6. Use `docs/engineering/worktree-branch-map.md` to classify the current worktree before escalating a missing-file concern.
7. If branch classification is unclear, mark it as `needs verification` rather than guessing.

---

## 8. Data and Contract Discipline

1. Treat `session`, `message`, and `memory` as separate concepts unless a higher-priority source explicitly merges them.
2. Preserve approved contract naming.
3. Do not silently change field names, payload shapes, response structures, or type contracts.
4. If contract details are unclear, preserve current shapes, mark the assumption, and report the ambiguity.
5. Separate mock behavior from expected real backend behavior in every implementation summary.

---

## 9. Coding Architecture Summary

Implementation work must follow:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

Mandatory rules:

1. No domain logic inside page components.
2. No product decision logic inside presentational components.
3. No silent product fallback.
4. Recommendations must preserve source trace.
5. Key user actions need typed event payloads or a documented reason for omission.
6. Future backend communication must go through `src/api`.
7. Domain must not import React, components, app, or API clients.

The full standard lives in `docs/engineering/coding-architecture-rules.md`.

---

## 10. Review Writing Summary

Every technical review must:

1. output `pass`, `pass-with-notes`, or `blocked`
2. include evidence for every issue
3. include `file path`, `evidence`, `violated rule`, `risk`, and `required fix` for every P1 blocker
4. avoid blocking merge for future-stage requirements that are out of scope
5. avoid redesigning product behavior unless the current implementation violates source-of-truth docs

The full standard lives in `docs/engineering/technical-review-writing-rules.md`.

---

## 11. Verification Rules

Every implementation task should finish by running:

1. `npm run build`
2. `npm run lint`
3. `npm run type-check`

Rules:

1. If a check fails, do not present the task as complete.
2. If a check cannot run, explicitly state why.
3. If verification is skipped, explicitly state that it is unverified.

Documentation-only tasks may skip runtime checks when no runtime files changed, but must say so explicitly.

---

## 12. Final Delivery Requirements

Each implementation summary must include:

1. task classification
2. modified files
3. added files
4. deleted files
5. what changed in each file
6. whether any shared component was touched
7. whether any contract or type shape changed
8. verification results for build, lint, and type-check
9. unverified assumptions
10. regression risk
11. manual verification steps
12. whether any remaining area is still mock or placeholder

For code tasks that must be reviewed through GitHub, also include:

- `Branch`
- `Real PR URL`
- `Summary`
- `Changed files`
- `Commands run`
- `Technical check result`
- `Local verification steps`
- `Visual QA checklist` when UI changed
- `Known risks`
- `Merge status`

Automatic merge is forbidden. Do not report merge completion unless a human has done it.
