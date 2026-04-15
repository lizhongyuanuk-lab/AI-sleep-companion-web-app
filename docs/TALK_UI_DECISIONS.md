# TALK_UI_DECISIONS

## Purpose

This document records the currently approved UI decisions for `/talk` and its
paired `/room` scene-selection flow.

It is intentionally narrower than `docs/SPEC.md`.

Use this file for:
- approved visual-direction decisions
- approved interaction-shape decisions
- implementation defaults that were explicitly confirmed

Do not use this file to override locked product rules in `docs/SPEC.md`.

---

## Relationship To SPEC

`docs/SPEC.md` remains the main product rule source.

This file only captures decisions that refine implementation direction without
changing the V1.1 product structure.

If a decision in this file conflicts with `docs/SPEC.md`, update the spec first
or do not apply the conflicting decision.

---

## Confirmed Decisions

### 1. Top Navigation Labels

Approved display labels:
- `Talk`
- `Room`
- `Memory`
- `Sleep`

Rules:
- these 4 items remain equal-weight navigation items
- do not create visual hierarchy between the 4 labels
- keep the route path as `/sleep-monitoring`
- only the display label changes to `Sleep`

### 2. Talk Main Visual

`/talk` should use a full-screen background image as the primary scene surface.

Rules:
- the background should fill the viewport
- the image should feel immersive, spacious, and quiet
- the crop should prioritize preserving the room structure
- do not fall back to a code-drawn room shell as the intended final direction

### 3. Approved Scene Assets

The current V1 scene set is fixed to these 4 backgrounds:
- `seaside_day`
- `seaside_night`
- `rainforest_day`
- `snow_mountain_day`

Rules:
- these are the approved V1 background assets
- default scene remains `seaside_day`
- scene ids should stay stable across `/room` and `/talk`

### 4. Atmospheric Foreground Treatment

Light atmospheric treatment is allowed above the background image.

Allowed examples:
- subtle vignette
- light mist
- soft glow
- gentle lower-screen haze

Rules:
- these layers must stay secondary to the background image
- they should support atmosphere, not become independent UI surfaces
- do not reintroduce a card-like room frame in the middle of the screen

### 5. Motion Direction

Light motion is allowed.

Allowed examples:
- subtle background pan
- restrained hover feedback
- restrained pressed-state feedback
- light listening-state glow

Rules:
- motion must remain calm and low-amplitude
- do not use strong floating motion, heavy pulse, or attention-seeking effects
- motion should increase product polish, not increase stimulation

### 6. Talk Input Bar

The current approved implementation direction is:
- speak-first
- real single-line input shell structure
- no real backend submission yet in this phase

Typing-state rules:
- typing state should show a real single-line input field
- microphone becomes secondary in typing state
- image button remains in place

### 7. Room Page Direction

`/room` should act as a scene picker with stronger atmosphere than a plain list.

Interaction model:
- vertical scene browsing
- one dominant scene at a time
- upward/downward browsing between scenes
- tapping the selected scene navigates to `/talk`
- the tapped scene becomes the active Talk background

Reference interpretation:
- this uses a TikTok-like single-focus vertical browsing logic
- it should not copy TikTok's visual noise or aggressive motion style

### 8. Product-Shape Boundaries

The current direction is intentionally closer to Replika in polish and
immersion, but not in full product shape.

Confirmed boundaries:
- no avatar or character presence in the current phase
- no full message history on `/talk`
- no dashboard-like overlay stack
- no second theme system beyond the adaptive overlay model

---

## Implementation Defaults

Unless changed later, treat these as defaults:
- `/talk` remains the first route to bring closest to production polish
- `/room` may be updated in the same iteration when required for scene-flow
  completion
- state-shell behavior may remain local-only during UI implementation phases
- restrained motion is preferred over static deadness, but clarity is preferred
  over motion

---

## What To Review During UI Work

When implementing or revising `/talk` or `/room`, check:
- does the background still feel like the primary focal center?
- are the 4 top-nav items still equal in hierarchy?
- does the page still feel sparse and emotionally contained?
- does typing state look like a real input state rather than a placeholder?
- does `/room` feel like a scene picker rather than a utility list?
- are motion and atmosphere still restrained?

---

## Change Policy

Add to this file when:
- a UI decision has been explicitly approved
- the decision helps implementation but does not belong in the locked spec

Do not add to this file when:
- the change alters information architecture
- the change alters route structure
- the change alters page responsibilities
- the change conflicts with `docs/SPEC.md`
