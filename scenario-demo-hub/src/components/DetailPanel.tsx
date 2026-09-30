import type { RefInfo } from "../lib/refs";
import { rich } from "../lib/rich";
import type { FlowNode } from "../schema/scenario";

interface Props {
  node: FlowNode;
  refs: Map<string, RefInfo>;
  onOpenRef: (ref: string) => void;
}

/** 环节详情面板：解决的场景/约束 + AI 做了什么 + 业务流程 + 亮点 + 前后对比 */
export function DetailPanel({ node, refs, onOpenRef }: Props) {
  return (
    <div className="card panel">
      <div className="p-head">
        <div className="p-title">{node.no ? `${node.no} ` : ""}{node.panelTitle ?? node.title}</div>
        {(() => { const aip = node.panelAip ?? node.aip; return aip ? <span className="p-aip">{aip}</span> : null; })()}
        {node.solves.map((s) => {
          const r = refs.get(s.ref);
          return r ? (
            <span key={s.ref} className={`bdg ${r.cls}`} title="点击查看完整场景与解决方案"
              onClick={() => onOpenRef(s.ref)}>
              {r.badge}
            </span>
          ) : null;
        })}
      </div>

      <div className="sec-t">■ 解决的场景 / 约束（点徽章看完整场景）</div>
      <div className="svwrap">
        {node.solves.map((s) => {
          const r = refs.get(s.ref);
          if (!r) return null;
          return (
            <div key={s.ref} className={`sv${r.kind === "C" ? " c" : ""}`}>
              <div className="sv-h">
                <span className={`bdg ${r.cls}`} onClick={() => onOpenRef(s.ref)}>{r.badge}</span>
                <b>{r.full}</b>
                <span className="more" onClick={() => onOpenRef(s.ref)}>完整场景与解决方案 ↗</span>
              </div>
              <div className="sv-story">{r.card}</div>
              <div className="sv-how"><b>→ 本环节针对性解法：</b>{s.how}</div>
            </div>
          );
        })}
      </div>

      <div className="p-grid">
        <div className="p-col">
          <h5>AI 做了什么</h5>
          <div className="txt">{rich(node.ai)}</div>
        </div>
        <div className="p-col">
          <h5>怎么解决（业务流程）</h5>
          <ul>{node.process.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div className="p-col">
          <h5>亮点 · 价值</h5>
          <ul>{node.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
        </div>
      </div>

      {node.beforeAfter.length > 0 && (
        <div className="ba">
          <table>
            <thead>
              <tr><th style={{ width: 70 }}>维度</th><th style={{ width: "47%" }}>使用 AI 前</th><th>使用 AI 后</th></tr>
            </thead>
            <tbody>
              {node.beforeAfter.map((r, i) => (
                <tr key={i}>
                  <td className="dim">{r.dim}</td>
                  <td className="bf">{r.before}</td>
                  <td className="af">{r.after}{r.approx && <span className="approx">示意</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
