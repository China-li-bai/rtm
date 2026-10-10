/**
 * 新建场景页：AI 对话导购（ai-chat-guide）
 *
 * 事实源：knowledge/product/product/01-prd/搜索中台/AIP-024-028-AI对话导购.md（Frozen v1.0）
 * 用户需求：落地「AI对话导购：从场景需求到可采购清单」设计稿，并做保利物业行业化五项改造：
 *   ① 条件组合示例去 B2C（蓝牙耳机→保安制服/电梯润滑油）；② 澄清维度补项目/收货地+预算归属/成本中心；
 *   ③ 数据支撑补协议标签（集采协议内商品）+推荐优先协议商品；④ 关键规则补「预算与合规校验优先」；
 *   ⑤ 场景需求补三例（售楼处营销物料/地下车库防汛物资包/新入职客服团队办公用品）。
 *
 * 纪律：几何字段（x/y/h/route/labelAt/top/height）写占位值，由 npm run layout 重算回写；
 * 术语表沿用任务 Z（触点/候选/共现/上下文等 14 禁词）+ 本页新增 B2C 禁词（蓝牙耳机/跑步/降噪）。
 */
import { existsSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "scenarios", "ai-chat-guide.json");

/** 黑话禁词：任务 Z 术语表 + 本页 B2C 痕迹词 */
const BANNED = [
  "触点", "候选", "共现", "近邻", "同款簇", "冷启动", "统计依据", "全量混跑",
  "支持度", "时间衰减", "阈值下行", "上下文", "稀疏", "样本量",
  "蓝牙耳机", "跑步", "降噪",
];

/** 与 src/schema/rules.ts 同源的量化口径检查（compare/beforeAfter 红线5） */
const QUANT_CLAIM = /\d+(\.\d+)?\s*[%％万亿条倍分钟小时天元个次叶行款家单]/;
const CALIBER_WORDS = ["示意", "约", "≈", "基线", "SOW", "实测", "示例", "对标"];

type Node = Record<string, unknown> & { id: string; w: number; laneIndex: number; col?: number; row?: number; solves: Array<{ ref: string; how: string }> };
type Edge = { from: string; to: string; style?: string; label?: string };

// ———————————————————— 配置正文 ————————————————————

const scenarios = [
  {
    id: "S1", name: "活动物料临时凑不齐", tag: "问得出", kw: "品类杂",
    card: "售楼处下月开放，易拉宝、礼品、指示牌、茶歇耗材……品类杂又没现成清单模板，只能逐项想、逐项搜，漏项靠领导把关。",
    story: {
      who: "下个月售楼处要开放，行政专员正在准备开放当天的营销物料。",
      stuck: "易拉宝、小礼品、指示牌、茶歇耗材……没有现成的清单模板，他只能一项项想、一项项搜，漏了哪项要等领导提醒再补采。",
      consequences: [
        "品类杂没有模板，靠人逐项回忆，漏项要领导把关才发现。",
        "每一项都要拆关键词搜索，一整天耗在搜索框和翻页里。",
        "买回来才发现规格不合现场尺寸，二次补采耽误开放筹备。",
      ],
    },
    solution: {
      who: "他对 AI 导购说：下月售楼处开放，要一批营销物料，保利天悦项目用，预算先按 3000 元以内。",
      smooth: "AI 按活动场景反问易漏的品类与数量，凑成一张可采购清单，集采协议内商品排在前面并注明，他只需确认和微调。",
      effects: [
        "易漏品类由 AI 按场景提醒，清单不再靠人背模板。",
        "一句场景描述替代逐项拆词搜索，确认即可下单申请。",
        "规格与场地条件在追问中确认，降低买错重购。",
      ],
    },
  },
  {
    id: "S2", name: "型号绑定的物资怕买错", tag: "匹配得上", kw: "型号绑定",
    card: "防汛沙袋、潜水泵、匹配现场电梯型号的专用润滑油——型号错了就是废品，可型号参数采购人自己说不全。",
    story: {
      who: "汛期前，项目工程主管正在为地下车库配防汛应急物资包，顺带补电梯保养用的专用润滑油。",
      stuck: "沙袋尺寸、水泵口径他还记得，但润滑油必须匹配现场电梯型号，他记不全型号参数；搜索框里输入「电梯润滑油」出来几百种，不敢下单。",
      consequences: [
        "型号参数说不全，只能翻维保合同或问工程师，一来一回好几天。",
        "搜出一堆商品不敢挑，买错型号退货浪费预算。",
        "应急物资窗口期短，等确认完汛期已经到了。",
      ],
    },
    solution: {
      who: "他对 AI 导购说：配一批地下车库防汛应急物资，另外要匹配现场电梯型号的专用润滑油。",
      smooth: "AI 追问电梯型号、水泵口径等关键参数，按型号在可售目录里检索并写清匹配依据，清单每项都答得出「为什么匹配」。",
      effects: [
        "关键参数由 AI 追问补齐，不用翻合同问工程师。",
        "检索按型号过滤并给出匹配理由，买错型号的风险降到最低。",
        "一次对话配齐全套应急物资，赶在汛期前到货。",
      ],
    },
  },
  {
    id: "S3", name: "新团队到岗按标准配齐", tag: "算得清", kw: "数量预算",
    card: "新入职 5 人客服团队要配齐办公用品，单人标准 800 元——总数、预算归属、开票项目，采购人要自己算清楚。",
    story: {
      who: "客服部门新入职 5 名员工下周到岗，行政专员正在按入职标准配齐办公用品。",
      stuck: "工位椅、电脑外设、文具按单人标准 800 元配，总预算多少、走哪个项目的成本中心，她要自己拿计算器算，还要逐项核对商品在不在本项目可用目录里。",
      consequences: [
        "数量乘单价再对标准，全靠人工核算，算错预算就被审批退回。",
        "逐项核对商品是否在本项目可见目录内，费时且容易漏。",
        "发票项目与预算科目对不上，报销被财务退回。",
      ],
    },
    solution: {
      who: "她对 AI 导购说：新入职 5 人客服团队配齐办公用品，单人标准 800 元以内，走保利天悦项目成本中心。",
      smooth: "AI 自动换算总预算上限 4000 元并挂到对应成本中心，只在该项目可见目录内组清单，超预算前主动提醒。",
      effects: [
        "预算换算由 AI 完成，总价上限自动带入采购条件。",
        "目录范围自动过滤，清单内商品均该项目可采。",
        "清单挂对预算归属，报销口径一次对齐。",
      ],
    },
  },
  {
    id: "S4", name: "复杂条件拆不成关键词", tag: "说得出", kw: "条件组合",
    card: "「单价 50 元以内、夏季、透气款的保安制服」——一句话里价格、季节、款式全有，关键词搜索却只能一个条件一个条件试。",
    story: {
      who: "保安队长要为夏季换装采购一批透气款保安制服，单价控制在 50 元以内。",
      stuck: "「50 元以内、夏季、透气款」三个条件挤在一句话里，搜索框一次只能试一个词，改来改去结果不是超价就是不透气。",
      consequences: [
        "多条件需求拆成多次搜索，反复调整关键词。",
        "搜到的商品要逐个点开核对价格与款式。",
        "不会拆词的采购人直接放弃线上搜索，转线下问人。",
      ],
    },
    solution: {
      who: "他对 AI 导购说：单价 50 元以内、夏季、透气款的保安制服，要 200 套。",
      smooth: "AI 一句话解析出品类、预算、季节场景、款式要求与数量，自动换算总价上限 1 万元，直接给出符合全部条件的清单。",
      effects: [
        "一句话完成条件组合，不用逐个试关键词。",
        "清单先过全部条件再展示，不用逐个点开核对。",
        "不会拆词的采购人也能自助完成采购检索。",
      ],
    },
  },
];

