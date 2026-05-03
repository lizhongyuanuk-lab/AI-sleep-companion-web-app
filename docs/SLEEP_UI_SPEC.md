# Sleep Page UI / Interaction Spec

Project: AI Companion Web  
Page: Sleep  
Route: `/sleep-monitoring`  
Document type: UI / Interaction Spec  
Status: Ready for implementation in Codex

This document is the UI and interaction source of truth for the Sleep page visual result.

It defines the final visual direction, layout structure, component measurements, interaction rules, state presentation, and anti-drift constraints for the current iPhone 16 portrait version.

If this document conflicts with [docs/SLEEP_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SLEEP_SPEC.md), the non-UI product document wins.

Shared layout baseline:

- [docs/GLOBAL_MOBILE_LAYOUT_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/GLOBAL_MOBILE_LAYOUT_SPEC.md) applies by default
- Sleep is a hero-led content page with top navigation, so the shared mobile safe-area, hero-spacing, grouped-content, and bottom-action rules apply unless this spec explicitly overrides them

## 1. Page Role and Visual Intent

The Sleep page is a gentle sleep reflection page.

It should feel like:

- a calm nightly reflection
- a downstream result page after Talk
- a soft continuation of the AI sleep companion experience
- a page that helps the user understand last night and gently return to tonight's flow

It must not feel like:

- a medical sleep diagnosis page
- a clinical sleep report
- a full health analytics dashboard
- an Apple Health-style data center
- a generic chart-heavy statistics page

## 2. Reference Boundaries and Implementation Principles

### 2.1 Allowed reference borrowing

The Sleep page may borrow the following from sleep-tracking references:

- selective brightness inside chart areas
- softly glowing sleep rhythm lines
- rounded data cards
- calm night dashboard atmosphere
- a large readable sleep duration number

The Sleep page may borrow the following from the existing app UI:

- neutral adaptive glass material
- large rounded capsule navigation
- warm-white active chip style
- dark immersive background
- low-contrast premium card system
- soft hierarchy and generous spacing

### 2.2 Not allowed reference borrowing

The Sleep page must not copy:

- full feature sets from sleep tracker products
- medical sleep-stage claims
- complex sleep score dashboards
- dense health analytics layouts
- Apple Health-style clinical charts
- bright blue CTA systems
- unrelated card styles from external apps

### 2.3 Implementation principles

1. Visual reference controls expression, not feature scope.
2. Product-scope rules from `docs/SLEEP_SPEC.md` always win.
3. If a reference shows a feature that is not defined in product scope, do not implement it.
4. Any developer choice that materially changes the final visual result must be turned into an explicit UI rule.
5. Do not infer new modules, new charts, or new interactions from references.

## 3. Viewport and Responsive Baseline

### 3.1 Reference viewport

Current implementation is locked to:

- iPhone 16 Portrait
- `393 x 852px`

### 3.2 Baseline

- mobile-first
- web / PWA first
- portrait-first
- responsive expansion is not part of this revision

### 3.3 Page insets

- left: `16px`
- right: `16px`
- top: `12px + safe area`
- bottom: `12px + safe area`

### 3.4 Scroll behavior

The Sleep page is a vertical scroll page.

The first screen must prioritize:

- top controls
- date / record context
- hero insight
- main sleep summary card
- beginning or full view of the Sleep rhythm card

It must not force all modules into the first screen.

## 4. Design Tokens

### 4.1 Radius tokens

- `radius-pill: 999px`
- `radius-control: 26px`
- `radius-card-large: 30px`
- `radius-card-medium: 28px`
- `radius-panel: 24px`
- `radius-chip: 999px`
- `radius-icon-button: 999px`

### 4.2 Spacing tokens

- `space-4: 4px`
- `space-6: 6px`
- `space-8: 8px`
- `space-10: 10px`
- `space-12: 12px`
- `space-16: 16px`
- `space-18: 18px`
- `space-20: 20px`
- `space-22: 22px`
- `space-24: 24px`
- `space-28: 28px`
- `space-32: 32px`
- `space-40: 40px`
- `space-48: 48px`

### 4.3 Typography tokens

Recommended font stack:

`"Satoshi", "General Sans", "Plus Jakarta Sans", "Inter", system-ui, sans-serif`

Type scale:

- `title-page: 36px / 42px / 650`
- `title-section: 20px / 26px / 560`
- `title-card: 18px / 24px / 540`
- `hero-eyebrow: 15px / 22px / 400`
- `hero-title: 36px / 42px / 650`
- `hero-supporting: 16px / 22px / 400`
- `metric-primary: 64px / 70px / 600`
- `metric-secondary: 16px / 22px / 450`
- `body-primary: 16px / 22px / 450`
- `body-secondary: 14px / 20px / 400`
- `chip-label: 14px / 18px / 500`
- `caption: 13px / 18px / 400`

Hard rules:

- do not use overly condensed fonts
- do not use decorative sleep fonts
- do not use heavy black weights across the whole page
- main data value may be large, but surrounding text must stay calm

### 4.4 Icon tokens

- `nav-icon-size: 18px`
- `nav-icon-stroke: 2px`
- `metric-icon-size: 18px`
- `metric-icon-stroke: 2px`
- `cta-icon-size: 16px`

Hard rules:

- all icons must be single-color line icons
- no 3D icons
- no filled emoji-like icons
- no mixed icon systems

### 4.5 Motion tokens

- `motion-press: 120ms ease-out`
- `motion-card-enter: 220ms ease-out`
- `motion-chart-glow: 1800ms ease-in-out`
- `motion-page-transition: 260ms ease-out`

Motion rules:

- motion must be subtle and slow
- no bouncing chart animation
- no aggressive loading spinners
- no flashing sleep-stage transitions
- chart glow may breathe gently but must not distract

## 5. Color Tokens

### 5.1 Background tokens

- `bg-night-base: #070A16`
- `bg-night-secondary: #0C1024`
- `bg-night-indigo: #121632`
- `bg-night-glow-purple: rgba(132, 116, 255, 0.18)`
- `bg-night-glow-warm: rgba(255, 200, 148, 0.14)`
- `bg-noise-opacity: 0.025`

### 5.2 Glass shell tokens

- `shell-bg: rgba(255, 255, 255, 0.12)`
- `shell-bg-strong: rgba(255, 255, 255, 0.16)`
- `shell-bg-soft: rgba(255, 255, 255, 0.08)`
- `shell-border: rgba(255, 255, 255, 0.14)`
- `shell-border-strong: rgba(255, 255, 255, 0.20)`
- `shell-blur: 20px`
- `shell-shadow: 0 12px 36px rgba(0, 0, 0, 0.22)`

### 5.3 Text tokens

- `text-primary: rgba(255, 255, 255, 0.96)`
- `text-secondary: rgba(255, 255, 255, 0.64)`
- `text-tertiary: rgba(255, 255, 255, 0.42)`
- `text-muted: rgba(255, 255, 255, 0.32)`
- `text-warm-primary: #FFF3E6`
- `text-dark-on-chip: #5E574F`

### 5.4 Active chip tokens

- `active-chip-bg: rgba(255, 245, 235, 0.92)`
- `active-chip-bg-soft: rgba(255, 245, 235, 0.84)`
- `active-chip-text: #5E574F`
- `active-chip-icon: #5E574F`
- `active-chip-shadow: 0 0 24px rgba(255, 235, 210, 0.22)`

Hard rule:

The active nav chip and active stage chip share the warm-white chip language.

### 5.5 Chart tokens

- `chart-line-base: rgba(205, 205, 255, 0.38)`
- `chart-line-highlight: rgba(242, 238, 255, 0.96)`
- `chart-line-glow: rgba(168, 150, 255, 0.36)`
- `chart-grid-line: rgba(255, 255, 255, 0.08)`
- `chart-label: rgba(255, 255, 255, 0.46)`
- `chart-bar-base: rgba(255, 255, 255, 0.20)`
- `chart-bar-highlight: rgba(255, 245, 235, 0.82)`

## 6. Structural Skeleton

The Sleep page has five structural layers:

1. Background layer
2. Top control layer
3. Scroll content layer
4. Inline state layer
5. Modal / panel layer

Layer rules:

- background is fixed across all states
- top navigation is fixed in placement and does not scroll within the visual composition
- content cards scroll vertically
- inline hints mount inside cards
- modal / panel layer is reserved for future approved panels only

## 7. Layout Measurements

### 7.1 Page measurements

