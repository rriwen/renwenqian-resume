import type { ProjectDetailTable } from '../projectDetails'
import type { Locale } from '../../i18n/translations'
import { getProjectBySlug, getProjectTitle } from '../projects'

export type DataPilotPart = 'experience' | 'poc' | 'growth'
export type DataPilotSection = {
  id: string
  index: string
  title: string
  intro: string
  body: string
  table?: ProjectDetailTable
  steps?: { title: string; detail: string }[]
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
    "id": "overview",
    "index": "01",
    "title": "从问数到应用：0 → 1 的产品演进",
    "intro": "让一次分析，成为可以继续使用的工作成果",
    "body": "DataPilot 最初解决用自然语言查询数据，随后扩展到应用生成。我从 0 到 1 参与产品建设，负责多轮对话、应用生成和智能体回放的设计与前端实现。\n\n体验设计的重点也随之变化：问数阶段澄清业务口径，应用阶段支持连续修改，交付阶段依据执行证据定位偏差。三个能力围绕同一条任务链连接起来。",
    "bullets": [
      "对话：让业务目标可确认。",
      "应用：让分析成果可继续修改与使用。",
      "回放：让执行偏差可追查。"
    ],
    "images": []
  },
  {
    "id": "conversation",
    "index": "02",
    "title": "多轮对话：把澄清留在任务里",
    "intro": "只问影响决策的问题",
    "body": "直接回答含糊问题容易把错误口径带进后续应用；每一步都询问，又会让业务人员替 Agent 做技术决策。我的取舍是让用户决定业务目标与口径，Agent 负责组织工具执行。\n\n实现上，原始请求、待回答的问题与用户答复关联到同一任务。界面恢复时能够继续呈现待处理交互，避免把刷新当成新任务。这个机制支持中途澄清，不等于模型可以无误记住所有历史。",
    "bullets": [
      "明确条件直接推进，关键歧义才澄清。",
      "保留请求与答复的关联，支持恢复后的继续交互。",
      "新旧条件冲突时，让变化可核对。"
    ],
    "images": []
  },
  {
    "id": "continuous-analysis-example",
    "index": "03",
    "title": "海尔生产场景：一条连续任务",
    "intro": "交互构思示范，与已有 POC 衔接",
    "body": "以下对话是基于 DataPilot 能力构思的交互示范，不是海尔客户访谈原话、真实故障或已完成的验证结果。它承接已有 POC 的生产进度场景，说明如何从分析走向可复用应用。\n\n生产落后的原因仍需结合排产与工单核实，不能直接归因为 OEE。",
    "bullets": [
      "用户：“看看哪些产线进度落后。”Agent：“看哪个日期和班次？按计划完成率，还是计划与实际数量差判断？”",
      "用户：“昨天白班，按计划完成率。”保留工厂范围，核对日期、班次和计算口径。",
      "用户：“把这条产线的停机和质量记录放进应用，每天复盘用。”缺少节拍等必要定义时说明限制，不补造 OEE。",
      "用户：“改为夜班，保留布局，按完成率排序。”保留已认可的结构，同时更新关联数据。"
    ],
    "images": []
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "应用修改：保留结构，更新关联结果",
    "intro": "局部修改不能变成只改一张图",
    "body": "“改为夜班，布局不变”包含两个约束：保留已认可的页面结构，同时更新受班次影响的进度、排序和明细。只更新当前图表，其余模块仍显示白班数据，会造成看似完成、结果却矛盾的页面。\n\n设计上将保留项与变更项分开表达，修改后核对关联结果。实现通过应用与版本上下文承接继续编辑；是否正确更新全部依赖，需要跨模块测试，不能以生成成功代替业务验证。",
    "bullets": [
      "保留：布局、模块顺序和未改变的分析范围。",
      "更新：班次条件、查询结果、汇总值与排序。",
      "核对：所有视图口径一致；新数据失败时明确提示旧结果。"
    ],
    "images": []
  },
  {
    "id": "applications",
    "index": "05",
    "title": "应用生成：区分预览、保存与使用",
    "intro": "让用户知道自己拿到的是哪一步成果",
    "body": "候选预览、保存版本与发布代表不同的完成状态。预览可打开说明界面可呈现，保存成功说明版本已保留，发布成功说明选定版本可以访问。这些都不能单独证明数据正确或用户已经采纳。\n\n用户围绕当前应用继续修改，系统保留版本语境。发布失败时不替换已有发布版本，避免破坏已经使用的成果。我的职责是将这些机制转译为前端体验，不将全部服务端能力归为个人实现。",
    "bullets": [
      "候选预览：检查界面和关键交互。",
      "保存版本：形成可以继续编辑的稳定对象。",
      "业务核对：与相同日期、班次和口径的记录对照。",
      "发布与使用：分别观察发布成功和后续有效使用。"
    ],
    "images": []
  },
  {
    "id": "agent-replay",
    "index": "06",
    "title": "智能体回放：从异常回到证据",
    "intro": "执行成功，不代表回答了正确的问题",
    "body": "回放沿执行阶段查看输入、工具结果和状态，也可沿数据对象查看关联证据。两个入口帮助定位首次出现偏差的位置，而不是让人阅读完整日志。回放重建已持久化的记录，不是重新执行，也不等于展示模型全部内部思考。\n\n构思示例：夜班分析返回空结果，但业务人员认为当天有生产。先核对班次条件，再检查查询参数、跨日时间边界和返回记录。如果跨日夜班被自然日截断，应作为待核实的口径问题，不能直接认定没有业务数据。",
    "bullets": [
      "步骤入口：从异常追到输入、参数和工具输出。",
      "对象入口：查看数据与执行证据之间的关系。",
      "区分证据与诊断：AI 提出的原因是线索，不是已核实结论。"
    ],
    "images": []
  },
  {
    "id": "accuracy",
    "index": "07",
    "title": "Agent 调优：把个案变成回归任务",
    "intro": "先定位偏差，再选择修正层级",
    "body": "调优方案从原始问题、预期结果与实际输出开始。依据回放证据，区分指标定义、字段映射、工具参数与交互澄清问题，避免一律增加提示词或确认步骤。\n\n在跨日夜班的构思中，补齐班次定义后重新测试原问题，再扩展到日班、跨月和缺失记录。配置修改后在新会话验证，避免旧会话保留的执行配置干扰判断。以下是拟议回归方案，不是已完成实验或自动修复闭环。",
    "bullets": [
      "知识层：明确完成率、良品与返工口径。",
      "工具层：检查筛选字段、时间边界和参数映射。",
      "交互层：只澄清会改变结论的缺失条件。",
      "回归层：验证原问题、邻近场景和修改后的关联视图。"
    ],
    "images": []
  },
  {
    "id": "delivery",
    "index": "08",
    "title": "采纳优化：从生成成功走向持续使用",
    "intro": "建立可以验证的优化故事",
    "body": "待验证假设：初次口径不符、修改成本高和成果状态不清，会使用户放弃应用。对应的优化是关键澄清、连续编辑和清晰的版本状态；回放帮助团队定位重复错误。\n\n先观察生成保存是否成功，再观察用户是否发布或用于工作，最后检查是否持续使用。当前没有可核实的采纳提升数据，因此不将历史草稿中的数值写成实绩。",
    "bullets": [
      "关键澄清 → 检查口径错误是否减少。",
      "连续编辑 → 检查修改完成率与放弃情况。",
      "版本状态 → 检查保存到发布的流失。",
      "回放调优 → 检查同类错误的回归复现。"
    ],
    "images": []
  },
  {
    "id": "role",
    "index": "09",
    "title": "指标验证：明确分母与观察期",
    "intro": "发布转化是中间指标，持续使用才接近采纳",
    "body": "对需要发布的任务，建议以首次生成并保存成功、且有完整 7 天观察期的唯一应用为分母；分子为期间用户主动发布、服务端确认成功的唯一应用。重复编辑或发布不重复计数。\n\n自用分析在任务开始前单独归类，观察重复有效使用；发布后的业务使用另行跟踪，不能只数页面打开。生成或保存失败作为上游损失单列，不能事后排除失败样本来美化转化。\n\nPOC 样本有限时，优先记录独立完成数、人工介入次数、任务耗时中位数与重复错误。固定前后比较的任务条件，再讨论提升幅度。",
    "bullets": [
      "核心：7 天发布转化与后续有效使用。",
      "护栏：生成保存成功率、正确性与放弃率。",
      "状态：验证方案已定义，实际效果待数据验证。"
    ],
    "images": []
  }
]
    : [
  {
    "id": "overview",
    "index": "01",
    "title": "Product evolution",
    "intro": "",
    "body": "I participated in DataPilot from zero to one, owning design and frontend implementation of multi-turn conversations, application generation and Agent replay.",
    "images": []
  },
  {
    "id": "conversation",
    "index": "02",
    "title": "Multi-turn conversation",
    "intro": "",
    "body": "Clarify only material business ambiguities. Persist requests, pending questions and replies within the task so interaction can resume. This does not guarantee perfect model memory.",
    "images": []
  },
  {
    "id": "continuous-analysis-example",
    "index": "03",
    "title": "Manufacturing interaction example",
    "intro": "",
    "body": "This hypothetical dialogue extends the existing Haier manufacturing POC. It is not a customer quotation or verified outcome. A user reviews progress, investigates a line and creates an application. OEE alone does not establish causes of delay.",
    "images": []
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "Consistent revisions",
    "intro": "",
    "body": "Changing shifts while preserving layout should update all dependent views. Application version context supports continued edits; correctness needs cross-view validation.",
    "images": []
  },
  {
    "id": "applications",
    "index": "05",
    "title": "Preview, save and use",
    "intro": "",
    "body": "Preview, save, publication and business use are distinct. Failed publication preserves the existing released version. Backend mechanisms are not presented as my sole implementation.",
    "images": []
  },
  {
    "id": "agent-replay",
    "index": "06",
    "title": "Agent replay",
    "intro": "",
    "body": "Replay reconstructs persisted evidence, not re-execution or all internal reasoning. A hypothetical empty night-shift result requires checking cross-day boundaries. AI diagnoses remain hypotheses.",
    "images": []
  },
  {
    "id": "accuracy",
    "index": "07",
    "title": "Agent tuning",
    "intro": "",
    "body": "Capture expected and actual results, locate evidence, correct knowledge, tools or interaction, then run original and adjacent regression cases. Validate configuration changes in a new session. This is a proposed plan.",
    "images": []
  },
  {
    "id": "delivery",
    "index": "08",
    "title": "Adoption hypotheses",
    "intro": "",
    "body": "Test whether clarification, continued editing and version states reduce abandonment and recurring errors. No verified adoption uplift is available.",
    "images": []
  },
  {
    "id": "role",
    "index": "09",
    "title": "Measurement plan",
    "intro": "",
    "body": "Measure unique first-saved applications with a complete seven-day observation window and explicit successful publication. Track meaningful use separately, preclassify self-use tasks and report upstream failures, correctness and abandonment. POC evaluation also tracks independent completion, interventions and median duration.",
    "images": []
  }
]

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
      id: "poc-validation", index: "01",
      title: isZh ? "海尔生产场景 POC" : "Haier manufacturing POC",
      intro: isZh ? "验证智能问数能否帮助业务人员追查生产进度" : "Validate analytics for investigating production progress",
      body: isZh ? "我参与海尔客户 POC，围绕“生产进度落后，怎样定位工厂、产线和效率损失”组织案例。客户已有运营看板与日报，POC 聚焦从总览继续追查的业务价值：找到关注对象、核对指标口径，再回到具体记录。" : "I participated in the Haier customer POC. This case centers on locating factories, lines, and efficiency losses when production falls behind. With dashboards and daily reports already available, the POC focuses on deeper investigation: identify relevant objects, reconcile definitions, and inspect business records.",
      images: [],
    },
    {
      id: "poc-haier-scope", index: "02",
      title: isZh ? "场景取舍" : "Scope decisions",
      intro: isZh ? "优先验证生产进度，按数据条件展开 OEE 分析" : "Start with production progress and expand into OEE as data allows",
      body: isZh ? "按业务价值、数据可用性与验证成本收敛范围：先验证生产进度，再按条件展开效率分析。" : "Orders, work orders, and lines had been inventoried and take priority. OEE has leads in downtime, scans, and inspections, with shift and cycle-time definitions still to confirm. Equipment prediction and process control require more data and specialist validation. Scope balances business value, data readiness, and validation cost.",
      table: isZh ? {"columns": ["候选场景", "已有条件", "POC 取舍"], "rows": [{"id": "poc-haier-scope-1", "cells": ["订单完成 / 负荷", "订单、工单、工厂与产线", "优先验证"]}, {"id": "poc-haier-scope-2", "cells": ["OEE 损失分析", "停机、扫描与检验记录", "先澄清班次与节拍"]}, {"id": "poc-haier-scope-3", "cells": ["质量追溯", "检验与不良记录", "核对工序、批次关联"]}, {"id": "poc-haier-scope-4", "cells": ["设备预测 / 过程控制", "数据与专业条件待补", "暂不纳入首轮"]}]} : {"columns": ["Scenario", "Available inputs", "POC priority"], "rows": [{"id": "poc-haier-scope-1", "cells": ["Completion / load", "Orders, work orders, factories and lines", "Validate first"]}, {"id": "poc-haier-scope-2", "cells": ["OEE losses", "Downtime, scans and inspections", "Clarify shifts and cycle times"]}, {"id": "poc-haier-scope-3", "cells": ["Quality traceability", "Inspections and defect records", "Check process and batch links"]}, {"id": "poc-haier-scope-4", "cells": ["Prediction / process control", "Further data and specialist input needed", "Outside the first round"]}]},
      images: [],
    },
    {
      id: "poc-haier-metrics", index: "03",
      title: isZh ? "数据准备" : "Data preparation",
      intro: isZh ? "把行业指标转成客户可核对的口径" : "Translate industry metrics into verifiable customer definitions",
      body: isZh ? "将 OEE 拆解到客户的数据与计算规则，演示前列出缺失条件，确保结果能够与日报对照。" : "Map OEE availability, performance, and quality losses to downtime, production scans, and inspection records. Before demonstration, clarify shifts, ideal cycle times, downtime categories, and good-output definitions. List missing inputs explicitly so comparisons with customer reports use matching definitions.",
      table: isZh ? {"columns": ["分析维度", "关联数据", "待确认口径"], "rows": [{"id": "poc-haier-metrics-1", "cells": ["时间损失 · A", "停机、订单与时序工单", "计划生产时间、班次、停机分类"]}, {"id": "poc-haier-metrics-2", "cells": ["速度损失 · P", "生产扫描、工单与产线", "理想节拍、运行时间、产量单位"]}, {"id": "poc-haier-metrics-3", "cells": ["质量损失 · Q", "检验、不良数与下线量", "良品、返工、报废及检验范围"]}]} : {"columns": ["Dimension", "Related data", "Definitions to confirm"], "rows": [{"id": "poc-haier-metrics-1", "cells": ["Availability · A", "Downtime, orders and timed work orders", "Planned production time, shifts and stop categories"]}, {"id": "poc-haier-metrics-2", "cells": ["Performance · P", "Scans, work orders and lines", "Ideal cycle time, operating time and output units"]}, {"id": "poc-haier-metrics-3", "cells": ["Quality · Q", "Inspections, defects and completed output", "Good units, rework, scrap and inspection scope"]}]},
      images: [],
    },
    {
      id: "poc-haier-task", index: "04",
      title: isZh ? "演示设计" : "Demonstration design",
      intro: isZh ? "用一项连续任务展示分析价值" : "Demonstrate value through one continuous task",
      body: isZh ? "保留日期、班次与当前产线，让追问能够继续、条件变化能够看见、异常结论能够回查。进度落后的原因仍需结合工单与排产核实。" : "The demonstration follows progress review → line selection → loss breakdown → record inspection. Interaction priorities are preserving dates, shifts, and the current line across follow-ups, exposing condition changes, and making findings traceable. Delays require work-order and scheduling checks before attributing them to OEE.",
      steps: isZh ? [{"title": "查看进度", "detail": "核对计划与实际"}, {"title": "定位产线", "detail": "保留日期与班次"}, {"title": "拆解损失", "detail": "对齐 OEE 口径"}, {"title": "核查记录", "detail": "回查停机与检验"}] : [{"title": "Review progress", "detail": "Compare plan and actual"}, {"title": "Locate lines", "detail": "Retain dates and shifts"}, {"title": "Inspect losses", "detail": "Align OEE definitions"}, {"title": "Check records", "detail": "Inspect stops and quality"}],
      images: [],
    },
    {
      id: "poc-haier-evaluation", index: "05",
      title: isZh ? "验证标准" : "Evaluation criteria",
      intro: isZh ? "围绕同一业务任务检查可用性与可信度" : "Check usability and trust through the same business task",
      body: isZh ? "POC 围绕任务完成情况评价方案，记录结果核对、人工修改与求助位置，为下一轮迭代定位问题。" : "Evaluate task completion and record reconciliation issues, manual edits, and requests for help to guide the next iteration.",
      bullets: isZh ? ["能否独立找到需要关注的工厂与产线", "能否与同一时间、同一口径的日报对照", "能否从损失指标回查停机或检验记录", "更换产线或班次后，分析路径能否复用"] : ["Independently identify factories and lines needing attention", "Reconcile with daily reports using matching time and definitions", "Trace loss metrics to downtime or inspection records", "Reuse the analysis path for another line or shift"],
      images: [],
    },
    {
      id: "poc-haier-delivery", index: "06",
      title: isZh ? "阶段产出" : "Stage outputs",
      intro: isZh ? "用具体应用承接客户评价" : "Give customers concrete applications to evaluate",
      body: isZh ? "已有应用承接客户演示与讨论。后续聚焦条件继承、结果回查和数据更新提示，指标口径与使用效果继续由业务人员验证。" : "Existing operations, capacity-load, OEE, and daily-report applications support demonstrations. The POC grounds discussion in scenarios, definitions, and analysis paths, with follow-up validation focused on condition inheritance, source-record inspection, and data freshness. Business users still need to validate definitions and usage outcomes.",
      table: isZh ? {"columns": ["业务任务", "已有应用"], "rows": [{"id": "poc-haier-delivery-1", "cells": ["查看生产进度", "工厂线体生产运营看板"]}, {"id": "poc-haier-delivery-2", "cells": ["分析产能负荷", "产能负荷率综合分析"]}, {"id": "poc-haier-delivery-3", "cells": ["追查设备效率", "设备 OEE 综合效率看板"]}, {"id": "poc-haier-delivery-4", "cells": ["日常复盘", "工厂日报、线体运营大屏"]}]} : {"columns": ["Business task", "Existing application"], "rows": [{"id": "poc-haier-delivery-1", "cells": ["Review production progress", "Factory and line operations dashboard"]}, {"id": "poc-haier-delivery-2", "cells": ["Analyze capacity load", "Capacity utilization analysis"]}, {"id": "poc-haier-delivery-3", "cells": ["Investigate equipment efficiency", "Equipment OEE dashboard"]}, {"id": "poc-haier-delivery-4", "cells": ["Daily review", "Factory reports and line displays"]}]},
      images: [],
    },
  ]

  return {
    title: getProjectTitle(project, locale),
    tags: project.tags[locale],
    demoUrl: DATA_PILOT_DEMO_URL,
    paragraphs: [
      isZh ? 'AI 智能问数是一款面向业务分析场景的自然语言数据产品。产品将业务数据、指标口径与语义知识加工为 AI 可理解的上下文，提升问数结果的准确性，并支持从查询结果继续生成报表、仪表盘等数据应用。' : 'DataAgent is a natural-language analytics product for business scenarios. It turns business data, metric definitions, and semantic knowledge into AI-readable context for more accurate answers, then supports continued creation of reports, dashboards, and other data applications.',
      isZh ? '项目沿三条主线推进：产品体验设计，让 AI 结果可理解、可确认、可修正；POC 场景验证，通过客户演示与反馈验证业务场景价值；海外 SaaS 探索，通过 AI 模拟验证市场定位、首次使用与付费路径。' : 'The project followed three tracks: product experience design to make AI results understandable, confirmable, and editable; POC scenario validation through customer demos and feedback; and overseas SaaS exploration using AI simulation to validate market positioning, first use, and payment paths.',
      isZh ? '我参与数据分析 Agent 的产品需求规划，主导 Agent 多轮对话体验设计，覆盖提问、指标确认、结果查看与继续追问；结合客户 POC 与场景验证梳理关键交互需求，并针对分析问题排查需求设计智能体回放方案。' : 'I contributed to data analysis Agent requirements planning and led multi-turn Agent conversation experience design, covering question input, metric confirmation, result review, and follow-up questions. I used customer POC and scenario validation feedback to identify key interaction needs and designed an Agent replay solution for diagnosing analysis problems.',
    ],
    metadata: ['职责：设计与前端实现', '阶段：0 → 1 与持续迭代', '范围：对话 · 应用 · 回放'],
    parts: {
      experience: { title: isZh ? '产品体验设计' : 'Product experience design', sections },
      poc: { title: isZh ? 'POC 场景验证' : 'POC scenario validation', sections: pocSections },
      growth: { title: isZh ? '海外 SaaS 探索' : 'Overseas SaaS exploration', sections: growthSections },
    },
    labels: {
      back: isZh ? '返回' : 'Back',
      demo: isZh ? '体验交互原型' : 'Try prototype',
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
