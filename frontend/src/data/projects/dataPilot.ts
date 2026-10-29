import type { Locale } from '../../i18n/translations'
import { getProjectBySlug, getProjectTitle } from '../projects'

export type DataPilotPart = 'experience' | 'poc' | 'growth'
export type DataPilotSection = {
  id: string
  index: string
  title: string
  intro: string
  body: string
  bullets?: string[]
  stats?: string[]
  related?: boolean
  applicationTypes?: { title: string; scene: string; problem: string; solution: string; screenshot: string }[]
  images: { src: string; caption: string; display?: 'image'; alt?: string }[]
}

/** 页面、聊天和通用详情摘要共用的案例内容。 */
export const DATA_PILOT_DEMO_URL = 'https://dataagent-demo.vercel.app/'

function createDataPilotContent(locale: Locale) {
  const isZh = locale === 'zh'
  const project = getProjectBySlug('dataagent')!
  const sections: DataPilotSection[] = isZh
    ? [
        {
          id: 'overview',
          index: '01',
          title: '项目目标',
          intro: '从“生成答案”转向“让结果可信并进入工作流”',
          body: '智能问数从技术验证进入商业化交付后，产品开始关注用户为何不敢采纳答案。早期版本在指标口径和执行过程上不够稳定，用户难以判断结果是否可信，出错后也缺少修正路径。因此目标分两层：先减少指标与维度的口径偏差，让结果可确认、可追踪、可修正；再让结果进入真实工作流，支持分析、监控、汇报和决策。\n\n设计策略围绕“理解—确认—修正—使用”展开：生成前展示 Agent 对问题和业务口径的理解，只在关键歧义处询问；执行中呈现节点与状态，让结果可以回查；出现偏差时保留上下文，通过对话局部修改；结果确认后继续生成多维表格、仪表盘或数据大屏，承接后续任务。',
          bullets: ['数据分析师：检查口径、修改参数并继续分析', '业务人员：用自然语言完成高频经营查询', '管理者：将结果用于监控、汇报和决策'],
          images: [{ src: '/images/dataagent-target-users-scenarios.png', caption: '', display: 'image', alt: '业务人员、数据分析师和管理者的目标用户与使用场景示意图' }],
        },
        {
          id: 'accuracy',
          index: '02',
          title: '准确率优化',
          intro: '先判断错误发生在哪个节点，再选择对应方案',
          body: '准确率问题不能只归因于模型。一次问数会经过意图理解、口径匹配、工具调用和结果返回，任一节点出错都会影响最终结果。\n\n定位时，先收集用户纠正、低评分和查询失败的案例，再按相同输入重放任务。逐步对照每个节点的输入、解析结果、调用参数和最终数据，找到首次出现偏差的位置。\n\n确认错误节点后，再选择追问确认、口径选择、调用校验或结果回查等方案，避免用增加确认步骤解决所有问题。',
          bullets: ['意图理解：用户问“华东销售怎么样”，先追问要看趋势、排名还是异常，再进入分析', '指标与维度：用户输入“收入”时，同时展示营业收入、回款金额等候选定义，由用户确认口径', '工具调用：生成经营看板前校验查询与制图工具的参数和顺序，失败时直接标出异常节点', '结果校验：结果页保留“营业收入｜华东区域”等查询条件与执行记录，方便核对和回查'],
          related: true,
          images: [
            { src: '/images/datapilot-metric-layer-data.png', caption: '数据字段与指标口径' },
            { src: '/images/datapilot-metric-layer-modeling.png', caption: '指标、维度和数据关系' },
          ],
        },
        {
          id: 'conversation',
          index: '03',
          title: 'Agent 多轮对话体验',
          intro: '让确认、执行、反馈和修正形成连续任务',
          body: '参数明确时直接执行；出现关键歧义时，在对话中插入确认卡片。卡片集中展示已识别的指标、维度和筛选条件，候选口径用单选项呈现，用户确认后从当前节点继续。\n\n执行阶段使用步骤列表展示“理解问题—匹配口径—查询数据—生成结果”。当前步骤持续显示处理中状态，已完成步骤收起，用户仍可展开查看工具与参数，减少等待时的不确定感。\n\n结果中的筛选条件和展示方式支持原位修改。提交后只重跑受影响的节点，并保留上一版结果用于对照。失败信息出现在对应步骤下方，说明原因，同时提供修改参数、重试和返回上一步三个入口。',
          bullets: ['确认卡片：集中核对指标、维度和筛选条件', '执行步骤：显示当前进度，按需展开工具与参数', '原位修正：保留上下文，只重跑受影响的节点', '结果对照：修改后保留上一版结果，方便判断变化', '错误恢复：在出错节点提供修改、重试和返回入口'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Agent 从问题理解到结果生成的连续执行流程' }],
        },
        {
          id: 'applications',
          index: '04',
          title: '应用扩展',
          intro: '根据后续任务选择合适的结果形态',
          body: '应用生成可预览、可撤销，因此让 Agent 先完成可逆的规划与生成，只在目标缺失或存在明显歧义时询问用户。用户负责说明应用用途和关键取舍，Agent 负责组织字段、图表和内容顺序，减少逐步确认带来的打断。\n\n选择应用类型后，Agent 自动继承问数中的数据来源、指标、维度和筛选条件，并展示这些生成依据。若无法判断使用对象、查看方式或后续任务，再用简短问题补齐信息，避免基于错误假设继续生成。\n\n用户通过自然语言提出修改后，Agent 先复述要求并说明影响范围，再局部更新受影响的模块。系统同步检查数据与图表匹配、关键指标和画布范围，并保留上一版本与撤销入口。不同应用承接的任务不同，人与 Agent 的协作问题也会随之变化。',
          applicationTypes: [
            { title: '多维表格', scene: '用户把问数结果继续生成包含字段、视图和计算规则的业务分析表，并在后续分析中持续调整。', problem: '一句“生成门店经营表”同时包含用途和结构要求，Agent 对行粒度、字段关系和计算口径的理解不可见。草案偏离预期后，用户也难以判断一句修改会影响哪些字段与视图。', solution: '先展示 Agent 对用途、数据粒度和字段关系的理解，仅追问有歧义的部分。收到“改为每个门店一行”等要求后，先返回修改摘要和影响范围，再局部更新，并保留撤销入口。', screenshot: '多维表格生成结果截图' },
            { title: '仪表盘', scene: '业务负责人把分析结果生成周期性监控页面，用于查看指标变化、发现异常并继续追查。', problem: '“关注经营异常”需要被转换成页面大纲、指标优先级和图表组合。若 Agent 直接生成完整页面，用户很难判断它是否理解了监控目标；使用“这张图”等指代修改时也容易产生歧义。', solution: '先给出页面大纲和推荐模块，再生成仪表盘。每个模块显示名称、所回答的问题和数据口径；用户按模块名称提出调整，Agent 复述修改目标后局部更新，并提供重新生成与撤销。', screenshot: '仪表盘生成结果截图' },
            { title: '数据大屏', scene: '管理者把经营分析生成用于会议、汇报或业务现场展示的大屏，需要快速传达核心结论。', problem: '“更有重点”“更适合汇报”等视觉意图缺少明确指向。Agent 可能同时改动内容、版式和色彩，扩大修改范围，甚至破坏已经确认的叙事顺序。', solution: '先用选项确认受众、屏幕比例和核心结论，再生成叙事大纲与整屏预览。为各区域命名，用户通过名称提出修改；Agent 先说明将调整的内容，只更新对应区域，并保留上一版本。', screenshot: '数据大屏生成结果截图' },
          ],
          images: [],
        },
        {
          id: 'delivery',
          index: '05',
          title: '交付结果',
          intro: '将交付中的共性问题转化为标准产品能力',
          body: '在 5+ 家付费客户交付过程中，指标口径、结果解释和展示形式相关反馈被持续收集，并区分为通用问题、行业差异和个性化需求。通用问题进入产品迭代，行业差异通过配置和业务词典解决，个性化需求结合复用价值评估。失败案例进一步转化为问题优先级和验收标准，推动产品、算法、研发和交付团队统一方案，并跟进上线后的数据验证。\n\n结合 AI 辅助开发参与问数页面与组件实现，通过 Skill 明确组件用法与交互状态，复用组件库交付可运行代码。\n\n这里的“应用生成采纳率”指用户直接使用或继续编辑生成的应用，并将其用于实际业务的应用生成任务比例，不包含单次问数结果。后续仍需按客户、业务场景和应用类型拆分验证。',
          stats: ['应用生成采纳率 15% → 60%', '5+ 家付费客户', '从技术验证进入商业化交付'],
          images: [{ src: project.image, caption: '面向业务用户的问数与数据应用场景' }],
        },
        {
          id: 'role',
          index: '06',
          title: '后续验证',
          intro: '下一步需要继续验证不同场景下的使用效果',
          body: '当前指标反映应用生成采纳率变化，后续进一步按客户、业务场景和应用类型拆分，持续观察多维表格、仪表盘和数据大屏的实际使用情况。问数准确性与任务完成情况单独验证，结合风险判断哪些步骤适合自动执行、哪些需要保留人工确认。',
          bullets: ['按业务场景拆分应用生成采纳率和修改率', '单独验证问数准确性与任务完成情况', '减少低风险问题中的确认步骤', '完善多轮对话中的上下文保留和参数修改'],
          images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: '多任务协同与结果生成场景' }],
        },
      ]
    : [
        {
          id: 'overview', index: '01', title: 'Overview', intro: '',
          body: 'DataAgent moved from technical validation toward commercial exploration. I owned the Agent conversation experience, from question input and intent recognition to confirmation and result generation across tables, dashboards, and data walls. My product judgment was to first address why users hesitated to adopt results and could not recover from errors, then expand output formats; I matched tables, dashboards, and data walls to detail analysis, monitoring, and presentation goals instead of optimizing for one-off answers.', stats: ['AI-generated application adoption 15% → 60%', '5+ paid customer deliveries', 'Tables / dashboards / data walls'], images: [{ src: project.image, caption: 'DataAgent product overview' }],
        },
        {
          id: 'goals', index: '02', title: 'Decisions & goals', intro: 'Improve answer accuracy and make results usable beyond one-off answers', body: 'The product goals were to improve metric, dimension, time, and query accuracy, while supporting richer output formats for analysis, monitoring, and presentation.', bullets: ['Understand the user’s analysis goal', 'Reduce parsing and matching errors', 'Support different data-use scenarios'], images: [{ src: '/images/datapilot-metric-layer-data.png', caption: 'Metric and field context' }],
        },
        {
          id: 'problems', index: '03', title: 'Problems & priorities', intro: 'Map unstable results to specific conversation nodes', body: 'I grouped customer feedback and failed cases across the Agent workflow. A request such as “show East China sales” requires the system to resolve the metric, region level, and time range, as well as whether a specific tool or Skill should be called. Any incorrect decision or call can make the final result unreliable.', bullets: ['Intent parsing', 'Metric and dimension matching', 'Time interpretation', 'Tool / Skill calling: wrong selection, incomplete parameters, or incorrect order', 'Output format selection'], images: [{ src: '/images/datapilot-metric-layer-data.png', caption: 'Metric context' }, { src: '/images/datapilot-metric-layer-modeling.png', caption: 'Metric relationships' }],
        },
        {
          id: 'conversation', index: '04', title: 'Multi-turn Agent conversation experience', intro: 'Turn natural language into a confirmable, executable, and editable task', body: 'I designed the main Agent flow and made trade-offs based on risk and ambiguity: execute low-risk requests directly, but confirm when critical parameters are unclear. Before a tool or Skill call, the system checks selection and parameters; during execution it shows node states, and after failure it explains the cause and offers retry. Users can change time, filters, or output format mid-task, with only the changed parts updated before continuing.', bullets: ['Input and intent', 'Metric, dimension, and time parsing', 'Risk-based execution or confirmation', 'Tool / Skill selection, parameter, and order checks', 'Execution states, error causes, and retry', 'Continue after mid-task edits'], images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Conversation and execution flow' }],
        },
        {
          id: 'accuracy', index: '05', title: 'Accuracy & applications', intro: 'Make results accurate and usable in real workflows', body: 'I organized failure cases and aligned the response: use confirmation for ambiguous metrics, convert natural-language time into explicit ranges, and preserve context when users revise one parameter. I also mapped output formats to user goals: tables for detail analysis, dashboards for recurring monitoring, and data walls for business presentation.', bullets: ['Intent clarification and metric definitions', 'Explicit time ranges and validation', 'Tables, dashboards, and data walls', 'Context-preserving revisions'], related: true, images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Serial execution' }, { src: '/images/datapilot-ai-parallel-execution.png', caption: 'Parallel execution' }],
        },
        {
          id: 'delivery', index: '07', title: 'Delivery results', intro: 'Turn recurring delivery issues into reusable product capabilities', body: 'Across 5+ paid customer deliveries, I categorized feedback into general product issues, industry-specific configuration, and one-off requests. General issues were fed back into the core experience and validated through subsequent delivery.\n\nI also contributed page and component code with AI-assisted development, using Skills to document component usage and interaction states and reusing the component library.\n\nAI-generated application adoption measures the share of application-generation tasks where users use the generated application in their work, either directly or after editing. It excludes individual query answers. Further validation will break this down by customer, use case, and application type.', stats: ['AI-generated application adoption 15% → 60%', '5+ paid customer deliveries', 'Technical validation → commercial delivery'], images: [{ src: project.image, caption: 'Business-facing query experience' }],
        },
        {
          id: 'role', index: '08', title: 'Next validation', intro: 'Continue validating performance across different use cases', body: 'The current metric reflects adoption of AI-generated applications. Next, I would break it down by customer, use case, and application type while tracking actual use of tables, dashboards, and data walls. Query accuracy and task completion will be validated separately, with risk guiding which steps can run automatically and which need confirmation.', bullets: ['Measure application adoption and edit rates by use case', 'Validate query accuracy and task completion separately', 'Reduce confirmation steps for low-risk requests', 'Improve context retention across multi-turn revisions'], images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: 'Multi-task result generation' }],
        },
      ]

  const conversationExamples: DataPilotSection[] = [
    {
      id: 'continuous-analysis-example', index: '',
      title: isZh ? '连续分析需求判断（示例）' : 'Continuous analysis requirements (example)',
      intro: isZh ? '从“记住历史”进一步拆解为可核对、可修改的分析条件' : 'Turn a request for memory into conditions users can check and change',
      body: isZh
        ? '以下为假设业务场景，用于展示产品判断与交互方案推演，不代表已完成的客户项目或用户测试。\n\n连锁零售企业的区域经理需要在经营例会前，定位 9 月华东区净销售额较 8 月下滑的主要来源。一次问数只能看到总体变化，需要连续拆解到城市和品类。假设客户提出“让 Agent 记住前面的问题”，直接沿用全部历史条件可能将后续分析带偏。\n\n需要解决的是：用户无法确认本轮继承了哪些条件、修改了哪些条件。因此可将诉求拆为保留适用条件、明确变更范围、澄清冲突与歧义，以及允许纠正后继续分析。'
        : 'This hypothetical business scenario illustrates product and interaction reasoning. It is not a completed customer project or user test.\n\nBefore a business review, a retail regional manager needs to locate the main contributors to a decline in East China net sales from August to September. A single answer shows the overall change; follow-ups need to break it down by city and category. If the customer asks the Agent to remember earlier questions, carrying every past condition forward could distort later analysis.\n\nThe underlying problem is that users cannot tell which conditions were inherited or changed. The request can be broken into retaining applicable conditions, making changes explicit, clarifying conflicts and ambiguities, and allowing corrections before continuing.',
      bullets: isZh
        ? ['第一轮：“9 月华东区净销售额比 8 月下降了多少？”明确区域、时间、对比周期与指标口径。', '第二轮：“按城市拆开，看看哪里下降最多。”保留时间、区域与指标，新增城市维度；澄清“下降金额”还是“下降比例”。', '第三轮：“看看杭州，按品类拆一下。”范围收窄到杭州，切换为品类维度，保留时间与指标。', '第四轮：“那华南呢？”清除与华南冲突的杭州条件，询问看华南整体变化还是继续按品类拆分。']
        : ['Turn 1: “How much did East China net sales fall in September compared with August?” Establish the region, period, comparison period, and metric definition.', 'Turn 2: “Break it down by city. Where was the largest decline?” Retain the period, region, and metric, add the city dimension, and clarify absolute versus percentage decline.', 'Turn 3: “Look at Hangzhou by category.” Narrow the scope to Hangzhou and switch to categories while keeping the period and metric.', 'Turn 4: “What about South China?” Remove the conflicting Hangzhou condition and clarify whether to show the overall change or retain the category breakdown.'],
      images: [],
    },
    {
      id: 'continuous-analysis-validation', index: '',
      title: isZh ? '方案取舍与验证（示例）' : 'Proposed scope and validation (example)',
      intro: isZh ? '先保障同一任务内的条件正确与过程可理解' : 'Prioritize correct conditions and an understandable process within one task',
      body: isZh
        ? '承接上述假设场景，建议在结果附近展示当前条件摘要，例如“9 月对比 8 月 · 华东 · 净销售额 · 按城市 · 按下降金额排序”。追问后突出本轮变化，例如“范围改为杭州、维度改为品类；时间与指标不变”。明确的追问直接执行，出现冲突或多个合理解释时提供必要的澄清选项；用户也可修改条件后继续分析。\n\n以下为拟议的版本边界和验证方法，尚不作为已落地功能或验证结论。'
        : 'For the hypothetical scenario above, the proposed interface places a current-condition summary near the result, such as “September vs August · East China · Net sales · By city · Ranked by absolute decline.” After a follow-up, it highlights what changed: “Scope changed to Hangzhou; dimension changed to category; period and metric unchanged.” Clear requests proceed directly. Conflicts or multiple plausible interpretations trigger necessary clarification, and users can edit conditions before continuing.\n\nThe scope and validation methods below are proposals, not shipped functionality or completed findings.',
      bullets: isZh
        ? ['首版建议：同一分析任务内的条件继承与修改、当前条件摘要、变更提示和关键歧义澄清。', '暂缓范围：跨会话长期记忆、复杂分支对话树和自动生成完整经营报告，减少旧条件误用与开发测试范围扩张。', '验证任务：用上述四轮追问检查条件继承是否正确，用户能否发现并修正偏差，是否减少重复输入，以及能否定位主要下滑贡献项。', '判断标准：不单独以对话轮数减少判断成功；必要澄清可能增加一轮，却避免错误分析。', '结论边界：城市与品类拆解用于定位下滑来源；要判断原因，还需要客流、缺货、促销等证据。']
        : ['Proposed first release: condition inheritance and editing within one task, a current-condition summary, change feedback, and clarification of material ambiguities.', 'Defer: cross-session memory, complex conversation branches, and full report generation to limit stale-condition errors and development and testing scope.', 'Validation tasks: use the four turns to check inheritance correctness, whether users can detect and correct deviations, repeated input, and identification of the main contributors to decline.', 'Success criteria: do not rely on fewer turns alone; a necessary clarification may add a turn while preventing incorrect analysis.', 'Interpretation limits: city and category breakdowns locate contributors to the decline. Explaining causes requires evidence such as footfall, stock availability, and promotions.'],
      images: [],
    },
  ]
  sections.splice(sections.findIndex((section) => section.id === 'conversation') + 1, 0, ...conversationExamples)
  sections.forEach((section, index) => { section.index = String(index + 1).padStart(2, '0') })

  const growthSections: DataPilotSection[] = isZh
    ? [
        {
          id: 'growth-research', index: '01', title: '市场背景', intro: '',
          body: 'AI 智能问数的产品能力已经可以交付，但面向海外 SaaS 市场的商业化还在探索。当前需要验证的不是“能不能做出结果”，而是海外用户是谁、什么场景最容易感知价值、用户如何开始试用，以及是否愿意从试用进入付费讨论。竞品、用户场景和客户反馈被用于收敛优先验证的目标用户与首个任务。',
          bullets: ['市场问题：AI Data Agent 产品定位相似，用户难以快速理解差异', '用户问题：不同角色对分析、监控、协作和交付的期待不同', '商业问题：尚无真实线上漏斗数据，需要先建立可验证假设', '调研输出：目标场景、官网叙事和首个试用任务'],
          images: [{ src: project.image, caption: '占位图：展示竞品定位、目标用户和优先验证场景的对比关系' }],
        },
        {
          id: 'growth-context', index: '02', title: '判断与策略', intro: '先验证定位和首次价值，再讨论注册与付费',
          body: '当前最需要验证的不是注册按钮的位置，而是用户能否在几分钟内理解产品、完成一次有效问数并看到可继续使用的结果。因此将官网作为市场验证入口，把首个任务作为价值验证节点，先降低理解和开始使用的成本，再承接注册、试用和销售沟通。首轮路径设计为“官网落地页 → 免费体验对话 → 注册获取 AI 积分 → 简单试用并生成报表等应用 → 引导付费”，每一步先让用户获得足够价值，再增加下一步转化要求。',
          bullets: ['定位取舍：用一个高频业务场景表达产品，而不是罗列全部能力', '入口取舍：让访客直接进入与场景匹配的首次任务', '注册承接：在免费对话产生兴趣后，用 AI 积分引导注册', '价值取舍：优先让用户生成报表等可复用结果', '转化取舍：在用户感知价值后再引导付费'],
          images: [{ src: project.image, caption: '占位图：展示官网叙事、产品入口和首次任务之间的承接关系' }],
        },
        {
          id: 'growth-funnel', index: '03', title: '增长链路', intro: '让每一步都回答用户“为什么继续”',
          body: '围绕不同阶段的用户意图设计触点：官网落地页负责建立认知，免费对话负责降低开始成本，注册用 AI 积分承接兴趣，简单试用帮助用户生成报表等结果应用，付费节点用于验证从试用到付费的意愿。当前漏斗主要通过 AI 模拟和方案推演进行验证，真实转化仍待验证。',
          bullets: ['落地页：用真实场景说明产品价值', '免费对话：让访客先体验问数方式', '注册激励：用 AI 积分承接继续试用', '首次价值：生成报表、仪表盘等结果应用', '付费承接：在价值被验证后引导付费'],
          images: [
            { src: '/images/datapilot-ai-serial-execution.png', caption: '占位图：展示首次任务中的过程反馈、结果价值和继续使用的理由' },
            { src: '/images/datapilot-ai-parallel-execution.png', caption: '占位图：展示不同用户目标对应的产品入口和结果应用路径' },
          ],
        },
        {
          id: 'growth-validation', index: '04', title: '模拟验证', intro: '用 AI 模拟推演路径，真实转化仍待验证',
          body: '从官网访问、产品启动、首个任务完成、注册到付费的漏斗框架被用于验证完整路径，并结合 AI 模拟用户路径、访谈假设和客户反馈推演可能的流失原因。当前这些是商业化探索中的验证工具，不代表真实线上转化结果；后续需要接入埋点和销售数据，再判断哪些触点真正有效。',
          stats: ['AI 模拟：获客 → 首次使用 → 注册 → 付费', '商业化探索阶段', '真实转化仍待验证'],
          images: [{ src: project.image, caption: '占位图：展示 AI 模拟的获客、首次使用、注册和付费漏斗，以及待接入的真实数据节点' }],
        },
        {
          id: 'growth-iteration', index: '05', title: '后续验证', intro: '把模拟结论转化为真实上线后的验证计划',
          body: '增长部分目前仍处于探索阶段，尚未形成稳定的转化结论。后续按轮次推进：第一轮验证海外市场的定位和官网表达；第二轮优化产品入口、首个任务和结果反馈；第三轮在具备真实流量后验证注册和付费承接。同时结合目标用户和真实转化数据，比较产品即官网、PLG、自助试用和销售辅助等增长方式，不把 AI 模拟或页面方案直接等同于增长结果。',
          bullets: ['第一轮：验证目标用户、核心场景和官网价值表达', '第二轮：优化产品入口、首个任务引导和结果反馈', '第三轮：验证注册、试用与付费承接', '策略探索：比较产品即官网、PLG、自助试用和销售辅助', '当前状态：增长方案验证中，暂不下结论', '每轮闭环：观察指标 → 定位问题 → 调整方案 → 数据复盘'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: '占位图：展示从模拟假设到真实流量验证的后续迭代计划' }],
        },
      ]
    : [
        {
          id: 'growth-research', index: '01', title: 'Market background', intro: 'Overseas SaaS commercialization is still being explored',
          body: 'The AI analytics Q&A product is ready for delivery, but its commercialization in the overseas SaaS market is still being explored. The question is not only whether it can generate results, but who the overseas users are, which scenarios show value most clearly, how users should start a trial, and whether they will move from trial to a payment discussion. I used competitor research, user scenarios, and customer feedback to narrow the audience and first task to validate first.',
          bullets: ['Competitive review: positioning, information structure, core scenarios, and trial paths', 'User scenarios: analysis, monitoring, collaboration, and result delivery', 'Positioning decision: choose the audience and scenario to validate first', 'Research output: website content structure and first trial task'],
          images: [{ src: project.image, caption: 'Overseas competitor and use-case research' }],
        },
        {
          id: 'growth-context', index: '02', title: 'Growth strategy', intro: 'Validate positioning first, then help users reach value quickly',
          body: 'The product was preparing to explore the overseas SaaS market. As a product designer, I treated the website as part of market validation, not just a promotional page: first clarify what to communicate through competitor and use-case research, then test a path of landing page → free conversation → registration for AI credits → simple trial with reports and other outputs → payment. The priority was to reduce the effort to understand the product and reach first value before asking for the next commitment.',
          bullets: ['Competitor and use-case research: compared positioning, core scenarios, and trial patterns in products such as Hex', 'Website positioning: explain the problem and audience through one clear scenario', 'Free conversation: let visitors experience the query flow before sign-up', 'Registration incentive: use AI credits to support continued trial', 'First value: guide users to generate reports and other outputs', 'Conversion design: prompt payment after value is clear'],
          images: [{ src: project.image, caption: 'Growth journey from website entry to analytics experience' }],
        },
        {
          id: 'growth-funnel', index: '03', title: 'Growth funnel design', intro: 'Give users a reason to continue at every step',
          body: 'I designed touchpoints around intent at each stage: the landing page builds awareness, free conversation lowers the cost of starting, AI credits support registration, a simple trial helps users generate reports and other outputs, and the payment step is intended to test willingness to pay after trying the product. The journey is being explored through AI simulation and design hypotheses; real-world conversion remains to be validated.',
          bullets: ['Landing page: explain value through real scenarios', 'Free conversation: let visitors try the query flow first', 'Registration incentive: use AI credits to continue trial', 'First value: generate reports, dashboards, and other outputs', 'Payment handoff: capture intent after value is proven'],
          images: [
            { src: '/images/datapilot-ai-serial-execution.png', caption: 'Process feedback and value during the first task' },
            { src: '/images/datapilot-ai-parallel-execution.png', caption: 'Result paths for different user goals' },
          ],
        },
        {
          id: 'growth-validation', index: '04', title: 'Simulation-based validation', intro: 'Explore journey hypotheses with AI simulation; real-world conversion remains to be validated',
          body: 'I mapped website visits, product starts, first-task completion, registration, and payment into a funnel framework. AI-simulated user paths, interview hypotheses, and customer feedback help explore potential drop-off. These are tools for evaluating the journey, not evidence of real-world conversion. Product event and sales data will be needed to assess which touchpoints work.',
          stats: ['AI simulation: acquisition → first use → registration → payment', 'Commercial exploration stage', 'Real-world conversion remains to be validated'],
          images: [{ src: project.image, caption: 'Placeholder: simulated funnel and planned real-world data collection points' }],
        },
        {
          id: 'growth-iteration', index: '05', title: 'Next validation', intro: 'Turn simulation findings into a plan for validation with real traffic',
          body: 'Overseas growth remains exploratory, with real-world conversion still to be validated. The next rounds will test audience and website positioning, refine product entry and first-task feedback, then assess registration and payment once real traffic is available. Future audience and conversion data will inform comparisons between a product-led website, PLG, self-serve trials, and sales-assisted approaches. AI simulations and journey designs are not treated as growth results.',
          bullets: ['Planned round one: validate audience, core scenario, and website value proposition', 'Planned round two: improve product entry, first-task guidance, and result feedback', 'Planned round three: validate registration, trial, and payment with real traffic', 'Strategy exploration: product-led website, PLG, self-serve trial, or sales-assisted combinations', 'Current status: real-world conversion remains to be validated', 'Planned loop: observe signals → locate friction → adjust the solution → review with data'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Placeholder: planned validation from simulated hypotheses to real traffic' }],
        },
      ]

  const pocSections: DataPilotSection[] = [
    {
      id: 'poc-validation', index: '01',
      title: isZh ? '客户场景验证' : 'Customer scenario validation',
      intro: isZh ? '通过客户 POC 演示验证业务场景价值' : 'Validate business use cases through customer POC demos',
      body: isZh
        ? '参与数据分析 Agent 产品需求规划与客户 POC 演示，结合场景验证反馈梳理用户要完成的分析任务，抽象共性需求并推进产品方案迭代。识别服务网点选址等时空分析需求，支持定制化交付；主导 Agent 多轮对话体验设计，覆盖提问、指标确认、结果查看与继续追问。'
        : 'Contributed to data analysis Agent requirements planning and customer POC demos. Used scenario feedback to map analysis tasks, identify shared needs, and iterate product solutions. Identified spatiotemporal analysis needs such as service outlet location planning for customized delivery, and led multi-turn Agent conversation experience design across question input, metric confirmation, result review, and follow-up questions.',
      bullets: isZh
        ? ['客户演示：围绕实际业务需求参与 POC 演示', '场景验证：识别服务网点选址等时空分析需求', '需求梳理：结合反馈明确 Agent 多轮对话的交互需求']
        : ['Customer demos: participate in POC demos around business needs', 'Scenario validation: identify needs such as service outlet location planning', 'Requirements: use feedback to define interaction needs for multi-turn Agent conversations'],
      images: [],
    },
  ]

  return {
    title: getProjectTitle(project, locale),
    demoUrl: DATA_PILOT_DEMO_URL,
    paragraphs: [
      isZh ? 'AI 智能问数是一款面向业务分析场景的自然语言数据产品。产品将业务数据、指标口径与语义知识加工为 AI 可理解的上下文，提升问数结果的准确性，并支持从查询结果继续生成报表、仪表盘等数据应用。' : 'DataAgent is a natural-language analytics product for business scenarios. It turns business data, metric definitions, and semantic knowledge into AI-readable context for more accurate answers, then supports continued creation of reports, dashboards, and other data applications.',
      isZh ? '项目沿三条主线推进：产品体验设计，让 AI 结果可理解、可确认、可修正；POC 场景验证，通过客户演示与反馈验证业务场景价值；海外 SaaS 探索，通过 AI 模拟验证市场定位、首次使用与付费路径。' : 'The project followed three tracks: product experience design to make AI results understandable, confirmable, and editable; POC scenario validation through customer demos and feedback; and overseas SaaS exploration using AI simulation to validate market positioning, first use, and payment paths.',
      isZh ? '我参与数据分析 Agent 的产品需求规划，主导 Agent 多轮对话体验设计，覆盖提问、指标确认、结果查看与继续追问；结合客户 POC 与场景验证梳理关键交互需求，并针对分析问题排查需求设计智能体回放方案。' : 'I contributed to data analysis Agent requirements planning and led multi-turn Agent conversation experience design, covering question input, metric confirmation, result review, and follow-up questions. I used customer POC and scenario validation feedback to identify key interaction needs and designed an Agent replay solution for diagnosing analysis problems.',
    ],
    metadata: ['角色：产品体验负责人', '阶段：技术验证 → 商业化交付', '周期：持续迭代'],
    parts: {
      experience: { title: isZh ? '产品体验设计' : 'Product experience design', sections },
      poc: { title: isZh ? 'POC 场景验证' : 'POC scenario validation', sections: pocSections },
      growth: { title: isZh ? '海外 SaaS 探索' : 'Overseas SaaS exploration', sections: growthSections },
    },
    labels: {
      back: isZh ? '返回' : 'Back',
      demo: isZh ? '查看 Demo' : 'View demo',
      tabs: isZh ? '案例内容切换' : 'Case study sections',
      contents: isZh ? '案例目录' : 'Case study contents',
      navigation: isZh ? '项目导航' : 'Project navigation',
      previous: isZh ? '上一个' : 'Previous',
      next: isZh ? '下一个' : 'Next',
      relatedIntro: isZh ? '可观测产品孵化由交付问题延展而来，详见' : 'The observability product grew from delivery problems; see',
      relatedProject: isZh ? 'Agent 可观测产品' : 'Agent observability product',
      scene: '用户场景',
      problem: '体验问题',
      solution: '解决思路',
    },
  }
}

const contentByLocale = { zh: createDataPilotContent('zh'), en: createDataPilotContent('en') }

export function getDataPilotContent(locale: Locale) {
  return contentByLocale[locale]
}
