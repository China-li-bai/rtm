/**
 * 连接点分配：一条线用中点；多条线按对端投影就近占空槽。
 * 运行：npx tsx scripts/port-slots.test.ts
 */
import { assignGroupSlots, MID_SLOT, SIDE_SLOTS } from "./auto-layout";

let passed = 0;
let failed = 0;

function expect(name: string, ok: boolean, detail?: unknown): void {
  if (ok) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.error(`  ✘ ${name}`, detail ?? "");
  }
}

function slotOf(edgeId: string, end: "src" | "tgt", claims: Parameters<typeof assignGroupSlots>[0]): number {
  const hit = assignGroupSlots(claims).find((c) => c.edgeId === edgeId && c.end === end);
  if (!hit) throw new Error(`missing ${edgeId}/${end}`);
  return hit.slot;
}

expect("一条线用中点", assignGroupSlots([
  { edgeId: "a", end: "src", ideal: 0.2, direct: false },
])[0].slot === MID_SLOT);

const bothCenter = [
  { edgeId: "main", end: "src" as const, ideal: 0.5, direct: true },
  { edgeId: "back", end: "src" as const, ideal: 0.5, direct: false },
];
expect(
  "能直连的边先占中点",
  slotOf("main", "src", bothCenter) === MID_SLOT &&
    SIDE_SLOTS[slotOf("back", "src", bothCenter)] === 0.35,
);

const spread = [
  { edgeId: "up", end: "tgt" as const, ideal: 0.3, direct: false },
  { edgeId: "down", end: "tgt" as const, ideal: 0.7, direct: false },
];
expect(
  "两条线分别靠近各自对端，不拉到边角",
  SIDE_SLOTS[slotOf("up", "tgt", spread)] === 0.35 &&
    SIDE_SLOTS[slotOf("down", "tgt", spread)] === 0.65,
);

const directOffCenter = [
  { edgeId: "side", end: "src" as const, ideal: 0.8, direct: true },
  { edgeId: "mid", end: "src" as const, ideal: 0.5, direct: false },
];
expect(
  "直连边占自己的最近点，不抢走别人的中点",
  SIDE_SLOTS[slotOf("side", "src", directOffCenter)] === 0.8 &&
    SIDE_SLOTS[slotOf("mid", "src", directOffCenter)] === 0.5,
);

console.log(failed === 0 ? `✓ ${passed} passed` : `✘ ${failed} failed / ${passed} passed`);
if (failed > 0) process.exit(1);
