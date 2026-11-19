/** Reader-facing workflow: combine implementation steps while preserving decisions and recovery paths. */
export const dataPilotWorkflowGraph = {
  width: 1980, height: 1880,
  stages: [
    { title: '01 / 理解需求', y: 50 },
    { title: '02 / 查询与分析', y: 480 },
    { title: '03 / 生成应用草稿', y: 1080 },
    { title: '04 / 验证与发布', y: 1500 },
  ],
  nodes: [
    ['message', '用户提问', 50, 150, 'input'],
    ['history', '读取已有信息', 590, 150],
    ['intent', '能否直接回答？', 1130, 150, 'decision'],
    ['answer', '输出结论', 1670, 150, 'end'],
    ['clarify', '澄清需求', 1130, 320, 'warning'],
    ['resume', '用户补充信息', 1670, 320, 'input'],

    ['tool', '查询资料与数据', 50, 580],
    ['next', '能否得出结论？', 860, 580, 'decision'],
    ['result', '呈现结论与依据', 1670, 580, 'end'],
    ['requestApp', '用户选择生成或修改', 1670, 820, 'input'],
    ['retry', '调整后重试', 860, 820, 'warning'],
    ['failure', '说明失败或\n返回部分结果', 1265, 820, 'warning'],

    ['write', '生成或修改应用', 50, 1180],
    ['build', '保存并预览草稿', 860, 1180],
    ['saved', '草稿是否可用？', 1670, 1180, 'decision'],
    ['fix', '定位问题并修正', 860, 1340, 'warning'],

    ['valid', '验证是否通过？', 50, 1600, 'decision'],
    ['publish', '是否发布？', 590, 1600, 'decision'],
    ['switched', '发布是否成功？', 1130, 1600, 'decision'],
    ['delivered', '交付应用', 1670, 1600, 'end'],
    ['draft', '保留可编辑草稿', 590, 1770, 'end'],
    ['keep', '保留原有线上版本', 1130, 1770, 'warning'],
  ],
  // Edge paths are explicitly routed so loops and inter-stage connections remain visible.
  edges: [
    ['M270 180H590'], ['M810 180H1130'],
    ['M1350 180H1670', 'Y', 1510, 167],
    ['M1240 218V320', '信息不明确', 1160, 280],
    ['M1350 350H1670'], ['M1890 350H1920V120H1240V142'],
    ['M1130 180H1105V430H25V610H50', '需查询资料或数据', 980, 417],

    ['M270 610H860'], ['M1080 610H1670', 'Y', 1375, 597],
    ['M1780 640V820'],
    ['M970 572V450H1240V380', '需澄清', 1100, 437],
    ['M970 648V820', '可重试', 1020, 750, 'recovery'],
    ['M860 850H25V610H50', undefined, undefined, undefined, 'recovery'],
    ['M1080 850H1265', '无法继续', 1170, 837, 'recovery'],
    ['M1890 850H1920V1050H160V1180'],

    ['M270 1210H860'], ['M1080 1210H1670'],
    ['M1780 1248V1370H1080', 'N', 1745, 1300, 'recovery'],
    ['M860 1370H160V1240', undefined, undefined, undefined, 'recovery'],
    ['M1890 1210H1920V1430H160V1592', 'Y', 1830, 1417],

    ['M270 1630H590', 'Y', 430, 1617],
    ['M810 1630H1130', 'Y', 970, 1617],
    ['M1350 1630H1670', 'Y', 1510, 1617],
    ['M50 1630H25V1460H970V1400', 'N', 65, 1447, 'recovery'],
    ['M700 1668V1770', 'N', 725, 1730],
    ['M1240 1668V1770', 'N', 1265, 1730, 'recovery'],
  ],
} as const
