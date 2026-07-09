# Stage 3 Core Data

## Purpose

Stage 3 formalizes the app's data contracts after UI implementation and before persistence or backend integration.

## Working Branches

- `stage3/audit-data-flow`
- `stage3/data-contract-spec`
- `stage3/acceptance-checklist`
- `stage3/contracts-skeleton`

## Branch Rules

- `stage3/core-data-base` is the shared base branch.
- Do not run multiple Codex threads on the same branch.
- Each parallel task must use its own worktree and branch.
- Documentation tasks must not modify source code.
- Contract skeleton task must not modify UI/runtime behavior.

## Expected Deliverables

- `docs/stage-3/data-flow-audit.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`
- `src/contracts/*`
- `src/mocks/stage3MockData.ts`
