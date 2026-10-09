
# RTM：AI 猜你喜欢泳道图修复方案

目标：把 `scenario-demo-hub` 中的「AI 猜你喜欢 · 场景融合演示」调整为参考图的分层泳道布局；左侧为固定泳道标题栏，主体从左到右展示召回、融合、采购规则过滤、排序、展示及反馈；连线使用可复现的正交避障；构建时对几何结果进行校验。

## 1. `src/flow/tokens.ts`：安全间距 token

将 `GRID_GAP` 调整为 30。`SHAPE_BUFFER` 当前为 10，所以 30 仍大于两个障碍缓冲区之和 20；此参数同时是链式布局的最小列间距阈值，允许节点加宽后仍留在画布范围内。

```ts
/** ELK 网格重排的行列间距；必须 > 2 × SHAPE_BUFFER(10) */
GRID_GAP: 30,
```

## 2. 完整替换 `src/components/flow/LaneBand.tsx`

```tsx
import type { ScenarioConfig } from "../../schema/scenario";

type Lane = ScenarioConfig["flow"]["lanes"][number];

interface Props {
  lane: Lane;
}

/**
 * 横向泳道 + 左侧固定标题栏。
 * 标题栏文字限制在标签带左侧 78px，给 x≈100..120 的反馈回路走线保留通道；
 * 节点区起点仍由 NODE_LEFT = LANE_LEFT + LABEL_BAND 统一控制。
 */
export function LaneBand({ lane }: Props) {
  const tone = lane.tone ? ` tone-${lane.tone}` : "";
  const laneStyle = { top: lane.top, height: lane.height };

  return (
    <>
      <div className={`lane${tone}`} style={laneStyle} aria-hidden="true" />
      <div
        className={`lane-rail${tone}`}
        style={laneStyle}
        aria-label={lane.label}
      >
        <div className="lane-rail-copy">
          <div className="lane-label">{lane.label}</div>
          {lane.note && <div className="lane-note-box">{lane.note}</div>}
        </div>
      </div>
    </>
  );
}
```

## 3. `src/styles/theme.css`：替换现有泳道样式

找到 `.lane`、`.lane-label`、`.lane-note-box` 这组规则，用以下内容替换。节点样式 `.node` 及其后续规则保持不动。

```css
.lane {
  position: absolute;
  left: 12px;
  width: calc(var(--page-w) - 24px);
  background: var(--c-lane);
  border: 1px solid var(--c-line);
  border-radius: 8px;
}
.lane.tone-biz { background: #f0f6ff; border-color: #d6e5fa; }
.lane.tone-ai { background: #f5f1ff; border-color: #e2d7ff; }
.lane.tone-base { background: #f5f6f8; border-color: #e0e4e9; }
.lane.tone-data { background: #effaf4; border-color: #cfefdc; }
.lane.tone-mid { background: #f5f1ff; border-color: #e2d7ff; }

.lane-rail {
  position: absolute;
  left: 12px;
  width: 118px; /* 必须与 FLOW.LABEL_BAND 一致 */
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid var(--c-line);
  border-right-color: #c9d5e5;
  border-radius: 8px 0 0 8px;
  z-index: 3;
  pointer-events: none;
}
.lane-rail.tone-biz { background: #e4efff; border-color: #c5dafb; }
.lane-rail.tone-ai { background: #eae3ff; border-color: #d2c4ff; }
.lane-rail.tone-base { background: #e9edf2; border-color: #d5dce5; }
.lane-rail.tone-data { background: #ddf6e8; border-color: #b8e8cd; }
.lane-rail.tone-mid { background: #eae3ff; border-color: #d2c4ff; }

.lane-rail-copy {
  width: 78px;
  flex: 0 0 78px;
}
.lane-label {
  position: static;
  width: 78px;
  max-width: 78px;
  transform: none;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--c-ink);
  font-size: 12px;
  line-height: 1.4;
  font-weight: 800;
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
}
.lane-note-box {
  position: static;
  width: 78px;
  margin-top: 6px;
  color: var(--c-gray);
  font-size: 10px;
  line-height: 1.38;
  font-weight: 600;
  text-align: left;
  overflow-wrap: anywhere;
}
```

注意：`LaneBand` 的泳道背景先绘制，节点随后绘制；保持 `.node` 的 `z-index: 3`，并确保 `.arrows` 继续位于节点下方、`.lab` 位于节点上方。

## 4. `scripts/auto-layout.ts`：完整替换 `choosePins`

