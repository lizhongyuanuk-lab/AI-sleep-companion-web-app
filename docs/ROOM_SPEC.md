# Room 页面主文档：PRD + 非 UI 交付规范

当前文档用于定义 `/room` 页面的产品定位、范围、状态、上下游关系、音频规则、进入规则、数据骨架与验收标准。

一句话定义：

Room 不是“给用户看选项”的页面，而是让用户先进入一个氛围空间，停留感受，再决定是否进入 Talk 的沉浸式入口层。

## 1. 文档角色

本文件是 Room 页面当前的产品真源，用于定义：

- 页面定位
- 业务边界
- 状态骨架
- 上下游关系
- MVP 范围
- 音频与沉浸规则
- Room 与 Talk 的职责边界

本文档吸收了当前确认版本中的核心状态与业务规则，可直接用于 Codex 实现。

## 2. 页面角色

Room 是 Talk 前的沉浸式场景预览层。

它不是：

- 分类页
- 推荐流
- 主导航页
- 对话页
- 功能首页

## 3. 当前结论

当前版本已无阻塞开发的核心未决项，可直接用于实现。

MVP 范围固定为：

- 6 个静态 room
- 弱推荐
- 无详情页
- 无分类
- 无收藏
- 无 Room 内导航

## 4. 页面定位与目标

Room 页面位于 onboarding 与 Talk 之间，负责承接用户完成 onboarding 后的第一段情绪体验。

页面打开时，用户不会先看到功能列表或导航结构，而是直接进入一个全屏 room 的沉浸预览态。

Room 的目标不是做内容分发，也不是做分类浏览，而是通过最低打扰的方式，让用户“先进入氛围，再进入陪伴”。

### 4.1 页面核心目标

| 维度 | MVP 目标 | 说明 |
| --- | --- | --- |
| 体验目标 | 降低 onboarding 结束后的落空感 | 用户不是立刻进入功能页，而是被自然带入一个可感知的空间。 |
| 业务目标 | 提高进入 Talk 的自然度 | 进入 Talk 不再是功能跳转，而是从 room 平滑过渡到正式陪伴。 |
| 设计目标 | 建立产品的氛围记忆点 | Room 承担品牌气质和睡前情绪缓冲，不承担功能导航。 |
| 边界目标 | 避免做成推荐流或列表页 | 开发实现必须收敛到单任务、单页面心智，不扩散为复杂首页。 |

## 5. 非目标与边界

- Room 页面不是主首页，不承担全站导航职责。
- Room 页面不是推荐流，不做复杂分发、排序学习、内容 feed。
- Room 页面不是分类页，不做 tab、不做筛选、不做搜索。
- Room 页面不是对话页，不提前播放 AI 语音，不承载正式互动。
- Room 页面不做详情页，不做收藏，不做最近列表，不做历史列表。

## 6. 页面在产品中的位置

| 上游页面 | 当前页面 | 下游页面 | 责任拆分 |
| --- | --- | --- | --- |
| Onboarding | Room | Talk | Onboarding 决定首次弱推荐；Room 承担氛围预览；Talk 承担正式陪伴和导航出现后的主体验。 |

## 7. 核心体验骨架

最终体验严格收敛到以下路径：

- 完成 onboarding 后，直接进入 Room 页面。
- 首屏即为一个全屏 room，自动开始 ambience 预览。
- 用户上下滑动切换不同 room；每次切换后进入新的 2 秒沉浸窗口。
- 用户在当前 room 停留 2 秒后，出现居中的进入提示。
- 用户 tap 当前 room 主画面区域，进入 Talk。
- 进入 Talk 后才出现产品导航；Room 页面自身不显示顶部导航或底部导航。

## 8. 交互规则

