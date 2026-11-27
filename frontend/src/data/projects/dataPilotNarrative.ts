import { productionMorningScenario } from './dataPilotScenario'
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
  return [
    section('summary', '项目概览',
      'Data Agent 面向有数据分析需求的用户，支持用自然语言查询和分析数据，也支持 AI 生成报告、数据大屏等智能分析应用，同时可对生成的应用进行定期数据更新和分享协作。', {
        table: {
          columns: ['项目', '说明'],
          rows: [
            { id: 'responsibilities', cells: ['我的职责', '负责整体产品设计和客户场景验证\n重点包括对话问答体验和应用生成交互'] },
            { id: 'stage', cells: ['产品当前阶段', '已在多家企业完成私有化部署\n海外 SaaS 市场和云端版本推进中'] },
            { id: 'results', cells: ['成果', `应用生成采纳率\n${results.adoptionResult!.before}% → ${results.adoptionResult!.after}%`] },
          ],
        },
      }),
    section('overview', '从问数到报告的需求发现',
      '最初，我们希望用自然语言问数来减少找表和写 SQL 的工作。访谈内部 BI 用户后发现，用户除了拿到数据，还要在 Excel 中绘图、整理成 PPT 或大屏，用于更进一步的汇报。'),
    section('problem', '从问数到报告的需求发现',
      '单次问答只解决了取数，后续工作仍在其他工具中完成。因此，产品定位从把企业数据问出答案变成做出智能分析应用，让用户围绕应用不断追问和修改，减少反复整理分析结果的工作，甚至可以分享给其他角色共同使用。', {
        continuationOf: 'narrative-overview',
        bodyEmphasis: ['问出答案', '智能分析应用'],
        diagram: {
          kind: 'paths',
          caption: '内部财务分析与汇报：原有流程与产品目标路径对比',
          lanes: [
            {
              title: '原有工作路径',
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
              title: '产品预设目标',
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
    section('workspace', '产品形态的选择',
      '随着产品定位变化，我尝试迭代了多种产品形态：早期简单对话的结果散在不同消息里，来回翻找不便对照；后来探索无限画布，支持组合结果和持续追问，但用户要先理解节点关系，执行异常时也难以定位问题。\n\n最终根据产品内测反馈和团队共识，采用多栏工作台，让数据、应用和对话各有固定位置，用户可以边对话边核查、边看报告边追问。虽然减少了画布自由编排的空间，各栏也会挤占显示宽度，但优先保证分析、核对、修改和追问之间的操作衔接，以及智能应用持续可见。', {
        bodyEmphasis: ['简单对话', '无限画布', '多栏工作台'],
        evolutionMedia: find('product-evolution').evolutionMedia,
      }),
    section('focus', '核心体验问题', '在参与客户 POC 过程中，我主要负责梳理业务场景、拆解任务问题，并对照问题意图检查输出结果。下面以制造业生产分析为例，串起提问、追问、原因分析、生成应用和修改应用五个环节，说明各环节需要关注的体验问题。', { scenario: productionMorningScenario, bodyEmphasis: ['问题意图', '输出结果'] }),
    section('clarification', '分析可信',
      '不能只靠回答旁边放个「查看 SQL」按钮，用户更需要核查的是：问的是什么、实际算的是什么、结论支持到什么程度。', {
        anchorTitle: '分析可信',
        bullets: [
          '澄清关键歧义：影响结论的歧义先确认，已有明确条件不重复询问，采用默认条件时直接展示并允许修改。',
          '数据结论可核查：数字或图表旁展示统计范围、更新时间；可逐层展开计算公式、数据源、SQL 等。',
          '上下文继承可见：每轮结果附简短条件摘要，并说明本轮变更，区分继承、替换和新增条件。',
          '区分失败与结果：明确说明执行过程异常的情况，包括无数据、权限不足、查询失败或异常等，保留已完成的部分任务。',
          '区分事实、推测与原因：原因分析按“已观察到的事实—可能解释—待验证事项”组织；每个解释关联证据和缺失信息。同时变化只能支持相关性；证据不足时不能直接标成“根因”。',
        ],
        evolutionMedia: [
          { src: '/images/dataagent-clarification-plan-v4.jpg', caption: '交互式澄清', title: '澄清关键歧义' },
          { src: '/images/dataagent-clarification-result-v2.jpg', caption: '说清结果的计算过程', title: '数据结论可核查' },
          { src: '/images/dataagent-clarification-followup-v3.jpg', caption: '只改用户指定部分', title: '上下文继承可见' },
          { src: '/images/dataagent-clarification-failure.jpg', caption: '保留已完成结果，补查失败步骤', title: '区分失败与结果' },
          { src: '/images/dataagent-clarification-evidence-v2.jpg', caption: '区分已确认事实、可能解释与待核对事项', title: '区分事实、推测与原因' },
        ],
        images: [
          { src: '/images/dataagent-clarification-plan-v4.jpg', caption: '交互式澄清', display: 'image' },
          { src: '/images/dataagent-clarification-result-v2.jpg', caption: '说清结果的计算过程', display: 'image' },
          { src: '/images/dataagent-clarification-followup-v3.jpg', caption: '只改用户指定部分', display: 'image' },
          { src: '/images/dataagent-clarification-failure.jpg', caption: '保留已完成结果，补查失败步骤', display: 'image' },
          { src: '/images/dataagent-clarification-evidence-v2.jpg', caption: '区分已确认事实、可能解释与待核对事项', display: 'image' },
        ],
      }),
    section('exploration', '成果可用',
      '从对话生成应用，是一次关键转换。对话可以试探、反复和临时条件，但应用需要有明确的内容、计算规则和使用方式。', {
        anchorTitle: '成果可用',
        bullets: [
          '明确采用哪些分析成果：结果卡片支持「加入应用」；应用生成前展示内容清单，包括采用的结论、图表、指标和筛选条件等；排除被否定的结论与临时试探。',
          '区分固定条件与可变参数：提供日期等通用筛选项，说明哪些条件固定、哪些可调整；明确条件是保持固定、随访问变化，还是支持用户切换。',
          '支持数据周期更新：提供“当前快照／手动刷新／定时更新”等方式；应用内显示数据截至时间、最近刷新结果。',
          '生成后先核查再发布：预览应用时，可对照原分析结果查看指标、图表与计算口径；提示缺失数据、未完成内容和核查事项。明确标示草稿、待核查、已发布等应用状态，说明是否已可供他人使用。',
      ],
        evolutionMedia: [
          { title: '明确采用哪些分析成果', caption: '待补截图：生成应用前选择结论、图表与计算口径的确认界面' },
          { title: '区分固定条件与可变参数', caption: '待补截图：固定口径与可变参数的配置，以及默认值和作用范围' },
          { title: '支持数据周期更新', caption: '待补截图：快照与动态数据选择、更新周期及最近更新状态' },
          { title: '生成后先核查再发布', caption: '待补截图：应用草稿预览、数据核查与发布确认' },
        ],
        images: find('conversation').images.slice(0, 1).map(image => ({ ...image, display: 'image' as const })),
      }),
    section('publishing', '修改可控',
      '修改比生成更容易破坏已有成果。用户已经形成预期，也可能已有其他人在使用应用，因此需要清楚知道修改的对象、影响和状态。', {
        anchorTitle: '修改可控',
        bullets: [
          '区分追问与修改：“看看上周”返回新的分析，“把这张图改成上周”进入应用修改；无法确定时先确认操作意图，避免一次试探性追问改变已有应用。',
          '明确修改对象：支持选中图表后发起修改，展示状态「正在修改」；对象不明确时先定位，不依赖这个、那个的文本指代。',
          '展示影响范围：说明修改会影响哪些图表、计算口径和筛选条件，提示关联内容及其他使用者是否受影响。',
          '提供变更预览：修改先在预览中呈现，突出新增、删除和调整的内容。涉及计算口径、关联图表或已发布内容时，说明影响范围，再由用户确认是否生效。',
          '支持版本回滚：保留版本记录与变更摘要，支持预览历史版本；恢复前说明影响范围，确认后反馈恢复结果。',
        ],
        evolutionMedia: [
          { title: '区分追问与修改', caption: '待补截图：分析追问与修改应用的操作区分，以及意图确认' },
          { title: '明确修改对象', caption: '待补截图：选中图表、指标或整个应用，并确认修改对象' },
          { title: '展示影响范围', caption: '待补截图：修改涉及的图表、计算口径、筛选条件及使用者范围' },
          { title: '提供变更预览', caption: '待补截图：变更前后对比，高亮修改内容并提供确认和取消操作' },
          { ...find('report-editing').images[0], title: '支持版本回滚' },
        ],
        images: find('report-editing').images.map(image => ({ ...image, display: 'image' as const })),
      }),
    section('diagnosis', '异常问题排查',
      '在核查或修改应用时，用户可能发现结果不对、执行失败，或迟迟没有返回。除了提示异常，还需要让用户知道问题出在哪一步。因此，先从执行回放入手，帮助用户核对分析过程；再提供工程师需要的调用记录、耗时和日志等，帮助继续排查。', {
        images: ['agent-replay', 'agent-evidence', 'agent-latency'].flatMap(id => find(id).images.map(image => ({ ...image, display: 'image' as const }))),
        bullets: [
          '分析过程回放：按执行步骤查看需求、数据源和计算口径，选中有疑问的结果，核对查询与返回数据；仍找不到原因时，再交由工程师排查。',
          '找到失败步骤：工程师通过报错中的 Trace ID 找到对应调用，在拓扑图中查看前后步骤，选中失败节点后展开错误信息、堆栈和日志。',
          '查看耗时去向：先按耗时找出较慢的调用，再用 Trace 图查看执行顺序、火焰图查看各步骤耗时，点开具体节点继续核查。',
        ],
      }),
    section('delivery', '具体设计交付', '我负责 Data Agent 的需求分析，并利用 AI 工具完成产品设计和部分前端实现。', {
        bullets: [
          '对话流程定义：问数、连续追问、应用生成与修改的流程图；待确认、执行中、完成与失败的状态流转说明',
          'Agent 行为规则：澄清与工具调用时机、追问条件继承规则；应用修改的对象范围、确认与恢复规则',
          '关键交互组件：用户操作：超级输入框、澄清卡中的条件选择与确认；Agent 反馈：加载状态、思考过程与工具调用展示，以及文本、表格、图片和数据图表的流式呈现',
          '验收场景：根据业务场景编排多轮对话，模拟用户提问、追问和修改应用的过程；逐轮检查回答是否符合问题意图、操作是否顺畅，以及遇到异常后能否继续',
        ],
      }),
    section('results', '当前成果',
      `随着产品整体迭代，应用生成采纳率逐步提升。${results.bullets?.slice(1).join('') ?? ''}`, {
        adoptionResult: results.adoptionResult,
        bullets: results.bullets?.slice(0, 1),
      }),
  ]
}
