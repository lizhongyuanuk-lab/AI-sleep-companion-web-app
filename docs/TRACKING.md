# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Latest Talk PRD + non-UI spec vendored into `docs/SPEC.md`: yes
- Latest Talk UI spec vendored into `docs/TALK_UI_SPEC.md`: yes
- Current `/talk` implementation aligned to the latest single-mode direction: yes

## Current Task Classification

本轮主任务：`ui-only + bugfix`

解释：

- Talk 的产品和视觉方向已经固定为最终的暖白玻璃单模式
- 当前收尾工作聚焦于最终稿视觉对齐、首屏稳定性和过程文档去旧

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