| 交互点 | 规则 | 实现要求 | 禁止做法 |
| --- | --- | --- | --- |
| 进入 Room | 首屏直接进入单个 room 预览态 | 首个 room 背景与 ambience 自动加载并播放 | 不可先显示列表、缩略卡片墙或功能菜单 |
| 上下滑动 | 纵向一屏一个 room，自动吸附 | 只切换相邻 room；切换后重置停留计时 | 不可半屏停留，不可同屏并列多个 room |
| 停留 | 停留 2 秒后显示进入提示 | 页面中央偏下出现 `Tap to enter` 玻璃胶囊；切换后重新计时 | 不可一进入就弹进入提示 |
| tap 进入 Talk | 仅在稳定预览态下响应 | 滑动惯性过程中不响应 tap 进入 | 不可因误触频繁跳页 |
| 返回 Room | 从 Talk 返回到原 room | 保留上次位置与氛围上下文 | 不可重置到首个 room |

## 9. 音频规则

| 项目 | 规则 | 说明 |
| --- | --- | --- |
| 自动播放 | 进入 room 预览态后，ambience 默认自动播放 | Room 的预览必须可感知，不是静态图浏览。 |
| 允许音频类型 | 白噪音 / 轻音乐 / 自然环境音 / 柔和 ambience | 不允许 AI 语音、旁白、强提示音、节奏刺激过强音乐。 |
| 切换过渡 | room 切换时必须使用 crossfade | 旧 room 淡出，新 room 淡入；不可硬切。 |
| 进入 Talk | 当前氛围应延续或平滑过渡到 Talk | 目标是“走进 Talk”，不是“切换到另一个重启页面”。 |

## 10. 页面状态定义

| 状态 | 触发条件 | 页面表现 | 开发注意 |
| --- | --- | --- | --- |
| 初始加载态 | 首次进入 Room 或资源尚未完成加载 | 优先保证首个 room 尽快出现；不使用复杂 loading 文案 | 可轻过渡，不可破坏沉浸。 |
| Room 预览态 | 当前 room 资源已可感知 | 背景、标题、ambience 生效；用户可继续滑动 | 这是 Room 的默认主状态。 |
| Room 切换态 | 用户上下滑动到新 room | 旧 room 退出，新 room 进入；音频淡入淡出 | 不可黑屏、不可闪断。 |
| 可进入态 | 当前 room 停留达到阈值 | 居中的 `Tap to enter` 提示出现；允许 tap 进入 Talk | 切换中不可进入。 |
| 异常降级态 | 背景或音频资源异常 | 允许继续滑动与进入 Talk | 单个 room 失败不应阻断全页。 |

## 11. Onboarding 与 Room 的关系

Room 与 onboarding 的关系定为“弱关联”。

Onboarding 只影响首次进入 Room 时的首个 room 落点，不限制用户后续滑动，也不把 room 与 LLM mode 强绑定。

| 维度 | 是否受 onboarding 影响 | 规则 |
| --- | --- | --- |
| 首次首屏 room | 是 | 根据 onboarding 输出做弱推荐，决定首个 room 落点。 |
| 后续滑动访问 | 否 | 所有 room 均可自由访问，不做锁定。 |
| Talk 的陪伴 mode | 否 | mode 与 room 解耦，由 Talk / LLM 逻辑决定。 |
| 长期排序与推荐 | 否（MVP） | MVP 不做复杂推荐系统。 |

## 12. 首次进入 / 非首次进入 / 返回规则

| 场景 | 规则 |
| --- | --- |
| 首次进入 Room | 默认落在 onboarding 弱推荐的首个 room。 |
| 非首次进入 Room | 默认落在用户上一次成功进入 Talk 的 room。 |
| 从 Talk 返回 Room | 回到刚才进入 Talk 时所在的 room，不重置。 |
| 推荐系统边界 | MVP 不做复杂偏好学习，仅保留“上一次成功进入 Talk 的 room”作为轻记忆规则。 |

## 13. 内容与数据模型

MVP 固定提供 6 个 room。

数量已定：

- 小于 5 个会显得像 demo
- 大于 8 个会增加第一版资产与选择负担

### 13.1 内容规则

