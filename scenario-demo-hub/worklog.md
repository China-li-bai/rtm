# worklog · scenario-demo-hub（场景演示平台）

## 2026-10-03

### 任务G：合同蓝图「总索引 + 分层下钻」产品化（/goal）
- **开始**：2026-10-03 21:30 CST（接续任务F 完结后）
- **输入**：/goal 合同业务蓝图全景泳道流程图，节点挤在一起了，连线太乱了；本质是"总索引 + 分层下钻"的产品化
- **问题诊断**（实证）：
  - 节点挤压根因：24 节点全部位于 x=130~330 两列窄带（画布 1360 仅用 1/4，纵向拉到 2167px）——ELK 每泳道独立布局，列数=泳道内并行度，跨泳道无对齐
  - 连线乱根因：33 边中 29 条是跨泳道长途飞线（n2→n18 纵穿约 1400px；n22 集成层向 PM/OP 发 4 条约 1500px 灰虚线）——**单视图全量渲染大图的信息架构问题**，非几何问题（任务D 的 libavoid 已解穿节点，救不了「线太多太长」）
- **定稿方案**：三层模型——L1 总索引（顶部 7 步主链阶段条 + 六泳道行 pill 横排，零飞线；顺序用主链编号表达、关系用泳道聚合表达）→ L2 泳道下钻（单泳道内部流程视图，只画同层边 ≤3 条；跨层 29 条收拢为右侧锚点徽章按对端泳道分组，点击跳对端泳道）→ L3 节点详情（沿用现有右抽屉）
- **完成**：2026-10-03 23:25 CST
- **进度**：100%

#### 落地内容
1. **schema 扩展**（g1）：`flowSchema` 新增 `drill: z.boolean().optional()`（下钻模式开关）与 `indexChain: z.array(z.string()).optional()`（L1 主链阶段顺序，节点 id 数组）；`contract-blueprint.json` 声明 `drill:true` + `indexChain:[n2,n18,n13,n6,n11,n4,n12]`（推品→AI清洗→上架治理→选购寻源→交易定标→履约→对账反哺）+ `defaultSelected:n2`
2. **BlueprintCanvas 新组件**（g2，FlowCanvas 不动——其他场景零回归）：双态渲染——L1 `bp-chain`（主链 7 步胶囊，①-⑦ 徽标，点击下钻所在泳道+开抽屉）+ `bp-lanes`（6 行 `bp-lane`，头部按钮显示「N 个功能域 · 下钻 →」，pills 横排：主链节点显序号徽标、其余显 n.no 编号 + 标题 + 合同条目号）；L2 `bp-crumb`（← 总索引 + 泳道名 + 统计：内部流程 N 环节 · 同层连线 N 条 · 跨端协同 N 条）+ `bp-stage`（SVG 同层边 route 局部化：y 减泳道顶+顶距、x 加 L2_DX=320 居中，复用 `.node` theme class 保持视觉一致）+ `bp-anchors`（跨端协同按对端泳道分组徽章，方向箭头 ←/→ + 泳道名 + N 条，title tooltip 列明细，点击跳对端泳道）
3. **ScenarioPage 分支**（g3）：第 137 行按 `cfg.flow.drill` 分支（drill ? BlueprintCanvas : FlowCanvas）；theme.css 追加 `.bp*` 全套 30+ 条样式（视觉体系照搬既有色板：--c-accent 橙主链 / --c-gray-3 灰虚线 / 卡片白底圆角阴影）
4. **laneIndex 可空兜底**：`laneOf(n) = n.laneIndex ?? 0` 模块级辅助函数，所有消费处（laneNodes 分组 / l2 inner-outer 分类 / outer.set / 主链按钮 setLaneIdx / 锚点方向判定）统一走 laneOf——schema optional 类型的 linter 错误根源修复

