var e=e=>{switch(e){case`index`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=index,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    layertech [height=2.5,
        label=<<FONT POINT-SIZE="20">技术层 · 基础设施</FONT>>,
        likec4_id=layerTech,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    layerapp [height=2.5,
        label=<<FONT POINT-SIZE="20">应用层 · 三大中台</FONT>>,
        likec4_id=layerApp,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    layertech -> layerapp [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14"><B>[...]</B></FONT></TD></TR></TABLE>>,
        likec4_id="1l6q8k1",
        minlen=1,
        style=dashed];
    layerbiz [height=2.5,
        label=<<FONT POINT-SIZE="20">业务层 · 场景与业务能力</FONT>>,
        likec4_id=layerBiz,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    layerapp -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1had0qi",
        minlen=1,
        style=dashed];
}
`;case`view_1iyeq5w`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_1iyeq5w,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_platproduct {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>AI 商品中台 · 把货变标准</B></FONT>>,
            likec4_depth=1,
            likec4_id="layerApp.platProduct",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        comp_01 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-01 AIP-001-002-商品库管理</FONT>>,
            likec4_id="layerApp.platProduct.COMP_01",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_02 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-02 类目治理智能体产品文档</FONT>>,
            likec4_id="layerApp.platProduct.COMP_02",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_03 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-03 ATTRIBUTE_EXTRACTION_PRD</FONT>>,
            likec4_id="layerApp.platProduct.COMP_03",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_04 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-04 AIP-007-商品图文审核</FONT>>,
            likec4_id="layerApp.platProduct.COMP_04",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_05 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-05 AIP-008-描述规范性校验</FONT>>,
            likec4_id="layerApp.platProduct.COMP_05",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_06 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-06 AIP-010-同款精确匹配</FONT>>,
            likec4_id="layerApp.platProduct.COMP_06",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_07 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-07 AIP-011-SEO标题生成</FONT>>,
            likec4_id="layerApp.platProduct.COMP_07",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_08 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-08 AIP-014-集采合规管控</FONT>>,
            likec4_id="layerApp.platProduct.COMP_08",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    layerbiz [height=2.5,
        label=<<FONT POINT-SIZE="20">业务层 · 场景与业务能力</FONT>>,
        likec4_id=layerBiz,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    comp_01 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="16k1vkn",
        minlen=1,
        style=dashed];
    comp_02 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1iybbxw",
        minlen=1,
        style=dashed];
    comp_03 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1pc8pjp",
        minlen=1,
        style=dashed];
    comp_04 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1jbg5te",
        minlen=1,
        style=dashed];
    comp_05 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1t4eg0j",
        minlen=1,
        style=dashed];
    comp_06 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="6hjueo",
        minlen=1,
        style=dashed];
    comp_07 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id=cvh80h,
        minlen=1,
        style=dashed];
    comp_08 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1yo40e6",
        minlen=1,
        style=dashed];
}
`;case`view_ssxrxu`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_ssxrxu,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_platsearch {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>AI 搜索中台 · 让人找到货</B></FONT>>,
            likec4_depth=1,
            likec4_id="layerApp.platSearch",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        comp_09 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-09 AIP-015-语义检索与Query理解</FONT>>,
            likec4_id="layerApp.platSearch.COMP_09",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_10 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-10 AIP-016-017-输入补全与智能纠错</FONT>>,
            likec4_id="layerApp.platSearch.COMP_10",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_11 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-11 AIP-018-020-筛选面板与属性聚合</FONT>>,
            likec4_id="layerApp.platSearch.COMP_11",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_12 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-12 AIP-021-多维排序</FONT>>,
            likec4_id="layerApp.platSearch.COMP_12",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_13 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-13 AIP-022-023-类目品牌推荐</FONT>>,
            likec4_id="layerApp.platSearch.COMP_13",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_14 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-14 AIP-024-028-AI对话导购</FONT>>,
            likec4_id="layerApp.platSearch.COMP_14",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_15 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-15 AIP-029-031-AI猜你喜欢</FONT>>,
            likec4_id="layerApp.platSearch.COMP_15",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    layerbiz [height=2.5,
        label=<<FONT POINT-SIZE="20">业务层 · 场景与业务能力</FONT>>,
        likec4_id=layerBiz,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    comp_09 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="5aw48q",
        minlen=1,
        style=dashed];
    comp_10 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id=hzdk7m,
        minlen=1,
        style=dashed];
    comp_11 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id=c4gotv,
        minlen=1,
        style=dashed];
    comp_12 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="15s5j2o",
        minlen=1,
        style=dashed];
    comp_13 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id=zx8nox,
        minlen=1,
        style=dashed];
    comp_14 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1ug51qu",
        minlen=1,
        style=dashed];
    comp_15 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1ol86d3",
        minlen=1,
        style=dashed];
}
`;case`view_6xr5j4`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_6xr5j4,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    subgraph cluster_platservice {
        graph [color="#1b3d88",
            fillcolor="#194b9e",
            label=<<FONT POINT-SIZE="11" COLOR="#bfdbfeb3"><B>AI 客服中台 · 守护成交</B></FONT>>,
            likec4_depth=1,
            likec4_id="layerApp.platService",
            likec4_level=0,
            margin=40,
            style=filled
        ];
        comp_16 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-16 AICS-001-009-双通道在线客服底座</FONT>>,
            likec4_id="layerApp.platService.COMP_16",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_17 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-17 AICS-010-015-人工接待</FONT>>,
            likec4_id="layerApp.platService.COMP_17",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_18 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-18 AICS-016-025-智能体接待</FONT>>,
            likec4_id="layerApp.platService.COMP_18",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
        comp_19 [color="#475569",
            fillcolor="#64748b",
            fontcolor="#f8fafc",
            height=2.5,
            label=<<FONT POINT-SIZE="20">COMP-19 AICS-026-029-基础设置与报表</FONT>>,
            likec4_id="layerApp.platService.COMP_19",
            likec4_level=1,
            margin="0.223,0.223",
            width=4.445];
    }
    layerbiz [height=2.5,
        label=<<FONT POINT-SIZE="20">业务层 · 场景与业务能力</FONT>>,
        likec4_id=layerBiz,
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    comp_16 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1ct2s07",
        minlen=1,
        style=dashed];
    comp_17 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id=isj0va,
        minlen=1,
        style=dashed];
    comp_18 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id="1ogjg21",
        minlen=1,
        style=dashed];
    comp_19 -> layerbiz [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">实现</FONT></TD></TR></TABLE>>,
        likec4_id=r0ysbs,
        minlen=1,
        style=dashed];
}
`;case`view_1gd4uha`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_1gd4uha,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_001_002 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-001-002 商品库管理</FONT>>,
        likec4_id="layerBiz.AIP_001_002",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_01 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-01 供应商推品上架</FONT>>,
        likec4_id="layerBiz.S_01",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_001_002 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=qkdzw,
        minlen=1,
        style=dashed];
    aip_003_004 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-003-004 类目治理</FONT>>,
        likec4_id="layerBiz.AIP_003_004",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_003_004 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1nb7xeg",
        minlen=1,
        style=dashed];
    aip_005_006 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-005-006 属性治理</FONT>>,
        likec4_id="layerBiz.AIP_005_006",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_005_006 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1quesbg",
        minlen=1,
        style=dashed];
    aip_007 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-007 商品图文审核</FONT>>,
        likec4_id="layerBiz.AIP_007",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_007 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=p3tjpz,
        minlen=1,
        style=dashed];
    aip_008 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-008 描述规范性校验</FONT>>,
        likec4_id="layerBiz.AIP_008",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_008 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=a2plug,
        minlen=1,
        style=dashed];
    aip_009 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-009 审核结果分类展示</FONT>>,
        likec4_id="layerBiz.AIP_009",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_009 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="13wnbq1",
        minlen=1,
        style=dashed];
    aip_010 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-010 同款精确匹配</FONT>>,
        likec4_id="layerBiz.AIP_010",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_010 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=pl05pt,
        minlen=1,
        style=dashed];
    aip_011 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-011 SEO 标题生成</FONT>>,
        likec4_id="layerBiz.AIP_011",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_011 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1d4xupc",
        minlen=1,
        style=dashed];
    aip_012 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-012 属性自动提取</FONT>>,
        likec4_id="layerBiz.AIP_012",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_012 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="3alzw3",
        minlen=1,
        style=dashed];
    aip_013 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-013 属性合理性检测</FONT>>,
        likec4_id="layerBiz.AIP_013",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_013 -> s_01 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1xgvtma",
        minlen=1,
        style=dashed];
}
`;case`view_jert70`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_jert70,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_015 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-015 智能分词与语义理解</FONT>>,
        likec4_id="layerBiz.AIP_015",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_02 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-02 自然语言找货下单</FONT>>,
        likec4_id="layerBiz.S_02",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_015 -> s_02 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1qzhozb",
        minlen=1,
        style=dashed];
    aip_024_028 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-024-028 AI 对话导购</FONT>>,
        likec4_id="layerBiz.AIP_024_028",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_024_028 -> s_02 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=i8f95c,
        minlen=1,
        style=dashed];
    aip_029_031 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-029-031 AI 猜你喜欢</FONT>>,
        likec4_id="layerBiz.AIP_029_031",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_029_031 -> s_02 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="92blbp",
        minlen=1,
        style=dashed];
}
`;case`view_4s0pxq`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_4s0pxq,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_010 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-010 同款精确匹配</FONT>>,
        likec4_id="layerBiz.AIP_010",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_03 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-03 关键词搜索比选</FONT>>,
        likec4_id="layerBiz.S_03",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_010 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=pl05pv,
        minlen=1,
        style=dashed];
    aip_011 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-011 SEO 标题生成</FONT>>,
        likec4_id="layerBiz.AIP_011",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_011 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1d4xupe",
        minlen=1,
        style=dashed];
    aip_015 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-015 智能分词与语义理解</FONT>>,
        likec4_id="layerBiz.AIP_015",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_015 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1qzhoza",
        minlen=1,
        style=dashed];
    aip_016_017 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-016-017 输入补全与智能纠错</FONT>>,
        likec4_id="layerBiz.AIP_016_017",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_016_017 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=j0z7to,
        minlen=1,
        style=dashed];
    aip_018_020 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-018-020 类目品牌筛选与属性聚合</FONT>>,
        likec4_id="layerBiz.AIP_018_020",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_018_020 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1sth2uu",
        minlen=1,
        style=dashed];
    aip_021 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-021 多维度排序</FONT>>,
        likec4_id="layerBiz.AIP_021",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_021 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1a6hx3l",
        minlen=1,
        style=dashed];
    aip_022_023 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-022-023 类目与品牌自动推荐</FONT>>,
        likec4_id="layerBiz.AIP_022_023",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_022_023 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1yrfot8",
        minlen=1,
        style=dashed];
    aip_029_031 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-029-031 AI 猜你喜欢</FONT>>,
        likec4_id="layerBiz.AIP_029_031",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_029_031 -> s_03 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="92blbo",
        minlen=1,
        style=dashed];
}
`;case`view_16urqmg`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_16urqmg,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aics_001_009 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-001-009 在线客服底座</FONT>>,
        likec4_id="layerBiz.AICS_001_009",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_04 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-04 客服咨询即答</FONT>>,
        likec4_id="layerBiz.S_04",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_001_009 -> s_04 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="126os1e",
        minlen=1,
        style=dashed];
    aics_010_015 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-010-015 人工接待</FONT>>,
        likec4_id="layerBiz.AICS_010_015",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_010_015 -> s_04 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="94ewxr",
        minlen=1,
        style=dashed];
    aics_016_017 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-016-017 意图识别与转接</FONT>>,
        likec4_id="layerBiz.AICS_016_017",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_016_017 -> s_04 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=ffsf97,
        minlen=1,
        style=dashed];
    aics_018_019 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-018-019 智能体业务应答</FONT>>,
        likec4_id="layerBiz.AICS_018_019",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_018_019 -> s_04 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="14ti2ij",
        minlen=1,
        style=dashed];
    aics_020_023 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-020-023 知识库管理</FONT>>,
        likec4_id="layerBiz.AICS_020_023",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_020_023 -> s_04 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1xh4sl5",
        minlen=1,
        style=dashed];
}
`;case`view_tzcksm`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_tzcksm,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aics_001_009 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-001-009 在线客服底座</FONT>>,
        likec4_id="layerBiz.AICS_001_009",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_05 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-05 售后与转人工</FONT>>,
        likec4_id="layerBiz.S_05",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_001_009 -> s_05 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="126os1f",
        minlen=1,
        style=dashed];
    aics_010_015 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-010-015 人工接待</FONT>>,
        likec4_id="layerBiz.AICS_010_015",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_010_015 -> s_05 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="94ewxq",
        minlen=1,
        style=dashed];
    aics_016_017 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-016-017 意图识别与转接</FONT>>,
        likec4_id="layerBiz.AICS_016_017",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_016_017 -> s_05 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=ffsf96,
        minlen=1,
        style=dashed];
}
`;case`view_1w23lhg`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_1w23lhg,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_014 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-014 集采合规管控</FONT>>,
        likec4_id="layerBiz.AIP_014",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_06 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-06 集采专区合规采买</FONT>>,
        likec4_id="layerBiz.S_06",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_014 -> s_06 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="13fjzzm",
        style=dashed];
}
`;case`view_16z2nwd`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_16z2nwd,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_001_002 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-001-002 商品库管理</FONT>>,
        likec4_id="layerBiz.AIP_001_002",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_07 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-07 存量商品清洗治理</FONT>>,
        likec4_id="layerBiz.S_07",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_001_002 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=qkdzu,
        minlen=1,
        style=dashed];
    aip_003_004 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-003-004 类目治理</FONT>>,
        likec4_id="layerBiz.AIP_003_004",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_003_004 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1nb7xem",
        minlen=1,
        style=dashed];
    aip_005_006 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-005-006 属性治理</FONT>>,
        likec4_id="layerBiz.AIP_005_006",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_005_006 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1quesbe",
        minlen=1,
        style=dashed];
    aip_008 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-008 描述规范性校验</FONT>>,
        likec4_id="layerBiz.AIP_008",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_008 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=a2plum,
        minlen=1,
        style=dashed];
    aip_010 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-010 同款精确匹配</FONT>>,
        likec4_id="layerBiz.AIP_010",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_010 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=pl05pz,
        minlen=1,
        style=dashed];
    aip_012 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-012 属性自动提取</FONT>>,
        likec4_id="layerBiz.AIP_012",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_012 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="3alzw5",
        minlen=1,
        style=dashed];
    aip_013 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-013 属性合理性检测</FONT>>,
        likec4_id="layerBiz.AIP_013",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_013 -> s_07 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1xgvtmc",
        minlen=1,
        style=dashed];
}
`;case`view_118uz77`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_118uz77,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        label="\\N",
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_021 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-021 多维度排序</FONT>>,
        likec4_id="layerBiz.AIP_021",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_08 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-08 数据飞轮持续优化</FONT>>,
        likec4_id="layerBiz.S_08",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_021 -> s_08 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1a6hx3u",
        minlen=1,
        style=dashed];
    aip_022_023 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-022-023 类目与品牌自动推荐</FONT>>,
        likec4_id="layerBiz.AIP_022_023",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_022_023 -> s_08 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1yrfot3",
        minlen=1,
        style=dashed];
    aip_029_031 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-029-031 AI 猜你喜欢</FONT>>,
        likec4_id="layerBiz.AIP_029_031",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_029_031 -> s_08 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="92blbz",
        minlen=1,
        style=dashed];
    aics_020_023 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-020-023 知识库管理</FONT>>,
        likec4_id="layerBiz.AICS_020_023",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_020_023 -> s_08 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1xh4sl1",
        minlen=1,
        style=dashed];
}
`;case`view_apzddd`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_apzddd,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aip_007 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-007 商品图文审核</FONT>>,
        likec4_id="layerBiz.AIP_007",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_09 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-09 审核运营与供应商协同</FONT>>,
        likec4_id="layerBiz.S_09",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_007 -> s_09 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id=p3tjq7,
        minlen=1,
        style=dashed];
    aip_009 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AIP-009 审核结果分类展示</FONT>>,
        likec4_id="layerBiz.AIP_009",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aip_009 -> s_09 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="13wnbpt",
        minlen=1,
        style=dashed];
}
`;case`view_xejlug`:return`digraph {
    graph [TBbalance=min,
        bgcolor=transparent,
        compound=true,
        fontname=Arial,
        fontsize=20,
        labeljust=l,
        labelloc=t,
        layout=dot,
        likec4_viewId=view_xejlug,
        nodesep=1.528,
        outputorder=nodesfirst,
        pad=0.209,
        rankdir=TB,
        ranksep=1.667,
        splines=spline
    ];
    node [color="#2563eb",
        fillcolor="#3b82f6",
        fontcolor="#eff6ff",
        fontname=Arial,
        penwidth=0,
        shape=rect,
        style=filled
    ];
    edge [arrowsize=0.75,
        color="#8D8D8D",
        fontcolor="#C9C9C9",
        fontname=Arial,
        fontsize=14,
        penwidth=2,
        style=""
    ];
    aics_024_025 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-024-025 智能客服维护</FONT>>,
        likec4_id="layerBiz.AICS_024_025",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    s_10 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">S-10 客服运营管理</FONT>>,
        likec4_id="layerBiz.S_10",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_024_025 -> s_10 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="9up1su",
        minlen=1,
        style=dashed];
    aics_026_028 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-026-028 基础设置</FONT>>,
        likec4_id="layerBiz.AICS_026_028",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_026_028 -> s_10 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="13chob5",
        minlen=1,
        style=dashed];
    aics_029 [color="#0369a1",
        fillcolor="#0284c7",
        fontcolor="#f0f9ff",
        height=2.5,
        label=<<FONT POINT-SIZE="20">AICS-029 报表分析</FONT>>,
        likec4_id="layerBiz.AICS_029",
        likec4_level=0,
        margin="0.223,0.223",
        width=4.445];
    aics_029 -> s_10 [arrowhead=normal,
        label=<<TABLE BORDER="0" CELLPADDING="3" CELLSPACING="0" BGCOLOR="#18191BA0"><TR><TD ALIGN="TEXT" BALIGN="LEFT"><FONT POINT-SIZE="14">满足</FONT></TD></TR></TABLE>>,
        likec4_id="1g2yxy3",
        minlen=1,
        style=dashed];
}
`;default:throw Error(`Unknown viewId: `+e)}},t=e=>{switch(e){case`index`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="350pt" height="856pt"
 viewBox="0.00 0.00 350.00 856.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 840.65)">
<!-- layertech -->
<g id="node1" class="node">
<title>layertech</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="320.04,-825.6 0,-825.6 0,-645.6 320.04,-645.6 320.04,-825.6"/>
<text xml:space="preserve" text-anchor="start" x="90.56" y="-727.6" font-family="Arial" font-size="20.00" fill="#eff6ff">技术层 · 基础设施</text>
</g>
<!-- layerapp -->
<g id="node2" class="node">
<title>layerapp</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="90.56" y="-404.8" font-family="Arial" font-size="20.00" fill="#eff6ff">应用层 · 三大中台</text>
</g>
<!-- layerbiz -->
<g id="node3" class="node">
<title>layerbiz</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="320.04,-180 0,-180 0,0 320.04,0 320.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="65.56" y="-82" font-family="Arial" font-size="20.00" fill="#eff6ff">业务层 · 场景与业务能力</text>
</g>
<!-- layertech&#45;&gt;layerapp -->
<g id="edge1" class="edge">
<title>layertech&#45;&gt;layerapp</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M160.02,-645.67C160.02,-604.47 160.02,-555.36 160.02,-512.97"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="162.65,-513.16 160.02,-505.66 157.4,-513.16 162.65,-513.16"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="160.02,-562.8 160.02,-585.6 187.01,-585.6 187.01,-562.8 160.02,-562.8"/>
<text xml:space="preserve" text-anchor="start" x="163.02" y="-571" font-family="Arial" font-weight="bold" font-size="14.00" fill="#c9c9c9">[...]</text>
</g>
<!-- layerapp&#45;&gt;layerbiz -->
<g id="edge2" class="edge">
<title>layerapp&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M160.02,-322.87C160.02,-281.67 160.02,-232.56 160.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="162.65,-190.36 160.02,-182.86 157.4,-190.36 162.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="160.02,-240 160.02,-262.8 189.36,-262.8 189.36,-240 160.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="163.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
</g>
</svg>
`;case`view_1iyeq5w`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3578pt" height="602pt"
 viewBox="0.00 0.00 3578.00 602.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 587.05)">
