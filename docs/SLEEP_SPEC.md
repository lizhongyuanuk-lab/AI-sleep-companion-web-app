# Sleep Page PRD + Non-UI Delivery Spec

Mobile-first AI Sleep Companion · Codex Development Version

## 0. Document Positioning

This document is the product and non-UI delivery specification for the `/sleep-monitoring` page.

It defines:

- page role
- product scope
- user flows
- upstream and downstream data contracts
- core modules
- runtime states
- copy strategy
- recommendation logic
- analytics requirements
- implementation boundaries
- acceptance criteria

This document works together with [docs/SLEEP_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SLEEP_UI_SPEC.md).

Priority order for `/sleep-monitoring` is fixed as:

1. global product spec / app architecture
2. this Sleep page PRD + non-UI delivery spec
3. [docs/SLEEP_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SLEEP_UI_SPEC.md)
4. approved visual references
5. developer assumptions

Important rule:

- this document defines what the Sleep page does
- the UI / interaction spec defines how it should look and behave visually
- Codex must not infer additional product features from visual references or external sleep-tracking apps

## 1. Page Positioning

The Sleep page is a gentle sleep reflection and review page for an AI sleep companion product.

It helps the user understand:

- how last night went
- whether the companion session helped
- what pattern may be emerging
- what to try tonight

The Sleep page sits downstream from Talk and connects back to Room or Talk for the next night's flow.

The Sleep page is:

- a post-session sleep reflection page
- a latest sleep record review page
- a recent pattern summary page
- a companion-linked recommendation page
- a return path into tonight's sleep companion flow

The Sleep page is not:

- a medical diagnosis page
- a clinical sleep report
- a full health analytics dashboard
- a wearable-grade sleep analysis tool
- an Apple Health-style metrics center
- a generic statistics page
- a chat history page
- a replacement for Memory

## 2. Relationship To Other Pages

### 2.1 Relationship to Talk

Talk is the active companionship surface.

Sleep is the reflection surface after the companionship experience.

Talk may produce:

- session start time
- session end time
- last user activity time
- probable sleep onset
- companion strategy
- room context
- audio playback context
- session completion status

Sleep consumes this context and turns it into a calm reflection.

Sleep must not operate as if it is independent from Talk.

### 2.2 Relationship to Room

Room is the scene-selection page.

Sleep may recommend a room for tonight based on recent behavior or last session context.

CTA behavior may route to:

- Room page with a recommended room preselected
- Talk page with a selected room and companion strategy

### 2.3 Relationship to Memory

Memory is about long-term emotional reflection and remembered patterns.

Sleep is about sleep-related reflection and recent nightly patterns.

Sleep may generate lightweight insights that later become Memory inputs, but Sleep must not display full conversation history.

Page role comparison:

| Page | Primary Role |
| --- | --- |
| Talk | Real-time companionship |
| Room | Scene / room selection |
| Memory | Personal reflection and remembered patterns |
| Sleep | Sleep reflection and next-night guidance |

## 3. User Value

The Sleep page should answer four user questions:

### 3.1 What happened last night?

The user should quickly understand:

- estimated sleep duration
- estimated sleep onset
- wake or session end time
- quiet time
- whether the record is full, partial, or companion-only

### 3.2 Did the companion help?

The page should connect the sleep result back to the companion session.

Example themes:

- shorter check-ins seemed to help
- Rain Room may have helped the user settle
- Quiet Company led to longer calm time

### 3.3 What pattern is emerging?

The page should show a lightweight recent trend, such as:

- faster settling over recent nights
- more consistent sleep duration
- repeated use of one room or strategy
- fewer interruptions in certain companion modes

### 3.4 What should I do tonight?

The page should provide one clear next action:

- `Start tonight`
- `Use Rain Room Tonight`
- `Continue with Quiet Company`
- `Enter recommended room`

The action should feel like a natural continuation, not an upsell.

## 4. Product Goals

### 4.1 Primary product goals

The Sleep page should:

- complete the loop from companionship to reflection
- help users feel that the app remembered last night
- create a reason to return the next day
- turn sleep data into calm, understandable guidance
- support future personalization
- connect sleep reflection back to Room and Talk