#### 验证链（全绿）
- `npm run layout` ✓（drill 字段回写保留）｜ `npx tsc --noEmit` ✓ ｜ `npm run validate` 3 份 ✓ ｜ `npx tsx scripts/rules.test.ts` 10/10 ✓ ｜ `npm run build` → dist/index.html 444KB ✓
- 目检闭环（agent-browser）：L1 主链 7 步 + 6 泳道 24 pills 横排零飞线 ✓ → SUP 下钻 L2（面包屑统计 5 环节/1 同层/8 跨端，n1→n2 同层边渲染，右侧锚点 PM 5/OP 2/AI 1 条）✓ → 锚点跳 PM 泳道（4 节点，跨端 12 条=SUP5+SHOP2+OP2+集成3）✓ → 节点点击开 L3 抽屉（场景徽章/AI 做了什么/解法/亮点）✓ → 返回总索引（24 pills/7 steps 恢复）✓
- overall-flow 回归：FlowCanvas 旧渲染（1 viewport / 14 nodes+bar / 0 bp-mode）无劣化 ✓
- 已知非回归瑕疵：n6/n11/n12 等 h=76 两行 sub 节点的 aip 角标与 sub 文字轻微重叠——既有 NodeBox 渲染行为，L2 与 FlowCanvas 完全一致，未扩 scope 修

#### 踩坑备忘
- **锚点点击被吸顶导航遮挡**：`.bp-anchors` 位于 stage 右上，页面滚动后其 click point 落入 fixed topbar（z-80）覆盖区，agent-browser 拒绝点击并报 "covered by .tb-sec"——需先 scroll 使目标脱离顶栏覆盖区再点（自动化测试场景通用教训）
- **截图上传瞬时失败**：Read PNG 偶发 "Failed to upload file"（tos-my319 CDN 抖动），sleep 3-8s 重读即恢复，勿改代码
- goal 系统限制：上一条 goal update complete 后 create_goal 仍报 "A goal already exists"，长任务改用 TodoWrite 跟踪更稳

### 任务F：场景中心全景泳道——合同业务蓝图 + 画布组件重设计（/goal）
- **开始**：2026-10-03 17:45 CST
- **输入**：/goal 场景中心的全景泳道，解决两个问题：①根据合同和初步方案梳理整体方案，做成产品和业务流程蓝图；②重新设计界面和核心画布组件
- **原料**：`保利物业和采商城系统升级项目_工作说明书SOW_【合同版】.docx`（textutil 转出 /tmp/sow.txt，2116 行，v1.1 POLY-SOW-20260816）+ `保利物业商城AI专项架构方案.md`（初步方案）
- **三项设计决策**（AskUserQuestion 用户全选推荐）：
  1. 蓝图产物=**双交付**：`knowledge/product/和采商城产品与业务流程蓝图.md`（唯一事实源）+ 演示平台新增「业务流程蓝图」全景泳道页
  2. 与现有 AI 专项泳道=**新增+保留**：新 contract-blueprint 场景页（四端闭环+双AI中台+集成全景）；现有 overall-flow 改名 AI 专项页保留
  3. 画布深度=**视口级重设计**：替换 useScale 整页缩放为画布视口——滚轮缩放/拖拽平移/小地图导航/悬停高亮相邻连线与节点/图例过滤；节点与泳道视觉重设计
- **合同要点摘要**（蓝图文档原料）：
  - 四端功能清单：OP 运营 129 项 / PM 采购 50 项 / SHOP 商城 / SUP 供应商 40 项
  - 双 AI 中台：AIP-001~031 商品（类目/属性/同款/审核/搜索/导购）+ AICS-001~029 客服（会话/意图/知识库/席位/敏感词）
  - 咨询运营服务：含《业务流程与系统蓝图方案》交付物；商品标准化；驻场运营 ≥2 人 1 年
  - 集成 12 类：IDM/主数据/OA/成本/新视窗/通联支付/物流/消息/票易通/AI底座/京东苏宁震坤行得力/开放接口
  - AI 验收指标（SOW 7.2）：同款 P≥85%/R≥80%；类目首选≥80%/前三≥85%；关键属性≥85%；搜索前三≥95%/前十≥85%；客服标准问答≥85%/高风险 100%
  - 里程碑：2026-08-12 启动 → 09-30 咨询蓝图 → 12-31 核心业务闭环试运行 → 2027-01-15 AI客服试运行 → 04-30 全量上线 → 06-30 验收
