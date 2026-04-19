# Talk 页面主文档：PRD + 非 UI 交付规范

用于仓库内实现的 Talk 主文档版本。内容基于用户提供的最新版 Talk 主文档整理，作为当前 `/talk` 的 PRD 与非 UI 真源。

Version: Final v3

## 1. 文档角色与最终文档结构

Talk 页面当前只保留两份核心规范：

- 文档 A：本文件，负责 Talk 的定位、目标、边界、数据契约、页面级文案、埋点、fallback、技术边界与验收口径。
- 文档 B：[docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)，负责页面结构、组件层级、布局、交互表现、状态可见性与视觉规则。

配套依赖：

- Memory 文档继续作为 Talk 写入边界与回看方式的外部依赖。

明确边界：

- 本文件不负责逐像素布局与动画稿。
- 状态流转不再独立拆第三份文档，统一由本文件和 UI Spec 一起约束。

## 2. 页面定位

### 2.1 Talk 页是什么

Talk 页面是用户与 AI 陪伴真正发生的核心页面，不是普通聊天软件的消息列表页。

它承接：

- Room 提供的场景感
- Onboarding 给出的陪伴策略

它的核心体感不是“AI 很聪明”，而是：

- 这里有人在
- 我可以开口
- 我也可以安静待着

### 2.2 Talk 页不是什么

Talk 不是：

- 微信式高密度消息页
- 效率型语音工具页
- 功能大杂烩页面
- 实时智能表演舞台

稳定优先于炫技。

### 2.3 用户与页面目标

目标用户：

- 睡前入睡受阻
- 脑内停不下来
- 轻焦虑
- 或只想有人安静陪着的用户

用户目标：

- 降低开口门槛
- 被接住
- 逐步放松
- 在不想说话时仍保留陪伴感

产品目标：

- 建立连续语音陪伴体感
- 降低首轮开口难度
- 形成停留
- 为后续 Memory 与长期关系打基础

页面成功标准：

- 用户知道怎么开始
- 愿意开第一句
- AI 说完后仍像同一段陪伴，而不是一轮轮语音消息

### 2.4 与上游 / 下游页面的关系

- `Onboarding -> Talk`：Onboarding 输出陪伴策略，不输出固定房间。Talk 只消费结果，不向用户暴露标签化解释。
- `Room -> Talk`：Room 决定背景与场景壳子，`companion_strategy` 决定对话层行为。两者可组合，但不得写死绑定。
- `Talk -> Memory`：Talk 前台只提供低打扰的“被记住”感，不展开复杂分析。结构化沉淀归 Memory。
- `Talk -> Analytics`：Talk 需要产出首轮开口、连续语音开启、异常退出、打断等核心埋点，用于验证 MVP。

## 3. 核心体验原则

| 原则 | 落地要求 |
| --- | --- |
| 语音优先，文字兜底 | 默认鼓励用户直接说话，但必须保留文字入口；AI 默认语音回复。 |
| 连续会话，而非对讲机 | 点一次进入会话态，依赖停顿切轮，AI 回复后自动回到待命态。 |
| 低刺激，不堆历史 | 默认不展示长历史消息流；历史只服务于连续感。 |
| Room 与策略分离 | `room` 决定空间感；`strategy` 决定说话方式与节奏。 |
| 稳定胜过聪明 | 页面状态要统一、可预期，不能让多个组件各自猜测阶段。 |

### 3.1 语音主流程定义

- 用户进入 Talk 后默认不开麦。
- 用户通过一次明确操作开启持续语音会话。
- 系统通过停顿检测切分一轮输入，不要求每句都显式发送。
- AI 回复完成后自动回到待命态。
- 用户在 AI 说话时重新开口，优先打断 AI 并进入 `listening`。
- 产品体感应接近 GPT / Grok 连续语音，底层第一阶段允许仍是分轮处理。

## 4. 开发就绪结论

当前 Talk 开发前置只依赖：

- 本主文档
- [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)
- Memory 文档

无需再拆出第三份 Talk 专属文档。

## 5. 非 UI 交付规范

