# Stage 3 Data Flow Audit

## 0. Audit scope

- Worker: A data-flow audit
- Allowed edit scope: this file only
- Primary source of truth for this audit: `docs/stage-3/product-logic.md`
- Secondary Home-specific reference: `docs/stage-3/page-logic/home.md`
- Runtime baseline inspected: current Next.js app implementation under `app/` and `lib/`

This audit compares current runtime data flow with the Stage 3 product logic described in `docs/stage-3/product-logic.md`.

Important ambiguity:

- The task asks for `product-logic.md v0.4`, but the current file header says `v0.3`.
- This audit uses the current repository file contents as the effective primary source and flags the version mismatch as a source-alignment risk.

## 1. Product logic source alignment

### 1.1 Source priority used for this audit

This audit treats `docs/stage-3/product-logic.md` as the primary source of truth and `docs/stage-3/page-logic/home.md` as a secondary Home-specific reference, per the worker brief.

How `home.md` is used here:

- to expand Home page intent, recommendation principles, fallback rules, and page boundaries
- to clarify Home-specific language where `product-logic.md` is broad
- not to override product-wide rules defined in `product-logic.md`

### 1.2 Conflicts and ambiguities between `product-logic.md` and `home.md`

| Item | `product-logic.md` | `home.md` | Audit conclusion |
| --- | --- | --- | --- |
| Source priority | Worker brief says product logic wins; product doc is the product-wide baseline | Section 1 says `home.md` is Home truth priority `1`, `product-logic.md` priority `2` | Conflict. This audit follows the worker brief and treats `product-logic.md` as higher priority. |
| Version | Header says `v0.3` | No matching version banner | Ambiguous. Task says audit against `v0.4`, but repo content does not expose that version. |
| Canonical Home route | App Entry Resolver returns `"/home"` | Home App Entry section also returns `"/home"` | Internally aligned in Stage 3 docs, but conflicts with current runtime and broader repo route reality where root `"/"` is the entry route and no `app/home` route exists. |
| Home fallback types | Product logic explicitly keeps `complete_onboarding` and `enter_room` only for defensive fallback | Home PRD also frames entry-guard redirect and fallback, but does not define a concrete type enum | No direct contradiction, but `home.md` depends on missing data-contract alignment for exact fields. |
| Recommendation shape | Product logic defines a concrete `HomeRecommendation` TS type | Home PRD says exact TS shape belongs to data-contract layer | Tension, not fatal conflict. Product logic is currently the more concrete source. |

### 1.3 Broader repo ambiguity relevant to Home

- `AGENTS.md` and mainline page mapping treat `"/"` as the first-launch route family, not `"/home"`.
- Stage 3 product docs treat `"/home"` as the post-onboarding lightweight default entry.
- Current runtime still renders first-launch flow on `"/"` and does not expose a dedicated `"/home"` route.

## 2. Home / app entry flow audit

### 2.1 Canonical product flow

From the current Stage 3 product logic:

- first launch or onboarding incomplete -> `/onboarding`
- onboarding complete with active onboarding preset -> `/room`
- onboarding complete with consumed or expired preset -> `/home`
- returning user without active preset -> `/home`

Home product rules in Stage 3:

- one main recommendation
- one main CTA
- lightweight continuity only
- traceable recommendation
- no transcript-heavy or dashboard-like default entry

### 2.2 Current runtime route behavior

Current runtime behavior does not implement the Stage 3 App Entry Resolver:

- `app/page.tsx` renders `FirstLaunchFlow` directly on `"/"`
- there is no `app/onboarding/page.tsx`
- there is no `app/home/page.tsx`
- `FirstLaunchFlow` redirects completed first-launch users to `"/room"`, not to Home
- Room then writes Talk entry context and pushes to `"/talk?scene=..."`

### 2.3 Scenario audit

