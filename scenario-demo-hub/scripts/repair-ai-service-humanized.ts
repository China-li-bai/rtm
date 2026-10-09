/**
 * ai-service 场景人味化修复（双原则：场景有人味、方案有证据）。
 * 执行：npx tsx scripts/repair-ai-service-humanized.ts
 * 只改场景层 name/card/story.who/story.stuck；consequences/effects/solution
 * （含〔实测〕〔示意〕证据标记）、约束、solves、节点文案全部不动，写入前备份 .before-humanize.bak。
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "scenarios", "ai-service.json");
const backup = `${file}.before-humanize.bak`;
const cfg = JSON.parse(readFileSync(file, "utf8")) as any;
copyFileSync(file, backup);
const before = JSON.parse(JSON.stringify(cfg.scenarios));

const copy: Record<string, { name: string; card: string; who: string; stuck: string }> = {
  S1: {
    name: "排队的都是老问题",
    card: "周一上午采购集中来问发票进度、订单状态——这些每周都重复的问题占住客服队列，真正要判断的复杂件排在队尾。",
    who: "周一上午，采购和供应商集中发起咨询：发票开了没、订单到哪了、退换怎么走。",
    stuck: "这些问题上周问过、这周还问，答案不复杂但量大；人工逐条敲回复、首响分钟级，复杂件被压在队尾。",
  },
  S2: {
    name: "同一个问题，两个答案",
    card: "采购问「质保几年」，上午一位客服答两年、下午另一位答一年。不是谁不认真——口径在各自脑子里，没有唯一出处。",
    who: "采购月底对账时问开票政策，上午被告知能开专票，下午换位客服又被告知不能。",
    stuck: "开票、质保、退换的口径存在各人经验和散落的文档里；政策更新了，总有人不知道。",
  },
  S3: {
    name: "晚上的急事，等不到天亮",
    card: "晚十点半采购发现明早要用的型号发错货——客服下班了只能留言；急事等不到天亮，缓事第二天忘了问。",
    who: "采购夜班巡库发现明早要用的型号发错货，立刻发起咨询。",
    stuck: "夜间无人值守只能留言，没人跟踪；次日上班积压集中爆发，留言容易沉底。",
  },
};

for (const s of cfg.scenarios) {
  const upd = copy[s.id];
  if (!upd) throw new Error(`缺少场景 ${s.id} 的文案；中止写入`);
  s.name = upd.name;
  s.card = upd.card;
  s.story.who = upd.who;
  s.story.stuck = upd.stuck;
}

// 校验：证据层逐字段未动，卡片长度合规，ID/tag/kw 稳定。
for (let i = 0; i < cfg.scenarios.length; i++) {
  const a = before[i], b = cfg.scenarios[i];
  if (a.id !== b.id || a.tag !== b.tag || a.kw !== b.kw) throw new Error(`${b.id} 的 id/tag/kw 被改动；中止写入`);
  if (JSON.stringify(a.story.consequences) !== JSON.stringify(b.story.consequences)) throw new Error(`${b.id} 的 consequences 被改动；中止写入`);
  if (JSON.stringify(a.solution) !== JSON.stringify(b.solution)) throw new Error(`${b.id} 的 solution 被改动；中止写入`);
  if (b.card.length > 120) throw new Error(`${b.id} 的 card 超过 120 字`);
}

writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
console.log(`✓ 已修复 ${file}`);
console.log(`✓ 备份：${backup}`);
console.log("下一步执行：npm run layout && npm run validate && npm run build");
