# AI Sleep Companion Coding Architecture Rules

## Purpose

This document defines the coding architecture baseline for the AI Sleep Companion web product. The current frontend stack is Next.js, React, and TypeScript. The future backend target is a Go Gin API. The goal is to keep first launch, Room, Talk, Memory, and Sleep Monitoring work reviewable, typed, and ready for later backend integration without letting business logic leak into pages or components.

## 1. Architecture Principle

Use Clean Architecture-lite for this React product.

Required flow:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

Rules:

1. UI must not control business rules.
2. Business rules must not depend on React or page layout.
3. Backend details must not leak into page components.
4. Mock behavior must be easy to replace behind stable contracts.

Current repository note:

The repository still uses root-level `app/`, `components/`, and `lib/`. Until a later migration is approved, apply the same layer boundaries to the current root folders and to any future `src/` structure.

## 2. Folder Responsibility Rules

Target responsibility map:

```text
contracts/
domain/
policies/
config/
experience/
api/
events/
mocks/
app/
components/
lib/
```

### `contracts`

Canonical TypeScript shapes for:

- entities
- IDs
- lifecycle states
- event payloads
- fallback reasons
- source trace objects

Rules:

1. Contracts define canonical field names.
2. Mock data must satisfy contracts.
3. Lifecycle states and fallback reasons must not be magic strings scattered across the UI.

### `domain`

Pure product logic such as:

- recommendation eligibility
- memory influence logic
- conversation state rules
- room selection meaning
- sleep insight rules

Rules:

1. Domain may import contracts only.
2. Domain must not import React, page files, components, API clients, or UI copy.
3. Domain functions should be pure whenever possible.

### `policies` and `config`

Use `policies` for adjustable product decisions.
Use `config` for static, non-secret configuration.

Examples:

- fallback priority
- recommendation windows
- room ordering policy
- CTA labels
- copy variants
- feature flags

Rules:

1. Policy files explain why the rule exists.
2. Config files do not contain secrets.
3. Product decisions must not be hard-coded across multiple pages.

### `experience`

Typed experience builders convert contracts, domain results, policies, and config into page view models.

Examples:

- `buildHomeExperience`
- `buildRoomExperience`
- `buildTalkExperience`
- `buildMemoryExperience`
- `buildSleepExperience`

Rules:

1. Experience returns typed view models, not React elements.
2. Experience must not render UI.
3. Experience must not directly fetch backend APIs.

### `app`

Route and page entry files may:

- gather route params
- call experience builders
- render loading, empty, and error states
- pass typed props into components

Page files must stay thin. They must not become the home for business rules, fallback priority, or product decision logic.

### `components`

Components are presentational surfaces with typed props.

Rules:

1. Components may contain local UI state.
2. Components must not decide product rules.
3. Components must not fetch backend APIs directly.
4. Components must not invent analytics event names inline.

### `api`

This is the future frontend boundary for Go Gin communication.

Rules:

1. All future backend communication must go through `src/api` or the equivalent approved frontend API layer.
2. DTOs must be mapped into canonical frontend contracts.
3. Backend field changes must not leak directly into components.

### `events`

Centralize product event names and payload types.

Rules:

1. Key user actions must have typed payloads.
2. Event names must not be invented inline in pages or components.

### `mocks`

Typed mock data only.

Rules:

1. Mock data must satisfy contracts.
2. Mock data must not be reported as production wiring.
3. Mock data must preserve fallback reason and source trace when applicable.

### `lib`

Generic helpers only.

Allowed:

- formatting helpers
- string helpers
- generic validation helpers

Forbidden:

- product recommendation rules
- sleep insight rules
- memory influence rules

If logic has product meaning, it belongs in domain, policies, or experience, not `lib`.

## 3. Dependency Direction

Allowed dependency direction:

```text
contracts
  -> domain
  -> policies/config
  -> experience
  -> app/components
```

More precise rules:

1. `contracts` may be imported by all layers.
2. `domain` may import contracts only.
3. `policies` may import contracts, domain, and config.
4. `config` should stay mostly independent.
5. `experience` may import contracts, domain, policies, config, and events.
6. `app` may import experience, components, events, and approved API adapters.
7. `components` may import contracts and shared UI helpers only.
8. `api` may import contracts and mapping helpers.

Explicitly forbidden:

