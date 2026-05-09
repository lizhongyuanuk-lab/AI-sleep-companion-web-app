# Stage 3 Data Contract

## 0. Document Role

This document is the canonical Stage 3 implementation contract.

Source priority for this file:

1. [docs/stage-3/product-logic.md](/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-contract-spec/docs/stage-3/product-logic.md)
2. [docs/stage-3/page-logic/home.md](/Users/zhongyuanli/Documents/Playground/ai-companion-stage3-contract-spec/docs/stage-3/page-logic/home.md)
3. Current app implementation, only as a compatibility reference

Rules:

- `product-logic.md` is the P0 source of truth for Stage 3 product behavior.
- `home.md` is the secondary Home-specific logic source.
- If current runtime naming conflicts with this document, this document wins.
- If `product-logic.md` conflicts with `home.md`, `product-logic.md` wins.
- Worker D must implement `src/contracts/` and `src/mocks/stage3MockData.ts` field-for-field from this document, not from current runtime names.

## 1. Cross-Domain Conventions

### 1.1 Shared scalar aliases

```ts
type ISODateString = string;
type ISODateTimeString = string;
type RoutePath =
  | "/"
  | "/onboarding"
  | "/room"
  | "/home"
  | "/talk"
  | "/memory"
  | "/sleep-monitoring";

type RoomEntrySource =
  | "after_onboarding"
  | "home_handoff"
  | "memory_handoff"
  | "sleep_handoff"
  | "direct";
```

### 1.2 Canonical route note

Stage 3 product logic defines `"/home"` as the canonical Home route.

Current runtime compatibility note:

- Current app runtime still renders first-launch entry at `"/"` via `app/page.tsx`.
- Stage 3 product logic still requires the default post-onboarding route decision to target `"/home"`.
- Worker D must preserve canonical contract naming for `"/home"` even if runtime compatibility still temporarily uses `"/"`.

### 1.3 Storage assumption

`product-logic.md` is storage-agnostic.

This contract defines logical state and field names only:

- session-scoped state
- persistent business objects
- derived snapshots
- derived runtime/read models

Local persistence strategy is intentionally deferred to Worker E local-data-foundation. Worker D must model the logical contract first and must not rename contract fields to match temporary local storage keys.

### 1.4 Recommendation domain note

Stage 3 has one canonical recommendation domain for Home: `HomeRecommendation`.

- There is no separate active product-wide `Recommendation` object in Stage 3.
- Worker D must not invent a second recommendation shape unless a later product document explicitly introduces one.

### 1.5 Ritual and SleepGoal note

`product-logic.md` does not define active Stage 3 behavior for `Ritual` or `SleepGoal`.

Therefore:

- `Ritual` is future-only.
- `SleepGoal` is future-only.
- Neither may drive Stage 3 route decision, Home recommendation source, or Talk entry context.

## 2. Canonical Route Decision

Canonical Stage 3 route logic:

```ts
type RouteInput = {
  hasCompletedOnboarding: boolean;
  activeOnboardingPreset?: {
    status: "active" | "consumed" | "expired";
    expiresAt?: ISODateTimeString;
  };
  now: ISODateTimeString;
};

function resolveInitialRoute(state: RouteInput) {
  if (!state.hasCompletedOnboarding) return "/onboarding";

  const preset = state.activeOnboardingPreset;
  const isActiveAndFresh =
    preset?.status === "active" &&
    Boolean(preset.expiresAt) &&
    new Date(preset.expiresAt!).getTime() > new Date(state.now).getTime();

  if (isActiveAndFresh) return "/room";

  return "/home";
}
```

Interpretation:

- incomplete onboarding -> `"/onboarding"`
- active and unexpired onboarding preset -> `"/room"`
- consumed / expired / stale / missing preset -> `"/home"`
- returning user without active preset -> `"/home"`

Stale preset rule:

- If a preset is stored as `status = "active"` but `expiresAt` is already in the past, treat it as stale and resolve as expired.
- Stale preset state must not redirect to Room.
- Stale preset state should be surfaced for diagnostics in `RouteDecision` and `HomeEntryContext`, but should degrade quietly in product behavior.

## 3. Shared Nested Contract: TalkEntryContext

This nested contract is defined by `product-logic.md` and must be preserved as the canonical cross-page Talk entry payload.

```ts
type TalkEntryContext = {
  source: "home" | "memory" | "sleep" | "room" | "direct";
  sourceId?: string;

  intent:
    | "open_chat"
    | "discuss_memory"
    | "gentle_start"
    | "quiet_company"
    | "sleep_reflection"
    | "tonight_suggestion"
    | "tap_from_room_after_onboarding";

  roomId?: string;
  roomViewId?: string;
  roomSessionId?: string;
  onboardingPresetId?: string;
  onboardingPreset?: OnboardingPreset;

  memoryId?: string;
  sleepInsightId?: string;
  homeRecommendationId?: string;

  suggestedOpening?: string;
  tonePreset?: "neutral" | "gentle" | "quiet" | "reflective" | "direct";
  interactionIntensity?: "low" | "medium" | "high";

  createdAt: ISODateTimeString;
};
```

Home-specific requirements:

- If Home CTA targets Talk, `source` must be `"home"`.
- If Home CTA targets Talk, `homeRecommendationId` is required.
- If Home recommendation is sourced from Memory, `memoryId` should be included when relevant.
- If Home recommendation is sourced from Sleep, `sleepInsightId` should be included when relevant.

## 4. Domain Contracts

### 4.1 UserProfile

Type name:

