# CODEX_HANDOFF.md

## 1. Project Overview

This project is an AI sleep companion web app. It is designed for users who want gentle nighttime support rather than a clinical sleep tracker or a generic chatbot. The product experience combines:

- a first-launch flow that softly understands what the user needs tonight
- a room selection surface that sets emotional context before conversation
- a voice-first Talk experience
- a Memory page that reflects recurring conversational patterns
- a Sleep page that reflects recent sleep-related signals and nudges the user back into tonight's flow

Target users:

- people trying to wind down before sleep
- users who want quiet emotional support at night
- users who prefer a soft, low-pressure voice-first experience over text-heavy chat

Core usage scenarios:

- first-time user enters through a lightweight onboarding flow
- user chooses a room, then enters Talk
- user revisits Memory for recurring themes
- user revisits Sleep for a gentle reflection and a recommended next step

Current project phase:

- core UI direction is largely complete
- GitHub is now the main source of truth
- next phase should focus on functional development, API integration, AI integration, production hardening, and deployment readiness
- this is not the time to redesign the visual system

## 2. Current Status

### What is already done

- Main routes exist for `/`, `/talk`, `/room`, `/memory`, and `/sleep-monitoring`
- First-launch experience is implemented as a client-side flow on `/`
- Talk page has a polished voice-first UI shell and local interaction state machine
- Room page has an immersive browsing experience with scene transitions and Talk handoff
- Memory page has a strong reading-first UI with expandable recurring topics
- Sleep page has a polished reflection UI with multiple state variants
- Product and UI documentation exists in `docs/` for first launch, Talk, Room, Memory, and Sleep

### What is still static or client-only

- No real backend is present
- No real API calls are present
- No database integration is present
- No production auth system is present
- No real AI response generation is present
- No real voice transcription or TTS pipeline is present
- No real sleep data ingestion exists
- No real memory persistence exists beyond demo/local state behavior

### Current route-by-route status

- `/`
  - Fully styled first-launch flow
  - Uses localStorage-backed draft and preset state
  - Simulates room generation timing
  - No real guest account provisioning, backend onboarding record, or generated room service
- `/talk`
  - High-fidelity UI and local state transitions exist
  - Voice flow is simulated with timers
  - Settings state persists locally
  - No microphone recording upload, no STT, no LLM call, no streaming, no TTS
- `/room`
  - Room browsing UI is functional in the client
  - Uses localStorage to remember selected room and first-launch handoff context
  - Visual/audio asset failure states exist
  - Audio ambience files are currently `null`, so runtime audio is effectively placeholder
- `/memory`
  - UI is complete enough for demo and review
  - Page data is mock data
  - Expand, agree, delete, and show-more behavior are client-only
  - No real memory backend or history route implementation
- `/sleep-monitoring`
  - UI is complete enough for demo and review
  - Uses multiple mock page states
  - CTA routing is wired to existing routes, but data is not real
  - No real sleep pipeline, report generation, retry backend, or analytics

### Mock and placeholder summary

- first-launch state is stored in localStorage
- room and scene selection are stored in localStorage
- Memory page content is mock data
- Sleep page content is mock data
- Talk voice loop is simulated by timers and UI state transitions
- generated personal room flow is simulated locally
- auth status is simulated locally with guest-first behavior

### Backend / auth / database / deployment status

- Backend: not implemented
- API layer: not implemented
- Database: not implemented
- Login system: not implemented
- Deployment configuration: not confirmed in repo

### Local run status

- Yes, the project can run locally as a Next.js app
- Build, lint, and type-check scripts exist in `package.json`

## 3. Tech Stack

Based on current files and code:

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI runtime: React 19
- Styling approach: CSS Modules for feature pages plus global CSS and some Tailwind utility usage
- UI component library: none confirmed
- State management: React local state and localStorage helpers
- Routing: Next.js App Router via `app/`
- Package manager: npm is the active confirmed choice because `package-lock.json` exists
- Backend solution: none currently implemented
- Database solution: none currently implemented
- AI integration: none currently implemented
- Deployment solution: unconfirmed, please use `package.json`, hosting setup, and future infra decisions as source of truth
- Authentication: no production auth; local guest/auth flag simulation only

Notes:

- Tailwind is installed, but the product UI is primarily built with CSS Modules and route-specific styles
- No server actions, API routes, or external SDK integrations are currently in use

## 4. Directory Structure

