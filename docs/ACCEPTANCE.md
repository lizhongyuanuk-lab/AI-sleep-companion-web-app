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

当前已完成的是 `content-only` 文档同步。

下一阶段待执行的是 `/talk` 的 `ui-only` 结构纠偏：

- 不扩新路由
- 不改后端 API shape
- 不把 Talk 做成 transcript-first 页面
- 不让 typing 成为默认可见主态

## Documentation Acceptance

仓库内文档同步完成后，至少需要满足：

1. `docs/SPEC.md` 明确 Talk 是 `voice-presence page`
2. `docs/SPEC.md` 明确 `overlay_mode / shell_text_profile / feedback_contrast_profile` 来自素材元数据
3. `docs/TALK_UI_SPEC.md` 明确顶部结构为 `settings button + 4-item nav capsule`
4. `docs/TALK_UI_SPEC.md` 明确默认 dock 为 `weak image attach + Tap to speak + strong mic`
5. `docs/TALK_UI_SPEC.md` 明确默认 Talk 主页面不得显示 transcript / user bubble
6. `docs/ACCEPTANCE.md`、`docs/TRACKING.md`、`docs/HANDOFF.md` 明确本轮是 Talk 结构纠偏，而不是泛化 UI polish

## Future UI Acceptance

后续 `/talk` UI 真正对齐完成后，至少需要满足：

1. 顶部导航固定为 `Talk / Memory / Sleep / Room`
2. 左侧存在独立 settings button，且不并入 nav capsule
3. top nav、settings button、bottom dock 为同一 shell family
4. Bottom dock 为 voice-first 单胶囊结构
5. `Tap to speak` 是默认主操作
6. 默认主页面没有 visible user transcript
7. transient AI voice feedback 不累计成历史
8. Light / Dark 同骨架，仅换皮肤

## Verification Baseline

每次实现型任务完成后应满足：

1. `npm run build` 通过
2. `npm run lint` 通过
3. `npm run type-check` 通过
4. `/`, `/talk`, `/room`, `/memory`, `/sleep-monitoring` 路由仍存在