| Scenario | Canonical Stage 3 route | Current runtime route | Runtime status | Notes |
| --- | --- | --- | --- | --- |
| first launch | `/onboarding` | `"/"` renders `FirstLaunchFlow` | partially implemented | Runtime has first-launch questions and result flow, but no dedicated `/onboarding` route and no App Entry Resolver. |
| returning user | `/home` | usually `"/"` first, then possible redirect to `/room` if first-launch completed flag is true | documented product logic only | No runtime Home route or Home recommendation resolver exists. |
| onboarding incomplete | `/onboarding` | `"/"` `FirstLaunchFlow` | partially implemented | Behavior exists, route shape differs. |
| active onboarding preset | `/room` | `"/room"` after first-launch completion | implemented in runtime | Room reads active preset from localStorage and can consume it on Talk entry. |
| canonical Home route | `/home` | none | documented product logic only | No `app/home` route exists. |
| fallback behavior | `system_default` or defensive fallback when Home is entered unsafely | redirect card inside first-launch flow, Room default room fallback, Talk default scene fallback | partially implemented | Fallbacks exist for first-launch/room/talk, not for Stage 3 Home recommendation. |
| Home-to-Talk entry context | `HomeRecommendationClickPayload` may carry `talkEntryContext` | none | ambiguous / missing | Home does not exist in runtime, so there is no Home -> Talk payload. |

### 2.4 One main recommendation and CTA

Canonical Stage 3 Home:

- one main recommendation
- one main CTA
- small supporting navigation only

Current runtime:

- no Home recommendation surface exists
- no runtime `HomeRecommendation` snapshot exists
- no Home CTA payload or click tracking exists

Conclusion:

- canonical one-recommendation model is documented product logic only

## 3. Current runtime gap analysis

Classification legend:

- implemented in runtime
- documented product logic only
- partially implemented
- ambiguous / missing

| Requirement | Current runtime evidence | Classification | Audit note |
| --- | --- | --- | --- |
| App Entry Resolver decides between onboarding, room, home | No resolver object or function in runtime; root page always mounts `FirstLaunchFlow` | documented product logic only | Core Stage 3 entry logic is not implemented. |
| dedicated onboarding route | No `app/onboarding/page.tsx` | documented product logic only | First-launch behavior exists, but route contract differs. |
| dedicated Home route | No `app/home/page.tsx` | documented product logic only | Canonical Home target is absent. |
| first-launch two-question preset generation | `app/first-launch-flow.tsx` + `lib/first-launch.ts` | implemented in runtime | Runtime generates a preset and stores it locally. |
| active preset redirects to Room instead of Talk | `FirstLaunchFlow` completes into `/room`; Room writes Talk entry context only after room tap | implemented in runtime | Matches Stage 3 first-night chain intent. |
| Room reads active preset and passes full entry context to Talk | `app/room/page.tsx` writes `firstLaunchTalkEntryContext` and marks preset consumed | implemented in runtime | Payload is localStorage-based, not a typed route payload. |
| Talk consumes entry context | `app/talk/talk-shell.tsx` reads `readFirstLaunchTalkEntryContext()` on mount | implemented in runtime | Current use is first-launch context only, not Home/Memory/Sleep entry sources. |
| HomeRecommendation snapshot with stable id/source/sourceId | none | documented product logic only | No runtime model or store. |
| one main Home recommendation | none | documented product logic only | No runtime Home surface. |
| Home recommendation traceability events | none | documented product logic only | No `home_recommendation_viewed` or `clicked`. |
| Home reads visible Memory only | Home absent | ambiguous / missing | Product rule exists, no runtime consumer. |
| Home reads Tonight's suggestion from Sleep | Home absent | documented product logic only | Sleep mock data can express suggestion payloads, but Home does not read them. |
| Home fallback to system default | Home absent | documented product logic only | No runtime fallback surface for Home. |
| Hidden/disagreed/expired/blocked memory excluded from Home | Home absent | documented product logic only | No Home candidate logic exists to verify. |
| hidden memory excluded from downstream recommendation context generally | Product rule only; runtime Memory page uses local `is_deleted` and delete demo state | partially implemented | Runtime demo delete behavior is not the Stage 3 Hide/Disagree model. |
| Memory page supports Agree / Disagree / Hide only | runtime supports local Agree + Delete | partially implemented | Runtime conflicts with product logic: V1 should not expose Delete. |
| Sleep suggestion traceability | mock `target_payload` in `sleep-page-data.ts` | partially implemented | Mock payload exists, but no persisted `SleepInsight` snapshot wiring. |
| Home-to-Talk payload with `homeRecommendationId` | none | ambiguous / missing | Product contract not represented in runtime. |

