# Talk 页面 UI / 交互 Spec

PRD 固定内容 + Replika 风格实现版 Final。

本文档定义 Talk 页面的最终 UI 结果、组件样式、状态表现与交互流转，供设计、前端与 Codex 直接实现。

## 0. 文档定位

约束优先级固定如下：

1. Talk PRD
2. Talk 主文档中的非 UI 交付规范
3. 本 UI / 交互 Spec
4. Replika 参考图

解释：

- PRD 决定页面有什么
- 本 spec 决定这些内容怎么显示、怎么动、怎么切状态
- Replika 只约束视觉与交互表达方式，不决定功能集合

任何“为了更像 Replika”而新增 PRD 未定义模块的实现，均视为不合格。

## 1. 参考边界与实现原则

必须严格参考：

- 胶囊式顶部导航的材质、紧凑度、层级关系
- 深浅双模式的观感切换方式
- 文本气泡、图片卡片、音频条、日期 chip 的样式语言
- 底部单条胶囊 dock 的结构、比例与气质
- 整体留白、透明度、毛玻璃、轻阴影、弱边框
- icon 尺寸、笔画、对齐、视觉统一性

不得照搬：

- Replika 原有导航数量与名称
- Diary / Activities / Profile 等业务模块
- 角色系统与人物业务
- 付费转化内容
- 非本页信息架构

实现原则：

- 结构一致优先于创意发挥
- 视觉秩序一致优先于局部美化
- 不得用“大概像”替代明确数值
- 不得把页面实现成普通 IM
- 不得让 typing 反客为主
- `Tap to speak` + `Mic` 必须成为底部最强主操作
- Light / Dark 只允许换皮，不允许换骨架

## 2. 页面设计目标

Talk 页面必须同时满足：

- 第一眼具有明显的 Replika 式陪伴产品质感
- 页面主操作为 `Tap to speak`
- 麦克风是高优先级强操作
- 图片发送仅为辅助能力
- 页面不能退化为普通聊天工具
- Light / Dark 必须是同骨架双模式
- UI 必须服务于连续语音陪伴
- 所有状态切换必须稳定，不依赖运行时智能乱变

页面第一视觉优先级固定为：

1. 整体氛围 + 底部语音主操作
2. Talk 内容区
3. 顶部导航
4. 辅助功能

## 3. 参考视口与适配基准

- 移动端 Web / PWA 竖屏为第一优先
- 基准视口固定为 `393 x 852`

规则：

- 更窄屏仅允许收紧横向留白，不改结构
- 更长屏仅允许增加垂直留白，不改区域顺序
- 顶部导航不得改成底部 tab
- bottom dock 不得拆成多个悬浮控件
- keyboard 打开后不得改变页面主骨架

## 4. 设计 Tokens

### 4.1 圆角体系

- `radius-sm = 12px`
- `radius-md = 18px`
- `radius-lg = 24px`
- `radius-pill = 999px`

组件映射：

- Top nav capsule / active item / Bottom dock / Date chip / Audio strip 使用 `radius-pill`
- Text bubble 与 Image card 使用 `radius-lg`

### 4.2 间距体系

- `space-4 = 4px`
- `space-8 = 8px`
- `space-12 = 12px`
- `space-16 = 16px`
- `space-20 = 20px`
- `space-24 = 24px`

页面只允许使用以上 6 档间距。

### 4.3 字体体系

- Top nav label -> `12px / 16px / Medium`
- Date chip -> `11px / 14px / Medium`
- Bubble text -> `15px / 21px / Regular`
- Bubble meta -> `11px / 14px / Regular`
- Dock primary label -> `16px / 20px / Medium`
- Inline state hint -> `12px / 16px / Regular`
- Error hint -> `12px / 16px / Medium`

### 4.4 Icon 体系

- Nav icon -> `16px`
- Dock secondary icon -> `20px`
- Mic icon -> `20px`
- Inline state icon -> `16px`

统一规则：

- icon 使用同一笔画体系
- 推荐统一 `stroke = 1.75px`
- 禁止 `filled / outline` 混用
- 禁止个别 icon 单独加粗或单独加阴影

### 4.5 动效体系

- 常规状态切换 -> `180ms`
- Dock 状态切换 -> `220ms`
- Theme 切换 -> `280ms`
- Mic pulse -> `1600ms` 循环
- Overlay / image preview -> `240ms`

曲线：

