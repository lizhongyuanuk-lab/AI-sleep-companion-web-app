# Talk 页面主文档：PRD + 非 UI 交付规范

v5 · 单模式 voice-presence 修订版

本文件是 Talk 页面当前唯一有效的产品真源，用于定义页面定位、范围、运行时合同、声音控制、埋点、fallback、技术边界与页面级验收标准。

本次修订重点：

- Talk 被明确收束为 `voice-presence page`，而不是 `transcript-first chat page`
- 移除 dark / light 双模式与 overlay metadata 合同，改为单一固定视觉模式
- 所有 speaking-related 动态反馈只允许发生在 bottom dock 内
- 默认主界面不显示用户文字、不显示 typing、不显示 dock 外 transient feedback 层
- 顶部导航、settings button、bottom dock 继续保持同一套 shell language

## 1. 文档角色与优先级

Talk 页面产品约束优先级固定如下：

1. 本文件
2. [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)
3. [docs/ACCEPTANCE.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/ACCEPTANCE.md)
4. [docs/TRACKING.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TRACKING.md)
5. [docs/HANDOFF.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/HANDOFF.md)

解释：

- 本文件决定 Talk 是什么、有什么、不能有什么
- UI spec 只决定这些内容如何呈现和如何交互
- 历史旧版 Talk 文档和聊天式实现假设均不得继续作为产品真源

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

### 4.1 In Scope

- 房间背景与氛围层
- 房间身份信息，仅低位 `room name`
- dock-contained voice feedback
- bottom voice dock
- 顶部弱设置入口
- 低噪声状态 hint

### 4.2 Out Of Scope

- persistent visible user bubbles
- alternating transcript stack
- default typing field
- transcript-first 阅读行为
- full-screen settings page
- dock 外独立 transient feedback layer

## 5. 核心体验原则

Talk 页面必须满足以下原则：

1. `Voice presence over transcript`
2. 默认主页面 `No visible user text`
3. `Typing is fallback, not default affordance`
4. `Background-led mode, not chat-led mode`
5. 顶部导航、设置按钮、底部 dock 使用同一套 shell language
6. 页面采用 `single fixed visual mode`，不做 dark / light 或 runtime theme switching
7. 所有 speaking-related 动态反馈只允许发生在 bottom dock 内
8. shell language 只对齐参考图与目标 shell treatment，不对齐旧版实现、旧文档或其他产品的功能集合
9. UI 只做轻度背景适配；背景不合格时优先重生成，而不是加重 UI 壳层补锅

## 6. 页面入口与上下游合同

Talk 页面运行时至少消费以下字段：

| 字段 | 定义 |
| --- | --- |
| `session_id` | 当前 Talk 会话的稳定标识 |
| `entry_source` | `onboarding \| room \| resume_last_session` |
| `room_id` | 当前房间标识 |
| `room_name` | 当前房间展示名称 |
| `background_asset` | 背景素材引用 |
| `voice_profile_id` | TTS / playback 使用的 companion voice 标识 |
| `sound_defaults` | 房间级默认的 BGM / white noise 配置 |
| `ui_shell_token_set_id` | 可选，固定使用的单模式 shell token 套件标识 |

不可协商的合同规则：

- 不再使用 `overlay_mode`
- 不再使用 `shell_text_profile`
- 不再使用 `feedback_contrast_profile`
- 前端不做 runtime 图像分析来决定 theme / mode
- Talk 只消费单一固定视觉模式所需字段，不再存在双模式合同

## 7. 运行时状态定义

Talk 的主交互状态机以 bottom dock 为主要承载体：

| 状态 | 定义 |
| --- | --- |
| `idle_default` | 默认 voice-presence 表面，dock 可见，无 transcript |
| `standby_for_voice` | 准备开口，dock 轻微强调 |
| `voice_recording` | 正在录音，反馈集中在 dock 内 |
| `processing` | 从用户输入切换到 AI 响应，不显示 chat placeholder |
| `ai_speaking` | AI 正在说话，反馈仅通过 dock 内 waveform / glow / label 表达 |
| `image_attached` | 弱附件状态，语音路径仍是主路径 |
| `error_permission` | 麦克风不可用，页面内联给出说明 |
| `error_network` | 网络问题，壳层保持稳定 |
| `quiet_mode` | 降刺激模式，dock 仍可用 |

约束：

- bottom dock state machine 是主要状态载体
- 主页面不得再发明 transcript-driven 状态模型
- 默认主 CTA 为一体化 `[mic icon + label]`
- 不再保留独立 standalone mic button
- `voice_recording` 状态下的 glow 仅代表“用户正在说话”
- `processing` 与 `ai_speaking` 不得在 dock 外生成独立反馈层

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
2. AI 说话时的动态反馈只允许通过 dock 内 waveform、mic glow 与 CTA 文案状态表达
3. 状态 hints 必须轻量、低刺激、非工程化
4. 不允许把 `processing`、`recognition`、`request failed` 等工程词做成主要可见文案
5. 顶部导航、底部 dock、底部左侧 room name 与 settings panel 文本必须属于同一套 shell typography system
6. room identity 只以低位 room name 形式出现，不再使用顶部大标题 room header

