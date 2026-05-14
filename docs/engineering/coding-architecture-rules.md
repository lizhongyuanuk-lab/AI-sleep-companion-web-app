# AI Sleep Companion Coding Architecture Rules

## 1. Architecture Principle: Clean Architecture-lite for React

This document defines how future Codex workers and human engineers must structure frontend code for the AI sleep companion product. The goal is to keep the Next.js application maintainable as the product grows across first launch, Talk, Room, Memory, and Sleep Monitoring, while making it straightforward to replace mock data with a future Go Gin backend API.

This product needs explicit coding architecture rules because its core behavior is easy to degrade into page-level `if/else` logic, untyped mock objects, silent fallback behavior, scattered copy, and one-off recommendation rules that are hard to review. The current frontend stack is Next.js, React, and TypeScript. The future backend target is a Go Gin API. The current priority is frontend architecture, canonical contracts, domain logic, adjustable product policies and config, typed page experience view models, events, and mock-driven implementation that can later move behind a backend boundary.

Current non-goals:

- no Go Gin backend implementation yet
- no database implementation yet
- no real LLM integration yet
- no complex AI agent framework
- no Redux or Zustand unless a concrete state problem exists
- no microservices
- no unnecessary monorepo restructuring

Core rule:

UI must not control business rules.
Business rules must not depend on UI.
External APIs, backend details, and LLM provider details must not pollute core domain logic.

## 2. Folder Responsibility Rules

Intended target structure:

```text
src/
  app/
  components/
  contracts/
  domain/
  experience/
  policies/
  config/
  events/
  api/
  mocks/
  lib/
```

Current repository note:

The current repository still uses root-level `app/`, `components/`, and `lib/`, and does not yet expose the full `src/` namespace. Until an explicit architecture migration task is approved, these same responsibility boundaries still apply to the current root folders. Do not use the missing `src/` structure as an excuse to place domain or policy logic inside page files, presentational components, or generic utilities.

### `src/app`

Allowed:

- route and page entry
- route params
- calling experience builders
- passing typed view models to components
- page-level loading, empty, and error rendering

Forbidden:

- recommendation generation logic
- memory influence logic
- sleep suggestion logic
- fallback priority logic
- complex product `if/else` logic
- direct backend fetch calls
- direct LLM calls

### `src/components`

Allowed:

- presentational UI
- typed props
- display logic
- layout
- lightweight UI state
- callbacks passed from above

Forbidden:

- product decision logic
- memory influence rules
- recommendation expiry rules
- fallback strategy
- API calls
- LLM calls
- inline analytics event names

### `src/contracts`

This layer defines the canonical TypeScript shapes shared across the product:

- entity types
- interfaces
- enums or union types
- shared IDs
- lifecycle states
- source trace types
- fallback reason types
- event payload types

Rules:

- All mock data must satisfy contracts.
- Domain input and output must use contract types.
- Pages must not invent temporary data shapes.
- Lifecycle states must come from contracts, not magic strings.

### `src/domain`

This layer contains pure business and domain logic for the sleep companion product, including:

- memory influence rules
- memory state rules
- sleep state rules
- recommendation validity and expiry logic
- conversation and Talk context rules
- room selection meaning

Rules:

- Domain can import contracts.
- Domain must not import React.
- Domain must not import components.
- Domain must not import app.
- Domain must not call API.
- Domain must not contain UI copy.

### `src/experience`

This layer builds typed page experiences and view models. Typical examples include:

- `buildHomeExperience()`
- `buildTalkExperience()`
- `buildMemoryExperience()`
- `buildSleepExperience()`

Rules:

- Experience can use contracts, domain, policies, config, and events.
- Experience must not return React elements.
- Experience must not import UI components.
- Experience must not directly fetch API.
- Experience outputs typed view models.

### `src/policies`

This layer defines adjustable product rules and decision policies, for example:

- `memoryInfluencePolicy.ts`
- `recommendationFallbackPolicy.ts`
- `homeExperiencePolicy.ts`
- `sleepRecommendationPolicy.ts`

Rules:

- Frequently adjusted business rules belong here.
- Policy files should explain why the rule exists.
- Policies must not import React or components.
- Policies must not fetch API.

### `src/config`

This layer defines non-sensitive static configuration, including:

- copy variants
- CTA labels
- fallback copy
- feature flags
- experiment variants
- thresholds
- expiry windows

Rules:

- Config must not contain secrets.
- Config must not contain complex business flows.
- Config can be used by policies and experience builders.
- Copy and CTA text should not be scattered across pages.

