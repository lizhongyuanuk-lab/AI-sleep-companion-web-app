# Global Mobile Safe-Area + Spacing Spec

Version: v1.0  
Scope: Shared mobile layout baseline for `/talk`, `/room`, `/memory`, `/sleep-monitoring`, and future pages unless a page-level UI spec explicitly overrides it.

## 1. Document Role

This document defines the default mobile safe-area and spacing system for the app.

It exists to:

- keep page spacing consistent
- prevent top / bottom drift
- protect text and actions from screen edges
- provide a shared audit baseline across pages

This document is a global baseline, not a blind override.

Page-specific UI specs may override these values only when the page type explicitly requires it.

Allowed page-type override cases:

- immersive full-bleed scene page
- fixed bottom dock page
- no-nav page
- hero-led emotional page

If a page overrides a shared rule, the override must be stated in that page's UI spec.

## 2. Scope Rules

These rules apply by default to:

- page content columns
- top page chrome
- hero blocks
- grouped reading content
- bottom action groups
- overlay UI attached to page content

These rules do not automatically constrain:

- full-bleed background imagery
- decorative atmospheric layers
- scene-only layers with no readable content

Important rule:

- background layers may remain edge-to-edge
- content overlay layers must still respect safe spacing unless the page spec explicitly overrides them

## 3. Shared Safe-Area Rules

### 3.1 Horizontal page padding

- default horizontal page padding: `24px`
- absolute minimum horizontal page padding: `20px`
- text or interactive content must not sit closer than `20px` to either screen edge

### 3.2 Top safe area

- after the system safe area / status bar / dynamic island region, add `16px` before the first page-level UI element
- top navigation or the first top-level content block must not start immediately after the system region

### 3.3 Bottom safe area

- keep at least `24px` above the bottom system safe area / home indicator for general content
- keep at least `32px` above the bottom system safe area for primary or grouped actions

## 4. Top Navigation Rules

These rules apply to pages that have top navigation.

### 4.1 Top nav offset

- top nav top offset below system safe area: `16px`

### 4.2 Top nav height

- top nav interactive height: `44px minimum`
- top nav shell visual height may range from `44px` to `56px` when a page-specific chrome style requires a larger capsule

### 4.3 Top nav horizontal margin

- minimum left and right margin for top nav shell: `24px`

### 4.4 Top nav to first content block

- normal content pages: `32px`
- hero / emotional pages: `48px minimum`
- large-text hero pages may use `56px` if needed

## 5. Hero Block Rules

These rules apply to pages that use a hero block.

### 5.1 Hero max width

- centered hero title max width: `min(76vw, 320px)`
- centered hero supporting text max width: `min(72vw, 300px)`

### 5.2 Hero internal spacing

- context line -> hero title: `24px`
- hero title -> hero support: `16px`

### 5.3 Hero external spacing

- hero block -> next major content section: `88px`

## 6. Section Spacing Rules

- standard section -> next section: `48px`
- large section -> next section: `64px`
- hero section -> next major section: `88px`

## 7. Grouped Content Rules

- title -> support: `12px`
- support -> metadata: `10px`
- grouped item -> next grouped item: `56px`

## 8. Bottom Action Rules

These rules apply to standard bottom action groups.

- last content block -> action group: `72px`
- vertical action gap: `14px`
- action group -> bottom safe area: `32px`

Fixed bottom dock exception:

- fixed persistent dock pages may use page-specific bottom anchoring rules
- they are exempt from the standard `72px + 32px` action-group formula
- the exemption must be stated in the page UI spec

## 9. Touch Target Rules

- minimum touch target: `44 x 44px`
- primary / standard action button height: `48px`
- minimum interactive memory row height: `56px`
- preferred interactive memory row height: `64px`

## 10. Typography + Space Link Rule

If a page uses centered hero text at `34px` or above:

- hero max width remains `min(76vw, 320px)`
- hero title -> support remains `16px`
- hero block -> next major section remains `88px`
- grouped item spacing remains `56px`
- do not compress these values just to fit more content above the fold

## 11. Audit Rules

### 11.1 Audit behavior

Audit each page against this system and report:

- horizontal padding compliance
- top safe spacing compliance
- bottom clearance compliance
- hero spacing compliance
- grouped content spacing compliance
- button spacing compliance

### 11.2 Audit output format

For each page, output:

- `PASS`, `FAIL`, or `N/A`
- which exact spacing values are off
- what the current value appears to be
- what the required value should be
- whether the issue is structural, optical, or interactive

### 11.3 Audit classification

Each spacing judgment should classify the evaluated element as one of:

- content layer
- page chrome
- fixed bottom action
- immersive background

This prevents full-bleed scenes from being audited as normal content columns.

## 12. Page-Type Override Guidance

### 12.1 Immersive full-bleed pages

Examples:

- full-screen scene pages
- room-atmosphere pages

Rules:

- background may remain edge-to-edge
- overlay content still follows the shared safe-area baseline unless explicitly overridden

### 12.2 Fixed-dock pages

Examples:

- voice-presence pages with a persistent bottom dock

Rules:

- top safe area and horizontal content spacing still apply
- standard bottom action-group spacing does not automatically apply
- dock anchoring may be page-specific

### 12.3 No-nav pages

Examples:

- scene-entry pages with no top navigation

Rules:

- top-nav-specific rules become `N/A`
- first meaningful overlay content still needs safe spacing if it exists

## 13. Non-Goals

This document does not define:

- colors
- typography family selection
- page hierarchy
- interaction logic
- route behavior
- product modules

It defines spacing and safe-area consistency only.
