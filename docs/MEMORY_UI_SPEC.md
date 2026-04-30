# Memory Page UI Spec

Project: AI Companion Web  
Page: Memory  
Document type: UI Spec  
Version: v1.0  
Status: Ready for implementation in Codex

## 1. Page Role / Intent

The Memory page is a reflective, text-led screen that surfaces lightweight emotional insights from recent usage.

This page is not a dashboard, not a therapy report, and not an analytics page. It should feel like a calm, curated reflection screen inside a premium AI wellness companion.

The experience should communicate:

- calm clarity
- emotional relevance
- strong typographic hierarchy
- spacious reading rhythm
- minimal visual noise

The page should feel like a real product UI screen, not like a marketing poster or editorial composition.

## 2. Design Principles

### 2.1 Core principles

Text-first  
The experience is primarily driven by text hierarchy, not by containers, icons, or illustrations.

No content cards  
The body content must not be placed inside cards, blocks, frosted panels, or filled text containers.

Strong hierarchy  
The hero insight must be clearly dominant. The recurring insights must be clearly secondary. Supporting text must be clearly tertiary.

Generous spacing  
Large vertical gaps are required between major content sections. The page should breathe.

Talk-page consistency  
The top navigation must use the same visual system as the Talk page.

Restrained atmosphere  
The page background should feel alive and emotional, but subtle. It should not become colorful decoration that competes with the text.

## 3. Screen Structure Overview

The page is composed of the following major zones, top to bottom:

- Top safe area
- Top navigation
- Hero insight block
- Recurring insights block (3 items)
- Bottom action area (3 equal actions)

## 4. Global Layout Rules

### 4.1 Canvas

- mobile portrait layout
- reference width: `393px`
- reference height: flexible / scrollable long page
- content should be vertically scrollable
- layout must still look correct on common mobile widths around `375px–430px`

### 4.2 Horizontal content width

- main content alignment: left-aligned
- content max width: approximately `78%–82%` of screen width
- left padding: `24px`
- right padding: `24px`
- content should not stretch edge-to-edge

### 4.3 Safe areas

- respect iOS top safe area
- respect bottom safe area / home indicator space
- no important text should sit too close to the bottom gesture area

## 5. Background Specification

### 5.1 Background direction

The page background should not be pure black. It should be a dark atmospheric gradient with subtle color life.

### 5.2 Background visual style

Use:

- deep navy
- indigo
- muted purple
- subtle desaturated burgundy / amber haze near lower area
- a soft warm glow behind the hero block

Avoid:

- harsh red blocks
- neon gradients
- high saturation
- decorative images
- visible textures that look noisy or cheap

### 5.3 Glow treatment

A soft ambient glow is allowed behind the hero block only.

Rules:

- glow is a background aura, not a box
- glow should be soft-edged and low contrast
- glow should support readability, not call attention to itself
- do not apply glow to recurring blocks

### 5.4 No text backing layer

There must be:

- no opaque rectangle behind text
- no glass card behind hero text
- no filled capsule behind body content
- no stroke or content panel framing the text

Only:

- text
- background
- subtle hero-area glow

### 5.5 Visual contract rules for effects

Descriptive intent words such as `soft`, `subtle`, `calm`, `premium`, or `stronger highlight` are not sufficient on their own when they materially affect implementation.

For Memory-specific effects, the visible outcome must define:

- where the effect appears
- what it is attached to
- how strong it should feel
- what it must not look like
- what counts as visual failure

For the hero-area glow in particular, failure includes:

- the effect exists in code but is not visually perceptible
- the effect is too weak to support hero hierarchy
- the effect is too strong and becomes distracting
- the effect looks muddy, patchy, or dirty against the background
- the effect reduces readability
- motion technically exists but does not create a visible, calm rhythm

The hero-area glow is not considered complete merely because a gradient, blur, or animation exists in code. It is only complete if the visible result supports hero readability and hierarchy without reading as a card, plate, or poster effect.

## 6. Top Navigation Spec

### 6.1 Requirement

The top navigation must remain visually consistent with the Talk page.

### 6.2 Placement

- positioned near the top center
- below safe area
- horizontal centered
- top offset: align with Talk page spec

### 6.3 Container

