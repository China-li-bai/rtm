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
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive().optional(),
  /** 解决的场景/约束（防孤儿环节：rules 层校验 ≥1） */
  solves: z.array(solveSchema).default([]),
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
  /** 折线途经点（回环用），[[x,y],…]；缺省直线 */
  via: z.array(z.tuple([z.number(), z.number()])).optional(),
  /** 分支标签（是/否/说明） */
  label: z.string().optional(),
  /** 标签位置；缺省放线中点 */
  labelAt: z.tuple([z.number(), z.number()]).optional(),
});

const flowSchema = z.object({
  /** 画布逻辑尺寸，渲染层做 scale 自适应 */
  width: z.number().positive().default(1360),
  height: z.number().positive().default(560),
  lanes: z.array(laneSchema).min(1),
  nodes: z.array(flowNodeSchema).min(1),
  edges: z.array(flowEdgeSchema).default([]),
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
  platform: z.enum(["全景", "商品", "搜索", "客服"]),
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
