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
