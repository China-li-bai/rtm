/**
 * 自动布局 CLI（构建期）：npm run layout / vite build 前置。
 *
 * 最终方案（确定性三段管线，全部自动、无手工坐标）：
 *   阶段 1：每条泳道独立跑 ELK layered + RIGHT —— 只负责层内节点的左→右定位，
 *           节点为固定尺寸（内容高度预测），不喂任何边；
 *   阶段 2：泳道按 lanes 数组顺序垂直堆叠（架构层顺序的唯一事实源）；
 *   阶段 3：obstacle-router（libavoid 的纯 TS 移植）把全部边一次性正交避障布线——
 *           节点矩形即障碍，自动绕框、平行 nudging、交叉最小化。
 *
 * 为什么节点定位与布线分两个库：
 *   - ELK layered 擅长"按 DAG 分层定位节点"，但节点位置固定后它不再承担全局
 *     避障布线（rectWrapping 算法在 bundled 版缺失，fixed 不布线）；
 *   - obstacle-router（libavoid/Adaptagrams）正是"固定障碍 + 引脚"的正交避障
 *     布线器，构建期把手写干线/通道算法彻底替换，从几何上保证不穿任何节点框。
 *
 * 运行时零依赖：elkjs、obstacle-router 仅构建期在 Node 离线运行（经 tsx），
 * 渲染器只消费回写的几何产物。无 autoLayout 标记的手工布局文件原样跳过
 * （当前 scenarios/ 下 14 份配置均已启用 autoLayout）。
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  AStarPath,
  ConnDirAll,
  ConnEnd,
  ConnRef,
  ConnectorCrossings,
  OrthogonalRouting,
  Point,
  Rectangle,
  Router,
  ShapeConnectionPin,
  ShapeRef,
  generateStaticOrthogonalVisGraph,
  crossingPenalty,
  idealNudgingDistance,
  improveOrthogonalRoutes,
  segmentPenalty,
  shapeBufferDistance,
  vertexVisibility,
} from "obstacle-router";
import ElkConstructor from "elkjs/lib/elk.bundled.js";
import type { ELK, ElkNode } from "elkjs/lib/elk-api";

// 布局 Token：构建期与运行时共用的唯一几何事实源（src/flow/tokens.ts）
import {
  FLOW,
  NODE_DEFAULT_H as DEFAULT_H,
  NODE_LEFT,
  CONTENT_RIGHT,
} from "../src/flow/tokens";

const { PAGE_WIDTH, LANE_LEFT, GRID_GAP, LANE_GAP, LANE_TOP_PAD, LANE_BOTTOM_PAD,
  CHAIN_LANE_TOP_PAD, CHAIN_LANE_BOTTOM_PAD, CHAIN_LANE_GAP, CHAIN_ROW_GAP } = FLOW;
const NODE_NODE_GAP = 40; // 同层层内节点水平间距（ELK 无连边时忽略该参数，仅名义保留）
const ROW_GAP = 34; // 同层层内换行的行间距（同上）

// obstacle-router 布线参数（libavoid 语义）
const SHAPE_BUFFER = 10; // 障碍外间距
const NUDGE_DISTANCE = 12; // 平行线段理想间距
const SEGMENT_PENALTY = 10; // 段代价（>0 才启用 nudging）

// —— 交叉治理试验开关（阶段2 A/B/C 基准；API 已在 obstacle-router@0.1.2 核实：
//    crossingPenalty 已导出、ConnRef.setHateCrossings 存在于 connector.d.ts）——
//    LAYOUT_CROSSING=off（默认）| low（penalty 50）| mid（penalty 150）。
//    开启时主链（routeRole=primary）连接器额外 setHateCrossings(true)。
//    ⚠ 2026-10-10 实测（14 份配置全量 layout）：off=1s 完成；low=50 在
//    contract-blueprint（33 边、全部默认 primary）上 >14min CPU 未完成——
//    全局开惩罚在本场景集不可行，仅限小场景单文件实验，默认必须保持 off。
const CROSSING_PRESETS = { off: 0, low: 50, mid: 150 } as const;
const CROSSING_MODE = (process.env.LAYOUT_CROSSING ?? "off") as keyof typeof CROSSING_PRESETS;
const CROSSING_PENALTY =
  CROSSING_PRESETS[CROSSING_MODE] ?? CROSSING_PRESETS.off;

type Pt = [number, number];

// —— 节点内容高度预测（与 FlowCanvas/theme.css 的渲染规则保持一致）——
// 渲染器不固定高度，normal 节点由 标题(.tt 13.5px) + 描述(.st 11.5px/1.45)
// + aip 角标（底部 padding 加大到 22）撑开；构建期必须预测同一高度喂给 ELK，
// 否则层内换行时 ELK 按 76 预留行距、真实内容 97~146 高，节点会纵向重叠。
const NODE_PAD_TOP = 10;
const NODE_PAD_BOTTOM = 8;
const NODE_PAD_X = 12;
const NODE_HAS_AIP_PAD_BOTTOM = 22;
const TITLE_LH = 18; // 13.5px 粗体单行实测行高
const SUB_LH = 16.7; // 11.5 × 1.45
const SUB_MARGIN_TOP = 5;
const NO_BADGE_W = 29; // 22px 圆点 + 7px 右距
const CHAR_W_TITLE = 13.7; // 13.5px 中文粗体实测字宽
const CHAR_W_SUB = 11.7; // 11.5px 中文实测字宽
const ASCII_W_RATIO = 0.56; // 拉丁/数字相对中文字宽

/** 富文本去标签后按显示宽度估算行数（<br> 强制换行） */
function wrappedLines(text: string, maxW: number, charW: number): number {
  const segments = text
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  let lines = 0;
  for (const seg of segments) {
    let width = 0;
    let segLines = 1;
    for (const ch of seg) {
      const w = ch.charCodeAt(0) > 255 ? charW : charW * ASCII_W_RATIO;
      if (width + w > maxW && width > 0) {
        segLines += 1;
        width = w;
      } else {
        width += w;
      }
    }
    lines += segLines;
  }
  return Math.max(lines, 1);
}

/**
 * 按节点文本内容预测真实渲染高度。
 * @param n 节点原始配置（取 title/sub/aip/kind）
 * @returns 渲染像素高度
 */
function predictNodeH(n: RawNode): number {
  const kind = n.kind ?? "normal";
  if (kind === "bar") return 40; // padding 9×2 + 13px 行 ≈ 40（DOM 实测）
  if (kind === "loopchip") return 27; // padding 4×2 + 12px 行 ≈ 27
  if (kind === "diamond") return n.h ?? DEFAULT_H.diamond;
  const innerW = n.w - NODE_PAD_X * 2;
  const titleW = innerW - (n.no != null ? NO_BADGE_W : 0);
  const titleLines = wrappedLines(String(n.title ?? ""), titleW, CHAR_W_TITLE);
  let h = NODE_PAD_TOP + titleLines * TITLE_LH + NODE_PAD_BOTTOM;
  if (n.sub != null) {
    const subLines = wrappedLines(String(n.sub), innerW, CHAR_W_SUB);
    h += SUB_MARGIN_TOP + subLines * SUB_LH;
  }
  if (n.aip != null) {
    h += NODE_HAS_AIP_PAD_BOTTOM - NODE_PAD_BOTTOM;
  }
  if (n.enter) {
    h += 6 + 16; // .node .go：margin-top 6px + 11px 粗体一行
  }
  return Math.round(h + 2); // +2 边框/舍入余量，宁可略高不可重叠
}

