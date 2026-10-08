# state · scenario-demo-hub

> 快照时间：2026-10-08 CST（三段） ｜ ADR-014：前期不部署本地大模型/GPU/vLLM——纯云端（LiteLLM）+脱敏网关，数据存储仍全内网 ｜ 阶段：V1.13 口径与文案治理收官——P（18% 溯源）+Q（可幻觉/C1 歧义）+R（contract-blueprint 按 ADR-014 重述：n23→模型网关·云端按次，SOW 双路径保留为引用）

## 当前状态
- 构建：`npm run build` → dist/index.html 591.83KB（gzip 188.12KB），file:// 双击即开
- **任务O（canvas 外审查）全绿项**：首页 7 卡对齐无裁切可滚动；场景卡 3 列/约束卡 2 列混排对齐、story 零截断；对比区四卡等高零溢出；抽屉 560px/弹窗 920px z 序正确、遮罩关闭 ✓；修 2 bug：**Esc 双层同关**（抽屉 handler 让位 modalRef）与 **useScale 高度收拢亚像素裁切**（rect.height×s + ceil+2，页尾口径说明不再被切）
- **任务N（canvas 审查）**：小地图适配即隐；反哺标签三级避障；泳道标签标题/注释解耦；悬停=聚光灯/选中=描边（加载不再整版灰）；biz-ctx 间距 14
- **模型部署口径（ADR-014）**：前期纯云端（LiteLLM→GLM/Qwen/OpenAI）；C1=数据不出域而非算力私有化
- **口径同步机制**：ai-platform-scaffold `docs/architecture/NARRATIVE_SYNC.md`（STATUS=实现事实唯一源）
- 校验：layout ✓ 7 份 ｜ validate ✓ 7 份 0 警告 ｜ tsc ✓ ｜ rules.test 10/10 ✓
- 场景配置 7 份（6 链式 + contract-blueprint ELK）

## 画布组件体系（任务N 定稿）
- `src/flow/tokens.ts`：构建期+运行时唯一几何事实源（PAGE_WIDTH/LABEL_BAND=118/泳道间距/GRID_GAP/DEFAULT_H/MINIMAP/zoom）——改值必须重跑 `npm run layout`
- `src/components/flow/`：LaneBand / NodeBox / EdgeLayer（标签 z4 halo 渲染在节点后）/ FlowToolbar / MiniMap（按需显隐）；FlowCanvas 只剩视口协调
- 泳道标签：药丸=泳道名；note=`.lane-note-box` 整带宽 118px 置药丸下方——勿再塞药丸；标签带不可加宽（右缘=布线窄通道左界）

## 关键约定（改动前必读）
1. 链式布局：flow.chain（列=链位，跨泳道同列、同泳道+1，col 可覆盖）+ 非主链显式 col + row 分行；bar 独占行；loopchip 不撑列宽但受右边界检查
2. 泳道 tone（biz/ai/base）；lane.note 走注释框渲染
3. 编号口径：业务页 01~N 主链编号；AI 服务节点无编号用 aip 角标；域级编号写 panelAip
4. 口径红线：数字+量词必须口径词（示意/约/≈/基线/SOW/实测/示例）或 approx——〔设计目标〕不是口径词
5. 零安装红线：构建期工具走 devDependency；hash 路由；单文件体积盯紧
6. fixed/sticky 放 scale-outer；scrollspy 触底双保险；三级文案模型；画布/面板文案分离（w117 节点 sub 每段 ≤8 字）
7. 节点>15 或跨层边多 → drill 模式；视口画布 overflow:clip + scrollTop=0 双保险
8. **Esc 单层关闭**：抽屉 handler 必须让位 RefModal（modalRef 开时 return）；**useScale 高度收拢用 rect.height×s+ceil+2**（勿回退 scrollHeight）
9. 自动化点击防顶栏遮挡；截图瞬时失败重试；AI 视觉结论必须 DOM 实测交叉验证（fullPage 截图对 transform 页高度检测失灵——下半页会丢，改滚动定位+视口截图；箭头居中看字形勿看盒偏移）

## 下一步候选（V1.7）
- overall-flow 的 a1~a7 补 legacy/whyAi/risks/metrics/fallback（七问拉齐到总页 AI 服务节点——任务O 已确认抽屉里这些区块缺席）
- 搜索/客服页与 SOW 验收指标卡的 RTM 挂接（L2 功能点编号逐环对齐）
- analytics 埋点；场景页导出图片/PDF
- 其余 5 链式页同标准 UI 复测（任务N 已全量重算几何，未逐页目检非画布区）

## 活跃文件
- src/flow/tokens.ts（几何唯一源）
- src/components/FlowCanvas.tsx（视口协调器）+ src/components/flow/{LaneBand,NodeBox,EdgeLayer,FlowToolbar,MiniMap}.tsx
- src/components/{BlueprintCanvas,DetailPanel,RefModal,CompareSection}.tsx、src/pages/{HubHome,ScenarioPage}.tsx、src/lib/useScale.ts、src/styles/theme.css
- scripts/auto-layout.ts（链式+ELK 双模式+三级标签避障）、scripts/{validate.ts,rules.test.ts}
- scenarios/：overall-flow / data-governance / ai-data-platform / ai-search / ai-service / attr-extraction / contract-blueprint
- knowledge/product/：总分建设结构 / AI商城从0到1业务蓝图 / 商城AI需求追溯矩阵 / 和采商城产品与业务流程蓝图
