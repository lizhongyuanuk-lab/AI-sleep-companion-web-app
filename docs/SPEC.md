# Codex UI Spec — Sleep Companion App V1

## Status

Locked baseline spec for **V1**.  
This document is the source of truth for Codex implementation.

Unless explicitly upgraded to V2, do not change:
- information architecture
- route structure
- layout structure
- visual system
- base interaction rules
- scene-to-overlay mapping

---

## 1. Product intent

This is a mobile-first AI sleep companion product.

Core goals:
- calm, minimal, low-stimulation
- scene background as the emotional container
- speak-first interaction
- image upload as a secondary input
- AI replies with voice first
- the main live page should feel immersive, not like a standard messaging app
- one UI system must work across multiple background scenes

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
- immersive background scene

Important:
- **Talk does not display the full message history in V1**
- no full chat bubble stream on the Talk screen
- Talk is about the present interaction only

### `/room`
Sleep scene selection page.

Purpose:
- users browse and switch between different sleep spaces
- example scenes:
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

---

## 5. Screen model

- mobile-first
- portrait only in V1
- reference design viewport: `393 x 852`

Important:
- treat `393 x 852` as a **design baseline**, not a hardcoded device size
- implementation must be responsive for H5/mobile web

Responsive rules:
- use full available mobile width
- preserve side margins at `20px`
- preserve top nav height at `44px`
- preserve input bar height at `54px`
- use safe-area aware top and bottom spacing
- allow center scene area to flex vertically
- background image should cover the viewport and be slightly oversized
- prefer `100svh` over legacy `100vh`

Safe area rules:
- top offset: `max(20px, env(safe-area-inset-top))`
- bottom offset for input bar: `max(24px, env(safe-area-inset-bottom) + 8px)`

---

## 6. Fixed layout

### 6.1 Top navigation bar

Purpose:
- persistent primary navigation
- floating capsule style
- visually light and scene-adaptive

Placement:
- left: `20px`
- right: `20px`
- top: `max(20px, env(safe-area-inset-top))`
- height: `44px`
- radius: `22px`

Internal layout:
- horizontal row
- item gap: `14px`
- internal horizontal padding: `14px`
- align center vertically

Nav item:
- icon size: `18px`
- label size: `15px`
- label weight: `600`
- label line-height: `20px`
- icon-text gap: `8px`
- active pill height: `36px`
- active pill radius: `18px`
- active pill horizontal padding: `12px`

### 6.2 Scene background area

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

### 6.3 Bottom input bar

Purpose:
- primary input entry
- speak-first interaction
- secondary image upload input

Placement:
- left: `20px`
- right: `20px`
- bottom: `max(24px, env(safe-area-inset-bottom) + 8px)`
- height: `54px`
- radius: `27px`

Internal layout:
- left icon padding: `16px`
- right icon padding: `16px`
- icon-text gap: `12px`
- main content vertically centered

Icons:
- mic icon: `20px`
- image icon: `18px`
- icon hit area: `32 x 32`

Text:
- default label: `Tap to speak`
- listening label: `Listening...`
- listening hint label: `Tap to write`
- font size: `15px`
- font weight: `500`
- line-height: `20px`
- tracking: `0`

### 6.4 Whisper text

Placement:
- centered
- `16px` above the input bar

Typography:
- font size: `17px`
- weight: `500`
- line-height: `24px`

---

## 7. Talk screen content rule

The Talk screen must **not** display the full message history in V1.

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

## 8. Visual system

### Core principle

```text
ONE UI SHELL + TWO OVERLAY MODES
```

Do not create multiple colored UI themes.  
Do not recolor the nav and input shell based on scene hue.

Instead:
- use one neutral adaptive glass UI shell
- normalize the background with an adaptive overlay
- only switch overlay mode between bright and dark scenes

### 8.1 Layer structure

```text
Background Image
↓
Adaptive Overlay
↓
UI Shell
```

### 8.2 Adaptive overlay

#### Dark Scene
Use when the scene is dark / night / low-light.

```css
linear-gradient(
  to bottom,
  rgba(10,12,20,0.35),
  rgba(10,12,20,0.15),
  rgba(10,12,20,0.35)
)
```

Purpose:
- compress contrast
- stabilize dark backgrounds
- help white text remain clear

#### Light Scene
Use when the scene is bright / daytime / high-light.

```css
linear-gradient(
  to bottom,
  rgba(255,255,255,0.35),
  rgba(255,255,255,0.15),
  rgba(255,255,255,0.35)
)
```