interface RawNode {
  id: string;
  kind?: keyof typeof DEFAULT_H;
  /** 摘出路由障碍（纯装饰/能力横条）：不注册 ShapeRef，端点经 ConnEnd.fromPoint 挂边中点 */
  routingObstacle?: boolean;
  laneIndex?: number;
  col?: number;
  row?: number;
  h?: number;
  w: number;
  x?: number;
  y?: number;
  no?: string;
  title?: string;
  sub?: string;
  aip?: string;
  enter?: string;
  [k: string]: unknown;
}

interface RawEdge {
  /** 稳定唯一边 id：路线 Map 键（main() 前置校验必填且唯一） */
  id?: string;
  from: string;
  to: string;
  /** 业务路由角色：crossing 调优时 primary 连接器启用 setHateCrossings */
  routeRole?: "primary" | "branch" | "feedback" | "support";
  style?: string;
  label?: string;
  via?: Pt[];
  route?: Pt[];
  labelAt?: Pt;
  fromSide?: string;
  toSide?: string;
  [k: string]: unknown;
}

/** 脚本内部最小几何视图（业务字段原样透传，不做结构假设） */
interface RawFlow {
  width?: number;
  height?: number;
  autoLayout?: boolean;
  chain?: string[];
  lanes: Array<{ label: string; top?: number; height?: number }>;
  nodes: RawNode[];
  edges: RawEdge[];
}

interface RawConfig {
  id?: string;
  flow?: RawFlow;
  [k: string]: unknown;
}

interface LaidNode {
  id: string;
  kind: keyof typeof DEFAULT_H;
  lane: number;
  w: number;
  h: number;
  x: number; // 全局画布坐标
  y: number;
}

/** 节点布局高度：diamond 用显式/默认固定值；其余按内容预测 */
function nodeH(n: RawFlow["nodes"][number]): number {
  if ((n.kind ?? "normal") === "diamond") return n.h ?? DEFAULT_H.diamond;
  return predictNodeH(n);
}

/**
 * 阶段 1：单条泳道内 ELK RIGHT 布局（只定位节点，不喂边）。
 * @param laneNodes 该泳道节点（全局坐标未定，只取尺寸）
 * @returns ELK 输出（局部坐标，原点为泳道内容区左上角）
 */
async function layoutLane(
  elk: ELK,
  laneNodes: RawFlow["nodes"],
): Promise<ElkNode> {
  const children: ElkNode[] = laneNodes.map((n) => ({
    id: n.id,
    // bar 阶段 1 不参与布局（阶段 2 直接全宽），给占位尺寸即可
    width: (n.kind ?? "normal") === "bar" ? 200 : n.w,
    height: nodeH(n),
  }));
  const graph: ElkNode = {
    id: "lane",
    layoutOptions: {
      "org.eclipse.elk.algorithm": "layered",
      "org.eclipse.elk.direction": "RIGHT",
      "org.eclipse.elk.spacing.nodeNode": String(NODE_NODE_GAP),
      "org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": String(ROW_GAP),
      "org.eclipse.elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      "org.eclipse.elk.padding": "[top=0,left=0,bottom=0,right=0]",
    },
    children,
  };
  return elk.layout(graph);
}

/**
 * 把 ELK 的无连边布局重映射为固定间距网格（泳道局部坐标）。
 *
 * 背景：ELK layered 在不喂边时把每个节点当作独立连通分量，
 * 忽略 spacing.nodeNode / nodeNodeBetweenLayers 等全部间距参数（实测恒为默认
 * 20px），且会把分量沿纵横两轴紧凑堆叠。20px 间隙恰好等于双侧 shapeBuffer
 * (10×2)，正交布线走廊被封死，路由器找不到路径退化为中心直连斜线。
 *
 * 因此只借用 ELK 的两件产物：① 哪些节点同一行（y 邻近）；
 * ② 行内节点的左右次序；再用固定 GRID_GAP 重排成整齐网格，行列间隙均
 * > 2×SHAPE_BUFFER，从几何上保证布线走廊畅通。
 *
 * @param out ELK 输出（局部坐标）
 * @param sized 每节点的最终尺寸（按 id）
 * @returns 每节点的网格局部坐标与整张网格宽高
 */
function remapLaneGrid(
  out: ElkNode,
  sized: Map<string, { w: number; h: number }>,
): { pos: Map<string, { x: number; y: number }>; width: number; height: number } {
  type Cell = { id: string; x: number; y: number; w: number; h: number };
  const cells: Cell[] = (out.children ?? [])
    .filter((c) => c.x != null && c.y != null && sized.has(c.id))
    .map((c) => {
      const s = sized.get(c.id)!;
      return { id: c.id, x: c.x ?? 0, y: c.y ?? 0, w: s.w, h: s.h };
    });

  // —— 按 y 聚类成行：ELK 无连边时行内节点 y 几乎相同（实测差 0~5px），
  //    而不同行的 y 差 ≥ 80px（各自行高不同，与行内最高节点无关）——
  const ROW_Y_THRESHOLD = 80;
  const sortedByY = [...cells].sort((a, b) => a.y - b.y);
  const rows: Cell[][] = [];
  for (const cell of sortedByY) {
    const lastRow = rows[rows.length - 1];
    const rowMinY = lastRow ? Math.min(...lastRow.map((c) => c.y)) : 0;
    if (!lastRow || cell.y - rowMinY > ROW_Y_THRESHOLD) {
      rows.push([cell]);
    } else {
      lastRow.push(cell);
    }
  }
  for (const row of rows) row.sort((a, b) => a.x - b.x);

  // —— 计算列宽（每列取各行该位次节点的最大宽）与行高 ——
  const colWidths: number[] = [];
  const rowHeights = rows.map((row) => Math.max(...row.map((c) => c.h)));
  rows.forEach((row) => {
    row.forEach((cell, colIdx) => {
      colWidths[colIdx] = Math.max(colWidths[colIdx] ?? 0, cell.w);
    });
  });

  // —— 列左缘（首列从 0 起）：固定 GRID_GAP ——
  const colLefts: number[] = [];
  colWidths.forEach((_w, i) => {
    colLefts[i] = i === 0 ? 0 : colLefts[i - 1] + colWidths[i - 1] + GRID_GAP;
  });

  // —— 行顶：固定 GRID_GAP；节点在所属列内水平居中、行内顶对齐 ——
  const rowTops: number[] = [];
  rowHeights.forEach((_h, i) => {
    rowTops[i] = i === 0 ? 0 : rowTops[i - 1] + rowHeights[i - 1] + GRID_GAP;
  });

  const pos = new Map<string, { x: number; y: number }>();
  rows.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      const centeredX = colLefts[colIdx] + (colWidths[colIdx] - cell.w) / 2;
      pos.set(cell.id, {
        x: Math.round(centeredX),
        y: rowTops[rowIdx],
      });
    });
  });

  const width =
    colLefts.length === 0
      ? 0
      : colLefts[colLefts.length - 1] + colWidths[colWidths.length - 1];
  const height =
    rowTops.length === 0
      ? 0
      : rowTops[rowTops.length - 1] + rowHeights[rowHeights.length - 1];
  return { pos, width, height };
}

/** 估算标签渲染宽度：中文/全角 12px，其余 7px（与 .lab 12px 字号近似） */
function labelWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += ch.charCodeAt(0) > 255 ? 12 : 7;
  return w;
}

