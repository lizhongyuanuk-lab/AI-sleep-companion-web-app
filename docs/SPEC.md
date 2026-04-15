# Sleep Companion Codex Spec — V1.1

## Status

Locked baseline spec for **V1.1**.  
This document is the source of truth for implementation in `ai-companion-web`.

Unless explicitly upgraded to V2, do not change:
- information architecture
- route structure
- page responsibilities
- Talk content rule
- scene-to-overlay mapping
- one UI shell + two overlay modes
- base interaction model
- V1 state machine semantics

This V1.1 keeps the original product structure and interaction baseline, while refining:
- layout composition
- focal hierarchy
- responsive control token ranges
- bounded implementation freedom
- UI acceptance quality

---

## 1. Product intent

This is a mobile-first AI sleep companion product.

Core goals:
- calm
- minimal
- low-stimulation
- immersive
- scene-led emotional atmosphere
- speak-first interaction
- optional image upload as a secondary input
- AI voice reply first
- one UI system that works across multiple scene backgrounds
- the main live page should feel spacious and emotionally contained, not crowded

### Visual direction

Target direction:
- soft
- sparse
- breathable
- low component density
- one focal center
- stable vertical rhythm

The product should feel closer to:
- an immersive companion app
- a quiet sleep/safe-space interface

The product should feel farther from:
- a dashboard
- a standard threaded chat app
- a card-heavy tool UI
- a SaaS/admin interface

---

## 2. Information architecture

Top navigation has exactly 4 items:

- Talk
- Room
- Memory
- Sleep Monitoring

Rules:
- all 4 items are clickable
- `Talk` is the default route
- do not add extra top-level items in V1
- do not rename these labels in V1

---

## 3. Route definitions

Routes:
- `/talk`
- `/room`
- `/memory`
- `/sleep-monitoring`

### `/talk`
Main live companion page.

Purpose:
- the primary place for user and AI emotional support interaction
- speak-first input
- optional typing
- optional image upload
- AI voice reply
- whisper text
- immersive scene background

Important:
- **Talk does not display the full message history in V1**
- no full chat bubble stream on the Talk screen
- no timeline UI
- Talk is about the present interaction only

### `/room`
Sleep scene selection page.

Purpose:
- users browse and switch between different sleep spaces

Example scenes:
- seaside night
- seaside day
- rainforest day
- snow mountain day

### `/memory`
Memory page.

Purpose:
- stores full past conversations
- stores uploaded images
- stores timestamps
- stores extracted emotional insights and structured psychological summaries

Structure:
- `History` section: full past conversation records
- `Insights` section: extracted emotional themes, recurring patterns, and self-reflection summaries

Default section:
- `Insights`

### `/sleep-monitoring`
Sleep-related page.

Purpose:
- reserved for sleep logs, monitoring, and future sleep-related features

V1 minimum skeleton:
- sleep duration
- sleep quality
- bedtime log

---

## 4. Navigation behavior

- all top nav items are clickable
- route changes should use subtle transitions only
- no heavy shared-element animations
- leaving `/talk` must stop active TTS immediately
- leaving `/talk` must not preserve listening state
- `/talk` may preserve unsent typed text in memory during the same session
- selecting a scene in `/room` should apply the new scene and return to `/talk`

### Talk-specific navigation rule
- Talk uses **top navigation only**
- Talk must **not** render a bottom tab bar
- the bottom area on Talk belongs to the input bar, not route navigation

---

## 5. Screen model

- mobile-first
- portrait only in V1
- reference design viewport: `393 x 852`

Important:
- treat `393 x 852` as a design baseline, not a hardcoded device size
- implementation must be responsive for H5/mobile web

Responsive rules:
- use full available mobile width
- preserve side margins at approximately `20px`
- preserve safe-area aware top and bottom spacing
- allow the center scene area to flex vertically
- background image should cover the viewport and be slightly oversized
- prefer `100svh` over legacy `100vh`

Safe area rules:
- top offset: `max(20px, env(safe-area-inset-top))`
- bottom offset for input bar: `max(24px, env(safe-area-inset-bottom) + 8px)`

