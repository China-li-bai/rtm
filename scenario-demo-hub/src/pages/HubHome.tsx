import { scenarios } from "../lib/scenarios";

const PLATFORMS = [
  { key: "全景", label: "AI 业务全景" },
  { key: "商品", label: "AI 商品中台" },
  { key: "搜索", label: "AI 搜索中台" },
  { key: "客服", label: "AI 客服中台" },
] as const;

/** 场景中心：三中台分组卡片入口 */
export function HubHome() {
  return (
    <div className="hub">
      <h1>场景演示平台 <small>Scenario Demo Hub —— 业务场景 → 泳道流程 → 解决方案 → 前后对比</small></h1>
      <div className="hub-sub">服务 AI 三中台核心功能的汇报、评审与自查；每个场景页由一份 JSON 配置驱动渲染。</div>

      {PLATFORMS.map((p) => {
        const list = scenarios.filter((s) => s.platform === p.key);
        return (
          <div className="hub-group" key={p.key}>
            <h2>{p.label}<small>{list.length} 个场景</small></h2>
            {list.length === 0 ? (
              <div className="hub-empty">暂无场景——往 scenarios/ 目录放一份 JSON 配置并重新构建即可上线。</div>
            ) : (
              <div className="hub-grid">
                {list.map((s) => (
                  <a className="hub-card" key={s.id} href={`#/s/${s.id}`}>
                    <span className="chip-s s">{p.label}</span>
                    <div className="hc-title">{s.title}</div>
                    <div className="hc-meta">
                      {s.scenarios.length} 个场景 · {s.constraints.length} 个约束 · {s.flow.nodes.length} 个环节
                    </div>
                    <span className="hc-go">进入演示 →</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
