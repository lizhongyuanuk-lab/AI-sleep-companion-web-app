# AI Sleep Companion Web

AI Sleep Companion Web is a mobile-first companion product for first launch, room selection, Talk, Memory, and Sleep Monitoring flows.

Current stack: Next.js, React, TypeScript.

Future backend target: Go Gin API.

## Workflow Stages

- Stage 3: data contract, audit, acceptance, skeleton
- Stage 4: engineering architecture, coding rules, review rules
- Stage 5: implementation
- Stage 6: Go Gin backend integration

## Documentation Map

Use this file as the entry point only. Detailed rules live in the linked documents.

- [AGENTS.md](AGENTS.md): repository execution rules for Codex workers
- [docs/stage-3/product-logic.md](docs/stage-3/product-logic.md): canonical Stage 3 product behavior baseline when present on the current branch
- [docs/stage-3/data-contract.md](docs/stage-3/data-contract.md): canonical data fields, states, and contract naming when present on the current branch
- [docs/stage-3/acceptance-checklist.md](docs/stage-3/acceptance-checklist.md): acceptance gates for Stage 3 and later implementation work when present on the current branch
- [docs/stage-4/application-architecture.md](docs/stage-4/application-architecture.md): Stage 4 architecture intent for this product
- [docs/engineering/source-of-truth-map.md](docs/engineering/source-of-truth-map.md): documentation hierarchy and conflict handling
- [docs/engineering/worktree-branch-map.md](docs/engineering/worktree-branch-map.md): branch and worktree safety rules
- [docs/engineering/coding-architecture-rules.md](docs/engineering/coding-architecture-rules.md): coding architecture rules for implementation work
- [docs/engineering/technical-review-writing-rules.md](docs/engineering/technical-review-writing-rules.md): required format for technical review output
- [docs/engineering/review-checklist.md](docs/engineering/review-checklist.md): what reviewers must check

If a Stage 3 or Stage 4 document is missing on the current branch, verify the current branch and worktree before treating it as a product gap.

## Local Development Commands

After installing dependencies, the available package scripts are:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run review:pr
npm run qa
```

## Branch Warning

Implementation branches should not be created from audit-only branches. Start implementation from the verified Stage 3 integration baseline, not from audit-only or documentation-only worktrees.
