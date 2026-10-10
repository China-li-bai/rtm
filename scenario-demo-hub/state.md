# state · scenario-demo-hub

> 快照时间：2026-10-10 13:00 CST（任务AC 实施完成）｜ **任务AC：流程布局布线治理——阶段0/1/2/4 交付，阶段3 POC 未启动** ｜ 任务AB：真菱形 ｜ 任务AA：AI 对话导购 ｜ ADR-014：纯云端 LiteLLM + 脱敏网关

## 当前状态
- **任务AC 实施全绿（未提交，用户定入库）**：g5→u3 越界根治（1370→1248）、越界 2→0、危险带 8→4、路径 -1143；layout 幂等✓、validate 14 份 0 error/22 warn✓、tsc✓、build✓ 794.20KB（gzip 257.33KB）、rules 12/12 + geometry 14/14、DOM+视觉抽查✓
- **两项裁定已定（用户委托）**：①bar1=能力横条，落地 per-node `routingObstacle:false`（其他场景 bar 多为真流程枢纽故不按类型一刀切，仅 ai-chat-guide bar1 摘障碍）；②标签/交叉门槛按基线数据定级——出画布/压非关联节点=error（基线 0），端点标签/互压/压线/交叉=聚合 warn
- **两项实测否决记录**：画布边界墙（挤死 ai-recommend/attr-extraction 的 bar 右缘 2px 贴边走廊）；crossing 惩罚全局开（off=1s vs low(50) 在 contract-blueprint >14min CPU 卡死）——默认锁 off，`LAYOUT_CROSSING` 开关留档
- ⚠️ `src/lib/scenarios.ts` 用户加的过滤 `id !== "contract-blueprint"`（含 console.log）仍在，待确认处置

## 布局布线新契约（任务AC 立，改场景 JSON 前必读）
- **edge `id` 必填全文件唯一**（`e-${from}-${to}`）；`routeRole` 默认 primary（primary/branch/feedback/support，与 style 正交，禁从 style 推导；现仅 ai-chat-guide 21 条显式标注）
- **`routingObstacle`**：缺省全部节点（含 bar）是障碍；纯装饰横条显式 false（挂接走 ConnEnd.fromPoint 贴边：横条感知、面向对端、落点对端中心正下方）
- **几何硬门禁**（src/flow/geometry-rules.ts，validate/测试/metrics 三方共用）：error=越界/重复点/非正交/端点脱离/穿障碍节点/标签出界/标签压非关联节点；warn=端点标签/互压/压线/交叉（主链×主链单独计数，ai-chat-guide 已 0）
- 测试入口：`npx tsx scripts/geometry.test.ts`（含 g5→u3 fixture）；指标：`npx tsx scripts/flow-metrics.ts`；基线/整改后报告在 review/flow-metrics-*.json

## 弹窗/抽屉体系（任务V 定稿）
- `ScenarioPage.openRef(refId, contextNode)` 唯一入口；RefModal onClose 双清；`.m-sec.context` 蓝色系；DetailPanel 口径勿改回；场景定义唯一性红线（story/solution 一份，差异走 solves[].how）；Esc 单层关闭

## 泳道渲染 + 链式布局（任务U/AA 定稿）
- 链式列规则：换泳道继承列、同泳道+1、折返显式 col 覆盖；bar 挂 chain 独占行；usable=1218px、列距≥30 红线；tokens.ts GRID_GAP=30，x/y/h/route/labelAt 全是构建期产物勿手写

## 关键约定（改动前必读）
1. 编号：业务页 01~N，diamond 不占编号；CAP-* 严禁占 AIP/AICS 位
2. 口径：数字+量词必须口径词或 approx；非 AI 环节禁 beforeAfter；强承诺词只护栏否定式
3. 术语纪律（任务Z 14 禁词 + B2C 痕迹词）；召回/排序/去重/画像/属性/理由码保留
4. 零安装红线：构建期工具走 devDependency；hash 路由；单文件体积盯紧
5. 自动化坑：缩放画布文本点击→evaluate 内 dispatchEvent；eval 与断言间 sleep(≈450)；hash 切页不吃新 bundle
6. 视觉验证双链路：DOM 实测为主；截图 → analyze_image 判读（注意区分滚动伪影与真实越界）

## 下一步候选
- **任务AC 未竟项**：拆分两批提交（schema/算法/校验 vs 14 份几何产物，§9 回滚策略）；其余 13 份 routeRole 人工标注；contract-blueprint 63 对交叉 + 标签互压存量治理；primary-primary error 升级评估；阶段3 ELK 拓扑 POC
- 全部改动入库时机（任务 AA/AC 增量 + review/ 文档，用户定）
- 去黑话推广 overall-flow/ai-service/service-faq；ai-recommend review 未选项；contract-blueprint 过滤行处置

## 活跃文件
- scripts/auto-layout.ts（id 键/phantom 贴边/crossing seam）、scripts/{validate.ts,rules.test.ts,geometry.test.ts,flow-metrics.ts}、src/flow/{tokens.ts,geometry-rules.ts}、src/schema/{scenario.ts,rules.ts}
- src/components/flow/{LaneBand,NodeBox,EdgeLayer,FlowToolbar,MiniMap}.tsx、scripts/build-ai-chat-guide.ts（新建页范本，已同步 id/role）
- scenarios/ 14 份（全 autoLayout，边均带 id）、review/rtm-flow-layout-routing-agent-plan.md（任务AC 事实源）+ flow-metrics-*.json + repair-edge-id-role.ts
- knowledge/frontend/自动布局布线方案.md（任务AC 已更新：契约/门禁/基准/命令）