// ———————————————————— 链式布局（flow.chain）————————————————————
//
// 泳道=业务主体（供应商侧/商品中台/搜索中台/交易/客服/底座），主链按业务
// 推进顺序蛇形穿过各泳道。列分配规则（确定性）：
//   · 链首节点在第 0 列；
//   · 后继节点与前一节点同泳道 → 列 +1（泳道内从左到右推进）；
//   · 后继节点换泳道 → 列不变（跨泳道竖向衔接天然上下对齐）。
// 该规则复现 RTM 泳道全景的布局语言：每道 1~3 个节点、主链 ↘ 对角推进、
// 跨道箭头全部竖直短边。非主链节点（如底座 pills）必须显式声明 col。
// 节点显式 col 可覆盖推导值（覆盖后链位从覆盖值继续推进）。

interface ChainGrid {
  cols: Map<string, number>;
  colLefts: number[];
  colWidths: number[];
}

function chainColumns(flow: RawFlow, file: string): ChainGrid {
  const byId = new Map(flow.nodes.map((n) => [n.id, n]));
  const cols = new Map<string, number>();

  let prevId: string | null = null;
  for (const id of flow.chain as string[]) {
    const n = byId.get(id);
    if (!n) throw new Error(`${file}：chain 引用了不存在的节点 ${id}`);
    const lane = n.laneIndex;
    if (lane == null) {
      throw new Error(`${file}：chain 节点 ${id} 缺少 laneIndex`);
    }
    let derived: number;
    if (prevId == null) {
      derived = 0;
    } else {
      const prev = byId.get(prevId)!;
      derived = lane === prev.laneIndex ? cols.get(prevId)! + 1 : cols.get(prevId)!;
    }
    cols.set(id, n.col ?? derived);
    prevId = id;
  }

  for (const n of flow.nodes) {
    if (cols.has(n.id)) continue;
    if ((n.kind ?? "normal") === "bar") {
      throw new Error(`${file}：bar 节点 ${n.id} 不可游离于 chain 之外（bar 即主链终点）`);
    }
    if (n.col == null) {
      throw new Error(`${file}：链式布局下非主链节点 ${n.id} 必须显式声明 col`);
    }
    cols.set(n.id, n.col);
  }

  // 列宽 = 该列最宽非 bar 节点；loopchip（底座 pills 等注释件）不撑列宽——
  // 按列内居中放置、允许向列间隙少量外溢（垂直走线走列中心，间隙不布线）
  const colWidths: number[] = [];
  for (const n of flow.nodes) {
    if ((n.kind ?? "normal") === "bar" || (n.kind ?? "normal") === "loopchip") continue;
    const c = cols.get(n.id)!;
    colWidths[c] = Math.max(colWidths[c] ?? 0, n.w);
  }
  const ncols = colWidths.length;
  const usable = CONTENT_RIGHT - NODE_LEFT;
  const totalNodeW = colWidths.reduce((a, b) => a + b, 0);
  const gap = ncols > 1 ? Math.floor((usable - totalNodeW) / (ncols - 1)) : 0;
  if (gap < GRID_GAP) {
    throw new Error(
      `${file}：链式布局列间距 ${gap}px 不足（需 ≥${GRID_GAP}）——列数过多或节点过宽`,
    );
  }
  const colLefts: number[] = [];
  let cx = NODE_LEFT;
  for (let c = 0; c < ncols; c++) {
    colLefts[c] = Math.round(cx);
    cx += colWidths[c] + gap;
  }
  return { cols, colLefts, colWidths };
}

// ———————————————————— 链式布局的泳道内网格 ————————————————————
function chainLaneGrid(
  list: RawFlow["nodes"],
  grid: ChainGrid,
): { pos: Map<string, { x: number; y: number }>; height: number } {
  const rows = new Map<number, RawFlow["nodes"]>();
  for (const n of list) {
    const r = n.row ?? 0;
    if (!rows.has(r)) rows.set(r, []);
    rows.get(r)!.push(n);
  }
  // 碰撞检查：同泳道同 (row,col) 只允许一个节点；bar 横贯全宽，其行内不得再有节点
  for (const [r, ns] of rows) {
    const seen = new Set<number>();
    for (const n of ns) {
      if ((n.kind ?? "normal") === "bar") {
        if (ns.length > 1) {
          throw new Error(`泳道行 ${r}：bar 横贯全宽，行内不得再放节点（${n.id}）`);
        }
        continue;
      }
      const c = grid.cols.get(n.id)!;
      if (seen.has(c)) {
        throw new Error(`泳道行 ${r} 列 ${c}：节点 ${n.id} 与同列节点重叠——调整 col/row`);
      }
      seen.add(c);
    }
  }
  const rowIdxs = [...rows.keys()].sort((a, b) => a - b);
  const rowH = rowIdxs.map((r) =>
    Math.max(...rows.get(r)!.map((n) => nodeH(n))),
  );
  const rowTops: number[] = [];
  rowIdxs.forEach((_r, i) => {
    rowTops[i] = i === 0 ? 0 : rowTops[i - 1] + rowH[i - 1] + CHAIN_ROW_GAP;
  });

  const pos = new Map<string, { x: number; y: number }>();
  rowIdxs.forEach((r, i) => {
    for (const n of rows.get(r)!) {
      const h = nodeH(n);
      const y = Math.round(rowTops[i] + (rowH[i] - h) / 2);
      let x: number;
      if ((n.kind ?? "normal") === "bar") {
        x = NODE_LEFT;
      } else {
        const c = grid.cols.get(n.id)!;
        x = Math.round(grid.colLefts[c] + (grid.colWidths[c] - n.w) / 2);
      }
      pos.set(n.id, { x, y });
    }
  });
  const height = rowTops.length === 0 ? 0 : rowTops[rowTops.length - 1] + rowH[rowH.length - 1];
  return { pos, height };
}

/** 标签渲染高度（.lab 行高 + halo 上下 padding），用于与节点做矩形避障 */
const LABEL_H = 18;
/** 标签与水平段的纵向间距（.lab 渲染在锚点处，锚点取线段上方） */
const LABEL_GAP = 17;
/** 标签与竖直段的横向间距 */
const LABEL_SIDE_GAP = 8;
/** 标签 halo 左右 padding 合计（theme.css .lab padding 1px 6px），估宽时补偿 */
const LABEL_HALO_PAD = 12;

/**
 * 判断标签矩形是否与任一节点框相交（节点框按 LABEL_PAD 四周膨胀后判定）。
 * @param lx 标签左
 * @param ly 标签顶
 * @param lw 标签宽
 * @param boxes 节点框数组
 * @returns 是否相交
 */
/** 标签与节点之间的最小安全间隙，避免标签贴着节点边缘造成视觉粘连 */
const LABEL_PAD = 6;

function labelHitsBox(
  lx: number, ly: number, lw: number,
  boxes: ReadonlyArray<{ x: number; y: number; w: number; h: number }>,
): boolean {
  for (const b of boxes) {
    if (
      lx < b.x + b.w + LABEL_PAD && lx + lw > b.x - LABEL_PAD &&
      ly < b.y + b.h + LABEL_PAD && ly + LABEL_H > b.y - LABEL_PAD
    ) return true;
  }
  return false;
}

/** 标签矩形与全部节点框（含 LABEL_PAD）的最大重叠面积——兜底时取最小碰撞位 */
function labelOverlapArea(
  lx: number, ly: number, lw: number,
  boxes: ReadonlyArray<{ x: number; y: number; w: number; h: number }>,
): number {
  let worst = 0;
  for (const b of boxes) {
    const ox = Math.min(lx + lw, b.x + b.w + LABEL_PAD) - Math.max(lx, b.x - LABEL_PAD);
    const oy = Math.min(ly + LABEL_H, b.y + b.h + LABEL_PAD) - Math.max(ly, b.y - LABEL_PAD);
    if (ox > 0 && oy > 0) worst = Math.max(worst, Math.round(ox * oy));
  }
  return worst;
}

