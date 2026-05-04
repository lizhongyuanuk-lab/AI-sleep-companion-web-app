# REPO_HANDOFF_FOR_CODEX.md

## 1. Repo Snapshot

- GitHub repo: `https://github.com/lizhongyuanuk-lab/AI-sleep-companion-web-app`
- Recommended GitHub starting branch for a new Codex session: `main`
- Active local working branch at authoring time: `codex-first-launch-talk-consumption`
- Remote branches confirmed during handoff:
  - `origin/main`
  - `origin/codex-first-launch-talk-consumption`
- Latest commit hash:
  - check with `git log --oneline -1`
- Framework: Next.js 16 App Router
- Language: TypeScript
- UI runtime: React 19
- Styling: CSS Modules + `app/globals.css` + limited Tailwind utility usage
- Package manager: npm
- Install command: `npm install`
- Run command: `npm run dev`
- Lint command: `npm run lint`
- Type-check command: `npm run type-check`
- Build command: `npm run build`
- Deploy platform: `UNKNOWN`

## 2. Current Working Pages

These routes exist and render in the current build:

- `/`
- `/talk`
- `/room`
- `/memory`
- `/sleep-monitoring`

Primary route status:

- `/`
  - first-launch flow implemented in frontend
  - uses localStorage and local mock logic
- `/talk`
  - polished UI shell exists
  - voice loop is simulated
- `/room`
  - immersive room selection works in frontend
  - hands off to `/talk`
- `/memory`
  - polished mock data page
  - local expand / agree / delete behavior
- `/sleep-monitoring`
  - polished mock-state page
  - local CTA routing and state switching

## 3. Broken Pages and Known Gaps

### Broken pages

- No primary page is currently broken according to the latest `build`, `lint`, and `type-check`
- `/memory/history` is referenced as a possible route contract in mock data, but there is no implemented route for it right now

### Known bugs or engineering gaps

- Talk microphone flow checks runtime availability but does not perform real capture, STT, LLM, or TTS
- Room ambience audio files are currently `null` in room config, so audio playback is placeholder-only
- first-launch, room selection, scene selection, and Talk entry context are stored in localStorage instead of a backend
- Memory and Sleep are still mock-data-driven
- `README.md` has been upgraded from the default template, but should continue to be kept aligned with actual repo status
- deployment platform and production infra are not defined in repo
- responsive behavior passes the current layout implementation, but there is no dedicated automated responsive audit suite yet

## 4. Completion Table

| Module | Current Status | Notes |
|---|---|---|
| Onboarding | `done-ui / partial-runtime` | Frontend flow works; localStorage-backed; no backend persistence |
| Room | `done-ui / partial-runtime` | Room browsing and Talk handoff work locally; no backend or real ambience assets |
| Talk | `done-ui / partial-runtime` | Voice-first UI exists; voice lifecycle is simulated |
| Memory | `done-ui / mock-data` | UI complete for demo; data and actions are mock/local |
| Sleep Monitoring | `done-ui / mock-data` | UI complete for demo; states are mock/local |
| Navigation | `done` | Top shell nav exists and is used on Talk, Memory, Sleep |
| Responsive | `partially-checked` | Current CSS is mobile-first and build passes; no dedicated visual regression suite |
| Build | `pass` | Latest local verification passed |
| Lint | `pass` | Latest local verification passed |
| Type-check | `pass` | Latest local verification passed |

## 5. Directory Structure and Key Files

This is the actual current structure that matters for development handoff.

### `app/`

- Purpose: all main routes and route-level runtime logic
- Key files:
  - `app/page.tsx`
    - root route entry, mounts first-launch flow
  - `app/first-launch-flow.tsx`
    - first-launch UI and state machine
  - `app/first-launch-flow.module.css`
    - first-launch visual system
  - `app/layout.tsx`
    - global layout wrapper and external script injection
  - `app/globals.css`
    - global UI tokens and safe-area variables

### `app/talk/`

