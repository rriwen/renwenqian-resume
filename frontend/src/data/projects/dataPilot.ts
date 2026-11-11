import type { ProjectDetailTable } from '../projectDetails'
import type { Locale } from '../../i18n/translations'
import { getProjectBySlug, getProjectTitle } from '../projects'

export type DataPilotPart = 'experience' | 'poc' | 'growth'
export type DataPilotSection = {
  id: string
  group?: { id: string; title: string }
  index: string
  title: string
  intro: string
  body: string
  table?: ProjectDetailTable
  steps?: { title: string; detail: string }[]
  bullets?: string[]
  evolutionMedia?: { src?: string; caption: string }[]
  adoptionResult?: { before: number; after: number; label: string; beforeLabel: string; afterLabel: string; changeLabel: string }
  stats?: string[]
  related?: boolean
  applicationTypes?: { title: string; scene: string; problem: string; solution: string; screenshot: string }[]
  /** Editorial design brief; excluded from chat facts and media. */
  designPlaceholder?: string
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
    "title": "背景目标",
    "intro": "",
    "body": "基于对公司内部 BI 人员的访谈，我们将分析任务从查询数据、生成图表，进一步梳理到整理报告、分享结果，以及围绕报告继续分析。用户需要的不只是一次查询答案，还包括可反复使用、能够继续追问的数据应用。",
    "images": [],
    "table": {
      "columns": [
        "项目",
        "说明"
      ],
      "rows": [
        {
          "id": "target-users",
          "cells": [
            "目标用户",
            "数据分析师、开发人员等\n有数据分析需求的用户"
          ]
        },
        {
          "id": "product-goal",
          "cells": [
            "产品目标",
            "利用 AI 快速完成查询、追问、生成应用等任务，降低数据分析门槛"
          ]
        },
        {
          "id": "evaluation",
          "cells": [
            "衡量标准",
            "AI 生成准确率\n应用生成采纳率"
          ]
        }
      ]
    }
  },
  {
    "id": "product-evolution",
    "title": "产品演进",
    "intro": "",
    "body": "用户需求从获取一次查询结果，逐步扩展到生成可分享的分析报告，并围绕报告继续追问和下钻分析。为承接这些任务，产品先后探索了基础对话、无限画布和三栏布局。",
    "bullets": [
      "早期版本 - 简单问数：希望解决用户在日常分析中临时查数、查看趋势的需求，例如直接提问“最近三个月的销量如何”，快速获得数据和图表。基础对话将数据与图表放在回答中，支持保留条件、继续追问。这个形式适合逐个问题展开，但图表和结论分散在消息中，不便于作为完整报告反复阅读和分享。",
      "中期探索 - 生成报告：希望解决用户在业务复盘、汇报时，需要将多次查询结果整理成完整报告并分享给同事的问题，减少手动汇总图表与结论的工作。无限画布尝试把图表、指标和结论从消息流中独立出来，提供自由组织内容的空间。但对目标用户而言，理解画布操作和组织方式有学习成本，因此后续转向更便于直接阅读报告的布局。",
      "当前版本 - 持续对话：希望解决用户阅读或共享报告后，遇到异常数据还需要继续追查的问题，例如“本月销量为什么下降，按地区拆开看看”，直接围绕报告追问和下钻分析。三栏分别承载数据资产、应用和 AI 对话：数据资产提供可信的分析基础，应用呈现最终报告，对话既用于生成应用，也用于围绕报告继续追问、下钻分析。为让报告有足够的展示空间，各栏支持展开与收起，用户可在完整阅读和边看边问之间切换。"
    ],
    "designPlaceholder": "画布探索稿｜展示应用从聊天消息中独立出来后的完整画布，以及生成报表或看板的对话入口。",
    "evolutionMedia": [
      {
        "src": "/images/datapilot-hero.png",
        "caption": "问数：在对话中查看结果与继续追问"
      },
      {
        "caption": "生成应用：画布方案探索"
      },
      {
        "src": "/images/datapilot-application-dialogue.png",
        "caption": "持续对话：应用与 AI 对话并列展示"
      }
    ],
    "images": [],
    "index": "02"
  },
  {
    "id": "conversation",
    "index": "03",
    "title": "承接追问：保留条件，标出变化",
    "intro": "",
    "body": "用户追问“这条线呢”“换成夜班”时，不会重复工厂、日期和指标。方案保留已确认的条件，在回答旁显示本轮查询范围；只有指代不清或条件缺失时才询问。",
    "images": [],
    "bullets": [
      "“看看产线 A”：只切换产线，保留日期、班次和指标。",
      "“改成夜班”：替换班次，标出变化，并核对跨日时间范围。",
      "“这条线”：有多个候选时让用户选择，不替用户猜。"
    ],
    "designPlaceholder": "图 01｜多轮上下文变化图。并排放置首次提问、追问产线、切换班次三个状态；标注每轮继承、替换与待确认的条件，突出当前分析对象。",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话体验"
    }
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "澄清确认：让用户选择，允许补充",
    "intro": "",
    "body": "“夜班效率为什么低？”中的“效率”可能有不同定义。直接查询容易用错口径，要求用户重新描述又太费力。方案用选择卡片确认班次和指标，同时允许自然语言补充。",
    "images": [],
    "bullets": [
      "只问影响结果的条件；用户确认业务含义，AI 负责查询执行。",
      "推荐选项附理由，不自动提交；独立问题一起确认，有依赖的问题分步询问。",
      "提交后显示已确认条件；取消保留对话，修改条件时显示替换内容。"
    ],
    "designPlaceholder": "图 03｜澄清卡片与确认回执。展示班次和效率口径选择、推荐理由、自由输入、提交和取消；补一张修改已有条件后的回显状态。",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话体验"
    }
  },
  {
    "id": "continuous-analysis-example",
    "index": "05",
    "title": "连续分析案例：从进度落后查到具体记录",
    "intro": "",
    "body": "以生产管理人员排查进度落后为例，交互构思用同一段对话完成以下任务。停机和质量记录用于核查，不直接作为落后原因。",
    "images": [],
    "designPlaceholder": "图 02｜连续问数故事板。四屏对应查看进度、定位产线、核查记录、切换夜班；用模拟数据标识代替真实数值，标注用户目标、AI 反馈与下一步入口。",
    "bullets": [
      "“昨天哪些产线进度落后？”——确认班次和完成率口径，展示产线列表。",
      "“看看产线 A 的情况。”——展示计划、实际与明细，保留上一轮条件。",
      "“把停机和质量记录列出来。”——查看该产线的相关记录，并标明来源。",
      "“改为夜班，其他不变。”——更新条件和结果，继续沿用分析路径。"
    ],
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话体验"
    }
  },
  {
    "id": "applications",
    "index": "06",
    "title": "应用中的持续对话：反馈进度，支持纠正",
    "intro": "",
    "body": "“把这些记录做成看板，再改为夜班。”用户需要知道生成到哪一步，以及修改是否生效。方案将执行状态与应用结果分开展示，修改时保留布局，更新受班次影响的图表、汇总和明细。",
    "images": [],
    "bullets": [
      "等待时显示当前步骤；需要补充条件时显示确认入口，停止后标明未完成内容。",
      "没有数据、部分结果和查询失败分别提示，并提供调整范围、查看记录或重试入口。",
      "更新失败的模块标注旧结果；预览、保存和发布分别反馈。"
    ],
    "designPlaceholder": "图 04｜执行与恢复状态板。展示执行中、待确认、停止、部分结果和失败重试；配一组“布局保留、班次更新”的前后对比，标明旧结果提示。",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话体验"
    }
  },
  {
    "id": "agent-replay",
    "index": "07",
    "title": "回放方案：从异常回答查到执行步骤",
    "intro": "",
    "body": "切换夜班后结果为空，但用户认为当晚有生产。只看答案无法判断是时间条件错了，还是查询没有返回数据。回放方案让实施与调试人员从这条回答进入执行记录；回放读取已有记录，不是重新执行。",
    "images": [],
    "bullets": [
      "提交问题时带上原始提问、查询条件和回答，减少重复描述。",
      "默认展示步骤与状态，选中后查看输入、查询参数和工具输出。",
      "从结果表也能找到关联步骤；记录缺失时明确提示，不补推测内容。"
    ],
    "designPlaceholder": "图 05｜回放工作台主流程。展示回答上的问题入口、执行步骤列表和证据详情；选中查询步骤，核对跨日时间参数与空结果。补充对象与关联步骤的切换示意。",
    "group": {
      "id": "agent-troubleshooting",
      "title": "Agent 问题排查"
    }
  },
  {
    "id": "accuracy",
    "index": "08",
    "title": "设计取舍：先看步骤，再看详情",
    "intro": "",
    "body": "全部展开日志难以找到重点，只展示结果又缺少排查依据。第一版拟采用“步骤概览＋按需展开详情”，保留从结果表回查步骤的入口，暂不加入自动诊断和修复。",
    "images": [],
    "bullets": [
      "定位：检查夜班查询是否错误使用自然日边界。",
      "判断：结合参数和返回记录确认原因；AI 解释仅作线索。",
      "复测：修正后在新会话重测，再检查日班、跨月和缺失记录。"
    ],
    "designPlaceholder": "图 06｜回放方案取舍与排查闭环。对照“完整日志”和“步骤概览＋证据详情”两种信息组织方式；下方展示定位、人工判断、修正、复测四步。",
    "group": {
      "id": "agent-troubleshooting",
      "title": "Agent 问题排查"
    }
  },
  {
    "id": "role",
    "index": "09",
    "title": "验证结果",
    "adoptionResult": { "before": 15, "after": 60, "label": "应用生成采纳率", "beforeLabel": "早期", "afterLabel": "迭代后", "changeLabel": "提升 45 个百分点" },
    "intro": "",
    "body": "随着产品逐步迭代，应用生成采纳率从 15% 逐步提升到 60%。",
    "images": [],
    "bullets": [
      "统计口径：应用生成采纳率 = 用户发布应用数 ÷ 创建应用数 × 100%"
    ]
  }
]
    : [
  {
    "id": "overview",
    "index": "01",
    "title": "Background and goals",
    "intro": "",
    "body": "Interviews with internal BI staff informed a broader view of analysis tasks: querying data, generating charts, organizing reports, sharing results and continuing analysis around those reports. Users need more than a one-off answer; they need reusable data applications that support further questions.",
    "images": [],
    "table": {
      "columns": [
        "Item",
        "Description"
      ],
      "rows": [
        {
          "id": "target-users",
          "cells": [
            "Target users",
            "Data analysts, developers and other users with data analysis needs"
          ]
        },
        {
          "id": "product-goal",
          "cells": [
            "Product goal",
            "Use AI to quickly complete queries, follow-up questions and application generation, lowering the barrier to data analysis"
          ]
        },
        {
          "id": "evaluation",
          "cells": [
            "Evaluation criteria",
            "AI generation accuracy\nAdoption rate of AI-generated applications"
          ]
        }
      ]
    }
  },
  {
    "id": "product-evolution",
    "title": "Product evolution",
    "intro": "",
    "body": "User needs expanded from a single query result to shareable analysis reports and continued questions and drill-down analysis around those reports. To support these tasks, the product explored basic dialogue, an infinite canvas and a three-column layout.",
    "bullets": [
      "Early version - Simple queries: the goal is to support ad hoc data queries and trend checks during everyday analysis, such as asking about sales over the last three months and quickly receiving data and charts. Basic dialogue presents data and charts within answers, retaining scope for follow-up questions. It works for individual questions, but charts and conclusions scattered across messages are harder to read and share as a complete report.",
      "Intermediate exploration - Report generation: the goal is to help users preparing business reviews and presentations turn multiple query results into a complete report to share with colleagues, reducing manual consolidation of charts and conclusions. An infinite canvas separates charts, metrics and conclusions from the message stream and offers flexible arrangement. However, learning its controls and organization adds effort for the target users, prompting a shift toward a layout suited to reading reports directly.",
      "Current version - Ongoing dialogue: the goal is to help users investigate anomalies while reviewing or sharing a report, such as asking why monthly sales declined and breaking them down by region, with follow-up questions and drill-down analysis grounded in the report. Three columns hold data assets, applications and AI dialogue. Data assets provide a trusted basis for analysis; applications present the final reports; dialogue supports both application generation and further questions and drill-down analysis. Columns can expand or collapse to give reports sufficient space and let users switch between focused reading and asking questions alongside a report."
    ],
    "designPlaceholder": "Canvas exploration | Show the application outside the message stream, with the dialogue entry for generating a report or dashboard.",
    "evolutionMedia": [
      {
        "src": "/images/datapilot-hero.png",
        "caption": "Query: inspect results and ask follow-ups"
      },
      {
        "caption": "Generate: canvas exploration"
      },
      {
        "src": "/images/datapilot-application-dialogue.png",
        "caption": "Continue the conversation: view the application alongside AI dialogue"
      }
    ],
    "images": [],
    "index": "02"
  },
  {
    "id": "conversation",
    "index": "03",
    "title": "Follow-ups: retain scope and show changes",
    "intro": "",
    "body": "Follow-ups such as “What about this line?” omit previously supplied filters. Retain confirmed conditions and show the active scope beside the answer. Ask only when a reference or necessary condition is unclear.",
    "images": [],
    "bullets": [
      "“Inspect Line A”: change the line, retain date, shift and metric.",
      "“Switch to night shift”: highlight the change and confirm cross-day boundaries.",
      "“This line”: offer a choice when multiple lines could match."
    ],
    "designPlaceholder": "Figure 01 | Three dialogue states: initial query, line follow-up and shift change. Annotate inherited, replaced and unresolved conditions.",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    }
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "Clarification: choices with room for explanation",
    "intro": "",
    "body": "“Why was night-shift efficiency low?” leaves the metric undefined. Guessing risks the wrong query; asking for a full rewrite adds effort. Offer choices for shifts and metrics, with free-text input.",
    "images": [],
    "bullets": [
      "Ask only about consequential conditions; users define business meaning and AI executes queries.",
      "Explain recommendations without submitting them automatically. Group independent questions and sequence dependent ones.",
      "Show confirmed scope after submission, retain dialogue on cancellation and display changed conditions."
    ],
    "designPlaceholder": "Figure 03 | Clarification card, recommendation rationale, free text, submit/cancel actions and a receipt showing changed conditions.",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    }
  },
  {
    "id": "continuous-analysis-example",
    "index": "05",
    "title": "Analysis example: from delays to underlying records",
    "intro": "",
    "body": "This proposed conversation helps a production manager investigate delays. Downtime and quality records support investigation; they do not establish causation.",
    "images": [],
    "designPlaceholder": "Figure 02 | Four screens for progress, line inspection, records and night-shift changes, with explicit simulated-data labels.",
    "bullets": [
      "“Which lines fell behind yesterday?” — Confirm shift and metric, then list lines.",
      "“Inspect Line A.” — Show plan, actual output and records with prior filters retained.",
      "“List downtime and quality records.” — Show related records and sources.",
      "“Switch to night shift; keep everything else.” — Update scope and results within the same analysis."
    ],
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    }
  },
  {
    "id": "applications",
    "index": "06",
    "title": "Dialogue with applications: progress and corrections",
    "intro": "",
    "body": "“Build a dashboard from these records, then switch it to night shift.” Users need to see progress and whether revisions took effect. Separate execution status from application output; retain layout while updating affected charts, summaries and records.",
    "images": [],
    "bullets": [
      "Show the current step, confirmation requests and unfinished output after stopping.",
      "Distinguish empty, partial and failed results with appropriate recovery actions.",
      "Label stale modules when updates fail; report preview, save and publication separately."
    ],
    "designPlaceholder": "Figure 04 | Running, confirmation, stopped, partial and failed states; before/after shift revision with stale-result labels.",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    }
  },
  {
    "id": "agent-replay",
    "index": "07",
    "title": "Replay proposal: trace an abnormal answer to execution steps",
    "intro": "",
    "body": "A night-shift query returns no rows despite expected production. The answer alone cannot distinguish wrong time filters from missing data. Let implementation and debugging staff open the execution record from that answer. Replay reads saved records; it does not re-execute the task.",
    "images": [],
    "bullets": [
      "Include the question, filters and answer with issue reports.",
      "Show steps and status first; reveal inputs, query parameters and tool output on selection.",
      "Link result tables to related steps and explicitly label missing records."
    ],
    "designPlaceholder": "Figure 05 | Answer entry, execution timeline and evidence panel showing cross-day parameters and empty results; object-to-step navigation.",
    "group": {
      "id": "agent-troubleshooting",
      "title": "Agent troubleshooting"
    }
  },
  {
    "id": "accuracy",
    "index": "08",
    "title": "Design trade-offs: steps first, details on demand",
    "intro": "",
    "body": "Expanded logs are hard to scan, while output alone lacks diagnostic evidence. The proposed first version uses a step overview with on-demand details and links from result tables. Automatic diagnosis and repair are outside this scope.",
    "images": [],
    "bullets": [
      "Locate: check whether the night-shift query used calendar-day boundaries.",
      "Judge: corroborate causes with parameters and records; treat AI explanations as leads.",
      "Retest: use a new session, then cover day shifts, month boundaries and missing records."
    ],
    "designPlaceholder": "Figure 06 | Compare full logs with progressive evidence disclosure; show locate, judge, correct and retest.",
    "group": {
      "id": "agent-troubleshooting",
      "title": "Agent troubleshooting"
    }
  },
  {
    "id": "role",
    "index": "09",
    "title": "Validation results",
    "adoptionResult": { "before": 15, "after": 60, "label": "Application adoption rate", "beforeLabel": "Initially", "afterLabel": "After iteration", "changeLabel": "Up 45 percentage points" },
    "intro": "",
    "body": "As the product evolved, adoption of generated applications gradually increased from 15% to 60%.",
    "images": [],
    "bullets": [
      "Measurement: application adoption rate = applications published by users ÷ applications created × 100%"
    ]
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
      title: isZh ? "客户场景 POC" : "Customer manufacturing POC",
      intro: isZh ? "验证智能问数能否帮助业务人员追查生产进度" : "Validate analytics for investigating production progress",
      body: isZh ? "我参与客户 POC，围绕“生产进度落后，怎样定位工厂、产线和效率损失”组织案例。客户已有运营看板与日报，POC 聚焦从总览继续追查的业务价值：找到关注对象、核对指标口径，再回到具体记录。" : "I participated in the customer POC. This case centers on locating factories, lines, and efficiency losses when production falls behind. With dashboards and daily reports already available, the POC focuses on deeper investigation: identify relevant objects, reconcile definitions, and inspect business records.",
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
    heroImage: '/images/datapilot-application-dialogue.png',
    paragraphs: [
      isZh ? 'AI 智能问数是一款面向业务分析场景的自然语言数据产品。产品将业务数据、指标口径与语义知识加工为 AI 可理解的上下文，提升问数结果的准确性，并支持从查询结果继续生成报表、仪表盘等数据应用。' : 'The AI analytics product supports natural-language analysis for business scenarios. It turns business data, metric definitions, and semantic knowledge into AI-readable context for more accurate answers, then supports continued creation of reports, dashboards, and other data applications.',
      isZh ? '本案例重点呈现多轮对话、人机交互与智能体回放孵化。围绕客户与用户问题，通过具体示例说明交互方案，将条件继承、业务澄清、执行反馈和证据回查串成一条连续任务；POC 与海外 SaaS 探索作为补充材料。' : 'This case focuses on multi-turn dialogue, human–AI interaction and Agent replay incubation, using concrete user questions to illustrate interaction proposals. POC and overseas SaaS exploration provide supplementary context.',
      isZh ? '我参与数据分析 Agent 的产品需求规划，主导 Agent 多轮对话体验设计，覆盖提问、指标确认、结果查看与继续追问；结合客户 POC 与场景验证梳理关键交互需求，并针对分析问题排查需求设计智能体回放方案。支持 4 家付费客户交付。' : 'I contributed to data analysis Agent requirements planning and led multi-turn Agent conversation experience design, covering question input, metric confirmation, result review, and follow-up questions. I used customer POC and scenario validation feedback to identify key interaction needs and designed an Agent replay solution for diagnosing analysis problems. Supported delivery to 4 paying customers.',
    ],
    metadata: isZh ? ['职责：交互设计与方案探索', '场景：客户生产分析', '重点：多轮对话 · 人机交互 · 回放孵化'] : ['Role: interaction design and exploration', 'Context: Customer manufacturing POC', 'Focus: dialogue · human–AI interaction · replay incubation'],
    lead: isZh ? '从自然语言问数到应用生成与持续对话，设计提问、追问与应用修改流程，孵化智能体回放能力。' : 'Design question, follow-up and application revision flows as the product evolves from natural-language queries to application generation and ongoing dialogue, while incubating Agent replay.',
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