### 4.2 Behavioral goals

The page should encourage:

- next-day review
- repeated night usage
- returning to a recommended room
- trying a suggested companion strategy
- building trust in the companion experience

### 4.3 Business / retention goals

The Sleep page supports:

- next-day retention
- multi-night habit formation
- perceived product intelligence
- future premium personalization
- future sleep-monitoring expansion

## 5. In Scope

This version includes:

### 5.1 Latest sleep reflection

Show the latest available sleep-related record.

This may be:

- full sleep record
- partial sleep record
- companion-only record
- empty state if no record exists

### 5.2 Hero insight

Show one calm, reflective insight.

This insight must be:

- non-diagnostic
- confidence-aware
- understandable without reading chart details

### 5.3 Last night summary

Show key estimated values when available:

- estimated sleep duration
- estimated sleep onset
- wake or session end time
- quiet time
- record status

### 5.4 Sleep rhythm review

Show a lightweight visual review of the night pattern.

Default naming:

- `Sleep rhythm`

Do not use:

- `Sleep stages`

unless reliable sleep-stage inference is explicitly implemented later.

### 5.5 Last 7 nights trend

Show a simple recent pattern, such as:

- seven-day sleep duration
- seven-day settling trend
- number of nights with companion use
- nights where the user settled faster

### 5.6 Companion insight / tonight suggestion

Show one recommendation connected to Room or Talk.

### 5.7 Primary CTA

Provide one primary action leading back to tonight's flow.

Allowed CTA examples:

- `Start tonight`
- `Use Rain Room Tonight`
- `Continue with Quiet Company`
- `Enter Rain Room`

### 5.8 Shared shell controls

The Sleep page includes:

- shared top navigation
- no settings button in V1

## 6. Out Of Scope

This version must not include:

- medical diagnosis
- sleep disorder detection
- professional sleep quality scoring
- unsupported REM / deep / light sleep claims as verified facts
- wearable-grade interpretation
- large historical analytics dashboards
- calendar-based historical archive
- complex filtering
- social sharing
- rankings
- gamified sleep streaks
- full sleep coaching programs
- chat transcript display
- Talk-style mic dock
- text input box
- manual editing of sleep records
- paid upsell modules
- detail drill-down pages for rhythm or trend cards

## 7. Primary User Flows

### 7.1 Flow A - user opens Sleep from navigation

User taps Sleep tab  
-> Sleep page opens  
-> latest available record loads  
-> page displays `full_record`, `partial_record`, `companion_only`, `empty_state`, `loading`, or `error_state`

Expected result:

- Sleep tab is active
- the latest sleep reflection is shown when available
- the page does not require onboarding again

### 7.2 Flow B - user comes from Talk after session

Talk session ends  
-> Talk session context is saved  
-> a Sleep record is generated or prepared  
-> user opens Sleep summary

Possible outcomes:

- full record available
- partial record available
- companion-only record available
- record unavailable due to insufficient data

### 7.3 Flow C - user reviews last night and starts tonight

User reads the summary  
-> user sees companion insight  
-> user taps `Start tonight` or room CTA  
-> app routes to Room or Talk

Expected result:

- selected room or strategy is passed downstream when available
- the user does not need to manually repeat setup

### 7.4 Flow D - no sleep record exists

User opens Sleep  
-> no valid sleep record is found  
-> calm empty state is shown  
-> primary CTA invites the user to start tonight

Empty state must not feel like failure.

### 7.5 Flow E - partial record

User opens Sleep  
-> session data exists but is not enough for a full sleep estimate  
-> partial summary is shown  
-> unsupported modules are softened or hidden

Partial state must use confidence-aware language.

## 8. Upstream Inputs

Sleep may consume the following upstream data.

These fields are recommended contracts and may be refined later by backend architecture.