### 5.1 页面入口与上下游数据契约

Talk 页面进入、运行、离开三个阶段必须消费和产出的关键字段如下。

#### 页面启动最小字段

| 字段名 | 类型 / 枚举 | 必填 | 来源 | 说明 |
| --- | --- | --- | --- | --- |
| `session_id` | `string` | 是 | Talk 创建或恢复 | 当前会话唯一标识；同一次连续陪伴全程不变。 |
| `entry_source` | `onboarding \| room \| resume_last_session` | 是 | 上游路由 | 页面入口来源，用于开场行为与埋点归因。 |
| `room_id` | `string` | 是 | Room / 路由 | 当前场景唯一标识。 |
| `room_name` | `string` | 是 | Room | 顶部显示名与埋点辅助字段。 |
| `background_asset` | `string` / asset ref | 是 | Room | 背景资源引用，不在 Talk 内部临时推断。 |
| `overlay_mode` | `dark \| light` | 是 | Room / theme layer | 与 neutral adaptive glass UI 保持一致。 |
| `companion_strategy` | `fall_asleep_fast \| soothe_then_chat \| meditate \| quiet_company` | 是 | Onboarding / session restore | 决定开场、语气、回复长度与静默节奏。 |
| `voice_profile_id` | `string` | 是 | 配置中心 / 用户设置 | 当前 TTS 声音配置。 |
| `opening_script_variant` | `string` | 否 | 策略层 | 控制首句文案与 A/B 版本。 |
| `memory_write_enabled` | `bool` | 是 | 配置 / 实验开关 | 控制是否允许产生 memory candidate。 |

硬规则：

- 缺失 `room_id`、`companion_strategy`、`voice_profile_id` 时，Talk 不得启动。

#### 运行期唯一真源字段

| 字段 | 类型 | 谁消费 | 规则 |
| --- | --- | --- | --- |
| `session_mode` | `continuous_voice \| text_assist \| quiet_mode` | UI、语音、埋点 | 同一时刻只能处于一个主模式。 |
| `conversation_state` | `opening \| standby \| listening \| processing \| ai_speaking \| typing \| error` | 全页面 | 页面级状态必须单一真源。 |
| `voice_session_active` | `bool` | 底部控件、状态文案、埋点 | 是否已进入持续语音会话态。 |
| `interrupt_allowed` | `bool` | 播放器、录音层 | `ai_speaking` 时是否允许用户插话打断。 |
| `recent_visible_turns` | `int` | 轻历史层 | 控制当前可见最近内容范围。 |
| `fallback_used` | `none \| text \| retry \| keep_quiet` | 埋点、异常层 | 记录是否发生降级路径。 |

#### 输出对象

- `Analytics`：页面打开、状态转换、会话结束等事件与参数。
- `Memory`：满足 Memory 文档规则后的 `memory_candidate`。
- `Session Resume`：用户中途离开并可恢复时需要的 `resume payload`。

### 5.1.1 固定状态与事件命名

固定状态枚举：

- `opening`
- `standby`
- `listening`
- `processing`
- `ai_speaking`
- `typing`
- `quiet_mode`
- `error`

固定会话模式枚举：

- `continuous_voice`
- `typing`
- `quiet_mode`

固定事件枚举：

- `user_tap_start_voice`
- `vad_turn_end`
- `ai_tts_started`
- `ai_tts_finished`
- `user_interrupt`
- `enter_quiet_mode`
- `exit_quiet_mode`
- `activate_typing`
- `exit_page`
- `mic_denied`
- `network_degraded`

这些命名是 Talk 实现与 UI Spec 的唯一合法命名。

### 5.1.2 语音与会话接口最小契约

#### A. 会话启动至少返回

- `session_id`
- `room_id`
- `room_name`
- `background_asset`
- `overlay_mode`
- `companion_strategy`
- `opening_script_variant`
- `voice_profile_id`
- `entry_source`
- `memory_write_enabled`

#### B. STT 单轮结果至少返回

