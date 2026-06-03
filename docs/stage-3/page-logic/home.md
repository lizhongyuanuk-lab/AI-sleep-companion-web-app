# Home 页面主文档：PRD + 非 UI 产品逻辑规范

Stage 3 · Home canonical product truth

本文件是 Stage 3 Home 页面当前的产品逻辑真源，用于定义页面定位、职责边界、推荐原则、页面状态、跳转原则、fallback 与页面级验收标准。

本文件只属于产品逻辑层。

- 不定义具体视觉样式
- 不定义实现代码
- 不替代 `docs/stage-3/data-contract.md`
- 不替代 `docs/stage-3/page-data-matrix.md`
- 不替代 `docs/stage-3/ui/home-ui-spec.md`

---

## 0. Stage 3 三层关系声明

Home PRD 必须继承 Stage 3 的分层关系。

### 0.1 产品逻辑层

来源文件：

- `docs/stage-3/page-logic/home.md`
- `docs/stage-3/home-rules.md` if present
- `docs/stage-3/product-logic.md` if present

职责：

- 定义 Home 是什么
- 定义 Home 不是什么
- 定义 Home 在 Onboarding / Room / Talk / Memory / Sleep 之间的职责边界
- 定义 Home 的推荐规则
- 定义 Home 的页面状态
- 定义 Home 的跳转原则
- 定义 Home 的非目标

Home PRD 属于产品逻辑层。

### 0.2 数据契约层

来源文件：

- `docs/stage-3/data-contract.md`
- `docs/stage-3/page-data-matrix.md`
- `docs/stage-3/store-and-api-contract.md` if present

职责：

- 定义 `HomeRecommendation`
- 定义 `HomeRecommendation.source` / `sourceId` / `cta`
- 定义 Home 页面读取、写入、派生、事件、跳转 payload
- 定义 Hidden Memory 不得作为 `HomeRecommendation` 来源
- 定义 `HomeRecommendation` 除 `system_default` 外必须可追溯
- 定义 Home 点击推荐时的 payload

Home PRD 可以提出数据需求，但不得直接替代 data-contract。

如果 Home PRD 发现现有数据契约不足，必须标记为：

`Needs Data Contract Alignment`

不得在 PRD 中直接发明实现字段并要求代码使用。

### 0.3 UI 表达层

来源文件：

- `docs/stage-3/ui/home-ui-spec.md`
- shared product UI standards

职责：

- 定义 Home 视觉层级
- 定义 night atmosphere family
- 定义 hero / card / CTA / memory preview 的视觉表达
- 定义 spacing / safe area / shell language
- 定义 forbidden visual traits
- 定义 UI-level acceptance criteria

Home PRD 只定义页面职责与行为，不定义具体视觉样式。

### 0.4 实现层

来源文件：

- application source files

职责：

- 按产品逻辑层、数据契约层、UI 表达层实现 Home
- 不得在实现中发明新的 `HomeRecommendation` 类型
- 不得绕过 Page Data Matrix
- 不得把 hidden / disagreed / expired / blocked memory 展示到 Home
- 不得把 Home 做成 dashboard / feed / analytics page

### 0.5 不可逆规则

Implementation 不得反向修改 UI Spec。  
UI Spec 不得反向修改 Data Contract。  
Data Contract 不得反向推翻 Product Logic。  
如发现冲突，必须回到 Stage 3 review，而不是由 worker 自行解释。

---

## 1. 文档角色与优先级

本文档是 Stage 3 Home 页面产品逻辑真源。

优先级：

1. `docs/stage-3/product-logic.md` if present
2. `docs/stage-3/page-logic/home.md`
3. `docs/stage-3/data-contract.md` after alignment
4. `docs/stage-3/page-data-matrix.md` after creation
5. `docs/stage-3/ui/home-ui-spec.md`
6. implementation files

本文档决定：

- Home 是什么
- Home 不是什么
- Home 读取什么业务对象
- Home 是否写入业务对象
- Home 如何派生主推荐
- Home 如何跳转
- Home 如何与 Onboarding / Room / Talk / Memory / Sleep 分工
- Home 的页面级验收标准

本文档不决定：

- 具体视觉样式
- 组件实现
- CSS / Tailwind class
- React component structure
- 后端 API 细节
- 真实模型 prompt
- mock 数据内容

---

## 2. 页面定义

Home 是睡眠陪伴产品的轻量默认入口。

Home 不是：

- dashboard
- analytics page
- feed
- memory management page
- transcript page
- medical sleep report
- settings page
- onboarding result page
- Talk 页面替代品

Home 的核心职责是：

