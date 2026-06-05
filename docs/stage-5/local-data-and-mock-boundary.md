# Local Data and Mock Boundary

## Purpose

This document defines the Stage 5 boundary between local data, mock data, and out-of-scope backend behavior. It prepares source implementation without adding runtime code.

## Definitions

| Term | Definition | Source |
| --- | --- | --- |
| Local data | Client-side state used to support Stage 3 flows before a real backend exists, including local draft recovery, session-scoped preset handoff, fixed config, and derived snapshots. | `product-logic.md`, `data-contract.md`, `coding-architecture-rules.md` |
| Mock data | Clearly labeled fixture data used to exercise contracts, fallback states, and page view models when real sources do not exist. | `acceptance-checklist.md`, `coding-architecture-rules.md`, `review-checklist.md` |
| Backend behavior | Server API, database, auth, production analytics provider, LLM provider, wearable integration, or real AI memory pipeline. It is out of scope for Stage 5 frontend wiring unless a later approved task creates an API boundary. | `README.md`, `coding-architecture-rules.md`, `page-logic/talk.md`, `page-logic/sleep-monitoring.md`, `page-logic/memory.md` |

## Storage Boundary Rules

| Object | Boundary | Stage 5 rule | Source |
| --- | --- | --- | --- |
| `OnboardingDraft` | Local data | Short-lived interruption recovery; recommended TTL is 12 hours; clear after onboarding completion; never a profile or Home/Sleep source. | `data-contract.md`, `page-logic/onboarding.md` |
| `OnboardingPreset` | Session-scoped local/persistent business object | Created on onboarding completion, active until consumed by first Talk or expired; not a long-term profile. | `product-logic.md`, `data-contract.md` |
| `OnboardingContextCard` | UI-only derived local object | May appear only as temporary Memory context; not a `MemoryItem` and not Talk/Sleep/Home personalization input. | `data-contract.md` |
| `RoomOption` | Fixed config | Stable local catalog of exactly three active options; onboarding cannot reorder/highlight. | `data-contract.md`, `page-logic/room.md` |
| `RoomView` | Auditable snapshot/local persistent object | Created on Room page view; must precede room selection. | `data-contract.md`, `page-logic/room.md` |
| `RoomSession` | Persistent business object | Created only when the user selects a room. | `data-contract.md`, `page-logic/room.md` |
| `TalkSession` and `ConversationMessage` | Persistent if represented locally | Session/message concepts stay separate from memory. | `data-contract.md`, `page-logic/talk.md`, `AGENTS.md` |
| `MemoryExtractionRun` | Persistent/run record or labeled mock | Idempotent run linked to `TalkSession`; skipped for `userMessageCount = 0`. | `data-contract.md`, `page-logic/talk.md` |
| `MemoryItem` | Persistent business object or labeled mock | Hidden and contradicted eligibility must be derived from canonical fields. | `product-logic.md`, `data-contract.md`, `page-logic/memory.md` |
| `MemoryFeedback` | Persistent business object | Created for Agree/Disagree/Hide and kept separate from resulting `MemoryItem` changes. | `product-logic.md`, `data-contract.md` |
| `SleepLog` | Persistent user-entered record | Manual check-in for last night; not passive monitoring. | `product-logic.md`, `data-contract.md`, `page-logic/sleep-monitoring.md` |
| `SleepInsight` | Derived snapshot | Must keep stable source trace once shown; not a medical report. | `product-logic.md`, `data-contract.md` |
| `HomeRecommendation` | Derived snapshot | One main recommendation with source trace and fallback kind; not a profile. | `product-logic.md`, `data-contract.md`, `page-logic/home.md` |

## Mock Labeling Rules

| Rule | Required wording/behavior | Source |
| --- | --- | --- |
| Label mock source | Mock fixtures and mock-derived view models must identify themselves as mock/local data in developer-facing docs or metadata. | `coding-architecture-rules.md` |
| Do not claim production wiring | Do not describe mocks as backend, database, auth, production analytics, real AI memory, or real LLM output. | `review-checklist.md`, `page-logic/talk.md` |
| Preserve trace | Mock recommendations, suggestions, and CTAs must still include source object IDs when contracts require them. | `data-contract.md`, `coding-architecture-rules.md` |
| Cover non-happy paths | Mocks must represent stale, expired, missing, partial, hidden, contradicted, fallback, and blocked cases when the page data depends on them. | `acceptance-checklist.md` |
| Document unresolved sources | If a real source is absent, mark it `unresolved`, `mock-only`, or `follow-up`; do not fill the gap with invented behavior. | `source-of-truth-map.md`, `coding-architecture-rules.md` |

