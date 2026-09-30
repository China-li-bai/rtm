# worklog · scenario-demo-hub（场景演示平台）

## 2026-09-30

### 任务B：AI 专项方案审核 + L1 全景泳道图 + L2/L3 需求追溯矩阵
- **开始**：2026-09-30 10:05 CST
- **完成**：2026-09-30 10:45 CST
- **输入**：《AI专项方案.md》v1.0（693 行）+ 用户两个方法论（C4 逐级缩放 / 需求逐层分解+追溯矩阵）
- **进度**：100%

#### 审核结论（已输出给用户）
- 严重1 缺分阶段量化验收基线（4.5 无目标值 / 9.5 无判定锚 / 6.1 无现状基线）
- 严重2 全局缺编号体系（不满足 DOORS/Jama 双向追溯，沿用 AIP/AICS 占位）
- 严重3 范围剪裁未声明（1.1 员工福利/对外销售痛点无能力章节回应）
- 中4 对账评测集 500+ 与核心 KPI 地位不匹配；轻5 阈值硬编码；轻6 图依赖外部 images/*.png
- 自我修正：撤回"4.7 遗漏集采上架"（实际有）与"数字散落正文"（Grep 零命中，数字在 attr-extraction.json）

#### 开发决策
- 平台枚举扩展第四值「全景」：schema.ts zod enum + HubHome PLATFORMS 同步加；ScenarioPage 无平台耦合不用动
- L1 全景泳道图：4 泳道（供应商/采购单位/商城中台/AI 能力层）+ 11 环节 + 12 边 + bar 汇面条 + dataSupport
- L2/L3 追溯矩阵：knowledge/product/商城AI需求追溯矩阵.md，四张表（商品/搜索/客服/约束）+ 双向自检 + 待补基线表

#### 交付清单（全部实测通过）
- scenarios/overall-flow.json：3 场景（断链/答非/漏单）+ 3 约束（不出域/钱/可审）+ 11 环节 + 12 边
- validate ✓ / tsc ✓ / rules.test.ts 10/10 ✓ / build ✓（dist 380KB）
- agent-browser 截图实测：overall-flow-top.png 渲染正常，布局清晰

#### 踩坑记录
- 带 label 的边必须显式 labelAt（缺省 [0,0] 会飞左上角）
- diamond 只渲染 title（居中）、bar 只渲染 title：sub 单行、loopchip 只渲染 title——sub 仅普通节点与 bar 使用
- 扩展 platform 枚举需同步改两处（zod enum + HubHome PLATFORMS），漏一处 validate 即 fail-loud

## 2026-09-29

### 任务：产品文档 review + V1.0 MVP 开发
- **开始**：2026-09-29 18:21 CST
- **完成**：2026-09-29 20:14 CST
- **输入**：《场景演示平台-产品文档.md》v1.0 + 原型《属性抽取-场景融合交互图.html》
- **进度**：100%（V1.0 MVP 交付）

#### Review 结论（已输出给用户）
- P0-1 Schema 漏实体：箭头 edges / bar / loopchip / dataSupport 未定义 → 声明式 edges + node.kind
- P0-2 双击即开红线 → vite base './' + vite-plugin-singlefile + hash 路由
- P0-3 口径标注不可机检 → 结构化规则（含数字需口径词/approx 标记 + metricNote 必填）；校验库 ajv → zod（中文报错）
- P1-4 固定 1360px → scale 自适应容器
- P1-5 卡片摘要 → scenario.card 字段 + 字数校验
- P1-6 埋点 → Schema 预留 analytics.endpoint（V1.1 实现）
- P1-7 AIP 口径 → registry.json 枚举校验（矩阵机读版留 V2.0）

#### 开发决策
- 栈：Vite + React 19 + TS strict + zod；构建 = 校验前置（fail-loud）
- 多场景：import.meta.glob 加载 scenarios/*.json，顺带交付简易场景中心首页
- 范围：埋点/导出/权限不实现，仅 Schema 留口

#### 交付清单（全部实测通过）
- Schema 层：zod 结构校验 + rules.ts 业务规则（孤儿环节/无解场景/数字口径/approx 豁免/metricNote/悬空边/方法论 warn）；rules.test.ts 10/10
- 渲染层：HubHome 三平台分组 + ScenarioPage 三段式（场景卡/约束卡 → 泳道流程 → 详情面板）
- 泳道图：声明式 edges（from/to/via/label）+ node.kind 六态（normal/highlight/dashed/diamond/bar/loopchip）
- 三级文案模型：chip 序号称谓（场景一）→ badge 徽标短名（场景一 · 筛得到，scenario.tag / constraint.kw）→ full 弹窗全称（name【kw】，constraint.fullTitle 可覆盖）
- 画布/面板文案分离：盒内 title/sub/aip 宜短，面板 panelTitle/panelAip 写全称
- 受限富文本 rich()：配置仅允许 `<b>` 与 `<br>`，其余转义（XSS 边界）
- 交互：环节点击切换、徽章/卡片弹窗、Esc 单层关闭（仅最上层）
- 自适应：useScale 1360px 逻辑宽度 + transform:scale + ResizeObserver 高度收拢（1920→1.15 / 1100→0.7588，无横向滚动）
- 零安装：vite base './' + vite-plugin-singlefile 单文件 360KB（gzip 113KB）+ hash 路由；file:// 双击即开，交互链路完整

#### 踩坑记录
- rules.test.ts 隐式 any：JSON.parse 结果需 `as ScenarioConfig` 显式标注，否则 filter 回调参数推断为 any
- aip 角标与 sub 文本重叠：.aip 绝对定位 bottom:5px → CSS 加 `.node.has-aip { padding-bottom: 22px }` 预留空间
- 盒内文案过长：初版把面板级长文案塞进画布盒 → 确立画布/面板文案分离模式（panelTitle/panelAip）
- 徽标文案与原型不符：原型 REL 为 n/full/kw 三级模型 → scenario 加 tag、constraint 加 fullTitle，badge 分别取 tag??name / kw
- agent-browser `press Escape` 偶发使整个 headless 会话掉到 about:blank（工具侧问题）；改用 JS `document.dispatchEvent(KeyboardEvent)` 验证 app 层 Esc 行为正确
- eval 中同步 click 后立即断言会 race React 异步渲染——click 与断言之间必须 wait