Main project structure:

- `app/`
  - Next.js App Router pages and route-level UI
  - contains the first-launch flow and the core product routes
- `app/talk/`
  - Talk page runtime, scene config, icons, and styling
- `app/room/`
  - Room browsing page, room config, and styling
- `app/memory/`
  - Memory page UI, mock data, and styling
- `app/sleep-monitoring/`
  - Sleep page UI, mock data, and styling
- `components/`
  - shared shell components such as `AppFrame` and `ShellTopNav`
- `lib/`
  - local client-side helpers for first launch, room selection, and scene selection
- `docs/`
  - product specs, UI specs, handoff notes, tracking docs, and layout rules
- `public/`
  - static assets such as scene images and nav icons
- `.cursor/`
  - editor/tooling rules; not runtime app logic

Important files:

- `app/layout.tsx`
  - global layout, wraps all pages with `AppFrame`
- `app/globals.css`
  - global variables and shared layout tokens
- `package.json`
  - scripts and dependency baseline
- `README.md`
  - still mostly default Next.js content and should not be treated as the main product source of truth

## 5. Pages

| Page | Path | Current Status | Notes |
|---|---|---|---|
| Home / First Launch | `/` | 部分交互完成 / 使用 mock data / 未接后端 | Implements first-launch onboarding, preset creation, optional personal room branch, and Room handoff with localStorage only |
| Talk | `/talk` | 已完成 UI / 部分交互完成 / 使用 mock behavior / 未接后端 | Voice-first shell with simulated recording, processing, speaking, quiet mode, and local sound settings |
| Room | `/room` | 已完成 UI / 部分交互完成 / 使用 mock behavior / 未接后端 | Scrollable immersive room selection with localStorage persistence and Talk route handoff |
| Memory | `/memory` | 已完成 UI / 使用 mock data / 未接后端 | Reading-first memory reflection page with client-side expand, agree, delete, and show-more interactions |
| Sleep Monitoring | `/sleep-monitoring` | 已完成 UI / 使用 mock data / 未接后端 | Gentle sleep reflection page with loading, full, partial, companion-only, empty, and error states |

## 6. Components

### Shared shell components

- `components/app-frame.tsx`
  - Purpose: wraps all pages and decides full-bleed versus contained layout behavior
  - Reusable: yes
  - Depends on mock data: no
  - Critical visual component: yes
  - Do not casually modify: yes

- `components/shell-top-nav.tsx`
  - Purpose: top navigation capsule used by Talk, Memory, and Sleep
  - Reusable: yes
  - Depends on mock data: no
  - Critical visual component: yes
  - Do not casually modify: yes

- `components/shell-top-nav.module.css`
  - Purpose: visual styling for the top navigation shell
  - Reusable: yes
  - Depends on mock data: no
  - Critical visual component: yes
  - Do not casually modify: yes

- `components/bottom-nav.tsx`
  - Purpose: legacy fallback bottom nav for non-immersive routes
  - Reusable: limited
  - Depends on mock data: no
  - Critical visual component: no for main product routes
  - Do not casually modify: moderate caution; currently hidden on primary product routes

- `components/page-placeholder.tsx`
  - Purpose: placeholder UI helper for simple structural pages
  - Reusable: yes
  - Depends on mock data: no
  - Critical visual component: no
  - Do not casually modify: lower risk

### Route-critical runtime components

- `app/first-launch-flow.tsx`
  - Purpose: full first-launch flow controller and UI
  - Reusable: route-specific
  - Depends on mock/local data: yes
  - Critical visual component: yes
  - Do not casually modify: yes

- `app/talk/talk-shell.tsx`
  - Purpose: Talk page runtime state machine and controls
  - Reusable: route-specific
  - Depends on mock/local data: yes
  - Critical visual component: yes
  - Do not casually modify: yes

- `app/room/page.tsx`
  - Purpose: Room selection experience and Talk entry handoff
  - Reusable: route-specific
  - Depends on mock/local data: yes
  - Critical visual component: yes
  - Do not casually modify: yes

- `app/memory/page.tsx`
  - Purpose: Memory reflection and local interaction shell
  - Reusable: route-specific
  - Depends on mock/local data: yes
  - Critical visual component: yes
  - Do not casually modify: yes

- `app/sleep-monitoring/sleep-shell.tsx`
  - Purpose: Sleep reflection state rendering and CTA routing
  - Reusable: route-specific
  - Depends on mock/local data: yes
  - Critical visual component: yes
  - Do not casually modify: yes