- `turn_id`
- `transcript_text`
- `confidence` optional
- `vad_end_reason` with `pause | manual_stop | interruption`
- `started_at`
- `ended_at`

Talk 前台只消费：

- `transcript_text`
- `vad_end_reason`

#### C. LLM 单轮回复至少返回

- `turn_id`
- `reply_text`
- `reply_mode` with `normal | calming | quiet_ack | fallback`
- `should_write_memory_candidate`
- `memory_candidate_payload` optional
- `interruptible` default `true`

Talk 前台只根据以下字段决定表现：

- `reply_text`
- `reply_mode`
- `interruptible`

#### D. TTS 播报任务至少返回

- `tts_job_id`
- `turn_id`
- `audio_url` or `stream_handle`
- `duration_ms` optional
- `subtitle_text` optional
- `ready_state` with `ready | failed`

如果 TTS `failed`，前台必须退回字幕或文字 fallback，而不是结束整段 session。

#### E. 会话恢复快照至少包含

- `session_id`
- `last_conversation_state`
- `last_session_mode`
- `last_room_id`
- `last_companion_strategy`
- `last_visible_recent_turns` optional
- `resumable_until` optional

#### F. 前台统一消费规则

Talk 页面只依赖以下 7 类前台字段：

- `conversation_state`
- `session_mode`
- `voice_session_active`
- `current_turn_id`
- `current_subtitle`
- `recent_visible_turns`
- `error_surface`

硬规则：

- 即使后端后续扩展字段，前台第一阶段也不得绕过以上最小契约直接读取新字段决定 UI。

### 5.2 页面级内容策略与文案规则

文案层级：

| 层级 | 用途 | 长度规则 | 谁生成 |
| --- | --- | --- | --- |
| 状态文案 | 告诉用户当前页面在做什么 | 常态 2-6 字；异常 6-16 字 | 页面系统文案 |
| 开场文案 | 用户进入 Talk 后的第一句 | 1 句；不超过 22 字 | 页面策略文案 |
| 轻陪伴文案 | Quiet Mode / 待命期的低频存在感 | 1 句；不超过 10 字 | 页面系统文案 |
| 异常恢复文案 | 告诉用户异常与下一步动作 | 1-2 句；不超过 24 字 | 页面系统文案 |

总原则：

- 正常状态使用温柔陪伴型表达
- 权限与网络类异常用更清楚的混合型口吻

禁用表达：

- 技术词直出
- 心理咨询腔
- 过度亲密与依附
- 功能炫耀
- 医疗承诺

#### `companion_strategy` 文案方向

| `companion_strategy` | 开场目标 | 推荐句式 | 不该写成 |
| --- | --- | --- | --- |
| `fall_asleep_fast` | 快速建立放松感 | 今晚我在，我们先慢慢安静下来。 | 先来回答我几个问题，帮助你更快入睡。 |
| `soothe_then_chat` | 先接住，再允许用户慢慢开口 | 你可以慢慢说，我在听。 | 你现在具体因为什么焦虑？ |
| `meditate` | 建立节奏感，减少自由聊天预期 | 我们先把呼吸放慢一点。 | 你想聊什么都可以，我都能接。 |
| `quiet_company` | 不增加任务感，只强调存在 | 现在先这样待着也可以。 | 你不说话我也会一直分析你的状态。 |

#### 页面状态文案

| 页面状态 | 主文案 | 可替换文案 | 说明 |
| --- | --- | --- | --- |
| `opening` | 今晚我在。 | 慢慢来。 | 仅首屏短暂出现；不与大段欢迎词叠加。 |
| `standby` | 我在。 | 你可以继续说。 | 连续语音会话待命态。 |
| `listening` | 我在听。 | 慢慢说。 | 录音中，必须让用户知道系统已在聆听。 |
| `processing` | 稍等一下。 | 我在回应你。 | 避免技术词。 |
| `ai_speaking` | 我在说。 | 先听我一下。 | 仅在需要时可见，不强制长驻。 |
| `quiet_mode` | 我还在。 | 现在这样也可以。 | 低频出现；一次只一句。 |
| `error_retryable` | 刚刚有点不稳。 | 再试一次就好。 | 异常必须指向下一步动作。 |

