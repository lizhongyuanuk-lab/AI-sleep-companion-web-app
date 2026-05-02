# 首次登录链路 主文档：PRD + 非 UI 交付规范

for Codex · Web / PWA MVP  
版本：V1.0（固定值已锁定）

适用范围：首次进入产品的完整链路，包括 Welcome、Onboarding、Result、可选生成 personal room、Room 承接、Room → Talk、guest-first 注册插入点。

## 1. 文档目的

本文档定义 Web / PWA MVP 阶段的首次登录完整链路，包括 `first-launch gate`、Welcome、Onboarding 两题、Result 承接页、可选生成个人 Room、Room 页面承接、用户从 Room 主动 tap 进入 Talk，以及 guest-first 注册插入策略。

本文档用于约束产品边界、数据流、single source of truth、生命周期、异常降级、埋点与验收标准，确保前端与 Codex：

- 不会把 onboarding 直接连到 Talk
- 不会把 personal room 生成做成自由创作工具
- 不会把注册前置为首次体验门槛

## 2. 页面 / 流程定位

这是一个首次登录链路文档，不是单页文档。

它在产品中的定位是：在用户第一次进入产品时，用最短路径建立首会话陪伴策略，并在首次阶段露出“生成个人 3D 睡眠空间”的核心卖点，最终把用户送到 Room，再由用户主动进入 Talk。

该链路默认继承现有产品系统的共享规则：

- 低刺激
- 移动端优先
- 语音优先
- 避免传统 IM 感
- Room 是空间入口
- Talk 是会话发生页

## 3. 页面目标

### 3.1 用户目标

- 快速表达当前状态与希望的陪伴方式
- 感受到系统在承接自己
- 有机会获得一个属于自己的睡眠空间
- 保留对空间选择的主动权

### 3.2 产品目标

- 生成稳定、可解释的首会话 session preset
- 在首次登录阶段露出 personal room 生成能力
- 不让首次链路过重
- 保持 Room 作为统一空间入口
- 保持 Talk 作为用户主动进入的最终会话页

## 4. 用户状态与验证重点

首次进入常见状态包括：

- 很困但睡不着
- 脑子停不下来
- 焦虑 / 烦躁 / 情绪乱
- 孤单想有人陪着

用户此刻通常不想做的事情：

- 先注册
- 填复杂表单
- 写 prompt
- 进入复杂编辑器
- 看到传统聊天产品 UI

此阶段真正要验证的是：

- 两题 onboarding 是否能提升首会话承接感
- personal room 是否能作为核心卖点被理解与点击
- Room 是否仍然作为统一入口保持成立
- 注册是否能后置到价值节点，而不是前置流失点

## 5. 与上下游页面 / 模块的关系

上游包括：

- App 启动入口
- App Shell
- 身份状态模块
- 本地持久化存储
- 设备能力信息
- 文案配置模块

下游包括：

- Room 页面
- Talk 页面
- 注册 / 登录模块
- personal room 生成服务
- 资产存储服务
- 埋点模块

关系定义：

- Onboarding 只输出陪伴策略 preset，不输出 room recommendation
- Result 页不直接进入 Talk
- 无论是否生成 personal room，都先进入 Room
- 只有用户在 Room 主动 tap 某个 room 时，Talk 才启动并消费当前 active preset 与对应 room 信息

## 6. 页面范围

### 6.1 本链路负责

- `first-launch gate`
- Welcome
- Onboarding 两题
- session preset 生成
- Result 承接页
- create personal room 入口
- 视觉方向选择
- personal room 生成与预览
- 跳转进入 Room
- 在 Room 中承接 generated room 或生成提示
- 让用户从 Room 进入 Talk
- 在价值节点弹注册提示
- 处理中断与降级

### 6.2 本链路不负责

- 推荐具体 room
- 在 onboarding 中自由写 prompt
- 直接进入 Talk
- 复杂 3D 编辑器
- 多轮微调空间
- 长期心理画像
- Memory 页面逻辑
- 睡眠监测设置
- Talk 中途 runtime 策略切换

