import { scenarios } from "../lib/scenarios";

/** 平台识别色：全景=墨、商品=橙、搜索=蓝、客服=绿——建立视觉记忆，一眼定位 */
const PLATFORMS = [
  { key: "全景", label: "AI 业务全景", color: "#27313d", bg: "#eef0f3", border: "#d5dae0" },
  { key: "商品", label: "AI 商品中台", color: "#e24a10", bg: "#fdefe7", border: "#f5cbb5" },
  { key: "搜索", label: "AI 搜索中台", color: "#2b6cb8", bg: "#eaf2ff", border: "#c4daf5" },
  { key: "客服", label: "AI 客服中台", color: "#2f9e6e", bg: "#e8f6ef", border: "#bfe5d2" },
] as const;

/** 场景中心：三中台分组卡片入口 */
export function HubHome() {
  const totalSteps = scenarios.reduce((n, s) => n + s.flow.nodes.length, 0);
  return (
    <div className="hub">
      <header className="hub-hero">
        <h1>场景演示平台</h1>
        <p className="hub-tag">业务场景 → 泳道流程 → 解决方案 → 前后对比</p>
        <p className="hub-sub">
          服务 AI 三中台核心功能的汇报、评审与自查 · {scenarios.length} 个场景 · {totalSteps} 个环节
        </p>
      </header>

      {PLATFORMS.map((p) => {
        const list = scenarios.filter((s) => s.platform === p.key);
        return (
          <section className="hub-group" key={p.key}>
            <h2>
              <i className="dot" style={{ background: p.color }} />
              {p.label}
              <small>{list.length} 个场景</small>
            </h2>
            {list.length === 0 ? (
              <div className="hub-empty">场景筹备中</div>
            ) : (
              <div className="hub-grid">
                {list.map((s) => (
                  <a className="hub-card" key={s.id} href={`#/s/${s.id}`}
                    style={{ borderLeftColor: p.color }}>
                    <span className="chip-s"
                      style={{ color: p.color, background: p.bg, border: `1px solid ${p.border}` }}>
                      {p.label}
                    </span>
                    <div className="hc-title">{s.title}</div>
                    <div className="hc-meta">
                      {s.scenarios.length} 个场景 · {s.constraints.length} 个约束 · {s.flow.nodes.length} 个环节
                    </div>
                    <span className="hc-go" style={{ color: p.color }}>进入演示 →</span>
                  </a>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
