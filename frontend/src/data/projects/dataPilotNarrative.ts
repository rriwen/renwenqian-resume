import type { DataPilotSection } from './dataPilot'

/** An alternative reading path; original sections remain the source for evidence and metrics. */
export function createDataPilotNarrative(source: DataPilotSection[]): DataPilotSection[] {
  const find = (id: string) => {
    const section = source.find(item => item.id === id)
    if (!section) throw new Error(`Missing Data Agent section: ${id}`)
    return section
  }
  const section = (id: string, title: string, body: string, extra: Partial<DataPilotSection> = {}): DataPilotSection => ({
    id: `narrative-${id}`, index: '', title, intro: '', body, images: [], ...extra,
  })
  const results = find('role')
  const overviewTable = find('overview').table!
  return [
    section('overview', '项目背景',
      'Data Agent 面向业务用户和 BI 分析师，支持用自然语言分析数据，并生成可查看、修改和分享的报告或仪表盘，本文统称为“应用”。', {
      }),
    section('problem', '项目背景',
      '产品最初希望减少找表、编写 SQL 和反复沟通取数的工作。通过内部 BI 用户访谈，我们了解到：取数只是其中一步，用户还需要整理分析数据、沟通结果，并制作图表和报告用于汇报。\n\n单次回答能够解决临时查询，却难以承接这些持续任务。结果留在消息中，用户仍需翻找历史、重新组织材料，并借助其他工具完成交付。因此，产品逐步从问答延伸到应用生成，支持用户围绕已有成果继续追问、调整内容和更新数据。', {
        continuationOf: 'narrative-overview',
        table: {
          ...overviewTable,
          rows: overviewTable.rows.filter(row => ['design-goal', 'target-users', 'core-responsibilities'].includes(row.id)),
        },
        diagram: {
          kind: 'paths',
          caption: '内部财务分析与汇报：原有流程与产品目标路径对比',
          lanes: [
            {
              title: 'Before',
              processingLabel: '跨角色获取数据，在 SQL、Excel 与汇报工具之间切换',
              steps: [
                { title: '产生需求', actor: 'requester', actorLabel: '财务同学' },
                { title: '找数据研发', actor: 'requester', actorLabel: '财务同学' },
                { title: '提供数据表与字段定义', actor: 'bi', actorLabel: '其他角色' },
                { title: '写 SQL 计算数据', actor: 'requester', actorLabel: '财务同学' },
                { title: 'Excel 绘制图表', actor: 'requester', actorLabel: '财务同学' },
                { title: 'PPT 汇报或协作开发大屏', actor: 'bi', actorLabel: '其他角色' },
                { title: '交付分析成果', actor: 'requester', actorLabel: '财务同学' },
              ],
            },
            {
              title: 'After',
              processingLabel: '从自然语言分析到生成报告，支持继续追问与更新',
              steps: [
                { title: '产生需求', actor: 'requester', actorLabel: '财务同学' },
                { title: '描述分析与汇报需求', actor: 'requester', actorLabel: '财务同学' },
                { title: 'AI 分析并生成应用', detail: '获取数据 → 找到口径 → 查询计算 → 生成图表 → 制作报告', actor: 'ai', actorLabel: 'AI' },
                { title: '使用和分享', actor: 'requester', actorLabel: '财务同学' },
              ],
            },
          ],
        },
      }),
    section('workspace', '产品形态演进',
      '随着用户从临时问数转向生成和持续使用应用，界面也需要同时承接分析过程与应用成果，产品形态先后探索了基础对话、无限画布和多栏工作台。\n\n基础对话降低了入口门槛，但分析结果容易散落在消息中。因此，我探索用无限画布组织分析节点，支持从图表继续追问、组合多个结果生成应用。\n\n通过内部用户测试和使用观察，我发现用画布承接连续任务的学习成本较高，也难以扩展到应用分享后继续对话的使用场景。因此，我选择多栏工作台，将数据、应用与对话并列，让用户围绕已有应用继续分析，同时保留可阅读、可分享的成果。', {
        evolutionMedia: find('product-evolution').evolutionMedia,
      }),
    section('focus', '设计重点和策略', '在客户场景梳理与验证中，我参与将业务任务拆解为可演示、可核查的分析路径，并把共性问题转化为产品需求。例如，生产分析中需要确认指标口径，连续追问需要承接工厂、产线与时间条件，分析成果还需要沉淀为可复用的报告。这些场景推动我把设计重点放在条件确认、连续分析与成果复用上。\n\n多栏工作台让数据、对话和应用可以同屏查看。接下来的问题是，用户在同一个工作台里既会追问数据，也会修改和发布应用，系统怎么区分这些动作？\n\n以「分析上月生产完成率」为例，用户负责提需求、Agent 负责查表计算和输出，用户可以先看分析结果、再选择把结果做成报告。这里面 Agent 执行路径为：理解问题 → 必要时澄清口径 → 调用工具查询和计算 → 返回结果 → 按需生成看板 → 继续分析，或编辑草稿并发布。\n\n这条路径上，可能存在三个关键问题：口径猜错，结论可能就错了；把追问当成修改，原看板就失去了对照价值；把生成当成发布，其他人可能看到还没核查的版本。因此，我把设计重点放在三条边界上：', {
      bullets: [
        '澄清边界：沿用上下文与已有条件，支持修改；只确认影响分析结论的关键歧义；分析条件与计算口径可回查、可修改',
        '变更边界：追问保留在对话中，明确指令才修改；确认修改对象与范围，保留原成果对照；局部修改校验通过后写入草稿',
        '交付边界：保存草稿后核查数据与交互；区分任务状态、草稿与已发布版本；确认发布后生效，支持版本切换与回滚',
      ],
    }),
    section('clarification', '决策一：明确澄清边界',
      '当用户提出「看看上月生产完成率」时，具体的时间范围、计算口径和呈现方式仍可能存在歧义。澄清太少，需求不够明确，容易得到偏离预期的结果；追问太多，又会增加用户的表达负担，降低继续使用的意愿。因此，我选择优先沿用已明确的条件，只确认影响结果的关键歧义，并让口径可回溯、可修改。', {
        bullets: [
          '沿用已有条件：关联上下文和已有的系统信息（如时间、分析对象），避免重复输入的同时支持修改；',
          '确认关键歧义：只将会影响数据结论的歧义转为用户可选的问题，图表样式风格等非必要问题用户可后置修改；',
          '口径可回溯可修改：保留本次分析涉及到的所有条件和计算口径，支持随时查看和定位，可通过对话修改。',
        ],
        images: ['qa-entry', 'qa-execution', 'qa-result'].flatMap(id => {
          const mockup = find(id).qaExperience?.mockup
          const src = mockup?.screenshotImages?.[0]
          return src ? [{ src, caption: mockup?.screenshotPlaceholder?.[0] ?? find(id).title, display: 'image' as const }] : []
        }),
      }),
    section('exploration', '决策二：区分追问和变更',
      'Agent 输出报告后，用户在看板旁接着问「华东呢？」，可能是想对比下华东数据，也可能是想直接修改结论。如果这句追问直接改了报告，原始分析就丢了。因此，我让比较结果留在对话里，明确提出要改应用或提供明确操作时，才进入修改。', {
        bullets: [
          '分离追问与编辑：追问只返回新分析，保留原成果供对照；明确要求修改，才进入编辑。',
          '限定局部修改范围：对象不清先确认；只改指定范围，例如改 A 图标题，不动 B 图和全局筛选。',
          '校验通过后写入：局部修改通过校验才写入草稿；失败保留原版，并说明本次未应用。',
      ],
        images: find('conversation').images.slice(0, 1).map(image => ({ ...image, display: 'image' as const })),
      }),
    section('publishing', '决策三：先验证，再发布',
      '报告生成或修改完成后，仍需要核查数据、筛选条件和交互是否符合预期。因此，我将草稿与已发布版本分开，让用户先预览、核查，再确认发布；核查期间，其他人仍可使用原有版本。', {
        bullets: [
          '保存并核查草稿：确认草稿保存成功后，再预览核查数据绑定、筛选和计算结果，避免将构建完成等同于业务结果正确。',
          '区分任务与版本状态：分别说明本次操作是否成功，以及当前查看的是草稿还是已发布版，让用户明确核查对象与所处阶段。',
          '确认发布后生效：修改先保留在草稿中，确认发布成功后再更新使用中的版本；支持版本切换与回滚。发布失败时保留上一版本，并说明失败原因与后续处理方式。',
        ],
        images: find('report-editing').images.map(image => ({ ...image, display: 'image' as const })),
      }),
    section('diagnosis', '异常问题排查',
      'Agent 的异常既包括数据结果偏差，也包括执行失败和长耗时。针对用户核查数据的需求，先孵化智能体回放功能，关联执行过程与分析依据；对于需要工程师深入排查的问题，再进一步孵化 Agent 可观测产品 AgentOps，通过拓扑图关联执行链路，结合 Trace 图、火焰图与日志定位异常。', {
        images: ['agent-replay', 'agent-evidence', 'agent-latency'].flatMap(id => find(id).images.map(image => ({ ...image, display: 'image' as const }))),
        bullets: [
          '分阶段回放：用户按执行阶段回看需求、数据源与计算口径，选中分析对象查看查询和返回结果；仍无法解释的偏差，再交由工程师核查执行记录。',
          '关联执行链路：面向工程师，通过拓扑图关联执行链路，用对话报错中的 Trace ID 找到对应调用，沿 Trace 定位异常节点，再展开错误信息、堆栈与关联日志。',
          '多视图定位耗时：通过耗时排序筛选慢调用，用 Trace 图核对执行时序、火焰图查看耗时分布，并联动节点详情缩小排查范围。',
        ],
      }),
    section('delivery', '协作与交付',
      '从快速探索到规则沉淀，让前端体验逐步成型。围绕 Agent 的任务执行，与研发共同调整执行流程与判断条件，明确各阶段的界面状态、异常报错和后续操作反馈。设计侧负责交互规则与前端呈现，研发侧负责底层上下文组装、权限校验和工具调用。', {
        steps: [
          { title: 'Figma Make', detail: '前期通过 Figma Make 快速搭建产品前端交互原型，与项目组共同探索产品形态和交互方案。' },
          { title: 'DESIGN.md', detail: '针对全局样式难以统一的问题，梳理 Design Token 与基础设计规则，整理为 DESIGN.md，作为前端实现的全局约束。' },
          { title: 'AI 对话组件库', detail: '随着 AI 对话功能开发，Agent 生成的界面不稳定、布局模式混乱，多位开发同学也开始并行参与。因此沉淀 AI 对话组件库，并通过 DESIGN.md 明确组件用法与布局规则。' },
        ],
      }),
    section('results', '当前成果',
      '随着产品整体迭代，应用生成采纳率从 15% 逐步提升到 60%。这是多项产品与体验优化共同作用下的结果，不能直接归因于某一个页面或交互决策。', {
        adoptionResult: results.adoptionResult,
        bullets: results.bullets,
      }),
  ]
}
