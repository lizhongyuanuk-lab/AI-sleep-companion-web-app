# CODEX.md

## Project Identity

This repository is an AI sleep companion product focused on helping users settle at night through first-launch onboarding, room selection, voice-first companion sessions, memory reflection, and sleep reflection.

Current priority:

- the UI direction is largely established
- GitHub is now the main project source of truth
- the next phase is engineering completion, interaction hardening, backend and API integration, AI integration, and deployment readiness
- future Codex work should extend the existing product, not redesign it

The most important principle is to preserve the current visual language while making the product real.

## Core Rules for Codex

1. Read relevant files before every change.
2. Read `package.json` before implementation work so the active toolchain and scripts are clear.
3. Do not do large refactors unless the user explicitly asks for them.
4. Do not break the current UI style or page structure.
5. Do not casually change colors, spacing, radii, shadows, typography hierarchy, icon sizing, or the overall visual language.
6. Prefer reusing existing components, CSS modules, route patterns, and local utility helpers.
7. Do not delete existing pages, components, assets, or docs unless the user explicitly requests it.
8. Do not casually introduce new dependencies, SDKs, UI kits, or state libraries.
9. Explain the implementation plan before editing files.
10. After changes, always report:
   - which files changed
   - why they changed
   - how to test the change
11. If product logic is unclear, choose the smallest reasonable implementation and clearly state assumptions.
12. Never commit `.env`, API keys, tokens, service credentials, or any sensitive information.
13. Mobile experience comes first. Do not optimize desktop at the expense of mobile behavior.
14. Prefer small, reviewable changes over big all-at-once rewrites.
15. Preserve current route structure unless the user explicitly approves route changes.
16. Keep mock behavior clearly labeled until real backend wiring exists.

## Design Rules

- Preserve the current UI design language across all routes.
- Keep page-to-page consistency in shell chrome, spacing rhythm, and interaction tone.
- Maintain mobile-first behavior and safe-area awareness.
- Reuse existing design components and shell patterns before creating new ones.
- Do not introduce a new visual system, theme direction, or component language unless explicitly requested.
- Treat the existing `docs/` specs as product and UI source of truth for page behavior.
- When touching Talk, Room, Memory, or Sleep, protect the established atmosphere and keep changes visually subtle.

## Engineering Rules

- Check `package.json` before modifying runtime behavior.
- Prefer existing project patterns: App Router, local state, CSS modules, and small utility files in `lib/`.
- After changes, run as many of these as practical:
  - `npm run build`
  - `npm run lint`
  - `npm run type-check`
- If something fails, fix the smallest real problem first.
- Keep code maintainable and explicit. Avoid hidden magic.
- Avoid creating duplicate components or parallel implementations.
- Prefer adding narrow helpers over introducing premature abstraction.
- Keep mock contracts stable until a real API contract is defined.
- If backend, auth, database, or AI integration is added later, wire it behind clear interfaces so the current UI can stay intact.

## Workflow Expectations

- Start by reading the active page file, related CSS module, and any matching spec in `docs/`.
- Keep notes clear about what is currently mock, localStorage-backed, or simulated.
- When editing shared shell elements such as `components/shell-top-nav.tsx`, `components/app-frame.tsx`, or shared CSS tokens, explicitly call out cross-route impact.
- Prefer incremental integration:
  - first preserve existing UI and behavior
  - then attach real data or API calls
  - then add loading, empty, and error handling
  - then harden edge cases

## Security and Data Rules

- Never commit secrets to GitHub.
- Do not store production secrets in localStorage.
- If auth or API access is introduced, keep server-only credentials on the server side.
- If future AI integration uses OpenAI or other providers, route sensitive calls through server endpoints rather than exposing secret keys in the client.
