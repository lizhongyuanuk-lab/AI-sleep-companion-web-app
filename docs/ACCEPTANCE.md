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
4. These docs describe the current mainline rather than an external parent directory.

## Non-Goals For This Phase

The task is not required to deliver:

- polished feature UI
- backend connectivity
- production-ready data models
- full end-to-end tests

## Review Reminder

If a change removes route skeletons, shared navigation, or repository rules without explicit approval, it should be treated as a regression.
