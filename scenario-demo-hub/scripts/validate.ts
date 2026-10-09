/**
 * 配置校验 CLI：npm run validate / 构建前置（fail-loud）。
 * 任一 error 即 exit 1，warn 仅提示。
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { formatIssues, validateConfig, type Issue } from "../src/schema/rules";
import { scenarioConfigSchema, type ScenarioConfig } from "../src/schema/scenario";
import { NODE_DEFAULT_H } from "../src/flow/tokens";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "scenarios");

if (!existsSync(dir)) {
  console.error("✘ scenarios/ 目录不存在");
  process.exit(1);
}

const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.error("✘ scenarios/ 下没有任何场景配置");
  process.exit(1);
}

let errors = 0;
let warns = 0;
const seenIds = new Map<string, string>();

function validateLayoutGeometry(cfg: ScenarioConfig, source: string): Issue[] {
  const { flow } = cfg;
  if (!flow.autoLayout) return [];

  const issues: Issue[] = [];
  const fail = (where: string, message: string) =>
    issues.push({ level: "error", where: `${source} · ${where}`, message });
  const warn = (where: string, message: string) =>
    issues.push({ level: "warn", where: `${source} · ${where}`, message });
  const boxes = flow.nodes.map(n => ({
    n,
    x: n.x,
    y: n.y,
    w: n.w,
    h: n.h ?? NODE_DEFAULT_H[n.kind],
  }));
  const byId = new Map(boxes.map(b => [b.n.id, b]));
  const eps = 1;
  const near = (a: number, b: number) => Math.abs(a - b) <= 2;

  // 节点必须落在画布内，并完整落在它声明的泳道内。
  for (const b of boxes) {
    const laneIndex = b.n.laneIndex;
    const lane = laneIndex == null ? undefined : flow.lanes[laneIndex];
    if (!lane) {
      fail(`节点 ${b.n.id}`, `laneIndex=${laneIndex} 不存在`);
      continue;
    }
    if (b.x < 0 || b.y < 0 || b.x + b.w > flow.width + eps || b.y + b.h > flow.height + eps) {
      fail(`节点 ${b.n.id}`, "节点矩形超出画布边界");
    }
    if (b.y < lane.top - eps || b.y + b.h > lane.top + lane.height + eps) {
      fail(`节点 ${b.n.id}`, `节点矩形超出泳道「${lane.label}」`);
    }
  }

  // 任意两个节点不可重叠。
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (overlapX > eps && overlapY > eps) {
        fail(`节点 ${a.n.id}/${b.n.id}`, "两个节点矩形发生重叠");
      }
    }
  }

  const onBoundary = (p: [number, number], b: typeof boxes[number]) => {
    const [x, y] = p;
    const onVertical = (near(x, b.x) || near(x, b.x + b.w)) && y >= b.y - 2 && y <= b.y + b.h + 2;
    const onHorizontal = (near(y, b.y) || near(y, b.y + b.h)) && x >= b.x - 2 && x <= b.x + b.w + 2;
    return onVertical || onHorizontal;
  };

  const segmentHitsBox = (
    a: [number, number], b: [number, number], box: typeof boxes[number],
  ) => {
    const [x1, y1] = a, [x2, y2] = b;
    if (Math.abs(y1 - y2) <= eps) {
      const y = (y1 + y2) / 2;
      return y > box.y + eps && y < box.y + box.h - eps &&
        Math.max(x1, x2) > box.x + eps && Math.min(x1, x2) < box.x + box.w - eps;
    }
    if (Math.abs(x1 - x2) <= eps) {
      const x = (x1 + x2) / 2;
      return x > box.x + eps && x < box.x + box.w - eps &&
        Math.max(y1, y2) > box.y + eps && Math.min(y1, y2) < box.y + box.h - eps;
    }
    return false;
  };

  for (const edge of flow.edges) {
    const route = edge.route;
    const src = byId.get(edge.from), dst = byId.get(edge.to);
    if (!src || !dst) continue; // 引用完整性由 validateConfig 处理
    if (!route || route.length < 2) {
      fail(`边 ${edge.from}→${edge.to}`, "缺少构建期正交路线");
      continue;
    }
    if (!onBoundary(route[0], src)) {
      fail(`边 ${edge.from}→${edge.to}`, "起点没有落在源节点边界上");
    }
    if (!onBoundary(route[route.length - 1], dst)) {
      fail(`边 ${edge.from}→${edge.to}`, "终点没有落在目标节点边界上");
    }
    for (let i = 1; i < route.length; i++) {
      const a = route[i - 1], b = route[i];
      if (Math.abs(a[0] - b[0]) > eps && Math.abs(a[1] - b[1]) > eps) {
        fail(`边 ${edge.from}→${edge.to}`, `第 ${i} 段不是正交线段`);
        continue;
      }
      for (const box of boxes) {
        if (segmentHitsBox(a, b, box)) {
          fail(`边 ${edge.from}→${edge.to}`, `路线穿过节点 ${box.n.id}`);
          break;
        }
      }
    }

    // 标签碰撞先作为 warning，避免字体度量差异导致正常构建被误拦截。
    if (edge.label && edge.labelAt) {
      const width = [...edge.label].reduce((sum, ch) => sum + ((ch.codePointAt(0) ?? 0) > 255 ? 12 : 7), 12);
      const [x, y] = edge.labelAt;
      const hit = boxes.find(b => x < b.x + b.w + 6 && x + width > b.x - 6 &&
        y < b.y + b.h + 6 && y + 18 > b.y - 6);
      if (hit) warn(`边 ${edge.from}→${edge.to}`, `标签「${edge.label}」可能与节点 ${hit.n.id} 重叠`);
    }
  }
  return issues;
}

for (const file of files.sort()) {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(join(dir, file), "utf8"));
  } catch (e) {
    console.error(`  [ERROR] ${file}：JSON 解析失败 — ${(e as Error).message}`);
    errors++;
    continue;
  }
  const issues = validateConfig(raw, file);
  const parsed = scenarioConfigSchema.safeParse(raw);
  if (parsed.success) issues.push(...validateLayoutGeometry(parsed.data, file));
  const id = (raw as { id?: string }).id;
  if (id) {
    const dup = seenIds.get(id);
    if (dup) {
      issues.push({ level: "error", where: "(根)", message: `场景 id "${id}" 与 ${dup} 重复` });
    } else {
      seenIds.set(id, file);
    }
  }
  if (issues.length > 0) console.log(formatIssues(file, issues));
  errors += issues.filter((i) => i.level === "error").length;
  warns += issues.filter((i) => i.level === "warn").length;
}

if (errors > 0) {
  console.error(`\n✘ 校验失败：${errors} 个错误，${warns} 个警告（${files.length} 份配置）`);
  process.exit(1);
}
console.log(`✓ 校验通过：${files.length} 份场景配置${warns > 0 ? `，${warns} 个警告` : ""}`);
