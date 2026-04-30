# ACCEPTANCE

## Product Source

当前页面级产品真源固定为：

### `/talk`

1. [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
2. [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

### `/room`

1. [docs/ROOM_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/ROOM_SPEC.md)
2. [docs/ROOM_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/ROOM_UI_SPEC.md)

### `/memory`

1. [docs/MEMORY_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/MEMORY_SPEC.md)
2. [docs/MEMORY_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/MEMORY_UI_SPEC.md)

工程纠偏说明来自：

3. 本次同步后的 [docs/TRACKING.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TRACKING.md)
4. 本次同步后的 [docs/HANDOFF.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/HANDOFF.md)

旧版 Talk / Room / Memory 文档、历史临时实现、已过期布局判断，不得再作为实现依据。

## Current Task Class

当前文档层最新同步任务是 `/memory` 的 `content-only` 真源建立：

- 将 Memory PRD 和 UI 文档转为仓库内 `docs/*.md` 真源
- 明确 `/memory` 的页面级 contract、骨架和 UI 规则
- 同步当前 `/memory` 页面已存在的 reveal-more、inline expand 和本地 mock action 行为
- 明确 Talk / Room / Memory 的页面级文档优先级
- 不在这一步修改后端服务端或页面运行时代码

## Documentation Acceptance

仓库内文档同步完成后，至少需要满足：

1. `docs/SPEC.md` 明确 Talk 是 `voice-presence page`
2. `docs/SPEC.md` 明确已删除 `overlay_mode / shell_text_profile / feedback_contrast_profile`
3. `docs/TALK_UI_SPEC.md` 明确顶部结构为 `settings button + 4-item icon-only nav capsule`
4. `docs/TALK_UI_SPEC.md` 明确默认 dock 为 `weak image attach + integrated mic + Tap to speak`
5. `docs/TALK_UI_SPEC.md` 明确所有 speaking feedback 只能出现在 dock 内
6. `docs/TALK_UI_SPEC.md` 明确不使用 3D icon，改为单色线性 icon
7. `docs/MEMORY_SPEC.md` 和 `docs/MEMORY_UI_SPEC.md` 明确 Memory 的默认骨架、contract 和继续回到 Talk 的闭环
8. `docs/ACCEPTANCE.md`、`docs/TRACKING.md`、`docs/HANDOFF.md` 明确页面级 source-of-truth 已按 Talk / Room / Memory 区分

## Future UI Acceptance

后续 `/talk` UI 真正对齐完成后，至少需要满足：

1. 顶部导航固定为 `Talk / Room / Memory / Sleep`，且为 `icon-only`
2. 左侧存在独立 settings button，且不并入 nav capsule
3. top nav、settings button、bottom dock 为同一 shell family
4. Bottom dock 为 voice-first 单胶囊结构
5. 默认主 CTA 为 integrated `[mic icon + label + subtle waveform]`
6. room name 位于底部左侧且为单行低位标签
7. 默认主页面没有 visible user transcript
8. 所有 animated voice feedback 只出现在 dock 内
9. 页面为单模式固定视觉，不做 runtime theme switching

## Verification Baseline

每次实现型任务完成后应满足：

1. `npm run build` 通过
2. `npm run lint` 通过
3. `npm run type-check` 通过
4. `/`, `/talk`, `/room`, `/memory`, `/sleep-monitoring` 路由仍存在
