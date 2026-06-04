# Stage 5 Implementation Plan

## Purpose

Stage 5 documentation prepares safe page-data wiring for the AI Sleep Companion web app after the Stage 3 product truth and Stage 4 architecture rules. It is planning documentation only. It does not implement product behavior, change runtime code, add routes, add backend APIs, or rewrite contracts.

## Task Classification

| Field | Value |
| --- | --- |
| Classification | `architecture-docs` |
| Scope | Implementation-planning docs only |
| Allowed write area | `docs/stage-5/` |
| Runtime source changes | Forbidden |

## Stage 5 Objective

Stage 5 defines the implementation map for wiring page data into view models while preserving:

| Truth | Required source |
| --- | --- |
| Product behavior | `docs/stage-3/product-logic.md` |
| Canonical contract names and fields | `docs/stage-3/data-contract.md` |
| Current runtime gap awareness | `docs/stage-3/data-flow-audit.md` |
| Acceptance gates | `docs/stage-3/acceptance-checklist.md` |
| Architecture dependency direction | `docs/engineering/coding-architecture-rules.md` |

## Non-Goals

| Non-goal | Reason |
| --- | --- |
| Implement source code | This task is documentation-only. |
| Modify `src/`, `app/`, or `components/` | Forbidden by task scope and `AGENTS.md`. |
| Invent product behavior | Stage 3 is locked product truth. |
| Invent backend APIs, persistence, auth, database, or real AI memory | Stage 4 says backend and real AI memory are not added by frontend architecture work. |
| Add new routes | Route scope is limited by `AGENTS.md`, `docs/stage-3/data-contract.md`, and `docs/engineering/source-of-truth-map.md`. |
| Convert mock/local behavior into backend behavior | `docs/engineering/coding-architecture-rules.md` requires mock-vs-real labeling. |
| Resolve source conflicts silently | Conflicts must be marked `Needs Product Decision`, `Needs Data Contract Alignment`, or `Needs Engineering Decision`. |

## Source-of-Truth Priority

| Priority | Source | Use |
| --- | --- | --- |
| 1 | `AGENTS.md` | Repository execution, branch, scope, and final delivery rules. |
| 2 | Stage 3 product docs | Product behavior, contracts, data flow, acceptance gates, page logic. |
| 3 | Stage 4 engineering docs | Folder responsibility, dependency direction, review standards. |
| 4 | Existing `src/` inventory | Factual implementation inventory only; it cannot override Stage 3. |

Stage 3 source order follows `docs/engineering/source-of-truth-map.md`: `product-logic.md` wins for product behavior, `data-contract.md` wins for field/type shape, `data-flow-audit.md` documents gaps, `acceptance-checklist.md` defines gates, and the concrete files under `docs/stage-3/page-logic/` bridge page behavior into contracts.

## Future Implementation Order

Future source-code work must follow this dependency direction from `docs/engineering/coding-architecture-rules.md`:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

| Step | Layer | Stage 5 expectation | Source |
| --- | --- | --- | --- |
| 1 | `contracts` | Verify existing Stage 3 names before adding or changing any type. No route/page may invent fields. | `data-contract.md`, `coding-architecture-rules.md` |
| 2 | `domain` | Keep pure decisions such as route resolution, memory eligibility, stale preset state, and Room handoff invariants outside React. | `data-contract.md`, `coding-architecture-rules.md` |
| 3 | `policies/config` | Put fixed catalogs and adjustable product priorities in stable modules. | `product-logic.md`, `coding-architecture-rules.md` |
| 4 | `experience` | Build page-facing view models, source traces, fallback kinds, and user action payloads. | `data-flow-audit.md`, `coding-architecture-rules.md` |
| 5 | `app` | Keep Next.js route shells thin; call experience builders and pass typed props. | `coding-architecture-rules.md` |
| 6 | `components` | Render typed props only; no product decisions or persistence semantics. | `coding-architecture-rules.md` |

## Forbidden Changes

| Area | Forbidden change | Source |
| --- | --- | --- |
| Product behavior | Adding direct Onboarding -> Talk, Room personalization from onboarding, Memory Delete, passive medical sleep tracking, Home feed/dashboard behavior | `product-logic.md`, `page-logic/onboarding.md`, `page-logic/room.md`, `page-logic/memory.md`, `page-logic/sleep-monitoring.md`, `page-logic/home.md`, `review-checklist.md` |
| Contracts | Renaming Stage 3 fields to match runtime/local storage keys | `data-contract.md`, `coding-architecture-rules.md` |
| Routes | Replacing canonical `"/home"` with runtime `"/"` or inventing `"/sleep"` as a new route without product decision | `data-contract.md`, `source-of-truth-map.md` |
| Components | Reading/writing localStorage or owning recommendation, eligibility, route, or fallback decisions | `coding-architecture-rules.md` |
| Pages | Holding complex business logic in React page files | `coding-architecture-rules.md` |
| Mock data | Presenting local mocks as backend, database, auth, analytics provider, or real AI memory wiring | `coding-architecture-rules.md`, `review-checklist.md` |

## Review Gates

| Gate | Required check | Source |
| --- | --- | --- |
| Source availability | Required Stage 3 and Stage 4 docs exist before coding. | `worktree-branch-map.md`, `source-of-truth-map.md` |
| Scope | Changed files match task classification. | `AGENTS.md`, `review-checklist.md` |
| Contract trace | Every page view model and action payload traces to Stage 3 contract names. | `data-contract.md` |
| Architecture | Dependency direction is preserved. | `coding-architecture-rules.md` |
| Mock boundary | Mock/local data is labeled and unresolved real sources are documented. | `coding-architecture-rules.md` |
| Route/handoff | `RouteDecision`, `OnboardingPreset`, `RoomSession`, and `TalkEntryContext` lifecycles are preserved. | `data-contract.md`, `page-logic/onboarding.md`, `page-logic/room.md`, `page-logic/talk.md`, `page-logic/home.md` |
| Verification | Runtime checks are run for implementation tasks; docs-only tasks state runtime checks were skipped. | `review-checklist.md` |

## Completion Criteria

| Criterion | Required result |
| --- | --- |
| Six Stage 5 docs exist | `docs/stage-5/*.md` files listed in this stage. |
| No runtime implementation | No `src/`, `app/`, `components/`, package, Stage 3, or Stage 4 docs changed by this task. |
| Page wiring map complete | `/onboarding`, `/room`, `/home`, `/talk`, `/sleep`, and `/memory` are mapped with source traces and unresolved route notes where needed. |
| Local/mock boundary explicit | Local data, mock data, and out-of-scope backend behavior are separated. |
| Handoff rules explicit | Cross-page navigation payloads and fallback behavior are traceable. |
| Review checklist ready | Future workers can verify implementation without redesigning product behavior. |

## Safe Handoff Into Source-Code Stage

It is safe to begin a later Stage 5 source implementation branch only when:

| Requirement | Status needed |
| --- | --- |
| Branch/worktree | Verified against `docs/engineering/worktree-branch-map.md`; not audit-only. |
| Stage 3 docs | Present on branch or restored from verified integration baseline. |
| Stage 4 rules | Present and read. |
| Task classification | Explicitly changed from docs-only to implementation class such as `data-wiring`. |
| Implementation plan | Starts from contracts/domain/policies/config/experience before routes/components. |
| Backend status | Marked unresolved or future unless an approved backend/API task exists. |
