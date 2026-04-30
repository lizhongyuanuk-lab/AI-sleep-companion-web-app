# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Latest Talk PRD + non-UI spec vendored into `docs/SPEC.md`: yes
- Latest Talk UI spec vendored into `docs/TALK_UI_SPEC.md`: yes
- Latest Room PRD + UI specs vendored into `docs/ROOM_SPEC.md` and `docs/ROOM_UI_SPEC.md`: yes
- Latest Memory PRD + UI specs vendored into `docs/MEMORY_SPEC.md` and `docs/MEMORY_UI_SPEC.md`: yes
- Current `/talk` implementation aligned to the latest single-mode direction: yes

## Page Source Mapping

1. `/talk` -> `docs/SPEC.md` + `docs/TALK_UI_SPEC.md`
2. `/room` -> `docs/ROOM_SPEC.md` + `docs/ROOM_UI_SPEC.md`
3. `/memory` -> `docs/MEMORY_SPEC.md` + `docs/MEMORY_UI_SPEC.md`

## Current Task Classification

本轮文档任务：`content-only`

解释：

- `/memory` 的 PRD 和 UI 文档已从外部原件转入仓库内真源
- 当前工作聚焦于把 Memory 文档真源同步到当前页面实现
- `/memory` 已经有真实的前端页面实现，不再是 placeholder
- 当前 `/memory` 仍以 mock 数据和本地 UI demo 行为驱动

## Confirmed Alignment Baseline

当前仓库内已经确认的 Talk 基线如下：

1. 顶部导航固定为 `Talk / Room / Memory / Sleep`
2. 顶部导航为 `icon-only`
3. 左上保留独立 settings button
4. room name 下沉到底部左侧单行标签
5. bottom dock 为 voice-first 单胶囊结构
6. 默认主 CTA 为一体化 `[mic + Tap to speak]`
7. image action 位于 dock 右侧
8. 所有 speaking-related 动效与反馈只允许发生在 dock 内
9. Snow Mountain Day 使用已 vendored 的暖白房间背景资产
10. 顶部导航使用已 vendored 的最终 PNG icon 资产

## Active File Scope

当前 Talk 最终稿主要依赖以下文件：

1. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx)
2. [app/talk/talk-page.module.css](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-page.module.css)
3. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts)
4. [app/talk/talk-icons.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-icons.tsx)
5. [public/nav-icons/talk-shell.png](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/nav-icons/talk-shell.png)
6. [public/nav-icons/room-shell.png](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/nav-icons/room-shell.png)
7. [public/nav-icons/memory-shell.png](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/nav-icons/memory-shell.png)
8. [public/nav-icons/sleep-shell.png](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/nav-icons/sleep-shell.png)
9. [public/scenes/snow-mountain-day-room.png](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/scenes/snow-mountain-day-room.png)

默认不应修改：

- `/memory`
- `/sleep-monitoring`
- `/room`
- 全局路由结构
- 无关共享组件

## Current Memory Implementation Snapshot

当前 `/memory` 页面实现已经具备：

1. center-aligned 的 reading-first hero
2. dark atmospheric 背景与共享 top nav
3. recurring insights 默认显示 3 条
4. `View all memories` / `Show less` 的同页 reveal
5. 单项 inline expand 的 subtle shell
6. expanded recurring item 内的本地 mock `Agree` / `Delete`

当前仍属 mock / demo 的部分：

1. recurring expanded details 是本地 view-model 数据
2. `Agree` / `Delete` 是前端本地行为
3. `View all memories` 是前端同页 reveal，不代表真实分页或历史接口

## Remaining Review Focus

后续如果继续做 Talk fidelity pass，优先只看这几类问题：

1. nav / settings / dock 的玻璃材质是否仍然过重
2. idle waveform 是否过于可见
3. room name 的低位标签是否过深或过大
4. 首屏 hydration 是否保持稳定
5. Figma 回填后是否需要再做一次 1:1 spacing pass

## Verification Rule

任何继续修改 `/talk` 的任务结束后，都必须运行：

1. `npm run build`
2. `npm run lint`
3. `npm run type-check`
