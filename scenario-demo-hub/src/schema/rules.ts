import {
  AIP_REF,
  CALIBER_WORDS,
  scenarioConfigSchema,
  type ScenarioConfig,
} from "./scenario";

/**
 * 业务规则校验（fail-loud）：zod 结构校验之上的产品红线。
 * 全部规则来自《场景演示平台-产品文档》§六交互规范、§七校验规则。
 */

export interface Issue {
  level: "error" | "warn";
  /** 人话定位，如「场景 S1」「环节 n3」 */
  where: string;
  message: string;
}

/** 方法论提示语黑名单（红线1：页面不得出现 meta 文案） */
const META_BANNED = [/方法对标/, /方法论/, /（业务里的痛）/, /\(业务里的痛\)/];

/** 量化声明：数字+量词才算指标；DN65、直径65 这类规格写法不算 */
const QUANT_CLAIM = /\d+(\.\d+)?\s*[%％万亿条倍分钟小时天元个次叶行款家单]/;

function collectTexts(cfg: ScenarioConfig): Array<{ where: string; text: string }> {
  const out: Array<{ where: string; text: string }> = [];
  for (const s of cfg.scenarios) {
    out.push(
      { where: `场景 ${s.id}`, text: s.name },
      { where: `场景 ${s.id}`, text: s.card },
      { where: `场景 ${s.id}`, text: s.story.who },
      { where: `场景 ${s.id}`, text: s.story.stuck },
      ...s.story.consequences.map((t) => ({ where: `场景 ${s.id}`, text: t })),
      { where: `场景 ${s.id}`, text: s.solution.who },
      { where: `场景 ${s.id}`, text: s.solution.smooth },
      ...s.solution.effects.map((t) => ({ where: `场景 ${s.id}`, text: t })),
    );
  }
  for (const c of cfg.constraints) {
    out.push(
      { where: `约束 ${c.id}`, text: c.name },
      { where: `约束 ${c.id}`, text: c.card },
      { where: `约束 ${c.id}`, text: c.reality },
      { where: `约束 ${c.id}`, text: c.decision },
      { where: `约束 ${c.id}`, text: c.land },
    );
  }
  for (const n of cfg.flow.nodes) {
    out.push({ where: `环节 ${n.id}`, text: n.title });
    if (n.sub) out.push({ where: `环节 ${n.id}`, text: n.sub });
  }
  return out;
}

function checkCaliber(
  where: string,
  rows: ReadonlyArray<{ before: string; after: string; approx?: boolean }>,
  issues: Issue[],
): void {
  rows.forEach((r, i) => {
    for (const [field, text] of [
      ["before", r.before],
      ["after", r.after],
    ] as const) {
      if (!QUANT_CLAIM.test(text)) continue;
      const hasWord = CALIBER_WORDS.some((w) => text.includes(w));
      if (!hasWord && !r.approx) {
        issues.push({
          level: "error",
          where,
          message: `对比第 ${i + 1} 行 ${field} 含数字但无口径标注——文本内加「示意/约/≈/基线」或条目置 "approx": true（红线5）`,
        });
      }
    }
  });
}

/** 结构校验 + 业务规则，返回问题清单；error 存在即构建失败 */
export function validateConfig(raw: unknown, source: string): Issue[] {
  const issues: Issue[] = [];
  const parsed = scenarioConfigSchema.safeParse(raw);
  if (!parsed.success) {
    for (const p of parsed.error.issues) {
      issues.push({
        level: "error",
        where: `${source} · ${p.path.join(".") || "(根)"}`,
        message: p.message,
      });
    }
    return issues;
  }
  const cfg = parsed.data;

  const refIds = new Set([
    ...cfg.scenarios.map((s) => s.id),
    ...cfg.constraints.map((c) => c.id),
  ]);
  const nodeIds = new Set(cfg.flow.nodes.map((n) => n.id));
  if (nodeIds.size !== cfg.flow.nodes.length) {
    issues.push({ level: "error", where: "flow.nodes", message: "节点 id 重复" });
  }

  // 防孤儿环节：每个环节至少挂 1 个场景/约束（bar 汇面条除外——它消费结果而非解决痛点时也必须挂，原型 n8 挂 S1/S3，故不设例外）
  for (const n of cfg.flow.nodes) {
    if (n.solves.length === 0) {
      issues.push({
        level: "error",
        where: `环节 ${n.id}「${n.title}」`,
        message: "孤儿环节：未挂接任何场景/约束（solves 为空）",
      });
    }
    for (const s of n.solves) {
      if (!refIds.has(s.ref)) {
        issues.push({
          level: "error",
          where: `环节 ${n.id}`,
          message: `solves.ref "${s.ref}" 不存在于 scenarios/constraints`,
        });
      }
    }
    if (n.aip && n.aip.includes("AIP") && !AIP_REF.test(n.aip) && !/^（.*）$/.test(n.aip)) {
      // 允许 "AIP-012"、"AIP-003/004 类目治理" 之外的自由说明，但对标准编号做格式提示
      const m = n.aip.match(/^(AIP|AICS)-\S+/);
      if (m && !AIP_REF.test(m[0])) {
        issues.push({
          level: "warn",
          where: `环节 ${n.id}`,
          message: `功能编号 "${m[0]}" 不符合 AIP-000 口径，请对照追溯矩阵`,
        });
      }
    }
  }

  // 防无解场景：每个场景/约束至少被 1 个环节解决
  const solvedRefs = new Set(cfg.flow.nodes.flatMap((n) => n.solves.map((s) => s.ref)));
  for (const id of refIds) {
    if (!solvedRefs.has(id)) {
      issues.push({
        level: "error",
        where: id.startsWith("S") ? `场景 ${id}` : `约束 ${id}`,
        message: "无解场景/约束：没有任何环节解决它",
      });
    }
  }

  // 解法与问题同构：effects 数 = consequences 数（红线3）
  for (const s of cfg.scenarios) {
    if (s.solution.effects.length !== s.story.consequences.length) {
      issues.push({
        level: "error",
        where: `场景 ${s.id}`,
        message: `solution.effects ${s.solution.effects.length} 条 ≠ story.consequences ${s.story.consequences.length} 条——后果与效果须逐条对应`,
      });
    }
  }

  // 边引用完整性
  for (const e of cfg.flow.edges) {
    for (const [end, id] of [
      ["from", e.from],
      ["to", e.to],
    ] as const) {
      if (!nodeIds.has(id)) {
        issues.push({
          level: "error",
          where: `flow.edges`,
          message: `边 ${e.from}→${e.to} 的 ${end} 节点 "${id}" 不存在`,
        });
      }
    }
  }

  // 口径标注（红线5）
  for (const n of cfg.flow.nodes) {
    checkCaliber(`环节 ${n.id} beforeAfter`, n.beforeAfter, issues);
  }
  checkCaliber("页面 compare", cfg.compare, issues);

  // 方法论禁词（红线1，warn 级——人审兜底）
  for (const { where, text } of collectTexts(cfg)) {
    for (const re of META_BANNED) {
      if (re.test(text)) {
        issues.push({
          level: "warn",
          where,
          message: `命中方法论提示语黑名单 /${re.source}/——评审要内容不要方法论注解`,
        });
      }
    }
  }

  return issues;
}

export function formatIssues(source: string, issues: Issue[]): string {
  return issues
    .map((i) => `  [${i.level === "error" ? "ERROR" : "WARN "}] ${source} › ${i.where}：${i.message}`)
    .join("\n");
}
