# Workflow Smoke Test v2

This file verifies that the local PR review workflow works with a real unmerged PR.

Expected workflow:

1. Create a branch.
2. Push the branch.
3. Create a GitHub PR with base main.
4. Run npm run review:pr locally.
5. Run npm run dev if needed.
6. Merge manually only after verification.
