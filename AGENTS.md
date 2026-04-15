# AGENTS.md -- ai-companion-web execution rules

## 0. Scope

1. These rules apply to the current Git repository root and all child paths.
2. The current mainline scope is limited to:
   - `/`
   - `/talk`
   - `/room`
   - `/memory`
   - `/sleep-monitoring`
3. Unless a task explicitly requires it, do not expand into new product areas, backend integrations, or unrelated pages.

## 1. Repository Boundary Rules

1. All reads, writes, creates, moves, and deletes must stay inside this repository root.
2. Do not use the parent `Playground` directory as an implementation source of truth.
3. Do not create shadow copies, mirrored projects, or parallel worktrees outside this repository unless the user explicitly asks.

## 2. Task Startup Checklist

1. Confirm `pwd`.
2. Confirm `git rev-parse --show-toplevel`.
3. Only continue when both point to this repository root.
4. Read the current project rule docs before implementation:
   - `docs/SPEC.md`
   - `docs/ACCEPTANCE.md`
   - `docs/TRACKING.md`
   - `docs/HANDOFF.md`
5. When changing Next.js application code, read the relevant guide under `node_modules/next/dist/docs/` first because this repo may depend on mainline-specific behavior.

## 3. Rule Priority

1. `docs/SPEC.md`
2. `docs/ACCEPTANCE.md`
3. `docs/TRACKING.md`
4. `docs/HANDOFF.md`
5. Local inference

If two sources conflict, follow the higher-priority source and call out the conflict in the final report.

## 4. Change Rules

1. Keep changes tightly scoped to the active task.
2. Do not delete or rewrite existing page skeletons unless the task explicitly asks for it.
3. Shared navigation, placeholder shells, and common layout must be reused instead of duplicated.
4. If a shared component changes, report the affected routes and likely regression areas.

## 5. Current Mainline Intent

1. This repository is the active mainline for the web companion shell.
2. The current implementation target is a stable framework layer with placeholder pages and shared navigation.
3. Favor structure, consistency, and handoff quality over feature depth.
4. Avoid premature runtime complexity such as voice pipelines, analytics wiring, background syncing, or duplicated client state.

## 6. Verification Rules

Every implementation task should finish by running:

1. `npm run build`
2. `npm run lint`
3. `npm run type-check`

If any check fails, do not present the task as complete without calling out the failure.

## 7. Reporting Rules

Each implementation summary should state:

1. Modified files
2. Added files
3. Verification results for build, lint, and type-check
4. Any unverified assumptions
5. Any regression risk
6. Any impact to shared components or other routes

## 8. Source of Truth

1. Prefer this repository's code, config, and docs over assumptions.
2. Use `package.json`, `next.config.*`, and current source files as the technical baseline.
3. Use the docs in this repository as the project-process baseline.
4. Do not treat placeholder content as permission to remove project rules.
