# Stage 4 Application Architecture

## 1. Purpose

Stage 4 creates the engineering architecture layer for Stage 5 page implementation.

It does not redefine product behavior. Product logic, data contracts, data flow, page behavior, and acceptance rules remain locked by Stage 3.

Stage 4 answers one question:

How should the Next.js frontend organize implementation so the locked Stage 3 product model can be built without burying business rules in routes or UI components?

## 2. Source Status

Primary Stage 3 sources:

- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/data-flow-audit.md`
- `docs/stage-3/acceptance-checklist.md`
- `docs/stage-3/contract-implementation-notes.md`
- `docs/stage-3/page-logic/`

Current branch note:

- This Stage 4 worktree does not currently contain `docs/stage-3/` as files.
- The verified Stage 3 integration branch observed in this repository is `stage3/core-data-integration-v04`.
- The required Stage 3 documents are available in Git on that branch.
- Stage 5 workers should ensure the Stage 3 docs and `src/contracts` baseline are present in their implementation branch before coding page behavior.

If Stage 3 files are missing on a future branch, verify branch/worktree state before declaring the product blocked.

## 3. Product Surface

The V1 product surface remains:

- `/`
- `/onboarding`
- `/room`
- `/talk`
- `/memory`
- `/sleep-monitoring`

Stage 3 also uses canonical contract language for `/home`. Current runtime compatibility may still route the light default entry through `/`; implementation must not silently change the route contract. If route behavior needs alignment, mark the issue as a product or integration decision rather than improvising.

## 4. Layer Model

Required dependency flow:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

Layer responsibilities:

| Layer | Responsibility | Must not do |
| --- | --- | --- |
| `src/contracts` | Shared TypeScript contracts and primitives from Stage 3 | invent behavior or runtime fallbacks |
| `src/domain` | Pure business rules over contracts | import React, Next.js routes, components, API clients, browser storage |
| `src/policies` | Product decision logic derived from Stage 3 rules | hide product changes in UI code |
| `src/config` | Stable local catalogs and non-secret defaults | store secrets or user data |
| `src/experience` | Page-facing orchestration and view-model preparation | render React or fetch backend APIs directly |
| `src/mocks` | Clearly labeled local mock data and unresolved dependencies | claim mock data is production wiring |
| `app` | Next.js route entries and thin route setup | own business rules or contract creation |
| `components` | Presentational UI with typed props | call APIs or decide product policy |

## 5. Stage 3 Invariants Stage 4 Must Preserve

The architecture exists to protect these locked behaviors:

1. Onboarding creates a temporary `OnboardingPreset`; it is not a long-term profile.
2. Onboarding must not directly start Talk.
3. Onboarding must not recommend, rank, reorder, preselect, or highlight Room options.
4. Room displays fixed Room options and separates `RoomView` from `RoomSession`.
5. User tap on a room creates the Room-to-Talk handoff.
6. Talk consumes `TalkEntryContext`; Room after onboarding must carry the full preset, not only a preset ID.
7. Talk session, message, memory, and memory extraction are separate concepts.
8. Memory supports Agree, Disagree, and Hide; V1 does not expose Delete as canonical behavior.
9. Hidden memory is excluded from Talk, Sleep, and Home personalization.
10. Sleep check-in is user-entered reflection, not medical or passive automatic monitoring.
11. Sleep suggestions must not directly read onboarding answers.
12. Home is lightweight default entry with one main recommendation and one CTA, not a dashboard, feed, transcript, or manager page.
13. Mock data must remain clearly labeled when a real data source is undefined.

## 6. Implementation Shape

Stage 5 page implementation should use this pattern:

1. Contracts define the allowed data shapes.
2. Domain functions answer pure questions about those shapes.
3. Policies encode adjustable Stage 3 decision rules.
4. Config supplies stable catalogs and copy keys.
5. Experience builders combine contracts, domain, policy, config, and mocks into page view models.
6. Routes call experience builders and pass props.
7. Components render props and local UI state only.

Example:

```text
src/contracts/room.ts
src/config/room-options.ts
src/domain/room.ts
src/policies/room-policy.ts
src/experience/room-experience.ts
app/room/page.tsx
components/...
```

## 7. Mock and Backend Boundary

Stage 4 does not add backend, database, auth, deployment, or real AI memory implementation.

Until real data sources are defined:

- use `src/mocks`
- expose unresolved data needs as mock dependency labels
- keep mock behavior behind contracts
- state in summaries that behavior is mock/local only

Future backend communication must go through an approved frontend API boundary. Stage 4 does not create that backend boundary because no backend task is in scope.

## 8. Stage 5 Readiness

Stage 5 page implementation can begin only when:

1. Stage 3 source docs are present or accessible from the verified integration baseline.
2. The implementation branch includes the `src/` architecture scaffold.
3. Page workers read the relevant page spec pair and Stage 3 page-logic file.
4. Workers classify the task before coding.
5. Workers keep route/page changes thin and push product rules into domain, policy, config, or experience layers.
6. Validation commands are run and reported.

Current Stage 4 verdict is recorded in `docs/stage-4/coding-rules-completion-report.md`.
