# Route and Handoff Rules

## Canonical Route Rules

| Rule | Stage 5 requirement | Source |
| --- | --- | --- |
| Initial route decision | Use `RouteDecision`/entry resolver: incomplete onboarding -> `"/onboarding"`; active and unexpired `OnboardingPreset` -> `"/room"`; consumed/expired/stale/missing preset -> `"/home"`. | `product-logic.md`, `data-contract.md` |
| Canonical Home route | Preserve `"/home"` in contracts even if runtime compatibility still renders root `"/"`. | `data-contract.md`, `data-flow-audit.md` |
| Product route scope | Do not add routes outside `/`, `/onboarding`, `/talk`, `/room`, `/memory`, and `/sleep-monitoring` without source approval. | `AGENTS.md`, `source-of-truth-map.md` |
| Sleep route label | Requested Stage 5 `/sleep` is not a Stage 3 canonical route; current source map names `/sleep-monitoring`. Adding `/sleep` is unresolved/follow-up. | `AGENTS.md`, `source-of-truth-map.md`, `page-logic/sleep-monitoring.md` |

## Runtime Observed Path Handling

| Observed path | Canonical handling | Required note |
| --- | --- | --- |
| `/` | Compatibility surface for current first-launch/root runtime; canonical post-onboarding Home route remains `"/home"`. | Keep `runtimeObservedPath` diagnostic only. |
| `/home` | Canonical Home contract path. | Normal Stage 3 Home view model uses `canonicalHomePath: "/home"`. |
| `/onboarding` | Canonical onboarding route. | Render only when route decision permits onboarding or draft recovery. |
| `/room` | Canonical Room route. | Active/unexpired preset routes here; stale/expired preset should not. |
| `/talk` | Canonical Talk route. | Must receive valid `TalkEntryContext` or documented safe direct entry. |
| `/memory` | Product route. | No special route decision in Stage 3. |
| `/sleep-monitoring` | Product route from repository scope. | Stage 5 `/sleep` wording must not create a new route silently. |

## Route Decision States

| Input state | `RouteDecision.canonicalRoute` | `RouteDecision.reason` | `activePresetState` | Product behavior |
| --- | --- | --- | --- | --- |
| `hasCompletedOnboarding = false` | `"/onboarding"` | `onboarding_incomplete` | `none` or current derived state | Redirect/recover to onboarding. |
| Completed onboarding and active/unexpired preset exists | `"/room"` | `active_preset_redirect` | `active` | Redirect to Room for first-session handoff. |
| Completed onboarding and preset consumed | `"/home"` | `consumed_or_expired_preset_home` | `consumed` | Degrade quietly to Home. |
| Completed onboarding and preset expired | `"/home"` | `consumed_or_expired_preset_home` | `expired` | Degrade quietly to Home. |
| Completed onboarding and active preset is past `expiresAt` | `"/home"` | `consumed_or_expired_preset_home` | `stale` | Derived stale; do not redirect to Room. |
| Returning user with no active preset | `"/home"` | `returning_user_home` | `none` | Normal Home. |

Sources: `product-logic.md`, `data-contract.md`.

## Onboarding Completion Routing

| Step | Required behavior | Source |
| --- | --- | --- |
| User answers onboarding | Update `OnboardingDraft`. | `page-logic/onboarding.md` |
| User completes onboarding | Create active `OnboardingPreset`. | `product-logic.md`, `data-contract.md` |
| Continue after completion | Route through entry/route logic to Room. | `product-logic.md`, `page-logic/onboarding.md` |
| Forbidden | Direct Onboarding -> Talk, `TalkSession`, `RoomSession`, `MemoryItem`, `SleepLog`, `HomeRecommendation`, or room ranking. | `page-logic/onboarding.md` |

## Active Preset Routing

| Preset condition | Route behavior | Handoff behavior | Source |
| --- | --- | --- | --- |
| Active and unexpired | `/room` | Carry preset toward Room and then Talk. | `data-contract.md`, `page-logic/room.md` |
| Active but expired by `expiresAt` | `/home` | Treat as stale/expired; do not carry as active. | `data-contract.md` |
| Consumed | `/home` | Do not reuse for first Talk. | `data-contract.md` |
| Expired | `/home` | Do not show error; degrade quietly. | `data-contract.md`, `page-logic/room.md` |
| Required fields missing | `/home` | Derived stale; do not reconstruct. | `data-contract.md` |

## Room Selection Handoff

| Action | Required data | Source |
| --- | --- | --- |
| Enter Room | Create `RoomView` with route source. | `data-contract.md`, `page-logic/room.md` |
| Tap room | Create `RoomSession`. | `data-contract.md`, `page-logic/room.md` |
| Enter Talk from Room | Construct `TalkEntryContext` with `source: "room"`, intent `tap_from_room_after_onboarding` or `open_chat`, `roomId`, `roomSessionId`, optional `roomViewId`, and full active `OnboardingPreset` when present. | `product-logic.md`, `data-contract.md` |
| Forbidden | Passing only a preset ID and reconstructing a different preset later; creating `RoomSession` from page view; ranking room options from onboarding. | `page-logic/room.md` |

