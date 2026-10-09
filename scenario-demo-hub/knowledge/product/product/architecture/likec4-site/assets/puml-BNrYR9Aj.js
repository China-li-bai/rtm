var e=e=>{switch(e){case`index`:return`@startuml
title "三层泳道全景（点击任意元素下钻）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerTech>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<LayerApp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<LayerBiz>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==技术层 · 基础设施" <<LayerTech>> as LayerTech
rectangle "==应用层 · 三大中台" <<LayerApp>> as LayerApp
rectangle "==业务层 · 场景与业务能力" <<LayerBiz>> as LayerBiz

LayerApp .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerTech .[#8D8D8D,thickness=2].> LayerApp : <color:#8D8D8D>[...]
@enduml
`;case`view_1iyeq5w`:return`@startuml
title "AI 商品中台 · 把货变标准 · 组件视图"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerAppPlatProductCOMP_01>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_02>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_03>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_04>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_05>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_06>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_07>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatProductCOMP_08>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerBiz>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "AI 商品中台 · 把货变标准" <<LayerAppPlatProduct>> as LayerAppPlatProduct {
  skinparam RectangleBorderColor<<LayerAppPlatProduct>> #3b82f6
  skinparam RectangleFontColor<<LayerAppPlatProduct>> #3b82f6
  skinparam RectangleBorderStyle<<LayerAppPlatProduct>> dashed

  rectangle "==COMP-01 AIP-001-002-商品库管理" <<LayerAppPlatProductCOMP_01>> as LayerAppPlatProductCOMP_01
  rectangle "==COMP-02 类目治理智能体产品文档" <<LayerAppPlatProductCOMP_02>> as LayerAppPlatProductCOMP_02
  rectangle "==COMP-03 ATTRIBUTE_EXTRACTION_PRD" <<LayerAppPlatProductCOMP_03>> as LayerAppPlatProductCOMP_03
  rectangle "==COMP-04 AIP-007-商品图文审核" <<LayerAppPlatProductCOMP_04>> as LayerAppPlatProductCOMP_04
  rectangle "==COMP-05 AIP-008-描述规范性校验" <<LayerAppPlatProductCOMP_05>> as LayerAppPlatProductCOMP_05
  rectangle "==COMP-06 AIP-010-同款精确匹配" <<LayerAppPlatProductCOMP_06>> as LayerAppPlatProductCOMP_06
  rectangle "==COMP-07 AIP-011-SEO标题生成" <<LayerAppPlatProductCOMP_07>> as LayerAppPlatProductCOMP_07
  rectangle "==COMP-08 AIP-014-集采合规管控" <<LayerAppPlatProductCOMP_08>> as LayerAppPlatProductCOMP_08
}
rectangle "==业务层 · 场景与业务能力" <<LayerBiz>> as LayerBiz

LayerAppPlatProductCOMP_01 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_02 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_03 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_04 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_05 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_06 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_07 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatProductCOMP_08 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
@enduml
`;case`view_ssxrxu`:return`@startuml
title "AI 搜索中台 · 让人找到货 · 组件视图"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerAppPlatSearchCOMP_09>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatSearchCOMP_10>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatSearchCOMP_11>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatSearchCOMP_12>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatSearchCOMP_13>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatSearchCOMP_14>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatSearchCOMP_15>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerBiz>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "AI 搜索中台 · 让人找到货" <<LayerAppPlatSearch>> as LayerAppPlatSearch {
  skinparam RectangleBorderColor<<LayerAppPlatSearch>> #3b82f6
  skinparam RectangleFontColor<<LayerAppPlatSearch>> #3b82f6
  skinparam RectangleBorderStyle<<LayerAppPlatSearch>> dashed

  rectangle "==COMP-09 AIP-015-语义检索与Query理解" <<LayerAppPlatSearchCOMP_09>> as LayerAppPlatSearchCOMP_09
  rectangle "==COMP-10 AIP-016-017-输入补全与智能纠错" <<LayerAppPlatSearchCOMP_10>> as LayerAppPlatSearchCOMP_10
  rectangle "==COMP-11 AIP-018-020-筛选面板与属性聚合" <<LayerAppPlatSearchCOMP_11>> as LayerAppPlatSearchCOMP_11
  rectangle "==COMP-12 AIP-021-多维排序" <<LayerAppPlatSearchCOMP_12>> as LayerAppPlatSearchCOMP_12
  rectangle "==COMP-13 AIP-022-023-类目品牌推荐" <<LayerAppPlatSearchCOMP_13>> as LayerAppPlatSearchCOMP_13
  rectangle "==COMP-14 AIP-024-028-AI对话导购" <<LayerAppPlatSearchCOMP_14>> as LayerAppPlatSearchCOMP_14
  rectangle "==COMP-15 AIP-029-031-AI猜你喜欢" <<LayerAppPlatSearchCOMP_15>> as LayerAppPlatSearchCOMP_15
}
rectangle "==业务层 · 场景与业务能力" <<LayerBiz>> as LayerBiz

LayerAppPlatSearchCOMP_09 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatSearchCOMP_10 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatSearchCOMP_11 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatSearchCOMP_12 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatSearchCOMP_13 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatSearchCOMP_14 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatSearchCOMP_15 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
@enduml
`;case`view_6xr5j4`:return`@startuml
title "AI 客服中台 · 守护成交 · 组件视图"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerAppPlatServiceCOMP_16>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatServiceCOMP_17>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatServiceCOMP_18>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerAppPlatServiceCOMP_19>>{
  BackgroundColor #64748b
  FontColor #f8fafc
  BorderColor #475569
}
skinparam rectangle<<LayerBiz>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "AI 客服中台 · 守护成交" <<LayerAppPlatService>> as LayerAppPlatService {
  skinparam RectangleBorderColor<<LayerAppPlatService>> #3b82f6
  skinparam RectangleFontColor<<LayerAppPlatService>> #3b82f6
  skinparam RectangleBorderStyle<<LayerAppPlatService>> dashed

  rectangle "==COMP-16 AICS-001-009-双通道在线客服底座" <<LayerAppPlatServiceCOMP_16>> as LayerAppPlatServiceCOMP_16
  rectangle "==COMP-17 AICS-010-015-人工接待" <<LayerAppPlatServiceCOMP_17>> as LayerAppPlatServiceCOMP_17
  rectangle "==COMP-18 AICS-016-025-智能体接待" <<LayerAppPlatServiceCOMP_18>> as LayerAppPlatServiceCOMP_18
  rectangle "==COMP-19 AICS-026-029-基础设置与报表" <<LayerAppPlatServiceCOMP_19>> as LayerAppPlatServiceCOMP_19
}
rectangle "==业务层 · 场景与业务能力" <<LayerBiz>> as LayerBiz

LayerAppPlatServiceCOMP_16 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatServiceCOMP_17 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatServiceCOMP_18 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
LayerAppPlatServiceCOMP_19 .[#8D8D8D,thickness=2].> LayerBiz : <color:#8D8D8D>实现
@enduml
`;case`view_1gd4uha`:return`@startuml
title "S-01 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_001_002>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_003_004>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_005_006>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_007>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_008>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_009>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_010>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_011>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_012>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_013>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_01>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-001-002 商品库管理" <<LayerBizAIP_001_002>> as LayerBizAIP_001_002
rectangle "==AIP-003-004 类目治理" <<LayerBizAIP_003_004>> as LayerBizAIP_003_004
rectangle "==AIP-005-006 属性治理" <<LayerBizAIP_005_006>> as LayerBizAIP_005_006
rectangle "==AIP-007 商品图文审核" <<LayerBizAIP_007>> as LayerBizAIP_007
rectangle "==AIP-008 描述规范性校验" <<LayerBizAIP_008>> as LayerBizAIP_008
rectangle "==AIP-009 审核结果分类展示" <<LayerBizAIP_009>> as LayerBizAIP_009
rectangle "==AIP-010 同款精确匹配" <<LayerBizAIP_010>> as LayerBizAIP_010
rectangle "==AIP-011 SEO 标题生成" <<LayerBizAIP_011>> as LayerBizAIP_011
rectangle "==AIP-012 属性自动提取" <<LayerBizAIP_012>> as LayerBizAIP_012
rectangle "==AIP-013 属性合理性检测" <<LayerBizAIP_013>> as LayerBizAIP_013
rectangle "==S-01 供应商推品上架" <<LayerBizS_01>> as LayerBizS_01

LayerBizAIP_001_002 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_003_004 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_005_006 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_007 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_008 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_009 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_010 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_011 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_012 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
LayerBizAIP_013 .[#8D8D8D,thickness=2].> LayerBizS_01 : <color:#8D8D8D>满足
@enduml
`;case`view_jert70`:return`@startuml
title "S-02 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_015>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_024_028>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_029_031>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_02>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-015 智能分词与语义理解" <<LayerBizAIP_015>> as LayerBizAIP_015
rectangle "==AIP-024-028 AI 对话导购" <<LayerBizAIP_024_028>> as LayerBizAIP_024_028
rectangle "==AIP-029-031 AI 猜你喜欢" <<LayerBizAIP_029_031>> as LayerBizAIP_029_031
rectangle "==S-02 自然语言找货下单" <<LayerBizS_02>> as LayerBizS_02

LayerBizAIP_015 .[#8D8D8D,thickness=2].> LayerBizS_02 : <color:#8D8D8D>满足
LayerBizAIP_024_028 .[#8D8D8D,thickness=2].> LayerBizS_02 : <color:#8D8D8D>满足
LayerBizAIP_029_031 .[#8D8D8D,thickness=2].> LayerBizS_02 : <color:#8D8D8D>满足
@enduml
`;case`view_4s0pxq`:return`@startuml
title "S-03 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_010>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_011>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_015>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_016_017>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_018_020>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_021>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_022_023>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_029_031>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_03>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-010 同款精确匹配" <<LayerBizAIP_010>> as LayerBizAIP_010
rectangle "==AIP-011 SEO 标题生成" <<LayerBizAIP_011>> as LayerBizAIP_011
rectangle "==AIP-015 智能分词与语义理解" <<LayerBizAIP_015>> as LayerBizAIP_015
rectangle "==AIP-016-017 输入补全与智能纠错" <<LayerBizAIP_016_017>> as LayerBizAIP_016_017
rectangle "==AIP-018-020 类目品牌筛选与属性聚合" <<LayerBizAIP_018_020>> as LayerBizAIP_018_020
rectangle "==AIP-021 多维度排序" <<LayerBizAIP_021>> as LayerBizAIP_021
rectangle "==AIP-022-023 类目与品牌自动推荐" <<LayerBizAIP_022_023>> as LayerBizAIP_022_023
rectangle "==AIP-029-031 AI 猜你喜欢" <<LayerBizAIP_029_031>> as LayerBizAIP_029_031
rectangle "==S-03 关键词搜索比选" <<LayerBizS_03>> as LayerBizS_03

LayerBizAIP_010 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_011 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_015 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_016_017 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_018_020 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_021 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_022_023 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
LayerBizAIP_029_031 .[#8D8D8D,thickness=2].> LayerBizS_03 : <color:#8D8D8D>满足
@enduml
`;case`view_16urqmg`:return`@startuml
title "S-04 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAICS_001_009>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_010_015>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_016_017>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_018_019>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_020_023>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_04>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AICS-001-009 在线客服底座" <<LayerBizAICS_001_009>> as LayerBizAICS_001_009
rectangle "==AICS-010-015 人工接待" <<LayerBizAICS_010_015>> as LayerBizAICS_010_015
rectangle "==AICS-016-017 意图识别与转接" <<LayerBizAICS_016_017>> as LayerBizAICS_016_017
rectangle "==AICS-018-019 智能体业务应答" <<LayerBizAICS_018_019>> as LayerBizAICS_018_019
rectangle "==AICS-020-023 知识库管理" <<LayerBizAICS_020_023>> as LayerBizAICS_020_023
rectangle "==S-04 客服咨询即答" <<LayerBizS_04>> as LayerBizS_04

LayerBizAICS_001_009 .[#8D8D8D,thickness=2].> LayerBizS_04 : <color:#8D8D8D>满足
LayerBizAICS_010_015 .[#8D8D8D,thickness=2].> LayerBizS_04 : <color:#8D8D8D>满足
LayerBizAICS_016_017 .[#8D8D8D,thickness=2].> LayerBizS_04 : <color:#8D8D8D>满足
LayerBizAICS_018_019 .[#8D8D8D,thickness=2].> LayerBizS_04 : <color:#8D8D8D>满足
LayerBizAICS_020_023 .[#8D8D8D,thickness=2].> LayerBizS_04 : <color:#8D8D8D>满足
@enduml
`;case`view_tzcksm`:return`@startuml
title "S-05 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAICS_001_009>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_010_015>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_016_017>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_05>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AICS-001-009 在线客服底座" <<LayerBizAICS_001_009>> as LayerBizAICS_001_009
rectangle "==AICS-010-015 人工接待" <<LayerBizAICS_010_015>> as LayerBizAICS_010_015
rectangle "==AICS-016-017 意图识别与转接" <<LayerBizAICS_016_017>> as LayerBizAICS_016_017
rectangle "==S-05 售后与转人工" <<LayerBizS_05>> as LayerBizS_05

LayerBizAICS_001_009 .[#8D8D8D,thickness=2].> LayerBizS_05 : <color:#8D8D8D>满足
LayerBizAICS_010_015 .[#8D8D8D,thickness=2].> LayerBizS_05 : <color:#8D8D8D>满足
LayerBizAICS_016_017 .[#8D8D8D,thickness=2].> LayerBizS_05 : <color:#8D8D8D>满足
@enduml
`;case`view_1w23lhg`:return`@startuml
title "S-06 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_014>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_06>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-014 集采合规管控" <<LayerBizAIP_014>> as LayerBizAIP_014
rectangle "==S-06 集采专区合规采买" <<LayerBizS_06>> as LayerBizS_06

LayerBizAIP_014 .[#8D8D8D,thickness=2].> LayerBizS_06 : <color:#8D8D8D>满足
@enduml
`;case`view_16z2nwd`:return`@startuml
title "S-07 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_001_002>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_003_004>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_005_006>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_008>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_010>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_012>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_013>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_07>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-001-002 商品库管理" <<LayerBizAIP_001_002>> as LayerBizAIP_001_002
rectangle "==AIP-003-004 类目治理" <<LayerBizAIP_003_004>> as LayerBizAIP_003_004
rectangle "==AIP-005-006 属性治理" <<LayerBizAIP_005_006>> as LayerBizAIP_005_006
rectangle "==AIP-008 描述规范性校验" <<LayerBizAIP_008>> as LayerBizAIP_008
rectangle "==AIP-010 同款精确匹配" <<LayerBizAIP_010>> as LayerBizAIP_010
rectangle "==AIP-012 属性自动提取" <<LayerBizAIP_012>> as LayerBizAIP_012
rectangle "==AIP-013 属性合理性检测" <<LayerBizAIP_013>> as LayerBizAIP_013
rectangle "==S-07 存量商品清洗治理" <<LayerBizS_07>> as LayerBizS_07

LayerBizAIP_001_002 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
LayerBizAIP_003_004 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
LayerBizAIP_005_006 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
LayerBizAIP_008 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
LayerBizAIP_010 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
LayerBizAIP_012 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
LayerBizAIP_013 .[#8D8D8D,thickness=2].> LayerBizS_07 : <color:#8D8D8D>满足
@enduml
`;case`view_118uz77`:return`@startuml
title "S-08 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_021>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_022_023>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_029_031>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_020_023>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_08>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-021 多维度排序" <<LayerBizAIP_021>> as LayerBizAIP_021
rectangle "==AIP-022-023 类目与品牌自动推荐" <<LayerBizAIP_022_023>> as LayerBizAIP_022_023
rectangle "==AIP-029-031 AI 猜你喜欢" <<LayerBizAIP_029_031>> as LayerBizAIP_029_031
rectangle "==AICS-020-023 知识库管理" <<LayerBizAICS_020_023>> as LayerBizAICS_020_023
rectangle "==S-08 数据飞轮持续优化" <<LayerBizS_08>> as LayerBizS_08

LayerBizAIP_021 .[#8D8D8D,thickness=2].> LayerBizS_08 : <color:#8D8D8D>满足
LayerBizAIP_022_023 .[#8D8D8D,thickness=2].> LayerBizS_08 : <color:#8D8D8D>满足
LayerBizAIP_029_031 .[#8D8D8D,thickness=2].> LayerBizS_08 : <color:#8D8D8D>满足
LayerBizAICS_020_023 .[#8D8D8D,thickness=2].> LayerBizS_08 : <color:#8D8D8D>满足
@enduml
`;case`view_apzddd`:return`@startuml
title "S-09 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAIP_007>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAIP_009>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_09>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AIP-007 商品图文审核" <<LayerBizAIP_007>> as LayerBizAIP_007
rectangle "==AIP-009 审核结果分类展示" <<LayerBizAIP_009>> as LayerBizAIP_009
rectangle "==S-09 审核运营与供应商协同" <<LayerBizS_09>> as LayerBizS_09

LayerBizAIP_007 .[#8D8D8D,thickness=2].> LayerBizS_09 : <color:#8D8D8D>满足
LayerBizAIP_009 .[#8D8D8D,thickness=2].> LayerBizS_09 : <color:#8D8D8D>满足
@enduml
`;case`view_xejlug`:return`@startuml
title "S-10 追溯链（能力→组件→锚点）"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<LayerBizAICS_024_025>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_026_028>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizAICS_029>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
skinparam rectangle<<LayerBizS_10>>{
  BackgroundColor #0284c7
  FontColor #f0f9ff
  BorderColor #0369a1
}
rectangle "==AICS-024-025 智能客服维护" <<LayerBizAICS_024_025>> as LayerBizAICS_024_025
rectangle "==AICS-026-028 基础设置" <<LayerBizAICS_026_028>> as LayerBizAICS_026_028
rectangle "==AICS-029 报表分析" <<LayerBizAICS_029>> as LayerBizAICS_029
rectangle "==S-10 客服运营管理" <<LayerBizS_10>> as LayerBizS_10

LayerBizAICS_024_025 .[#8D8D8D,thickness=2].> LayerBizS_10 : <color:#8D8D8D>满足
LayerBizAICS_026_028 .[#8D8D8D,thickness=2].> LayerBizS_10 : <color:#8D8D8D>满足
LayerBizAICS_029 .[#8D8D8D,thickness=2].> LayerBizS_10 : <color:#8D8D8D>满足
@enduml
`;default:throw Error(`Unknown viewId: `+e)}};export{e as pumlSource};