# Talk 页面 UI / 交互 Spec

iPhone 16 Portrait · Single-Mode Final Draft

本文件是仓库内 Talk 页面当前唯一有效的 UI / 交互真源。

- 外部来源：`Talk_Page_UI_Interaction_Spec_English_Final.docx`
- 产品配套真源：[docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
- 视觉主参考：本轮用户确认的暖白玻璃单模式 room scene 参考图

## 0. Document Positioning

本文件定义 Talk 页面的最终 UI 结果、布局结构、组件规则、状态行为与交互流，供 design、front-end 和 Codex 直接使用。

约束优先级固定如下：

1. [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
2. 本文件
3. 已确认的本轮视觉参考图

解释：

- PRD 决定页面有什么
- 本文件决定这些内容怎么显示、怎么动、怎么切状态
- 历史 Talk UI 说明、旧版冷蓝壳层、旧版 3D icon 方向均不再作为实现依据

## 1. Core Page Definition

Talk main screen 必须表现为：

- immersive room scene
- voice-first companionship surface
- 由 bottom voice control dock 锚定的固定模式页面

主页面不得表现为：

- visible user transcript
- alternating user / AI message stacks
- default typing input
- IM-style conversation layout

### 1.1 Allowed On The Main Surface

- room background / ambient scene
- top navigation
- top-left settings button
- room name
- bottom voice-first dock
- extremely subtle state changes inside the dock only

### 1.2 Not Allowed On The Main Surface

- persistent visible user transcript
- stacked message bubbles
- scrollable chat history as the main content mode
- default text input affordance
- `Tap to write` / `Typing...`
- any separate voice feedback effect layer outside the dock

## 2. Reference Viewport And Baseline

当前版本锁定到 iPhone 16 portrait：`393 × 852px`。

当前阶段规则：

- 先锁定 iPhone 16 portrait 结果
- responsive behavior 后续再处理，不属于本次主 revision

Page insets：

- left `16px`
- right `16px`
- top `12px + safe area`
- bottom `12px + safe area`

## 3. Single-Mode Fixed Rule

本版本只使用一个固定视觉模式：

- no dark / light mode switch
- no brightness-based UI adaptation
- no runtime image analysis for theme switching
- no dynamic recoloring based on room image content

单一固定 token system 必须同时应用于：

- settings button
- top navigation
- room name
- bottom dock
- settings panel

## 4. Fixed Color And Material Tokens

固定基础 token：

- `shell-bg = rgba(255,255,255,0.22)`
- `shell-border = rgba(255,255,255,0.18)`
- `shell-text-primary = #786E66`
- `shell-text-secondary = #8C837C`
- `shell-active-bg = rgba(255,255,255,0.48)`
- `shell-highlight = rgba(255,245,224,0.52)`

Dock / state token：

- `wave-idle = rgba(255,255,255,0.18)`
- `wave-active = rgba(255,255,255,0.34)`
- `mic-icon = #A57B52`
- `error-bg = rgba(255,240,240,0.38)`
- `error-text = #8A5C5C`

Material token：

- `shell-blur = 20px`
- `shell-shadow = 0 8px 24px rgba(0,0,0,0.08)`
- `shell-border-width = 1px`

Hard rules：

- 不得从 room image 动态取色
- 不得让不同组件定义不同 glass system
- 不得让 top 和 bottom UI 看起来像两个产品

## 5. Shared Shell System

以下组件必须属于同一 shell family：

- top-left settings button
- top navigation capsule
- bottom voice dock
- settings panel

它们必须共享：

- 同一 material family
- 同一 border logic
- 同一 blur logic
- 同一 subtle shadow logic
- 同一 icon / text color family
- 同一 large-radius capsule philosophy

但它们不需要完全一致于：

- width
- internal layout
- information density
- hierarchy strength

## 6. Top Area Layout

顶部区域包含两个独立控制：

1. top-left settings button
2. top-center navigation capsule

它们属于同一 top control band，但不属于同一 layout box。

## 7. Top-Left Settings Button

| 项目 | 规则 |
| --- | --- |
| Position | `x = 16px`, `y = 12px + safe area` |
| Size | `52 x 52px` |
| Radius | `999px` |
| Style | 与 nav 和 dock 同一 shell family；icon-only；无文字 |
| Icon | `18px`，`2px` stroke，颜色使用 `shell-text-primary` |
| Interaction | 打开 compact floating settings panel；不跳转页面；不变成 full-screen page |

## 8. Top Navigation Capsule

| 项目 | 规则 |
| --- | --- |
| Position | `x = 76px`, `y = 12px + safe area` |
| Size | `301 x 52px` |
| Radius | `999px` |
| Content | 固定 4 项：`Talk / Room / Memory / Sleep` |
| Presentation mode | `icon-only` |

内部规格：

- item hit area height = `40px`
- inner horizontal padding = `6px`
- item gap = `2px`
- icon size = `16px`
- icon stroke = `2px`

Active item：

- 默认 `Talk`
- active chip height = `40px`
- active chip width = `62px`
- radius = `999px`
- bg = `shell-active-bg`

Rules：

- no visible text labels
- no second line
- 不得转换成 tab bar
- 不得增加第五项
- 不得把 settings 合并进 nav capsule
- 不得使用 3D icon，统一使用单色线性 icon

## 9. Main Scene Area

主场景区是页面的 primary visual surface，承载：

- room background
- spatial atmosphere
- large breathing space
- subtle AI presence

主规则：

- room scene 必须保持 primary visual subject
- 不显示 transcript
- 不显示 stacked bubbles
- 不显示 dock 外 voice feedback layer

所有动态反馈必须只在 bottom dock 内解决。

视觉方向：

- low-noise
- low-contrast
- softly warm room interior
- scenic background

## 10. Room Name

| 项目 | 规则 |
| --- | --- |
| Purpose | 识别当前 room |
| Position | 位于 bottom dock 上方，左对齐 dock 左边 |
| Measurements | 距 dock `28px` |
| Style | `13px / 16px / 500` |
| Color | `shell-text-secondary` |

Rules：

- single line only
- not a chip
- not a bubble
- not a hero title
- no subtitle

## 11. Bottom Voice Dock

这是页面最重要的交互元素。它是 `voice-first control surface`，不是 chat input bar。

| 项目 | 规则 |
| --- | --- |
| Position | 水平居中；`bottom = 12px + safe area` |
| Outer size | `361 x 48px` |
| Radius | `999px` |
| Style | 与 top UI 同一 shell family；存在感略强于 top nav；但不能厚重，也不能像 control console 或 messaging toolbar |

## 12. Bottom Dock Internal Structure

默认结构固定为：

`[mic + Tap to speak] [weak image attach]`

### 12.1 Trailing Side

- weak image button
- hit area = `40 x 40`
- icon size = `18px`
- low emphasis
- no glow
- secondary only

### 12.2 Primary CTA

Primary CTA 必须是一体化的：

- integrated mic
- `Tap to speak`
- subtle waveform
- 所有内容都在 dock 内

具体规则：

- CTA container size = `220 x 40px`
- mic circle = `36 x 36px`
- mic circle radius = `18px`
- mic bg = `shell-highlight`
- mic glow 只允许在 voice states 出现
- mic icon = `20px`, `2.5px` stroke, `#FFFFFF`
- label = `Tap to speak`
- label style = `16px / 20px / 500`
- label color = `shell-text-primary`
- mic 与 label 水平排列，gap = `8px`
- label 不得像 text input placeholder
- 默认态不得出现 caret

### 12.3 Waveform Rules

Waveform 是唯一允许的 animated voice feedback form，且只能出现在 bottom dock 内。

状态规则：

- Idle：几乎静止，极低对比，极低 opacity
- Standby for Voice：略微更可见
- Voice Recording：明显增强，可做 gentle animation
- Processing：waveform 略微变软；不允许外部 loading layer
- AI Speaking：切换成 speaking rhythm；仍只存在于 dock 内；不允许第二反馈区；不允许 AI summary line

Hard rules：

- main content area 不得出现 waveform
- 不得有 dock 外 transient feedback strip
- 不得有 bubble-form AI feedback
- 不得有 one-line AI summary

## 13. Bottom Dock Default Hidden Content

以下内容默认必须隐藏：

- typing icon
- text placeholder
- caret
- `Tap to write`
- `Typing...`
- transcript
- user text
- AI bubble
- any extra speaking feedback layer

## 14. Bottom Dock State Machine

| 状态 | 结果 |
| --- | --- |
| `idle_default` | weak image button + integrated mic + `Tap to speak` CTA + very subtle waveform；typing、transcript、bubbles 和 extra feedback 全隐藏 |
| `standby_for_voice` | mic glow 略增强；waveform 略增强；label 保持 `Tap to speak` |
| `voice_recording` | label 变为 `Listening...`；mic glow 明显增强；waveform 动画增强；image button 变弱；不出现 user text / speech-to-text / chat bubbles |
| `processing` | 不在中心区显示 processing 文字；dock 内只允许轻量过渡状态；无大 loading、无外部反馈区、无 bubble placeholder |
| `ai_speaking` | dock 保持可见；waveform 切到 speaking rhythm；mic 可感知但不达到 recording 级 glow；无 AI summary line；无 transcript；无 dock 外特效 |
| `image_attached` | image button 进入 attached state；primary CTA 保留；无 large attachment composer |
| `error_permission` | mic 变弱；dock 上方出现 subtle error hint |
| `error_network` | waveform 停止或减弱；dock 上方出现 subtle error hint |
| `quiet_mode` | waveform 几乎不可见；dock 保留；页面更安静 |

## 15. Settings Panel

| 项目 | 规则 |
| --- | --- |
| Trigger | top-left settings button |
| Form | compact floating panel，不是 full-screen |
| Position | anchored below settings button，left-aligned |
| Size | width = `280px`；min height = `220px`；max height = `320px`；radius = `24px` |
| Style | 同一 shell family，但 opacity 略高于 nav / dock 以保证可读性 |
| Content | companion voice volume、background music volume、white noise volume、environment sound on/off、white noise type、sound mix preset |
| Interaction | instant apply；无 Save button；outside tap 关闭；再次点击 settings 关闭；environment sound 为 `On` 时恢复当前 room 默认环境音，`Off` 时关闭环境音 |

## 16. Hint And Error Mounting Rules

所有 hint 和 error 只允许挂载在 bottom dock 上方，靠近 dock，不允许跑到 main content center。

样式规则：

- height = `24px-28px`
- radius = `999px`
- normal hint bg = `shell-bg`
- normal hint text = `shell-text-secondary`
- error bg = `error-bg`
- error text = `error-text`

限制：

- lightweight only
- no large toast
- 不得遮挡 top navigation

## 17. Hard Prohibitions

以下实现一律视为不合格：

1. 在 Talk main screen 显示 visible user transcript
2. 把 Talk 实现成可阅读 chat history surface
3. 默认暴露 typing entry
4. 把 bottom dock 做成标准 input bar
5. 在 dock 外放 waveform 或 transient feedback
6. AI speaking 时显示 AI summary line
7. 让 image button 比 primary CTA 更强
8. 把 settings 合并进 top navigation capsule
9. 把 settings 做成 full-screen
10. 让组件使用不同 shell system
11. 基于 background image 做 runtime recoloring
12. 加入 PRD 未定义的聊天模块

## 18. Acceptance Criteria

Talk UI 合格至少满足：

1. 第一印象是 room scene surface，而不是 chat page
2. settings 位于 top-left 且独立存在
3. top navigation 是固定四项的 icon-only 结构
4. room name 位于 dock 上方左侧
5. bottom dock 更薄、更轻
6. 默认 dock 只显示 weak image action 和 integrated mic + `Tap to speak` CTA
7. typing 默认不可见
8. transcript 默认不可见
9. 所有 animated voice feedback 只发生在 dock 内
10. dock 外不存在额外 feedback layer
11. top 与 bottom controls 属于同一 shell family
12. 页面只使用 one fixed mode，不做 runtime theme switching

## 19. Review Note

本稿锁定到当前 single-mode、image-aligned 方向。

如果后续引入以下任何变化：

- responsive behavior
- dark / light variants
- visible typing secondary state

都必须作为单独 patch 明确追加，而不能由实现自行推断。