展示一个主推荐  
+  
少量基础导航入口  
+  
记录 recommendation view / click  
+  
把用户带到下一步最合理行动

Home 不做复杂信息流。  
Home 不做外部 push。  
Home 不直接管理 Memory。  
Home 不展示完整睡眠趋势。  
Home 不展示 transcript。  
Home 不做医学化睡眠评分。

---

## 3. 用户目标、产品目标与成功标准

### 3.1 用户目标

用户进入 Home 后，应在几秒内理解：

- 现在应该做什么
- 今晚可以从哪里开始
- AI companion 仍然有连续性
- 页面不会要求用户处理复杂任务
- 可以轻松进入 `Talk` / `Room` / `Memory` / `Sleep`

### 3.2 产品目标

Home 的产品目标是：

- 承接 App Entry Resolver 的默认入口
- 提高 returning user 的下一步行动率
- 让用户自然进入 `Talk` / `Room` / `Sleep` check-in / `Memory` review
- 把跨页面数据闭环转化为一个轻量 next-best-action
- 记录 Home recommendation 的曝光与点击
- 支持后续留存验证

### 3.3 成功标准

Home 成功的判断不是信息多，而是：

- 用户能快速理解主推荐
- 用户能点击主 CTA 进入下一步
- Home 不制造额外认知负担
- Home 不破坏 `Onboarding → Room → Talk` 的首夜链路
- Home 不错误使用 hidden memory
- Home 的推荐可以追溯来源

---

## 4. Home 在 App Entry 中的位置

Stage 3 的初始路由规则：

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

产品含义：

1. 未完成 onboarding 的用户不进入 Home，而是进入 `/onboarding`
2. 仍持有 `activeOnboardingPreset` 的用户优先进入 `/room`，以保持首夜链路闭环
3. 只有当 onboarding 已完成、且不需要优先承接首夜 preset 时，默认入口才落到 `/home`

因此，Home 在 Stage 3 中是：

- onboarding 之后的默认轻量入口
- 首夜强承接完成后的常规入口
- returning user 的常规入口

Home 不是：

- onboarding 的替代页
- 首夜 preset 的主要承接页
- `/room` 的替代入口

---

## 5. 页面范围

### 5.1 In Scope

Home 负责：

- 展示一个主推荐
- 展示少量基础导航入口
- 承接轻量 continuity
- 将 recommendation 曝光与点击交给埋点层记录
- 把用户路由到下一步合理行为
- 在无可用 continuity 时给出安全默认入口

Home 可以读取的业务上下文包括：

- onboarding 是否完成
- 是否存在需要优先承接的首夜 preset
- 最近 Talk / Room / Sleep / Memory 的轻量结果
- 是否存在可用于推荐的可见 Memory

Home 可以承接的推荐方向包括：

- 继续进入 `Talk`
- 在无更好来源时使用系统默认推荐

补充规则：

- `Room` / `Sleep` / `Memory` 可以提供 continuity 来源或作为少量基础导航入口
- Stage 3 Home 的主推荐 CTA 仍然只进入 `Talk`

### 5.2 Out Of Scope

Home 不负责：

- full transcript history
- Memory agree / disagree / hide
- Memory 删除或编辑
- Sleep 深度趋势浏览
- onboarding 问卷本身
- 首夜结果页承接
- 多推荐流并列竞争
- 长列表 feed
- 外部 push inbox
- 医疗化评分解释

---

## 6. 核心体验原则

Home 必须满足以下原则：

1. `One recommendation over many choices`
2. `Lightweight entry over information density`
3. `Continuity over recap`
4. `Navigation support over dashboard composition`
5. `Sleep companionship over productivity framing`
6. `Read-only continuity over direct object management`
7. `Traceable recommendation over opaque randomness`
8. `Graceful fallback over empty-state technical exposure`

补充解释：

- Home 可以提供少量基础入口，但只能有一个主推荐
- Home 可以让用户感知连续性，但不能把页面做成 recap panel
- Home 可以读取 Memory / Sleep / Room / Talk 的结果，但不直接接管这些页面的职责

---

## 7. HomeRecommendation 产品规则

### 7.1 核心定义

Home 的主内容不是 feed，而是一个 `HomeRecommendation`。

产品层只定义以下原则：

- Home 每次默认只展示一个主推荐
- 该推荐必须服务于“下一步最合理行动”
- 推荐来源必须可解释
- 推荐结果必须可追溯
- 推荐不可来自 hidden memory

精确的 TypeScript 定义、枚举值、payload 结构、事件名，属于 data-contract 层。

### 7.2 推荐来源的产品优先级

HomeRecommendation 的产品优先级应遵循以下顺序：

