"""守住「履约对账不进商城 AI 全景」。

合同版 SOW：对账结算在四端（运营账单、采购对账、供应商协同），
不在 AIP-001–031 / AICS。AI 全景不画这一环，也不留边界牌。
开票规则和进度仍由智能客服回答，文案在 ai-service 的意图节点里，本脚本不动它。

重跑只做删除：若 b07 / a6 被加回 overall-flow，连同相关边和 chain 引用一起去掉。
"""
import json
from pathlib import Path

P_OF = Path("scenarios/overall-flow.json")
DROP = {"b07", "a6"}


def main() -> None:
    of = json.loads(P_OF.read_text(encoding="utf8"))
    flow = of["flow"]
    before_nodes = len(flow["nodes"])
    flow["nodes"] = [n for n in flow["nodes"] if n["id"] not in DROP]
    flow["chain"] = [i for i in flow["chain"] if i not in DROP]
    flow["edges"] = [
        e for e in flow["edges"] if e.get("from") not in DROP and e.get("to") not in DROP
    ]
    removed = before_nodes - len(flow["nodes"])
    if removed:
        P_OF.write_text(json.dumps(of, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
        print(f"已从 AI 全景去掉 {removed} 个对账节点，请再跑 npm run layout")
    else:
        print("AI 全景没有履约对账节点，无需改写")


if __name__ == "__main__":
    main()
