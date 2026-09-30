/**
 * 校验规则负向测试：产品红线必须 fail-loud。
 * 运行：npx tsx scripts/rules.test.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateConfig, type Issue } from "../src/schema/rules";
import type { ScenarioConfig } from "../src/schema/scenario";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const good = JSON.parse(readFileSync(join(root, "scenarios/attr-extraction.json"), "utf8")) as ScenarioConfig;

let passed = 0;
let failed = 0;

function expect(name: string, issues: Issue[], want: { errors?: number; warns?: number; match?: RegExp }) {
  const errors = issues.filter((i) => i.level === "error").length;
  const warns = issues.filter((i) => i.level === "warn").length;
  const ok =
    (want.errors === undefined || errors === want.errors) &&
    (want.warns === undefined || warns === want.warns) &&
    (want.match === undefined || issues.some((i) => want.match!.test(i.message)));
  if (ok) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✘ ${name} — errors=${errors} warns=${warns}`, issues.map((i) => i.message));
  }
}

const clone = () => JSON.parse(JSON.stringify(good)) as typeof good;

// 基线：原型翻译配置必须干净通过
expect("基线配置零错误零警告", validateConfig(good, "base"), { errors: 0, warns: 0 });

// 红线3：effects 数 ≠ consequences 数
{
  const c = clone();
  c.scenarios[0].solution.effects.pop();
  expect("后果与效果不逐条对应 → error", validateConfig(c, "t"), { errors: 1, match: /逐条对应/ });
}

// 防孤儿环节
{
  const c = clone();
  c.flow.nodes[0].solves = [];
  expect("孤儿环节 → error", validateConfig(c, "t"), { errors: 1, match: /孤儿环节/ });
}

// 防无解场景：删掉所有挂 S1 的 solves
{
  const c = clone();
  for (const n of c.flow.nodes) n.solves = n.solves.filter((s) => s.ref !== "S1");
  expect("无解场景 → error", validateConfig(c, "t"), { errors: 1, match: /没有任何环节解决/ });
}

// 红线5：含量化数字无口径标注
{
  const c = clone();
  c.compare[1].before = "19 万商品全量 AI 调用是最贵路线"; // 去掉「约」
  expect("数字无口径 → error", validateConfig(c, "t"), { errors: 1, match: /口径标注/ });
}

// 红线5 豁免路径：approx: true 放行
{
  const c = clone();
  c.compare[1].before = "19 万商品全量 AI 调用是最贵路线";
  c.compare[1].approx = true;
  expect("approx:true 豁免口径 error", validateConfig(c, "t"), { errors: 0 });
}

// metricNote 必填
{
  const c = clone();
  c.metricNote = "";
  expect("缺 metricNote → error", validateConfig(c, "t"), { match: /metricNote 必填/ });
}

// 边引用不存在节点
{
  const c = clone();
  c.flow.edges.push({ from: "n1", to: "n999", style: "main" });
  expect("悬空边 → error", validateConfig(c, "t"), { errors: 1, match: /不存在/ });
}

// 红线1：方法论提示语 → warn
{
  const c = clone();
  c.scenarios[0].card += "（业务里的痛）";
  expect("方法论提示语 → warn", validateConfig(c, "t"), { warns: 1, match: /方法论提示语/ });
}

// 规格写法不触发口径规则（DN65 不是指标）
{
  const c = clone();
  c.compare[0].before = "「DN65」「dn65」各写各的，筛不出来";
  expect("DN65 规格不误报口径", validateConfig(c, "t"), { errors: 0 });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
