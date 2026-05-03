# Global Mobile Visual Baseline

Version: v2.0  
Scope: Shared cross-page visual baseline for `/`, `/talk`, `/room`, `/memory`, and `/sleep-monitoring` unless a page-level UI spec explicitly overrides it.

## 1. Document Role

This document defines the shared mobile visual baseline for the current app.

It exists to prevent the product from splitting into separate visual systems page by page.

This document is the shared baseline for:

- page atmosphere
- shell family
- typography relationships
- glass treatment
- chip language
- button language
- informational block language
- safe-area and spacing rules

This is not a blind override.

Page-specific UI specs may override the shared baseline only when the page type explicitly requires it, and that override must be stated locally.

## 2. Reference Anchors

The current baseline should be derived primarily from the strongest completed surfaces in the repo:

1. `/` first-launch / onboarding
2. `/talk`

Interpretation:

- `/` contributes the hero-led, low-stimulation, editorial emotional layer
- `/talk` contributes the stable shell family, top chrome language, and warm translucent control language

Secondary references:

- `/room` may contribute immersive scene-page constraints
- `/memory` may contribute reading-first density decisions
- `/sleep-monitoring` may contribute insight-card hierarchy once aligned

Rule:

- future pages should feel like descendants of the same family as `/` and `/talk`
- they do not need identical layouts
- they must not feel like separate products

## 3. Core Product Feel

All core pages should read as one brand with one emotional temperature.

Required shared qualities:

- low stimulation
- mobile-first
- calm, evening-appropriate atmosphere
- soft depth instead of hard contrast
- warm translucent shell language
- no corporate dashboard feeling
- no traditional IM product feeling

Allowed variation by page type:

- `/` may feel more editorial and intro-like
- `/talk` may feel more operational and anchored
- `/memory` may feel more reflective and reading-first
- `/sleep-monitoring` may feel more insight-led and data-soft

Not allowed:

- one page using a cold product dashboard system while another uses warm atmospheric glass
- one page using bold app chrome while another removes all system language
- random per-page font worlds

## 4. Single-Mode Color Direction

The app should use one shared dark-night / warm-glass direction by default.

Shared baseline:

- background foundation: deep blue-night to charcoal gradient
- warm cream / warm-white foreground for primary text
- softened parchment / mist gray for secondary text
- translucent white glass for shell surfaces
- warm beige active or primary action fill where emphasis is needed

Cross-page rule:

- do not create a separate light product mode for Memory or Sleep
- do not shift pages into unrelated purple, neon, or clinical blue systems
- do not adapt page mode dynamically from image brightness

Approximate shared token family:

- `bg-night-top`: desaturated deep blue
- `bg-night-bottom`: charcoal navy
- `text-primary`: warm off-white
- `text-secondary`: softened warm gray
- `shell-bg`: translucent white
- `shell-border`: soft warm-white line
- `shell-shadow`: low-contrast diffuse shadow
- `action-warm`: soft beige / warm sand

## 5. Background Rules

### 5.1 Shared direction

Backgrounds may vary by page, but all must stay within the same atmospheric family.

Allowed:

- deep blue-night gradients
- subtle radial glows
- blurred warm or cool atmospheric blooms
- full-bleed room imagery
- soft scrims for readability

Not allowed:

- flat pure black panels
- clinical graph-paper or dashboard grids
- colorful marketing gradients
- high-energy motion backgrounds

### 5.2 Page-specific behavior

- `/` may use abstract atmospheric gradient backgrounds
- `/talk` and `/room` may use full-bleed room imagery
- `/memory` and `/sleep-monitoring` may use dark atmospheric backgrounds, but should still feel derived from the same night shell

## 6. Typography Baseline

### 6.1 Family relationship

The baseline type pairing is:

- expressive serif for hero or emotionally-led headings
- clean sans for body, controls, chips, labels, and metadata

Reference interpretation:

- `/` hero should remain the clearest serif-led emotional surface
- `/talk` should remain the clearest sans-led functional shell surface

Rule:

- serif is for emotional emphasis, not everywhere
- sans is the structural default
- pages must not invent unrelated decorative type families

### 6.2 Hierarchy behavior

- hero headline: highest emotional weight, serif allowed
- section / card headline: medium-high weight, can be sans or restrained serif depending on page role
- support copy: compact, low-pressure, readable
- metadata / kicker / helper text: smaller, lower contrast, no attention grabbing

