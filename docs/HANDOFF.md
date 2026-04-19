# HANDOFF

## Current Source Of Truth

当前 Talk 页面文档真源固定为：

- [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
- [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

支持性过程文档为：

- [docs/ACCEPTANCE.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/ACCEPTANCE.md)
- [docs/TRACKING.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TRACKING.md)
- 本文件

不要再把旧版 Talk 文档、旧截图、旧聊天式实现当作真源。

## Current Repo Mapping

仓库里与 Talk 最直接相关的实现文件如下：

1. [app/talk/page.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/page.tsx)
   当前职责：Talk route 入口
2. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx)
   当前职责：主要状态、结构布局、dock 行为、preview overlay
3. [app/talk/talk-page.module.css](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-page.module.css)
   当前职责：Talk shell token、布局、动画与状态样式
4. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts)
   当前职责：scene mock 数据与 overlay mode
5. [app/talk/talk-icons.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-icons.tsx)
   当前职责：Talk 局部 icon 集

## What Future Contributors Must Preserve

1. Talk 是 `voice-presence page`，不是 `transcript-first page`
2. 默认主页面不显示 visible user text
3. 默认 dock 不显示 visible typing entry
4. 顶部导航固定为 `Talk / Memory / Sleep / Room`
5. settings button 必须独立于 nav capsule
6. top nav、settings button、bottom dock 必须属于同一 shell family
7. theme mode 必须消费 room / background metadata，而不是运行时猜测

## Known Mock-Only Areas

当前代码层仍有以下 mock / placeholder 风险需要明确标注：

1. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts) 仍是本地 scene mock，不是后端真实 room contract
2. 最新规范要求的 `shell_text_profile`、`feedback_contrast_profile`、`voice_profile_id`、`sound_defaults` 还未进入当前 mock shape
3. sound panel 的 instant-apply 与全局持久化规则目前仍只有文档定义，没有实现承接

## Before Coding

1. Confirm `pwd`
2. Confirm `git rev-parse --show-toplevel`
3. Read `AGENTS.md`
4. Read [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
5. Read [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)
6. Read the relevant local Next.js docs when framework behavior matters

## When Rebuilding `/talk`

优先顺序建议如下：

1. 先替换页面骨架，去掉 transcript-like layout
2. 再重写 bottom voice dock 与状态机
3. 再引入 settings button 与 floating sound panel
4. 最后补齐 scene metadata mock 与视觉 token

## After Coding

1. Run `npm run build`
2. Run `npm run lint`
3. Run `npm run type-check`
4. Report modified files, added files, deleted files, verification results, assumptions, risks, and shared-component impact
5. Explicitly call out any remaining mock-only behavior
