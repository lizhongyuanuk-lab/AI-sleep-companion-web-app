# Stage 3 产品逻辑与数据关系完整文档 v0.3

## 0. 文档状态

本文档是 Stage 3 的产品逻辑与数据契约基线文档。

它用于统一以下内容：

1. 产品页面之间的数据流。
2. Onboarding、Room、Talk、Memory、Sleep、Home 的职责边界。
3. 核心 TypeScript 数据对象。
4. Memory 的 Agree / Disagree / Hide 规则。
5. Sleep suggestion 的生成规则。
6. Home 作为轻量默认入口的规则。
7. Analytics 与留存验证指标。
8. Review Worker 的验收标准。

本版本已经根据 review 收敛以下关键问题：

- Onboarding = session preset only，不做长期画像。
- RoomView != RoomSession。
- Hidden Memory = 完全排除后续个性化，不只是 UI 隐藏。
- Talk memory extraction 必须幂等。
- Sleep suggestion 必须有规则优先级。
- App 首屏路由必须有 AppEntryResolver。

## 1. Stage 3 总目标

Stage 3 的目标不是继续优化视觉 UI，而是把产品的数据闭环定下来。

核心闭环：

用户首次进入
  ↓
Onboarding 两个问题
  ↓
生成一次性的 postOnboardingSessionPreset
  ↓
进入 Room 页面
  ↓
Room 展示固定 3 个 room options
  ↓
用户主动 tap 某个 room
  ↓
Talk 消费完整 preset + room_id，开始首会话
  ↓
Talk 结束或用户离开后，自动尝试生成 MemoryItem
  ↓
Memory 页面展示系统观察
  ↓
用户 Agree / Disagree / Hide
  ↓
反馈影响后续 Talk / Room / Sleep suggestion / Home recommendation
  ↓
Sleep 通过早晨 check-in + Talk/Room 行为生成 SleepInsight
  ↓
Tonight's suggestion 展示在 Sleep，并可被 Home 读取
  ↓
Home 作为轻量默认入口，给出下一步行动

## 2. 当前已确认的产品决策

编号
决策
状态

D1
Onboarding 只有两个问题，不扩展第三题
已确认

D2
正确链路是 Onboarding -> Room -> 用户 tap room -> Talk
已确认

D3
Onboarding 不直接进入 Talk
已确认

D4
Onboarding 不推荐 room、不高亮 room、不重排 room
已确认

D5
Onboarding 只生成一次性的 session preset
已确认

D6
Room 展示固定 3 个 room options
已确认

D7
3 个 room options 是固定配置，不是 onboarding 生成物
已确认

D8
用户选择 room 后直接进入 Room/Talk 链路，不做额外确认页
已确认

D9
TalkSession 结束或用户离开页面后触发 MemoryItem extraction
已确认

D10
产品中不存在 MemoryCandidate
已确认

D11
Memory 只允许 Agree / Disagree / Hide，V1 不做 Delete
已确认

D12
Hide 后该 MemoryItem 不再影响后续 Talk / Sleep / Home
已确认

D13
Hide 不等于 Disagree；Hide 是排除，Disagree 是纠错
已确认

D14
Disagree 暂不强制填写原因，但预留 note 字段
已确认

D15
Sleep check-in 先设计为早上填写昨晚情况
已确认

D16
Tonight's suggestion 展示在 Sleep，并允许 Home 读取
已确认

D17
Home 作为轻量默认入口，不做复杂信息流
已确认

## 3. Stage 3 范围

### 3.1 本阶段必须定义

模块
必须定义

App Entry
首屏路由解析：未 onboarding -> Onboarding；active preset -> Room；其他 -> Home

Onboarding
两题、固定选项、固定映射表、session preset 生命周期、fallback、埋点

Room
3 个固定 room options、RoomView、RoomSession、Room -> Talk 透传完整 preset

Talk
TalkEntryContext、TalkSession、首会话 preset 消费、Memory extraction 幂等

Memory
MemoryItem、MemoryFeedback、Agree / Disagree / Hide、Memory CTA

Sleep
早晨 check-in、SleepLog、SleepInsight、Tonight's suggestion 规则优先级

Home
轻量 Next Best Action、HomeRecommendation、默认入口规则

Analytics
ProductEvent、首夜激活、Memory loop、D1/D3/D7、功能去留指标

### 3.2 本阶段不做

不做内容
原因

复杂 onboarding 问卷
当前只允许两题

Onboarding 直接启动 Talk
会破坏 Room 主动 tap 的产品链路

Onboarding 推荐 room
当前 onboarding 输出是 session preset，不是 room recommendation

Room 根据 onboarding 自动高亮 / 重排 / 选择 room
会把 Room 做成推荐页

被动医学级睡眠监测
Web / PWA MVP 不具备稳定能力，也不能产生医疗暗示

可穿戴设备接入
后续阶段再做

外部 push notification
Stage 3 先做 Home 内推荐，不做系统级 push

MemoryCandidate
当前逻辑是 Talk 后直接 MemoryItem + 用户反馈增强/纠正/隐藏

Memory Delete
V1 只做 Hide，避免早期数据链路过复杂

长期用户画像系统
Stage 3 只做可解释的 session / memory / behavior 闭环

## 4. 数据分层原则

Stage 3 必须把数据分层，否则实现时容易混乱。

数据层
说明
典型对象

Local draft
页面中断恢复，短期保留，完成后清除
OnboardingDraft

Session store
当前 session 内有效，跨 Onboarding -> Room -> Talk 传递
OnboardingSessionPreset

Persistent store
长期业务对象
RoomSession、TalkSession、MemoryItem、SleepLog

Derived runtime
根据持久数据生成，可重算
SleepInsight、HomeRecommendation

Analytics store
产品事件与留存验证
ProductEvent

核心规则：

- 不要把 session preset 当长期画像。
- 不要把 onboarding answer 直接当 sleep recommendation 来源。
- 不要把 hidden memory 放进后续 Talk personalization context。

## 5. App Entry Resolver

### 5.1 为什么需要 AppEntryResolver

Home 不只是轻量默认入口，它还是一个独立的 continuation / recovery surface。

但这并不意味着所有“未完成”状态都应该先进 Home。

Stage 3 必须区分两类状态：

- hard incomplete states
- soft incomplete / fallback states

因此 Stage 3 必须定义 App 启动后的初始路由解析规则。

### 5.2 AppEntryState

```ts
type AppEntryState = {
  userId?: string;
  anonymousId?: string;

  hasCompletedOnboarding: boolean;
  activeOnboardingPreset?: OnboardingSessionPreset;
  hasUsableHomeRecommendation: boolean;
};
```

### 5.3 初始路由规则

```ts
function resolveInitialRoute(state: AppEntryState) {
  if (!state.hasCompletedOnboarding) return "/onboarding";

  if (
    state.activeOnboardingPreset &&
    state.activeOnboardingPreset.status === "active"
  ) {
    return "/room";
  }

  return "/home";
}
```

### 5.4 规则说明

用户状态
初始路由

从未完成 onboarding
/onboarding

完成 onboarding，preset active，但还未进入 Talk
/room

onboarding preset consumed / expired
/home

老用户正常回访
/home

### 5.5 hard incomplete vs soft incomplete / fallback

不是每一个 incomplete state 都应该路由到 Home。

hard incomplete states：

- onboarding not completed -> `/onboarding`
- active onboarding preset not consumed -> `/room`

这些状态有明确、强约束的产品主链路，不应被 Home 吸收。

soft incomplete / fallback states：

- sleep check-in missing
- `MemoryItem` has not received feedback
- Tonight's suggestion unavailable
- Sleep data insufficient
- `Room -> Talk` failed
- Memory CTA source was hidden
- active preset expired
- previous flow cannot safely continue

这些状态不要求继续执行单一强链路，而是要求系统提供一个安全、低刺激、可追溯的 next-best-action。

因此，这些 soft incomplete / fallback states 可以路由到 `/home`。

## 6. Canonical Data Contract

建议拆出文件：`docs/stage-3/data-contract.md`

### 6.1 ID 命名规则

对象
ID 前缀
示例

OnboardingSessionPreset
obp_
obp_01hxyz...

