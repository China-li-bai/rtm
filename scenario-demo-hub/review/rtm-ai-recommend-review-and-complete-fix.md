# RTM「AI 猜你喜欢 · 场景融合演示」审查与完整修复文档

- 仓库：<https://github.com/China-li-bai/rtm>
- 目标配置：`scenario-demo-hub/scenarios/ai-recommend.json`
- 关联正式需求：`scenario-demo-hub/knowledge/product/product/01-prd/搜索中台/AIP-029-031-AI猜你喜欢.md`
- 审查范围：流程语义、场景/约束建模、节点 `solves` 关联、弹窗内容、文案承诺边界、构建校验。
- 配套修复脚本：`repair-ai-recommend.ts`（下载后放入 `scenario-demo-hub/scripts/` 执行）。

## 一、结论摘要

流程主干“触点识别 → 按触点召回 → 候选融合/去重 → 采购资格过滤 → 排序 → 推荐展示 → 反馈评估”是合理的。当前主要问题在于业务场景、功能需求与节点描述没有完全对齐：

1. 现有场景偏向“猜得准 / 可采购 / 讲得出”，却没有把正式 PRD 定义的三个产品维度作为核心场景：AIP-029 单位常购、AIP-030 相似商品、AIP-031 关联品类。
2. 同一场景被很多节点广泛引用，造成用户点不同节点后看到同一份泛化场景故事。共享同一个场景弹窗本身不是 bug；`solves` 引用过宽、场景划分过泛才是根因。
3. 某些文案把设计目标描述成既有能力，例如“场景套餐”“分钟级刷新”“全链路不可篡改”“一次推荐一条 trace”，需要与实际代码、数据表、服务和验收证据逐项核对。
4. 采购资格不应只是排序分数的一部分。目录/权限/禁采等硬约束必须在排序前执行；动态库存和价格应按业务规则在采购操作时再次校验。
5. 当前去重说明存在语义风险：SPU/同款簇可用于识别重复记录，但不能把所有规格/SKU 一并合并，否则会破坏相似商品比选。
6. 正式 PRD 声明不做跨单位推荐；单位常购画像和品类共现必须有明确的单位数据边界。当前 `cat_cooccur` 设计若按单位隔离，应在数据模型/主键中体现单位维度，不能只靠文案声明隔离。

## 二、关键代码与职责

| 文件 | 当前职责 | 修复动作 |
|---|---|---|
| `scenario-demo-hub/scenarios/ai-recommend.json` | 场景与约束的唯一文案源；每个流程节点的 `solves` 通过 ID 引用场景/约束 | 替换场景和约束定义；逐节点收敛 `solves`；校正流程节点文案与上级业务描述 |
| `scenario-demo-hub/src/lib/refs.ts` | 将场景/约束构造成弹窗徽章、标题和摘要所需的数据 | 保留单一事实源；不复制节点级场景文案 |
| `scenario-demo-hub/src/components/DetailPanel.tsx` | 在节点详情显示关联场景摘要以及 `solves[].how` | 明确区分“统一场景定义”和“本节点如何承接”；入口文案改为“查看完整场景” |
| `scenario-demo-hub/src/components/RefModal.tsx` | 根据 `refId` 从配置读取完整场景/约束 | 保留共享弹窗；建议增加“当前节点如何承接”的上下文区块，使同一场景从不同节点打开时仍能看到不同的节点级落实方式 |
| `scenario-demo-hub/src/schema/scenario.ts` | Zod 配置结构和字段约束 | 现有 `scenario/story/solution/constraint/solves` 字段足以承载本次文案修复，无需为了文案重复新增字段 |
| `scenario-demo-hub/src/schema/rules.ts` | 检查字段、引用、孤儿节点及 `effects`/`consequences` 数量一致性 | 保留通用校验；业务语义检查可放专用校验函数/测试，不建议把所有 AI 推荐特例写进通用 Schema |
| `scenario-demo-hub/scripts/auto-layout.ts` | 构建期自动布局、泳道堆叠、连线 `route` 与标签位置回写 | 场景文案和 `solves` 改完后重新生成布局，避免节点标题/描述长度变化后几何产物过期 |
| `scenario-demo-hub/scripts/validate.ts` | 构建时遍历场景配置并执行业务校验 | 与 `npm run layout`、`npm run build` 一起验收 |

