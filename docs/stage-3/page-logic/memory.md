# Stage 3 Page Logic: Memory

## 1. Document Role

This document is a Stage 3 data-flow and contract bridge for the Memory page.

It does not replace `docs/MEMORY_SPEC.md` or `docs/MEMORY_UI_SPEC.md`. Those root specs remain the authority for Memory page UX, visual behavior, layout, and copy. This document only defines how Memory participates in the Stage 3 data contract, feedback lifecycle, cross-page effects, and forbidden logic.

If a UI detail appears to conflict with this document, follow the root Memory specs. If a data contract or lifecycle detail appears to conflict, follow `docs/stage-3/data-contract.md` and `src/contracts`.

## 2. Page Role in Stage 3

Memory displays visible `MemoryItem` records and lets the user respond with Agree, Disagree, or Hide. These actions create `MemoryFeedback` and update the memory's future personalization eligibility.

## 3. Primary Source Specs

- `docs/MEMORY_SPEC.md`
- `docs/MEMORY_UI_SPEC.md`
- `docs/stage-3/product-logic.md`
- `docs/stage-3/data-contract.md`
- `docs/stage-3/acceptance-checklist.md`

## 4. Canonical Contract Dependencies

Memory may use these existing Stage 3 contract concepts:

- `MemoryItem`
- `MemoryFeedback`
- `MemoryExtractionRun`
- `ProductEvent`

This document does not introduce new canonical type names.

## 5. Data Read

Memory may read:

- visible `MemoryItem` records
- Memory feedback state where needed for UI state
- Memory source metadata, including Talk-derived origin if present
- local mock Memory data when real backend persistence is not in scope

Memory UI should not display hidden memories as active visible items.

## 6. Data Write

Memory actions may write:

- `MemoryFeedback`
- updates to the affected `MemoryItem`
- optional Memory-related `ProductEvent` entries

Agree should strengthen the Memory according to the existing contract fields.

Disagree should mark or record contradiction according to the existing contract fields.

Hide should update the Memory so that it is hidden and excluded from personalization.

Memory must not perform a user-facing Delete operation in Stage 3.

## 7. Entry Conditions

The user may enter Memory through supported navigation defined by the app and root Memory specs.

Memory does not require onboarding to be active. It depends on existing visible Memory data.

## 8. Exit / Navigation Payload

Memory does not need to create a cross-page navigation payload by default.

If a Memory CTA routes the user to Talk or another page, that route must follow the existing page spec and Stage 3 entry context rules.

## 9. User Actions

Stage 3 Memory supports:

- Agree
- Disagree
- Hide

Agree:

- creates `MemoryFeedback`
- strengthens or confirms the memory according to the existing contract

Disagree:

- creates `MemoryFeedback`
- records contradiction or negative feedback according to the existing contract

Hide:

- marks the memory hidden
- sets `excludeFromPersonalization = true`
- sets `influenceWeight = 0` if that field exists
- removes or suppresses the item from visible Memory UI

## 10. Cross-page Effects

Visible, eligible Memory may influence Talk, Sleep, or Home only if allowed by the Stage 3 contracts and selectors.

Hidden Memory must not influence:

- Talk personalization
- Sleep suggestions or insight context
- Home recommendation logic

Hide is not Delete. The memory may remain stored for audit / local state purposes, but it must be excluded from future personalization.

## 11. Forbidden Behavior

Memory must not:

- expose a user-facing Delete Memory CTA in Stage 3
- implement `deleteMemory` as a canonical Stage 3 action
- treat Hide as Delete
- allow hidden Memory to influence Talk, Sleep, or Home
- create Sleep logs, Talk sessions, or Home recommendations directly
- invent backend persistence, API DTOs, database models, or real account scope

## 12. Acceptance Checks

A review worker should verify:

- Memory reads visible `MemoryItem` records.
- Memory supports Agree, Disagree, and Hide.
- Memory does not expose user-facing Delete.
- Agree creates `MemoryFeedback`.
- Disagree creates `MemoryFeedback`.
- Hide marks memory hidden.
- Hide sets `excludeFromPersonalization = true`.
- Hidden Memory is excluded from Talk, Sleep, and Home influence.
- No new canonical type names are introduced by this page logic.