- `ease-out` 用于出现
- `ease-in-out` 用于状态过渡
- 禁止强 bounce

## 5. Color Tokens

### 5.1 Light Mode

- `--bg-page: #F3F4FA`
- `--bg-page-top: #EAF2FB`
- `--bg-page-bottom: #F6F3F4`
- `--nav-capsule-bg: rgba(214, 220, 233, 0.82)`
- `--nav-capsule-border: rgba(88, 98, 123, 0.10)`
- `--nav-item-active-bg: rgba(255, 255, 255, 0.76)`
- `--text-primary: #2E3445`
- `--text-secondary: #717A8E`
- `--text-muted: #98A0B2`
- `--bubble-bg-primary: #FFFFFF`
- `--bubble-bg-secondary: #E8EDF7`
- `--bubble-border: rgba(104, 113, 138, 0.08)`
- `--audio-strip-bg: #E5EBF6`
- `--audio-strip-progress: #707B96`
- `--audio-strip-time: #7F889C`
- `--date-chip-bg: rgba(210, 216, 229, 0.62)`
- `--date-chip-text: #6E768A`
- `--dock-bg: rgba(229, 233, 243, 0.84)`
- `--dock-border: rgba(96, 105, 130, 0.10)`
- `--dock-primary-text: #353C4D`
- `--dock-icon: #62697C`
- `--dock-icon-muted: #939AAC`
- `--mic-ready-bg: rgba(255, 255, 255, 0.66)`
- `--mic-recording-bg: #DCE3F5`
- `--mic-recording-icon: #414B67`
- `--image-attach-active: #6B7595`
- `--typing-entry-icon: #7A8398`
- `--state-hint-bg: rgba(220, 226, 238, 0.74)`
- `--state-hint-text: #60697E`
- `--error-hint-bg: rgba(234, 221, 225, 0.84)`
- `--error-hint-text: #7B515B`

### 5.2 Dark Mode

- `--bg-page: #171C2D`
- `--bg-page-top: #1C2437`
- `--bg-page-bottom: #14192A`
- `--nav-capsule-bg: rgba(39, 47, 72, 0.74)`
- `--nav-capsule-border: rgba(255, 255, 255, 0.08)`
- `--nav-item-active-bg: rgba(82, 92, 129, 0.42)`
- `--text-primary: #F3F6FC`
- `--text-secondary: #AAB2C8`
- `--text-muted: #8089A4`
- `--bubble-bg-primary: #2B3350`
- `--bubble-bg-secondary: #353E5D`
- `--bubble-border: rgba(255, 255, 255, 0.06)`
- `--audio-strip-bg: #2E3654`
- `--audio-strip-progress: #C3CAE0`
- `--audio-strip-time: #9FA8C2`
- `--date-chip-bg: rgba(89, 96, 126, 0.34)`
- `--date-chip-text: #BEC6DC`
- `--dock-bg: rgba(30, 36, 57, 0.80)`
- `--dock-border: rgba(255, 255, 255, 0.10)`
- `--dock-primary-text: #F5F7FF`
- `--dock-icon: #D9DEEF`
- `--dock-icon-muted: #9FA8C1`
- `--mic-ready-bg: rgba(57, 66, 95, 0.74)`
- `--mic-recording-bg: #55618C`
- `--mic-recording-icon: #F5F7FF`
- `--image-attach-active: #B6BEDB`
- `--typing-entry-icon: #A2AAC4`
- `--state-hint-bg: rgba(60, 69, 100, 0.44)`
- `--state-hint-text: #E3E8F7`
- `--error-hint-bg: rgba(97, 63, 76, 0.54)`
- `--error-hint-text: #FFD9E2`

## 6. 页面总骨架

Talk 页面固定为五层：

1. Background Layer
2. Top Navigation Area
3. Main Talk Content Area
4. Bottom Voice-First Input Dock
5. Temporary Overlay / Sheet Layer

固定规则：

- Light / Dark 下骨架完全相同
- Top nav 固定置顶
- Bottom dock 固定贴底
- Main content 独立滚动
- Overlay 独立覆盖内容区
- 不允许新增第六层常驻主骨架

### 6.1 背景层

Light：

- `linear-gradient(180deg, #EAF2FB 0%, #F3F4FA 42%, #F6F3F4 100%)`

Dark：

- `linear-gradient(180deg, #1C2437 0%, #171C2D 45%, #14192A 100%)`

固定规则：

