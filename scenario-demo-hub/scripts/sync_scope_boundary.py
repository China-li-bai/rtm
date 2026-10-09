"""同步演示场景配置到方案 1.5 建设范围边界。

依据（三方一致实测）：
  SOW 合同 + 00-功能点总索引.md + AI专项方案v2.docx 均确认 AIP-020 = 属性聚合筛选；
  「AI 对账/三单匹配」不在任何功能清单内，权威 model.yaml 也从未登记该能力。
  → a6 不是「砍能力」，而是清除一处偏离 SSoT 的口径污染。

动作：
  1) overall-flow a6：AI 服务节点 → dashed 边界说明牌（去 aip 角标，挂约束 C3）
  2) overall-flow a6→b07 灰虚线边删除（该线语义=「AI 向上服务业务」，已不成立）
  3) b07：措辞去 AI 化（机器核对 → 规则引擎/系统核对；OCR 降级为字段缺失挂起）
  4) ai-service v02：对账开票意图明确「只答政策与进度，不做金额核对」
"""
import json

P_OF = "scenarios/overall-flow.json"
P_SV = "scenarios/ai-service.json"


def load(p):
    return json.load(open(p, encoding="utf8"))


def dump(p, obj):
    open(p, "w", encoding="utf8").write(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")


# ─────────── overall-flow ───────────
of = load(P_OF)
f = of["flow"]

a6 = next(n for n in f["nodes"] if n["id"] == "a6")
a6.clear()
a6.update({
    "id": "a6",
    "title": "对账不由 AI 承担",
    "sub": "规则判定<br>系统直连解决",
    "kind": "boundary",
    "panelTitle": "履约对账 · 范围边界（非 AI）",
    "panelAip": "SHOP 履约域 + 底座规则引擎",
    "aip": "非 AI 域",
    "laneIndex": 3,
    "col": 6,
    "w": 117,
    "solves": [{
        "ref": "C3",
        "how": "金额与数量核对交给规则引擎可全量留痕审计，不让大模型介入对账——从源头消除幻觉导致的资损与审计风险",
    }],
    "legacy": "两头翻单人工核对：PO／收货单／发票靠人眼比对，周期以周计，差异靠电话对齐。",
    "whyAi": "这一环刻意不用 AI：三单匹配是确定性校验，规则引擎可完全覆盖；AI 介入只会引入幻觉与资损敞口，"
             "逐单调用更与「按次收费」的成本约束正面冲突（方案 1.5 建设范围边界）。",
    "ai": "AI 不介入对账判定。本环节由商城系统的单据直连 + 底座规则引擎完成：PO ↔ 收货单 ↔ 发票自动比对，"
          "不一致项标注后转人工处理例外；只有对账相关的<b>咨询问答</b>由 AI 客服承接（AICS-018/019）。",
    "process": [
        "订单／收货单／发票经系统单据直连入库（不做 OCR 识别）",
        "规则引擎三单自动比对：数量、金额、税率逐项校验",
        "不一致项自动标注 → 财务只处理例外",
    ],
    "highlights": [
        "边界即交付：能规则判的不交给 AI，是本方案可信度的来源",
        "SOW 已把「对账计算」列为平台辅助功能，属商城系统升级范围",
        "斜纹位不是缺口：该位置显式声明「非 AI 域」，与相邻 AIP 编号同位对照",
    ],
    "beforeAfter": [],
    "humanRole": "财务只看规则标注的异常件；AI 团队在此零投入，人力转向语义类场景。",
    "risks": [
        {"risk": "业务方要求「也挂个 AI 显得智能」，把确定性校验包装成 AI 能力写进汇报",
         "guard": "以方案 1.5 边界裁决：改成展示规则引擎的留痕与可回放——可审计性本身就是卖点，不需要 AI 标签"},
        {"risk": "大模型一旦介入金额核对，幻觉错误直接进财务链路且难以事后察觉",
         "guard": "本环节 AI 零调用；判定全部走规则，异常件挂起转人工，绝不自动放行"},
        {"risk": "单据 OCR 成本下降后，「对账 AI 化」会被重新提出",
         "guard": "不默认纳入：须先补 SOW 功能点与产品需求卡，并证明相对规则引擎有增量收益，再进需求评审会"},
    ],
    "fallback": "单据字段缺失或匹配异常→批次挂起报警（导入对账 fail-loud），不猜不吞。",
    "metrics": [{"m": "对账周期", "v": "系统自动核对当日完成（设计口径）"}],
    "trace": ["SOW 履约域", "底座规则引擎", "非 AI 专项范围"],
    "x": 1072,
    "y": 519,
    "h": 90,
})

before = len(f["edges"])
f["edges"] = [e for e in f["edges"] if not (e.get("from") == "a6" and e.get("to") == "b07")]
print(f"删除 a6→b07 边: {before - len(f['edges'])} 条")

b07 = next(n for n in f["nodes"] if n["id"] == "b07")
b07["ai"] = ("这一环没有 AI 服务层支撑：订单／收货单／发票三单匹配是确定性校验，由商城系统单据直连与底座规则引擎执行"
             "（SOW 已将「对账计算」定位为平台辅助功能，不在 AIP／AICS 清单）；对账相关的咨询问答才走 AI 客服。")
b07["solves"][0]["how"] = "对账从纯人工翻单变例外处理（由系统直连＋规则引擎解决，非 AI 能力）"
b07["fallback"] = "单据字段缺失或匹配异常→批次挂起报警并转人工，不猜不吞。"
b07["highlights"] = [x.replace("机器核对", "系统核对") for x in b07["highlights"]]
for m in b07["metrics"]:
    m["v"] = m["v"].replace("机器核对", "系统核对")
for r in b07["beforeAfter"]:
    r["after"] = r["after"].replace("机器自动核对", "规则引擎自动核对")
# 详情面板前后对比表头固定为「使用 AI 前 / 使用 AI 后」：非 AI 环节不得启用该表，
# 否则把系统改造收益冒充成 AI 收益。收益统一走 metrics。
b07["beforeAfter"] = []

# 页级叙事：修「每个能力都向上服务」的绝对化漏洞（a6 不服务任何东西），
# 并把边界提到第一屏副标题与页尾口径说明——不看节点也能接收到。
of["subtitle"] = (
    "业务在前、AI 在后：八步业务主线从 0 到 1 贯通（供给侧 → 需求侧 → 履约服务），"
    "AI 服务层每个能力向上服务它的上级业务（灰虚线），数据飞轮反哺闭环；"
    "⊘ 斜纹位是刻意不做的边界声明——对账等确定性判定交给规则引擎，不冒充 AI 能力")
if "⊘ 斜纹位" not in of["metricNote"]:  # 幂等保护：避免重跑时重复追加
    of["metricNote"] = of["metricNote"].rstrip("。") + (
        "。⊘ 斜纹位（对账不由 AI 承担）不是遗漏项：AI 只承担规则无法全量覆盖的语义与判断类工作，"
        "凡能被规则或结构化计算确定的一律不用 AI（方案 1.5 建设范围边界）")

dump(P_OF, of)
print("written:", P_OF)

# ─────────── ai-service：对账开票意图的边界 ───────────
sv = load(P_SV)
v02 = next(n for n in sv["flow"]["nodes"] if n["id"] == "v02")
v02["ai"] = (
    "意图识别四类分流：<b>商品咨询 / 订单售后 / 对账开票 / 政策规则</b>；识别带置信度，置信不足走通用接待路径不硬分。"
    "边界：对账开票意图只做<b>问答分流</b>（答政策、口径与进度），金额核对本身由系统规则执行，不在 AI 范围。")
v02["process"][1] = "按意图路由：FAQ / RAG / 订单接口 / 人工（对账开票类只答政策与进度）"
dump(P_SV, sv)
print("written:", P_SV)
