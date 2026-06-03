# Stage 3 Page Logic: Room

## 1. Document Role

This document is a Stage 3 data-flow and contract bridge for the Room page.

It does not replace `docs/ROOM_SPEC.md` or `docs/ROOM_UI_SPEC.md`. Those root specs remain the authority for Room page UX, visual behavior, layout, and copy. This document only defines how the Room page participates in the Stage 3 data contract, routing, cross-page lifecycle, and forbidden logic.

If a UI detail appears to conflict with this document, follow the root Room specs. If a data contract or lifecycle detail appears to conflict, follow `docs/stage-3/data-contract.md` and `src/contracts`.

## 2. Page Role in Stage 3

Room is the transition space between onboarding context and Talk. It presents available `RoomOption` entries, records a `RoomView` when the page is viewed, and creates a `RoomSession` only when the user actively selects a room.

## 3. Primary Source Specs

- `docs/ROOM_SPEC.md`
- `docs/ROOM_UI_SPEC.md`
- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`

## 4. Canonical Contract Dependencies

Room may use these existing Stage 3 contract concepts:

- `OnboardingPreset`
- `RoomOption`
- `RoomView`
- `RoomSession`
- `TalkEntryContext`
- `ProductEvent`

This document does not introduce new canonical type names.

## 5. Data Read

Room may read:

- the available `RoomOption` list
- the active `OnboardingPreset`, if present
- existing route / entry context that explains why the user arrived at Room

Room must not read Sleep insight data, Home recommendation data, or hidden Memory data to rank or alter Room options in Stage 3.

## 6. Data Write

Room page view may write:

- `RoomView`
- optional Room-related `ProductEvent` entries

Room selection may write:

- `RoomSession`
- navigation payload required to construct `TalkEntryContext`

Room must not write:

- `MemoryItem`
- `MemoryFeedback`
- `MemoryExtractionRun`
- `SleepLog`
- `SleepInsight`
- `HomeRecommendation`

## 7. Entry Conditions

The user may enter Room when:

- app entry / route logic detects an active and unexpired `OnboardingPreset`
- the user explicitly navigates to Room through a supported Stage 3 route or CTA
- a future flow intentionally links to Room without turning Home into a room-selection page

An active and unexpired onboarding preset can explain why the user is routed to Room, but it must not be used to rank, reorder, recommend, preselect, or auto-highlight the fixed `RoomOption` set in Stage 3.

## 8. Exit / Navigation Payload

When the user selects a room:

- create a `RoomSession`
- carry the selected `roomId`
- carry the created `roomSessionId`
- carry the full active `OnboardingPreset`, if present
- construct or enable construction of `TalkEntryContext`

Room-to-Talk navigation must not pass only a preset ID and reconstruct a different preset later.

## 9. User Actions

- Viewing Room records `RoomView`.
- Tapping a room creates `RoomSession`.
- Continuing from the selected room enters Talk with `TalkEntryContext`.

## 10. Cross-page Effects

Room provides Talk with spatial / contextual entry data through `TalkEntryContext`.

If an active `OnboardingPreset` is present, Room helps carry it into Talk. The preset remains session-scoped and must not become a long-term profile.

## 11. Forbidden Behavior

Room must not:

- create `RoomSession` merely from page view
- treat `RoomView` and `RoomSession` as the same object
- auto-highlight rooms based on onboarding answers
- reorder rooms based on onboarding answers
- turn onboarding into a dynamic room-ranking system
- create Memory, Sleep, or Home recommendation data
- directly run Memory extraction
- imply real backend, real LLM, wearable, or medical tracking completion

## 12. Acceptance Checks

A review worker should verify:

- Room reads `RoomOption` data.
- Room page view creates `RoomView` only.
- Room selection creates `RoomSession`.
- `RoomView` and `RoomSession` remain distinct.
- Room-to-Talk carries `roomId`, `roomSessionId`, and full active onboarding preset if present.
- Room does not rank, reorder, or auto-highlight the fixed `RoomOption` set from onboarding answers.
- No new canonical type names are introduced by this page logic.
