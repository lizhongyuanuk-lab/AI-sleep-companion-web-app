# Home UI Spec

## 0. Stage 3 三层关系声明

Home UI Spec 继承 Stage 3 的三层文档关系，不反向定义产品逻辑或数据契约。

### 0.1 产品逻辑层

来源文件：

- `docs/stage-3/page-logic/home.md`
- `docs/stage-3/product-logic.md`

职责：

- 定义 Home 是什么
- 定义 Home 不是什么
- 定义 Home 与 `Onboarding` / `Room` / `Talk` / `Memory` / `Sleep` 的边界
- 定义 Home 何时作为 continuation / recovery surface 出现
- 定义 Home 只展示一个低刺激、可追溯的 next-best-action

UI Spec 不得覆盖产品逻辑层。

### 0.2 数据契约层

来源文件：

- `docs/stage-3/data-contract.md`
- `docs/stage-3/page-data-matrix.md`
- `docs/stage-3/store-and-api-contract.md` if present

职责：

- 定义 `HomeRecommendation`
- 定义 `HomeRecommendation.source` / `sourceId` / `cta`
- 定义 `HomeEntryContext`
- 定义 Home 页面读取、派生、上报、跳转 payload

UI Spec 不得新增字段、状态、payload、store API 或事件名。
如 UI 需要新字段，必须先进入 data-contract alignment。

### 0.3 UI 表达层

来源文件：

- `docs/stage-3/ui/home-ui-spec.md`
- shared product UI standards

职责：

- 定义 Home 的视觉层级
- 定义 night atmosphere family
- 定义 hero、card、CTA、fallback cue 的视觉表达
- 定义 spacing / safe area / shell language
- 定义 forbidden visual traits
- 定义 UI-level acceptance criteria

### 0.4 实现层

来源文件：

- application source files

职责：

- 按产品逻辑层、数据契约层、UI 表达层落地 Home
- 不得在实现中发明新的 `HomeRecommendation` 类型
- 不得把 hidden / disagreed / expired / blocked memory 展示到 Home
- 不得把 Home 做成 dashboard / feed / analytics page

### 0.5 不可逆规则

Implementation 不得反向修改 UI Spec。  
UI Spec 不得反向修改 Data Contract。  
Data Contract 不得反向推翻 Product Logic。  
如发现冲突，必须回到 Stage 3 review，而不是让 worker 自行解释。

## 1. 文档角色

本文件是 Home 页面视觉与交互表达真源。

本文件定义：

- Home 页面视觉层级
- spacing
- shell language
- card weights
- CTA treatment
- fallback / continuity cue treatment
- independent `/home` page 的页面结构
- page-level UI acceptance criteria

本文件不定义：

- backend contract
- data model
- route resolver logic
- `Memory` state machine
- `Talk` state machine
- exact final copy
- implementation code

优先级：

1. `docs/stage-3/ui/home-ui-spec.md`
2. `docs/stage-3/page-logic/home.md`
3. `docs/stage-3/product-logic.md`
4. shared product UI standards
5. `docs/stage-3/data-contract.md` after alignment
6. implementation files after documentation approval

## 2. 页面定位

Home 是睡眠陪伴产品的 quiet continuation / recovery surface。

Home 对应的独立 route 是：

- `/home`

Home 不是：

- `/`
- dashboard
- analytics page
- memory management page
- transcript page
- generic app landing page
- productivity home screen

`/` 的职责是：

- App Entry Resolver
- 不作为最终 Home 视觉承载面
- 根据 state 把用户路由到 `/onboarding` / `/room` / `/home`

`/room` 的职责是：

- active onboarding preset 的 hard continuation
- room selection
- Talk 前的空间承接

Home 应该让用户感觉：

- 这是一个安静、可恢复的页面
- 系统在安全地给出下一步
- 今晚可以自然回到 Room / Talk / Memory / Sleep 的某一个动作
- 页面不会制造认知负担
- 页面属于和 `/talk` 相同的夜间产品世界

Home 的核心视觉角色：

- independent page
- emotional continuation surface
- fallback recovery surface
- one primary action
- low chrome
- low-stimulation next step

## 3. 视觉目标

Home 页面必须达成以下视觉目标：

1. 第一眼是“安全下一步”，不是功能集合。
2. 主 CTA 清晰，但不能有高压转化感。
3. 页面有陪伴感，但不出现聊天气泡或 transcript。
4. fallback / continuity 只能轻量表达，不能像错误中心或状态面板。
5. 视觉上属于 `/talk` 的同一 night shell family。
6. 卡片应嵌入页面，不应像 SaaS dashboard widget。
7. 页面节奏应从 hero 到 recovery cue 到 current action card 自然下沉。
8. 视觉密度低于 `/memory` 与 `/sleep-monitoring`。
9. 不出现 dashboard / feed / segmented-control 观感。

