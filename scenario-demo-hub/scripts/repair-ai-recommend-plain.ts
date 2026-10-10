/**
 * ai-recommend 平实话术清扫（去黑话）。
 * 执行：npx tsx scripts/repair-ai-recommend-plain.ts
 *
 * 术语策略：行业通用词保留（召回/排序/去重/画像/属性/理由码），黑话换平实说法——
 * 触点→页面场景｜候选→备选｜品类共现→经常一起采购｜属性近邻→参数相近｜语义近邻→写法相近｜
 * 同款簇→同款商品组｜冷启动兜底→无历史时的热门兜底｜采购上下文→采购背景｜
 * 支持度→出现次数｜时间衰减→降低旧记录权重｜阈值下行→策略与阈值生效。
 * 用户点名三句整句重写。不改坐标/route（layout 重算），写入前备份 .before-plain.bak。
 * 写入前双重校验：①黑话禁词在全部用户可见字段清零；②变更路径 ⊆ 白名单。
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "scenarios", "ai-recommend.json");
const backup = `${file}.before-plain.bak`;
const cfg = JSON.parse(readFileSync(file, "utf8")) as any;
copyFileSync(file, backup);
const before = JSON.parse(JSON.stringify(cfg));

/* ---------- 场景 solution/effects（点名句整句重写） ---------- */
const sol: Record<string, Partial<{ who: string; smooth: string }>> = {
  S1: {
    who: "工作台优先展示本单位常买的品类和商品；买得有规律时，再提示大概什么时候该补货。新单位没有历史订单时，直接说明推荐来自哪里（例如类目热销），不假装了解它的采购偏好。",
  },
  S2: {
    who: "详情页以当前商品为起点，把同款的其他规格、关键参数相近的商品、写法不同但实际相近的商品找出来放在一起；自动排除当前商品和无权查看的商品。",
  },
  S3: {
    who: "购物车和零结果页会翻本单位过去的订单，看哪些品类经常一起买，据此给出搭配建议；只有订单里确实经常一起出现的搭配，才显示「贵单位采购这类商品时，也常采购……」这样的理由。",
    smooth: "「经常一起买」只是历史订单提供的线索，不代表这些商品必须成套购买。一起买的次数不够多时，这个推荐位直接不显示；如果展示的是热门商品，会明确说明这是热门推荐，而不是说成历史关联。",
  },
};
for (const s of cfg.scenarios) {
  const upd = sol[s.id];
  if (!upd) continue;
  Object.assign(s.solution, upd);
}
const s2 = cfg.scenarios.find((x: any) => x.id === "S2");
s2.solution.effects[0] = "采购人员可以留在当前商品页查看有比较价值的备选项。";
const s3 = cfg.scenarios.find((x: any) => x.id === "S3");
s3.solution.effects[1] = "零结果页在有合适备选时提供继续浏览的路径，而不是只留下一个空状态。";

/* ---------- 约束 ---------- */
const con: Record<string, Partial<{ card: string; decision: string; land: string }>> = {
  C1: { decision: "把采购资格作为排序前的硬约束。无权、禁采或不满足硬性条件的备选必须剔除；价格、库存等动态状态在进入采购操作时按业务规则再次校验。" },
  C3: {
    decision: "单位画像和品类搭配统计按单位范围隔离；权限在数据访问与备选过滤层落实。排序规则应可说明、可复核，人工干预需有授权与记录。",
    land: "落地在单位画像和搭配统计数据模型、数据访问权限、备选过滤、策略配置与审计记录。",
  },
  C4: { card: "推荐服务需要控制计算成本与响应时间。画像或模型服务超时、备选不足时，应按场景策略安全降级，不能拖垮搜索、购物车和采购主流程。" },
};
for (const c of cfg.constraints) {
  const upd = con[c.id];
  if (upd) Object.assign(c, upd);
}