### `src/events`

This layer centralizes product events, including:

- event names
- event payload types
- `trackEvent` helper
- funnel events
- fallback events
- recommendation events
- memory events
- sleep events
- Talk events

Rules:

- Event names must be centralized.
- Components must not invent event strings inline.
- Key user actions must have typed event payloads.
- Analytics provider integration is not required yet.

### `src/api`

This layer is the future frontend and backend communication boundary. All future Go Gin API calls must go through this layer.

Rules:

- Pages must not directly fetch backend API.
- Components must not directly fetch backend API.
- API DTOs must map to canonical frontend contracts.
- Backend field changes require documented mapping or migration notes.

### `src/mocks`

This layer contains typed mock data only.

Rules:

- Mock data must satisfy contracts.
- Mock data must not pretend real backend wiring is complete.
- Mock data must preserve source trace, lifecycle state, and fallback reason when applicable.

### `src/lib`

This layer contains generic utilities only.

Allowed:

- date formatting
- string helpers
- generic ID helpers
- generic validation helpers

Forbidden:

- memory business logic
- recommendation business logic
- sleep business logic
- home experience logic

If a utility has product meaning, it belongs in domain, policies, or experience, not `lib`.

## 3. Dependency Direction Rules

Allowed dependency direction:

```text
contracts
  ↓
domain
  ↓
policies / config
  ↓
experience
  ↓
app / components
```

More specific rules:

- `src/contracts` may be imported by all layers.
- `src/domain` may import contracts only.
- `src/policies` may import contracts, domain, and config.
- `src/config` should stay mostly independent.
- `src/experience` may import contracts, domain, policies, config, and events.
- `src/app` may import experience, components, events, and api.
- `src/components` may import contracts and event helpers, but must not contain complex domain decisions.
- `src/api` may import contracts and mapping helpers.

Explicitly forbidden:

- domain importing React
- domain importing components
- domain importing app
- domain directly fetching API
- components directly calling LLM
- components directly deciding business rules
- app or page files containing complex product logic

Required data flow:

```text
mock/api data
  -> contract typed entity
  -> domain rule
  -> policy/config
  -> experience view model
  -> page
  -> component
```

## 4. React Page and Component Writing Rules

Page rules:

- Page files must be thin.
- Pages may load or receive data.
- Pages may call experience builders.
- Pages may render components.
- Pages may handle page-level loading, empty, or error states.
- Pages must not contain recommendation logic, memory influence logic, sleep suggestion logic, or fallback priority logic.

Component rules:

- Components must receive typed props.
- Components should be presentational.
- Components should not mutate canonical state.
- Components should not know backend API details.
- Components should not know LLM provider details.
- Components should not invent event names inline.
- UI state and product state must be separated.

State distinction:

- UI state: `isOpen`, `isHovered`, `isSelected`, `isLoading`
- Product state: `memory.influenceState`, `recommendation.lifecycleState`, `sleepCheckIn.status`, `fallbackReason`

Product state must come from contracts, domain, or experience.

## 5. Domain / Policy / Config / Experience Writing Rules

Domain function rules:

- typed input
- typed output
- pure where possible
- no React dependency
- no DOM dependency
- no API dependency
- no UI copy

Policy rules:

- Policies answer adjustable product decisions.
- Example decisions include which recommendation should be prioritized, what fallback priority is used, when memory influences Talk, how long a sleep suggestion remains valid, and when the home experience should show a generated room versus a system default.
- Policies must be named clearly.
- Policies must explain why the rule exists.

Config rules:

- Config contains copy, thresholds, feature flags, variants, and default values.
- Config must not contain secrets.
- Config must not contain complex business flows.
- Config should prevent copy and CTA text from being scattered across pages.

Experience rules:

- Experience builders convert app and domain data into page view models.
- Experience builders do not render UI.
- Experience builders do not return React elements.
- Experience builders do not directly fetch API.
- Experience builders output stable typed view models.

Required clear view model types for major pages:

- `HomeViewModel`
- `TalkViewModel`
- `MemoryViewModel`
- `SleepViewModel`

Recommended additional page view model types:

- `RoomViewModel`
- `OnboardingViewModel`

## 6. TypeScript Writing Rules

Strict TypeScript rules:

- Do not use `any` unless the reason is documented inline.
- Do not use magic strings for lifecycle states, memory states, recommendation types, fallback reasons, or event names.
- Use explicit union types or enums from `src/contracts`.
- Mock data must satisfy canonical contract types.
- Avoid broad `Record<string, unknown>` except at external boundaries.
- Optional fields must have clear semantics.
- If a field is core to the entity, it should not be optional.
- Every optional field must document when it can be absent, who handles absence, whether fallback is required, and whether UI is affected.

