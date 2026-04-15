# HANDOFF

## Current State

The repository currently contains:

- a Next.js App Router project
- a shared layout with bottom navigation
- placeholder pages for `/talk`, `/room`, `/memory`, and `/sleep-monitoring`
- a rule layer rebuilt around `AGENTS.md` and the `docs/` directory
- a locked V1 product spec vendored into `docs/SPEC.md`

## What Future Contributors Should Preserve

1. Keep this repository as the mainline for the current web shell work.
2. Treat `docs/SPEC.md` as the highest-priority product document for V1.
3. Preserve the existing route skeleton unless a task explicitly changes product scope or a spec upgrade is approved.
4. Reuse shared layout and navigation instead of cloning UI across routes.
5. Keep verification commands green before claiming completion.

## Before Coding

1. Confirm the current repository root.
2. Read `AGENTS.md`.
3. Read `docs/SPEC.md` first, then the other docs in `docs/`.
4. If touching `/talk` or `/room` UI, also read `docs/TALK_UI_DECISIONS.md`.
5. Treat the vendored `docs/SPEC.md` copy as authoritative instead of any external file path.
6. If touching Next.js application code, consult the relevant guide in `node_modules/next/dist/docs/`.

## After Coding

1. Run `npm run build`.
2. Run `npm run lint`.
3. Run `npm run type-check`.
4. Report modified files, added files, verification results, assumptions, risks, and shared-component impact.
5. Call out any remaining mismatch between implementation and `docs/SPEC.md`.

## Open Questions

- When should placeholder routes begin receiving real product behavior?
- Which route should become the first feature-complete vertical slice?
- What test depth is appropriate once the current shell stops being placeholder-only?