## 7. 核心体验原则

1. 两题 onboarding 只决定陪伴策略，不决定 room。
2. personal room 生成是卖点，但不是门槛。必须露出，但允许跳过。
3. Room 是统一空间入口。无论是否生成 personal room，进入 Talk 前都必须先经过 Room。
4. 用户主动 tap 才进入 Talk。不允许 Result 页自动进 Talk，不允许生成成功后自动进 Talk。
5. 注册必须后置到价值出现之后。Web MVP 不允许先注册再体验。
6. Result、Room、Talk 三处承接不得重复。

## 8. 核心能力清单

### 8.1 第一阶段必须有

- `first-launch gate`
- Welcome
- Onboarding 两题
- fixed preset mapping
- Result 承接页
- create personal room 入口
- 固定视觉方向选择
- 自动生成 personal room seed
- personal room 预览
- 跳过生成后进入 Room
- 生成成功后进入 Room
- Room 中显示 generated room 或 generate nudge
- Room → Talk 正确透传 preset 与 room 数据
- guest-first 身份策略
- 注册软提示 / 兜底 / 强注册点
- 中断恢复、过期、失败 fallback

### 8.2 后续再做

- 自由 prompt 生成
- 多轮风格微调
- 复杂 3D 空间编辑
- 多房间收藏管理
- 跨设备完整 guest 继承
- 更细的个性化推荐
- 更多登录方式

## 9. 页面入口与上下游数据契约

### 9.1 `first-launch gate`

Single source of truth：`has_completed_first_launch_flow: boolean`

- `false`：进入首次链路
- `true`：正常进入 Room
- 这是 app-level gate，不允许任何子页面自行替代

### 9.2 onboarding 输入真源

配置真源：`FIRST_LAUNCH_ONBOARDING_OPTIONS_V1`

| 问题 | 固定文案 / 选项 |
| --- | --- |
| Q1 | 你现在更像是哪一种状态？｜很困，但就是睡不着；脑子停不下来，一直在想；有点焦虑 / 烦躁 / 情绪乱；有点孤单，想有人陪着 |
| Q2 | 你现在更希望我怎么陪你？｜帮我快点睡着；先安抚我一下，陪我聊几句；冥想正念练习；不用多说，安静陪我 |

草稿真源：`firstLaunchFlowDraft`

| 字段 | 说明 |
| --- | --- |
| `current_step` | 当前所处步骤 |
| `q1_state` | Q1 选项值 |
| `q2_support_style` | Q2 选项值 |
| `entered_create_room_branch` | 是否进入过 create room 分支 |
| `selected_visual_theme` | 视觉方向选择 |
| `updated_at` | 草稿更新时间 |

### 9.3 onboarding 输出真源

Single source of truth：`postOnboardingSessionPreset`

| 字段 | 说明 |
| --- | --- |
| `preset_id` | 固定映射表生成的 preset 唯一标识 |
| `q1_state` | 当前状态答案 |
| `q2_support_style` | 陪伴方式答案 |
| `base_mode` | 主支持路线 |
| `state_modifier` | 状态修正器 |
| `opening_copy_id` | Talk 首句文案 ID |
| `reply_length_default` | 默认回复长度 |
| `question_budget_first_3_turns` | 前 3 轮主动提问上限 |
| `sleep_transition_enabled` | 是否允许向睡眠收束 |
| `fallback_chain` | Talk 可参考的降级链 |
| `created_at` | 创建时间 |
| `status` | `active` / `consumed` / `expired` |

规则：

- 结果页生成并写入 session-level store
- Room 只读，不重算、不改写
- Talk 消费完整 preset，不得只拿 `preset_id` 再反查

### 9.4 personal room 生成输入与输出

视觉方向真源：`PERSONAL_ROOM_THEME_OPTIONS_V1`

- 森林 / 自然
- 雨夜 / 窗边
- 星夜 / 开阔
- 温暖室内 / 安全感