| 项 | 要求 | 备注 |
| --- | --- | --- |
| room 数量 | MVP = 6 个 | 后续验证通过再扩到 8 个或 10–12 个。 |
| 标题形式 | 统一使用氛围型命名 | 不使用“快速入睡”“缓解焦虑”这类功能型标题。 |
| 前台显示 | 显示标题和 ambience 标签 | 标题为单独 title pill；第二行显示拆分后的 ambience tag pills。 |
| 内部标签 | 必须保留 | 供 onboarding 弱推荐与后续扩展使用。 |

### 13.2 建议数据字段

```ts
type Room = {
  id: string
  title: string
  ambienceLabel: string
  backgroundAsset: string
  ambienceAsset: string | null
  ambienceType: 'white_noise' | 'light_music' | 'nature' | 'mixed'
  stimulationLevel: 'very_low' | 'low' | 'medium_low'
  moodProfile: 'calming' | 'safe' | 'quiet' | 'companion_like'
  visualTone: 'dark' | 'warm' | 'cool' | 'neutral'
  recommendedFor: string[]
  sortOrder: number
  isActive: boolean
  motionVariant: string
  talkSceneId: string
}
```

## 14. Room 与 Talk 的边界

| 层 | 负责内容 | 不负责内容 |
| --- | --- | --- |
| Room | 氛围预览、背景视觉、白噪音/轻音乐/环境音、进入 Talk 前的情绪缓冲 | 正式陪伴、AI 语音、对话内容、产品导航 |
| Talk | 正式互动、用户输入输出、AI 语音回复、主体验页面 | Room 的浏览切换与前置沉浸选择 |

## 15. MVP 明确不做的内容

- 不做 Room 内导航栏（顶部、底部均不显示）。
- 不做分类 tab、筛选、搜索。
- 不做详情页、收藏、最近列表、历史列表。
- 不做 AI 语音预览与人声内容。
- 不做复杂推荐系统与个性化 feed。
- 不做 Room 页面上的主功能入口集合。

## 16. 埋点占位

这些事件可先占位，不要求首版全部接入：

| 事件名 | 说明 |
| --- | --- |
| `room_page_view` | Room 页面曝光 |
| `room_preview_started` | 单个 room 进入预览态 |
| `room_swipe_next` / `room_swipe_prev` | 用户上下切换 room |
| `room_enter_prompt_shown` | 弱提示出现 |
| `room_tap_enter_talk` | 从 Room 进入 Talk |
| `room_return_from_talk` | 从 Talk 返回 Room |

## 17. 验收标准

- Room 页面打开后，首屏即为单个 room 预览态，而不是列表页。
- Room 页面不显示导航栏，只有进入 Talk 后导航才出现。
- 用户可通过纵向滑动切换 room，且一屏只展示一个 room。
- 切换后 ambience 使用淡入淡出过渡，不出现硬切、黑屏或闪断。
- 停留 2 秒后出现居中的 `Tap to enter` 玻璃 CTA；tap 当前 room 进入 Talk。
- 左下信息簇由独立 title pill 和独立 ambience tag pills 组成，不使用共享外层容器。
- 首次进入时首屏 room 受 onboarding 弱影响；后续不限制自由滑动。
- 非首次进入时，默认落在上一次成功进入 Talk 的 room。
- 从 Talk 返回时，回到原 room，不重置到首个 room。

## 18. 资产层待补清单

这些内容不阻塞开发：

| 资产项 | 当前状态 | 说明 |
| --- | --- | --- |
| 6 个 room 最终标题 | 待补 | 不阻塞页面结构与状态开发。 |
| 背景素材 | 待补 | 后续可替换资源，不影响页面骨架。 |
| ambience 音频 | 占位中 | 当前运行时允许 `null` 音频资源并静默降级；后续替换真实资源即可。 |
| onboarding → room 弱映射表 | 待补 | 可先用占位映射实现逻辑闭环。 |

## 19. 当前实现对齐补丁

以下规则用于把 Room PRD 与当前已落地页面收口一致：

