# TRACKING

## Current Status

- Mainline repository confirmed: `ai-companion-web`
- Latest Talk PRD + non-UI spec vendored into `docs/SPEC.md`: yes
- Latest Talk UI spec vendored into `docs/TALK_UI_SPEC.md`: yes
- Current `/talk` implementation fully aligned to latest docs: no

## Current Task Classification

本轮主任务：`api-contract + ui-only`

解释：

- 当前仓库内 Talk 真源已切换到单模式版本
- 当前 `/talk` 代码仍残留双模式字段、dock 外反馈层和旧视觉方向

## Confirmed Implementation Gaps

基于当前代码与新版规范的对照，已确认以下差距：

1. [app/talk/scene-config.ts](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/scene-config.ts) 仍保留 `overlay_mode / shell_text_profile / feedback_contrast_profile`
2. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx) 仍存在 dock 外 feedback layer 与旧状态承载方式
3. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx) 尚未完成 icon-only 顶部导航
4. [app/talk/talk-shell.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-shell.tsx) 尚未完全收口 room name 的低位单行标签形态
5. [app/talk/talk-page.module.css](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-page.module.css) 仍是旧的双模式视觉与冷色壳层体系
6. [app/talk/talk-icons.tsx](/Users/zhongyuanli/Documents/Playground/ai-companion-web/app/talk/talk-icons.tsx) 与顶部导航仍未彻底切换到非 3D 单色线性 icon 方案

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

1. 删除旧双模式字段与相关消费逻辑
2. 把顶部导航收口成 icon-only 4-item capsule
3. 把所有 speaking-related 反馈压回 dock 内
4. 用单模式暖白玻璃视觉重写 nav / settings / dock / room name
5. 把 Talk 局部 icon 统一成单色线性 icon
6. 完成后运行 `build / lint / type-check`
