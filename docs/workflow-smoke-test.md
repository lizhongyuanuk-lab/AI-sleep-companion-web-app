# Workflow Smoke Test

This file is used to verify the Codex Web → PR → local review → manual merge workflow.

Expected workflow:

1. Codex creates a branch.
2. Codex creates a PR or reviewable diff.
3. Human reviewer checks out the PR locally.
4. Human reviewer runs npm run review:pr.
5. Human reviewer runs npm run dev if needed.
6. Human reviewer merges manually only after approval.
