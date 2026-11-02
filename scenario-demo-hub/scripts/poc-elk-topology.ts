/**
 * 阶段3 POC：对照 draw.io elkLayered，把真实边喂给 ELK layered。
 * 只打印层分配，不回写 JSON。运行：npx tsx scripts/poc-elk-topology.ts
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ElkConstructor from "elkjs/lib/elk.bundled.js";
import type { ElkNode } from "elkjs/lib/elk-api";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = JSON.parse(
  readFileSync(join(root, "scenarios/ai-chat-guide.json"), "utf8"),
) as {
  flow: {
    chain?: string[];
    nodes: Array<{
      id: string; w: number; h?: number; kind?: string; laneIndex?: number; col?: number; row?: number; x?: number;
    }>;
    edges: Array<{ id: string; from: string; to: string; routeRole?: string }>;
  };
};

const elk = new ElkConstructor();
const nodes = cfg.flow.nodes.filter((n) => (n.kind ?? "normal") !== "bar");
const byId = new Map(cfg.flow.nodes.map((n) => [n.id, n]));
const chain = cfg.flow.chain ?? [];

function childOpts(id: string): Record<string, string> {
  const opts: Record<string, string> = {};
  const idx = chain.indexOf(id);
  if (idx >= 0) opts["org.eclipse.elk.position"] = `(${idx * 200}, ${(byId.get(id)?.laneIndex ?? 0) * 80})`;
  for (let i = 0; i < chain.length - 1; i++) {
    const a = chain[i];
    const b = chain[i + 1];
    if (b !== id) continue;
    const na = byId.get(a);
    const nb = byId.get(b);
    if (na && nb && na.laneIndex !== nb.laneIndex && (na.kind ?? "normal") !== "bar" && (nb.kind ?? "normal") !== "bar") {
      opts["org.eclipse.elk.layered.crossingMinimization.inLayerPredOf"] = a;
    }
  }
  return opts;
}

const graph: ElkNode = {
  id: "root",
  layoutOptions: {
    "org.eclipse.elk.algorithm": "layered",
    "org.eclipse.elk.direction": "RIGHT",
    "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
    "org.eclipse.elk.spacing.nodeNode": "40",
    "org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": "80",
    "org.eclipse.elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
    "org.eclipse.elk.layered.layering.strategy": "NETWORK_SIMPLEX",
    "org.eclipse.elk.layered.cycleBreaking.strategy": "GREEDY_MODEL_ORDER",
    "org.eclipse.elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
    "org.eclipse.elk.layered.crossingMinimization.semiInteractive": "true",
    "org.eclipse.elk.layered.feedbackEdges": "true",
    "org.eclipse.elk.padding": "[top=0,left=0,bottom=0,right=0]",
  },
  children: nodes.map((n) => ({
    id: n.id,
    width: n.w,
    height: n.h ?? 76,
    layoutOptions: childOpts(n.id),
  })),
  edges: cfg.flow.edges
    .filter((e) => {
      if (e.routeRole === "feedback") return false;
      return nodes.some((n) => n.id === e.from) && nodes.some((n) => n.id === e.to);
    })
    .map((e) => ({
      id: e.id,
      sources: [e.from],
      targets: [e.to],
    })),
};

const out = await elk.layout(graph);
const laid = (out.children ?? [])
  .map((c) => ({
    id: c.id,
    x: Math.round(c.x ?? 0),
    y: Math.round(c.y ?? 0),
    lane: byId.get(c.id)?.laneIndex,
    oldX: byId.get(c.id)?.x,
    col: byId.get(c.id)?.col,
  }))
  .sort((a, b) => a.x - b.x || a.y - b.y);

const layers: string[][] = [];
const THRESH = 40;
for (const n of laid) {
  const last = layers[layers.length - 1];
  const lastX = last ? laid.find((x) => x.id === last[0])!.x : 0;
  if (!last || n.x - lastX > THRESH) layers.push([n.id]);
  else last.push(n.id);
}

console.log("ELK width×height", Math.round(out.width ?? 0), Math.round(out.height ?? 0));
console.log("layers (by x):");
layers.forEach((ids, i) => {
  console.log(
    `  L${i}`,
    ids.map((id) => `${id}(lane${byId.get(id)?.laneIndex},x=${laid.find((n) => n.id === id)?.x})`).join(" | "),
  );
});
console.log("\nnode table:");
for (const n of laid) {
  console.log(
    `${n.id.padEnd(4)} lane=${n.lane} elkX=${String(n.x).padStart(4)} elkY=${String(n.y).padStart(4)} oldX=${n.oldX} col=${n.col ?? "-"}`,
  );
}