- **代码摸底结论**：
  - schema：id kebab-case；platform 枚举 ["全景","商品","搜索","客服"]；flowNodeSchema 必填 ai/process/highlights/solves；aip 走 `AIP_REF /^(AIP|AICS)-\d{3}…/`（蓝图页四端编号需扩展正则或改字段）；edge 三态 main/dash/grayDash；autoLayout:true 由构建期 auto-layout.ts 回写 route/labelAt
  - FlowCanvas：外层 `.card.flow`（高=flow.height，宽=--page-w 1360）绝对定位 lane/node + svg.arrows viewBox；v2 改造触点=整页缩放换视口容器（translate+scale state）+ minimap + 悬停高亮 + 图例过滤
  - ScenarioPage：useScale(cfg.flow.width) 整页缩放；锚点物理坐标；画布耦合点=`.scale-inner` transform、`.card.flow` 定高、`svg viewBox` 随 width/height
- **完成**：2026-10-03 21:05 CST
- **进度**：100%

#### 落地内容
1. **蓝图文档**（f2）：`knowledge/product/和采商城产品与业务流程蓝图.md`——六端功能地图（OP 129 / PM 50 / SHOP 93·11 模块 / SUP 40·8 模块 / AIP 31 / AICS 29，共 372 项）、四端业务流程主线（SUP→OP→PM→SHOP 闭环）、双 AI 中台嵌入点、12 类集成、合同里程碑与验收红线
2. **FlowCanvas v2 视口画布**（f3）：整页缩放（useScale）→ 视口级画布（vp 固定 height + world 绝对定位 translate/scale 状态机）；滚轮以光标为锚缩放（1.0015 幂次）、指针拖拽平移（outerScale 补偿）、适应窗口/重置视图、小地图（世界缩略图+橙色视口框，点击导航居中）、悬停 dim 高亮相邻节点与连线、图例过滤（main/dash/grayDash 三态 chip）、选中节点滚出视口自动回中
3. **contract-blueprint 场景页**（f4）：24 节点 / 33 边 / 6 泳道（四端业务+双 AI 中台+集成支撑），画布 1360×2167，auto-layout 四段管线自动布线；首页入口卡经 import.meta.glob 构建期自动出现；与 overall-flow（AI 专项页）并存

#### 验证链（全绿）
- `npx tsc --noEmit` ✓ ｜ `npm run validate` 3 份 ✓ ｜ `npx tsx scripts/rules.test.ts` 10/10 ✓ ｜ `npm run build` → dist/index.html 435KB ✓
- 蓝图页目检：默认视图节点/边标签 ✓、悬停 dim 高亮 ✓、对比 4 卡 ✓、图例过滤往返（paths 35→32→35，chip 状态切换）✓、节点点击→右抽屉（panelTitle/SOW 编号/场景约束徽章/AI 做了什么/亮点价值/前后对比表）✓
- overall-flow 旧页回归：13 节点/17 边/小地图/工具条/泳道渲染无劣化 ✓（defaultSelected 首开抽屉为既有设计）