const constraints = [
  {
    id: "C1", name: "推荐数字必须来自检索原值", kw: "防幻觉",
    card: "大模型会「顺嘴编」价格库存。规矩：模型只组织语言，价格、库存、协议价全部代码层回填系统原值。",
    reality: "大模型生成文本时会编造看起来合理的数字，价格错一角都是采购事故。",
    decision: "模型只组织语言不产生数字：推荐卡上的价格、库存、协议价由代码层校验后回填检索原值，模型输出不含自造数字。",
    land: "05 生成清单时每个数字回填自 04 检索原值并留痕（chat_rec_card.source_values），模型不可改写（PRD FR-6/AC-8）。",
  },
  {
    id: "C2", name: "预算与合规校验优先", kw: "预算合规",
    card: "集采强依赖项目预算池与目录边界。清单生成时先校验预算余量与目录边界，超限提示风险、目录外直接拦截。",
    reality: "AI 若只顾「推荐得好」，超预算或目录外商品进了清单，采购申请会在审批环节被退回，白忙一场。",
    decision: "生成清单前先校验项目预算余量与目录边界：超限主动提示风险并建议替换，目录外商品不进清单；集团统一招标的集采协议内商品优先推荐并在理由中注明。",
    land: "05 生成清单时预算对照项目余量、目录对照可见范围，协议商品带协议标签排序靠前（04 检索先行过滤目录与权限）。",
  },
  {
    id: "C3", name: "克制的助手：不代客下单", kw: "域内克制",
    card: "对话式界面容易让用户期待「全托管」。定位：推荐到加购为止，下单回交易域走既有审批流，域外问题礼貌拒答。",
    reality: "工具代下单出了错说不清责任；闲聊问答还会把成本烧在无关调用上。",
    decision: "对话只到清单与加购为止，下单回交易域走既有审批；域外问题礼貌拒答并引导回商品采购域。",
    land: "06 确认·加购后流程交回交易系统，对话域不留下单闭环（PRD N1/N2）。",
  },
  {
    id: "C4", name: "成本与时延可控", kw: "成本时延",
    card: "大模型按次计费，全链路都走模型成本不可控。一次对话最多两次模型调用，超时降级无理由纯列表。",
    reality: "解析、追问、组织推荐若每步都调模型，按次成本随会话轮次放大，时延也叠加。",
    decision: "解析与推荐组织两次模型调用为上限；模型服务超时降级为无理由纯列表，结果仍可看可加购。",
    land: "02 解析与 05 组织推荐各一次调用（实测口径 1.1s/2.4s）；超时走异常兜底降级路径（MVP-2 已验证）。",
  },
];