1. domain importing React
2. domain importing components
3. domain importing app
4. domain calling APIs directly
5. components containing business-rule branching
6. page files containing hidden product state machines that belong in domain or experience

## 4. React Page and Component Rules

Page rules:

1. Keep page files thin.
2. Pages may handle route setup and top-level rendering states.
3. Pages may call experience builders.
4. Pages must not contain recommendation logic, memory influence logic, sleep policy logic, or contract-shape invention.

Component rules:

1. Components must receive typed props.
2. Components should remain presentational.
3. Separate UI state from product state.
4. Do not place backend or provider details inside UI components.

State distinction:

- UI state: `isOpen`, `isHovered`, `isSelected`, `isLoading`
- Product state: lifecycle states, recommendation status, sleep check-in status, fallback reason, room selection meaning

Product state must come from contracts, domain, or experience.

## 5. Domain, Policy, Config, and Experience Rules

Domain rules:

1. Typed input and output.
2. No React dependency.
3. No DOM dependency.
4. No API dependency.
5. No UI copy.

Policy rules:

1. Use policies for adjustable product decisions.
2. Name policies clearly.
3. Document the reason for non-obvious decisions.

Config rules:

1. Store non-secret defaults, copy, thresholds, and flags here.
2. Do not scatter CTA text and fallback copy across pages.

Experience rules:

1. Experience builders convert raw app data into stable page view models.
2. Experience builders do not return React elements.
3. Experience builders do not fetch APIs directly.

Recommended view models:

- `HomeViewModel`
- `OnboardingViewModel`
- `RoomViewModel`
- `TalkViewModel`
- `MemoryViewModel`
- `SleepViewModel`

## 6. TypeScript Writing Rules

1. Do not use `any` unless the reason is documented inline.
2. Do not use magic strings for lifecycle states, recommendation types, fallback reasons, or event names.
3. Prefer explicit unions or enums defined by contracts.
4. Avoid broad `Record<string, unknown>` except at external boundaries.
5. Optional fields must have clear absence semantics.
6. If a field is core to the entity, it should not be optional.

Prefer product-specific names over vague names like `data`, `item`, `result`, or `payload`.

## 7. Fallback, Source Trace, and Event Rules

Fallback rules:

1. Product fallback must not be silent.
2. Every product fallback needs a typed fallback reason.
3. Fallback behavior must be traceable and testable.

Source trace rules:

Recommendations and other key derived objects must preserve source trace. They should be able to answer:

1. why the object appeared
2. which data source produced it
3. whether it is fallback
4. when it expires, if applicable
5. which page or flow it affects

Event rules:

1. Key user actions need typed event payloads.
2. Event names must be centralized.
3. The current stage does not require a real analytics provider, but event shapes must still be defined.

Representative event coverage for this product includes:

- onboarding started and completed
- room selected
- talk started
- talk message sent
- memory created or confirmed
- sleep check-in started and completed
- recommendation shown or clicked
- fallback shown

## 8. Future Go Gin API Boundary Rules

The current frontend must prepare for a future Go Gin backend without implementing it here.

Rules:

1. Do not add direct LLM provider calls in the frontend.
2. Do not expose secret API keys in the frontend.
3. Future backend communication must go through `src/api`.
4. Future Go Gin services should own backend business logic, persistence, safety, and provider integration.

Suggested future backend structure:

```text
backend/
  cmd/api/
  internal/handler/
  internal/service/
  internal/repository/
  internal/model/
  internal/middleware/
```

## 9. Forbidden GPT or Codex Code Patterns

Do not generate or accept these patterns in implementation work:

1. business logic embedded in JSX conditionals
2. untyped mock objects passed as de facto contracts
3. page files that invent new contract fields without documentation
4. silent fallback through `||` or `??` when product meaning changes
5. presentational components choosing recommendation priority or lifecycle behavior
6. inline string literals for event names, fallback reasons, or lifecycle states
7. direct frontend calls to future backend endpoints from components
8. documentation claiming mock behavior is production-ready

## 10. Acceptance Criteria

An implementation is architecture-compliant when:

1. contract names are stable and typed
2. domain logic is outside pages and presentational components
3. adjustable product decisions live in policies or config
4. page UI is driven by typed experience outputs
5. fallbacks are typed and explicit
6. recommendations preserve source trace
7. key user actions have typed event payloads or a documented omission reason
8. future backend integration can be added through `src/api` without rewriting page structure
