# state · scenario-demo-hub

> 快照时间：2026-10-09 CST（任务X）｜ **任务X：双原则推广 overall-flow/ai-service/service-faq**（场景人味化第 2 波，用户点名①③落地+②核验）｜ 任务W：ai-recommend 人味化 ｜ 任务V：内容修复+弹窗节点上下文 ｜ 任务U：泳道图布局修复 ｜ ADR-014：纯云端 LiteLLM + 脱敏网关

## 当前状态
- **任务X（2026-10-09 16:55）已全绿**：三个 `repair-*-humanized.ts` 脚本落地——overall-flow（S1 商品上了架采购筛不到/S2 换个写法就搜不到/S3 晚上问的事白天才能答）、ai-service（S1 排队的都是老问题/S2 同一个问题两个答案/S3 晚上的急事等不到天亮）各 12 处 name/card/who/stuck 变更；service-faq 仅 3 处 who 场景锚点（该页本已人味达标）。ai-recommend（用户第②项）任务W成果核验仍在、不重做
- **场景文案双原则（W/X 两波确立）**：场景层要有"人味"（具体动作开场/可观察阻碍/方案回应原动作/边界如实/不虚构个案）；证据层（consequences/effects/solution 实测标记/约束/节点机制）不动。**人味化只改 name/card/story.who/story.stuck**——ai-service 的〔实测〕〔示意〕（设计口径）标记必须原样保留
- 构建：`npm run build` → 752.99KB（gzip 243.88KB）；layout/validate/tsc 全绿 0 error；5 条存量 warn（cat-governance 1 + contract-blueprint 4）非阻塞
- 三文件 flow 几何与人味化前逐字节一致；ai-recommend 画布 1360×1020、主链 e1→e5 x=351/558/765/972/1179
- 未跟踪待入库（用户定）：`review/` 七份文档、`scripts/repair-*` 五个脚本、四份 .bak（ai-recommend 两轮 + 本波三个 before-humanize）
- ⚠️ `src/lib/scenarios.ts` 有用户加的过滤 `id !== "contract-blueprint"`（含 console.log），合同蓝图页运行时不可达——**非本次改动，未擅自删除**，待确认是否恢复

## 弹窗/抽屉体系（任务V 定稿，任务W 场景层换血）
- `ScenarioPage.openRef(refId, contextNode)` 是弹窗唯一入口：卡片传 null、节点详情传 selected；RefModal onClose 双清 modalRef+modalNodeContext
- `.m-sec.context` 蓝色系（blue-border/blue-bg），与 prob 灰、sol 橙三分；位于 m-head 后第一个区块
- DetailPanel 文案口径：「■ 本节点关联的业务场景 / 规则约束」「查看完整场景 ↗」「→ 本节点如何承接：」——勿改回旧口径
- **场景定义唯一性红线**：场景/约束 story/solution 只维护一份（refs.ts 单一事实源），节点差异只走 solves[].how；禁止复制 node1S1 类多份对象
- Esc 单层关闭：抽屉 handler 必须让位 RefModal；useScale 高度收拢用 rect.height×s+ceil+2

## 泳道渲染体系（任务U 定稿）
- LaneBand = `.lane` 背景（aria-hidden）+ `.lane-rail` 左侧标题栏（118px=LABEL_BAND）；`.lane-label`/`.lane-note-box` static 左对齐 78px——**勿再按旧药丸样式改回绝对定位**
- rail 文字限 78px 是给 x≈100..120 反馈回路走线留通道；z 序红线：arrows(2) < node(3)=rail(3) < lab(4)
- `tokens.ts`：GRID_GAP=30；ai-recommend 宽度档位：r12=180 / 主链 e·r3·fb·st=166 / d=150 / g=130 / i=115——只改 w，x/y/h/route/labelAt 全是构建期生成值勿手写
- choosePins：默认端口按节点中心 dx/dy；显式 fromSide/toSide 只覆盖对应一端——**勿再回到"跨泳道一律上下"**

## 关键约定（改动前必读）
1. 链式布局：flow.chain（列=链位，跨泳道同列、同泳道+1，col 可覆盖）+ 非主链显式 col + row 分行；bar 独占行；loopchip 不撑列宽但受右边界检查
2. 编号口径：业务页 01~N 主链编号；AI 服务节点无编号用 aip 角标；域级编号写 panelAip；CAP-* 严禁占用 AIP/AICS 编号位
3. 口径红线：数字+量词必须口径词或 approx；**非 AI 环节禁用 beforeAfter**（收益走 metrics）；aip 角标必须能在 SOW 清单同义对上；强承诺词（分钟级/不可篡改/零成本/竞价置顶等）只能以护栏否定式出现
4. 零安装红线：构建期工具走 devDependency；hash 路由；单文件体积盯紧
5. 自动化坑：工具栏按钮可能被顶栏遮挡（click 超时→evaluate 内 target.click()）；cua.scroll 超时→evaluate+window.scrollTo；IAB 进页画布可能被 fitAll 成 20%（点「重置视图」）；**eval 与断言之间 await sleep(≈450)**；hash 切页不吃新 bundle（需 reload 或 ?v=）；Esc 关弹窗可 document.dispatchEvent(Keydown) 到页面
6. 截图产物经 CDN 中转不可内联查看——视觉验证走 DOM 几何实测

## 下一步候选（V1.7）
- review/ 文档、repair 脚本×5、.bak×4 是否入库 git（用户决定）
- 双原则是否继续推广到其余场景页（ai-search/search-query/data-* 等仍为原版文案）
- 5 条存量标签重叠 warn 的治标评估（cat-governance/contract-blueprint，若上汇报可暂留）
- 子模块演示页续建（矩阵见 knowledge/product/总分建设结构.md）；overall-flow 的 a1~a5/a7 补 legacy/whyAi/risks/metrics/fallback（a6 已拉齐可作模板）
- analytics 埋点；场景页导出图片/PDF；contract-blueprint 过滤行处置确认

## 活跃文件
- src/components/{DetailPanel,RefModal,CompareSection,FlowCanvas,BlueprintCanvas}.tsx、src/pages/{HubHome,ScenarioPage}.tsx、src/lib/{refs,useScale}.ts、src/styles/theme.css
- src/components/flow/{LaneBand,NodeBox,EdgeLayer,FlowToolbar,MiniMap}.tsx、src/flow/tokens.ts（几何唯一源）
- scripts/auto-layout.ts（链式+ELK+choosePins+三级标签避障）、scripts/{validate.ts(含 validateLayoutGeometry),rules.test.ts}、scripts/repair-ai-recommend{,-humanized}.ts + repair-{overall-flow,ai-service,service-faq}-humanized.ts（人味化两波，模式：备份+场景层替换+证据层不动断言）
- scenarios/：overall-flow / data-governance / ai-data-platform / ai-search / ai-service / attr-extraction / contract-blueprint / capability-map / ai-recommend / cat-governance / data-desens / search-query / service-faq
- review/：rtm-ai-recommend-review-and-complete-fix.md（内容+UI 修复稿）、ai-recommend-humanized-copy-guide.md（人味文案指南，任务W 已落地）、rtm-ai-recommend-swimlane-fix.md（布局修复稿，任务U 已落地）、repair-ai-recommend{,-humanized}.ts
- knowledge/product/：总分建设结构 / AI商城从0到1业务蓝图 / 商城AI需求追溯矩阵 / 和采商城产品与业务流程蓝图 / 四大模块子能力全景-社区对标版.md