## Expiry, Consumed, and Stale Behavior

| Concept | Handling | Source |
| --- | --- | --- |
| `OnboardingDraft.expiresAt` | Expired draft may be discarded or restarted; it must not become downstream personalization. | `data-contract.md` |
| `OnboardingPreset.status` | Persisted values are `active`, `consumed`, `expired`. | `data-contract.md` |
| `OnboardingPreset.stale` | Derived when active preset is past `expiresAt` or required fields are missing; treat as expired for routing. | `data-contract.md` |
| Active/unexpired preset | Route to Room through `RouteDecision`. | `product-logic.md`, `data-contract.md` |
| Consumed/expired/stale preset | Route to Home and degrade quietly. | `data-contract.md` |
| Hidden Memory | Exclude from Memory visible list, Talk personalization, Sleep suggestions, Home recommendations, and Room personalization. | `product-logic.md`, `data-contract.md`, `page-logic/memory.md` |
| Sleep data insufficiency | Use `collect_more_data`; do not fake trends. | `product-logic.md`, `page-logic/sleep-monitoring.md` |

## Page Consumption Boundary

| Page | May consume local/mock-shaped state | Must receive already-shaped view model | Notes |
| --- | --- | --- | --- |
| `/onboarding` | `OnboardingDraft`, fixed options, preset map | Yes, from `buildOnboardingExperience` | Component must not own persistence semantics. |
| `/room` | Fixed `RoomOption` config, active preset status, mock room trace | Yes, from `buildRoomExperience` | Route/page must not decide Room ranking. |
| `/home` | Derived Home context, mock recommendations, fallback data | Yes, from `buildHomeExperience` | Page must not read raw localStorage or manage fallback priority. |
| `/talk` | `TalkEntryContext`, mock conversation/session data, eligible memories | Yes, from `buildTalkExperience` | Mock conversation is not real LLM output. |
| `/sleep` planning label | Mock/local `SleepLog`, `SleepInsight`, `SuggestionRuleResult` | Yes, from `buildSleepExperience` | Runtime route remains unresolved against `/sleep-monitoring`. |
| `/memory` | Mock/local visible `MemoryItem` and feedback state | Yes, from `buildMemoryExperience` | Hide is not Delete. |

No component should directly own persistence semantics. No page should imply server sync. No mock item should be described as generated by a real model unless Stage 3 explicitly defines that source.

## Missing Local Data Fallback Behavior

| Missing data | Required fallback | Source |
| --- | --- | --- |
| Missing onboarding completion state | Resolve to `/onboarding` or mark `Needs Branch Verification` if state source is absent. | `product-logic.md`, `data-contract.md` |
| Missing active preset for Room | Use default direct/manual Room -> Talk behavior; do not fabricate preset. | `data-contract.md`, `page-logic/room.md` |
| Missing Home continuity | Use traceable `system_default_fallback` or `data_partial_fallback`; do not expose technical errors. | `data-contract.md`, `page-logic/home.md` |
| Missing `TalkEntryContext` | Use only a Stage 3-approved direct/default context or block with safe UI; do not infer personalization from unrelated local state. | `data-contract.md`, `page-logic/talk.md` |
| Missing Memory data | Show safe empty/mock state; do not claim backend sync or deletion. | `page-logic/memory.md` |
| Missing Sleep logs | Prompt first check-in or `collect_more_data`; do not generate trend. | `product-logic.md`, `page-logic/sleep-monitoring.md` |

## Review Checklist

| Check | PASS condition |
| --- | --- |
| Local data ownership | Persistence decisions live outside components and route shells. |
| Mock labeling | Mock/local fixtures are explicitly labeled. |
| Backend boundary | No page or component claims backend, database, auth, real AI memory, production analytics, wearable, or passive monitoring completion. |
| Source trace | Recommendations, suggestions, and CTAs keep source ID/fallback status where required. |
| Hidden memory | Hidden Memory is excluded from Talk, Sleep, Home, and visible Memory UI. |
| Preset lifecycle | Active/unexpired, consumed, expired, and stale states follow `data-contract.md`. |
| Missing data | Missing inputs degrade through documented fallback states, not silent product changes. |
