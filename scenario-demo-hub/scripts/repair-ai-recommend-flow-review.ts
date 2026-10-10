/**
 * ai-recommend 流程 review 修复（清单 1–4）。
 * 执行：npx tsx scripts/repair-ai-recommend-flow-review.ts
 * ①删除旧 panelTitle（e1/e3/e4/bar1/bar2）——抽屉与弹窗 context 改走画布 title 兜底，单名制；
 * ②d1→e1 边标签个人化旧口径改单位口径；
 * ③补 g3→e3、d4→fb 两条已被节点文案承诺的边；
 * ④泳道0 note 改闭环叙事。
 * 不改节点文案/坐标/route（layout 会重算），写入前备份 .before-flow-review.bak。
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "scenarios", "ai-recommend.json");
const backup = `${file}.before-flow-review.bak`;
const cfg = JSON.parse(readFileSync(file, "utf8")) as any;
copyFileSync(file, backup);
const before = JSON.parse(JSON.stringify(cfg.flow));

// ① 删除全部旧 panelTitle（唯一命名：抽屉/弹窗 context/画布同源走 title）
for (const n of cfg.flow.nodes) delete n.panelTitle;

// ② d1→e1 边标签改单位口径
const d1e1 = cfg.flow.edges.find((e: any) => e.from === "d1" && e.to === "e1");
if (!d1e1) throw new Error("找不到边 d1→e1；中止写入");
if (d1e1.label !== "用户与行为特征") throw new Error(`d1→e1 标签已非预期值：${d1e1.label}；中止写入`);
d1e1.label = "单位画像与常购统计";

// ③ 补边：g3→e3（禁采与合规规则）、d4→fb（订单数据刷新统计）
if (cfg.flow.edges.some((e: any) => e.from === "g3" && e.to === "e3")) throw new Error("g3→e3 已存在；中止写入");
if (cfg.flow.edges.some((e: any) => e.from === "d4" && e.to === "fb")) throw new Error("d4→fb 已存在；中止写入");
cfg.flow.edges.push({ from: "g3", to: "e3", label: "禁采与合规规则" });
cfg.flow.edges.push({ from: "d4", to: "fb", label: "订单数据刷新统计" });

// ④ 泳道0 note 改闭环叙事（原"首页/搜索/详情/购物车四场景"与内容不符且"搜索"口径不一）
if (cfg.flow.lanes[0].note !== "首页/搜索/详情/购物车四场景") throw new Error(`泳道0 note 已非预期值：${cfg.flow.lanes[0].note}；中止写入`);
cfg.flow.lanes[0].note = "触点入口 → 反馈与画像迭代闭环";

// 校验：除上述四处外逐字段未动；panelTitle 全清；边数 21→23。
if (cfg.flow.edges.length !== before.edges.length + 2) throw new Error("边数变化超出预期；中止写入");
const isNew = (e: any) => (e.from === "g3" && e.to === "e3") || (e.from === "d4" && e.to === "fb");
const bEdges = before.edges.filter((e: any) => !(e.from === "d1" && e.to === "e1"));
const aEdges = cfg.flow.edges.filter((e: any) => !isNew(e) && !(e.from === "d1" && e.to === "e1"));
if (JSON.stringify(bEdges) !== JSON.stringify(aEdges)) throw new Error("既有边出现预期外变更；中止写入");
const stripPt = (nodes: any[]) => JSON.stringify(nodes.map(({ panelTitle, ...rest }: any) => rest));
if (stripPt(before.nodes) !== stripPt(cfg.flow.nodes)) throw new Error("节点出现预期外变更；中止写入");
const bLanes = JSON.stringify(before.lanes.map((l: any, i: number) => (i === 0 ? { ...l, note: undefined } : l)));
const aLanes = JSON.stringify(cfg.flow.lanes.map((l: any, i: number) => (i === 0 ? { ...l, note: undefined } : l)));
if (bLanes !== aLanes) throw new Error("泳道出现预期外变更；中止写入");
for (const key of ["width", "height", "autoLayout", "chain", "bizContext", "dataSupport"]) {
  if (JSON.stringify((before as any)[key]) !== JSON.stringify((cfg.flow as any)[key])) throw new Error(`flow.${key} 被改动；中止写入`);
}

writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
console.log(`✓ 已修复 ${file}`);
console.log(`✓ panelTitle 删除 5 处 ｜ d1→e1 标签改口径 ｜ 补边 g3→e3、d4→fb ｜ 泳道0 note 改闭环叙事`);
console.log(`✓ 备份：${backup}`);
console.log("下一步执行：npm run layout && npm run validate && npm run build");
