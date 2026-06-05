# Stage 5 Source Trace Checklist

## Review Verdict Vocabulary

| Verdict | Meaning |
| --- | --- |
| PASS | The work is fully source-traced, scoped, and ready for the next approved step. |
| PASS WITH FOLLOW-UP | The work is acceptable, with documented unresolved/follow-up items that do not block the current scope. |
| PARTIAL | Some required areas are complete, but the work is not sufficient for handoff or implementation. |
| BLOCKER | A source, scope, architecture, contract, route, or mock/real boundary violation must be fixed before proceeding. |

## Task Classification Check

| Check | PASS condition | BLOCKER example |
| --- | --- | --- |
| Classification stated | Worker states one allowed classification before changes. | Source code changed during `architecture-docs`. |
| Changed files match class | Docs-only tasks change only allowed docs. | `src/` modified in a docs-only task. |
| Route scope unchanged | No new product route is added without source. | New `/sleep` route added without product source. |
| Stage scope unchanged | Stage 5 docs prepare implementation only. | Backend migration/API added during planning. |

## Source Document Availability Check

| Check | PASS condition | BLOCKER example |
| --- | --- | --- |
| Stage 3 docs | Required Stage 3 files exist and are read. | Stage 3 docs missing from branch. |
| Stage 4 docs | Required engineering docs exist and are read. | Stage 4 architecture rules ignored. |
| Page logic | Page-specific data behavior cites Stage 3 docs or page logic. | Product behavior invented outside Stage 3. |
| Conflict handling | Conflicts are marked with the standard labels. | Worker silently resolves `/home` vs `/` by changing contract route. |

## Page Wiring Correctness Check

| Page | Required checks | Source |
| --- | --- | --- |
| `/onboarding` | Uses `OnboardingDraft` and `OnboardingPreset`; does not create Talk, RoomSession, Memory, Sleep, or Home objects; does not rank Room. | `page-logic/onboarding.md`, `data-contract.md` |
| `/room` | Keeps `RoomOption`, `RoomView`, and `RoomSession` distinct; creates session only on room tap; carries full preset when active. | `page-logic/room.md`, `data-contract.md` |
| `/home` | Uses canonical `"/home"` contract; one main recommendation; one Talk CTA; fallback/source trace explicit. | `page-logic/home.md`, `data-contract.md` |
| `/talk` | Uses `TalkEntryContext`; keeps session/message/memory/extraction separate; idempotent extraction. | `page-logic/talk.md`, `data-contract.md` |
| `/sleep` planning label | Preserves `/sleep-monitoring` product route unless approved; uses `SleepLog`, `SleepInsight`, `SuggestionRuleResult`; no passive/medical claims. | `page-logic/sleep-monitoring.md`, `source-of-truth-map.md` |
| `/memory` | Supports Agree/Disagree/Hide; keeps `MemoryFeedback` separate; no Delete; hidden exclusion enforced. | `page-logic/memory.md`, `data-contract.md` |

## Route and Handoff Check

| Check | PASS condition | BLOCKER example |
| --- | --- | --- |
| `RouteDecision` | Incomplete onboarding -> `/onboarding`; active/unexpired preset -> `/room`; consumed/expired/stale/missing preset -> `/home`. | Stale active preset redirects to Room. |
| Home CTA | Normal Home CTA targets `"/talk"` with required `TalkEntryContext`. | Home normal CTA targets Memory/Room/Sleep without product source. |
| Room -> Talk | `roomId`, `roomSessionId`, optional `roomViewId`, and full active preset are carried when present. | Room passes only preset ID and rebuilds a different preset. |
| Memory -> Talk | Eligible active memory only; hidden memory cannot create CTA. | Hidden memory creates Talk handoff. |
| Sleep -> Talk/Room | Suggestion handoff is traceable to `SleepInsight`/`SleepLog` where applicable. | Sleep suggestion uses raw onboarding answers. |

## Mock and Local Boundary Check

| Check | PASS condition | BLOCKER example |
| --- | --- | --- |
| Mock labels | Mock/local data is explicitly labeled. | Mock behavior presented as real backend/model behavior. |
| Backend boundary | No claims of backend, database, auth, production analytics, wearable, passive monitoring, or real AI memory. | Page says local mock Memory came from real model. |
| Persistence ownership | Components do not read/write localStorage or own persistence semantics. | React component directly writes complex business state to localStorage. |
| Missing data | Missing/stale data maps to explicit fallback. | Silent fallback changes product flow. |
| Hidden memory | Hidden memory is excluded from all personalization and recommendations. | Hidden memory influences Talk/Sleep/Home. |

## Architecture Dependency Check

| Layer | PASS condition | BLOCKER example |
| --- | --- | --- |
| `contracts` | Types preserve Stage 3 names/fields. | Contract field renamed to match runtime storage. |
| `domain` | Pure business decisions import contracts only. | Domain imports React or components. |
| `policies/config` | Product priorities and fixed catalogs live outside pages/components. | Component performs domain/policy decisions. |
| `experience` | Builds typed page view models and preserves source trace. | Route shell builds recommendation priority inline. |
| `app` | Thin Next.js route/page shell. | React page reads localStorage directly for complex business state. |
| `components` | Presentational typed props and local UI state only. | Component decides memory eligibility or preset routing. |

Required dependency direction:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

## Forbidden-Area Check

| Area | PASS condition | BLOCKER example |
| --- | --- | --- |
| Docs-only tasks | Only approved docs changed. | `src/` modified in a docs-only task. |
| Stage 3 docs | Not edited unless the task is Stage 3 source restoration or explicitly approved. | Stage 3 product truth rewritten during Stage 5 planning. |
| Stage 4 docs | Not edited unless architecture-doc task explicitly requires it. | Stage 4 rules changed to fit planned code. |
| Backend/API | No new API contract unless task classification is `api-contract`. | New backend endpoint invented. |
| Routes | No new route without product source. | New route added because it was convenient. |

## Required Reviewer Output

| Section | Required content |
| --- | --- |
| Verdict | PASS, PASS WITH FOLLOW-UP, PARTIAL, or BLOCKER. |
| Scope | Task classification and changed-file scope. |
| Sources | Stage 3 and Stage 4 docs used. |
| Page wiring | Page-by-page trace to Stage 3. |
| Route/handoff | Route decisions and payloads checked. |
| Mock/local boundary | Mock labels and unresolved backend status checked. |
| Architecture | Dependency direction and layer ownership checked. |
| Commands | Validation commands and results. |
| Follow-ups | Only unresolved items that are not blockers. |