- Talk page is here
- Key files:
  - `app/talk/page.tsx`
  - `app/talk/talk-shell.tsx`
    - main Talk runtime
    - contains the current voice dock structure
  - `app/talk/talk-page.module.css`
    - Talk visual shell, dock, feedback states
  - `app/talk/talk-icons.tsx`
    - local SVG icons for Talk utilities
  - `app/talk/scene-config.ts`
    - Talk scene catalog and defaults

### `app/room/`

- Room page is here
- Key files:
  - `app/room/page.tsx`
    - main Room runtime
  - `app/room/room-page.module.css`
    - Room immersive visuals
  - `app/room/room-config.ts`
    - Room data lives here

### `app/memory/`

- Memory page is here
- Key files:
  - `app/memory/page.tsx`
  - `app/memory/memory-page.module.css`
  - `app/memory/memory-page-data.ts`
    - Memory mock data lives here

### `app/sleep-monitoring/`

- Sleep Monitoring page is here
- Key files:
  - `app/sleep-monitoring/page.tsx`
  - `app/sleep-monitoring/sleep-shell.tsx`
  - `app/sleep-monitoring/sleep-page.module.css`
  - `app/sleep-monitoring/sleep-page-data.ts`
    - Sleep mock data lives here

### `components/`

- shared UI shell pieces
- Key files:
  - `components/app-frame.tsx`
    - global route frame wrapper
  - `components/shell-top-nav.tsx`
    - top navigation component
  - `components/shell-top-nav.module.css`
    - top navigation visual styles
  - `components/bottom-nav.tsx`
    - fallback non-immersive nav, currently hidden on primary product routes
  - `components/page-placeholder.tsx`
    - generic placeholder helper

### `lib/`

- local helpers and temporary client-state bridges
- Key files:
  - `lib/first-launch.ts`
    - route contract bridge for onboarding, preset state, generated room state, Talk handoff
  - `lib/room-selection.ts`
    - room persistence and selection helpers
  - `lib/scene-selection.ts`
    - Talk scene persistence and query param resolution

### `docs/`

- source-of-truth and handoff docs
- Key files:
  - `docs/FIRST_LAUNCH_SPEC.md`
  - `docs/FIRST_LAUNCH_UI_SPEC.md`
  - `docs/SPEC.md`
  - `docs/TALK_UI_SPEC.md`
  - `docs/ROOM_SPEC.md`
  - `docs/ROOM_UI_SPEC.md`
  - `docs/MEMORY_SPEC.md`
  - `docs/MEMORY_UI_SPEC.md`
  - `docs/SLEEP_SPEC.md`
  - `docs/SLEEP_UI_SPEC.md`
  - `docs/ACCEPTANCE.md`
  - `docs/TRACKING.md`
  - `docs/HANDOFF.md`
  - `docs/GLOBAL_MOBILE_LAYOUT_SPEC.md`

### `public/`

- static assets
- Key folders:
  - `public/scenes/`
    - room and scene background assets
  - `public/nav-icons/`
    - top nav icon assets

### Paths the next Codex might expect but do not currently exist

- `data/`
  - not present
  - mock data is feature-local in `app/memory/` and `app/sleep-monitoring/`
- `styles/`
  - not present
  - global styling lives in `app/globals.css`
- `public/assets/`
  - not present
  - assets are currently split across `public/scenes/` and `public/nav-icons/`

## 6. Where Important Things Live

- Room data:
  - `app/room/room-config.ts`
- Talk page:
  - `app/talk/page.tsx`
  - `app/talk/talk-shell.tsx`
- Global UI tokens:
  - `app/globals.css`
  - product spacing baseline also documented in `docs/GLOBAL_MOBILE_LAYOUT_SPEC.md`
- Top navigation component:
  - `components/shell-top-nav.tsx`
  - styles: `components/shell-top-nav.module.css`
- Voice dock:
  - runtime markup: `app/talk/talk-shell.tsx`
  - styles and state classes: `app/talk/talk-page.module.css`
- Mock data:
  - `app/memory/memory-page-data.ts`
  - `app/sleep-monitoring/sleep-page-data.ts`
  - plus feature-local config in `app/room/room-config.ts` and `app/talk/scene-config.ts`
