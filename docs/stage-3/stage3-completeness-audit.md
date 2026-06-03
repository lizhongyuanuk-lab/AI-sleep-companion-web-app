# Stage 3 Completeness Audit

## Verdict
BLOCKED

## Summary
The merged Stage 3 baseline is substantially assembled: the Stage 3 product logic, Home PRD, data-contract, acceptance checklist, contract files, mocks, and local data foundation are all present, and the current branch passes `lint`, `build`, and `type-check`. However, it is not yet internally consistent enough to be the single implementation truth for page work.

The main blockers are missing canonical contract objects that `docs/stage-3/product-logic.md` says Stage 3 must define, plus unresolved contradictions between `product-logic.md` and the implementation-facing contract layer. The largest gaps affect Talk memory-extraction idempotency, analytics payload typing, onboarding draft/context handling, and the normal Home fallback path.

## Confirmed Coverage
- `docs/stage-3/product-logic.md` clearly defines Stage 3 scope, non-goals, AppEntryResolver, page data matrix, page rules, analytics rules, store/API draft, and acceptance criteria.
- `docs/stage-3/page-logic/home.md` gives a detailed Home-specific product boundary and reinforces the one-main-recommendation model.
- `docs/stage-3/acceptance-checklist.md`, `docs/stage-3/data-flow-audit.md`, and `docs/stage-3/contract-implementation-notes.md` exist and are reviewable.
- `src/contracts/`, `src/mocks/stage3MockData.ts`, and `src/data/stage3/*` exist and cover route decisions, onboarding preset lifecycle, Home entry context, Home recommendation traceability, RoomView vs RoomSession separation, memory eligibility, and lightweight sleep continuity.
- The local data selectors implement canonical route gating, stale preset handling, and hidden-memory exclusion for Home continuity.
- Mock data is plausible and clearly demo/local. It does not claim real backend wiring, real LLM behavior, auth/payment/push integration, wearable integration, or medical-grade sleep tracking.
- Mock coverage includes first launch, active preset redirect, stale preset downgrade, visible vs hidden/contradicted/archived memory, stale sleep data, system fallback, and one traceable Home recommendation.

## Missing Items
- `docs/stage-3/data-contract.md` and `src/contracts/` do not define `OnboardingDraft`.
- They do not define `OnboardingContextCard`.
- They do not define `MemoryExtractionRun`.
- They do not define `SuggestionRuleResult`.
- They do not define `ProductEvent`.
- They do not expose a canonical `MemoryFeedback` object matching `product-logic.md`; only `MemoryFeedbackEvent` exists.
- `src/mocks/stage3MockData.ts` has no concrete fixtures for `OnboardingDraft`, `OnboardingContextCard`, `MemoryExtractionRun`, `SuggestionRuleResult`, or `ProductEvent`.
- `src/mocks/stage3MockData.ts` has no explicit agree feedback fixture and no explicit Room -> Talk payload example carrying the full active onboarding preset.

## Contradictions
- Source priority is not singular. `docs/stage-3/acceptance-checklist.md` and `docs/stage-3/data-flow-audit.md` say `product-logic.md` wins on conflict, but `docs/stage-3/page-logic/home.md` declares itself priority `1` for Home.
- `product-logic.md` uses Room source values like `"onboarding"`, `"home"`, `"manual"`, `"memory_cta"`, and `"sleep_suggestion"`, while `docs/stage-3/data-contract.md`, `src/contracts/shared.ts`, and mocks use `after_onboarding`, `home_handoff`, `memory_handoff`, `sleep_handoff`, and `direct`.
- `product-logic.md` says the normal no-signal Home recommendation is `Enter Room`, and keeps `complete_onboarding` / `enter_room` as defensive fallback recommendation types. `docs/stage-3/data-contract.md` removes those normal Home recommendation types and forces Stage 3 Home CTA to Talk only.
- `product-logic.md` defines `SleepLog` and `SleepInsight.basedOn.sleepLogIds`; `docs/stage-3/data-contract.md` and `src/contracts/sleep.ts` rename these to `SleepCheckIn` and `sleepCheckInIds`. The mapping is explained, but the canonical name is still split across the baseline.
- `product-logic.md` defines `TalkSession`; `docs/stage-3/data-contract.md` and `src/contracts/conversation.ts` use `CompanionConversation` without exposing an explicit `TalkSession` alias.
- `product-logic.md` defines `MemoryFeedback` with `action`, `effect`, and optional `note`; `docs/stage-3/data-contract.md` and `src/contracts/memory.ts` replace it with `MemoryFeedbackEvent`, add `unhide`, and drop `effect` / `note`.
- Product ID prefix guidance is not followed consistently by mocks. Examples such as `room_view_001`, `room_session_001`, `conv_home_001`, `sleep_insight_001`, and `memory_feedback_001` drift from the documented `rv_`, `rs_`, `ts_`, `si_`, and `mf_` conventions.

