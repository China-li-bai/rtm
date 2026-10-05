import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FlowEdge, FlowNode, ScenarioConfig } from "../schema/scenario";
import { rich } from "../lib/rich";

type Flow = ScenarioConfig["flow"];

interface Props {
  flow: Flow;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** 视口高度（设计稿像素，默认 620） */
  viewH?: number;
}

const DEFAULT_H: Record<FlowNode["kind"], number> = {
  normal: 76,
  highlight: 76,
  dashed: 76,
  diamond: 58,
  bar: 44,
  loopchip: 32,
};

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 1.6;

/** 图例：边样式 → 业务含义（与配置中的 style 三态一一对应） */
const LEGEND: Array<{ key: FlowEdge["style"]; label: string }> = [
  { key: "main", label: "业务主流程" },
  { key: "dash", label: "反哺 · 兜底" },
  { key: "grayDash", label: "集成 · 支撑" },
];

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
  // 自动布局产物：ELK 已给出含起止点的完整正交折线，直接消费
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

interface NodeBoxProps {
  n: FlowNode;
  sel: boolean;
  dim: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function NodeBox({ n, sel, dim, onSelect, onHover }: NodeBoxProps) {
  const style = { left: n.x, top: n.y, width: n.w, ...(n.h ? { height: n.h } : {}) };
  const hoverProps = {
    onMouseEnter: () => onHover(n.id),
    onMouseLeave: () => onHover(null),
  };
  if (n.kind === "bar") {
    return (
      <div className={`bar${sel ? " sel" : ""}${dim ? " dim" : ""}`} style={style}
        onClick={() => onSelect(n.id)} {...hoverProps}>
        {n.no && <span className="no">{n.no}</span>}
        <div className="tt"><b>{n.title}</b>{n.sub ? `：${n.sub}` : ""}</div>
      </div>
    );
  }
  if (n.kind === "loopchip") {
    return (
      <div className={`loopchip${sel ? " sel" : ""}${dim ? " dim" : ""}`} style={style}
        onClick={() => onSelect(n.id)} {...hoverProps}>
        {n.title}
      </div>
    );
  }
  if (n.kind === "diamond") {
    return (
      <div className={`node diamond${sel ? " sel" : ""}${dim ? " dim" : ""}`} style={style}
        onClick={() => onSelect(n.id)} {...hoverProps}>
        <div className="tt" style={{ justifyContent: "center", fontSize: "12.5px" }}>{n.title}</div>
      </div>
    );
  }
  const kindCls = (n.kind === "highlight" ? " hl" : n.kind === "dashed" ? " dash" : "") + (n.aip ? " has-aip" : "");
  return (
    <div className={`node${kindCls}${sel ? " sel" : ""}${dim ? " dim" : ""}`} style={style}
      onClick={() => onSelect(n.id)} {...hoverProps}>
      <div className="tt">{n.no && <span className="no">{n.no}</span>}{n.title}</div>
      {n.sub && <div className="st">{rich(n.sub)}</div>}
      {n.aip && <span className="aip">{n.aip}</span>}
    </div>
  );
}

/**
 * 泳道画布 v2（视口级）：世界坐标渲染 + 视口导航。
 * - 交互：滚轮缩放（以光标为锚点，0.2~1.6）／拖拽平移／小地图点击与拖拽导航
 * - 图例过滤：按边样式显隐（主流程／反哺兜底／集成支撑）
 * - 悬停高亮：悬停节点时提亮相邻节点与连线，其余淡出；选中节点常显
 * - 兼容 useScale：外层整页缩放仅作视觉缩放，手势换算按 getBoundingClientRect 比例补偿
 */
export function FlowCanvas({ flow, selectedId, onSelect, viewH = 620 }: Props) {
  const worldW = flow.width;
  const worldH = flow.height;
  const vpRef = useRef<HTMLDivElement>(null);
  const mmRef = useRef<HTMLDivElement>(null);
  const [vpSize, setVpSize] = useState({ w: flow.width, h: viewH });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState<Set<FlowEdge["style"]>>(new Set());
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const panRef = useRef(pan);
  panRef.current = pan;
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number; k: number } | null>(null);
  const movedRef = useRef(false);

  const byId = useMemo(() => new Map(flow.nodes.map((n) => [n.id, n])), [flow.nodes]);

  /** 画布内 1 设计像素对应的外层视觉缩放比例（useScale 祖先 transform 补偿） */
  const outerScale = useCallback(() => {
    const el = vpRef.current;
    if (!el || el.clientWidth === 0) return 1;
    return el.getBoundingClientRect().width / el.clientWidth;
  }, []);

