# ACCEPTANCE

## Framework Layer Baseline

The framework layer is acceptable when all of the following remain true:

1. The Next.js app builds successfully.
2. Lint passes successfully.
3. Type-check passes successfully.
4. The routes `/`, `/talk`, `/room`, `/memory`, and `/sleep-monitoring` all exist in the current app.
5. Shared navigation remains available from the common layout.
6. Placeholder routes remain lightweight and do not introduce unrelated business logic.

## Rule Layer Baseline

1. `AGENTS.md` exists and documents repository execution rules.
2. The `docs/` directory exists.
3. `docs/SPEC.md`, `docs/ACCEPTANCE.md`, `docs/TRACKING.md`, and `docs/HANDOFF.md` all exist.
4. `docs/SPEC.md` is the locked V1 source of truth for product structure and UI behavior.
5. These docs describe the current mainline rather than an external parent directory or a floating file outside the repo.

## Spec Alignment Baseline

1. Top-level product decisions should follow `docs/SPEC.md`.
2. New implementation work should not knowingly conflict with the locked V1 route structure, navigation labels, or Talk-screen content rules unless the user approves a spec change.
3. If the current codebase diverges from `docs/SPEC.md`, the divergence should be called out explicitly rather than silently normalized.

## Non-Goals For This Phase

The task is not required to deliver:

- polished feature UI
- backend connectivity
- production-ready data models
- full end-to-end tests

## Review Reminder

If a change removes route skeletons, shared navigation, or repository rules without explicit approval, it should be treated as a regression.
If a change conflicts with the locked V1 spec without explicit approval, it should also be treated as a regression.
