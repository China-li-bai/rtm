import { z } from "zod";

/**
 * 场景演示配置 Schema —— 产品的领域模型唯一事实源。
 * 类型由 zod 推导，禁止另写手写 interface 造成双写漂移。
 */

/** 功能编号口径：AIP-001~031 / AICS-001~029（docs/product 追溯矩阵对齐锚点） */
const AIP_REF = /^(AIP|AICS)-\d{3}(\/\d{3})?(（[^）]*）)?$/;

/** 口径词：含数字的对比文本必须自带其一，或条目显式 approx:true */
export const CALIBER_WORDS = ["示意", "约", "≈", "基线", "SOW", "实测", "示例"];

const storySchema = z.object({
  /** 谁在做什么（业务原文，禁缩写代号） */
  who: z.string().min(1, "story.who 不能为空"),
  /** 卡在哪 */
  stuck: z.string().min(1, "story.stuck 不能为空"),
  /** 业务实操后果（逐条） */
  consequences: z.array(z.string().min(1)).min(1, "至少 1 条后果"),
});

const solutionSchema = z.object({
  /** 现在谁在做什么 */
  who: z.string().min(1, "solution.who 不能为空"),
  /** 顺在哪 */
  smooth: z.string().min(1, "solution.smooth 不能为空"),
  /** 业务实操效果：与 consequences 逐条对应（数量一致性在 rules 层校验） */
  effects: z.array(z.string().min(1)).min(1, "至少 1 条效果"),
});

export const scenarioItemSchema = z.object({
  id: z.string().regex(/^S\d+$/, "场景 id 须为 S1/S2/… 形式"),
  name: z.string().min(1),
  /** 徽标短名（缺省用 name）：场景痛点解决后的短句，如「筛得到」 */
  tag: z.string().optional(),
  /** 关键词标签：隐身/不可信/不归一… */
  kw: z.string().min(1),
  /** 卡片摘要（红线6：卡片只留短文） */
  card: z.string().min(1).max(120, "卡片摘要超过 120 字，完整内容请进弹窗"),
  story: storySchema,
  solution: solutionSchema,
});

export const constraintItemSchema = z.object({
  id: z.string().regex(/^C\d+$/, "约束 id 须为 C1/C2/… 形式"),
  name: z.string().min(1),
  kw: z.string().min(1),
  /** 弹窗全称（缺省用 name【kw】）：徽标短名固定取 kw */
  fullTitle: z.string().optional(),
  /** 卡片摘要 */
  card: z.string().min(1).max(120, "卡片摘要超过 120 字，完整内容请进弹窗"),
  /** 现实 */
  reality: z.string().min(1),
  /** 对应产品决策 */
  decision: z.string().min(1),
  /** 在流程中的落地（文案） */
  land: z.string().min(1),
});

const laneSchema = z.object({
  label: z.string().min(1),
  /** 泳道角色注（入口/出口/链路角色），渲染在泳道标签下方小字 */
  note: z.string().optional(),
  /** 泳道底色分区：biz=业务两端（灰蓝）/ ai=AI 中台（暖）/ base=底座（浅灰） */
  tone: z.enum(["biz", "ai", "base"]).optional(),
  top: z.number(),
  height: z.number().positive(),
});

/** 环节解决关系：挂接场景/约束 + 针对性解法一句话 */
const solveSchema = z.object({
  ref: z.string().regex(/^[SC]\d+$/, "solves.ref 须指向 S1/C1 等"),
  how: z.string().min(1, "solves.how 不能为空——环节必须答得出针对性解法"),
});

/** 前后对比条目 [维度, 使用前, 使用后] */
const beforeAfterSchema = z.object({
  dim: z.string().min(1),
  before: z.string().min(1),
  after: z.string().min(1),
  /** 显式口径标记：文本含数字但未自带口径词时置 true */
  approx: z.boolean().optional(),
});

const nodeKindSchema = z.enum([
  "normal",
  "highlight",
  "dashed",
  "diamond",
  "bar",
  "loopchip",
]);