/* ---------- 节点文案与 solves ---------- */
type NodeEdit = {
  title?: string; sub?: string; ai?: string; process?: string[];
  highlights?: string[]; legacy?: string; whyAi?: string; humanRole?: string;
  risks?: Array<{ risk: string; guard: string }>; fallback?: string;
  metrics?: Array<{ m: string; v: string }>; trace?: string[];
  beforeAfter?: Array<{ dim: string; before: string; after: string }>;
  process0?: string; process1?: string; process2?: string; process3?: string;
  highlight0?: string; ai2?: string;
};
const nodeEdits: Record<string, NodeEdit & { solvesHow?: Record<string, string> }> = {
  r12: {
    title: "识别页面场景与采购背景",
    ai: "本环节只做确定的业务取数：看清用户在哪个页面、属于哪个单位、有什么角色和采购任务；采购权限不由它判断。",
    process: ["识别用户在首页/工作台、详情页、购物车还是零结果页", "读取当前单位、用户角色和本次采购背景", "把页面场景和采购背景传给对应的推荐策略"],
    highlights: ["用户在哪个页面，决定启用单位常购、相似商品还是关联品类；业务授权仍由规则服务判断"],
    solvesHow: {
      S1: "识别用户在首页/工作台等页面办事，带上当前单位、角色与采购背景，为单位常购推荐提供数据条件；不据此臆测个人偏好。",
      C3: "背景信息查询携带单位与授权范围，后续画像和行为数据只能在允许的单位边界内读取。",
      C1: "背景信息提供当前项目和角色，最终采购资格仍由规则过滤与采购业务服务校验。",
    },
  },
  e1: {
    title: "按场景多路召回",
    sub: "单位常购·商品相似·品类关联<br>按页面场景选路，不默认全部路径一起跑",
    ai: "召回按页面场景选路：单位常购读单位内统计；相似商品用同款关系、关键参数和语义数据；关联品类用本单位订单里确实经常一起出现的品类。",
    process: ["首页/工作台：单位常购与高频品类备选", "商品详情：同款商品组、参数相近及写法相近的商品", "购物车/零结果：本单位经常一起采购的品类", "单位历史或搭配证据不足时按场景配置兜底或不展示"],
    highlights: ["召回路径由页面场景与有效数据决定；不把热门、套餐或跨单位行为当成默认能力"],
    whyAi: "语义数据可以补足关键词和参数匹配的覆盖，但单位常购与订单里的搭配规律仍应由业务数据和统计规则提供依据。",
    humanRole: "产品/运营配置各场景启用的维度和门槛；采购与数据负责人确认可使用的数据范围。",
    risks: [
      { risk: "单位历史不足或搭配数据太少", guard: "无历史时使用来源明确的热门兜底；备选不足时隐藏推荐区，不强行填满。" },
      { risk: "相似备选只因标题相近但规格不匹配", guard: "优先使用标准属性、同款关系和采购规则核验。" },
    ],
    fallback: "某一路召回不可用时，按场景策略切换到已验证的其他数据源；没有合格备选时隐藏区块。",
    metrics: [{ m: "各维度备选覆盖", v: "按场景分别建立基线后评估" }, { m: "零结果兜底有效率", v: "待评测集锁定基线" }],
    beforeAfter: [{ dim: "找货路径", before: "反复翻历史、重搜或人工回想关联品类", after: "按场景召回有业务依据的备选" }],
    solvesHow: {
      S1: "首页/工作台走当前单位常购与高频品类备选；单位历史不足时使用来源明确的类目热门兜底。",
      S2: "商品详情页以当前商品为锚点，召回同款商品组、参数相近和写法相近的商品。",
      S3: "购物车/零结果页查本单位订单里经常一起采购的品类；各场景按配置选路，不默认全部路径一起跑。",
    },
  },
  e2: {
    title: "备选合并与去重",
    sub: "合并重复记录·保留有效规格<br>控制备选数量，避免错误折叠 SKU",
    ai: "先合并来自不同召回源的重复记录，再按业务规则进行轻量预筛。SPU/同款商品组用于识别关系，不意味着把所有规格和 SKU 无差别合并。",
    process: ["统一商品标识并合并跨召回源重复记录", "保留具有业务意义的规格、SKU 和供应选项", "执行轻量预筛并记录备选来源", "把整理好的备选交给采购资格过滤"],
    highlights: ["去重消除重复曝光，但不会抹掉采购比选所需的 SKU 差异"],
    beforeAfter: [{ dim: "备选管理", before: "不同来源可能重复出现同一商品", after: "去重合并并保留备选来源和有效规格" }],
    solvesHow: {
      S2: "合并不同来源重复的商品记录，但保留同款商品组内有采购意义的规格、SKU 或供应选项。",
      S3: "合并重复的搭配建议，并保留搭配统计的时间范围和来源信息供理由生成使用。",
      C4: "先去重和执行轻量预筛，控制进入后续规则校验与排序的备选数量；具体量级以实测为准。",
    },
  },
  e3: {
    process: ["校验当前单位、角色与项目权限", "校验采购目录、供应商资质及协议条件", "按业务规则检查库存、配送、交期和质量状态", "硬约束不满足的备选剔除；动态状态在采购操作时重新校验"],
    highlights: ["不可采购不是低分备选；硬约束过滤必须先于排序"],
    fallback: "采购规则服务不可用时，不展示无法确认采购资格的备选；搜索、购物车和下单主流程按业务系统既有策略运行。",
    solvesHow: {
      C1: "在排序前执行组织/项目权限、采购目录、供应商资质及适用的价格、库存、配送和质量硬规则；违反硬约束的备选直接剔除。",
    },
  },
  e4: {
    title: "按场景排序",
    ai: "对已通过采购资格校验的备选，按场景采用相应的相关度、单位内采购统计、参数匹配或品类搭配特征排序。具体使用规则分、轻量模型还是学习排序模型，以真实实现为准。",
    process: ["先确认备选均已通过硬约束过滤", "按场景选择单位常购、商品匹配或品类搭配特征", "应用相关度、质量和履约等已验证特征排序", "绑定可验证的推荐理由来源和实际策略标识"],
    highlights: ["硬约束负责决定能否进入排序；排序负责在合格备选中决定展示次序"],
    legacy: "单纯按热门度或人工选择排序，无法充分体现当前单位、商品详情和购物车场景的差异。",
    whyAi: "语义相似可以辅助复杂商品匹配；单位频次、搭配频次和采购资格应由可验证数据与规则提供，不需让大模型替代这些确定性判断。",
    risks: [
      { risk: "热度主导导致排在后面的商品缺少曝光", guard: "按业务需要设置备选来源配额和多样性约束，使用实验评估效果。" },
      { risk: "理由与真实排序依据不一致", guard: "理由码从实际命中的特征与规则生成，并在测试中核对。" },
    ],
    fallback: "排序服务不可用时，按已经配置并验证的确定性顺序降级；若无法保证备选资格，则不展示。",
    metrics: [{ m: "分场景推荐点击/加购", v: "待评测集锁定基线" }, { m: "排序相关性", v: "按单位常购、相似商品和关联品类分别评测" }],
    trace: ["AIP-029/030/031 的分场景排序策略", "备选来源与规则版本记录"],
    beforeAfter: [{ dim: "排序依据", before: "单一热门榜难以反映场景差异", after: "按场景使用对应的业务特征排序" }],
    solvesHow: {
      S1: "在合格备选中结合单位常购频次、采购周期及场景相关性排序。",
      S2: "在详情页备选中优先考虑同款关系和关键参数匹配，避免仅依靠标题相似。",
      S3: "按本单位搭配频次与有效时间窗口排序，过滤出现次数太少的偶然同单。",
    },
  },
  e5: {
    ai: "展示层按场景渲染合格备选和可验证的理由码；理由取自实际使用的单位统计、商品属性/同款关系或品类搭配证据，不无依据地生成说明。",
    process: ["按场景展示合格备选并执行多样性策略", "将理由码映射成准确、克制的用户文案", "记录实际曝光及点击事件", "在商品状态可能变化的场景提示以采购操作时校验为准"],
  },
  r3: {
    process: ["按场景记录曝光、点击与加购事件", "在数据可关联的前提下补充订单与履约结果", "按场景和推荐维度评估有效性与失败原因"],
  },
  fb: {
    ai: "将通过质量校验的事件按单位范围聚合，更新常购统计或品类搭配统计；策略调整需要经过评估和发布流程，不因单次点击自动改变业务规则。",
    solvesHow: {
      S3: "用单位范围内新增且可关联的订单数据更新经常一起买的品类统计，并降低旧记录权重、剔除次数太少的搭配。",
    },
  },
  st: {
    sub: "场景开关·维度配置·阈值·发布记录",
    process: ["配置各场景启用的推荐维度与展示数量", "管理备选阈值和已启用的排序规则", "记录生效配置，并按发布流程验证与回退"],
  },
  d1: {
    ai: "提供单位和采购业务背景信息；画像计算读取已授权范围内的历史订单与常购统计。",
    process: ["同步已授权的单位、项目与订单数据", "提供当前用户的必要背景信息", "按单位边界提供画像输入"],
    solvesHow: {
      S1: "向推荐服务提供当前单位范围内的历史订单、常购统计与必要的项目背景。",
    },
  },
  d2: {
    sub: "类目·属性·同款商品组·SKU/规格·可用语义数据",
    highlights: ["同款归并与备选去重应保留规格差异"],
    solvesHow: {
      S2: "提供治理后的类目、标准属性、同款关系与可用语义数据，支撑可比较的相似商品召回。",
    },
  },
  d4: {
    solvesHow: {
      S3: "在订单明细与品类映射可信时更新单位内经常一起买的品类统计；未归类记录不得当作有效关联证据。",
    },
  },
  g4: {
    process: ["记录实际展示与用户交互", "监控分场景指标和请求异常", "为已记录字段提供查询与复核入口"],
    solvesHow: {
      C2: "记录实际展示的备选、理由和已有策略标识，并监控效果及异常；未落地的字段不宣称可追溯。",
    },
  },
  i2: {
    sub: "批处理/事件处理·画像与搭配统计刷新",
  },
  bar1: {
    sub: "各场景统一调用推荐能力；页面负责展示，业务服务负责授权与采购执行",
    ai: "推荐中台按统一接口承接各场景请求、调用对应召回/规则/排序并返回结果和理由；目录权限和采购操作仍依赖业务权威服务。",
    process: ["页面传入场景标识和必要背景信息", "中台按配置调用相应推荐维度", "返回备选、理由和可用的策略标识", "采购确认、审批和下单由原业务流程执行"],
    solvesHow: {
      C4: "统一推荐接口与各场景配置，避免重复实现同一推荐逻辑；是否降低成本需以维护投入和调用账单验证。",
    },
  },
};

