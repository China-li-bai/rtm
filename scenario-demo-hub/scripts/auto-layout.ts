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
 * 渲染器只消费回写的几何产物。attr-extraction.json 等手工布局文件（无 autoLayout
 * 标记）原样跳过。
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
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
  idealNudgingDistance,
  improveOrthogonalRoutes,
  segmentPenalty,
  shapeBufferDistance,
  vertexVisibility,
} from "obstacle-router";
import ElkConstructor from "elkjs/lib/elk.bundled.js";
import type { ELK, ElkNode } from "elkjs/lib/elk-api";

/** 渲染器默认节点高度，须与 FlowCanvas.DEFAULT_H 保持一致 */
const DEFAULT_H = {
  normal: 76,
  highlight: 76,
  dashed: 76,
  diamond: 58,
  bar: 44,
  loopchip: 32,
} as const;

const LANE_TOP_PAD = 28; // 泳道顶部留白
const LANE_BOTTOM_PAD = 14; // 泳道底部留白
const LANE_GAP = 40; // 相邻泳道间距
const LANE_LEFT = 12; // .lane 的 left
const LABEL_BAND = 118; // 左侧层名标签带
const CANVAS_RIGHT_PAD = 12;
const PAGE_WIDTH = 1360;
const NODE_LEFT = LANE_LEFT + LABEL_BAND; // 130：节点左缘
const CONTENT_RIGHT = PAGE_WIDTH - CANVAS_RIGHT_PAD; // 1348
const NODE_NODE_GAP = 40; // 同层层内节点水平间距（ELK 无连边时忽略该参数，仅名义保留）
const ROW_GAP = 34; // 同层层内换行的行间距（同上）
const GRID_GAP = 40; // 网格重排的行列间距，须 > 2×SHAPE_BUFFER，保证布线走廊通畅

// obstacle-router 布线参数（libavoid 语义）
const SHAPE_BUFFER = 10; // 障碍外间距
const NUDGE_DISTANCE = 12; // 平行线段理想间距
const SEGMENT_PENALTY = 10; // 段代价（>0 才启用 nudging）

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
  return Math.round(h + 2); // +2 边框/舍入余量，宁可略高不可重叠
}

interface RawNode {
  id: string;
  kind?: keyof typeof DEFAULT_H;
  laneIndex?: number;
  h?: number;
  w: number;
  x?: number;
  y?: number;
  no?: string;
  title?: string;
  sub?: string;
  aip?: string;
  [k: string]: unknown;
}

interface RawEdge {
  from: string;
  to: string;
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

/** 标签渲染高度（约等于 .lab 行高），用于与节点做矩形避障 */
const LABEL_H = 16;
/** 标签与线段的纵向间距（.lab 渲染在锚点处，锚点取线段上方） */
const LABEL_GAP = 17;

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

/**
 * 按正交路线自动计算标签锚点（左上角坐标），且保证不压任何节点。
 *
 * 取最长水平段、标签贴其上方，先居中再以 2px 步长向两侧滑动，选首个不与
 * 节点框相交的位置；该段全程被遮挡时依次尝试更短水平段；都不行则回退到
 * 路线中点（此时按"最小碰撞"放置）。
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
  const lw = labelWidth(text);
  const segs: { x1: number; x2: number; y: number }[] = [];
  for (let i = 1; i < route.length; i++) {
    if (route[i - 1][1] === route[i][1]) {
      segs.push({
        x1: Math.min(route[i - 1][0], route[i][0]),
        x2: Math.max(route[i - 1][0], route[i][0]),
        y: route[i][1],
      });
    }
  }
  segs.sort((a, b) => b.x2 - b.x1 - (a.x2 - a.x1));

  for (const seg of segs) {
    if (seg.x2 - seg.x1 < lw) continue; // 段长放不下标签
    const ly = seg.y - LABEL_GAP;
    const center = Math.round((seg.x1 + seg.x2) / 2 - lw / 2);
    // 从居中位置开始，向两侧逐级滑动，首个不压节点即采用
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
  // 无可用水平段：回退路线中点，右上偏移（极少触发）
  const mid = route[Math.floor((route.length - 1) / 2)];
  return [Math.round(mid[0] + 4), Math.round(mid[1] - LABEL_GAP - 1)];
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "scenarios");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

/**
 * 阶段 3：obstacle-router 把全部边一次性正交避障布线。
 *
 * pin 约定（class id 按 shape 独立编号）：1=顶 2=底 3=左 4=右，全部设为
 * 非独占且全方向可见——流程图同一端口多入多出是正常语义；全方向可见让被
 * 同列节点封堵的引脚仍能先横移再纵走，避免"路径不可达"。
 *
 * @param flow 已回写节点全局几何的 flow
 * @returns 按 "from→to" 索引的完整正交点串
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

  // pin class id（按 shape 独立编号）
  const PIN_TOP = 1;
  const PIN_BOTTOM = 2;
  const PIN_LEFT = 3;
  const PIN_RIGHT = 4;

  // 注意：ShapeRef/ShapeConnectionPin 实例绝不可赋 .id 属性——会覆盖库内部
  // 的 id() 方法；外部一律用 Map 关联。
  const shapes = new Map<string, AnyShape>();
  /** 构造一个比例偏移引脚并关闭独占（同端口多入多出是流程图正常语义）。 */
  const makePin = (shape: AnyShape, classId: number, xOff: number, yOff: number): unknown =>
    ShapeConnectionPin.createForShape(
      shape as unknown as Parameters<typeof ShapeConnectionPin.createForShape>[0],
      classId,
      xOff,
      yOff,
      true,
      0,
      ConnDirAll,
    );
  for (const n of flow.nodes) {
    const rect = new Rectangle(
      new Point(n.x ?? 0, n.y ?? 0),
      new Point((n.x ?? 0) + n.w, (n.y ?? 0) + (n.h ?? 0)),
    );
    const shape = new ShapeRef(router as unknown as LibRouter, rect) as unknown as AnyShape;
    const pins = [
      makePin(shape, PIN_TOP, 0.5, 0.0),
      makePin(shape, PIN_BOTTOM, 0.5, 1.0),
      makePin(shape, PIN_LEFT, 0.0, 0.5),
      makePin(shape, PIN_RIGHT, 1.0, 0.5),
    ];
    for (const pin of pins) {
      (pin as { setExclusive(value: boolean): void }).setExclusive(false);
    }
    shapes.set(n.id, shape);
  }

