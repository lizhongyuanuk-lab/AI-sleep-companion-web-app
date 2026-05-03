# Room 页面 UI / 交互 Spec

English Final · Clean Version Aligned to Final Talk UI

This document is the single implementation-facing UI / interaction source for the Room page in the current MVP.

## 1. Document Positioning

This document defines the final Room-page UI result, interaction result, state visibility, motion constraints, and implementation boundaries.

It exists to prevent implementation drift.

Room must not be interpreted as:

- a home page
- a feed page
- a category page
- a light version of Talk

Priority order is fixed as:

1. Room PRD / main product spec
2. Confirmed non-UI page rules for Room
3. This UI / Interaction Spec
4. Visual reference images

If any visual reference conflicts with the PRD or confirmed page behavior, the PRD and confirmed behavior win.

Shared layout baseline:

- [docs/GLOBAL_MOBILE_LAYOUT_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/GLOBAL_MOBILE_LAYOUT_SPEC.md) applies by default
- Room is a no-nav, immersive full-bleed page, so top-nav-specific spacing rules are `N/A`
- Room may keep edge-to-edge scene imagery; only overlay content is constrained by shared safe-area rules unless this spec overrides them

## 2. Reference Boundaries and Implementation Principles

The final Talk page may be borrowed only as a visual language reference.

The Room page may inherit the same fixed warm translucent glass token family and material feel.

The Talk page feature set must not be borrowed.

Room must not inherit:

- Talk navigation
- dock
- settings entry
- sound controls
- transcript logic
- message controls

Rules:

- Borrow visual expression only, not feature scope.
- Do not create new UI modules not defined in the Room PRD.
- Do not infer extra controls because the page looks minimal.
- Do not add any third actionable control beyond vertical swipe and tap to enter Talk.
- Do not introduce adaptive theming, dark/light switching, or runtime recoloring.

## 3. Page Design Goals

Room must read as a full-screen immersive room preview layer.

The first impression must be the scene itself, not product chrome.

The user should notice the current room atmosphere first:

- scene
- matched ambience sound
- calm breathing space

The user should understand two things first:

1. Vertical swipe changes the room.
2. Tap enters Talk after short dwell.

## 4. Reference Viewport and Responsive Baseline

Reference viewport is locked to iPhone 16 portrait: `393 × 852 px`.

Current implementation baseline is mobile-first Web / PWA.

The following may adapt across viewport sizes:

- background crop
- safe-area offsets
- minor horizontal padding correction
- motion asset scaling

The following must not change structurally across viewport sizes:

- single full-screen room at rest
- no top navigation, no bottom navigation, no dock
- only two user-facing actions: vertical swipe and tap to enter Talk
- bottom-left room-title anchor logic aligned to Talk

## 5. Design Tokens

Use one fixed token family aligned to the final Talk page.

| Token Group | Value | Usage Rule |
| --- | --- | --- |
| `radius-pill` | `999 px` | Tap hint, swipe hint, any tiny glass pill |
| `radius-panel` | `24 px` | Reserved for future Talk settings panel only; not used as a visible Room surface |
| `space-page-x` | `16 px` | Left and right page inset |
| `space-page-bottom` | `12 px + safe area` | Base bottom inset system |
| `type-room-title` | `13 / 17 / 700` | Current title pill text |
| `type-room-tag` | `11 / 15 / 500` | Current ambience tag pill text |
| `type-tap-cta` | `16 / 20 / 600` | Current `Tap to enter` text |
| `icon-stroke` | `2 px` | Only if a swipe hint arrow is used |
| `motion-crossfade` | `300–800 ms` | Room-to-room ambience audio crossfade |

## 6. Color Tokens

| Token | Value | Rule |
| --- | --- | --- |
| `shell-bg` | `rgba(255,255,255,0.22)` | Use only for tiny hint pills if needed |
| `shell-border` | `rgba(255,255,255,0.18)` | `1 px` border on hint pills |
| `shell-text-primary` | `#454545` | Title pill and ambience tag text |
| `shell-text-secondary` | `#000000` | Swipe hint and tap CTA text |
| `shell-highlight` | `rgba(255,245,224,0.52)` | Do not use as a large surface on Room |
| `bottom-scrim` | fixed warm dark transparent gradient | Used only to protect lower text readability |
| `mode-rule` | single fixed mode | No dark/light variants, no runtime recoloring |

