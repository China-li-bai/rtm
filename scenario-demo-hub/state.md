# state · scenario-demo-hub

> 快照时间：2026-10-03 23:25 CST ｜ 阶段：V1.3 合同蓝图「总索引 + 分层下钻」产品化（L1 总索引 / L2 泳道下钻 / L3 抽屉三层模型，根治大图节点挤压与跨层飞线）

## 当前状态
- 构建：`npm run build` → dist/index.html 单文件 444KB，file:// 双击即开
- 校验：`npm run layout` ✓ ｜ `npm run validate` ✓ 3 份 ｜ `npx tsc --noEmit` ✓ ｜ `npx tsx scripts/rules.test.ts` 10/10 ✓
- 浏览器实测：contract-blueprint L1（主链 7 步+6 泳道 24 pills 零飞线）→ L2（SUP/PM 下钻，同层边+跨端锚点分组跳转）→ L3 抽屉 → 返回总索引，全链路闭环 ✓；overall-flow 回归（FlowCanvas 14 nodes+bar / 0 bp-mode）无劣化 ✓
- 场景配置：scenarios/contract-blueprint.json（drill:true + indexChain 主链七步，画布 1360×2167）+ scenarios/overall-flow.json（四层架构，画布 1360×1315）+ scenarios/attr-extraction.json
- 蓝图唯一事实源：knowledge/product/和采商城产品与业务流程蓝图.md（六端 372 项：OP 129 / PM 50 / SHOP 93·11 模块 / SUP 40·8 模块 / AIP 31 / AICS 29）
- platform 枚举：全景 / 商品 / 搜索 / 客服（各配识别色：墨 #27313d / 橙 #e24a10 / 蓝 #2b6cb8 / 绿 #2f9e6e）

## 页面架构（任务G 定稿）
```
HubHome  = hero（大标题+定位语+统计行）→ 平台分组（色点标题 + auto-fill minmax(300px,1fr) 卡片网格）→ 空组收敛"场景筹备中"
ScenarioPage = topbar（fixed 52px 毛玻璃：←返回 ｜ 标题 ｜ 01痛点/02流程/03对比 锚点+scrollspy）
             → section 01 whycards（场景/约束卡）→ section 02 画布（按 cfg.flow.drill 分支）→ section 03 CompareSection
             → 点节点：右抽屉（fixed 560px/94vw）内嵌 DetailPanel，ESC/遮罩关闭保高亮
画布分支：drill ? BlueprintCanvas : FlowCanvas（任务G，FlowCanvas 零改动）
FlowCanvas v2 = .flow-vp(视口,overflow:clip) > .flow-world(translate+scale) + toolbar + minimap + datasup（全景单视图，适合 ≤15 节点）
BlueprintCanvas = 双态：L1 总索引（bp-chain 主链胶囊①-⑦ + bp-lanes 六行 pill 横排，零飞线）
                                L2 泳道下钻（bp-crumb 面包屑统计 + bp-stage 同层边 SVG + .node 复用 + bp-anchors 跨端协同锚点按对端泳道分组）
                  L3 沿用页面右抽屉；laneOf(n)=n.laneIndex ?? 0 全消费处兜底
```

