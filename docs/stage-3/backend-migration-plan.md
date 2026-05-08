# Stage 3 Backend Migration Plan

Status: draft for `stage3/backend-migration-plan`

Purpose: describe how the Stage 3 local-first data model can later migrate to backend-backed ownership without changing current UI scope or claiming that backend work already exists.

Inputs used for this plan:

- `docs/stage-3/data-flow-audit.md` from `stage3/audit-data-flow`
- `docs/stage-3/data-contract.md` from `stage3/data-contract-spec`
- `docs/stage-3/acceptance-checklist.md` from `stage3/acceptance-checklist`
- `docs/stage-3/contract-implementation-notes.md` from `stage3/contracts-skeleton`
- `docs/stage-3/local-data-foundation.md` from `stage3/local-data-foundation`

## 1. Current Stage 3 Data Ownership

Stage 3 is intentionally local-first. Backend planning must start from the current ownership truth instead of assuming that any existing route already has a server-backed source of truth.

### 1.1 What stays local-only

These concerns should remain client-owned even after backend work starts because they are device/runtime concerns, not durable product records:

- browser storage envelopes, storage migrations, and key-level compatibility helpers
- route entry hints such as one-shot Talk handoff state
- transient onboarding progress recovery before a successful save completes
- active scene query-param overrides and other route-local navigation context
- UI-only flags such as loading state, animation state, temporary error copy, and component expand/collapse state
- device-local settings such as Talk sound preferences unless a later product decision explicitly promotes them to user profile settings
- room and scene catalog configuration that ships with the app bundle

### 1.2 What is mock-only today

These areas currently look product-like in the UI but are still mock, simulated, or incomplete in runtime ownership:

- `CompanionConversation` and `ConversationMessage` history, because Talk has no durable message/session model in the current runtime
- `SleepCheckIn` records and related rhythm, trend, and suggestion payloads on `/sleep-monitoring`
- `MemoryItem` content, delete state, and continuation payloads on `/memory`
- recommendation payloads that appear in Sleep and Memory but are not yet backed by shared runtime consumers
- generated-room behavior beyond weak landing hints, because the current Room flow does not treat generated rooms as fully durable selectable room entities

### 1.3 What is future backend-owned

These domains should become backend-owned once Stage 3 local contracts and fallback behavior are stable:

- `UserProfile` as the durable user identity and profile record
- `OnboardingState` and `SleepGoal` for resumable onboarding and post-onboarding strategy history
- `SleepSession`, `CompanionConversation`, and `ConversationMessage` for durable Talk and sleep-session history
- `MemoryItem` history and delete or hide lifecycle
- `SleepCheckIn` history and freshness updates
- `Recommendation` and `Ritual` lifecycle when recommendations become durable cross-session artifacts
- guest-to-authenticated migration for generated-room and memory ownership
- `RoomState` only for user-specific room continuity, generated-room retention, and scene continuity

### 1.4 Domain ownership summary

| Domain | Current Stage 3 owner | Current state | Future backend owner |
| --- | --- | --- | --- |
| `UserProfile` | local-first profile adapter | local-only durable fallback | profile/auth service |
| `OnboardingState` | first-launch flow adapter | local-only durable fallback | onboarding service |
| `SleepGoal` | first-launch preset builder | local-only durable fallback | onboarding/session strategy service |
| `RoomState` | Room route plus first-launch room-generation adapters | local-only durable fallback | room-state service if auth-backed continuity is needed |
| `SleepSession` | planned Talk/session adapter | not yet fully real in runtime | session service |
| `CompanionConversation` | planned Talk conversation adapter | mock-only/incomplete | conversation service |
| `ConversationMessage` | planned Talk message adapter | mock-only/incomplete | conversation service |
| `SleepCheckIn` | planned sleep reflection adapter | mock-only | sleep reflection service |
| `MemoryItem` | planned memory summarization adapter | mock-only | memory service |
| `Recommendation` | planned recommendation adapter | mock-only or partial | recommendation service |
| `Ritual` | planned continuation adapter | future-facing only | recommendation or ritual service |

## 2. Future Backend Migration Scope

The backend migration scope should follow the Stage 3 contract vocabulary exactly and avoid inventing a second naming system.

### 2.1 User profile

Backend scope:

- durable `user_id` ownership
- `auth_status` once real auth exists
- first-launch completion state
- timezone and last-active metadata
- guest-to-auth profile migration

Keep local fallback:

- safe guest bootstrap when no backend profile is reachable
- local last-known profile cache for startup fallback

### 2.2 Onboarding data

Backend scope:

- onboarding answers
- onboarding completion timestamps
- active or recent `SleepGoal` records
- create-room branch metadata and selected visual theme when product wants continuity across devices

Keep local fallback:

- in-progress onboarding draft before save confirmation
- restart-safe local recovery if the network is unavailable

### 2.3 Conversation data

Backend scope:

- `SleepSession`
- `CompanionConversation`
- `ConversationMessage`
- session start/end lifecycle
- message ordering and delivery-state durability
- continuation-source provenance from onboarding, room, memory, sleep, or resume entry

Keep local fallback:

- active-session cache while a session is in progress
- one-session local resume if the latest server read fails

### 2.4 Memory data

Backend scope:

- durable `MemoryItem` history
- hide/delete lifecycle
- source-session linkage
- memory refresh timestamps
- any later continuation linkage back into Talk

Keep local fallback:

- empty-state rendering when no memory history is available
- read-only local cache of the latest fetched memory items

### 2.5 Sleep session data

Backend scope:

- durable `SleepSession` history
- durable `SleepCheckIn` reflection records
- linked recommendation references
- session outcome, quiet-time, and confidence history

Keep local fallback:

- latest local reflection record when the backend cannot be reached
- safe empty-state path back to `/room`

### 2.6 Room state, if applicable

Backend scope should be narrow and user-specific:

- `active_room_id`
- `last_entered_room_id`
- `current_scene_id`
- generated-room retention metadata
- `room_source` continuity when generated rooms become durable

Do not move these app-owned concerns into backend scope by default:

- bundled room catalog content
- bundled scene catalog content
- room-to-scene config that is already app-owned and versioned with the client

## 3. API Boundary Proposal

This section proposes boundary families, not final endpoint approval. The purpose is to keep future APIs aligned with Stage 3 domains and to preserve local-first fallback behavior.

### 3.1 Read APIs

Recommended read boundaries:

- profile read: latest `UserProfile`
- onboarding read: latest `OnboardingState` and active `SleepGoal`
- room-state read: latest `RoomState`
- session read: latest active or recent `SleepSession`
- conversation read: `CompanionConversation` plus ordered `ConversationMessage` records
- memory read: current `MemoryItem[]`
- sleep read: latest `SleepCheckIn`
- recommendation read: active `Recommendation[]` and linked `Ritual[]` when present

Recommended behavior:

- return normalized Stage 3 domain records first
- allow page-level adapter DTOs only if they remain traceable back to normalized records
- support partial reads by domain so one failing domain does not block all startup state

### 3.2 Write APIs

Recommended write boundaries:

- upsert onboarding draft
- create or update `SleepGoal`
- upsert `RoomState`
- create session
- update session lifecycle
- create conversation
- append message
- create or update `SleepCheckIn`
- create or update `MemoryItem`
- mark recommendation used, dismissed, or expired

Recommended behavior:

- preserve `snake_case` field naming from the Stage 3 contracts unless a boundary adapter explicitly remaps it
- keep write payloads domain-scoped rather than page-scoped
- require `contract_version` at the boundary or infer it from the supported API version

### 3.3 Sync APIs

Recommended sync boundaries:

- bootstrap sync: fetch the current server snapshot for all supported Stage 3 domains after auth or app resume
- domain sync: fetch one domain family when only one page needs refresh
- reconciliation sync: compare local cached records and server records by `user_id`, stable IDs, `updated_at`, and `contract_version`

Recommended behavior:

- treat local Stage 3 data as the optimistic fallback until server reads succeed
- keep sync record-based, not page-DTO-based
- avoid full bidirectional sync complexity in the first backend phase

### 3.4 Migration APIs

Recommended migration boundaries:

- guest-to-auth ownership migration for `UserProfile`, `SleepGoal`, `RoomState`, `MemoryItem`, and generated-room metadata
- local-import or bootstrap endpoint that can accept a bounded set of Stage 3 local records for first authenticated sync
- domain version-check endpoint or equivalent server support to reject unsupported `contract_version` payloads safely

Recommended behavior:

- make migration idempotent
- preserve stable IDs when ownership changes
- reject only the affected domain when one import payload is invalid

### 3.5 Error and fallback behavior

Required fallback rules for backend phases:

- if a read API fails, the app should use the latest valid local Stage 3 record for that domain
- if no local record exists, the app should use the same safe defaults already defined in Stage 3 local data docs
- if a write API fails, the local-first copy should remain intact and the domain should be marked for retry rather than discarded
- if a migration API fails, keep the original local record, log the failure, and retry later instead of clearing user state
- if the backend returns unsupported enum values or contract versions, reject that domain payload and fall back to local-safe defaults for only that domain
- if auth is missing or invalid, keep the app in documented guest-local behavior and do not partially promote ownership

## 4. Migration Sequence

The migration sequence should keep backend work behind the local-first contract and storage foundation, not the other way around.

### 4.1 Local data foundation first

Precondition:

- the local storage layer, keys, defaults, migrations, and selectors are accepted

Exit criteria:

- all required Stage 3 domains have local-first storage rules
- invalid or missing local data has a documented fallback path

### 4.2 Contract stabilization

Precondition:

- audit, contract spec, acceptance checklist, contracts skeleton, and local data foundation are accepted

Exit criteria:

- domain vocabulary is frozen enough that backend work does not need product guesswork
- mock-only versus durable-domain boundaries are explicit