## 4. Cross-page dependencies relevant to Home

Home is supposed to be a lightweight consumer of upstream state, not the owner of those domains.

| Dependency | Product logic expectation | Current runtime reality | Audit outcome |
| --- | --- | --- | --- |
| onboarding | Home only checks completion and active preset gate; it must not re-run onboarding logic | root route still owns first-launch UI directly | Home dependency not implemented because Home is absent and root still behaves like onboarding shell. |
| Talk / conversation | Home may recommend returning to Talk and should pass minimal traceable context | Talk only receives first-launch room context today; no Home-origin Talk context | Home-to-Talk dependency missing. |
| Room | Home may route back to Room as next-best action | Room runtime exists and is the post-first-launch landing page | Upstream room dependency is runtime-ready, but Home never uses it. |
| Sleep | Home may read Tonight's suggestion or check-in need | Sleep page uses local mock data and local CTA payloads only | Dependency exists only as mock page data, not shared Home input. |
| visible Memory | Home may read lightweight visible continuity only | Memory page is local mock data with local Agree/Delete UI; no shared selector for Home | Dependency missing and current Memory runtime is not contract-clean. |
| recommendation priority | Home should choose one recommendation from prioritized candidates | no candidate derivation or ranking exists in runtime | Product logic only. |

## 5. Forbidden / excluded data audit

### 5.1 Product logic rules

Product logic explicitly forbids Home recommendation sources from including:

- hidden memory
- disagreed memory
- expired memory
- blocked memory
- raw transcripts
- full sleep reports as Home default content
- full Memory management objects
- Room browsing feeds as Home replacement

Supporting product findings:

- `excludeFromPersonalization = true` memory must not enter Talk prompt, retrieval context, Sleep suggestion input, or Home recommendation candidate source
- Home must not become a transcript page, memory management page, dashboard, or room browsing feed

### 5.2 Current runtime evidence

| Excluded data | Runtime evidence | Audit status |
| --- | --- | --- |
| hidden memory | no runtime hide model found | ambiguous / missing |
| disagreed memory | no runtime disagree model found | ambiguous / missing |
| expired memory | preset expiry exists for onboarding preset, not for memory | ambiguous / missing |
| blocked memory | no runtime blocked-memory concept found | ambiguous / missing |
| raw transcripts on Home | Home absent; Talk main surface is not transcript-first | documented product logic only for Home |
| full sleep reports on Home | Home absent | documented product logic only |
| Memory management objects on Home | Home absent | documented product logic only |
| Room browsing feeds on Home | Home absent | documented product logic only |

Important runtime deviation outside Home:

- Memory runtime still exposes local `Delete`, which is not allowed by Stage 3 product logic where V1 should use `Agree / Disagree / Hide` instead.

## 6. Storage / persistence audit

### 6.1 Product logic position

`product-logic.md` is not storage-agnostic. It defines storage intent by layer:

- local draft for interrupted page progress
- session store for `OnboardingSessionPreset`
- persistent store for `RoomSession`, `TalkSession`, `MemoryItem`, `MemoryFeedback`, `SleepLog`
- derived snapshot store for `SleepInsight`, `HomeRecommendation`
- derived runtime for ephemeral view models

It also states:

- `MemoryFeedback` must persist across days
- `SleepInsight` and `HomeRecommendation` can be recomputed, but once exposed they need stable identifiers for traceability

### 6.2 Current runtime storage facts

No `sessionStorage` usage was found.

Current `localStorage` usage found:

| Key | Runtime purpose | Layer compared with Stage 3 |
| --- | --- | --- |
| `ai-companion-web.first-launch.completed` | first-launch completion flag | local runtime flag, approximates onboarding completion |
| `ai-companion-web.first-launch.draft` | interrupted first-launch progress | matches local draft idea |
| `ai-companion-web.first-launch.preset` | stored post-onboarding preset with TTL/status | approximates session-store preset |
| `ai-companion-web.first-launch.generation-draft` | personal room generation draft | local draft |
| `ai-companion-web.first-launch.generated-room` | generated room record with retention timestamp | local pseudo-persistent demo object |
| `ai-companion-web.auth-status` | guest/auth flag | local runtime flag |
| `ai-companion-web.first-launch.talk-entry-context` | Room -> Talk handoff | local runtime navigation bridge |
| `ai-companion-web.active-room` | last active Room selection | local UI preference |
| `ai-companion-web.last-entered-room` | last entered room | local UI preference/history |
| `ai-companion-web.room-swipe-hint-dismissed` | dismisses room hint | local UI preference |
| `ai-companion-web.active-scene` | active Talk scene | local UI preference |
| `ai-companion-web.talk-sound-settings` | Talk sound controls | local UI preference |