## 4. Route / Page-Type Mapping

Home 的 route 与 page type：

- `/home` -> independent continuation / recovery page
- `/` -> resolver-only route，不承载 Home surface
- `/room` -> hard continuation / room selection route

Home 页面必须保留：

- strongest serif hero usage
- atmospheric gradient background
- calm intro pacing
- hero -> continuity / fallback cue -> main action card 的连续叙事
- 一个明确 primary CTA

不得出现：

- resolver page 和 Home surface 混在同一首屏
- dashboard-style grid
- multiple competing primary cards
- error dashboard
- feed-style stacked recommendations

## 5. 页面整体结构

`/home` mobile layout 应遵循以下顺序：

1. Top safe area
2. Shared shell navigation
3. Optional light intro chrome
4. Hero block
5. Continuity / fallback cue
6. Main current-action card
7. Primary action group
8. Optional secondary link
9. Bottom safe area

整体必须读成一个 narrative stack，而不是多个独立模块。

推荐视觉层级：

- Background atmosphere: full page
- Hero: strongest emotional anchor
- Continuity / fallback cue: context layer
- Main action card: action anchor
- Primary CTA: strongest interaction
- Secondary links: visually quiet

## 6. 背景与氛围

Home 背景应使用与 `/talk` 同家族的 night atmosphere family。

必备特征：

- warm dark-night gradient
- soft atmospheric depth
- no hard dashboard panels
- no pure black flat background
- no bright productivity background
- serif hero readable

允许：

- radial warm glow
- subtle vignette
- soft blur
- translucent depth
- muted warm highlights

禁止：

- sharp SaaS geometry
- loud aurora gradient
- white dashboard canvas
- heavy opaque section blocks

## 7. Shared Shell

Home 应继承与 `/talk` 一致的 shell family，但 chrome 更轻。

要求：

- 同一 warm translucent material family
- 同一 icon weight if icons are used
- 同一圆角语言
- 同一低边框处理
- 顶部 safe-area offset `16px`
- 默认水平内边距 `24px`
- 最小水平内边距 `20px`

Home 不得引入：

- 单独的 nav material system
- bright active tabs
- segmented top controls
- dashboard toolbar

## 8. Hero Block

Hero 是 Home 的情绪锚点。

要求：

- strongest serif hero usage on the page
- title max width: `min(76vw, 320px)`
- support copy max width: `min(72vw, 300px)`
- hero title -> support spacing: `16px`
- calm intro pacing
- copy 应表达安全承接，而不是产品营销

Hero 应传达：

- calm return
- safe continuation
- fallback recovery
- one clear next step

Hero 不应传达：

- analytics
- productivity
- technical system state
- aggressive conversion

## 9. Continuity / Fallback Cue

Home 可以展示一个轻量 continuity / fallback cue。

用途：

- 说明 Home 为什么出现
- 解释这次是 normal return、manual nav 还是 recovery
- 给用户轻量上下文，但不过度解释系统

要求：

- 单条 cue，不堆叠
- short
- low-stimulation
- non-technical
- 不应读成 error banner
- 应位于 hero 与 main action card 之间

可表达：

- normal return
- previous flow could not safely continue
- suggestion unavailable
- memory source no longer usable
- expired preset recovery

不得出现：

- `undefined`
- `null`
- `fetch failed`
- raw fallback reason enum
- dense diagnostic explanation

## 10. Main Action Card

Main action card 是 Home 的内容与行动锚点。

角色：

- 告诉用户当前最安全的 next-best-action
- 创建到 `Room` / `Talk` / `Memory` / `Sleep` 的软桥接
- 容纳主 CTA 或与主 CTA 紧邻

要求：

- embedded card feel
- warm translucent material
- secondary card weight
- low border contrast
- no hard white card
- no dense inner controls

内容可包括：

- short companion line
- tonight recommendation
- recovery explanation
- one supporting line
- primary CTA

不得包括：

- sleep score
- full analytics
- raw memory list
- transcript excerpts
- editable controls

## 11. Primary CTA

Home 必须只有一个视觉主 CTA。

本轮 canonical CTA 不固定为唯一字面文案，但必须满足：

- target 唯一
- low-pressure
- action-oriented
- 与 `HomeRecommendation.cta` 对齐

在无更强 recommendation 时，默认方向应优先回到 `/room`。

CTA 表达原则：

