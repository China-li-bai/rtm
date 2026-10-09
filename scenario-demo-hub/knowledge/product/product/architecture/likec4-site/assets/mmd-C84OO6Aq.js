var e=e=>{switch(e){case`index`:return`---
title: "三层泳道全景（点击任意元素下钻）"
---
graph TB
  LayerTech@{ shape: rectangle, label: "技术层 · 基础设施" }
  LayerApp@{ shape: rectangle, label: "应用层 · 三大中台" }
  LayerBiz@{ shape: rectangle, label: "业务层 · 场景与业务能力" }
  LayerApp -. "\`实现\`" .-> LayerBiz
  LayerTech -. "\`[...]\`" .-> LayerApp
`;case`view_1iyeq5w`:return`---
title: "AI 商品中台 · 把货变标准 · 组件视图"
---
graph TB
  subgraph LayerAppPlatProduct["\`AI 商品中台 · 把货变标准\`"]
    LayerAppPlatProduct.COMP_01@{ shape: rectangle, label: "COMP-01 AIP-001-002-商品库管理" }
    LayerAppPlatProduct.COMP_02@{ shape: rectangle, label: "COMP-02 类目治理智能体产品文档" }
    LayerAppPlatProduct.COMP_03@{ shape: rectangle, label: "COMP-03 ATTRIBUTE_EXTRACTION_PRD" }
    LayerAppPlatProduct.COMP_04@{ shape: rectangle, label: "COMP-04 AIP-007-商品图文审核" }
    LayerAppPlatProduct.COMP_05@{ shape: rectangle, label: "COMP-05 AIP-008-描述规范性校验" }
    LayerAppPlatProduct.COMP_06@{ shape: rectangle, label: "COMP-06 AIP-010-同款精确匹配" }
    LayerAppPlatProduct.COMP_07@{ shape: rectangle, label: "COMP-07 AIP-011-SEO标题生成" }
    LayerAppPlatProduct.COMP_08@{ shape: rectangle, label: "COMP-08 AIP-014-集采合规管控" }
  end
  LayerBiz@{ shape: rectangle, label: "业务层 · 场景与业务能力" }
  LayerAppPlatProduct.COMP_01 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_02 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_03 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_04 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_05 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_06 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_07 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatProduct.COMP_08 -. "\`实现\`" .-> LayerBiz
`;case`view_ssxrxu`:return`---
title: "AI 搜索中台 · 让人找到货 · 组件视图"
---
graph TB
  subgraph LayerAppPlatSearch["\`AI 搜索中台 · 让人找到货\`"]
    LayerAppPlatSearch.COMP_09@{ shape: rectangle, label: "COMP-09 AIP-015-语义检索与Query理解" }
    LayerAppPlatSearch.COMP_10@{ shape: rectangle, label: "COMP-10 AIP-016-017-输入补全与智能纠错" }
    LayerAppPlatSearch.COMP_11@{ shape: rectangle, label: "COMP-11 AIP-018-020-筛选面板与属性聚合" }
    LayerAppPlatSearch.COMP_12@{ shape: rectangle, label: "COMP-12 AIP-021-多维排序" }
    LayerAppPlatSearch.COMP_13@{ shape: rectangle, label: "COMP-13 AIP-022-023-类目品牌推荐" }
    LayerAppPlatSearch.COMP_14@{ shape: rectangle, label: "COMP-14 AIP-024-028-AI对话导购" }
    LayerAppPlatSearch.COMP_15@{ shape: rectangle, label: "COMP-15 AIP-029-031-AI猜你喜欢" }
  end
  LayerBiz@{ shape: rectangle, label: "业务层 · 场景与业务能力" }
  LayerAppPlatSearch.COMP_09 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatSearch.COMP_10 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatSearch.COMP_11 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatSearch.COMP_12 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatSearch.COMP_13 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatSearch.COMP_14 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatSearch.COMP_15 -. "\`实现\`" .-> LayerBiz
`;case`view_6xr5j4`:return`---
title: "AI 客服中台 · 守护成交 · 组件视图"
---
graph TB
  subgraph LayerAppPlatService["\`AI 客服中台 · 守护成交\`"]
    LayerAppPlatService.COMP_16@{ shape: rectangle, label: "COMP-16 AICS-001-009-双通道在线客服底座" }
    LayerAppPlatService.COMP_17@{ shape: rectangle, label: "COMP-17 AICS-010-015-人工接待" }
    LayerAppPlatService.COMP_18@{ shape: rectangle, label: "COMP-18 AICS-016-025-智能体接待" }
    LayerAppPlatService.COMP_19@{ shape: rectangle, label: "COMP-19 AICS-026-029-基础设置与报表" }
  end
  LayerBiz@{ shape: rectangle, label: "业务层 · 场景与业务能力" }
  LayerAppPlatService.COMP_16 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatService.COMP_17 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatService.COMP_18 -. "\`实现\`" .-> LayerBiz
  LayerAppPlatService.COMP_19 -. "\`实现\`" .-> LayerBiz
`;case`view_1gd4uha`:return`---
title: "S-01 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_001_002@{ shape: rectangle, label: "AIP-001-002 商品库管理" }
  LayerBizAIP_003_004@{ shape: rectangle, label: "AIP-003-004 类目治理" }
  LayerBizAIP_005_006@{ shape: rectangle, label: "AIP-005-006 属性治理" }
  LayerBizAIP_007@{ shape: rectangle, label: "AIP-007 商品图文审核" }
  LayerBizAIP_008@{ shape: rectangle, label: "AIP-008 描述规范性校验" }
  LayerBizAIP_009@{ shape: rectangle, label: "AIP-009 审核结果分类展示" }
  LayerBizAIP_010@{ shape: rectangle, label: "AIP-010 同款精确匹配" }
  LayerBizAIP_011@{ shape: rectangle, label: "AIP-011 SEO 标题生成" }
  LayerBizAIP_012@{ shape: rectangle, label: "AIP-012 属性自动提取" }
  LayerBizAIP_013@{ shape: rectangle, label: "AIP-013 属性合理性检测" }
  LayerBizS_01@{ shape: rectangle, label: "S-01 供应商推品上架" }
  LayerBizAIP_001_002 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_003_004 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_005_006 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_007 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_008 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_009 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_010 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_011 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_012 -. "\`满足\`" .-> LayerBizS_01
  LayerBizAIP_013 -. "\`满足\`" .-> LayerBizS_01
`;case`view_jert70`:return`---
title: "S-02 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_015@{ shape: rectangle, label: "AIP-015 智能分词与语义理解" }
  LayerBizAIP_024_028@{ shape: rectangle, label: "AIP-024-028 AI 对话导购" }
  LayerBizAIP_029_031@{ shape: rectangle, label: "AIP-029-031 AI 猜你喜欢" }
  LayerBizS_02@{ shape: rectangle, label: "S-02 自然语言找货下单" }
  LayerBizAIP_015 -. "\`满足\`" .-> LayerBizS_02
  LayerBizAIP_024_028 -. "\`满足\`" .-> LayerBizS_02
  LayerBizAIP_029_031 -. "\`满足\`" .-> LayerBizS_02
`;case`view_4s0pxq`:return`---
title: "S-03 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_010@{ shape: rectangle, label: "AIP-010 同款精确匹配" }
  LayerBizAIP_011@{ shape: rectangle, label: "AIP-011 SEO 标题生成" }
  LayerBizAIP_015@{ shape: rectangle, label: "AIP-015 智能分词与语义理解" }
  LayerBizAIP_016_017@{ shape: rectangle, label: "AIP-016-017 输入补全与智能纠错" }
  LayerBizAIP_018_020@{ shape: rectangle, label: "AIP-018-020 类目品牌筛选与属性聚合" }
  LayerBizAIP_021@{ shape: rectangle, label: "AIP-021 多维度排序" }
  LayerBizAIP_022_023@{ shape: rectangle, label: "AIP-022-023 类目与品牌自动推荐" }
  LayerBizAIP_029_031@{ shape: rectangle, label: "AIP-029-031 AI 猜你喜欢" }
  LayerBizS_03@{ shape: rectangle, label: "S-03 关键词搜索比选" }
  LayerBizAIP_010 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_011 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_015 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_016_017 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_018_020 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_021 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_022_023 -. "\`满足\`" .-> LayerBizS_03
  LayerBizAIP_029_031 -. "\`满足\`" .-> LayerBizS_03
`;case`view_16urqmg`:return`---
title: "S-04 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAICS_001_009@{ shape: rectangle, label: "AICS-001-009 在线客服底座" }
  LayerBizAICS_010_015@{ shape: rectangle, label: "AICS-010-015 人工接待" }
  LayerBizAICS_016_017@{ shape: rectangle, label: "AICS-016-017 意图识别与转接" }
  LayerBizAICS_018_019@{ shape: rectangle, label: "AICS-018-019 智能体业务应答" }
  LayerBizAICS_020_023@{ shape: rectangle, label: "AICS-020-023 知识库管理" }
  LayerBizS_04@{ shape: rectangle, label: "S-04 客服咨询即答" }
  LayerBizAICS_001_009 -. "\`满足\`" .-> LayerBizS_04
  LayerBizAICS_010_015 -. "\`满足\`" .-> LayerBizS_04
  LayerBizAICS_016_017 -. "\`满足\`" .-> LayerBizS_04
  LayerBizAICS_018_019 -. "\`满足\`" .-> LayerBizS_04
  LayerBizAICS_020_023 -. "\`满足\`" .-> LayerBizS_04
`;case`view_tzcksm`:return`---
title: "S-05 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAICS_001_009@{ shape: rectangle, label: "AICS-001-009 在线客服底座" }
  LayerBizAICS_010_015@{ shape: rectangle, label: "AICS-010-015 人工接待" }
  LayerBizAICS_016_017@{ shape: rectangle, label: "AICS-016-017 意图识别与转接" }
  LayerBizS_05@{ shape: rectangle, label: "S-05 售后与转人工" }
  LayerBizAICS_001_009 -. "\`满足\`" .-> LayerBizS_05
  LayerBizAICS_010_015 -. "\`满足\`" .-> LayerBizS_05
  LayerBizAICS_016_017 -. "\`满足\`" .-> LayerBizS_05
`;case`view_1w23lhg`:return`---
title: "S-06 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_014@{ shape: rectangle, label: "AIP-014 集采合规管控" }
  LayerBizS_06@{ shape: rectangle, label: "S-06 集采专区合规采买" }
  LayerBizAIP_014 -. "\`满足\`" .-> LayerBizS_06
`;case`view_16z2nwd`:return`---
title: "S-07 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_001_002@{ shape: rectangle, label: "AIP-001-002 商品库管理" }
  LayerBizAIP_003_004@{ shape: rectangle, label: "AIP-003-004 类目治理" }
  LayerBizAIP_005_006@{ shape: rectangle, label: "AIP-005-006 属性治理" }
  LayerBizAIP_008@{ shape: rectangle, label: "AIP-008 描述规范性校验" }
  LayerBizAIP_010@{ shape: rectangle, label: "AIP-010 同款精确匹配" }
  LayerBizAIP_012@{ shape: rectangle, label: "AIP-012 属性自动提取" }
  LayerBizAIP_013@{ shape: rectangle, label: "AIP-013 属性合理性检测" }
  LayerBizS_07@{ shape: rectangle, label: "S-07 存量商品清洗治理" }
  LayerBizAIP_001_002 -. "\`满足\`" .-> LayerBizS_07
  LayerBizAIP_003_004 -. "\`满足\`" .-> LayerBizS_07
  LayerBizAIP_005_006 -. "\`满足\`" .-> LayerBizS_07
  LayerBizAIP_008 -. "\`满足\`" .-> LayerBizS_07
  LayerBizAIP_010 -. "\`满足\`" .-> LayerBizS_07
  LayerBizAIP_012 -. "\`满足\`" .-> LayerBizS_07
  LayerBizAIP_013 -. "\`满足\`" .-> LayerBizS_07
`;case`view_118uz77`:return`---
title: "S-08 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_021@{ shape: rectangle, label: "AIP-021 多维度排序" }
  LayerBizAIP_022_023@{ shape: rectangle, label: "AIP-022-023 类目与品牌自动推荐" }
  LayerBizAIP_029_031@{ shape: rectangle, label: "AIP-029-031 AI 猜你喜欢" }
  LayerBizAICS_020_023@{ shape: rectangle, label: "AICS-020-023 知识库管理" }
  LayerBizS_08@{ shape: rectangle, label: "S-08 数据飞轮持续优化" }
  LayerBizAIP_021 -. "\`满足\`" .-> LayerBizS_08
  LayerBizAIP_022_023 -. "\`满足\`" .-> LayerBizS_08
  LayerBizAIP_029_031 -. "\`满足\`" .-> LayerBizS_08
  LayerBizAICS_020_023 -. "\`满足\`" .-> LayerBizS_08
`;case`view_apzddd`:return`---
title: "S-09 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAIP_007@{ shape: rectangle, label: "AIP-007 商品图文审核" }
  LayerBizAIP_009@{ shape: rectangle, label: "AIP-009 审核结果分类展示" }
  LayerBizS_09@{ shape: rectangle, label: "S-09 审核运营与供应商协同" }
  LayerBizAIP_007 -. "\`满足\`" .-> LayerBizS_09
  LayerBizAIP_009 -. "\`满足\`" .-> LayerBizS_09
`;case`view_xejlug`:return`---
title: "S-10 追溯链（能力→组件→锚点）"
---
graph TB
  LayerBizAICS_024_025@{ shape: rectangle, label: "AICS-024-025 智能客服维护" }
  LayerBizAICS_026_028@{ shape: rectangle, label: "AICS-026-028 基础设置" }
  LayerBizAICS_029@{ shape: rectangle, label: "AICS-029 报表分析" }
  LayerBizS_10@{ shape: rectangle, label: "S-10 客服运营管理" }
  LayerBizAICS_024_025 -. "\`满足\`" .-> LayerBizS_10
  LayerBizAICS_026_028 -. "\`满足\`" .-> LayerBizS_10
  LayerBizAICS_029 -. "\`满足\`" .-> LayerBizS_10
`;default:throw Error(`Unknown viewId: `+e)}};export{e as mmdSource};