<g id="clust1" class="cluster">
<title>cluster_platproduct</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="8,-282.8 8,-564 3540,-564 3540,-282.8 8,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-551.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">AI 商品中台 · 把货变标准</text>
</g>
<!-- comp_01 -->
<g id="node1" class="node">
<title>comp_01</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="376.44,-502.8 47.56,-502.8 47.56,-322.8 376.44,-322.8 376.44,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="63.62" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;01 AIP&#45;001&#45;002&#45;商品库管理</text>
</g>
<!-- comp_02 -->
<g id="node2" class="node">
<title>comp_02</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="806.02,-502.8 485.98,-502.8 485.98,-322.8 806.02,-322.8 806.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="507.08" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;02 类目治理智能体产品文档</text>
</g>
<!-- comp_03 -->
<g id="node3" class="node">
<title>comp_03</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1347.53,-502.8 916.47,-502.8 916.47,-322.8 1347.53,-322.8 1347.53,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="932.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;03 ATTRIBUTE_EXTRACTION_PRD</text>
</g>
<!-- comp_04 -->
<g id="node4" class="node">
<title>comp_04</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1778.02,-502.8 1457.98,-502.8 1457.98,-322.8 1778.02,-322.8 1778.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1481.3" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;04 AIP&#45;007&#45;商品图文审核</text>
</g>
<!-- comp_05 -->
<g id="node5" class="node">
<title>comp_05</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2210.1,-502.8 1887.9,-502.8 1887.9,-322.8 2210.1,-322.8 2210.1,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1903.96" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;05 AIP&#45;008&#45;描述规范性校验</text>
</g>
<!-- comp_06 -->
<g id="node6" class="node">
<title>comp_06</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2640.02,-502.8 2319.98,-502.8 2319.98,-322.8 2640.02,-322.8 2640.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2343.3" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;06 AIP&#45;010&#45;同款精确匹配</text>
</g>
<!-- comp_07 -->
<g id="node7" class="node">
<title>comp_07</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="3070.02,-502.8 2749.98,-502.8 2749.98,-322.8 3070.02,-322.8 3070.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2768.85" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;07 AIP&#45;011&#45;SEO标题生成</text>
</g>
<!-- comp_08 -->
<g id="node8" class="node">
<title>comp_08</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="3500.02,-502.8 3179.98,-502.8 3179.98,-322.8 3500.02,-322.8 3500.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="3203.3" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;08 AIP&#45;014&#45;集采合规管控</text>
</g>
<!-- layerbiz -->
<g id="node9" class="node">
<title>layerbiz</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1993.02,-180 1672.98,-180 1672.98,0 1993.02,0 1993.02,-180"/>
<text xml:space="preserve" text-anchor="start" x="1738.54" y="-82" font-family="Arial" font-size="20.00" fill="#eff6ff">业务层 · 场景与业务能力</text>
</g>
<!-- comp_01&#45;&gt;layerbiz -->
<g id="edge1" class="edge">
<title>comp_01&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M344.03,-322.83C371.8,-307.37 401.61,-293 431,-282.8 857.48,-134.74 1394.09,-100.42 1662.97,-92.83"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1662.76,-95.46 1670.19,-92.63 1662.62,-90.21 1662.76,-95.46"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="540.03,-240 540.03,-262.8 569.37,-262.8 569.37,-240 540.03,-240"/>
<text xml:space="preserve" text-anchor="start" x="543.03" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_02&#45;&gt;layerbiz -->
<g id="edge2" class="edge">
<title>comp_02&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M778.28,-322.81C804.85,-307.73 833.17,-293.52 861,-282.8 1130.59,-178.97 1464.82,-128.83 1662.83,-106.61"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1662.86,-109.25 1670.02,-105.81 1662.28,-104.03 1662.86,-109.25"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="962.14,-240 962.14,-262.8 991.48,-262.8 991.48,-240 962.14,-240"/>
<text xml:space="preserve" text-anchor="start" x="965.14" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_03&#45;&gt;layerbiz -->
<g id="edge3" class="edge">
<title>comp_03&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1317.22,-322.89C1345.88,-309.34 1375.2,-295.61 1403,-282.8 1488.51,-243.38 1584.13,-200.6 1663.45,-165.47"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1664.48,-167.89 1670.27,-162.45 1662.35,-163.09 1664.48,-167.89"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1484.96,-240 1484.96,-262.8 1514.3,-262.8 1514.3,-240 1484.96,-240"/>
<text xml:space="preserve" text-anchor="start" x="1487.96" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_04&#45;&gt;layerbiz -->
<g id="edge4" class="edge">
<title>comp_04&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1677.6,-322.87C1705.57,-281.14 1738.96,-231.31 1767.62,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1769.79,-190.04 1771.78,-182.34 1765.43,-187.11 1769.79,-190.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1731.95,-240 1731.95,-262.8 1761.28,-262.8 1761.28,-240 1731.95,-240"/>
<text xml:space="preserve" text-anchor="start" x="1734.95" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_05&#45;&gt;layerbiz -->
<g id="edge5" class="edge">
<title>comp_05&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1989.12,-322.87C1961.03,-281.14 1927.48,-231.31 1898.69,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1900.87,-187.1 1894.5,-182.34 1896.51,-190.03 1900.87,-187.1"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1947.48,-240 1947.48,-262.8 1976.81,-262.8 1976.81,-240 1947.48,-240"/>
<text xml:space="preserve" text-anchor="start" x="1950.48" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_06&#45;&gt;layerbiz -->
<g id="edge6" class="edge">
<title>comp_06&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2337.4,-322.93C2313.51,-309 2288.76,-295.14 2265,-282.8 2180.07,-238.68 2082.86,-194.95 2002.19,-160.41"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2003.65,-158.18 1995.72,-157.65 2001.59,-163.01 2003.65,-158.18"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2219.28,-240 2219.28,-262.8 2248.62,-262.8 2248.62,-240 2219.28,-240"/>
<text xml:space="preserve" text-anchor="start" x="2222.28" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_07&#45;&gt;layerbiz -->
<g id="edge7" class="edge">
<title>comp_07&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2776.64,-322.85C2750.34,-307.91 2722.39,-293.73 2695,-282.8 2464.35,-190.76 2180.47,-138.41 2003.07,-112.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2003.66,-109.8 1995.86,-111.31 2002.9,-114.99 2003.66,-109.8"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2628.09,-240 2628.09,-262.8 2657.42,-262.8 2657.42,-240 2628.09,-240"/>
<text xml:space="preserve" text-anchor="start" x="2631.09" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_08&#45;&gt;layerbiz -->
<g id="edge8" class="edge">
<title>comp_08&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3210.16,-322.9C3182.97,-307.48 3153.79,-293.11 3125,-282.8 2739.66,-144.8 2255.42,-106.05 2003.3,-95.2"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2003.58,-92.58 1995.98,-94.89 2003.36,-97.83 2003.58,-92.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3058.52,-240 3058.52,-262.8 3087.86,-262.8 3087.86,-240 3058.52,-240"/>
<text xml:space="preserve" text-anchor="start" x="3061.52" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
</g>
</svg>
`;case`view_ssxrxu`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3282pt" height="602pt"
 viewBox="0.00 0.00 3282.00 602.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 587.05)">
<g id="clust1" class="cluster">
<title>cluster_platsearch</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="8,-282.8 8,-564 3244,-564 3244,-282.8 8,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-551.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">AI 搜索中台 · 让人找到货</text>
</g>
<!-- comp_09 -->
<g id="node1" class="node">
<title>comp_09</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="424.33,-502.8 47.67,-502.8 47.67,-322.8 424.33,-322.8 424.33,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="63.73" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;09 AIP&#45;015&#45;语义检索与Query理解</text>
</g>
<!-- comp_10 -->
<g id="node2" class="node">
<title>comp_10</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="929.78,-502.8 534.22,-502.8 534.22,-322.8 929.78,-322.8 929.78,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="550.28" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;10 AIP&#45;016&#45;017&#45;输入补全与智能纠错</text>
</g>
<!-- comp_11 -->
<g id="node3" class="node">
<title>comp_11</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1435.78,-502.8 1040.22,-502.8 1040.22,-322.8 1435.78,-322.8 1435.78,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1056.28" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;11 AIP&#45;018&#45;020&#45;筛选面板与属性聚合</text>
</g>
<!-- comp_12 -->
<g id="node4" class="node">
<title>comp_12</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1866.02,-502.8 1545.98,-502.8 1545.98,-322.8 1866.02,-322.8 1866.02,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1585.97" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;12 AIP&#45;021&#45;多维排序</text>
</g>
<!-- comp_13 -->
<g id="node5" class="node">
<title>comp_13</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2321.77,-502.8 1976.23,-502.8 1976.23,-322.8 2321.77,-322.8 2321.77,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1992.28" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;13 AIP&#45;022&#45;023&#45;类目品牌推荐</text>
</g>
<!-- comp_14 -->
<g id="node6" class="node">
<title>comp_14</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="2762.55,-502.8 2431.45,-502.8 2431.45,-322.8 2762.55,-322.8 2762.55,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2447.5" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;14 AIP&#45;024&#45;028&#45;AI对话导购</text>
</g>
<!-- comp_15 -->
<g id="node7" class="node">
<title>comp_15</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="3203.55,-502.8 2872.45,-502.8 2872.45,-322.8 3203.55,-322.8 3203.55,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2888.5" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;15 AIP&#45;029&#45;031&#45;AI猜你喜欢</text>
</g>
<!-- layerbiz -->
<g id="node8" class="node">
<title>layerbiz</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1866.02,-180 1545.98,-180 1545.98,0 1866.02,0 1866.02,-180"/>
<text xml:space="preserve" text-anchor="start" x="1611.54" y="-82" font-family="Arial" font-size="20.00" fill="#eff6ff">业务层 · 场景与业务能力</text>
</g>
<!-- comp_09&#45;&gt;layerbiz -->
<g id="edge1" class="edge">
<title>comp_09&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M384.85,-322.86C415.2,-307.59 447.51,-293.29 479,-282.8 843.5,-161.38 1295.05,-116.07 1535.87,-99.73"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1535.79,-102.37 1543.09,-99.25 1535.44,-97.13 1535.79,-102.37"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="607.68,-240 607.68,-262.8 637.02,-262.8 637.02,-240 607.68,-240"/>
<text xml:space="preserve" text-anchor="start" x="610.68" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_10&#45;&gt;layerbiz -->
<g id="edge2" class="edge">
<title>comp_10&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M894.03,-322.83C923.79,-308.33 954.96,-294.31 985,-282.8 1168.57,-212.49 1387.88,-158.14 1536.04,-125.53"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1536.42,-128.14 1543.18,-123.97 1535.29,-123.01 1536.42,-128.14"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1099.98,-240 1099.98,-262.8 1129.32,-262.8 1129.32,-240 1099.98,-240"/>
<text xml:space="preserve" text-anchor="start" x="1102.98" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_11&#45;&gt;layerbiz -->
<g id="edge3" class="edge">
<title>comp_11&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1367.74,-322.87C1430.01,-280.19 1504.65,-229.02 1567.95,-185.63"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1569.21,-187.95 1573.91,-181.54 1566.24,-183.62 1569.21,-187.95"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1486.03,-240 1486.03,-262.8 1515.37,-262.8 1515.37,-240 1486.03,-240"/>
<text xml:space="preserve" text-anchor="start" x="1489.03" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_12&#45;&gt;layerbiz -->
<g id="edge4" class="edge">
<title>comp_12&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1706,-322.87C1706,-281.67 1706,-232.56 1706,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1708.63,-190.36 1706,-182.86 1703.38,-190.36 1708.63,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1706,-240 1706,-262.8 1735.34,-262.8 1735.34,-240 1706,-240"/>
<text xml:space="preserve" text-anchor="start" x="1709" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_13&#45;&gt;layerbiz -->
<g id="edge5" class="edge">
<title>comp_13&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2026.19,-322.87C1967.37,-280.27 1896.89,-229.23 1837.04,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1838.73,-183.88 1831.12,-181.6 1835.65,-188.13 1838.73,-183.88"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1940.78,-240 1940.78,-262.8 1970.12,-262.8 1970.12,-240 1940.78,-240"/>
<text xml:space="preserve" text-anchor="start" x="1943.78" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_14&#45;&gt;layerbiz -->
<g id="edge6" class="edge">
<title>comp_14&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2457.43,-322.93C2431.29,-308.33 2403.76,-294.25 2377,-282.8 2212.2,-212.27 2013.77,-159.2 1875.63,-126.97"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1876.64,-124.51 1868.74,-125.37 1875.45,-129.62 1876.64,-124.51"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2324.69,-240 2324.69,-262.8 2354.03,-262.8 2354.03,-240 2324.69,-240"/>
<text xml:space="preserve" text-anchor="start" x="2327.69" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_15&#45;&gt;layerbiz -->
<g id="edge7" class="edge">
<title>comp_15&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2903.56,-322.82C2876.11,-307.6 2846.8,-293.33 2818,-282.8 2497.65,-165.66 2098.68,-119.14 1876.22,-101.36"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1876.46,-98.75 1868.78,-100.78 1876.05,-103.98 1876.46,-98.75"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2731.56,-240 2731.56,-262.8 2760.89,-262.8 2760.89,-240 2731.56,-240"/>
<text xml:space="preserve" text-anchor="start" x="2734.56" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
</g>
</svg>
`;case`view_6xr5j4`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1912pt" height="602pt"
 viewBox="0.00 0.00 1912.00 602.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 587.05)">
