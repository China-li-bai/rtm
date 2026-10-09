# worklog · scenario-demo-hub（场景演示平台）

## 2026-10-09（二段）

### 任务T：「AI 猜你喜欢」架构页复刻（排版+工作逻辑）
- **输入**：用户提供行业「AI 猜你喜欢」架构图，要求学习复刻其排版与工作逻辑
- **读图**：五层横向泳道（用户业务浅蓝/业务数据浅绿/推荐中台浅紫核心/数据治理浅橙/基础设施浅灰）；七步箭头轨（进入→上下文→召回→融合→过滤→排序→展示→反馈回流）；数据层四卡竖向供数；④智能排序橙底高亮；右侧策略管理齿轮；中台通栏条＋底部价值胶囊（合规·可解释·可追溯·持续优化）；行为数据虚线回流
- **落地 ai-recommend（platform 搜索，26 节点/19 边/画布 1360×969）**：
  - schema 泳道 tone 扩枚举 data(绿)/mid(紫) + CSS 两色——五层色带对齐原图
  - 主链 01-07 跨层推进（进入场景·取上下文→多路召回→融合去重→采购规则过滤→智能排序(hl)→推荐展示→反馈回流）＋08 推荐服务中台/09 价值主张双 bar
  - 列对齐复刻竖向供数：d1/d2→e1 召回、d3→e3 过滤、d4→e4 排序（grayDash 带标签）；治理层 g2→e3 权限红线、g4→bar1 调用审计；i3→bar1 模型服务（云端按次）
  - 回流闭环：r3→↺fb（dash）→e1 召回/st 策略；st→e4 策略下行（dash）
  - 内容锚点：S1 冷启动（类目代查/同侪/套餐三路兜底）、S2 推了买不了（目录权限/协议价/库存三道红线前置过滤）、S3 黑盒不敢采（推荐理由=信号贡献度+策略版本双出口）；C1 合规可审计、C2 漏斗式付费；价值胶囊四主张逐一点回画布位置
- **验证**：layout/validate 13 份 0 警告 ✓ / tsc ✓ / build 742.60KB（gzip 239.93KB）✓；浏览器实测 5 泳道色带/26 节点零重叠/highlight 在位，视觉终验「五层列对齐清晰实现、无重叠溢出压卡、主链一眼可循」（shots/ai-recommend-page.png）
- **完成**：2026-10-09 CST


## 2026-10-09

### 任务S：四大模块子模块演示页补齐（每中台一页旗舰范本）
- **输入**：用户「四大模块需列举多个子模块能力对应流程，类似属性抽取·场景融合演示」
- **协同发现**：scenarios/ 已有今晨新增的 capability-map「四大模块 · 子能力全景」（39 位/4 泳道/drill/社区对标）——它是能力清单半边（有什么），本次补的是流程演示半边（怎么跑），互补不重叠
- **新增四页**（全部 attr-extraction 同构：chain 布局+七问+3 场景 2 约束+compare+metricNote 三档口径+bizContext）：
  1. cat-governance 类目治理与自动化修复（商品）：底账→交叉扫描→抽样标尺(600/18.0% CI)→三执行器→五道安全阀→审核台→回流(IS-A 38.4→64.2)；约束=在售可售性优先(降级不撤挂)+按次收费三层漏斗
  2. search-query Query 理解与词库回流（搜索）：土话→纠错同义展开→Query DSL→双路召回→RRF/Reranker→前台→零结果分诊次日回流；约束=检索栈归搜索团队(C1 不建栈不双写)+词库可审计
  3. service-faq FAQ 强制一致应答（客服）：ADR-013 全套——11 流程路由/0.55 阈值原文直出/订单真值不生成/域外拒答不走 LLM/坐席辅助/知识 6 秒生效
  4. data-desens 脱敏网关与出域审计（数据）：ADR-014 配套——域内预检缓存→字段级令牌脱敏→LiteLLM 多 provider→还原映射→出域审计 fail-closed
- **工程**：链上节点显式 col 撑开横向（否则链式推导挤左侧）；loopchip 列号须在已有列内且宽度受右边界检查；清 scenarios.ts console.log 残留
- **红线拦截三连**（全部当轮修正）：compare「18.9 万」缺口径〔实测〕；data-desens C1 无环节认领（e3 补 solves）；service-faq S3 效果 2≠3（补第 3 条）；另 f3 七问回填（legacy/whyAi/humanRole/risks×2/fallback）
- **验证**：layout 12 份 ✓ / validate 12 份 0 警告 ✓ / tsc ✓ / rules.test 10/10 ✓ / build 710.56KB（gzip 228.64KB）✓；浏览器验收：首页分组 商品2/搜索2/客服2/数据3 卡，四页几何零重叠零溢出，七问抽屉全渲染，视觉终验达专业流程图可读性（shots/cat-governance-page.png）
- **完成**：2026-10-09 CST


## 2026-10-08（三段）

### 任务R：contract-blueprint 按 ADR-014 重述（用户拍板）
- **输入**：用户确认修改合同蓝图页（任务Q 挂起的待拍板项）
- **改动**：
  1. C1 约束全套→ADR-014 口径：name「数据不出域——脱敏后走云端」（与其余四页一致）；card 保留 SOW 双路径引用（「私有化部署或脱敏网关」）；decision 写前期纯云端+再评估三触发（账单 TCO 交叉点/强合规/UIE 蒸馏达标）；land 指向新节点名
  2. n23 节点「私有化大模型底座」→「模型网关 · 云端按次」（panelTitle=LiteLLM 模型网关（云端 API 调度），与 overall p1 同名同口径）；补 metrics（GLM/Qwen/OpenAI 已验证〔实测〕）与 trace（ADR-014 chip）
  3. n18/n19/n20 solves.how 去裸「私有化部署」：n18=按次调云端 API（经 LiteLLM+脱敏）；n19=向量库/图谱部署于内网（数据基础设施）；n20=中台在内网+模型经脱敏走云端
- **残留核查**：全文件「私有化」仅 4 处且全带限定语（SOW 双路径引用×1、后期再评估×3）
- **验证**：layout 重跑（ELK 模式文案变高需回写）✓ / validate 7 份 0 警告 ✓ / build 594.17KB ✓；浏览器下钻集成层→INT-2 抽屉含 ADR-014/LiteLLM/实测指标/追溯链（shots/contract-gateway-adr014.png）
- **完成**：2026-10-08 CST