Purpose:
- soften brightness
- reduce glare
- create contrast space for the UI

#### Optional bottom support gradient

Dark scene version:

```css
rgba(10,12,20,0.22) → transparent
```

Light scene version:

```css
rgba(255,255,255,0.18) → transparent
```

Purpose:
- give the bottom bar more stability
- improve readability near the lower third

### 8.3 Neutral adaptive glass UI shell

Use for:
- top navigation container
- bottom input bar container

```css
background: rgba(40,44,52,0.55);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.12);
box-shadow: 0 8px 24px rgba(0,0,0,0.18);
```

Visual intent:
- neutral glass
- no strong blue, purple, or green tint
- scene-adaptive by overlay, not by hue switching

Secondary surface:
- for image button container and small secondary pills

```css
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.10);
border-radius: 16px;
```

### 8.4 Top navigation visual spec

#### Container
- same as neutral glass UI shell
- radius: `22px`

#### Inactive item

```css
text: rgba(255,255,255,0.65);
icon: rgba(255,255,255,0.60);
```

#### Active pill

```css
background: rgba(255,255,255,0.12);
border: 1px solid rgba(255,255,255,0.18);
border-radius: 18px;
box-shadow: 0 4px 12px rgba(0,0,0,0.10);
```

#### Active item

```css
text: rgba(255,255,255,0.92);
icon: rgba(255,255,255,0.90);
```

### 8.5 Bottom input bar visual spec

#### Container
- same as neutral glass UI shell
- radius: `27px`

#### Text

```css
primary: rgba(255,255,255,0.92);
secondary: rgba(255,255,255,0.65);
```

#### Mic

```css
color: rgba(255,255,255,0.90);
```

#### Image icon

```css
color: rgba(255,255,255,0.60);
```

#### Image button container

```css
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.10);
border-radius: 16px;
```

### 8.6 Listening state visual spec

#### Label

```css
Listening...
color: rgba(255,255,255,0.96);
```

#### Bar glow

```css
box-shadow: 0 0 20px rgba(255,255,255,0.15);
```

#### Mic glow

```css
0 0 12px rgba(255,255,255,0.16),
0 0 20px rgba(255,255,255,0.08);
```

#### Internal pulse

```css
linear-gradient(
  90deg,
  transparent,
  rgba(255,255,255,0.08),
  transparent
);
opacity: 0.03–0.06;
```

Rules:
- animation must remain slow and calm
- no neon effect
- no cyber or sci-fi glow

### 8.7 Whisper text visual spec

Default:

```css
color: rgba(255,255,255,0.92);
```

Optional whisper surface:

```css
background: rgba(40,44,52,0.24);
border: 1px solid rgba(255,255,255,0.10);
backdrop-filter: blur(8px);
border-radius: 16px;
```

### 8.8 Adaptation rule

```text
DO NOT sample background colors
DO NOT recolor UI
ONLY switch overlay mode
```

This is the only allowed adaptive behavior in V1.

### 8.9 Forbidden

Do not:
- use bright white glass UI
- use blue / purple / green themed shells
- tint the nav or input shell based on scene hue
- use neon glow
- use harsh dark opaque bars
- use SaaS-style surfaces

The nav and input bar must always remain:
- neutral
- semi-transparent
- softly blurred
- readable on top of both bright and dark scenes

---

## 9. State machine and timing

Input area only allows these states:
- Default
- Listening
- Listening Hint
- Typing
- AI Reply

### 9.1 Default
- label: `Tap to speak`

### 9.2 Listening
- entered by tapping the input bar or mic
- label changes to `Listening...`
- mic brightens
- input bar glow starts immediately

### 9.3 Listening Hint
- after `1200ms` in listening state
- label changes to `Tap to write`

### 9.4 Silence timeout
- if no valid speech is detected for `4 seconds`, return to Default
- silence timeout is measured from the last detected speech activity

### 9.5 Typing
- entered by tapping the input bar while in listening hint state, or by explicit text-entry action
- if keyboard is dismissed and input is empty, return to Default
- if input contains text, remain in Typing until submit or clear

### 9.6 AI Reply
- entered after valid voice input or text submit
- AI responds with voice
- after playback ends, return to Default

---

## 10. Voice pipeline rules

### 10.1 Microphone permission
- request microphone permission when user enters listening state
- if permission is denied, do not enter listening
- show lightweight message: `Microphone access is off`
- offer fallback: `Type instead`