RoomView
rv_
rv_01hxyz...

RoomOption
room_
room_quiet_01

RoomSession
rs_
rs_01hxyz...

TalkSession
ts_
ts_01hxyz...

MemoryItem
mem_
mem_01hxyz...

MemoryFeedback
mf_
mf_01hxyz...

MemoryExtractionRun
mer_
mer_01hxyz...

SleepLog
sl_
sl_01hxyz...

SleepInsight
si_
si_01hxyz...

HomeRecommendation
hr_
hr_01hxyz...

ProductEvent
evt_
evt_01hxyz...

规则：

1. ID 必须全局唯一。
2. ID 不应包含用户可读敏感信息。
3. 配置型 ID 可以稳定，例如 `room_quiet`。
4. session 类对象必须有 `startedAt`，可选 `endedAt`。
5. recommendation / insight / memory / CTA 必须可追溯来源。

### 6.2 通用基础类型

```ts
type ISODateTimeString = string;
type ISODateString = string;
type UserId = string;
type AnonymousId = string;

type UserScoped = {
  userId?: UserId;
  anonymousId?: AnonymousId;
};
```

匿名用户规则：

- `anonymousId` 首次打开生成，存 `localStorage`。
- 清缓存后视为新 anonymous user。
- 用户登录后，可将 `anonymousId` 与 `userId` 绑定，但 Stage 3 不强制实现完整 merge。

### 6.3 OnboardingDraft

用途：页面中断恢复。只存在本地，不作为长期画像。

```ts
type OnboardingDraft = {
  stepIndex: 0 | 1 | 2 | 3;

  q1State?:
    | "sleep_blocked"
    | "overthinking"
    | "anxious_irritated"
    | "lonely_need_presence";

  q2SupportStyle?:
    | "sleep_guide"
    | "comfort_talk"
    | "mindfulness_guide"
    | "quiet_presence";

  draftUpdatedAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
};
```

规则：

1. TTL 推荐 12 小时。
2. Onboarding 完成后清除。
3. 不允许存长期心理标签。
4. 不允许被 Sleep recommendation 读取。

### 6.4 OnboardingSessionPreset

用途：Onboarding -> Room -> Talk 首会话初始化。

```ts
type OnboardingSessionPreset = UserScoped & {
  id: string;
  presetId: string;

  q1State:
    | "sleep_blocked"
    | "overthinking"
    | "anxious_irritated"
    | "lonely_need_presence";

  q2SupportStyle:
    | "sleep_guide"
    | "comfort_talk"
    | "mindfulness_guide"
    | "quiet_presence";

  baseMode:
    | "sleep_guide"
    | "comfort_talk"
    | "mindfulness_guide"
    | "quiet_presence";

  stateModifier:
    | "sleep_blocked"
    | "overthinking"
    | "anxious_irritated"
    | "lonely_need_presence"
    | "neutral_modifier";

  openingCopyId: string;
  replyLengthDefault: "short" | "medium";
  questionBudgetFirst3Turns: 0 | 1 | 2;
  sleepTransitionEnabled: boolean;
  fallbackChain: string[];

  status: "active" | "consumed" | "expired";

  createdAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
  consumedAt?: ISODateTimeString;
};
```

必填字段：

`id`, `presetId`, `q1State`, `q2SupportStyle`, `baseMode`, `stateModifier`, `openingCopyId`, `replyLengthDefault`, `questionBudgetFirst3Turns`, `sleepTransitionEnabled`, `fallbackChain`, `status`, `createdAt`, `expiresAt`

生命周期：

状态
含义

active
Onboarding 完成后，等待 Room -> Talk 消费

consumed
Talk 成功进入首会话后标记，不能复用

expired
超过 TTL，不能继续作为首会话 preset

规则：

1. 同一用户 / `anonymousId` 同一时刻只允许一个 active preset。
2. 新 preset 创建时，覆盖旧 active / expired preset。
3. consumed preset 不复用。
4. Room 只能读取，不允许改写。
5. Talk 必须消费完整 preset，不允许只拿 `presetId` 重新查表。
6. active preset TTL 推荐 30 分钟。

### 6.5 OnboardingContextCard

Review 后决定：不使用 `OnboardingSeedSignal` 作为业务持久对象。

原因：它容易让 Codex 误解为长期画像。

如果 Memory 页面需要展示 onboarding 带来的初始上下文，只允许使用 UI 派生对象 `OnboardingContextCard`。

```ts
type OnboardingContextCard = {
  sourcePresetId: string;
  title: string;
  body: string;

  allowedConsumers: ["memory_preview"];
  disallowedConsumers: [
    "talk_personalization",
    "sleep_recommendation",
    "home_recommendation",
    "long_term_profile"
  ];

  expiresAt: ISODateTimeString;
};
```

规则：

1. 它不是 `MemoryItem`。
2. 它不进入 Talk personalization。
3. 它不进入 Sleep suggestion。
4. 它不进入 `HomeRecommendation`。
5. 它只是 Memory 页面上的轻量上下文展示。
6. 后续长期 `MemoryItem` 必须来自 Talk / Room / Sleep / feedback 等真实行为。

### 6.6 RoomOption

Room 展示固定 3 个 room options。它们是配置，不是 onboarding 生成物。

```ts
type RoomOption = {
  id: string;
  title: string;
  description?: string;
  preset: "quiet" | "warm" | "minimal" | "ambient" | "soft_focus";
  stimulationLevel: "low" | "medium";
  isActive: boolean;
  sortOrder: number;
};
```

规则：

1. 数量固定为 3。
2. Onboarding 不改变数量。
3. Onboarding 不重排。
4. Onboarding 不高亮。
5. Onboarding 不推荐某个 room。

### 6.7 RoomView

`RoomView` 表示用户进入 Room 页面，不等于用户真正使用某个 Room。

```ts
type RoomView = UserScoped & {
  id: string;

  source: "onboarding" | "home" | "manual" | "memory_cta" | "sleep_suggestion";
  onboardingPresetId?: string;
  homeRecommendationId?: string;
  memoryItemId?: string;
  sleepInsightId?: string;

  viewedAt: ISODateTimeString;
};
```

规则：

`RoomView` 只用于页面曝光和入口追踪。

`RoomView` 不用于计算用户在 Room 中被陪伴了多久。

### 6.8 RoomSession

`RoomSession` 表示用户主动 tap 某个 room 后，进入该 room 的使用状态。

```ts
type RoomSession = UserScoped & {
  id: string;
  roomId: string;

  source:
    | "onboarding"
    | "manual"
    | "memory_cta"
    | "sleep_suggestion"
    | "home_recommendation";

  roomViewId?: string;
  onboardingPresetId?: string;
  homeRecommendationId?: string;
  memoryItemId?: string;
  sleepInsightId?: string;

  startedAt: ISODateTimeString;
  endedAt?: ISODateTimeString;
  durationSeconds?: number;

  exitReason?: "tap_to_talk" | "leave_page" | "app_background" | "timeout";

  followedByTalkSessionId?: string;
  followedBySleepLogId?: string;
};
```

规则：

1. 用户只是进入 Room 页面，只创建 `RoomView`，不创建 `RoomSession`。
2. 用户 tap 某个 room，才创建 `RoomSession`。
3. 用户从 room 进入 Talk，`RoomSession` 结束，`TalkSession` 开始。
4. 用户离开 room，也结束 `RoomSession`。

### 6.9 TalkEntryContext

所有进入 Talk 的跨页面入口必须构造 `TalkEntryContext`。

```ts
type TalkEntryContext = {
  source: "home" | "memory" | "sleep" | "room" | "direct";
  sourceId?: string;

  intent:
    | "open_chat"
    | "discuss_memory"
    | "gentle_start"
    | "quiet_company"
    | "sleep_reflection"
    | "tonight_suggestion"
    | "tap_from_room_after_onboarding";

  roomId?: string;
  roomViewId?: string;
  roomSessionId?: string;
  onboardingPresetId?: string;
  onboardingPreset?: OnboardingSessionPreset;

  memoryId?: string;
  sleepInsightId?: string;
  homeRecommendationId?: string;

  suggestedOpening?: string;
  tonePreset?: "neutral" | "gentle" | "quiet" | "reflective" | "direct";
  interactionIntensity?: "low" | "medium" | "high";

  createdAt: ISODateTimeString;
};
```