## 2026-10-08（二段）

### 任务Q：「可幻觉」歧义文案修正 + 同类歧义/漂移全站清扫
- **输入**：用户指出「AI 可幻觉——必须可审计」有歧义（「可」会被读成“允许”而非“可能”），要求深度反思正确表达并全站排查同类
- **语言学修正**：「可＋中性能力词」（可审计/可解释）＝具备能力；「可＋贬义名词」（可幻觉）在中文里同样构词却暗示许可——风险表述应改用「有 X 风险 / 会 X / 可能 X」。定稿 **「AI 有幻觉风险——必须可审计」**（正文本就是「大模型会一本正经地编造」，只动名字）
- **同类清扫两处**：
  1. **C1 名实矛盾（比可幻觉更重）**：四总分页约束名仍写「数据不出域——私有化部署」，与正文 ADR-014 口径（前期纯云端）自相矛盾——任务M 只改了卡片正文漏了名字 → 改「数据不出域——脱敏后走云端」；ai-data-platform d05 solves.how「私有化部署，向量不出域」→「向量库部署于内网，向量不出域」（Milvus 已退役页的残留措辞）
  2. contract-blueprint **不动**：它是 SOW 合同蓝图视图（名/正文/节点一致且引 SOW，C1 卡自带「或脱敏网关」双路径），是否按 ADR-014 重述留用户拍板
- **改动面**：6 份 JSON 的 C3 name/fullTitle + 4 份的 C1 name/fullTitle + d05 how；validate 7 份 0 警告 ✓ / build 593.33KB ✓；浏览器目检约束卡三名与 C3 弹窗标题换新 ✓
- **完成**：2026-10-08 CST


## 2026-10-08

### 任务P：18% 错挂口径溯源 + 判例实例上墙
- **输入**：用户问「四年下来类目错挂约 18% 是怎么来的？历史订单数据最好给出简单易懂的实例」
- **溯源（事实链）**：18%＝scaffold 2026-08-28 商品挂载抽样实测——对约 18.9 万条原始挂载随机抽 600 条（seed=42，qwen3.7-plus），一遍中立提示词+检索 Top-5 举证（wrong 37% 过严）、二遍对 222 条 wrong 分级 → 明确错挂 108=18.0%（CI 15.1%~21.3%，宽松口径 81.5%），TCCC 分层交叉验证单调吻合（suspicious 31/31 错 / ok 层 10.6% / low_conf 47.6%）；¥1.22 亿＝历史订单 232,255 行 cat_level NULL（四年 ¥11.33 亿的 10.7%，集中 22-24）——**两个数字两个来源：18% 是挂载横断面、1.22 亿是订单累计**
- **修正**：g01.legacy 原「四年下来类目错挂约 18%」把两事实缝成一句 → 拆开改写；S1 弹窗 consequences 换成真实判例（游泳池→办公文具 / 广场舞音响→电脑音箱 / RVV→铜电线应护套线 / 漏保→微型断路器 / 兜底叶 16,198 条 8.6%），effects 逐条对应补齐第 4 条（红线校验拦截 3≠4 后修正）；S1.card 加判例钩子；metricNote 补完整推导（n=600/seed/两遍判卷/CI/TCCC 交叉/232,255 行）；overall.metricNote 加「详见数据治理页」指引
- **验证**：validate 7 份 0 警告 ✓ / rules.test 10/10 ✓ / build 593.28KB ✓；浏览器实测 S1 弹窗 4 判例、g01 抽屉新口径、页底推导全渲染（shots/data-gov-s1-examples.png）
- **完成**：2026-10-08 CST


## 2026-10-06（上午二段）

### 任务O：canvas 外全站审查（首页/导航/三段叙事/抽屉/弹窗）
- **输入**：用户「除了 canvas 的其余部分也需要审核」
- **审查面**：HubHome 场景中心 ｜ 吸顶导航+scrollspy ｜ hero 标题 ｜ 01 痛点/约束卡（whycards）｜ 03 前后对比区（cmp 四卡+口径说明）｜ DetailPanel 抽屉 ｜ RefModal 弹窗 ｜ 交互链（点节点→抽屉→点徽章→弹窗→Esc→遮罩）
- **DOM 实测全绿项**：首页 7 卡等宽同排底边全对齐、无内部裁切、可滚动（1440×900 scrollYMax=400）；场景卡 3 列/约束卡 2 列宽卡的有意混排、行内对齐、story 零截断；对比区四卡 371×265 完全等高、AI前/后零溢出；抽屉 560px 可滚、弹窗 z99 压抽屉 z91、遮罩点击关闭 ✓
- **真 bug 2 个（已修）**：
  1. **Esc 双层同关**：抽屉与 RefModal 各挂 document 级 keydown，同开时一次 Esc 两层全关，违背「单层关闭（仅最上层）」约定 → ScenarioPage 抽屉 handler 加 `if (modalRef) return;` 让位（deps 补 modalRef）；复测 both-open → Esc1 只关弹窗、Esc2 关抽屉 ✓
  2. **useScale 高度收拢亚像素裁切**：`scrollHeight（取整）×scale` 丢亚像素，缩放后放大成 4px，页尾「口径说明」被切 → 改 `getBoundingClientRect().height × s` 再 `ceil+2`；复测 note 底边余 1px ✓
- **误报裁决（视觉模型 3 条 vs DOM）**：首页「底部裁切+重复标题」→ scrollYMax=400 可滚、标题 innerText 仅 1 次，误报；「03 区不可见」→ fullPage 截图对 transform 页高度检测失灵（截图缺下半页），滚动定位+视口截图后四卡/说明完整；「箭头不居中」→ `.arr` 整宽块 text-align:center 字形居中，本人首版测量口径错（offsetParent 是网格容器）
- **内容缺口（非 UI 缺陷，不本轮修）**：overall a1~a7 抽屉无 risks/metrics/fallback（七问只回填了 b01-b08+trace）——已在 state 下一步候选
- **验证**：tsc ✓ / build 591.83KB ✓ / 交互链复测 ✓；截图留档 shots/{hubhome-audit, overall-compare-section, overall-drawer-b04, overall-refmodal}.png
- **完成**：2026-10-06 上午 CST

## 2026-10-06（上午）