- viewport: `393 x 852px`
- content width: `361px`
- horizontal padding: `16px`
- top safe spacing: `12px + safe area`
- bottom safe spacing: `32px + safe area`

### 7.2 Top navigation

Top nav capsule:

- horizontal centered
- y = align with Memory top navigation
- size = `301 x 52px`
- radius = `999px`

### 7.3 Scroll content start

- scroll content top padding: `104px`
- record context appears at the top of the hero stack

### 7.4 Major module spacing

- hero to summary card gap: `28px`
- summary to rhythm card gap: `16px`
- rhythm to trend card gap: `16px`
- trend to suggestion card gap: `16px`
- bottom scroll padding: `32px + safe area`

### 7.5 Card measurements

- card width: `361px`
- main summary card: `361 x 220px`
- sleep rhythm card: `361 x 270px`
- trend card: `361 x 190px`
- suggestion card: `361 x 190px`
- card radius: `28px-30px`
- card padding: `22px-24px`

## 8. Top Navigation Area

### 8.1 Structure

The top area contains one control only:

- top-center navigation capsule

### 8.2 Top navigation capsule

- size: `301 x 52px`
- radius: `999px`
- background: `shell-bg`
- border: `shell-border`
- blur: `20px`
- fixed item count: `4`
- fixed order: `Talk / Room / Memory / Sleep`
- presentation: icon-only

### 8.3 Fixed icon mapping

- `Talk = chat bubble`
- `Room = armchair / room`
- `Memory = brain`
- `Sleep = crescent moon`

On the Sleep page:

- Sleep must be the active item
- the crescent moon icon must be inside the warm-white active chip
- the brain icon must never be active on the Sleep page

### 8.4 Internal nav measurements

- nav height: `52px`
- item hit area height: `40px`
- inner horizontal padding: `6px`
- item gap: `2px`
- icon size: `18px`
- icon stroke: `2px`
- active chip height: `40px`
- active chip width: `62px`
- active chip radius: `999px`

## 9. Main Content Hierarchy

Visual priority order:

1. hero insight
2. main sleep duration
3. Sleep rhythm chart
4. seven-day trend
5. tonight suggestion
6. secondary metadata

The main content must not degrade into:

- a generic list page
- a health dashboard
- a medical report
- a chat history page
- a dense analytics screen

## 10. Context and Status Labels

### 10.1 Record context line

Content example:

- `Last night · Apr 29`

Typography:

- `16px / 22px / 400`
- color: `text-secondary`

Placement:

- the context line appears above the hero eyebrow when hero content exists
- if hero content is absent, it appears as the first visible text line above the fallback card

### 10.2 Record status label

Allowed labels:

- `Estimated`
- `Partial record`
- `Companion only`
- `No sleep record yet`

Placement:

- inside the relevant card
- near the section label
- never as a large global warning

Style:

- height: `24px`
- horizontal padding: `8px`
- radius: `999px`
- font: `12px / 16px / 500`
- background: `rgba(255,255,255,0.08)`
- color: `text-tertiary`

## 11. Hero Insight

Purpose:

- give emotional meaning before numbers
- communicate recent pattern
- stay non-clinical
- continue the companion experience

Example structure:

`From the last 7 nights`

`Lately, your nights`
`have been asking for`
`a gentler pace.`

`Shorter check-ins seemed to help.`

Layout:

- no full card behind the hero
- use only a subtle radial glow behind text
- glow must not reduce legibility

Suggested glow:

```css
radial-gradient(
  circle at 45% 55%,
  rgba(255, 210, 170, 0.14),
  rgba(132, 116, 255, 0.10) 35%,
  transparent 70%
)
```

Hard rules:

- do not put the hero inside a heavy glass card
- do not make the insight sound diagnostic
- do not make the area look like a marketing landing-page hero

## 12. Sleep Summary Card

Purpose:

- answer `How did last night go?`

Material:

- background: `shell-bg-strong`
- border: `1px solid shell-border-strong`
- blur: `20px`
- shadow: `shell-shadow`

Required content:

- section label: `Last night`
- primary metric: `7h 24m`
- metric label: `Estimated sleep`
- detail row 1: `Fell asleep - 12:42 AM`
- detail row 2: `Woke up - 8:06 AM`
- detail row 3: `Quiet time - 6h 50m`