## Home CTA to Talk Handoff

| Rule | Required behavior | Source |
| --- | --- | --- |
| One CTA | Home has one main CTA for one main recommendation. | `data-contract.md`, `page-logic/home.md` |
| Target | Stage 3 normal Home CTA target is exactly `"/talk"`. | `data-contract.md` |
| Entry context | `HomeCTA.entryContext` is required. | `data-contract.md` |
| Source | `TalkEntryContext.source` must be `"home"`. | `data-contract.md` |
| Trace | `homeRecommendationId` must match the recommendation; include `memoryId` or `sleepInsightId` when relevant. | `data-contract.md` |
| Forbidden | Non-Talk Home CTAs in normal Stage 3 Home, full transcript payloads, raw memory-management payloads, visible diagnostic nav clusters. | `data-contract.md`, `page-logic/home.md` |

## Talk Entry Context Rules

| Source | Required fields | Notes | Source |
| --- | --- | --- | --- |
| `room` | `roomId`, `roomSessionId`, optional `roomViewId`, optional `onboardingPresetId`, full `onboardingPreset` when active | Used after room selection. | `data-contract.md`, `page-logic/room.md` |
| `home` | `homeRecommendationId`, optional source object ID fields | Home CTA always targets Talk. | `data-contract.md` |
| `memory` | `sourceId`, `memoryId`, approved intent such as `discuss_memory`, `gentle_start`, or `quiet_company` | Hidden memory cannot create CTA. | `product-logic.md`, `data-contract.md` |
| `sleep` | Optional `sleepInsightId`, intent `tonight_suggestion` or `sleep_reflection` | Must trace to Sleep source data when insight is involved. | `product-logic.md`, `data-contract.md` |
| `direct` | Approved direct/default context only | Must not infer personalization from unrelated data. | `data-contract.md` |

## Sleep Page Handoff Rules

| Case | Required behavior | Source |
| --- | --- | --- |
| Suggestion CTA target is Talk | Build `TalkEntryContext` with `source: "sleep"` and relevant `sleepInsightId`. | `product-logic.md`, `data-contract.md` |
| Suggestion CTA target is Room | Carry traceable `sleepInsightId` into Room entry/session source where supported. | `product-logic.md`, `data-contract.md` |
| Data insufficient | Use `collect_more_data`; do not invent a strong suggestion or fake trend. | `product-logic.md` |
| Forbidden | Direct onboarding-answer-to-sleep suggestion, passive tracking, medical-grade claims, hidden memory input. | `product-logic.md`, `page-logic/sleep-monitoring.md` |

## Memory Page Action Routing

| Action | Required behavior | Source |
| --- | --- | --- |
| Agree | Create `MemoryFeedback`; strengthen/confirm memory using contract fields. | `product-logic.md`, `data-contract.md`, `page-logic/memory.md` |
| Disagree | Create `MemoryFeedback`; mark contradiction or negative constraint. | `product-logic.md`, `data-contract.md`, `page-logic/memory.md` |
| Hide | Create `MemoryFeedback`; set hidden/exclusion fields; suppress visible item and future personalization. | `product-logic.md`, `data-contract.md`, `page-logic/memory.md` |
| Memory CTA to Talk | Build `TalkEntryContext` with `source: "memory"`, `sourceId`, `memoryId`, and approved intent. | `product-logic.md`, `data-contract.md` |
| Forbidden | Delete route/action, hidden memory CTA, Memory directly creating Talk session/Sleep log/Home recommendation. | `page-logic/memory.md` |

## Forbidden Redirects

| Redirect | Status | Source |
| --- | --- | --- |
| Onboarding directly to Talk | Forbidden | `product-logic.md`, `page-logic/onboarding.md` |
| Active/unexpired preset to Home normal render | Forbidden except defensive mismatch handling | `product-logic.md`, `data-contract.md` |
| Stale/expired preset to Room | Forbidden | `data-contract.md` |
| Home normal CTA to Memory/Room/Sleep | Out of scope after `HomeCTA` tightening; mark `Needs Product Decision` if requested. | `data-contract.md` |
| Creating `/sleep` as a new runtime route | Follow-up/product decision | `AGENTS.md`, `source-of-truth-map.md` |

## Failure and Fallback States

| Failure | Required fallback | Source |
| --- | --- | --- |
| Route source missing | Use safe direct/default route only if Stage 3 permits; otherwise mark unresolved. | `data-contract.md` |
| Active preset stale | Quiet Home fallback with diagnostic state. | `data-contract.md` |
| Home source object missing/stale | `data_partial_fallback` or `system_default_fallback`. | `data-contract.md`, `page-logic/home.md` |
| Home derivation error | `error_safe_fallback`; no technical user-facing error. | `page-logic/home.md` |
| Talk extraction failure | Record failed run; do not duplicate completed extraction. | `page-logic/talk.md` |
| Sleep insufficient data | `collect_more_data`. | `product-logic.md` |
| Memory hidden | Suppress visible item and all downstream personalization. | `product-logic.md`, `page-logic/memory.md` |