### Config and mock-contract files

- `app/room/room-config.ts`
  - Purpose: room catalog and room-to-Talk mapping
  - Reusable: yes
  - Depends on mock/local data: yes
  - Critical visual component: yes because room identity depends on it
  - Do not casually modify: yes

- `app/talk/scene-config.ts`
  - Purpose: Talk scene catalog and default sound settings
  - Reusable: yes
  - Depends on mock/local data: yes
  - Critical visual component: yes
  - Do not casually modify: yes

- `app/memory/memory-page-data.ts`
  - Purpose: Memory page mock contract and demo content
  - Reusable: yes as a future API shape reference
  - Depends on mock/local data: yes
  - Critical visual component: medium
  - Do not casually modify: moderate caution

- `app/sleep-monitoring/sleep-page-data.ts`
  - Purpose: Sleep page mock contract and demo states
  - Reusable: yes as a future API shape reference
  - Depends on mock/local data: yes
  - Critical visual component: medium
  - Do not casually modify: moderate caution

## 7. Mock Data

### Current mock sources

- `app/memory/memory-page-data.ts`
  - Exports `memoryPageMockData`
  - Represents the Memory page contract and demo content

- `app/sleep-monitoring/sleep-page-data.ts`
  - Exports `sleepMockCases`, `sleepLoadingState`, and related types
  - Represents multiple Sleep page states

- `app/room/room-config.ts`
  - Room catalog is hardcoded
  - Currently acts as frontend source of truth

- `app/talk/scene-config.ts`
  - Talk scenes, room names, and sound defaults are hardcoded
  - Currently acts as frontend source of truth

- `lib/first-launch.ts`
  - Contains local first-launch options, preset blueprints, and client storage utilities
  - Effectively acts as the temporary onboarding logic layer

### Mock behavior that should become API-driven later

- first-launch draft persistence
- onboarding preset generation and consumption
- generated personal room record creation
- auth status
- room recommendation logic if product later moves that server-side
- Talk prompt/response lifecycle
- Memory recurring topics and actions
- Sleep summaries, rhythm, trends, and suggestions

### Suggested future cleanup

Current mock data is reasonably grouped by feature, which is useful during UI-first development. Do not force a premature migration right now. If later API integration grows, consider one of these approaches:

- keep feature-local mock files until the real API client is added
- then move old mock cases into a dedicated folder such as `lib/mock-data/`
- avoid flattening everything into one large `lib/mockData.ts` file

Recommended direction:

- keep Memory mocks in `app/memory/`
- keep Sleep mocks in `app/sleep-monitoring/`
- only centralize shared demo fixtures if multiple routes start consuming the same mock dataset

## 8. Environment Variables

### Current status

- No active environment variables are confirmed in the current codebase
- No `.env` file is tracked in Git

### Future variables likely needed

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `SENTRY_DSN`
- `POSTHOG_KEY`
- `POSTHOG_HOST`

Use only what matches the eventual backend and hosting choice.

Hard rule:

- Do not commit `.env`, `.env.local`, API keys, database credentials, or any sensitive config to GitHub

## 9. Local Development

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Default local address:

- `http://localhost:3000`

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Type check

```bash
npm run type-check
```

### Start production build locally

```bash
npm run start
```

### Node.js version

- Not explicitly pinned in the repository
- Please confirm the active Node.js version from the local environment, team standard, or future deployment target

## 10. Recommended Next Development Direction

Highest-value next steps for a new Codex:

1. Preserve existing UI and avoid redesign work.
2. Add a real backend boundary for first-launch, Talk, Memory, and Sleep.
3. Define stable API contracts before wiring production data.
4. Add authentication and user/session persistence.
5. Replace localStorage-only product state with server-backed flows where appropriate.
6. Integrate AI capabilities for Talk using a secure server-side API path.
7. Prepare deployment, monitoring, and analytics.

## 11. Known Constraints and Cautions

- README is still mostly default Next.js boilerplate
- main product truth lives in the route files and `docs/`
- current visuals are much more mature than the data layer
- there is no backend yet, so many polished flows are still demo-grade under the hood
- shared shell files are cross-route sensitive and should be edited cautiously
- `app/layout.tsx` currently injects an external Figma capture script; keep this in mind when reviewing CSP, performance, and production deployment requirements
