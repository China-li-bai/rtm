/**
 * overall-flow 场景人味化修复（双原则：场景有人味、方案有证据）。
 * 执行：npx tsx scripts/repair-overall-flow-humanized.ts
 * 只改场景层 name/card/story.who/story.stuck；consequences/effects/solution、
 * 约束、solves、节点文案全部不动（证据层），写入前备份 .before-humanize.bak。
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "scenarios", "overall-flow.json");
const backup = `${file}.before-humanize.bak`;
const cfg = JSON.parse(readFileSync(file, "utf8")) as any;
copyFileSync(file, backup);
const before = JSON.parse(JSON.stringify(cfg.scenarios));

const copy: Record<string, { name: string; card: string; who: string; stuck: string }> = {
  S1: {
    name: "商品上了架，采购筛不到",
    card: "供应商推来的一批阀门，同一规格写法五花八门；采购按标准口径筛了三轮全是空结果，急件只能去外部平台找。",
    who: "运营收到供应商推来的一批新品，采购同时在前台找几件急用的阀门。",
    stuck: "推品单上同一规格有好几种写法，采购按标准口径筛选不出结果；运营怕脏写法混进筛选器不敢放行，一单急件靠群里来回对。",
  },
  S2: {
    name: "换个写法，就搜不到",
    card: "采购搜「DN65 球阀」没有结果——供应商标题里写的是「直径65」；想问有没有替代料，搜索框只认字面关键词，答不上来。",
    who: "采购在搜索框输入「DN65 球阀」，想找到货，顺带看看有没有等效替代。",
    stuck: "商品标题里写的是「直径65」，字面搜索对不上号；改成问「这个料有没有更便宜的同款」，搜索框只能再试一轮关键词。",
  },
  S3: {
    name: "晚上问的事，白天才能答",
    card: "晚十点发现明早要用的型号发错货，客服已下班只能留言；白天高峰重复问题占线排队，同一政策两位客服还给出两个答案。",
    who: "采购晚十点巡库时发现明早要用的型号发错货，立刻找客服；白天高峰期他也在队列里排过队。",
    stuck: "夜间只能留言，没人应答也无人跟踪；白天高峰期重复问题占满人工，同一政策两位客服说法还不一样。",
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