现有代码对所有跨泳道边都固定选上下端口，而且没有读取 `fromSide` / `toSide`。替换 `routeAllEdges()` 中的 `choosePins` 函数为下面的版本。默认端口根据实际节点中心点的 dx/dy 选择；配置显式声明的端口优先。

```ts
const PIN_BY_SIDE: Record<string, number> = {
  top: PIN_TOP,
  bottom: PIN_BOTTOM,
  left: PIN_LEFT,
  right: PIN_RIGHT,
};

const choosePins = (e: RawEdge): { srcPin: number; tgtPin: number } => {
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

  let automatic: { srcPin: number; tgtPin: number };
  if (verticalPreferred) {
    automatic = dy >= 0
      ? { srcPin: PIN_BOTTOM, tgtPin: PIN_TOP }
      : { srcPin: PIN_TOP, tgtPin: PIN_BOTTOM };
  } else {
    automatic = dx >= 0
      ? { srcPin: PIN_RIGHT, tgtPin: PIN_LEFT }
      : { srcPin: PIN_LEFT, tgtPin: PIN_RIGHT };
  }

  // 显式侧边只覆盖对应一端；另一端仍可使用自动推断。
  return {
    srcPin: e.fromSide ? (PIN_BY_SIDE[e.fromSide] ?? automatic.srcPin) : automatic.srcPin,
    tgtPin: e.toSide ? (PIN_BY_SIDE[e.toSide] ?? automatic.tgtPin) : automatic.tgtPin,
  };
};
```

`EdgeLayer.tsx` 无须重新布线：它已经优先消费 `edge.route` 并将其渲染为 SVG 路径。不要在 React 渲染阶段再执行一套坐标算法，否则会和构建期路由结果漂移。

## 5. `scenarios/ai-recommend.json`：加宽节点，而不是手写坐标

只改节点的 `w`，不要手动改 `x`、`y`、`h`、`route`、`labelAt`。这些都是构建期生成值。

| 节点 ID                                        | 建议宽度`w` |
| ---------------------------------------------- | ------------: |
| `r12`                                        |           180 |
| `e1`、`e2`、`e3`、`e4`、`e5`         |           166 |
| `r3`、`fb`、`st`                         |           166 |
| `d1`、`d2`、`d3`、`d4`                 |           150 |
| `g1`、`g2`、`g3`、`g4`、`g5`         |           130 |
| `i1`、`i2`、`i3`、`i4`、`i5`、`i6` |           115 |

这组尺寸与当前 1360px 逻辑画布匹配：可用节点区域是 1218px，六列最大宽度总和是 `180 + 5 × 166 = 1010px`，均匀分配后的列间距为 `floor((1218 - 1010) / 5) = 41px`，不会超过右侧内容边界，也给连线保留了走廊。构建脚本会按新宽度重新预测节点高度，并重新生成坐标、路线和标签位置。

## 6. 在 `scripts/validate.ts` 添加自动布局几何校验

在文件顶部增加导入：

```ts
import { scenarioConfigSchema, type ScenarioConfig } from "../src/schema/scenario";
import { NODE_DEFAULT_H } from "../src/flow/tokens";
```

在主循环前增加以下函数：

