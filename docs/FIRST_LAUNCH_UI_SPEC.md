# 首次登录链路 UI / 交互 Spec

for Codex · Web / PWA MVP  
版本：V1.0（与主文档配套）

适用范围：Welcome、Onboarding、Result、create personal room、Room 承接、注册提示与 Room → Talk。

## 1. 文档目的

本文档将首次登录主链路映射为可直接开发的 UI / 交互规范，明确每一步显示什么、点击后发生什么、每个组件依赖哪个数据真源，以及哪些地方禁止 Codex 自由发挥。

本文档默认继承共享设计语言：

- neutral adaptive glass UI
- 移动端优先
- 低刺激
- 避免传统 IM 感

## 2. 页面结构分层

- Layer 0：`FirstLaunchShell`。负责安全区、背景、主内容、底部操作区的统一容器。
- Layer 1：Background Layer。低刺激背景，可有轻微动态，不承载业务逻辑。
- Layer 2：Content Layer。承载 Welcome、Q1、Q2、Result、Create Room Entry、Theme Selection、Generating、Preview 等视图。
- Layer 3：Bottom Action Layer。承载主 CTA、次级操作、返回。
- Layer 4：Overlay Layer。承载 loading、inline error 与轻量过渡。

## 3. 组件清单

### 3.1 `FirstLaunchShell`

- 首次链路统一容器
- 显示条件：`has_completed_first_launch_flow = false` 且当前处于首次链路内
- 依赖：`firstLaunchFlowDraft.current_step` 与 `design_overlay_mode`
- 禁做项：不显示主导航、不显示 Room feed、不显示 Talk 消息区

### 3.2 `WelcomeCard`

- 仅在 `current_step = welcome` 显示
- 内容：标题、轻欢迎语与主按钮“开始”
- 点击后进入 `onboarding_q1`
- 禁做项：不展示注册入口、不展示 room 介绍、不展示功能列表

### 3.3 `StepProgress`

- Welcome 后所有步骤显示
- 只做轻步骤感知
- 不显示长问卷式百分比

### 3.4 `QuestionBlock`

- 在 `onboarding_q1` / `onboarding_q2` 显示
- 包含：`QuestionTitle`、4 个 `OptionCard`、主 CTA、返回按钮（Q2 才显示）
- 数据来源：`FIRST_LAUNCH_ONBOARDING_OPTIONS_V1`

### 3.5 `OptionCard`

- 整卡可点；点击后 `selected`
- 不自动推进
- 状态：`default` / `pressed` / `selected` / `disabled`
- 禁做项：不自动跳下一步、不展开长解释、不使用高刺激光效

### 3.6 `ResultSummaryCard`

- 在 `session_result` 显示
- 内容为轻确认与轻承诺
- 数据来源：`postOnboardingSessionPreset` 派生文案
- 主按钮行为：进入 `create_room_entry`
- 禁做项：不直接进入 Talk、不显示内部字段、不生成报告式内容

### 3.7 `CreateRoomEntryCard`

- 在 `create_room_entry` 显示
- 内容为卖点承接文案与两个操作
- A：生成我的空间 → `select_room_theme`
- B：先看看现成空间 → 进入 Room
- 禁做项：不自动进入生成流程

### 3.8 `ThemeSelectionBlock`

- 在 `select_room_theme` 显示
- 包含问题标题、4 个视觉方向选项、主按钮“生成这个空间”
- 禁做项：不允许自由文本输入、不允许 prompt 编辑、不允许参数设置面板

### 3.9 `RoomGeneratingView`

- 在 `room_generating` 显示
- 内容为低刺激 loading 与一句文案“我在为你准备这个空间”
- 规则：不显示进度百分比，不显示技术状态码，超时后进入 fallback

### 3.10 `RoomPreviewCard`

- 在 `room_generation_preview` 显示
- 内容：预览图、主按钮“使用这个空间”、次按钮“重新生成”、弱按钮“先看其他空间”
- 禁做项：不自动进入 Talk、不直接跳设置页

### 3.11 `RoomFeedWithGeneratedCard`

- 进入 Room 后显示
- 有 generated room 时，feed 第一张卡为 `Your Room`
- 不是弹窗，不自动选中，不自动高亮放大
- 无 generated room 时显示正常 room feed

### 3.12 `GenerateRoomNudge`

- 满足 `has_personal_room = false`、`room_swipe_count >= 3`、`has_shown_generate_room_nudge = false` 时显示
- 内容：`Create your own sleep space` + 按钮“生成我的空间”
- 禁做项：不全屏拦截、不自动触发生成

### 3.13 `RegisterNudge`

- 满足任一软触发或第三次进入兜底触发，且未命中冷却时显示
- 内容：保存你的空间和陪伴进度 + `登录` / `稍后再说`
- 禁做项：不在 Welcome 前、不在 onboarding 中途、不在 Talk 正在进行中硬打断、不做强阻断 full-screen gate

### 3.14 `TalkEntryAction`

- Room 卡片可点击时生效
- 用户 tap 某个 room 进入 Talk
- 数据动作：合并当前 active preset + room 数据，Talk 成功进入后将 preset 标记为 `consumed`

## 4. 布局规则