- Route contract bridges:
  - `lib/first-launch.ts`
  - `lib/room-selection.ts`
  - `lib/scene-selection.ts`

## 7. Current Runtime Data Flow

### First-launch flow

- route entry: `app/page.tsx`
- implementation: `app/first-launch-flow.tsx`
- local contract/state source: `lib/first-launch.ts`

Flow:

1. user enters `/`
2. first-launch draft is read from localStorage
3. Q1 + Q2 answers generate `PostOnboardingSessionPreset`
4. optional personal room flow simulates generation
5. completion writes local completion state
6. user is redirected to `/room`

### Room flow

- route entry: `app/room/page.tsx`
- room catalog source: `app/room/room-config.ts`
- selection persistence: `lib/room-selection.ts`

Flow:

1. `/room` resolves initial room from localStorage and onboarding context
2. user browses room surfaces
3. selected room writes active room and last-entered room
4. room tap prepares Talk handoff context
5. route pushes to `/talk?scene=...`

### Talk flow

- route entry: `app/talk/page.tsx`
- runtime: `app/talk/talk-shell.tsx`
- scene source: `app/talk/scene-config.ts`
- scene persistence: `lib/scene-selection.ts`

Flow:

1. `/talk` resolves active scene
2. reads first-launch Talk handoff context if present
3. runs local timer-based voice state machine
4. persists sound settings locally
5. no backend call currently happens

### Memory flow

- route entry: `app/memory/page.tsx`
- data source: `app/memory/memory-page-data.ts`

Flow:

1. page reads mock data
2. local component state controls expand, agree, delete, show-more
3. no backend persistence currently exists

### Sleep flow

- route entry: `app/sleep-monitoring/page.tsx`
- runtime: `app/sleep-monitoring/sleep-shell.tsx`
- data source: `app/sleep-monitoring/sleep-page-data.ts`

Flow:

1. page enters loading state
2. mock case is rendered after local timer
3. CTA may route to `/room` or `/talk`
4. no backend fetch currently exists

## 8. Current Client Storage Keys

These are important because they are effectively the current app state layer.

- `ai-companion-web.first-launch.completed`
- `ai-companion-web.first-launch.draft`
- `ai-companion-web.first-launch.preset`
- `ai-companion-web.first-launch.generation-draft`
- `ai-companion-web.first-launch.generated-room`
- `ai-companion-web.first-launch.talk-entry-context`
- `ai-companion-web.auth-status`
- `ai-companion-web.active-room`
- `ai-companion-web.last-entered-room`
- `ai-companion-web.room-swipe-hint-dismissed`
- `ai-companion-web.active-scene`
- `ai-companion-web.talk-sound-settings`

## 9. Current Contract Shapes to Preserve

These are the most important existing frontend types. A future backend should start from them instead of inventing unrelated shapes.

- `FirstLaunchDraft`
  - file: `lib/first-launch.ts`
- `PostOnboardingSessionPreset`
  - file: `lib/first-launch.ts`
- `GeneratedPersonalRoomRecord`
  - file: `lib/first-launch.ts`
- `FirstLaunchTalkEntryContext`
  - file: `lib/first-launch.ts`
- `RoomConfig`
  - file: `app/room/room-config.ts`
- `SceneConfig`
  - file: `app/talk/scene-config.ts`
- `MemoryPageData`
  - file: `app/memory/memory-page-data.ts`
- `SleepPageData`
  - file: `app/sleep-monitoring/sleep-page-data.ts`

## 10. Visual System File Map

This section matters because the project is UI-sensitive and should not be casually restyled.

### Global shell and tokens

- `app/globals.css`
  - safe-area variables
  - page padding variables
  - layout tokens
  - global font variables
- `docs/GLOBAL_MOBILE_LAYOUT_SPEC.md`
  - shared spacing and mobile baseline

### First-launch visuals

- `app/first-launch-flow.module.css`

### Talk visuals

- `app/talk/talk-page.module.css`
- `app/talk/talk-icons.tsx`
- `components/shell-top-nav.tsx`
- `components/shell-top-nav.module.css`

### Room visuals

- `app/room/room-page.module.css`

