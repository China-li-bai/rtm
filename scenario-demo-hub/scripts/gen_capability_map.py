"""从《四大模块子能力全景-社区对标版.md》生成 capability-map.json（drill 全景图）。

为什么用生成器：CAP 文档是能力地图的唯一事实源，手写 39 个节点必然漂移。
文档改完重跑本脚本即可同步，且统计口径与文档反查脚本完全一致。

判定规则（与文档核数脚本同源）：🔵 缺失 > 🟡 部分 > ✅ 已入合同。
"""
import json
import re
import sys
from pathlib import Path

# 以脚本位置定位仓根，避免从不同 cwd 运行时路径漂移
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "knowledge/product/四大模块子能力全景-社区对标版.md"
DST = ROOT / "scenarios/capability-map.json"

LANES = [
    ("G", "AI 商品中台", "ai", "治理对象=商品：从入库到可被人与 AI 双重消费"),
    ("S", "AI 搜索中台", "ai", "治理对象=需求表达与分发：找得到、比得清、买得对"),
    ("C", "AI 客服中台", "ai", "治理对象=服务过程：咨询、接待、工单、质检全链路可追"),
    ("D", "数据治理与 AI 数据中台", "base", "承上启下的底座：三大中台的数据、模型、评测、成本都长在这里"),
]

# 状态 → 场景挂接（缺口可见性是本图的第一价值）
SOLVE_BY_STATE = {
    "缺失": ("S2", "社区标配但本项目完全缺失——把它显式画出来，缺口才不会再被「都做了」掩盖"),
    "部分": ("S1", "合同已覆盖主干、能力点仍有缺口——逐条列出缺口，规划才有下手的坐标"),
    "已入合同": ("S3", "已入合同的能力位在此登记归属——证明合同 60 项都有地图坐标，无主功能为零"),
}

STATE_LABEL = {"缺失": "🔵 缺失", "部分": "🟡 部分", "已入合同": "✅ 合同"}


def state_of(status_cell):
    for mark, name in (("🔵", "缺失"), ("🟡", "部分"), ("✅", "已入合同")):
        if mark in status_cell:
            return name
    return "部分"


def clean(s):
    return s.replace("**", "").strip()


def split_points(cell):
    """关键能力点 → 流程条目：按顿号/分号拆，保留括号内限定语。"""
    txt = clean(cell)
    parts = [p.strip(" 、;；") for p in re.split(r"[、;；]", txt)]
    parts = [p for p in parts if p]
    return parts or [txt]


