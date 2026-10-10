# state · scenario-demo-hub

> 快照时间：2026-10-10 CST（任务AB）｜ **任务AB：判定节点真菱形渲染** ｜ 任务AA：AI 对话导购新页面落地（保利行业化） ｜ 任务Z：ai-recommend 去黑话 ｜ 任务Y：流程 review 修复 ｜ 任务X：双原则推广 ｜ 任务W：人味化 ｜ 任务V：内容修复+弹窗节点上下文 ｜ 任务U：泳道布局 ｜ ADR-014：纯云端 LiteLLM + 脱敏网关

## 当前状态
- **任务AA（2026-10-09 20:42）已全绿**：新建第 14 号配置 `scenarios/ai-chat-guide.json`（`#/s/ai-chat-guide`，platform 搜索，PRD AIP-024-028 Frozen v1.0 为事实源）。6 泳道 / 16 节点 / 21 边 / 画布 1360×970；主链 01 说需求→02 解析五要素→◇需求完整？→03 多轮澄清→04 检索可售池→05 生成清单·预算合规校验→06 确认·加购→07 会话留痕 bar；非主链 c1 入口/h1 兜底/d1-d6 pills（含协议标签·集采协议价）。用户五项行业化改造全落地（保安制服条件组合、天悦项目/预算归属追问、协议标签+优先推荐、C2 预算合规校验优先、售楼处/防汛/客服三场景）
- 构建：build ✓ 790.49KB（gzip 256.00KB）；layout/validate/tsc 全绿 0 error；其余 13 份配置零扰动；5 条存量 warn 非阻塞
- **新建页面脚本模式（任务AA 立）**：`scripts/build-ai-chat-guide.ts` —— fail-loud 自校验（solves/无解/effects=consequences/card≤120/列推导+碰撞预检/**bar 行独占**/黑话两层/口径词）+ 目标文件存在即拒写；首跑被 layout 拦（bar 行碰撞）后把规则回补自校验
- 未跟踪待入库（用户定）：`review/` 七份文档、repair/build 脚本×8、六份 .bak、`scenarios/ai-chat-guide.json`
- ⚠️ `src/lib/scenarios.ts` 有用户加的过滤 `id !== "contract-blueprint"`（含 console.log），合同蓝图页运行时不可达——**非本次改动，未擅自删除**，待确认是否恢复

## 弹窗/抽屉体系（任务V 定稿，任务AA 已在新页复用验证）
- `ScenarioPage.openRef(refId, contextNode)` 是弹窗唯一入口：卡片传 null、节点详情传 selected；RefModal onClose 双清 modalRef+modalNodeContext
- `.m-sec.context` 蓝色系，位于 m-head 后第一个区块；ai-chat-guide 的 S4 从 03 打开实测「■ 当前流程节点如何落实」正常
- DetailPanel 文案口径：「■ 本节点关联的业务场景 / 规则约束」「查看完整场景 ↗」「→ 本节点如何承接：」——勿改回旧口径
- **场景定义唯一性红线**：story/solution 只维护一份，节点差异只走 solves[].how；禁止 node1S1 类复制
- Esc 单层关闭；useScale 高度收拢用 rect.height×s+ceil+2

## 泳道渲染 + 链式布局（任务U/AA 定稿）
- LaneBand = `.lane` 背景 + `.lane-rail` 左标题栏（118px=LABEL_BAND）；rail 文字限 78px 给走线留通道；z 序 arrows(2)<node(3)=rail(3)<lab(4)
- **链式列规则**：换泳道继承列、同泳道+1；**折返链（L2→L3→L2）会让两节点撞同列——后继显式 col 覆盖**（ai-chat-guide s1 col:3 范例）；bar 必须挂 chain 且独占泳道行；loopchip 不撑列宽
- 宽度预算：usable=1218px；列宽合计+列距≥30 是硬红线，7 列约封顶（attr 7 列 1047px 已近极限）
- `tokens.ts`：GRID_GAP=30；只改 w，x/y/h/route/labelAt 全是构建期生成值勿手写；choosePins 显式 fromSide/toSide 只覆盖一端

## 关键约定（改动前必读）
1. 编号口径：业务页 01~N 主链编号；diamond 不占编号；域级编号写 panelAip；CAP-* 严禁占用 AIP/AICS 编号位
2. 口径红线：数字+量词必须口径词或 approx；非 AI 环节禁用 beforeAfter；aip 角标必须 SOW 同义对上；强承诺词只能以护栏否定式出现
3. 术语纪律（任务Z 表，新页沿用）：触点/候选/共现/上下文/近邻/同款簇/冷启动/统计依据/全量混跑/支持度/时间衰减/阈值下行/稀疏/样本量 全禁；B2C 痕迹词（蓝牙耳机/跑步/降噪）同禁；召回/排序/去重/画像/属性/理由码保留
4. 零安装红线：构建期工具走 devDependency；hash 路由；单文件体积盯紧
5. 自动化坑：缩放画布内文本点击超时→evaluate 内找 `.node` dispatchEvent；cua.scroll 超时→window.scrollTo；IAB 进画布可能被 fitAll 成 20%；**eval 与断言之间 await sleep(≈450)**；evaluate 回调内勿引用外层变量（fresh kernel 序列化）；hash 切页不吃新 bundle；Esc 关弹窗 document.dispatchEvent(Keydown)
6. 视觉验证双链路：DOM 实测为主；确需看图时 tab.screenshot() 存本地 → Read 自动上传 CDN → analyze_image(CDN URL) 判读（任务AB 验证成立）

## 下一步候选（V1.7）
- 任务 AA 增量是否入库 git（ai-chat-guide.json + build 脚本 + 此前 review/文档、repair×7、.bak×6）
- 设计稿剩余差异项（用户定）：mockup 的「09 预算与合规校验」独立菱形已并入 05；「10 是否接受清单？」已简化为 06+回环边——如需 1:1 还原可再拆
- 去黑话术语表是否推广到其他页（overall-flow/ai-service/service-faq 已人味化但有"意图识别/真值/置信度路由"类词）
- ai-recommend review 未选项：可选边 i5→r3/i2→fb/g5→st、bar2 泳道归属
- 5 条存量标签重叠 warn 治标评估；子模块演示页续建；overall-flow a1~a5/a7 补七问；analytics 埋点；contract-blueprint 过滤行处置确认

## 活跃文件
- src/components/{DetailPanel,RefModal,CompareSection,FlowCanvas,BlueprintCanvas}.tsx、src/pages/{HubHome,ScenarioPage}.tsx、src/lib/{refs,useScale}.ts、src/styles/theme.css
- src/components/flow/{LaneBand,NodeBox,EdgeLayer,FlowToolbar,MiniMap}.tsx、src/flow/tokens.ts（几何唯一源）
- scripts/auto-layout.ts（链式+ELK+choosePins+三级标签避障）、scripts/{validate.ts,rules.test.ts}、scripts/build-ai-chat-guide.ts（新建页范本）、repair-{ai-recommend,overall-flow,ai-service,service-faq}*.ts
- scenarios/（14 份）：overall-flow / data-governance / ai-data-platform / ai-search / **ai-chat-guide（新）** / ai-service / attr-extraction / contract-blueprint / capability-map / ai-recommend / cat-governance / data-desens / search-query / service-faq
- review/：rtm-ai-recommend-review-and-complete-fix.md、ai-recommend-humanized-copy-guide.md、rtm-ai-recommend-swimlane-fix.md、repair-*.ts
- knowledge/product/01-prd/搜索中台/AIP-024-028-AI对话导购.md（新页事实源，Frozen v1.0）