### 任务N：overall-flow 浏览器 UI 审查 → 修复 + 组件化抽象
- **输入**：用户「使用浏览器审查 overall-flow 的 UI 布局/文案/模块间距与连线，算出合适边距，然后按组件化思维抽象」
- **审查方式**：主代理浏览器内核（本机 Browser Use 约束禁子代理）DOM 实测 + 视觉模型交叉验证——两处分歧（小地图存在性/标签遮挡）均以 DOM 相交为硬事实裁决
- **实测基线（修复前）**：节点零重叠、连线零穿框、文字零溢出、列距恒 40px——布局骨架本身健康；缺陷 4 处：
  1. **小地图遮内容**：盖住 p3「评测平台·三注册表」右端与飞轮条尾（世界 1360×781 vs 视口 1338×820，整体可见时小地图纯冗余）
  2. **「反哺」边标签压卡**：labelAt=[743,600] 与「同款归并」(758..875×519..609) 水平重叠 117px；根因=`labelAtForRoute` 回退分支（无 ≥标签宽水平段时取路线中点）**不做避障**，且 .lab 无底色、z3 与节点同级但 DOM 在前 → 被卡片盖住
  3. **泳道药丸过高过窄**：max-width 100px 内塞标题+note，高 80~109px，底座药丸(109)比泳道本体(103)还高
  4. **加载即整版灰化**：defaultSelected=a2 使其余 15 卡压暗到 18%，全景页第一印象像渲染故障；biz-ctx→画布间距 9px 偏紧
- **修复（不动列几何——扩标签带会挤死布线走廊，测算后放弃）**：
  1. 小地图**适配即隐**：`worldFits`（世界×zoom ≤ 视口）时不渲染；放大后回归、重置后再隐（浏览器实测两态 ✓）
  2. `labelAtForRoute` 三级重写：①水平段上/下滑动 ②**竖直段右/左贴线**（跨层竖边主位，反哺边落 [747,639] 泳道间隙）③全线路 8px 采样四向偏移取零重叠/最小碰撞兜底；.lab 加白底 halo + z4 + 渲染移到节点之后
  3. 泳道标签**标题/注释解耦**：药丸只放泳道名（26~43px），note 独立 `.lane-note-box`（118px 全带宽，10px 灰字）居中于药丸下方；配套修剪底座道注（去「支撑全部 AI 服务，数据不出域」尾巴）与召回道注（去箭头空格）
  4. **悬停=聚光灯、选中=描边+抽屉**：related 只看 hoverId 不看 selectedId，加载全景全彩（dimCount 0 实测）；biz-ctx 下边距 10→14（视觉 16）
- **组件化抽象**：
  - `src/flow/tokens.ts`：构建期+运行时唯一几何事实源（PAGE_WIDTH/标签带/泳道间距/DEFAULT_H/minimap/zoom），消灭 auto-layout↔FlowCanvas 的 DEFAULT_H 手工同步注释
  - `src/components/flow/`：FlowCanvas 473 行拆为 **LaneBand / NodeBox / EdgeLayer / FlowToolbar / MiniMap** 五组件 + 视口协调器（缩放/平移/手势/回中）
- **验证**：layout 7 份 ✓ / validate 7 份 0 警告 ✓ / tsc ✓ / rules.test 10/10 ✓ / build 591.78KB（gzip 188.10KB）✓；浏览器复测 nodeOverlaps/textOverflow/labHits/noteSpill 全空、minimapHits 空、bizCtxGap 16 ✓；视觉终验「可放心作为对外演示截图」（shots/overall-flow-uireview-final.png，另有 -fixed.png 修复中态）
- **踩坑**：标签带宽 118 扩至 150 的方案被测算否决——带右缘=布线窄通道左界，扩带即封走廊（列距跌破 40 红线）；`getByRole(button name=放大)` 定位超时改 evaluate 直驱；截图 activity capture 瞬时失败重试即过
- **完成**：2026-10-06 上午 CST

## 2026-10-06（凌晨二段）

### 任务M：前期不部署本地大模型——ADR-014 口径落地
- **输入**：用户定向「前期不要部署本地大模型、GPU 集群规模与 vLLM」
- **落地**（scaffold ADR-014 + 横向视图 + 演示平台 C1 三处同步）：
  1. scaffold `docs/DECISIONS.md` 追加 **ADR-014**：前期纯云端（LiteLLM 路由 GLM/Qwen/OpenAI，不采购 GPU/不部署 vLLM/不做私有化）；数据存储仍全内网（C1 约束的是数据不是算力）；再评估触发=账单交叉点/强合规/UIE 蒸馏达标
  2. 部署拓扑（算力区划掉改前期不部署，受控出口区=前期模型主通道）／可用性（出域 fail-closed 前期无本地兜底；新增云端模型多 provider 切换行）／NARRATIVE_SYNC（词汇表+触发清单第 6 条）
  3. 演示平台四页 C1 重写（overall/ai-data-platform/ai-search/ai-service）；overall p1 胶囊「私有化 GPU 集群」→「**模型网关 · 云端按次**」（LiteLLM 云端路由+多 provider 互备+后期选项口径）；底座道注改「模型网关（云端按次）」；d08/v04/s03 的私有化表述改「存储内网+调用走云端」
- **验证**：layout/validate 7 份 0 警告 ✓ / tsc ✓ / build 590.95KB ✓；浏览器实测 p1 胶囊抽屉含 ADR-014/LiteLLM 云端口径/指标行（实测锚点=GLM/Qwen/OpenAI 已验证）✓
- **完成**：2026-10-06 02:10 CST

## 2026-10-06

### 任务L：总架构完善①——口径同步到实现现状（PRD v4 / 检索栈重锚定 / ADR-013 / 类目树过渡态）
- **输入**：总架构评估结论「文档与实现已漂移」+ 用户「逐一完善」指令
- **口径刷新**（以 ai-platform-scaffold STATUS/PRD v4 为事实源）：
  1. 属性模板：三源自建（自举 694 叶）→ **五源参考模板对齐＋长尾继承**（6,495 叶 100% 覆盖〔实测〕，≥3 属性叶 84.2%）；自举转持续反哺（g02 全面改写 + C1.land）
  2. 检索栈：检索链归 AI 搜索团队（OpenSearch BM25+向量+RRF+Reranker），数据底座**不建检索栈不双写**、以 Query DSL 契约+25 核心属性 search_weight 导出交付（d04 改名「检索索引契约」；s03/s04/s05 同步）
  3. 向量：L1 全量重嵌 176,074 done〔实测〕；**Milvus 代码退役、collection 留档**（d05 改写，如实退役不为「资产感」保留）
  4. AI 兜底执行器谱系：qwen 按次现役 → UIE 蒸馏学生候选（切换=一致率+200 条基准）（g06）
  5. 类目树过渡态：保利树 7,141/6,495 叶（合同标的）vs 工作树 13,646/叶 11,796 四级对齐中（g01 如实标注双轨）
  6. 客服 ADR-013 固定业务流程：11 流程路由+域外固定拒答（floor=0.55 实测空带正中）不走 LLM（v03/v04）；工单方案 v2.0（v09）
