# state · scenario-demo-hub

> 快照时间：2026-10-08 CST（第六段）｜ **任务R：四大模块子能力全景补全**（39 个能力位，CAP-* 体系，社区对标 2026）｜ 上一段任务Q：边界叙事产品化——新增 `kind: "boundary"` 第七形态（斜纹＋⊘＋「非 AI 域」角标），把「刻意不做」做成画布一等公民｜ 上一段任务P：范围边界与口径三方同步（docx 六批修订 + a6 降级 + RTM 编号纠偏）｜ ADR-014：前期不部署本地大模型/GPU/vLLM——纯云端（LiteLLM）+脱敏网关，数据存储仍全内网

## 当前状态
- **子能力全景（任务R）**：`knowledge/product/四大模块子能力全景-社区对标版.md`——商品9/搜索8/客服11/底座11=39 能力位，✅14 🟡17 🔵8；新增能力一律用 `CAP-{G|S|C|D}-nn`，**严禁占用 AIP/AICS 合同编号位**；每格强制做「AI 位判定」对齐 1.5 边界。P0 缺口=CAP-D-11 成本可观测、CAP-C-06 工单、CAP-C-07 质检
- 构建：`npm run build` → dist/index.html 596.43KB（gzip 190.35KB），file:// 双击即开
- **边界声明位（任务Q）**：a6 用 `kind:"boundary"`——斜纹底借工程图「保留区」惯例 + 深灰**实线**（与 dashed「待补占位」语义相反）+ ⊘ 前缀 + 角标位写「非 AI 域」与相邻 AIP-xxx 同位对照；抽屉补 `risks` 三条反面论证（组织压力/风险后果/未来回潮）；subtitle 与 metricNote 同步提及——不看节点也能接收到。规范见 knowledge/frontend/边界声明位的表达规范.md
- **范围边界口径（2026-10-08 定稿，方案 1.5）**：AI 只承担规则无法全量覆盖的语义与判断类工作。**对账/三单匹配/金额校验/单据 OCR 不做 AI**（SOW 已把「对账计算」列为平台辅助功能，属商城系统升级范围）；**清单外能力不作承诺**（坐席辅助/实时话术推荐——SOW 中 0 次，PRD 卡 AICS-010-015 非目标 N3 明写不做）
- **编号口径唯一事实源**：AIP-001–014 商品 ｜ AIP-015–031 搜索 ｜ AICS-001–029 客服（SOW 合同 + `knowledge/product/product/00-功能点总索引.md` + 方案 4.2/5.2/6.2 三方一致；SOW L1455 实证 AIP-020=属性聚合筛选）；旧版 RTM 的归属有误已纠偏
- **任务O（canvas 外审查）全绿项**：首页 7 卡对齐无裁切可滚动；场景卡 3 列/约束卡 2 列混排对齐、story 零截断；对比区四卡等高零溢出；抽屉 560px/弹窗 920px z 序正确、遮罩关闭 ✓；修 2 bug：**Esc 双层同关**（抽屉 handler 让位 modalRef）与 **useScale 高度收拢亚像素裁切**（rect.height×s + ceil+2，页尾口径说明不再被切）
- **任务N（canvas 审查）**：小地图适配即隐；反哺标签三级避障；泳道标签标题/注释解耦；悬停=聚光灯/选中=描边（加载不再整版灰）；biz-ctx 间距 14
- **模型部署口径（ADR-014）**：前期纯云端（LiteLLM→GLM/Qwen/OpenAI）；C1=数据不出域而非算力私有化
- **口径同步机制**：ai-platform-scaffold `docs/architecture/NARRATIVE_SYNC.md`（STATUS=实现事实唯一源）
- 校验：layout ✓ 7 份 ｜ validate ✓ 7 份 0 警告 ｜ tsc ✓ ｜ rules.test 10/10 ✓ ｜ 构建 DOM 实测：a6 为唯一 boundary 节点、borderStyle=solid＋repeating-linear-gradient、`.tt::before`=⊘、角标与 AIP 同位（±1px 取整噪声）、零溢出、选中态正常回橙、无入出边
- 场景配置 7 份（6 链式 + contract-blueprint ELK）

## 画布组件体系（任务N 定稿）
- `src/flow/tokens.ts`：构建期+运行时唯一几何事实源（PAGE_WIDTH/LABEL_BAND=118/泳道间距/GRID_GAP/DEFAULT_H/MINIMAP/zoom）——改值必须重跑 `npm run layout`
- `src/components/flow/`：LaneBand / NodeBox / EdgeLayer（标签 z4 halo 渲染在节点后）/ FlowToolbar / MiniMap（按需显隐）；FlowCanvas 只剩视口协调
- 泳道标签：药丸=泳道名；note=`.lane-note-box` 整带宽 118px 置药丸下方——勿再塞药丸；标签带不可加宽（右缘=布线窄通道左界）
- 节点七态：normal / highlight / **dashed（待补占位）** / **boundary（刻意不做，任务Q 新增）** / diamond / bar / loopchip——dashed 与 boundary 语义相反不可混用；新增边界位只需配 `kind:"boundary"`，五处代码已就绪（schema 枚举/NODE_DEFAULT_H/NodeBox/theme.css/MiniMap），`predictNodeH` 对未知 kind 走通用内容预测路径