## 关键约定（改动前必读）
1. **fixed/sticky 元素必须放 scale-outer 层**：scale-inner 有 transform，会劫持内部 fixed 坐标系并缩放（同 RefModal 先例）；顶栏让位用 `.scale-outer{margin-top:52px}`（margin 不进 useScale 的 outer 高度计算）
2. **锚点滚动用物理坐标**：`el.getBoundingClientRect().top + window.scrollY - 60`，天然兼容 inner 缩放，无需换算
3. **scrollspy 触底规则**：末段不足一屏时滚动被钳制、IO 观察带（-30%/-60%）仍被上一段占据 → nearBottom 判定（IO 回调 + scroll 监听双保险）强制高亮末段
4. **三级文案模型**：chip 序号称谓 → badge 徽标短名（tag ?? name；约束取 kw）→ full 弹窗全称（fullTitle 可覆盖）
5. **画布/面板文案分离**：盒内 title/sub/aip 宜短；面板全称走 panelTitle/panelAip
6. **受限富文本**：配置文案仅允许 `<b>` 与 `<br>`（lib/rich.tsx 转义其余）
7. **口径红线**：数字+量词才算指标；有数字必须口径词/approx/metricNote
8. **零安装红线**：禁引入运行时请求；路由必须 hash；新依赖先看单文件构建体积——构建期工具库走 devDependency
9. node.kind 六态：normal/highlight/dashed/diamond/bar/loopchip；边消费 auto-layout 回写的 route/labelAt/style
10. **泳道=架构层**：overall-flow 泳道必须映射方案四层架构；调整连线布局改 auto-layout.ts 规则，**不手工改坐标**
11. **视口画布防隐式滚动容器**（任务F 踩坑）：`.flow-vp` 内世界高度远超视口时，`overflow:hidden` 会使 vp 成为隐式原生滚动容器，浏览器滚动锚定/历史恢复改写 scrollTop 导致覆盖层绘制错位（布局对、绘制错）。已双保险：CSS `overflow:clip`（在前保留 hidden 作 fallback）+ FlowCanvas 在 [zoom,pan] 变化时强制 scrollTop/scrollLeft=0
12. **aip 校验口径**：rules.ts 的 AIP_REF 仅对含 "AIP" 的串生效；纯 OP/PM/SHOP/SUP 编号天然豁免，合同编号走 solves.ref（S/C 开头）承载场景回溯
13. **大图信息架构优先于几何**（任务G 定稿）：节点 >15 或跨层边占比高（蓝图 29/33）时，「单视图全量渲染」再怎么调布局/避障都救不了——用「总索引 + 分层下钻」改交互层级：L1 零飞线（顺序=主链编号，关系=泳道聚合），L2 只画同层边 + 跨层收拢为按对端泳道分组的锚点徽章；声明式开关 `flow.drill` + `flow.indexChain`，ScenarioPage 按 drill 分支，FlowCanvas 不动零回归
14. **laneIndex 可空全兜底**：schema 中 laneIndex 为 optional，所有消费处必须走 `laneOf(n) = n.laneIndex ?? 0`（模块级辅助函数），否则 linter 报 number|undefined——laneNodes 分组 / inner-outer 边分类 / Map.set / setState / 锚点方向判定无一例外
15. **L2 舞台坐标局部化**：泳道下钻视图 = 全局 route/坐标做线性变换（x+L2_DX 居中、y-泳道顶+L2_PAD_TOP），复用全局 .node theme class 保视觉一致；stage 高度=泳道高+64，右侧 200px 留给跨端锚点栏
16. **自动化点击防顶栏遮挡**（任务G 踩坑）：页面 fixed 顶栏（z-80）会覆盖滚动后落在其下的可点元素，agent-browser 报 "covered by .tb-sec"——先 scroll 使目标脱离覆盖区再点；截图上传瞬时失败是 CDN 抖动，sleep 重读即可

## 自动布局管线（任务D 定稿，F 复用）
1. **ELK layered（每泳道独立，RIGHT 方向）**：只定位不喂边。无连边图 ELK 忽略所有间距参数（探针实证），故间距交给阶段2
2. **remapLaneGrid**：泳道垂直堆叠，GRID_GAP=40 网格重排，predictNodeH 按文案回写节点高度
3. **obstacle-router（libavoid）**：全部边一次性正交避障；shapeBuffer=10/nudge=12/segmentPenalty=10；含层名标签带虚拟障碍（左缘 -1000、右缘 x100，逼出 x≈113~120 窄通道）
4. **标签定位**：最长水平段中点起 2px 步长双向滑动，节点盒按 LABEL_PAD=6 膨胀避障
- elkjs/obstacle-router 均为 devDependency，仅构建期 tsx 运行，**不进 vite 产物**
- contract-blueprint 画布 2167px 高经此管线自动布线（33 边），零手工坐标

## 下一步候选（V1.4）
- n6/n11/n12 等两行 sub 节点的 aip 角标轻微重叠修复（has-aip 节点最小高度约束，L2 与 FlowCanvas 共同受益）
- L2 跨端锚点 tooltip 升级为点击弹明细小卡（当前 title 悬停，移动端不可用）
- analytics.endpoint 埋点实现（Schema 已留口）
- AIP registry.json 枚举校验（矩阵机读版）
- 搜索中台/客服中台首批场景配置（auto-layout 已可复用：autoLayout:true 即自动布线）
- 场景页导出图片/PDF（评审材料）
- 画布触屏手势（touch-action:none 已就位，双指捏合待实现）

## 活跃文件
- src/schema/scenario.ts（领域模型唯一事实源）、src/schema/rules.ts（业务规则）
- src/pages/HubHome.tsx（平台色+hero+自适应网格）、src/pages/ScenarioPage.tsx（顶栏+scrollspy+抽屉+drill 画布分支）
- src/components/{FlowCanvas,BlueprintCanvas,DetailPanel,CompareSection,RefModal}.tsx、src/styles/theme.css
- scripts/auto-layout.ts（四段自动布局管线）、scripts/{validate.ts,rules.test.ts}
- scenarios/contract-blueprint.json、scenarios/overall-flow.json、scenarios/attr-extraction.json
- knowledge/product/{和采商城产品与业务流程蓝图,商城AI需求追溯矩阵}.md、knowledge/frontend/{自动布局布线方案,页面布局与展示流程设计}.md