```ts
function validateLayoutGeometry(cfg: ScenarioConfig, source: string): Issue[] {
  const { flow } = cfg;
  if (!flow.autoLayout) return [];

  const issues: Issue[] = [];
  const fail = (where: string, message: string) =>
    issues.push({ level: "error", where: `${source} · ${where}`, message });
  const warn = (where: string, message: string) =>
    issues.push({ level: "warn", where: `${source} · ${where}`, message });
  const boxes = flow.nodes.map(n => ({
    n,
    x: n.x,
    y: n.y,
    w: n.w,
    h: n.h ?? NODE_DEFAULT_H[n.kind],
  }));
  const byId = new Map(boxes.map(b => [b.n.id, b]));
  const eps = 1;
  const near = (a: number, b: number) => Math.abs(a - b) <= 2;

  // 节点必须落在画布内，并完整落在它声明的泳道内。
  for (const b of boxes) {
    const laneIndex = b.n.laneIndex;
    const lane = laneIndex == null ? undefined : flow.lanes[laneIndex];
    if (!lane) {
      fail(`节点 ${b.n.id}`, `laneIndex=${laneIndex} 不存在`);
      continue;
    }
    if (b.x < 0 || b.y < 0 || b.x + b.w > flow.width + eps || b.y + b.h > flow.height + eps) {
      fail(`节点 ${b.n.id}`, "节点矩形超出画布边界");
    }
    if (b.y < lane.top - eps || b.y + b.h > lane.top + lane.height + eps) {
      fail(`节点 ${b.n.id}`, `节点矩形超出泳道「${lane.label}」`);
    }
  }

  // 任意两个节点不可重叠。
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (overlapX > eps && overlapY > eps) {
        fail(`节点 ${a.n.id}/${b.n.id}`, "两个节点矩形发生重叠");
      }
    }
  }

  const onBoundary = (p: [number, number], b: typeof boxes[number]) => {
    const [x, y] = p;
    const onVertical = (near(x, b.x) || near(x, b.x + b.w)) && y >= b.y - 2 && y <= b.y + b.h + 2;
    const onHorizontal = (near(y, b.y) || near(y, b.y + b.h)) && x >= b.x - 2 && x <= b.x + b.w + 2;
    return onVertical || onHorizontal;
  };

  const segmentHitsBox = (
    a: [number, number], b: [number, number], box: typeof boxes[number],
  ) => {
    const [x1, y1] = a, [x2, y2] = b;
    if (Math.abs(y1 - y2) <= eps) {
      const y = (y1 + y2) / 2;
      return y > box.y + eps && y < box.y + box.h - eps &&
        Math.max(x1, x2) > box.x + eps && Math.min(x1, x2) < box.x + box.w - eps;
    }
    if (Math.abs(x1 - x2) <= eps) {
      const x = (x1 + x2) / 2;
      return x > box.x + eps && x < box.x + box.w - eps &&
        Math.max(y1, y2) > box.y + eps && Math.min(y1, y2) < box.y + box.h - eps;
    }
    return false;
  };

  for (const edge of flow.edges) {
    const route = edge.route;
    const src = byId.get(edge.from), dst = byId.get(edge.to);
    if (!src || !dst) continue; // 引用完整性由 validateConfig 处理
    if (!route || route.length < 2) {
      fail(`边 ${edge.from}→${edge.to}`, "缺少构建期正交路线");
      continue;
    }
    if (!onBoundary(route[0], src)) {
      fail(`边 ${edge.from}→${edge.to}`, "起点没有落在源节点边界上");
    }
    if (!onBoundary(route[route.length - 1], dst)) {
      fail(`边 ${edge.from}→${edge.to}`, "终点没有落在目标节点边界上");
    }
    for (let i = 1; i < route.length; i++) {
      const a = route[i - 1], b = route[i];
      if (Math.abs(a[0] - b[0]) > eps && Math.abs(a[1] - b[1]) > eps) {
        fail(`边 ${edge.from}→${edge.to}`, `第 ${i} 段不是正交线段`);
        continue;
      }
      for (const box of boxes) {
        if (segmentHitsBox(a, b, box)) {
          fail(`边 ${edge.from}→${edge.to}`, `路线穿过节点 ${box.n.id}`);
          break;
        }
      }
    }

    // 标签碰撞先作为 warning，避免字体度量差异导致正常构建被误拦截。
    if (edge.label && edge.labelAt) {
      const width = [...edge.label].reduce((sum, ch) => sum + ((ch.codePointAt(0) ?? 0) > 255 ? 12 : 7), 12);
      const [x, y] = edge.labelAt;
      const hit = boxes.find(b => x < b.x + b.w + 6 && x + width > b.x - 6 &&
        y < b.y + b.h + 6 && y + 18 > b.y - 6);
      if (hit) warn(`边 ${edge.from}→${edge.to}`, `标签「${edge.label}」可能与节点 ${hit.n.id} 重叠`);
    }
  }
  return issues;
}
```

在现有主循环中，紧接 `const issues = validateConfig(raw, file);` 添加：

```ts
const parsed = scenarioConfigSchema.safeParse(raw);
if (parsed.success) issues.push(...validateLayoutGeometry(parsed.data, file));
```

## 7. 本地重新生成及验证

从 `scenario-demo-hub/` 目录执行：

```bash
npm run layout
npm run validate
npm run build
```

`npm run build` 已包含布局生成和配置校验。检查结果时，先确认 AI 推荐主流程节点从左到右排列、泳道标题位于左侧色带、跨层输入使用正交折线、路线不穿过其他节点，再以浏览器 1360px 左右的画布宽度检查文字换行。不要直接编辑 `dist/index.html`，应由构建产物更新它。
