import type { ScenarioConfig } from "../../schema/scenario";

type Lane = ScenarioConfig["flow"]["lanes"][number];

interface Props {
  lane: Lane;
}

/**
 * 泳道背景带 + 层名药丸 + 注释框。
 * 泳道名居中于药丸（识别锚点），note 以整条标签带宽度独占药丸下方，
 * 不再挤在药丸内——药丸保持紧凑，注释拿到 ~118px 全带宽更易读。
 */
export function LaneBand({ lane }: Props) {
  const mid = lane.top + lane.height / 2;
  return (
    <>
      <div
        className={`lane${lane.tone ? ` tone-${lane.tone}` : ""}`}
        style={{ top: lane.top, height: lane.height }}
      />
      <div className="lane-label" style={{ top: mid }}>{lane.label}</div>
      {lane.note && (
        <div className="lane-note-box" style={{ top: mid + 16 }}>{lane.note}</div>
      )}
    </>
  );
}
