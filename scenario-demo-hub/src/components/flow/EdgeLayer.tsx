import type { FlowEdge, FlowNode } from "../../schema/scenario";
import { nodeH } from "./NodeBox";

type Side = NonNullable<FlowEdge["fromSide"]>;

function anchor(n: FlowNode, side: Side): [number, number] {
  const h = nodeH(n);
  switch (side) {
    case "left": return [n.x, n.y + h / 2];
    case "right": return [n.x + n.w, n.y + h / 2];
    case "top": return [n.x + n.w / 2, n.y];
    case "bottom": return [n.x + n.w / 2, n.y + h];
  }
}

/** 未指定锚点时按相对位置推断：水平距大则左右，否则上下 */
function autoSides(a: FlowNode, b: FlowNode): [Side, Side] {
  const acx = a.x + a.w / 2;
  const acy = a.y + nodeH(a) / 2;
  const bcx = b.x + b.w / 2;
  const bcy = b.y + nodeH(b) / 2;
  const dx = bcx - acx;
  const dy = bcy - acy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? ["right", "left"] : ["left", "right"];
  }
  return dy >= 0 ? ["bottom", "top"] : ["top", "bottom"];
}

function edgePath(e: FlowEdge, byId: Map<string, FlowNode>): string | null {
  // 自动布局产物：ELK/链式布局已给出含起止点的完整正交折线，直接消费
  if (e.route && e.route.length >= 2) {
    return e.route.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  }
  const from = byId.get(e.from);
  const to = byId.get(e.to);
  if (!from || !to) return null;
  const [autoFrom, autoTo] = autoSides(from, to);
  const [x1, y1] = anchor(from, e.fromSide ?? autoFrom);
  const [x2, y2] = anchor(to, e.toSide ?? autoTo);
  const pts: Array<[number, number]> = [[x1, y1], ...(e.via ?? []), [x2, y2]];
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
}

const EDGE_STROKE: Record<FlowEdge["style"], { color: string; width: number; dash?: string; marker: string }> = {
  main: { color: "var(--c-accent)", width: 2, marker: "url(#ao)" },
  dash: { color: "var(--c-accent)", width: 1.6, dash: "6,4", marker: "url(#ao)" },
  grayDash: { color: "var(--c-gray-3)", width: 1.6, dash: "5,4", marker: "url(#ag)" },
};

export interface RelatedSet {
  ids: Set<string>;
  eidx: Set<number>;
}

interface Props {
  /** 可见边（图例过滤后），i 为 flow.edges 原始下标（高亮关系集对位） */
  visible: Array<{ e: FlowEdge; i: number }>;
  byId: Map<string, FlowNode>;
  related: RelatedSet | null;
  worldW: number;
  worldH: number;
}

/**
 * 边层：正交连线（svg，z2 在节点之下）+ 边标签（div，z4 在节点之上、
 * 白底 halo 保证压线可读）。整体渲染在节点之后，保证标签永不被卡片盖住。
 */
export function EdgeLayer({ visible, byId, related, worldW, worldH }: Props) {
  return (
    <>
      <svg className="arrows" viewBox={`0 0 ${worldW} ${worldH}`}>
        <defs>
          <marker id="ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ff4b16" />
          </marker>
          <marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#9aa3ae" />
          </marker>
        </defs>
        {visible.map(({ e, i }) => {
          const d = edgePath(e, byId);
          if (!d) return null;
          const st = EDGE_STROKE[e.style];
          const dim = related ? !related.eidx.has(i) : false;
          return (
            <path key={i} d={d} fill="none" stroke={st.color} strokeWidth={st.width}
              strokeDasharray={st.dash} markerEnd={st.marker} className={dim ? "dim" : undefined} />
          );
        })}
      </svg>
      {visible.map(({ e, i }) => {
        if (!e.label) return null;
        const at = e.labelAt ?? [0, 0];
        const dim = related ? !related.eidx.has(i) : false;
        return (
          <div key={`lab-${i}`} className={`lab${e.style === "grayDash" ? " g" : ""}${dim ? " dim" : ""}`}
            style={{ left: at[0], top: at[1] }}>
            {e.label}
          </div>
        );
      })}
    </>
  );
}
