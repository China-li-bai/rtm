import { useRef } from "react";
import type { FlowEdge, FlowNode, ScenarioConfig } from "../../schema/scenario";
import { FLOW } from "../../flow/tokens";
import { nodeH } from "./NodeBox";

type Lane = ScenarioConfig["flow"]["lanes"][number];

interface Props {
  worldW: number;
  worldH: number;
  lanes: Lane[];
  nodes: FlowNode[];
  visible: Array<{ e: FlowEdge; i: number }>;
  byId: Map<string, FlowNode>;
  selectedId: string | null;
  /** 视口可见窗口（世界坐标） */
  view: { vx: number; vy: number; vw: number; vh: number };
  /** 把世界坐标点导航到视口中心 */
  onNavigate: (wx: number, wy: number) => void;
}

/** 小地图导航：点击/拖拽把对应世界位置居中。世界整体可见时由父组件隐藏（无导航价值且遮内容）。 */
export function MiniMap({ worldW, worldH, lanes, nodes, visible, byId, selectedId, view, onNavigate }: Props) {
  const mmRef = useRef<HTMLDivElement>(null);
  const mmW = FLOW.MINIMAP_W;
  const mmH = Math.max(FLOW.MINIMAP_H_MIN, Math.min(FLOW.MINIMAP_H_MAX, (mmW * worldH) / worldW));
  const navging = useRef(false);

  const nav = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = mmRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const k = rect.width / mmW; // 外层视觉缩放补偿
    const wx = ((e.clientX - rect.left) / k / mmW) * worldW;
    const wy = ((e.clientY - rect.top) / k / mmH) * worldH;
    onNavigate(wx, wy);
  };

  return (
    <div
      ref={mmRef}
      className="flow-minimap"
      title="点击/拖拽导航"
      onPointerDown={(e) => { navging.current = true; e.currentTarget.setPointerCapture(e.pointerId); nav(e); }}
      onPointerMove={(e) => { if (navging.current) nav(e); }}
      onPointerUp={() => { navging.current = false; }}
    >
      <svg viewBox={`0 0 ${worldW} ${worldH}`} width={mmW} height={mmH}>
        {lanes.map((l, i) => (
          <rect key={i} x={8} y={l.top} width={worldW - 16} height={l.height} rx={8} fill="#eef1f5" />
        ))}
        {visible.map(({ e }) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          return (
            <line key={`mm-${e.from}-${e.to}`}
              x1={a.x + a.w / 2} y1={a.y + nodeH(a) / 2}
              x2={b.x + b.w / 2} y2={b.y + nodeH(b) / 2}
              stroke={e.style === "grayDash" ? "#c3c9d1" : "#ffab8f"} strokeWidth={2} />
          );
        })}
        {nodes.map((n) => (
          <rect key={`mm-${n.id}`} x={n.x} y={n.y} width={n.w} height={nodeH(n)} rx={6}
            fill={n.id === selectedId ? "#ff4b16" : n.kind === "bar" ? "#ffd8c7" : "#ffffff"}
            stroke="#b8bfc8" strokeWidth={1} />
        ))}
        <rect className="mm-vp" x={view.vx} y={view.vy} width={view.vw} height={view.vh} rx={4} />
      </svg>
    </div>
  );
}
