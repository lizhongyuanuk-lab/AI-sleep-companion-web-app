# HANDOFF

## Current Source Of Truth

Preserve these files as the authoritative Talk documents:

- [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
- [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

`docs/ACCEPTANCE.md`, `docs/TRACKING.md`, and this file are process support only.

## What Future Contributors Should Preserve

1. `/talk` is currently being rebuilt as a `ui-only` voice-first page.
2. Do not use older Talk decision files as product truth.
3. Keep route scope limited to the existing V1 paths.
4. Reuse shared layout only when it does not break the Talk immersive shell.
5. Keep verification green before claiming completion.

## Before Coding

1. Confirm repository root.
2. Read `AGENTS.md`.
3. Read `docs/SPEC.md`.
4. Read `docs/TALK_UI_SPEC.md`.
5. Read the local Next.js docs when framework behavior matters.

## After Coding

1. Run `npm run build`.
2. Run `npm run lint`.
3. Run `npm run type-check`.
4. Report modified files, added files, deleted files, verification results, assumptions, risks, and shared-component impact.
5. Call out any remaining mock-only behavior explicitly.