- 通用布局：移动端优先、单列、内容区居中偏上、底部 CTA 遵守安全区
- Welcome / Onboarding / Result / Create Entry：主内容卡置于中上区域，底部按钮区域固定，不出现多列复杂布局
- Theme Selection：4 个选项纵向排列，不做 `2 × 2` 网格，不加二级说明面板
- Preview：预览图居中，下方按钮组清晰分层，一主两辅即可
- Room 承接：generated room 是 feed item，不是 modal；generate nudge 为轻提示，不替代 room 列表
- RegisterNudge：采用轻量 `bottom sheet / modal`，不全屏遮断，不阻断用户继续浏览 Room

## 5. 状态可见性矩阵

| 运行状态 | WelcomeCard | QuestionBlock | ResultSummaryCard | CreateRoomEntryCard | ThemeSelectionBlock | RoomGeneratingView | RoomPreviewCard | RoomFeedWithGeneratedCard | GenerateRoomNudge | RegisterNudge |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `welcome` | 显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `onboarding_q1` | 不显示 | 显示 Q1 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `onboarding_q2` | 不显示 | 显示 Q2 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `session_result` | 不显示 | 不显示 | 显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `create_room_entry` | 不显示 | 不显示 | 不显示 | 显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `select_room_theme` | 不显示 | 不显示 | 不显示 | 不显示 | 显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `room_generating` | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 显示 | 不显示 | 不显示 | 不显示 | 不显示 |
| `room_generation_preview` | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 显示 | 不显示 | 不显示 | 不显示 |
| `room_page` 有 generated room | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 显示 | 条件不满足则不显示 | 按触发规则 |
| `room_page` 无 generated room 且 `swipe < 3` | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 显示 | 不显示 | 按触发规则 |
| `room_page` 无 generated room 且 `swipe >= 3` | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 不显示 | 显示 | 显示 | 按触发规则 |

## 6. 交互流转

1. 跳过 personal room 路径：Welcome → Q1 → Q2 → Result → Create Room Entry → 先看看现成空间 → Room → 用户 tap room → Talk。
2. 生成成功路径：Welcome → Q1 → Q2 → Result → Create Room Entry → 生成我的空间 → Theme Selection → Generating → Preview → 使用这个空间 → Room（第一张为 Your Room）→ 用户 tap → Talk。
3. 生成后跳过使用：Preview → 先看其他空间 → Room。
4. 生成失败路径：Generating → failed → 用户可重试或跳过 → Room。
5. Room 内二次引导生成：Room（无 generated room）→ `swipe_count >= 3` → GenerateRoomNudge → 点击 → 进入 create room 分支。
6. 注册软提示路径：personal room 成功后、Talk 达到价值点后（延迟到退出 Talk / 回到 Room）、第三次进入兜底条件满足时，展示 RegisterNudge。

## 7. 动效规则

- 总原则：动效用于帮助切换，不用于制造兴奋感
- Welcome / Q1 / Q2 / Result / Create Entry：淡入 + 轻微位移；无大幅缩放；无弹跳
- Theme Selection → Generating：CTA 点击后淡出到 loading；不做“生成魔法”表演
- Generating → Preview：预览图淡入；按钮组延迟出现
- Room 承接：generated room 卡片自然进入 feed，不做自动吸附放大
- RegisterNudge：轻量上滑 / 淡入，不遮住整个房间列表，不突然打断当前滚动手势

## 8. 文案挂载点

### 8.1 固定文案来源

- Welcome 标题 / 说明
- Q1 / Q2 题目与选项
- create room entry 文案
- theme selection 文案
- generating 文案
- preview 按钮文案
- generate nudge 文案
- register nudge 文案

### 8.2 派生文案来源

- Result 页文案来自 `postOnboardingSessionPreset`
- Room 轻承接文案来自 preset，但不得复用 Result 原文
- RegisterNudge 文案来自 `trigger_type` 模板，不由模型生成

### 8.3 禁做项

- 不允许组件本地拼装文案
- 不允许根据设备或浏览器随机改写
- 不允许调用模型润色首次链路文案

## 9. 边界与禁做项

- 不把 create personal room 并成 onboarding 第三题
- 不在 Result 页直接进入 Talk
- 不在 Room 自动推荐或高亮某个 room
- 不自动选中 generated room
- 不允许自由文本 prompt 输入
- 不在首次链路中插入设置页
- 不在 Preview 页自动开始语音
- 不在 Room 浏览中修改 preset
- 不在 Talk 中重算 preset
- 不在 Talk 过程中强弹注册全屏拦截
- 不允许 guest 无限生成 personal room
- 不重复三处承接文案

## 10. 开发对齐清单

### 10.1 数据对齐

- `has_completed_first_launch_flow`
- `firstLaunchFlowDraft`
- `postOnboardingSessionPreset`
- `generatedPersonalRoomRecord`
- `auth_status`

以上均作为唯一真源使用。

### 10.2 交互对齐

- onboarding 不自动推进
- Result 主按钮不进 Talk
- create room 为可选分支
- Room 是统一入口
- 用户主动 tap 才进 Talk

### 10.3 生命周期对齐

- `preset` 的 `active / consumed / expired` 正常转换
- generated room 本地保留 `7 天`
- 注册后 guest 资产正确绑定账号
- 新 onboarding 覆盖旧 `active / expired preset`

### 10.4 UI 对齐

- 不出现传统 IM 感
- 不出现 room 推荐感
- 不出现 prompt 工具感
- generated room 作为 feed item 呈现
- RegisterNudge 轻量、不强拦截

### 10.5 验收对齐

- 首次路径、跳过路径、生成路径、失败路径、注册提示路径全部跑通
- Room → Talk 正确透传
- Talk 不重算 preset
- 注册不阻断首次体验