- 不允许改成纯色背景
- 不允许使用高饱和赛博紫蓝
- 不允许使用强纹理或强噪点

## 7. 页面布局数值

- 页面左右内边距 `16px`
- 顶部安全区后额外留白 `8px`
- Dock 与底边距离 `12px + safe area`

顶部导航区：

- capsule 高度 `40px`
- 最大宽度 `344px`
- 左右内边距 `4px`
- nav 与安全区间距 `8px`
- nav item 高度 `32px`
- nav item 左右内边距 `10px`
- item 间距 `4px`

主内容区：

- 距 nav 底部 `16px`
- 左右内容边距 `16px`
- 距 dock 顶部 `20px`
- 消息组间距 `12px`
- 日期 chip 上下留白 `12px`

Bottom Dock：

- 宽度 `calc(100vw - 32px)`
- 高度 `56px`
- 左右内边距 `10px`
- 内部 gap `6px`
- border `1px`
- blur `20-22px`

Dock 内部尺寸：

- Typing / Image attach / Mic 点击区均为 `44 x 44`
- Mic 视觉直径 `34px`
- Mic icon `20px`
- Primary zone 高度 `40px`
- 最小宽度 `140px`

## 8. Top Navigation Area Spec

顶部导航为单条紧凑胶囊容器，水平居中，固定置顶。

固定规则：

- 不得拆分为多个片段
- 不得改成系统标题栏
- 不得改成底部 tab
- 不增加副标题
- 不出现第二行文字

顶部固定 4 个入口，顺序固定为：

- `Talk`
- `Memory`
- `Sleep`
- `Room`

Capsule 容器：

- 高度 `40px`
- 圆角 `radius-pill`
- 背景毛玻璃半透明
- 边界弱描边
- 阴影极弱

Item：

- 高度 `32px`
- 圆角 `radius-pill`
- 内边距 `10px`
- icon 与文字间距 `6px`
- label 不换行

当前页为 Talk：

- 使用内层高亮胶囊
- label 权重略高
- icon 与文字同时高亮
- 不允许使用高饱和色块
- 不允许使用下划线 tab 形式

## 9. Main Talk Content Area Spec

该区域承载：

- 最近消息内容
- 图片消息
- 音频消息
- 日期 chip
- 轻状态提示
- room 氛围背景上的内容层

规则：

- 默认展示最近内容，不展示长历史首页
- 首屏留白必须充足
- 不做普通 IM 满屏消息流
- 不引入 Replika 原图里的 full-body 角色舞台
- 当前 Talk 内容区以 room 氛围 + 最近内容 + 状态反馈为主

滚动规则：

- 仅 Main Talk Content Area 可滚动
- Top nav 固定
- Bottom dock 固定
- Overlay 独立
- 返回 Talk 时恢复上次滚动位置

首屏可见内容控制：

- 1 个日期 chip
- 2-4 组最近消息
- 最多 1 个图片卡片
- 最多 1 个音频条
- 不允许首屏出现超过 6 组消息

## 10. 日期 Chip Spec

- 高度 `22px`
- 水平内边距 `10px`
- 圆角 `radius-pill`
- 字体 `11px / medium`
- 背景为低对比半透明
- 位置居中
- 与上下消息间距 `12px`

禁止：

- 不允许整条分割线式日期
- 不允许高饱和强调

## 11. Text Bubble Spec

- 最大宽度为主内容区宽度的 `72%`
- 最小高度 `38px`
- 内边距 `12px 14px`
- 圆角 `24px`

排版：

- 文本左对齐
- 字号 `15px`
- 行高 `21px`

样式：

- 无尖角尾巴
- 无强描边
- 无强对比阴影
- Light / Dark 仅换颜色，不换形态

## 12. Image Card Spec

- 推荐宽度为主内容区宽度的 `56%`
- 高宽比为 `4:5` 或 `1:1`
- 圆角 `24px`

规则：

- 统一裁切
- 卡片式显示
- 不展示浏览器原生附件块
- 不使用方角缩略图

交互：

- 点击进入预览层
- 预览层覆盖内容区
- 返回后恢复原滚动位置

## 13. Audio Strip Spec

- 高度 `44px`
- 最大宽度为主内容区宽度的 `76%`
- 圆角 `radius-pill`
- 内边距 `10px 12px`

结构从左到右固定为：

- 播放按钮
- 进度区
- 时长

样式：

- 使用 Replika 式轻胶囊容器
- 不使用原生 audio 样式
- 进度线为简洁细线或点状波形
- 时长字体弱于正文

