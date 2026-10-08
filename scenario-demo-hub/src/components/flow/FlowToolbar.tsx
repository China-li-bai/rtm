import type { FlowEdge } from "../../schema/scenario";

/** 图例：边样式 → 业务含义（与配置中的 style 三态一一对应） */
const LEGEND: Array<{ key: FlowEdge["style"]; label: string }> = [
  { key: "main", label: "业务主流程" },
  { key: "dash", label: "反哺 · 兜底" },
  { key: "grayDash", label: "服务 · 支撑" },
];

interface Props {
  zoom: number;
  onZoom: (factor: number) => void;
  onFitAll: () => void;
  onFitWidth: () => void;
  edges: FlowEdge[];
  hidden: Set<FlowEdge["style"]>;
  onToggleStyle: (key: FlowEdge["style"]) => void;
}

/** 画布工具栏：缩放/视图 + 边型图例开关（图例只显示该场景实际用到的边型） */
export function FlowToolbar({ zoom, onZoom, onFitAll, onFitWidth, edges, hidden, onToggleStyle }: Props) {
  const legendItems = LEGEND.filter((l) => edges.some((e) => e.style === l.key));
  return (
    <div className="flow-toolbar">
      <button onClick={() => onZoom(1 / 1.25)} aria-label="缩小">−</button>
      <span className="flow-zoom">{Math.round(zoom * 100)}%</span>
      <button onClick={() => onZoom(1.25)} aria-label="放大">＋</button>
      <span className="flow-tbdiv" />
      <button onClick={onFitAll}>适应窗口</button>
      <button onClick={onFitWidth}>重置视图</button>
      <span className="flow-tbdiv" />
      {legendItems.map((l) => (
        <button key={l.key}
          className={`flow-chip${hidden.has(l.key) ? " off" : ""}`}
          onClick={() => onToggleStyle(l.key)}>
          <i className={`lg lg-${l.key}`} />{l.label}
        </button>
      ))}
    </div>
  );
}