const nodes: Node[] = [
  // ———— 主链（列分配：换泳道继承列、同泳道进列；s1 显式 col:3 覆盖防 g3/g5 同泳道同列碰撞）————
  {
    id: "u1", laneIndex: 0, w: 170, x: 130, y: 0, no: "01",
    title: "一句话说出采购需求",
    sub: "场景 + 条件 + 数量，不用拆关键词",
    aip: "（用户动作，无功能编号）",
    solves: [
      { ref: "S1", how: "行政专员一句话说出活动场景，物料品类交给 AI 追问补齐。" },
      { ref: "S2", how: "工程主管说出现场与电梯型号线索，参数缺口留给追问。" },
      { ref: "S3", how: "说出人数与单人标准，数量换算交给 AI。" },
      { ref: "S4", how: "三个条件一句话说完，不逐个试关键词。" },
    ],
    legacy: "以前采购人要把需求翻译成搜索关键词：一次一个词、翻页筛选，复杂条件靠自己拆。",
    whyAi: "关键词表达不了「场景+条件+数量」混在一句话里的需求，拆不好词的人直接搜不到或零结果。",
    humanRole: "采购人从「拆词的人」变成「说需求的人」：说清场景与底线条件即可。",
    risks: [{ risk: "采购人说出域外需求或闲聊", guard: "礼貌拒答并引导回商品采购域（PRD N2）。" }],
    fallback: "输入不可理解时明确说「没听懂」并给示例，不瞎猜（PRD AC-E1）。",
    metrics: [{ m: "首轮表达完成率", v: "目标：一句话即可进入解析（对标行业对话导购）" }],
    trace: ["采购人 · 需求人", "商城前端 · 对话输入框", "chat_session / chat_turn 留痕"],
    ai: "AI 在这一步只做「听」：完整接收自然语言原话，不强制表单字段，不要求懂类目体系。",
    process: [
      "采购人用一句话说出场景与条件（如「下月售楼处开放，要一批营销物料，保利天悦项目用」）。",
      "可顺带补充预算上限、数量、期望到货时间。",
      "表达不完整没关系，缺的条件由后续追问补齐。",
    ],
    highlights: ["不要求拆关键词、不要求懂类目体系，零门槛表达", "场景原话直接进入解析与会话留痕"],
    beforeAfter: [{ dim: "需求表达", before: "逐个关键词搜索、反复换词（示意）", after: "一句话说清场景与条件" }],
  },
  {
    id: "g1", laneIndex: 2, w: 175, x: 130, y: 0, no: "02",
    title: "解析需求五要素",
    sub: "品类 · 场景 · 预算 · 规格 · 品牌",
    aip: "AIP-025",
    solves: [
      { ref: "S3", how: "解析「5 人 × 单人标准 800 元」并自动换算总预算上限 4000 元（示意）。" },
      { ref: "S4", how: "一句话里的价格、季节、款式条件一次解析成结构化字段，不用逐个试词。" },
    ],
    legacy: "以前靠采购人自己拆：类目要懂、规格要查、总价要拿计算器算，拆错就搜偏。",
    whyAi: "五要素混在一句话里，关键词检索天然拆不开；需求解析 MVP-1 实测 1.1s 完成结构化（PRD §6.2）。",
    humanRole: "采购人不再翻译需求；解析结果回显在对话里，他只纠错不拆词。",
    risks: [{ risk: "解析出错或漏要素", guard: "解析结果回显采购人确认，关键字段缺失走追问而不是猜。" }],
    fallback: "需求不可理解时明确说「没听懂」并给示例，禁止瞎猜推荐（PRD FR-2/AC-E1）。",
    metrics: [
      { m: "解析耗时", v: "实测 1.1s（MVP-1 口径）" },
      { m: "解析准确率", v: "评测集 500+ 对话标注口径（PRD §7）" },
    ],
    trace: ["AIP-025 需求解析", "采购需求解析 MVP-1", "chat_turn.parse 结构化留痕"],
    ai: "把自然语言拆成品类、场景、预算、规格、品牌五个字段；听到「200 套单价 50 以内」时自动换算总价上限并带入检索，听不懂就明说。",
    process: [
      "拆解品类 / 场景 / 预算 / 规格 / 品牌五要素。",
      "「200 套单价 50 元以内」自动换算总价上限 1 万元（示意）并带入检索条件。",
      "解析结果与依据回显给采购人确认。",
    ],
    highlights: ["五要素 + 数量换算一次完成", "解析留痕（chat_turn.parse），可复盘可评测"],
    beforeAfter: [{ dim: "需求拆解", before: "人工拆词 + 计算器核价（示意）", after: "五要素自动解析、总价自动换算（实测 1.1s）" }],
  },
  {
    id: "gx", laneIndex: 2, w: 88, x: 400, y: 0, kind: "diamond",
    title: "需求完整？",
    solves: [{ ref: "S2", how: "型号、口径等关键参数缺失时判「不完整」，宁可追问不瞎猜。" }],
    legacy: "以前需求要素全不全没人检查，搜出来一堆再人工筛。",
    whyAi: "参数缺口（电梯型号、水泵口径）人工最容易漏，AI 按品类模板逐项核对。",
    humanRole: "采购人按提示补一两句即可，不用自查要素清单。",
    risks: [{ risk: "完备标准配得过严，句句追问惹人烦", guard: "只追问影响检索命中与合规的关键字段，其余缺省。" }],
    fallback: "判断不了时按不完整处理，走追问确认。",
    metrics: [{ m: "追问触发率", v: "运营观测（按品类模板统计）" }],
    trace: ["AIP-025 解析完备性检查", "品类关键参数模板", "gx→g3 追问 / gx→s1 检索分流"],
    ai: "对照品类参数模板检查五要素与关键参数：缺什么标记出来交给追问，齐备就直接进检索。",
    process: ["对照品类模板核对五要素与关键参数。", "缺关键字段转入多轮澄清；齐备直接进入检索。"],
    highlights: ["宁可追问不瞎猜，把「买错型号」拦在下单前"],
    beforeAfter: [{ dim: "要素把关", before: "靠采购人自查，漏了才发现（示意）", after: "按品类模板自动核对，缺口必追问" }],
  },
  {
    id: "g3", laneIndex: 2, w: 190, x: 640, y: 0, no: "03",
    title: "多轮澄清补齐条件",
    sub: "项目/收货地 · 预算归属/成本中心 · 型号参数 · 到货时间",
    aip: "AIP-026",
    panelTitle: "多轮澄清：缺什么问什么，凑齐结构化采购条件",
    solves: [
      { ref: "S1", how: "活动物料品类杂，AI 按场景反问易漏品类与数量，凑成完整清单。" },
      { ref: "S2", how: "追问电梯型号、水泵口径等关键参数，不用翻维保合同问工程师。" },
      { ref: "S3", how: "确认项目归属与成本中心，预算校验有挂靠对象。" },
      { ref: "S4", how: "补充「要有反光条」这类条件后，结果自动收敛且前几轮条件不丢。" },
    ],
    legacy: "以前缺口靠采购人自查：翻合同查型号、问财务查预算、问项目查收货地，一来一回好几天。",
    whyAi: "B2B 采购的关键条件（项目、预算归属、型号）分散在多个系统里，AI 按品类模板逐项追问比人记得全。",
    humanRole: "采购人只答问题不查系统；答案即条件，随话写入采购要求。",
    risks: [
      { risk: "追问过多把对话变审问", guard: "只问影响检索与合规的关键字段，单会话轮次上限可配（默认 20 轮，PRD Q1）。" },
    ],
    fallback: "达到轮次上限时提示开新会话，历史会话仍可回顾（PRD AC-E3）。",
    metrics: [{ m: "多轮完成率", v: "多轮会话达成加购比例（PRD §7 口径）" }],
    trace: ["AIP-026 多轮对话", "chat_turn 会话条件合并", "项目 / 预算系统接口"],
    ai: "按品类模板缺什么问什么：问收货地（「这批物资送往保利天悦项目，还是总部办公楼？」）、问预算归属（提示该项目本月预算余量并确认是否继续）、问型号参数与到货时间；补充条件并入前几轮会话条件一起重新解析。",
    process: [
      "问项目与收货地：「这批物资是送往保利天悦项目，还是总部办公楼？」",
      "确认预算归属：提示该项目本月预算余量（如「保洁耗材预算剩余约 3000 元，示意」，数字来自预算系统原值），确认是否继续。",
      "追问电梯型号、水泵口径、数量、期望到货时间等关键字段。",
      "补充条件并入会话条件重新解析，结果逐步收敛。",
    ],
    highlights: [
      "B2B 关键维度（项目 / 成本中心 / 收货地 / 型号）进追问模板，集采强依赖的条件不缺位",
      "预算余量提示来自系统原值，不做无依据承诺",
    ],
    beforeAfter: [{ dim: "条件补齐", before: "翻合同、问财务、问项目，一来一回数天（示意）", after: "关键字段 AI 追问，一次对话内补齐" }],
  },
  {
    id: "s1", laneIndex: 3, col: 3, w: 185, x: 900, y: 0, no: "04",
    title: "检索单位可售商品池",
    sub: "双路召回 · 目录与权限过滤 · 只出原值",
    aip: "AIP-025（检索执行）",
    solves: [
      { ref: "S2", how: "按电梯型号等关键参数过滤可售商品，型号不匹配的进不了结果。" },
      { ref: "C1", how: "价格、库存、协议价全部取检索原值，推荐层不可改写。" },
      { ref: "C2", how: "仅在该单位 / 项目可见目录内检索，目录外商品不进结果。" },
    ],
    legacy: "以前检索结果全站混出，无权采、目录外商品混在列表里，采购人点进去才发现不可采。",
    whyAi: "语义检索兜住「写法不同但实际相近」的商品表达，型号类硬条件由结构化字段精确过滤。",
    humanRole: "采购人不再逐个点开核对「能不能采」——进清单的都是本单位可采的。",
    risks: [{ risk: "检索条件过严导致零结果", guard: "如实告知「没找到」并给放宽建议（如「去掉反光条要求有 5 款，示意」），不硬凑。" }],
    fallback: "零结果转兜底建议与人工承接，禁止拿不匹配商品硬凑（PRD AC-E2）。",
    metrics: [{ m: "检索命中 · 零结果率", v: "运营观测（搜索日志口径）" }],
    trace: ["搜索中台双路召回", "目录 / 权限中心过滤", "chat_rec_card.source_values 原值"],
    ai: "用结构化条件在单位可售商品池里双路检索（关键词 + 语义），同时过目录、权限、单位偏好与采购资格边界，输出的每一行都是系统里的真实在售商品。",
    process: [
      "结构化条件进入商品池双路检索（关键词 + 语义）。",
      "按单位与项目过滤可见目录、采购资格与单位偏好。",
      "输出行均为真实在售商品，价格库存为系统原值。",
    ],
    highlights: ["检索原值是推荐数字的唯一来源", "目录外 / 无权采商品在下清单前就被过滤"],
    beforeAfter: [{ dim: "结果可信度", before: "全站混出，点开才知道能不能采（示意）", after: "进清单的都是本单位可采商品" }],
  },
  {
    id: "g5", laneIndex: 2, w: 200, x: 900, y: 0, no: "05", kind: "highlight",
    title: "生成清单 · 预算合规校验",
    sub: "集采协议商品优先 · 超预算提示 · 数字回填原值",
    aip: "AIP-025/027",
    panelTitle: "生成清单：预算与合规校验优先，协议商品优先推荐",
    solves: [
      { ref: "S1", how: "按场景组织成一张可采购清单，集采协议内商品排前并注明理由。" },
      { ref: "S4", how: "推荐理由写清条件命中依据（预算 / 型号 / 偏好），每一条可回溯。" },
      { ref: "C1", how: "模型只组织语言不产生数字：价格 / 库存 / 协议价代码层回填检索原值（PRD FR-6/AC-8）。" },
      { ref: "C2", how: "清单生成前先校验项目预算余量与目录边界，超限提示风险并建议替换；集团统一招标的集采协议内商品优先推荐。" },
      { ref: "C4", how: "解析与推荐组织两次模型调用为上限，控制按次成本。" },
    ],
    legacy: "以前清单靠采购人自己拼：搜、比、算、核目录，预算超没超要等审批环节才发现。",
    whyAi: "清单组织要同时满足预算、目录、协议、偏好多重规则，人工拼清单慢且漏；推荐出口 MVP-2 实测 2.4s。",
    humanRole: "采购人从「拼清单的人」变成「审清单的人」：确认、微调、替换。",
    risks: [
      { risk: "模型顺嘴编价格库存（幻觉）", guard: "数字全部代码层校验回填检索原值，模型输出不含自造数字。" },
      { risk: "清单超项目预算被审批退回", guard: "生成时即对照预算余量校验，超限提示风险并给出替换建议。" },
    ],
    fallback: "模型组织超时降级为无理由纯列表，结果仍可看可加购（MVP-2 已验证降级路径）。",
    metrics: [
      { m: "推荐组织耗时", v: "实测 2.4s（MVP-2 口径）" },
      { m: "对话导购转化率", v: "对话产生加购 / 下单比例（PRD §7）" },
    ],
    trace: ["AIP-027 单位偏好生效", "chat_rec_card 推荐卡留痕", "模型服务（云端按次）"],
    ai: "把检索原值组织成推荐清单：集团统一招标的集采协议内商品优先并标注协议标签，清单总价对照项目预算余量，每项写清「为什么推荐」；模型只组织语言，数字全部回填系统原值。",
    process: [
      "按单位偏好（品类范围 / 品牌偏好 / 价格区间 / 供应商地域）组织排序，集采协议内商品带协议标签排序靠前。",
      "清单总价对照该项目预算余量：超限主动提示风险并建议替换，目录外商品直接拦截。",
      "每项推荐写清条件命中理由，价格、库存、协议价全部回填检索原值。",
    ],
    highlights: ["预算与合规校验在生成时前置，不等审批才发现", "协议商品优先 + 理由可回溯，推荐数字零自造"],
    beforeAfter: [{ dim: "清单生成", before: "人工搜比算拼清单，超预算审批时才发现（示意）", after: "规则前置校验 + 原值回填，清单即审即用（推荐实测 2.4s）" }],
  },
  {
    id: "u3", laneIndex: 0, w: 185, x: 900, y: 0, no: "06",
    title: "确认 · 加购 · 提交申请",
    sub: "清单转入交易域，走既有审批流",
    aip: "（下单回交易域——N1 克制定位）",
    solves: [
      { ref: "S1", how: "清单确认或微调后一键加购，活动物料一次备齐。" },
      { ref: "S2", how: "型号匹配依据随清单进审批，采买双方都看得见。" },
      { ref: "S3", how: "预算归属与总价随申请单带入，报销口径一次对齐。" },
      { ref: "C3", how: "对话只到清单与加购为止，下单回交易域走既有审批流（PRD N1）。" },
    ],
    legacy: "以前比选结果散落在多个页面和聊天记录里，组单靠手工誊抄。",
    whyAi: "对话确认的清单连同条件依据一键进入交易域，比选到下单不断线，权责仍留在既有审批体系。",
    humanRole: "采购人做最终决策：确认、替换、加购、提交申请。",
    risks: [{ risk: "用户期待对话里直接完成下单", guard: "明示「推荐到加购为止」，下单动作回交易域（N1）。" }],
    fallback: "加购失败或商品状态变化时回到清单重新校验，价格库存以交易域实时复核为准。",
    metrics: [{ m: "加购转化", v: "对话产生加购比例（PRD §7 口径）" }],
    trace: ["交易域 · 加购下单", "chat_rec_card → 购物车", "AIP-024 出口契约"],
    ai: "这一步 AI 不越位：不代客下单、不改价格，把确认好的清单与条件依据原样交给交易域，动态状态在采购操作时二次复核。",
    process: [
      "采购人确认清单，或替换个别商品后重新校验。",
      "一键加购，价格库存按交易域规则实时复核。",
      "提交采购申请进入既有审批流。",
    ],
    highlights: ["不代客下单，权责清晰（N1）", "比选到下单不断线，条件依据随单可查"],
    beforeAfter: [{ dim: "责任边界", before: "工具代下单出错责任不清（示意）", after: "推荐到加购为止，审批走既有流程" }],
  },
  {
    id: "bar1", laneIndex: 1, row: 1, w: 200, x: 130, y: 0, no: "07", kind: "bar",
    title: "会话留痕 · 历史可续聊",
    aip: "AIP-028",
    solves: [{ ref: "S4", how: "对话与清单全程留痕，比选周期长的采购隔天接着聊（AIP-028）。" }],
    legacy: "以前比选过程散在聊天记录与纸上，换个人接手就断线。",
    whyAi: "留痕让长周期采购可交接、可复盘，也是解析评测集的数据底座。",
    humanRole: "采购人与接手同事都能从历史会话续聊。",
    risks: [{ risk: "对话数据留存合规风险", guard: "留存 1 年、导出脱敏（与搜索日志同口径，PRD Q2 待复核项按默认执行）。" }],
    fallback: "用户可自行删除会话（级联删除轮次，PRD FR-5）。",
    metrics: [{ m: "历史会话续聊率", v: "运营观测指标" }],
    trace: ["AIP-028 历史会话", "会话 / 轮次 / 偏好 / 推荐卡四表", "会话列表 · 一键继续"],
    ai: "每轮对话、解析结果与推荐卡全程留痕；历史会话可回顾、可一键继续、可删除，推荐依据事后可回溯。",
    process: [
      "每轮对话与推荐卡写入会话留痕。",
      "历史会话可回顾、可续聊、可删除。",
      "解析与推荐数据沉淀为评测集素材。",
    ],
    highlights: ["四表留痕（会话 / 轮次 / 偏好 / 推荐卡），全程可回溯", "续聊不丢前几轮条件"],
    beforeAfter: [],
  },
  // ———— 非主链节点（必须显式 col）————
  {
    id: "c1", laneIndex: 1, col: 0, row: 0, w: 170, x: 130, y: 0,
    title: "进入 AI 对话导购",
    sub: "搜索页常驻入口 · 历史会话可续聊",
    aip: "AIP-024/028",
    panelTitle: "进入 AI 对话导购（双模式入口 · 历史会话）",
    solves: [{ ref: "S4", how: "关键词零结果时一键切换对话模式，不换工具不断线。" }],
    legacy: "以前只有关键词搜索一个入口，搜不到就换词或线下问人；比选周期长的需求中间过程没有留痕。",
    whyAi: "入口常驻加历史会话恢复，长周期采购的比选过程才接得上。",
    humanRole: "采购人自主选择模式：明确品类用关键词，说不清就用对话。",
    risks: [{ risk: "用户把对话当成全能助手（下单、闲聊）", guard: "域内定位边界明确——推荐到加购为止，域外拒答引导。" }],
    fallback: "对话服务不可用时入口隐藏，关键词搜索不受影响。",
    metrics: [{ m: "入口点击量", v: "运营观测指标（商城埋点）" }],
    trace: ["搜索页 · AI 对话入口", "chat_session 历史列表", "AIP-024 双模式切换"],
    ai: "提供常驻「AI 对话」入口，与关键词搜索双模式并存互切不丢已输入条件；打开时加载该采购人的历史会话。",
    process: [
      "搜索页点击「AI 对话」一键切换；关键词模式零结果时主动引导切换。",
      "模式互切不丢已输入的条件。",
      "加载历史会话列表，可一键继续上次对话（AIP-028）。",
    ],
    highlights: ["双模式并存，各自最优场景（N3）", "历史会话一键续聊，比选周期长的采购不断线"],
    beforeAfter: [{ dim: "需求入口", before: "只有搜索框，搜不到就换词（示意）", after: "关键词 / 对话双入口，零结果时引导切换" }],
  },
  {
    id: "h1", laneIndex: 5, col: 2, row: 0, w: 170, x: 640, y: 0,
    title: "异常兜底 · 转人工",
    sub: "没听懂不瞎猜 · 零结果给建议 · 超时有降级",
    aip: "（人工承接 · 运营兜底）",
    solves: [
      { ref: "C1", how: "解析失败明确说「没听懂」并给示例，禁止瞎猜推荐（PRD AC-E1）。" },
      { ref: "C4", how: "模型超时降级无理由纯列表；复杂诉求转人工客服与商城运营承接。" },
    ],
    legacy: "以前异常就是「没有结果」四个字，用户只能退出或换渠道。",
    whyAi: "诚实兜底保住信任：宁可少推荐，不拿不匹配商品凑数。",
    humanRole: "人工客服承接复杂诉求；商城运营看会话沉淀优化品类与规则。",
    risks: [{ risk: "兜底话术生硬造成体验断层", guard: "兜底必带下一步建议（示例 / 放宽条件 / 转人工三选一）。" }],
    fallback: "转人工客服队列，会话记录同步给客服。",
    metrics: [{ m: "兜底触发率", v: "运营观测（解析失败 + 零结果 + 超时占比）" }],
    trace: ["人工客服工作台", "商城运营 · 会话分析", "PRD §6.4 异常矩阵"],
    ai: "兜底三条路：解析失败给示例引导重新表达；检索零结果给放宽建议；模型超时降级纯列表——都不凑数、不硬推。",
    process: [
      "解析失败：明确「没听懂」+ 示例引导重新表达。",
      "检索零结果：如实告知 + 放宽建议（如「去掉反光条要求有 5 款，示意」）。",
      "模型超时：降级无理由纯列表；复杂诉求转人工客服。",
    ],
    highlights: ["异常路径全覆盖（PRD §6.4 异常矩阵）", "会话数据反哺运营：品类缺口与规则优化线索"],
    beforeAfter: [],
  },
  // ———— 商品 · 目录 · 权限中心 数据 pills ————
  {
    id: "d1", laneIndex: 4, col: 0, row: 0, w: 165, x: 130, y: 0,
    title: "用户与组织身份数据",
    aip: "（数据支撑，无功能编号）",
    solves: [{ ref: "C2", how: "按单位与用户身份确定可见范围与采购资格边界。" }],
    ai: "提供单位、部门与用户身份数据，检索与校验据此限定「谁能采什么」。",
    process: ["单位 / 部门 / 用户身份供检索与权限过滤。"],
    highlights: ["身份即边界：单位内数据不外泄"],
    legacy: "以前身份与权限分散在各系统，检索层不感知。",
    trace: ["组织架构 · 权限中心"],
    beforeAfter: [],
  },
  {
    id: "d2", laneIndex: 4, col: 2, row: 0, w: 175, x: 640, y: 0,
    title: "项目与预算归属数据",
    aip: "（数据支撑，无功能编号）",
    solves: [{ ref: "C2", how: "项目预算余量与成本中心数据供清单校验与提示。" }],
    ai: "提供项目、成本中心与预算余量数据，追问提示与清单校验的数字都来自这里。",
    process: ["项目 / 成本中心 / 预算余量供澄清提示与合规校验。"],
    highlights: ["预算提示有系统原值依据"],
    legacy: "以前预算余量要登录财务系统人工查询。",
    trace: ["项目主数据 · 预算系统"],
    beforeAfter: [],
  },
  {
    id: "d3", laneIndex: 4, col: 3, row: 0, w: 175, x: 900, y: 0,
    title: "目录与采购规则数据",
    aip: "（数据支撑，无功能编号）",
    solves: [{ ref: "C2", how: "可见目录与采购规则供检索过滤，目录外商品不进清单。" }],
    ai: "提供单位可见目录、采购与禁采规则，检索层据此过滤。",
    process: ["可见目录 / 采购规则 / 禁采清单供检索过滤。"],
    highlights: ["目录边界前置到检索"],
    legacy: "以前目录边界靠采购人记忆与审批把关。",
    trace: ["商品目录中心 · 采购规则"],
    beforeAfter: [],
  },
  {
    id: "d4", laneIndex: 4, col: 3, row: 1, w: 175, x: 900, y: 0,
    title: "价格 · 库存 · 配送原值",
    aip: "（数据支撑，无功能编号）",
    solves: [{ ref: "C1", how: "价格 / 库存 / 配送数字的唯一来源，推荐层只回填不产生。" }],
    ai: "提供商品价格、库存与配送数据的系统原值，推荐卡数字全部回填自此。",
    process: ["价格 / 库存 / 配送原值供推荐卡回填。"],
    highlights: ["原值直读，杜绝模型编数"],
    legacy: "以前各渠道价格口径不一，人工核对费时。",
    trace: ["商品中台 · 交易原值"],
    beforeAfter: [],
  },
  {
    id: "d5", laneIndex: 4, col: 2, row: 1, w: 175, x: 640, y: 0,
    title: "协议标签 · 集采协议价",
    aip: "（数据支撑，无功能编号）",
    solves: [{ ref: "C2", how: "集采协议内商品带协议标签与协议价，推荐时优先且理由注明。" }],
    ai: "标记商品是否属于集团统一招标的集采协议，带出协议价供排序优先与展示标注。",
    process: ["协议商品标记与协议价供优先推荐与标注。"],
    highlights: ["协议标签显性化，集采红利看得见"],
    legacy: "以前协议商品与普通商品混排，协议价优势看不出来。",
    trace: ["集采协议目录 · 协议价"],
    beforeAfter: [],
  },
  {
    id: "d6", laneIndex: 4, col: 1, row: 1, w: 175, x: 400, y: 0,
    title: "单位偏好规则",
    aip: "AIP-027",
    solves: [{ ref: "S4", how: "品类范围 / 品牌偏好 / 价格区间 / 供应商地域四维偏好可配，检索与排序严格遵循并在理由中体现。" }],
    ai: "承载单位级偏好配置（chat_pref 四维），对话推荐严格遵循并在理由里写明「按贵单位偏好」。",
    process: ["四维偏好（品类 / 品牌 / 价格 / 供应商地域）配置并生效于检索与排序。"],
    highlights: ["偏好可配可审计，理由注明偏好依据"],
    legacy: "以前单位偏好靠口头约定，新采购人接手就丢。",
    trace: ["chat_pref 偏好表 · 采购管理配置"],
    beforeAfter: [],
  },
];