---

## 6. Rule layers

### 6.1 Locked rules

These must not change in V1:
- top-level IA
- route structure
- route labels
- `/talk` as default route
- `/talk` does not show full message history
- `/memory` stores history and insights
- one UI shell + two overlay modes
- speak-first input model
- manual scene-to-overlay mapping
- state machine semantics

### 6.2 Bounded rules

These may be tuned within a restrained responsive range:
- top nav height
- top nav horizontal padding
- top nav item spacing
- top nav icon size
- icon-text gap
- active pill width/padding
- input bar height
- input bar internal padding
- shell opacity
- border strength
- shadow strength
- blur strength
- whisper spacing
- scene frame scale

### 6.3 Forbidden freedom

Implementation must not:
- add a bottom tab bar to Talk
- add a full message thread to Talk
- create extra default floating panels
- recolor UI by sampling background hues
- create multiple themed shells
- globally shrink all typography to make layout fit
- solve layout pressure with arbitrary margin pushing
- make the page feel like SaaS/dashboard UI
- compensate for visual problems by adding more default components

---

## 7. Layout composition principles

### 7.1 Talk page layer model

Talk page must be composed as exactly 4 major layers:

1. top navigation layer
2. main scene layer
3. whisper / micro-status layer
4. bottom input layer

Rules:
- top nav stays at the top
- input bar stays at the bottom
- whisper text stays close to the input bar
- main scene occupies the largest visible vertical area
- these layers must not collapse into one crowded stack

### 7.2 Default-state density rule

Talk default state should not contain more than 4 meaningful visual layers.

Do not keep these visible by default unless required by state:
- extra demo chips
- horizontal floating bars
- helper blocks
- detached mini cards
- empty decorative pills
- detached secondary surfaces in the middle of the scene

### 7.3 Focal priority

Default focus order on Talk:

1. main scene
2. bottom input bar
3. top navigation
4. whisper / micro-status text

Rules:
- decorative elements must not compete with the scene
- helper surfaces must not compete with the input bar
- whisper text is informative, not dominant
- top nav must be visually lighter than the scene and input bar

### 7.4 Vertical rhythm

The vertical flow must read as:

top nav  
↓  
breathing space  
↓  
main scene  
↓  
whisper line  
↓  
bottom input bar

Rules:
- top nav must not hug the scene too tightly
- scene is the dominant middle section
- whisper text must stay close to the input bar
- input bar is always the lowest main control
- large empty space is acceptable
- component crowding is not acceptable

---

## 8. Fixed layout

### 8.1 Top navigation

Purpose:
- persistent primary navigation
- floating capsule style
- visually light
- secondary to the scene

Placement:
- left: `20px`
- right: `20px`
- top: `max(20px, env(safe-area-inset-top))`

Responsive control range:
- height: `44px–52px`
- radius: `22px–26px`
- internal horizontal padding: `10px–14px`
- item gap: `8px–14px`

Nav item:
- icon size: `16px–18px`
- label size: `15px`
- label weight: `600`
- label line-height: `20px`
- icon-text gap: `6px–8px`

Active pill:
- height: `34px–38px`
- radius: `17px–19px`
- horizontal padding: `8px–12px`

#### Long-label handling
`Sleep Monitoring` is the longest top-level label.

Handle width pressure in this order:
1. reduce item gap
2. reduce icon-text gap
3. reduce active pill horizontal padding
4. allow a compact two-line label treatment if needed

Do not:
- rename the label
- globally shrink all nav text
- make all icons tiny
- allow the nav to overflow or visually break

#### Top nav visual weight
Top nav must read as:
- neutral
- softly blurred
- semi-transparent
- calm
- readable

It must not read as:
- solid gray bar
- hard opaque toolbar
- visually heavier than the input bar
- the main visual focus

### 8.2 Scene background area

Purpose:
- main emotional scene container
- supports multiple sleep scenes
- supports subtle movement for immersion