规则：

1. Memory CTA 进入 Talk 必须带 `memoryId`。
2. Sleep suggestion 进入 Talk 必须带 `sleepInsightId`。
3. Home recommendation 进入 Talk 必须带 `homeRecommendationId`。
4. Room after onboarding 进入 Talk 必须带 `roomId`、`roomSessionId`、完整 `onboardingPreset`。

### 6.10 TalkSession

```ts
type TalkSession = UserScoped & {
  id: string;
  entryContext: TalkEntryContext;

  mode:
    | "open_chat"
    | "sleep_checkin"
    | "gentle_start"
    | "quiet_company"
    | "memory_reflection"
    | "onboarding_first_session";

  startedAt: ISODateTimeString;
  endedAt?: ISODateTimeString;
  durationSeconds?: number;

  messageCount: number;
  userMessageCount: number;
  assistantMessageCount: number;

  sessionSummary?: string;
  emotionalTone?: "calm" | "anxious" | "sad" | "neutral" | "restless";
  sleepRelated?: boolean;

  memoryExtractionRunId?: string;
  memoryExtractionStatus:
    | "not_started"
    | "running"
    | "skipped"
    | "completed"
    | "failed";

  generatedMemoryItemIds?: string[];
};
```

Memory extraction 规则：

条件
结果

`userMessageCount = 0`
skipped

`userMessageCount = 1` 且无明确偏好 / 规律 / 情绪表达
skipped

`userMessageCount = 1` 但有明确偏好 / 纠错 / routine / sleep pattern
可以尝试生成

`userMessageCount >= 2`
可以尝试生成

用户离开 Talk 页面
结束 `TalkSession`，触发 extraction 判断

extraction 失败
`TalkSession` 保存，`status = failed`

### 6.11 MemoryExtractionRun

用于保证 `TalkSession` memory extraction 幂等。

```ts
type MemoryExtractionRun = UserScoped & {
  id: string;
  talkSessionId: string;

  status: "running" | "skipped" | "completed" | "failed";
  reason?: string;

  startedAt: ISODateTimeString;
  completedAt?: ISODateTimeString;

  generatedMemoryItemIds?: string[];
};
```

幂等规则：

- 同一个 `TalkSession` 只能有一个 completed `MemoryExtractionRun`。
- 如果 `status = running`，不得重复启动 extraction。
- 如果 `status = completed`，不得再次生成 `MemoryItem`。
- 如果 `status = failed`，可以由明确 retry action 重试，但必须记录新的 run。

### 6.12 MemoryItem

