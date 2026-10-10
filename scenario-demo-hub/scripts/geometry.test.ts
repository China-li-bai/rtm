/**
 * 几何规则负向测试：validateFlowGeometry 的硬门禁必须 fail-loud。
 * 运行：npx tsx scripts/geometry.test.ts
 * 覆盖 rtm-flow-layout-routing-agent-plan.md §4.D / 阶段1.5（g5→u3 回归 fixture）。
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateFlowGeometry, type FlowGeometryView } from "../src/flow/geometry-rules";
import type { FlowEdge, FlowNode } from "../src/schema/scenario";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
let failed = 0;

function expect(
  name: string,
  flow: FlowGeometryView,
  want: { errors?: number; warns?: number; match?: RegExp },
) {
  const issues = validateFlowGeometry(flow, "t");
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

/** 节点工厂：必填业务字段给最小占位，几何字段由调用方指定 */
function mkNode(over: Pick<FlowNode, "id" | "x" | "y"> & Partial<FlowNode>): FlowNode {
  return {
    title: over.id,
    kind: "normal",
    laneIndex: 0,
    solves: [],
    beforeAfter: [],
    ai: "ai",
    process: ["process"],
    highlights: ["highlights"],
    w: 100,
    h: 100,
    ...over,
  };
}

/** 最小可测 flow：两节点一直线边（100×100 卡片，画布 400×300） */
function fixture(mutate?: (f: FlowGeometryView) => void): FlowGeometryView {
  const node = (id: string, x: number, y: number) => mkNode({ id, x, y });
  const edge: FlowEdge = {
    id: "e-a-b",
    from: "a",
    to: "b",
    routeRole: "primary",
    style: "main",
    route: [[100, 50], [300, 50]],
  };
  const f: FlowGeometryView = {
    width: 400,
    height: 300,
    lanes: [{ label: "L0", top: 0, height: 300 }],
    nodes: [node("a", 0, 0), node("b", 300, 0)],
    edges: [edge],
  };
  mutate?.(f);
  return f;
}

// 基线：直线主链零问题
expect("基线直线主链零错误", fixture(), { errors: 0, warns: 0 });

// route 点越出画布（g5→u3 x=1370 同型缺陷；竖线下探避开节点 b，
// 终点同步脱离目标边界 → 越界+端点两个 error 都应报出）
expect(
  "route 点越出画布 → error",
  fixture((f) => {
    f.edges[0].route = [[100, 50], [100, 320]];
  }),
  { errors: 2, match: /超出画布/ },
);

// 连续重复路线点
expect(
  "连续重复路线点 → error",
  fixture((f) => {
    f.edges[0].route = [[100, 50], [200, 50], [200, 50], [300, 50]];
  }),
  { errors: 1, match: /重复/ },
);

// 非正交段（单段斜线；终点仍落在 b 的底边界上）
expect(
  "非正交段 → error",
  fixture((f) => {
    f.edges[0].route = [[100, 50], [150, 100], [300, 100]];
  }),
  { errors: 1, match: /正交/ },
);

// 穿过非端点节点：加一个中置节点 c
expect(
  "路线穿过非端点节点 → error",
  fixture((f) => {
    f.nodes.push(mkNode({ id: "c", x: 150, y: 20, w: 60, h: 60 }));
  }),
  { errors: 1, match: /穿过节点 c/ },
);

// routingObstacle:false 的节点不拦路线（装饰横条语义）
expect(
  "穿过 routingObstacle:false 节点 → 不报穿行",
  fixture((f) => {
    f.nodes.push(mkNode({ id: "c", x: 150, y: 20, w: 60, h: 60, kind: "bar", routingObstacle: false }));
  }),
  { errors: 0 },
);

// 标签越出画布 → error
expect(
  "标签越出画布 → error",
  fixture((f) => {
    f.edges[0].label = "长标签";
    f.edges[0].labelAt = [390, 50];
  }),
  { errors: 1, match: /越出画布/ },
);

// 标签压非关联节点 → error；压自身端点节点 → warn（c 放在路由线下方避开穿行）
expect(
  "标签压非关联节点 → error",
  fixture((f) => {
    f.nodes.push(mkNode({ id: "c", x: 140, y: 120, w: 60, h: 30 }));
    f.edges[0].label = "标签";
    f.edges[0].labelAt = [150, 130];
  }),
  { errors: 1, match: /压到非关联节点 c/ },
);
expect(
  "标签压自身端点节点 → warn 不 error",
  fixture((f) => {
    f.edges[0].label = "标签";
    f.edges[0].labelAt = [60, 40];
  }),
  { errors: 0, warns: 1, match: /自身端点节点 a/ },
);

// 同源同目标两条边（唯一 id 各自独立通过，键覆盖防线在 rules 层）
expect(
  "同对平行边（id 唯一）几何各自通过",
  fixture((f) => {
    f.edges.push({ ...f.edges[0], id: "e-a-b-2", route: [[50, 100], [350, 100]] });
  }),
  { errors: 0 },
);

// 边-边交叉 → 聚合 warn
expect(
  "边-边交叉 → warn 且主链×主链计数",
  fixture((f) => {
    f.edges.push({
      id: "e-d-e", from: "a", to: "b", routeRole: "primary", style: "main",
      route: [[200, 0], [200, 200]],
    });
  }),
  { warns: 1, match: /主链×主链 1 对/ },
);

// 缺 route → error（不可静默出坏图）
expect(
  "缺 route → error",
  fixture((f) => {
    f.edges[0].route = undefined;
  }),
  { errors: 1, match: /缺少构建期正交路线/ },
);

// —— 专项回归 fixture：ai-chat-guide g5→u3 不得再越界（含全量场景 route 画布内断言）——
{
  const cfg = JSON.parse(
    readFileSync(join(root, "scenarios/ai-chat-guide.json"), "utf8"),
  ) as { flow: FlowGeometryView };
  const g5u3 = cfg.flow.edges.find((e) => e.id === "e-g5-u3");
  if (!g5u3?.route) throw new Error("fixture 失效：找不到 e-g5-u3");
  const maxX = Math.max(...g5u3.route.map((p) => p[0]));
  const ok = maxX <= cfg.flow.width;
  if (ok) {
    passed++;
    console.log(`  ✓ g5→u3 回归：maxX=${maxX} ≤ ${cfg.flow.width}`);
  } else {
    failed++;
    console.error(`  ✘ g5→u3 回归：maxX=${maxX} > ${cfg.flow.width}`);
  }
  const issuesOf = validateFlowGeometry(cfg.flow, "ai-chat-guide.json");
  const errs = issuesOf.filter((i) => i.level === "error");
  if (errs.length === 0) {
    passed++;
    console.log("  ✓ ai-chat-guide 真实配置 0 error");
  } else {
    failed++;
    console.error("  ✘ ai-chat-guide 真实配置存在 error", errs.map((i) => i.message));
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
