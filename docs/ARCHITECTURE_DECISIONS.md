# ARCHITECTURE_DECISIONS.md

## Purpose

This document is the current architecture decision placeholder for the AI Sleep Companion Web app.

Its job is not to pretend decisions are already final. Its job is to make clear:

- what is already true in code
- what is still undecided
- which decisions must be made before deep backend work starts

## Current Confirmed Architecture

### Frontend

- Framework: Next.js 16 App Router
- Language: TypeScript
- UI runtime: React 19
- Styling: CSS Modules + `app/globals.css` + limited Tailwind utility usage
- Main routes:
  - `/`
  - `/room`
  - `/talk`
  - `/memory`
  - `/sleep-monitoring`

### Current state model

The app currently relies on:

- React local state
- localStorage
- feature-local mock data

Important client-side state bridges:

- `lib/first-launch.ts`
- `lib/room-selection.ts`
- `lib/scene-selection.ts`

### Current backend status

- backend: not implemented
- API layer: not implemented
- database: not implemented
- auth provider: not implemented
- deployment platform: `UNKNOWN`

## Current Feature-Level Data Sources

### First Launch

- flow UI: `app/first-launch-flow.tsx`
- local contract and state bridge: `lib/first-launch.ts`
- persistence: localStorage only

### Room

- runtime: `app/room/page.tsx`
- catalog data: `app/room/room-config.ts`
- persistence: localStorage only

### Talk

- runtime: `app/talk/talk-shell.tsx`
- scene data: `app/talk/scene-config.ts`
- persistence: localStorage only
- AI behavior: simulated by timers only

### Memory

- runtime: `app/memory/page.tsx`
- data source: `app/memory/memory-page-data.ts`
- persistence: local UI state only

### Sleep Monitoring

- runtime: `app/sleep-monitoring/sleep-shell.tsx`
- data source: `app/sleep-monitoring/sleep-page-data.ts`
- persistence: local UI state only

## Decisions Still Needed

These are the most important unresolved engineering decisions.

### 1. Backend platform

Current status:

- `UNKNOWN`

Possible directions:

- Supabase
- Firebase
- custom Node backend + Postgres
- another managed backend

Decision criteria:

- auth support
- database support
- realtime needs
- AI integration ergonomics
- deployment simplicity

### 2. Authentication strategy

Current status:

- no real auth system exists
- current app simulates guest-first behavior

Must decide:

- guest-only temporary session model
- email auth
- OAuth
- anonymous auth upgrade path

Important product requirement:

- guest-first behavior should be preserved if possible

### 3. Anonymous session storage and merge

Current status:

- anonymous state currently lives in localStorage

Must decide:

- whether anonymous users get a backend session immediately
- how pre-signup data is persisted
- how data merges after registration

Needs a documented answer for:

- onboarding progress
- generated room state
- Talk continuity
- Memory continuity
- Sleep continuity

### 4. Data model ownership

Must decide who generates and owns:

- session summary
- memory items
- sleep reflection summary
- room recommendations

Current status:

- all of these are mock or inferred by frontend demo logic

### 5. AI runtime boundary

Must decide:

- where LLM calls live
- whether Talk is text-first under the hood or true audio-first
- whether STT and TTS are part of V1
- whether AI responses are streamed
- whether safety filtering happens before or after model output

Hard recommendation:

- AI calls should go through server-side endpoints
- do not expose secret keys to the browser

### 6. Sleep data source

Current status:

- `UNKNOWN`

Must decide whether sleep data is:

- manually entered by user
- inferred from session behavior
- connected from device or wearable source
- hybrid

This decision affects:

- contract shapes
- safety wording
- product claims
- privacy handling

## Recommended Architecture Direction

This is not yet a final commitment, but it is the recommended shape for future implementation.

### Recommended baseline

- keep Next.js frontend
- introduce server-side API boundaries gradually
- preserve current page UI and CSS Modules
- replace local mock data behind feature-local API clients
- define shared TypeScript contract types before wiring production data

### Recommended order

1. choose backend, auth, and storage direction
2. document anonymous session model
3. define API contracts for first-launch and Talk
4. productionize first-launch persistence
5. define Memory and Sleep server contracts
6. add AI integration behind server endpoints

## Files That Should Not Be Rewritten During Architecture Work

- `app/talk/talk-page.module.css`
- `app/room/room-page.module.css`
- `app/memory/memory-page.module.css`
- `app/sleep-monitoring/sleep-page.module.css`
- `components/shell-top-nav.tsx`
- `components/shell-top-nav.module.css`
- `app/globals.css`

Reason:

- architecture work should not trigger a visual redesign

## Acceptance Criteria for Architecture Work

Architecture work is only useful if it produces concrete guidance. A good architecture update should:

- state what is already true
- clearly label unknowns
- document chosen backend, auth, and data direction
- define which current mock contracts will become real API contracts
- preserve current route and UI structure
- reduce ambiguity for the next implementation step
