# Memory UI / Interaction Spec

## 1. Document Positioning

This document defines the final UI and interaction behavior for the Memory page.

It exists to prevent implementation drift and to ensure the page is built as a calm reflective reading page rather than a dashboard, management panel, or generic card layout.

Priority order for implementation:

1. PRD
2. main non-UI product spec
3. this UI / Interaction Spec
4. visual references

If any visual reference conflicts with the PRD or this spec, the PRD and this spec win.

## 2. Reference Boundaries and Implementation Principles

### 2.1 What may be borrowed from references

The following may be borrowed from external references:

- editorial text hierarchy
- strong text emphasis
- calm reflective pacing
- subtle atmospheric dark backgrounds
- light container grouping

### 2.2 What may not be borrowed

The following must not be borrowed:

- dramatic poster-style backgrounds
- highly saturated visual storytelling backgrounds
- dashboard-like data card systems
- heavy decorative graphics competing with reading
- annual-report / recap theatrics

### 2.3 Implementation principle

The Memory page must feel:

- calm
- reduced
- edited
- readable
- emotionally aware

It must not feel:

- analytical dashboard
- settings page
- management console
- content feed
- long-form journaling page

### 2.4 Anti-improvisation rule

If a detail is defined here, it must be implemented directly.

Do not reinterpret `light`, `short`, `gentle`, or `clear` as vague aesthetic freedom.

Where this spec defines structural, visual, or length constraints, those constraints are hard requirements.

## 3. Page Design Goals

### 3.1 Intended final outcome

The page should feel like a quiet, edited reflection of what has stayed with the user lately.

Users should immediately understand:

- one main insight
- a few repeated themes
- a small set of equal-weight action options

### 3.2 First visual priority

The first visual priority is the Hero Insight sentence.

### 3.3 First comprehension priority

The user should first understand:

- what the main insight is

Then:

- what recurring themes appeared

Then:

- what they can optionally do next

### 3.4 Main visual principle

Text is the primary actor.

Containers and background exist only to support reading.

## 4. Reference Viewport and Responsive Baseline

### 4.1 Reference viewport

Use a mobile-first reference viewport:

- `393 x 852 pt`

### 4.2 Baseline

- portrait mobile first
- web / PWA implementation
- responsive scaling allowed

### 4.3 Structural invariants across viewport sizes

The following must not change structurally:

- section order
- hero insight hierarchy
- recurring themes grouping logic
- equal-weight action row
- overall calm reading rhythm

### 4.4 What may adapt

The following may adapt responsively:

- horizontal padding
- card width
- line breaks
- action layout wrapping if necessary

## 5. Design Tokens

### 5.1 Corner Radius Tokens

- `radius-page-pill = 999`
- `radius-large-panel = 28`
- `radius-item-panel = 24`
- `radius-small-pill = 16`

### 5.2 Spacing Tokens

- `space-4 = 4`
- `space-8 = 8`
- `space-12 = 12`
- `space-16 = 16`
- `space-20 = 20`
- `space-24 = 24`
- `space-32 = 32`
- `space-40 = 40`
- `space-48 = 48`

### 5.3 Typography Tokens

Page Title

- `type-page-title-size = 48`
- `type-page-title-weight = 600`
- `type-page-title-line = 1.04`

Hero Insight

- `type-hero-size = 36`
- `type-hero-weight = 600`
- `type-hero-line = 1.22`

Support

- `type-support-size = 19`
- `type-support-weight = 400`
- `type-support-line = 1.5`

Section Title

- `type-section-size = 26`
- `type-section-weight = 600`
- `type-section-line = 1.24`

Theme Title

- `type-theme-size = 26`
- `type-theme-weight = 500`
- `type-theme-line = 1.32`

Theme Support

- `type-theme-support-size = 18`
- `type-theme-support-weight = 400`
- `type-theme-support-line = 1.5`

Metadata / Label

