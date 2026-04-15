# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Locked V1 spec imported into `docs/SPEC.md`: yes
- Framework shell present: yes
- Shared bottom navigation present: yes
- Placeholder routes present: yes
- Rule docs restored: yes
- Current UI fully aligned with locked V1 spec: not yet

## Active Priorities

1. Keep the current route skeleton stable.
2. Treat `docs/SPEC.md` as the core mainline document for future implementation.
3. Bring current route implementations into alignment with the locked V1 spec incrementally.
4. Verify every framework-level change with build, lint, and type-check.

## Known Constraints

1. Do not use the parent `Playground` directory as the formal source for rules or implementation.
2. Do not delete current placeholder routes while framework stabilization is in progress.
3. Prefer incremental, reviewable changes over broad restructuring.
4. Do not reference the original `Downloads` copy as the continuing source of truth after it has been vendored into `docs/SPEC.md`.

## Next Recommended Steps

1. Audit current routes against the locked V1 spec and list the highest-priority mismatches.
2. Align `/talk` first because it is the default route and primary live companion page.
3. Align top navigation labels and ordering everywhere they appear.
4. Introduce tests when route behavior becomes more concrete.

## Update Guidance

When this file is revised, prefer short factual updates over speculative planning.
