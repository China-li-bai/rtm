import type { ScenarioConfig } from "../schema/scenario";

/** 场景/约束引用信息：徽章、弹窗、详情面板共用的展示模型 */
export interface RefInfo {
  id: string;
  kind: "S" | "C";
  /** 序号称谓：场景一 / 约束二 */
  chip: string;
  /** 徽章文案：场景一 · 采购筛不到货 */
  badge: string;
  /** 完整标题：采购筛不到货【隐身】 */
  full: string;
  /** 卡片摘要 */
  card: string;
  cls: "b-s" | "b-c";
}

const CN = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

export function buildRefs(cfg: ScenarioConfig): Map<string, RefInfo> {
  const map = new Map<string, RefInfo>();
  cfg.scenarios.forEach((s, i) => {
    const chip = `场景${CN[i] ?? i + 1}`;
    map.set(s.id, {
      id: s.id, kind: "S", chip,
      badge: `${chip} · ${s.tag ?? s.name}`,
      full: `${s.name}【${s.kw}】`,
      card: s.card, cls: "b-s",
    });
  });
  cfg.constraints.forEach((c, i) => {
    const chip = `约束${CN[i] ?? i + 1}`;
    map.set(c.id, {
      id: c.id, kind: "C", chip,
      badge: `${chip} · ${c.kw}`,
      full: c.fullTitle ?? `${c.name}【${c.kw}】`,
      card: c.card, cls: "b-c",
    });
  });
  return map;
}
