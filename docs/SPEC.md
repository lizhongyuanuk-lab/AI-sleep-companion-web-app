# Talk 页面主文档：PRD + 非 UI 交付规范

本文件是仓库内 Talk 页面当前唯一有效的 PRD 与非 UI 规范真源。

- 外部来源：`Talk页面主文档_PRD+非UI交付规范_v4.docx`
- 本次同步范围：Talk 产品定位、页面边界、运行时合同、声音控制、埋点、fallback、技术边界与页面级验收口径
- 配套 UI 真源：[docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

## 1. 文档角色与优先级

Talk 页面产品约束优先级固定如下：

1. 本文件
2. [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)
3. [docs/ACCEPTANCE.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/ACCEPTANCE.md)
4. [docs/TRACKING.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TRACKING.md)
5. [docs/HANDOFF.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/HANDOFF.md)

解释：

- 本文件决定 Talk 是什么、有什么、不能有什么。
- UI spec 决定这些内容怎么显示、怎么交互、怎么切状态。
- 旧版 Talk 文档、旧实现里的聊天式假设、历史临时文案，均不得继续作为产品真源。

## 2. 页面定义

Talk 是一个 `voice-presence companionship page`，不是 `transcript-first chat page`。

默认主页面必须优先呈现：

- room atmosphere
- AI presence
- voice-first control surface

默认主页面不得优先呈现：

- 持久可见的用户消息气泡
- 用户 / AI 交替堆叠的 transcript
- 默认可见的 typing 输入栏
- 以阅读历史消息为主的页面逻辑

深度历史不属于 Talk 主页面。持久回看属于 `Memory` 或二级表面。

## 3. 用户目标、产品目标与成功标准

### 3.1 用户目标

用户进入 Talk 后，应当在极短时间内理解：

- 这里是一个安静的陪伴表面
- 我可以直接开口
- 即使不打字，页面也完整可用

### 3.2 产品目标

Talk 的产品目标是：

- 建立夜间连续语音陪伴习惯
- 降低第一句开口门槛
- 维持低刺激、房间感优先的主表面
- 让 AI 的存在感强于 transcript 的存在感

### 3.3 成功标准

用户应在数秒内理解主操作是 `speak`，而不是 `read` 或 `type`。

## 4. Talk 主页面范围

### 4.1 In scope

- 房间背景与氛围层
- 房间身份信息
- transient AI voice feedback
- bottom voice dock
- 顶部弱设置入口
- 低噪声状态 hint

### 4.2 Out of scope

- persistent visible user bubbles
- alternating transcript stack
- default typing field
- transcript-first 阅读行为
- full-screen settings page

## 5. 核心体验原则

Talk 页面必须满足以下原则：

1. `Voice presence over transcript`
2. 默认主页面 `No visible user text`
3. `Typing is fallback, not default affordance`
4. `Background-led mode, not chat-led mode`
5. 顶部导航、设置按钮、底部 dock 使用同一套 shell language
6. Light / Dark 只换皮肤，不换骨架
7. overlay mode 由房间素材元数据提供，不允许运行时自由猜测

## 6. 页面入口与上下游合同

Talk 页面运行时至少消费以下字段：

| 字段 | 定义 |
| --- | --- |
| `session_id` | 当前 Talk 会话的稳定标识 |
| `entry_source` | `onboarding \| room \| resume_last_session` |
| `room_id` | 当前房间标识 |
| `room_name` | 当前房间展示名称 |
| `background_asset` | 背景素材引用 |
| `overlay_mode` | `light \| dark`，由素材元数据定义 |
| `shell_text_profile` | 顶部导航、设置按钮、底部 dock 使用的文字对比方案 |
| `feedback_contrast_profile` | transient AI voice feedback 的对比度方案 |
| `voice_profile_id` | TTS / playback 使用的 companion voice 标识 |
| `sound_defaults` | 房间级默认的 BGM / white noise 配置 |

不可协商的合同规则：

- `overlay_mode`
- `shell_text_profile`
- `feedback_contrast_profile`

这三个字段必须来自房间或背景素材元数据，前端直接消费，不得把运行时图像分析作为真源。

## 7. 运行时状态定义

Talk 的主交互状态机以 bottom dock 为主要承载体：

| 状态 | 定义 |
| --- | --- |
| `idle_default` | 默认 voice-presence 表面，dock 可见，无 transcript |
| `standby_for_voice` | 准备开口，dock 轻微强调 |
| `voice_recording` | 正在录音，反馈集中在 dock 内 |
| `processing` | 从用户输入切换到 AI 响应，不显示 chat placeholder |
| `ai_speaking` | AI 正在说话，可出现短暂 voice feedback |
| `image_attached` | 弱附件状态，语音路径仍是主路径 |
| `error_permission` | 麦克风不可用，页面内联给出说明 |
| `error_network` | 网络问题，壳层保持稳定 |
| `quiet_mode` | 降刺激模式，dock 仍可用 |

约束：

- bottom dock state machine 是主要状态载体
- 主页面不得再发明第二套 transcript-driven 状态模型

## 8. Sound / Settings 模块

Talk 页只允许轻量音频设置，不允许展开成深设置体验。

| 字段 | 要求 |
| --- | --- |
| Entry | 顶部控制带左侧独立 settings button，且在 4-item nav capsule 外部 |
| Panel type | 悬浮、紧凑、锚定在 settings button 下方的 floating panel |
| Controls | companion voice volume、background music volume、white noise volume、white noise type、sound mix preset |
| Apply behavior | instant apply，无 save button |
| Persistence | volume 全局持久化，white noise type 支持 room default + global fallback |
| Availability | `idle_default`、`quiet_mode`、`ai_speaking` 可用；`voice_recording` 不可用 |
| Default values | voice 70%，BGM 35%，white noise 45%，preset `Balanced`，type 默认取 room default |

设计意图：

- 这是即时调音面板，不是 full-screen settings
- 不得破坏 Talk 的 ambient companionship feel

## 9. 内容与文案策略

内容策略固定如下：

1. Talk 默认主页面不展示用户发送文本
2. AI 说话时可展示 minimal transient feedback
3. 状态 hints 必须轻量、低刺激、非工程化
4. 不允许把 `processing`、`recognition`、`request failed` 这种工程词直接做成主要可见文案
5. 顶部与底部 shell 文字必须属于同一套字体与对比系统

允许的 transient feedback 形式：

- subtle waveform
- optional one-line summary
- temporary hint

## 10. 错误与 fallback 策略

| 场景 | 要求 |
| --- | --- |
| permission failure | 麦克风入口变弱或不可用，页面内联提示，不跳转 |
| network failure | 保持 room 与 shell 稳定，仅提供弱 retry guidance，不回退成 transcript |
| AI speaking interruption | transient feedback 立即淡出或收起，dock 继续保持主锚点 |
| settings panel failure | panel 可关闭并给出轻量错误文案，但 Talk 主页面必须稳定 |

## 11. 埋点与验证

关键事件：

- `talk_page_open`
- `settings_opened`
- `voice_recording_started`
- `voice_recording_completed`
- `ai_feedback_shown`
- `ai_feedback_completed`
- `image_attach_used`
- `mic_permission_denied`
- `network_error_visible`
- `quiet_mode_entered`

核心指标：

- first voice action rate
- session dwell time
- microphone usage rate
- dock-to-speech conversion rate
- settings usage rate
- error exit rate

## 12. 技术边界

Talk 当前实现必须严格遵守以下边界：

1. 默认布局不得渲染 transcript history
2. theme mode 不得由 runtime image analysis 决定
3. 默认 dock 不得暴露 visible typing entry
4. 顶部导航、设置按钮、底部 dock 不得出现不同 material system
5. sound control 不得做成 Talk 流程里的独立 full-screen page

## 13. 当前实现纠偏目标

基于本次外部 revision prompt，当前仓库里的 Talk 需要完成以下结构纠偏：

1. 顶部导航胶囊需要明显放大并保持可读性
2. 主内容区不能再表现成 transcript / chat screen
3. 默认主页面不能再渲染 visible user text bubble
4. bottom dock 必须从 chat toolbar 改为 voice-first dock
5. typing 必须隐藏到 secondary state，不能作为默认显性入口
6. top nav、settings button、bottom dock 必须统一为一套 outer shell family
7. AI feedback 必须改为 transient voice feedback，而不是 transcript bubble 或 card stack

## 14. 页面级验收标准

Talk 页面验收通过至少满足：

1. 用户在数秒内能理解 Talk 是 voice-presence 页面
2. 默认主页面不显示用户文本
3. transient AI feedback 仅在 speaking-related states 出现，且不累计成历史
4. 顶部导航、设置入口、底部 dock 明显属于同一 shell family
5. Light / Dark 由 room asset metadata 驱动，不是运行时猜测
6. 音频设置 instant apply，且不破坏 Talk 主表面

## 15. 与历史版本相比的主要变化

本次同步相较于旧版 Talk 文档，明确做出以下收束：

1. 移除 transcript-first 的页面理解
2. 移除默认主页面上的 visible user text
3. 把持久历史责任移交给 Memory 或二级表面
4. 把 bottom dock 提升为主要交互状态载体
5. 新增 transient AI voice feedback 概念
6. 新增独立 settings button 与 floating sound-control panel
7. 明确 overlay metadata 来自素材合同，而不是 UI 运行时推断