/**
 * 按正交路线自动计算标签锚点（左上角坐标），且保证不压任何节点。
 *
 * 三级放置（确定性，全部经过节点避障；修复：旧版无 ≥标签宽水平段时直接
 * 回退路线中点、不做避障，导致标签压在节点上且被后绘制的节点卡片盖住）：
 *  ① 最长水平段上方/下方居中，2px 步长向两侧滑动——同层边的常规位；
 *  ② 竖直段右侧/左侧贴线，沿线居中上下滑动——跨层竖边的主放置位
 *    （短横边放不下标签的场景，如底座横条→上层服务的反哺边）；
 *  ③ 兜底：沿整条路线 8px 采样四向偏移，零重叠即用；全部碰撞时取
 *     重叠面积最小的锚点（极少触发，且 .lab 白底 halo 保证可读）。
 *
 * @param route 含起止点的完整正交点串
 * @param text 标签文本
 * @param boxes 全部节点框，用于标签避障
 * @returns 标签左上角点
 */
function labelAtForRoute(
  route: Pt[],
  text: string,
  boxes: ReadonlyArray<{ x: number; y: number; w: number; h: number }>,
): Pt {
  const lw = labelWidth(text) + LABEL_HALO_PAD;
  const hsegs: { x1: number; x2: number; y: number }[] = [];
  const vsegs: { y1: number; y2: number; x: number }[] = [];
  for (let i = 1; i < route.length; i++) {
    const [px, py] = route[i - 1];
    const [qx, qy] = route[i];
    if (py === qy) hsegs.push({ x1: Math.min(px, qx), x2: Math.max(px, qx), y: py });
    else if (px === qx) vsegs.push({ y1: Math.min(py, qy), y2: Math.max(py, qy), x: px });
  }
  hsegs.sort((a, b) => b.x2 - b.x1 - (a.x2 - a.x1));
  vsegs.sort((a, b) => b.y2 - b.y1 - (a.y2 - a.y1));

  // ① 水平段：上方优先，被占再试下方
  for (const seg of hsegs) {
    if (seg.x2 - seg.x1 < lw) continue; // 段长放不下标签
    for (const ly of [seg.y - LABEL_GAP, seg.y + 4]) {
      const center = Math.round((seg.x1 + seg.x2) / 2 - lw / 2);
      for (let step = 0; ; step += 2) {
        const offsets = step === 0 ? [0] : [step, -step];
        for (const off of offsets) {
          const lx = center + off;
          if (lx < seg.x1 || lx + lw > seg.x2) continue;
          if (!labelHitsBox(lx, ly, lw, boxes)) return [lx, ly];
        }
        if (center + step > seg.x2 && center - step < seg.x1) break;
      }
    }
  }

  // ② 竖直段：右侧贴线优先，被占再试左侧；沿线居中上下滑动
  for (const seg of vsegs) {
    if (seg.y2 - seg.y1 < LABEL_H + 6) continue;
    const cy = Math.round((seg.y1 + seg.y2) / 2 - LABEL_H / 2);
    for (const lx of [seg.x + LABEL_SIDE_GAP, seg.x - LABEL_SIDE_GAP - lw]) {
      if (lx < NODE_LEFT || lx + lw > CONTENT_RIGHT) continue;
      for (let step = 0; ; step += 4) {
        const offsets = step === 0 ? [0] : [step, -step];
        for (const off of offsets) {
          const ly = cy + off;
          if (ly < seg.y1 - 2 || ly + LABEL_H > seg.y2 + 2) continue;
          if (!labelHitsBox(lx, ly, lw, boxes)) return [lx, ly];
        }
        if (cy + step > seg.y2 && cy - step < seg.y1) break;
      }
    }
  }

  // ③ 全线采样兜底：四向偏移，零重叠即用；全撞取最小重叠
  let best: { at: Pt; area: number } | null = null;
  for (let i = 1; i < route.length; i++) {
    const [px, py] = route[i - 1];
    const [qx, qy] = route[i];
    const len = Math.hypot(qx - px, qy - py);
    const steps = Math.max(1, Math.ceil(len / 8));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const ax = Math.round(px + (qx - px) * t);
      const ay = Math.round(py + (qy - py) * t);
      const cands: Array<[number, number]> = [
        [ax + 4, ay + 4],
        [ax + 4, ay - LABEL_GAP],
        [ax - lw - 4, ay + 4],
        [ax - lw - 4, ay - LABEL_GAP],
      ];
      for (const [cx, cy] of cands) {
        const area = labelOverlapArea(cx, cy, lw, boxes);
        if (area === 0) return [cx, cy];
        if (!best || area < best.area) best = { at: [cx, cy], area };
      }
    }
  }
  return best ? best.at : [route[0][0], route[0][1] - LABEL_GAP];
}

/** 每边连接点（libavoid connection pin）。内缩，避免贴角。 */
export const SIDE_SLOTS = [0.2, 0.35, 0.5, 0.65, 0.8] as const;
export const MID_SLOT = Math.floor(SIDE_SLOTS.length / 2);

export interface SlotClaim {
  edgeId: string;
  end: "src" | "tgt";
  /** 对端中心在这条边上的投影，已夹到槽位区间 */
  ideal: number;
  /** 两端正对且走廊空着：优先占用离 ideal 最近的槽，保证主线能拉直 */
  direct: boolean;
}

/**
 * 同一条边上的连接点分配。
 * 一条线用中点；多条线按对端投影就近占空槽（可直连的边先占）。
 */
export function assignGroupSlots(
  claims: SlotClaim[],
): Array<{ edgeId: string; end: "src" | "tgt"; slot: number }> {
  if (claims.length === 0) return [];
  if (claims.length === 1) {
    return [{ edgeId: claims[0].edgeId, end: claims[0].end, slot: MID_SLOT }];
  }
  const order = [...claims].sort((a, b) => {
    if (a.direct !== b.direct) return a.direct ? -1 : 1;
    const da = Math.abs(a.ideal - 0.5);
    const db = Math.abs(b.ideal - 0.5);
    if (Math.abs(da - db) > 1e-6) return da - db;
    if (Math.abs(a.ideal - b.ideal) > 1e-6) return a.ideal - b.ideal;
    const byId = a.edgeId.localeCompare(b.edgeId);
    if (byId !== 0) return byId;
    return a.end === b.end ? 0 : a.end === "src" ? -1 : 1;
  });
  const used = new Set<number>();
  const out: Array<{ edgeId: string; end: "src" | "tgt"; slot: number }> = [];
  for (const c of order) {
    let best = 0;
    let bestDist = Infinity;
    let bestCenter = Infinity;
    for (let s = 0; s < SIDE_SLOTS.length; s++) {
      if (used.has(s)) continue;
      const dist = Math.abs(SIDE_SLOTS[s] - c.ideal);
      const center = Math.abs(SIDE_SLOTS[s] - 0.5);
      const closer =
        dist < bestDist - 1e-9 ||
        (Math.abs(dist - bestDist) <= 1e-9 && center < bestCenter - 1e-9) ||
        (Math.abs(dist - bestDist) <= 1e-9 && Math.abs(center - bestCenter) <= 1e-9 && s < best);
      if (closer) {
        best = s;
        bestDist = dist;
        bestCenter = center;
      }
    }
    used.add(best);
    out.push({ edgeId: c.edgeId, end: c.end, slot: best });
  }
  return out;
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "scenarios");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

