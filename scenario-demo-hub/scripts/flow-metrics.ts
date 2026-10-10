/**
 * 流程图几何指标 CLI（构建期分析工具，只读不改）：npx tsx scripts/flow-metrics.ts
 *
 * 用途（rtm-flow-layout-routing-agent-plan.md 阶段 0 / 阶段 2）：
 *   - 基线：越界边数、边-边交叉数、路径长度/折点、标签碰撞、危险带占用；
 *   - 调参对照：crossing 参数 A/B/C 试验前后跑同一脚本对比。
 *
 * 输出：按场景汇总的 JSON（stdout），重定向保存即基线报告。
 * 只统计 autoLayout 场景的构建期产物（route/labelAt）；标签宽度与 validate.ts
 * 同一估算函数（中文 12px / 其余 7px / 基宽 12px，高 18px）。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "scenarios");

const eps = 1;

/** 标签渲染尺寸估算（与 scripts/validate.ts 保持同一口径） */
export function labelBox(labelAt: [number, number], label: string): {
  x: number; y: number; w: number; h: number;
} {
  const w = [...label].reduce((sum, ch) => sum + ((ch.codePointAt(0) ?? 0) > 255 ? 12 : 7), 12);
  return { x: labelAt[0], y: labelAt[1], w, h: 18 };
}

type Seg = { x1: number; y1: number; x2: number; y2: number; edge: number };

function segmentsOf(route: [number, number][]): Seg[] {
  const segs: Seg[] = [];
  for (let i = 1; i < route.length; i++) {
    segs.push({ x1: route[i - 1][0], y1: route[i - 1][1], x2: route[i][0], y2: route[i][1], edge: -1 });
  }
  return segs;
}

/** 严格内部交叉：交点须同时是两段的严格内点（端点相接/共线不计） */
function strictCross(a: Seg, b: Seg): boolean {
  const aH = Math.abs(a.y1 - a.y2) <= eps;
  const bH = Math.abs(b.y1 - b.y2) <= eps;
  if (aH === bH) return false; // 平行（含共线）不计
  const h = aH ? a : b;
  const v = aH ? b : a;
  const x = v.x1;
  const y = h.y1;
  return (
    x > Math.min(h.x1, h.x2) + eps && x < Math.max(h.x1, h.x2) - eps &&
    y > Math.min(v.y1, v.y2) + eps && y < Math.max(v.y1, v.y2) - eps
  );
}

function rectOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
  pad = 0,
): boolean {
  return a.x < b.x + b.w + pad && a.x + a.w > b.x - pad &&
    a.y < b.y + b.h + pad && a.y + a.h > b.y - pad;
}

function segHitsRect(s: Seg, r: { x: number; y: number; w: number; h: number }): boolean {
  if (Math.abs(s.y1 - s.y2) <= eps) {
    const y = s.y1;
    return y > r.y && y < r.y + r.h &&
      Math.max(s.x1, s.x2) > r.x && Math.min(s.x1, s.x2) < r.x + r.w;
  }
  if (Math.abs(s.x1 - s.x2) <= eps) {
    const x = s.x1;
    return x > r.x && x < r.x + r.w &&
      Math.max(s.y1, s.y2) > r.y && Math.min(s.y1, s.y2) < r.y + r.h;
  }
  return false;
}

interface FileReport {
  nodes: number;
  edges: number;
  canvas: { w: number; h: number };
  routePoints: number;
  outOfCanvas: { edge: string; point: [number, number] }[];
  dangerBand: { edge: string; point: [number, number]; side: string }[];
  crossings: { a: string; b: string; at: [number, number]; styles: string }[];
  routeLength: number;
  bends: number;
  labels: {
    total: number;
    onOwnNode: { label: string; edge: string; node: string }[];
    onOtherNode: { label: string; edge: string; node: string }[];
    onOtherEdge: { label: string; edge: string; crossedEdge: string }[];
    labelOverlaps: { a: string; b: string }[];
    outOfCanvas: { label: string; edge: string }[];
  };
}