```ts
type UserProfile = {
  userId?: string;
  anonymousId: string;
  hasCompletedOnboarding: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

Purpose:

- Represents the minimum user identity and onboarding gate state needed for Stage 3 routing and continuity.

Source of truth:

- `product-logic.md` `AppEntryState`
- `Stage3StoreApi.getOrCreateAnonymousId()`

Lifecycle:

- Persistent logical identity state.
- Exists before onboarding completes.
- Survives across Room, Talk, Memory, Sleep, and Home.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `userId` | `string` | Optional | `undefined` | Present only if authenticated account exists | cross-route app shell | persistent | May map to backend account id later |
| `anonymousId` | `string` | Required | generated value | Must exist for guest-first flow | app entry, analytics, all route stores | persistent | Remains valid guest identity until upgraded |
| `hasCompletedOnboarding` | `boolean` | Required | `false` | Controls route decision; must not be inferred from Room or Talk usage | app entry, onboarding, home | persistent | Later backend may derive from onboarding completion record |
| `createdAt` | `ISODateTimeString` | Required | creation timestamp | Must be valid ISO datetime | none directly | persistent | Backend can own later |
| `updatedAt` | `ISODateTimeString` | Required | last write timestamp | Must be valid ISO datetime | none directly | persistent | Backend can own later |

### 4.2 OnboardingState

Type name:

```ts
type OnboardingState = {
  status: "not_started" | "in_progress" | "completed";
  q1State?: OnboardingPreset["q1State"];
  q2SupportStyle?: OnboardingPreset["q2SupportStyle"];
  activePresetId?: string;
  latestConsumedPresetId?: string;
  latestExpiredPresetId?: string;
  completedAt?: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

Purpose:

- Tracks onboarding progress and links it to the current or most recent onboarding preset lifecycle.

Source of truth:

- `product-logic.md` onboarding rules
- `AppEntryResolver` prerequisites

Lifecycle:

- Local draft during onboarding.
- Promoted to completed state when onboarding creates an active preset.
- Used by route decision and Room continuity.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `status` | `"not_started" \| "in_progress" \| "completed"` | Required | `"not_started"` | Must reflect onboarding progress, not Talk progress | onboarding, app entry | persistent | May later be backed by onboarding completion record |
| `q1State` | `OnboardingPreset["q1State"]` | Optional | `undefined` | Allowed only while draft exists or after completion for audit | onboarding | local draft then persistent audit if retained | Later backend may store answers separately |
| `q2SupportStyle` | `OnboardingPreset["q2SupportStyle"]` | Optional | `undefined` | Allowed only while draft exists or after completion for audit | onboarding | local draft then persistent audit if retained | Later backend may store answers separately |
| `activePresetId` | `string` | Optional | `undefined` | Must point to active preset only | app entry, room continuity | session-scoped reference | Backend may replace with relation |
| `latestConsumedPresetId` | `string` | Optional | `undefined` | Set after first Talk successfully consumes preset | room, talk, home debugging | persistent audit | Useful for activation funnel traceability |
| `latestExpiredPresetId` | `string` | Optional | `undefined` | Set when preset TTL passes without consumption | app entry, home debugging | persistent audit | Useful for drop-off analysis |
| `completedAt` | `ISODateTimeString` | Optional | `undefined` | Present only when `status = "completed"` | analytics only | persistent | Backend may own later |
| `updatedAt` | `ISODateTimeString` | Required | last write timestamp | Must be valid ISO datetime | none directly | persistent | Backend can own later |

### 4.3 OnboardingPreset

Type name:

```ts
type OnboardingPreset = {
  id: string;
  presetId: string;
  q1State:
    | "sleep_blocked"
    | "overthinking"
    | "anxious_irritated"
    | "lonely_need_presence";
  q2SupportStyle:
    | "sleep_guide"
    | "comfort_talk"
    | "mindfulness_guide"
    | "quiet_presence";
  baseMode:
    | "sleep_guide"
    | "comfort_talk"
    | "mindfulness_guide"
    | "quiet_presence";
  stateModifier:
    | "sleep_blocked"
    | "overthinking"
    | "anxious_irritated"
    | "lonely_need_presence"
    | "neutral_modifier";
  openingCopyId: string;
  replyLengthDefault: "short" | "medium";
  questionBudgetFirst3Turns: 0 | 1 | 2;
  sleepTransitionEnabled: boolean;
  fallbackChain: string[];
  status: "active" | "consumed" | "expired";
  createdAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
  consumedAt?: ISODateTimeString;
};
```

Purpose:

- Encodes the one-time first-session preset created by onboarding and consumed by Talk after the user enters from Room.

Source of truth:

- `product-logic.md` `OnboardingSessionPreset`

Lifecycle:

- Created after onboarding completes.
- Active until consumed by first Talk session or expired by TTL.
- Must not become a long-term profile.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique id, recommended `obp_` prefix | room, talk, analytics | session store with auditable persistence | Backend may issue ids later |
| `presetId` | `string` | Required | generated | Stable preset identifier used for traceability, not lookup-only reuse | room, talk, analytics | session store | Keep separate from object id if backend needs both |
| `q1State` | enum | Required | none | Must come from fixed onboarding option map | onboarding audit, talk | session store | Do not rename to runtime snake_case |
| `q2SupportStyle` | enum | Required | none | Must come from fixed onboarding option map | onboarding audit, talk | session store | Do not rename to runtime snake_case |
| `baseMode` | enum | Required | derived from mapping | Must be derived from onboarding mapping table | talk | session store | Backend can compute later |
| `stateModifier` | `string` | Required | derived | Must come from preset mapping table | talk | session store | Keep logical label stable |
| `openingCopyId` | `string` | Required | derived | Must reference approved copy variant | talk | session store | Backend/content service may own later |
| `replyLengthDefault` | `"short" \| "medium"` | Required | derived | Must come from preset mapping | talk | session store | Stable enum |
| `questionBudgetFirst3Turns` | `0 \| 1 \| 2` | Required | derived | Must be integer in allowed set | talk | session store | Stable enum |
| `sleepTransitionEnabled` | `boolean` | Required | derived | Controls first-session sleep transition behavior | talk | session store | Stable logical flag |
| `fallbackChain` | `string[]` | Required | `[]` | Must list allowed fallback copy or mode keys | talk, room audit | session store | May later become structured objects |
| `status` | `"active" \| "consumed" \| "expired"` | Required | `"active"` | Only one active preset allowed per user/anonymousId | app entry, room, talk | session store with audit trail | Backend should preserve lifecycle |
| `createdAt` | `ISODateTimeString` | Required | creation timestamp | Must be valid ISO datetime | analytics | session store | Backend can own later |
| `expiresAt` | `ISODateTimeString` | Required | createdAt + TTL | When past now, preset must not redirect to Room even if stored as active | app entry, room | session store | TTL recommended 30 minutes |
| `consumedAt` | `ISODateTimeString` | Optional | `undefined` | Present only when `status = "consumed"` | talk, analytics | session store with audit | Backend can own later |

Stale behavior:

- Stale is a derived condition, not a persisted preset status.
- A preset is stale when `status = "active"` but `expiresAt < now`, or when required fields are missing.
- Stale preset behavior must degrade to expired behavior.

### 4.4 RouteDecision

Type name:

```ts
type RouteDecision = {
  id: string;
  canonicalRoute: "/onboarding" | "/room" | "/home";
  reason:
    | "onboarding_incomplete"
    | "active_preset_redirect"
    | "returning_user_home"
    | "consumed_or_expired_preset_home";
  runtimeObservedPath?: "/" | "/onboarding" | "/room" | "/home";
  hasCompletedOnboarding: boolean;
  activePresetId?: string;
  activePresetState: "none" | "active" | "consumed" | "expired" | "stale";
  shouldRedirect: boolean;
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical app-entry decision object for Stage 3.

Source of truth:

- `product-logic.md` App Entry Resolver
- `home.md` Home entry guard inheritance

Lifecycle:

- Derived at app open or route recovery.
- May be logged for analytics and debugging.
- Not a long-term preference object.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable id per decision event | app entry, analytics | derived snapshot or analytics event | Backend may log decisions later |
| `canonicalRoute` | `"/onboarding" \| "/room" \| "/home"` | Required | none | Must follow canonical Stage 3 route logic, not current runtime shortcuts | app entry | derived runtime or audit snapshot | Backend need not override logic naming |
| `reason` | enum | Required | none | Must explain why route was chosen | app entry, home debugging | derived runtime or audit snapshot | Useful for later experiments |
| `runtimeObservedPath` | `"/" \| "/onboarding" \| "/room" \| "/home"` | Optional | `undefined` | Used only to record runtime compatibility mismatch | debugging only | derived runtime only | Remove when runtime fully aligns |
| `hasCompletedOnboarding` | `boolean` | Required | none | Must reflect `UserProfile.hasCompletedOnboarding` | app entry | derived from persistent state | Backend may compute server-side later |
| `activePresetId` | `string` | Optional | `undefined` | Required when `activePresetState = "active"` | app entry, room continuity | derived from session store | Backend may replace with relation |
| `activePresetState` | `"none" \| "active" \| "consumed" \| "expired" \| "stale"` | Required | `"none"` | `stale` means stored preset cannot safely redirect | app entry, home debugging | derived runtime or audit snapshot | Useful for defensive fallback analytics |
| `shouldRedirect` | `boolean` | Required | `true` | `false` only when canonical route already matches current route surface | app entry | derived runtime only | Runtime compat flag only |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived runtime or audit snapshot | Backend can log later |

### 4.5 HomeState

Type name:

```ts
type HomeState = {
  id: string;
  route: "/home";
  status: "entry_guard_redirect" | "recommendation_ready" | "fallback_ready";
  continuitySource?: "memory" | "sleep" | "talk" | "room" | "none";
  entryContextId: string;
  mainRecommendationId: string;
  mainCtaId: string;
  continuitySummary?: string;
  diagnosticsNavTargets?: ("talk" | "room" | "memory" | "sleep")[];
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical Home page read model.

Source of truth:

- `home.md` page-state and fallback rules
- `product-logic.md` Home recommendation priority and route gate

Lifecycle:

- Derived per Home render cycle.
- May be kept stable across one Home exposure for traceability.
- Not a long-term business object.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable for one Home exposure | home | derived snapshot | Backend can ignore if client-only |
| `route` | `"/home"` | Required | `"/home"` | Must stay canonical even if runtime uses `"/"` temporarily | home | derived runtime | Keep canonical naming |
| `status` | enum | Required | `"recommendation_ready"` | Must reflect only the top-level Home render state and avoid overlapping continuity/fallback sub-states | home | derived runtime or snapshot | Stable enum for UI states |
| `continuitySource` | `"memory" \| "sleep" \| "talk" \| "room" \| "none"` | Optional | `"none"` | Describes the dominant continuity source without becoming a competing page-state enum | home | derived runtime or snapshot | Useful for attribution and analytics |
| `entryContextId` | `string` | Required | none | Must reference `HomeEntryContext.id` | home | derived snapshot | Useful for click trace |
| `mainRecommendationId` | `string` | Required | none | Home shows exactly one main recommendation | home | derived snapshot | Do not support multi-recommendation arrays in Stage 3 |
| `mainCtaId` | `string` | Required | none | Home shows exactly one main CTA | home | derived snapshot | Keep one-to-one with main recommendation |
| `continuitySummary` | `string` | Optional | `undefined` | Must stay lightweight and non-technical | home | derived runtime only | Content service may own later |
| `diagnosticsNavTargets` | `("talk" \| "room" \| "memory" \| "sleep")[]` | Optional | `undefined` | Diagnostic-only; must not render visible secondary nav, tabs, cards, pills, or dashboard links on Stage 3 Home | debugging only | derived runtime only | Keep non-UI unless a later product doc explicitly changes Home layout |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

### 4.6 HomeEntryContext

Type name:

```ts
type HomeEntryContext = {
  id: string;
  routeDecisionId: string;
  routeDecisionReason: RouteDecision["reason"];
  canonicalHomePath: "/home";
  runtimeObservedPath?: "/" | "/home";
  sourceRecommendationId?: string;
  sourceRecommendationType?: HomeRecommendation["type"];
  latestTalkSessionId?: string;
  latestRoomSessionId?: string;
  latestSleepInsightId?: string;
  latestSleepCheckInId?: string;
  eligibleMemoryId?: string;
  missingDataKeys: (
    | "route_decision"
    | "latest_talk_session"
    | "latest_room_session"
    | "latest_sleep_check_in"
    | "latest_sleep_insight"
    | "eligible_memory"
    | "source_recommendation"
  )[];
  staleDataKeys: (
    | "active_onboarding_preset"
    | "latest_sleep_check_in"
    | "latest_sleep_insight"
    | "eligible_memory"
    | "source_recommendation"
  )[];
  activePresetState: "none" | "active_redirect" | "consumed" | "expired" | "stale";
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical Home entry/read context used to derive one main Home recommendation safely and traceably.

Source of truth:

- `product-logic.md` Home inputs
- `home.md` fallback, continuity, and data-alignment requirements

Lifecycle:

- Derived when user enters or refreshes Home.
- Must be stable long enough to trace Home recommendation exposure and click.
- May be regenerated when upstream continuity changes.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable for one Home exposure | home | derived snapshot | Useful for traceability |
| `routeDecisionId` | `string` | Required | none | Must reference `RouteDecision.id` | home | derived snapshot | Backend may log later |
| `routeDecisionReason` | `RouteDecision["reason"]` | Required | none | Must match current route-decision source | home | derived snapshot | Useful for debug and analytics |
| `canonicalHomePath` | `"/home"` | Required | `"/home"` | Must remain canonical | home | derived runtime only | Keep even if runtime uses root |
| `runtimeObservedPath` | `"/" \| "/home"` | Optional | `undefined` | Compatibility note only | debugging only | derived runtime only | Delete when runtime aligns |
| `sourceRecommendationId` | `string` | Optional | `undefined` | Present when Home was re-entered from prior recommendation context | home | derived snapshot | Can support loop analysis |
| `sourceRecommendationType` | `HomeRecommendation["type"]` | Optional | `undefined` | Must align with `sourceRecommendationId` when present | home | derived snapshot | Can support loop analysis |
| `latestTalkSessionId` | `string` | Optional | `undefined` | May be absent without blocking Home | home continuity | derived read model | Backend later may fill server-side |
| `latestRoomSessionId` | `string` | Optional | `undefined` | May be absent without blocking Home | home continuity | derived read model | Backend later may fill server-side |
| `latestSleepInsightId` | `string` | Optional | `undefined` | Must reference current usable insight snapshot only | home continuity | derived read model | Server may precompute later |
| `latestSleepCheckInId` | `string` | Optional | `undefined` | Must reference latest valid morning check-in / SleepLog-backed record | home continuity | derived read model | Server may precompute later |
| `eligibleMemoryId` | `string` | Optional | `undefined` | Present only for memory that passes eligibility rules | home continuity | derived read model | Server may precompute later |
| `missingDataKeys` | enum array | Required | `[]` | Must list absent inputs without exposing technical wording in UI | home fallback logic | derived runtime only | Good for diagnostics |
| `staleDataKeys` | enum array | Required | `[]` | Must list unsafe or stale inputs | home fallback logic | derived runtime only | Good for diagnostics |
| `activePresetState` | `"none" \| "active_redirect" \| "consumed" \| "expired" \| "stale"` | Required | `"none"` | If `"active_redirect"`, normal Home should not render | app entry, home fallback logic | derived runtime only | Useful during transition period |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

### 4.7 HomeRecommendation

Type name:

```ts
type HomeRecommendation = {
  id: string;
  type:
    | "review_memory"
    | "start_talk"
    | "sleep_checkin"
    | "tonight_suggestion";
  title: string;
  body?: string;
  priority: number;
  source:
    | "onboarding_preset"
    | "memory"
    | "talk_session"
    | "sleep_log"
    | "sleep_insight"
    | "room_session"
    | "system_default";
  sourceId?: string;
  sourceDomain: "onboarding" | "memory" | "talk" | "sleep" | "room" | "system";
  surface: "home_main";
  fallbackKind:
    | "none"
    | "system_default_fallback"
    | "data_partial_fallback"
    | "error_safe_fallback";
  cta: HomeCTA;
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical Stage 3 Home next-best-action object.

Source of truth:

- `product-logic.md` `HomeRecommendation`
- `home.md` recommendation priority, forbidden sources, and fallback behavior

Lifecycle:

- Derived snapshot, not a long-term user profile.
- Must keep stable `id`, source, and CTA for a single recommendation exposure lifecycle.
- Home shows exactly one main recommendation and one main CTA.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable for current recommendation exposure | home, analytics | derived snapshot | Keep stable for view/click trace |
| `type` | enum | Required | none | Must stay within canonical Stage 3 type list | home | derived snapshot | Do not invent runtime-only recommendation types |
| `title` | `string` | Required | none | Must describe one next step clearly | home | derived snapshot | Content source may own later |
| `body` | `string` | Optional | `undefined` | Must stay lightweight and non-technical | home | derived snapshot | Content source may own later |
| `priority` | `number` | Required | none | Higher-priority upstream sources win before fallback | home derivation | derived runtime or snapshot | Ranking logic may move server-side later |
| `source` | enum | Required | none | Must be traceable; `system_default` is the only source allowed without `sourceId` | home, analytics | derived snapshot | Preserve exact enum names |
| `sourceId` | `string` | Optional | `undefined` | Required unless `source = "system_default"` | home, analytics | derived snapshot | Traceability contract |
| `sourceDomain` | enum | Required | derived from `source` | Must explicitly identify product domain | home, analytics | derived snapshot | Helps cross-team mapping |
| `surface` | `"home_main"` | Required | `"home_main"` | Home has one main recommendation surface only | home | derived snapshot | Prevent multi-surface drift |
| `fallbackKind` | enum | Required | `"none"` | Must reflect why fallback content was used | home fallback logic | derived snapshot | Keeps fallback semantics explicit |
| `cta` | `HomeCTA` | Required | none | Must be one main CTA only | home | derived snapshot | Stable for click trace |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

Recommendation priority rules:

1. Users who still need onboarding or Room redirect should not normally render Home.
2. Normal Home priority is:
   - `review_memory`
   - `sleep_checkin`
   - `tonight_suggestion`
   - `start_talk`
   - `system_default` fallback to `start_talk`
3. `complete_onboarding` and `enter_room` are handled by `RouteDecision` / entry guard, not by normal `HomeRecommendation` in Stage 3.

Forbidden recommendation sources:

- hidden memory
- contradicted or disagree-equivalent memory
- archived memory when used as active continuity
- stale or untraceable memory
- onboarding preset directly as a Sleep source
- raw transcript history
- medicalized sleep report objects

### 4.8 HomeCTA

Type name:

```ts
type HomeCTA = {
  id: string;
  label: string;
  target: "talk";
  targetPath: "/talk";
  homeRecommendationId: string;
  entryContext: TalkEntryContext;
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical one-CTA action object for Home.

Source of truth:

- `product-logic.md` `HomeRecommendation.cta`
- `TalkEntryContext` rules
- `home.md` one-recommendation / one-CTA rule

Lifecycle:

- Created with the Home recommendation snapshot.
- Must remain stable for one recommendation exposure.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable for one CTA exposure | home, analytics | derived snapshot | Useful for click analytics |
| `label` | `string` | Required | none | Must map cleanly to the recommendation intent | home | derived snapshot | Content source may own later |
| `target` | `"talk"` | Required | `"talk"` | Stage 3 normal Home CTA always hands off to Talk | home | derived snapshot | Non-Talk Home CTAs require a later product doc |
| `targetPath` | `"/talk"` | Required | `"/talk"` | Must always be the canonical Talk route | home | derived snapshot | Runtime may still need compatibility adapters |
| `homeRecommendationId` | `string` | Required | none | Must reference current `HomeRecommendation.id` | home, analytics | derived snapshot | Required for click trace |
| `entryContext` | `TalkEntryContext` | Required | none | Required for every Stage 3 Home CTA because Home always hands off to Talk | home -> talk | derived snapshot | Preserve exact payload fields |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

Home-to-Talk entry context requirements:

- `target` must be `"talk"`.
- `targetPath` must be `"/talk"`.
- `entryContext.source` must be `"home"`.
- `entryContext.homeRecommendationId` must equal `homeRecommendationId`.
- If the recommendation came from Memory, include `memoryId` when available.
- If the recommendation came from Sleep, include `sleepInsightId` when available.
- Memory, Sleep, and Room may provide recommendation sources, but Stage 3 Home hands off to Talk rather than directly to those pages.
- onboarding incomplete must be handled by `RouteDecision` / entry guard before normal Home render.
- active unexpired onboarding preset must redirect to Room before normal Home render.
- Do not pass full transcript content or raw memory-management payloads.

### 4.9 SleepInsight

Type name:

```ts
type SleepInsight = {
  id: string;
  period: "single_night" | "3_day" | "7_day" | "14_day";
  startDate: ISODateString;
  endDate: ISODateString;
  title: string;
  body: string;
  confidence: "low" | "medium" | "high";
  basedOn: {
    sleepCheckInIds: string[];
    sleepSessionId?: string;
    talkSessionIds?: string[];
    roomSessionIds?: string[];
    memoryItemIds?: string[];
    memoryFeedbackIds?: string[];
  };
  suggestionType:
    | "keep_consistent_bedtime"
    | "try_gentler_talk"
    | "use_quiet_room"
    | "reduce_late_stimulation"
    | "short_checkin"
    | "no_change_needed"
    | "collect_more_data";
  cta?: {
    label: string;
    target: "talk" | "room" | "sleep_checkin";
    entryContext?: TalkEntryContext;
  };
  homeEligible: boolean;
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical lightweight Sleep insight snapshot for Stage 3.
- Supports Sleep surfaces and Home `tonight_suggestion` without turning into a medicalized sleep report.

Source of truth:

- `product-logic.md` `SleepInsight`
- canonical Stage 3 `SleepCheckIn` and `SleepSession` contracts in this document

Lifecycle:

- Derived snapshot built from one or more `SleepCheckIn` records and optional `SleepSession` continuity.
- Recomputable, but stable for the duration of a single exposed insight.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique snapshot id per exposed insight | sleep, home continuity | derived snapshot | Backend can precompute later |
| `period` | `"single_night" \| "3_day" \| "7_day" \| "14_day"` | Required | none | Must stay within approved aggregation windows and first-use single-night support | sleep | derived snapshot | Stable enum |
| `startDate` | `ISODateString` | Required | none | Must align with `period` window start | sleep | derived snapshot | Stable date field |
| `endDate` | `ISODateString` | Required | none | Must align with `period` window end | sleep | derived snapshot | Stable date field |
| `title` | `string` | Required | none | Must remain lightweight, non-clinical, and recommendation-oriented | sleep, home | derived snapshot | Content service may own later |
| `body` | `string` | Required | none | Must not become a medicalized report or diagnostic summary | sleep, home | derived snapshot | Content service may own later |
| `confidence` | `"low" \| "medium" \| "high"` | Required | `"low"` | Must stay within approved set | sleep, home | derived snapshot | Stable enum |
| `basedOn.sleepCheckInIds` | `string[]` | Required | none | Must include at least one valid `SleepCheckIn.id`; this is the contract-level equivalent of `product-logic.md` `sleepLogIds` | sleep, home continuity | derived snapshot | Backend may map directly from sleep log records |
| `basedOn.sleepSessionId` | `string` | Optional | `undefined` | May reference a lightweight `SleepSession` continuity aggregate when present | sleep, home continuity | derived snapshot | Optional server-side aggregate link |
| `basedOn.talkSessionIds` | `string[]` | Optional | `undefined` | Optional supporting continuity only | sleep | derived snapshot | Optional |
| `basedOn.roomSessionIds` | `string[]` | Optional | `undefined` | Optional supporting continuity only | sleep | derived snapshot | Optional |
| `basedOn.memoryItemIds` | `string[]` | Optional | `undefined` | Hidden memory must never appear here | sleep | derived snapshot | Optional |
| `basedOn.memoryFeedbackIds` | `string[]` | Optional | `undefined` | Optional supporting continuity only | sleep | derived snapshot | Optional |
| `suggestionType` | enum | Required | none | Must stay within approved Stage 3 suggestion types | sleep, home | derived snapshot | Stable enum |
| `cta` | object | Optional | `undefined` | If present, must stay recommendation-oriented and non-medical | sleep | derived snapshot | May expand later |
| `homeEligible` | `boolean` | Required | `false` | `true` only when insight is safe to surface as Home `tonight_suggestion` continuity | home continuity | derived snapshot | Useful for Worker D derivation rules |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

Rules:

- `basedOn.sleepCheckInIds` must exist.
- `single_night` may be generated from one `SleepCheckIn`.
- `3_day` / `7_day` / `14_day` are window labels, not minimum data requirements.
- Low-confidence insights may be generated from sparse data.
- `basedOn.sleepSessionId` is optional and must stay lightweight.
- `OnboardingPreset` must not be a direct source.
- Hidden memory must not appear in `basedOn.memoryItemIds`.
- Home may surface a `SleepInsight` only when `homeEligible = true`.
- This contract must not expand into a clinical scorecard, diagnosis, or full sleep report.

### 4.10 SleepGoal

Type name:

```ts
type SleepGoal = {
  id: string;
  status: "future_only";
  isActive: false;
  reason: "not_defined_in_stage3_product_logic";
};
```

Purpose:

- Explicitly reserves the SleepGoal domain so Worker D does not invent active Stage 3 goal logic.

Source of truth:

- Absence from `product-logic.md`

Lifecycle:

- Future-only.
- Not used by current Stage 3 product logic.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated placeholder if needed | Only needed if future scaffolding exists | none | do not persist in Stage 3 | Replace when product doc defines goals |
| `status` | `"future_only"` | Required | `"future_only"` | Must remain future-only in Stage 3 | none | do not persist in Stage 3 | Replace when product doc defines goals |
| `isActive` | `false` | Required | `false` | Must never be `true` in Stage 3 | none | do not persist in Stage 3 | Replace when activated by product docs |
| `reason` | `"not_defined_in_stage3_product_logic"` | Required | fixed value | Documents why it is inactive | none | do not persist in Stage 3 | Replace when activated by product docs |

### 4.11 SleepSession

Type name:

```ts
type SleepSession = {
  id: string;
  sleepDate: ISODateString;
  latestSleepCheckInId?: string;
  latestSleepInsightId?: string;
  preSleepTalkSessionId?: string;
  preSleepRoomSessionId?: string;
  continuityState: "none" | "partial" | "complete";
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

Purpose:

- Logical nightly continuity aggregate for Stage 3.
- Keeps Sleep continuity lightweight and recommendation-friendly without turning Home into a full report surface.

Source of truth:

- `product-logic.md` `SleepLog`, `SleepInsight`, `TalkSession`, `RoomSession`

Lifecycle:

- Derived by sleep date from persisted business objects.
- Updated when morning check-in or new insight becomes available.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable per logical sleep-date continuity record | sleep, home continuity | derived snapshot | Could be server-generated later |
| `sleepDate` | `ISODateString` | Required | none | Must identify the night being reflected on | sleep, home continuity | derived snapshot | Stable key candidate |
| `latestSleepCheckInId` | `string` | Optional | `undefined` | Must reference the latest valid check-in for `sleepDate` | sleep, home continuity | derived snapshot | Server may precompute later |
| `latestSleepInsightId` | `string` | Optional | `undefined` | Must reference current usable insight snapshot | sleep, home continuity | derived snapshot | Server may precompute later |
| `preSleepTalkSessionId` | `string` | Optional | `undefined` | May link prior Talk session only | sleep continuity | derived snapshot | Keep optional |
| `preSleepRoomSessionId` | `string` | Optional | `undefined` | May link prior Room session only | sleep continuity | derived snapshot | Keep optional |
| `continuityState` | `"none" \| "partial" \| "complete"` | Required | `"none"` | Must describe continuity completeness, not quality score | sleep, home fallback logic | derived snapshot | Stable UI enum |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |
| `updatedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

### 4.12 SleepCheckIn

Type name:

```ts
type SleepCheckIn = {
  id: string;
  sleepDate: ISODateString;
  checkInDate: ISODateString;
  timezone: string;
  intendedBedtime?: string;
  actualBedtime?: string;
  wakeTime?: string;
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  easeOfFallingAsleep?: 1 | 2 | 3 | 4 | 5;
  nightAwakenings?: number;
  morningEnergy?: 1 | 2 | 3 | 4 | 5;
  preSleepTalkSessionId?: string;
  preSleepRoomSessionId?: string;
  notes?: string;
  source: "manual_morning_checkin" | "talk_followup" | "room_followup";
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

Purpose:

- Canonical Stage 3 morning check-in contract.
- This is the Sleep check-in shape that backs `SleepLog` semantics from `product-logic.md`.

Source of truth:

- `product-logic.md` `SleepLog`
- Stage 3 rule: morning check-in for last night

Lifecycle:

- Created during morning check-in flow.
- Persistent business object.
- Feeds `SleepSession` continuity and `SleepInsight` derivation.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique id | sleep, home continuity | persistent | May map to backend sleep log id |
| `sleepDate` | `ISODateString` | Required | none | Must represent the night being evaluated | sleep, home continuity | persistent | Stable key candidate |
| `checkInDate` | `ISODateString` | Required | current date | Must be the date the user submitted the check-in | sleep | persistent | Backend can derive later |
| `timezone` | `string` | Required | local timezone | Required to interpret date fields safely | sleep | persistent | Server should preserve |
| `intendedBedtime` | `string` | Optional | `undefined` | HH:mm-like string if provided | sleep | persistent | Normalize later if needed |
| `actualBedtime` | `string` | Optional | `undefined` | HH:mm-like string if provided | sleep | persistent | Normalize later if needed |
| `wakeTime` | `string` | Optional | `undefined` | HH:mm-like string if provided | sleep | persistent | Normalize later if needed |
| `sleepQuality` | `1 \| 2 \| 3 \| 4 \| 5` | Optional | `undefined` | Must stay in allowed rating range | sleep | persistent | Stable enum |
| `easeOfFallingAsleep` | `1 \| 2 \| 3 \| 4 \| 5` | Optional | `undefined` | Must stay in allowed rating range | sleep | persistent | Stable enum |
| `nightAwakenings` | `number` | Optional | `undefined` | Must be integer >= 0 | sleep | persistent | Stable numeric field |
| `morningEnergy` | `1 \| 2 \| 3 \| 4 \| 5` | Optional | `undefined` | Must stay in allowed rating range | sleep | persistent | Stable enum |
| `preSleepTalkSessionId` | `string` | Optional | `undefined` | Link only the relevant pre-sleep Talk session | sleep continuity | persistent | Useful for later insight derivation |
| `preSleepRoomSessionId` | `string` | Optional | `undefined` | Link only the relevant pre-sleep Room session | sleep continuity | persistent | Useful for later insight derivation |
| `notes` | `string` | Optional | `undefined` | Freeform note; must not imply automated monitoring | sleep | persistent | Later moderation rules may apply |
| `source` | `"manual_morning_checkin" \| "talk_followup" \| "room_followup"` | Required | `"manual_morning_checkin"` | Must stay within approved Stage 3 sources | sleep | persistent | Stable enum |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | persistent | Backend can own later |
| `updatedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | persistent | Backend can own later |

### 4.13 CompanionConversation

Type name:

```ts
type CompanionConversation = {
  id: string;
  entryContext: TalkEntryContext;
  mode:
    | "open_chat"
    | "sleep_checkin"
    | "gentle_start"
    | "quiet_company"
    | "memory_reflection"
    | "onboarding_first_session";
  startedAt: ISODateTimeString;
  endedAt?: ISODateTimeString;
  durationSeconds?: number;
  messageCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  sessionSummary?: string;
  emotionalTone?: "calm" | "anxious" | "sad" | "neutral" | "restless";
  sleepRelated?: boolean;
  latestMemoryExtractionRunId?: string;
  completedMemoryExtractionRunId?: string;
  memoryExtractionStatus:
    | "not_started"
    | "running"
    | "skipped"
    | "completed"
    | "failed";
  generatedMemoryItemIds?: string[];
};
```

Purpose:

- Canonical Stage 3 conversation/session contract for Talk.
- This is the implementation-facing conversation object aligned to `product-logic.md` `TalkSession`.

Source of truth:

- `product-logic.md` `TalkSession`

Lifecycle:

- Created when Talk starts.
- Ends when user exits or session is explicitly completed.
- Drives memory extraction and downstream continuity.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique id | talk, memory extraction, sleep continuity | persistent | May map to backend talk session id |
| `entryContext` | `TalkEntryContext` | Required | none | Must be present for all cross-page entries | talk, analytics | persistent | Preserve exact payload contract |
| `mode` | enum | Required | derived from entry context | Must stay within approved Stage 3 modes | talk | persistent | Stable enum |
| `startedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | talk | persistent | Backend can own later |
| `endedAt` | `ISODateTimeString` | Optional | `undefined` | Present only after session ends | talk, analytics | persistent | Backend can own later |
| `durationSeconds` | `number` | Optional | `undefined` | Must be >= 0 | analytics | persistent | Backend can compute later |
| `messageCount` | `number` | Required | `0` | Must equal user + assistant count when system messages excluded | talk, analytics | persistent | Keep definition stable |
| `userMessageCount` | `number` | Required | `0` | Must be >= 0 | talk, analytics | persistent | Stable counter |
| `assistantMessageCount` | `number` | Required | `0` | Must be >= 0 | talk, analytics | persistent | Stable counter |
| `sessionSummary` | `string` | Optional | `undefined` | Lightweight summary only | memory, sleep, analytics | persistent | May be generated later |
| `emotionalTone` | enum | Optional | `undefined` | Must stay within approved Stage 3 set | memory, sleep | persistent | Stable enum |
| `sleepRelated` | `boolean` | Optional | `undefined` | Indicates sleep relevance only | sleep, home continuity | persistent | Stable logical flag |
| `latestMemoryExtractionRunId` | `string` | Optional | `undefined` | Always points to latest run regardless of status | talk, memory | persistent | Preserve semantics |
| `completedMemoryExtractionRunId` | `string` | Optional | `undefined` | Only points to successful completed run | talk, memory | persistent | Preserve semantics |
| `memoryExtractionStatus` | enum | Required | `"not_started"` | Reflects latest run only, not aggregate history | talk, memory | persistent | Preserve semantics |
| `generatedMemoryItemIds` | `string[]` | Optional | `undefined` | Represents completed run output only | memory | persistent | Preserve semantics |

### 4.14 ConversationMessage

Type name:

```ts
type ConversationMessage = {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  contentText: string;
  createdAt: ISODateTimeString;
};
```

Purpose:

- Minimal Stage 3 message contract that keeps `session`, `message`, and `memory` separate concepts.

Source of truth:

- `AGENTS.md` data-discipline rule
- `product-logic.md` TalkSession count semantics

Lifecycle:

- Created during Talk.
- Supports session counts and future transcript persistence.
- Not a Home or Memory recommendation object.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique id | talk | persistent if messages are stored | Backend may own later |
| `conversationId` | `string` | Required | none | Must reference `CompanionConversation.id` | talk | persistent if messages are stored | Backend relation later |
| `role` | `"user" \| "assistant" \| "system"` | Required | none | Must stay within approved roles | talk | persistent if messages are stored | Stable enum |
| `contentText` | `string` | Required | `""` | Plaintext message body; do not overload with memory metadata | talk | persistent if messages are stored | Later multimodal support may extend |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | talk | persistent if messages are stored | Backend can own later |

### 4.15 MemoryItem

Type name:

```ts
type MemoryItem = {
  id: string;
  source:
    | "talk_session"
    | "sleep_log"
    | "room_session"
    | "memory_feedback"
    | "system_inference";
  sourceId: string;
  type:
    | "preference"
    | "support_style"
    | "sleep_pattern"
    | "emotional_pattern"
    | "routine"
    | "avoidance";
  title: string;
  body: string;
  evidence?: {
    sourceText?: string;
    sourceSummary?: string;
    sourceSessionId?: string;
  };
  confidence: "low" | "medium" | "high";
  influenceWeight: number;
  status:
    | "active"
    | "weakened"
    | "contradicted"
    | "hidden"
    | "archived";
  excludeFromPersonalization: boolean;
  hiddenAt?: ISODateTimeString;
  impactRules?: {
    talkTone?: "gentle" | "quiet" | "reflective" | "direct";
    talkIntensity?: "low" | "medium" | "high";
    roomPreset?: "quiet" | "warm" | "minimal" | "ambient" | "soft_focus";
    sleepSuggestionWeight?: number;
  };
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

Purpose:

- Canonical persistent Memory business object.

Source of truth:

- `product-logic.md` `MemoryItem`
- `home.md` Home forbidden-memory constraints

Lifecycle:

- Generated after Talk memory extraction or other approved sources.
- Updated by Agree / Disagree / Hide feedback.
- Read by Talk, Sleep, and Home under strict eligibility rules.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique id | memory, talk, sleep, home continuity | persistent | Backend may own later |
| `source` | enum | Required | none | Must identify real upstream source | memory, analytics | persistent | Stable enum |
| `sourceId` | `string` | Required | none | Must be traceable to the source object | memory, analytics | persistent | Traceability contract |
| `type` | enum | Required | none | Must stay within approved Stage 3 memory types | memory | persistent | Stable enum |
| `title` | `string` | Required | none | Must summarize one reusable observation | memory, home continuity | persistent | Content source may own later |
| `body` | `string` | Required | none | Must describe one observation, not a transcript dump | memory | persistent | Content source may own later |
| `evidence` | object | Optional | `undefined` | Optional supporting evidence only | memory | persistent | May expand later |
| `confidence` | `"low" \| "medium" \| "high"` | Required | `"low"` | Must stay within approved set | memory | persistent | Stable enum |
| `influenceWeight` | `number` | Required | implementation-defined numeric baseline | Must be >= 0 | talk, sleep, home derivation | persistent | Numeric tuning may evolve later |
| `status` | `"active" \| "weakened" \| "contradicted" \| "hidden" \| "archived"` | Required | `"active"` | Canonical persisted status from product logic; do not replace with runtime-only names like disagreed/blocked/expired | memory, talk, sleep, home derivation | persistent | Preserve exact enum |
| `excludeFromPersonalization` | `boolean` | Required | `false` | Explicit override defined by product logic | talk, sleep, home derivation | persistent | Preserve exact flag |
| `hiddenAt` | `ISODateTimeString` | Optional | `undefined` | Present when `status = "hidden"` | memory | persistent | Backend can own later |
| `impactRules` | object | Optional | `undefined` | Optional structured downstream hints only | talk, sleep, room | persistent | May evolve later |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | persistent | Backend can own later |
| `updatedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | persistent | Backend can own later |

Memory eligibility decision:

- Canonical persisted status is `active | weakened | contradicted | hidden | archived`.
- Memory eligibility is not status-only in Stage 3 because `product-logic.md` explicitly defines `excludeFromPersonalization`.
- Therefore Home and Talk eligibility is derived from:
  - `status`
  - `excludeFromPersonalization`
- Eligible for Home continuity:
  - `status = "active"` or `status = "weakened"`
  - and `excludeFromPersonalization = false`
- Ineligible for Home continuity:
  - `status = "contradicted"` which covers disagree-equivalent behavior
  - `status = "hidden"`
  - `status = "archived"`
  - any item with `excludeFromPersonalization = true`
- `expired` and `blocked` are not canonical persisted `MemoryItem.status` values in Stage 3. If UI logic needs those concepts, it must model them as derived ineligibility reasons rather than inventing new persisted memory statuses.

### 4.16 MemoryFeedbackEvent

Type name:

```ts
type MemoryFeedbackEvent = {
  id: string;
  memoryItemId: string;
  action: "agree" | "disagree" | "hide" | "unhide";
  previousStatus: MemoryItem["status"];
  resultingStatus: MemoryItem["status"];
  excludeFromPersonalization: boolean;
  source: "memory_page" | "talk" | "home";
  createdAt: ISODateTimeString;
};
```

Purpose:

- Canonical Stage 3 feedback event object for memory actions so Worker D does not need to invent feedback history shape.

Source of truth:

- `product-logic.md` feedback-driven memory behavior
- `MemoryItem`

Lifecycle:

- Created whenever an eligible memory feedback action occurs.
- Provides auditable event history separate from the resulting `MemoryItem` state.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique feedback event id | memory, analytics | persistent | Backend may own later |
| `memoryItemId` | `string` | Required | none | Must reference an existing `MemoryItem.id` | memory, analytics | persistent relation | Stable relation |
| `action` | `"agree" \| "disagree" \| "hide" \| "unhide"` | Required | none | Must stay within approved Stage 3 feedback actions | memory, analytics | persistent | Stable enum |
| `previousStatus` | `MemoryItem["status"]` | Required | none | Must record the prior memory status before applying feedback | memory, analytics | persistent | Useful for audits and undo rules |
| `resultingStatus` | `MemoryItem["status"]` | Required | none | Must record the resulting memory status after applying feedback | memory, analytics | persistent | Useful for audits and undo rules |
| `excludeFromPersonalization` | `boolean` | Required | none | Must reflect the post-feedback personalization exclusion state | memory, talk, sleep, home derivation | persistent | Preserve exact logical flag |
| `source` | `"memory_page" \| "talk" \| "home"` | Required | none | Must identify where the feedback action was initiated | memory, analytics | persistent | Stable enum |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | persistent | Backend can own later |

Rules:

- `agree` should normally keep or strengthen active memory.
- `disagree` should normally produce `contradicted` or `weakened` memory.
- `hide` should set `resultingStatus = "hidden"` and `excludeFromPersonalization = true`.
- `unhide` may restore a memory only if later product logic explicitly allows it.
- Hidden or contradicted memory must not influence Home, Talk, Sleep, or Room personalization.

### 4.17 RoomOption

Type name:

```ts
type RoomOption = {
  id: string;
  title: string;
  description?: string;
  preset: "quiet" | "warm" | "minimal" | "ambient" | "soft_focus";
  stimulationLevel: "low" | "medium";
  isActive: boolean;
  sortOrder: number;
};
```

Purpose:

- Canonical Room catalog item contract for the fixed Stage 3 three-room set.

Source of truth:

- `product-logic.md` `RoomOption`

Lifecycle:

- Fixed configuration, not onboarding output.
- Read by Room, referenced by RoomState and RoomSession.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | configured value | Stable room option id | room | config or persistent catalog | Backend may serve later |
| `title` | `string` | Required | none | Must name one room option | room | config | Content source may own later |
| `description` | `string` | Optional | `undefined` | Lightweight descriptive copy only | room | config | Content source may own later |
| `preset` | enum | Required | none | Must stay within approved Stage 3 room presets | room, talk handoff | config | Stable enum |
| `stimulationLevel` | `"low" \| "medium"` | Required | none | Must remain non-medical and lightweight | room | config | Stable enum |
| `isActive` | `boolean` | Required | `true` | Onboarding must not toggle this per user | room | config | Future catalog controls only |
| `sortOrder` | `number` | Required | none | Fixed order; onboarding must not reorder | room | config | Stable integer |

### 4.18 RoomView

Type name:

```ts
type RoomView = {
  id: string;
  source: RoomEntrySource;
  onboardingPresetId?: string;
  homeRecommendationId?: string;
  memoryItemId?: string;
  sleepInsightId?: string;
  viewedAt: ISODateTimeString;
};
```

Purpose:

- Canonical Room exposure object for entering the Room page before the user taps a room.

Source of truth:

- `product-logic.md` `RoomView`

Lifecycle:

- Created when Room is entered.
- Must exist before any room selection.
- Must not be collapsed into `RoomSession` or `RoomState`.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique view id | room, analytics | persistent or auditable snapshot | Backend may log later |
| `source` | `RoomEntrySource` | Required | none | Must explain how user reached Room using the shared Stage 3 Room handoff enum | room, analytics | persistent or auditable snapshot | Stable enum |
| `onboardingPresetId` | `string` | Optional | `undefined` | Present only for onboarding carry-through | room, analytics | session reference | Optional relation |
| `homeRecommendationId` | `string` | Optional | `undefined` | Present only for Home handoff | room, analytics | snapshot reference | Optional relation |
| `memoryItemId` | `string` | Optional | `undefined` | Present only for Memory CTA handoff | room, analytics | snapshot reference | Optional relation |
| `sleepInsightId` | `string` | Optional | `undefined` | Present only for Sleep handoff | room, analytics | snapshot reference | Optional relation |
| `viewedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | persistent or auditable snapshot | Backend may log later |

### 4.19 RoomSession

Type name:

```ts
type RoomSession = {
  id: string;
  roomId: string;
  source: RoomEntrySource;
  roomViewId?: string;
  onboardingPresetId?: string;
  homeRecommendationId?: string;
  memoryItemId?: string;
  sleepInsightId?: string;
  startedAt: ISODateTimeString;
  endedAt?: ISODateTimeString;
  durationSeconds?: number;
  exitReason?: "tap_to_talk" | "leave_page" | "app_background" | "timeout";
  followedByTalkSessionId?: string;
  followedBySleepCheckInId?: string;
};
```

Purpose:

- Canonical user-selected Room usage object created only after a room is tapped.

Source of truth:

- `product-logic.md` `RoomSession`

Lifecycle:

- Created only after the user taps a room.
- Ends when Talk begins or the user leaves Room.
- Must not be collapsed into `RoomView` or `RoomState`.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable unique session id | room, talk handoff, analytics | persistent | Backend may own later |
| `roomId` | `string` | Required | none | Must reference the selected `RoomOption.id` | room, talk handoff | persistent | Stable relation |
| `source` | `RoomEntrySource` | Required | none | Must explain what initiated the room selection using the shared Stage 3 Room handoff enum | room, analytics | persistent | Stable enum |
| `roomViewId` | `string` | Optional | `undefined` | May reference the `RoomView` that preceded the tap | room, analytics | persistent relation | Optional relation |
| `onboardingPresetId` | `string` | Optional | `undefined` | Present only when first-session preset is being carried forward | room, talk handoff | session reference | Optional relation |
| `homeRecommendationId` | `string` | Optional | `undefined` | Present only when Home handed user to Room | room, analytics | persistent relation | Optional relation |
| `memoryItemId` | `string` | Optional | `undefined` | Present only for Memory CTA handoff | room, analytics | persistent relation | Optional relation |
| `sleepInsightId` | `string` | Optional | `undefined` | Present only for Sleep handoff | room, analytics | persistent relation | Optional relation |
| `startedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | room, analytics | persistent | Backend can own later |
| `endedAt` | `ISODateTimeString` | Optional | `undefined` | Present only after session ends | room, analytics | persistent | Backend can own later |
| `durationSeconds` | `number` | Optional | `undefined` | Must be >= 0 | analytics | persistent | Backend can compute later |
| `exitReason` | enum | Optional | `undefined` | Must stay within approved exit reasons | room, analytics | persistent | Stable enum |
| `followedByTalkSessionId` | `string` | Optional | `undefined` | Present when the room session leads into Talk | room, talk handoff | persistent relation | Optional relation |
| `followedBySleepCheckInId` | `string` | Optional | `undefined` | Contract-level rename aligned to `SleepCheckIn` domain | room, sleep continuity | persistent relation | Maps to product-logic sleep-log linkage |

### 4.20 RoomState

Type name:

```ts
type RoomState = {
  id: string;
  route: "/room";
  roomOptionIds: [string, string, string];
  roomViewId: string;
  activeRoomId?: string;
  roomSessionId?: string;
  continuityReason: RoomEntrySource;
  onboardingPresetId?: string;
  onboardingPresetStatus?: "active" | "consumed" | "expired" | "stale";
  talkEntryReady: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

Purpose:

- Canonical Room continuity contract.
- Represents Room as the handoff surface between onboarding or later continuity and Talk, not just transient UI state.

Source of truth:

- `product-logic.md` Room rules, RoomView/RoomSession separation, Room -> Talk payload

Lifecycle:

- Created when Room is entered.
- `roomViewId` exists before any room is tapped.
- `roomSessionId` exists only after user actively taps a room.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated | Stable Room state id for current entry | room | derived snapshot | Optional client-only |
| `route` | `"/room"` | Required | `"/room"` | Must stay canonical | room | derived runtime | Stable route naming |
| `roomOptionIds` | `[string, string, string]` | Required | fixed configured 3 ids | Must contain exactly 3 room options | room | derived from fixed config | Backend may later serve catalog |
| `roomViewId` | `string` | Required | generated | Must reference a real `RoomView.id` and exists on Room entry before tap | room, analytics | persistent or derived snapshot | Preserve RoomView != RoomSession |
| `activeRoomId` | `string` | Optional | `undefined` | May exist as current highlighted preview, but does not imply room session | room | derived runtime | Keep separate from session |
| `roomSessionId` | `string` | Optional | `undefined` | Must reference a real `RoomSession.id` and is present only after user taps a room | room, talk handoff | persistent | Backend may own later |
| `continuityReason` | `RoomEntrySource` | Required | `"direct"` | Must explain why Room was entered using the shared Stage 3 Room handoff enum | room, analytics | derived snapshot | Useful for attribution |
| `onboardingPresetId` | `string` | Optional | `undefined` | Present only when Room is carrying active first-session preset | room, talk handoff | session-scoped reference | Preserve exact relation |
| `onboardingPresetStatus` | `"active" \| "consumed" \| "expired" \| "stale"` | Optional | `undefined` | `stale` is derived, not persisted on preset | room, talk handoff | derived runtime | Useful for quiet downgrade logic |
| `talkEntryReady` | `boolean` | Required | `false` | Must become `true` only after room tap creates `roomSessionId` | room | derived runtime | Stable interaction guard |
| `createdAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |
| `updatedAt` | `ISODateTimeString` | Required | now | Must be valid ISO datetime | analytics | derived snapshot | Backend can log later |

Room continuity rules:

- Room must always show 3 fixed options.
- Onboarding preset must not reorder, highlight, or reduce room options.
- If onboarding preset is active, Talk receives full preset after room tap.
- If onboarding preset is stale or expired, Room degrades quietly to default Room -> Talk behavior.
- `after_onboarding` means Room carries an active onboarding preset.
- `home_handoff` means Room was reached from Home.
- `memory_handoff` means Room was reached from Memory context.
- `sleep_handoff` means Room was reached from Sleep context.
- `direct` means the user entered Room directly without contextual handoff.

### 4.21 Ritual

Type name:

```ts
type Ritual = {
  id: string;
  status: "future_only";
  isActive: false;
  reason: "not_defined_in_stage3_product_logic";
};
```

Purpose:

- Explicit future-only boundary object to prevent accidental Stage 3 runtime invention.

Source of truth:

- Absence from `product-logic.md`

Lifecycle:

- Future-only.
- Not consumed by current routes, Home, Talk, Memory, Room, or Sleep.

| Field | Type | Req | Default | Validation rule | UI consumer | Persistence assumption | Future backend/API note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `string` | Required | generated placeholder if needed | Only needed if future scaffolding exists | none | do not persist in Stage 3 | Replace when product doc defines rituals |
| `status` | `"future_only"` | Required | `"future_only"` | Must remain future-only in Stage 3 | none | do not persist in Stage 3 | Replace when activated by product docs |
| `isActive` | `false` | Required | `false` | Must never be `true` in Stage 3 | none | do not persist in Stage 3 | Replace when activated by product docs |
| `reason` | `"not_defined_in_stage3_product_logic"` | Required | fixed value | Documents why it is inactive | none | do not persist in Stage 3 | Replace when activated by product docs |

### 4.22 Recommendation

Type name:

```ts
type Recommendation = HomeRecommendation;
```

Purpose:

- Alias only.
- Prevents Worker D from inventing a second active recommendation contract.

Source of truth:

- `HomeRecommendation`

Lifecycle:

- Same as `HomeRecommendation`.

Rule:

- In Stage 3, `Recommendation` is not distinct from `HomeRecommendation`.
- Worker D must not create a separate shape unless a later product document explicitly introduces one.

## 5. Explicit Contract Decisions

### 5.1 Route decision

Canonical route values:

- `"/onboarding"`
- `"/room"`
- `"/home"`

Rules:

- onboarding incomplete -> `"/onboarding"`
- active and unexpired preset -> `"/room"`
- expired / stale / consumed preset -> `"/home"`
- returning user without active preset -> `"/home"`

Current runtime note:

- Current runtime root `"/"` remains a compatibility surface.
- Contract remains canonical on `"/home"`.

### 5.2 HomeEntryContext

HomeEntryContext must always support:

- `latestSleepCheckInId`
- `eligibleMemoryId`
- `missingDataKeys`
- `staleDataKeys`
- route decision trace fields
- source recommendation trace fields

### 5.3 Home recommendation

Canonical rules:

- one main recommendation
- one main CTA
- no visible secondary nav, bottom tabs, dashboard cards, pills, or shortcut link clusters on Stage 3 Home
- explicit priority
- explicit traceability
- explicit `source`
- explicit `sourceId` unless `system_default`
- explicit `fallbackKind`
- diagnostic navigation data, if present, must remain non-visual

Fallback values:

- `system_default_fallback`
- `data_partial_fallback`
- `error_safe_fallback`

### 5.4 Memory eligibility

Canonical decision:

- Memory eligibility is `status + excludeFromPersonalization`, not status-only.
- This exception exists because `product-logic.md` explicitly defines the boolean.

### 5.5 Sleep continuity

Canonical decision:

- Home reads lightweight Sleep continuity only.
- Home may read `SleepCheckIn`, `SleepSession`, and `SleepInsight` outputs.
- Home must not read or display a full sleep report object as its main recommendation source.

### 5.6 Home-to-Talk CTA

Canonical decision:

- Stage 3 normal Home CTA targets Talk only.
- `target` must be exactly `"talk"`.
- `targetPath` must be exactly `"/talk"`.
- `TalkEntryContext` is required.
- Non-Talk Home CTAs are out of scope unless a later product document explicitly adds them.

### 5.7 Onboarding preset expiry

Canonical decision:

- `status = "active" | "consumed" | "expired"` is persisted.
- `stale` is derived.
- Active unexpired preset redirects to Room.
- Expired or stale preset does not redirect to Room and degrades quietly.

### 5.8 Recommendation location/domain

Canonical decision:

- Recommendation surface is explicit: `surface = "home_main"`.
- Recommendation source domain is explicit: `sourceDomain`.
- Worker D must not infer domain from title/body text.

### 5.9 Ritual status

Canonical decision:

- `Ritual` is future-only in Stage 3.
- `SleepGoal` is future-only in Stage 3.

## 6. Worker D implementation requirements

Worker D must implement this document field-for-field in:

- `src/contracts/`
- `src/mocks/stage3MockData.ts`

Rules:

- Do not derive TypeScript names from current runtime snake_case or local-storage naming.
- Do not replace canonical `"/home"` route naming with current runtime `"/"` naming.
- Do not invent a second recommendation contract outside `HomeRecommendation`.
- Do not render `diagnosticsNavTargets` as visible Home navigation.
- Do not collapse `RoomView`, `RoomSession`, and `RoomState` into one transient UI-only object.
- Do not replace canonical `MemoryItem.status` values with runtime-only names like `disagreed`, `blocked`, or `expired`.
- If Worker D needs compatibility adapters for existing runtime code, adapters must translate from runtime naming to this contract, not the other way around.

## 7. Review Checklist

This contract passes review only if:

- canonical Home route is explicit
- route decision is explicit
- RouteDecision sample code includes `expiresAt` stale handling
- HomeEntryContext is complete
- Home remains one main recommendation plus one main CTA
- Stage 3 Home CTA targets Talk only
- recommendation source enums are canonical
- recommendation fallback kinds are explicit
- SleepInsight is explicit and lightweight
- SleepInsight supports `single_night`
- onboarding preset expiry and stale behavior are explicit
- memory eligibility is explicit
- MemoryFeedbackEvent exists and governs agree / disagree / hide / unhide
- sleep continuity stays lightweight
- Room continuity is modeled across `RoomOption`, `RoomView`, `RoomSession`, and `RoomState`
- Room source naming is unified across `RoomView`, `RoomSession`, and `RoomState`
- Ritual and SleepGoal are explicitly future-only
- Worker D implementation requirements are explicit

## 8. Changelog

- Added a canonical lightweight `SleepInsight` contract so Worker D can implement Sleep-derived continuity and Home `tonight_suggestion` without inventing a report-shaped object.
- Updated `SleepInsight.period` to support `single_night` and clarified sparse-data / low-confidence behavior for first-use cases.
- Added minimal `RoomOption`, `RoomView`, and `RoomSession` contracts so Room exposure, room selection, and Room page state remain separate and implementable.
- Unified Room source naming with shared `RoomEntrySource` across `RoomView`, `RoomSession`, and `RoomState`.
- Simplified `HomeState.status` and added `continuitySource` so Home state no longer mixes fallback and continuity as overlapping status enums.
- Renamed `availableNavTargets` to `diagnosticsNavTargets` and made it explicitly non-visual to preserve Stage 3 Home as one main recommendation plus one main CTA.
- Tightened `HomeCTA` so Stage 3 Home always hands off to Talk with required `TalkEntryContext`.
- Added canonical `MemoryFeedbackEvent` so Worker D can implement feedback history without inventing a shape.
- Updated the RouteDecision sample code so stale / expired preset handling is explicit in code as well as prose.
- Fixed the missing semicolon in `OnboardingPreset.q2SupportStyle`.