## 14. Bottom Voice-First Input Dock Spec

Bottom dock 不是普通输入框，而是语音优先的陪伴会话入口。

固定优先级：

1. `Tap to speak`
2. `Mic`
3. `Image attach`
4. `Typing entry`

总体形态：

- 单条大胶囊 dock
- 高度 `56px`
- 圆角 `radius-pill`
- 半透明毛玻璃
- 禁止拆成多个悬浮块

内部布局从左到右固定为：

1. Typing entry icon（弱）
2. Tap to speak primary zone（主）
3. Image attach icon（次级）
4. Mic button（强）

Primary zone 规则：

- 固定文案为 `Tap to speak`
- 字号 `16px / medium`
- 文案颜色 `--dock-primary-text`
- 位于底部视觉中心
- 不得表现为标准文本框
- 默认态不得出现 caret
- 点击 primary zone 与点击 mic 均进入同一语音主流程

Mic 规则：

- 点击区 `44 x 44`
- 视觉直径 `34px`
- icon `20px`
- 默认态为普通
- ready 态轻高亮
- recording 态 pulse + 强调
- unavailable 态灰化 + inline 解释

Image attach 规则：

- icon `20px`
- 点击区 `44 x 44`
- 权重低于 mic
- attached 态允许小角标或缩略提示
- 不得抢 primary zone

Typing entry 规则：

- 默认显示为弱 icon
- 不显示大文本框
- 点击后进入 typing 状态
- keyboard 收起后恢复 voice-first 主态

禁止项：

- 不得把 bottom dock 变成微信式多功能输入条
- 不得让 typing 成为默认主态
- 不得让 image attach 与 mic 同级抢中心
- 不得让 `Tap to speak` 变成灰弱 placeholder
- 不得加入表情、GIF、加号菜单等多余控件

## 15. 双模式规范

Light / Dark 必须满足：

- 同骨架
- 同控件位置
- 同交互
- 同状态流转

Light：

- 背景整体偏亮紫灰
- nav capsule 为浅灰蓝半透明
- active item 更亮
- bubble 为浅底深字
- dock 为浅灰紫半透明

Dark：

- 背景整体偏蓝紫深色
- nav capsule 更深
- active item 保持克制
- bubble 为深底浅字
- dock 为深色半透明

不变项：

- 顶部 4 个入口顺序
- dock 内部功能顺序
- 主内容区骨架
- `Tap to speak` 主导地位
- image attach 辅助地位

## 16. 状态可见性矩阵

UI 可见性状态包括：

- `page_loaded`
- `idle`
- `standby_for_voice`
- `voice_recording`
- `processing`
- `ai_speaking`
- `typing_focused`
- `keyboard_open`
- `image_attached`
- `error_permission`
- `error_network`
- `quiet_mode`

核心规则：

- `page_loaded`：默认不开麦；无大进场动画；页面稳定落位
- `idle`：`Tap to speak` 最突出；Mic 正常；Typing 与 Image 弱可见
- `standby_for_voice`：Primary zone 轻高亮；Mic ready
- `voice_recording`：Mic pulse；Primary zone active；Typing 与 Image 弱化；不做夸张全宽波形
- `processing`：Dock 进入等待态；不允许大 loading spinner 主导页面
- `ai_speaking`：内容区出现 AI 音频条/内容；Dock 仍保留下一轮说话入口
- `typing_focused` / `keyboard_open`：内容区上移；Top nav 不动；Dock morph 为 typing 态
- `image_attached`：可显示轻缩略或角标；不吞掉语音主路径
- `error_permission`：Mic unavailable；Typing 仍可用；页面不强退
- `error_network`：允许重试；页面骨架不变
- `quiet_mode`：状态提示弱化；Dock 仍可用；不让用户误以为失联

## 17. 交互流转 Spec

