/**
 * 一次性迁移脚本（任务AC 阶段1）：为全部 14 份场景配置回填——
 *   1. flow.edges[].id：稳定唯一边 id（`e-${from}-${to}`，同对撞名加序号）；
 *   2. ai-chat-guide 21 条边按业务语义显式标注 routeRole（人工判定，不从 style 推导）；
 *   3. ai-chat-guide bar1「会话留痕」置 routingObstacle:false（纯 sink 型能力横条，摘出路由障碍）。
 *
 * 运行：npx tsx review/repair-edge-id-role.ts（在 scenario-demo-hub/ 下）
 * 自校验 fail-loud：变更白名单之外零改动、id 全量唯一、role 枚举合法。
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "scenarios");

/** ai-chat-guide 21 条边的业务路由角色（人工按语义标注；与视觉 style 正交） */
const CHAT_GUIDE_ROLES: Record<string, "primary" | "branch" | "feedback" | "support"> = {
  "u1→c1": "primary", // 说需求 → 双模式入口（主链起点）
  "c1→g1": "primary", // 入口 → 解析五要素
  "g1→gx": "primary", // 解析 → 需求完整？
  "gx→s1": "primary", // 是 · 条件齐了（判定通过的主链延续）
  "g3→s1": "primary", // 多轮澄清补齐后继续检索
  "s1→g5": "primary", // 检索 → 生成清单
  "g5→u3": "primary", // 生成清单 → 确认加购（越界修复专项边）
  "gx→g3": "branch", // 否 · 缺什么问什么（条件分支，虽为橙色虚线）
  "gx→h1": "branch", // 没听懂 · 示例引导（异常分支出）
  "s1→h1": "branch", // 零结果 · 放宽建议
  "g5→h1": "branch", // 超时 · 降级承接
  "g3→g1": "feedback", // 补充后增量解析（回前序）
  "u3→g3": "feedback", // 追问 / 改条件 · 继续收敛（回前序）
  "h1→u1": "feedback", // 示例引导 · 重新表达（回到 01）
  "u3→bar1": "support", // 会话留痕（审计/数据写入型支撑线）
  "d1→g1": "support",
  "d2→g3": "support",
  "d3→s1": "support",
  "d4→g5": "support",
  "d5→g5": "support",
  "d6→s1": "support",
};

const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
if (files.length !== 14) throw new Error(`预期 14 份配置，实际 ${files.length}`);

let touched = 0;
for (const file of files) {
  const path = join(dir, file);
  const before = readFileSync(path, "utf8");
  const cfg = JSON.parse(before);
  const flow = cfg.flow;
  if (!flow?.edges) throw new Error(`${file}：无 flow.edges`);
  const isChatGuide = file === "ai-chat-guide.json";

  const seen = new Map<string, number>();
  flow.edges = flow.edges.map((e: Record<string, unknown>) => {
    const key = `${e.from}→${e.to}`;
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    const base = `e-${e.from}-${e.to}`;
    const id = n === 1 ? base : `${base}-${n}`;
    const rebuilt: Record<string, unknown> = { id, from: e.from, to: e.to };
    if (isChatGuide) {
      const role = CHAT_GUIDE_ROLES[key];
      if (n > 1) throw new Error(`${file}：${key} 存在同对平行边，映射表需人工补充`);
      if (!role) throw new Error(`${file}：${key} 未在角色映射表中（21 条须全覆盖）`);
      rebuilt.routeRole = role;
    }
    for (const [k, v] of Object.entries(e)) {
      if (k === "id" || k === "routeRole") continue;
      rebuilt[k] = v;
    }
    return rebuilt;
  });

  if (isChatGuide) {
    const bar1 = flow.nodes.find((n: Record<string, unknown>) => n.id === "bar1");
    if (!bar1) throw new Error(`${file}：找不到 bar1`);
    if (bar1.kind !== "bar") throw new Error(`${file}：bar1.kind=${bar1.kind} 非 bar`);
    bar1.routingObstacle = false;
  }

  // —— 自校验 1：id 非空且全文件唯一 ——
  const ids = flow.edges.map((e: { id?: string }) => e.id);
  if (ids.some((id: string | undefined) => !id)) throw new Error(`${file}：存在缺 id 的边`);
  if (new Set(ids).size !== ids.length) throw new Error(`${file}：边 id 有重复`);

  // —— 自校验 2：变更白名单（id/routeRole/bar1.routingObstacle 之外零语义改动）——
  const beforeCfg = JSON.parse(before);
  const strip = (o: Record<string, unknown>) => {
    const c = JSON.parse(JSON.stringify(o));
    for (const e of c.flow.edges) {
      delete e.id;
      delete e.routeRole;
    }
    for (const n of c.flow.nodes) delete n.routingObstacle;
    return c;
  };
  if (JSON.stringify(strip(cfg)) !== JSON.stringify(strip(beforeCfg))) {
    throw new Error(`${file}：白名单外的字段被改动，拒绝落盘`);
  }

  const after = `${JSON.stringify(cfg, null, 2)}\n`;
  if (after !== before) {
    writeFileSync(path, after, "utf8");
    touched++;
    console.log(`✓ ${file}：${ids.length} 条边回填 id${isChatGuide ? " + 21 条 routeRole + bar1 摘障碍" : ""}`);
  } else {
    console.log(`— ${file}：无变化（跳过）`);
  }
}
console.log(`✓ 迁移完成：${touched} 份配置已回写`);