export const flowNodeSchema = z.object({
  id: z.string().min(1),
  /** 环节编号（01/02…），bar/loopchip 可省略展示逻辑在渲染层 */
  no: z.string().optional(),
  title: z.string().min(1),
  /** 节点副标题短句 */
  sub: z.string().optional(),
  /** 挂接功能编号，如 AIP-012、AIP-003/004；无挂接可写说明文字 */
  aip: z.string().optional(),
  /** 详情面板标题（缺省用 title）——画布盒内文案宜短，面板可写全称 */
  panelTitle: z.string().optional(),
  /** 详情面板 AIP 标注（缺省用 aip） */
  panelAip: z.string().optional(),
  kind: nodeKindSchema.default("normal"),
  /**
   * 所属泳道序号（= flow.lanes 的 0-based 索引，架构层归属的唯一事实源）。
   * 仅 autoLayout 场景使用：构建期据此赋 partition，避免靠坐标推断导致不幂等。
   */
  laneIndex: z.number().int().min(0).optional(),
  /**
   * 列序号（链式布局）：主链节点由 chain 顺序推导（跨泳道保持同列形成竖向
   * 衔接），非主链节点（如底座 pills）必须显式声明。
   */
  col: z.number().int().min(0).optional(),
  /** 泳道内行号（链式布局，默认 0；底座「横条 + pills 两行」用 row:1） */
  row: z.number().int().min(0).optional(),
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive().optional(),
  /** 解决的场景/约束（防孤儿环节：rules 层校验 ≥1） */
  solves: z.array(solveSchema).default([]),
  /** 以前怎么做——人工/规则时代的做法与瓶颈（七问之一） */
  legacy: z.string().optional(),
  /** 为什么用 AI——旧做法不可替代的痛点（七问之二） */
  whyAi: z.string().optional(),
  /** 人机分工——这一环人的角色变成什么（七问之四，对齐 PAIR automation↔augmentation） */
  humanRole: z.string().optional(),
  /** 风险与规避（七问之五）：每条风险必须给出对应规避手段 */
  risks: z.array(z.object({ risk: z.string().min(1), guard: z.string().min(1) })).optional(),
  /** 失败降级——AI 不可用/低置信/超时时的系统行为（七问之六，graceful failure） */
  fallback: z.string().optional(),
  /** 成效与验收（七问之七）：指标名 + 目标值/实测值（成本类指标同入此处） */
  metrics: z.array(z.object({ m: z.string().min(1), v: z.string().min(1) })).optional(),
  /** 追溯链 chips：能力编号 → 技术组件 → 技术锚点（对齐 model.yaml RTM，反向即「被服务」） */
  trace: z.array(z.string().min(1)).optional(),
  /** AI 做了什么（技术黑盒：讲谁的痛怎么解，不写实现）。允许受限 HTML：<b> */
  ai: z.string().min(1, "环节必须答得出「AI 做了什么」"),
  /** 业务流程步骤 */
  process: z.array(z.string().min(1)).min(1, "至少 1 条业务流程"),
  /** 亮点·价值 */
  highlights: z.array(z.string().min(1)).min(1, "至少 1 条亮点"),
  /** 环节级前后对比表 */
  beforeAfter: z.array(beforeAfterSchema).default([]),
});

const edgeStyleSchema = z.enum(["main", "dash", "grayDash"]);

export const flowEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  style: edgeStyleSchema.default("main"),
  /** 出锚点，默认按相对位置自动推断 */
  fromSide: z.enum(["left", "right", "top", "bottom"]).optional(),
  /** 入锚点 */
  toSide: z.enum(["left", "right", "top", "bottom"]).optional(),
  /** 折线途经点（手工布局回环用），[[x,y],…]；缺省直线。autoLayout 场景由 route 取代 */
  via: z.array(z.tuple([z.number(), z.number()])).optional(),
  /** 自动布局产物：完整正交折线点串（含起止点），由 scripts/auto-layout.ts 构建期回写 */
  route: z.array(z.tuple([z.number(), z.number()])).optional(),
  /** 分支标签（是/否/说明） */
  label: z.string().optional(),
  /** 标签位置；缺省放线中点。自动布局场景由构建脚本回写 */
  labelAt: z.tuple([z.number(), z.number()]).optional(),
});