- shape: rounded pill
- visual style: translucent dark glass / soft dark shell
- no hard border dominance
- same height, radius, spacing logic, and overall visual weight as Talk page nav

### 6.4 Navigation items

There are 4 tabs:

- Talk
- Room
- Memory
- Sleep

### 6.5 Active state

Memory is the active tab.

Active state style:

- a soft warm off-white / cream capsule behind the Memory icon
- icon color darkened inside active pill for contrast

### 6.6 Inactive state

Inactive icons:

- outlined or simple line style
- soft white / warm white
- medium opacity
- understated

### 6.7 Constraints

- navigation must not dominate the page
- it must feel unified with the Talk page
- do not redesign the nav into a new visual language

## 7. Typography System

Use a clean UI sans-serif similar to Poppins.

### 7.1 Font family

Preferred:

- `Poppins`

Fallback:

- `Inter`
- `system-ui`
- `sans-serif`

### 7.2 Weight usage

- Hero insight: Bold / `700`
- Recurring item titles: SemiBold / `600` or Bold / `700`
- Supporting text: Regular / `400`
- Context line: Regular / `400` or Medium / `500`
- Bottom actions: Medium / `500` or SemiBold / `600`

### 7.3 Important rule

Typography must feel like app UI typography, not poster typography.

Avoid:

- serif
- script
- decorative display fonts
- editorial style headline fonts
- overly thin type for core insight

## 8. Text Hierarchy

This page has 4 clear text levels.

### Level 1 — Hero Insight (highest emphasis)

This is the most important text on the page.

Content:

Lately, your nights  
have been asking  
for a gentler pace.

Style:

- `Poppins Bold`
- largest text on page
- 3 lines preferred on reference width
- strong visual dominance
- warm soft white color
- slight optical softness is okay
- no text outline
- no decorative font treatment
- no glow directly on letters; only subtle background aura behind the hero area

Recommended size:

- `48px` on reference width
- line height: `1.08–1.14`
- letter spacing: slightly tight or default
- maximum text block width: around `78%` of screen width

### Level 2 — Recurring Insight Titles

These are the three recurring results shown below the hero.

Each should be clearly visible, but much smaller than the hero.

Example titles:

- Mentally busy evenings
- Wanting a lighter start
- Quiet company over advice

Style:

- `Poppins SemiBold` or Bold
- white / warm white
- clean, calm, concise
- maximum 8 words recommended
- should not visually compete with hero

Recommended size:

- `28px`
- line height: `1.20–1.26`

### Level 3 — Supporting Insight Text

This includes the supporting sentence under the hero and the supporting lines under recurring items.

Hero support example:

Shorter check-ins seemed to help.

Recurring support examples:

- You settle more easily when the conversation starts softly.
- A softer opening works better than trying to solve everything first.
- You often stay longer when the tone feels calm and unhurried.

Style:

- `Poppins Regular`
- muted gray-lavender / muted cool white
- clearly secondary / tertiary
- easy to read
- slightly more compact than hero

Recommended size:

- `18px`
- line height: `1.50–1.60`

### Level 4 — Context Label

Small contextual text above the hero.

Content:

From the last 7 nights

Style:

- small
- muted
- understated
- should not look like a pill or chip
- plain text only

Recommended size:

- `16px`
- line height: `1.4`
- color: low-emphasis muted gray-lavender

## 9. Page Content Structure

### 9.1 Hero block

Order:

- Small context line
- Hero insight
- Hero support line

Required content:

Context line

From the last 7 nights

Hero insight

Lately, your nights  
have been asking  
for a gentler pace.

Hero supporting text

Shorter check-ins seemed to help.

### 9.2 Hero block spacing

- Top nav to context line: `72px`
- Context line to hero: `20px`
- Hero to hero support: `28px`
- Hero block bottom to first recurring item: `96px`

This large gap is important. The hero and recurring section should not feel crowded together.

### 9.3 Recurring insights block

Do not add a section title.

Do not add:

- “Things that came up more than once”
- metadata pills
- “hide” buttons
- cards
- badges

Show exactly 3 recurring insights in sequence.

Recurring item 1

Title:

Mentally busy evenings

Support:

You settle more easily when the conversation starts softly.

Recurring item 2

Title:

Wanting a lighter start

Support:

A softer opening works better than trying to solve everything first.

