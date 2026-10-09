import { useEffect } from "react";
import type { RefInfo } from "../lib/refs";
import type { FlowNode, ScenarioConfig } from "../schema/scenario";

interface Props {
  refId: string;
  cfg: ScenarioConfig;
  refs: Map<string, RefInfo>;
  contextNode?: FlowNode | null;
  onClose: () => void;
}

/** 场景/约束完整内容弹窗（红线6：完整内容进弹窗）。
 *  场景/约束定义全站唯一；从节点详情打开时带 contextNode，
 *  弹窗顶部追加「当前流程节点如何落实」=该节点 solves[].how，同一场景从不同节点打开呈现不同承接方式。 */
export function RefModal({ refId, cfg, refs, contextNode, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const info = refs.get(refId);
  if (!info) return null;
  const scenario = cfg.scenarios.find((s) => s.id === refId);
  const constraint = cfg.constraints.find((c) => c.id === refId);
  const nodeSolve = contextNode?.solves.find((item) => item.ref === refId);

  return (
    <div className="mask" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="m-head">
          <button className="m-close" onClick={onClose}>关闭 ✕</button>
          <span className={`chip-s ${info.kind === "S" ? "s" : "c"}`}>{info.chip}</span>
          <span className="m-title">{info.full}</span>
        </div>

        {contextNode && nodeSolve && (
          <div className="m-sec context">
            <h4>■ 当前流程节点如何落实</h4>
            <div className="m-row">
              <span className="m-lab">流程节点</span>
              <span className="t">
                {contextNode.no ? `${contextNode.no} ` : ""}
                {contextNode.panelTitle ?? contextNode.title}
              </span>
            </div>
            <div className="m-row">
              <span className="m-lab">本节点做法</span>
              <span className="t">{nodeSolve.how}</span>
            </div>
          </div>
        )}

        {scenario && (
          <>
            <div className="m-sec prob">
              <h4>■ 场景：问题是怎么产生的</h4>
              <div className="m-row"><span className="m-lab">谁在做什么</span><span className="t">{scenario.story.who}</span></div>
              <div className="m-row"><span className="m-lab">卡在哪</span><span className="t">{scenario.story.stuck}</span></div>
              <div className="m-row"><span className="m-lab">业务实操后果</span><span className="t">
                <ul>{scenario.story.consequences.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </span></div>
            </div>
            <div className="m-sec sol">
              <h4>■ 解决方案</h4>
              <div className="m-row"><span className="m-lab">现在谁在做什么</span><span className="t">{scenario.solution.who}</span></div>
              <div className="m-row"><span className="m-lab">顺在哪</span><span className="t">{scenario.solution.smooth}</span></div>
              <div className="m-row"><span className="m-lab">业务实操效果</span><span className="t">
                <ul>{scenario.solution.effects.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </span></div>
            </div>
          </>
        )}

        {constraint && (
          <>
            <div className="m-sec prob">
              <h4>■ 约束：绕不开的现实</h4>
              <div className="m-row"><span className="m-lab">现实</span><span className="t">{constraint.reality}</span></div>
              <div className="m-row"><span className="m-lab">对应产品决策</span><span className="t">{constraint.decision}</span></div>
            </div>
            <div className="m-sec sol">
              <h4>■ 解决方案 · 在流程中的落地</h4>
              <div className="m-row"><span className="m-lab">落地环节</span><span className="t">{constraint.land}</span></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