### 为什么弹窗会重复

`DetailPanel.tsx` 遍历 `node.solves`，用 `refs.get(s.ref)` 显示摘要；点击徽章后打开 `RefModal`。`RefModal.tsx` 再根据相同 `refId` 读取 `cfg.scenarios` 或 `cfg.constraints`。因此，相同 `refId` 从任何节点打开都会显示同一份标准场景说明，这是单一事实源设计。

不要把同一场景复制成 `node1S1`、`node2S1` 等多份对象来人为让弹窗看起来不同。这会造成场景定义重复、更新漂移及追溯关系失真。正确做法是：

- 场景层：每个场景只定义一次真实的用户问题、产生原因、业务后果、解决方案和业务效果。
- 节点层：`solves[].how` 解释当前节点如何落实这条场景/约束；必须随节点职责变化而变化。
- UI 层：点击共享场景可以看到统一完整定义；同时显示“当前节点如何承接”上下文，解决用户在不同节点中重复打开后无法看出关联差异的问题。

## 三、场景与约束的目标模型

### 场景（每个 ID 唯一维护）

- `S1`：单位常购难发现，对应 AIP-029。重点是当前单位的常购画像、高频品类、常购 SKU；个人维度只能按正式需求和数据条件分期启用。
- `S2`：详情页缺少相似商品，对应 AIP-030。重点是当前商品锚点、同款簇、标准属性近邻和可用语义近邻；保留可比较的规格/SKU。
- `S3`：关联品类与零结果缺少兜底，对应 AIP-031。重点是单位范围内的订单品类共现、统计阈值、购物车关联与零结果兜底。

### 约束（跨所有场景使用，但仅在节点职责相关时引用）

- `C1`：采购资格必须先于排序校验。
- `C2`：推荐理由必须有证据并可追溯。
- `C3`：单位数据隔离与推荐公平。
- `C4`：成本、时延与降级必须可控。

约束与业务场景的角色不同：场景回答“用户遇到什么问题、解决后产生什么业务效果”；约束回答“无论哪类推荐，都必须遵守什么工程/业务边界”。不要再用一个泛化“黑盒/合规”场景承载所有产品能力。

## 四、配套的完整配置修复脚本

文件 `repair-ai-recommend.ts` 会对目标 JSON 执行以下修改：

1. 把 `scenarios` 替换成上述三个业务能力场景；
2. 把 `constraints` 替换成四项独立约束；
3. 为每个节点重新写入针对性的 `solves` 与 `how`；
4. 更新节点标题、副标题及关键详情字段，清理未经确认的“场景套餐”“全站/跨单位同侪”“分钟级”“不可篡改”等承诺；
5. 更新上级业务上下文、数据支撑、页面对比和指标口径说明；
6. 写入前校验场景引用、节点覆盖、场景效果条目数量及卡片 120 字限制；
7. 写入前生成 `.before-content-fix.bak` 备份。

### 应用方法

1. 下载配套脚本，放到 `scenario-demo-hub/scripts/repair-ai-recommend.ts`。
2. 进入 `scenario-demo-hub/`，执行：

   ```bash
   npx tsx scripts/repair-ai-recommend.ts
   npm run layout
   npm run validate
   npm run build
   ```

3. 检查 `git diff -- scenarios/ai-recommend.json`，确认脚本只修改目标场景配置中的预期字段。
4. 审阅生成的 `dist/index.html`，逐一打开 S1/S2/S3、C1/C2/C3/C4 弹窗以及不同节点详情。

脚本只修改 `ai-recommend.json`，不直接修改 `DetailPanel.tsx`、`RefModal.tsx` 或通用校验逻辑。后两部分的精确代码建议见下文。

## 五、UI 代码修复：场景统一，但节点上下文不同

### 5.1 `DetailPanel.tsx` 的入口文案

将：

```tsx
<div className="sec-t">■ 解决的场景 / 约束（点徽章看完整场景）</div>
```

改为：

```tsx
<div className="sec-t">■ 本节点关联的业务场景 / 规则约束</div>
```

将标题中的：

```tsx
<span className="more" onClick={() => onOpenRef(s.ref)}>完整场景与解决方案 ↗</span>
```

改为：

```tsx
<span className="more" onClick={() => onOpenRef(s.ref)}>查看完整场景 ↗</span>
```

将：

