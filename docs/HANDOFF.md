# HANDOFF

## Current Source Of Truth

当前 Talk 页面文档真源固定为：

- [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
- [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

支持性过程文档为：

- [docs/ACCEPTANCE.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/ACCEPTANCE.md)
- [docs/TRACKING.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TRACKING.md)
- 本文件

不要再把旧版 Talk 文档、旧 transcript 聊天式布局、旧双模式壳层和旧 3D icon 方向当作真源。

## Current Repo Mapping

仓库里与 Talk 最直接相关的实现文件如下：

1. [app/talk/page.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/page.tsx)
   当前职责：Talk route 入口
2. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx)
   当前职责：页面状态机、结构布局、settings panel、bottom dock 和用户交互
3. [app/talk/talk-page.module.css](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-page.module.css)
   当前职责：单模式 shell token、布局、材质、状态样式与动效
4. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts)
   当前职责：scene mock 数据、背景资产映射和默认 sound token
5. [app/talk/talk-icons.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-icons.tsx)
   当前职责：settings / mic / image 的本地 SVG icon
6. [public/nav-icons/](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/nav-icons)
   当前职责：顶部导航的最终 PNG icon 资产
7. [public/scenes/snow-mountain-day-room.png](/Users/zhongyuanli/Documents/Playground/ai-companion-web/public/scenes/snow-mountain-day-room.png)
   当前职责：Snow Mountain Day 的最终暖白房间背景图

## What Future Contributors Must Preserve

1. Talk 是 `voice-presence page`，不是 `transcript-first page`
2. 默认主页面不显示 visible user text
3. 默认 dock 不显示 visible typing entry
4. 顶部导航固定为 `Talk / Room / Memory / Sleep`，且为 `icon-only`
5. settings button 必须独立于 nav capsule
6. top nav、settings button、bottom dock 必须属于同一 shell family
7. 页面采用 single fixed visual mode，不做 runtime theme switching
8. room identity 只保留底部左侧单行 `room name`
9. 默认主 CTA 必须是一体化 `[mic + Tap to speak]`
10. image action 固定在 dock 右侧
11. idle waveform 只允许极弱存在，不能破坏沉浸感
12. 所有 speaking-related 动效和反馈只允许出现在 bottom dock 内

## Known Mock-Only Areas

当前代码层仍有以下 mock / placeholder 风险需要明确标注：

1. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts) 仍是本地 scene mock，不是后端真实 room contract
2. `ui_shell_token_set_id` 仍是本地 token 标识，不是已对接的真实后端字段
3. 背景准入规则、顶部亮度约束、用户自定义生图筛选逻辑，目前仍停留在文档层，不在这轮 Talk UI 实现内
4. sound panel 的 instant-apply 与本地持久化已经可用，但仍属于前端本地行为，不代表后端已接入

## Before Coding

1. Confirm `pwd`
2. Confirm `git rev-parse --show-toplevel`
3. Read `AGENTS.md`
4. Read [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
5. Read [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)
6. Read the relevant local Next.js docs when framework behavior matters

## For Future Fidelity Passes

后续如果继续对齐 Figma 或截图，优先顺序建议如下：

1. 先确认 nav / settings / dock 的材质厚薄和 blur 感
2. 再确认顶部 icon、settings glyph 与 room name 的视觉权重
3. 再确认 bottom dock 的 spacing、按钮比例和 label 基线
4. 最后再做 speaking / listening 状态下的细微发光和波形调整

## After Coding

1. Run `npm run build`
2. Run `npm run lint`
3. Run `npm run type-check`
4. Report modified files, added files, verification results, assumptions, risks, and shared-component impact
5. Explicitly call out any remaining mock-only behavior