- `type-meta-size = 14`
- `type-meta-weight = 400`
- `type-meta-line = 1.4`

### 5.4 Icon Tokens

- inline helper icon size: `16`
- action icon size: `18`
- no oversized decorative icons in text sections

### 5.5 Motion Tokens

- `motion-fast = 160ms`
- `motion-base = 220ms`
- `motion-slow = 280ms`
- easing: `ease-out`
- no dramatic bounce
- no theatrical movement

## 6. Color Tokens

### 6.1 Dark Base Tokens

Background

- `bg-base = #141517`
- `bg-surface-soft = rgba(255,255,255,0.05)`
- `bg-surface-item = rgba(255,255,255,0.07)`

Stroke

- `stroke-soft = rgba(255,255,255,0.08)`
- `stroke-item = rgba(255,255,255,0.10)`

Text

- `text-primary = #F3EEE7`
- `text-secondary = rgba(243,238,231,0.76)`
- `text-tertiary = rgba(243,238,231,0.52)`

Subtle atmospheric haze

Allowed supporting hues:

- `haze-plum = rgba(101,73,115,0.10)`
- `haze-navy = rgba(63,79,112,0.08)`
- `haze-warm = rgba(102,72,62,0.06)`

Action surfaces

- `action-fill = rgba(255,255,255,0.06)`
- `action-stroke = rgba(255,255,255,0.10)`

### 6.2 Color Mapping Rules

- Page background uses `bg-base`
- Hero panel uses `bg-surface-soft`
- Theme items use `bg-surface-item`
- Strokes must use soft white strokes only
- Page title, hero insight, and theme titles use `text-primary`
- Support text uses `text-secondary`
- Metadata and labels use `text-tertiary`

Important:

Do not introduce accent colors for emphasis in the Memory page text hierarchy.

Text hierarchy must be created through size, weight, spacing, and contrast only.

## 7. Page Structural Skeleton

The page consists of exactly four major sections in this order:

1. Header
2. Hero Insight
3. Recurring Themes
4. Take Action

Fixed vs scrollable:

- top app nav is fixed according to global app rules
- Memory content scrolls vertically
- no floating secondary CTA inside the content area

Structural layers:

- Layer 1 - Background
- Layer 2 - Reading Structure
- Layer 3 - Text + Actions

Layer 1 - Background

- deep dark neutral base
- optional very subtle atmospheric haze
- background remains visually weaker than all main text

Layer 2 - Reading Structure

- section containers
- hero panel
- recurring grouping
- item panels

Layer 3 - Text + Actions

- all readable content
- action row

Invariant structure:

Do not add extra sections between these four sections unless explicitly approved in the PRD.

## 8. Layout Measurements

### 8.1 Page Padding

- horizontal page padding: `24`
- top content padding below global nav: `28`
- bottom content padding: `40`

### 8.2 Header Spacing

- title to subtitle: `12`
- subtitle to hero section: `28`

### 8.3 Section Spacing

- hero section to recurring themes: `32`
- recurring themes title to first item: `16`
- recurring themes to take action: `32`

### 8.4 Hero Panel

- internal padding: `24`
- radius: `28`
- min height: no forced height
- width: full available content width
- max readable text width inside hero sentence: do not let text span too wide; keep comfortable reading width

### 8.5 Theme Item Panel

- internal padding: `20`
- radius: `24`
- vertical gap between theme items: `12`

### 8.6 Tap Targets

- all action buttons: min height `48`
- all inline `show more` style controls if added later: min height `32`

## 9. Top Navigation Area Spec

The Memory page uses the shared top app navigation system defined by the global app spec.

Rules:

- do not redesign the top nav specifically for Memory
- keep global nav layout unchanged
- Memory content must begin below the global nav with sufficient breathing room

## 10. Main Content Area Spec

### 10.1 Content hierarchy

The page must read in this order:

1. Memory
2. Hero Insight
3. Recurring Themes
4. Take Action

### 10.2 First-screen density

The first screen must not feel crowded.

It should contain:

- header
- hero insight
- beginning of recurring themes

### 10.3 Whitespace priority

Whitespace is a primary structural tool.

Use spacing to separate:

- page identity
- emotional insight
- grouped recurring patterns
- actions

### 10.4 Anti-drift rule

The page must not degrade into:

- a dense card stack
- a dashboard summary panel
- a journaling feed
- a settings menu

## 11. Core Text and Panel Spec

### 11.1 Header

Page Title

- text: `Memory`
- size: `48`
- weight: `600`
- strongest structural title on page

Subtitle

- max `1` line
- use support style
- must remain atmospheric, not explanatory

### 11.2 Hero Insight Section

Structure

The Hero Insight block contains exactly:

- time label
- hero insight sentence
- one support sentence

No additional paragraph is allowed by default.

Time Label

- style: metadata / label
- max `1` line
- example: `From the last 7 nights`

Hero Insight Sentence

- max `2` lines preferred, `3` lines maximum only if unavoidable
- max `90` English characters
- must be one reflective sentence
- no multi-sentence output
- no analysis paragraph

Support Sentence

- max `2` lines
- max `70` English characters
- one interpretive sentence only
- not a second main statement

Hero Panel Visual

- fill: `bg-surface-soft`
- stroke: optional `stroke-soft`
- shadow: none or extremely subtle
- no heavy card effect
- no text backplate
- no glow layer behind text

### 11.3 Recurring Themes Section

Section Title

- example: `Things that came up more than once`
- style: section title

Section Description

- optional
- max `1` line
- must remain lightweight

Outer Grouping

- may exist
- must remain lighter than the theme items
- should feel like grouping, not a big dashboard card

### 11.4 Theme Item

Each item contains exactly:

- theme title
- one support sentence
- one inline metadata line

Theme Title

- max `2` lines
- strongest text inside the item
- style: theme title

Theme Support

- max `2` lines
- style: theme support

Metadata

- exactly `1` line
- format only: `This week · 3 sessions`
- do not split into multiple pills or detached labels

Theme Item Visual

- fill: `bg-surface-item`
- stroke: `stroke-item`
- no strong shadow
- no dashboard-card heaviness
- content must remain visually stronger than the container

## 12. Media / Image / Audio / Attachment Spec

The Memory page does not use media cards, image blocks, audio strips, or attachment modules by default.

Prohibition:

- do not add decorative media panels
- do not insert image-led cards
- do not add visual-only atmospheric media modules into the reading flow

## 13. Primary Action Area / Bottom Action Spec

The final section is Take Action.

### 13.1 Structure

- exactly `3` actions
- presented as peer options

### 13.2 Relationship

All three actions are equal-weight options.

### 13.3 Visual Rules

All `3` actions must share the same:

- height
- radius
- fill
- stroke
- text size
- text weight
- shadow
- pressed / hover state

### 13.4 Forbidden

- no primary CTA
- no first button emphasis
- no one-filled-two-outlined treatment
- no explanatory subtext under action labels

### 13.5 Layout

- mobile default: vertical stack or equally weighted wrap, depending on copy length
- maintain equal visual weight in all responsive states

## 14. Dual-Mode Rules

Dark mode

This page is currently designed for dark mode and dark atmospheric context.

Background behavior

- avoid pure black
- use deep neutral dark base
- allow extremely subtle color haze only

Constraint

The background must remain weaker than the hero insight and all primary text.

No skeleton change

Any future light-mode adaptation may change skin only.

It must not change page structure, hierarchy, or section order.

## 15. State Visibility Matrix

State: `page_loaded`

Visible:

- header
- hero insight
- recurring themes
- take action

Hidden:

- no extra expanded explanation layers

Clickable:

- action buttons
- item-level controls if later defined

State: `idle`