| Field | Type | Required | Source | Description |
| --- | --- | --- | --- | --- |
| `session_id` | string | yes | Talk | Linked Talk session ID |
| `entry_source` | enum | yes | router | `talk`, `nav`, `memory`, `room`, `resume` |
| `room_id` | string | no | Room / Talk | Selected room ID |
| `room_name` | string | no | Room / Talk | Display name of room |
| `background_asset` | string | no | Room | Room visual asset reference |
| `ambient_type` | string | no | Room / Talk | Rain, forest, white noise, etc. |
| `companion_strategy` | enum | no | Onboarding / Talk | `fall_asleep_fast`, `soothe_then_chat`, `meditate`, `quiet_company` |
| `session_start_at` | datetime | yes | Talk | Session start timestamp |
| `session_end_at` | datetime | no | Talk | Session end timestamp |
| `session_end_reason` | enum | no | runtime | `user_end`, `timeout`, `probable_sleep`, `error`, `unknown` |
| `last_user_activity_at` | datetime | no | Talk | Last detected user interaction |
| `probable_sleep_onset_at` | datetime | no | inference | Estimated sleep onset |
| `audio_playback_duration_min` | number | no | audio runtime | Total ambient / voice playback time |
| `quiet_duration_min` | number | no | runtime / inference | Low-interaction calm period |
| `wake_events_count` | number | no | inference | Estimated interruptions |
| `record_confidence` | enum | yes | inference | `low`, `medium`, `high` |
| `record_type` | enum | yes | inference | `full`, `partial`, `companion_only`, `empty` |

## 9. Page-Level Outputs

Sleep page may produce or expose:

| Output | Type | Purpose |
| --- | --- | --- |
| `sleep_record_id` | string | ID for current sleep reflection |
| `linked_session_id` | string | Link to Talk session |
| `hero_insight` | string | Main reflection copy |
| `last_night_summary` | object | Summary metrics |
| `sleep_rhythm_data` | object or null | Lightweight chart input |
| `trend_summary` | object or null | Recent seven-night trend |
| `tonight_recommendation` | object or null | Recommended next action |
| `recommendation_target` | enum | `room`, `talk`, `none` |
| `analytics_events` | events | Page usage tracking |

## 10. Current Frontend Minimum Page Contract

To prevent implementation drift, the current frontend implementation target is the following minimum page payload:

```ts
type SleepPageData = {
  user_id: string;
  page_state:
    | "full_record"
    | "partial_record"
    | "companion_only"
    | "empty_state"
    | "loading"
    | "error_state";
  record_confidence: "low" | "medium" | "high";
  record_type: "full" | "partial" | "companion_only" | "empty";
  record_context_label: string;
  hero_insight: {
    eyebrow: string;
    title: string;
    supporting_line?: string | null;
  } | null;
  summary_card: {
    status_label?: "Estimated" | "Partial record" | "Companion only" | null;
    duration_display?: string | null;
    duration_label?: string | null;
    companion_session_duration_display?: string | null;
    fell_asleep_at?: string | null;
    woke_up_at?: string | null;
    quiet_time_display?: string | null;
  } | null;
  rhythm_card: {
    title: "Sleep rhythm";
    status_label?: "Estimated" | "Partial record" | "Companion only" | null;
    available: boolean;
    active_filter: "awake" | "light" | "deep" | "dream";
    points: Array<{
      x: number;
      y: number;
      emphasis?: "base" | "highlight";
    }>;
    time_labels: string[];
  } | null;
  trend_card: {
    title: "Last 7 nights";
    supporting_line: string;
    bars: Array<{
      night_id: string;
      day_label: string;
      height: number;
      emphasis?: "base" | "highlight";
    }>;
  } | null;
  suggestion_card: {
    title: string;
    body: string;
    cta_label: string;
    target_route: "/room" | "/talk";
    target_payload?: {
      continuation_source: "sleep";
      recommended_room_id?: string;
      recommended_room_name?: string;
      recommendation_type?: "room" | "talk";
      suggested_strategy?: string;
      sleep_context_label?: string;
    };
  } | null;
  retry_available: boolean;
  last_updated_at?: string | null;
};
```

Contract rules:

- `page_state` is required and controls module visibility
- `record_confidence` is required and influences copy strength and module precision
- `record_type` is required and must stay aligned with `page_state`
- `record_context_label` must use calm, user-facing language
- `hero_insight` is required in `full_record`, `partial_record`, and `companion_only`
- `summary_card.duration_display` is allowed only when the page has a duration estimate
- `summary_card.duration_label` should default to `Estimated sleep` when a duration is shown
- `summary_card.companion_session_duration_display` is the primary metric source in `companion_only`
- `rhythm_card.title` must default to `Sleep rhythm`
- `rhythm_card.time_labels` may contain at most four visible labels
- `trend_card` is optional in `partial_record`, hidden in `companion_only`, and hidden in `empty_state`
- `suggestion_card` is required in every state except `loading` and retry-priority `error_state`
- the frontend must not invent medical confidence or diagnosis fields
- the frontend must not invent recommended room or strategy payloads that do not exist upstream

## 11. Core Modules

### 11.1 Top status context

Purpose:

- identify the page
- identify the current record context

Minimum content:

- date line such as `Last night · Apr 29`
- optional subtle record-status label

Optional labels:

- `Estimated`
- `Partial record`
- `Companion only`

Behavior:

- visible whenever page content loads
- updates based on the selected latest record
- never becomes a large warning banner
- page identity is carried by the active top navigation rather than a second visible `Sleep` title

### 11.2 Hero insight

Purpose:

- translate recent data into a calm reflection

Requirements:

- must be short
- must be non-diagnostic
- must be understandable without reading chart details
- must feel connected to recent behavior
- must not sound like a medical evaluation

Acceptable insight types:

- recent settling pattern
- companion mode effectiveness
- room-related pattern
- quiet-time pattern
- consistency pattern

Unacceptable insight types:

- diagnosis
- disorder implication
- emotional pathology
- harsh judgment
- unsupported clinical claims

### 11.3 Last night summary

Purpose:

- give the user a quick understanding of last night

Required fields when available:

- estimated sleep duration
- estimated sleep onset
- wake or end time
- quiet time

Confidence rules:

- if confidence is not high, use words such as `Estimated`, `Likely`, or `Partial`
- avoid exact-sounding claims when support is weak

Fallback:

- if full sleep metrics are unavailable, show companion-based summary copy instead of fake duration
- in `companion_only`, the primary summary metric must be `companion_session_duration_display`
- in `companion_only`, the metric label must read `Companion session`

### 11.4 Sleep rhythm module

Purpose:

- show a soft visual pattern of the night

Default title:

- `Sleep rhythm`

Rules:

- this module must not claim verified sleep stages unless supported by a later approved contract
- it may show a simplified rhythm, activity, or quietness pattern
- it should remain visually lightweight

Acceptable data inputs:

- sleep onset estimate
- session timeline
- audio playback duration
- quiet periods
- estimated interruption points

Fallback:

- if insufficient data exists, show a calm inline unavailable message inside the card slot only when the state still supports the module

Current-version interaction rule:

- rhythm-card body tap is a no-op
- no detail page, drawer, or drill-down opens from the rhythm card in this version

### 11.5 Last 7 nights trend

Purpose:

- show a lightweight recent pattern

Minimum content:

- section title
- one sentence trend summary
- one simple visual trend

Acceptable metrics:

- nights with companion use
- estimated time to settle
- sleep-duration trend
- quiet-time trend
- recommended-room effectiveness

Fallback:

- if fewer than three records exist, use a calm trend fallback sentence instead of empty analytics

### 11.6 Companion insight / tonight suggestion

Purpose:

- connect reflection to the next action

Recommendation inputs may consider:

- recent room usage
- companion strategy
- quiet duration
- estimated settling time
- onboarding preference
- last successful session

Output fields:

| Field | Type | Description |
| --- | --- | --- |
| `suggested_room_id` | string or null | Room to use tonight |
| `suggested_room_name` | string or null | Display name |
| `suggested_strategy` | enum or null | Companion strategy |
| `recommendation_reason` | string | User-facing explanation |
| `cta_label` | string | CTA copy |
| `cta_target` | enum | `room`, `talk`, `none` |