const edges: Edge[] = [
  { from: "u1", to: "c1" },
  { from: "c1", to: "g1" },
  { from: "g1", to: "gx" },
  { from: "gx", to: "s1", label: "是 · 条件齐了" },
  { from: "gx", to: "g3", style: "dash", label: "否 · 缺什么问什么" },
  { from: "g3", to: "s1" },
  { from: "g3", to: "g1", style: "dash", label: "补充后增量解析" },
  { from: "s1", to: "g5", label: "检索原值" },
  { from: "g5", to: "u3" },
  { from: "u3", to: "g3", style: "dash", label: "追问 / 改条件 · 继续收敛" },
  { from: "u3", to: "bar1", style: "grayDash", label: "会话留痕" },
  { from: "gx", to: "h1", style: "dash", label: "没听懂 · 示例引导" },
  { from: "s1", to: "h1", style: "dash", label: "零结果 · 放宽建议" },
  { from: "g5", to: "h1", style: "dash", label: "超时 · 降级承接" },
  { from: "h1", to: "u1", style: "dash", label: "示例引导 · 重新表达" },
  { from: "d1", to: "g1", style: "grayDash", label: "单位与用户身份" },
  { from: "d2", to: "g3", style: "grayDash", label: "项目 · 预算归属" },
  { from: "d3", to: "s1", style: "grayDash", label: "目录与权限边界" },
  { from: "d4", to: "g5", style: "grayDash", label: "价格库存原值回填" },
  { from: "d5", to: "g5", style: "grayDash", label: "协议标签 · 优先推荐" },
  { from: "d6", to: "s1", style: "grayDash", label: "单位偏好生效" },
];