There is no dual visual system on Room.

The page uses one fixed warm translucent glass rule only.

## 7. Page Structural Skeleton

Room is a four-layer page.

The skeleton must remain stable across all page states.

1. Scene layer: full-screen room background. Exactly one room is visible at rest.
2. Ambient motion layer: `1–3` subtle motion loops bound to the current room.
3. Lower readability layer: fixed bottom scrim for title and hints.
4. Information layer: lower-left title/tag cluster, one-time swipe hint, centered tap CTA.

Nothing else may be added to the skeleton.

There is:

- no top control band
- no bottom dock
- no modal stack on Room

## 8. Layout Measurements

| Measurement | Value | Rule |
| --- | --- | --- |
| page inset left | `16 px` | Fixed |
| page inset right | `16 px` | Fixed |
| title x-position | `16 px` | Same left anchor logic as Talk room name |
| info cluster bottom anchor | `98 px + safe area` | Current lower-left cluster anchor |
| title pill min-height | `46 px` | Primary item in the cluster |
| tag pill min-height | `36 px` | Secondary items in the cluster |
| title pill padding | `18 px / 11 px` | Horizontal / vertical |
| tag pill padding | `14 px / 8 px` | Horizontal / vertical |
| title-tag row gap | `10 px` | Vertical spacing |
| tag-tag gap | `8 px` | Horizontal spacing |
| swipe hint zone | centered above bottom safe zone | Lower than title; lower visual priority |
| tap hint zone | centered in the lower-middle band | Appears after dwell; sits above the lower-left cluster |
| minimum tap-safe delay | `2 s dwell` | No tap-enter before this |
| tap CTA size | `200 × 50 px` | Fixed visual target |
| tap target | entire current room surface except browser/system UI edges | No separate CTA bar |
| room count (MVP) | `6` | Fixed first version |

## 9. Top Navigation Area Spec

Room has no top navigation area.

Replacement structure:

the page is fully immersive.

The upper area is reserved for the scene only.

The following are forbidden:

- top-left settings button
- capsule navigation
- category tabs
- icon bar

Navigation appears only after entering Talk.

## 10. Main Content Area Spec

The main content area is the room scene itself.

It is not:

- a list
- a form
- a card stack
- an IM surface

Rules:

- Default first-screen density must be extremely low.
- No multi-card overview.
- No feed metadata, tags, or recommendation reasons.
- No subtitles, no helper paragraphs, no mode badges.
- At rest, one room occupies the full viewport.

Vertical paging is the only scroll behavior.

The page must snap to one room at a time.

## 11. Date / Time / Group Label Spec

Not applicable to Room.

Room must not introduce:

- date chips
- time labels
- group separators
- any conversation-era labeling system

## 12. Text / Card / Bubble / Cell Spec

### 12.1 Room Title Pill

Room title is rendered as a standalone lower-left glass pill.

- Style: `13 / 17 / 700`
- Color: `#454545`
- Single line only
- Bottom-left anchored
- Same bottom-left anchor logic as the Talk page room name
- Standalone pill only; no shared outer shell

### 12.2 Ambience Tag Pills

Ambience tags are rendered on the second row as independent pills split from the room's ambience label.

- Style: `11 / 15 / 500`
- Color: `#454545`
- Left-aligned beneath the title pill
- Wrapping is allowed
- Each tag must remain standalone
- No grouped footer plate or shared capsule

### 12.3 Swipe Hint

Copy is locked to: `Swipe to explore rooms`.

- Shown only on the first entry, first room
- May include a very subtle downward chevron
- Disappears permanently after the first successful vertical swipe
- Must remain weaker than the tap hint

### 12.4 Tap Hint / Enter CTA

Copy is locked to: `Tap to enter`.

- Appears after `2 seconds` of stable dwell on the current room
- Remains visible until the user swipes away or enters Talk
- Presented as a centered glass CTA capsule
- Size is `200 × 50 px`
- Uses black text and a left-side three-bar icon
- CTA highlight glow is allowed behind the capsule
- The three bars remain still for `2 seconds` after the CTA appears, then begin a subtle staggered bounce
- Not a full-width button and not a footer bar

