# AGENTS.md -- ai-companion-web execution rules

## 0. Scope

1. These rules apply to the current Git repository root and all child paths.
2. The current V1 mainline scope is limited to:
   - `/`
   - `/talk`
   - `/room`
   - `/memory`
   - `/sleep-monitoring`
3. Unless a task explicitly requires it, do not expand into:
   - new product areas
   - new routes
   - backend platform migrations
   - design system rewrites
   - unrelated pages or experiments

---

## 1. Repository Boundary Rules

1. All reads, writes, creates, moves, and deletes must stay inside this repository root.
2. Do not use the parent `Playground` directory as an implementation source of truth.
3. Do not create shadow copies, mirrored projects, or parallel worktrees outside this repository unless the user explicitly asks.
4. Do not pull runtime implementation rules from external drafts, Downloads folders, screenshots, or copied notes unless the user explicitly asks to vendor them into this repository.

---

## 2. Source of Truth and Rule Priority

Page-specific source-of-truth mapping:

### `/`

1. `docs/FIRST_LAUNCH_SPEC.md`
2. `docs/FIRST_LAUNCH_UI_SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. current repository code and config
7. local inference

### `/talk`

1. `docs/SPEC.md`
2. `docs/TALK_UI_SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. current repository code and config
7. local inference

### `/room`

1. `docs/ROOM_SPEC.md`
2. `docs/ROOM_UI_SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. current repository code and config
7. local inference

### `/memory`

1. `docs/MEMORY_SPEC.md`
2. `docs/MEMORY_UI_SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. current repository code and config
7. local inference

### `/sleep-monitoring`