生成草稿真源：`personalRoomGenerationDraft`

| 字段 | 说明 |
| --- | --- |
| `visual_theme` | 视觉方向选择 |
| `generation_seed_id` | 生成 seed ID |
| `generation_job_id` | 生成任务 ID |
| `generation_status` | `not_started` / `generating` / `ready` / `failed` |
| `preview_asset_id` | 预览资源 ID |
| `updated_at` | 更新时间 |

生成结果真源：`generatedPersonalRoomRecord`

| 字段 | 说明 |
| --- | --- |
| `room_id` | 空间记录 ID |
| `background_asset_id` | 背景资产 ID |
| `room_source` | 固定为 `generated` |
| `visual_theme` | 视觉方向 |
| `created_from_onboarding` | 是否来自首次链路 |
| `created_at` | 创建时间 |
| `guest_saved_until` | guest 本地保留截止时间 |

规则：

- 视觉方向只服务于资产生成，不写入 onboarding preset
- 用户不输入自由 prompt
- `generatedPersonalRoomRecord` 生命周期长于 onboarding preset

### 9.5 Room → Talk 数据契约

Talk 必须接收 onboarding 侧字段与 Room 侧字段的合并对象。

| 来源 | 字段 |
| --- | --- |
| onboarding 侧 | `preset_id`, `q1_state`, `q2_support_style`, `base_mode`, `state_modifier`, `opening_copy_id`, `reply_length_default`, `question_budget_first_3_turns`, `sleep_transition_enabled`, `fallback_chain` |
| Room 侧 | `room_id`, `room_source`, `background_asset_id`, `room_theme`, `room_entry_action` |

规则：

- Room 浏览多个 room 不改变 preset
- 最终只有用户 tap 的 `room_id` 才和 preset 合并
- Talk 不得二次推导 preset

## 10. 运行时关键状态定义

### 10.1 Single source of truth

- `has_completed_first_launch_flow`
- `firstLaunchFlowDraft`
- `postOnboardingSessionPreset`
- `personalRoomGenerationDraft`
- `generatedPersonalRoomRecord`
- `auth_status = guest | authenticated`

### 10.2 首次链路步骤状态

- `welcome`
- `onboarding_q1`
- `onboarding_q2`
- `session_result`
- `create_room_entry`
- `select_room_theme`
- `room_generating`
- `room_generation_preview`
- `room_page`

### 10.3 preset 状态

- `active`
- `consumed`
- `expired`

### 10.4 personal room 生成状态

- `not_started`
- `generating`
- `ready`
- `failed`

### 10.5 preset 生命周期

- onboarding 完成后写入一份新的 `active preset`
- 用户在 Room 中浏览不改变该 preset
- 用户从 Room 成功进入 Talk 后，立即标记为 `consumed`
- `consumed` 不复用
- 超过 TTL 或冷启动后，变为 `expired`
- 新 onboarding 覆盖旧的 `active / expired`
- 同一时刻只允许一个 `active preset`
- TTL 固定为 `30 分钟`

### 10.6 personal room 生命周期

- 用户未进入生成分支前为 `not_started`
- 生成中为 `generating`
- 成功后为 `ready`
- 失败后为 `failed`
- guest 状态下允许最多 `1` 个 generated personal room
- 未注册 guest 的 generated room 本地保留 `7 天`
- 注册成功后转为账号资产

## 11. 内容策略与文案规则

- Onboarding 两题文案固定，不允许改写，不使用诊断性语言，不引入测评感
- Result 页文案来自受控 copy 表，不用模型生成
- create personal room 入口文案目标是露出卖点，但不压迫用户
- 推荐表达：今晚，我也可以为你准备一个属于你的睡眠空间；你也可以先看看现成空间
- 视觉方向问题是视觉偏好题，不是新的情绪题
- 注册提示文案必须绑定“保存 / 继续 / 保留资产”的理由，不得使用“先注册再体验”之类表达

