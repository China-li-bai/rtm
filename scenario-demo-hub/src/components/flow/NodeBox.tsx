import type { FlowNode } from "../../schema/scenario";
import { NODE_DEFAULT_H } from "../../flow/tokens";
import { rich } from "../../lib/rich";

export function nodeH(n: FlowNode): number {
  return n.h ?? NODE_DEFAULT_H[n.kind];
}

interface NodeBoxProps {
  n: FlowNode;
  sel: boolean;
  dim: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/** 泳道节点卡片：normal/highlight/dashed/diamond/bar/loopchip 六形态的分发渲染 */
export function NodeBox({ n, sel, dim, onSelect, onHover }: NodeBoxProps) {
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