### 6.3 Density rule

Across pages:

- avoid long explanatory paragraphs at large sizes
- keep line lengths narrow on mobile
- prefer short sentences and soft wrapping
- supporting copy must stay visually lighter than the main statement

## 7. Shared Shell Family

This is the most important cross-page rule.

Any persistent UI chrome should belong to one shell family.

This includes when applicable:

- top navigation capsule
- settings button
- bottom dock
- floating settings panels
- low-priority chips
- supporting info surfaces

Shared shell traits:

- translucent white / warm-white glass
- soft blur
- soft border
- large rounded geometry
- low-noise shadow
- restrained contrast

Not allowed:

- one page using hard dark solid cards while another uses soft translucent glass
- one page using glossy high-contrast controls while another uses whisper-light shells

### 7.1 Intro chrome exception

Some pages do not have top navigation but still need light top chrome.

Examples:

- `/` first-launch / onboarding

Allowed intro chrome pattern:

- one left anchoring context chip
- one right anchoring status chip
- both belong to the same shell family as the rest of the product
- both should feel lighter than navigation chrome

Rules:

- intro chips must not overpower the hero
- intro chips must remain clearly secondary to the page headline
- intro chips may use the same border / blur / radius logic as nav shells, but at lower visual weight

## 8. Card Families

There are only three shared card weights allowed by default.

### 8.1 Primary emotional card

Use for:

- onboarding step cards
- major hero-adjacent content blocks
- main insight surfaces

Traits:

- strongest local contrast on the page after main CTA
- still soft and atmospheric
- rounded large radius
- glass or dark-glass shell
- readable but not heavy

### 8.2 Secondary reading card

Use for:

- memory entries
- sleep summary or insight cards
- supporting content groups

Traits:

- lighter than the primary card
- less blur or less contrast than a hero card if needed
- designed for calm reading, not action emphasis

### 8.3 Tertiary informational block

Use for:

- helper guidance
- grouped explanatory notes
- contextual copy under a result or insight

Traits:

- should read as one grouped info area
- should never look like a segmented control
- should never look like option chips
- lower contrast than its parent card
- smaller text
- softer border
- minimal visual weight

This tertiary block is the baseline to use for the refined onboarding result guidance pattern.

### 8.4 Intro step card

Use for:

- onboarding question card
- onboarding result card
- create-room entry card
- room-generation preview card when shown as a single focused card

Traits:

- should feel like the main grounded surface beneath the hero
- should not read as a bottom sheet detached from the page
- should sit visually inside the same atmosphere as the hero, not below it
- should carry the strongest page-local structure after the hero and primary CTA
- should preserve the same shell family as the rest of the app, but with more body than a chip or floating control

### 8.5 Option card

Use for:

- onboarding answer cards
- fixed visual theme selection cards

Traits:

- full-width or near-full-width
- calm rounded shell
- no aggressive hover or selected glow
- selected state should feel warmer and more grounded, not brighter or louder
- must not look like app settings rows or chat bubbles

## 9. Chip Language

All chips across pages should feel related.

Shared rules:

- pill or near-pill geometry
- soft border
- low-noise fill
- small type
- quiet contrast

Chip categories:

- neutral chrome chip: page mode / shell label / inactive status
- active warm chip: selected nav, selected state, or soft emphasis
- metadata chip: room labels, ambience labels, small tags

Not allowed:

- bright product tags
- outlined pills that read like hard filters unless the page truly has filter behavior

### 9.1 Onboarding chip mapping

For `/` onboarding specifically:

- left chip = context / flow chip
- right chip = session or auth state chip

These chips should:

- share the same material family
- use lower contrast than the hero
- align to the same top band
- feel like light framing devices, not controls asking for action

## 10. Button Language

### 10.1 Primary button

Shared primary CTA direction:

- warm beige / parchment fill
- dark text
- large radius
- stable, calm weight
- no aggressive glow
- no game-like saturation

### 10.2 Secondary button

Shared secondary CTA direction:

- translucent shell treatment
- quiet border
- same radius family as primary
- clearly less visual pull than the primary CTA

### 10.3 Ghost button

Use for:

- back
- dismiss
- optional low-priority exits

Rule:

- text-led
- low contrast
- no chip-like filled treatment unless a page spec explicitly needs it

## 11. Informational Block Language

This is a dedicated cross-page pattern because current drift is most visible here.