const chain = ["u1", "g1", "gx", "g3", "s1", "g5", "u3", "bar1"];

const config = {
  id: "ai-chat-guide",
  platform: "搜索",
  title: "AI 对话导购 · 从一句话需求到可采购清单",
  subtitle:
    "说需求不用拆关键词：多轮澄清把模糊需求转成结构化采购条件，再基于单位可售商品与集采协议价组织推荐清单，数字全部来自检索原值（AIP-024~028）",
  scenarios,
  constraints,
  flow: {
    width: 1360,
    height: 560,
    lanes: [
      { label: "采购人 · 需求人", tone: "biz", note: "说需求 → 审清单 → 提交申请", top: 0, height: 100 },
      { label: "商城对话界面", tone: "biz", note: "双模式入口 · 会话留痕", top: 110, height: 100 },
      { label: "AI 导购智能体", tone: "ai", note: "理解 → 澄清 → 组清单 · 不产生数字", top: 220, height: 130 },
      { label: "搜索与商品中台", tone: "mid", note: "检索原值出数", top: 360, height: 100 },
      { label: "商品 · 目录 · 权限中心", tone: "base", note: "身份 · 项目预算 · 目录规则 · 原值 · 协议 · 偏好", top: 470, height: 120 },
      { label: "人工客服 · 商城运营", tone: "biz", note: "没听懂不瞎猜 · 兜底有出路", top: 600, height: 100 },
    ],
    nodes,
    edges,
    autoLayout: true,
    chain,
    bizContext:
      "本页挂在搜索中台「AI 对话导购」（AIP-024~028）：与关键词搜索双模式并存（见「AI 搜索」页），被动发现路径衔接「AI 猜你喜欢」；对话只到清单与加购，下单回交易域走既有审批。",
    dataSupport:
      "数据支撑｜会话 · 轮次 · 偏好 · 推荐卡四表留痕（PRD §6.3）→ 02/07　／　推荐数字全部回填检索原值 → 04/05　／　单位偏好四维可配（品类 / 品牌 / 价格 / 供应商地域）→ 04/05",
    defaultSelected: "g5",
  },
  compare: [
    { dim: "人力", icon: "人", before: "逐项拆词搜索 + 翻页核对，一次集中采购反复搜索约 6 次（示意）", after: "一句话 + 多轮补充出清单，采购人只审不拼" },
    { dim: "金钱", icon: "¥", before: "型号买错退换、超预算被审批退回（示意）", after: "型号追问 + 预算前置校验 + 集采协议价优先" },
    { dim: "时间", icon: "⏱", before: "关键参数翻合同问工程师，一来一回数天（示意）", after: "追问补参数一次对话内完成，解析实测 1.1s、推荐实测 2.4s" },
    { dim: "数据", icon: "库", before: "比选过程散在聊天记录与纸上", after: "会话 · 解析 · 推荐卡四表留痕，隔天可续聊" },
  ],
  metricNote:
    "口径说明：1.1s / 2.4s 为需求解析 MVP-1 与推荐出口 MVP-2 实测（PRD AIP-024~028 §6.2）；首响 ≤3s 为对标目标；解析准确率评测集 500+ 对话为 PRD 验收口径；页内金额、数量与「剩余预算」均为示意，正式数字以各系统原值为准。",
};