<g id="clust1" class="cluster">
<title>cluster_platservice</title>
<polygon fill="#194b9e" stroke="#1b3d88" points="8,-282.8 8,-564 1874,-564 1874,-282.8 8,-282.8"/>
<text xml:space="preserve" text-anchor="start" x="16" y="-551.1" font-family="Arial" font-weight="bold" font-size="11.00" fill="#bfdbfe" fill-opacity="0.701961">AI 客服中台 · 守护成交</text>
</g>
<!-- comp_16 -->
<g id="node1" class="node">
<title>comp_16</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="458,-502.8 48,-502.8 48,-322.8 458,-322.8 458,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="64.05" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;16 AICS&#45;001&#45;009&#45;双通道在线客服底座</text>
</g>
<!-- comp_17 -->
<g id="node2" class="node">
<title>comp_17</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="894.33,-502.8 567.67,-502.8 567.67,-322.8 894.33,-322.8 894.33,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="583.73" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;17 AICS&#45;010&#45;015&#45;人工接待</text>
</g>
<!-- comp_18 -->
<g id="node3" class="node">
<title>comp_18</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1347.66,-502.8 1004.34,-502.8 1004.34,-322.8 1347.66,-322.8 1347.66,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1020.39" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;18 AICS&#45;016&#45;025&#45;智能体接待</text>
</g>
<!-- comp_19 -->
<g id="node4" class="node">
<title>comp_19</title>
<polygon fill="#64748b" stroke="#475569" stroke-width="0" points="1834.33,-502.8 1457.67,-502.8 1457.67,-322.8 1834.33,-322.8 1834.33,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1473.72" y="-404.8" font-family="Arial" font-size="20.00" fill="#f8fafc">COMP&#45;19 AICS&#45;026&#45;029&#45;基础设置与报表</text>
</g>
<!-- layerbiz -->
<g id="node5" class="node">
<title>layerbiz</title>
<polygon fill="#3b82f6" stroke="#2563eb" stroke-width="0" points="1113.02,-180 792.98,-180 792.98,0 1113.02,0 1113.02,-180"/>
<text xml:space="preserve" text-anchor="start" x="858.54" y="-82" font-family="Arial" font-size="20.00" fill="#eff6ff">业务层 · 场景与业务能力</text>
</g>
<!-- comp_16&#45;&gt;layerbiz -->
<g id="edge1" class="edge">
<title>comp_16&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M429.35,-322.84C457.23,-309.2 485.82,-295.46 513,-282.8 601.65,-241.52 701.48,-197.78 783.62,-162.51"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="784.4,-165.03 790.26,-159.67 782.33,-160.21 784.4,-165.03"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="596.53,-240 596.53,-262.8 625.87,-262.8 625.87,-240 596.53,-240"/>
<text xml:space="preserve" text-anchor="start" x="599.53" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_17&#45;&gt;layerbiz -->
<g id="edge2" class="edge">
<title>comp_17&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M792.54,-322.87C821.48,-281.06 856.04,-231.11 885.67,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="887.7,-189.98 889.81,-182.32 883.38,-186.99 887.7,-189.98"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="848.66,-240 848.66,-262.8 877.99,-262.8 877.99,-240 848.66,-240"/>
<text xml:space="preserve" text-anchor="start" x="851.66" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_18&#45;&gt;layerbiz -->
<g id="edge3" class="edge">
<title>comp_18&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1114.18,-322.87C1085.12,-281.06 1050.39,-231.11 1020.63,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1022.91,-186.98 1016.48,-182.32 1018.6,-189.97 1022.91,-186.98"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1071.19,-240 1071.19,-262.8 1100.52,-262.8 1100.52,-240 1071.19,-240"/>
<text xml:space="preserve" text-anchor="start" x="1074.19" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
<!-- comp_19&#45;&gt;layerbiz -->
<g id="edge4" class="edge">
<title>comp_19&#45;&gt;layerbiz</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1483.25,-322.96C1456.63,-309.14 1429.18,-295.3 1403,-282.8 1311.5,-239.11 1207.46,-194.45 1122.48,-159.23"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1123.74,-156.91 1115.81,-156.47 1121.73,-161.76 1123.74,-156.91"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1354.97,-240 1354.97,-262.8 1384.31,-262.8 1384.31,-240 1354.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="1357.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">实现</text>
</g>
</g>
</svg>
`;case`view_1gd4uha`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="4220pt" height="533pt"
 viewBox="0.00 0.00 4220.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_001_002 -->
<g id="node1" class="node">
<title>aip_001_002</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="59.42" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;001&#45;002 商品库管理</text>
</g>
<!-- s_01 -->
<g id="node2" class="node">
<title>s_01</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2255.04,-180 1935,-180 1935,0 2255.04,0 2255.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="2012.77" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;01 供应商推品上架</text>
</g>
<!-- aip_003_004 -->
<g id="node3" class="node">
<title>aip_003_004</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="497.75" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;003&#45;004 类目治理</text>
</g>
<!-- aip_005_006 -->
<g id="node4" class="node">
<title>aip_005_006</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="927.75" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;005&#45;006 属性治理</text>
</g>
<!-- aip_007 -->
<g id="node5" class="node">
<title>aip_007</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1610.04,-502.8 1290,-502.8 1290,-322.8 1610.04,-322.8 1610.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1361.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;007 商品图文审核</text>
</g>
<!-- aip_008 -->
<g id="node6" class="node">
<title>aip_008</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2040.04,-502.8 1720,-502.8 1720,-322.8 2040.04,-322.8 2040.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1782.76" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;008 描述规范性校验</text>
</g>
<!-- aip_009 -->
<g id="node7" class="node">
<title>aip_009</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2470.04,-502.8 2150,-502.8 2150,-322.8 2470.04,-322.8 2470.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2204.43" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;009 审核结果分类展示</text>
</g>
<!-- aip_010 -->
<g id="node8" class="node">
<title>aip_010</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2900.04,-502.8 2580,-502.8 2580,-322.8 2900.04,-322.8 2900.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2651.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;010 同款精确匹配</text>
</g>
<!-- aip_011 -->
<g id="node9" class="node">
<title>aip_011</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="3330.04,-502.8 3010,-502.8 3010,-322.8 3330.04,-322.8 3330.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="3073.87" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;011 SEO 标题生成</text>
</g>
<!-- aip_012 -->
<g id="node10" class="node">
<title>aip_012</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="3760.04,-502.8 3440,-502.8 3440,-322.8 3760.04,-322.8 3760.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="3511.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;012 属性自动提取</text>
</g>
<!-- aip_013 -->
<g id="node11" class="node">
<title>aip_013</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="4190.04,-502.8 3870,-502.8 3870,-322.8 4190.04,-322.8 4190.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="3932.76" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;013 属性合理性检测</text>
</g>
<!-- aip_001_002&#45;&gt;s_01 -->
<g id="edge1" class="edge">
<title>aip_001_002&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.87,-340.36C338.24,-333.74 356.88,-327.69 375.02,-322.8 929.85,-173.29 1612.57,-117.9 1924.72,-99.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1924.85,-101.99 1932.19,-98.93 1924.55,-96.75 1924.85,-101.99"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="698.07,-240 698.07,-262.8 727.41,-262.8 727.41,-240 698.07,-240"/>
<text xml:space="preserve" text-anchor="start" x="701.07" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_003_004&#45;&gt;s_01 -->
<g id="edge2" class="edge">
<title>aip_003_004&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M749.8,-341.27C768.22,-334.45 786.9,-328.11 805.02,-322.8 1197.81,-207.67 1675.52,-139.88 1924.87,-109.76"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1924.97,-112.39 1932.11,-108.89 1924.35,-107.18 1924.97,-112.39"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1118.33,-240 1118.33,-262.8 1147.67,-262.8 1147.67,-240 1118.33,-240"/>
<text xml:space="preserve" text-anchor="start" x="1121.33" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_005_006&#45;&gt;s_01 -->
<g id="edge3" class="edge">
<title>aip_005_006&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1180,-342.92C1198.42,-335.78 1217.04,-328.91 1235.02,-322.8 1470.72,-242.63 1750.1,-171.61 1925,-129.95"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1925.43,-132.55 1932.12,-128.26 1924.22,-127.44 1925.43,-132.55"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1492.07,-240 1492.07,-262.8 1521.4,-262.8 1521.4,-240 1492.07,-240"/>
<text xml:space="preserve" text-anchor="start" x="1495.07" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_007&#45;&gt;s_01 -->
<g id="edge4" class="edge">
<title>aip_007&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1609.87,-332.3C1705.92,-284.53 1828.04,-223.79 1925.72,-175.2"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1926.84,-177.58 1932.39,-171.89 1924.51,-172.88 1926.84,-177.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1791.86,-240 1791.86,-262.8 1821.2,-262.8 1821.2,-240 1791.86,-240"/>
<text xml:space="preserve" text-anchor="start" x="1794.86" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_008&#45;&gt;s_01 -->
<g id="edge5" class="edge">
<title>aip_008&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1939.62,-322.87C1967.59,-281.14 2000.98,-231.31 2029.64,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2031.81,-190.04 2033.8,-182.34 2027.45,-187.11 2031.81,-190.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1993.97,-240 1993.97,-262.8 2023.3,-262.8 2023.3,-240 1993.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="1996.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_009&#45;&gt;s_01 -->
<g id="edge6" class="edge">
<title>aip_009&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2250.42,-322.87C2222.45,-281.14 2189.06,-231.31 2160.4,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2162.59,-187.11 2156.24,-182.34 2158.23,-190.04 2162.59,-187.11"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2208.97,-240 2208.97,-262.8 2238.3,-262.8 2238.3,-240 2208.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="2211.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_010&#45;&gt;s_01 -->
<g id="edge7" class="edge">
<title>aip_010&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2580.17,-332.3C2484.12,-284.53 2362,-223.79 2264.32,-175.2"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2265.53,-172.88 2257.65,-171.89 2263.2,-177.58 2265.53,-172.88"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2436.86,-240 2436.86,-262.8 2466.2,-262.8 2466.2,-240 2436.86,-240"/>
<text xml:space="preserve" text-anchor="start" x="2439.86" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_011&#45;&gt;s_01 -->
<g id="edge8" class="edge">
<title>aip_011&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3010.04,-342.92C2991.62,-335.78 2973,-328.91 2955.02,-322.8 2719.32,-242.63 2439.94,-171.61 2265.04,-129.95"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2265.82,-127.44 2257.92,-128.26 2264.61,-132.55 2265.82,-127.44"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2745.38,-240 2745.38,-262.8 2774.72,-262.8 2774.72,-240 2745.38,-240"/>
<text xml:space="preserve" text-anchor="start" x="2748.38" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_012&#45;&gt;s_01 -->
<g id="edge9" class="edge">
<title>aip_012&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3440.24,-341.27C3421.82,-334.45 3403.14,-328.11 3385.02,-322.8 2992.23,-207.67 2514.52,-139.88 2265.17,-109.76"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2265.69,-107.18 2257.93,-108.89 2265.07,-112.39 2265.69,-107.18"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3142.61,-240 3142.61,-262.8 3171.94,-262.8 3171.94,-240 3142.61,-240"/>
<text xml:space="preserve" text-anchor="start" x="3145.61" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_013&#45;&gt;s_01 -->
<g id="edge10" class="edge">
<title>aip_013&#45;&gt;s_01</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3870.17,-340.36C3851.8,-333.74 3833.16,-327.69 3815.02,-322.8 3260.19,-173.29 2577.47,-117.9 2265.32,-99.37"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="2265.49,-96.75 2257.85,-98.93 2265.19,-101.99 2265.49,-96.75"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="3539.03,-240 3539.03,-262.8 3568.36,-262.8 3568.36,-240 3539.03,-240"/>
<text xml:space="preserve" text-anchor="start" x="3542.03" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_jert70`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1210pt" height="533pt"
 viewBox="0.00 0.00 1210.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_015 -->