- **overall 七问回填**：b01~b08 补 legacy/humanRole/fallback/metrics（总页业务节点与分页拉齐）
- **attr-extraction 迁链式布局**：5 泳道（供应商系统→商品中台流水线→AI 抽取·校验→运营人审→前台消费·反哺）+ chain n1→n8 + 反哺 chip row1；否分支 grayDash→dash（兜底语义图例对齐）；dataSupport 同步 v4 口径；viewH 790
- **验证**：layout 7 份 ✓ / validate 7 份 0 警告 ✓ / tsc ✓ / 测试 10/10 ✓ / build 589.16KB ✓；浏览器实测 attr 五道蛇形 + g02 五源新口径 sub 生效（shots/attr-chain-v2.png）
- **完成**：2026-10-06 01:30 CST

## 2026-10-05（深夜）

### 任务K：四段式完整性深检 → 七问闭环（人机分工/失败降级/环级验收/追溯链）
- **输入**：用户问「四段式完整吗？需要再深度思考了解一些知识」
- **框架对照检索**：Google PAIR 人机指南（automation↔augmentation 人机分工谱系 / graceful failure 专章 / 信任与可解释）＋ LLM 生产共识（护栏→降级链 缓存→小模型→规则/转人工 + 熔断 + fail-closed、少而准的人工闸门、分层评测防漂移）
- **差距结论**：四段式缺三段半——人机分工（人去哪了）、失败降级（混在 risks.guard 未独立）、环级验收（指标只在页级 metricNote）、RTM 追溯链（重构时遗失）
- **落地**：schema 新增 node.humanRole/fallback/metrics[{m,v}]/trace[string[]]；DetailPanel 渲染蓝底「人机分工」行、琥珀「出错时怎么办」条、「成效与验收」表（绿目标值）、灰 chips 追溯链；python dict-merge 回填 4 页 39 环节 + overall 11 节点追溯链（trace 数据对齐 model.yaml COMP/锚点）
- **验证**：layout/validate 7 份 0 警告/tsc/测试 10/10/build 582.68KB ✓；浏览器实测 g06 抽屉七问全渲染（3 chips/3 指标行/降级条文案完整，shots/seven-questions-drawer.png）
- **完成**：2026-10-05 23:59 CST

## 2026-10-05（晚）

### 任务J：总分建设——四系统专页（数据治理/AI数据中台/AI搜索/AI客服）+ 四段式内容模型
- **开始**：2026-10-05 21:40 CST
- **输入**：用户指令「按总分方式推进建设，写数据治理、AI数据中台、AI搜索、AI客服的流程和每个环节；写明以前怎么做、为什么用AI、怎么用AI、有哪些风险以及怎么避免；搜索方案补充细节」
- **行业检索**（四组）：商品数据治理（阿里类目域/类目-属性-属性值三位一体/标题治理流水线/MDM）｜数据中台（DAMA-DMBOK/OneData/元数据即基础设施/质量稽核）｜搜索（美团 Query 理解/级联漏斗召回-粗排-精排-重排/零结果改写）｜客服 RAG（低置信拒答转人工共识/知识库运营>模型选型/Agentic RAG 降幻觉/阿里 AI+人）
- **定稿**：
  1. schema 四段式：node.legacy（以前怎么做）/whyAi（为什么用AI）/risks[{risk,guard}]（风险与规避），DetailPanel 渲染灰底「以前」+橙底「为什么」+红绿「风险与规避」表；ai 字段语义细化为「AI 怎么做」
  2. platform 新增「数据」枚举（紫 #7c5cbf），HubHome 出现「数据治理与 AI 数据中台」分组（两页）
  3. 四个新场景页（全部链式布局 + bizContext 红线）：
     - data-governance（数据）：立基准（类目树/属性模板/标准字典）→ 治数据（挂载/标题/抽取/品牌）→ 守质量（校验/同款/入池），10 环节
     - ai-data-platform（数据）：接入→主数据正源→质量三注册表→四资产（索引/向量/图谱/评测集）→安全→飞轮，9 环节
     - ai-search（搜索）：Query理解/补全纠错→双路召回/级联排序→三面筛选/类目推荐/零结果兜底/对话导购/猜你喜欢→词库回流，10 环节
     - ai-service（客服）：双通道接入/意图→FAQ/RAG/订单查询→置信路由/转人工摘要/坐席辅助/工单→知识运营与风控，10 环节
- **完成**：2026-10-05 23:10 CST
- **进度**：100%

#### 踩坑备忘
- bar 与非 bar 同泳道同行 fail-loud（f09 需 row:1 独占行）；loopchip 不撑列宽但仍受右边界检查（s10/v10 w170→140）
- layout 中途失败会让后续文件拿不到坐标 → validate 报 x/y undefined——先修布局错误再重跑
- risks 数组误留空对象 `{ref,how}` 会被 zod min(1) 拦——手写长 JSON 收尾要检查
- svg.arrows path 计数含 2 个 marker 定义——断言边数要减 2
## 2026-10-05（下午）