// ———————————————————— 写入前自校验（fail-loud）————————————————————

function fail(msg: string): never {
  throw new Error(`✘ build-ai-chat-guide 自校验失败：${msg}`);
}

// 0) 目标文件必须是新建（避免无意识覆盖）
if (existsSync(target)) fail(`scenarios/ai-chat-guide.json 已存在——新建脚本不覆盖既有文件，请人工确认后删除再跑。`);

// 1) 场景/约束结构红线
for (const s of scenarios) {
  if (s.card.length > 120) fail(`场景 ${s.id} card ${s.card.length} 字超 120`);
  if (s.solution.effects.length !== s.story.consequences.length) {
    fail(`场景 ${s.id} effects ${s.solution.effects.length} 条 ≠ consequences ${s.story.consequences.length} 条`);
  }
}
for (const c of constraints) {
  if (c.card.length > 120) fail(`约束 ${c.id} card ${c.card.length} 字超 120`);
}

// 2) solves 引用完整 + 每个场景/约束至少被一个环节解决
const refIds = new Set<string>([...scenarios.map((s) => s.id), ...constraints.map((c) => c.id)]);
const solved = new Set<string>();
for (const n of nodes) {
  if (n.solves.length === 0) fail(`节点 ${n.id} 是孤儿环节（solves 为空）`);
  for (const s of n.solves) {
    if (!refIds.has(s.ref)) fail(`节点 ${n.id} solves.ref "${s.ref}" 不存在`);
    if (!s.how.trim()) fail(`节点 ${n.id} solves.ref "${s.ref}" how 为空`);
    solved.add(s.ref);
  }
}
for (const id of refIds) if (!solved.has(id)) fail(`场景/约束 ${id} 没有任何环节解决它`);