Type rules:

- primary metric is the strongest data focal point
- primary metric: `64px / 70px / 600`
- metric color: `text-warm-primary`
- detail rows stay calm and secondary

Prohibitions:

- no sleep quality score
- no red / green judgments
- no more than three detail rows
- no medical terminology

## 13. Sleep Rhythm Card

Purpose:

- show a soft visual sense of the night pattern
- stay reflective, not clinical

Title:

- default title: `Sleep rhythm`
- do not use `Sleep stages` by default

Material:

- background: `shell-bg-strong`
- border: `1px solid shell-border`
- blur: `20px`
- shadow: `shell-shadow`

Chart rules:

- chart height: `110px-130px`
- line width: `2px`
- curve smoothing: enabled
- soft line glow only
- two to three subtle horizontal guide lines maximum
- no vertical axis
- no dense grid
- at most four time labels

Hard rules:

- no ECG-like rhythm
- no sharp medical monitor look
- no excessive neon glow
- no high-frequency jitter

### 13.1 Stage chips

Chips:

- `Awake`
- `Light`
- `Deep`
- `Dream`

Placement:

- bottom of rhythm card
- height: `36px`
- gap: `10px`

Inactive chip:

- background: `rgba(255,255,255,0.08)`
- text: `text-tertiary`
- dot: `rgba(170,160,255,0.70)`

Active chip:

- background: `active-chip-bg`
- text: `active-chip-text`
- dot: `rgba(115, 100, 220, 0.9)`
- shadow: `active-chip-shadow`

Interpretation rule:

- chips are visual rhythm filters only in the current version
- they must not imply verified medical sleep stages

Interaction rule:

- chip tap may switch the active visual filter inside the same card
- rhythm-card body tap is a no-op in the current version
- no detail page, drawer, or drill-down opens from the card

## 14. Last 7 Nights Trend Card

Purpose:

- show a lightweight recent pattern without turning the page into analytics

Content example:

- `Last 7 nights`
- `You settled faster on 4 of the last 7 nights.`

Chart:

- type: soft rounded bar chart
- bar count: `7`
- bar width: `18px-22px`
- bar radius: `999px`
- bar height range: `36px-96px`
- bar gap: `18px-20px`

Rules:

- no axes
- no grid
- no legend
- day labels are allowed
- current or best night may be brighter
- chart must stay soft and low-noise

## 15. Companion Insight / Tonight CTA Card

Purpose:

- lead the user back into tonight's sleep flow

Allowed CTA labels:

- `Start tonight`
- `Use Rain Room Tonight`
- `Continue with Quiet Company`
- `Enter Rain Room`

CTA style:

- height: `48px`
- width: full card width
- horizontal padding: `18px`
- radius: `24px`
- border: `1px solid rgba(255,255,255,0.10)`
- background: `rgba(255,255,255,0.06)`
- text color: `#F3EEE7`
- font: `16px / 1.2 / 500`
- no icon is required in the current version

Interaction:

- default state remains dark and restrained
- hover / focus may lift slightly and switch to a warm-white filled state
- press state = `scale(0.985)`
- release navigates

Routing rule:

- CTA routes to Room or Talk based on approved payload
- if the payload is absent or invalid, route to `/room`

Hard rules:

- no generic blue or purple CTA buttons
- no heavy gradient buttons
- no multiple competing primary CTAs
- do not make the CTA look like an upsell
- keep the CTA in the same visual family as Memory bottom action buttons

## 16. Single-Mode Shell Rules

This version uses one fixed visual mode:

- single dark-night mode
- no light mode
- no runtime recoloring
- no background-image color extraction
- no dynamic shell switching

State changes may change:

- copy
- labels
- chart data
- skeleton opacity
- partial-record indicators

State changes must not change:

- page skeleton
- top navigation layout
- card family
- radius system
- CTA style
- shell material system
- dark-night background direction

## 17. State Presentation Rules

### 17.1 `full_record`

- all default modules visible
- no fallback labels required

### 17.2 `partial_record`

- title, hero, partial summary, and suggestion remain visible
- rhythm shows only if supported
- exact unavailable values are omitted
- use subtle inline `Partial record` labels

### 17.3 `companion_only`