底部主 CTA 文案策略：

- `idle_default` / `standby_for_voice`：`Tap to speak`
- `voice_recording`：`Listening...`
- `processing`：不在中心区显示 processing 文字；dock 内仅允许轻量状态表达
- `ai_speaking`：不新增摘要文案，主要依靠 dock 内 speaking waveform 与 glow 表达

不再允许的 speaking feedback 形式：

- dock 外 subtle waveform
- optional one-line summary
- temporary hint 作为 speaking feedback 主形式

## 10. 错误与 Fallback 策略

| 场景 | 要求 |
| --- | --- |
| permission failure | 麦克风入口变弱或不可用，页面内联提示，不跳转 |
| network failure | 保持 room 与 shell 稳定，仅提供弱 retry guidance，不回退成 transcript |
| AI speaking interruption | dock 内 speaking 状态立即收起或切回 idle / standby，不生成外部反馈层 |
| settings panel failure | panel 可关闭并给出轻量错误文案，但 Talk 主页面必须稳定 |

## 11. 埋点与验证

关键事件：

- `talk_page_open`
- `settings_opened`
- `voice_recording_started`
- `voice_recording_completed`
- `dock_speaking_feedback_visible`
- `dock_speaking_feedback_completed`
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
2. Talk 采用 `single fixed shell token set`，不存在 theme mode 切换
3. 默认 dock 不得暴露 visible typing entry
4. 顶部导航、设置按钮、底部 dock 不得出现不同 material system
5. sound control 不得做成 Talk 流程里的独立 full-screen page
6. 默认主 CTA 不得拆成 `Tap to speak` 与独立 right-side mic button
7. 不得为了背景适配而显著加厚 nav / dock 或加入重型遮罩条
8. 不得在 bottom dock 之外生成 waveform、summary、transient feedback 条或其他 speaking 特效层

## 13. 当前实现纠偏目标

基于本次新文档与参考图，当前仓库里的 Talk 需要完成以下结构纠偏：

1. 顶部导航胶囊需要明显放大并保持可读性
2. 顶部导航改为 4-item icon-only 结构
3. 主内容区不能再表现成 transcript / chat screen
4. 默认主页面不能再渲染 visible user text bubble
5. bottom dock 必须从 chat toolbar 改为 voice-first dock
6. typing 必须隐藏到 secondary state，不能作为默认显性入口
7. top nav、settings button、bottom dock 必须统一为一套 outer shell family
8. AI feedback 必须改为 dock-contained voice feedback，不是 transcript bubble 或 card stack
9. room name 必须下沉到底部左侧，移除顶部 hero 式 room title
10. 页面仅保留单模式固定视觉，不再保留 overlay metadata 逻辑
11. 不再使用 3D icon，改为单色线性 icon

## 14. 页面级验收标准

Talk 页面验收通过至少满足：

1. 用户在数秒内能理解 Talk 是 voice-presence 页面
2. 默认主页面不显示用户文本
3. 所有 speaking-related 动态反馈仅在 dock 内出现，且不累计成历史
4. 顶部导航、设置入口、底部 dock 明显属于同一 shell family
5. 页面仅使用单一固定视觉模式，不存在 asset metadata 驱动的 Light / Dark
6. 音频设置 instant apply，且不破坏 Talk 主表面
7. 默认主 CTA 为 `[mic icon + label]`
8. room name 作为低位标签出现在底部左侧
9. 背景不合格时优先重生成，而不是通过重型 UI 覆盖修复
10. 顶部导航为 4-item icon-only 结构，底部默认无 typing 入口

## 15. 背景准入与 UI 责任边界

Talk 背景生成必须优先服务沉浸感和 UI 可读性。

产品规则：

1. 自动筛掉顶部亮度过高的背景，或在生图阶段直接控制顶部亮度
2. UI 只做轻度适配，不承担修复任意背景的主要责任
3. 如果背景需要明显加重 nav / dock / 遮罩才能保可读性，该背景应重生成或拒绝进入 Talk

UI 责任边界：

- Talk UI 允许轻度调整 shell opacity、blur、scrim、vignette、shadow、inner highlight
- 这些调整必须保持低存在感
- 用户不应明显感知界面在“补背景”

## 16. 与历史版本相比的主要变化

本次同步相较于旧版 Talk 文档，明确做出以下收束：

1. 移除 transcript-first 的页面理解
2. 移除默认主页面上的 visible user text
3. 把持久历史责任移交给 Memory 或二级表面
4. 把 bottom dock 提升为主要交互状态载体
5. 把 transient AI voice feedback 收束为 dock-contained speaking feedback
6. 新增独立 settings button 与 floating sound-control panel
7. 移除 overlay metadata 合同与 Light / Dark 双模式
8. 明确主 CTA 为一体化 `[mic icon + label]`
9. 明确 room name 低位下沉到底部左侧
10. 明确 shell 仅按本次单模式参考图与新 UI spec 落地