### 任务I：全景二次重构——「业务在前、AI 在后」从 0 到 1 业务全景 + 上级业务红线
- **开始**：2026-10-05 20:00 CST
- **输入**：用户反馈「属性抽取·场景融合没有完整展示服务的上级业务是搜索；这份 AI 业务全景没法让人一眼看清；需要搜索一个从 0 到 1 如何通过 AI 搭建含 AI 功能商城的完整业务流程」
- **行业检索**（六组，锚点齐）：通用电商链路（开店→发布商品→交易→履约→售后，腾讯万字拆解/人人都是产品经理）｜B2B P2P（寻源→询比价→PO→收货→三单匹配→对账→结算，SAP GR-Based IV/Odoo/知乎三向匹配）｜**Amazon AutoKnow**（KDD 2020，taxonomy 构建+属性发现抽取——属性治理的行业标杆）｜阿里京东中台（大中台小前台/言犀/京小智）｜Shopify Magic/AI 搜索发现层｜AI 导购客服（AI 店小蜜 AI+人、京东「搜索-比价-看规格-下单」AI 化、淘宝 AI 万能搜）
- **定稿方案**：
  1. **业务在前、AI 在后**：泳道改「业务三段（供给侧/需求侧/履约与服务）+ AI 服务层 + 数据底座」——业务主线八步 01~08 阶梯式穿三条业务泳道，AI 服务层 7 个节点一行排在业务下方，**灰虚线（grayDash，图例改「服务·支撑」）向上指向各自服务的上级业务**
  2. **上级业务红线**：schema 新增 flow.bizContext——每个 AI 流程页必须答得出「服务于哪条上级业务」，渲染为画布上方蓝色定向条；attr-extraction 页补「挂在 02 治理上架 → 价值兑现于 04 搜索发现/05 比价决策」，收口 bar 改名「标准属性入库 → 上级业务：搜索发现·比价决策」
  3. **「属性抽取的上级业务是搜索」显性化**：a2 属性治理·抽取（highlight，位于 04 搜索发现正下方）→ 灰虚线竖直向上入 b04，带标签「标准筛选属性」——用户反馈的核心诉求落为一条可见的线
  4. **业务蓝图事实源**：knowledge/product/AI商城从0到1业务蓝图.md（对标表+八步主线+AI 服务映射表）
- **完成**：2026-10-05 21:10 CST
- **进度**：100%

#### 落地内容
1. schema：flow.bizContext（上级业务上下文，受限富文本）；ScenarioPage 渲染 .biz-ctx 蓝条；FlowCanvas 图例 grayDash 改「服务·支撑」
2. auto-layout：loopchip 不再撑列宽（底座 pills 以注释件看待，列内居中、允许向间隙少量外溢）——修复 pills 把 8 列间距挤到 31px<40 的 fail
3. overall-flow.json v3：19 节点（业务 b01~b08 + AI a1~a7 + 飞轮 f1 + pills p1~p3）/ 15 边（7 主链 main + 7 服务 grayDash + 1 反哺 dash）/ 5 泳道，画布 1360×781；业务节点 panelAip 挂业务域（SUP/OP/SHOP），AI 节点挂 AIP/AICS；内容带行业对标锚点（AutoKnow/三单匹配/AI 店小蜜/P2P）
4. attr-extraction.json：bizContext + subtitle + n8 bar 改名
5. 追溯矩阵 L3 口径二次同步（b/a/f/p 新编号体系 + 业务层/AI 层双向自检分组）

#### 验证链（全绿）
- layout ✓（19 节点/15 边/5 道 1360×781；contract-blueprint 24/33/2167 无回归）｜ validate 3 份 0 警告 ✓ ｜ tsc ✓ ｜ rules.test 10/10 ✓ ｜ build 457.10KB ✓
- 浏览器实测：业务八步阶梯可读、AI 层 7 节点一行、服务灰虚线清晰不穿节点、「标准筛选属性」标签显眼、「反哺」标签干净、泳道注可读、biz-ctx 条渲染（overall + attr 两页）；attr 页 9 节点无回归（shots/biz-first-v3.png）

#### 踩坑备忘
- **loopchip 撑列宽**：链式布局 colWidths 原先取列内最宽节点，pills（w130~150）把业务列撑宽导致 8 列间距 31px < GRID_GAP 40 fail——loopchip 改为不参与列宽（垂直走线走列中心，pills 向间隙外溢无碰撞）
- **视觉模型复核结论截断**：analyze_image 长 checklist 回答会被截断，关键边（a2→b04 标签、反哺线、a3 绕行）拆成聚焦小问题二次复核全部通过

## 2026-10-05

### 任务H：全景泳道重构——业务主体六道 + RTM 十环节链式布局
- **开始**：2026-10-05 15:10 CST
- **输入**：用户反馈「呈现效果和属性抽取·场景融合交互图差太多；业务没理清楚，不同业务没有拆解入口和出口；UI 混乱，模块间距和连线要用浏览器看清并算出合适边距」+ 参考文档 `ai-platform-scaffold/docs/product/architecture/RTM-架构缩放图.html`（业务知识与实图布局）
- **问题诊断**（浏览器几何实测）：
  - 业务理不清根因：泳道=架构四层 → 三条业务（商品治理/搜索/客服）全部挤进「AI 能力层」一条带，01~14 流水账编号不对应任何权威口径，入口/出口无标识
  - UI 混乱根因：ELK 每泳道独立布局 → 15 节点全部落在 x=130~690 左侧两列窄带（画布 1360 宽只用一半，右侧 670px 空白）；AI 能力层 483px 塞 9 节点三行贴边；3 条 infra grayDash 长飞线（965→575、1081→761 纵穿半幅画布）
- **定稿方案**（对齐 RTM-泳道全景权威口径）：
  1. **泳道换轴**：架构四层 → 业务主体六道（供应商侧[业务入口]/AI 商品中台[把货变标准]/AI 搜索中台[让人找到货]/采购·交易[业务出口]/AI 客服中台[服务出口]/数据底座[支撑+飞轮]）；架构四层视图由 contract-blueprint 页继续承载，双页职责分离
  2. **主链=RTM 十环节 01~10**：01 推品接入→02 图文审核→03 治理流水线→04 标准商品池→05 语义检索→06 对话导购·推荐→07 下单交易·集采合规→08 智能体接待→09 转人工·工单→10 数据回流飞轮；infra 三节点降为底座道 pills（p1 GPU 集群/p2 云端网关·脱敏/p3 评测平台）
  3. **链式布局规则**（auto-layout 新模式）：flow.chain 声明主链 → 列=链位（跨泳道保持同列→竖向衔接天然对齐，同泳道 +1），非主链节点显式 col，泳道内 row 分行；确定性推导、零手工坐标
  4. **连线瘦身**：15 边 → 11 边全短边（8 主链 + 3 飞轮 dash：05→10/09→10 收集 + 10→03 反哺「词库·模板·阈值」），全部走空列走廊，零交叉零飞线
- **完成**：2026-10-05 17:40 CST
- **进度**：100%