- title, hero, companion summary copy, and suggestion visible
- companion-session duration is the primary metric
- duration and unsupported charts hidden
- suggestion card remains the path back into tonight

### 17.4 `empty_state`

- title visible
- one calm empty-state card replaces summary / rhythm / trend
- one `Start tonight` style CTA remains

### 17.5 `loading`

- top nav stays visible
- skeleton cards match final layout blocks
- no aggressive spinners

### 17.6 `error_state`

- top nav stays visible
- one inline fallback card replaces broken data cards
- calm retry and/or continue CTA only
- no global red alert banner

## 18. Inline Hint and Error Mounting

Inline hints must appear inside the module they refer to.

Examples:

- partial sleep data -> inside summary card
- rhythm unavailable -> inside rhythm card
- no records -> inside empty-state card

Hint style:

- height: `24px-28px`
- radius: `999px`
- horizontal padding: `8px-10px`
- background: `rgba(255,255,255,0.08)`
- text: `text-tertiary`
- font: `12px / 16px / 500`

Error style:

- background: `rgba(255, 235, 225, 0.10)`
- border: `rgba(255, 220, 210, 0.16)`
- text: `rgba(255, 220, 210, 0.72)`

Hard rules:

- no full-screen error unless the page cannot render at all
- no technical error strings
- no harsh failure language

## 19. Content Overflow Rules

To prevent implementation drift across real copy and localization:

- record context should remain a single calm line when possible
- hero title may wrap to three or four lines on the reference width
- summary metric must remain on one line
- long detail-row values should truncate from the middle or end only if necessary
- CTA label should remain on one line
- chips should not wrap; if space is constrained, use horizontal scrolling inside the chip row

The page must preserve card heights and visual rhythm under realistic copy variance.

## 20. Strict Prohibitions

The implementation must not:

- turn Sleep into a generic analytics dashboard
- turn Sleep into a clinical sleep report
- use unsupported sleep-stage claims
- use `Sleep stages` as the default title
- show dense axes, legends, or chart grids
- use generic blue CTA buttons
- use a different shell system from Talk, Room, or Memory
- make the brain icon active on the Sleep page
- add chat bubbles
- add a bottom message input
- add the Talk mic / image dock
- add modules not defined by product scope
- use harsh red error states
- judge user sleep as `bad` or `poor`
- dynamically recolor UI from background content

## 21. Developer Alignment Checklist

Before implementation, confirm:

- page uses the iPhone 16 portrait baseline: `393 x 852px`
- page is vertically scrollable
- top nav capsule is `301 x 52px`, horizontally centered
- nav order is `Talk / Room / Memory / Sleep`
- Sleep crescent moon icon is active
- brain icon is not active
- hero insight appears before data cards
- main summary card width is `361px`
- main duration is the strongest data focal point
- `Sleep rhythm` is the default rhythm title
- chart is soft, low-noise, and non-clinical
- active nav and active chip share the same warm-white chip language
- CTA matches the Memory bottom action-button language
- no bottom chat dock appears on Sleep
- no generic dashboard styling is introduced
- full, partial, companion-only, empty, loading, and error states are supported
- error and hint copy is mounted inline
- CTA routes back into Room or Talk

## 22. Acceptance Criteria

The implementation passes only if:

- the first impression is calm, dark, premium, and sleep-focused
- the page visually belongs to the same product as Talk, Room, and Memory
- the top navigation uses the correct icon mapping
- Sleep is active with the crescent moon icon
- the hero insight is visible before the data cards
- the user can understand last night's result quickly
- the main sleep duration is visually dominant when present
- the rhythm chart feels soft and reflective, not clinical
- the page does not imply unsupported medical precision
- the CTA matches the Memory action-button styling while staying in the same dark shell family
- the page scrolls naturally and does not cram all modules into one screen
- partial and empty states remain calm and useful
- no visual component feels disconnected from the shared shell family
- no implementation introduces chat, mic dock, or IM-style elements
- the page provides a clear route back to tonight's companion flow

## 23. Future Patch Boundary

The current version locks Sleep into the single-mode dark-night glass-shell direction.

The following require explicit future patches:

- responsive layout expansion
- true light mode
- wearable integration
- verified sleep-stage analysis
- advanced historical trends
- detailed chart drill-down
- sticky bottom CTA
- additional recommendation modules
