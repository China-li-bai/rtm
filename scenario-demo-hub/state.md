# state · scenario-demo-hub

> 快照时间：2026-11-18 12:45 CST｜ **任务AL：打成可双击阅读的单页**

## 当前状态
- 可直接阅读的网页已生成：`scenario-demo-hub/dist/index.html`（762KB，单文件，无外部资源）。
- `pnpm run build` 通过：15 份场景 0 错误，36 条既有几何警告。预览首页与 capability-map 下钻已核对。
- 开发服务 `pnpm dev` 仍在 localhost:5173。临时预览 4173 已停。

## 下一步
- Top2 术语净化：全字段过 scripts/ux-jargon.json（std_title/Milvus/ES/AIP-* 徽标），拆 data-governance 346 字口径长段。
- Top3 窄视口兜底：useScale 设缩放下限、工具栏脱离整页缩放；顺手修 ai-recommend 渲染期 setState 报错。
- 待确认：ai-data-platform 追溯链 chips 里 PIM_AUTOMATED_PRODUCTION.md 的受众与处置。

## 活跃文件
- dist/index.html（构建产物，勿手改）
