# Local PR Review Workflow

## Purpose

This repository uses a local PR review workflow to keep changes reviewable and prevent accidental merge automation.

## Required Flow

Codex Web 改代码 -> GitHub PR -> 本地 `npm run review:pr -- <pr-number|branch-name> [base-branch]` -> `npm run dev` -> 人工视觉验收 -> 人工 merge

## Review Rules

1. Start from a feature branch and open a GitHub PR before final acceptance.
2. Run `npm run review:pr -- <pr-number|branch-name> [base-branch]` locally. The default base branch is `main`.
3. After technical checks pass, run `npm run dev` and complete manual visual QA.
4. Manual review must cover desktop, mobile, first launch, returning user, loading, empty, error, animation, and console errors when UI is affected.
5. Merge is always manual. Do not auto-merge.

## What `npm run review:pr` Does

1. Stops immediately if the working tree is dirty.
2. Fetches `origin/<base-branch>`.
3. Checks out the review target from a PR number or branch name.
4. Prints the current branch, latest commit, changed files, and diff stat.
5. Installs dependencies with `npm ci` when `package-lock.json` exists, otherwise `npm install`.
6. Runs `npm run lint`.
7. Runs `npm run build`.
8. Prompts the reviewer to continue with `npm run dev` for manual visual acceptance.

## Required Review Output

Every completed implementation or review handoff should report:

- Branch
- PR
- Summary
- Changed files
- Commands run
- Technical check result
- Local verification steps
- Visual QA checklist
- Known risks
- Merge status