#### 落地内容
1. **schema 扩展**：flow.chain（链式布局主链）/flow.viewH（视口高）/node.col/node.row（链式网格）/lane.note（泳道角色注——入口出口的显性载体）/lane.tone（biz/ai/base 三色分区）
2. **auto-layout.ts 双模式**：chainColumns（列推导+显式覆盖+同 lane+col+row 碰撞 fail-loud+列间距均摊≥GRID_GAP 校验）→ chainLaneGrid（行带垂直居中/列内水平居中/bar 全宽占行）→ CHAIN_* 紧凑堆叠常量（16/10/26/10 vs ELK 模式 28/14/40）；ELK 分支零改动（contract-blueprint 无回归）
3. **FlowCanvas**：lane tone class + note 渲染；图例按场景实际边型过滤（无 grayDash 边不再显示空开关）；viewH 消费（prop > flow.viewH > 620）
4. **overall-flow.json 重写**：六道十环节 + 13 节点（10 主链 + 3 pills）+ 11 边；节点内容融合 RTM 泳道全景四段式（场景/AI 做了什么/怎么解决+技术锚点/前后对比）与实测口径（189,211 在管/94.9% 挂载/176,074 标题/0.911 FAQ 命中等）；constraints.land 同步新环节号
5. **知识库同步**：商城AI需求追溯矩阵.md L3 口径全面换 n01~n10+p1~p3（矩阵 A/B/C、约束表、双向自检）
- **画布产物**：1360×829（旧 1315 但左半空置），满宽利用，节点等高 90px，最小水平间隙 72px

#### 验证链（全绿）
- `npm run layout` ✓（overall 13 节点/11 边/六道 1360×829；contract-blueprint 24/33/2167 无回归）｜ `npx tsc --noEmit` ✓ ｜ `npm run validate` 3 份 ✓ 0 警告 ｜ `rules.test.ts` 10/10 ✓ ｜ `npm run build` 448.81KB ✓
- 浏览器目检（agent-browser + 视觉模型两轮）：六道蛇形主链连贯、竖直短箭头、飞轮三支一环走空列零穿越、底部横条+三胶囊整齐、节点文字无溢出、左侧标签带无遮挡、小地图/数据支撑/工具栏不压内容 ✓（shots/chain-flow-v2.png）
- 交互：点 03 治理流水线 → 右抽屉四段式（3 张解决卡+panelAip 域编号）✓；attr-extraction 回归 9 节点/4 泳道/11 边/图例 3 项 ✓

#### 踩坑备忘
- **〔设计目标〕不是口径词**：rules CALIBER_WORDS 只有 示意/约/≈/基线/SOW/实测/示例——「下降 60% 以上〔设计目标〕」被红线 5 拦截，改成「示意下降 60% 以上」过
- **layout 脚本回写后 Edit 冲突**：npm run layout 会重写 scenarios/*.json（回写坐标），改文案必须重读文件再 Edit
- **IAB 标签页跨 JS 调用丢失**：tabs.list() 两次调用间可能返回空（会话释放），浏览器操作一律「单次调用内完成 导航+操作+测量/截图」的自包含模式
- **AI 视觉复核结论自相矛盾风险**：距离/间距类结论以 DOM offsetLeft/offsetTop 实测为准（本次最小间隙 72px 为实测值），截图视觉复核只判「遮挡/溢出/穿越」类二值问题

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

---

## 任务 P｜方案 v2.0 逻辑文案修订 + 范围边界与口径三方同步（2026-10-08 16:00–16:45 CST，100%）

**任务描述**：通读《AI专项方案v2.docx》做逻辑/文案审核；按用户决策「不用 AI 做任何对账能力」，把范围边界与编号口径同步到方案文档、演示场景配置、RTM 三处。

### 关键结论（反思纠偏）
- **上一轮误判已纠正**：曾判「方案文档编号要改」，实为 **RTM 编号归属有误**。三方一致证据锁定口径：SOW 合同功能清单 + `product/00-功能点总索引.md` + docx 4.2/5.2/6.2 → **AIP-001–014 商品 / AIP-015–031 搜索 / AICS-001–029 客服**；SOW 第 1455 行实证明 `AIP-020 = 属性聚合筛选（搜索）`，与「对账核对」无关。
- **权威 SSoT 从未登记 AI 对账能力**（`architecture/model.yaml` 只有 COMP-01 的「导入批次对账 fail-loud」= 数据完整性校验，正当保留）。故本次不是砍能力，是**清除偏离 SSoT 的口径污染**。
- 合同实测新发现两处硬伤：① docx 把「坐席辅助（实时话术推荐）」写成承诺链（9 处），而 **SOW 中该词出现 0 次**，PRD 卡 AICS-010-015 **非目标 N3 明写「不做 AI 话术推荐」** → 已全部降级为远期方向；② 生鲜预占规则在商品/搜索两台中台重复定义且域错位（属交易/库存域）→ 已改为「唯一定义 + 只读引用」。

### 交付
- **docx 五批修订**（run 级精确替换，不合并 run/不动样式，每条带期望命中数断言）：
  A 文本级（图号连续/§ 清零/小标题体例/AICS-008 重号/评测集「自动化标注」→「ML 预标注并经人工交叉复核」10 处/安全表述自洽）
  B 跨章矛盾（数据闭环越权表述/客服硬规则前置/60% 补口径/比价断链缝合/7.1 表补 17 行功能编号）
  C 结构性新增（**1.5 建设范围边界**/2.4 底座职责边界/2.5 部署口径对齐 ADR-014/8.2 评测集版本冻结/9.1 补 AI 算法工程角色）
  D 模块边界（预占规则去重/跨中台资产归数据中台/「可比性」去模糊/9.3 新增「范围蔓延」风险行）
  E 合同口径（1.5 补 SOW 锚点 + 第四条边界「清单外能力不承诺」+ 坐席辅助 9 处降级 + 指标标远期）
  → 461 段/8 表/9 图完整，无重复书签（目录域安全），`updateFields=true` 使 Word 打开即刷新目录，zip + textutil 双解析通过
- **场景配置**：`overall-flow.json` a6 由 AI 服务节点（原误挂 AIP-020）降级为 **dashed 边界说明牌**、删 a6→b07 灰虚线边、b07 措辞去 AI 化；`ai-service.json` v02 钉死「对账开票只答政策与进度，不做金额核对」。脚本 `scripts/sync_scope_boundary.py` 幂等可重跑。
- **RTM 重写**：编号归属纠偏、对账/OCR/坐席辅助/经营自动决策四项**显式排除表**（含排除依据与演示落点）、AI 语义类保留项钉死、双向追溯自检与待补基线同步。

