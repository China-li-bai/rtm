import { useMemo, useState } from "react";
import type { FlowEdge, FlowNode, ScenarioConfig } from "../schema/scenario";
import { rich } from "../lib/rich";

type Flow = ScenarioConfig["flow"];

interface Props {
  flow: Flow;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** 主链徽标与泳道序号的展示映射 */
const STEP_BADGE = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];

const L2_PAD_TOP = 24;
/** L2 节点区水平居中偏移（内容原 x≈130~490，舞台 1360，右侧留给跨端锚点栏） */
const L2_DX = 320;

function nodeH(n: FlowNode): number {
  return n.h ?? 76;
}

/** laneIndex 可空（schema optional），所有消费处统一兜底为 0 号泳道 */
function laneOf(n: FlowNode): number {
  return n.laneIndex ?? 0;
}

/** 边折线（route 局部化：y 减泳道顶 + 顶距，x 加水平偏移） */
function laneEdgePath(e: FlowEdge, laneTop: number): string | null {
  if (!e.route || e.route.length < 2) return null;
  return e.route
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x + L2_DX},${y - laneTop + L2_PAD_TOP}`)
    .join(" ");
}

const EDGE_STROKE: Record<FlowEdge["style"], { color: string; width: number; dash?: string; marker: string }> = {
  main: { color: "var(--c-accent)", width: 2, marker: "url(#bpo)" },
  dash: { color: "var(--c-accent)", width: 1.6, dash: "6,4", marker: "url(#bpo)" },
  grayDash: { color: "var(--c-gray-3)", width: 1.6, dash: "5,4", marker: "url(#bpg)" },
};

/**
 * 合同蓝图画布：「总索引 + 分层下钻」双态。
 * - L1 总索引：顶部主链七步 + 六泳道行（节点 pill 横排，主链序号徽标），零飞线
 * - L2 泳道下钻：单泳道内部流程（同层正交连线）+ 右侧跨端协同锚点（按对端泳道分组）
 * - L3 节点详情：沿用页面右抽屉（onSelect 触发）
 */
export function BlueprintCanvas({ flow, selectedId, onSelect }: Props) {
  const [laneIdx, setLaneIdx] = useState<number | null>(null);

  const byId = useMemo(() => new Map(flow.nodes.map((n) => [n.id, n])), [flow.nodes]);
  const chain = useMemo(
    () => (flow.indexChain ?? []).map((id) => byId.get(id)).filter((n): n is FlowNode => !!n),
    [flow.indexChain, byId],
  );
  const chainStep = useMemo(() => {
    const m = new Map<string, number>();
    (flow.indexChain ?? []).forEach((id, i) => m.set(id, i));
    return m;
  }, [flow.indexChain]);

  /** L1：每条泳道的节点 */
  const laneNodes = useMemo(
    () => flow.lanes.map((_, i) => flow.nodes.filter((n) => laneOf(n) === i)),
    [flow.lanes, flow.nodes],
  );

  /* ---------------- L2 派生数据 ---------------- */
  const lane = laneIdx !== null ? flow.lanes[laneIdx] : null;
  const l2Nodes = laneIdx !== null ? laneNodes[laneIdx] : [];
  const l2 = useMemo(() => {
    if (laneIdx === null) return { inner: [], outerGroups: [] as Array<{ lane: number; edges: FlowEdge[] }> };
    const inner: FlowEdge[] = [];
    const outer = new Map<number, FlowEdge[]>();
    for (const e of flow.edges) {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      if (!a || !b) continue;
      if (laneOf(a) === laneIdx && laneOf(b) === laneIdx) {
        inner.push(e);
      } else if (laneOf(a) === laneIdx) {
        outer.set(laneOf(b), [...(outer.get(laneOf(b)) ?? []), e]);
      } else if (laneOf(b) === laneIdx) {
        outer.set(laneOf(a), [...(outer.get(laneOf(a)) ?? []), e]);
      }
    }
    return {
      inner,
      outerGroups: [...outer.entries()]
        .sort((x, y) => x[0] - y[0])
        .map(([ln, edges]) => ({ lane: ln, edges })),
    };
  }, [laneIdx, flow.edges, byId]);

  if (laneIdx === null || !lane) {
    /* ================= L1 总索引 ================= */
    return (
      <div className="card flow bp">
        <div className="bp-chain">
          <span className="bp-chain-title">合同业务闭环 · 主链</span>
          {chain.map((n, i) => (
            <span key={n.id} className="bp-chain-item">
              {i > 0 && <span className="bp-chev">→</span>}
              <button
                className={`bp-step${n.kind === "highlight" ? " hl" : ""}`}
                title={`${n.title}｜点击下钻所在泳道`}
                onClick={() => {
                  setLaneIdx(laneOf(n));
                  onSelect(n.id);
                }}
              >
                <em>{STEP_BADGE[i] ?? i + 1}</em>
                {n.title}
              </button>
            </span>
          ))}
        </div>

        <div className="bp-lanes">
          {flow.lanes.map((ln, i) => (
            <div className="bp-lane" key={i}>
              <button className="bp-lh" onClick={() => setLaneIdx(i)} title="点击下钻该端内部流程">
                <b>{ln.label}</b>
                <span>{laneNodes[i].length} 个功能域 · 下钻 →</span>
              </button>
              <div className="bp-pills">
                {laneNodes[i].map((n) => {
                  const step = chainStep.get(n.id);
                  return (
                    <button
                      key={n.id}
                      className={`bp-pill${n.kind === "highlight" ? " hl" : ""}${selectedId === n.id ? " sel" : ""}`}
                      title={`${n.title}${n.aip ? `｜${n.aip}` : ""}`}
                      onClick={() => {
                        setLaneIdx(i);
                        onSelect(n.id);
                      }}
                    >
                      {step !== undefined ? (
                        <em className="bp-stepno">{STEP_BADGE[step]}</em>
                      ) : (
                        n.no && <span className="bp-no">{n.no}</span>
                      )}
                      <span className="bp-pt">{n.title}</span>
                      {n.aip && <span className="bp-aip">{n.aip}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {flow.dataSupport && <div className="datasup">{flow.dataSupport}</div>}
      </div>
    );
  }

  /* ================= L2 泳道下钻 ================= */
  const stageH = lane.height + L2_PAD_TOP + 40;
  return (
    <div className="card flow bp">
      <div className="bp-crumb">
        <button className="bp-back" onClick={() => setLaneIdx(null)}>
          ← 总索引
        </button>
        <b>{lane.label}</b>
        <span className="bp-meta">
          内部流程 {l2Nodes.length} 环节 · 同层连线 {l2.inner.length} 条 · 跨端协同 {l2.outerGroups.reduce((s, g) => s + g.edges.length, 0)} 条
        </span>
      </div>

      <div className="bp-stage" style={{ height: stageH }}>
        <svg className="bp-svg" width="1360" height={stageH} viewBox={`0 0 1360 ${stageH}`}>
          <defs>
            <marker id="bpo" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--c-accent)" />
            </marker>
            <marker id="bpg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--c-gray-3)" />
            </marker>
          </defs>
          {l2.inner.map((e) => {
            const d = laneEdgePath(e, lane.top);
            if (!d) return null;
            const s = EDGE_STROKE[e.style];
            const from = byId.get(e.from);
            return (
              <g key={`${e.from}-${e.to}-${e.label ?? ""}`}>
                <path d={d} fill="none" stroke={s.color} strokeWidth={s.width} strokeDasharray={s.dash} markerEnd={s.marker} />
                {e.labelAt && from && (
                  <text className="bp-elab" x={e.labelAt[0] + L2_DX} y={e.labelAt[1] - lane.top + L2_PAD_TOP - 6}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {l2Nodes.map((n) => {
          const step = chainStep.get(n.id);
          const top = n.y - lane.top + L2_PAD_TOP;
          const kindCls = (n.kind === "highlight" ? " hl" : n.kind === "dashed" ? " dash" : "") + (n.aip ? " has-aip" : "");
          return (
            <div
              key={n.id}
              className={`node${kindCls}${selectedId === n.id ? " sel" : ""}`}
              style={{ left: n.x + L2_DX, top, width: n.w, height: nodeH(n) }}
              onClick={() => onSelect(n.id)}
            >
              <div className="tt">
                {step !== undefined ? <span className="no bp-stepno">{STEP_BADGE[step]}</span> : n.no && <span className="no">{n.no}</span>}
                {n.title}
              </div>
              {n.sub && <div className="st">{rich(n.sub)}</div>}
              {n.aip && <span className="aip">{n.aip}</span>}
            </div>
          );
        })}

        {l2.outerGroups.length > 0 && (
          <div className="bp-anchors">
            <div className="bp-anchors-title">跨端协同</div>
            {l2.outerGroups.map((g) => (
              <button
                key={g.lane}
                className="bp-anchor"
                title={g.edges
                  .map((e) => {
                    const other = byId.get(byId.get(e.from)!.laneIndex === laneIdx ? e.to : e.from);
                    return `${e.label ?? "连线"} → ${other?.title ?? "?"}`;
                  })
                  .join("\n")}
                onClick={() => setLaneIdx(g.lane)}
              >
                <span className="bp-arrow">{byId.get(g.edges[0].from)!.laneIndex === laneIdx ? "→" : "←"}</span>
                <span className="bp-al">{flow.lanes[g.lane].label.split(" · ")[0]}</span>
                <span className="bp-an">{g.edges.length} 条</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {flow.dataSupport && <div className="datasup">{flow.dataSupport}</div>}
    </div>
  );
}