<g id="node1" class="node">
<title>aip_015</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="46.09" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;015 智能分词与语义理解</text>
</g>
<!-- s_02 -->
<g id="node2" class="node">
<title>s_02</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-180 430,-180 430,0 750.04,0 750.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="499.44" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;02 自然语言找货下单</text>
</g>
<!-- aip_024_028 -->
<g id="node3" class="node">
<title>aip_024_028</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="485.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;024&#45;028 AI 对话导购</text>
</g>
<!-- aip_029_031 -->
<g id="node4" class="node">
<title>aip_029_031</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="915.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;029&#45;031 AI 猜你喜欢</text>
</g>
<!-- aip_015&#45;&gt;s_02 -->
<g id="edge1" class="edge">
<title>aip_015&#45;&gt;s_02</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M279.23,-322.87C336.32,-280.27 404.74,-229.23 462.83,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="464.09,-188.23 468.53,-181.64 460.95,-184.02 464.09,-188.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="387.91,-240 387.91,-262.8 417.25,-262.8 417.25,-240 387.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="390.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_024_028&#45;&gt;s_02 -->
<g id="edge2" class="edge">
<title>aip_024_028&#45;&gt;s_02</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M590.02,-322.87C590.02,-281.67 590.02,-232.56 590.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="592.65,-190.36 590.02,-182.86 587.4,-190.36 592.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="590.02,-240 590.02,-262.8 619.36,-262.8 619.36,-240 590.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="593.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_029_031&#45;&gt;s_02 -->
<g id="edge3" class="edge">
<title>aip_029_031&#45;&gt;s_02</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M900.81,-322.87C843.72,-280.27 775.3,-229.23 717.21,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="719.09,-184.02 711.51,-181.64 715.95,-188.23 719.09,-184.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="817.91,-240 817.91,-262.8 847.25,-262.8 847.25,-240 817.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="820.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_4s0pxq`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="3374pt" height="533pt"
 viewBox="0.00 0.00 3374.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_010 -->
