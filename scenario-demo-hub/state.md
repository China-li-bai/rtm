# state · scenario-demo-hub

> 快照时间：2026-11-03 11:15 CST｜ **任务AK：修复审核 Top1——富文本过 rich() + 撤内部文件路径**

## 当前状态
- dataSupport（BlueprintCanvas×2 / FlowCanvas×1）与 metricNote（CompareSection）全部走 rich()，`<b>` 不再原样上屏；浏览器 DOM 复验 5/5 通过。
- capability-map 图例行「knowledge/…md（勿手改本文件）」已撤，生成器 gen_capability_map.py 同步改；5 份场景 metricNote 的「见 STATUS.md」已撤，〔实测〕/示意 标注保留。
- tsc 0 错、validate 15 份 0 错误；dev 服务 localhost:5173 仍在运行。

## 下一步
- Top2 术语净化：全字段过 scripts/ux-jargon.json（std_title/Milvus/ES/AIP-* 徽标），拆 data-governance 346 字口径长段。
- Top3 窄视口兜底：useScale 设缩放下限、工具栏脱离整页缩放；顺手修 ai-recommend 渲染期 setState 报错。
- 待确认：ai-data-platform 追溯链 chips 里 PIM_AUTOMATED_PRODUCTION.md 的受众与处置。

## 活跃文件
- src/components/{BlueprintCanvas,FlowCanvas}.tsx、src/components/CompareSection.tsx
- scripts/gen_capability_map.py、scenarios/capability-map.json 等 6 份文案
- 知识沉淀：knowledge/product/配置驱动演示页的三级文案模型.md（新增 rich() 位点规则与内部产物禁入条款）
