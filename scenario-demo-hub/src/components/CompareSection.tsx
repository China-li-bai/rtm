import type { ScenarioConfig } from "../schema/scenario";

/** 页面级前后对比（人力/金钱/时间/数据）+ 口径说明（红线5） */
export function CompareSection({ cfg, no }: { cfg: ScenarioConfig; no: string }) {
  return (
    <>
      <h2 className="sec-h">
        <em>{no}</em>使用 AI 前后对比<small>对比为方向性示意，数字基线待评测集锁定</small>
      </h2>
      <div className="cmp">
        {cfg.compare.map((c) => (
          <div className="card cc" key={c.dim}>
            <h4><i>{c.icon}</i>{c.dim}</h4>
            <div className="bf"><b>AI 前</b>：{c.before}</div>
            <div className="arr">↓</div>
            <div className="af">
              <b>AI 后</b>：{c.after}
              {c.approx && <span className="approx">示意</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="note">{cfg.metricNote}</div>
    </>
  );
}