Rules:
- background fills the whole screen behind UI
- use a single oversized background image in V1
- image size: `112%–118%` of viewport
- background pans subtly on drag / pointer move
- max movement: `x = 16px`, `y = 10px`
- smooth return to center after interaction ends
- no dramatic parallax
- no game-like camera movement

### 8.3 Main scene rules

The scene is the primary emotional container and the largest visual focus.

Rules:
- scene should occupy the largest vertical share
- scene must remain visually clean
- scene frame may exist, but must not feel like a dashboard card
- avoid clutter in the center of the scene

By default, the scene should not have multiple detached overlay surfaces.

Allowed:
- one subtle whisper line near the bottom zone
- state-driven minimal feedback

Not allowed in default state:
- extra bars crossing the scene
- detached floating pills with no state purpose
- decorative blocks that split the scene into fragments

### 8.4 Bottom input bar

Purpose:
- primary input entry
- speak-first interaction
- secondary image upload input

Placement:
- left: `20px`
- right: `20px`
- bottom: `max(24px, env(safe-area-inset-bottom) + 8px)`

Responsive control range:
- height: `54px–60px`
- radius: `27px–30px`
- left/right icon padding: `14px–16px`
- icon hit area: `32px–36px`
- icon-text gap: `10px–12px`

Icons:
- mic icon: `18px–20px`
- image icon: `18px`

Text:
- default label: `Tap to speak`
- listening label: `Listening...`
- listening hint label: `Tap to write`
- font size: `15px`
- font weight: `500`
- line-height: `20px`

#### Structural rule
The input bar must be fixed to the bottom safe area.

It must:
- remain anchored to the bottom
- not participate in normal document flow
- not be pushed upward by content growth
- not float in the middle

#### Visual balance
The input bar must feel:
- stable
- readable
- calm
- slightly more grounded than the top nav

It must not feel:
- too dark
- too thick
- too glossy
- too busy

#### Internal balance
Inside the input bar, visual hierarchy should be:
1. main label
2. microphone
3. image button

Rules:
- label stays centered and readable
- icons support, not dominate
- image button must not overpower the label
- icon circles must not become the strongest contrast point on screen

### 8.5 Whisper text

Role:
- lightweight emotional cue
- secondary to scene and input bar

Placement:
- centered horizontally
- approximately `12px–20px` above the input bar
- remains in the lower third
- should not float into the middle of the screen

Typography:
- font size: `17px`
- weight: `500`
- line-height: `24px`

Visual rule:
- readable but quiet
- lower emphasis than input bar text
- should not become the main focus
- any surface treatment must remain subtle

---

## 9. Talk screen content rule

Allowed on Talk:
- scene background
- whisper text
- live input bar
- listening / typing / AI reply states
- optional lightweight state feedback

Not allowed on Talk:
- full past user messages
- full past AI messages
- long message thread
- conversation timeline UI

Full records belong in `/memory`.

---

## 10. Visual system

### Core principle

`ONE UI SHELL + TWO OVERLAY MODES`

Do not create multiple colored UI themes.  
Do not recolor the nav and input shell based on scene hue.

Instead:
- use one neutral adaptive glass UI shell
- normalize the background with an adaptive overlay
- only switch overlay mode between bright and dark scenes

### 10.1 Layer structure

Background Image  
↓  
Adaptive Overlay  
↓  
UI Shell

### 10.2 Adaptive overlay

#### Dark scene
Use when the scene is dark / night / low-light.

Purpose:
- compress contrast
- stabilize dark backgrounds
- help white text remain clear

#### Light scene
Use when the scene is bright / daytime / high-light.

Purpose:
- soften brightness
- reduce glare
- create contrast space for the UI

### 10.3 Neutral adaptive glass UI shell

Use for:
- top navigation container
- bottom input bar container

Visual intent:
- neutral glass
- softly blurred
- semi-transparent
- calm
- readable
- not a solid gray block
- not neon
- not SaaS-style

### 10.4 Shared shell tuning

Top nav and input bar belong to the same shell family.

