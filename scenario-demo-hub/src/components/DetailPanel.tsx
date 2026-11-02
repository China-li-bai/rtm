import type { RefInfo } from "../lib/refs";
import { rich } from "../lib/rich";
import type { FlowNode } from "../schema/scenario";

interface Props {
  node: FlowNode;
  refs: Map<string, RefInfo>;
  onOpenRef: (ref: string) => void;
}

/** 环节详情：先问题、再价值、再做法，场景挂接放在文末 */
export function DetailPanel({ node, refs, onOpenRef }: Props) {
  const aip = node.panelAip ?? node.aip;
  return (
    <div className="card panel">
      <div className="p-head">
        <div className="p-title">{node.no ? `${node.no} ` : ""}{node.panelTitle ?? node.title}</div>
        {aip ? <span className="p-aip">{aip}</span> : null}
      </div>

      {node.legacy && (
        <div className="p-evolve">
          <div className="p-evolve-row legacy">
            <span className="p-evolve-tag">要解决的问题</span>
            <div className="txt">{rich(node.legacy)}</div>
          </div>
        </div>
      )}

      {(node.whyAi || node.highlights.length > 0) && (
        <div className="p-evolve">
          {node.whyAi && (
            <div className="p-evolve-row why">
              <span className="p-evolve-tag">做成之后</span>
              <div className="txt">{rich(node.whyAi)}</div>
            </div>
          )}
          <div className="p-col" style={{ marginTop: 8 }}>
            <h5>价值</h5>
            <ul>{node.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
          </div>
        </div>
      )}

      <div className="p-grid">
        <div className="p-col">
          <h5>AI 怎么做</h5>
          <div className="txt">{rich(node.ai)}</div>
        </div>
        <div className="p-col">
          <h5>业务流程</h5>
          <ul>{node.process.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      </div>

      {node.humanRole && (
        <div className="p-evolve">
          <div className="p-evolve-row human">
            <span className="p-evolve-tag">人还在哪</span>
            <div className="txt">{rich(node.humanRole)}</div>
          </div>
        </div>
      )}

      {node.risks && node.risks.length > 0 && (
        <div className="p-risks">
          <div className="sec-t">■ 风险与规避</div>
          <table>
            <thead>
              <tr><th style={{ width: "44%" }}>风险</th><th>规避手段</th></tr>
            </thead>
            <tbody>
              {node.risks.map((r, i) => (
                <tr key={i}>
                  <td className="rk">{rich(r.risk)}</td>
                  <td className="gd">{rich(r.guard)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {node.fallback && (
        <div className="p-fallback">
          <span className="p-evolve-tag">出错时怎么办</span>
          <div className="txt">{rich(node.fallback)}</div>
        </div>
      )}

      {node.metrics && node.metrics.length > 0 && (
        <div className="p-metrics">
          <div className="sec-t">■ 成效与验收</div>
          <table>
            <thead>
              <tr><th style={{ width: "42%" }}>指标</th><th>目标 / 实测</th></tr>
            </thead>
            <tbody>
              {node.metrics.map((r, i) => (
                <tr key={i}>
                  <td className="mk">{r.m}</td>
                  <td className="mv">{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {node.trace && node.trace.length > 0 && (
        <div className="p-trace">
          <div className="sec-t">■ 追溯链（能力 → 组件 → 技术锚点，反向即「被服务」）</div>
          <div className="p-trace-chips">
            {node.trace.map((t, i) => <span key={i} className="p-trace-chip">{t}</span>)}
          </div>
        </div>
      )}

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

      <div className="sec-t">■ 挂接的场景与约束</div>
      <div className="svwrap">
        {node.solves.map((s) => {
          const r = refs.get(s.ref);
          if (!r) return null;
          return (
            <div key={s.ref} className={`sv${r.kind === "C" ? " c" : ""}`}>
              <div className="sv-h">
                <span className={`bdg ${r.cls}`} onClick={() => onOpenRef(s.ref)}>{r.badge}</span>
                <b>{r.full}</b>
                <span className="more" onClick={() => onOpenRef(s.ref)}>查看完整场景 ↗</span>
              </div>
              <div className="sv-how"><b>这一步怎么接上：</b>{s.how}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