### Memory visuals

- `app/memory/memory-page.module.css`
- `components/shell-top-nav.tsx`
- `components/shell-top-nav.module.css`

### Sleep visuals

- `app/sleep-monitoring/sleep-page.module.css`
- `components/shell-top-nav.tsx`
- `components/shell-top-nav.module.css`

## 11. Room and Scene Asset Inventory

This section is meant to stop future hardcoding and make current asset status explicit.

| room_id | room_name | background_asset_path | asset_type | overlay_mode | ambient_sound | current_status |
|---|---|---|---|---|---|---|
| `moon_tide` | Moon Tide | `public/scenes/seaside-night-room.png` | image | `UNKNOWN` | `null` | background real, ambience placeholder |
| `sea_light` | Sea Light | `public/scenes/seaside-day-room.png` | image | `UNKNOWN` | `null` | background real, ambience placeholder |
| `canopy_mist` | Canopy Mist | `public/scenes/rainforest-day-room.png` | image | `UNKNOWN` | `null` | background real, ambience placeholder |
| `alpine_quiet` | Alpine Quiet | `public/scenes/snow-mountain-day-room.png` | image | `UNKNOWN` | `null` | background real, ambience placeholder |
| `harbor_hush` | Harbor Hush | `public/scenes/seaside-night-room.png` | image | `UNKNOWN` | `null` | background real, ambience placeholder |
| `snowfall_hush` | Snowfall Hush | `public/scenes/snow-mountain-day-room.png` | image | `UNKNOWN` | `null` | background real, ambience placeholder |

### Talk scene inventory

| scene_id | room_name | background_asset_path | asset_type | voice_profile_id | ui_shell_token_set_id | current_status |
|---|---|---|---|---|---|---|
| `seaside_night` | Seaside Night | `public/scenes/seaside-night-room.png` | image | `luna-whisper` | `warm-single-mode` | real image, mock runtime |
| `seaside_day` | Seaside Day | `public/scenes/seaside-day-room.png` | image | `sola-warm` | `warm-single-mode` | real image, mock runtime |
| `rainforest_day` | Rainforest Day | `public/scenes/rainforest-day-room.png` | image | `moss-calm` | `warm-single-mode` | real image, mock runtime |
| `snow_mountain_day` | Snow Mountain Day | `public/scenes/snow-mountain-day-room.png` | image | `alba-soft` | `warm-single-mode` | real image, mock runtime |

## 12. Safety and Crisis Boundary

This app is a sleep companion, not a medical or psychiatric product.

Hard boundaries for future LLM integration:

- do not diagnose
- do not claim treatment or cure
- do not present the app as therapy
- do not let the model impersonate a licensed clinician
- do not let Memory generate labels like:
  - “you have anxiety disorder”
  - “you are depressed”
  - “you have a trauma condition”

If a user expresses self-harm, suicide risk, immediate danger, or inability to stay safe:

- respond supportively and calmly
- encourage contacting real-world support immediately
- encourage contacting local emergency services if danger is immediate
- encourage reaching out to a trusted person nearby
- avoid long exploratory therapeutic roleplay
- do not continue as if it is a normal sleep-coaching conversation

For non-immediate but serious distress:

- keep responses gentle and bounded
- suggest real-world support if distress sounds persistent, severe, or unsafe
- do not escalate into deep psychotherapy-style interpretation

Memory and Sleep boundaries:

- Memory may summarize recurring conversation patterns, but must not assign pathology
- Sleep may reflect behavioral or session-based patterns, but must not imply medical-grade sleep diagnosis

## 13. Backend and Storage Decisions: Current State vs Unknowns

### Current actual state

- user-facing state is primarily localStorage-backed
- there is no backend
- there is no database
- there is no auth provider
- there is no production merge flow for guest to registered user

### Decisions still not made

- long-term storage choice:
  - `UNKNOWN`
  - could later be Supabase, Firebase, Postgres, or another stack
- pre-registration data strategy:
  - currently localStorage
  - long-term approach `UNKNOWN`
- anonymous-to-registered merge strategy:
  - `UNKNOWN`
