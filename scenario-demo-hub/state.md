# state · scenario-demo-hub

> 快照时间：2026-10-09 CST（任务U）｜ **任务U：AI猜你喜欢泳道图布局修复**（修复稿六项落地：GRID_GAP 30 / lane-rail 左侧标题栏 / choosePins 几何端口 / 24节点加宽 / validateLayoutGeometry 几何校验）｜ 上一段任务S：子能力全景图进平台 ｜ 任务R：四大模块子能力全景 ｜ 任务Q：boundary 第七形态 ｜ ADR-014：纯云端 LiteLLM + 脱敏网关

## 当前状态
- **任务U（2026-10-09）已全绿**：按 `rtm/rtm-ai-recommend-swimlane-fix.md` 六项全落地（tokens/LaneBand/theme.css/choosePins/ai-recommend 宽度/几何校验）；主链 e1→e5 列距 41px 与修复稿预测一致、最右缘 1348=CONTENT_RIGHT；跨泳道横向占优边（fb→e1、st→e4）改走左右端口
- **布局几何校验（新）**：`validateLayoutGeometry` 在 validate.ts——节点在画布/泳道内、两两不重叠、route 端点在节点边界、逐段正交不穿节点（error）+ 标签可能重叠（warn）；今后凡 autoLayout 回写异常会在校验期 fail-loud
- 已知存量 warn 5 条（cat-governance 1 + contract-blueprint 4 标签可能重叠）——新校验暴露的存量现象，非阻塞
- 构建：`npm run build` → dist/index.html 743.42KB（gzip 240.11KB），file:// 双击即开
- 校验：layout ✓ 13 份 ｜ validate ✓ 13 份 0 error 5 warn ｜ tsc ✓ ｜ rules.test 10/10 ✓
- 场景配置 13 份（11 链式 + contract-blueprint ELK + capability-map drill）
- ⚠️ `src/lib/scenarios.ts` 有用户加的过滤 `id !== "contract-blueprint"`（含 console.log），合同蓝图页运行时不可达——**非本次改动，未擅自删除**，待确认是否恢复

## 泳道渲染体系（任务U 定稿）
- tone 色全站换新：biz #f0f6ff / ai #f5f1ff / base #f5f6f8 / data #effaf4 / mid #f5f1ff（lane 底 + rail 底双层，rail 更深一档）
- LaneBand = `.lane` 背景（aria-hidden）+ `.lane-rail` 左侧标题栏（118px=LABEL_BAND，aria-label 承载泳道名）；`.lane-label`/`.lane-note-box` 改 static 左对齐 78px——**勿再按旧药丸样式改回绝对定位**
- rail 文字限 78px 是给 x≈100..120 反馈回路走线留通道；节点区起点 NODE_LEFT=LANE_LEFT+LABEL_BAND 不变
- z 序红线：arrows(2) < node(3)=rail(3) < lab(4)
- `tokens.ts`：GRID_GAP=30（>2×SHAPE_BUFFER=20，同时是链式列距下限）

## 端口选择（choosePins，任务U 重写）
- 默认端口按节点中心 dx/dy：同泳道 |dy|>|dx| 走上下，否则左右；跨泳道 |dy|≥|dx|×0.9 偏好上下、横向明显占优允许侧连
- 配置显式 `fromSide`/`toSide` 只覆盖对应一端，另一端仍自动推断；**勿再回到"跨泳道一律上下"**

## 画布组件体系（任务N 定稿，任务U 局部更新）
- `src/flow/tokens.ts`：构建期+运行时唯一几何事实源（PAGE_WIDTH/LABEL_BAND=118/GRID_GAP=30/DEFAULT_H/MINIMAP/zoom）——改值必须重跑 `npm run layout`
- `src/components/flow/`：LaneBand / NodeBox / EdgeLayer（标签 z4 halo 渲染在节点后，只消费 edge.route 不重算坐标）/ FlowToolbar / MiniMap；FlowCanvas 只剩视口协调
- 节点七态：normal / highlight / dashed（待补占位）/ boundary（刻意不做）/ diamond / bar / loopchip——dashed 与 boundary 语义相反不可混用

## 关键约定（改动前必读）
1. 链式布局：flow.chain（列=链位，跨泳道同列、同泳道+1，col 可覆盖）+ 非主链显式 col + row 分行；bar 独占行；loopchip 不撑列宽但受右边界检查
2. ai-recommend 节点宽度档位（任务U）：r12=180 / 主链 e·r3·fb·st=166 / d=150 / g=130 / i=115；**只改 w，x/y/h/route/labelAt 全是构建期生成值勿手写**
3. 编号口径：业务页 01~N 主链编号；AI 服务节点无编号用 aip 角标；域级编号写 panelAip；CAP-* 严禁占用 AIP/AICS 编号位
4. 口径红线：数字+量词必须口径词或 approx；**非 AI 环节禁用 beforeAfter**（收益走 metrics）；aip 角标必须能在 SOW 清单同义对上
5. 零安装红线：构建期工具走 devDependency；hash 路由；单文件体积盯紧
6. Esc 单层关闭：抽屉 handler 必须让位 RefModal；useScale 高度收拢用 rect.height×s+ceil+2
7. 自动化坑：工具栏按钮可能被顶栏遮挡（click 超时→evaluate 内 target.click()）；cua.scroll 超时→evaluate+window.scrollTo；IAB 进页画布可能被 fitAll 成 20%（点「重置视图」回 fitWidth）；**eval 与断言之间 await sleep(≈450)**；hash 切页不吃新 bundle（需 reload 或 ?v=）
8. 截图产物经 CDN 中转不可内联查看——视觉验证走 DOM 几何实测（rail 对齐/文字溢出/z 序/SVG route 比对）

## 下一步候选（V1.7）
- 5 条存量标签重叠 warn 的治标评估（cat-governance/contract-blueprint，若上汇报可暂留）
- 子模块演示页续建（矩阵见 knowledge/product/总分建设结构.md）
- overall-flow 的 a1~a5/a7 补 legacy/whyAi/risks/metrics/fallback（a6 已拉齐可作模板）
- analytics 埋点；场景页导出图片/PDF
- 子能力全景若进汇报：CAP-* 是否对外露出（建议内部规划图）
- 第四域口径收敛（CAP-D 11 项可作基准）

## 活跃文件
- src/flow/tokens.ts（几何唯一源）+ src/components/flow/{LaneBand,NodeBox,EdgeLayer,FlowToolbar,MiniMap}.tsx
- src/components/{FlowCanvas,BlueprintCanvas,DetailPanel,RefModal,CompareSection}.tsx、src/pages/{HubHome,ScenarioPage}.tsx、src/lib/useScale.ts、src/styles/theme.css
- scripts/auto-layout.ts（链式+ELK 双模式+choosePins 几何端口+三级标签避障）、scripts/{validate.ts(含 validateLayoutGeometry),rules.test.ts}
- scripts/gen_capability_map.py（CAP 文档→capability-map.json，勿手改产物）、scripts/sync_scope_boundary.py
- scenarios/：overall-flow / data-governance / ai-data-platform / ai-search / ai-service / attr-extraction / contract-blueprint / capability-map / ai-recommend / cat-governance / data-desens / search-query / service-faq
- knowledge/product/：总分建设结构 / AI商城从0到1业务蓝图 / 商城AI需求追溯矩阵 / 和采商城产品与业务流程蓝图 / 四大模块子能力全景-社区对标版.md
- knowledge/frontend/：边界声明位的表达规范.md（kind=boundary 专用）
