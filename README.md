# AI Sleep Companion Web

AI Sleep Companion Web is a mobile-first Next.js product prototype for a gentle nighttime companion experience. The app currently focuses on:

- a first-launch onboarding flow
- room selection before conversation
- a voice-first Talk page
- a Memory reflection page
- a Sleep Monitoring reflection page

The UI direction is already largely established. The next phase is not a visual redesign. The next phase is engineering completion: backend wiring, API integration, AI integration, persistence, and deployment readiness.

## GitHub

- Repo: [AI-sleep-companion-web-app](https://github.com/lizhongyuanuk-lab/AI-sleep-companion-web-app)
- Current primary handoff docs:
  - [CODEX.md](./CODEX.md)
  - [CODEX_HANDOFF.md](./CODEX_HANDOFF.md)
  - [REPO_HANDOFF_FOR_CODEX.md](./REPO_HANDOFF_FOR_CODEX.md)
  - [TODO.md](./TODO.md)

## Current Status

What is already in place:

- `/` first-launch UI flow
- `/room` immersive room-selection UI
- `/talk` voice-first Talk shell
- `/memory` memory reflection UI
- `/sleep-monitoring` sleep reflection UI
- route-specific product and UI specs under `docs/`

What is not production-ready yet:

- no real backend
- no real auth
- no database
- no real AI conversation pipeline
- no real STT or TTS
- Memory and Sleep are still mock-data-driven
- first-launch and room selection still rely heavily on localStorage

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- CSS Modules
- `app/globals.css` for shared tokens and safe-area layout variables
- limited Tailwind usage in shared shell files

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Type-check:

```bash
npm run type-check
```

Run production build locally:

```bash
npm run start
```

## Main Routes

- `/`
  - first-launch onboarding and optional personal room branch
- `/room`
  - room browsing and Talk entry handoff
- `/talk`
  - voice-first companion surface
- `/memory`
  - mock memory reflection page
- `/sleep-monitoring`
  - mock sleep reflection page

## Source of Truth

Repository-level execution rules:

- `AGENTS.md`

Primary Codex handoff docs:

- `CODEX.md`
- `CODEX_HANDOFF.md`
- `REPO_HANDOFF_FOR_CODEX.md`
- `TODO.md`

Page-level product and UI source of truth:

- `/` -> `docs/FIRST_LAUNCH_SPEC.md` + `docs/FIRST_LAUNCH_UI_SPEC.md`
- `/talk` -> `docs/SPEC.md` + `docs/TALK_UI_SPEC.md`
- `/room` -> `docs/ROOM_SPEC.md` + `docs/ROOM_UI_SPEC.md`
- `/memory` -> `docs/MEMORY_SPEC.md` + `docs/MEMORY_UI_SPEC.md`
- `/sleep-monitoring` -> `docs/SLEEP_SPEC.md` + `docs/SLEEP_UI_SPEC.md`

Shared process and acceptance docs:

- `docs/ACCEPTANCE.md`
- `docs/TRACKING.md`
- `docs/HANDOFF.md`
- `docs/GLOBAL_MOBILE_LAYOUT_SPEC.md`

## Important File Map

- `app/first-launch-flow.tsx`
  - first-launch runtime
- `app/room/page.tsx`
  - Room runtime
- `app/talk/talk-shell.tsx`
  - Talk runtime and current voice dock implementation
- `app/memory/page.tsx`
  - Memory page
- `app/sleep-monitoring/sleep-shell.tsx`
  - Sleep runtime
- `app/room/room-config.ts`
  - Room catalog
- `app/talk/scene-config.ts`
  - Talk scene catalog
- `app/memory/memory-page-data.ts`
  - Memory mock data
- `app/sleep-monitoring/sleep-page-data.ts`
  - Sleep mock data
- `components/shell-top-nav.tsx`
  - top shell navigation
- `app/globals.css`
  - shared UI tokens and safe-area variables
- `lib/first-launch.ts`
  - onboarding state shapes and local storage bridge

## Development Rules

- Do not casually redesign the current UI.
- Do not do broad refactors unless explicitly asked.
- Preserve current mobile-first behavior.
- Prefer replacing mock data behind stable interfaces instead of rewriting page structure.
- Do not commit `.env`, API keys, or sensitive config.
- Keep changes small and reviewable.

## Recommended Reading Order for a New Codex

1. `AGENTS.md`
2. `CODEX.md`
3. `REPO_HANDOFF_FOR_CODEX.md`
4. `CODEX_HANDOFF.md`
5. `package.json`
6. relevant page spec files in `docs/`
7. the active route file and related CSS / `lib/` helpers

## What to Do Next

Highest-value next steps:

1. define backend, auth, database, and deployment direction
2. productionize first-launch persistence
3. define Talk API boundary and AI integration plan
4. replace Memory and Sleep mock data with real backend-backed flows
5. prepare deployment, monitoring, and analytics