  // —— 泳道左侧层名标签带：只封层名"文字区"，在带的右缘逼出固定窄通道 ——
  // 不封整条带：n11 全宽 bar 横贯公共底座层，跨层反哺边（n12→n3 等）几何上只能
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

  /**
   * 按层关系与几何选择源/目标 pin class。
   * @param e 边配置
   * @returns 源、目标引脚 class
   */
  const choosePins = (e: RawEdge): { srcPin: number; tgtPin: number } => {
    const s = nodeById.get(e.from);
    const t = nodeById.get(e.to);
    if (!s || !t) throw new Error(`边 ${e.from}→${e.to} 引用了不存在的节点`);
    const sLane = s.laneIndex ?? 0;
    const tLane = t.laneIndex ?? 0;
    if (tLane !== sLane) {
      // 跨层：层号增大=向下（底出顶入），层号减小=向上（顶出底入）
      return tLane > sLane
        ? { srcPin: PIN_BOTTOM, tgtPin: PIN_TOP }
        : { srcPin: PIN_TOP, tgtPin: PIN_BOTTOM };
    }
    // 同层：默认按列走左右引脚；同列（x 差不足半宽）才走上下
    const dx = (t.x ?? 0) - (s.x ?? 0);
    if (Math.abs(dx) >= s.w * 0.5) {
      return dx > 0
        ? { srcPin: PIN_RIGHT, tgtPin: PIN_LEFT }
        : { srcPin: PIN_LEFT, tgtPin: PIN_RIGHT };
    }
    return (t.y ?? 0) > (s.y ?? 0)
      ? { srcPin: PIN_BOTTOM, tgtPin: PIN_TOP }
      : { srcPin: PIN_TOP, tgtPin: PIN_BOTTOM };
  };

  // 保留每个 ConnRef 实例与 flow.edges 对位（库的连接器列表字段/内部顺序均不应假设）
  const conns: AnyConn[] = [];
  for (const e of flow.edges) {
    const { srcPin, tgtPin } = choosePins(e);
    const srcShape = shapes.get(e.from);
    const tgtShape = shapes.get(e.to);
    if (!srcShape || !tgtShape) {
      throw new Error(`边 ${e.from}→${e.to} 引用了不存在的节点`);
    }
    const srcEnd = ConnEnd.fromShapePin(
      srcShape as unknown as Parameters<typeof ConnEnd.fromShapePin>[0],
      srcPin,
    ) as unknown as LibConnEnd;
    const tgtEnd = ConnEnd.fromShapePin(
      tgtShape as unknown as Parameters<typeof ConnEnd.fromShapePin>[0],
      tgtPin,
    ) as unknown as LibConnEnd;
    conns.push(
      new ConnRef(router as unknown as LibRouter, srcEnd, tgtEnd) as unknown as AnyConn,
    );
  }

