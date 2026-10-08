import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ScenarioConfig } from "../schema/scenario";
import { FLOW } from "../flow/tokens";
import { EdgeLayer } from "./flow/EdgeLayer";
import { FlowToolbar } from "./flow/FlowToolbar";
import { LaneBand } from "./flow/LaneBand";
import { MiniMap } from "./flow/MiniMap";
import { NodeBox, nodeH } from "./flow/NodeBox";

type Flow = ScenarioConfig["flow"];

interface Props {
  flow: Flow;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** 视口高度（设计稿像素，默认 620） */
  viewH?: number;
}

/**
 * 泳道画布 v2（视口级）：世界坐标渲染 + 视口导航。
 * 组成（src/components/flow/）：LaneBand 泳道带 / NodeBox 节点卡 /
 * EdgeLayer 连线与标签 / FlowToolbar 工具栏 / MiniMap 小地图（世界
 * 整体可见时自动隐藏——无导航价值且会遮住底行内容）。
 *
 * 本组件只承担视口职责：滚轮缩放（以光标为锚点，0.2~1.6）/ 拖拽平移 /
 * 悬停高亮关系集 / 选中自动回中；兼容 useScale：外层整页缩放仅作视觉
 * 缩放，手势换算按 getBoundingClientRect 比例补偿。
 */
export function FlowCanvas({ flow, selectedId, onSelect, viewH }: Props) {
  const worldW = flow.width;
  const worldH = flow.height;
  const vpH = viewH ?? flow.viewH ?? 620;
  const vpRef = useRef<HTMLDivElement>(null);
  const [vpSize, setVpSize] = useState({ w: flow.width, h: vpH });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hidden, setHidden] = useState<Set<Flow["edges"][number]["style"]>>(new Set());
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
    const z = Math.max(FLOW.MIN_ZOOM, Math.min(vpSize.w / worldW, vpSize.h / worldH) * 0.96);
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
      const z = Math.min(FLOW.MAX_ZOOM, Math.max(FLOW.MIN_ZOOM, z0 * Math.pow(1.0015, -e.deltaY)));
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

  /* 悬停高亮关系集：自身 + 相邻节点 + 相连边。
     只看悬停、不看选中——选中仅出描边并开抽屉，若选中也压暗其余，
     全景页加载（defaultSelected）即整版 18% 灰，第一印象像渲染故障。 */
  const related = useMemo(() => {
    const focus = hoverId;
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
    const z = Math.min(FLOW.MAX_ZOOM, Math.max(FLOW.MIN_ZOOM, z0 * factor));
    const p = panRef.current;
    const cx = vpSize.w / 2;
    const cy = vpSize.h / 2;
    const r = z / z0;
    setZoom(z);
    setPan({ x: cx - (cx - p.x) * r, y: cy - (cy - p.y) * r });
  };

  const toggleStyle = (key: Flow["edges"][number]["style"]) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const vx = -pan.x / zoom;
  const vy = -pan.y / zoom;
  const vw = vpSize.w / zoom;
  const vh = vpSize.h / zoom;
  /** 世界整体已在视口内：小地图无导航价值，隐藏以免遮住底行内容 */
  const worldFits = worldW * zoom <= vpSize.w + 1 && worldH * zoom <= vpSize.h + 1;

  const visibleEdges = flow.edges.map((e, i) => ({ e, i })).filter(({ e }) => !hidden.has(e.style));

  return (
    <div className="card flow">
      <div
        ref={vpRef}
        className={`flow-vp${dragging ? " dragging" : ""}`}
        style={{ height: vpH }}
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
            <LaneBand key={i} lane={l} />
          ))}

          {flow.nodes.map((n) => (
            <NodeBox key={n.id} n={n} sel={selectedId === n.id}
              dim={related ? !related.ids.has(n.id) : false}
              onSelect={onSelect} onHover={setHoverId} />
          ))}

          <EdgeLayer visible={visibleEdges} byId={byId} related={related} worldW={worldW} worldH={worldH} />
        </div>

        <FlowToolbar zoom={zoom} onZoom={zoomBy} onFitAll={fitAll} onFitWidth={fitWidth}
          edges={flow.edges} hidden={hidden} onToggleStyle={toggleStyle} />

        {!worldFits && (
          <MiniMap
            worldW={worldW} worldH={worldH}
            lanes={flow.lanes} nodes={flow.nodes}
            visible={visibleEdges} byId={byId} selectedId={selectedId}
            view={{ vx, vy, vw, vh }}
            onNavigate={(wx, wy) =>
              setPan({ x: vpSize.w / 2 - wx * zoomRef.current, y: vpSize.h / 2 - wy * zoomRef.current })}
          />
        )}

        {flow.dataSupport && (
          <div className="datasup">
            <b>数据支撑</b>{flow.dataSupport.replace(/^数据支撑/, "")}
          </div>
        )}
      </div>
    </div>
  );
}