<g id="node1" class="node">
<title>aip_010</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="71.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;010 同款精确匹配</text>
</g>
<!-- s_03 -->
<g id="node2" class="node">
<title>s_03</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1828.04,-180 1508,-180 1508,0 1828.04,0 1828.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="1585.77" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;03 关键词搜索比选</text>
</g>
<!-- aip_011 -->
<g id="node3" class="node">
<title>aip_011</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="493.87" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;011 SEO 标题生成</text>
</g>
<!-- aip_015 -->
<g id="node4" class="node">
<title>aip_015</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="906.09" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;015 智能分词与语义理解</text>
</g>
<!-- aip_016_017 -->
<g id="node5" class="node">
<title>aip_016_017</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1610.04,-502.8 1290,-502.8 1290,-322.8 1610.04,-322.8 1610.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1316.08" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;016&#45;017 输入补全与智能纠错</text>
</g>
<!-- aip_018_020 -->
<g id="node6" class="node">
<title>aip_018_020</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2053.69,-502.8 1720.35,-502.8 1720.35,-322.8 2053.69,-322.8 2053.69,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1736.41" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;018&#45;020 类目品牌筛选与属性聚合</text>
</g>
<!-- aip_021 -->
<g id="node7" class="node">
<title>aip_021</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2484.04,-502.8 2164,-502.8 2164,-322.8 2484.04,-322.8 2484.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2243.43" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;021 多维度排序</text>
</g>
<!-- aip_022_023 -->
<g id="node8" class="node">
<title>aip_022_023</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2914.04,-502.8 2594,-502.8 2594,-322.8 2914.04,-322.8 2914.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2620.08" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;022&#45;023 类目与品牌自动推荐</text>
</g>
<!-- aip_029_031 -->
<g id="node9" class="node">
<title>aip_029_031</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="3344.04,-502.8 3024,-502.8 3024,-322.8 3344.04,-322.8 3344.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="3079.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;029&#45;031 AI 猜你喜欢</text>
</g>
<!-- aip_010&#45;&gt;s_03 -->
<g id="edge1" class="edge">
<title>aip_010&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.8,-341.26C338.22,-334.45 356.9,-328.11 375.02,-322.8 768.98,-207.41 1248.2,-139.69 1497.99,-109.65"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1498.11,-112.28 1505.24,-108.78 1497.48,-107.06 1498.11,-112.28"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="689.06,-240 689.06,-262.8 718.39,-262.8 718.39,-240 689.06,-240"/>
<text xml:space="preserve" text-anchor="start" x="692.06" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_011&#45;&gt;s_03 -->
<g id="edge2" class="edge">
<title>aip_011&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M749.99,-342.91C768.42,-335.77 787.04,-328.91 805.02,-322.8 1041.88,-242.35 1322.74,-171.28 1498.2,-129.7"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1498.66,-132.28 1505.35,-128 1497.45,-127.18 1498.66,-132.28"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1062.95,-240 1062.95,-262.8 1092.29,-262.8 1092.29,-240 1062.95,-240"/>
<text xml:space="preserve" text-anchor="start" x="1065.95" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_015&#45;&gt;s_03 -->
<g id="edge3" class="edge">
<title>aip_015&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1179.78,-332.71C1276.73,-284.71 1400.34,-223.52 1498.92,-174.71"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1499.81,-177.2 1505.37,-171.52 1497.48,-172.5 1499.81,-177.2"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1363.45,-240 1363.45,-262.8 1392.79,-262.8 1392.79,-240 1363.45,-240"/>
<text xml:space="preserve" text-anchor="start" x="1366.45" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_016_017&#45;&gt;s_03 -->
<g id="edge4" class="edge">
<title>aip_016_017&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1510.46,-322.87C1538.87,-281.06 1572.81,-231.11 1601.9,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1603.91,-190.01 1605.95,-182.33 1599.57,-187.06 1603.91,-190.01"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1565.56,-240 1565.56,-262.8 1594.89,-262.8 1594.89,-240 1565.56,-240"/>
<text xml:space="preserve" text-anchor="start" x="1568.56" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_018_020&#45;&gt;s_03 -->
<g id="edge5" class="edge">
<title>aip_018_020&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1826.31,-322.87C1797.77,-281.06 1763.67,-231.11 1734.44,-188.29"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1736.76,-187.04 1730.37,-182.33 1732.43,-190 1736.76,-187.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1784.09,-240 1784.09,-262.8 1813.42,-262.8 1813.42,-240 1784.09,-240"/>
<text xml:space="preserve" text-anchor="start" x="1787.09" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_021&#45;&gt;s_03 -->
<g id="edge6" class="edge">
<title>aip_021&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2164.38,-333.73C2065.27,-285.26 1938.01,-223.03 1837.17,-173.72"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1838.41,-171.4 1830.52,-170.47 1836.11,-176.12 1838.41,-171.4"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2015.69,-240 2015.69,-262.8 2045.03,-262.8 2045.03,-240 2015.69,-240"/>
<text xml:space="preserve" text-anchor="start" x="2018.69" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_022_023&#45;&gt;s_03 -->
<g id="edge7" class="edge">
<title>aip_022_023&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2594.06,-342.87C2575.63,-335.74 2557.01,-328.89 2539.02,-322.8 2299.29,-241.68 2014.82,-170.54 1837.83,-129.14"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1838.49,-126.6 1830.59,-127.46 1837.3,-131.72 1838.49,-126.6"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2326.74,-240 2326.74,-262.8 2356.08,-262.8 2356.08,-240 2326.74,-240"/>
<text xml:space="preserve" text-anchor="start" x="2329.74" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_029_031&#45;&gt;s_03 -->
<g id="edge8" class="edge">
<title>aip_029_031&#45;&gt;s_03</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M3024.25,-341.24C3005.82,-334.43 2987.15,-328.1 2969.02,-322.8 2572.23,-206.81 2089.46,-139.26 1838.33,-109.43"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1838.78,-106.84 1831.03,-108.56 1838.17,-112.05 1838.78,-106.84"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2724.55,-240 2724.55,-262.8 2753.88,-262.8 2753.88,-240 2724.55,-240"/>
<text xml:space="preserve" text-anchor="start" x="2727.55" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_16urqmg`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="2070pt" height="533pt"
 viewBox="0.00 0.00 2070.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aics_001_009 -->
<g id="node1" class="node">
<title>aics_001_009</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="43.86" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;001&#45;009 在线客服底座</text>
</g>
<!-- s_04 -->
<g id="node2" class="node">
<title>s_04</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-180 860,-180 860,0 1180.04,0 1180.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="946.11" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;04 客服咨询即答</text>
</g>
<!-- aics_010_015 -->
<g id="node3" class="node">
<title>aics_010_015</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="490.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;010&#45;015 人工接待</text>
</g>
<!-- aics_016_017 -->
<g id="node4" class="node">
<title>aics_016_017</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="895.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;016&#45;017 意图识别与转接</text>
</g>
<!-- aics_018_019 -->
<g id="node5" class="node">
<title>aics_018_019</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1610.04,-502.8 1290,-502.8 1290,-322.8 1610.04,-322.8 1610.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1325.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;018&#45;019 智能体业务应答</text>
</g>
<!-- aics_020_023 -->
<g id="node6" class="node">
<title>aics_020_023</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2040.04,-502.8 1720,-502.8 1720,-322.8 2040.04,-322.8 2040.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1772.2" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;020&#45;023 知识库管理</text>
</g>
<!-- aics_001_009&#45;&gt;s_04 -->
<g id="edge1" class="edge">
<title>aics_001_009&#45;&gt;s_04</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.94,-344.62C338.46,-337.13 357.12,-329.72 375.02,-322.8 535.28,-260.87 719.94,-195.06 850.5,-149.45"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="851.13,-152.01 857.34,-147.06 849.4,-147.06 851.13,-152.01"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="586.81,-240 586.81,-262.8 616.15,-262.8 616.15,-240 586.81,-240"/>
<text xml:space="preserve" text-anchor="start" x="589.81" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_010_015&#45;&gt;s_04 -->
<g id="edge2" class="edge">
<title>aics_010_015&#45;&gt;s_04</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M709.23,-322.87C766.32,-280.27 834.74,-229.23 892.83,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="894.09,-188.23 898.53,-181.64 890.95,-184.02 894.09,-188.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="817.91,-240 817.91,-262.8 847.25,-262.8 847.25,-240 817.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="820.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_016_017&#45;&gt;s_04 -->
<g id="edge3" class="edge">
<title>aics_016_017&#45;&gt;s_04</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1020.02,-322.87C1020.02,-281.67 1020.02,-232.56 1020.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1022.65,-190.36 1020.02,-182.86 1017.4,-190.36 1022.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1020.02,-240 1020.02,-262.8 1049.36,-262.8 1049.36,-240 1020.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="1023.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_018_019&#45;&gt;s_04 -->
<g id="edge4" class="edge">
<title>aics_018_019&#45;&gt;s_04</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1330.81,-322.87C1273.72,-280.27 1205.3,-229.23 1147.21,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1149.09,-184.02 1141.51,-181.64 1145.95,-188.23 1149.09,-184.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1247.91,-240 1247.91,-262.8 1277.25,-262.8 1277.25,-240 1247.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="1250.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_020_023&#45;&gt;s_04 -->
<g id="edge5" class="edge">
<title>aics_020_023&#45;&gt;s_04</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1720.1,-344.62C1701.58,-337.13 1682.92,-329.72 1665.02,-322.8 1504.76,-260.87 1320.1,-195.06 1189.54,-149.45"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1190.64,-147.06 1182.7,-147.06 1188.91,-152.01 1190.64,-147.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1488.83,-240 1488.83,-262.8 1518.17,-262.8 1518.17,-240 1488.83,-240"/>
<text xml:space="preserve" text-anchor="start" x="1491.83" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_tzcksm`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1210pt" height="533pt"
 viewBox="0.00 0.00 1210.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aics_001_009 -->