- 首次进入 Talk：页面加载完成；Top nav 固定；内容区定位到最近内容；Bottom dock 默认 voice-first。
- 点击 `Tap to speak`：Primary zone 激活；Mic 进入 listening / recording 表现；Inline state hint 出现；页面结构不变化。
- 点击 `Mic`：与 `Tap to speak` 进入同一主流程；recording 中再次点击可结束本轮输入；unavailable 时给出权限引导或 inline 解释。
- 录音中：反馈集中在 dock；不做夸张全宽波形；内容区保持稳定；一轮结束后进入 `processing`。
- `processing -> ai_speaking`：Dock 从录音态过渡到等待态；内容区显示 AI 对应音频条/内容；页面不重排。
- 点击 Typing Entry：Dock 进入 typing 态；keyboard 弹起；内容区上移；Top nav 保持不动；keyboard 收起后恢复默认 voice-first 态。
- 点击 Image Attach：打开系统选图；选图后回到 Talk；icon 进入 attached 态；发送完成后恢复默认态；语音主路径仍保留。
- 点击 Audio Strip：开始播放；进度前进；播放时可滚动内容区；不影响 nav 与 dock 骨架。
- 点击 Image Card：进入全屏预览层；关闭后恢复原位置；底层内容不重排。
- 切换 Theme：Light / Dark 使用 `280ms` 淡切换；不改变结构；不重新挂载整页。

## 18. Inline State / Error 文案挂载点

状态提示固定挂载在：

- Main content 区底部上缘
- dock 上方

不得挂到：

- nav 内
- primary zone 内部

样式：

- 高度 `24-28px`
- 圆角 `radius-pill`
- 背景极弱半透明
- 文本 `12px`

正常状态示例：

- 我在听
- 我在回应你
- 现在先安静陪你

异常状态示例：

- 麦克风还没有打开
- 刚刚网络有点不稳定
- 这次没有顺利说出来

## 19. PRD -> UI 补充映射

- “语音优先，文字兜底” -> `Tap to speak` + `Mic` 必须压过 typing；默认态不出现大文本框。
- “图片发送是辅助” -> image attach 仅为 secondary icon；attached 态不吞掉语音主路径。
- “顶部只有四个入口” -> nav 固定 4 项；不允许照搬 Replika 6 项。
- “Talk 不是传统 IM” -> 首屏不堆长消息；不以 typing 为重心；氛围与语音主操作高于工具感。
- “双模式同骨架” -> Light / Dark 不能换布局；只能换颜色、透明度、阴影与氛围层。

## 20. Strict Prohibitions

以下全部为硬禁令：

- 不允许照抄 Replika 的功能集合
- 不允许 nav 从 4 项变成 5 项或 6 项
- 不允许 bottom dock 改成普通聊天输入栏
- 不允许 typing 设为默认主态
- 不允许 image attach 与 mic 同级抢主视觉
- 不允许使用浏览器原生 `audio / file / input` 样式直接上线
- 不允许 `filled / outline` icon 混用
- 不允许不同组件各自定义不同圆角体系
- 不允许不同组件各自定义不同 blur / shadow / border 逻辑
- 不允许 Light / Dark 采用不同页面骨架
- 不允许状态切换引发大幅布局漂移
- 不允许把页面实现成微信 / Telegram 式 IM
- 不允许因为更像 Replika 而加入 PRD 没定义的模块
- 不允许使用强描边卡片
- 不允许使用高饱和 active 色块
- 不允许底部 dock 做厚、做重、做成工具条感
- 不允许顶部导航做成强 tab bar 感

## 21. 开发对齐清单

实现前必须确认：

- 已读取 Talk PRD 的模块边界
- 已确认顶部固定 4 项
- 已确认底部为 voice-first dock
- 已确认 `Tap to speak` 为第一主操作
- 已确认 Mic 为第二强操作
- 已确认 Image attach 为辅助
- 已确认 Typing 为兜底次级入口
- 已确认 Light / Dark 同骨架
- 已确认不做普通 IM
- 已确认音频条、图片卡片、气泡使用统一 Replika 风格体系
- 已确认状态提示挂载点
- 已确认不使用系统原生控件直接交付

## 22. 验收标准

以下全部满足，才算 Talk UI / 交互实现合格：

- 页面整体气质明显接近参考的 Replika Light / Dark 方向
- 页面功能内容严格服从 PRD，没有被参考图带偏
- 顶部导航为 4 项胶囊结构：`Talk / Memory / Sleep / Room`
- Bottom dock 为单条大胶囊 voice-first 结构
- `Tap to speak` 明显是最强主操作
- Mic 明显强于 image attach 与 typing
- Typing 存在但不抢主视觉
- Light / Dark 只换皮，不换骨架
- 页面首屏不呈现普通 IM 满屏聊天感
- `recording / processing / ai_speaking / typing / image_attached / error` 状态均有明确 UI 响应
- 所有组件圆角、间距、icon、blur、shadow、border 使用统一 tokens
