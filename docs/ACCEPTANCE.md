# ACCEPTANCE

## Product Source

当前 `/talk` 的产品真源固定为：

1. [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
2. [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

工程纠偏说明来自：

3. 本次同步后的 [docs/TRACKING.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TRACKING.md)
4. 本次同步后的 [docs/HANDOFF.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/HANDOFF.md)

旧版 Talk 文档、历史临时实现、已过期的聊天式布局判断，不得再作为实现依据。

## Current Task Class

当前待执行的是 `/talk` 的 `api-contract + ui-only` 重构：

- 不扩新路由
- 不改后端服务端
- 删除旧的双模式前端消费字段
- 把 Talk 收口到单模式、icon-only nav、dock-contained feedback

## Documentation Acceptance

仓库内文档同步完成后，至少需要满足：

1. `docs/SPEC.md` 明确 Talk 是 `voice-presence page`
2. `docs/SPEC.md` 明确已删除 `overlay_mode / shell_text_profile / feedback_contrast_profile`
3. `docs/TALK_UI_SPEC.md` 明确顶部结构为 `settings button + 4-item icon-only nav capsule`
4. `docs/TALK_UI_SPEC.md` 明确默认 dock 为 `weak image attach + integrated mic + Tap to speak`
5. `docs/TALK_UI_SPEC.md` 明确所有 speaking feedback 只能出现在 dock 内
6. `docs/TALK_UI_SPEC.md` 明确不使用 3D icon，改为单色线性 icon
7. `docs/ACCEPTANCE.md`、`docs/TRACKING.md`、`docs/HANDOFF.md` 明确本轮是单模式 Talk 重构

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