const flowSchema = z.object({
  /** 画布逻辑尺寸，渲染层做 scale 自适应 */
  width: z.number().positive().default(1360),
  height: z.number().positive().default(560),
  lanes: z.array(laneSchema).min(1),
  nodes: z.array(flowNodeSchema).min(1),
  edges: z.array(flowEdgeSchema).default([]),
  /**
   * 自动布局标记：true 表示几何（节点坐标/泳道/边 route/标签）由
   * scripts/auto-layout.ts 构建期用 ELK 重算回写；缺省 false 走手工坐标
   */
  autoLayout: z.boolean().optional(),
  /**
   * 总索引 + 分层下钻模式（合同蓝图类大图画布）：
   * true 时由 BlueprintCanvas 渲染——L1 泳道索引行 + L2 泳道内部流程下钻
   */
  drill: z.boolean().optional(),
  /** L1 主链阶段顺序（节点 id 数组，7 步以内）；仅 drill 模式使用 */
  indexChain: z.array(z.string()).optional(),
  /**
   * 链式布局主链（节点 id 数组，按业务推进顺序）：声明后构建期按
   * 「列=链位、跨泳道保持同列」的确定性规则布局——业务主链从左到右
   * 蛇形推进、跨泳道竖向衔接天然对齐（对齐 RTM 泳道全景口径）。
   */
  chain: z.array(z.string()).optional(),
  /** 画布视口高度（设计像素）：世界高于视口才需平移；设为略高于世界高可整幅直出 */
  viewH: z.number().positive().optional(),
  /**
   * 上级业务上下文（红线：每个 AI 流程页必须答得出「服务于哪条上级业务」）：
   * 渲染在画布上方的定向条，说明本页流水线挂在哪条业务链的哪些环节
   */
  bizContext: z.string().optional(),
  /** 数据支撑条（流程图底部一行） */
  dataSupport: z.string().optional(),
  /** 页面打开时默认选中的环节 id */
  defaultSelected: z.string().optional(),
});

const compareItemSchema = z.object({
  dim: z.string().min(1),
  /** 单字图标：人/¥/⏱/库 */
  icon: z.string().min(1).max(2),
  before: z.string().min(1),
  after: z.string().min(1),
  approx: z.boolean().optional(),
});

export const scenarioConfigSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, "场景 id 须为 kebab-case，将用于 URL"),
  platform: z.enum(["全景", "商品", "搜索", "客服", "数据"]),
  title: z.string().min(1),
  /** 页面副标题引导语 */
  subtitle: z.string().optional(),
  scenarios: z.array(scenarioItemSchema).min(1, "至少 1 个业务场景"),
  constraints: z.array(constraintItemSchema).default([]),
  flow: flowSchema,
  /** 页面级前后对比（人力/金钱/时间/数据） */
  compare: z.array(compareItemSchema).min(1, "至少 1 项页面级前后对比"),
  /** 口径说明（红线5：数字口径强制标注） */
  metricNote: z.string().min(1, "metricNote 必填——口径说明是产品红线"),
  /** V1.1 预留：埋点上报端点（sendBeacon POST），缺省仅 localStorage */
  analytics: z
    .object({ endpoint: z.string().url().optional() })
    .optional(),
});

export type ScenarioConfig = z.infer<typeof scenarioConfigSchema>;
export type ScenarioItem = z.infer<typeof scenarioItemSchema>;
export type ConstraintItem = z.infer<typeof constraintItemSchema>;
export type FlowNode = z.infer<typeof flowNodeSchema>;
export type FlowEdge = z.infer<typeof flowEdgeSchema>;
export type BeforeAfter = z.infer<typeof beforeAfterSchema>;
export { AIP_REF };
