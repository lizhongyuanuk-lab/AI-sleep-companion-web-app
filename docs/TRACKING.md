# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Authoritative Talk PRD + non-UI doc vendored: yes
- Authoritative Talk UI spec vendored: yes
- Current `/talk` fully aligned to latest Talk docs: not yet

## Active Priorities

1. Use `docs/SPEC.md` and `docs/TALK_UI_SPEC.md` as the only Talk product/UI truth.
2. Rebuild `/talk` as a voice-first immersive page.
3. Keep route scope limited to `/talk` and only touch shared shell code when required.
4. Verify every implementation change with build, lint, and type-check.

## Known Constraints

1. Do not use older Talk docs as runtime truth.
2. Do not turn this task into data wiring or API redesign.
3. Keep `/memory` and `/sleep-monitoring` untouched unless a shared shell change is unavoidable.
4. Prefer small, reviewable changes over broad cleanup.

## Next Recommended Steps

1. Align shared shell behavior needed for immersive Talk layout.
2. Implement the new top nav order and content skeleton for `/talk`.
3. Implement the new voice-first dock, visibility states, and overlays.
4. Run verification and report any remaining mock-only areas.