<g id="node1" class="node">
<title>aics_001_009</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="43.86" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;001&#45;009 在线客服底座</text>
</g>
<!-- s_05 -->
<g id="node2" class="node">
<title>s_05</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-180 430,-180 430,0 750.04,0 750.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="516.11" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;05 售后与转人工</text>
</g>
<!-- aics_010_015 -->
<g id="node3" class="node">
<title>aics_010_015</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="490.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;010&#45;015 人工接待</text>
</g>
<!-- aics_016_017 -->
<g id="node4" class="node">
<title>aics_016_017</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="895.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;016&#45;017 意图识别与转接</text>
</g>
<!-- aics_001_009&#45;&gt;s_05 -->
<g id="edge1" class="edge">
<title>aics_001_009&#45;&gt;s_05</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M279.23,-322.87C336.32,-280.27 404.74,-229.23 462.83,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="464.09,-188.23 468.53,-181.64 460.95,-184.02 464.09,-188.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="387.91,-240 387.91,-262.8 417.25,-262.8 417.25,-240 387.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="390.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_010_015&#45;&gt;s_05 -->
<g id="edge2" class="edge">
<title>aics_010_015&#45;&gt;s_05</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M590.02,-322.87C590.02,-281.67 590.02,-232.56 590.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="592.65,-190.36 590.02,-182.86 587.4,-190.36 592.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="590.02,-240 590.02,-262.8 619.36,-262.8 619.36,-240 590.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="593.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_016_017&#45;&gt;s_05 -->
<g id="edge3" class="edge">
<title>aics_016_017&#45;&gt;s_05</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M900.81,-322.87C843.72,-280.27 775.3,-229.23 717.21,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="719.09,-184.02 711.51,-181.64 715.95,-188.23 719.09,-184.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="817.91,-240 817.91,-262.8 847.25,-262.8 847.25,-240 817.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="820.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_1w23lhg`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="350pt" height="533pt"
 viewBox="0.00 0.00 350.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_014 -->
