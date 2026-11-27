/** Illustrative scenario supplied for the case study; not personal delivery facts or chat media. */
export type DataPilotScenario = {
  caption: string
  time: string
  title: string
  summary: string
  note: string
  preparation: { title: string; body: string }[]
  designFocus: { title: string; body: string }[]
  riskNote: string
  steps: {
    id: string; label: string; title: string; status: string
    question: string
    purpose: string
    output: string
    risk: { title: string; body: string }
    risks?: { title: string; body: string }[]
    messages: { role: string; text: string }[]
    metrics: { label: string; value: string; detail: string }[]
    paragraphs: string[]
    takeaway: string
    screenshot: { title: string; src?: string; requirements: string[] }
    references?: { label: string; href: string }[]
  }[]
}

export const productionMorningScenario: DataPilotScenario = {
  caption: '以某集团冰箱工厂生产分析师的诉求为例：',
  time: '08:20',
  title: '晨会前，查清昨天的生产缺口',
  summary: '某冰箱工厂的生产分析师需要回答：昨天少产了多少？缺口集中在哪条线、哪个班次？今天能不能用同一口径继续跟踪？',
  note: '场景示意 · 数字为示例数据，权限与操作按本场景设定，不作为客户实测结果。',
  preparation: [
    { title: '接入数据', body: '数据工程师接入生产计划、MES 产量报工、设备停机日志，在语义中心建立「工厂 → 产线 → 班次 → 工单」的关系。' },
    { title: '区分口径', body: '产量达成率 = 合格入库台数 ÷ 冻结版计划台数；工单完工率 = 已完工工单数 ÷ 计划工单数。' },
    { title: '按岗位授权', body: '管理员配置数据权限：工厂分析师看本厂各产线，班组长只看本班组。能打开同一个 Agent，不代表能查到相同的数据。' },
  ],
  riskNote: '上述体验问题为场景推演中的潜在风险，不代表客户现场观察。',
  designFocus: [
    { title: '分析是否可信', body: 'Agent 是否理解正确，结论是否有依据' },
    { title: '成果是否可用', body: '分析能否转化为可持续使用的应用' },
    { title: '修改是否可控', body: '改了什么、影响哪里、是否生效' },
  ],
  steps: [
    {
      id: 'clarify', label: '提出问题', title: '确认是否达标', status: '第一轮 · 确认后查询',
      question: '“你理解的，是我想问的吗？”',
      purpose: '了解昨日冰箱工厂达标情况',
      output: '将「达标」拆成指标、生产日期、阈值等，回答产量和达成率',
      risk: { title: '用户意图与 Agent 理解不一致：', body: '对于「生产达标」没有明确工厂、时间、指标和达标基准，Agent 直接回答容易错、多次澄清又让人觉得费劲。' },
      messages: [
        { role: '分析师', text: '昨天冰箱线完成率怎么样？没达标的话，差在哪？' },
        { role: 'Agent', text: '你指的是产量达成率，还是工单完工率？' },
        { role: '分析师', text: '看本厂合格入库台数，按冻结版计划。晨会目标是 98%。' },
      ],
      metrics: [
        { label: '产量达成率', value: '94.2%', detail: '9,420 / 10,000 台' },
        { label: '距 98% 晨会目标', value: '380 台', detail: '9,800 − 9,420' },
        { label: '距 100% 生产计划', value: '580 台', detail: '10,000 − 9,420' },
      ],
      paragraphs: ['Agent 检索对应指标口径，在当前身份权限内查询计划与报工数据。'],
      takeaway: '目标缺口与计划缺口分开报，避免把“没达标”和“没完成计划”混为一谈。',
      screenshot: { title: '昨日冰箱工厂生产达标情况与产量结果卡片', src: '/images/dataagent-scenario-clarify-v2.jpg', requirements: [] },
    },
    {
      id: 'breakdown', label: '持续追问', title: '定位缺口', status: '第二轮 · 只读追问',
      question: '“你还记得哪些条件，这次又改了哪些？”',
      purpose: '找出异常的生产线或班次',
      output: '沿用上一轮的日期、工厂和计算口径，按产线、班次拆分统计',
      risk: { title: '上下文继承与变化不透明：', body: '「哪条线」应当下钻看不同产线，却会丢失工厂或时间；而 Agent 输出结果后，用户也不清楚哪些条件仍然生效。' },
      messages: [{ role: '分析师', text: '按产线拆开，差得最多的是哪条？再看看哪个班次。' }],
      metrics: [
        { label: 'A 线计划缺口', value: '150 台', detail: '计划 4,000 · 合格 3,850' },
        { label: 'B 线计划缺口', value: '430 台', detail: '计划 6,000 · 合格 5,570' },
        { label: 'B 线夜班缺口', value: '260 台', detail: 'B 线占全厂计划缺口约 74%' },
      ],
      paragraphs: ['Agent 沿用上一轮的工厂、日期和指标口径，只改变拆分维度。先按产线对比，再定位到 B 线夜班。'],
      takeaway: '这一轮只返回新的分析，不修改指标，也不覆盖已有成果。',
      screenshot: { title: '产线拆分与班次追问', src: '/images/dataagent-scenario-breakdown.jpg', requirements: [] },
    },
    {
      id: 'verify', label: '分析原因', title: '核查原因', status: '第三轮 · 超时与恢复',
      question: '“你凭什么得出这个解释？”',
      purpose: '了解产量不达标的原因',
      output: '调用工具，对照生产记录和设备日志，分析异常原因',
      risk: { title: '分析依据不足，难以区分事实、推测与因果：', body: 'Agent 找到某个指标同时下降，就解释为原因，但用户不知道排查过哪些因素、证据是否充分，以及还需要验证什么。' },
      messages: [{ role: '分析师', text: 'B 线夜班少产，是不是设备停机造成的？' }, { role: 'Agent', text: 'B 线夜班缺口为 260 台。停机记录查询超时，停机原因尚未核实。' }],
      metrics: [{ label: '已核实的缺口', value: '260 台', detail: 'B 线夜班产量' }, { label: '缩小范围后查到', value: '48 分钟', detail: '设备停机，与产量下降时段重合' }],
      paragraphs: ['有权限的工程师打开 Agent 回放，查看超时调用和查询范围。回放只读，不会重新执行工具。分析师将查询范围缩小到 B 线夜班后，查到一条停机记录。', '晨会可优先安排设备组核对；在核对工单报工与停机明细前，不能把 260 台缺口全部归因于停机。'],
      takeaway: '查询超时不等于没有停机；时间重合也不等于因果关系。',
      screenshot: { title: 'B 线夜间生产记录与原因核查', src: '/images/dataagent-scenario-verify.jpg', requirements: [] },
      references: [{ label: '结果核验与回放', href: 'https://docs.oceanbase.com/oceanbase-datapilot/function-matrix' }],
    },
    {
      id: 'draft', label: '生成应用', title: '生成晨会看板', status: '第四轮 · 明确修改草稿',
      question: '“你把哪些内容做成了应用，以后还能用吗？”',
      purpose: '不想每天问一遍，希望把这套分析留下来，还能切换时间',
      output: '保留计算口径，设定可变参数，生成智能应用',
      risk: { title: '一次性的分析难转化为可持续使用的应用：', body: '对话里有多次试探和临时条件，生成时不清楚采用哪个结论、保留哪些图表；“昨天”的数据是固定快照还是每天更新，也容易产生理解偏差。' },
      messages: [{ role: '分析师', text: '做成《冰箱工厂生产晨会看板》。保留达成率、目标缺口和产线班次拆分，按日期和产线筛选。' }, { role: '分析师', text: '只把第二张图改成按班次，不动全局筛选。' }],
      metrics: [{ label: '核验达成率', value: '94.2%', detail: '与手工查询对照' }, { label: '核验目标缺口', value: '380 台', detail: '距 98% 目标' }, { label: '核验计划缺口', value: '580 台', detail: '距 100% 计划' }],
      paragraphs: ['具备构建权限的工程师在 Agent 中生成看板草稿，预览并对照手工查询核验，再用分析师和班组长两种身份检查可见范围。', '“只改第二张图”是对草稿的明确变更。工程师只改目标图并重新核验，全局筛选保持不变。'],
      takeaway: '追问数据与修改应用分开；修改限定对象和范围，核验后再发布。',
      screenshot: { title: '每日生产看板草稿与对话修改', src: '/images/dataagent-scenario-draft.jpg', requirements: [] },
      references: [{ label: '看板构建文档', href: 'https://docs.oceanbase.com/oceanbase-datapilot/build-dashboard' }],
    },

    {
      id: 'edit', label: '修改应用', title: '调整已有应用', status: '第五轮 · 修改与核查',
      question: '“你具体改了哪里，会影响什么，能恢复吗？”',
      purpose: '调整已有应用的展示方式，保留其他内容，并确认修改是否生效',
      output: '识别要修改的图表与范围，调整时间粒度，反馈保存状态与版本变化',
      risk: { title: '修改对象、影响范围与生效状态不明确：', body: '“换成按周看”究竟修改一张图还是整个应用？是否改变计算口径和其他图表？修改是否已保存、是否影响其他使用者、能不能撤回？' },
      messages: [{ role: '分析师', text: '把这张产量趋势图换成按周看，其他图表不变。' }],
      metrics: [],
      paragraphs: ['本步骤为修改应用的场景示意，关注修改对象、影响范围、保存与发布状态，以及恢复原版本的入口。'],
      takeaway: '明确修改对象和影响范围，让用户能核查变更与生效状态。',
      screenshot: { title: '修改应用：查看变更范围与历史版本', src: '/images/datapilot-application-editing.jpg', requirements: [] },
    },
  ],
}