  router.processTransaction();

  const routes = new Map<string, Pt[]>();
  flow.edges.forEach((e, i) => {
    const displayRoute = conns[i]?.displayRoute();
    if (!displayRoute) return;
    const pts: Pt[] = [];
    for (let i2 = 0; i2 < displayRoute.size(); i2++) {
      const p = displayRoute.at(i2);
      pts.push([Math.round(p.x), Math.round(p.y)]);
    }
    // 去除连续重复点（库在极短段上会产出重复点）
    const deduped = pts.filter(
      (p, i2) => i2 === 0 || p[0] !== pts[i2 - 1][0] || p[1] !== pts[i2 - 1][1],
    );
    routes.set(`${e.from}→${e.to}`, deduped);
  });
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

    const laneNodeLists: RawFlow["nodes"][] = flow.lanes.map(() => []);
    for (const n of flow.nodes) laneNodeLists[n.laneIndex ?? 0].push(n);

    // —— 阶段 1：各泳道独立 RIGHT 布局（只定位节点） ——
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
    let cursorY = LANE_TOP_PAD;
    laneNodeLists.forEach((list, li) => {
      const out = laneOuts[li];

      // bar 全宽定位（单 bar 泳道 out=null；混合泳道亦先占位，不参与网格）
      const barNodes = list.filter((n) => (n.kind ?? "normal") === "bar");
      for (const n of barNodes) n.w = CONTENT_RIGHT - NODE_LEFT;

      // 非 bar 节点的最终尺寸表，喂给网格重排
      const gridNodes = list.filter((n) => (n.kind ?? "normal") !== "bar");
      const sized = new Map<string, { w: number; h: number }>(
        gridNodes.map((n) => [n.id, { w: n.w, h: nodeH(n) }]),
      );
      let gridPos = new Map<string, { x: number; y: number }>();
      let gridH = 0;
      if (gridNodes.length > 0) {
        if (!out) throw new Error(`${file}：泳道 ${li} 缺少 ELK 布局产物`);
        const remapped = remapLaneGrid(out, sized);
        gridPos = remapped.pos;
        gridH = remapped.height;
      }

      let laneContentH = 0;
      for (const n of list) {
        const kind = (n.kind ?? "normal") as keyof typeof DEFAULT_H;
        const h = nodeH(n);
        let x: number;
        let y: number;
        if (kind === "bar") {
          x = NODE_LEFT;
          y = cursorY;
        } else {
          const gp = gridPos.get(n.id);
          if (!gp) {
            throw new Error(`${file}：网格重排未产出节点 ${n.id} 的坐标`);
          }
          x = NODE_LEFT + gp.x;
          y = cursorY + gp.y;
        }
        laid.set(n.id, { id: n.id, kind, lane: li, w: n.w, h, x, y });
        n.x = Math.round(x);
        n.y = Math.round(y);
        // 回写预测高度：渲染器据此固定盒高，保证布局与渲染几何一致
        n.h = h;
      }

      // 泳道内容高度：网格高/bar 高取大者；bar 自身高度纳入堆叠
      const barsH = barNodes.reduce((acc, n) => acc + nodeH(n), 0);
      laneContentH = Math.max(gridH, barsH);
      flow.lanes[li].top = Math.round(cursorY - LANE_TOP_PAD);
      flow.lanes[li].height = Math.round(
        laneContentH + LANE_TOP_PAD + LANE_BOTTOM_PAD,
      );
      cursorY += laneContentH + LANE_TOP_PAD + LANE_BOTTOM_PAD + LANE_GAP;
    });
    const canvasBottom = cursorY - LANE_GAP;

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
      const hit = routes.get(`${e.from}→${e.to}`);
      if (!hit || hit.length < 2) {
        throw new Error(`${file}：边 ${e.from}→${e.to} 缺少布线产物`);
      }
      e.route = hit;
      // 标签位置一律按最终路线重新计算，旧坐标（含历史手工值）每次确定性覆盖
      if (e.label) e.labelAt = labelAtForRoute(e.route, e.label, nodeBoxes);
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

main().catch((err: unknown) => {
  console.error("✘ 自动布局失败：", err);
  process.exit(1);
});
