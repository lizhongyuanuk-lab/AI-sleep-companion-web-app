# SPEC

## Purpose

This repository is the active mainline for `ai-companion-web`.
Its current goal is to provide a stable Next.js application shell with a small set of placeholder routes and shared navigation.

## Current Route Scope

- `/`
- `/talk`
- `/room`
- `/memory`
- `/sleep-monitoring`

## In Scope Now

- Preserve and refine the current App Router structure
- Maintain a shared layout and bottom navigation
- Keep each route available with a lightweight placeholder page
- Improve repository rules, handoff quality, and verification discipline

## Out of Scope For This Phase

- New routes outside the current scope
- Backend service integration
- Voice or audio pipeline integration
- Production analytics wiring
- Complex persistence, syncing, or orchestration layers

## Architectural Direction

1. Keep route files simple and easy to inspect.
2. Put reusable UI into shared components when at least two routes benefit.
3. Favor static or low-complexity placeholders until the product rules are clearer.
4. Avoid introducing duplicate navigation, duplicate state models, or route-specific copies of shared UI.

## Source Priority

When implementation guidance conflicts, use this order:

1. `AGENTS.md`
2. `docs/SPEC.md`
3. `docs/ACCEPTANCE.md`
4. `docs/TRACKING.md`
5. `docs/HANDOFF.md`
6. Current code and config

## Notes

This is a first-pass framework spec. It should evolve as the mainline becomes more concrete, but it must continue to protect the current route skeleton and shared navigation layer.
