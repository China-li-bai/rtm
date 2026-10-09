var e=e=>{switch(e){case`index`:return`direction: down

LayerTech: {
  label: "技术层 · 基础设施"
}
LayerApp: {
  label: "应用层 · 三大中台"
}
LayerBiz: {
  label: "业务层 · 场景与业务能力"
}

LayerApp -> LayerBiz: "实现"
LayerTech -> LayerApp: "[...]"
`;case`view_1iyeq5w`:return`direction: down

LayerAppPlatProduct: {
  label: "AI 商品中台 · 把货变标准"

  COMP_01: {
    label: "COMP-01 AIP-001-002-商品库管理"
  }
  COMP_02: {
    label: "COMP-02 类目治理智能体产品文档"
  }
  COMP_03: {
    label: "COMP-03 ATTRIBUTE_EXTRACTION_PRD"
  }
  COMP_04: {
    label: "COMP-04 AIP-007-商品图文审核"
  }
  COMP_05: {
    label: "COMP-05 AIP-008-描述规范性校验"
  }
  COMP_06: {
    label: "COMP-06 AIP-010-同款精确匹配"
  }
  COMP_07: {
    label: "COMP-07 AIP-011-SEO标题生成"
  }
  COMP_08: {
    label: "COMP-08 AIP-014-集采合规管控"
  }
}
LayerBiz: {
  label: "业务层 · 场景与业务能力"
}

LayerAppPlatProduct.COMP_01 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_02 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_03 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_04 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_05 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_06 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_07 -> LayerBiz: "实现"
LayerAppPlatProduct.COMP_08 -> LayerBiz: "实现"
`;case`view_ssxrxu`:return`direction: down

LayerAppPlatSearch: {
  label: "AI 搜索中台 · 让人找到货"

  COMP_09: {
    label: "COMP-09 AIP-015-语义检索与Query理解"
  }
  COMP_10: {
    label: "COMP-10 AIP-016-017-输入补全与智能纠错"
  }
  COMP_11: {
    label: "COMP-11 AIP-018-020-筛选面板与属性聚合"
  }
  COMP_12: {
    label: "COMP-12 AIP-021-多维排序"
  }
  COMP_13: {
    label: "COMP-13 AIP-022-023-类目品牌推荐"
  }
  COMP_14: {
    label: "COMP-14 AIP-024-028-AI对话导购"
  }
  COMP_15: {
    label: "COMP-15 AIP-029-031-AI猜你喜欢"
  }
}
LayerBiz: {
  label: "业务层 · 场景与业务能力"
}

LayerAppPlatSearch.COMP_09 -> LayerBiz: "实现"
LayerAppPlatSearch.COMP_10 -> LayerBiz: "实现"
LayerAppPlatSearch.COMP_11 -> LayerBiz: "实现"
LayerAppPlatSearch.COMP_12 -> LayerBiz: "实现"
LayerAppPlatSearch.COMP_13 -> LayerBiz: "实现"
LayerAppPlatSearch.COMP_14 -> LayerBiz: "实现"
LayerAppPlatSearch.COMP_15 -> LayerBiz: "实现"
`;case`view_6xr5j4`:return`direction: down

LayerAppPlatService: {
  label: "AI 客服中台 · 守护成交"

  COMP_16: {
    label: "COMP-16 AICS-001-009-双通道在线客服底座"
  }
  COMP_17: {
    label: "COMP-17 AICS-010-015-人工接待"
  }
  COMP_18: {
    label: "COMP-18 AICS-016-025-智能体接待"
  }
  COMP_19: {
    label: "COMP-19 AICS-026-029-基础设置与报表"
  }
}
LayerBiz: {
  label: "业务层 · 场景与业务能力"
}

LayerAppPlatService.COMP_16 -> LayerBiz: "实现"
LayerAppPlatService.COMP_17 -> LayerBiz: "实现"
LayerAppPlatService.COMP_18 -> LayerBiz: "实现"
LayerAppPlatService.COMP_19 -> LayerBiz: "实现"
`;case`view_1gd4uha`:return`direction: down

LayerBizAIP_001_002: {
  label: "AIP-001-002 商品库管理"
}
LayerBizAIP_003_004: {
  label: "AIP-003-004 类目治理"
}
LayerBizAIP_005_006: {
  label: "AIP-005-006 属性治理"
}
LayerBizAIP_007: {
  label: "AIP-007 商品图文审核"
}
LayerBizAIP_008: {
  label: "AIP-008 描述规范性校验"
}
LayerBizAIP_009: {
  label: "AIP-009 审核结果分类展示"
}
LayerBizAIP_010: {
  label: "AIP-010 同款精确匹配"
}
LayerBizAIP_011: {
  label: "AIP-011 SEO 标题生成"
}
LayerBizAIP_012: {
  label: "AIP-012 属性自动提取"
}
LayerBizAIP_013: {
  label: "AIP-013 属性合理性检测"
}
LayerBizS_01: {
  label: "S-01 供应商推品上架"
}

LayerBizAIP_001_002 -> LayerBizS_01: "满足"
LayerBizAIP_003_004 -> LayerBizS_01: "满足"
LayerBizAIP_005_006 -> LayerBizS_01: "满足"
LayerBizAIP_007 -> LayerBizS_01: "满足"
LayerBizAIP_008 -> LayerBizS_01: "满足"
LayerBizAIP_009 -> LayerBizS_01: "满足"
LayerBizAIP_010 -> LayerBizS_01: "满足"
LayerBizAIP_011 -> LayerBizS_01: "满足"
LayerBizAIP_012 -> LayerBizS_01: "满足"
LayerBizAIP_013 -> LayerBizS_01: "满足"
`;case`view_jert70`:return`direction: down

LayerBizAIP_015: {
  label: "AIP-015 智能分词与语义理解"
}
LayerBizAIP_024_028: {
  label: "AIP-024-028 AI 对话导购"
}
LayerBizAIP_029_031: {
  label: "AIP-029-031 AI 猜你喜欢"
}
LayerBizS_02: {
  label: "S-02 自然语言找货下单"
}

LayerBizAIP_015 -> LayerBizS_02: "满足"
LayerBizAIP_024_028 -> LayerBizS_02: "满足"
LayerBizAIP_029_031 -> LayerBizS_02: "满足"
`;case`view_4s0pxq`:return`direction: down

LayerBizAIP_010: {
  label: "AIP-010 同款精确匹配"
}
LayerBizAIP_011: {
  label: "AIP-011 SEO 标题生成"
}
LayerBizAIP_015: {
  label: "AIP-015 智能分词与语义理解"
}
LayerBizAIP_016_017: {
  label: "AIP-016-017 输入补全与智能纠错"
}
LayerBizAIP_018_020: {
  label: "AIP-018-020 类目品牌筛选与属性聚合"
}
LayerBizAIP_021: {
  label: "AIP-021 多维度排序"
}
LayerBizAIP_022_023: {
  label: "AIP-022-023 类目与品牌自动推荐"
}
LayerBizAIP_029_031: {
  label: "AIP-029-031 AI 猜你喜欢"
}
LayerBizS_03: {
  label: "S-03 关键词搜索比选"
}

LayerBizAIP_010 -> LayerBizS_03: "满足"
LayerBizAIP_011 -> LayerBizS_03: "满足"
LayerBizAIP_015 -> LayerBizS_03: "满足"
LayerBizAIP_016_017 -> LayerBizS_03: "满足"
LayerBizAIP_018_020 -> LayerBizS_03: "满足"
LayerBizAIP_021 -> LayerBizS_03: "满足"
LayerBizAIP_022_023 -> LayerBizS_03: "满足"
LayerBizAIP_029_031 -> LayerBizS_03: "满足"
`;case`view_16urqmg`:return`direction: down

LayerBizAICS_001_009: {
  label: "AICS-001-009 在线客服底座"
}
LayerBizAICS_010_015: {
  label: "AICS-010-015 人工接待"
}
LayerBizAICS_016_017: {
  label: "AICS-016-017 意图识别与转接"
}
LayerBizAICS_018_019: {
  label: "AICS-018-019 智能体业务应答"
}
LayerBizAICS_020_023: {
  label: "AICS-020-023 知识库管理"
}
LayerBizS_04: {
  label: "S-04 客服咨询即答"
}

LayerBizAICS_001_009 -> LayerBizS_04: "满足"
LayerBizAICS_010_015 -> LayerBizS_04: "满足"
LayerBizAICS_016_017 -> LayerBizS_04: "满足"
LayerBizAICS_018_019 -> LayerBizS_04: "满足"
LayerBizAICS_020_023 -> LayerBizS_04: "满足"
`;case`view_tzcksm`:return`direction: down

LayerBizAICS_001_009: {
  label: "AICS-001-009 在线客服底座"
}
LayerBizAICS_010_015: {
  label: "AICS-010-015 人工接待"
}
LayerBizAICS_016_017: {
  label: "AICS-016-017 意图识别与转接"
}
LayerBizS_05: {
  label: "S-05 售后与转人工"
}

LayerBizAICS_001_009 -> LayerBizS_05: "满足"
LayerBizAICS_010_015 -> LayerBizS_05: "满足"
LayerBizAICS_016_017 -> LayerBizS_05: "满足"
`;case`view_1w23lhg`:return`direction: down

LayerBizAIP_014: {
  label: "AIP-014 集采合规管控"
}
LayerBizS_06: {
  label: "S-06 集采专区合规采买"
}

LayerBizAIP_014 -> LayerBizS_06: "满足"
`;case`view_16z2nwd`:return`direction: down

LayerBizAIP_001_002: {
  label: "AIP-001-002 商品库管理"
}
LayerBizAIP_003_004: {
  label: "AIP-003-004 类目治理"
}
LayerBizAIP_005_006: {
  label: "AIP-005-006 属性治理"
}
LayerBizAIP_008: {
  label: "AIP-008 描述规范性校验"
}
LayerBizAIP_010: {
  label: "AIP-010 同款精确匹配"
}
LayerBizAIP_012: {
  label: "AIP-012 属性自动提取"
}
LayerBizAIP_013: {
  label: "AIP-013 属性合理性检测"
}
LayerBizS_07: {
  label: "S-07 存量商品清洗治理"
}

LayerBizAIP_001_002 -> LayerBizS_07: "满足"
LayerBizAIP_003_004 -> LayerBizS_07: "满足"
LayerBizAIP_005_006 -> LayerBizS_07: "满足"
LayerBizAIP_008 -> LayerBizS_07: "满足"
LayerBizAIP_010 -> LayerBizS_07: "满足"
LayerBizAIP_012 -> LayerBizS_07: "满足"
LayerBizAIP_013 -> LayerBizS_07: "满足"
`;case`view_118uz77`:return`direction: down

LayerBizAIP_021: {
  label: "AIP-021 多维度排序"
}
LayerBizAIP_022_023: {
  label: "AIP-022-023 类目与品牌自动推荐"
}
LayerBizAIP_029_031: {
  label: "AIP-029-031 AI 猜你喜欢"
}
LayerBizAICS_020_023: {
  label: "AICS-020-023 知识库管理"
}
LayerBizS_08: {
  label: "S-08 数据飞轮持续优化"
}

LayerBizAIP_021 -> LayerBizS_08: "满足"
LayerBizAIP_022_023 -> LayerBizS_08: "满足"
LayerBizAIP_029_031 -> LayerBizS_08: "满足"
LayerBizAICS_020_023 -> LayerBizS_08: "满足"
`;case`view_apzddd`:return`direction: down

LayerBizAIP_007: {
  label: "AIP-007 商品图文审核"
}
LayerBizAIP_009: {
  label: "AIP-009 审核结果分类展示"
}
LayerBizS_09: {
  label: "S-09 审核运营与供应商协同"
}

LayerBizAIP_007 -> LayerBizS_09: "满足"
LayerBizAIP_009 -> LayerBizS_09: "满足"
`;case`view_xejlug`:return`direction: down

LayerBizAICS_024_025: {
  label: "AICS-024-025 智能客服维护"
}
LayerBizAICS_026_028: {
  label: "AICS-026-028 基础设置"
}
LayerBizAICS_029: {
  label: "AICS-029 报表分析"
}
LayerBizS_10: {
  label: "S-10 客服运营管理"
}

LayerBizAICS_024_025 -> LayerBizS_10: "满足"
LayerBizAICS_026_028 -> LayerBizS_10: "满足"
LayerBizAICS_029 -> LayerBizS_10: "满足"
`;default:throw Error(`Unknown viewId: `+e)}};export{e as d2Source};