for (const n of cfg.flow.nodes) {
  const e = nodeEdits[n.id];
  if (!e) continue;
  const { solvesHow, ...fields } = e;
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v) || typeof v !== "object") {
      (n as any)[k] = v;
    } else {
      Object.assign((n as any)[k], v); // 单对象字段（如 risks[i]）——本脚本未用到该形态
    }
  }
  if (solvesHow) {
    for (const s of n.solves) if (solvesHow[s.ref]) s.how = solvesHow[s.ref];
  }
}

/* ---------- 边标签 / 泳道 note / 数据说明 ---------- */
const stE4 = cfg.flow.edges.find((e: any) => e.from === "st" && e.to === "e4");
if (stE4?.label !== "策略/阈值下行") throw new Error(`st→e4 标签已非预期值：${stE4?.label}；中止写入`);
stE4.label = "策略与阈值生效";
if (cfg.flow.lanes[0].note !== "触点入口 → 反馈与画像迭代闭环") throw new Error("泳道0 note 已非预期值；中止写入");
cfg.flow.lanes[0].note = "页面入口 → 反馈与画像迭代闭环";
const r12 = cfg.flow.nodes.find((n: any) => n.id === "r12");
if (r12.beforeAfter?.[0]?.after !== "四场景全覆盖，上下文随场景装配") throw new Error("r12 beforeAfter 已非预期值；中止写入");
r12.beforeAfter[0].after = "四场景全覆盖，背景信息随场景带全";
cfg.flow.dataSupport = "数据支撑｜单位内历史订单与常购统计 → 单位常购；商品标准属性/同款商品组/可用语义数据 → 相似商品；单位内订单品类映射与经常一起买统计 → 关联品类；目录、权限、供应条件 → 采购硬约束过滤。";
cfg.metricNote = "口径说明：本页为推荐架构工作流与设计方案。推荐点击率、加购率、零结果挽回率等指标需按场景建立评测集和实际基线；成交、取消、验收等下游事件仅在数据可稳定关联时纳入评估。未经实测的备选规模、刷新时效、成本节约比例与审计覆盖范围均不得标为已实现结果。";
const cmp0 = cfg.compare.find((c: any) => c.dim === "找货");
if (cmp0?.after !== "根据首页、详情页、购物车与零结果触点提供对应候选") throw new Error("compare[找货] 已非预期值；中止写入");
cmp0.after = "根据首页、详情页、购物车与零结果页提供对应备选";
const cmp3 = cfg.compare.find((c: any) => c.dim === "数据");
if (cmp3?.after !== "按实际采集和可关联的事件建立分触点评估与迭代") throw new Error("compare[数据] 已非预期值；中止写入");
cmp3.after = "按实际采集和可关联的事件建立分场景评估与迭代";