### 12.5 Forbidden Component Types

- Cards
- List cells
- Message bubbles
- Chat transcript blocks
- Sheet rows
- Standalone CTA bar
- Toolbar buttons

## 13. Media / Image / Audio / Attachment Spec

A room is an ambience package, not a background image.

Each room must contain all three of the following:

1. Scene visual
2. Matched environmental audio
3. Subtle ambient motion

### 13.1 Sound Categories

- Rain: light rain, window rain, distant thunder rain
- Forest / Nature: forest ambience, leaves and wind, birds ambience, soft stream
- Ocean / Water: ocean waves, lakeside water, slow ripple
- Night / Quiet Room Tone: soft night ambience, indoor quiet hum, distant city hush
- Wind / Air: soft wind, night wind, cabin wind
- White Noise / Sleep Noise: white noise, pink noise, brown noise
- Soft Ambient Music: soft sleep pad, light drone, minimal calming music

### 13.2 Binding Rules

- Scene and sound must match. Forest scene with ocean waves is forbidden unless intentionally defined as a hybrid room.
- Room may play environmental audio, white noise, and very light ambient music only.
- AI voice, narration, lyrics, strong rhythmic music, and interruptive system sounds are forbidden on Room.
- Room-to-room audio change must use crossfade, not hard cut.

### 13.3 Motion Rules

- `1–3` subtle loops only per room
- Allowed examples: rain overlay, drifting clouds, leaf sway, water ripple, fireplace flicker, light breathing glow
- Motion must be low-energy, slow, cyclical, and non-distracting
- Fast particles, flash, large displacement, and narrative animation are forbidden

## 14. Primary Action Area / Bottom Dock / Main CTA Spec

Room has no bottom dock and no dedicated CTA bar.

The primary action model is:

1. Primary action: vertical swipe to change room
2. Secondary action: tap the current room surface to enter Talk after dwell

The entire current room is the CTA surface once the dwell threshold is passed.

No third actionable control is allowed on this page.

Sound controls are not part of Room.

They belong to the Talk settings panel only.

Talk settings may contain:

- ambience on/off
- ambience volume
- AI voice volume
- music volume
- noise type selector or mix preset

## 15. Dual-Mode Rules

Not applicable as a switchable system.

Room uses one fixed visual mode only.

- No dark mode / light mode toggle
- No background-based theme adaptation
- No runtime image analysis for UI recoloring
- Scene brightness may vary, but UI tokens and skeleton must not change

## 16. State Visibility Matrix

| State | Visible | Hidden | Clickable | Notes |
| --- | --- | --- | --- | --- |
| `page_loaded_first_entry` | Scene, title pill, ambience tag pills, swipe hint | Tap CTA until dwell, all other controls | Nothing until dwell | First room only |
| `idle_room_preview` | Scene, title pill, ambience tag pills | Swipe hint after first swipe, tap CTA until dwell | Swipe only | Audio auto-start may degrade silently if blocked |
| `dwell_ready_to_enter` | Scene, title pill, ambience tag pills, tap CTA | All non-Room controls | Room surface | Tap enters Talk |
| `room_switching` | Outgoing/incoming scene, motion transition, title/tag cluster | Tap CTA | Nothing | Disable tap during switch and settle |
| `talk_enter_transition` | Scene continuity, transition out | Swipe hint, tap CTA | No extra controls | Maintain ambience continuity into Talk |
| `asset_audio_failed` | Scene, title/tag cluster, hints | Audio-specific affordances | Swipe and tap still allowed | Silent fallback allowed |
| `asset_visual_failed` | Fallback visual, title/tag cluster, hints | Broken asset layer | Swipe and tap still allowed | Room must remain navigable |

## 17. Interaction Flow Spec

Write all interactions as user action → page reaction → state change.