// 3) 边引用完整 + 节点 id 唯一
const nodeIds = new Set(nodes.map((n) => n.id));
if (nodeIds.size !== nodes.length) fail("节点 id 重复");
for (const e of edges) {
  if (!nodeIds.has(e.from)) fail(`边 ${e.from}→${e.to} 的 from 不存在`);
  if (!nodeIds.has(e.to)) fail(`边 ${e.from}→${e.to} 的 to 不存在`);
}

// 4) 链式布局预检：模拟 auto-layout 列推导 + 同泳道同列同行碰撞 + bar 挂链
const byId = new Map(nodes.map((n) => [n.id, n]));
{
  const cols = new Map<string, number>();
  let prev: string | null = null;
  for (const id of chain) {
    const n = byId.get(id);
    if (!n) fail(`chain 引用了不存在的节点 ${id}`);
    if (n.laneIndex == null) fail(`chain 节点 ${id} 缺少 laneIndex`);
    let derived = 0;
    if (prev) {
      const p = byId.get(prev)!;
      derived = n.laneIndex === p.laneIndex ? cols.get(prev)! + 1 : cols.get(prev)!;
    }
    cols.set(id, n.col ?? derived);
    prev = id;
  }
  for (const n of nodes) {
    if (!cols.has(n.id)) {
      if (n.kind === undefined || n.kind === "normal") {
        if (n.col == null) fail(`非主链节点 ${n.id} 必须显式声明 col（链式布局红线）`);
      }
      if ((n.kind as string) === "bar") fail(`bar 节点 ${n.id} 不可游离于 chain 之外`);
      cols.set(n.id, n.col!);
    }
  }
  const seen = new Set<string>();
  for (const n of nodes) {
    const key = `${n.laneIndex}|${n.row ?? 0}|${cols.get(n.id)}`;
    if (seen.has(key)) fail(`泳道 ${n.laneIndex} 行 ${n.row ?? 0} 列 ${cols.get(n.id)}：节点 ${n.id} 与同列节点重叠`);
    seen.add(key);
  }
  // bar 横贯全宽：其所在泳道行内不得再有其他节点
  for (const n of nodes) {
    if ((n.kind as string) !== "bar") continue;
    const r = n.row ?? 0;
    for (const m of nodes) {
      if (m.id === n.id || m.laneIndex !== n.laneIndex || (m.row ?? 0) !== r) continue;
      fail(`泳道 ${n.laneIndex} 行 ${r}：bar ${n.id} 横贯全宽，行内不得再放节点（${m.id}）`);
    }
  }
  // 列宽预算（ usable = CONTENT_RIGHT(1348) - NODE_LEFT(130) = 1218 ）
  const colWidths: number[] = [];
  for (const n of nodes) {
    if ((n.kind as string) === "bar" || (n.kind as string) === "loopchip") continue;
    const c = cols.get(n.id)!;
    colWidths[c] = Math.max(colWidths[c] ?? 0, n.w);
  }
  const total = colWidths.reduce((a, b) => a + b, 0);
  const gap = Math.floor((1218 - total) / (colWidths.length - 1));
  if (gap < 30) fail(`列间距 ${gap}px 不足（列宽合计 ${total} / 7 列）——需压缩节点宽度`);
  console.log(`  列宽预检：${colWidths.length} 列，合计 ${total}px，列间距 ${gap}px ✓`);
}