/* ---------- 校验一：黑话禁词在用户可见字段清零 ---------- */
const BANNED = ["触点", "候选", "共现", "近邻", "同款簇", "冷启动", "统计依据", "全量混跑", "支持度", "时间衰减", "阈值下行", "上下文", "稀疏", "样本量"];
function* visibleStrings(o: any, path: string): Generator<[string, string]> {
  if (typeof o === "string") { yield [path, o]; return; }
  if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) yield* visibleStrings(o[i], `${path}[${i}]`); return; }
  if (o && typeof o === "object") { for (const [k, v] of Object.entries(o)) yield* visibleStrings(v, `${path}.${k}`); }
}
const visibleRoot: any = {
  scenarios: cfg.scenarios, constraints: cfg.constraints, subtitle: cfg.subtitle, metricNote: cfg.metricNote, compare: cfg.compare,
  flow: { bizContext: cfg.flow.bizContext, dataSupport: cfg.flow.dataSupport, lanes: cfg.flow.lanes, edges: cfg.flow.edges, chain: cfg.flow.chain },
};
for (const n of cfg.flow.nodes) {
  visibleRoot[`node:${n.id}`] = (({ x, y, w, h, laneIndex, col, row, kind, no, aip, id, ...rest }: any) => rest)(n);
}
const hits: string[] = [];
for (const [path, s] of visibleStrings(visibleRoot, "")) {
  for (const b of BANNED) if (s.includes(b)) hits.push(`${path} 含「${b}」: ${s.slice(0, 50)}`);
}
if (hits.length) { console.error("黑话残留：\n" + hits.join("\n")); throw new Error("禁词未清零；中止写入"); }

