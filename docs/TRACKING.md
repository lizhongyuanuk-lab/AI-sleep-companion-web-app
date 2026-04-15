# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Framework shell present: yes
- Shared bottom navigation present: yes
- Placeholder routes present: yes
- Rule docs restored: in progress

## Active Priorities

1. Keep the current route skeleton stable.
2. Rebuild the repository rule layer so future work has a clear baseline.
3. Verify every framework-level change with build, lint, and type-check.

## Known Constraints

1. Do not use the parent `Playground` directory as the formal source for rules or implementation.
2. Do not delete current placeholder routes while framework stabilization is in progress.
3. Prefer incremental, reviewable changes over broad restructuring.

## Next Recommended Steps

1. Keep framework docs aligned with actual route structure.
2. Add implementation details only after the rule layer is stable.
3. Introduce tests when the route behavior becomes more concrete.

## Update Guidance

When this file is revised, prefer short factual updates over speculative planning.
