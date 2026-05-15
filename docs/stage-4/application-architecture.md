# Stage 4 Application Architecture

## Purpose

This document captures the Stage 4 architecture intent for the AI Sleep Companion web app. It is the design artifact for how implementation work should be organized before Stage 5 feature delivery and before Stage 6 Go Gin backend integration.

Long-term coding rules live under `docs/engineering/`. This file should describe architecture intent and product-facing structure without duplicating the full engineering rule set.

## Current Product Surface

The current Stage 4 architecture target covers:

- `/` and `/onboarding` first-launch flow
- `/room` room selection
- `/talk` voice-first companion surface
- `/memory` memory reflection
- `/sleep-monitoring` sleep reflection

## Architecture Intent

Implementation should separate:

1. product contracts and shared states
2. pure domain logic
3. adjustable policies and config
4. typed experience builders for page view models
5. thin route pages and presentational components

Required flow:

```text
contracts -> domain -> policies/config -> experience -> app/components
```

## Route-Level Expectations

- first launch and onboarding should consume typed onboarding and room-selection experience data
- Talk should remain voice-first and should not bury product rules inside the page shell
- Memory and Sleep may remain mock-driven during earlier stages, but their mock boundary must stay explicit
- future backend calls must be isolated behind the frontend API boundary rather than mixed into page components

## Relationship to Engineering Rules

Use `docs/engineering/coding-architecture-rules.md` for the full implementation standard.

Use `docs/engineering/source-of-truth-map.md` and `docs/engineering/worktree-branch-map.md` before starting implementation from a new branch or worktree.
