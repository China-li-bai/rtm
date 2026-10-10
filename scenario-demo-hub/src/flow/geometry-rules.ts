/**
 * 流程图几何规则（构建期 fail-loud 校验的唯一事实源）。
 * 消费方：scripts/validate.ts（CLI 门禁）、scripts/geometry.test.ts（负向测试）、
 * scripts/flow-metrics.ts（指标对照）。只做几何/拓扑断言，不涉及业务文案红线
 * （那部分在 src/schema/rules.ts）。
 *
 * 门槛分级（任务AC 裁定，2026-10-10 基线实测驱动）：
 *   error —— route 点越出画布（基线仅 g5→u3 x=1370，属真缺陷）；
 *            连续重复路线点；非正交段；端点不在节点边界；路线穿非端点节点；
 *            标签越出画布（基线 0）；标签压非端点节点（基线 0）；
 *            缺 route / 点数不足。
 *   warn  —— 标签压自身端点节点（字体度量为估算，基线 5 处存量）；
 *            标签互压（基线 21）/ 标签压非关联线（基线 34）——聚合上报；
 *            边-边交叉（基线 89 对，主链×主链 35）——聚合上报，待 crossing
 *            调优收敛后再评估升级 error。
 */
import type { Issue } from "../schema/rules";
import type { FlowEdge, FlowNode } from "../schema/scenario";
import { NODE_DEFAULT_H } from "./tokens";

const EPS = 1;

/** 几何检查所需的最小 flow 视图（ScenarioConfig.flow 结构兼容） */
export interface FlowGeometryView {
  width: number;
  height: number;
  lanes: Array<{ label: string; top?: number; height?: number }>;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface Rect { x: number; y: number; w: number; h: number }

/** 标签渲染尺寸估算：中文/全角 12px、其余 7px、基宽 12px、高 18px（与 .lab 12px 字号近似） */
export function labelRect(labelAt: [number, number], label: string): Rect {
  const w = [...label].reduce((sum, ch) => sum + ((ch.codePointAt(0) ?? 0) > 255 ? 12 : 7), 12);
  return { x: labelAt[0], y: labelAt[1], w, h: 18 };
}

interface Seg { x1: number; y1: number; x2: number; y2: number; edgeIdx: number }

function segmentsOf(route: [number, number][], edgeIdx: number): Seg[] {
  const segs: Seg[] = [];
  for (let i = 1; i < route.length; i++) {
    segs.push({ x1: route[i - 1][0], y1: route[i - 1][1], x2: route[i][0], y2: route[i][1], edgeIdx });
  }
  return segs;
}

/** 严格内部交叉：交点须同时是两段的严格内点（端点相接/共线不计，勿误报） */
export function strictCross(a: Seg, b: Seg): boolean {
  const aH = Math.abs(a.y1 - a.y2) <= EPS;
  const bH = Math.abs(b.y1 - b.y2) <= EPS;
  if (aH === bH) return false;
  const h = aH ? a : b;
  const v = aH ? b : a;
  return (
    v.x1 > Math.min(h.x1, h.x2) + EPS && v.x1 < Math.max(h.x1, h.x2) - EPS &&
    h.y1 > Math.min(v.y1, v.y2) + EPS && h.y1 < Math.max(v.y1, v.y2) - EPS
  );
}

export interface CrossingPair {
  a: FlowEdge;
  b: FlowEdge;
  at: [number, number];
}

/** 边-边严格交叉清单（每对边只记一次） */
export function crossingPairs(flow: FlowGeometryView): CrossingPair[] {
  const segs: Seg[] = [];
  flow.edges.forEach((e, i) => {
    if (e.route && e.route.length >= 2) segs.push(...segmentsOf(e.route, i));
  });
  const seen = new Set<string>();
  const out: CrossingPair[] = [];
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      const a = segs[i];
      const b = segs[j];
      if (a.edgeIdx === b.edgeIdx || !strictCross(a, b)) continue;
      const pk = a.edgeIdx < b.edgeIdx ? `${a.edgeIdx}|${b.edgeIdx}` : `${b.edgeIdx}|${a.edgeIdx}`;
      if (seen.has(pk)) continue;
      seen.add(pk);
      const ea = flow.edges[a.edgeIdx];
      const eb = flow.edges[b.edgeIdx];
      out.push({
        a: ea,
        b: eb,
        at: [Math.abs(a.y1 - a.y2) <= EPS ? b.x1 : a.x1, Math.abs(a.y1 - a.y2) <= EPS ? a.y1 : b.y1],
      });
    }
  }
  return out;
}