Visible:

- all default content
- no overlays
- no expanded hidden paragraphs

State: `loading`

Visible:

- page shell
- placeholder layout matching final hierarchy

Rules:

- loading state must preserve hero > section > item hierarchy
- do not use generic skeleton cards that feel heavier than final panels

State: `error`

Visible:

- page shell
- short inline error copy

Rules:

- keep tone calm
- do not collapse page into a harsh error screen

State: `action_pressed`

Visible:

- equal pressed feedback across all three actions

Rules:

- no action may visually become `primary` on idle state
- pressed state may temporarily darken / brighten equally

## 16. Interaction Flow Spec

Entry

- user enters Memory page
- page loads header, hero insight, recurring themes, actions
- user first reads hero insight

Reading flow

- user scrolls
- recurring themes appear as light grouped content
- take action appears at end

Action flow

- user taps one of the `3` actions
- page responds according to action definition in PRD
- all three remain equal-weight options before tap

Error recovery

- if content generation fails
- show short calm fallback copy
- keep layout intact
- do not replace page with generic error module

## 17. Inline State / Error / Hint Copy Mounting Rules

Hero section

No helper paragraph beyond the single support sentence.

Recurring themes

No extra explanatory block above the item list unless explicitly defined.

Error copy

- mount inside the relevant section
- use support-text styling
- keep to one short line when possible

Hint copy

- must remain lightweight
- must not add new reading layers

## 18. PRD -> UI Mapping Addendum

`This page is not a dashboard`

- do not implement as large heavy cards or KPI panels

`This page should feel reflective`

- prioritize hero sentence and readable pacing

`Users should feel remembered`

- ensure one clear main insight is immediately visible

`Text should not become long AI output`

- hard-limit copy length at every level

`Cards should not overpower the text`

- use light container treatment and strong text hierarchy

`Actions are suggestions, not a funnel`

- `3` take-action options must remain visually equal

`No text background plate`

- typography and spacing must create emphasis without added text backplates

## 19. Strict Prohibitions

Do not turn the page into a dashboard card grid.
Do not use heavy, thick, high-contrast cards.
Do not add long explanatory paragraphs by default.
Do not generate more than one support sentence in the hero section.
Do not split metadata into multiple visual chips.
Do not add glow plates, haze blocks, or blurred backplates behind text.
Do not use strong poster-style background effects.
Do not let section grouping become visually stronger than item panels.
Do not let item panels become visually stronger than the hero insight.
Do not make action buttons hierarchical.
Do not use `Hide` as a strong management-style CTA.
Do not introduce decorative media blocks into the Memory reading flow.

## 20. Developer Alignment Checklist

Before implementation is considered complete, confirm:

- The page contains exactly `4` major sections in the correct order.
- The hero insight block contains exactly `3` text roles.
- No extra explanatory paragraph was added under the hero insight.
- Theme items contain only title, one support line, and one inline metadata line.
- Metadata is inline, not fragmented into chips.
- The background remains subdued and non-dominant.
- No text backplate exists behind hero or support text.
- Container hierarchy is lighter than text hierarchy.
- All `3` action options are visually equal.
- No unintended dashboard-like modules were introduced.

## 21. Acceptance Criteria

The implementation passes only if all of the following are true:

- The first thing users notice is the hero insight sentence.
- The hero insight sentence is visually stronger than section titles and theme titles.
- The page does not contain long AI-style explanatory text.
- The hero section contains only one label, one hero sentence, and one support sentence.
- Theme items contain only one title, one support line, and one inline metadata line.
- Metadata appears in single-line inline form only.
- No extra text background layer exists behind the insight text.
- Cards remain visually softer than the text they contain.
- The recurring themes area reads as grouped content, not as a dashboard.
- All `3` action options are equal-weight and non-hierarchical.
- The background atmosphere does not compete with the reading content.
- The page feels edited, reduced, and calm.
