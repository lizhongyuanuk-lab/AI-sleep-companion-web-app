# Talk UI Implementation Brief Template

## 0. Document Role

This brief defines the implementation boundary for a specific Talk page task.

It is not a product redesign document.
It is not an API contract document.
It is not a general brainstorming prompt.

This brief exists to constrain a single implementation round so that the agent can:

- implement the locked Talk UI in code
- stay within scope
- avoid inventing product logic
- avoid silently turning mock behavior into claimed production behavior
- produce a reviewable and stable result

This template must not override higher-priority Talk source-of-truth documents.

## 1. Current Task Type

Choose one:

- `ui-only`
- `data-wiring`
- `api-contract`
- `bugfix`
- `content-only`
- `approved-refactor`

For the standard Talk UI round, the task type should usually be `ui-only`.

## 2. Current Goal

State exactly what this round should deliver.

For a Talk UI round, the goal is usually to produce:

- a stable Talk page layout
- correct visual hierarchy
- correct anchoring of the `room name` / room identity label
- correct bottom input dock structure
- correct dock-adjacent hint / error behavior only where explicitly required by the locked spec
- correct scene-safe readability treatment
- mock state shells for locked Talk states

This round does not need to implement:

- real recording runtime
- real STT
- real TTS
- real session creation
- real message persistence
- real memory write behavior

## 3. Current Phase

Choose one:

- visual prototype
- UI implementation with mock data
- real data wiring
- runtime-complete feature

For the standard Talk front-end pass, the phase should usually be `UI implementation with mock data`.

## 4. Source of Truth

Follow these sources in order:

1. `AGENTS.md`
2. Talk page PRD / non-UI delivery spec
3. Talk page UI spec
4. current repository structure and approved shared components
5. local implementation inference only where necessary

If there is a conflict:

- follow the higher-priority document
- do not silently improvise a new product decision
- report the conflict in the final output

## 5. Page Intent

The Talk page is the primary immersive companion surface.

It should feel:

- calm
- stable
- emotionally focused
- low-friction
- voice-first
- visually coherent with Room where the locked specs require continuity
- structurally ready for future data wiring

It should not feel:

- like a traditional IM app
- like a debug page
- like a generic chatbot
- like a settings page
- visually disconnected from Room

## 6. What Must Be Implemented In This Round

### 6.1 Core layout

Implement the locked Talk page structure, including:

- top navigation shell
- `room name` / room identity label in the locked anchor position
- central scene / atmosphere area
- dock-adjacent hint / action guidance only if explicitly required by the locked spec
- bottom dock / voice-first input area
- fixed bottom scrim and lower safe zone where required by spec

### 6.2 Room text consistency

The room-related text area must remain visually aligned with the locked cross-page logic.

If the spec requires consistency with Room:

- preserve the same anchor logic
- preserve the same left alignment system
- preserve the same bottom safe-zone logic
- do not move the room identity label into a different layout system

### 6.3 Readability structure

If Talk uses scene backgrounds with varying brightness, readability must be protected structurally.

Use:

- fixed bottom scrim
- lower safe zone
- stable text anchors

Do not rely on:

- runtime recolor
- scene-specific ad hoc overrides
- one-off local fixes for individual backgrounds unless explicitly required

### 6.4 Bottom dock

Implement the bottom dock structure as defined by the Talk UI spec.

The dock must be:

- visually stable
- correctly aligned
- not oversized
- not overly heavy
- clearly separated from the background
- consistent with the fixed UI shell logic

### 6.5 Mock UI state shells

Implement UI shells for the main Talk states if they are part of the locked spec.

At minimum, support visual shells for:

- `idle_default`
- `standby_for_voice`
- `voice_recording`
- `processing`
- `ai_speaking`
- basic failed / unavailable shell if required by existing design

These may remain mock in this round, but must be clearly treated as mock.

## 7. What Is Allowed To Be Mock

The following may remain mock in this round if not already backed by real contract/runtime:

- room name data source
- sound hint / room metadata source
- voice state transitions
- dock label state
- dock-adjacent hint visibility timing if not already contract-defined
- session identifiers
- runtime voice / TTS behavior
- room background selection source if still locally configured

Rules:

- mock values must not silently hard-code product truth
- mock values must not be reported as production-complete behavior
- mock state machines must be identified as demo or placeholder behavior where relevant

## 8. What Must Not Be Done In This Round

Do not do any of the following unless explicitly requested:

- do not wire real backend endpoints
- do not create or redefine API contracts
- do not redefine session creation timing
- do not define memory extraction timing
- do not turn this into a transcript or chat-history product redesign
- do not redesign Room
- do not redesign Memory
- do not redesign global navigation
- do not change locked route structure
- do not silently change design tokens
- do not introduce speculative features
- do not refactor unrelated shared components for elegance or cleanup

## 9. Allowed Files

Modify only files that are genuinely necessary for the current Talk UI implementation.

Typical allowed areas may include:

- `app/talk/*`
- `components/talk/*`
- strictly necessary shared UI files only when the Talk task cannot be completed without them
- Talk-specific asset references or local UI config files

If a shared component must be touched:

- keep the change minimal
- state why it was necessary
- report all likely impacted routes

## 10. Protected Areas

Do not modify unless absolutely required and justified:

- `app/room/*`
- `app/memory/*`
- `app/sleep-monitoring/*`
- route architecture
- global navigation system
- product-level contracts
- long-term design system tokens
- onboarding logic
- session / memory data definitions

## 11. Visual Discipline Rules

### 11.1 Implement visible result, not only class presence

A visual requirement is not considered satisfied merely because:

- a class exists
- a blur exists
- a glow exists
- an animation exists

The result must visibly match the intended hierarchy and readability.

### 11.2 Do not fake emphasis with noisy effects

If a glow, aura, highlight, or hint effect is used:

- it must support hierarchy
- it must remain calm
- it must not become muddy, patchy, or decorative clutter
- it must not reduce readability

### 11.3 Preserve low-noise atmosphere

Avoid:

- overly obvious gradients
- harsh white patches
- excessive blur fog
- cheap-looking glow effects
- over-animated decorative motion

### 11.4 Respect scene safety

The page must remain readable and structurally stable across approved Talk scenes.

## 12. Implementation Quality Bar

This round is successful only if the result is:

- visually consistent with the locked Talk spec
- structurally implementable for later data wiring
- scoped to the current task
- honest about mock vs real
- clean enough to be reviewed without confusion

This round is not successful if:

- the page looks approximately correct but is structurally unstable
- mock behavior is presented as real runtime
- the task silently expands into product redesign
- unrelated routes or shared components are changed without need
- visual hierarchy is still unclear even though the elements technically exist

## 13. Final Delivery Report Format

At the end of the task, the implementation report should include:

1. task type
2. modified files
3. added files
4. deleted files
5. what changed in each file
6. which parts are still mock
7. whether any shared component was touched
8. whether any route or token system was touched
9. whether anything went beyond `ui-only`
10. manual verification steps
11. regression risk
12. unresolved dependencies for future data wiring

## 14. Verification

If available in the repository, run:

- `npm run build`
- `npm run lint`
- `npm run type-check`

If any verification step fails:

- report it explicitly
- do not present the task as fully complete

## 15. Final Instruction

Implement only the current Talk UI round.

Do not redesign the product.
Do not solve future phases early.
Do not treat placeholder behavior as complete runtime behavior.

Focus on:

- structural correctness
- visual correctness
- scope discipline
- reviewable output