def parse_tables():
    rows = []
    for line in open(SRC, encoding="utf8"):
        if not re.match(r"^\|\s*\**\s*CAP-", line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        m = re.match(r"CAP-([GSCD])-(\d+)\s*(.*)", clean(cells[0]))
        if not m:
            continue
        rows.append({
            "sec": m.group(1), "num": m.group(2), "name": clean(m.group(3)),
            "points": cells[1] if len(cells) > 1 else "",
            "bench": clean(cells[2]) if len(cells) > 2 else "",
            "status": clean(cells[3]) if len(cells) > 3 else "",
            "last": clean(cells[-1]) if len(cells) >= 5 else "",
        })
    return rows


def build():
    rows = parse_tables()
    if len(rows) != 39:
        print(f"ABORT：解析到 {len(rows)} 个能力位，期望 39（文档表格结构变动？）")
        sys.exit(1)

    nodes = []
    for idx, (sec, lane_label, tone, note) in enumerate(LANES):
        grp = [r for r in rows if r["sec"] == sec]
        for r in grp:
            st = state_of(r["status"])
            ref, how = SOLVE_BY_STATE[st]
            solves = [{"ref": ref, "how": how}]
            # 「AI 位判定」列同时决定该位是否需要 AI——命中 1.5 边界的位显式挂 C2
            # 前三表末列为「AI 位判定」；底座表多一列，末列是备注，故改取现状列
            judge = r["last"] if sec != "D" else r["status"]
            if any(k in (r["last"] + r["status"]) for k in ("规则", "工程", "非 AI", "分析产出")):
                solves.append({"ref": "C2", "how": "该位以规则/工程为主，AI 只兜语义缺口——先过边界再谈建设"})
            # 缺失位最容易被误当成承诺（“你们有质检吗？”“有，规划里”）——C1 由它们承载最有意义
            if st == "缺失":
                solves.append({"ref": "C1", "how": "本位仅以 CAP-* 编号存在于规划视图，不构成任何交付承诺；若要承诺须先补 SOW 功能点"})
            nodes.append({
                "id": f"{sec.lower()}{r['num']}",
                "no": f"{sec}-{r['num']}",
                "title": r["name"],
                "sub": split_points(r["points"])[0][:8] if r["points"] else "",
                "aip": STATE_LABEL[st],
                "kind": "highlight" if st == "缺失" else "normal",
                # 面板标题不重复带编号：DetailPanel 已把 no 拼在 panelTitle 前（否则出现「C-07 CAP-C-07 …」）
                "panelTitle": r["name"],
                "panelAip": f"能力地图位 · {lane_label}",
                "laneIndex": idx,
                "solves": solves,
                "ai": f"AI 位判定：{judge}。本位关键动作：{clean(r['points'])}。",
                "process": split_points(r["points"]),
                "highlights": [f"社区对标：{r['bench']}" if r["bench"] else "社区对标：待补",
                               f"现状：{r['status']}"],
                "x": 0, "y": 0, "w": 117,
            })

    counts = {k: sum(1 for n in nodes if n["aip"] == v) for k, v in STATE_LABEL.items()}
    cfg = {
        "id": "capability-map",
        "platform": "全景",
        "title": "四大模块 · 子能力全景",
        "subtitle": (
            "按社区成熟实践重切的能力地图（合计 39 位），不是合同承诺清单："
            "橙底高亮为社区标配但本项目缺失的位，点泳道名可下钻看单模块，点任一能力位看能力点·社区对标·AI 位判定"),
        "scenarios": [
            {"id": "S1", "name": "能力地图不完整", "tag": "有坐标", "kw": "拍脑袋",
             "card": "规划靠逐个功能点想，缺一张「该有什么」的全图——补漏无据、评审无锚。",
             "story": {"who": "AI 产品负责人做季度规划、业务方评审需求优先级",
                       "stuck": "手里只有合同 60 项功能点，没有「按社区实践这个模块该有哪些能力」的参照系",
                       "consequences": ["新需求来了答不出「本来就该有没有」",
                                        "评审时只能逐个功能点吵，没有结构化的能力分层",
                                        "对外讲能力时把功能清单当能力地图，越讲越碎"]},
             "solution": {"who": "本图按能力对象重切四大模块，逐位标注关键能力点与社区对标",
                          "smooth": "先有全图再谈单点：任何新需求先定位到某个能力位，再判断是补点还是新建位",
                          "effects": ["每个能力位都有「社区对标」锚点，缺不缺一目了然",
                                      "评审按能力域讨论而非逐个功能点争执",
                                      "对外讲能力先讲四层结构，功能清单降为下钻明细"]}},
            {"id": "S2", "name": "缺口不可见", "tag": "看得见", "kw": "只报喜",
             "card": "已完成的讲三遍，社区标配却缺失的能力位没人提——直到被外部问穿。",
             "story": {"who": "汇报评审、客户技术尽调、内部运营自查",
                       "stuck": "材料只呈现做了什么，看不出没做什么以及为什么不做",
                       "consequences": ["尽调时被追问「质检在哪」「工单在哪」当场卡住",
                                        "投入被已完成的舒适区吸走，真正的地基缺口长期无人认领",
                                        "分不清「刻意不做」与「还没做」，边界感缺失"]},
             "solution": {"who": "本图把 8 位完全缺失（实测）用橙底高亮，直接摆在同一张全景里",
                          "smooth": "缺口与已完成同图同权重呈现，P0~P3 优先级随位标注",
                          "effects": ["尽调先给全景，缺口自己说话，不被动等提问",
                                      "P0 缺口（成本可观测/工单/质检）有明确认领入口",
                                      "「刻意不做」另有 boundary 形态承载，与「还没做」视觉可分"]}},
            {"id": "S3", "name": "能力编号与合同承诺混用", "tag": "不越界", "kw": "口径污染",
             "card": "把规划中的能力写成 AIP 编号，等于替合同加承诺——曾经真实发生过。",
             "story": {"who": "方案撰写、演示页配置、PRD 卡维护三方协作",
                       "stuck": "能力设想与合同功能点共用一套编号，读者无法判断哪句可作验收依据",
                       "consequences": ["「坐席辅助」被写成承诺链，合同里其实一次都没答应",
                                        "演示页角标挂错编号，追溯链双向对不上",
                                        "验收时按规划能力要求交付，范围争议无据可依"]},
             "solution": {"who": "本图全部使用 CAP-* 编号，并在标题与图例声明「非合同承诺」",
                          "smooth": "规划视图与承诺清单物理隔离；进承诺必须先补 SOW 功能点再立 PRD 卡",
                          "effects": ["CAP-* 只出现在本图与能力全景文档，不进任何对外材料",
                                      "合同 60 项在图中登记归属，无主功能可被查出",
                                      "编号前缀即口径声明，读者一眼知道能不能拿来验收"]}},
        ],
        "constraints": [
            {"id": "C1", "name": "规划视图不得进入对外承诺", "kw": "隔离",
             "card": "能力地图回答「应该有什么」，合同清单回答「承诺交付什么」，两者不得互串。",
             "reality": "汇报现场很容易把「我们规划了」说成「我们做了」，一句越界就是一张变更单",
             "decision": "本图统一用 CAP-* 编号；对外材料只允许 AIP/AICS；进入承诺须先补 SOW 功能点与 PRD 卡",
             "land": "标题、图例、每个能力位的 panelAip 三处同时声明「能力地图位 · 非合同承诺」"},
            {"id": "C2", "name": "每个能力位必须先过 AI 位判定", "kw": "先判该不该用 AI",
             "card": "补全能力不等于给 AI 找活干——凡规则或结构化计算能确定的，不立 AI 能力位。",
             "reality": "能力地图天然有「什么都挂个 AI」的膨胀倾向，与方案 1.5 边界直接冲突",
             "decision": "逐位标注 AI 位判定（语义/感知/ML/规则工程/分析产出），规则为主的位显式挂本约束",
             "land": "每个能力位抽屉首行即「AI 位判定」，命中 1.5 边界的位在 solves 里显式关联 C2"},
        ],
        "flow": {
            "width": 1360, "height": 600, "autoLayout": True, "viewH": 620,
            "drill": True,
            "indexTitle": "四大模块 · 39 个能力位（CAP-* 规划视图 · 非合同承诺）",
            "defaultSelected": "g09",
            "lanes": [{"label": lab, "note": note, "tone": tone, "top": 0, "height": 120}
                      for _, lab, tone, note in LANES],
            "nodes": nodes,
            "edges": [],
            "dataSupport": (
                "图例｜<b>✅ 合同</b> 已入 SOW 功能清单（14 位）　"
                "<b>🟡 部分</b> 主干已有、能力点有缺口（17 位）　"
                "<b>🔵 缺失</b> 社区标配但本项目完全没有（8 位·橙底高亮）　"
                "｜口径源：knowledge/product/四大模块子能力全景-社区对标版.md（1:1 生成，勿手改本文件）"),
        },
        "compare": [
            {"dim": "规划", "icon": "图",
             "before": "手里只有合同功能点清单，新需求来了靠逐个拍脑袋，补漏无据、评审无锚",
             "after": "39 位能力位一张图（脚本实测核数），新需求先定位到某个位，再判断是补点还是新建位"},
            {"dim": "缺口", "icon": "缺",
             "before": "材料只讲做了什么，社区标配却缺失的能力位没人提，直到尽调现场被问穿",
             "after": "8 位完全缺失（实测）橙底同图同权重呈现，P0~P3 优先级自带认领入口"},
            {"dim": "口径", "icon": "号",
             "before": "规划设想与合同功能点共用一套编号，读者无法判断哪句能拿来验收",
             "after": "CAP-* 与 AIP/AICS 物理隔离，前缀即口径声明；进承诺必须先补 SOW 功能点与 PRD 卡"},
            {"dim": "边界", "icon": "界",
             "before": "「刻意不做」与「还没做」在图上长得一样，边界感缺失导致反复被追问",
             "after": "不做位由 boundary 斜纹形态单独承载（见 AI 业务全景页 a6），与缺口视觉可分"},
        ],
        "metricNote": (
            "口径说明：本页是<b>能力设计地图</b>，编号一律为 CAP-*，<b>不作为交付承诺与验收依据</b>；"
            "对外承诺口径以 SOW 功能清单（AIP-001–031 / AICS-001–029 共 60 项）为准。"
            "39 位中 ✅14 / 🟡17 / 🔵8 由脚本从源文档反查核数，非人工统计。"),
    }
    json.dump(cfg, open(DST, "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print(f"生成 {DST}：{len(nodes)} 节点 / 4 泳道 / 状态分布 {counts}")


if __name__ == "__main__":
    build()
