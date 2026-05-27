# Worktree and Branch Map

## 1. Purpose

This document prevents workers from starting implementation on the wrong branch or treating branch-local missing files as global product blockers.

## 2. Required Pre-Flight Commands

Run before coding or escalating missing files:

1. `pwd`
2. `git rev-parse --show-toplevel`
3. `git branch --show-current`
4. `git status`
5. `git worktree list`

For contract or data work, also check:

1. `find docs/stage-3 -maxdepth 3 -type f`
2. `find src/contracts src/mocks -maxdepth 2 -type f`

If these paths are missing, classify the current branch before calling the project blocked.

## 3. Branch Classifications

| Classification | Meaning | Implementation allowed? |
| --- | --- | --- |
| `audit-only` | audit or review branch | no, unless task is review-only |
| `spec-only` | product/spec/acceptance docs branch | docs only |
| `contract skeleton` | typed contract and mock baseline | contract/mocks only |
| `local data foundation` | local persistence or mock data wiring | data-wiring only |
| `integration baseline` | combined Stage 3 source for implementation | yes, after verification |
| `coding rules documentation branch` | Stage 4 architecture/rules docs | architecture docs and requested scaffold only |
| `needs verification` | classification unclear | stop before coding |

## 4. Observed Worktrees

Observed from `git worktree list` on this Stage 4 task:

| Worktree | Branch | Classification | Verification state | Notes |
| --- | --- | --- | --- | --- |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-web` | `stage3/core-data-integration-v04` | integration baseline | observed | Contains required Stage 3 docs and contract/mocks in Git |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-acceptance` | `stage3/acceptance-checklist` | spec-only | observed | Acceptance documentation |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-audit` | `stage3/audit-data-flow` | audit-only | observed | Data-flow audit |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-contract-spec` | `stage3/data-contract-spec` | spec-only | observed | Data contract spec branch |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-local-data` | `stage3/local-data-foundation` | local data foundation | observed | Local data foundation work |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-product-logic` | `stage3/product-logic-baseline` | spec-only | observed | Product logic branch |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-skeleton` | `stage3/contracts-skeleton` | contract skeleton | observed | Contract skeleton branch |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage4-coding-rules` | `stage4/engineering-docs-consolidation` | coding rules documentation branch | current | Stage 4 architecture docs and scaffold |

## 5. Current Stage 4 Branch Finding

Current branch:

- `stage4/engineering-docs-consolidation`

Current branch classification:

- `coding rules documentation branch`

Important note:

- `docs/stage-3/` is not present as working-tree files on this branch.
- The Stage 3 integration branch `stage3/core-data-integration-v04` contains the expected Stage 3 docs and `src/contracts`/`src/mocks` files.
- Stage 4 docs may cite those Git-ref sources, but Stage 5 implementation should start from or merge with the verified integration baseline.

## 6. Branch Safety Rules

1. Do not start Stage 4 or Stage 5 implementation from audit-only branches.
2. Do not assume missing `src/contracts`, `src/mocks`, or `docs/stage-3` on a documentation branch means the project lacks them globally.
3. Do not copy implementation truth from sibling worktrees.
4. Use Git refs inside the current repository to verify branch contents.
5. If classification is unclear, mark `needs verification`.
6. Automatic merge is forbidden.

## 7. Missing-File Handling

When a required file is missing:

1. record current `pwd`, root, branch, status, and worktree list
2. classify current branch
3. check whether the file exists on the verified integration branch
4. record whether the current task can proceed without the file
5. if product behavior cannot be verified, stop and mark `Needs Branch Verification`

Do not fill gaps by inventing product behavior.