They should feel related but not identical in dominance:
- top nav = lighter
- input bar = slightly stronger anchor

Allowed tuning:
- opacity
- border strength
- shadow strength
- blur strength

Goal:
- improve readability
- reduce heaviness
- preserve calmness
- preserve neutrality

Do not produce:
- deep gray solid blocks
- neon glow
- sci-fi pulse
- blue/purple/green tinted shell
- bright white overexposed shell
- corporate SaaS cards

### 10.5 Adaptation rule

Do not:
- sample background colors
- recolor UI
- switch shell themes by scene hue

Only switch overlay mode.

This is the only allowed adaptive behavior in V1.

---

## 11. State machine and timing

Input area only allows these states:
- Default
- Listening
- Listening Hint
- Typing
- AI Reply

### 11.1 Default
- label: `Tap to speak`

### 11.2 Listening
- entered by tapping the input bar or mic
- label changes to `Listening...`

### 11.3 Listening Hint
- after `1200ms` in listening state
- label changes to `Tap to write`

### 11.4 Silence timeout
- if no valid speech is detected for `4 seconds`, return to Default
- silence timeout is measured from the last detected speech activity

### 11.5 Typing
- entered by tapping the input bar while in listening hint state, or by explicit text-entry action
- if keyboard is dismissed and input is empty, return to Default
- if input contains text, remain in Typing until submit or clear

### 11.6 AI Reply
- entered after valid voice input or text submit
- AI responds with voice
- after playback ends, return to Default

---

## 12. Voice pipeline rules

### 12.1 Microphone permission
- request microphone permission when user enters listening state
- if permission is denied, do not enter listening
- show lightweight message: `Microphone access is off`
- offer fallback: `Type instead`

### 12.2 Microphone interruption
- if listening is interrupted by system/browser/device state, stop listening immediately
- return to Default
- show: `Microphone interrupted`

### 12.3 ASR display
- do not show live realtime transcription on the Talk screen
- do not show full ASR text on the Talk screen
- optional lightweight state text such as `Processing...` is allowed

### 12.4 ASR failure
- if no valid speech is recognized, do not enter AI Reply
- return to Default
- show: `I didn’t catch that`
- allow retry or switch to typing

### 12.5 TTS playback
- AI replies with voice
- TTS playback can always be interrupted by new user action

### 12.6 TTS interruption
- if user taps the input bar, mic, typing entry, or image upload while TTS is playing, stop TTS immediately
- transition directly into the new input state

### 12.7 Audio concurrency
- do not allow simultaneous recording and TTS playback in V1
- entering listening always stops active TTS first

---

## 13. Input field behavior

### 13.1 Typing field model
- single-line input in V1
- no multi-line expansion in V1

### 13.2 Enter behavior
- pressing Enter submits the text
- Enter does not create a new line

### 13.3 Maximum input length
- maximum input length: `200 characters`

### 13.4 Keyboard behavior
When the keyboard appears:
- keep the top nav fixed
- keep the background visually stable
- move only the bottom interaction layer upward
- keep whisper text close above the input bar

### 13.5 Background while typing
- background panning is disabled while typing

### 13.6 Dismiss keyboard behavior
- if keyboard is dismissed and input is empty, return to Default
- if keyboard is dismissed and input has content, remain in Typing and preserve content

### 13.7 After successful text submit
- clear input
- dismiss keyboard
- enter AI Reply

### 13.8 Image upload in Typing state
- image upload remains available in Typing state
- selecting an image must preserve typed text

---

## 14. Image upload rules

### 14.1 Quantity
- V1 supports only a single image per input turn

### 14.2 Supported formats
- jpeg
- png
- webp

### 14.3 Maximum original file size
- `10MB`

### 14.4 Client compression
Compress before upload:
- max long edge: `1600px`
- target upload size: around `1MB` or less
- quality: `0.78–0.85`

### 14.5 Send behavior
- selecting an image does not auto-send it
- after selection, show a lightweight thumbnail preview

### 14.6 Preview
- thumbnail size: `72x72`
- corner radius: `14px`