## 关键约定（改动前必读）
1. 链式布局：flow.chain（列=链位，跨泳道同列、同泳道+1，col 可覆盖）+ 非主链显式 col + row 分行；bar 独占行；loopchip 不撑列宽但受右边界检查
2. 泳道 tone（biz/ai/base）；lane.note 走注释框渲染
3. 编号口径：业务页 01~N 主链编号；AI 服务节点无编号用 aip 角标；域级编号写 panelAip
4. 口径红线：数字+量词必须口径词（示意/约/≈/基线/SOW/实测/示例）或 approx——〔设计目标〕不是口径词
5. 零安装红线：构建期工具走 devDependency；hash 路由；单文件体积盯紧
6. fixed/sticky 放 scale-outer；scrollspy 触底双保险；三级文案模型；画布/面板文案分离（w117 节点 sub 每段 ≤8 字）
7. 节点>15 或跨层边多 → drill 模式；视口画布 overflow:clip + scrollTop=0 双保险
8. **Esc 单层关闭**：抽屉 handler 必须让位 RefModal（modalRef 开时 return）；**useScale 高度收拢用 rect.height×s+ceil+2**（勿回退 scrollHeight）
9. 自动化点击防顶栏遮挡；截图瞬时失败重试；AI 视觉结论必须 DOM 实测交叉验证（fullPage 截图对 transform 页高度检测失灵——下半页会丢，改滚动定位+视口截图；箭头居中看字形勿看盒偏移）；**eval 内 click 与断言之间必须 await sleep(≈450)，同步读必拿空**（本坑已踩两次）
10. **非 AI 环节禁用 beforeAfter**：详情面板表头固定「使用 AI 前 / 使用 AI 后」，把系统/规则改造收益放进该列等于冒充 AI 收益——此类收益一律走 `metrics`（a6/b07 已按此清空）；**aip 角标必须能在 SOW 清单同义对上**，无对应功能点则不挂角标。完整表达规范（视觉四信号/文案三段式/四条红线/DOM 验证四件套）见 knowledge/frontend/边界声明位的表达规范.md

## 下一步候选（V1.7）
- overall-flow 的 a1~a5/a7 补 legacy/whyAi/risks/metrics/fallback（七问拉齐到总页 AI 服务节点——a6 已拉齐可作模板）
- 其余 5 链式页同标准 UI 复测（任务N 已全量重算几何，未逐页目检非画布区）
- analytics 埋点；场景页导出图片/PDF
- 方案 v2.1：补齐各中台效果目标值与人工基线测法（本轮只修逻辑/文案，量化缺口仍在）；成本量级测算（按次约束 C2 尚无数据 → 对应 CAP-D-11）
- 子能力全景若进汇报，需先决定：CAP-* 是否对外露出（建议只做内部规划图，对外仍只讲 AIP/AICS）
- 第四域口径收敛：AIF 4 项 vs 演示页 6 域 vs 方案「公共底座层」4 项，三套切法需统一（CAP-D 11 项可作基准）

## 活跃文件
- src/flow/tokens.ts（几何唯一源）
- src/components/FlowCanvas.tsx（视口协调器）+ src/components/flow/{LaneBand,NodeBox,EdgeLayer,FlowToolbar,MiniMap}.tsx
- src/components/{BlueprintCanvas,DetailPanel,RefModal,CompareSection}.tsx、src/pages/{HubHome,ScenarioPage}.tsx、src/lib/useScale.ts、src/styles/theme.css
- scripts/auto-layout.ts（链式+ELK 双模式+三级标签避障）、scripts/{validate.ts,rules.test.ts}
- scripts/sync_scope_boundary.py（范围边界幂等同步脚本：a6/b07/v02/subtitle/metricNote）；仓外工具 `_docx_tools/revise{,_b,_d,_e,_f}.py`（docx 六批修订，备份在 `_backup/`）
- scenarios/：overall-flow / data-governance / ai-data-platform / ai-search / ai-service / attr-extraction / contract-blueprint
- knowledge/product/：总分建设结构 / AI商城从0到1业务蓝图 / 商城AI需求追溯矩阵 / 和采商城产品与业务流程蓝图（另 `product/` 子目录为外部拷入的 PRD 体系 SSoT，其内部 `docs/product/` 路径引用在本仓断开，待修）
- knowledge/frontend/：边界声明位的表达规范.md（kind=boundary 专用）
- knowledge/product/四大模块子能力全景-社区对标版.md（CAP-* 能力地图，非承诺清单）