const reports: Record<string, FileReport> = {};

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const cfg = JSON.parse(readFileSync(join(dir, file), "utf8")) as {
    flow?: {
      autoLayout?: boolean; width?: number; height?: number;
      nodes: { id: string; x?: number; y?: number; w: number; h?: number }[];
      edges: { from: string; to: string; style?: string; label?: string;
        route?: [number, number][]; labelAt?: [number, number] }[];
    };
  };
  const flow = cfg.flow;
  if (!flow || flow.autoLayout !== true || !flow.width || !flow.height) continue;

  const W = flow.width;
  const H = flow.height;
  const nodeBoxes = flow.nodes.map((n) => ({
    id: n.id, x: n.x ?? 0, y: n.y ?? 0, w: n.w, h: n.h ?? 0,
  }));

  const rep: FileReport = {
    nodes: flow.nodes.length,
    edges: flow.edges.length,
    canvas: { w: W, h: H },
    routePoints: 0,
    outOfCanvas: [],
    dangerBand: [],
    crossings: [],
    routeLength: 0,
    bends: 0,
    labels: { total: 0, onOwnNode: [], onOtherNode: [], onOtherEdge: [], labelOverlaps: [], outOfCanvas: [] },
  };

  const allSegs: Seg[] = [];
  flow.edges.forEach((e, ei) => {
    const name = `${e.from}→${e.to}`;
    if (!e.route || e.route.length < 2) return;
    rep.routePoints += e.route.length;
    rep.bends += e.route.length - 2;
    for (const p of e.route) {
      if (p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H) {
        rep.outOfCanvas.push({ edge: name, point: p });
      }
      // 边界墙安全带：画布边缘 10px（SHAPE_BUFFER）内的既有走线——四向墙是否会挤动它们
      if (p[0] > W - 10) rep.dangerBand.push({ edge: name, point: p, side: "right" });
      if (p[0] < 10) rep.dangerBand.push({ edge: name, point: p, side: "left" });
      if (p[1] > H - 10) rep.dangerBand.push({ edge: name, point: p, side: "bottom" });
      if (p[1] < 10) rep.dangerBand.push({ edge: name, point: p, side: "top" });
    }
    const segs = segmentsOf(e.route);
    for (const s of segs) {
      s.edge = ei;
      rep.routeLength += Math.abs(s.x2 - s.x1) + Math.abs(s.y2 - s.y1);
    }
    allSegs.push(...segs);
  });

  // 边-边严格交叉（每对只记一次）
  const edgeName = (i: number) => {
    const e = flow.edges[i];
    return `${e.from}→${e.to}`;
  };
  const pairSeen = new Set<string>();
  for (let i = 0; i < allSegs.length; i++) {
    for (let j = i + 1; j < allSegs.length; j++) {
      const a = allSegs[i];
      const b = allSegs[j];
      if (a.edge === b.edge) continue;
      if (!strictCross(a, b)) continue;
      const pk = a.edge < b.edge ? `${a.edge}|${b.edge}` : `${b.edge}|${a.edge}`;
      if (pairSeen.has(pk)) continue;
      pairSeen.add(pk);
      const ea = flow.edges[a.edge];
      const eb = flow.edges[b.edge];
      rep.crossings.push({
        a: `${ea.from}→${ea.to}`,
        b: `${eb.from}→${eb.to}`,
        at: [aHCross(a, b), aHCrossY(a, b)],
        styles: `${ea.style ?? "main"}×${eb.style ?? "main"}`,
      });
    }
  }

  // 标签碰撞
  const labeled = flow.edges
    .map((e, i) => ({ e, i, name: `${e.from}→${e.to}` }))
    .filter((x) => x.e.label && x.e.labelAt);
  rep.labels.total = labeled.length;
  for (const { e, name } of labeled) {
    const lb = labelBox(e.labelAt!, e.label!);
    if (lb.x < 0 || lb.y < 0 || lb.x + lb.w > W || lb.y + lb.h > H) {
      rep.labels.outOfCanvas.push({ label: e.label!, edge: name });
    }
    for (const nb of nodeBoxes) {
      if (!rectOverlap(lb, nb, 6)) continue;
      if (nb.id === e.from || nb.id === e.to) {
        rep.labels.onOwnNode.push({ label: e.label!, edge: name, node: nb.id });
      } else {
        rep.labels.onOtherNode.push({ label: e.label!, edge: name, node: nb.id });
      }
    }
    for (const s of allSegs) {
      if (s.edge === flow.edges.indexOf(e)) continue;
      if (segHitsRect(s, { x: lb.x - 3, y: lb.y - 3, w: lb.w + 6, h: lb.h + 6 })) {
        rep.labels.onOtherEdge.push({ label: e.label!, edge: name, crossedEdge: edgeName(s.edge) });
        break;
      }
    }
  }
  for (let i = 0; i < labeled.length; i++) {
    for (let j = i + 1; j < labeled.length; j++) {
      const la = labelBox(labeled[i].e.labelAt!, labeled[i].e.label!);
      const lb2 = labelBox(labeled[j].e.labelAt!, labeled[j].e.label!);
      if (rectOverlap(la, lb2)) {
        rep.labels.labelOverlaps.push({ a: labeled[i].name, b: labeled[j].name });
      }
    }
  }

  reports[file] = rep;
}

const summary = {
  files: Object.keys(reports).length,
  totalEdges: Object.values(reports).reduce((s, r) => s + r.edges, 0),
  outOfCanvas: Object.values(reports).reduce((s, r) => s + r.outOfCanvas.length, 0),
  dangerBand: Object.values(reports).reduce((s, r) => s + r.dangerBand.length, 0),
  crossings: Object.values(reports).reduce((s, r) => s + r.crossings.length, 0),
  routeLength: Object.values(reports).reduce((s, r) => s + r.routeLength, 0),
  bends: Object.values(reports).reduce((s, r) => s + r.bends, 0),
  labelsOnOwnNode: Object.values(reports).reduce((s, r) => s + r.labels.onOwnNode.length, 0),
  labelsOnOtherNode: Object.values(reports).reduce((s, r) => s + r.labels.onOtherNode.length, 0),
  labelsOnOtherEdge: Object.values(reports).reduce((s, r) => s + r.labels.onOtherEdge.length, 0),
  labelOverlaps: Object.values(reports).reduce((s, r) => s + r.labels.labelOverlaps.length, 0),
  labelsOutOfCanvas: Object.values(reports).reduce((s, r) => s + r.labels.outOfCanvas.length, 0),
};

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), summary, reports }, null, 2));

/** 水平/垂直段交点坐标辅助 */
function aHCross(a: Seg, b: Seg): number {
  return Math.abs(a.y1 - a.y2) <= eps ? b.x1 : a.x1;
}
function aHCrossY(a: Seg, b: Seg): number {
  return Math.abs(a.y1 - a.y2) <= eps ? a.y1 : b.y1;
}