### 6.3 What is not implemented yet

Not found in current runtime:

- persistent `MemoryFeedback`
- persistent `RoomSession`
- persistent `TalkSession`
- persistent `SleepLog`
- persisted or snapshot-stable `SleepInsight`
- persisted or snapshot-stable `HomeRecommendation`
- any shared store selector for Home recommendation candidates

### 6.4 Runtime facts vs proposed Stage 3 persistence

Runtime facts:

- current persistence is entirely browser-local and mostly `localStorage`
- runtime uses storage for onboarding, room preference, scene preference, and Talk sound preference
- current Room -> Talk handoff is storage-mediated rather than route-payload mediated

Proposed Stage 3 persistence from product logic:

- `OnboardingSessionPreset` should behave like a session-scoped object
- `MemoryFeedback` should be persistent
- `SleepInsight` should be a traceable derived snapshot
- `HomeRecommendation` should be a traceable derived snapshot with stable `id`

Conclusion:

- current runtime storage supports demo continuity, not the Stage 3 contract/persistence model

## 7. Field inventory

| Domain | Field / concept | Source | Runtime consumer file if any | Required for Stage 3 contract | Current status | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| App Entry | `hasCompletedOnboarding` | product-logic, runtime analogue | `app/page.tsx`, `app/first-launch-flow.tsx` | yes | partially implemented via `first-launch.completed` flag | Route contract mismatch between `/onboarding`/`/home` and current `/`. |
| App Entry | `activeOnboardingPreset` | product-logic, home.md, runtime | `app/room/page.tsx`, `app/first-launch-flow.tsx` | yes | implemented in runtime as `PostOnboardingSessionPreset` | Naming and lifetime differ from Stage 3 canonical `OnboardingSessionPreset`. |
| App Entry | `hasUsableHomeRecommendation` | product-logic | none | yes | missing | Home route selection cannot match Stage 3 resolver. |
| Onboarding | `OnboardingSessionPreset` | product-logic | runtime analogue in `lib/first-launch.ts` | yes | partially implemented | Runtime type differs and is localStorage-backed. |
| Onboarding | preset `status` active/consumed/expired | product-logic, runtime | `lib/first-launch.ts`, `app/room/page.tsx` | yes | implemented in runtime | Good first-night gating, but not yet connected to Home. |
| Room | `RoomOption[]` fixed options | product-logic | `app/room/room-config.ts`, `app/room/page.tsx` | yes | implemented in runtime | Runtime appears richer than current Stage 3 fixed-three-room wording. |
| Room -> Talk | `TalkEntryContext` | product-logic, runtime | `app/room/page.tsx`, `app/talk/talk-shell.tsx` | yes | partially implemented | LocalStorage handoff works, but payload shape is not canonical route contract. |
| Talk | `homeRecommendationId` on Home -> Talk entry | product-logic | none | yes | missing | Home traceability would be lost. |
| Memory | `MemoryItem` visible/lightweight continuity | product-logic, home.md, runtime mock | `app/memory/page.tsx`, `app/memory/memory-page-data.ts` | yes | partially implemented | Current runtime uses mock data and local Delete behavior. |
| Memory | `MemoryFeedback` | product-logic | none | yes | missing | Downstream Talk/Sleep/Home feedback loop cannot be trusted. |
| Memory | hidden/disagreed/blocked exclusion | product-logic, home.md | none | yes | missing | Recommendation contamination risk. |
| Sleep | `SleepInsight` | product-logic, runtime mock analogue | `app/sleep-monitoring/sleep-page-data.ts`, `app/sleep-monitoring/sleep-shell.tsx` | yes | partially implemented | Mock page data exists, but no snapshot lifecycle or shared store. |
| Home | `HomeRecommendation.id` | product-logic | none | yes | missing | No recommendation traceability. |
| Home | `HomeRecommendation.type` | product-logic | none | yes | missing | No recommendation derivation. |
| Home | `HomeRecommendation.source` | product-logic, home.md | none | yes | missing | No upstream provenance tracking. |
| Home | `HomeRecommendation.sourceId` | product-logic, home.md | yes | missing | High review risk because traceability is a core rule. |
| Home | `HomeRecommendation.cta.target` | product-logic, home.md | none | yes | missing | No canonical Home handoff payload. |
| Home | one main recommendation | product-logic, home.md | none | yes | missing | Core Home behavior absent. |
| Home | recommendation events | product-logic | none | yes | missing | Retention and analytics loop cannot validate Home. |
| Runtime storage | `localStorage` onboarding draft/preset keys | runtime | `lib/first-launch.ts` | no | implemented | Useful reference for E, but not the final Stage 3 persistence contract. |