/**
 * 阶段 3：obstacle-router 把全部边一次性正交避障布线。
 *
 * pin 约定（对齐 draw.io 多连接点）：每边 5 个槽位、各自独占 classId；
 * 同节点同边的多条进出线按对端位置均分槽位，避免两线挤进同一箭头。
 *
 * @param flow 已回写节点全局几何的 flow
 * @returns 按边 id 索引的完整正交点串
 */
function routeAllEdges(flow: RawFlow): Map<string, Pt[]> {
  const nodeById = new Map(flow.nodes.map((n) => [n.id, n]));

  // obstacle-router 各 d.ts 各自声明了互不兼容的内部 IRouter/IShape（skipLibCheck
  // 只跳过库文件内部检查，不覆盖跨文件结构兼容），故在库边界用最小结构类型 +
  // unknown 双转隔离声明噪音；运行时实现完整，正确性由几何校验保证。
  type RoutePoint = { x: number; y: number };
  type AnyRouter = {
    setRoutingParameter(param: unknown, value: number): void;
    processTransaction(): void;
  };
  type LateBoundHelpers = {
    _generateStaticOrthogonalVisGraph?: (router: unknown) => void;
    _improveOrthogonalRoutes?: (router: unknown) => void;
    _ConnectorCrossings?: (router: unknown) => void;
    _AStarPath?: (router: unknown) => void;
    _vertexVisibility?: (router: unknown) => void;
  };
  type AnyShape = object;
  type AnyConn = {
    displayRoute(): { size(): number; at(index: number): RoutePoint } | undefined;
  };
  type LibRouter = ConstructorParameters<typeof ShapeRef>[0];
  type LibConnEnd = ConstructorParameters<typeof ConnRef>[1];

  const router = new Router(OrthogonalRouting) as unknown as AnyRouter & LateBoundHelpers;
  // obstacle-router 打包未自动绑定 5 个晚绑定 helper，须手工挂载
  router._generateStaticOrthogonalVisGraph =
    generateStaticOrthogonalVisGraph as unknown as (r: unknown) => void;
  router._improveOrthogonalRoutes =
    improveOrthogonalRoutes as unknown as (r: unknown) => void;
  router._ConnectorCrossings =
    ConnectorCrossings as unknown as (r: unknown) => void;
  router._AStarPath = AStarPath as unknown as (r: unknown) => void;
  router._vertexVisibility = vertexVisibility as unknown as (r: unknown) => void;
  router.setRoutingParameter(shapeBufferDistance, SHAPE_BUFFER);
  router.setRoutingParameter(idealNudgingDistance, NUDGE_DISTANCE);
  router.setRoutingParameter(segmentPenalty, SEGMENT_PENALTY);
  // 交叉治理（阶段2 基准开关）：penalty>0 时启用；主链连接器另加 setHateCrossings
  if (CROSSING_PENALTY > 0) {
    router.setRoutingParameter(crossingPenalty, CROSSING_PENALTY);
  }

  // pin class id：每边多个连接点，互不共用 classId，一槽一线。
  // 编码 = 边基值 + 槽位序号。方向保持四向可见：外法向会把窄缝里的回头线判成无路。
  type Side = "top" | "bottom" | "left" | "right";
  const SIDE_BASE: Record<Side, number> = { top: 100, bottom: 200, left: 300, right: 400 };

  // 注意：ShapeRef/ShapeConnectionPin 实例绝不可赋 .id 属性——会覆盖库内部
  // 的 id() 方法；外部一律用 Map 关联。
  const shapes = new Map<string, AnyShape>();
  /** 非障碍节点（routingObstacle:false）的几何盒：不注册 ShapeRef，仅端点挂接用 */
  const phantoms = new Map<string, { x: number; y: number; w: number; h: number }>();
  /** 构造边上某一槽位的引脚；独占，一槽一线。 */
  const makePin = (shape: AnyShape, classId: number, xOff: number, yOff: number): unknown => {
    const pin = ShapeConnectionPin.createForShape(
      shape as unknown as Parameters<typeof ShapeConnectionPin.createForShape>[0],
      classId,
      xOff,
      yOff,
      true,
      0,
      ConnDirAll,
    );
    (pin as { setExclusive(value: boolean): void }).setExclusive(true);
    return pin;
  };
  const pinClass = (side: Side, slot: number): number =>
    SIDE_BASE[side] + Math.max(0, Math.min(SIDE_SLOTS.length - 1, slot));
  for (const n of flow.nodes) {
    const x = n.x ?? 0;
    const y = n.y ?? 0;
    const h = n.h ?? 0;
    if (n.routingObstacle === false) {
      // 纯装饰/能力横条：不阻断布线（连线允许从其视觉带内穿过），只留边界挂接几何
      phantoms.set(n.id, { x, y, w: n.w, h });
      continue;
    }
    const rect = new Rectangle(new Point(x, y), new Point(x + n.w, y + h));
    const shape = new ShapeRef(router as unknown as LibRouter, rect) as unknown as AnyShape;
    for (let i = 0; i < SIDE_SLOTS.length; i++) {
      const t = SIDE_SLOTS[i];
      makePin(shape, pinClass("top", i), t, 0.0);
      makePin(shape, pinClass("bottom", i), t, 1.0);
      makePin(shape, pinClass("left", i), 0.0, t);
      makePin(shape, pinClass("right", i), 1.0, t);
    }
    shapes.set(n.id, shape);
  }

  // —— 泳道左侧层名标签带：只封层名"文字区"，在带的右缘逼出固定窄通道 ——
  // 不封整条带：全宽 bar（如 overall-flow 飞轮横条 / contract-blueprint 集成层）会
  // 横贯某条泳道，跨层反哺边几何上只能
  // 从首列左侧绕行，全封会把路线逼到画布外（x<0）。障碍左缘延伸到极左，杜绝
  // 路由器绕出画布；右缘止于文字区右侧，使所有绕行竖线汇聚到同一条窄通道
  // （约 x 110..120），不再贴着层名文字散成一排。
  const BAND_FAR_LEFT = -1000;
  const LABEL_TEXT_RIGHT = LANE_LEFT + 88; // 层名文字区右缘（文字约 x 24..100）
  for (const lane of flow.lanes) {
    const top = lane.top ?? 0;
    const height = lane.height ?? 0;
    new ShapeRef(
      router as unknown as LibRouter,
      new Rectangle(
        new Point(BAND_FAR_LEFT, top),
        new Point(LABEL_TEXT_RIGHT, top + height),
      ),
    );
  }

  const asSide = (v: string | undefined): Side | null =>
    v === "top" || v === "bottom" || v === "left" || v === "right" ? v : null;

  /** 先选边（上/下/左/右），槽位稍后再按同边多线分配——对齐 draw.io 多连接点。 */
  const chooseSides = (e: RawEdge): { srcSide: Side; tgtSide: Side } => {
    const s = nodeById.get(e.from);
    const t = nodeById.get(e.to);
    if (!s || !t) throw new Error(`边 ${e.from}→${e.to} 引用了不存在的节点`);

    const scx = (s.x ?? 0) + s.w / 2;
    const scy = (s.y ?? 0) + nodeH(s) / 2;
    const tcx = (t.x ?? 0) + t.w / 2;
    const tcy = (t.y ?? 0) + nodeH(t) / 2;
    const dx = tcx - scx;
    const dy = tcy - scy;
    const sameLane = (s.laneIndex ?? 0) === (t.laneIndex ?? 0);

    // 同泳道优先按较大的几何位移选择方向；跨泳道仍偏好上下连接，
    // 但当横向位移明显大于纵向位移时允许侧边连接，避免不必要的长折返。
    const verticalPreferred = sameLane
      ? Math.abs(dy) > Math.abs(dx)
      : Math.abs(dy) >= Math.abs(dx) * 0.9;

    let srcSide: Side;
    let tgtSide: Side;
    if (verticalPreferred) {
      srcSide = dy >= 0 ? "bottom" : "top";
      tgtSide = dy >= 0 ? "top" : "bottom";
    } else {
      srcSide = dx >= 0 ? "right" : "left";
      tgtSide = dx >= 0 ? "left" : "right";
    }
    srcSide = asSide(e.fromSide) ?? srcSide;
    tgtSide = asSide(e.toSide) ?? tgtSide;
    return { srcSide, tgtSide };
  };

  const OPPOSITE: Record<Side, Side> = {
    top: "bottom", bottom: "top", left: "right", right: "left",
  };
  const nodeBox = (id: string) => {
    const n = nodeById.get(id);
    if (!n) throw new Error(`边端点 ${id} 不存在`);
    return { x: n.x ?? 0, y: n.y ?? 0, w: n.w, h: n.h ?? 0 };
  };
  /** 线段是否穿进矩形内部（贴边不算） */
  const cutsRect = (
    x1: number, y1: number, x2: number, y2: number,
    r: { x: number; y: number; w: number; h: number },
  ): boolean => {
    const EPS = 1;
    if (Math.abs(y1 - y2) <= EPS) {
      return y1 > r.y + EPS && y1 < r.y + r.h - EPS &&
        Math.max(x1, x2) > r.x + EPS && Math.min(x1, x2) < r.x + r.w - EPS;
    }
    if (Math.abs(x1 - x2) <= EPS) {
      return x1 > r.x + EPS && x1 < r.x + r.w - EPS &&
        Math.max(y1, y2) > r.y + EPS && Math.min(y1, y2) < r.y + r.h - EPS;
    }
    return true;
  };
  const cutsAnything = (a: Pt, b: Pt, skip: Set<string>): boolean => {
    for (const n of flow.nodes) {
      if (skip.has(n.id) || n.routingObstacle === false) continue;
      if (cutsRect(a[0], a[1], b[0], b[1], nodeBox(n.id))) return true;
    }
    for (const lane of flow.lanes) {
      const top = lane.top ?? 0;
      const height = lane.height ?? 0;
      if (cutsRect(a[0], a[1], b[0], b[1], { x: 0, y: top, w: LABEL_TEXT_RIGHT, h: height })) {
        return true;
      }
    }
    return false;
  };
  /** 两端正对，且重叠区间中线没有别的节点挡住 */
  const corridorOpen = (e: RawEdge, srcSide: Side, tgtSide: Side): boolean => {
    if (tgtSide !== OPPOSITE[srcSide]) return false;
    if (phantoms.has(e.from) || phantoms.has(e.to)) return false;
    const s = nodeBox(e.from);
    const t = nodeBox(e.to);
    const skip = new Set([e.from, e.to]);
    if (srcSide === "left" || srcSide === "right") {
      const lo = Math.max(s.y, t.y);
      const hi = Math.min(s.y + s.h, t.y + t.h);
      if (hi - lo < 8) return false;
      const y = Math.round((lo + hi) / 2);
      const x1 = srcSide === "right" ? s.x + s.w : s.x;
      const x2 = tgtSide === "right" ? t.x + t.w : t.x;
      return !cutsAnything([x1, y], [x2, y], skip);
    }
    const lo = Math.max(s.x, t.x);
    const hi = Math.min(s.x + s.w, t.x + t.w);
    if (hi - lo < 8) return false;
    const x = Math.round((lo + hi) / 2);
    const y1 = srcSide === "bottom" ? s.y + s.h : s.y;
    const y2 = tgtSide === "bottom" ? t.y + t.h : t.y;
    return !cutsAnything([x, y1], [x, y2], skip);
  };
  const idealT = (
    self: { x: number; y: number; w: number; h: number },
    side: Side,
    peerAbs: number,
  ): number => {
    const alongX = side === "top" || side === "bottom";
    const origin = alongX ? self.x : self.y;
    const span = alongX ? self.w : self.h;
    const t = span === 0 ? 0.5 : (peerAbs - origin) / span;
    return Math.min(SIDE_SLOTS[SIDE_SLOTS.length - 1], Math.max(SIDE_SLOTS[0], t));
  };

  /** 同节点同边：一条线用中点；多条线按对端投影就近占空槽。 */
  const edgeSides = flow.edges.map((e) => ({ e, ...chooseSides(e) }));
  const slotOf = new Map<string, { src: number; tgt: number }>();
  {
    const groups = new Map<string, SlotClaim[]>();
    for (const { e, srcSide, tgtSide } of edgeSides) {
      if (!e.id) throw new Error(`边 ${e.from}→${e.to} 缺少 id`);
      const s = nodeBox(e.from);
      const t = nodeBox(e.to);
      const direct = corridorOpen(e, srcSide, tgtSide);
      const srcPeer = srcSide === "top" || srcSide === "bottom" ? t.x + t.w / 2 : t.y + t.h / 2;
      const tgtPeer = tgtSide === "top" || tgtSide === "bottom" ? s.x + s.w / 2 : s.y + s.h / 2;
      const srcKey = `${e.from}|${srcSide}`;
      const tgtKey = `${e.to}|${tgtSide}`;
      if (!groups.has(srcKey)) groups.set(srcKey, []);
      if (!groups.has(tgtKey)) groups.set(tgtKey, []);
      groups.get(srcKey)!.push({
        edgeId: e.id, end: "src", direct, ideal: idealT(s, srcSide, srcPeer),
      });
      groups.get(tgtKey)!.push({
        edgeId: e.id, end: "tgt", direct, ideal: idealT(t, tgtSide, tgtPeer),
      });
    }
    for (const claims of groups.values()) {
      if (claims.length > SIDE_SLOTS.length) {
        throw new Error(
          `同边连接点需求 ${claims.length} 超过槽位 ${SIDE_SLOTS.length}——拆分节点或增加 SIDE_SLOTS`,
        );
      }
      for (const hit of assignGroupSlots(claims)) {
        const cur = slotOf.get(hit.edgeId) ?? { src: MID_SLOT, tgt: MID_SLOT };
        if (hit.end === "src") cur.src = hit.slot;
        else cur.tgt = hit.slot;
        slotOf.set(hit.edgeId, cur);
      }
    }
  }

  const portPoint = (id: string, side: Side, slot: number): Pt => {
    const b = nodeBox(id);
    const t = SIDE_SLOTS[slot];
    if (side === "top") return [Math.round(b.x + b.w * t), b.y];
    if (side === "bottom") return [Math.round(b.x + b.w * t), b.y + b.h];
    if (side === "left") return [b.x, Math.round(b.y + b.h * t)];
    return [b.x + b.w, Math.round(b.y + b.h * t)];
  };
  /**
   * 两端连接点已经共线，且中间没有别的节点：直接一段。
   * 上下节点缝（常为 10px）小于双侧 shapeBuffer，libavoid 会拐到节点外侧再绕回来。
   */
  const straightRoutes = new Map<string, Pt[]>();
  for (const { e, srcSide, tgtSide } of edgeSides) {
    if (phantoms.has(e.from) || phantoms.has(e.to)) continue;
    const slots = slotOf.get(e.id!) ?? { src: MID_SLOT, tgt: MID_SLOT };
    const a = portPoint(e.from, srcSide, slots.src);
    const b = portPoint(e.to, tgtSide, slots.tgt);
    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);
    if ((dx <= 1 && dy <= 1) || (dx > 1 && dy > 1)) continue;
    const line: Pt[] = dx <= 1 ? [[a[0], a[1]], [a[0], b[1]]] : [[a[0], a[1]], [b[0], a[1]]];
    if (line[0][0] === line[1][0] && line[0][1] === line[1][1]) continue;
    if (cutsAnything(line[0], line[1], new Set([e.from, e.to]))) continue;
    straightRoutes.set(e.id!, line);
  }

  const connById = new Map<string, AnyConn>();
  /**
   * 非障碍（phantom）端点挂接：贴边中点按「面向对端 + 横条感知」选取。
   * 横条（w≥4h）几何中心无意义：无论横向距离多远一律上/下边贴接，
   * 落点水平夹在「对端中心」与「横条内缩范围」之间，保证从外部垂直接入，
   * 不出现沿横条内部穿行到边缘的刺线。
   */
  const blocksVertical = (x: number, y0: number, y1: number, skip: Set<string>): boolean => {
    const top = Math.min(y0, y1);
    const bot = Math.max(y0, y1);
    return flow.nodes.some((n) => {
      if (skip.has(n.id) || n.routingObstacle === false || (n.kind ?? "normal") === "bar") return false;
      const nx = n.x ?? 0;
      const ny = n.y ?? 0;
      const nh = n.h ?? 0;
      return x > nx + 1 && x < nx + n.w - 1 && bot > ny + 1 && top < ny + nh - 1;
    });
  };
  const phantomAttach = (
    selfId: string,
    otherId: string,
  ): { pt: [number, number]; facing: "top" | "bottom" | "left" | "right" } => {
    const b = phantoms.get(selfId)!;
    const o = nodeBox(otherId);
    const dyC = b.y + b.h / 2 - (o.y + o.h / 2);
    const dxC = b.x + b.w / 2 - (o.x + o.w / 2);
    const vertical = b.w >= b.h * 4 || Math.abs(dyC) >= Math.abs(dxC);
    if (vertical) {
      const lo = b.x + 40;
      const hi = b.x + b.w - 40;
      const yEdge = dyC >= 0 ? b.y : b.y + b.h;
      const yOther = dyC >= 0 ? o.y + o.h : o.y;
      let x = Math.min(Math.max(o.x + o.w / 2, lo), hi);
      // 对端正下方被节点挡住时，落到横条上最近的空列，避免贴画布外缘绕行
      if (blocksVertical(x, yEdge, yOther, new Set([selfId, otherId]))) {
        const prefer = o.x + o.w / 2;
        let found: number | null = null;
        for (let d = 8; d <= hi - lo && found == null; d += 8) {
          for (const cand of [prefer - d, prefer + d]) {
            if (cand < lo || cand > hi) continue;
            if (!blocksVertical(cand, yEdge, yOther, new Set([selfId, otherId]))) {
              found = cand;
              break;
            }
          }
        }
        if (found != null) x = Math.round(found);
      }
      return dyC >= 0
        ? { pt: [x, b.y], facing: "top" }
        : { pt: [x, b.y + b.h], facing: "bottom" };
    }
    const y = Math.min(Math.max(o.y + o.h / 2, b.y + 20), b.y + b.h - 20);
    return dxC >= 0 ? { pt: [b.x, y], facing: "left" } : { pt: [b.x + b.w, y], facing: "right" };
  };
  for (const { e, srcSide, tgtSide } of edgeSides) {
    if (straightRoutes.has(e.id!)) continue;
    const slots = slotOf.get(e.id!) ?? { src: MID_SLOT, tgt: MID_SLOT };
    let srcPin = pinClass(srcSide, slots.src);
    let tgtPin = pinClass(tgtSide, slots.tgt);
    const srcShape = shapes.get(e.from);
    const tgtShape = shapes.get(e.to);
    const srcPhantom = phantoms.has(e.from);
    const tgtPhantom = phantoms.has(e.to);
    if (!srcShape && !srcPhantom) {
      throw new Error(`边 ${e.id ?? `${e.from}→${e.to}`} 的源节点不在障碍/挂接表中`);
    }
    if (!tgtShape && !tgtPhantom) {
      throw new Error(`边 ${e.id ?? `${e.from}→${e.to}`} 的目标节点不在障碍/挂接表中`);
    }
    let srcEnd: unknown;
    let tgtEnd: unknown;
    const srcPt = srcPhantom ? phantomAttach(e.from, e.to) : null;
    const tgtPt = tgtPhantom ? phantomAttach(e.to, e.from) : null;
    // phantom 贴边后，对端改走相对边的中点槽（仍保持多点能力的默认中位）
    if (srcPt) tgtPin = pinClass(OPPOSITE[srcPt.facing], MID_SLOT);
    if (tgtPt) srcPin = pinClass(OPPOSITE[tgtPt.facing], MID_SLOT);
    srcEnd = srcPt
      ? ConnEnd.fromPoint(new Point(srcPt.pt[0], srcPt.pt[1]))
      : ConnEnd.fromShapePin(
        srcShape as unknown as Parameters<typeof ConnEnd.fromShapePin>[0],
        srcPin,
      );
    tgtEnd = tgtPt
      ? ConnEnd.fromPoint(new Point(tgtPt.pt[0], tgtPt.pt[1]))
      : ConnEnd.fromShapePin(
        tgtShape as unknown as Parameters<typeof ConnEnd.fromShapePin>[0],
        tgtPin,
      );
    const conn = new ConnRef(
      router as unknown as LibRouter,
      srcEnd as unknown as LibConnEnd,
      tgtEnd as unknown as LibConnEnd,
    ) as unknown as AnyConn;
    // 交叉调优开启时，主链连接器宁绕路不交叉（branch/feedback/support 不加，避免耗时失控）
    if (CROSSING_PENALTY > 0 && e.routeRole === "primary") {
      (conn as { setHateCrossings?(v: boolean): void }).setHateCrossings?.(true);
    }
    connById.set(e.id!, conn);
  }

  router.processTransaction();

  const routes = new Map<string, Pt[]>(straightRoutes);
  for (const [id, conn] of connById) {
    const displayRoute = conn.displayRoute();
    if (!displayRoute) continue;
    const pts: Pt[] = [];
    for (let i2 = 0; i2 < displayRoute.size(); i2++) {
      const p = displayRoute.at(i2);
      pts.push([Math.round(p.x), Math.round(p.y)]);
    }
    // 去除连续重复点（库在极短段上会产出重复点）
    const deduped = pts.filter(
      (p, i2) => i2 === 0 || p[0] !== pts[i2 - 1][0] || p[1] !== pts[i2 - 1][1],
    );
    routes.set(id, deduped);
  }
  return routes;
}