// 5) 黑话禁词两层扫描（结构化可见字段 + 全文原始文本）
function* visibleStrings(obj: unknown): Generator<string> {
  if (typeof obj === "string") {
    yield obj;
  } else if (Array.isArray(obj)) {
    for (const v of obj) yield* visibleStrings(v);
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (["x", "y", "w", "h", "top", "height", "laneIndex", "col", "row", "kind", "no", "id"].includes(k)) continue;
      yield* visibleStrings(v);
    }
  }
}
const hits: string[] = [];
for (const text of visibleStrings({ ...config, flow: { ...config.flow, nodes: config.flow.nodes.map(({ x, y, ...rest }) => rest) } })) {
  for (const w of BANNED) if (text.includes(w)) hits.push(`${w} ←「${text.slice(0, 40)}」`);
}
if (hits.length) fail(`黑话/B2C 禁词命中 ${hits.length} 处：\n  ${hits.join("\n  ")}`);

// 6) 量化口径红线（compare + beforeAfter 与 rules.ts 同源逻辑）
const caliber = (rows: Array<{ before: string; after: string; approx?: boolean }>, where: string) => {
  rows.forEach((r, i) => {
    for (const [f, t] of [["before", r.before], ["after", r.after]] as const) {
      if (QUANT_CLAIM.test(t) && !CALIBER_WORDS.some((w) => t.includes(w)) && !r.approx) {
        fail(`${where} 第 ${i + 1} 行 ${f} 含数字但无口径词：「${t}」`);
      }
    }
  });
};
caliber(config.compare, "页面 compare");
for (const n of nodes) {
  const ba = (n as { beforeAfter?: Array<{ before: string; after: string; approx?: boolean }> }).beforeAfter ?? [];
  caliber(ba, `节点 ${n.id} beforeAfter`);
}

// ———————————————————— 写入 ————————————————————

writeFileSync(target, JSON.stringify(config, null, 2) + "\n", "utf-8");
console.log(`✓ ai-chat-guide.json 已创建：${scenarios.length} 场景 / ${constraints.length} 约束 / ${nodes.length} 节点 / ${edges.length} 边 / ${config.flow.lanes.length} 泳道`);
console.log("✓ 黑话禁词两层清零 ｜ solves 引用与无解检查通过 ｜ 链式布局列推导预检通过");
console.log("→ 下一步：npm run layout && npm run validate && npx tsc --noEmit && npm run build");
