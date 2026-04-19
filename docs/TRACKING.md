# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Latest Talk PRD + non-UI spec vendored into `docs/SPEC.md`: yes
- Latest Talk UI spec vendored into `docs/TALK_UI_SPEC.md`: yes
- Revision prompt engineering deltas distilled into repo support docs: yes
- Current `/talk` implementation fully aligned to latest docs: not yet

## Current Task Classification

本轮已完成：`content-only`

下一轮主任务：`ui-only`

解释：

- 当前仓库内文档真源已经切换到最新 voice-presence 版本
- 代码实现仍停留在旧的 transcript-like Talk 结构，需要单独做 UI 纠偏

## Confirmed Implementation Gaps

基于当前代码与新版规范的对照，已确认以下差距：

1. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx) 仍渲染 assistant / user bubble
2. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx) 仍包含显式 typing 入口与 input
3. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx) 尚无独立 settings button 与 floating sound panel
4. [app/talk/talk-page.module.css](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-page.module.css) 仍以 bubble / transcript / chat-toolbar 为中心
5. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts) 仍缺少 `shell_text_profile`、`feedback_contrast_profile`、`voice_profile_id`、`sound_defaults`
6. shell family 目前没有被强约束到 top nav、settings button、bottom dock 三者一致

## Expected File Scope For UI Work

后续 `/talk` UI-only 实现预计会改这些文件：

1. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx)
2. [app/talk/talk-page.module.css](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-page.module.css)
3. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts)
4. [app/talk/talk-icons.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-icons.tsx)
5. [app/talk/page.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/page.tsx)，仅在 route-level 参数或入口消费需要调整时触达

默认不应修改：

- `/memory`
- `/sleep-monitoring`
- `/room`
- 全局路由结构
- 无关共享组件

## Next Recommended Steps

1. 把 Talk 主内容从 transcript-like 结构改为 atmosphere + room header + transient AI feedback + bottom dock
2. 去掉默认可见 user bubble、message stack、typing input
3. 引入独立 settings button 与 compact floating sound-control panel
4. 把 dock 状态机明确为 `idle_default / standby_for_voice / voice_recording / processing / ai_speaking / image_attached / error_permission / error_network / quiet_mode`
5. 给 scene mock 补上最新元数据合同字段
6. 完成后运行 `build / lint / type-check`