## 12. 异常与 fallback 策略

- 用户跳过生成 personal room：不报错，直接进入 Room；Room 中后续仍可再次引导生成
- personal room 生成超时：不阻塞首次链路，先进入 Room；Room 中可显示占位状态 `Your Room is being prepared`，准备完成后替换为真实 generated room 卡片
- personal room 生成失败：不阻塞进入 Room；允许重试或跳过；Room 中仍可再次发起生成
- preset 过期：Room → Talk 时若 preset 过期，Talk 按普通 Room 入口默认逻辑启动，不弹错误，不强制回 onboarding
- 用户中断恢复：Welcome / onboarding / create room 分支中断后，恢复 `firstLaunchFlowDraft`；若首次链路已完成，不回到起点
- 注册提示关闭冷却：同一 session 不再弹同类型提示；下一次最早 24 小时后再弹；强注册点除外

## 13. 埋点与验证指标

### 13.1 首次链路埋点

| 模块 | 事件 |
| --- | --- |
| Gate | `first_launch_gate_hit`；`first_launch_flow_start` |
| Onboarding | `onboarding_q1_select`；`onboarding_q2_select`；`onboarding_result_view` |
| Personal room | `create_personal_room_entry_view`；`create_personal_room_click`；`personal_room_theme_select`；`personal_room_generation_start`；`personal_room_generation_success`；`personal_room_generation_fail`；`personal_room_use_click`；`personal_room_regenerate_click`；`personal_room_skip_click` |
| Room 承接 | `room_view_after_first_launch`；`generated_room_card_impression`；`generate_room_nudge_impression`；`generate_room_nudge_click` |
| Talk 进入 | `room_enter_talk_after_first_launch`；`talk_enter_with_first_launch_preset`；`first_launch_preset_consumed`；`first_launch_preset_expired_before_talk` |
| 注册相关 | `register_nudge_impression`；`register_nudge_click_signup`；`register_nudge_dismiss`；`register_success_after_nudge`；`register_required_for_asset_save`；`guest_generated_room_limit_hit` |

`trigger_type` 枚举：

- `personal_room_success`
- `talk_value_reached`
- `room_depth_reached`
- `third_visit_fallback`
- `asset_save_required`
- `second_generated_room_required`

### 13.2 关键验证指标

- 首次链路漏斗：first-launch flow 启动率、onboarding 完成率、create room entry 到达率、create room 点击率、personal room 生成成功率、进入 Room 率、Room → Talk 转化率
- 核心卖点指标：generated room 使用率、generate nudge 点击率、guest 生成后注册率
- 注册策略指标：软提示曝光率、软提示点击率、第三次进入兜底提示点击率、强注册点完成率
- 风险指标：Q2 分布是否过度集中、personal room 失败率是否过高、preset 过期率、guest 资产丢失投诉率

## 14. 技术边界

### 14.1 第一阶段必须保证

- `first-launch gate`
- onboarding 两题
- fixed preset mapping
- create personal room 入口
- 固定视觉方向选择
- 自动生成 personal room seed
- preview
- Room 承接
- Room → Talk 正确透传
- guest-first 身份策略
- 注册插入点
- fallback 稳定

### 14.2 第一阶段明确不做

- 自由 prompt 输入生成背景
- room 推荐排序
- onboarding 直接进 Talk
- 自动选择 room
- 复杂 3D 编辑器
- 多轮空间微调
- 首次链路中插入设置页
- 用户名密码 / 手机号注册

### 14.3 禁止开发自由发挥的地方

- 把 create personal room 并入 onboarding 第三题
- 让 onboarding 结果直接决定 room
- 让 Result 页 CTA 直接进入 Talk
- 在 Room 自动推荐或高亮某个 room
- 在 Room 重算 preset
- 在 Talk 中根据 `preset_id` 二次推导
- 让 guest 无限创建 generated room
- 在首次链路前置强制注册
- 在 Talk 进行中强弹注册全屏拦截
- 让 Result / Room / Talk 三处重复同类承接文案

