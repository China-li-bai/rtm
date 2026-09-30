import { useMemo, useState } from "react";
import { CompareSection } from "../components/CompareSection";
import { DetailPanel } from "../components/DetailPanel";
import { FlowCanvas } from "../components/FlowCanvas";
import { RefModal } from "../components/RefModal";
import { buildRefs } from "../lib/refs";
import { useScale } from "../lib/useScale";
import type { ScenarioConfig } from "../schema/scenario";

/** 场景演示页：场景卡 → 泳道 → 前后对比 三段式 */
export function ScenarioPage({ cfg }: { cfg: ScenarioConfig }) {
  const refs = useMemo(() => buildRefs(cfg), [cfg]);
  const [selectedId, setSelectedId] = useState<string | null>(cfg.flow.defaultSelected ?? null);
  const [modalRef, setModalRef] = useState<string | null>(null);
  const { outerRef, innerRef, scale } = useScale(cfg.flow.width);

  const selected = cfg.flow.nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="scale-outer" ref={outerRef}>
      <div className="scale-inner" ref={innerRef} style={{ transform: `scale(${scale})` }}>
        <a className="back-home" href="#/">← 场景中心</a>
        <h1>
          {cfg.title}
          {cfg.subtitle && <small>{cfg.subtitle}</small>}
        </h1>

        <h2 style={{ marginTop: 18 }}>
          业务场景与用户痛点<small>点击卡片查看完整场景与解决方案</small>
        </h2>
        <div className="whycards">
          {cfg.scenarios.map((s) => {
            const r = refs.get(s.id)!;
            return (
              <div className="wc scn" key={s.id} onClick={() => setModalRef(s.id)}>
                <div className="row1">
                  <span className="chip-s s">{r.chip}</span>
                  <span className="name">{s.name}</span>
                  <span className="kw">{s.kw}</span>
                </div>
                <div className="story">{s.card}</div>
                <span className="more">完整场景与解决方案 ↗</span>
              </div>
            );
          })}
          {cfg.constraints.map((c) => {
            const r = refs.get(c.id)!;
            return (
              <div className="wc con" key={c.id} onClick={() => setModalRef(c.id)}>
                <div className="row1">
                  <span className="chip-s c">{r.chip}</span>
                  <span className="name">{c.name}</span>
                  <span className="kw">{c.kw}</span>
                </div>
                <div className="story">{c.card}</div>
                <span className="more">完整约束与解决方案 ↗</span>
              </div>
            );
          })}
        </div>

        <h2>
          场景融合使用流程
          <small>实线橙＝业务主流程 ｜ 橙虚线＝反哺 · 兜底 ｜ 点击任一环节查看它解决的场景与解法</small>
        </h2>
        <FlowCanvas flow={cfg.flow} selectedId={selectedId} onSelect={setSelectedId} />

        {selected && <DetailPanel node={selected} refs={refs} onOpenRef={setModalRef} />}

        <CompareSection cfg={cfg} />
      </div>

      {modalRef && <RefModal refId={modalRef} cfg={cfg} refs={refs} onClose={() => setModalRef(null)} />}
    </div>
  );
}