#### 踩坑备忘（本任务核心 bug）
- **小地图/数据支撑层错位「隐式滚动容器」根因**：`.flow-vp{position:relative;overflow:hidden}` + 子元素 `.flow-world{position:absolute;height:2167}`（远超视口 620）使 vp 成为**隐式原生滚动容器**（scrollHeight 2132）；浏览器滚动锚定/历史恢复改写 `vp.scrollTop=944`，scrollTop 原生偏移造成后代元素**绘制位置**与 React 平移状态脱节——getBoundingClientRect 含滚动偏移而 offsetTop/offsetParent 反映纯布局，二者背离 ~944px；getComputedStyle/inline transform 均正常，属「布局正确、绘制错误」型 bug
- **双保险修复**：① CSS 根除 `.flow-vp` 加 `overflow:clip`（不创建滚动容器，现代浏览器；`overflow:hidden` 保留在前作 fallback）；② JS 兜底 FlowCanvas useEffect 在 `[zoom,pan]` 变化时强制 `scrollTop=0;scrollLeft=0`（防 Safari<16 等不支持 clip 者）。修复后 vp.scrollTop=0，三覆盖层 rect 全部吻合
- **React 合成事件教训**：agent-browser eval 内 `chip.click()` 合成 click 不触发 React onClick；CLI 原生 click 中 `:has-text`/XPath `contains(.,'反哺')` 中文匹配失效，CSS `nth-of-type` 定位可靠；判定「可点击」需挂原生探针看事件计数+状态翻转，读数时机过早会造成假阴性

### 任务E：页面布局与展示流程重设计（/goal 指令，乔布斯产品视角）
- **开始**：2026-10-03 16:40 CST
- **输入**：/goal 重新设计页面的布局和展示流程；用户确认范围=首页+场景页，方向=吸顶导航+右侧抽屉，按乔布斯产品视角做 UI/UX
- **现状诊断**（截图实证）：
  - HubHome：分组纵向单列、卡片固定 340px 大面积留白；空组暴露开发提示（"往 scenarios/ 目录放 JSON"）出戏
  - ScenarioPage：三段式长页无导航，评审滚动迷失；点节点后详情远在泳道下方，交互反馈脱离上下文
- **技术约束**：scale-inner 有 transform → fixed/sticky 须放 scale-outer 层（同 RefModal 先例）；getBoundingClientRect 返回物理坐标，锚点滚动补偿天然正确
- **完成**：2026-10-03 17:37 CST
- **进度**：100%

#### 落地内容（对照乔布斯式设计要求）
1. **HubHome 重写**：Hero 区（30px 大标题 + 橙色定位语 + 统计行）→ 四平台识别色（全景墨/商品橙/搜索蓝/客服绿，卡片 border-left 4px + 分组色点，建立视觉记忆）→ 自适应网格 `auto-fill minmax(300px,1fr)` 消灭留白 → 空组收敛为淡文字"场景筹备中"（去掉开发提示，不出戏）
2. **ScenarioPage 吸顶导航**：fixed topbar（52px，毛玻璃 blur(14px)，z-80）= 返回 + 场景标题 + 三段锚点按钮；三段叙事章节 01 痛点（为什么）→ 02 流程（怎么做）→ 03 对比（带来什么），章节标题统一 sec-h（序号胶囊 + 标题 + 副标题）
3. **scrollspy**：IntersectionObserver `rootMargin -30%/-60%`；**触底规则**——末段不足一屏时滚动被钳制，IO 观察带仍被上一段占据，加 nearBottom 判定（IO 回调 + scroll 监听双保险）强制高亮末段
4. **右抽屉详情**：点节点 = 高亮 + 抽屉滑出（560px/94vw，cubic-bezier(0.2,0.8,0.3,1)），流程图保持可见不脱离上下文；面板 CSS 去壳（无卡框单列堆叠）；ESC/遮罩关闭，关后保留高亮
5. **顶栏/抽屉渲染在 scale-outer 层**：规避 scale-inner transform 对 fixed 的坐标系劫持，始终原生尺寸可读；`.scale-outer{margin-top:52px}` 让位顶栏且不进 useScale 高度计算