  /* 容器尺寸观测（设计像素，不受祖先 transform 影响） */
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setVpSize({ w: el.clientWidth, h: el.clientHeight });
    });
    setVpSize({ w: el.clientWidth, h: el.clientHeight });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** 适配宽度（默认视图）：全宽可见，缩放不超过 1 */
  const fitWidth = useCallback(() => {
    const z = Math.min(1, vpSize.w / worldW);
    setZoom(z);
    setPan({ x: 0, y: 0 });
  }, [vpSize.w, worldW]);

  /** 适配窗口：整个世界纳入视口并居中 */
  const fitAll = useCallback(() => {
    const z = Math.max(MIN_ZOOM, Math.min(vpSize.w / worldW, vpSize.h / worldH) * 0.96);
    setZoom(z);
    setPan({ x: (vpSize.w - worldW * z) / 2, y: (vpSize.h - worldH * z) / 2 });
  }, [vpSize, worldW, worldH]);

  useEffect(() => { fitWidth(); }, [fitWidth]);

  /* 滚轮缩放（原生非被动监听，preventDefault 阻止页面滚动；以光标为锚点） */
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const k = el.clientWidth === 0 ? 1 : el.getBoundingClientRect().width / el.clientWidth;
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / k;
      const cy = (e.clientY - rect.top) / k;
      const z0 = zoomRef.current;
      const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z0 * Math.pow(1.0015, -e.deltaY)));
      const r = z / z0;
      const p = panRef.current;
      zoomRef.current = z;
      panRef.current = { x: cx - (cx - p.x) * r, y: cy - (cy - p.y) * r };
      setZoom(z);
      setPan(panRef.current);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* 防御原生滚动失同步：世界溢出使 vp 成为隐藏滚动容器，滚动锚定/浏览器滚动恢复
     可能改写 scrollTop，导致渲染偏移与 React 平移状态脱节（小地图/覆盖层错位）。
     CSS 侧已用 overflow:clip 根除；此处兜底不支持 clip 的浏览器（如 Safari<16）。 */
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    el.scrollTop = 0;
    el.scrollLeft = 0;
  }, [zoom, pan]);

  /* 悬停/选中的高亮关系集：自身 + 相邻节点 + 相连边 */
  const related = useMemo(() => {
    const focus = hoverId ?? selectedId;
    if (!focus) return null;
    const ids = new Set<string>([focus]);
    const eidx = new Set<number>();
    flow.edges.forEach((e, i) => {
      if (hidden.has(e.style)) return;
      if (e.from === focus || e.to === focus) {
        ids.add(e.from);
        ids.add(e.to);
        eidx.add(i);
      }
    });
    return { ids, eidx };
  }, [hoverId, selectedId, flow.edges, hidden]);

  /* 选中节点滚出视口时自动回中（程序性选中，如 defaultSelected） */
  useEffect(() => {
    if (!selectedId) return;
    const n = byId.get(selectedId);
    if (!n) return;
    const z = zoomRef.current;
    const p = panRef.current;
    const vx = -p.x / z;
    const vy = -p.y / z;
    const vw = vpSize.w / z;
    const vh = vpSize.h / z;
    const ncx = n.x + n.w / 2;
    const ncy = n.y + nodeH(n) / 2;
    if (ncx < vx || ncx > vx + vw || ncy < vy || ncy > vy + vh) {
      setPan({ x: vpSize.w / 2 - ncx * z, y: vpSize.h / 2 - ncy * z });
    }
  }, [selectedId, byId, vpSize]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(".node,.bar,.loopchip,.flow-toolbar,.flow-minimap")) return;
    movedRef.current = false;
    dragRef.current = {
      sx: e.clientX, sy: e.clientY,
      px: panRef.current.x, py: panRef.current.y,
      k: outerScale(),
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = (e.clientX - d.sx) / d.k;
    const dy = (e.clientY - d.sy) / d.k;
    if (Math.abs(dx) + Math.abs(dy) > 3) movedRef.current = true;
    setPan({ x: d.px + dx, y: d.py + dy });
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  /** 平移后抬起，抑制误触节点点击 */
  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      movedRef.current = false;
    }
  };

  const zoomBy = (factor: number) => {
    const z0 = zoomRef.current;
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z0 * factor));
    const p = panRef.current;
    const cx = vpSize.w / 2;
    const cy = vpSize.h / 2;
    const r = z / z0;
    setZoom(z);
    setPan({ x: cx - (cx - p.x) * r, y: cy - (cy - p.y) * r });
  };

  const toggleStyle = (key: FlowEdge["style"]) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /* 小地图几何与导航 */
  const mmW = 168;
  const mmH = Math.max(56, Math.min(124, (mmW * worldH) / worldW));
  const mmNav = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = mmRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const k = rect.width / mmW; // 外层视觉缩放补偿
    const wx = ((e.clientX - rect.left) / k / mmW) * worldW;
    const wy = ((e.clientY - rect.top) / k / mmH) * worldH;
    const z = zoomRef.current;
    setPan({ x: vpSize.w / 2 - wx * z, y: vpSize.h / 2 - wy * z });
  };
  const mmNavging = useRef(false);
  const vx = -pan.x / zoom;
  const vy = -pan.y / zoom;
  const vw = vpSize.w / zoom;
  const vh = vpSize.h / zoom;

  const visibleEdges = flow.edges.map((e, i) => ({ e, i })).filter(({ e }) => !hidden.has(e.style));

  return (
    <div className="card flow">
      <div
        ref={vpRef}
        className={`flow-vp${dragging ? " dragging" : ""}`}
        style={{ height: viewH }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div
          className="flow-world"
          style={{
            width: worldW,
            height: worldH,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {flow.lanes.map((l, i) => (
            <div key={i}>
              <div className="lane" style={{ top: l.top, height: l.height }} />
              <div className="lane-label" style={{ top: l.top + l.height / 2 }}>{l.label}</div>
            </div>
          ))}

          <svg className="arrows" viewBox={`0 0 ${worldW} ${worldH}`}>
            <defs>
              <marker id="ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#ff4b16" />
              </marker>
              <marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#9aa3ae" />
              </marker>
            </defs>
            {visibleEdges.map(({ e, i }) => {
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

          {visibleEdges.map(({ e, i }) => {
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

          {flow.nodes.map((n) => (
            <NodeBox key={n.id} n={n} sel={selectedId === n.id}
              dim={related ? !related.ids.has(n.id) : false}
              onSelect={onSelect} onHover={setHoverId} />
          ))}
        </div>

        <div className="flow-toolbar">
          <button onClick={() => zoomBy(1 / 1.25)} aria-label="缩小">−</button>
          <span className="flow-zoom">{Math.round(zoom * 100)}%</span>
          <button onClick={() => zoomBy(1.25)} aria-label="放大">＋</button>
          <span className="flow-tbdiv" />
          <button onClick={fitAll}>适应窗口</button>
          <button onClick={fitWidth}>重置视图</button>
          <span className="flow-tbdiv" />
          {LEGEND.map((l) => (
            <button key={l.key}
              className={`flow-chip${hidden.has(l.key) ? " off" : ""}`}
              onClick={() => toggleStyle(l.key)}>
              <i className={`lg lg-${l.key}`} />{l.label}
            </button>
          ))}
        </div>

        <div
          ref={mmRef}
          className="flow-minimap"
          title="点击/拖拽导航"
          onPointerDown={(e) => { mmNavging.current = true; e.currentTarget.setPointerCapture(e.pointerId); mmNav(e); }}
          onPointerMove={(e) => { if (mmNavging.current) mmNav(e); }}
          onPointerUp={() => { mmNavging.current = false; }}
        >
          <svg viewBox={`0 0 ${worldW} ${worldH}`} width={mmW} height={mmH}>
            {flow.lanes.map((l, i) => (
              <rect key={i} x={8} y={l.top} width={worldW - 16} height={l.height} rx={8} fill="#eef1f5" />
            ))}
            {visibleEdges.map(({ e, i }) => {
              const a = byId.get(e.from);
              const b = byId.get(e.to);
              if (!a || !b) return null;
              return (
                <line key={`mm-${i}`}
                  x1={a.x + a.w / 2} y1={a.y + nodeH(a) / 2}
                  x2={b.x + b.w / 2} y2={b.y + nodeH(b) / 2}
                  stroke={e.style === "grayDash" ? "#c3c9d1" : "#ffab8f"} strokeWidth={2} />
              );
            })}
            {flow.nodes.map((n) => (
              <rect key={`mm-${n.id}`} x={n.x} y={n.y} width={n.w} height={nodeH(n)} rx={6}
                fill={n.id === selectedId ? "#ff4b16" : n.kind === "bar" ? "#ffd8c7" : "#ffffff"}
                stroke="#b8bfc8" strokeWidth={1} />
            ))}
            <rect className="mm-vp" x={vx} y={vy} width={vw} height={vh} rx={4} />
          </svg>
        </div>

        {flow.dataSupport && (
          <div className="datasup">
            <b>数据支撑</b>{flow.dataSupport.replace(/^数据支撑/, "")}
          </div>
        )}
      </div>
    </div>
  );
}
