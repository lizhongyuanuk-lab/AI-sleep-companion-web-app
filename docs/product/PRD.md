# AI Sleep Companion MVP PRD

## Product goal

AI Sleep Companion is a bedtime companion app that helps users transition into sleep through personalized onboarding, a persistent companion, gentle bedtime conversation, memory, and sleep routines.

## MVP scope

Included in this MVP:

- First launch onboarding
- Persistent onboarding completion state
- User sleep profile generation
- Companion profile generation
- Main room screen
- Talk screen with mock companion responses
- Memory screen with seed memories
- Sleep mode screen with mock sleep session

## Core user flow

1. User opens app.
2. If onboarding is incomplete, show onboarding.
3. User completes onboarding.
4. App creates `UserSleepProfile`, `CompanionProfile`, `RoomState`, and seed `MemoryItem[]`.
5. User enters Room.
6. User may open Talk, Memory, or Sleep.
7. Sleep mode creates a local `SleepSession`.

## State rules

- MVP state is stored in `localStorage`.
- Data is local-only, deterministic, and safe to reset.
- The app must run locally without any backend dependency.
- Missing, partial, or malformed `localStorage` data must never crash the app.
- Onboarding completion is the gate for first-launch routing.
- Generated seed data is created once at onboarding completion and may be safely recreated from defaults when required fields are missing.
- Talk responses are mock-only and deterministic.
- Sleep sessions are mock-only and stored locally.

## Explicit exclusions

Excluded for now:

- Real authentication
- Real backend
- Real payment
- Real LLM streaming
- Real voice generation
- Cloud database
- Wearable integrations
- Analytics
- External services of any kind