1. 首夜链路未完成时，不进入 Home，而由 App Entry Resolver 将用户导向 `/onboarding` 或 `/room`
2. 存在合格的可见 Memory，可作为轻量 continuity 来源
3. 今天早上尚未完成 sleep check-in
4. 存在可用 `SleepInsight`
5. 最近一次明确的 Talk continuity 适合继续进入 `Talk`
6. 当以上都不成立时，使用 `system_default`

这里的“优先级”是产品规则，不等于数据层枚举排序。

### 7.3 推荐来源限制

HomeRecommendation 不得来自：

- hidden memory
- disagreed memory
- expired memory
- blocked memory
- 不可追溯的历史摘要
- 需要用户先阅读大量上下文才可理解的对象

如果推荐来自 Memory，则 Home 只能消费“可见、可用于 Home 的轻量 continuity”，而不能消费完整 Memory 管理对象。

### 7.4 推荐可追溯性

除 `system_default` 外，HomeRecommendation 必须可追溯。

产品层要求：

- 用户点击推荐后，系统应能知道该推荐来自哪一类上游对象
- 推荐来源必须能映射到明确业务来源，而不是纯文案拼接
- 若来源是 Memory，则必须可证明该 Memory 符合展示资格
- 主 CTA 必须把用户带入 `Talk`，而不是把 Home 变成 `Room` / `Sleep` / `Memory` 的替代入口

`Needs Data Contract Alignment`

- `HomeRecommendation.source` 的确切枚举
- `HomeRecommendation.sourceId` 的精确格式
- Home recommendation traceability 的存储与上报方案

---

## 8. 页面状态定义

Home 在产品层至少包含以下状态：

### 8.1 `entry_guard_redirect`

用户尚未满足进入 Home 的前提。

表现要求：

- 不渲染完整 Home
- 由 App Entry Resolver 导向 `/onboarding` 或 `/room`

### 8.2 `default_recommendation_ready`

存在一个可展示的主推荐，页面以该推荐为主。

这是 Home 的默认正常状态。

### 8.3 `continuity_available`

除主推荐外，页面可展示轻量 continuity 感知，但不能形成多卡并列竞争。

### 8.4 `memory_eligible_continuity`

存在合格 Memory，可作为轻量 continuity 的一部分。

约束：

- 只能轻量读
- 不能在 Home 上管理 Memory
- 不改变 Home “单主推荐” 的原则

### 8.5 `sleep_eligible_continuity`

存在来自 Sleep 的合理下一步信号，可参与主推荐或辅助解释。

约束：

- Home 不展开为 sleep report
- 不默认展示完整趋势分析

### 8.6 `system_default_fallback`

没有更优上游来源时，使用 `system_default`。

要求：

- 仍然给出明确下一步
- 不能让页面变成空白 dashboard

### 8.7 `data_partial_fallback`

部分 continuity 数据缺失，但仍可安全渲染 Home。

要求：

- 保留主推荐
- 隐藏失效 continuity
- 不暴露技术词

### 8.8 `error_safe_fallback`

推荐派生失败或依赖对象不可安全使用。

要求：

- 仍保持 Home 的轻量入口角色
- 优先回退到可解释的默认入口

---

## 9. 页面读取、写入与对象边界

### 9.1 读取原则

Home 是读多写少页面。

Home 可以读取：

- onboarding completion 状态
- active onboarding preset 的存在性与可用性
- 最近 Talk / Room / Sleep / Memory 的轻量派生结果
- 导航所需的基础页面可达性

Home 不应读取：

- transcript 全量内容作为默认主展示
- Memory 全量管理对象作为默认主展示
- Sleep 全量趋势卡数据作为默认主展示

### 9.2 写入原则

Home 不直接写业务对象。

Home 不直接修改：

- `MemoryItem`
- `TalkSession`
- `Room`
- `SleepRecord`

Home 允许的写入只应限于：

- recommendation impression / click 的事件记录
- 进入下一路由所需的最小导航上下文

精确写入接口与 payload 归属 data-contract 层。

### 9.3 派生原则

Home 可以派生：

- 当前主推荐
- 轻量 continuity 说明
- 主 CTA 的目标方向

Home 不应派生：

- 多层推荐排序列表
- 完整 feed
- 长摘要诊断
- 医疗化结论

`Needs Data Contract Alignment`

- recommendation derivation inputs 的精确字段集合
- Home 页面只读 store selector / API shape
- 跳转上下文 payload 的精确结构

---

## 10. Home 与其他页面的职责边界

### 10.1 与 Onboarding 的关系

Onboarding 负责：