### 关键问题与解决
- **非 AI 节点不能挂 beforeAfter**：详情面板表头固定为「使用 AI 前 / 使用 AI 后」，系统改造收益放进该列即自打脸。→ a6/b07 的 beforeAfter 清空，收益统一走 metrics。**已写入 state.md 约定**。此问题只有 DOM 实测才能暴露，文案审查看不见。
- 命中数断言两次救场：① 「自动化标注」漏算表格内实例（8→10）；② 「坐席效率提升」正文+指标表各 1 处（1→2）。均 abort 未落盘，无半改状态。
- 复用 React race 老坑：同步 click 后立刻读 drawer 得空 → 必须 `await sleep(450)`（worklog 首条交付已记过，本次再现，升级为关键约定）。
- docx 新增段落必须剔除 deepcopy 带来的 `_Toc` 书签，否则书签 ID 重复破坏目录跳转。

---

## 任务 Q｜把「边界即交付」做成平台能力（2026-10-08 16:45–17:10 CST，100%）

**任务描述**：用户认可「边界即交付」的演示叙事建议，要求按此继续完善。落点不是再改一句文案，而是把「刻意不做」升级为画布的一等公民表达。

### 关键洞察
`kind: "dashed"` 在 UI 惯例里等于**占位 / 待补 / 未实现**——用它表达「刻意不做」，语义正好相反，领导扫一眼会读成"这块还没做"。因此必须新增形态，而不是复用。

### 交付
- **新增第七形态 `kind: "boundary"`**，四处同步：`schema/scenario.ts`（枚举 + 注释钉死 dashed/boundary 语义对立）→ `flow/tokens.ts`（`NODE_DEFAULT_H` 是 `Record<kind,number>`，缺 key 必然 tsc 报错，类型即护栏）→ `NodeBox.tsx`（kindCls 分发 + 注释六态改七态）→ `theme.css`（`.node.bnd`）→ `MiniMap.tsx`（缩略图灰底）。
- **视觉四重信号**：斜纹底（借工程图「保留区」惯例，财务与工程背景的人都认）＋ 深灰**实线**（确定不移，区别于虚线）＋ `⊘` 前缀 ＋ **角标位写「非 AI 域」**——与相邻节点 `AIP-xxx` 同位同形，构成"有位置、无编号"的对照，这是最强的一处信号。
- **抽屉反面论证**：补 `risks` 三条并各配 guard——组织压力型（"也挂个 AI 显得智能"→ 用可审计性替代 AI 标签）、风险后果型（幻觉进财务链路 → AI 零调用）、未来回潮型（OCR 变便宜后重提 → 须先补 SOW 功能点）。答不出"硬用 AI 会怎样"就不算真正的边界决策。
- **页级叙事**：`subtitle` 与 `metricNote` 同步提及 ⊘ 斜纹位，不看节点也能接收到；顺带修掉 subtitle 里「AI 服务层**每个**能力向上服务上级业务」的绝对化表述（a6 无连线，与之自相矛盾）。
- **规范沉淀**：`knowledge/frontend/边界声明位的表达规范.md`——三种错误做法对照、视觉四信号、文案三段式（盒内/抽屉/页级）、四条红线、DOM 验证四件套。后续新增边界位零代码改动。

### 关键问题与解决
- **CSS 特异性抢样式**：`.node.bnd` 与 `.node.sel` 同为两类选择器，后声明者胜 → 直接写会让选中态变不回橙色。全部背景/描边收进 `:not(.sel)`，实测选中后 `bg=rgb(255,247,243)`、`border=accent 2px` 正常。
- **伪元素查错对象**：`getComputedStyle(box,'::before')` 返回 `none` 一度被误判为"⊘ 没生效"，实际定义在 `.tt::before` 上——改查 `.tt` 得 `"⊘"`。截图与 DOM 必须双轨验证。
- **脚本幂等性**：`metricNote` 是追加式改写，重跑会重复拼接 → 加 `if "⊘ 斜纹位" not in ...` 守卫。
- 几何零手工干预：`predictNodeH` 对未知 kind 走通用内容预测，加 `aip` 角标后 `has-aip` 自动预留 padding，实测 a6 高 53px vs 邻居 a5 54px，视觉协调、`scrollHeight-clientHeight=0` 无截断。

---

## 任务 R｜四大模块子能力全景补全（社区对标版）（2026-10-08 17:15–17:40 CST，100%）

**任务描述**：用户指令「先不要理睬 SOW，按社区方案把所有大模块子能力模块补充完整」。SOW 是合同承诺边界，不是能力设计边界——本次按 2026 社区成熟实践重切四大模块的能力地图。

### 关键设计决策
- **新增能力严禁沿用 AIP/AICS 编号**，另立 `CAP-{G|S|C|D}-nn` 体系。理由：上一轮刚清理过「坐席辅助不在清单却写成承诺」的事故，能力地图若与合同编号混用，等于自己制造下一次口径污染。文档第一节即立此规矩。
- 每个能力位强制做 **「AI 位判定」**（是否命中 1.5 四条边界）——保证新地图与已定边界不冲突，而不是又长出一堆该被砍的能力。
- 尊重项目既有纪律：底座「不建检索栈、向量按需启用」，不借补全之名复活已退役组件。

### 社区调研结论（两次联网实测，2026-10 时点）
- **Agentic Commerce 已协议化**：OpenAI ACP（2025-09，Instant Checkout 后撤回）、Google **UCP**（2026-01，Shopify 联合开发，2026-04 Amazon/Meta/Microsoft/Salesforce/Stripe 入技术委员会）、支付宝 **ACT**。→ 派生出商品侧全新维度 **CAP-G-09 AI 可读性治理（AEO/GEO）**：商品数据不可被机器可靠读取 = 直接被排除在 AI 候选集之外，是"治理做好了"的新验收标准。
- **LLM 评测/可观测合流**：社区定论是「观测平台（Langfuse/Phoenix/Opik）+ CI 评测框架（DeepEval/promptfoo）组合，别选全家桶」；**OTel GenAI 语义约定正成标准**；Ragas 仍是 RAG 指标事实标准但更新放缓；OpenAI Evals 事实停滞。
- 最有价值的一句：**「工具都差不多，真正的分水岭是有没有人持续维护 goldens 数据集」**——与上一轮给方案补的「评测集版本冻结」原则互相印证。
- 2B 采购特有增量：**任务式采购**（一句话生成整套清单）与**图纸/BOM 找料**——Criteo 报告称「从检索单品转向解决整体需求」，演示页 b04 早已写"图纸"却无对应能力位。