async function main(): Promise<void> {
  const elk = new ElkConstructor();
  let touched = 0;
  for (const file of files.sort()) {
    const path = join(dir, file);
    const cfg = JSON.parse(readFileSync(path, "utf8")) as RawConfig;
    const flow = cfg.flow;
    if (!flow || flow.autoLayout !== true) continue;

    // —— 校验：autoLayout 场景每个节点必须显式声明 laneIndex ——
    for (const n of flow.nodes) {
      if (n.laneIndex == null) {
        throw new Error(
          `${file}：节点 ${n.id} 缺少 laneIndex——autoLayout 场景必须显式声明所属泳道`,
        );
      }
      if (n.laneIndex < 0 || n.laneIndex >= flow.lanes.length) {
        throw new Error(
          `${file}：节点 ${n.id} 的 laneIndex=${n.laneIndex} 越界（共 ${flow.lanes.length} 条泳道）`,
        );
      }
    }

    // —— 校验：边 id 必填且唯一（路线 Map 以 id 为键，缺失/重复会互相覆盖）——
    const seenEdgeIds = new Set<string>();
    for (const e of flow.edges) {
      if (!e.id) {
        throw new Error(
          `${file}：边 ${e.from}→${e.to} 缺少 id——先跑 review/repair-edge-id-role.ts 回填`,
        );
      }
      if (seenEdgeIds.has(e.id)) {
        throw new Error(`${file}：边 id "${e.id}" 重复（${e.from}→${e.to}）`);
      }
      seenEdgeIds.add(e.id);
    }

    const laneNodeLists: RawFlow["nodes"][] = flow.lanes.map(() => []);
    for (const n of flow.nodes) laneNodeLists[n.laneIndex ?? 0].push(n);

    // —— 阶段 1+2（链式布局分支）：列=链位、跨泳道保持同列，蛇形推进 ——
    const chainMode = Array.isArray(flow.chain) && (flow.chain as string[]).length > 0;
    const chainGrid = chainMode ? chainColumns(flow, file) : null;

    // —— 阶段 1（ELK 分支）：各泳道独立 RIGHT 布局（只定位节点） ——
    const laneOuts = await Promise.all(
      laneNodeLists.map((list) => {
        if (list.length === 1 && (list[0].kind ?? "normal") === "bar") {
          // 单 bar 泳道无需 ELK
          return Promise.resolve(null);
        }
        return layoutLane(elk, list);
      }),
    );

    // —— 阶段 2：泳道垂直堆叠；节点经固定间距网格重排后换算全局坐标 ——
    const laid = new Map<string, LaidNode>();
    let cursorY = chainMode ? CHAIN_LANE_TOP_PAD : LANE_TOP_PAD;
    const TOP_PAD = chainMode ? CHAIN_LANE_TOP_PAD : LANE_TOP_PAD;
    const BOTTOM_PAD = chainMode ? CHAIN_LANE_BOTTOM_PAD : LANE_BOTTOM_PAD;
    const USE_GAP = chainMode ? CHAIN_LANE_GAP : LANE_GAP;
    laneNodeLists.forEach((list, li) => {
      const out = laneOuts[li];

      // bar 全宽定位（单 bar 泳道 out=null；混合泳道亦先占位，不参与网格）
      const barNodes = list.filter((n) => (n.kind ?? "normal") === "bar");
      for (const n of barNodes) n.w = CONTENT_RIGHT - NODE_LEFT;

      let gridPos = new Map<string, { x: number; y: number }>();
      let gridH = 0;
      if (chainGrid) {
        // 链式分支：pos.x 已是全局坐标（colLefts 全局），高度含 bar 行
        const r = chainLaneGrid(list, chainGrid);
        gridPos = r.pos;
        gridH = r.height;
      } else {
        // ELK 分支：非 bar 节点的最终尺寸表，喂给网格重排（局部坐标）
        const gridNodes = list.filter((n) => (n.kind ?? "normal") !== "bar");
        const sized = new Map<string, { w: number; h: number }>(
          gridNodes.map((n) => [n.id, { w: n.w, h: nodeH(n) }]),
        );
        if (gridNodes.length > 0) {
          if (!out) throw new Error(`${file}：泳道 ${li} 缺少 ELK 布局产物`);
          const remapped = remapLaneGrid(out, sized);
          gridPos = remapped.pos;
          gridH = remapped.height;
        }
      }

      let laneContentH = 0;
      for (const n of list) {
        const kind = (n.kind ?? "normal") as keyof typeof DEFAULT_H;
        const h = nodeH(n);
        const gp = gridPos.get(n.id);
        if (!gp) {
          throw new Error(`${file}：网格重排未产出节点 ${n.id} 的坐标`);
        }
        const x = chainGrid ? gp.x : kind === "bar" ? NODE_LEFT : NODE_LEFT + gp.x;
        const y = cursorY + gp.y;
        laid.set(n.id, { id: n.id, kind, lane: li, w: n.w, h, x, y });
        n.x = Math.round(x);
        n.y = Math.round(y);
        // 回写预测高度：渲染器据此固定盒高，保证布局与渲染几何一致
        n.h = h;
      }

      // 泳道内容高度：链式分支 gridH 已含 bar 行；ELK 分支取网格高/bar 高大者
      const barsH = chainGrid ? 0 : barNodes.reduce((acc, n) => acc + nodeH(n), 0);
      laneContentH = Math.max(gridH, barsH);
      flow.lanes[li].top = Math.round(cursorY - TOP_PAD);
      flow.lanes[li].height = Math.round(
        laneContentH + TOP_PAD + BOTTOM_PAD,
      );
      cursorY += laneContentH + TOP_PAD + BOTTOM_PAD + USE_GAP;
    });
    const canvasBottom = cursorY - USE_GAP;

    // 宽度红线：层内布局不得超出内容区
    const overflow = flow.nodes
      .filter((n) => (n.x ?? 0) + n.w > CONTENT_RIGHT)
      .map((n) => n.id);
    if (overflow.length > 0) {
      throw new Error(
        `${file}：节点 ${overflow.join(",")} 超出内容区右边界 ${CONTENT_RIGHT}（层内链路过长，需压缩间距/宽度或换行）`,
      );
    }

    // —— 阶段 3：obstacle-router 统一走全部边 ——
    const routes = routeAllEdges(flow);

    // 标签避障用的节点框表（最终几何已回写）
    const nodeBoxes = flow.nodes.map((n) => ({
      x: n.x ?? 0,
      y: n.y ?? 0,
      w: n.w,
      h: n.h ?? 0,
    }));

    // —— 回写全部边 ——
    flow.edges.forEach((e) => {
      const hit = routes.get(e.id!);
      if (!hit || hit.length < 2) {
        throw new Error(`${file}：边 ${e.id}（${e.from}→${e.to}）缺少布线产物`);
      }
      e.route = hit;
      // 标签避障排除本边两端（允许贴端点；压端点由 validate 记 warn）
      if (e.label) {
        const avoid = nodeBoxes.filter((_, i) => {
          const id = flow.nodes[i].id;
          return id !== e.from && id !== e.to;
        });
        e.labelAt = labelAtForRoute(e.route, e.label, avoid);
      }
      delete e.via;
      delete e.fromSide;
      delete e.toSide;
      if (!e.label) delete e.labelAt;
    });

    // —— 画布尺寸 ——
    flow.width = PAGE_WIDTH;
    flow.height = Math.round(canvasBottom);

    writeFileSync(path, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
    touched++;
    console.log(
      `✓ ${file}（${cfg.id}）：${flow.nodes.length} 节点 / ${flow.edges.length} 边 / ${flow.lanes.length} 泳道，画布 ${flow.width}×${flow.height}`,
    );
  }
  console.log(
    touched > 0
      ? `✓ 自动布局完成：${touched} 份 autoLayout 配置已回写`
      : "— 没有 flow.autoLayout=true 的配置，跳过布局",
  );
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(resolve(entry)).href) {
  main().catch((err: unknown) => {
    console.error("✘ 自动布局失败：", err);
    process.exit(1);
  });
}