- normal return -> `Enter Room`
- safe restart -> `Enter Room`
- room recovery -> `Try again` 或 `Enter Room`
- fallback from unavailable suggestion -> 给出一个更安全的单一路径

要求：

- warm active button language
- visually belongs to the same family as `/talk`
- large enough for relaxed evening use
- calm, not urgent

禁止：

- multiple primary buttons
- segmented CTA group
- alert-colored button
- dashboard utility button

## 12. Secondary Actions

允许的 secondary actions：

- `View Memory`
- `Open Sleep`
- `Back to Room`
- `Continue setup` only when product logic allows

要求：

- clearly subordinate to primary CTA
- visually quiet
- 不得与 primary action 等权
- 不得使用 option-chip appearance

Memory entry 只允许：

- secondary button / subtle link treatment
- read-only preview or route entry

不得：

- expose `Agree` / `Disagree` / `Hide`
- show management UI

## 13. Fallback State Treatment

当 Home 由 fallback / recovery 触发时，视觉上应：

- 保持 calm
- 让用户知道需要一个安全重启点
- 不制造失败感

fallback Home 不应：

- 看起来像错误页
- 看起来像 debugging panel
- 把原因写得像系统日志
- 增加第二主 CTA

fallback cue 与 main action card 的关系应是：

- cue 解释上下文
- main action card 给出下一步

## 14. Empty / Normal Return State

当 Home 是 normal return 或 data-light state 时：

- 不显示空 dashboard
- 不显示 fake metrics
- 不显示 “no data yet” 技术文案
- 仍然给出一个明确、安静的 next-best-action

默认无强 signal 时：

- `/home` 仍然应该是完整页面
- 主推荐默认回到 `/room`

## 15. Spacing Baseline

默认移动端 spacing：

- horizontal page padding: `24px`
- absolute minimum horizontal page padding: `20px`
- after system safe area: `16px`
- bottom general content safe area: `24px`
- bottom primary action safe area: `32px`

Hero：

- title max width: `min(76vw, 320px)`
- support max width: `min(72vw, 300px)`
- title -> support: `16px`
- hero -> next major section: `72px` to `88px`

Home 首屏要求：

- hero + continuity cue + main action card + primary CTA 应尽可能同时落在首屏
- 不应让主 CTA 长期落到 fold 之下

## 16. Motion / Feedback

Home 动效应最小化并 sleep-safe。

允许：

- soft fade-in
- gentle card entrance
- light CTA response
- subtle continuity transition

禁止：

- bouncy animation
- pulsing urgency
- fast loading skeletons
- confetti
- strong hover state

## 17. Forbidden Traits Summary

Home 不得使用：

- resolver page 直接承载 Home visual surface
- dashboard percentage treatment
- feed-style recommendation list
- segmented-control appearance
- multiple equal primary CTAs
- dense analytics cards
- medical score UI
- transcript bubbles
- chat input
- strong error banners
- high-saturation SaaS gradient
- heavy white panels

## 18. Page-Level Acceptance Criteria

Home UI spec 被接受的条件：

1. Home 对应独立 `/home` 页面，而不是 `/` 的视觉别名。
2. `/` 只承担 resolver 职责，不承载最终 Home surface。
3. Home visually reads as the same night product family as `/talk`.
4. Home feels like a continuation / recovery page, not a dashboard.
5. Hero is the strongest emotional element.
6. 页面只有一个主 CTA。
7. CTA 明确服务于 next-best-action，而不是功能集合。
8. fallback cue 是轻量的，不像错误中心。
9. Main action card 是嵌入式的，不像 dashboard widget。
10. Memory 不在 Home 上变成管理界面。
11. Home 不暴露 `Agree` / `Disagree` / `Hide`。
12. Home 不显示 transcript history。
13. Home 不显示 medical diagnosis 或 sleep scoring。
14. Home 保持与共享 shell family 一致。
15. 本文档不反向定义数据契约或实现代码。

## 19. Implementation Notes For Future UI Worker

未来实现 Home 时应按以下顺序：

1. 先确认 `/` 只做 resolver，不承载最终 Home visual surface
2. 再确认 `/home` 是独立 continuation / recovery page
3. 保留现有 calm night atmosphere 与 single-recommendation shell
4. 移除任何 active onboarding preset 先落 Home 的表现
5. 让 Home recommendation 视觉上更像 safe next step，而不是 generic homepage
6. 在缺少正式 contract 字段时，使用明确标注的 mock / local derivation
7. 不在 UI 实现中发明新的 data fields

本 spec 故意保留 exact copy 与具体组件名的灵活性。  
它定义的是视觉系统、页面身份与页面级 UI 约束。