Recurring item 3

Title:

Quiet company over advice

Support:

You often stay longer when the tone feels calm and unhurried.

### 9.4 Recurring item spacing

For each recurring item:

- title to support: `12px`
- item to next item: `56px`

The three items should feel like separate text moments, not list rows.

## 10. Bottom Action Area

### 10.1 Purpose

Provide 3 follow-up actions after the recurring insights.

### 10.2 Relationship

All three actions are parallel options. None should appear primary or secondary in hierarchy.

### 10.3 Placement

- place below the recurring insights
- keep enough top spacing from the last recurring item
- respect bottom safe area

### 10.4 Layout

Use a vertical stack, not horizontal.

Why:

- better readability
- calmer
- more premium
- more consistent with the text-first rhythm

### 10.5 Action style

- text-based button or subtle button
- three actions should use identical visual treatment
- no one action should be highlighted more than the others
- soft outline / subtle ghost button / understated pill is acceptable
- keep it clean and minimal

### 10.6 Example action copy

Use short, calm action labels. Suggested options:

- Talk about this
- Try a gentler start
- Adjust tonight’s room

If product needs different copy later, structure remains the same.

### 10.7 Button visual rules

- equal size treatment
- equal text weight
- equal spacing
- no filled primary CTA style
- do not introduce bright accent colors

### 10.8 Bottom action spacing

- Last recurring item to action area: `72px`
- Space between buttons: `16px`
- Bottom safe margin: `32px` minimum

## 11. Color System

### 11.1 Text colors

Primary text

- warm soft white
- example direction: `rgba(255, 248, 243, 0.96)`

Secondary text

- muted cool gray-lavender
- example direction: `rgba(214, 208, 226, 0.72)`

Lower-emphasis text

- example direction: `rgba(214, 208, 226, 0.52)`

### 11.2 Active nav capsule

- soft cream / warm off-white
- example direction: `#F3E7DF`

### 11.3 Active nav icon

- dark desaturated plum / charcoal
- example direction: `#2D2630`

### 11.4 Background directions

Example background palette direction:

- deep navy `#0B1020`
- indigo `#171A3A`
- muted purple `#2B2140`
- soft burgundy haze `#402133`
- soft amber glow `rgba(196, 137, 92, 0.16)`

These are directional references, not strict tokens, unless needed.

## 12. Spacing Summary

Use an `8px` grid.

Recommended vertical rhythm:

- Top safe area to nav: per Talk page
- Nav to hero context: `72px`
- Context to hero: `20px`
- Hero to hero support: `28px`
- Hero block to recurring block start: `96px`
- Recurring title to support: `12px`
- Between recurring items: `56px`
- Recurring block to actions: `72px`
- Action buttons spacing: `16px`

The page should feel more spacious than typical app UI.

## 13. Things Explicitly Not Allowed

Codex must not do any of the following:

- Add page title `Memory`
- Add subtitle `Things that have stayed with you lately.`
- Add section title `Things that came up more than once`
- Put content inside cards
- Put content inside frosted glass text panels
- Add body illustrations or decorative floating art
- Add album art or poster-like decorative objects
- Add extra icons in content area
- Use decorative fonts
- Use thin editorial display fonts for hero
- Make the hero smaller than the current hierarchy requires
- Compress the vertical spacing
- Use bright, loud, saturated gradients
- Make one bottom action look primary over the others
- Turn the layout into an analytics dashboard

## 14. Implementation Notes for Codex

### 14.1 Layout behavior

- The page should scroll naturally
- Text blocks must stay left-aligned
- Do not convert recurring items into cards or accordions in this version
- Current version is static presentation of 3 recurring items

### 14.2 Responsive behavior

- Preserve the same text hierarchy on small mobile widths
- Hero may reflow to `3–4` lines depending on width
- Spacing may scale slightly, but hierarchy must remain intact

### 14.3 Reuse with Talk page

- Reuse top nav component from Talk page
- Only change active tab state to Memory
- Keep identical pill proportions and visual styling

## 15. Final Visual Target

The final result should feel like:

- a calm premium AI wellness app
- typographically strong
- spacious and breathable
- emotionally intelligent
- UI-first, not poster-first
- visually consistent with the Talk page
- restrained but not dull
- atmospheric but not flashy
