# AI Sleep Companion Coding Architecture Rules

## 1. Purpose

These rules keep Stage 5 implementation aligned with the locked Stage 3 product model.

The frontend stack is Next.js, React, and TypeScript. Stage 4 does not add backend, database, auth, deployment, or real AI memory implementation.

## 2. Task Classification

Every worker must classify the task before coding:

- `ui-only`
- `data-wiring`
- `api-contract`
- `architecture-docs`
- `technical-review`
- `bugfix`
- `content-only`
- `approved-refactor`

Stay inside the chosen class. Cross-scope work needs explicit approval.

## 3. Required Dependency Flow

All implementation must follow:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

Rules:

1. Contracts may be imported by all frontend layers.
2. Domain may import contracts only.
3. Policies may import contracts, domain, and config.
4. Config should be stable and non-secret.
5. Experience may import contracts, domain, policies, config, events, and mocks.
6. Routes may import experience and components.
7. Components should import contracts or view-model types, not product-rule modules.

## 4. Folder Responsibilities

### `src/contracts`

Contains shared TypeScript contracts and primitives derived from Stage 3.

Allowed:

- entity types
- ID and date aliases
- lifecycle state unions
- event payload types
- fallback reason unions
- trace/source types

Forbidden:

- product algorithms
- mock data
- runtime storage
- React components

### `src/domain`

Contains pure business entities and rules.

Allowed:

- route decision helpers
- memory eligibility predicates
- sleep suggestion eligibility predicates
- Room handoff invariants
- Talk extraction eligibility predicates

Forbidden:

- React imports
- Next.js imports
- browser storage
- API clients
- UI copy
- component imports

### `src/policies`

Contains product decision logic derived from Stage 3 rules.

Allowed:

- Home recommendation priority policy
- Sleep suggestion priority policy
- Memory exclusion policy
- Room option stability policy
- fallback reason selection

Forbidden:

- UI rendering
- product behavior not traceable to Stage 3
- API calls

### `src/config`

Contains stable local configuration and catalogs.

Allowed:

- fixed Room option catalog
- onboarding answer option keys
- local copy keys
- non-secret defaults

Forbidden:

- secrets
- user data
- business events
- hidden backend assumptions

### `src/experience`

Contains page-facing orchestration and view-model preparation.

Allowed:

- `buildHomeExperience`
- `buildOnboardingExperience`
- `buildRoomExperience`
- `buildTalkExperience`
- `buildMemoryExperience`
- `buildSleepExperience`

Rules:

1. Experience returns typed data, not React elements.
2. Experience does not fetch backend APIs directly.
3. Experience must preserve source trace and fallback reason when it derives display data.

### `src/mocks`

Contains clearly labeled local mock data only.

Rules:

1. Mock data must satisfy contracts.
2. Mock data must not be reported as production wiring.
3. Mock data must preserve source trace and fallback reason where relevant.
4. Undefined real data sources must be documented as unresolved dependencies.

### `app`

Next.js routes and route setup only.

Allowed:

- route params
- top-level render state
- calling experience builders
- passing typed props

Forbidden:

- business rules
- fallback priority
- contract invention
- direct backend calls from route UI code unless an approved API boundary exists

### `components`

Presentational UI components.

Allowed:

- local UI state
- typed props
- visual state rendering

Forbidden:

- API calls
- product decision logic
- recommendation priority
- hidden memory eligibility decisions
- onboarding-to-room product rules

### `lib`

Legacy or generic helper area.

Allowed:

- generic formatting
- simple storage compatibility helpers until migrated
- string/date helpers

Forbidden:

- new product logic
- recommendation policy
- memory personalization logic
- sleep suggestion logic

## 5. Stage 3 Product Guardrails

Implementation must preserve:

1. Onboarding creates `OnboardingPreset`; it does not create a long-term profile.
2. Onboarding does not start Talk directly.
3. Onboarding does not rank, reorder, highlight, or recommend Room options.
4. Room separates `RoomView` from `RoomSession`.
5. Room-to-Talk carries `roomId`, `roomSessionId`, and full active onboarding preset when present.
6. Talk uses `TalkEntryContext`.
7. Talk session, message, memory, and memory extraction are separate concepts.
8. Memory supports Agree, Disagree, and Hide, not user-facing Delete in V1.
9. Hidden memory does not influence Talk, Sleep, or Home.
10. Sleep suggestion does not directly read onboarding answers.
11. Sleep is reflective and non-medical.
12. Home is not a dashboard, feed, transcript, or manager page.
13. Home has one main recommendation and one CTA.

## 6. TypeScript Rules

1. Do not use `any` unless the reason is documented inline.
2. Use contract unions for lifecycle states, route targets, event names, and fallback kinds.
3. Do not scatter magic strings.
4. Optional fields need clear absence semantics.
5. Prefer domain names over vague names such as `data`, `item`, `result`, or `payload`.
6. Do not rename Stage 3 contract fields to match temporary runtime storage keys.

## 7. Fallback and Source Trace Rules

Fallback must be explicit.

Every product fallback needs:

- typed reason or fallback kind
- source trace when available
- mock-vs-real status when data is local
- no technical user-facing error copy

Recommendations, suggestions, and derived page data must preserve enough trace to answer:

1. why it appeared
2. what source object produced it
3. whether it is fallback
4. what user action it supports

## 8. Event Rules

Key user actions need typed payloads or a documented omission reason.

Event names must not be invented inline. Stage 3 event names live in the contract layer.

Representative actions:

- onboarding viewed, answered, completed
- room viewed and selected
- Talk started, user message sent, Talk ended
- memory created, viewed, feedback submitted
- sleep check-in started and completed
- sleep insight or tonight suggestion viewed/clicked
- Home recommendation viewed/clicked

## 9. Mock and Future Backend Rules

Stage 4 and Stage 5 frontend work may use local mocks when Stage 3 has not defined a real source.

Rules:

1. Label mock data clearly.
2. Do not imply real backend, database, auth, or real AI memory.
3. Do not call LLM providers from the frontend.
4. Do not expose secrets in frontend code.
5. Future backend communication must go through an approved `src/api` layer or equivalent task-specific boundary.

## 10. Reviewable Completion

A code change is architecture-compliant when:

1. changed files match task classification
2. Stage 3 source files were consulted
3. contract names remain stable
4. domain logic is outside routes and components
5. product decisions live in policies/config/domain/experience
6. routes are thin
7. components are presentational
8. mocks are labeled
9. fallbacks are explicit
10. validation results are reported