<g id="node1" class="node">
<title>aip_014</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="71.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;014 集采合规管控</text>
</g>
<!-- s_06 -->
<g id="node2" class="node">
<title>s_06</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-180 0,-180 0,0 320.04,0 320.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="69.44" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;06 集采专区合规采买</text>
</g>
<!-- aip_014&#45;&gt;s_06 -->
<g id="edge1" class="edge">
<title>aip_014&#45;&gt;s_06</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M160.02,-322.87C160.02,-281.67 160.02,-232.56 160.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="162.65,-190.36 160.02,-182.86 157.4,-190.36 162.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="160.02,-240 160.02,-262.8 189.36,-262.8 189.36,-240 160.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="163.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_16z2nwd`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="2930pt" height="533pt"
 viewBox="0.00 0.00 2930.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_001_002 -->
<g id="node1" class="node">
<title>aip_001_002</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="59.42" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;001&#45;002 商品库管理</text>
</g>
<!-- s_07 -->
<g id="node2" class="node">
<title>s_07</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1610.04,-180 1290,-180 1290,0 1610.04,0 1610.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="1359.44" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;07 存量商品清洗治理</text>
</g>
<!-- aip_003_004 -->
<g id="node3" class="node">
<title>aip_003_004</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="497.75" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;003&#45;004 类目治理</text>
</g>
<!-- aip_005_006 -->
<g id="node4" class="node">
<title>aip_005_006</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="927.75" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;005&#45;006 属性治理</text>
</g>
<!-- aip_008 -->
<g id="node5" class="node">
<title>aip_008</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1610.04,-502.8 1290,-502.8 1290,-322.8 1610.04,-322.8 1610.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1352.76" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;008 描述规范性校验</text>
</g>
<!-- aip_010 -->
<g id="node6" class="node">
<title>aip_010</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2040.04,-502.8 1720,-502.8 1720,-322.8 2040.04,-322.8 2040.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1791.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;010 同款精确匹配</text>
</g>
<!-- aip_012 -->
<g id="node7" class="node">
<title>aip_012</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2470.04,-502.8 2150,-502.8 2150,-322.8 2470.04,-322.8 2470.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2221.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;012 属性自动提取</text>
</g>
<!-- aip_013 -->
<g id="node8" class="node">
<title>aip_013</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="2900.04,-502.8 2580,-502.8 2580,-322.8 2900.04,-322.8 2900.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="2642.76" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;013 属性合理性检测</text>
</g>
<!-- aip_001_002&#45;&gt;s_07 -->
<g id="edge1" class="edge">
<title>aip_001_002&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.99,-341.89C338.38,-334.96 356.99,-328.42 375.02,-322.8 688.54,-224.98 1066.1,-153.96 1280.08,-117.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1280.2,-120.53 1287.16,-116.7 1279.33,-115.35 1280.2,-120.53"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="665.99,-240 665.99,-262.8 695.32,-262.8 695.32,-240 665.99,-240"/>
<text xml:space="preserve" text-anchor="start" x="668.99" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_003_004&#45;&gt;s_07 -->
<g id="edge2" class="edge">
<title>aip_003_004&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M749.94,-344.62C768.46,-337.13 787.12,-329.72 805.02,-322.8 965.28,-260.87 1149.94,-195.06 1280.5,-149.45"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1281.13,-152.01 1287.34,-147.06 1279.4,-147.06 1281.13,-152.01"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1016.81,-240 1016.81,-262.8 1046.15,-262.8 1046.15,-240 1016.81,-240"/>
<text xml:space="preserve" text-anchor="start" x="1019.81" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_005_006&#45;&gt;s_07 -->
<g id="edge3" class="edge">
<title>aip_005_006&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1139.23,-322.87C1196.32,-280.27 1264.74,-229.23 1322.83,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1324.09,-188.23 1328.53,-181.64 1320.95,-184.02 1324.09,-188.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1247.91,-240 1247.91,-262.8 1277.25,-262.8 1277.25,-240 1247.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="1250.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_008&#45;&gt;s_07 -->
<g id="edge4" class="edge">
<title>aip_008&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1450.02,-322.87C1450.02,-281.67 1450.02,-232.56 1450.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1452.65,-190.36 1450.02,-182.86 1447.4,-190.36 1452.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1450.02,-240 1450.02,-262.8 1479.36,-262.8 1479.36,-240 1450.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="1453.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_010&#45;&gt;s_07 -->
<g id="edge5" class="edge">
<title>aip_010&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1760.81,-322.87C1703.72,-280.27 1635.3,-229.23 1577.21,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1579.09,-184.02 1571.51,-181.64 1575.95,-188.23 1579.09,-184.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1677.91,-240 1677.91,-262.8 1707.25,-262.8 1707.25,-240 1677.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="1680.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_012&#45;&gt;s_07 -->
<g id="edge6" class="edge">
<title>aip_012&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2150.1,-344.62C2131.58,-337.13 2112.92,-329.72 2095.02,-322.8 1934.76,-260.87 1750.1,-195.06 1619.54,-149.45"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1620.64,-147.06 1612.7,-147.06 1618.91,-152.01 1620.64,-147.06"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1918.83,-240 1918.83,-262.8 1948.17,-262.8 1948.17,-240 1918.83,-240"/>
<text xml:space="preserve" text-anchor="start" x="1921.83" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_013&#45;&gt;s_07 -->
<g id="edge7" class="edge">
<title>aip_013&#45;&gt;s_07</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M2580.05,-341.89C2561.66,-334.96 2543.05,-328.42 2525.02,-322.8 2211.5,-224.98 1833.94,-153.96 1619.96,-117.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="1620.71,-115.35 1612.88,-116.7 1619.84,-120.53 1620.71,-115.35"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="2293.24,-240 2293.24,-262.8 2322.58,-262.8 2322.58,-240 2293.24,-240"/>
<text xml:space="preserve" text-anchor="start" x="2296.24" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_118uz77`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1640pt" height="533pt"
 viewBox="0.00 0.00 1640.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_021 -->
<g id="node1" class="node">
<title>aip_021</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="79.43" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;021 多维度排序</text>
</g>
<!-- s_08 -->
<g id="node2" class="node">
<title>s_08</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="965.04,-180 645,-180 645,0 965.04,0 965.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="714.44" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;08 数据飞轮持续优化</text>
</g>
<!-- aip_022_023 -->
<g id="node3" class="node">
<title>aip_022_023</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="456.08" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;022&#45;023 类目与品牌自动推荐</text>
</g>
<!-- aip_029_031 -->
<g id="node4" class="node">
<title>aip_029_031</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="915.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;029&#45;031 AI 猜你喜欢</text>
</g>
<!-- aics_020_023 -->
<g id="node5" class="node">
<title>aics_020_023</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1610.04,-502.8 1290,-502.8 1290,-322.8 1610.04,-322.8 1610.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="1342.2" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;020&#45;023 知识库管理</text>
</g>
<!-- aip_021&#45;&gt;s_08 -->
<g id="edge1" class="edge">
<title>aip_021&#45;&gt;s_08</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M319.87,-332.3C415.92,-284.53 538.04,-223.79 635.72,-175.2"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="636.84,-177.58 642.39,-171.89 634.51,-172.88 636.84,-177.58"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="501.86,-240 501.86,-262.8 531.2,-262.8 531.2,-240 501.86,-240"/>
<text xml:space="preserve" text-anchor="start" x="504.86" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_022_023&#45;&gt;s_08 -->
<g id="edge2" class="edge">
<title>aip_022_023&#45;&gt;s_08</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M649.62,-322.87C677.59,-281.14 710.98,-231.31 739.64,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="741.81,-190.04 743.8,-182.34 737.45,-187.11 741.81,-190.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="703.97,-240 703.97,-262.8 733.3,-262.8 733.3,-240 703.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="706.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_029_031&#45;&gt;s_08 -->
<g id="edge3" class="edge">
<title>aip_029_031&#45;&gt;s_08</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M960.42,-322.87C932.45,-281.14 899.06,-231.31 870.4,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="872.59,-187.11 866.24,-182.34 868.23,-190.04 872.59,-187.11"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="918.97,-240 918.97,-262.8 948.3,-262.8 948.3,-240 918.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="921.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_020_023&#45;&gt;s_08 -->
<g id="edge4" class="edge">
<title>aics_020_023&#45;&gt;s_08</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M1290.17,-332.3C1194.12,-284.53 1072,-223.79 974.32,-175.2"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="975.53,-172.88 967.65,-171.89 973.2,-177.58 975.53,-172.88"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="1146.86,-240 1146.86,-262.8 1176.2,-262.8 1176.2,-240 1146.86,-240"/>
<text xml:space="preserve" text-anchor="start" x="1149.86" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_apzddd`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="780pt" height="533pt"
 viewBox="0.00 0.00 780.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aip_007 -->
