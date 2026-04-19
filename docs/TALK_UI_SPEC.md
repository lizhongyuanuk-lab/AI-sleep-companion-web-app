# Talk 页面 UI / 交互 Spec

本文件是仓库内 Talk 页面当前唯一有效的 UI / 交互真源。

- 外部来源：`Talk页面_UI交互Spec_Final_v2.docx`
- 补充参考：`Talk_Codex_Revision_Prompt_v2.txt`
- 产品配套真源：[docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)

## 0. 文档定位

约束优先级固定如下：

1. [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
2. 本文件
3. 视觉参考

解释：

- PRD 决定页面有什么
- 本文件决定这些内容怎么显示、怎么动、怎么切状态
- 视觉参考只借 shell language，不借产品功能集合

## 1. 参考边界与实现原则

只允许借用以下视觉 / 交互语言：

- Replika 风格的 compact capsule controls
- 低刺激 hierarchy
- 同一家族的 material / blur / low-shadow 语言

明确禁止：

- 借用对方产品的功能集合
- 借用 transcript-first 内容结构
- 在默认 Talk 主页面重新引入 visible user bubbles
- 在顶部导航内塞入 settings

## 2. 页面设计目标

Talk 首屏必须同时满足：

1. 像 ambient companionship surface，而不是 message-history screen
2. bottom dock 是最强交互锚点
3. voice 是默认可见路径，typing 是隐藏 fallback
4. 顶部导航在存在左侧独立 settings button 的前提下仍然可读
5. transient AI speaking feedback 可见，但不得形成 transcript stack

## 3. 参考视口与响应式基线

| 字段 | 要求 |
| --- | --- |
| Reference viewport | `393 x 852`，mobile-first Web / PWA baseline |
| Global horizontal inset | `16px` |
| Responsive principle | 只缩尺寸，不改骨架；不得换成 tab bar；不得把 settings 合并进 nav |
| Theme rule | Light / Dark 只换皮肤，不换骨架、层级与位置 |

## 4. 设计 token

| 类别 | 规则 |
| --- | --- |
| Corner radius | `12 / 18 / 24 / 999px`，主 shell 用 `999px`，内容卡片用 `24px` |
| Spacing | 仅使用 `4 / 8 / 12 / 16 / 20 / 24px` |
| Typography | nav label `13px medium`；dock primary label `18px medium`；state hint `12px regular`；content text `15px regular` |
| Icons | nav `18px`；shell utility `18px`；mic `20px`；stroke `1.75px` |
| Motion | `180ms` standard；`220ms` dock；`280ms` theme fade；`1600ms` mic pulse |

## 5. 色彩与材质 token

顶部导航、设置按钮、底部 dock 必须共享同一 shell typography / color family。

| token | Light | Dark |
| --- | --- | --- |
| Shell text primary | `#353C4D` | `#F5F7FF` |
| Shell text secondary | `#717A8E / #939AAC` | `#AAB2C8 / #9FA8C1` |
| Transient feedback bg | `rgba(220,226,238,0.74)` | `rgba(60,69,100,0.44)` |
| Transient feedback text | `#60697E` | `#E3E8F7` |
| Transient waveform | `#6F7BA0` | `#C3CAE0` |
| Presence glow | `#EAF2FB` soft bloom | `#2F3E6C` soft bloom |

Shell surface 规则：

- top nav
- settings button
- bottom dock

这三者必须使用同一 shell material family，包括：

- 低对比 border
- `20px-22px` blur
- 低阴影
- 同一 radius family

## 6. 页面结构骨架

Talk 页面从上到下固定为以下结构：

1. background layer
2. top control band
3. ambient hero / room header
4. transient AI voice feedback area
5. bottom voice-first dock
6. temporary overlay layer

关键原则：

- 主页面不是 transcript stack
- 大部分屏幕应该被 atmosphere、presence 与 whitespace 占据
- lower content field 只能承载 temporary AI feedback，不能承载 persistent chat history

## 7. 布局尺寸

### 7.1 Top control band

| 项目 | 规则 |
| --- | --- |
| Available width | `361px` at `393px` viewport |
| Top offset | `12px + safe area` |
| Horizontal inset | `16px` |

### 7.2 Settings button

| 项目 | 规则 |
| --- | --- |
| Size | `52 x 52px` |
| Radius | `999px` |
| Icon size | `18px` |
| Position | `left: 16px`, `top: 12px + safe area` |
| Placement | 必须位于 nav capsule 外部左侧 |

### 7.3 Gap

- settings button 与 nav capsule 间距固定 `8px`

### 7.4 Top nav capsule

| 项目 | 规则 |
| --- | --- |
| Size | `301 x 52px` |
| Position | `left: 76px`, `top: 12px + safe area` |
| Radius | `999px` |
| Item count | 只能有 4 个 item |
| Order | `Talk / Memory / Sleep / Room` |

Top nav 内部规则：

- active item height `40px`
- inner horizontal padding `6px`
- item gap `2px`
- icon `16px`
- label `12px medium`
- icon-label gap `4px`
- inactive padding `8px`
- active padding `10px`

### 7.5 Main content area

| 项目 | 规则 |
| --- | --- |
| Ambient header block | 距 top control band 下方 `20px` 起 |
| Room header inset | 使用左侧 `16px` 内容对齐线 |
| Transient feedback mount | 位于 lower content field，距离 bottom dock 上方 `88-116px` |

### 7.6 Bottom dock

| 项目 | 规则 |
| --- | --- |
| Size | `361 x 52px` at `393px` viewport |
| Position | `left: 16px`, `bottom: 12px + safe area` |
| Shell family | 必须与 top nav 和 settings button 一致 |

Bottom dock 内部规则：

- internal horizontal padding `10px`
- internal gap `8px`
- image attach hit area `40 x 40px`
- image attach icon `18px`
- mic hit area `40 x 40px`
- mic visual circle `36 x 36px`
- mic icon `20px`
- primary label `18px medium`
- primary zone min width `180px`

## 8. 顶部导航区域规则

顶部导航包含且仅包含以下 4 项：

- Talk
- Memory
- Sleep
- Room

明确要求：

1. 左侧必须保留独立 settings button
2. nav capsule 与 bottom dock 必须读起来像 matched pair
3. selected item 使用 inner active capsule treatment
4. 不得使用 underline tab
5. 不得使用高饱和 fill
6. 不得把 settings 合并进 nav

## 9. 主内容区规则

### 9.1 Allowed

- room label
- room title
- room subtitle / description
- whitespace
- subtle presence glow
- transient AI voice feedback
- lightweight contextual hint

### 9.2 Not allowed

- persistent user bubbles
- alternating user / AI message stack
- readable transcript list 作为主内容模式
- 多个 response cards 纵向累计

Talk 主内容必须保持 calm、sparse、breathable。

## 10. Room header 规则

| 项目 | 规则 |
| --- | --- |
| Room label | 小字号 uppercase 或 small caps，使用 shell secondary color |
| Room title | 主标题，强可读权重 |
| Room subtitle | 最多 1 行或 2 行短描述 |
| Placement | ambient content field 左上区域，不得与顶部控制带冲突 |

## 11. Transient AI voice feedback 规则

这个模块是 `temporary AI speaking indicator`，不是 bubble，也不是 transcript card。

允许的视觉表达：

- restrained waveform
- subtle ripple
- optional one-line AI summary
- subtle speaking indicator

必须满足：

1. 只在 `processing` 或 `ai_speaking` 相关状态显示
2. waveform 低振幅、低频、短长度
3. 不得使用 full-screen visualizer
4. 不得使用 full-width chat card
5. speaking 结束后淡出
6. 不能累计成历史列表
7. 挂载在 dock 上方，不得引发布局 reflow

## 12. Media / attachment 规则

Image attach 是弱次要能力。

允许：

- 在 dock 左侧图标上显示 attached 状态
- 以 overlay 方式打开 image preview

禁止：

- 默认主页面展示 large attachment composer
- 让 image attach 与 mic 拥有同等视觉权重

## 13. Bottom voice dock 规则

默认 bottom dock 只能包含：

1. 左侧弱 image attach
2. 中间主标签 `Tap to speak`
3. 右侧强 mic

禁止项：

- visible typing entry
- text caret
- standard input field
- emoji row
- generic chat toolbar composition

主标签规则：

- `Tap to speak` 是最强视觉锚点
- 它必须像 voice action，而不是 input placeholder

## 14. Theme / overlay 规则

Light / Dark 仅允许改变：

- color
- transparency
- blur
- atmosphere

不允许改变：

- skeleton
- placement
- control hierarchy

theme 来源必须消费以下元数据字段：

- `overlay_mode`
- `shell_text_profile`
- `feedback_contrast_profile`

不得使用运行时图像分析作为真源。

## 15. 状态可见性矩阵

| 状态 | 可见结果 |
| --- | --- |
| `idle_default` | nav visible；settings visible；room header visible；无 transcript；dock 显示 image attach + Tap to speak + mic |
| `standby_for_voice` | dock 轻微强调；mic ready；可有小型 hint |
| `voice_recording` | 标签变为 `Listening...`；mic pulse；image attach 变弱；不出现 transcript |
| `processing` | dock 固定；仅弱 responding hint；无 spinner-dominant screen；可准备 transient feedback |
| `ai_speaking_transient_feedback` | dock 保持可见；dock 上方出现 transient AI feedback；不出现 stacked bubbles |
| `image_attached` | image icon 进入 attached state；Tap to speak 与 mic 仍可见 |
| `error_permission` | mic 不可用；页面内联 permission hint；页面仍可用 |
| `error_network` | shell 稳定；仅弱网络提示；不回退 transcript |
| `quiet_mode` | hints 减弱；无 persistent feedback；dock 继续可见 |

Typing 只能存在于 hidden / secondary state，不能存在于默认可见 dock。

## 16. 交互流

### 16.1 首次进入

用户看到：

- 左侧 settings button
- 右侧 compact top nav
- room header
- calm whitespace
- bottom voice dock

### 16.2 Tap to speak

- bottom dock 进入 `voice_recording`
- 主内容区不转换为 chat list

### 16.3 录音结束

- 页面切到 `processing`
- dock 固定不动
- 不显示 transcript placeholder

### 16.4 AI speaking

- dock 上方出现 transient AI voice feedback
- 说完后 feedback 淡出

### 16.5 Image attach

- dock 进入弱 attached state
- voice path 仍为主路径

### 16.6 Settings

- 点击左侧 settings button
- 打开 compact floating sound-control panel
- 锚定在按钮下方

### 16.7 Typing

- 不在默认 dock 暴露
- 如果未来启用，也只能存在于 secondary state 或 overlay path

## 17. Inline hint 挂载规则

inline hints 必须挂载在 lower content field 且位于 bottom dock 上方。

禁止：

- 把 hints 挂到 top nav 内
- 把 hints 塞进 `Tap to speak` 文案区

文案要求：

- short
- non-technical
- low-stimulation

## 18. PRD -> UI 映射

| PRD 规则 | UI 结果 |
| --- | --- |
| voice-first, text-fallback | 默认 dock 不显示 typing entry |
| no visible user transcript | 默认主页面不显示 persistent user bubbles |
| image is secondary | image attach 保持左侧弱权重 |
| top four destinations fixed | settings 独立在 nav capsule 外 |
| asset-defined theme | overlay / shell / feedback profile 由元数据驱动 |

## 19. Strict prohibitions

以下实现一律视为不合格：

1. 把 Talk 做成 visible transcript stack
2. 默认主页面显示 persistent user text
3. 默认 bottom dock 暴露 visible typing entry
4. 把 settings 放进 4-item nav capsule
5. settings button、top nav、bottom dock 使用不同 shell family
6. 为 Light / Dark 设计两套不同 skeleton
7. 使用 runtime-guessed theme mode
8. 让 transient AI feedback 累计为 visible history

## 20. Developer alignment checklist

实现前后都要确认：

1. top nav、settings button、bottom dock 使用同一套 outer shell language
2. top nav 只包含 `Talk / Memory / Sleep / Room`
3. 默认 dock 只包含 weak image attach、`Tap to speak`、strong mic
4. 默认 Talk state 无 visible typing entry
5. 默认主页面无 persistent user transcript
6. transient AI voice feedback 是 temporary 的，不形成 history
7. settings panel 是 compact、floating、instant-apply
8. theme mode 来自 room / background metadata

## 21. 页面级验收标准

Talk UI 合格至少满足：

1. 首屏明确读作 voice-presence page，而不是 message-history page
2. settings button、top nav capsule、bottom dock 明显属于同一 shell family
3. 顶部导航在 4 个 item + 独立 settings button 的前提下仍可读
4. bottom dock 语音优先，默认不暴露 typing
5. persistent user transcript 不存在于默认主页面
6. transient AI voice feedback 只在应出现时出现，并能干净淡出
7. Light / Dark 只换皮肤，不换骨架
8. 状态切换时页面不会漂移成 generic chat UI

## 22. Responsive rules

| 断点 | 规则 |
| --- | --- |
| `393-430px` | settings `52x52`；nav `301x52`；dock `361x52`；nav label `12px`；dock label `18px` |
| `375-392px` | settings `50x50`；nav height `50px`；nav width = `viewport - 32 - 50 - 8`；dock height `50px` |
| `360-374px` | settings `48x48`；nav height `48px`；nav width = `viewport - 32 - 48 - 8`；nav label `11.5-12px`；dock height `48px` |

硬约束：

1. 不得换成 tab bar
2. 不得把 settings 移进 nav capsule
3. 不得换 page skeleton
4. 不得让 label wrap