```ts
type MemoryItem = UserScoped & {
  id: string;

  source:
    | "talk_session"
    | "sleep_log"
    | "room_session"
    | "memory_feedback"
    | "system_inference";

  sourceId: string;

  type:
    | "preference"
    | "support_style"
    | "sleep_pattern"
    | "emotional_pattern"
    | "routine"
    | "avoidance";

  title: string;
  body: string;

  evidence?: {
    sourceText?: string;
    sourceSummary?: string;
    sourceSessionId?: string;
  };

  confidence: "low" | "medium" | "high";
  influenceWeight: number;

  status:
    | "active"
    | "weakened"
    | "contradicted"
    | "hidden"
    | "archived";

  excludeFromPersonalization: boolean;
  hiddenAt?: ISODateTimeString;

  impactRules?: {
    talkTone?: "gentle" | "quiet" | "reflective" | "direct";
    talkIntensity?: "low" | "medium" | "high";
    roomPreset?: "quiet" | "warm" | "minimal" | "ambient" | "soft_focus";
    sleepSuggestionWeight?: number;
  };

  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

状态含义：

状态
含义
是否影响 Talk

active
当前有效，可用于个性化
是

weakened
被削弱，低权重使用
弱影响

contradicted
用户否认该观察，作为纠错约束
只作为负向约束

hidden
用户隐藏，完全排除个性化
否

archived
历史保留，不主动使用
否或极弱

关键规则：

`excludeFromPersonalization = true` 时，该 `MemoryItem` 不得进入 Talk prompt、retrieval context、recommendation context、Sleep suggestion input、HomeRecommendation candidate source。

### 6.13 MemoryFeedback

```ts
type MemoryFeedback = UserScoped & {
  id: string;
  memoryItemId: string;

  action: "agree" | "disagree" | "hide";

  effect:
    | "reinforce_memory"
    | "contradict_memory"
    | "hide_from_memory_page_and_personalization";

  note?: string;
  createdAt: ISODateTimeString;
};
```

规则：

action
MemoryItem 更新

agree
confidence 提高，influenceWeight 提高，status = active

disagree
confidence 降低，status = contradicted，作为纠错约束

hide
status = hidden，influenceWeight = 0，excludeFromPersonalization = true

### 6.14 SleepLog

```ts
type SleepLog = UserScoped & {
  id: string;

  sleepDate: ISODateString;
  checkInDate: ISODateString;
  timezone: string;

  intendedBedtime?: string;
  actualBedtime?: string;
  wakeTime?: string;

  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  easeOfFallingAsleep?: 1 | 2 | 3 | 4 | 5;
  nightAwakenings?: number;
  morningEnergy?: 1 | 2 | 3 | 4 | 5;

  preSleepTalkSessionId?: string;
  preSleepRoomSessionId?: string;

  notes?: string;
  source: "manual_morning_checkin" | "talk_followup" | "room_followup";

  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
```

规则：

1. Sleep check-in 默认早上填写昨晚。
2. `sleepDate` 是睡眠夜归属日期。
3. `checkInDate` 是填写日期。
4. 不得声称 Web 自动监测睡眠。

### 6.15 SleepInsight

```ts
type SleepInsight = UserScoped & {
  id: string;

  period: "3_day" | "7_day" | "14_day";
  startDate: ISODateString;
  endDate: ISODateString;

  title: string;
  body: string;
  confidence: "low" | "medium" | "high";

  basedOn: {
    sleepLogIds: string[];
    talkSessionIds?: string[];
    roomSessionIds?: string[];
    memoryItemIds?: string[];
    memoryFeedbackIds?: string[];
  };

  suggestionType:
    | "keep_consistent_bedtime"
    | "try_gentler_talk"
    | "use_quiet_room"
    | "reduce_late_stimulation"
    | "short_checkin"
    | "no_change_needed"
    | "collect_more_data";

  cta?: {
    label: string;
    target: "talk" | "room" | "sleep_checkin";
    entryContext?: TalkEntryContext;
  };

  createdAt: ISODateTimeString;
};
```

规则：

1. `basedOn.sleepLogIds` 必须存在。
2. 数据不足时 `suggestionType = collect_more_data`。
3. `OnboardingAnswer` / `OnboardingSessionPreset` 不得直接作为 `SleepInsight` 来源。
4. Hidden Memory 不得进入 `memoryItemIds`。

### 6.16 SuggestionRuleResult

用于 Sleep suggestion 多规则冲突时排序。

```ts
type SuggestionRuleResult = {
  suggestionType: SleepInsight["suggestionType"];
  priority: number;
  confidence: "low" | "medium" | "high";
  basedOn: SleepInsight["basedOn"];
  target: "talk" | "room" | "sleep_checkin";
};
```

### 6.17 HomeEntryContext

```ts
type HomeEntryContext = {
  trigger:
    | "app_default"
    | "manual_nav"
    | "fallback"
    | "return_from_failed_route"
    | "expired_onboarding_preset"
    | "empty_state"
    | "memory_hidden"
    | "suggestion_unavailable";

  fallbackReason?:
    | "onboarding_preset_expired"
    | "room_to_talk_failed"
    | "memory_hidden"
    | "sleep_data_insufficient"
    | "suggestion_unavailable"
    | "unknown";

  sourceRoute?: string;
  sourceId?: string;
  createdAt: string;
};
```

规则：

1. `HomeEntryContext` 用于解释 Home 为什么出现，而不是只解释 Home 显示什么。
2. 当 Home 是 fallback / recovery surface 时，必须可追溯触发原因。
3. `HomeEntryContext` 不替代 `HomeRecommendation`；它用于解释 recommendation 所处的进入上下文。
4. `manual_nav` 与 `app_default` 属于正常进入；其余 trigger 可以表达恢复、回退或数据不足状态。

### 6.18 HomeRecommendation

```ts
type HomeRecommendation = UserScoped & {
  id: string;

  type:
    | "complete_onboarding"
    | "enter_room"
    | "review_memory"
    | "start_talk"
    | "sleep_checkin"
    | "tonight_suggestion"
    | "fallback_recovery";

  title: string;
  body?: string;
  priority: number;

  source:
    | "app_entry"
    | "fallback"
    | "onboarding_preset"
    | "memory"
    | "talk_session"
    | "sleep_log"
    | "sleep_insight"
    | "room_session"
    | "system_default";

  sourceId?: string;
  entryContext?: HomeEntryContext;

  cta: {
    label: string;
    target: "onboarding" | "room" | "talk" | "memory" | "sleep";
    entryContext?: TalkEntryContext;
  };

  createdAt: ISODateTimeString;
};
```

规则：

1. 除 `system_default` 外，必须有 `sourceId`。
2. Home 只能做轻量 next-best-action。
3. Home 不做复杂信息流。
4. Home 不做外部 push。
5. Tonight's suggestion 可以被 Home 读取并展示。
6. fallback 类型的 `HomeRecommendation` 必须带 `HomeEntryContext`。
7. Hidden Memory 不得作为 `HomeRecommendation` 来源。

### 6.19 ProductEvent

```ts
type ProductEvent = UserScoped & {
  id: string;

  eventName:
    | "app_opened"
    | "onboarding_view"
    | "onboarding_start_click"
    | "onboarding_q1_select"
    | "onboarding_q1_next_click"
    | "onboarding_q2_select"
    | "onboarding_result_view"
    | "onboarding_enter_room_click"
    | "onboarding_enter_room_success"
    | "onboarding_enter_room_fail"
    | "room_view"
    | "room_view_after_onboarding"
    | "room_option_viewed"
    | "room_session_started"
    | "room_session_ended"
    | "room_enter_talk_after_onboarding"
    | "talk_started"
    | "talk_message_sent"
    | "talk_ended"
    | "memory_item_created"
    | "memory_item_viewed"
    | "memory_feedback_submitted"
    | "memory_cta_clicked"
    | "sleep_checkin_started"
    | "sleep_checkin_completed"
    | "sleep_insight_viewed"
    | "tonight_suggestion_viewed"
    | "tonight_suggestion_clicked"
    | "home_recommendation_viewed"
    | "home_recommendation_clicked";

  page: "home" | "onboarding" | "room" | "talk" | "memory" | "sleep";

  sessionId?: string;

  entityType?:
    | "onboarding_preset"
    | "room_option"
    | "room_view"
    | "room_session"
    | "talk_session"
    | "memory_item"
    | "sleep_log"
    | "sleep_insight"
    | "home_recommendation";

  entityId?: string;

  properties?: Record<string, string | number | boolean>;

  createdAt: ISODateTimeString;
};
```

## 7. Page Data Matrix

建议拆出文件：`docs/stage-3/page-data-matrix.md`

### 7.1 总表

页面
读取
写入
派生
事件
跳转 payload

App Entry
onboarding state、active preset
无
initial route
app_opened
route

Onboarding
options、preset map、draft、app shell
draft、OnboardingSessionPreset
result view model
onboarding_*
Room route

Room
RoomOption[]、active preset、route source
RoomView、RoomSession
room view state
room_*
TalkEntryContext

Talk
TalkEntryContext、eligible memories
TalkSession、MemoryExtractionRun、MemoryItem
opening、mode、summary
talk_、memory_
optional

Memory
MemoryItem[]
MemoryFeedback、MemoryItem status
visible memories、CTA payload
memory_*
TalkEntryContext

Sleep
SleepLog[]、TalkSession、RoomSession、MemoryFeedback
SleepLog、SleepInsight
Tonight's suggestion
sleep_、tonight_
TalkEntryContext or Room entry

Home
HomeRecommendation candidates
ephemeral recommendation
main CTA
home_*
target payload

### 7.2 Onboarding 页面矩阵

类别
内容

读取
`ONBOARDING_OPTIONS_V1`、`ONBOARDING_PRESET_MAP_V1`、`OnboardingDraft`、`entry_source`、`has_completed_onboarding_before`、`device_capabilities`

写入
`OnboardingDraft`、`OnboardingSessionPreset`

派生
`resultViewModel = derive(draft + presetMap)`

事件
`onboarding_view`、`onboarding_start_click`、`onboarding_q1_select`、`onboarding_q1_next_click`、`onboarding_q2_select`、`onboarding_result_view`、`onboarding_enter_room_click`、`onboarding_enter_room_success`、`onboarding_enter_room_fail`

跳转
`/room`

Onboarding -> Room payload：

```ts
type EnterRoomFromOnboardingPayload = {
  source: "onboarding";
  onboardingPresetId: string;
};
```

禁止：

- Onboarding 不构造 `TalkEntryContext`。
- Onboarding 不跳转 Talk。
- Onboarding 不推荐 room。

### 7.3 Room 页面矩阵

类别
内容

读取
`RoomOption[]`、active `OnboardingSessionPreset`、route source

写入
`RoomView`、用户 tap room 后写入 `RoomSession`

派生
当前 room view state、是否带 onboarding preset

事件
`room_view`、`room_view_after_onboarding`、`room_option_viewed`、`room_session_started`、`room_enter_talk_after_onboarding`、`room_session_ended`

跳转
`/talk with TalkEntryContext`

Room -> Talk payload：

```ts
type RoomToTalkPayload = {
  talkEntryContext: TalkEntryContext & {
    source: "room";
    intent: "tap_from_room_after_onboarding" | "open_chat";
    roomId: string;
    roomViewId?: string;
    roomSessionId: string;
    onboardingPresetId?: string;
    onboardingPreset?: OnboardingSessionPreset;
  };
};
```

规则：

1. 如果 active preset 存在且未过期，传完整 preset。
2. 如果 preset expired，不弹错误，Talk 使用默认 room 入口逻辑。
3. Room 不改写 preset。
4. RoomView 不等于 RoomSession。

### 7.4 Talk 页面矩阵

类别
内容

读取
`TalkEntryContext`、eligible Memory context、`RoomSession`、`OnboardingSessionPreset`

写入
`TalkSession`、`MemoryExtractionRun`、可能生成 `MemoryItem`

派生
Talk mode、opening copy、question budget、memory extraction input

事件
`talk_started`、`talk_message_sent`、`talk_ended`、`memory_item_created`

跳转
可回 Memory / Sleep / Home，但 Stage 3 不强制

Talk 生成 Memory 的输入：

```ts
type MemoryExtractionInput = {
  talkSessionId: string;
  userMessageCount: number;
  assistantMessageCount: number;
  sessionSummary?: string;
  entryContext: TalkEntryContext;
};
```

### 7.5 Memory 页面矩阵

类别
内容

读取
`MemoryItem[]`，过滤 hidden

写入
`MemoryFeedback`、更新 `MemoryItem.status / excludeFromPersonalization`

派生
visible memory list、CTA payload、feedback state

事件
`memory_item_viewed`、`memory_feedback_submitted`、`memory_cta_clicked`

跳转
`/talk with TalkEntryContext`

Memory CTA payload：

```ts
type MemoryToTalkPayload = {
  talkEntryContext: TalkEntryContext & {
    source: "memory";
    sourceId: string;
    memoryId: string;
    intent: "discuss_memory" | "gentle_start" | "quiet_company";
  };
};
```

规则：

1. hidden memory 不展示。
2. hidden memory 不产生 CTA。
3. hidden memory 不进入 Talk personalization context。
4. contradicted memory 不作为正向偏好，但可作为纠错约束。

### 7.6 Sleep 页面矩阵

类别
内容

读取
`SleepLog[]`、前一晚 `TalkSession / RoomSession`、`MemoryFeedback`、`SleepInsight`

写入
`SleepLog`、`SleepInsight`

派生
3-day / 7-day summary、Tonight's suggestion

事件
`sleep_checkin_started`、`sleep_checkin_completed`、`sleep_insight_viewed`、`tonight_suggestion_viewed`、`tonight_suggestion_clicked`

跳转
`/talk or /room`

Sleep -> Talk payload：

```ts
type SleepToTalkPayload = {
  talkEntryContext: TalkEntryContext & {
    source: "sleep";
    intent: "tonight_suggestion" | "sleep_reflection";
    sleepInsightId?: string;
  };
};
```

规则：

1. Sleep suggestion 不读取 raw onboarding answer。
2. 数据不足时展示 `collect_more_data`。
3. suggestion 必须可追溯到 `SleepLog / SleepInsight / TalkSession / RoomSession / MemoryFeedback`。
4. Hidden memory 不参与 suggestion。

### 7.7 Home 页面矩阵

类别
内容

读取
onboarding completion state、active preset、`MemoryItem`、`SleepInsight`、`SleepLog`、`RoomSession`、`TalkSession`

写入
通常不写业务对象；可创建 ephemeral `HomeRecommendation`

派生
main recommendation、secondary entry list

事件
`home_recommendation_viewed`、`home_recommendation_clicked`

跳转
target-specific payload

Home 推荐 payload：

```ts
type HomeRecommendationClickPayload = {
  homeRecommendationId: string;
  target: "onboarding" | "room" | "talk" | "memory" | "sleep";
  homeEntryContext?: HomeEntryContext;
  talkEntryContext?: TalkEntryContext;
};
```

规则：

1. Home 是独立 continuation / recovery page。
2. 只展示一个主推荐。
3. 不做复杂 feed。
4. 不做外部 push。
5. recommendation 必须可追溯。

## 8. Memory Rules

建议拆出文件：`docs/stage-3/memory-rules.md`

### 8.1 核心原则

- 没有 `MemoryCandidate`。
- Talk 后直接生成 `MemoryItem`。
- Memory 页面不是待确认列表。
- 用户反馈不是“是否保存”，而是“如何影响后续体验”。

### 8.2 MemoryItem 生成时机

场景
是否触发 extraction

用户点击结束 Talk
是

用户离开 Talk 页面
是

App 进入后台且超过 timeout
是

TalkSession 自动超时
是

`userMessageCount = 0`
否

只有系统欢迎语
否

推荐流程：

TalkSession ended
  ↓
判断是否满足 extraction threshold
  ↓
检查是否已有 running / completed MemoryExtractionRun
  ↓
没有则创建 MemoryExtractionRun
  ↓
满足则异步生成 MemoryItem
  ↓
更新 TalkSession.generatedMemoryItemIds

### 8.3 不生成 MemoryItem 的情况

条件
原因

用户没有发送消息
没有用户信号

用户只点开又退出
信号不足

只有一次非常短的无意义输入
避免过度推断

内容是临时操作指令
不应进入长期观察

内容涉及明显错误推断
避免污染 memory

用户当前处于 Hide / Disagree 类纠错场景
优先处理反馈，不急于生成新 Memory

核心规则：

- 不是每个 `TalkSession` 都必须生成 `MemoryItem`。
- Memory 不是聊天日志摘要。
- Memory 必须是可能影响未来体验的观察。

### 8.4 可生成 MemoryItem 的信号类型

类型
示例

preference
用户明确表达喜欢某种陪伴方式

support_style
用户对 AI 介入方式有偏好

sleep_pattern
连续表达类似睡眠困难

emotional_pattern
多次出现类似情绪状态

routine
用户有固定睡前习惯

avoidance
用户明确不喜欢某种方式

### 8.5 MemoryItem 默认权重

来源
默认 confidence
默认 influenceWeight

明确用户表达
medium
0.6

系统弱推断
low
0.3

多次重复行为
medium
0.5

用户 Agree 后
high
0.9

用户 Disagree 后
low
0 到 0.1

用户 Hide 后
low
0

### 8.6 Agree 规则

Agree 表示用户确认这条观察有用。

更新规则：

```ts
memory.status = "active";
memory.confidence = "high";
memory.influenceWeight = Math.max(memory.influenceWeight, 0.8);
memory.excludeFromPersonalization = false;
```

影响：

1. Talk 可以更自然使用该 Memory。
2. Room 可以在非 onboarding 推荐场景中参考该 Memory。
3. Sleep suggestion 可在结合 `SleepLog / SleepInsight` 时参考该 Memory。
4. Home 可推荐 Review / Continue from memory。

### 8.7 Disagree 规则

Disagree 表示系统观察不准确。

更新规则：

```ts
memory.status = "contradicted";
memory.confidence = "low";
memory.influenceWeight = 0;
memory.excludeFromPersonalization = false;
```

注意：`excludeFromPersonalization = false` 是为了让系统知道这个假设被否定过，从而避免重复同类错误。

影响：

1. 不再作为正向偏好使用。
2. 作为 negative constraint 进入 Talk personalization。
3. Talk 不应重复类似说法。
4. Sleep suggestion 不应基于该 Memory 正向推荐。

### 8.8 Hide 规则

Hide 表示用户不希望这条 Memory 展示，也不希望后续产品使用它。

更新规则：

```ts
memory.status = "hidden";
memory.influenceWeight = 0;
memory.excludeFromPersonalization = true;
memory.hiddenAt = now();
```

强制排除范围：

Hidden `MemoryItem` 不得进入任何 prompt、retrieval context、recommendation context、Talk opening generation、Sleep suggestion rule input、HomeRecommendation candidate source。

影响：

1. Memory 页面不展示。
2. Talk personalization 不读取。
3. Sleep suggestion 不读取。
4. Home recommendation 不读取。
5. 不生成该 Memory 的 CTA。

Hide 与 Disagree 的区别：

动作
是否保留纠错意义
是否进入 Talk personalization

Disagree
是
是，作为负向约束

Hide
否
否，完全排除

### 8.9 Memory retrieval 规则

Talk 读取 Memory 时，必须先过滤：

```ts
const personalizationEligibleMemories = memories.filter(memory =>
  memory.status !== "hidden" &&
  memory.excludeFromPersonalization !== true
);

const usablePositiveMemories = personalizationEligibleMemories.filter(memory =>
  memory.status === "active" &&
  memory.influenceWeight > 0
);

const correctionConstraints = personalizationEligibleMemories.filter(memory =>
  memory.status === "contradicted"
);
```

强制规则：

- hidden memories 不得进入 prompt / personalization context / suggestion rules。
- contradicted memories 只能作为避免重复错误假设的约束。

### 8.10 Memory CTA 构造规则

只有 `status = active` 且 `excludeFromPersonalization = false` 的 `MemoryItem` 可以展示 CTA。

Talk about this

```ts
{
  source: "memory",
  sourceId: memory.id,
  intent: "discuss_memory",
  memoryId: memory.id,
  tonePreset: "reflective",
  interactionIntensity: "medium",
  createdAt: now()
}
```

Try a gentler start

```ts
{
  source: "memory",
  sourceId: memory.id,
  intent: "gentle_start",
  memoryId: memory.id,
  tonePreset: "gentle",
  interactionIntensity: "low",
  createdAt: now()
}
```

Stay with quiet company

```ts
{
  source: "memory",
  sourceId: memory.id,
  intent: "quiet_company",
  memoryId: memory.id,
  tonePreset: "quiet",
  interactionIntensity: "low",
  createdAt: now()
}
```

## 9. Sleep Suggestion Rules

建议拆出文件：`docs/stage-3/sleep-rules.md`

### 9.1 核心原则

- Sleep 页面不是医学级睡眠监测。
- Stage 3 不做被动睡眠检测。
- Sleep suggestion 必须来自用户记录和真实行为数据。
- Onboarding 不得直接影响 Sleep suggestion。

### 9.2 Sleep check-in 时间

已确认：Sleep check-in 先设计为早上填写昨晚情况。

默认逻辑：

用户在 05:00 - 14:00 打开 Sleep 页面
  ↓
提示填写昨晚睡眠
  ↓
sleepDate = 前一晚日期
checkInDate = 今天日期

如果用户晚上补填：

允许补填，但 UI 需要明确是“补充昨晚”还是“记录今晚计划”。

Stage 3 默认只做昨晚 check-in，不做今晚计划表。

### 9.3 SleepLog 日期归属规则

场景
sleepDate
checkInDate

5 月 9 日早上填写 5 月 8 日晚睡眠
2026-05-08
2026-05-09

用户 5 月 10 日补填 5 月 8 日晚
2026-05-08
2026-05-10

用户跨时区
以用户当前 timezone 计算
以用户当前 timezone 计算

必须保留 `timezone` 字段。

### 9.4 数据不足状态

数据不足时，不得伪造趋势。

数据情况
展示

0 条 SleepLog
引导完成第一次 check-in

1 条 SleepLog
只展示单日记录，不生成趋势

2 条 SleepLog
可以展示轻量比较，不生成强 insight

3 条 SleepLog
可以生成 3-day low confidence insight

7 天内至少 5 条 SleepLog
可以生成 7-day medium confidence insight

数据不足 suggestion：

`suggestionType = "collect_more_data"`

### 9.5 3-day insight 规则

触发条件：最近 3 个 `sleepDate` 至少有 3 条 `SleepLog`。

可计算指标：

指标
来源

averageSleepQuality
sleepQuality

averageMorningEnergy
morningEnergy

bedtimeVariance
actualBedtime

averageEaseOfFallingAsleep
easeOfFallingAsleep

preSleepTalkPattern
preSleepTalkSessionId

preSleepRoomPattern
preSleepRoomSessionId

输出 `confidence`：默认 low / medium。

### 9.6 7-day insight 规则

触发条件：最近 7 天内至少 5 条 `SleepLog`。

可生成 insight：

观察
条件

consistent_bedtime_helped
bedtimeVariance 下降且 sleepQuality 上升

quiet_room_correlated
quiet RoomSession 后 sleepQuality 更高

long_talk_may_not_help
长 Talk 后 sleepQuality 下降

short_checkin_helped
短 Talk 后 easeOfFallingAsleep 上升

insufficient_pattern
数据不稳定或样本不足

注意：所有表述必须使用 “seems / based on your check-ins / might help” 式低确定性语言。

### 9.7 Sleep suggestion 优先级

当多个规则同时命中时，按以下优先级处理：

Hidden memory exclusion
> Disagree constraints
> data insufficiency / collect_more_data
> strongest 7-day pattern
> strongest 3-day pattern
> default no_change_needed

含义：

1. Hidden memory 先过滤，不能参与任何规则。
2. Disagree 作为约束，阻止系统重复错误方向。
3. 数据不足时，不生成强建议。
4. 有 7-day pattern 时优先于 3-day pattern。
5. 没有明显信号时使用 `no_change_needed` 或 `collect_more_data`。

### 9.8 Tonight's suggestion rule table

条件
suggestionType
CTA target
文案方向

数据不足
collect_more_data
sleep_checkin
今晚/明早再记录一次，帮助理解节奏

bedtime 波动大
keep_consistent_bedtime
room
今晚尝试更稳定的 wind-down window

Talk 时长过长且次日评分下降
short_checkin
talk
今晚只做一个短 check-in

quiet Room 后评分更高
use_quiet_room
room
今晚从安静陪伴开始

用户 Disagree 过 gentle 相关 memory
short_checkin 或 no_change_needed
talk/room
不强推 gentle start

用户 Hide 过相关 memory
不使用该 memory
根据其他数据
完全排除该 memory

睡眠评分稳定
no_change_needed
room/talk
保持相同节奏

### 9.9 Onboarding 不得直接影响 Sleep suggestion

禁止链路：

Onboarding Q2 = 安静陪我
  ↓
Sleep 页面直接推荐 quiet room

允许链路：

Onboarding Q2 = 安静陪我
  ↓
Room / Talk 首会话使用 quiet preset
  ↓
用户多次使用 quiet room
  ↓
SleepLog 显示使用后评分更好
  ↓
SleepInsight 生成 use_quiet_room suggestion

边界：

- Onboarding 可以影响首会话。
- Onboarding 不可以直接影响长期 Sleep recommendation。

## 10. Home Rules

建议拆出文件：`docs/stage-3/home-rules.md`，也可以合并进 `page-data-matrix.md`。

### 10.1 Home 定位

Home 是独立页面，不是 `/` 的视觉别名。

Home 的产品角色是：

- independent continuation surface
- fallback recovery surface
- next-best-action surface
- low-stimulation recovery entry

Home 出现的场景包括：

- 用户正常回访，系统需要给出一个安全、轻量的下一步
- 用户手动进入 Home
- 之前的 flow 无法安全继续
- 某个依赖 recommendation 的来源已失效、隐藏或数据不足

Home 不是：

- dashboard
- analytics page
- feed
- push notification system
- Talk page
- Room page
- Sleep analytics page

Home 的职责是：

展示一个低刺激、可追溯的主推荐
+
提供少量基础导航入口
+
记录 recommendation view / click
+
在系统无法安全继续前一 flow 时提供恢复入口

Home 不直接管理 Memory。
Home 不展示 transcript。
Home 不做复杂信息流。
Home 不做外部 push。

### 10.2 Home trigger table

trigger
出现语义

`app_default`
正常回访，默认进入 Home

`manual_nav`
用户手动打开 Home

`expired_onboarding_preset`
active preset 已过期，无法继续原首夜链路

`return_from_failed_route`
`Room -> Talk` 或 suggestion transition 失败，需要安全回退

`empty_state`
Sleep / Memory 数据不足，没有更强推荐来源

`memory_hidden`
原本依赖的 Memory CTA 来源已 hidden，当前上下文不可继续使用

`suggestion_unavailable`
Tonight's suggestion 无法生成或当前不可用

规则：

1. `HomeEntryContext.trigger` 解释 Home 为什么出现。
2. `app_default` 和 `manual_nav` 属于正常进入。
3. 其余 trigger 属于 continuation failure、fallback 或 data-insufficient 场景。
4. fallback recommendation 必须可追溯到 `HomeEntryContext`。

### 10.3 Home 推荐优先级

用户状态
主推荐

未完成 onboarding
route 到 `/onboarding`，不进入 Home

有 active onboarding preset 且未进入 Talk
route 到 `/room`，不进入 Home

从失败路由回退
Try again / Enter Room

active preset 已 expired
Enter Room

有新 MemoryItem 未反馈
Review what I noticed

今天早上未完成 sleep check-in
Check in about last night

有可用 SleepInsight
Tonight's suggestion

最近从 Memory CTA 进入 Talk 效果好
Continue from Memory

无明确推荐
Enter Room

规则：

1. 不是所有 incomplete state 都进入 Home。
2. hard incomplete state 必须继续走 `/onboarding` 或 `/room`。
3. soft incomplete / fallback state 可以进入 Home。
4. `HomeRecommendation` 除 `system_default` 外必须有 `sourceId`。
5. fallback 类型 recommendation 必须带 `HomeEntryContext`。
6. Hidden Memory 不得作为 Home recommendation 来源。
7. Tonight's suggestion 可以被 Home 读取。
8. Home 不做外部 push。

## 11. Analytics and Retention

建议拆出文件：`docs/stage-3/analytics-and-retention.md`

### 11.1 事件命名规范

规则：

1. 使用小写 `snake_case`。
2. 事件名必须表达真实链路。
3. 禁止使用暗示错误链路的事件名。
4. Onboarding 不允许出现 `onboarding_start_talk_click`。
5. Room -> Talk with onboarding 必须体现 `after_onboarding`。

禁止事件名：

- `onboarding_start_talk_click`
- `onboarding_talk_enter_success`
- `onboarding_room_recommended`

允许事件名：

- `onboarding_enter_room_click`
- `room_enter_talk_after_onboarding`
- `room_enter_talk_with_onboarding_preset_success`

### 11.2 事件触发表

Onboarding

事件
触发时机
必填 properties

onboarding_view
页面曝光
entry_source

onboarding_start_click
点击开始
entry_source

onboarding_q1_select
选择 Q1
q1_state

onboarding_q1_next_click
Q1 下一步
q1_state

onboarding_q2_select
选择 Q2
q1_state, q2_support_style

onboarding_result_view
结果页曝光
preset_id, q1_state, q2_support_style

onboarding_enter_room_click
点击进入 Room
preset_id

onboarding_enter_room_success
成功进入 Room
preset_id

onboarding_enter_room_fail
失败
preset_id, fail_reason

Room

事件
触发时机
必填 properties

room_view
Room 页面曝光
source

room_view_after_onboarding
带 active preset 进入 Room
preset_id

room_option_viewed
room option 曝光
room_id

room_session_started
用户 tap 某个 room
room_id, source

room_enter_talk_after_onboarding
tap room 进入 Talk
preset_id, room_id

room_session_ended
Room session 结束
room_id, duration_seconds, exit_reason

Talk

事件
触发时机
必填 properties

talk_started
TalkSession 创建
source, intent, mode

talk_message_sent
用户发送消息
talk_session_id, message_index

talk_ended
TalkSession 结束
talk_session_id, duration_seconds, user_message_count

memory_item_created
MemoryItem 创建
talk_session_id, memory_item_id, memory_type

Memory

事件
触发时机
必填 properties

memory_item_viewed
MemoryItem 曝光
memory_item_id, memory_type

memory_feedback_submitted
Agree / Disagree / Hide
memory_item_id, action, effect

memory_cta_clicked
点击 CTA
memory_item_id, cta_intent

Sleep

事件
触发时机
必填 properties

sleep_checkin_started
开始填写
sleep_date

sleep_checkin_completed
提交
sleep_date, sleep_quality, morning_energy

sleep_insight_viewed
Insight 曝光
sleep_insight_id, period, suggestion_type

tonight_suggestion_viewed
suggestion 曝光
sleep_insight_id, suggestion_type

tonight_suggestion_clicked
点击 suggestion
sleep_insight_id, target

Home

事件
触发时机
必填 properties

home_recommendation_viewed
推荐曝光
home_recommendation_id, type, source

home_recommendation_clicked
点击推荐
home_recommendation_id, type, target

### 11.3 View event 去重规则

MVP 规则：

同一 page session 内，同一 entityId 的 viewed 事件最多上报一次。

适用事件：

- `room_option_viewed`
- `memory_item_viewed`
- `sleep_insight_viewed`
- `tonight_suggestion_viewed`
- `home_recommendation_viewed`

后续可升级为：

曝光超过 500ms 且可见面积超过 50% 才算 viewed。

Stage 3 不强制实现可见面积计算。

### 11.4 首夜激活定义

建议定义：

```ts
first_night_activated =
  onboarding_completed
  AND room_session_started
  AND (
    talk_started
    OR room_session_duration >= 60 seconds
  )
```

更严格定义：

```ts
strong_first_night_activated =
  onboarding_completed
  AND room_enter_talk_after_onboarding
  AND user_message_count >= 2
```

### 11.5 Memory loop 指标

指标
公式
含义

memory_view_rate
memory_item_viewed / memory_item_created
Memory 是否被看

memory_agree_rate
agree / memory_feedback_submitted
系统观察是否准确

memory_disagree_rate
disagree / memory_feedback_submitted
系统偏差程度

memory_hide_rate
hide / memory_feedback_submitted
Memory 是否让用户不适或不想使用

memory_cta_click_rate
memory_cta_clicked / memory_item_viewed
Memory 是否成为行为入口

talk_from_memory_rate
talk_started(source=memory) / memory_cta_clicked
Memory 是否闭环到 Talk

关键验证：

Second-night return after first MemoryItem is created

### 11.6 留存指标

指标
定义

next_night_return
首次激活后第二晚再次打开

D1 retention
首日后第 1 天打开

D3 retention
首日后第 3 天打开

D7 retention
首日后第 7 天打开

repeat_talk_rate
7 天内 TalkSession >= 2

repeat_room_rate
7 天内 RoomSession >= 2

sleep_checkin_streak
连续 sleep check-in 天数

### 11.7 功能去留阈值初稿

这些不是最终 KPI，而是早期判断方向。

功能
保留信号
风险信号

Onboarding
完成率高，Room 转化高
Q1/Q2 流失高

Room
停留 > 60s 或进入 Talk
秒退高

Talk
>= 2 用户消息，重复使用
进入后无消息退出

Memory
view + CTA + agree
hide 高、不看

Sleep check-in
D3 内重复填写
只填一次

Tonight suggestion
点击进入 Talk/Room
曝光不点

Home
主 CTA 点击
推荐被忽略

## 12. Store / API Contract 初稿

建议拆出文件：`docs/stage-3/store-and-api-contract.md`

这不是完整后端 API 设计，而是前端 / mock / local store 需要支持的操作清单。

```ts
type Stage3StoreApi = {
  getOrCreateAnonymousId(): AnonymousId;

  getOnboardingDraft(): OnboardingDraft | null;
  saveOnboardingDraft(draft: OnboardingDraft): void;
  clearOnboardingDraft(): void;

  createOnboardingPreset(input: OnboardingDraft): OnboardingSessionPreset;
  getActiveOnboardingPreset(): OnboardingSessionPreset | null;
  consumeOnboardingPreset(presetId: string): void;
  expireOnboardingPreset(presetId: string): void;

  listRoomOptions(): RoomOption[];
  createRoomView(input: Partial<RoomView>): RoomView;
  startRoomSession(input: Partial<RoomSession>): RoomSession;
  endRoomSession(roomSessionId: string, input: Partial<RoomSession>): RoomSession;

  startTalkSession(context: TalkEntryContext): TalkSession;
  endTalkSession(talkSessionId: string): TalkSession;
  maybeExtractMemoryFromTalk(talkSessionId: string): MemoryExtractionRun;

  listVisibleMemories(): MemoryItem[];
  submitMemoryFeedback(input: MemoryFeedback): MemoryItem;
  hideMemory(memoryItemId: string): MemoryItem;

  createSleepLog(input: Partial<SleepLog>): SleepLog;
  generateSleepInsight(): SleepInsight | null;

  getHomeRecommendation(): HomeRecommendation;

  trackProductEvent(event: ProductEvent): void;
};
```

## 13. Acceptance Checklist

建议拆出文件：`docs/stage-3/acceptance-checklist.md`

### 13.1 产品逻辑验收

App Entry

- 未完成 onboarding 时进入 `/onboarding`。
- 有 active onboarding preset 且未 consumed 时进入 `/room`。
- 其他情况进入 `/home`。

Onboarding

- Onboarding 只有两个问题。
- Q1 是用户当前状态。
- Q2 是用户允许的陪伴方式。
- Onboarding 生成 `postOnboardingSessionPreset`。
- Onboarding 不生成 room recommendation。
- Onboarding 不直接进入 Talk。
- 结果页主 CTA 进入 Room。
- Onboarding answer 不直接影响 Sleep suggestion。
- 不存在长期 `OnboardingSeedSignal` 业务对象。
- 如需 Memory 页面承接，只能使用 UI 派生的 `OnboardingContextCard`。

Room

- Room 固定展示 3 个 room options。
- Onboarding preset 不改变 room 数量。
- Onboarding preset 不重排 room。
- Onboarding preset 不高亮 room。
- 用户进入 Room 页面只创建 `RoomView`。
- 用户主动 tap room 后才创建 `RoomSession`。
- 用户主动 tap room 后才进入 Talk。
- Room 不重算 preset。

Talk

- Talk 支持 Room / Memory / Sleep / Home / Direct 入口。
- Room after onboarding 进入 Talk 时消费完整 preset。
- Talk 不只用 `presetId` 重新查表。
- `TalkSession` 结束或离开页面后触发 Memory extraction 判断。
- Memory extraction 具有幂等保护。
- 不是每个 `TalkSession` 都必须生成 `MemoryItem`。
- Memory extraction 失败不影响 `TalkSession` 保存。

Memory

- 不存在 `MemoryCandidate`。
- Talk 后直接生成 `MemoryItem`。
- `MemoryItem` 包含可选 evidence。
- Agree 增强 Memory。
- Disagree 纠错。
- Hide 后该 Memory 不再影响 Talk / Sleep / Home。
- Hidden Memory 不进入 prompt / retrieval / recommendation context。
- V1 不做 Delete。
- Disagree note 可选。

Sleep

- Sleep check-in 是早上填写昨晚。
- `SleepLog` 有 `sleepDate` 和 `checkInDate`。
- 数据不足不伪造趋势。
- Tonight's suggestion 可追溯。
- Sleep suggestion 有规则优先级。
- Onboarding 不直接影响 Sleep suggestion。
- UI 文案不使用医学诊断表达。

Home

- Home 是独立 continuation / recovery page。
- Home 可以由正常 app entry 或 fallback recovery 触发。
- Home 不替代 onboarding hard gate。
- Home 不替代 active onboarding preset -> Room flow。
- Home 只展示一个主推荐。
- `HomeRecommendation` 有 `source / sourceId`。
- fallback `HomeRecommendation` 必须带 `HomeEntryContext`。
- Home 可以读取 Tonight's suggestion。
- Hidden Memory 不作为 Home recommendation 来源。
- Home 不做复杂 dashboard 或 feed。
- Home 不做外部 push。

### 13.2 数据契约验收

- 定义 `OnboardingDraft`。
- 定义 `OnboardingSessionPreset`。
- 定义 `OnboardingContextCard`，且明确为 UI 派生对象。
- 定义 `RoomOption`。
- 定义 `RoomView`。
- 定义 `RoomSession`。
- 定义 `TalkEntryContext`。
- 定义 `TalkSession`。
- 定义 `MemoryExtractionRun`。
- 定义 `MemoryItem`。
- 定义 `MemoryFeedback`。
- 定义 `SleepLog`。
- 定义 `SleepInsight`。
- 定义 `SuggestionRuleResult`。
- 定义 `HomeEntryContext`。
- 定义 `HomeRecommendation`。
- 定义 `ProductEvent`。
- 所有对象有 ID 规则。
- 所有状态字段有含义。
- 所有 recommendation / insight 可追溯。

### 13.3 跨页面跳转验收

Onboarding -> Room

- 点击结果页 CTA 写入 active preset。
- 成功进入 Room。
- 失败可重试。
- 不清除草稿直到成功。

Room -> Talk

- 用户 tap room 才进入 Talk。
- payload 包含 `roomId`。
- payload 包含 `roomSessionId`。
- 如果 active preset 存在，payload 包含完整 preset。
- Talk 成功后 preset 标记 consumed。
- expired preset 安静降级。

Memory -> Talk

- Talk about this 构造 `intent = discuss_memory`。
- Try a gentler start 构造 `intent = gentle_start`。
- Stay with quiet company 构造 `intent = quiet_company`。
- hidden memory 不展示 CTA。

Sleep -> Talk / Room

- Tonight's suggestion 有 source insight。
- 点击 Talk 构造 `source = sleep`。
- 点击 Room 带 `sleepInsightId` 或 `sourceId`。

Home -> 各页面

- Home 可以由正常返回或 fallback 上下文进入。
- Home CTA 有 target。
- fallback recommendation 必须带 `HomeEntryContext`。
- 如 target = Talk，携带 `TalkEntryContext`。
- 如 target = Sleep，携带 `HomeRecommendation source`。

### 13.4 埋点验收

- Onboarding 所有关键步骤有事件。
- 事件命名不暗示 Onboarding 直接进入 Talk。
- Room -> Talk after onboarding 有完整事件链。
- Talk started / message sent / ended 可追踪。
- Memory created / viewed / feedback / CTA click 可追踪。
- Sleep check-in / insight / suggestion view / click 可追踪。
- Home recommendation view / click 可追踪。
- 所有事件包含 `userId` 或 `anonymousId`。
- 所有事件包含 `createdAt`。
- 关键事件包含 `entityId`。
- View event 在同一 page session 内按 `entityId` 去重。

### 13.5 边界与反例验收

Review Worker 必须检查以下反例不存在：

- 不存在 `MemoryCandidate`。
- 不存在长期业务对象 `OnboardingSeedSignal`。
- 不存在 Onboarding -> Talk 直接路径。
- 不存在 `onboarding_start_talk_click` 事件。
- 不存在 `onboarding_talk_enter_success` 事件。
- 不存在 Onboarding 推荐 room 的文案。
- 不存在 Room 根据 onboarding 自动高亮 room。
- 不存在 Talk 用 `presetId` 重新查表生成另一份 preset。
- 不存在 Sleep suggestion 直接读取 onboarding answer。
- 不存在 hidden memory 进入 Talk personalization context。
- 不存在 hidden memory 进入 prompt construction。
- 不存在 hidden memory 进入 recommendation generation。
- 不存在 Web 自动医学睡眠监测表述。

## 14. UI 页面需要补充的数据要求

### 14.1 Onboarding UI

UI 元素
需要绑定的数据

Question 1
`OnboardingDraft.q1State`

Question 2
`OnboardingDraft.q2SupportStyle`

结果页
`resultViewModel`

进入 Room CTA
`createOnboardingPreset() + route /room`

跳转失败
`onboarding_enter_room_fail`

### 14.2 Room UI

UI 元素
需要绑定的数据

Room 页面曝光
`RoomView`

3 个 room options
`RoomOption[]`

tap 某个 room
`RoomSession`

进入 Talk
`TalkEntryContext`

active preset
只透传，不改写

### 14.3 Talk UI

UI 元素
需要绑定的数据

开场文案
`TalkEntryContext + preset / memory / sleep source`

Talk 模式
`TalkSession.mode`

消息列表
message data

结束 Talk
`endTalkSession()`

自动 Memory
`maybeExtractMemoryFromTalk()`

### 14.4 Memory UI

UI 元素
需要绑定的数据

Memory 卡片
`MemoryItem.title / body / evidence`

Agree
`MemoryFeedback.action = agree`

Disagree
`MemoryFeedback.action = disagree`

Hide
`MemoryFeedback.action = hide`

Talk about this
`TalkEntryContext.intent = discuss_memory`

Try a gentler start
`TalkEntryContext.intent = gentle_start`

Stay with quiet company
`TalkEntryContext.intent = quiet_company`

建议文案语义：

动作
英文 UI 文案方向
中文解释

Agree
That feels right / Yes, that fits
这个观察对

Disagree
Not quite / That doesn't fit me
这个判断不准确

Hide
Hide this memory
隐藏并不再使用

### 14.5 Sleep UI

UI 元素
需要绑定的数据

早晨 check-in
`SleepLog`

7 天趋势
`SleepInsight.basedOn.sleepLogIds`

Tonight's suggestion
`SleepInsight.cta`

数据不足状态
`suggestionType = collect_more_data`

建议来源说明
`basedOn`

文案约束：

- 使用 `based on your check-ins / seems / might help`。
- 避免 `Your sleep improved / unhealthy / medical diagnosis` 类表达。

### 14.6 Home UI

UI 元素
需要绑定的数据

主推荐卡片
`HomeRecommendation`

CTA
`HomeRecommendation.cta`

推荐来源
`HomeRecommendation.source / sourceId`

进入上下文 / fallback 语义
`HomeRecommendation.entryContext / HomeEntryContext`

点击事件
`home_recommendation_clicked`

## 15. 最终完成定义

Stage 3 可认为完成，当且仅当：

1. 产品逻辑文档明确。
2. Canonical data contract 明确。
3. Page data matrix 明确。
4. Memory rules 明确。
5. Sleep rules 明确。
6. Home rules 明确。
7. Analytics and retention 明确。
8. Store / API contract 初稿明确。
9. Acceptance checklist 明确。
10. Review Worker 能根据 checklist 独立判断实现是否合格。

## 16. 一句话总结

Stage 3 最终定下来的系统逻辑是：

Onboarding 不做长期画像，只生成一次性首会话 preset；
Room 固定展示 3 个选择，RoomView 与 RoomSession 分离；
用户 tap room 后 Talk 消费完整 preset；
Talk 结束或离开后幂等地尝试生成 MemoryItem；
Agree 增强，Disagree 纠错，Hide 完全排除个性化；
Sleep 用早晨 check-in 和真实行为生成 Tonight's suggestion；
Home 作为轻量默认入口读取可追溯推荐；
Analytics 用来判断首夜激活、Memory 闭环、Sleep check-in 和留存。
