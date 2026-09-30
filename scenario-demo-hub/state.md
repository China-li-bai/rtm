# state · scenario-demo-hub

> 快照时间：2026-09-30 10:45 CST ｜ 阶段：V1.0 + 全景泳道图 + 需求追溯矩阵已交付

## 当前状态
- 构建：`npm run build` → dist/index.html 单文件 380KB（gzip 118KB），file:// 双击即开
- 校验：`npm run validate` ✓ ｜ `npx tsc --noEmit` ✓ ｜ `npx tsx scripts/rules.test.ts` 10/10 ✓
- 浏览器实测：首页/场景页/弹窗/Esc/scale + overall-flow 全景泳道图渲染全部通过
- 场景配置：scenarios/attr-extraction.json（3 场景 + 2 约束 + 9 环节）+ scenarios/overall-flow.json（3 场景 + 3 约束 + 11 环节 + 12 边）
- platform 枚举：全景 / 商品 / 搜索 / 客服（V1.0 为三值，V1.1 扩展第四值「全景」）

## 架构速览
```
scenarios/*.json ──import.meta.glob──> lib/scenarios.ts ──getScenario──> App(hash 路由 #/s/<id>)
                                            │ 运行时 zod parse 兜底
scripts/validate.ts（构建前置 fail-loud）= zod 结构校验 + schema/rules.ts 业务规则
ScenarioPage = whycards（场景/约束卡）+ FlowCanvas（泳道+节点+箭头）+ DetailPanel + RefModal + CompareSection
lib/refs.ts = 三级文案模型唯一生成处（chip/badge/full）
```

## 关键约定（改动前必读）
1. **三级文案模型**：chip 序号称谓（场景一）→ badge 徽标短名（scenario.tag ?? name；constraint 固定 kw）→ full 弹窗全称（name【kw】；constraint.fullTitle 可覆盖）
2. **画布/面板文案分离**：盒内 title/sub/aip 宜短（aip 短码如 AIP-012）；面板全称走 panelTitle/panelAip
3. **受限富文本**：配置文案仅允许 `<b>` 与 `<br>`（lib/rich.tsx 转义其余）——禁加标签前先想 XSS
4. **口径红线**：数字+量词才算指标（DN65 规格不算）；有数字必须口径词/approx/metricNote
5. **零安装红线**：禁引入运行时请求；路由必须 hash；新增依赖先看单文件构建体积
6. node.kind 六态：normal/highlight/dashed/diamond/bar/loopchip；边用声明式 edges，渲染器推锚点

## 下一步候选（V1.1）
- analytics.endpoint 埋点实现（Schema 已留口）
- AIP registry.json 枚举校验（矩阵机读版）
- 搜索中台/客服中台首批场景配置（放 scenarios/ 即上线）
- 场景页导出图片/PDF（评审材料）

## 活跃文件
- src/schema/scenario.ts（领域模型唯一事实源）、src/schema/rules.ts（业务规则）
- src/lib/refs.ts（三级文案）、src/lib/rich.tsx（受限富文本）、src/lib/scenarios.ts（配置加载）
- src/pages/{HubHome,ScenarioPage}.tsx、src/components/{FlowCanvas,DetailPanel,RefModal,CompareSection}.tsx
- scripts/{validate.ts,rules.test.ts}、scenarios/attr-extraction.json