1. `docs/SLEEP_SPEC.md`
2. `docs/SLEEP_UI_SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. current repository code and config
7. local inference

### Shared rules

1. `docs/FIRST_LAUNCH_SPEC.md` and `docs/FIRST_LAUNCH_UI_SPEC.md` are the current first-launch PRD and UI baseline only.
2. `docs/SPEC.md` and `docs/TALK_UI_SPEC.md` are the current Talk PRD and UI baseline only.
3. `docs/ROOM_SPEC.md` and `docs/ROOM_UI_SPEC.md` are the current Room PRD and UI baseline only.
4. `docs/MEMORY_SPEC.md` and `docs/MEMORY_UI_SPEC.md` are the current Memory PRD and UI baseline only.
5. `docs/SLEEP_SPEC.md` and `docs/SLEEP_UI_SPEC.md` are the current Sleep PRD and UI baseline only.
6. Do not treat older in-repo drafts or external copies as runtime truth once these files are vendored.
7. If two sources conflict, follow the higher-priority source for the active page and explicitly report the conflict.
8. Do not silently resolve spec ambiguity by expanding product behavior.

---

## 3. Task Startup Checklist

Before implementation:

1. Confirm `pwd`.
2. Confirm `git rev-parse --show-toplevel`.
3. Only continue when both point to this repository root.
4. Read:
   - `AGENTS.md`
   - the active page's primary spec pair under `docs/`
   - `docs/ACCEPTANCE.md`
   - `docs/TRACKING.md`
   - `docs/HANDOFF.md`
5. When changing Next.js application code, read the relevant local Next.js guide under `node_modules/next/dist/docs/` first if framework behavior may matter.
6. Restate the active task before making code changes.

---

## 4. Mandatory Task Classification

Every task must be classified before coding as one of the following:

- `ui-only`
- `data-wiring`
- `api-contract`
- `bugfix`
- `content-only`
- `approved-refactor`

Rules:

1. Stay within the task class unless the user explicitly approves cross-scope work.
2. `ui-only` tasks must not change API shapes, route structure, or data contracts.
3. `data-wiring` tasks must not redesign page layout or visual hierarchy.
4. `api-contract` tasks must not silently change unrelated UI structure.
5. `approved-refactor` is only allowed when the user explicitly asks for refactoring.

---

## 5. Pre-Implementation Report Requirement

Before making changes, provide a short implementation report that includes:

1. task classification
2. task goal
3. allowed files to modify
4. likely files to inspect
5. forbidden files or areas
6. expected contract or data shape involved
7. assumptions or blockers

Do not start implementation until this report is internally consistent with the task.

---

## 6. Change Guardrails

1. Keep changes tightly scoped to the active task.
2. Do not delete or rewrite existing page skeletons unless the task explicitly asks for it.
3. Reuse shared navigation, placeholder shells, and common layout instead of duplicating them.
4. Do not change locked information architecture, route structure, layout structure, or base interaction rules unless the user explicitly approves a spec upgrade.
5. Do not refactor for elegance, preference, cleanup, or abstraction unless explicitly requested.
6. Do not rename core entities or concepts without explicit approval:
   - `user`
   - `room`
   - `session`
   - `message`
   - `memory`
7. Do not silently change field names, payload shapes, response structures, or type contracts.
8. Do not invent backend fields and present them as approved contract.
9. Do not convert mock structures into claimed production behavior without stating that clearly.
10. Do not expand placeholder content into speculative features.
11. If a shared component changes, explicitly report:
   - affected routes
   - likely regression areas
   - whether the change was necessary

---

## 7. Data and Contract Discipline

1. Treat `session`, `message`, and `memory` as separate concepts unless the spec explicitly merges them.
2. Preserve approved contract naming.
3. If contract details are unclear:
   - prefer preserving current shapes
   - add a clearly marked TODO or assumption
   - report the ambiguity
4. Do not replace structured contract gaps with local guesswork that could cascade into rework.
5. If a task requires backend behavior that does not exist yet, clearly separate:
   - current mock behavior
   - expected real behavior
   - missing backend dependency

---

## 8. Current Mainline Intent

1. This repository is the active mainline for the web companion shell.
2. `docs/FIRST_LAUNCH_SPEC.md` and `docs/FIRST_LAUNCH_UI_SPEC.md` are the current source of truth for the first-launch flow on `/`.
3. `docs/SPEC.md` and `docs/TALK_UI_SPEC.md` are the current source of truth for Talk behavior and UI.
4. The current implementation target is to align the Next.js app to the vendored first-launch, Talk, Room, Memory, and Sleep documents in a controlled way.
5. Favor structure, consistency, reviewability, and handoff quality over speculative feature expansion.
6. Prefer small, reviewable changes over broad rewrites.

---

## 9. Verification Rules

Every implementation task should finish by running:

1. `npm run build`
2. `npm run lint`
3. `npm run type-check`

Rules:

1. If any check fails, do not present the task as complete.
2. If a check cannot run, explicitly state why.
3. If verification is skipped, explicitly state that it is unverified.

---

## 10. Final Delivery Report Requirement

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

---

## 11. Non-Negotiable Reviewability Rules

1. Prefer small patches over broad rewrites.
2. Prefer explicit wiring over hidden magic.
3. Preserve page structure when the task is only data hookup.
4. Preserve contract shape when the task is only UI work.
5. If a requested implementation appears to conflict with the locked spec, stop expansion and report the conflict instead of improvising a new product decision.

---

## 12. Technical Baseline

1. Prefer this repository's code, config, and docs over assumptions.
2. Use `package.json`, `next.config.*`, and current source files as the technical baseline.
3. Keep the authoritative spec inside this repository.
4. Do not treat placeholder content as permission to remove project rules.

---

## 13. Document Layer Separation

1. `AGENTS.md` only defines repository-level execution rules, scope control, reporting rules, and verification discipline.
2. Product definitions such as page responsibilities, page-to-page flows, data structures, API contracts, state models, and data sources must live in product docs such as PRD, non-UI delivery docs, or UI spec docs.
3. Task-specific implementation instructions such as:
   - which page section to modify
   - which files are allowed in the current task
   - what is mock vs real in the current round
   - what should be completed in this round only
   must not be treated as long-term repository rules; they belong in the current task brief or prompt.
4. Review standards for evaluating whether a visual effect is successful or unsuccessful must not be embedded into repository-wide rules unless they are generic and durable. Page-specific visual review criteria belong in a separate review rubric.
5. If a rule appears to belong to more than one layer, prefer the narrower and more local document rather than overloading `AGENTS.md`.

---

## 14. Mock vs Real Behavior Discipline

1. Any implementation that uses mock data, placeholder state, simulated runtime, or local demo behavior must be explicitly identified as mock.
2. Mock behavior must never be reported as completed production behavior.
3. If a page currently renders from local config or front-end constants rather than backend contract, this must be stated explicitly in the implementation summary.
4. If a task is `ui-only`, mock data is allowed, but it must not silently hard-code business rules that belong to backend or contract definitions.
5. If current behavior is only a visual/demo state machine and not a real runtime implementation, the final report must say so explicitly.

---

## 15. UI Task Boundary Discipline

1. A `ui-only` task is not permission to infer or redefine business logic.
2. A `ui-only` task may implement layout, component structure, visual hierarchy, and mock state shells, but must not silently define:
   - session creation timing
   - memory write timing
   - backend payload shapes
   - runtime audio behavior
3. If UI spec defines visual result but not data source, the implementation must preserve mock boundaries and report the missing product definition rather than inventing a permanent data source.
4. If a page requires data-dependent UI and the data source is not yet defined in product docs, the implementation must:
   - use clearly labeled mock data
   - avoid implying that real wiring is complete
   - report the unresolved dependency
