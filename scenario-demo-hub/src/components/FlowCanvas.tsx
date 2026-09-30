import type { FlowEdge, FlowNode, ScenarioConfig } from "../schema/scenario";
import { rich } from "../lib/rich";

type Flow = ScenarioConfig["flow"];

interface Props {
  flow: Flow;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const DEFAULT_H: Record<FlowNode["kind"], number> = {
  normal: 76,
  highlight: 76,
  dashed: 76,
  diamond: 58,
  bar: 44,
  loopchip: 32,
};

function nodeH(n: FlowNode): number {
  return n.h ?? DEFAULT_H[n.kind];
}

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

function NodeBox({ n, sel, onSelect }: { n: FlowNode; sel: boolean; onSelect: (id: string) => void }) {
  const style = { left: n.x, top: n.y, width: n.w, ...(n.h ? { height: n.h } : {}) };
  if (n.kind === "bar") {
    return (
      <div className={`bar${sel ? " sel" : ""}`} style={style} onClick={() => onSelect(n.id)}>
        {n.no && <span className="no">{n.no}</span>}
        <div className="tt"><b>{n.title}</b>{n.sub ? `：${n.sub}` : ""}</div>
      </div>
    );
  }
  if (n.kind === "loopchip") {
    return (
      <div className={`loopchip${sel ? " sel" : ""}`} style={style} onClick={() => onSelect(n.id)}>
        {n.title}
      </div>
    );
  }
  if (n.kind === "diamond") {
    return (
      <div className={`node diamond${sel ? " sel" : ""}`} style={style} onClick={() => onSelect(n.id)}>
        <div className="tt" style={{ justifyContent: "center", fontSize: "12.5px" }}>{n.title}</div>
      </div>
    );
  }
  const kindCls = (n.kind === "highlight" ? " hl" : n.kind === "dashed" ? " dash" : "") + (n.aip ? " has-aip" : "");
  return (
    <div className={`node${kindCls}${sel ? " sel" : ""}`} style={style} onClick={() => onSelect(n.id)}>
      <div className="tt">{n.no && <span className="no">{n.no}</span>}{n.title}</div>
      {n.sub && <div className="st">{rich(n.sub)}</div>}
      {n.aip && <span className="aip">{n.aip}</span>}
    </div>
  );
}

/** 泳道画布：配置坐标 + 声明式箭头（渲染器从节点锚点推导起止点） */
export function FlowCanvas({ flow, selectedId, onSelect }: Props) {
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  return (
    <div className="card flow" style={{ height: flow.height }}>
      {flow.lanes.map((l, i) => (
        <div key={i}>
          <div className="lane" style={{ top: l.top, height: l.height }} />
          <div className="lane-label" style={{ top: l.top + l.height / 2 }}>{l.label}</div>
        </div>
      ))}

      <svg className="arrows" viewBox={`0 0 ${flow.width} ${flow.height}`}>
        <defs>
          <marker id="ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ff4b16" />
          </marker>
          <marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#9aa3ae" />
          </marker>
        </defs>
        {flow.edges.map((e, i) => {
          const d = edgePath(e, byId);
          if (!d) return null;
          const st = EDGE_STROKE[e.style];
          return (
            <path key={i} d={d} fill="none" stroke={st.color} strokeWidth={st.width}
              strokeDasharray={st.dash} markerEnd={st.marker} />
          );
        })}
      </svg>

      {flow.edges.map((e, i) => {
        if (!e.label) return null;
        const at = e.labelAt ?? [0, 0];
        return (
          <div key={`lab-${i}`} className={`lab${e.style === "grayDash" ? " g" : ""}`}
            style={{ left: at[0], top: at[1] }}>
            {e.label}
          </div>
        );
      })}

      {flow.nodes.map((n) => (
        <NodeBox key={n.id} n={n} sel={selectedId === n.id} onSelect={onSelect} />
      ))}

      {flow.dataSupport && (
        <div className="datasup" style={{ top: flow.height - 32 }}>
          <b>数据支撑</b>{flow.dataSupport.replace(/^数据支撑/, "")}
        </div>
      )}
    </div>
  );
}