## 15. 验收标准

### 15.1 功能验收

- 首次进入能正确命中 `first-launch gate`
- onboarding 两题完成后生成 preset
- Result 页后能进入 create room entry
- 用户可生成 personal room 或跳过
- 生成成功后仍先进入 Room
- Room 中可见 generated room 或生成提示
- 用户 tap room 后能正确进入 Talk
- Talk 接收到完整 preset + room 数据
- preset 在 Talk 成功进入后被 `consumed`
- guest 只能创建 `1` 个 generated room
- 注册提示按定义时机触发

### 15.2 一致性验收

- 不存在 onboarding 直接进 Talk
- 不存在 onboarding 推荐 room
- 不存在 Room 自动高亮推荐
- 不存在 create personal room 被实现成第三道心理题
- 不存在 Talk 重算 preset

### 15.3 体验验收

- 首次流程不重
- 核心卖点“生成个人睡眠空间”被明确露出
- 用户仍保有 room 选择权
- Room 是统一入口
- 注册不在价值前触发

## 16. 身份策略与注册插入点规则

总体策略：`guest-first`，`value-before-auth`

- 首次进入产品时不要求先注册或登录
- 用户可以以游客身份完成完整首次链路
- 注册只在用户已经获得明确价值后再触发
- 注册用于保存资产与继续体验，而不是作为进入门槛

### 16.1 首次链路中的身份默认值

- 默认 `auth_status = guest`
- 游客状态下允许完成：Welcome、Onboarding 两题、生成 `postOnboardingSessionPreset`、进入 create room 分支、生成 personal room、进入 Room、从 Room 进入 Talk
- V1 中不得将注册作为进入 onboarding、Room、Talk 或首次生成 personal room 的前提

### 16.2 注册触发策略：三层结构

Layer 1：价值触发型软提示。任一满足即可触发一次：

- `personal_room_generation_success = true`
- `talk_duration_seconds >= 90`
- `talk_turn_count >= 3`
- `room_swipe_count >= 3`

Talk 正在进行时不做硬打断，若触发发生在 Talk 中，则延迟到 Talk 自然结束或返回 Room 后再展示。

Layer 2：第三次进入兜底提示。触发条件：

- `visit_count >= 3`
- `auth_status = guest`
- 至少完成过一个价值动作：进入过 Talk、生成过 personal room、浏览 Room 达到深度阈值

第三次进入只是兜底逻辑，不是唯一注册触发点。

Layer 3：资产保存型强注册点。推荐强触发点：

- 保存 generated personal room
- 想下次继续这个空间
- 想保留首会话进度
- 想进入 Memory 页面
- 想创建第二个 generated room

V1 允许 guest 创建 `1` 个 generated personal room；尝试创建第 `2` 个时要求注册或登录。

### 16.3 固定阈值（V1）

| 参数 | 固定值 |
| --- | --- |
| `visit_count_for_register_nudge` | `3` |
| `room_swipe_count_for_register_nudge` | `3` |
| `talk_duration_seconds_for_register_nudge` | `90` |
| `talk_turn_count_for_register_nudge` | `3` |
| `max_guest_generated_room_count` | `1` |
| `guest_generated_room_local_retention` | `7 天` |
| `register_nudge_cooldown` | 同 session 不重复，24 小时后再弹 |

### 16.4 注册方式

- Web MVP 只支持 Google 登录 与 邮箱 magic link
- 不做用户名密码注册
- 不做手机号注册
- 不做多社交平台并列登录

### 16.5 注册成功后的行为

- 立即绑定当前 guest session 的可保留资产
- 必须保留：当前 generated personal room（若存在）、当前 active 或最近一次 onboarding preset 的必要记录、当前用户在本次 session 中的 room 偏好与继续入口
- 不应保留为长期标签：Q1 / Q2 原始答案作为永久心理画像、未确认的临时情绪状态、过期草稿