### 交付
`knowledge/product/四大模块子能力全景-社区对标版.md`——四大模块按能力对象重切为 **39 个能力位**（商品 9 / 搜索 8 / 客服 11 / 底座 11），每行含「关键能力点 · 社区对标 · 现状 · AI 位判定」；缺口优先级 P0~P3；使用约束四条。

**结构性发现（三处）**：
1. 商品中台原 4 子能力里「AI 商品智能体」独占 8 点——它是**流程环节而非能力域**，社区做法按能力对象切，故重切为 9 类。
2. 搜索中台原 3 子能力实为**三个入口**，缺「检索技术栈」与「运营闭环」两条能力线。
3. `data-governance`（g01–g10 全挂 AIP）**不是第四域，是商品中台下钻视图**；真第四域是 `ai-data-platform`。且第四域存在三套互不对齐口径（SOW 0 项 / AIF 4 项 / 演示页 6 域），本文件收敛。

**P0 缺口两处**：CAP-D-11 成本与可观测（方案通篇讲"成本可控"却无任何度量，约束 C2 实为口号）、CAP-C-06 工单线 + C-07 智能质检（社区标配，2B 运营最易被击穿）。

### 关键问题与解决
- **自己犯了刚批评过的错误两次**：① 客服节写"补全为 10 个"实列 11 项；② 缺口写"🔵7 / 🟡10"，脚本核出实为 🔵8 / 🟡17 / ✅14。均已修正，并把「数字必须脚本核数」写入流程——凡文档内成文计数，一律由脚本反查。
- **统计脚本自身也有 bug**：初版用 `startswith("| CAP-")` 漏掉全部加粗行（`| **CAP-`），而漏掉的恰好是 7 个缺失项，导致统计严重失真。修正正则后 39/39 自洽。教训：核对脚本本身要被核对。
- CAP-D-09 标记混用（✅+🔵）致归类失真——主体已覆盖仅缺 OTel trace，应归 🟡；已改并规定「一行只允许一个主状态标记」。

---

## 任务 S｜子能力全景图进演示平台（2026-10-09 09:20–09:50 CST，100%）

**任务描述**：把任务 R 的 39 个能力位做成一张全景图进演示平台。

### 关键选型：复用 drill 双态，而不是新造渲染器
调研发现 `flow.drill` 会切到 `BlueprintCanvas`，其 L1 就是「泳道 × pill 横排、零飞线」的总索引态，L2 是单泳道下钻——**天然适合能力矩阵**，无需新增布局形态。且 pill 会渲染 `n.aip`，状态标记可直接落在角标位。

几何核算（先算后做，避免撞 fail-loud）：`PAGE_WIDTH=1360` 同时是 useScale 基准不可加宽 → 可用宽 1218、`GRID_GAP=40`、w=117 → 每行上限约 7~8 列；而 L1 的 pill 走 CSS flex-wrap 不吃 x/y 坐标，39 位安全。

### 交付
- `scenarios/capability-map.json`（39 节点 / 4 泳道 / 0 边，画布 1360×1792），platform 归「全景」组。
- **生成器 `scripts/gen_capability_map.py`**：从《四大模块子能力全景-社区对标版.md》1:1 解析生成，**文档是唯一事实源**，手改 JSON 会被下次生成覆盖（已在 dataSupport 里写明）。带 39 位数量断言，文档结构变动即 abort。
- 状态可视化：`aip` 角标承载三态（✅ 合同 / 🟡 部分 / 🔵 缺失），`kind:"highlight"` 让 8 个完全缺失位橙底同权重呈现——**缺口不藏**。
- 口径隔离三处声明：indexTitle、dataSupport 图例、每节点 panelAip 均写「CAP-* 规划视图 · 非合同承诺」；metricNote 声明不作验收依据。
- 三个场景（S1 地图不完整 / S2 缺口不可见 / S3 编号与承诺混用）+ 两个约束（C1 规划不进承诺 / C2 先过 AI 位判定）；缺失位挂 C1（最易被误当承诺的正是它们），规则/工程为主的位挂 C2。
- 组件增强：`flow.indexTitle` 可选字段（缺省仍为「合同业务闭环 · 主链」，向后兼容），消除 BlueprintCanvas 里的硬编码标题。

### 关键问题与解决
- **fail-loud 连拦三次**：① `compare` 必填 min(1) 未写；② 约束 C1「无解场景/约束：没有任何环节解决它」；③ 生成器路径以 cwd 为基准导致 FileNotFoundError。逐一修正，未产生半成品配置。
- **生成器里发现无效分支**（`x if c else x` 两返回值相同）与**编号重复显示**（DetailPanel 会把 `no` 拼在 `panelTitle` 前 → 出现「C-07 CAP-C-07 …」）：均已修，实测标题为 `C-07 智能质检与合规`。
- **验证方法踩坑**：用 `location.hash` 切换页面**不会重新加载 JS bundle**，导致修完 panelTitle 后仍读到旧值，一度误判修复无效——必须换 URL（加 `?v=`）或 reload 才吃到新 dist。
- **首次进入 drill 页 evaluate 拿到全 0**：React 挂载竞态，等待 900ms 后正常；与任务 P/Q 记录的「click 与断言之间必须 wait」同源。
- **DOM 实测结果**：pillTotal=39、highlight=8、四泳道 9/8/11/11、laneOverflow=[0,0,0,0]、docOverflowX=0、L2 下钻与返回正常、抽屉三块（AI 位判定/社区对标/现状）齐全、solveBadges=3。首页 7 个场景 · 106 个环节（原 67）。

### 未擅自处理（需用户确认）
`src/lib/scenarios.ts` 存在一条**非本次改动**的过滤 `item.id !== "contract-blueprint"`（内含 `console.log({item})`），导致合同蓝图页运行时提示「场景不存在」、首页少一组卡片。因属用户有意的临时屏蔽，**未擅自删除**；也因此无法对 contract-blueprint 做运行时回归——改以「zod 校验 8 份全过 + 共用同一渲染组件 + indexTitle 缺省兼容」三重保证向后兼容。