### 10.2 Microphone interruption
- if listening is interrupted by system/browser/device state, stop listening immediately
- return to Default
- show: `Microphone interrupted`

### 10.3 ASR display
- do not show live realtime transcription on the Talk screen
- do not show full ASR text on the Talk screen
- optional lightweight state text such as `Processing...` is allowed

### 10.4 ASR failure
- if no valid speech is recognized, do not enter AI Reply
- return to Default
- show: `I didn’t catch that`
- allow retry or switch to typing

### 10.5 TTS playback
- AI replies with voice
- TTS playback can always be interrupted by new user action

### 10.6 TTS interruption
- if user taps the input bar, mic, typing entry, or image upload while TTS is playing, stop TTS immediately
- transition directly into the new input state

### 10.7 Audio concurrency
- do not allow simultaneous recording and TTS playback in V1
- entering listening always stops active TTS first

---

## 11. Input field behavior

### 11.1 Typing field model
- single-line input in V1
- no multi-line expansion in V1

### 11.2 Enter behavior
- pressing Enter submits the text
- Enter does not create a new line

### 11.3 Maximum input length
- maximum input length: `200 characters`

### 11.4 Keyboard behavior
When the keyboard appears:
- keep the top nav fixed
- keep the background visually stable
- move only the bottom interaction layer upward
- keep whisper text `16px` above the input bar

### 11.5 Background while typing
- background panning is disabled while typing

### 11.6 Dismiss keyboard behavior
- if keyboard is dismissed and input is empty, return to Default
- if keyboard is dismissed and input has content, remain in Typing and preserve content

### 11.7 After successful text submit
- clear input
- dismiss keyboard
- enter AI Reply

### 11.8 Image upload in Typing state
- image upload remains available in Typing state
- selecting an image must preserve typed text

---

## 12. Image upload rules

### 12.1 Quantity
- V1 supports only a single image per input turn

### 12.2 Supported formats
- jpeg
- png
- webp

### 12.3 Maximum original file size
- `10MB`

### 12.4 Client compression
Compress before upload:
- max long edge: `1600px`
- target upload size: around `1MB` or less
- quality: `0.78–0.85`

### 12.5 Send behavior
- selecting an image does not auto-send it
- after selection, show a lightweight thumbnail preview

### 12.6 Preview
- thumbnail size: `72x72`
- corner radius: `14px`

### 12.7 Remove
- the image preview must include a remove action
- removing the image does not clear typed text

### 12.8 Uploading state
- show a subtle loading overlay on the thumbnail
- optional text: `Uploading...`

### 12.9 Upload failure
- keep the thumbnail visible
- show `Upload failed`
- allow `Retry` or `Remove`

### 12.10 Listening interaction
- in Listening state, tapping image upload stops listening first

### 12.11 Supported input combinations
- text only
- image only
- text + one image

---

## 13. Background resources and overlay mapping

Use manual mapping.  
Do not choose overlay mode by runtime pixel analysis in V1.

Each scene config must include:
- `id`
- `title`
- `image`
- `overlayMode`

Allowed overlayMode values:
- `light`
- `dark`

Initial mapping:
- `seaside_night` → `dark`
- `seaside_day` → `light`
- `rainforest_day` → `dark`
- `snow_mountain_day` → `light`

Default scene:
- `seaside_day`

### 13.1 Scene config example

```ts
export type OverlayMode = "light" | "dark";

export type SceneConfig = {
  id: string;
  title: string;
  image: string;
  overlayMode: OverlayMode;
};

export const sceneConfigs: SceneConfig[] = [
  {
    id: "seaside_night",
    title: "Seaside Night",
    image: "/scenes/seaside-night.jpg",
    overlayMode: "dark",
  },
  {
    id: "seaside_day",
    title: "Seaside Day",
    image: "/scenes/seaside-day.jpg",
    overlayMode: "light",
  },
  {
    id: "rainforest_day",
    title: "Rainforest Day",
    image: "/scenes/rainforest-day.jpg",
    overlayMode: "dark",
  },
  {
    id: "snow_mountain_day",
    title: "Snow Mountain Day",
    image: "/scenes/snow-mountain-day.jpg",
    overlayMode: "light",
  },
];

export const defaultSceneId = "seaside_day";
```

---

## 14. Exception state copy

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

## 15. Typography

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

---

## 16. Fixed component behavior

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

## 17. Locked baseline summary

This product is fixed in V1 as:
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

Do not invent additional visual systems outside this document.