Use this pattern when a page needs explanatory support that is:

- not actionable
- not selectable
- not a list of options
- not a card stack

Required traits:

- one unified container
- vertically stacked lines or paragraphs
- left-aligned copy
- smaller type than the main section statement
- lower contrast than the main section statement
- comfortable padding
- `12–16px` vertical gap between grouped lines
- optional ultra-soft divider only

Forbidden traits:

- two separate rounded boxes
- two independent bordered pills
- option-chip appearance
- segmented-control appearance
- hover / selected styling

## 12. Progress Bridge Language

This is a shared baseline for light progress systems used in onboarding or step-based flows.

Use for:

- onboarding progress strips
- lightweight step awareness where percentage UI would feel too heavy

Required traits:

- low-height track
- low visual contrast
- must read as page rhythm, not analytics
- should sit between the hero and the current step card
- should visually bridge those two layers instead of floating alone

Spacing rule:

- hero support -> progress may be compact
- progress -> current step card should be tighter than a standard section gap
- in hero-led intro flows, progress is part of the same narrative stack as the current card, not a separate band

Forbidden traits:

- dashboard percentage treatment
- isolated floating placement with excessive dead air above and below
- strong color contrast that competes with the hero or CTA

## 13. Page-Type Mapping

### 13.1 `/`

Role:

- emotional entry
- hero-led
- minimal chrome

Must preserve:

- strongest serif hero usage
- atmospheric gradient background
- calm intro pacing
- hero -> progress -> current step card as one continuous stack
- paired top chips as light intro chrome
- step cards that feel embedded in the page, not sheeted off from it

### 13.2 `/talk`

Role:

- operational companionship surface
- fixed shell language anchor

Must preserve:

- canonical top shell family
- canonical bottom dock family
- single-mode warm translucent control language

### 13.3 `/memory`

Role:

- reflective reading page

Should move toward:

- same dark-night atmosphere family
- same secondary card language
- same chip and action language as `/` and `/talk`
- less visual separation from shared shell family

### 13.4 `/sleep-monitoring`

Role:

- insight-led, soft-data page

Should move toward:

- same night shell family
- same primary / secondary card weights
- same warm active chip language
- same button language
- charts that feel compatible with the product's calm emotional world

## 14. Shared Safe-Area + Spacing Baseline

These remain the default spatial rules unless overridden locally.

### 13.1 Horizontal page padding

- default horizontal page padding: `24px`
- absolute minimum horizontal page padding: `20px`

### 13.2 Top safe area

- after system safe area, add `16px` before first page-level UI

### 13.3 Bottom safe area

- keep at least `24px` above the bottom safe area for general content
- keep at least `32px` above the bottom safe area for primary or grouped actions

### 13.4 Top nav rules

- top nav top offset below system safe area: `16px`
- top nav shell visual height: `44px` to `56px`
- minimum left and right margin for top nav shell: `24px`

### 13.5 Hero spacing

- hero title max width: `min(76vw, 320px)`
- hero support max width: `min(72vw, 300px)`
- hero title -> support: `16px`
- hero block -> next major section: `88px`

### 13.6 Bottom action group

- last content block -> action group: `72px`
- vertical action gap: `14px`
- action group -> bottom safe area: `32px`

Fixed dock or immersive scene pages may override these values if their page spec explicitly states it.

### 14.1 Intro-flow spacing exception

For hero-led onboarding flows:

- the current step card may sit closer to the hero than the default `88px` hero-to-next-major-section rule
- this is allowed when the hero, progress strip, and card are intended to read as one stack
- the goal is continuity, not maximal breathing room

Do not apply this exception to dense reading pages or dashboard-like surfaces.

## 15. Audit Checklist

When reviewing a page against this baseline, check:

1. Does it feel like the same night product as `/` and `/talk`?
2. Does it use the same shell family for chrome and supporting controls?
3. Are card weights consistent with the shared primary / secondary / tertiary system?
4. Do chips feel like the same language?
5. Do buttons feel like the same language?
6. Does informational copy read like guidance rather than controls?
7. Does progress act like a bridge instead of an isolated widget where applicable?
8. Do spacing and safe-area offsets stay inside the shared mobile baseline?

## 16. Non-Goals

This document does not define:

- route behavior
- backend contract
- page-specific information architecture
- page-specific state machine logic
- exact content copy

It defines the shared visual mother system that page specs should inherit from before they specialize.