## Implementation Blockers
- Without `MemoryExtractionRun`, the Talk -> Memory idempotency rules cannot be implemented or validated against a canonical object.
- Without `ProductEvent`, the documented analytics rules do not have a contract-layer payload shape for page work to target.
- Without `OnboardingDraft` and `OnboardingContextCard`, onboarding interruption recovery and the allowed onboarding-to-memory UI bridge are not contract-complete.
- The Home no-signal next-step conflict (`Enter Room` vs Talk-only CTA) needs a product decision before Home implementation can be considered correct.
- The Room source enum mismatch leaves Room, analytics, and cross-page handoff naming split between the primary doc and the implementation-facing contract.

## Non-blocking Cleanup
- Add explicit alias notes in `docs/stage-3/data-contract.md` if `TalkSession -> CompanionConversation`, `SleepLog -> SleepCheckIn`, and `MemoryFeedback -> MemoryFeedbackEvent` are intentional long-term mappings.
- Bring mock IDs into line with documented prefix conventions.
- Add one positive agree feedback fixture and one explicit Room -> Talk fixture with full `onboardingPreset`.
- Additional by-page doc splitting can wait; current incompleteness is about contract consistency, not document organization.

## Forbidden Logic Findings
- No `MemoryCandidate`, `OnboardingSeedSignal`, `onboarding_start_talk_click`, or `onboarding_talk_enter_success` were found in `src/contracts`, `src/mocks`, or `src/data/stage3`; current Stage 3 docs only mention them as forbidden examples.
- No Stage 3 contract or mock claims real backend completion, real LLM completion, auth/payment/push integration, wearable integration, or medical-grade sleep tracking.
- Repo-level stale logic still exists in the current runtime Memory page: `app/memory/page.tsx` and `app/memory/memory-page-data.ts` still expose `Delete` / `is_deleted`, which conflicts with the Stage 3 `Agree / Disagree / Hide` rule. This is outside the Stage 3 contract layer, but it is a real forbidden-logic residue in the repository.

## Scenario Validation
- `PASS` new user -> AppEntryResolver -> `/onboarding`
- `PASS` onboarding completion -> active `OnboardingSessionPreset` -> `/room`
- `PASS` Room page view creates `RoomView` only
- `PASS` tapping a room creates `RoomSession`
- `PASS` room -> talk carries `roomId`, `roomSessionId`, and full active `onboardingPreset` at the doc/contract level
- `FAIL` Talk session end triggers idempotent `MemoryExtractionRun`
- `FAIL` `userMessageCount = 0` causes memory extraction to skip with a concrete canonical run object
- `FAIL` one `TalkSession` cannot create duplicate completed extraction runs
- `FAIL` Memory Agree strengthens memory is documented in product logic but not fully modeled in contracts/mocks
- `PASS` Memory Disagree contradicts memory
- `PASS` Memory Hide sets hidden status and `excludeFromPersonalization = true`
- `PASS` hidden memory is excluded from Talk / Sleep / Home personalization
- `FAIL` Sleep check-in creates a canonically named `SleepLog`; the baseline still splits this between `SleepLog` and `SleepCheckIn`
- `FAIL` `SleepInsight` `basedOn.sleepLogIds` rules are not consistent; contracts/mocks use `sleepCheckInIds`
- `PASS` Sleep suggestion does not directly read onboarding answers
- `PASS` Home shows one traceable `HomeRecommendation`
- `PASS` Home is not a dashboard, feed, report page, or multi-card analytics page

## Static Check Results
- `npm run lint`: PASS
- `npm run build`: PASS
- `npm run type-check`: PASS

## Minimal Follow-up Patch
- Add the missing canonical contracts and mock fixtures: `OnboardingDraft`, `OnboardingContextCard`, `MemoryExtractionRun`, `SuggestionRuleResult`, `ProductEvent`, and either a true `MemoryFeedback` contract or an explicit documented alias/mapping.
- Resolve one canonical Home no-signal rule and one canonical Room source enum set, then update the losing doc/contract so `product-logic.md`, `data-contract.md`, `src/contracts`, and mocks all say the same thing.
- Remove or clearly quarantine legacy Memory delete behavior in `app/memory/*` before Stage 3 page implementation begins.
