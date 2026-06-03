# Stage 3 Page Logic Alignment Review

## Verdict

PASS WITH FOLLOW-UP

## Summary

This follow-up is safe to merge into `stage3/core-data-integration-v04` before Stage 4 page implementation.

The branch is documentation-only relative to `stage3/core-data-integration-v04`: it adds bridge docs for Onboarding, Room, Talk, Memory, and Sleep Monitoring, and adjusts `docs/stage-3/product-logic.md` plus `docs/ROOM_SPEC.md` wording around `OnboardingPreset` and the Room onboarding boundary.

No runtime app files, `src/contracts`, `src/mocks`, or `src/data/stage3` files are changed. The reviewed docs preserve Stage 3 product logic rather than rewriting it.

## Confirmed Alignment

- The new page-logic docs explicitly define themselves as Stage 3 bridge docs and state that they do not replace the root page specs.
- The new page-logic docs do not introduce new canonical type names. They reference existing Stage 3 terms from `docs/stage-3/data-contract.md` and `src/contracts`.
- `OnboardingPreset` is now treated as the canonical Stage 3 contract term in `docs/stage-3/product-logic.md`, the new page-logic docs, and `docs/ROOM_SPEC.md`.
- `OnboardingSessionPreset` is only retained as historical clarification in `docs/stage-3/product-logic.md`.
- Active preset routing is tightened to active and unexpired presets in the changed Onboarding, Room, Product Logic, and Room spec wording.
- Onboarding does not directly start Talk, create `TalkSession`, or create `RoomSession`.
- Onboarding does not recommend, rank, reorder, preselect, or auto-highlight rooms.
- `RoomView` and `RoomSession` remain distinct: Room view creates `RoomView`; user room selection creates `RoomSession`.
- Room carries the selected `roomId`, created `roomSessionId`, and full active `OnboardingPreset` into Talk entry context where present, without room-option personalization.
- Talk uses `TalkEntryContext` and preserves the idempotent `MemoryExtractionRun` lifecycle, including no duplicate completed extraction runs for the same `TalkSession`.
- Memory keeps Stage 3 actions limited to Agree, Disagree, and Hide, with no user-facing Delete.
- Hidden Memory is excluded from Talk, Sleep, and Home personalization.
- Sleep Monitoring uses `SleepLog` and `SleepInsight`, and the bridge doc requires `SleepInsight` traceability to relevant `SleepLog` IDs.
- Sleep suggestion logic does not directly read onboarding answers.
- The bridge docs do not introduce backend, API DTO, database, auth, payment, real LLM, wearable, medical tracking, or clinical diagnosis scope.

## Remaining Blockers

None.

## Non-blocking Follow-up

- `docs/stage-3/page-logic/home.md` still contains an older App Entry snippet that redirects to `/room` when `activeOnboardingPreset.status === "active"` without showing the explicit `expiresAt > now` check. `docs/stage-3/data-contract.md` and the updated `docs/stage-3/product-logic.md` remain stricter and canonical, so this is cleanup-only.
- `docs/stage-3/data-contract.md` still has historical source-priority wording that mentions `product-logic.md` references to `OnboardingSessionPreset`, even though the active product-logic follow-up now names `OnboardingPreset` as canonical.
- `docs/FIRST_LAUNCH_SPEC.md` and `docs/FIRST_LAUNCH_UI_SPEC.md` still use older UI/runtime wording such as `postOnboardingSessionPreset`. The new bridge doc correctly maps Stage 3 contract language to `OnboardingPreset`, so this is not a merge blocker, but later first-launch docs could be refreshed for naming parity.

## Static Check Results

- `npm run type-check`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS

## Merge Recommendation

Merge into `stage3/core-data-integration-v04`.

This follow-up improves Stage 3 page-logic handoff safety for Stage 4 implementation. The remaining issues are documentation hygiene and naming-parity cleanup, not blockers for Stage 4 page work.