#### 验证链（全绿）
- `npx tsc --noEmit` ✓ ｜ `npm run validate` 2 份 ✓ ｜ `npx tsx scripts/rules.test.ts` 10/10 ✓
- `npm run build` → dist/index.html 389.74KB（gzip 120.72KB），+4.7KB 交互代码，零依赖新增
- 浏览器目检（agent-browser）：新首页 Hero/平台色/空组 ✓；顶栏+章节序号+scrollspy 三段往返高亮（痛点↔流程↔对比，含触底）✓；点节点开抽屉→ESC 关→高亮保留 ✓；overall-flow/attr-extraction 两场景页 ✓
- 目检发现并修复 1 个真 bug：scrollspy 触底不高亮末段

#### 踩坑备忘（agent-browser）
- 截图全页标志是 `-f/--full`（不是 --full-page，否则被当输出文件名写进 cwd）
- cache-bust 必须放 hash 之前（`/?v=N#/s/xxx`），放 hash 内会被当路由参数落回首页
- 场景 id 笔误（attr-extract vs attr-extraction）会静默落回首页——eval 断言 hasTopbar/secCount 可快速识破
- PNG Read 偶发上传失败 → `--screenshot-format jpeg`；浏览器会话可能丢失落 about:blank，先 eval location.href 确认在场

## 2026-09-30

### 任务D：GitHub 开源框架根治布局与连线（用户第三次返工指令）
- **开始**：2026-09-30 16:40 CST
- **完成**：2026-09-30 18:00 CST
- **输入**：用户逐字指令「布局和线乱的问题依旧存在，再搜索 GitHub 开源的轻量框架或者算法解决布局和连线问题」，明确禁止再手工调坐标
- **进度**：100%

#### 调研选型（GitHub 优先，复用成熟方案）
- **布局**：elkjs（Eclipse ELK 的 WASM/JS 移植，layered 算法，Sprotty/Eclipse 生态标配）
- **布线**：obstacle-router 0.1.2（libavoid / Adaptagrams, Monash University 的纯 TS 正交避障布线，LGPL-2.1，零运行时依赖）
- 两库均为 **devDependency + 构建期经 tsx 运行**，产物零增量（build 仍 385.04KB 单文件，gzip 119.51KB，无 assets），守住零安装红线

#### 定稿四段管线（scripts/auto-layout.ts，npm run layout）
1. 每泳道独立 ELK layered + RIGHT，只定位不喂边
2. 泳道垂直堆叠 + remapLaneGrid（GRID_GAP=40 网格重排）+ predictNodeH 高度回写
3. obstacle-router 全部边一次性正交避障布线（含层名标签带虚拟障碍）
4. 回写 route/labelAt（标签沿水平段滑动避障）

#### 关键技术发现与坑
- **ELK 无连边图忽略全部间距参数**（/tmp/elk-probe 探针实证）：不喂边时 spacing.nodeNode/nodeNodeBetweenLayers/baseValue 均不生效，间隙恒 20px === 双侧 shapeBuffer(10×2)，正交走廊封死致 Path not found → 故布局/布线分两库各司其职
- **libavoid 五晚绑定 helper**：new Router(OrthogonalRouting) 后须手工挂 `_generateStaticOrthogonalVisGraph`/`_improveOrthogonalRoutes`/`_ConnectorCrossings`/`_AStarPath`/`_vertexVisibility`
- ShapeRef/ConnRef **绝不可赋 .id**（覆盖内部 id() 致 TypeError）；库 dist 导入无 .js 扩展 → 只能 tsx 运行
- 引脚：4 pin（顶/底/左/右）全部 `setExclusive(false)` + ConnDirAll（同端口多入多出是流程图正常语义）；choosePins 按跨层/同层启发式选端口
- **skipLibCheck 边界**：跳不过跨 d.ts 文件结构兼容检查（库内部 IRouter/IShape/IObstacle 互缺成员）→ 库边界用最小结构类型（AnyRouter/AnyShape/AnyConn）+ unknown 双转隔离
- **层名标签带虚拟障碍**：初版封死整条带（x12..116）把跨层反哺线逼出画布（n13→n7 minX=-10），根因 n11 全宽 bar 横贯公共底座层；终版障碍左缘 -1000、右缘止于文字区 x100，几何上逼出 x≈113~120 固定窄通道，反哺竖线归束不压层名
- **标签避障**：取最长水平段中点、2px 步长双向滑动选首个不撞节点位置；节点盒按 LABEL_PAD=6 膨胀判定（否则"是"标签与菱形仅 1px 间隙视觉粘连）

