/**
 * 泳道画布布局 Token —— 构建期（scripts/auto-layout.ts）与运行时
 * （src/components/flow/*）共用的唯一几何事实源。
 *
 * 改动任一值后必须重跑 `npm run layout` 回写几何；theme.css 中与之
 * 联动的静态数值已在注释标出（.lane left / .lane-label / .lane-note-box）。
 */
import type { FlowNode } from "../schema/scenario";

export const FLOW = {
  /** 画布设计宽度（世界坐标），同时是页面设计宽（useScale 基准） */
  PAGE_WIDTH: 1360,
  /** .lane 左缘（联动 theme.css `.lane { left: 12px }`） */
  LANE_LEFT: 12,
  /**
   * 左侧层名标签带宽度：泳道名药丸 + 下方注释框共享此带宽
   * （联动 theme.css `.lane-label { max-width }` / `.lane-note-box { width }`）。
   * 带右缘即布线窄通道左界（LABEL_TEXT_RIGHT 见 auto-layout），扩带宽须同步评估走廊。
   */
  LABEL_BAND: 118,
  CANVAS_RIGHT_PAD: 12,

  /** ELK 网格重排的行列间距；必须 > 2 × SHAPE_BUFFER(10) */
  GRID_GAP: 30,

  /** ELK 分支泳道内边距/间距 */
  LANE_TOP_PAD: 28,
  LANE_BOTTOM_PAD: 14,
  LANE_GAP: 40,
  /** 链式分支泳道内边距/间距（全景类页面一屏可读的紧凑档） */
  CHAIN_LANE_TOP_PAD: 16,
  CHAIN_LANE_BOTTOM_PAD: 10,
  CHAIN_LANE_GAP: 26,
  CHAIN_ROW_GAP: 10,

  /** 小地图尺寸（运行时 MiniMap 消费；高度按世界纵横比夹在 H_MIN..H_MAX） */
  MINIMAP_W: 168,
  MINIMAP_H_MIN: 56,
  MINIMAP_H_MAX: 124,

  /** 视口缩放上下限（运行时 FlowCanvas 消费） */
  MIN_ZOOM: 0.2,
  MAX_ZOOM: 1.6,
} as const;

/** 派生边界（与 FLOW 同源，勿散落重算） */
export const NODE_LEFT = FLOW.LANE_LEFT + FLOW.LABEL_BAND; // 节点/横条左缘
export const CONTENT_RIGHT = FLOW.PAGE_WIDTH - FLOW.CANVAS_RIGHT_PAD; // 内容区右缘

/** 渲染器默认节点高度（构建期高度预测与运行时兜底共用同一张表） */
export const NODE_DEFAULT_H: Record<FlowNode["kind"], number> = {
  normal: 76,
  highlight: 76,
  dashed: 76,
  /** 边界声明位（刻意不做）：默认高度同 normal，实际由 predictNodeH 按内容计算 */
  boundary: 76,
  diamond: 58,
  bar: 44,
  loopchip: 32,
};