```tsx
<div className="sv-how"><b>→ 本环节针对性解法：</b>{s.how}</div>
```

改为：

```tsx
<div className="sv-how"><b>→ 本节点如何承接：</b>{s.how}</div>
```

理由：`RefModal` 展示的是共享场景定义，不是当前节点独有的实现说明；当前节点专属内容就是 `solves[].how`，以及详情面板中的 `ai/process/highlights`。文案必须让用户知道两者的层次不同。

### 5.2 让弹窗带出当前节点的具体落地方式

在 `ScenarioPage.tsx` 新增状态：

```tsx
const [modalNodeContext, setModalNodeContext] = useState<FlowNode | null>(null);
```

同时在文件顶部增加类型导入：

```tsx
import type { FlowNode, ScenarioConfig } from "../schema/scenario";
```

（如果已有 `ScenarioConfig` 导入，则合并成同一行。）

增加统一打开函数：

```tsx
const openRef = (refId: string, contextNode: FlowNode | null = null) => {
  setModalNodeContext(contextNode);
  setModalRef(refId);
};
```

痛点/约束卡片上的调用改为：

```tsx
onClick={() => openRef(s.id, null)}
```

节点详情调用改为：

```tsx
<DetailPanel
  node={selected}
  refs={refs}
  onOpenRef={(refId) => openRef(refId, selected)}
/>
```

渲染弹窗处改为：

```tsx
{modalRef && (
  <RefModal
    refId={modalRef}
    cfg={cfg}
    refs={refs}
    contextNode={modalNodeContext}
    onClose={() => {
      setModalRef(null);
      setModalNodeContext(null);
    }}
  />
)}
```

### 5.3 `RefModal.tsx` 显示节点上下文

给 `RefModal` 增加可选属性：

```tsx
import type { FlowNode, ScenarioConfig } from "../schema/scenario";

interface Props {
  refId: string;
  cfg: ScenarioConfig;
  refs: Map<string, RefInfo>;
  contextNode?: FlowNode | null;
  onClose: () => void;
}
```

在组件内部、`return` 之前增加：

```tsx
const nodeSolve = contextNode?.solves.find((item) => item.ref === refId);
```

然后在弹窗头部之后、场景正文之前增加：

```tsx
{contextNode && nodeSolve && (
  <div className="m-sec context">
    <h4>■ 当前流程节点如何落实</h4>
    <div className="m-row">
      <span className="m-lab">流程节点</span>
      <span className="t">
        {contextNode.no ? `${contextNode.no} ` : ""}
        {contextNode.panelTitle ?? contextNode.title}
      </span>
    </div>
    <div className="m-row">
      <span className="m-lab">本节点做法</span>
      <span className="t">{nodeSolve.how}</span>
    </div>
  </div>
)}
```

这样，场景的 `story/solution` 仍然只维护一份，但同一个场景从 `e1` 召回节点、`e4` 排序节点或 `d1` 数据节点打开时，弹窗顶部都能展示当前节点对应的不同 `how`。从场景总览卡片打开时 `contextNode` 为 `null`，不会误显示某个之前选中的节点。

> 注意：这个 UI 改造需单独应用并通过 TypeScript 构建；配套 `repair-ai-recommend.ts` 不会自动修改 React 源码。

## 六、业务流程修复原则

### 6.1 触点路由必须和 PRD 一致

建议明确四个触点：

- 首页/工作台：单位常购；
- 商品详情页：相似商品；
- 购物车：关联品类；
- 搜索零结果页：关联推荐或明确标注来源的兜底。

“普通搜索结果页”和“零结果页”不能混为一谈；也不要暗示四种触点每次都运行全部召回维度。

### 6.2 候选融合与 SPU/SKU 去重

正确语义是“去掉跨召回源重复记录，保留业务上有效的规格/SKU”。不能把 SPU 同款簇当成一个必须折叠的单一商品，因为详情页相似推荐要允许用户比选同款不同规格或供应选择。

### 6.3 采购规则过滤必须早于排序

顺序应为：候选融合/轻量预筛 → 采购资格硬约束过滤 → 排序 → 展示。硬约束至少按业务适用性覆盖组织/项目授权、目录、供应商资质、协议条件、库存/配送和质量要求。动态状态应在加购/采购操作时按现有业务规则复核。

