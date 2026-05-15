# Worktree and Branch Map

## Purpose

This document helps workers determine whether they are on the correct worktree before starting implementation, documentation, or review work. It exists to prevent false blockers, missing-file confusion, and implementation starting from the wrong baseline.

## Required Pre-flight Commands

Run these commands before escalating a branch or missing-file concern:

1. `pwd`
2. `git branch --show-current`
3. `git status`
4. `git worktree list`
5. `ls src/contracts`
6. `ls src/mocks`

If `ls src/contracts` or `ls src/mocks` fails, do not assume the project is missing them globally. First classify the current branch.

## How to Identify Branch Types

- `audit-only`: branch names or worktrees focused on audit, completeness audit, data-flow audit, or review-only work
- `spec-only`: branch names focused on specs, acceptance docs, product logic docs, or documentation baselines
- `contract skeleton`: branch names focused on contract skeletons or typed placeholders without local data wiring
- `local data foundation`: branch names focused on local data or mock-driven data foundations
- `integration baseline`: the branch that combines the intended Stage 3 contract, product logic, skeleton, and local data baseline for implementation
- `coding rules documentation branch`: a Stage 4 branch focused on engineering architecture, coding rules, review rules, or documentation consolidation

## Current Known Worktree and Branch Map

Observed from `git worktree list` on 2026-05-15:

| Worktree | Branch | Likely classification | Verification state | Notes |
| --- | --- | --- | --- | --- |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-web` | `stage3/completeness-audit-v2` | audit-only | inferred from branch name | Do not start implementation here without verifying a separate integration baseline |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-acceptance` | `stage3/acceptance-checklist` | spec-only | inferred from branch name | Likely acceptance documentation worktree |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-audit` | `stage3/audit-data-flow` | audit-only | inferred from branch name | Missing contracts here would not prove they are missing globally |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-contract-spec` | `stage3/data-contract-spec` | spec-only | inferred from branch name | Likely contract documentation source |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-local-data` | `stage3/local-data-foundation` | local data foundation | inferred from branch name | Candidate source for mock or local data wiring patterns |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-product-logic` | `stage3/product-logic-baseline` | spec-only | inferred from branch name | Candidate source for cross-flow product behavior docs |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-skeleton` | `stage3/contracts-skeleton` | contract skeleton | inferred from branch name | Candidate source for skeleton contract structure |
| `/Users/zhongyuanli/Documents/Playground/ai-companion-stage4-coding-rules` | `stage4/engineering-docs-consolidation` | coding rules documentation branch | verified current branch | Documentation-only branch for consolidation work |

Current integration baseline:

- `needs verification`
- No worktree in the observed list is explicitly named as the Stage 3 integration baseline
- Do not assume the current documentation branch or any audit branch is the implementation starting point

## Branch Safety Rules

1. Stage 4 implementation should not start from audit-only branches.
2. Stage 4 implementation should start from the verified Stage 3 integration baseline.
3. Missing `src/contracts` or `src/mocks` in an audit-only branch does not automatically mean the full project lacks them.
4. Missing Stage 3 documents on a documentation branch does not automatically mean the project lacks them.
5. If branch classification is unclear, mark `needs verification` rather than guessing.

## Branch Mismatch Handling

If the current branch does not match the intended task:

1. stop before coding
2. record the current `pwd`, branch, and `git worktree list`
3. classify the current branch using this document
4. if the branch is audit-only, spec-only, or documentation-only, do not declare the product blocked
5. locate or request the verified integration baseline for implementation work
6. note the mismatch in the final report if the correct baseline could not be verified