- 完成首次必要输入
- 生成首夜链路所需 preset

Home 不负责：

- 重做 onboarding
- 承接 onboarding 问题本身
- 把 onboarding 结果页逻辑吸收到常规默认入口

### 10.2 与 Room 的关系

Room 负责：

- 空间选择
- 空间承接
- 首夜 preset 的主要空间入口

Home 负责：

- 在合适时把用户送回 `/room`

Home 不负责：

- 替代 Room 做空间浏览
- 展示完整房间列表

### 10.3 与 Talk 的关系

Talk 负责：

- voice-presence interaction
- 实际会话发生

Home 负责：

- 在合适时把用户送入 `/talk`

Home 不负责：

- 替代 Talk
- 展示 transcript
- 展示会话主表面

### 10.4 与 Memory 的关系

Memory 负责：

- review
- agree
- disagree
- hide
- memory control

Home 负责：

- 在合格条件下读取轻量 continuity
- 在需要时把用户送到 `/memory`

Home 不负责：

- 同页管理 Memory
- 暴露 agree / disagree / hide
- 把 Memory 做成 Home 主任务

### 10.5 与 Sleep 的关系

Sleep 负责：

- sleep reflection
- sleep trend / rhythm / suggestion

Home 负责：

- 在合适时承接一个轻量 sleep-derived next-best-action

Home 不负责：

- 展示完整 sleep report
- 展示完整趋势分析

---

## 11. 跳转原则

Home 的跳转目标可以包括：

- `/talk`
- `/room`
- `/memory`
- `/sleep-monitoring`

跳转原则：

1. 主推荐只对应一个主 CTA
2. 跳转必须与 recommendation 来源一致
3. 跳转时不得携带 transcript 全量内容
4. 跳转时不得携带 raw memory payload，除非 data-contract 明确允许
5. 跳转时不得把 Home 变成对象管理中间页

`Needs Data Contract Alignment`

- Home recommendation click payload
- route-level navigation context
- `HomeRecommendation.cta` 的精确定义
- 从 Home 到各页面的最小 payload 结构

---

## 12. Fallback 与错误策略

Home 必须可降级。

### 12.1 无推荐来源

当不存在明确 continuity 来源时：

- 使用 `system_default`
- 仍然提供一个明确主 CTA
- 不渲染“空 dashboard”

### 12.2 Memory 来源不可用

当 Memory 不可安全用于 Home 时：

- 不使用该 Memory 作为推荐来源
- 不展示不确定 continuity
- 不暴露技术错误

### 12.3 Sleep 来源不可用

当 Sleep 数据不足时：

- 不阻塞 Home
- 回退到其他来源或 `system_default`

### 12.4 Talk / Room continuity 不可用

当最近会话或最近房间不可恢复时：

- 不显示伪恢复态
- 回退到仍可解释的主推荐

### 12.5 工程错误暴露限制

Home 不得向用户暴露：

- `undefined`
- `null`
- `fetch failed`
- `query error`
- `contract missing`

---

## 13. 非目标

以下内容不是当前 Stage 3 Home 的目标：

- 多推荐 feed
- 推荐排序实验台
- dashboard 百分比展示
- 睡眠评分首页化
- 首页 Memory 管理
- 首页 transcript 回看
- push inbox
- settings workbench
- 复杂账户页

---

## 14. 页面级验收标准

Home PRD 通过的标准是：

1. 明确 Home 是轻量默认入口，而不是 dashboard / analytics page / feed
2. 明确 Home 每次默认只展示一个主推荐
3. 明确 Home 不替代 Onboarding / Room / Talk / Memory / Sleep
4. 明确 HomeRecommendation 必须可追溯
5. 明确 hidden memory 不得作为 HomeRecommendation 来源
6. 明确 Home 不直接管理 Memory
7. 明确 Home 不展示 transcript
8. 明确 Home 不展示医学化睡眠评分
9. 明确 Home 的默认入口位置来自 App Entry Resolver
10. 明确 Home 的状态与 fallback 规则
11. 明确产品逻辑层与 data-contract / UI spec / implementation 的分层关系
12. 明确需要 data-contract alignment 的缺口，而不是在 PRD 中直接发明实现字段

---

## 15. 与其他页面的最终边界总结

- Onboarding owns first required input and first-night preset creation.
- Room owns space entry and space browsing.
- Talk owns voice-presence interaction.
- Memory owns review, agree, disagree, hide, and memory control.
- Sleep owns reflection and sleep-derived insight surfaces.
- Home owns lightweight default entry, one main recommendation, and route handoff.

Home 的职责是连接这些页面，而不是吸收它们的职责。