function segHitsRect(s: Seg, r: Rect, pad = 0): boolean {
  if (Math.abs(s.y1 - s.y2) <= EPS) {
    return s.y1 > r.y - pad && s.y1 < r.y + r.h + pad &&
      Math.max(s.x1, s.x2) > r.x - pad && Math.min(s.x1, s.x2) < r.x + r.w + pad;
  }
  if (Math.abs(s.x1 - s.x2) <= EPS) {
    return s.x1 > r.x - pad && s.x1 < r.x + r.w + pad &&
      Math.max(s.y1, s.y2) > r.y - pad && Math.min(s.y1, s.y2) < r.y + r.h + pad;
  }
  return false;
}

function rectOverlap(a: Rect, b: Rect, pad = 0): boolean {
  return a.x < b.x + b.w + pad && a.x + a.w > b.x - pad &&
    a.y < b.y + b.h + pad && a.y + a.h > b.y - pad;
}

/**
 * autoLayout 场景的几何校验（fail-loud）。调用方负责先过 schema/rule 层
 * （边 id 必填唯一、from/to 引用存在在那里保证）。
 */
export function validateFlowGeometry(flow: FlowGeometryView, source: string): Issue[] {
  const issues: Issue[] = [];
  const fail = (where: string, message: string) =>
    issues.push({ level: "error", where: `${source} · ${where}`, message });
  const warn = (where: string, message: string) =>
    issues.push({ level: "warn", where: `${source} · ${where}`, message });

  const boxes: Array<{ n: FlowNode } & Rect> = flow.nodes.map((n) => ({
    n,
    x: n.x,
    y: n.y,
    w: n.w,
    h: n.h ?? NODE_DEFAULT_H[n.kind],
  }));
  const byId = new Map(boxes.map((b) => [b.n.id, b]));
  /** 路由障碍节点表：routingObstacle:false 的（纯装饰横条）不参与穿行检查 */
  const obstacleBoxes = boxes.filter((b) => b.n.routingObstacle !== false);
  const near = (a: number, b: number) => Math.abs(a - b) <= 2;
  const edgeName = (e: FlowEdge) => `${e.id}（${e.from}→${e.to}）`;

  // 1. 节点必须落在画布内，并完整落在它声明的泳道内。
  for (const b of boxes) {
    const laneIndex = b.n.laneIndex;
    const lane = laneIndex == null ? undefined : flow.lanes[laneIndex];
    if (!lane) {
      fail(`节点 ${b.n.id}`, `laneIndex=${laneIndex} 不存在`);
      continue;
    }
    if (b.x < 0 || b.y < 0 || b.x + b.w > flow.width + EPS || b.y + b.h > flow.height + EPS) {
      fail(`节点 ${b.n.id}`, "节点矩形超出画布边界");
    }
    if (lane.top != null && lane.height != null &&
      (b.y < lane.top - EPS || b.y + b.h > lane.top + lane.height + EPS)) {
      fail(`节点 ${b.n.id}`, `节点矩形超出泳道「${lane.label}」`);
    }
  }

  // 2. 任意两个节点不可重叠（含装饰横条——它们同样占据版面）。
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (
        Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > EPS &&
        Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > EPS
      ) {
        fail(`节点 ${a.n.id}/${b.n.id}`, "两个节点矩形发生重叠");
      }
    }
  }

  const onBoundary = (p: [number, number], b: { x: number; y: number; w: number; h: number }) => {
    const [x, y] = p;
    const onVertical = (near(x, b.x) || near(x, b.x + b.w)) && y >= b.y - 2 && y <= b.y + b.h + 2;
    const onHorizontal = (near(y, b.y) || near(y, b.y + b.h)) && x >= b.x - 2 && x <= b.x + b.w + 2;
    return onVertical || onHorizontal;
  };

  // 3. 逐边：完整性、边界附着、越界、正交性、重复点、穿行障碍节点
  const allSegs: Seg[] = [];
  for (const [edgeIdx, edge] of flow.edges.entries()) {
    const name = edgeName(edge);
    const route = edge.route;
    const src = byId.get(edge.from), dst = byId.get(edge.to);
    if (!src || !dst) continue; // 引用完整性由 rules 层处理
    if (!route || route.length < 2) {
      fail(`边 ${name}`, "缺少构建期正交路线");
      continue;
    }
    for (const [i, p] of route.entries()) {
      if (p[0] < -EPS || p[0] > flow.width + EPS || p[1] < -EPS || p[1] > flow.height + EPS) {
        fail(`边 ${name}`, `路线点 (${p[0]},${p[1]}) 超出画布 ${flow.width}×${flow.height}`);
      }
      if (i > 0 && p[0] === route[i - 1][0] && p[1] === route[i - 1][1]) {
        fail(`边 ${name}`, `第 ${i} 个路线点与前一点重复：(${p[0]},${p[1]})`);
      }
    }
    if (!onBoundary(route[0], src)) {
      fail(`边 ${name}`, "起点没有落在源节点边界上");
    }
    if (!onBoundary(route[route.length - 1], dst)) {
      fail(`边 ${name}`, "终点没有落在目标节点边界上");
    }
    for (let i = 1; i < route.length; i++) {
      const a = route[i - 1], b = route[i];
      if (Math.abs(a[0] - b[0]) > EPS && Math.abs(a[1] - b[1]) > EPS) {
        fail(`边 ${name}`, `第 ${i} 段不是正交线段`);
        continue;
      }
      const seg: Seg = { x1: a[0], y1: a[1], x2: b[0], y2: b[1], edgeIdx };
      for (const box of obstacleBoxes) {
        if (segHitsRect(seg, box, -EPS)) {
          fail(`边 ${name}`, `路线穿过节点 ${box.n.id}（@${a[0]},${a[1]}→${b[0]},${b[1]}）`);
          break;
        }
      }
      allSegs.push(seg);
    }
  }

  // 4. 标签：出界 error；压非端点节点 error；压自身端点节点 warn（聚合其余碰撞）
  const labelIssues: string[] = [];
  const labelRects: Array<{ e: FlowEdge; r: Rect }> = [];
  for (const edge of flow.edges) {
    if (!edge.label || !edge.labelAt) continue;
    const r = labelRect(edge.labelAt, edge.label);
    labelRects.push({ e: edge, r });
    if (r.x < -EPS || r.y < -EPS || r.x + r.w > flow.width + EPS || r.y + r.h > flow.height + EPS) {
      fail(`边 ${edgeName(edge)}`, `标签「${edge.label}」越出画布（@${edge.labelAt[0]},${edge.labelAt[1]}）`);
    }
    for (const box of boxes) {
      if (!rectOverlap(r, box, 6)) continue;
      if (box.n.id === edge.from || box.n.id === edge.to) {
        warn(`边 ${edgeName(edge)}`, `标签「${edge.label}」可能与自身端点节点 ${box.n.id} 重叠`);
      } else {
        fail(`边 ${edgeName(edge)}`, `标签「${edge.label}」压到非关联节点 ${box.n.id}`);
      }
    }
  }
  for (let i = 0; i < labelRects.length; i++) {
    for (let j = i + 1; j < labelRects.length; j++) {
      if (rectOverlap(labelRects[i].r, labelRects[j].r)) {
        labelIssues.push(
          `「${labelRects[i].e.label}」×「${labelRects[j].e.label}」（${labelRects[i].e.id}/${labelRects[j].e.id}）`,
        );
      }
    }
  }
  for (const { e, r } of labelRects) {
    for (const s of allSegs) {
      if (flow.edges[s.edgeIdx]?.id === e.id) continue;
      if (segHitsRect(s, r, 3)) {
        labelIssues.push(`「${e.label}」压线 ${flow.edges[s.edgeIdx]?.id}`);
        break;
      }
    }
  }
  if (labelIssues.length > 0) {
    warn("(标签)", `标签碰撞 ${labelIssues.length} 处（前 5）：${labelIssues.slice(0, 5).join("；")}`);
  }

  // 5. 边-边交叉：聚合上报（主链×主链单独计数；升级 error 待 crossing 调优收敛）
  const pairs = crossingPairs(flow);
  if (pairs.length > 0) {
    const pp = pairs.filter((p) => p.a.routeRole === "primary" && p.b.routeRole === "primary");
    warn(
      "(交叉)",
      `边交叉 ${pairs.length} 对（主链×主链 ${pp.length} 对，前 5）：` +
        pairs.slice(0, 5).map((p) => `${p.a.id}×${p.b.id}@${p.at[0]},${p.at[1]}`).join("；"),
    );
  }

  return issues;
}