Naming rules:

Avoid vague names:

- `data`
- `item`
- `result`
- `info`
- `payload`
- `obj`
- `temp`

Prefer product-specific names:

- `MemoryItem`
- `SleepCheckIn`
- `HomeRecommendation`
- `FallbackReason`
- `SourceTrace`
- `TalkContext`
- `RoomProfile`
- `OnboardingAnswer`
- `ConversationSession`

## 7. Fallback / Source Trace / Event Rules

Fallback rules:

- Product fallback must not be silent.
- Do not use only `||` or `??` for product behavior fallback.
- Every product fallback must include a typed fallback reason.
- Every product fallback must be traceable and testable.

Example fallback reasons:

- `onboarding_incomplete`
- `missing_sleep_checkin`
- `missing_active_recommendation`
- `recommendation_expired`
- `no_visible_memory`
- `mock_data_only`
- `system_default`

Source trace rules:

Every recommendation must preserve source trace.

A recommendation must be able to answer:

- why it appeared
- which data it came from
- whether it is fallback
- when it expires
- which page it affects

A recommendation must not only contain text.
It should include:

- `id`
- `text`
- `lifecycleState`
- `sourceTrace`
- `createdAt`
- `expiresAt` when applicable
- `fallbackReason` when applicable

Event rules:

- Key user actions must have typed event payloads.
- The current stage does not need a real analytics provider, but event shapes must exist.

Core events should include:

- `onboarding_started`
- `onboarding_completed`
- `room_selected`
- `talk_started`
- `talk_message_sent`
- `memory_created`
- `memory_agreed`
- `memory_hidden`
- `sleep_checkin_started`
- `sleep_checkin_completed`
- `recommendation_shown`
- `recommendation_clicked`
- `fallback_shown`

Event payloads should include:

- `eventName`
- `timestamp`
- `sessionId`
- `userId` when available
- `sourcePage`
- `entityId` when applicable
- `metadata` when applicable

Event names must be centralized.
Do not invent event names inline inside components.

## 8. Future Go Gin API Boundary Rules

The current architecture task must not implement Go Gin.
The future backend should live outside frontend `src`.

Suggested future backend structure:

```text
backend/
  cmd/
    api/
      main.go
  internal/
    handler/
    service/
    repository/
    model/
    middleware/
```

Backend responsibilities:

- `handler`: HTTP request and response handling
- `service`: backend business logic
- `repository`: database access
- `model`: persistence models
- `middleware`: auth, logging, CORS, request context

Frontend and backend boundary rules:

- Future backend communication must go through `src/api`.
- Pages must not directly fetch backend endpoints.
- Components must not directly fetch backend endpoints.
- API DTOs must be mapped to canonical frontend contracts.
- Backend field changes must not leak into UI components.

Future LLM boundary rules:

- Frontend must not directly call LLM providers.
- Frontend must not expose secret API keys.
- Future LLM calls must go through the Go Gin backend service layer.
- Backend service layer should handle prompt construction, memory filtering, safety rules, logging, and cost control.

## 9. Explicitly Forbidden GPT/Codex Code Patterns

The following are P1-level architecture violations:

1. Business logic directly inside page components.
2. Product decision logic inside presentational components.
3. Domain files importing React, components, or app.
4. Use of `any` without documented reason.
5. Untyped mock data.
6. Magic string lifecycle states, event names, fallback reasons, or recommendation types.
7. Silent fallback using only `||` or `??` for product behavior.
8. Recommendation objects without source trace.
9. Key user actions without typed event payloads.
10. Direct backend fetch calls inside page or component files.
11. Direct LLM calls from frontend code.
12. New architecture layer introduced without documentation.
13. Main product PRD or business rules stored primarily inside `src` README files.

## 10. Acceptance Criteria

An implementation follows this coding architecture only if:

1. It uses canonical contract types.
2. Pages stay thin.
3. Components stay mostly presentational.
4. Business logic lives in domain.
5. Adjustable rules live in policies or config.
6. Page experiences are generated through typed view models.
7. Fallback behavior has typed fallback reasons.
8. Recommendations preserve source trace.
9. Key user actions have typed event payloads.
10. Future backend communication is reserved for `src/api`.
11. Mock data is typed and does not imply real backend wiring.
12. Replacing mock data with Go Gin API data would not require rewriting page structure.