- dwell 时间当前锁定为 `2s`
- 进入提示当前不是弱文案，而是页面中下部的独立玻璃 CTA
- `Tap to enter` 当前为 `200 × 50 px` 胶囊，文案为黑色，并带左侧三根竖条
- CTA 出现后，三根竖条先静止 `2s`，随后进行低频、低幅度的错峰跳动
- 左下信息簇当前分为两行：
  - 第 1 行：独立 room title pill
  - 第 2 行：由 ambienceLabel 拆分出的独立 tag pills
- title pill 与 tag pills 均为独立玻璃气泡，不存在共享外层壳
- 当前标题与 ambience 标签文案均使用深灰色 `#454545`
- 当前标题是主层级，tag pills 是次层级
- 当前页面仍保持无 top nav、无 bottom nav、无 dock、无音频控制

## 20. 当前运行时说明

当前 `/room` 的实现仍保留以下占位特征：

- 6 个 room 已接入，但部分背景资源存在复用
- ambience 文案已前台展示，但 `ambienceAsset` 仍允许为 `null`
- 当音频资源缺失或自动播放受限时，页面以 silent fallback 继续运行
- subtle motion 已通过 CSS 动效占位实现，后续可替换为更完整的资产层

## 21. Room PRD Patch

This patch supplements the existing Room Page PRD and does not replace its core product definition.

### 21.1 Room As Ambience Package

Each Room must be defined as an ambience package, not as a static background image only.

Each Room must include all three of the following elements as one matched unit:

- scene visual
- matched environmental audio
- subtle ambient motion

The subtle ambient motion layer may include low-energy loops such as drifting clouds, light rain, gentle leaf movement, soft water ripple, or other comparable ambient-only motion.

It must remain non-intrusive and must not become a narrative animation or a high-stimulation visual effect.

### 21.2 Matched Audio Rule

Each Room must have a dedicated default ambience audio set that matches the scene.

Scene and sound must not be mismatched.

Examples:

- forest scenes must not use ocean-wave ambience
- ocean scenes must not use cabin wind or indoor room tone unless explicitly defined as that Room’s intended ambience package

Supported ambience categories may include:

- rain
- forest / nature
- ocean / water
- night / quiet room tone
- wind / air
- white noise / sleep noise
- very light ambient music

Room must not play:

- AI voice
- spoken guidance
- lyrical music
- any other intrusive foreground audio during preview

### 21.3 Audio Control Ownership

Room is a preview surface only and must not expose audio controls directly.

The following controls belong to the Talk settings panel, not the Room page:

- ambience on / off
- ambience volume
- background music volume
- white noise volume
- white noise type
- sound mix preset

This ownership rule aligns with the final Talk UI definition, where the compact floating settings panel contains companion voice volume, background music volume, white noise volume, white noise type, and sound mix preset.

### 21.4 Visual Consistency Rule

Room must inherit the same single-mode fixed warm translucent glass system as the final Talk page.

Room may remain structurally different from Talk, but it must not introduce:

- an independent dark / light overlay system
- runtime theme switching
- brightness-based UI adaptation
- dynamic recoloring based on the Room image

The Talk UI has already locked this as a fixed single-mode rule.

### 21.5 Room Title Anchor Continuity

Room title placement on the Room page must follow the same bottom-left anchor logic as the Room name on the Talk page.

This is a continuity rule, not a duplication of the Talk layout.

The Talk UI defines the Room name as a single-line label positioned above the bottom dock and left-aligned to the dock’s left edge.

### 21.6 No Change To Existing Room Product Scope

This patch does not change the existing Room product scope.

Room remains:

- an immersive pre-Talk preview layer
- a full-screen single-room surface
- a page with no navigation bars, no dock, and no settings entry
- a page whose only primary user actions are vertical room switching and entry into Talk

## 22. 交付说明

本文档按已确认版本收口。

当前不存在阻塞开发的核心未决项；后续若补充 Room 标题、背景图、音频素材与弱映射表，只属于内容资产完善，不改变本 PRD 的产品骨架。