### 5.3 埋点与验证指标

P0 / P1 关键事件：

- `talk_page_open`
- `talk_session_start`
- `user_first_utterance_started`
- `user_first_utterance_completed`
- `ai_first_response_started`
- `ai_first_response_completed`
- `ai_response_interrupted_by_user`
- `switch_to_text_input`
- `enter_quiet_mode`
- `recent_history_expanded`
- `talk_page_exit`
- `talk_fallback_used`

关键指标：

- 首轮开口率
- 连续语音开启率
- 首轮闭环率
- 平均有效会话时长
- AI 被打断率
- 异常曝光率

### 5.4 异常与 fallback 策略

总原则：

- 异常优先目标不是报错，而是恢复。
- 单轮失败不等于整段会话失败。
- 能留在 Talk 里解决，就不要把用户赶出 Talk。

| 异常类型 | 推荐文案 | 下一步动作 | `fallback_used` |
| --- | --- | --- | --- |
| 麦克风权限未开 | 麦克风打开后，我就能听见你。 | 提供“去打开”和“改为打字” | `text` |
| 刚刚没听清 | 我刚刚没顺利听清，你可以再说一次。 | 留在当前页面，允许重试 | `retry` |
| 网络短时不稳 | 刚刚有点不稳，我们再试一次。 | 保留页面，不强制退出 | `retry` |
| TTS 播放失败 | 这次我没顺利说出来，但我还在。 | 以字幕 / 文本完成本轮回应；保持待命 | `text` |
| 长时间无回应 | 现在先这样也可以。 | 进入 `quiet_mode` 或继续待命 | `keep_quiet` |

禁忌：

- 不要使用全屏错误页覆盖 Talk。
- 不要因为单轮失败直接结束 session。
- 不要把技术错误码暴露给用户。

### 5.5 第一阶段技术边界

必须保证：

- 一次明确操作进入持续语音会话
- 停顿切轮
- AI 回复后自动待命
- 用户插话优先
- 异常可恢复

明确不做：

- 电话级全双工低延迟实时语音
- 智能 UI 自动切换
- 超长历史消息流
- 复杂多角色系统
- 前端自主推断心理标签

单一事实来源：

- `conversation_state`
- `session_mode`
- `voice_session_active`

视觉结果优先：

- 哪些区域始终存在
- 哪些状态显示什么

必须由 UI Spec 写死，不能让 runtime 自行判断页面“更安静”或“更智能”。

## 6. Definition of Done

| 检查项 | 完成标准 | 归属 |
| --- | --- | --- |
| 数据契约 | Talk 进入、运行、离开所需字段已定义，缺失时不允许启动 | 本主文档 |
| 页面级文案 | 开场、状态、异常、quiet mode 均有固定规则与禁用边界 | 本主文档 |
| 埋点 | P0 / P1 事件与公共参数已接入并可回传 | 本主文档 + 开发 |
| fallback | 至少覆盖麦克风、识别失败、网络短时异常、TTS 失败、长时间无互动 | 本主文档 + 开发 |
| 技术边界 | 第一阶段必须做 / 明确不做已对齐 | 本主文档 |
| 状态机 | `continuous_voice` 逻辑已更新进状态定义 | 本主文档 + UI Spec |
| UI / 交互 Spec | 页面结构、组件可见性、布局与交互规则已写死，无显著自由发挥口子 | UI Spec |
| Memory 依赖 | Memory 文档能解释 `memory_candidate` 后续如何处理 | Memory 文档 |

## 7. 开发前置清单

- 产品确认本主文档不再新增新的页面模式与入口枚举。
- 设计完成 UI / 交互 Spec，并在文档内直接包含状态可见性矩阵与最小状态流转表，使用本主文档固定命名。
- 开发使用统一状态源实现 `conversation_state` / `session_mode`。
- 语音接入明确 STT / TTS / LLM 的返回结构。
- QA 按 Definition of Done 与埋点事件进行验收，不以“看起来差不多”作为通过标准。
