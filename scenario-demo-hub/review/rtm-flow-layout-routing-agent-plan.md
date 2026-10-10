# RTM 流程图布局与布线治理：Coding Agent 实施任务书

> 目标仓库：[`China-li-bai/rtm`](https://github.com/China-li-bai/rtm)  
> 目标项目：`scenario-demo-hub`  
> 目标场景：`scenario-demo-hub/scenarios/ai-chat-guide.json`（截图中的“从一句话需求到可采购清单”流程）  
> 任务类型：前端图布局 / 正交布线 / 几何校验；**当前证据显示不涉及数据库迁移**。

## 0. 给 Agent 的总指令

优先修正当前布局、路由模型和验证器，不要直接重写画布，也不要自行实现图布局数学算法。仓库已经安装 `elkjs` 和 `obstacle-router`：前者用于分层节点布局，后者用于 libavoid 风格的正交避障连线。先复用现有依赖，建立可重复的几何测试，再按效果决定是否需要替换某段算法。

**本轮不可接受的做法：**

1. 只调 CSS、节点宽高或 `GRID_GAP`，却不修正路由越界和跨边冲突。
2. 对所有节点一股脑运行全局 ELK layered，然后假设它会自动理解泳道约束。ELK Layered 并没有原生泳道布局语义；跨泳道节点位置需要单独建模或通过约束/分阶段方案处理。
3. 把 draw.io 整个源码复制进业务项目，或因“像 draw.io”就替换为 React Flow。当前渲染器和静态 JSON 数据契约已经存在，这类重写超出本次问题边界。
4. 把视觉样式 `style`（`main/dash/grayDash`）当作业务路由优先级。虚线既可能是正常分支，也可能是反馈线，二者语义不同。
5. 不经验证就把所有高级 crossing penalty 参数开到高值；需用代表性样本测量路径质量和构建耗时。
6. 直接编辑 `dist/index.html`。它是生成物，必须从源文件和场景 JSON 构建生成。

---

## 1. 现状与已复现的问题

### 1.1 已确认的技术栈与数据流

`scenario-demo-hub/package.json` 目前已有：

- `elkjs: ^0.12.0`：布局算法；目前已经是 `devDependency`。
- `obstacle-router: ^0.1.2`：基于 libavoid 思路的 TypeScript 正交避障路由器；目前已经是 `devDependency`。
- `tsx`：构建期运行 TypeScript 脚本。
- `layout` 命令运行 `scripts/auto-layout.ts`。
- `build` 顺序执行 `auto-layout.ts`、`validate.ts`、`vite build`。

当前主要链路：

1. `scripts/auto-layout.ts` 读取 `scenarios/*.json`。
2. 当 `flow.autoLayout === true` 时，按泳道/主链规则计算节点 `x/y/w/h`。
3. 用 `obstacle-router` 计算边 `route`，并计算 `labelAt`。
4. 把新几何坐标回写到 JSON 文件。
5. `scripts/validate.ts` 做几何检查。
6. `src/components/FlowCanvas.tsx` 和 `src/components/flow/EdgeLayer.tsx` 只消费已计算的几何结果进行显示；运行时不会重新布线。

当前是静态场景 JSON，不是数据库驱动的流程编辑器。没有发现此功能对应的 SQL、ORM 或持久化层。

### 1.2 问题 A：当前场景中确有边越界

`scenario-demo-hub/scenarios/ai-chat-guide.json`：

- `flow.width = 1360`。
- `g5 → u3` 路径的最大 X 坐标是 `1370`，超出画布右缘 `10px`。
- 这条边穿过顶部与 AI 处理泳道之间的长距离回连区，截图中表现为跑到最右侧边框外。

这不是推测：现有 `route` 数据已经超出画布宽度（完整 route 为 `[[1247,368],[1370,368],[1370,124],[1248,124]]`）。当前 `validate.ts` 没检查 route 点是否越界；2026-10-10 本地实测 `npm run validate` 确认构建通过（14 份配置 0 error / 5 warn）。全量扫描仅此一条边 X 向越界，无 Y 向越界。

### 1.3 问题 B：节点布局不是完全由边拓扑决定

`scenario-demo-hub/scripts/auto-layout.ts` 当前包含两种放置规则：

- 非链式分支：`layoutLane()` 调用 ELK layered，但只把 `children` 传入，没有把泳道内部业务边作为 ELK `edges` 传入；随后 `remapLaneGrid()` 再按 ELK 的坐标聚类为行，并以自定义固定网格重排。
- 链式分支：如果 JSON 有 `flow.chain`，则 `chainColumns()` 根据链顺序、`laneIndex` 和可选 `col` 分配列，`chainLaneGrid()` 根据 `row/col` 放置节点。

截图所对应的 `ai-chat-guide.json` 同时设置了 `autoLayout: true` 和 `chain`。因此此场景的主要节点位置受显式主链规则控制，而不是一次完整的、以全部边为依据的全图分层布局。支撑节点、决策节点和反向反馈线并未与主链共享一套全局优化目标。

### 1.4 问题 C：横跨泳道的“会话留痕”横条被当作真实障碍节点

`ai-chat-guide.json` 中 `bar1` 的类型为 `bar`，其渲染宽度在构建时扩展为整个内容区：

- 左缘 `x = 130`
- 宽度 `w = 1218`
- 右缘 `x = 1348`

`routeAllEdges()` 又把所有节点都注册为 `ShapeRef`，同时为每个障碍使用 `SHAPE_BUFFER = 10`。因此这条横条的右侧有效障碍边缘扩展到 `x ≈ 1358`，而页面右边界只有 `1360`；路由器为连接顶部/右侧节点而保留的通道可能只能从画布外绕行。当前 `g5 → u3` 的 `x=1370` 正与这一几何条件吻合。

初稿遗漏的另一个事实：`routeAllEdges()` 还把每条泳道左侧的层名标签带注册为额外障碍，且其左缘刻意延伸到 `x = -1000`（`BAND_FAR_LEFT`，见 `auto-layout.ts`「泳道左侧层名标签带」段），注释明说这是为了"杜绝路由器绕出画布"。也就是说**左缘已有防越界的库内先例手法，但右缘没有任何对称防护**——路由器不知道画布右边界在哪，全宽障碍把路线挤出时只能一路向右逃逸。`g5 → u3` 的 `x=1370` 是"bar1 障碍 + 右缘无边界"两个条件叠加的结果，修复也应两头都考虑（见 §4.A.7）。

业务上，`bar1` 的文案是“会话留痕 · 历史可续聊”，更像贯穿整个流程的横向能力标注，而不一定是必须经过的业务节点。需要先明确语义，不能单靠调路由器参数掩盖。

### 1.5 问题 D：当前没有充分启用或验证交叉优化

`routeAllEdges()` 已设置 `shapeBufferDistance`、`idealNudgingDistance` 和 `segmentPenalty`；但当前代码没有配置 `crossingPenalty`，也没有在 `ConnRef` 上启用 `setHateCrossings(true)`。所以代码注释中关于“交叉最小化”的描述没有被一项明确、可验收的配置完整支撑。

此外，当前 `routes` 用 `${from}→${to}` 作为 Map key。如果同一对节点之间存在多条平行边，该 key 会碰撞，覆盖或错误匹配路线。当前 schema 没有稳定的 edge `id`。（2026-10-10 实测：当前 14 份配置均无同对平行边，键碰撞属预防性修复而非在修活 bug。）

API 事实（2026-10-10 在锁定的 `obstacle-router@0.1.2` 本地核实）：`crossingPenalty` 路由参数已导出（README 记载默认 0）；`ConnRef.setHateCrossings(value: boolean)` 存在于 `dist/connectors/connector.d.ts:191`；`auto-layout.ts` 已完成 README 要求的 5 个晚绑定 helper 手工挂载。§5.2 的交叉试验不需要再等待任何 API 确认。

### 1.6 问题 E：验证器漏掉关键失败模式

`scenario-demo-hub/scripts/validate.ts` 已验证：节点越界、节点重叠、边缺少路线、边端点是否落在节点边界、路线是否正交、路线是否穿过其他节点；标签与节点重叠目前仅警告。

当前未验证：

- 边 route 是否越过画布边界；
- 业务主线/普通分支之间的边交叉数；
- 标签是否超出画布；
- 标签之间是否互相压住；
- 标签是否压住非关联边；
- 同源同目标的多条边是否会被路由键覆盖。

本场景已经有 route 越界，因此补充路由几何校验应是第一优先级，而不是可选的美化工作。

---

## 2. 社区方案调研及技术选型

| 方案 | 优点 | 与本项目的适配 | 本轮决定 |
|---|---|---|---|
| **ELK Layered（已有 `elkjs`）** | 专业分层布局，能按方向排列节点、降低交叉，并能输出正交/折线边；支持标签、端口等配置 | 适合 DAG 主流向，但泳道不是其原生布局模型；单纯把泳道节点包成父子层级并不能保证全局节点位置与边方向满足预期 | **保留并复用**；主链约束与泳道分层继续显式建模，另用 POC 验证有边拓扑输入的局部布局 |
| **obstacle-router / libavoid 思路（已有）** | 针对固定障碍做正交避障，可设置障碍缓冲、平行线 nudging，并提供 crossing 相关参数 | 与本项目手工控制泳道、节点位置后再路由的方式直接匹配；当前已投入使用，存在路由越界、交叉治理和校验不足的问题 | **保留并修正**；先把路由边界、障碍建模、优先级与测试闭环做好 |
| [Dagre](https://github.com/dagrejs/dagre) | 较轻量，适合有向图节点布局 | 主要解决节点位置，本项目核心痛点还包含固定障碍的正交避障；切换 Dagre 不能单独解决布线和标签问题 | 暂不引入 |
| [React Flow 布局方案说明](https://reactflow.dev/learn/layouting/layouting) | 可搭配 Dagre 或 ELK，也包含交互画布生态 | 本项目已经有自定义 `FlowCanvas`、泳道、缩放/平移、小地图、抽屉和静态单文件交付；迁移会引入更大范围风险 | 不重写画布；只在未来需要可视化编辑能力时另行评估 |
| [draw.io / diagrams.net 布局](https://www.drawio.com/docs/manual/layouts/) | 产品成熟，自动布局预设丰富；其现代自动布局大多采用 ELK | “借鉴其算法路径”不等于把 draw.io 源码移入项目。当前需要保留自定义 UI 和数据契约 | 借鉴其“图结构驱动布局 + 正交路由”的思路，不整体复制 draw.io |
| ELK 的 Libavoid 路由选项 | 来自 ELK 生态的独立正交路由算法 | `org.eclipse.elk.alg.libavoid` 属于独立的 edge-routing 模块，不应假设普通 `elkjs` bundle 已包含它；要引入需先核实模块打包、许可证和运行方式 | 当前依赖已存在，无需本轮改引擎；只有 `obstacle-router` 达不到验收目标时才做对照 POC |

### 选型结论

**最小且可控的路线是：保留 `elkjs + obstacle-router`，不引入新布局引擎；先解决建模与校验缺口，再按实测结果开交叉优化参数。** 这符合“优先复用成熟库，不自写数学算法”的要求。

注意：ELK 官方 issue 中明确讨论了 Layered 对 swimlane 的局限；`INCLUDE_CHILDREN` 对层级边交叉有帮助，但不能保证节点放置和边方向自动满足泳道需求。因此不应把“把所有节点和边一次性丢给 ELK”作为未经验证的修复方案。

---

## 3. 目标架构

保留现有运行时 Canvas，构建期拆成职责明确的管线：

1. **语义与输入校验**：节点、边 ID 唯一；边端点存在；`laneIndex` 有效；边有独立 `routeRole`。
2. **主链/泳道布局**：主业务链按显式流程顺序保持清晰；非主链节点只使用必要的布局约束；对可独立排序的泳道内部子图，以真实连接关系做 ELK 拓扑感知布局 POC，不再用“无边 ELK + 猜行聚类”来宣称拓扑优化。
3. **路由障碍建模**：只把实际可交互的流程节点注册为路由障碍；泳道底色、装饰横条、能力提示等非流程对象不得默认成为阻断整张图的 obstacle。
4. **成熟路由库**：使用现有 `obstacle-router` 输出正交路径；进行交叉参数小范围基准测试；必要时按主线、普通分支、支撑/反馈顺序做路由优先级实验。
5. **标签布局**：沿路由自动放置标签；标签同时避让节点、其他标签和不相关边；无法找到无碰撞位置时必须产出 warning/error，而不是静默落在线上。
6. **几何校验与产物回写**：失败即阻断构建；只有全部硬性约束通过才写入 JSON；布局脚本重复执行必须稳定。
7. **渲染**：`FlowCanvas.tsx` / `EdgeLayer.tsx` 继续只渲染 JSON 中的几何结果，不将 layout 算法打入运行时 bundle。

---

## 4. 具体修改范围

### P0：必须修改

#### A. `scenario-demo-hub/scripts/auto-layout.ts`

位置与职责：当前布局、路由和 JSON 回写入口。

修改任务：

1. **将视觉节点与路由节点分离**：不要把 `kind: "bar"` 默认认定为真实流程障碍。先审阅 `ai-chat-guide.json` 中 `bar1` 的业务语义：
   - 若只是“会话留痕/跨环节支撑能力”横条，应让它成为注释/装饰对象（单独数据集合或明确的 `routingObstacle: false`）；它不进入主链，也不注册 `ShapeRef`。
   - 若确属真实流程节点，则不能强制全宽覆盖整个内容区；需按真实卡片尺寸建模，并明确业务连边。
   - 不可以一边让 bar 占满整宽，一边又期待反馈线总能从画布内部穿过它。
2. 修正当前路由 Map key。路线应按唯一 edge `id` 存取，禁止只用 `from→to` 做唯一键。
3. 为 `obstacle-router` 的交叉处理增加可测试的配置封装；先记录默认参数下的基线，再比较 crossing 参数（例如关闭、较低、较高三档）对交叉数、路径长度和构建时间的影响。不要把某个未经测量的惩罚值直接写成全局结论。
4. 如试验 `ConnRef.setHateCrossings(true)` 或 `crossingPenalty`，在独立 helper 中封装，并对当前安装版本做类型/API 检查；如果高惩罚导致耗时明显上升，应按场景规模或边角色选择，不要无条件启用。
5. 在进入 route 前验证边端点；路由缺失或路线点数不足时 fail-fast，不可继续输出一条视觉上错误的线。
6. 避免重复边覆盖；不要再以拼接字符串做潜在冲突的主键。
7. 重新审视 `SHAPE_BUFFER=10` 和内容区边缘：确保 route 路径及箭头头部都在画布内。不要简单扩大 `flow.width` 来隐藏模型问题，除非页面设计明确允许画布加宽。**候选技术（库内先例）**：镜像左缘 `BAND_FAR_LEFT` 的手法，在画布右缘（`x = flow.width` 向外延伸）注册一条边界障碍，把路线从几何上封死在 `flow.width - SHAPE_BUFFER` 以内——这只是又一次障碍注册，不是自创避障算法。落地前须核实它与最右节点（含 buffer）之间仍有足够走廊，且不与 `CONTENT_RIGHT` 的既有间距假设冲突。
8. 对 feedback/support routes 的专用通道只使用库支持的 pins/checkpoints（当前 schema 的 `fromSide`、`toSide`、`via` 已存在），不得再自创完整避障算法。优先把长反馈线稳定引导到预留通道，避免切穿主链区域。
9. 对所有参与布局的节点尺寸统一来源。构建脚本 `predictNodeH()` 与渲染侧 `NodeBox` 必须一致；新增/修改 `bar` 或 annotation 类型时，要同时更新高度预测与渲染样式契约。

#### B. `scenario-demo-hub/scenarios/ai-chat-guide.json`

修改任务：

1. 重新定义 `bar1` 语义：确认它是不是流程节点。如果它只是跨流程能力条，把它从 `chain` 中移出，并按新的 annotation 语义处理，而不是让它阻断路由。
2. 为 `flow.edges` 增加稳定且不重复的 edge `id`（例如 `e-u1-c1` 等，命名可读即可）。
3. 为边增加与外观独立的业务路由角色：`primary`（核心主链）、`branch`（条件分支）、`feedback`（回到前序步骤）、`support`（数据/支撑连线）。先人工按业务语义标注当前 21 条边，**不要通过 `style` 自动推导角色**。
4. 审查 `g5 → u3` 与所有经过顶部/右缘的长回连边，确保修复后无需画布外绕路。
5. 如某条边业务上要求固定出口/入口，保留或添加 `fromSide` / `toSide`；仅在经过批准的专用通道需要经过点时才使用 `via`。不要让每条边都重新退化成手写路线。

回归范围（2026-10-10 实测修正）：`scenarios/` 下 **14 份配置全部 `autoLayout: true`**——ai-chat-guide、ai-data-platform、ai-recommend、ai-search、ai-service、attr-extraction、capability-map、cat-governance、contract-blueprint、data-desens、data-governance、overall-flow、search-query、service-faq。不存在任何"手工布局文件"（`auto-layout.ts` 文件头注释里"attr-extraction.json 等手工布局文件原样跳过"的说法已过期，属 §F 文档同步范围）。

因此：schema 一旦收紧（edge `id` 必填），**14 份须同批回填**；`npm run layout && npm run validate` 全量回归。第一轮语义修复（bar1、g5→u3）聚焦 `ai-chat-guide.json`，但共用的 router/schema/validator 修改后不存在"只改 3 份"的窄回归范围。

#### C. `scenario-demo-hub/src/schema/scenario.ts`

修改任务：

```ts
const routeRoleSchema = z.enum(["primary", "branch", "feedback", "support"]);

export const flowEdgeSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  routeRole: routeRoleSchema.default("branch"),
  // 保留现有 style / fromSide / toSide / via / route / label / labelAt
});
```

要求：

- 修改成符合现有 Zod 版本及项目类型写法的实际代码；上面只是目标形状，不是要求原样粘贴。
- 若为了兼容老配置决定让 `id` 暂时 optional，必须在 `validate.ts` 对 auto-layout 场景强制唯一 ID，避免运行期/构建期含糊状态。
- `routeRole` 只控制路由优先级/通道策略，不替代 `style`。
- **回填规模裁定（2026-10-10）**：由于 14 份配置全部是 autoLayout，"id 先 optional、仅 autoLayout 场景强制唯一"的过渡态没有受益者——直接 `id` 必填 + 一次性脚本回填 14 份更简单，避免运行期/构建期含糊状态长期存在。
- **`routeRole` 默认值建议由 `branch` 改为 `primary`**：对齐 `style` 默认 `main` 的既有取向——存量多数边属主链，缺省值不撒谎的方向应与多数一致，可显著减少 14 份回填的显式标注量；最终以阶段 1 对 `ai-chat-guide` 21 条边的人工标注结果复核一次。
- `scripts/build-ai-chat-guide.ts`（新建页范本，edge 由脚本生成）必须同步输出 `id`/`routeRole`，否则 schema 收紧后重跑该脚本即被拦截。
- 生产型 `FlowEdge` 类型要通过 `z.infer` 等现有方式同步更新。
- 如决定添加 annotation 集合（如 `flow.annotations`），必须同步设计 Zod schema、渲染组件、命中/选择行为和验证器；不要只在 JSON 中塞 schema 不认识的字段。

#### D. `scenario-demo-hub/scripts/validate.ts`

必须新增硬性几何规则（autoLayout 模式）：

1. **路线边界**：每个 route point 都应在画布内（结合 `x/y` 箭头 marker 占用空间可设小容差，但默认不能允许 `x=1370` 这种越界）。
2. **节点边界**：继续检查 node 完整位于画布与声明泳道内。
3. **无节点相交**：继续检查任意 edge segment 是否进入非端点节点内部。只允许路线端点与 source/target 边界相接。
4. **正交性**：每个相邻点对必须水平或垂直；连续重复点应归一化或报错。
5. **路由完整性**：每条 autoLayout 边都必须有唯一 ID、合法 `from/to`、至少两点 route，route 起终点匹配端点。
6. **标签边界/碰撞**：label 不能超出画布；标签不能与非端点节点、其他标签和非关联线路碰撞。标签文本渲染尺寸应使用统一估算函数或明确容差。
7. **边交叉**：输出交叉统计，并至少要求 `primary` 主链边之间不发生非预期交叉；对反馈/支撑边先 warning，再由基准样本确定是否升级为 error。共享端点或共线路段不应被错误统计为交叉。
8. **障碍/泳道**：非路由注释不应参与节点重叠检测，也不应阻断 router；真实节点仍需参与。
9. **结果可读**：校验失败信息必须包含配置文件、edge id、from/to 和冲突节点或交点坐标，供 Agent 定位。

布局错误必须返回非零退出码，保证 `npm run build` 不会打包明显错误的流程图。

### P1：测试和文档闭环

#### E. `scenario-demo-hub/scripts/rules.test.ts` 与相关测试

添加可重用几何单测/fixture，至少覆盖：

- 单条直线主链；
- 菱形条件分支；
- 反向 feedback 边；
- 跨泳道 support 边；
- 全宽 annotation 不阻塞 route；
- 多条边共享端点；
- 同源同目标的两条独立边（验证唯一 edge ID）；
- 无可行内部路径时必须 fail-fast，不得输出越界路径；
- 标签拥挤时 validator 可识别碰撞。

测试应检查几何属性，而不仅是比对整份 JSON 的字符串快照。

#### F. `scenario-demo-hub/knowledge/frontend/自动布局布线方案.md`

更新过期设计说明：当前文件说 `GRID_GAP=40`，而 `src/flow/tokens.ts` 中现值为 `30`。同时应更新：

- 节点布局与边路由的职责分界；
- chain / lane 的业务约束；
- routeRole 语义；
- crossing 参数基准结果和性能上限；
- annotation / bar 是否为 obstacle 的契约；
- `scripts/auto-layout.ts` 文件头注释同步（"attr-extraction.json 等手工布局文件原样跳过"已过期——现为 autoLayout:true）；
- 几何验证器的硬门禁；
- 怎样运行 `npm run layout`、`npm run validate`、`npm run build`。

#### G. `scenario-demo-hub/src/components/flow/EdgeLayer.tsx`

原则上保持轻量，不在 React 渲染阶段计算路线。仅在 schema 修改后做类型适配、稳定 key 或调试展示所需的最小改动。route 校验应该在构建期完成。

#### H. `scenario-demo-hub/src/components/FlowCanvas.tsx`、`NodeBox.tsx`、`LaneBand.tsx`

除非将 bar 拆为 annotation 需要新增渲染/图层，否则不应大范围改动视口交互和缩放平移。若新增 annotation，确保它没有假冒为可连线节点，且渲染 z-index、点击命中、选中状态明确。

### 可能需要改动但非默认必改

- `scenario-demo-hub/package.json` / `package-lock.json`：只有在 API 基准验证确认需要新依赖时才改。目前不需要增加依赖。
- `scenario-demo-hub/dist/index.html`：仅在成功运行构建后由构建链生成；禁止手工修改。
- SQL/数据库/后端：**当前任务无须改动**。只有未来把流程配置从静态 JSON 迁移到服务端存储时才需要单独设计数据库，不纳入本 PR。

---

## 5. 算法实施建议（复用现有库，不自写图算法）

### 5.1 优先解决障碍模型和边界，再调 crossing 参数

推荐实施顺序：

1. 在当前默认路由参数下运行一次，保存 route 越界数、节点碰撞数、交叉数、route 总长度、最大折点数、构建耗时作为 baseline。
2. 把 `bar1` 从真实障碍中去除（仅当产品语义确认它是标注/能力条），重新运行并检查 `g5 → u3` 是否已在画布内。
3. 增加 route bounds validator，使类似 `x=1370` 的情况立即使构建失败。
4. 然后再测 `obstacle-router` 对 crossing 的配置。包提供 crossing 相关控制，但交叉惩罚可能带来性能成本；不要仅看一张截图选参数。
5. 需要时利用当前 Router 支持的 pin、checkpoint 和边顺序策略，把反馈/支撑线放进预留通道；不要自写 A* 或可见性图算法。

### 5.2 Crossing 参数试验矩阵

API 已于 2026-10-10 在锁定的 `obstacle-router@0.1.2` 核实完毕：`crossingPenalty` 已导出（README 记载默认 0）、`ConnRef.setHateCrossings(boolean)` 在 `connector.d.ts:191`。至少测以下三档，不是预先规定某个数值必然最优：

| 试验 | crossing penalty | `setHateCrossings` | 目的 |
|---|---:|---|---|
| A | 默认/0 | 关闭 | 现状基线 |
| B | 低值（如 50，按库参数量级验证） | 开启 | 观察交叉减少与耗时变化 |
| C | 中值（如 100–200，按实际量级调整） | 开启 | 探查收益递减与性能退化 |

记录每个配置每个场景的：

- edge-edge crossings；
- route total length；
- route total bends；
- out-of-canvas count；
- blocked/no route count；
- build time（至少跑 3 次，记录中位数）；
- JSON 输出是否稳定。

如果参数让交叉略有下降但构建耗时大幅上涨，采用分层优先级路由或通道约束，而非无限增大惩罚值。交叉惩罚是候选优化器，不是对所有交叉自动消除的数学保证。

### 5.3 主链/分支/反馈/支撑边的路由规则

`routeRole` 与现有外观 `style` 分开：

- `primary`：核心业务主流程；优先保证连贯、短折点、无遮挡。
- `branch`：条件分支/判定结果，标签靠近分支线但不压节点。
- `feedback`：返回更早步骤、补充条件或异常兜底；尽量走预留外侧/底部通道，不穿越主链节点。
- `support`：数据、权限、规则等依赖关系；优先接近对应节点，允许视觉上降低权重，但不应与主链混淆。

本场景中“否 · 缺什么问什么”是一条业务分支，即使外观是橙色虚线也应为 `branch`；“补充后增量解析”“追问/改条件”“示例引导 · 重新表达”等才属于 `feedback`。数据底座到 AI 节点的虚灰线是 `support`。角色必须由业务语义确认。

### 5.4 ELK 的使用边界

ELK 可继续用于泳道内候选排序、分层和跨层方向提示，但需要认识限制：当前 `layoutLane()` 不传入边，ELK 无法利用拓扑优化其节点位置；如果尝试把同泳道边喂入 ELK，必须：

1. 在输入前给节点与边分配稳定 ID；
2. 给 edge 的 `sources` 和 `targets` 使用正确节点 ID；
3. 验证多个同层节点、菱形、反馈边和不连通分量；
4. 保留泳道顺序与主链约束，避免 ELK 把节点移到业务不允许的泳道或顺序；
5. 不用 ELK 输出 route 覆盖所有 cross-lane routes，除非 POC 已证明满足障碍和泳道约束。

这个 POC 是 P2，不应挡住 P0 对越界、横条障碍和验证器的修复。

---

## 6. 数据结构及持久化影响

### 当前确认范围

| 层 | 当前存储/字段 | 计划 |
|---|---|---|
| 场景定义 | `scenario-demo-hub/scenarios/*.json` | 增加 edge `id`、`routeRole`，修正相关 autoLayout 几何产物 |
| Zod Schema | `src/schema/scenario.ts` | 新增 `FlowEdge.id` 与 `routeRole` schema/type |
| 自动布局产物 | node `x/y/w/h`；edge `route`、`labelAt`；lane `top/height` | 由 `scripts/auto-layout.ts` 构建期生成 |
| UI | React `FlowCanvas` / `EdgeLayer` | 继续消费 JSON 几何，不加入运行时自动路由 |
| 构建校验 | `scripts/validate.ts` | 新增 hard errors 与 crossing metrics |
| 数据库 | 该项目没有发现流程配置数据库 | 本轮无 SQL、迁移、数据库字段变更 |

### 新字段建议

| 字段 | 级别 | 用途 | 是否运行时必需 |
|---|---|---|---|
| `flow.edges[].id` | 强烈建议；autoLayout 场景强制唯一 | 路线 Map 和报错定位使用稳定键，允许同一 `from/to` 有多条不同边 | 不改变用户可见含义，但构建期需要 |
| `flow.edges[].routeRole` | 建议 | 区分主链、分支、反馈、支撑并供路由策略读取 | 供构建期算法使用；渲染层通常不必读取 |
| `flow.edges[].route` | 已有字段 | 完整正交点列，构建期生成 | 运行时必需 |
| `flow.edges[].labelAt` | 已有字段 | 标签定位坐标，构建期生成 | 有 label 时使用 |
| `flow.annotations[]` 或 `routingObstacle: false` | 二选一，按 bar 语义确定 | 将非流程型横条/能力注释从节点拓扑和 router obstacles 中分离 | 若选 annotation 方案，要增加 schema 和渲染支持 |

不建议新增数据库表或数据库字段。不要把 `route`、`labelAt`、`x/y` 迁入某个臆造的后端数据库；它们目前就是静态 JSON 文件里的构建产物。

---

## 7. 开发计划（按依赖顺序）

### 阶段 0：建立基线（先做，禁止边改边猜）

2026-10-10 本地状态：仓库已在 `main@60c5e92`（工作树仅本计划文档未跟踪），`node_modules` 在位，无需重新 clone/`npm ci`。已完成的部分直接采用：

1. ~~拉取 main + `npm ci`~~ → 本地环境就绪，跳过。
2. 复制**全部 14 份**（不是 3 份）`scenarios/*.json` 作为修改前基线。
3. `npm run validate` 基线已实测：14 份通过、0 error、5 warn（cat-governance 1 条 + contract-blueprint 4 条，全为标签-节点重叠）。
4. 待做：写指标脚本/报告，记录 route bounds、节点碰撞、边交叉、标签碰撞、路径长度和构建耗时。`ai-chat-guide` 的 `g5→u3` 超出画布 10px 应转成自动回归 fixture。

### 阶段 1：修复语义建模和越界（P0）

1. 一次性脚本给全部 14 份配置的边回填稳定 `id`（机械生成即可，如 `e-${from}-${to}`，同对撞名加序号）；schema 同批收紧 `id` 必填、新增 `routeRole`（默认值裁定见 §4.C）；同步更新 `build-ai-chat-guide.ts` 与 Zod 类型。
2. 产品语义确认 `bar1` 是真实节点还是能力横条。若是横条，分离为 annotation，不注册到 router、不进入主链；若是真实流程节点，改成真实尺寸。
3. 重跑正交 routing；确保所有路径在画布内。
4. 新增 route boundary 硬校验；同源/同目标边不再覆盖。
5. 将 `g5→u3` 作为专项回归 fixture。

### 阶段 2：交叉、反馈线与标签治理（P0/P1）

1. 为 edge routing 添加可测量的策略封装。
2. 做 crossing 参数 A/B/C 基准测试；记录耗时和质量指标。
3. 优先减少主链与主链分支交叉；反馈和支撑路线用不同 role 和必要的 checkpoint 通道约束。
4. 扩展标签碰撞检查：节点、标签、非关联边、画布边界。
5. 对无法找到有效 route 或标签摆放位的情况显式报错/警告，禁止静默 fallback 到越界。

### 阶段 3：拓扑感知节点布局 POC（P2）

1. 从 `ai-chat-guide.json` 取小型代表图，尝试把真实边传入 ELK layered；先只作用于泳道内候选布局。
2. 对比当前 chain/col/row 布局，检查主链先后、泳道位置、节点重叠、交叉、画布宽高变化。
3. 如 ELK 的全局布局无法满足泳道业务约束，保留当前链式泳道策略，不为追求“自动”牺牲业务流程阅读顺序。
4. 只有 POC 数据证明有稳定收益时，才扩展到 `overall-flow.json`、`attr-extraction.json` 和其他场景。

### 阶段 4：回归、文档和构建

1. 更新 `knowledge/frontend/自动布局布线方案.md`，纠正过期 `GRID_GAP=40` 描述。
2. 在所有 `autoLayout: true` 的 JSON 上运行布局与校验。
3. 运行 `npm run layout` 两次，确认第二次不会再产生无意义的 JSON diff（幂等性）。
4. 运行 `npm run validate`、`npm run build`。
5. 对 `ai-chat-guide`、`overall-flow`、`attr-extraction` 至少各截取一次构建前后视图，检查常规缩放、Fit All、小地图与标签显示。
6. 确认 `elkjs`、`obstacle-router` 没有从 `devDependencies` 被误移入 runtime `dependencies`，单文件产物体积没有非预期膨胀。

---

## 8. 验收条件（全部必须可自动化）

### 硬门禁（2026-10-10 任务AC 实施后逐项核验）

- [x] 所有 `autoLayout: true` 场景（= 当前全部 14 份配置）的 node/edge ID 唯一、所有 `from/to` 引用存在。（schema id 必填 + rules 层唯一性 + rules.test 负向测试）
- [x] 所有节点矩形完全处于画布边界内。（validator 既有规则保留）
- [x] 所有正交 route 点处于画布边界内；`ai-chat-guide` 中不再出现 `g5→u3` 的 `x=1370`。（实测 maxX=1248；route bounds 硬校验 + geometry.test 回归 fixture）
- [x] 所有 route 至少两点、路线为水平/垂直线段，无连续重复点。（新增重复点 error + 测试）
- [x] route 起点/终点正确附着在源/目标节点边界。（validator 既有规则保留；phantom 端点贴边挂接同样过检）
- [x] 任意 route 不穿过非端点节点内部。（障碍节点全检；`routingObstacle:false` 装饰横条豁免有据）
- [x] 任意节点框之间不重叠。（validator 既有规则保留）
- [x] 标签在画布内，不压非关联节点（error 级，基线实测 0 命中）；标签互压（21 处）与压非关联线（34 处）纳入聚合 warn 上报——error/warn 分级即裁定 2 的落地。
- [x] 构建时遇到无 route、越界或节点冲突会非零退出，不能静默生成坏图。（validate exit 1）
- [x] `npm run layout` 可重复执行，第二次无非预期 diff。（实测二次运行 diff 不变）

### 视觉质量目标

- [x] 核心主链能一眼顺着箭头阅读，`ai-chat-guide` 主链×主链交叉 = 0（validator 单独计数）；其余场景交叉聚合 warn 上报（contract-blueprint 63 对为最大存量，治理另立项）。
- [x] 条件分支的标签靠近所属分支（三级标签避障保留）。
- [x] feedback 边不越画布边界：`ai-chat-guide` 两条右缘逃逸/贴边线已内部化；ai-recommend `e5→r3`、attr-extraction `nx→n8` 贴边线（x≤1358）在画布内合法，保留为已知形态。
- [x] support 边与主业务线靠颜色/线型/role 区分；routeRole 已落库（ai-chat-guide 21 条人工标注），不止存于视觉。
- [x] 全宽支撑条不再把路线挤出画布（bar1 摘障碍根治；其余 bar 属真流程枢纽仍为障碍，属有意保留）。
- [x] 视口渲染经 DOM 实测（六泳道/主链/菱形/边 23 path/标签 16 全在位，节点几何画布内）；缩放/小地图逐项交互点检未重跑（本轮无交互代码改动）。

### 性能和交付

- [x] crossing 基准已记录：**off=1s 完成；low(50) 在 contract-blueprint 上 >14min CPU 未完成；mid 未测（被 low 支配）**。推荐配置 = off（默认已锁定），试验开关 `LAYOUT_CROSSING` 留档。
- [x] 所有场景均通过 `npm run validate`（14 份 0 error / 22 warn）。
- [x] `npm run build` 通过（794.20KB / gzip 257.33KB），更新的是源 JSON/TypeScript，`dist/index.html` 由构建生成。
- [x] 无数据库迁移；无不必要的新运行时依赖（elkjs/obstacle-router 保持 devDependency）。

---

## 9. 回滚策略

1. 所有几何生成结果、边角色和横条模型变更都放在单独 feature branch。
2. 每次改动前保留相关 JSON 基线，出现不可接受的布局变化时可恢复，再分批场景启用新策略。
3. crossing 优化通过配置/函数封装开关管理，可退回默认路由参数。
4. 不将自动生成的整份 JSON diff 与算法修改混在同一提交；分开提交“schema/算法/校验”和“场景几何产物”，便于审查。

---

## 10. 官方及社区参考

- [draw.io：Automatic layouts](https://www.drawio.com/docs/manual/layouts/) — 现代自动布局预设；多数预设由 ELK 提供算法支撑。
- [React Flow：Layouting overview](https://reactflow.dev/learn/layouting/layouting) — Dagre 与 ELK 能力定位；其中 ELK 能力更丰富，也更复杂。
- [ELK Layered algorithm reference](https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-layered.html) — 分层布局算法选项。
- [ELK edge routing options](https://eclipse.dev/elk/reference/options/org-eclipse-elk-edgeRouting.html) — 路由样式选项。
- [elkjs repository](https://github.com/kieler/elkjs) — ELK JavaScript 版本和图模型接口。
- [elkjs issue #327：Hierarchical layout, layer constraints not respected](https://github.com/kieler/elkjs/issues/327) — ELK 维护者解释 Layered 对 swimlane / hierarchy placement 的限制；不应把分组自动等同原生泳道支持。
- [Dagre repository](https://github.com/dagrejs/dagre) — 轻量分层布局的候选方案；但单独采用它不能取代正交避障布线。
- [obstacle-router on npm](https://www.npmjs.com/package/obstacle-router) — 本项目已有的正交避障路由包；调整内部/高级 API 前必须以锁定版本的 README 和类型声明为准。
- [Adaptagrams / libavoid](https://www.adaptagrams.org/documentation/libavoid.html) — libavoid 的障碍避让正交连线路由算法说明。

---

## 11. 审查状态

### 初稿（外部 Agent，已过期）

初稿由外部 Agent 从 GitHub `main` 读取源文件写成；当时执行环境 DNS 无法 clone 仓库，未做本地运行验证。

### 2026-10-10 本地复核与整改（当前事实源）

- **复核基线**：本地仓库 `main@60c5e92`，工作树仅本计划文档未跟踪；`node_modules` 在位。
- **逐条核实初稿事实声明，全部属实**：`g5→u3` route maxX=1370（唯一越界边，无 Y 向越界）；bar1 `x=130/w=1218`（右缘 1348 = `CONTENT_RIGHT`，+buffer ≈1358）；`layoutLane()` 只传 children 不喂边；`routes` 以 `${from}→${to}` 为键（auto-layout.ts:785/916）；`validate.ts` 检查清单与 §1.6 一致；schema 无 edge `id`/`routeRole`；knowledge 文档 GRID_GAP=40 过期（tokens.ts 实为 30）；`elkjs@^0.12.0`/`obstacle-router@0.1.2` 均为 devDependency，build 命令顺序与 §1.1 一致。
- **初稿遗漏、本轮补入的事实**：① 14 份配置**全部** `autoLayout: true`（初稿仅点名 3 份；`auto-layout.ts` 头注释"attr-extraction 手工布局"说法已过期）；② 泳道层名带障碍（`BAND_FAR_LEFT=-1000`）已存在、右缘无对称防护（补入 §1.4，候选修复见 §4.A.7）；③ `setHateCrossings`/`crossingPenalty` 在 0.1.2 确认可用（§5.2 去掉"待确认"）；④ 当前 14 份均无同对平行边（键碰撞属预防性修复）；⑤ `build-ai-chat-guide.ts` 须随 schema 同步（§4.C）；⑥ validate 基线 0 error / 5 warn（cat-governance×1 + contract-blueprint×4 标签-节点重叠）。
- **整改裁定**（证据驱动，见 §4.C/§7）：edge `id` 直接必填 + 14 份一次性脚本回填（无手工布局配置，optional 过渡态无受益者）；`routeRole` 默认值建议 `primary`（对齐 `style` 默认 `main`）。
- 本轮只整改了本计划文档，未改任何源码/场景 JSON；阶段 0 的 validate 基线已实测记录，指标脚本与阶段 1-4 实施待做。

### 2026-10-10 实施（阶段 0/1/2 + 阶段 4 收尾，用户授权两项裁定后执行）

**两项裁定（用户委托 Agent 自行判断）**：

1. **bar1 = 能力横条（annotation 语义）**。依据：全宽 1218px 是渲染约定非业务尺寸；单入零出（流程不穿过）；文案描述贯穿属性；且实测发现其他场景的 bar 多为真流程枢纽（service-faq f8 五入一出）——因此**不按类型一刀切**，落地为 per-node `routingObstacle: false`，仅 ai-chat-guide bar1 摘障碍。挂接边经 `ConnEnd.fromPoint` 按「面向对端 + 横条感知」贴边接入。
2. **标签/交叉门槛按基线数据定级**：标签出画布、压非关联节点（基线 0）→ error；压自身端点节点（存量 10）、标签互压（21）、压非关联线（34）、边-边交叉（91）→ 聚合 warn；主链×主链交叉单独计数（ai-chat-guide 已 0），升级 error 待治理。

**关键实施事实**：

- 指标基线与整改后对比（review/flow-metrics-{baseline,after}-2026-10-10.json）：越界 2→0、危险带 8→4、路径总长 57823→56680、交叉 89→91（ai-chat-guide 内部化代价，其主链×主链 0）、标签指标持平。
- **画布边界墙方案实测否决**：ai-recommend/attr-extraction 的回连线依赖 bar 右缘 2px 缝隙贴边（x=1355/1358），墙（buffer 10）会挤死走廊导致路由失败；containment 由 validate 硬门禁承担。
- **crossing 惩罚实测否决全局启用**：low(50) 在 contract-blueprint 上 >14min CPU 未完成（off=1s）；默认锁 off，`LAYOUT_CROSSING` 开关留档小场景实验用。
- 交付物：schema（id/routeRole/routingObstacle）+ rules.ts 唯一性 + geometry-rules.ts 共享硬门禁 + auto-layout 改造（id 键/phantom 贴边/crossing seam/头注释纠错）+ repair-edge-id-role.ts 迁移（167 边）+ build-ai-chat-guide.ts 同步 + EdgeLayer 稳定 key + 双测试套件（rules 12、geometry 14）+ knowledge 文档更新。
- 幂等/隔离实测：layout 二次零 diff；其余 12 份配置纯 id 增量。
- **未做（后续立项）**：阶段 3 ELK 拓扑感知布局 POC（P2）；contract-blueprint 63 对交叉与标签互压存量治理；primary-primary 交叉 error 升级；其余 13 份场景 routeRole 人工标注（当前吃 primary 默认值）。