### 14.7 Remove
- the image preview must include a remove action
- removing the image does not clear typed text

### 14.8 Uploading state
- show a subtle loading overlay on the thumbnail
- optional text: `Uploading...`

### 14.9 Upload failure
- keep the thumbnail visible
- show `Upload failed`
- allow `Retry` or `Remove`

### 14.10 Listening interaction
- in Listening state, tapping image upload stops listening first

### 14.11 Supported input combinations
- text only
- image only
- text + one image

---

## 15. Background resources and overlay mapping

Use manual mapping.  
Do not choose overlay mode by runtime pixel analysis in V1.

Each scene config must include:
- `id`
- `title`
- `image`
- `overlayMode`

Allowed `overlayMode` values:
- `light`
- `dark`

Initial mapping:
- `seaside_night` → `dark`
- `seaside_day` → `light`
- `rainforest_day` → `dark`
- `snow_mountain_day` → `light`

Default scene:
- `seaside_day`

---

## 16. Exception state copy

### Microphone
- `Microphone access is off`
- `Type instead`
- `Microphone interrupted`

### Speech recognition
- `I didn’t catch that`

### Upload
- `Uploading...`
- `Upload failed`

### Network
- `Connection lost`
- `Request timed out`

Rules:
- keep copy lightweight
- avoid technical error language
- avoid heavy alert tone

---

## 17. Typography

Font family:
- English: `SF Pro`, fallback `Inter`
- Chinese: `PingFang SC`

Type scale:
- top nav label: `15 / 600 / 20`
- input label: `15 / 500 / 20`
- whisper text: `17 / 500 / 24`
- micro status text: `12 / 500 / 16`

Tracking:
- use `0` for all base labels

Rules:
- do not globally shrink typography to solve layout pressure
- solve layout pressure with spacing, density, and compact-mode adjustments first

---

## 18. Fixed component behavior

### Top nav
- always visible
- all 4 items clickable
- active item is `Talk` on the main screen
- no heavy transitions
- hover and pressed states allowed with opacity and subtle scale only

### Input bar
- speak-first entry
- image upload secondary
- no full send button in default state
- default is calm idle
- listening adds subtle glow and pulse

### Scene background
- one oversized image
- subtle drag-based movement
- no multi-layer 3D requirement in V1

---

## 19. UI acceptance rules

A Talk page implementation fails if:
- the screen feels crowded
- too many overlay elements are visible together
- the scene is no longer the dominant focus
- the top nav reads as a heavy bar
- the input bar is not visually anchored to the bottom
- the input bar moves upward with content
- the screen resembles a dashboard or threaded chat UI
- spacing issues are solved by shrinking all type and icons

A Talk page implementation passes when:
- the scene is the clear focal center
- top nav is readable but light
- bottom input bar feels stable and calm
- whisper text is quiet and secondary
- the page feels spacious
- there is a clear vertical rhythm
- components do not visually fight each other

---

## 20. Implementation workflow requirement

When implementing or refining UI, Codex must follow this order:

1. read `docs/SPEC.md`
2. identify locked rules
3. identify bounded token ranges
4. apply the smallest layout change needed
5. check visual density and focal hierarchy
6. run:
   - `npm run build`
   - `npm run lint`
   - `npm run type-check`
7. report:
   - modified files
   - what was aligned to spec
   - what still remains imperfect
   - any bounded decisions taken inside allowed ranges

---

## 21. Locked baseline summary

This product remains fixed in V1.1 as:
- 4-item clickable top nav: Talk / Room / Memory / Sleep Monitoring
- `/talk` as the default route
- `/talk` as the live companion screen
- `/talk` does not show full message history
- `/memory` stores full history and extracted insights
- one adaptive scene background
- one bottom speak-first input bar
- optional whisper text above input
- one neutral UI shell
- two overlay modes: dark scene / light scene
- manual scene-to-overlay mapping
- responsive control token ranges
- explicit layout composition principles

Do not invent additional visual systems outside this document.
