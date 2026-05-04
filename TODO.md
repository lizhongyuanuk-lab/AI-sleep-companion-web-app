# TODO.md

## Product Development Priorities

This project should now move from UI-first prototype quality toward production-ready engineering. Keep the current visual system stable while making the product real.

## Ground Rules

- Do not redesign the UI unless explicitly requested
- Do not refactor broadly just for cleanliness
- Preserve the current mobile-first shell and page atmosphere
- Replace mock behavior gradually behind stable interfaces
- Prefer small, testable steps

## Phase 1: Stabilize the Engineering Baseline

- [ ] Update `README.md` so it reflects the real product instead of the default Next.js template
- [ ] Decide and document the target Node.js version
- [ ] Add a real environment variable template such as `.env.example` without secrets
- [ ] Decide on deployment target and basic release workflow
- [ ] Add basic error logging and client/runtime monitoring strategy
- [ ] Review the external script usage in `app/layout.tsx` and confirm whether it should stay in production

## Phase 2: Define Real App Architecture

- [ ] Define backend approach
- [ ] Define auth approach
- [ ] Define database approach
- [ ] Define API contract boundaries for:
  - first launch
  - Talk session
  - room selection
  - memory summary
  - sleep reflection
- [ ] Decide what remains client-local versus what becomes server-backed

## Phase 3: First-Launch Flow Productionization

- [ ] Replace localStorage-only guest/auth assumptions with a real user/session model
- [ ] Persist onboarding answers and resulting preset in a real backend
- [ ] Define lifecycle rules for incomplete onboarding sessions
- [ ] Replace simulated personal room generation with a real backend or AI-assisted flow if required
- [ ] Decide how generated rooms should be stored, expired, or promoted into a long-term room library
- [ ] Add analytics for first-launch drop-off and completion

## Phase 4: Talk Page AI Integration

- [ ] Define the Talk session data model
- [ ] Decide whether Talk is powered by text input behind the scenes, speech input, or a hybrid pipeline
- [ ] Add a server-side endpoint for AI conversation turns
- [ ] Add secure provider integration for LLM calls
- [ ] Add real microphone capture pipeline if voice is a true product requirement
- [ ] Add STT integration if audio input is required
- [ ] Add TTS or spoken response playback if audio output is required
- [ ] Replace simulated recording, processing, and speaking timers with real async state handling
- [ ] Add network failure, timeout, retry, and cancellation handling
- [ ] Persist sessions or message summaries if product requires continuity

## Phase 5: Room Flow Integration

- [ ] Decide whether room catalog stays static or becomes CMS/backend-driven
- [ ] Define how room selection affects Talk prompt setup and model behavior
- [ ] Add real room recommendation flow from first-launch preset and sleep/memory context
- [ ] Replace local-only room continuation context with real session or API payloads
- [ ] Add actual ambience assets if room audio is part of the shipped experience

## Phase 6: Memory Page Real Data

- [ ] Define a real memory extraction and storage contract
- [ ] Decide which memory items are user-visible and why
- [ ] Replace `memoryPageMockData` with API-backed data
- [ ] Implement real agree/delete behavior
- [ ] Decide whether `/memory/history` will exist and implement it if needed
- [ ] Add loading, empty, and error states backed by real fetch logic

## Phase 7: Sleep Page Real Data

- [ ] Define the source of sleep data
- [ ] Decide whether sleep reflection is AI-generated, rules-based, or hybrid
- [ ] Replace `sleepMockCases` with API-backed fetch logic
- [ ] Define how rhythm and trend data are calculated
- [ ] Implement real retry behavior for failed reflections
- [ ] Define how Sleep CTA recommendations are generated and consumed
- [ ] Add loading, empty, partial, and error behavior tied to real backend responses

## Phase 8: Auth, User Identity, and Persistence

- [ ] Choose auth provider and guest-to-account upgrade flow
- [ ] Define user, session, room, memory, and sleep record tables
- [ ] Decide how guest data is migrated after sign-up
- [ ] Add secure server-side persistence for user-facing history
- [ ] Add privacy and retention rules for sensitive sleep and conversation data

## Phase 9: API and Type Safety

- [ ] Introduce shared API types between client and server when backend work begins
- [ ] Keep existing feature-level mock contracts as the starting point for real schemas
- [ ] Add runtime validation for API responses if external services are involved
- [ ] Avoid breaking page contracts while replacing mocks

## Phase 10: Quality and Release Readiness

- [ ] Add automated tests for critical flows
- [ ] Add route-level smoke tests for `/`, `/talk`, `/room`, `/memory`, `/sleep-monitoring`
- [ ] Add visual regression checks for the key product pages
- [ ] Add analytics and product instrumentation
- [ ] Add accessibility review for keyboard flow, semantics, and contrast
- [ ] Add performance review for image-heavy immersive routes
- [ ] Prepare production deployment checklist

## Suggested Implementation Order

1. Refresh README and environment documentation
2. Choose backend/auth/database direction
3. Define API contracts before wiring production data
4. Productionize first-launch and Talk first
5. Then wire Room continuation, Memory, and Sleep
6. Add deployment, monitoring, analytics, and tests

## Notes for the Next Codex

- The UI is already the strongest part of the project
- The main risk is not visual quality, but hidden demo-only behavior
- Treat this as a polished frontend shell that now needs real product plumbing
- Preserve the current design language while replacing local simulation with production logic