### 4.3 Backend schema proposal

Precondition:

- the Stage 3 contract document is the approved source of truth

Exit criteria:

- each backend-owned domain has a one-to-one or clearly mapped schema proposal
- ownership, IDs, timestamps, versioning, and guest-to-auth rules are specified

### 4.4 API implementation

Precondition:

- backend schema proposal is approved
- read and write boundary shapes are approved against the Stage 3 contract vocabulary

Exit criteria:

- basic read and write APIs exist for the chosen first backend domains
- error responses and unsupported-version behavior are documented
- no UI depends on undeclared backend-only fields

### 4.5 UI integration

Precondition:

- backend APIs exist for the selected domain slice
- local fallback behavior remains intact

Recommended order:

1. user profile and onboarding reads
2. room-state continuity
3. session and conversation creation
4. sleep reflection reads
5. memory reads
6. recommendation lifecycle

Exit criteria:

- one domain slice at a time can read backend data without breaking local fallback
- route structure and UI behavior remain within existing product scope

### 4.6 Fallback and rollback plan

Fallback rules:

- keep the Stage 3 local-first adapters available while backend integration is rolling out
- allow each page boundary to fall back to local normalized records if backend reads fail
- do not remove current key compatibility until backend-backed reads and writes are proven stable

Rollback rules:

- disable only the failing backend domain integration instead of rolling back all domains together
- preserve local snapshots for the affected domain during rollback
- keep contract-version migration logs or metadata so the team can identify which domain failed

## 5. Risks

### 5.1 Data loss

- guest-local records may be overwritten or dropped if migration clears local state before server confirmation
- generated-room retention metadata may be lost if migration treats it as display-only instead of user state
- in-progress onboarding state may be lost if backend save timing replaces local draft safety too early

### 5.2 Local and backend mismatch

- local `snake_case` contracts and backend DTOs may drift if a boundary adapter is skipped
- page DTO convenience fields may diverge from normalized domain records
- room-state or scene-state semantics may differ between Room and Talk if ownership is not explicit

### 5.3 Auth not ready

- backend ownership cannot be safely finalized if guest-to-auth migration rules are not implemented first
- user-specific reads may appear empty after sign-in if guest-local state is not imported
- mixed guest and authenticated data may produce duplicate or orphaned records

### 5.4 Schema drift

- contract fields may change across local docs, TypeScript contracts, and backend schemas if versioning is not enforced
- enum widening without fallback behavior may break older clients
- changing local-storage semantics before backend compatibility exists may create migration dead ends

### 5.5 UI depending on unstable mock data

- Sleep and Memory pages currently render believable but mock-only records
- Talk does not yet own a durable session or message model, so backend integration there has the largest shape gap
- recommendation payloads exist in mock form before downstream consumers actually honor them

## 6. Non-Goals

- no backend implementation
- no database schema implementation
- no auth implementation
- no production sync engine
- no UI changes
- no route or layout changes
- no package, dependency, or lockfile changes
- no claim that current mock-only Memory, Sleep, generated-room, or Talk flows are already production-backed

## 7. Acceptance Criteria

### 7.1 Before backend implementation can start

The following must be true before backend implementation begins:

- the audit, contract spec, acceptance checklist, contracts skeleton, and local data foundation are all accepted
- the local-first fallback behavior is documented per domain and matches the Stage 3 contract vocabulary
- backend-owned domains are explicitly separated from local-only and mock-only behavior
- stable IDs, `user_id` ownership, `updated_at`, and `contract_version` rules are agreed for every backend-owned domain
- guest-to-auth migration expectations are documented before any auth-backed persistence begins
- generated-room handling is classified clearly as durable room data, recommendation-like metadata, or weak landing metadata
- room-state ownership is scoped narrowly enough that app-bundled room and scene catalogs stay client-owned unless explicitly promoted later

### 7.2 Before UI integration can consume backend data

The following must be true before any route consumes backend data:

- the selected backend domain exposes approved read and write boundaries aligned to the Stage 3 contract names
- the app can still start from safe local defaults when backend reads fail
- domain validation exists at the API boundary or equivalent adapter boundary
- unsupported `contract_version` or enum values fail closed per domain instead of crashing the page
- page adapters can rebuild current UI-facing data from backend-backed normalized records without route or layout redesign
- the first integrated domain slice is small enough to review independently and disable independently if needed
- backend responses do not force the UI to depend on undeclared or backend-only fields

## 8. Recommended First Backend Slice

The safest first backend slice is:

1. `UserProfile`
2. `OnboardingState`
3. `SleepGoal`
4. `RoomState`

Reasoning:

- these domains already drive real cross-route continuity
- they have clearer local ownership today than Talk, Memory, or Sleep history
- they allow guest-to-auth migration planning before message history and memory history become durable
- they reduce backend risk by stabilizing first-launch and Room continuity before tackling full session history

Talk session, message history, Memory, and Sleep reflection should follow only after this first slice is stable.