Do not:

- make recommendations sound authoritative
- use aggressive optimization language
- imply guaranteed sleep improvement

## 12. Record States

### 12.1 Visibility matrix

| State | Visible | Hidden or Reduced | Clickable |
| --- | --- | --- | --- |
| `full_record` | title, hero, summary, rhythm, trend, suggestion, CTA | none | nav, chips, CTA |
| `partial_record` | title, hero, partial summary, suggestion, CTA, rhythm only if supported | unsupported exact metrics, unsupported trend | nav, chips if rhythm exists, CTA |
| `companion_only` | title, hero, companion summary copy, companion-session primary metric, suggestion, CTA | estimated sleep duration, unsupported rhythm, trend | nav, CTA |
| `empty_state` | title, empty-state card, CTA | summary, rhythm, trend | nav, CTA |
| `loading` | top navigation, title, skeleton modules | real data values | nav |
| `error_state` | top navigation, fallback card, recovery CTA, suggestion when available | broken data cards | nav, CTA |

### 12.2 Full record

Condition:

- enough data exists to generate a reliable reflection

Visible:

- title and date
- hero insight
- last night summary
- sleep rhythm
- seven-day trend when data exists
- tonight suggestion
- CTA

### 12.3 Partial record

Condition:

- some session data exists, but not enough for a full sleep estimate

Visible:

- title and date
- partial label
- limited summary
- companion insight
- CTA when relevant

Hidden or reduced:

- exact duration if unsupported
- full rhythm chart if unsupported
- trend if insufficient data

### 12.4 Companion-only state

Condition:

- a Talk session exists, but sleep cannot be estimated

Visible:

- companion session duration as the primary metric
- quiet-time summary if available
- room or strategy context
- suggestion for tonight

Do not:

- show fake sleep duration
- imply the user slept
- show rhythm as if it were reliable

### 12.5 Empty state

Condition:

- no sleep or companion-session record exists

Visible:

- title
- calm empty-state message
- `Start tonight` CTA

### 12.6 Loading state

Condition:

- data is being loaded or generated

Visible:

- top nav
- title
- soft skeleton cards

Rules:

- use subtle skeletons
- no aggressive spinner
- no flashing loading effects

### 12.7 Error state

Condition:

- data fails to load

Visible:

- top nav
- fallback card
- `Retry` or `Start tonight` CTA when available

Primary CTA rule:

- if `retry_available` is `true`, the only primary CTA is `Retry`
- if `retry_available` is `false`, the only primary CTA is `Start tonight`

Do not:

- expose raw error codes
- use harsh red banners
- block navigation

## 13. Copy Strategy

### 13.1 Voice principles

Copy must be:

- calm
- warm
- concise
- non-judgmental
- non-clinical
- confidence-aware
- emotionally safe

### 13.2 Avoid

Do not use:

- bad sleep
- poor sleep quality
- abnormal
- disorder
- diagnosis
- symptom
- failure
- you should
- you must

### 13.3 Preferred language

Use:

- estimated
- likely
- seemed to
- may help
- recently
- settled
- quiet time
- reflection
- tonight

## 14. Recommendation Logic

### 14.1 Recommendation goal

The recommendation should help the user decide what to try tonight.

It should not claim certainty.

### 14.2 Lightweight logic

Recommended decision order:

1. If one room is repeatedly associated with longer quiet time, recommend that room.
2. If one companion strategy is associated with faster settling, recommend that strategy.
3. If no pattern exists, recommend the last used room.
4. If no prior room exists, recommend a default calming room.
5. If data confidence is low, soften the recommendation wording.

### 14.3 Confidence-aware copy

High confidence:

- `Rain room has helped you settle faster recently.`

Medium confidence:

- `Rain room may be helping you settle down recently.`

Low confidence:

- `Rain room could be a gentle place to start tonight.`

### 14.4 Prohibitions

Do not:

- guarantee outcomes
- claim causal effects without support
- recommend medical actions
- generate vague advice unrelated to available data

## 15. CTA Strategy

### 15.1 CTA role

The CTA should return the user to tonight's sleep companion flow.