<g id="node1" class="node">
<title>aip_007</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="71.1" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;007 商品图文审核</text>
</g>
<!-- s_09 -->
<g id="node2" class="node">
<title>s_09</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="535.04,-180 215,-180 215,0 535.04,0 535.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="267.77" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;09 审核运营与供应商协同</text>
</g>
<!-- aip_009 -->
<g id="node3" class="node">
<title>aip_009</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="484.43" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AIP&#45;009 审核结果分类展示</text>
</g>
<!-- aip_007&#45;&gt;s_09 -->
<g id="edge1" class="edge">
<title>aip_007&#45;&gt;s_09</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M219.62,-322.87C247.59,-281.14 280.98,-231.31 309.64,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="311.81,-190.04 313.8,-182.34 307.45,-187.11 311.81,-190.04"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="273.97,-240 273.97,-262.8 303.3,-262.8 303.3,-240 273.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="276.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aip_009&#45;&gt;s_09 -->
<g id="edge2" class="edge">
<title>aip_009&#45;&gt;s_09</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M530.42,-322.87C502.45,-281.14 469.06,-231.31 440.4,-188.56"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="442.59,-187.11 436.24,-182.34 438.23,-190.04 442.59,-187.11"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="488.97,-240 488.97,-262.8 518.3,-262.8 518.3,-240 488.97,-240"/>
<text xml:space="preserve" text-anchor="start" x="491.97" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;case`view_xejlug`:return`<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<!-- Generated by graphviz version 15.0.0 (0)
 -->
<!-- Pages: 1 -->
<svg width="1210pt" height="533pt"
 viewBox="0.00 0.00 1210.00 533.00" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(15.05 517.85)">
<!-- aics_024_025 -->
<g id="node1" class="node">
<title>aics_024_025</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="320.04,-502.8 0,-502.8 0,-322.8 320.04,-322.8 320.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="43.86" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;024&#45;025 智能客服维护</text>
</g>
<!-- s_10 -->
<g id="node2" class="node">
<title>s_10</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-180 430,-180 430,0 750.04,0 750.04,-180"/>
<text xml:space="preserve" text-anchor="start" x="516.11" y="-82" font-family="Arial" font-size="20.00" fill="#f0f9ff">S&#45;10 客服运营管理</text>
</g>
<!-- aics_026_028 -->
<g id="node3" class="node">
<title>aics_026_028</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="750.04,-502.8 430,-502.8 430,-322.8 750.04,-322.8 750.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="490.53" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;026&#45;028 基础设置</text>
</g>
<!-- aics_029 -->
<g id="node4" class="node">
<title>aics_029</title>
<polygon fill="#0284c7" stroke="#0369a1" stroke-width="0" points="1180.04,-502.8 860,-502.8 860,-322.8 1180.04,-322.8 1180.04,-502.8"/>
<text xml:space="preserve" text-anchor="start" x="940.55" y="-404.8" font-family="Arial" font-size="20.00" fill="#f0f9ff">AICS&#45;029 报表分析</text>
</g>
<!-- aics_024_025&#45;&gt;s_10 -->
<g id="edge1" class="edge">
<title>aics_024_025&#45;&gt;s_10</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M279.23,-322.87C336.32,-280.27 404.74,-229.23 462.83,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="464.09,-188.23 468.53,-181.64 460.95,-184.02 464.09,-188.23"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="387.91,-240 387.91,-262.8 417.25,-262.8 417.25,-240 387.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="390.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_026_028&#45;&gt;s_10 -->
<g id="edge2" class="edge">
<title>aics_026_028&#45;&gt;s_10</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M590.02,-322.87C590.02,-281.67 590.02,-232.56 590.02,-190.17"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="592.65,-190.36 590.02,-182.86 587.4,-190.36 592.65,-190.36"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="590.02,-240 590.02,-262.8 619.36,-262.8 619.36,-240 590.02,-240"/>
<text xml:space="preserve" text-anchor="start" x="593.02" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
<!-- aics_029&#45;&gt;s_10 -->
<g id="edge3" class="edge">
<title>aics_029&#45;&gt;s_10</title>
<path fill="none" stroke="#8d8d8d" stroke-width="2" stroke-dasharray="5,2" d="M900.81,-322.87C843.72,-280.27 775.3,-229.23 717.21,-185.89"/>
<polygon fill="#8d8d8d" stroke="#8d8d8d" stroke-width="2" points="719.09,-184.02 711.51,-181.64 715.95,-188.23 719.09,-184.02"/>
<polygon fill="#18191b" fill-opacity="0.627451" stroke="none" points="817.91,-240 817.91,-262.8 847.25,-262.8 847.25,-240 817.91,-240"/>
<text xml:space="preserve" text-anchor="start" x="820.91" y="-245.8" font-family="Arial" font-size="14.00" fill="#c9c9c9">满足</text>
</g>
</g>
</svg>
`;default:throw Error(`Unknown viewId: `+e)}};export{e as dotSource,t as svgSource};