1. First entry → first room loads and begins preview → first-entry state with one-time swipe hint
2. User dwells for 2 seconds → tap hint appears → room becomes enterable
3. User swipes vertically → page snaps to adjacent room, audio crossfades, dwell timer resets → `room_switching` then `idle_room_preview`
4. User swipes for the first time on the first entry → swipe hint disappears permanently → subsequent rooms never show swipe hint again
5. User taps current room after dwell → page transitions to Talk while preserving the current ambience continuity → `talk_enter_transition`
6. User tries to tap during room switching → no action → state remains `room_switching`
7. Audio autoplay blocked by platform → page continues with silent preview, keeps swipe and tap usable → `idle_room_preview` (silent fallback)
8. User returns from Talk → Room restores the last entered room → dwell timer restarts and tap hint reappears after 2 seconds

## 18. Inline State / Error / Hint Copy Mounting Rules

Inline copy is mounted in two zones only:

- lower-left information cluster for title and ambience tags
- lower-middle action zone for swipe hint and enter CTA

- Swipe hint: centered low, shown only on first room first entry
- Tap hint: centered lower-middle in a glass CTA capsule, shown after 2 seconds dwell
- Error hint if needed: keep it low and subtle; never large toast
- Hint copy must not overlap browser safe-area edges or system UI

The following are forbidden:

- Large modals
- center toasts
- banners
- full-width error bars

## 19. PRD → UI Mapping Addendum

- “Room is an immersive entry layer” → no navigation, no dock, no dense product chrome
- “Room only has swipe + tap” → do not add third controls, tabs, or details entry
- “Room is not Talk” → do not show transcript, mic, image attach, settings, or message UI
- “Room aligns with Talk visual language” → same fixed warm translucent glass token family, but no Talk modules
- “Room title position should align with Talk room text” → same bottom-left anchor logic and left inset, but implemented as a title pill
- “Current Room foreground copy includes ambience context” → title pill on row 1 and standalone ambience tag pills on row 2
- “Sound control belongs to Talk settings” → Room must not expose ambience toggles or volume control
- “Each room is an ambience package” → every room must bind scene + matched audio + subtle motion

## 20. Strict Prohibitions

- Must not add top navigation, bottom navigation, bottom dock, settings entry, or category tabs
- Must not add a third actionable control beyond vertical swipe and tap to enter
- Must not display transcript, cards, lists, subtitles, or recommendation reasons
- Must not move the room title cluster to the center or top
- Must not expose ambience toggles, volume sliders, or sound-type pickers on Room
- Must not use dynamic theme switching, runtime recoloring, or image-driven token changes
- Must not mismatch scene, sound, and ambient motion
- Must not use high-energy motion, flashing, or strong visual effects
- Must not wrap the title pill and tag pills in a shared outer shell

## 21. Developer Alignment Checklist

- I confirmed that Room has no top nav, no bottom nav, and no dock.
- I confirmed that Room exposes only vertical swipe and tap to enter Talk.
- I confirmed that tap enter is disabled until 2 seconds dwell completes.
- I confirmed that the room title uses the same bottom-left anchor logic as the Talk room name.
- I confirmed that the lower-left cluster uses one title pill and standalone ambience tag pills with no outer shell.
- I confirmed that only the first-entry first room shows the one-time swipe hint.
- I confirmed that every room binds scene + matched audio + subtle motion.
- I confirmed that audio crossfade is used on room switch.
- I confirmed that sound controls exist only in Talk settings.
- I confirmed that the page uses one fixed visual mode aligned to Talk.
- I confirmed that the centered `Tap to enter` CTA uses the current glass capsule treatment and delayed bar animation.

## 22. Acceptance Criteria

1. On entry, the user sees exactly one full-screen room.
2. There is no visible navigation bar, no dock, and no settings entry on Room.
3. The first-entry first room shows `Swipe to explore rooms`.
4. After 2 seconds dwell on any room, `Tap to enter` appears and remains visible until swipe-away or Talk entry.
5. Vertical swipe snaps between rooms; no half-room resting state is allowed.
6. Tap during switching does nothing; tap after dwell enters Talk.
7. The lower-left info cluster uses one title pill and standalone ambience tag pills with no shared outer shell.
8. The room title remains bottom-left anchored and aligned to the Talk room-name anchor logic.
9. The `Tap to enter` CTA is centered, glass-based, and appears after 2 seconds dwell.
10. Each room presents matched scene, environmental audio, and subtle motion.
11. No AI voice or transcript appears on Room.
12. Any ambience toggle, volume control, or sound selector appears only in Talk settings.