#### 验证链（确定性几何校验优于截图目检）
- npm run layout ✓ 15 节点/15 边/4 泳道，画布 1360×1315
- /tmp/check-cross2.mjs（折点×矩形严格内部相交 + 节点重叠）PASS 15/15
- 标签×节点膨胀 6px 校验 PASS（是[470,361] / 否[488,332] / 反哺[367,441]）
- tsc ✓ 零错误 / validate ✓ 2 份 / rules.test.ts 10/10 / build ✓ 385.04KB
- agent-browser 截图目检：跨层长斜线/灰虚线穿层/回环横线贯层/标签漂移四类历史问题全部消除

### 任务C：overall-flow 四层架构返工（用户两项问题修复）
- **开始**：2026-09-30 15:30 CST
- **完成**：2026-09-30 16:35 CST
- **输入**：用户返工指令——① 四层架构（业务应用层/AI 中台能力层/公共底座层/数据与基础设施层）未在全景流程写清；② 节点布局和线乱
- **进度**：100%

#### 根因诊断
- 旧版按角色划泳道（供应商/采购单位/商城中台/AI 能力层），与方案 2.1 权威四层架构错位
- `.lane-label` 占位画布 x 16~116px，旧版 n1 x:40 与标签带重叠被遮挡
- 跨泳道远距离飞线：n1→n8 / n2→n8 / n6→n8 / n7→n8，连线交叉

#### 修复动作（整体重写 scenarios/overall-flow.json 的 flow 层）
- 泳道改为四层架构：业务应用层(top:14,h:120) / AI 能力层(top:146,h:200) / 公共底座层(top:358,h:200) / 数据与基础设施层(top:570,h:200)，flow.height 700→780
- 节点网格化重排，全部 x≥130 避开标签带；新增基础设施三节点：n12 私有化 GPU 集群 / n13 云端大模型 API 网关 / n14 数据脱敏网关（均挂 C1，使"数据不出域"有显性落点）
- 新增判定节点 nx（校验通过？diamond），人审改为 n5；连线收敛 16 条，全部显式 fromSide/toSide/labelAt，反哺回环 n5→n3 走 via 折线
- 业务数据（S1~S3 / C1~C3 / compare / ai / beforeAfter）原样保留，仅改 flow 层与 constraints.land 的四层引用文案

#### 验证链（全部重跑通过）
- validate ✓ 2 份配置 / tsc ✓ / rules.test.ts 10/10 ✓ / build ✓（dist 383.43 kB）
- agent-browser 全页截图实测：四泳道标签清晰、n1 无遮挡、nx 分支标签贴合、n12→n3 / n13→n7 / n14→n13 灰虚线就近不穿节点

#### 同步更新
- knowledge/product/商城AI需求追溯矩阵.md：L3 口径改 n1~n14+nx；矩阵 A 校验链改 nx→n5；C1 落地改 n12/n13/n14；反向自检补三节点映射

#### 踩坑记录
- **浏览器缓存陷阱**：serve dist 后 agent-browser 复用 profile 缓存旧 index.html，卡片计数与泳道渲染"新旧混搭"造成误判——cache-bust（`?v=日期`）强制刷新后才拿到新 bundle；后续截图验证必须先 bust 缓存
- hash 路由 `#/overall-flow` 直接 open 不跳转（停在 hub 首页），需 snapshot 取卡片 ref 点击 @e4 进入

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