### 15.2 Allowed CTA targets

| CTA Target | Behavior |
| --- | --- |
| `room` | open Room with suggested room highlighted when available |
| `talk` | open Talk with selected room or strategy when available |
| `none` | no CTA only when no valid action exists |

### 15.3 CTA label rules

Preferred labels:

- `Start tonight`
- `Use Rain Room Tonight`
- `Continue with Quiet Company`
- `Enter Rain Room`

Avoid:

- `Optimize my sleep`
- `Fix tonight`
- `Improve sleep score`
- `Upgrade now`

### 15.4 Single-primary-CTA rule

Only one primary CTA is allowed on the default Sleep page.

### 15.5 Deterministic routing rule

Routing rules:

1. If `cta_target` is `room`, route to `/room`.
2. If `cta_target` is `talk`, route to `/talk`.
3. When `target_payload.recommended_room_id` exists and matches a valid room, write it to local room storage before navigation.
4. When routing to `/talk` and the recommended room maps to a valid Talk scene, write the mapped scene to scene storage and navigate with the `scene` query param.
5. `suggested_strategy` may remain in payload for future use, but V1 must not require Talk to consume it.
6. If route metadata is missing or invalid, fall back to `/room`.
7. The frontend must not invent payload fields that do not exist upstream.

## 16. Analytics / Events

### 16.1 Required events

- `sleep_page_view`
- `sleep_record_loaded`
- `sleep_record_state_shown`
- `sleep_hero_insight_view`
- `sleep_summary_view`
- `sleep_rhythm_view`
- `sleep_trend_view`
- `sleep_recommendation_view`
- `sleep_cta_click`
- `sleep_return_to_room`
- `sleep_return_to_talk`
- `sleep_empty_state_view`
- `sleep_partial_state_view`
- `sleep_error_state_view`

### 16.2 Event properties

Recommended properties:

| Property | Type | Description |
| --- | --- | --- |
| `record_type` | enum | `full`, `partial`, `companion_only`, `empty` |
| `record_confidence` | enum | `low`, `medium`, `high` |
| `entry_source` | enum | `nav`, `talk`, `memory`, `room`, `resume` |
| `room_id` | string or null | Related room |
| `room_name` | string or null | Related room name |
| `companion_strategy` | enum or null | Strategy used |
| `cta_label` | string or null | CTA text |
| `cta_target` | enum or null | `room`, `talk`, `none` |
| `has_trend_data` | boolean | Whether trend is available |
| `has_rhythm_data` | boolean | Whether rhythm data is available |

## 17. Dependencies / Technical Notes

### 17.1 Session dependency

Sleep depends on Talk session data.

If Talk does not produce enough session context, Sleep may still render through `empty_state` or `companion_only`.

### 17.2 Inference dependency

The following values may be estimated:

- sleep onset
- sleep duration
- quiet time
- wake events
- trend summary

The UI and copy must reflect estimation.

### 17.3 Data confidence

Every sleep record should have a confidence level:

- `low`
- `medium`
- `high`

Confidence affects:

- copy strength
- module visibility
- metric precision
- recommendation wording

### 17.4 Modularity

Recommended component-level decomposition:

- `SleepPage`
- `TopNavigation`
- `SleepHeader`
- `HeroInsight`
- `SleepSummaryCard`
- `SleepRhythmCard`
- `SleepTrendCard`
- `TonightSuggestionCard`
- `SleepEmptyState`
- `SleepFallbackState`

### 17.5 No hardcoded fake claims

Placeholder values may be used during frontend development only if clearly separated from production logic.

Do not hardcode fake sleep claims into production components.

## 18. Top Navigation Boundary

The current Sleep top bar contains only the shared top navigation capsule.

Boundary rules:

- no top-left settings button in V1
- no floating settings panel in V1
- navigation remains centered and aligned with the same top position used on Memory
- the page must not invent Sleep-specific sound controls or a deep settings taxonomy

## 19. Risks And Boundaries

### 19.1 Risk: overclaiming precision

Prevention:

- use estimated language
- avoid clinical terms
- include confidence-aware states
- use `Sleep rhythm` instead of `Sleep stages`

### 19.2 Risk: becoming too clinical

Prevention:

- lead with hero insight
- use warm copy
- avoid red / green scoring
- avoid dense charts

### 19.3 Risk: becoming too vague

Prevention:

- connect each insight to room, strategy, quiet time, or recent trend
- avoid generic wellness copy
- provide one actionable next step

### 19.4 Risk: breaking product consistency

Prevention:

- reuse shared navigation
- keep shell family consistent
- follow the Sleep UI spec tokens
- avoid foreign dashboard styles

### 19.5 Risk: weak loop back to product

Prevention:

- always provide one next-action CTA when appropriate
- connect the recommendation to Room or Talk
- avoid passive-only summary pages

## 20. Implementation Boundaries

Codex must not implement:

- new backend inference
- medical sleep-stage detection
- wearable integration
- payment or subscription flows
- social sharing
- calendar history browser
- editable sleep records
- full chart drill-down pages
- custom sleep-score algorithms
- AI diagnosis

unless explicitly requested in a future task.

For this version, implementation should focus on:

- page structure
- state rendering
- data contract readiness
- UI module composition
- safe placeholder support
- route integration
- analytics hooks where available

## 21. PRD -> UI Alignment Requirements

The UI implementation must reflect the following product rules:

| PRD Rule | UI Requirement |
| --- | --- |
| Sleep is a reflection page | Hero insight appears before dense data |
| Sleep is not medical | Use estimated labels and non-clinical naming |
| Sleep is downstream from Talk | Include companion, room, or strategy context |
| Sleep should guide tonight | Include one primary CTA |
| Sleep should feel calm | Avoid dense dashboard layout |
| Sleep supports partial data | Include partial and companion-only states |
| Sleep connects to Room or Talk | CTA must route back into tonight's flow |

## 22. Acceptance Criteria

Sleep implementation passes only if:

- the page can render `full_record`, `partial_record`, `companion_only`, `empty_state`, `loading`, and `error_state`
- the page shows the latest sleep reflection when available
- the page does not make unsupported medical claims
- all uncertain values are framed as estimated or partial
- the page includes a hero insight before data-heavy modules
- the page includes a last-night summary when data is available
- the page includes a lightweight sleep rhythm module when data is available
- the page includes a recent trend only when enough data exists
- the page includes one clear next-action CTA when appropriate
- the CTA can route to Room or Talk based on recommendation target
- copy remains calm, warm, and non-judgmental
- the empty state invites the user to start tonight rather than implying failure
- the error state does not block navigation
- Sleep remains clearly differentiated from Memory
- Sleep remains tightly connected to Talk session context
- analytics events are defined and ready for implementation
- no out-of-scope modules are introduced

## 23. Current Version Clarifications

To resolve implementation ambiguity in the current version:

1. The minimum frontend page contract in Section 10 is the binding implementation target until backend wiring changes it explicitly.
2. `rhythm_card` remains a passive visual module in the current version; tapping the card body does nothing.
3. CTA routing is deterministic; invalid or missing CTA target metadata falls back to `/room`.
4. The current top bar contains only the shared navigation capsule and no settings entry.
5. Mock data is allowed only in UI-only implementation passes and must be reported as mock rather than production-wired behavior.

## Appendix A: Sleep Mock Data Cases

This appendix defines fixed mock data cases for implementation and UI validation.

Mock data must follow the same shape as the V1 sleep contract.

The implementation must not invent additional mock fields unless explicitly approved.

Required mock cases:

1. `full_record`
2. `partial_record`
3. `companion_only`
4. `empty_state`
5. `error_state`

## 24. Future Patch Direction

The following may be considered later, but are not implied in this version:

- verified sleep-stage inference
- wearable integration
- long-term historical trend explorer
- calendar view
- weekly or monthly reports
- advanced personalization models
- user-editable sleep records
- detailed session replay
- paid premium sleep insights
- exportable sleep reports
- clinical sleep-quality scores

Any future addition must be introduced as an explicit PRD patch and UI patch.