“缺货降权”与“不可采商品不进入推荐”并不相容。若业务允许缺货替代推荐，应为替代推荐定义单独的候选规则和用户提示；不能把缺货商品继续当成可直接采购商品展示。

### 6.4 排序与推荐理由不能承诺超出实际机制的解释能力

推荐理由应优先来自可验证的理由码：

- `ORG_FREQUENT_PURCHASE`：当前单位常购；
- `PRODUCT_ATTRIBUTE_SIMILAR`：关键标准属性相近；
- `SAME_PRODUCT_CLUSTER`：同款簇关系；
- `ORG_CATEGORY_COOCCURRENCE`：当前单位历史订单中的品类关联；
- `CATEGORY_POPULAR_FALLBACK`：类目热门兜底（必须如实标注）。

这些是推荐文案/接口可采用的建议码，不代表仓库当前已实现了这些枚举。实现前应建立类型、测试及事件记录。禁止让模型在没有相应证据时自由编造“因为你/你的单位……”类理由。

## 七、建议新增的专用校验项

通用 `rules.ts` 负责通用结构规则；`ai-recommend` 特有的业务语义最好放在专用校验函数或测试中。至少校验：

1. 必须存在 S1/S2/S3 与 C1/C2/C3/C4，且每个 ID 至少挂接一个节点；
2. 每个节点至少一个 `solves`，且所有引用都存在；
3. `S1` 文案不能暗示默认已启用个人深度画像或跨单位行为；
4. `S2` 必须保留规格/SKU 的业务意义，不能写成把整组 SPU 全折叠；
5. `S3` 的共现信号必须写清单位数据范围与低支持度过滤；
6. `e3` 在主链顺序中必须先于 `e4`；硬约束不能被写成普通排序权重；
7. 检查未经验证的强承诺词：`分钟级`、`实时保证`、`不可篡改`、`全链路可追溯`、`零成本`、确定节约比例等。命中后应要求提供代码/运行证据，或改写为设计目标/待验证事项。

## 八、验收清单

- [ ] 运行修复脚本后，配置备份存在，`ai-recommend.json` 只有目标业务内容被修改。
- [ ] `npm run layout` 能够重新生成节点尺寸、泳道尺寸、边 `route` 与标签位置。
- [ ] `npm run validate` 通过，没有缺失引用、孤儿节点或 `effects` 与 `consequences` 数量不一致。
- [ ] `npm run build` 成功。
- [ ] 首页/工作台弹窗只讲单位常购；商品详情弹窗只讲相似商品；购物车/零结果弹窗只讲关联品类。
- [ ] 相同场景从不同流程节点打开时，共享完整业务定义，但“当前流程节点如何落实”展示不同的 `solves[].how`。
- [ ] `e3` 的硬约束过滤发生在 `e4` 排序之前。
- [ ] 相似商品候选保留有意义的 SKU/规格差异。
- [ ] 不存在无证据的跨单位个性化推荐、竞价推广、默认个人深度画像或未验收的实时/不可篡改能力承诺。
- [ ] 推荐点击率、加购率、零结果挽回率等基线另行定义评测集，不把方案设想当成实测效果。

## 九、范围声明

这份修复把正式需求对齐、场景模型和节点追溯关系收拢到一套可执行配置中。它不会凭配置文案自动实现新的推荐算法、数据隔离、审计存储或事件管道；这些能力仍需通过实际服务、数据模型、权限测试和评测集验证。应用脚本后应先审阅差异，再运行构建与页面验收，不应直接覆盖正式分支而不审查。

## 十、执行状态与注意事项

配套脚本已通过 TypeScript 语法/类型检查，并用一个包含 26 个预期节点的模拟配置验证了替换流程：生成 3 个场景、4 个约束，所有节点 `solves` 引用有效、每个场景/约束至少有一个落点，且每个场景的 `consequences` 与 `effects` 数量一致。这个检查不等于目标仓库的完整构建通过。

当前没有直接写入 GitHub 仓库或提交 `main`。请将脚本放入目标项目后，先查看 `git diff`。`npm run layout` 会处理 `scenarios/` 下所有 `autoLayout: true` 的配置，而不只处理 `ai-recommend.json`；如果出现与本次目标无关的布局变更，应检查原因，不要盲目提交。最终以目标仓库的 `npm run validate`、`npm run build` 与页面逐项验收结果为准。
