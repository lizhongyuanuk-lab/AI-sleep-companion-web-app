# HANDOFF

## Current State

The repository currently contains:

- a Next.js App Router project
- a shared layout with bottom navigation
- placeholder pages for `/talk`, `/room`, `/memory`, and `/sleep-monitoring`
- a rule layer rebuilt around `AGENTS.md` and the `docs/` directory

## What Future Contributors Should Preserve

1. Keep this repository as the mainline for the current web shell work.
2. Preserve the existing route skeleton unless a task explicitly changes product scope.
3. Reuse shared layout and navigation instead of cloning UI across routes.
4. Keep verification commands green before claiming completion.

## Before Coding

1. Confirm the current repository root.
2. Read `AGENTS.md`.
3. Read the four docs in `docs/`.
4. If touching Next.js application code, consult the relevant guide in `node_modules/next/dist/docs/`.

## After Coding

1. Run `npm run build`.
2. Run `npm run lint`.
3. Run `npm run type-check`.
4. Report modified files, added files, verification results, assumptions, risks, and shared-component impact.

## Open Questions

- When should placeholder routes begin receiving real product behavior?
- Which route should become the first feature-complete vertical slice?
- What test depth is appropriate once the current shell stops being placeholder-only?