## 8. Recommendations for follow-on workers

### 8.1 Worker B: data-contract requirements

B should define or clarify:

- canonical `AppEntryState`, including whether runtime root remains `"/"` or Stage 3 introduces a real `"/home"` route
- exact canonical naming between `OnboardingSessionPreset` and current runtime `PostOnboardingSessionPreset`
- exact `HomeRecommendation` contract, including `id`, `type`, `source`, `sourceId`, `priority`, and `cta`
- exact `HomeRecommendationClickPayload`, including when `talkEntryContext` is required
- exact Home candidate eligibility rules for Memory, Sleep, Talk, and Room continuity
- explicit exclusion fields for hidden, disagreed, expired, and blocked memory
- canonical Room -> Talk, Memory -> Talk, Sleep -> Talk, and Home -> Talk payload shapes
- snapshot stability rules for `SleepInsight` and `HomeRecommendation`

### 8.2 Worker C: acceptance checklist requirements

C should verify:

- App Entry never lands unfinished onboarding users in normal Home
- active preset users are routed to Room, not Home
- Home shows exactly one main recommendation and one main CTA
- Home recommendation is traceable and excludes hidden/disagreed/expired/blocked memory
- Home does not show transcript, memory-management controls, room-browsing feed, or full sleep reports
- Home fallback behavior is explicit for `system_default`, partial data, and error-safe fallback
- Talk can still accept Room/Memory/Sleep/Home entry contexts without losing provenance
- runtime route mismatch between `"/"` and `"/home"` is resolved or deliberately accepted

### 8.3 Worker D: contracts / mocks requirements

D should cover:

- contract skeletons for `OnboardingSessionPreset`, `TalkEntryContext`, `MemoryItem`, `MemoryFeedback`, `SleepInsight`, and `HomeRecommendation`
- mock fixtures that reflect Stage 3 rules, especially no Memory Delete in V1
- mock eligibility examples showing visible memory vs hidden/disagreed/blocked memory exclusion
- mock Home recommendations for `review_memory`, `sleep_checkin`, `tonight_suggestion`, `start_talk`, and `enter_room`
- mock payloads for Home -> Talk, Memory -> Talk, Sleep -> Talk, and Room -> Talk

### 8.4 Worker E: local-data-foundation prerequisites

E should not treat current `localStorage` usage as the final contract. E should first establish:

- a single local data foundation for onboarding completion, active preset state, and route resolution
- a consistent store boundary between draft, session, persistent, and derived snapshot layers
- stable local identifiers for `SleepInsight` and `HomeRecommendation` snapshots
- a contract-clean replacement path for ad hoc localStorage handoffs where route payload or shared store is more appropriate
- migration guidance for current runtime keys so first-launch demo continuity does not silently define the final Stage 3 model

## 9. Main conclusions

1. Stage 3 Home logic is documented, but not implemented in current runtime.
2. Current runtime still uses the root route as a first-launch shell rather than a Home resolver.
3. The first-night `Onboarding -> Room -> Talk` chain is partially aligned in runtime and is the strongest implemented part of the Stage 3 data flow.
4. Home recommendation, Home route, Home traceability, and Home candidate filtering are still documentation-only.
5. Memory and Sleep currently expose mock/demo structures that are useful inputs for later workers, but they are not yet trustworthy Stage 3 contract implementations.
