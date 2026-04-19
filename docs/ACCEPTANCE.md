# ACCEPTANCE

## Product Source

当前 `/talk` 的产品与 UI 真源固定为：

1. [docs/SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/SPEC.md)
2. [docs/TALK_UI_SPEC.md](/Users/zhongyuanli/Documents/Playground/ai-companion-web/docs/TALK_UI_SPEC.md)

旧版 Talk 文档、历史占位说明或过期视觉决策，均不得再作为实现依据。

## Current Phase

当前优先事项是 `/talk` 的 `ui-only` 重写与对齐：

- 不扩新路由
- 不改后端契约
- 不把 Talk 做成普通聊天流
- 不让 typing 成为默认主态

## Framework Baseline

实现完成后应满足：

1. `npm run build` 通过
2. `npm run lint` 通过
3. `npm run type-check` 通过
4. `/`, `/talk`, `/room`, `/memory`, `/sleep-monitoring` 路由仍存在

## UI Baseline

Talk UI 合格至少满足：

1. 顶部导航固定为 `Talk / Memory / Sleep / Room`
2. Bottom dock 为 voice-first 单胶囊结构
3. `Tap to speak` 是最强主操作
4. Light / Dark 同骨架
5. 首屏不是高密度 IM
6. 主要状态有明确 UI 响应
