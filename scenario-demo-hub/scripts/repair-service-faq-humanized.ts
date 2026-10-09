/**
 * service-faq 场景人味化轻修（双原则：场景有人味、方案有证据）。
 * 执行：npx tsx scripts/repair-service-faq-humanized.ts
 * 该页 name/card/stuck 已达标（具体动作开场、可观察阻碍），仅 story.who 弱于 card 的画面
 * ——只补 who 的场景锚点；name/card/stuck/consequences/effects/solution 及其余全部不动，
 * 写入前备份 .before-humanize.bak。
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "scenarios", "service-faq.json");
const backup = `${file}.before-humanize.bak`;
const cfg = JSON.parse(readFileSync(file, "utf8")) as any;
copyFileSync(file, backup);
const before = JSON.parse(JSON.stringify(cfg.scenarios));

const whoByld: Record<string, string> = {
  S1: "采购上午问了一次质保政策，下午不放心，又确认了一遍。",
  S2: "采购在订单页找不到物流进度，转去问客服「我的订单到哪了」。",
  S3: "晚十点，采购想赶在明早收货前确认替代型号能不能用。",
};

for (const s of cfg.scenarios) {
  const who = whoByld[s.id];
  if (!who) throw new Error(`缺少场景 ${s.id} 的 who；中止写入`);
  s.story.who = who;
}

// 校验：除 story.who 外逐字段未动。
for (let i = 0; i < cfg.scenarios.length; i++) {
  const a = before[i], b = cfg.scenarios[i];
  if (a.id !== b.id || a.name !== b.name || a.card !== b.card || a.kw !== b.kw) throw new Error(`${b.id} 的 name/card/kw 被改动；中止写入`);
  if (a.story.stuck !== b.story.stuck) throw new Error(`${b.id} 的 stuck 被改动；中止写入`);
  if (JSON.stringify(a.story.consequences) !== JSON.stringify(b.story.consequences)) throw new Error(`${b.id} 的 consequences 被改动；中止写入`);
  if (JSON.stringify(a.solution) !== JSON.stringify(b.solution)) throw new Error(`${b.id} 的 solution 被改动；中止写入`);
}

writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
console.log(`✓ 已修复 ${file}`);
console.log(`✓ 备份：${backup}`);
console.log("下一步执行：npm run layout && npm run validate && npm run build");