/* ---------- 校验二：变更路径 ⊆ 白名单 ---------- */
function changedPaths(a: any, b: any, path = ""): string[] {
  const out: string[] = [];
  if (type(a) !== type(b)) return [path || "<root>"];
  if (Array.isArray(a)) {
    if (a.length !== b.length) out.push(`${path}[len]`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) out.push(...changedPaths(a[i], b[i], `${path}[${i}]`));
  } else if (a && typeof a === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out.push(...changedPaths(a[k], b[k], path ? `${path}.${k}` : k));
  } else if (a !== b) out.push(path);
  return out;
  function type(v: any) { return Array.isArray(v) ? "arr" : v === null ? "null" : typeof v; }
}
const GEO = ["x", "y", "w", "h", "laneIndex", "col", "row", "kind", "no", "aip", "id"];
const allowed = (p: string) => {
  const m = p.match(/^flow\.nodes\[(\d+)\]\.(.*)$/);
  if (m) return !GEO.some(g => m[2] === g || m[2].startsWith(`${g}.`) || m[2].startsWith(`${g}[`));
  return /^(scenarios\[\d+\]\.solution(\.|$)|constraints\[\d+\]\.(card|decision|land)$|flow\.edges\[\d+\]\.label$|flow\.lanes\[0\]\.note$|flow\.dataSupport$|metricNote$|compare\[\d+\]\.after$)/.test(p);
};
const bad = changedPaths(before, cfg).filter(p => !allowed(p));
if (bad.length) { console.error("白名单外变更：\n" + bad.join("\n")); throw new Error("出现预期外字段变更；中止写入"); }

writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
console.log(`✓ 已修复 ${file}`);
console.log("✓ 黑话禁词清零 ｜ 变更路径全部在白名单内");
console.log(`✓ 备份：${backup}`);
console.log("下一步执行：npm run layout && npm run validate && npm run build");