- session summary generation timing:
  - `UNKNOWN`
- memory item generation authority:
  - `UNKNOWN`
  - not decided whether generated by backend rules, LLM, human review, or hybrid
- memory item review or moderation:
  - `UNKNOWN`
- sleep record source:
  - `UNKNOWN`
  - not decided whether user-entered, session-inferred, or hybrid

### Architectural implication

Do not start deep backend coding until these decisions are at least minimally documented. Otherwise future rework risk is high.

## 14. Files a New Codex Can Edit vs Files to Treat Carefully

### Generally safe to edit for scoped feature work

- `README.md`
- `TODO.md`
- `CODEX.md`
- `CODEX_HANDOFF.md`
- `REPO_HANDOFF_FOR_CODEX.md`
- feature-local mock files when intentionally updating mock content:
  - `app/memory/memory-page-data.ts`
  - `app/sleep-monitoring/sleep-page-data.ts`

### Editable but high-caution files

- `app/first-launch-flow.tsx`
- `lib/first-launch.ts`
- `app/talk/talk-shell.tsx`
- `app/talk/talk-page.module.css`
- `app/room/page.tsx`
- `app/room/room-page.module.css`
- `app/memory/page.tsx`
- `app/memory/memory-page.module.css`
- `app/sleep-monitoring/sleep-shell.tsx`
- `app/sleep-monitoring/sleep-page.module.css`
- `components/app-frame.tsx`
- `components/shell-top-nav.tsx`
- `components/shell-top-nav.module.css`
- `app/globals.css`

### Do not casually change

- page route structure
- shell family visuals
- top navigation behavior
- Talk bottom voice dock structure
- room/scene asset mapping
- existing contract shapes in `lib/first-launch.ts`, `room-config.ts`, `scene-config.ts`, `memory-page-data.ts`, `sleep-page-data.ts`

## 15. Highest-Priority Next Tasks

Priority order for the next Codex:

1. Replace default `README.md` with a real project README
2. Document or decide backend/auth/database/deploy direction
3. Productionize first-launch persistence without changing current UI
4. Define Talk API boundary before replacing timer simulation
5. Replace Memory and Sleep mock data with backend-backed responses only after contract definitions exist

## 16. Acceptance Criteria for Near-Term Engineering Work

Any near-term implementation work should meet these standards:

- existing mobile UI is preserved
- no broad visual redesign is introduced
- route structure remains intact unless explicitly approved
- build passes
- lint passes
- type-check passes
- current page shell still feels consistent across routes
- mock-to-real wiring does not invent new product behavior without documentation
- safety boundaries are respected when AI behavior is introduced

## 17. Verification Commands

Use these after meaningful implementation work:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run type-check
```

Primary manual routes to verify:

- `http://localhost:3000/`
- `http://localhost:3000/room`
- `http://localhost:3000/talk`
- `http://localhost:3000/memory`
- `http://localhost:3000/sleep-monitoring`

## 18. Final Report Format for Future Codex Turns

After changes, a good final report should include:

1. task classification
2. files changed
3. why each changed
4. whether shared shell files were touched
5. whether any contract shape changed
6. verification results:
   - build
   - lint
   - type-check
7. remaining mock behavior
8. known risks
9. manual test steps

## 19. Required Reading Order for a New Codex

If you are a fresh Codex session entering this repo, read in this order before implementing:

1. `AGENTS.md`
2. `CODEX.md`
3. `REPO_HANDOFF_FOR_CODEX.md`
4. `CODEX_HANDOFF.md`
5. `package.json`
6. relevant page spec pair in `docs/`
7. `docs/ACCEPTANCE.md`
8. `docs/TRACKING.md`
9. `docs/HANDOFF.md`
10. active route file and related CSS/module helpers

## 20. Notes on Your Specific Feedback

- The repo currently already has an `AGENTS.md`, so a brand-new root AGENTS file was not needed
- The old reference issue you mentioned about “section 1.3” and “section 16.2” does not appear in the current repo docs set I inspected, so there was nothing local to patch there
- The missing engineering handoff layer was real, and this file is meant to fill that gap
