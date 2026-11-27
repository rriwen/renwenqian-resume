import type { DataPilotScenario } from './dataPilotScenario'
import type { ProjectGalleryItem } from '../projectDetails'
import type { ProjectDetailTable } from '../projectDetails'
import type { Locale } from '../../i18n/translations'
import { getProjectBySlug, getProjectTitle } from '../projects'

import { createDataPilotNarrative } from './dataPilotNarrative'

export type DataPilotPart = 'experience' | 'narrative' | 'poc' | 'growth'
export const DATA_PILOT_VISIBLE_PARTS = ['narrative'] as const
export type DataPilotSection = {
  id: string
  /** Editorial requests, excluded from chat facts and media. */
  editorialNotes?: string[]
  legacyIds?: string[]
  group?: { id: string; title: string }
  groupIntro?: boolean
  tabLabel?: string
  dialogueExtension?: boolean
  continuationOf?: string
  index: string
  title: string
  anchorTitle?: string
  intro: string
  body: string
  /** Illustrative scenario, excluded from chat facts and screenshot media. */
  scenario?: DataPilotScenario
  bodyLink?: { label: string; href: string }
  bodyEmphasis?: string | string[]
  afterDiagram?: string[]
  evolutionRationale?: string[]
  evolutionRationaleEmphasis?: string
  qaExperience?: {
    /** Editorial preparation only; excluded from chat facts. */
    materialBrief?: string
    decisions: { title: string; body: string }[]
    bridge?: string
    /** Illustrative UI only; excluded from personal facts and chat media. */
    mockup: {
      kind: 'start' | 'progress' | 'result'
      screenshotPlaceholder?: string[]
      screenshotImages?: (string | null)[]
      title: string; subtitle: string; prompt: string; label: string; caption: string
      items: { title: string; detail: string; state?: 'done' | 'active' | 'pending'; value?: number }[]
      footer: string
      analysisFields?: { label: string; options: string[] }[]
      verificationNote?: string
      sourceText?: string
      scenarios?: { title: string; status: string; detail: string; action: string }[]
    }
  }
  dialogue?: {
    status?: string
    hideMedia?: boolean
    tradeoff?: string
    decisions: { title: string; body: string }[]
    visual: {
      kind: 'sequence' | 'context' | 'workspace' | 'branches'
      caption: string
      note: string
      frames: { title: string; prompt: string; response: string; fields: { label: string; value: string; changed?: boolean }[] }[]
    }
  }
  workflow?: { summary: string; caption: string; image: ProjectGalleryItem; stages: { title: string; steps: string[]; branch: string }[] }
  diagram?: { kind: 'paths' | 'journey' | 'flow'; caption: string; lanes: { title: string; summary?: string; processingLabel?: string; steps: { title: string; detail?: string; response?: string; actor?: 'requester' | 'bi' | 'ai'; actorLabel?: string }[] }[] }
  table?: ProjectDetailTable
  beforeTable?: string
  afterTable?: string
  steps?: { title: string; detail: string }[]
  bullets?: string[]
  evolutionMedia?: { src?: string; caption: string; title?: string; description?: string; tradeoffs?: { kind: 'advantage' | 'problem'; text: string }[] }[]
  adoptionResult?: { before: number; after: number; label: string; beforeLabel: string; afterLabel: string; changeLabel: string }
  stats?: string[]
  references?: { label: string; href: string }[]
  related?: boolean
  applicationTypes?: { title: string; scene: string; problem: string; solution: string; screenshot: string }[]
  /** Editorial design brief; excluded from chat facts and media. */
  screenshotBriefs?: string[]
  designPlaceholder?: string
  images: { src: string; caption: string; display?: 'image'; alt?: string }[]
}

/** 页面、聊天和通用详情摘要共用的案例内容。 */
export const DATA_PILOT_DEMO_URL = 'https://dataagent-demo.vercel.app/'

function createDataPilotContent(locale: Locale) {
  const project = getProjectBySlug('dataagent')!
  const sections: DataPilotSection[] = [
  {
    "id": "overview",
    "index": "01",
    "title": "项目背景",
    "intro": "",
    "body": "Data Agent 面向有数据分析需求的业务用户和 BI 分析师。用户用自然语言分析业务数据，并把结果生成可查看、修改和分享的报告或仪表盘，本文统称为“应用”。用户可以围绕应用继续追问、调整内容和更新数据。\n\n做 Data Agent 的出发点，是让用户用业务语言提出问题，减少查找数据表、编写 SQL 和反复沟通取数的工作，把精力放在理解结果和继续分析上。对于不熟悉 SQL 的用户，也能从一句具体的问题开始。",
    "images": [],
    "afterDiagram": [
      "而通过对内部 BI 人员访谈了解到，取数只是工作中很小的一部分。用户还需要整理分析、与他人沟通，并在之后继续查看和更新。单次回答能够解决临时查询，却难以承接这些持续任务。",
      "因此，Data Agent 定位逐步从问数工具拓展为智能应用生成与持续使用。"
    ],
    "table": {
      "columns": [
        "项目",
        "说明"
      ],
      "rows": [
        {
          "id": "design-goal",
          "cells": [
            "产品目标",
            "支持从问数到持续分析\n让生成的报告可用于实际工作"
          ]
        },
        {
          "id": "target-users",
          "cells": [
            "目标用户",
            "有数据分析需求的业务用户\nBI 数据分析师"
          ]
        },
        {
          "id": "evaluation",
          "cells": [
            "衡量标准",
            "结果准确性\n应用生成采纳率"
          ]
        },
        {
          "id": "core-responsibilities",
          "cells": [
            "核心职责",
            "客户问题与场景梳理、产品需求定义\n交互设计与前端实现"
          ]
        },
        {
          "id": "experience-design-goal",
          "cells": [
            "设计目标",
            "让分析结果可核查、修改范围清晰\n让智能应用可持续使用与复用"
          ]
        },
        {
          "id": "design-challenge",
          "cells": [
            "设计挑战",
            "如何让用户问得清楚、分析接得上\n并在结果有疑问时找到依据与原因"
          ]
        }
      ]
    },
    "diagram": {
      "kind": "paths",
      "caption": "取数路径对比 · 设计目标示意",
      "lanes": [
        {
          "title": "Before",
          "steps": [
            {
              "title": "想看数据",
              "actor": "requester",
              "actorLabel": "需求方"
            },
            {
              "title": "报表不满足",
              "actor": "requester",
              "actorLabel": "需求方"
            },
            {
              "title": "给 BI 提需求",
              "actor": "requester",
              "actorLabel": "需求方"
            },
            {
              "title": "BI 接受需求",
              "actor": "bi",
              "actorLabel": "BI 人员"
            },
            {
              "title": "找数据源",
              "actor": "bi",
              "actorLabel": "BI 人员"
            },
            {
              "title": "取数或者建表",
              "actor": "bi",
              "actorLabel": "BI 人员"
            },
            {
              "title": "数据验证",
              "actor": "bi",
              "actorLabel": "BI 人员"
            },
            {
              "title": "需求交付",
              "actor": "bi",
              "actorLabel": "BI 人员"
            },
            {
              "title": "拿到数据",
              "actor": "requester",
              "actorLabel": "需求方"
            }
          ],
          "processingLabel": "取数依赖多次沟通与人工处理，从提出需求到拿到数据的链路长"
        },
        {
          "title": "After",
          "steps": [
            {
              "title": "想看数据",
              "actor": "requester",
              "actorLabel": "需求方"
            },
            {
              "title": "一句话提问",
              "actor": "requester",
              "actorLabel": "需求方"
            },
            {
              "title": "AI 给出结果",
              "actor": "ai",
              "actorLabel": "AI",
              "detail": "理解问题 → 查找数据 → 查询分析 → 生成结果"
            },
            {
              "title": "拿到数据",
              "actor": "requester",
              "actorLabel": "需求方"
            }
          ],
          "processingLabel": "即问即答"
        }
      ]
    }
  },
  {
    "id": "product-evolution",
    "title": "产品形态演进",
    "intro": "",
    "body": "随着需求从临时查数延伸到生成并持续使用智能应用，产品先后探索了基础对话、无限画布与多栏工作台。结合内部用户测试和访谈，重点比较三种形态能否帮助用户组织分析结果、继续探索，并减少额外操作。\n\n基础对话降低了入口门槛，但分析结果容易散落在消息中；无限画布把分析过程展开成节点，用户可以从一张图继续追问，也可以把多个结果组合成应用；多栏工作台将数据、应用与对话并列，围绕已有应用继续分析，保留可阅读的成果。",
    "designPlaceholder": "无限画布探索稿｜展示创建对话节点后生成多种图表、选择所需图表并结合对话节点继续生成应用的过程，标明选中对象及其与后续对话的关系。",
    "evolutionMedia": [
      {
        "src": "/images/datapilot-multicolumn-workbench.png",
        "caption": "持续对话：应用与 AI 对话并列展示",
        title: '当前 · 多栏工作台',
        description: '数据、应用和对话各有固定位置，让分析过程与可交付成果同时保留。',
        tradeoffs: [
          { kind: 'advantage', text: '满足稳定和灵活' },
          { kind: 'advantage', text: '方便同屏对话/核查/阅读/追问' },
          { kind: 'problem', text: '页面信息量大' },
        ],
      },
      {
        "src": "/images/datapilot-infinite-canvas.png",
        "caption": "无限画布：选择图表继续对话，并汇总生成应用",
        title: '探索 · 无限画布',
        description: '把问题和分析结果放到画布上，用节点呈现不同的探索路径。',
        tradeoffs: [
          { kind: 'advantage', text: '灵活组合，支持持续追问' },
          { kind: 'problem', text: '节点画布学习成本高' },
          { kind: 'problem', text: '执行异常时，排查问题难' },
        ],
      },
      {
        "src": "/images/datapilot-ai-serial-execution.png",
        "caption": "问数：在对话中查看结果与继续追问",
        title: '早期 · 简单对话',
        description: '以对话作为统一入口，将查询结果直接返回到消息中，支持侧栏展开查看执行过程。',
        tradeoffs: [
          { kind: 'advantage', text: '上手简单' },
          { kind: 'problem', text: '数据对照麻烦' },
          { kind: 'problem', text: '分析结果分散' },
        ],
      }
    ],
    "images": [],
    "index": "02"
  },
  {
    "id": "design-strategy",
    "index": "",
    "title": "设计策略",
    "intro": "",
    "body": "整个流程中，需要用户确认或主动触发的节点包括：补充需求与计算口径、审核分析结果、发起应用生成或修改并决定是否发布。Agent 执行出现异常时，还需要帮助用户判断原因与处理方式。\n\n因此形成以下三条 Agent 设计策略。",
    "workflow": {
      "summary": "Data Agent 设想的执行流程为：理解意图 → 按需多轮澄清、调用工具 → 反馈问数结果 → 应用生成 → 持续使用。",
      "caption": "Agent 执行逻辑 · 依据工作流整理，展示交互介入点",
      "image": { "src": "/images/datapilot-agent-workflow.jpg", "caption": "Agent 工作流", "sourceRegion": { "x": 0, "y": 110, "width": 1280, "height": 2343, "sourceWidth": 1280, "sourceHeight": 2453 } },
      "stages": [
        { "title": "请求与意图", "steps": ["用户发送消息", "校验身份与权限", "加载历史与引用", "加载规则与工具", "判断本轮意图"], "branch": "信息不足 → 澄清并等待回复，再恢复执行；可直接回答 → 结束本轮；需要查证 → 进入工具调用；明确应用需求 → 进入应用生成。" },
        { "title": "逐轮决策与工具调用", "steps": ["选择工具与参数", "检索资料或查询数据", "回传结果或错误", "保存进度并反馈", "判断下一步"], "branch": "按需继续调用、补充澄清或交付分析结果；可恢复的错误 → 修正参数、换工具或补充依据；无法继续 → 说明失败或交付部分结果。" },
        { "title": "应用生成与草稿保存", "steps": ["新建或定位已有应用", "打开授权工作区", "编写页面并绑定数据", "保存草稿与资源", "构建并检查预览"], "branch": "保存或构建失败 → 读取诊断与最新草稿，修正后重试；成功 → 确认草稿版本，进入验证。" },
        { "title": "预览验证与发布", "steps": ["确认草稿版本", "准备测试入口", "验证数据与交互", "校验并切换版本", "交付已发布应用"], "branch": "验证未通过 → 返回修改；暂不发布 → 保留可编辑草稿；发布失败 → 保留原线上版本。" }
      ]
    },
    "bullets": [
      "对齐关键分歧：减少理解偏差，控制澄清成本；有歧义时确认，保持分析连贯；优先提供结论，按需深入核查",
      "让应用变更可控：保留探索空间，谨慎改变成果；优先保存草稿，验证后再发布；让分析成果成为可直接使用的应用",
      "支持异常排查：按执行阶段回看，关联分析依据；独立承载工程排查，衔接对话报错；分视图查看耗时，缩小排查范围"
    ],
    "images": []
  },
  {
    "id": "qa-overview",
    "bodyEmphasis": "平衡确认成本与结果可靠性",
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "groupIntro": true,
    "index": "",
    "title": "让用户看懂并核查 AI 的分析结果",
    "intro": "",
    "body": "为引导 Agent 生成更准确的分析结果，让用户在关键分歧处明确需求与计算口径，并审核生成结果。设计重点是平衡确认成本与结果可靠性。",
    "images": []
  },
  {
    "id": "qa-entry",
    "index": "",
    "title": "减少理解偏差，控制澄清成本",
    "intro": "",
    "body": "如「看看上月生产情况」可能有不同目的。优先沿用已有信息，只对会改变分析方向的分歧发起澄清，避免用户反复交代背景。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "已有信息优先复用",
          "body": ""
        },
        {
          "title": "关键分歧才需确认",
          "body": ""
        },
        {
          "title": "默认条件允许修正",
          "body": ""
        }
      ],
      "mockup": {
        "kind": "start",
        "screenshotImages": ["/images/datapilot-qa-entry-scope.jpg"],
        "screenshotPlaceholder": [
          "初始提问与任务摘要"
        ],
        "title": "AI 生成的生产指标",
        "subtitle": "语义加工 · 指标关系",
        "prompt": "选择指标，查看含义与计算方式。",
        "label": "设计方案 · 模拟数据",
        "caption": "方案示意：通过拓扑理解指标依赖，点击节点核对计算方式。",
        "items": [
          {
            "title": "实际完成量",
            "detail": "已完成的产品数量；汇总生产记录中的完成数量。"
          },
          {
            "title": "计划量",
            "detail": "计划生产的产品数量；汇总生产计划中的目标数量。"
          },
          {
            "title": "生产完成率",
            "detail": "衡量生产计划的完成程度；实际完成量 ÷ 计划量 × 100%。"
          }
        ],
        "footer": "计算关系：实际完成量、计划量 → 生产完成率。"
      },
      "materialBrief": "一条曾被误解的真实需求，以及如何调整澄清内容或时机。截图图注说明决策与取舍，尚未实现的交互标注为方案探索。"
    },
    "screenshotBriefs": [
      "展示真实提问、系统带入的条件与待确认项；图注说明哪些已有依据、哪些不能直接推断。"
    ],
    "tabLabel": "明确需求"
  },
  {
    "id": "qa-execution",
    "index": "",
    "title": "有歧义时确认，保持分析连贯",
    "intro": "",
    "body": "如「完成率」可能按产品数量或订单数量计算。计算口径明确时直接沿用，有歧义时再请用户判断；补充信息后接着分析，减少重复提问。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "明确口径直接沿用",
          "body": ""
        },
        {
          "title": "口径歧义交由用户判断",
          "body": ""
        },
        {
          "title": "澄清后衔接原任务",
          "body": ""
        }
      ],
      "mockup": {
        "kind": "progress",
        "screenshotImages": ["/images/datapilot-qa-semantic-confirmation.jpg"],
        "screenshotPlaceholder": [
          "对话中生成候选指标并确认计算口径"
        ],
        "title": "正在生成生产进度报告",
        "subtitle": "执行过程",
        "prompt": "昨天完成得怎么样？",
        "label": "设计方案 · 模拟数据",
        "caption": "交互示意：调整条件并确认，再查看不同执行状态。",
        "items": [
          {
            "title": "确认分析范围",
            "detail": "日期、产线与指标已确认",
            "state": "done"
          },
          {
            "title": "获取生产记录",
            "detail": "数据查询已完成",
            "state": "done"
          },
          {
            "title": "整理图表与结论",
            "detail": "正在生成报告内容",
            "state": "active"
          },
          {
            "title": "报告可供查看",
            "detail": "等待内容生成完成",
            "state": "pending"
          }
        ],
        "footer": "详细执行记录按需展开；需要确认时，在当前任务中提示。",
        "scenarios": [
          {
            "title": "执行中",
            "status": "正在查询生产记录",
            "detail": "按已确认条件查询；报告尚未生成。",
            "action": "等待查询完成"
          },
          {
            "title": "无数据",
            "status": "当前范围没有匹配记录",
            "detail": "查询已完成，但没有匹配记录；不能显示为完成率 0%。",
            "action": "检查日期与产线范围"
          },
          {
            "title": "查询失败",
            "status": "生产记录查询失败",
            "detail": "尚未取得数据，不生成报告结论。",
            "action": "重试查询"
          },
          {
            "title": "生成失败",
            "status": "报告生成失败",
            "detail": "数据已取得，可核查明细；报告尚未生成，不显示整体完成。",
            "action": "重试生成报告"
          }
        ],
        "analysisFields": [
          {
            "label": "指标",
            "options": [
              "完成率（按生产数量）",
              "完成率（按工单数量）"
            ]
          },
          {
            "label": "时间",
            "options": [
              "昨天",
              "最近 7 天"
            ]
          },
          {
            "label": "范围",
            "options": [
              "全部产线",
              "产线 B"
            ]
          }
        ]
      },
      "materialBrief": "一个真实的指标歧义，以及为什么把某些信息留给业务用户、某些交给 BI 人员。截图使用真实定义，尚未实现的交互标注为方案探索。"
    },
    "screenshotBriefs": [
      "方案示意：在对话中呈现候选指标的业务含义与计算口径，提供添加并分析或重跑语义加工的入口。",
    ],
    "tabLabel": "对齐口径"
  },
  {
    "id": "qa-result",
    "index": "",
    "title": "优先提供结论，按需深入核查",
    "intro": "",
    "body": "用户需要审核结果是否符合当前问题。先呈现结论与图表，计算依据和数据范围按需查看，在阅读效率与可核查性之间取得平衡。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "结论优先于过程细节",
          "body": ""
        },
        {
          "title": "核查信息按需展开",
          "body": ""
        },
        {
          "title": "不完整结果明确说明",
          "body": ""
        }
      ],
      "mockup": {
        "kind": "result",
        "screenshotImages": ["/images/datapilot-qa-entry-delivery.jpg", "/images/datapilot-qa-report-generation.jpg"],
        "screenshotPlaceholder": [
          "分析结论与图表",
          "先展示图表，再生成分析报告"
        ],
        "title": "昨天的生产完成情况",
        "subtitle": "按生产数量计算 · 全部产线",
        "prompt": "产线 B：680 ÷ 1,000 × 100% = 68%。",
        "label": "设计方案 · 模拟数据",
        "caption": "方案示意：先读结果，再按需查看明细与计算依据。",
        "items": [
          {
            "title": "产线 A",
            "detail": "完成率",
            "value": 82
          },
          {
            "title": "产线 B",
            "detail": "完成率",
            "value": 68
          },
          {
            "title": "产线 C",
            "detail": "完成率",
            "value": 91
          }
        ],
        "footer": "范围：昨天 / 全部产线　口径：实际完成量 ÷ 计划量 × 100%（按数量）",
        "verificationNote": "方案：报表沿用本次计算标准，刷新数据或修改条件后重新计算。",
        "sourceText": "模拟来源：生产记录。产线 B 完成 680 件、计划 1,000 件，完成率 68%。实际核查需关联查询记录与取数时间；本示意未连接数据库。"
      },
      "materialBrief": "一次用户质疑结果的事件，以及据此改变的反馈或核查入口。异常处理与结果保留以实际能力为准，尚未实现的交互标注为方案探索。"
    },
    "screenshotBriefs": [
      "展示完成率结论与对应趋势图，突出关键数字和业务含义，标明为方案示意与模拟数据。",
      "方案示意：先在对话中返回图表与结论，再沿用本次分析范围和指标口径生成报告。"
    ],
    "tabLabel": "生成核查"
  },
  {
    "id": "continuous-analysis-example",
    "index": "05",
    "title": "从一次生成到持续使用",
    "intro": "",
    "body": "为让分析成果持续用于实际工作，以报告、仪表盘等智能应用作为核心工作载体。追问保留尝试空间，修改先形成草稿，再由用户验证并决定是否发布，兼顾分析效率与成果稳定性。",
    "images": [],
    "designPlaceholder": "待补设计截图：围绕报告追问 / 对话修改与版本管理",
    "group": {
      "id": "continuous-dialogue",
      "title": "多轮对话与持续使用"
    },
    "dialogue": {
      "decisions": [],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：围绕报告持续分析与修改",
        "frames": [
          {
            "title": "连续追问",
            "prompt": "",
            "response": "从报告中的图表与结论发起探索，保留原结果供比较。",
            "fields": []
          },
          {
            "title": "修改应用",
            "prompt": "",
            "response": "先对齐修改范围，变化保留为草稿，经用户验证后再决定发布。",
            "fields": []
          },
          {
            "title": "使用应用",
            "prompt": "",
            "response": "成果以独立应用承载，常规使用直接操作，新的分析或修改需求再进入对话。",
            "fields": []
          }
        ],
        "note": "设计方案示意，不代表已验证的上线效果。"
      }
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "连续追问",
        "detail": "从报告中的图表与结论发起探索，保留原结果供比较。"
      },
      {
        "title": "修改应用",
        "detail": "先对齐修改范围，变化保留为草稿，经用户验证后再决定发布。"
      },
      {
        "title": "使用应用",
        "detail": "成果以独立应用承载，常规使用直接操作，新的分析或修改需求再进入对话。"
      }
    ],
    "bodyEmphasis": "以报告、仪表盘等智能应用作为核心工作载体"
  },
  {
    "id": "conversation",
    "index": "03",
    "title": "保留探索空间，谨慎改变成果",
    "intro": "",
    "body": "追问中的新结论未必值得保留，因此先在对话中继续分析，保留原应用供比较；由用户决定哪些结果进入应用，减少试探性提问带来的意外修改。",
    "images": [{ "src": "/images/datapilot-dialogue-followup.jpg", "caption": "连续追问：引用销量峰值调整分析范围，保留原应用与本轮分析结果" }],
    "designPlaceholder": "待补设计截图：引用图表继续追问 / 展开比较，保留原结果 / 选择结果加入报告",
    "group": {
      "id": "continuous-dialogue",
      "title": "多轮对话与持续使用"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "追问不直接改动应用",
          "body": ""
        },
        {
          "title": "原有成果保留供比较",
          "body": ""
        },
        {
          "title": "有价值的结果再沉淀",
          "body": ""
        }
      ],
      "visual": {
        "kind": "workspace",
        "caption": "方案示意：连续追问",
        "note": "对象引用、比较探索与选择写入为交互方案，不将预期体验写为已验证效果。",
        "frames": [
          {
            "title": "引用图表继续追问",
            "prompt": "这几天为什么下降？",
            "response": "输入区引用选中的产量趋势图，明确本轮分析对象。",
            "fields": []
          },
          {
            "title": "展开比较，保留原结果",
            "prompt": "按产线比较一下",
            "response": "对话中展示分产线比较，原报告保持不变。",
            "fields": []
          },
          {
            "title": "选择结果加入报告",
            "prompt": "把这个比较加入报告",
            "response": "用户选择需要沉淀的结果，再进入报告修改流程。",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示选中报告中的趋势图后发起追问，输入区保留可移除的引用标记；用明确标注的方案稿说明操作对象。",
      "展示报告与对话中的新比较结果并列，标出原结果和本轮结果，以及继续追问入口；不重复展示首次问答的条件预填。",
      "展示用户选择某一分析结果并加入报告的入口，区分对话探索与修改报告两个动作；未实现的行为明确标注方案。"
    ],
    "tabLabel": "连续追问"
  },
  {
    "id": "report-editing",
    "index": "",
    "title": "优先保存草稿，验证后再发布",
    "tabLabel": "修改应用",
    "intro": "",
    "body": "一句修改指令可能影响多处内容。先明确修改范围，将变化保留在草稿中，供用户核对真实数据与交互后决定是否发布；用必要的检查换取线上成果的稳定性。",
    "images": [{ "src": "/images/datapilot-application-editing.jpg", "caption": "修改应用：将分析结果更新到报告，查看影响范围与历史版本" }],
    "group": {
      "id": "continuous-dialogue",
      "title": "多轮对话与持续使用"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "修改范围先对齐",
          "body": ""
        },
        {
          "title": "草稿与线上版本区分",
          "body": ""
        },
        {
          "title": "用户验证后决定发布",
          "body": ""
        }
      ],
      "visual": {
        "kind": "branches",
        "caption": "方案示意：修改应用",
        "note": "报告版本、回滚及用户自主发布为已确认能力；修改范围与关联影响呈现为交互方案，需结合实际机制验证。",
        "frames": [
          {
            "title": "明确对象与修改范围",
            "prompt": "把这张图改为只看夜班",
            "response": "呈现目标图表及本次修改范围。",
            "fields": []
          },
          {
            "title": "核对关联内容",
            "prompt": "汇总与结论也要更新",
            "response": "标出关联数字与文字结论的变更，供用户检查。",
            "fields": []
          },
          {
            "title": "版本检查、发布与回滚",
            "prompt": "恢复上一个版本",
            "response": "报告支持检查新版本、自主发布与版本回滚。",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示对话引用目标图表并发出修改请求，区分改样式、改范围，以及当前图表与整份报告的作用范围。",
      "展示图表与关联汇总、文字结论的变化；以真实机制说明联动处理，尚未实现的影响提示标注方案。",
      "展示报告版本检查、发布和回滚入口，说明恢复的内容范围；不将版本回滚表述为恢复历史数据。"
    ],
    "designPlaceholder": "待补设计截图：明确对象与修改范围 / 核对关联内容 / 版本检查、发布与回滚"
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "让分析成果成为可直接使用的应用",
    "intro": "",
    "body": "对话适合提出问题和探索结果，但持续使用不应依赖翻找历史消息。将成果沉淀为独立应用，让用户直接查看和操作；只有产生新的分析或修改需求时，再进入对话。",
    "images": [],
    "group": { "id": "continuous-dialogue", "title": "多轮对话与持续使用" },
    "dialogue": {
      "hideMedia": true,
      "decisions": [
        { "title": "直接使用应用，无需翻找对话", "body": "" },
        { "title": "常规操作无需重复提问", "body": "" },
        { "title": "分析或修改时再进入对话", "body": "" }
      ],
      "visual": {
        "kind": "workspace",
        "caption": "使用应用的设计取舍",
        "note": "此处说明应用交付后的交互设计取舍，不将具体使用交互或预期收益表述为已验证成果。",
        "frames": []
      }
    },
    "tabLabel": "使用应用",
    "legacyIds": ["applications"]
  },
  {
    "id": "agent-troubleshooting-overview",
    "index": "",
    "title": "从异常回答到问题定位",
    "intro": "",
    "body": "Agent 可能出现结果偏差、执行失败或长耗时。结果偏差可由用户先核对需求与计算口径，其余多数问题需要工程师协助排查。\n\n为此，先孵化智能体回放功能，关联执行过程与分析依据；再进一步孵化通用可观测产品 AgentOps，通过拓扑图、Trace 图、火焰图与日志支持系统排查。",
    "bodyLink": { "label": "AgentOps", "href": "https://aiops-phi.vercel.app/#/app-datapilot/all/overview" },
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "结果偏差",
        "detail": "用户先核对需求与口径，工程师再回查执行依据"
      },
      {
        "title": "执行异常",
        "detail": "通过 Trace ID 查找调用链，定位异常并查看堆栈"
      },
      {
        "title": "执行耗时",
        "detail": "通过耗时排序、Trace 图与火焰图缩小排查范围"
      }
    ]
  },
  {
    "id": "agent-replay",
    "index": "07",
    "title": "按执行阶段回看，关联分析依据",
    "intro": "",
    "body": "结果有偏差时，用户可先核对需求与计算口径；仍无法解释的问题，再由工程师回看执行记录。按阶段关联数据源、查询、指标与结果，选中对象后展开依据，减少来回查找。",
    "images": [
      { "src": "/images/datapilot-agent-replay.png", "caption": "智能体回放 · 结果偏差：按执行阶段核查指标定义、计算口径与调用依据" }
    ],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "tabLabel": "结果偏差",
    "dialogue": {
      "decisions": [
        {
          "title": "按阶段组织回放，降低浏览负担",
          "body": ""
        },
        {
          "title": "关联分析对象，详情按需展开",
          "body": ""
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：结果偏差",
        "note": "以下为问题排查交互方案，场景用于说明设计，不代表已上线或已验证效果；历史回放只读取记录，重新执行需单独发起，恢复能力需与工程共同验证。",
        "frames": [
          {
            "title": "从错误答案定位执行阶段",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "对照口径、查询与返回结果",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "核对最终结论与证据缺口",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示工程师从产量下降的错误答案进入本次回放，左侧按理解需求、查询数据、生成结论等阶段导航，保留本次用户输入与澄清记录。",
      "选中查询阶段，对照已记录的对比口径、SQL 时间范围与返回数据，区分未完结当日产量和完整日数据；详细参数按需展开。",
      "展示工具返回与最终输出的对应关系；未记录或无法关联的依据明确标记，不补写模型推理，不把历史回放表现为重跑任务。"
    ],
    "designPlaceholder": "待补截图：从错误答案定位执行阶段 / 对照口径、查询与返回结果 / 核对最终结论与证据缺口"
  },
  {
    "id": "agent-evidence",
    "index": "07",
    "title": "独立承载工程排查，衔接对话报错",
    "intro": "",
    "body": "技术排查面向工程师，作为独立功能呈现。工程师通过对话报错中的 Trace ID 查找调用链，定位异常节点并查看堆栈。",
    "images": [
      { "src": "/images/datapilot-execution-error.png", "caption": "AgentOps Demo · 执行异常：沿 Trace 查看失败调用、异常类型与堆栈信息" }
    ],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "tabLabel": "执行异常",
    "dialogue": {
      "decisions": [
        {
          "title": "用 Trace ID 衔接报错与调用记录",
          "body": ""
        },
        {
          "title": "先定位异常节点，再展开堆栈",
          "body": ""
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：执行异常",
        "note": "以下为问题排查交互方案，场景用于说明设计，不代表已上线或已验证效果；历史回放只读取记录，重新执行需单独发起，恢复能力需与工程共同验证。",
        "frames": [
          {
            "title": "沿调用链定位失败节点",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "异常堆栈与关联日志",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "修正前后的执行记录",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示 Trace 中失败调用及父子关系，区分实际报错节点与向上传播的失败状态。",
      "展示选中节点的异常类型、错误信息与堆栈，并提供关联日志入口以核查上下文。",
      "展示修正前后的执行记录，保留异常上下文供核对；对比能力按方案呈现，不暗示回放会自动修复或重新执行。"
    ]
  },
  {
    "id": "agent-latency",
    "index": "07",
    "legacyIds": ["accuracy"],
    "title": "分视图查看耗时，缩小排查范围",
    "intro": "",
    "body": "总耗时难以说明慢在哪一步。AgentOps Demo 通过耗时排序帮助工程师筛选调用，再用 Trace 图核对执行时序、火焰图查看耗时分布；选中节点后查看详情，继续核查原因。实际效果待验证。",
    "images": [
      { "src": "/images/datapilot-latency-flame.png?v=6468ba982247", "caption": "AgentOps Demo · 火焰图：从耗时分布定位目标节点，再查看属性与关联记录" }
    ],
    "group": { "id": "agent-troubleshooting", "title": "问题排查" },
    "tabLabel": "执行耗时",
    "dialogue": {
      "decisions": [
        { "title": "支持耗时排序，优先查看慢调用", "body": "" },
        { "title": "时序与分布分视图呈现", "body": "" },
        { "title": "节点与详情联动，保留定位上下文", "body": "" }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "产品孵化：AgentOps Demo",
        "note": "配图为 AgentOps Demo 的火焰图，展示由智能体回放延伸的跨应用排查方案。异常与长耗时节点用于缩小排查范围，不等于已确认根因，实际排查效果仍待验证。",
        "frames": []
      }
    }
  },
  {
    "id": "role",
    "index": "09",
    "title": "当前成果",
    "adoptionResult": {
      "before": 15,
      "after": 60,
      "label": "应用生成采纳率",
      "beforeLabel": "早期",
      "afterLabel": "迭代后",
      "changeLabel": "提升 45 个百分点"
    },
    "intro": "",
    "body": "我围绕问答体验与持续对话优化交互设计，明确指标如何确认、分析条件如何沿用，以及追问与报告更新如何衔接。随着产品整体逐步迭代，应用生成采纳率从 15% 逐步提升到 60%。",
    "images": [],
    "bullets": [
      "应用生成采纳率 = 用户发布应用数 / 创建应用数 × 100%",
      "采纳率说明用户愿意使用生成的应用，但任务做得好不好，还要单独验证。"
    ]
  }
]

  const growthSections: DataPilotSection[] = [
  {
    "id": "growth-research",
    "title": "背景与目标",
    "body": "Data Agent 已具备交付能力，海外 SaaS 探索需要进一步回答：当没有现场讲解和定制演示时，用户能否理解产品，并独立完成一次有价值的分析？因此，这一阶段围绕“理解价值—注册领取积分—样例数据体验—获得结果”组织产品路径。\n\n目标是让用户从自己的分析需求出发，判断产品是否适用，并以较低的投入体验到可以继续使用的成果。官网、登录注册与积分试用设计已完成，当前待上线。",
    "index": "01",
    "intro": "从交付能力走向自主使用",
    "images": [],
    "diagram": {
      "kind": "flow",
      "caption": "海外 SaaS 首次体验路径：先用样例数据判断价值，再决定是否接入自己的数据。",
      "lanes": [
        {
          "title": "从了解产品到完成首次分析",
          "steps": [
            {
              "title": "理解价值",
              "detail": "通过分析产物与演示，判断是否适合自己的任务。"
            },
            {
              "title": "注册领取积分",
              "detail": "明确免费权益，以账号承接试用额度与后续使用。"
            },
            {
              "title": "样例数据体验",
              "detail": "无需先连接自己的数据，用样例开始一次分析。"
            },
            {
              "title": "获得分析结果",
              "detail": "查看结果并继续追问，再判断是否接入真实数据。"
            }
          ]
        }
      ]
    }
  },
  {
    "id": "growth-context",
    "title": "官网",
    "body": "数据分析、智能应用与 Agent 都是较抽象的概念。官网选择从可见的分析产物入手，将“提出问题、生成应用、继续分析”串起来，让用户先判断成果是否对自己的工作有用，再理解背后的工作过程。",
    "bullets": [
      "以成果解释定位：用仪表盘、报告等具体产物承接“智能应用”，把技术概念转化为用户可以识别的工作成果。多种形态用于说明用途，同时需要避免分散首次访问的注意力。",
      "以持续使用说明价值：展示围绕结果继续探索的方式，让用户理解一次生成之后还能做什么，建立对复用和后续分析的预期。",
      "按决策顺序组织信息：从价值与产物，进入工作过程、数据连接和常见问题；免费开始承接愿意尝试的用户，联系入口承接仍需沟通需求的用户。"
    ],
    "references": [
      {
        "label": "查看官网演示",
        "href": "https://dp-saas-demo.vercel.app/home"
      }
    ],
    "images": [
      {
        "src": "/images/datapilot-saas-home.jpg",
        "caption": "待上线官网演示站截图：首屏呈现产品价值、免费开始与联系入口。",
        "display": "image"
      }
    ],
    "index": "02",
    "intro": "先建立价值预期，再解释产品能力"
  },
  {
    "id": "growth-funnel",
    "title": "登录注册",
    "body": "当前方案采用先注册、再领取积分试用的路径。账号为额度归属和后续返回提供统一入口，但也会增加首次体验的阻力。因此，注册前需要先说明产品价值，注册时则只保留开始所需的信息，并明确用户将获得的体验权益。",
    "bullets": [
      "给注册明确的理由：让账号与领取试用额度、后续返回工作区形成关联，使注册成为继续使用的起点。",
      "降低开始的负担：提供 Google、Microsoft 与邮箱入口，邮箱首屏只填写邮箱；以免费积分和无需绑卡说明开始条件，减少填写与决策成本。",
      "保留取舍的验证：先注册能明确额度归属，却可能使尚未理解价值的用户退出。上线后需结合注册流失与首次任务完成情况，判断这一门槛是否合适。"
    ],
    "images": [
      {
        "src": "/images/datapilot-saas-register.jpg",
        "caption": "注册入口截图：第三方账号、邮箱与免费积分说明，来自待上线演示站。",
        "display": "image"
      }
    ],
    "index": "03",
    "intro": "平衡开始门槛与持续使用"
  },
  {
    "id": "growth-validation",
    "title": "样例与积分试用",
    "body": "用户可以先用样例数据完成一次分析，无需准备数据或连接数据库，再决定是否接入自己的数据。免费积分用于支持首次分析和必要追问，具体额度与消耗规则仍需在上线前确认。",
    "bullets": [
      "降低准备成本：提供样例数据和示例问题，让用户快速开始，样例结果不代表真实业务效果。",
      "明确使用成本：展示剩余积分与任务消耗，帮助用户判断还能做什么。",
      "照顾中断体验：失败或重试时说明积分如何处理；额度不足时保留输入和已有结果。"
    ],
    "index": "04",
    "intro": "先体验，再接入",
    "images": []
  },
  {
    "id": "growth-iteration",
    "title": "上线验证",
    "body": "本阶段已完成官网、登录注册与积分试用设计，当前待上线。后续验证沿着同一条使用路径展开，结合行为记录与用户反馈，区分价值表达、开始门槛和任务体验中的问题，再决定调整哪一环。",
    "bullets": [
      "看懂但没有开始：结合入口点击和反馈，判断用户是没有找到适用场景，还是尚不愿提供账号与数据。",
      "注册但没有完成任务：区分样例体验与自有数据接入，检查问题选择、数据准备、任务执行和额度限制分别造成了哪些中断。",
      "获得结果但没有继续：了解结果是否有用、能否支持后续工作，以及用户是否存在再次使用的需求。",
      "结合成本调整试用：同时观察首次任务完成情况与积分消耗分布，再调整额度和引导方式，不以消耗更多积分作为成功标准。"
    ],
    "index": "05",
    "intro": "判断用户是否获得首次价值",
    "images": []
  }
]

  const pocSections: DataPilotSection[] = [
  {
    "id": "poc-validation",
    "title": "客户业务梳理",
    "intro": "在 Data Agent 的 POC 客户交付与场景验证中，围绕客户的实际业务任务梳理需求、组织演示并收集使用反馈，识别分析、追问与结果复用中的体验问题。将具体场景中的需求与问题提炼为共性产品需求，反哺产品体验设计与迭代优化。",
    "body": "准备工作围绕业务脉络、场景筛选和演示数据展开。先梳理谁负责、谁决策、工作如何流转，以及每个环节使用和产生哪些数据，再确定 Data Agent 能够介入的位置。\n\n例如，油气生产分析需要将生产记录、周期测试与作业工单按井号和时间关联，才能进一步解释产量变化。制造业则需要连接订单、工单、工厂与产线，区分进度、效率和质量问题。行业资料用于建立初步理解，具体组织、系统分工与耗时仍需客户核实。",
    "bullets": [
      "意向演示：主动提出业务场景，用可体验的任务讨论价值，明确公开资料、推断与模拟部分，约定优先场景和下一轮投入。",
      "正式 POC：锁定范围、基线与评价口径，以授权数据、独立案例和真实用户操作记录，判断是否具备交付条件。"
    ],
    "index": "01",
    "images": []
  },
  {
    "id": "poc-haier-scope",
    "title": "场景筛选",
    "body": "制造业的候选方向覆盖计划执行、质量追溯、设备运维与过程控制。筛选时同时检查使用角色、数据粒度、现有系统和后续处理条件，将行业机会收敛为当前能够推进的任务。\n\n生产分析案例中，订单、工单与工厂产线已有盘点，因此优先进入方案；OEE 有停机、扫描与检验记录线索，但班次和节拍尚需确认。设备预测与过程控制依赖额外数据和专业条件，保留为后续候选。",
    "table": {
      "columns": [
        "候选场景",
        "已有条件与缺口",
        "初筛判断"
      ],
      "rows": [
        {
          "id": "poc-scope-1",
          "cells": [
            "订单完成 / 负荷",
            "订单、工单、工厂与产线已有盘点",
            "优先进入方案"
          ]
        },
        {
          "id": "poc-scope-2",
          "cells": [
            "OEE 损失分析",
            "停机、扫描、检验有线索；班次与节拍待确认",
            "先澄清口径"
          ]
        },
        {
          "id": "poc-scope-3",
          "cells": [
            "质量分布 / 追溯",
            "检验与不良有线索；工序和批次关系待核对",
            "保留关联场景"
          ]
        },
        {
          "id": "poc-scope-4",
          "cells": [
            "设备健康预测",
            "高频工况、故障与维修标签待补",
            "条件补齐后评估"
          ]
        },
        {
          "id": "poc-scope-5",
          "cells": [
            "视觉质检 / 安全",
            "图像视频与业务标注待核对",
            "列入后续候选"
          ]
        },
        {
          "id": "poc-scope-6",
          "cells": [
            "调度 / 过程控制",
            "目标约束、工艺模型与执行接口待补",
            "另列专业验证"
          ]
        }
      ]
    },
    "afterTable": "初筛用于讨论优先级，仍需与业务人员确认范围。数据存在不等于满足任务要求，还要核对时间粒度、刷新速度和对象关联。",
    "intro": "",
    "index": "02",
    "images": []
  },
  {
    "id": "poc-haier-metrics",
    "title": "指标口径确认",
    "body": "以“生产进度落后，怎样定位工厂、产线和效率损失”为演示任务，将设备综合效率（OEE）的时间、速度、质量三个维度映射到客户已有记录。\n\n迁移时重点确认计划生产时间、理想节拍与良品定义。例如，同一段停机时间是否计入计划生产时间，会影响指标解释；不同产品的节拍与计量单位也需要对齐。通用分析方法提供框架，具体计算口径由业务人员确认。",
    "table": {
      "columns": [
        "分析维度",
        "已有数据线索",
        "需确认的客户口径"
      ],
      "rows": [
        {
          "id": "poc-metrics-1",
          "cells": [
            "时间损失",
            "停机记录、生产订单、时序工单",
            "班次、计划生产时间、计划与非计划停机"
          ]
        },
        {
          "id": "poc-metrics-2",
          "cells": [
            "速度损失",
            "生产扫描、工单与产线层级",
            "产品与设备的理想节拍、运行时间、产量及单位"
          ]
        },
        {
          "id": "poc-metrics-3",
          "cells": [
            "质量损失",
            "检验记录、不良数与下线量",
            "良品、返工、报废及检验与生产的关联范围"
          ]
        }
      ]
    },
    "afterTable": "OEE 用于拆解效率损失，生产进度落后的原因仍需结合工单与排产核实。分析结论应能够回到原始记录和计算口径。",
    "intro": "",
    "index": "03",
    "images": []
  },
  {
    "id": "poc-demo-data",
    "title": "演示数据准备",
    "body": "演示数据沿用已有业务对象、编码和叫法，再按任务补齐关联、时间序列与异常样本。客户资料、公开数据和模拟记录分别标明，避免将生成的数据当作真实业务事实。\n\n交通流量案例提供了 6 张表的 DDL（164 个字段）、6 个工作表各 10 行样例及场景问题表。样例采用分表采样，部分字段数量与 DDL 不一致，因此先核对字段与主键，再连接道路、部门、卡口方向和日流量，补齐支持时间与空间分析的模拟记录。",
    "bullets": [
      "已有资料作为依据：保留客户字段、枚举与业务定义，参考行业模型和公开数据补充对象关系。",
      "模拟数据服务任务：按同一对象关联记录，约定状态和时间，准备正常、异常与证据不足的分支。",
      "推断保留核实项：通过系统手册、页面与单据推断的关系单独标注；模拟记录只用于演示，正式效果需用授权数据验证。"
    ],
    "intro": "",
    "index": "04",
    "images": []
  },
  {
    "id": "poc-haier-task",
    "title": "连续任务演示",
    "body": "演示从生产进度问题开始，沿同一工厂、产线和时间范围逐步展开：先看计划与实际，再定位异常产线、拆解损失并核查记录。将产品体验中的需求确认、口径澄清与结果核查，放进一条可讨论的业务路径。",
    "beforeTable": "以下任务示例用于说明制造业验证方案，不代表客户原话或已验证效果。",
    "steps": [
      {
        "title": "查看进度",
        "detail": "核对计划与实际，明确日期和指标口径"
      },
      {
        "title": "定位产线",
        "detail": "继续比较工厂、产线与班次，检查条件承接"
      },
      {
        "title": "拆解损失",
        "detail": "按数据条件分析时间、速度与质量损失"
      },
      {
        "title": "核查记录",
        "detail": "回查停机、扫描与检验记录，保留证据不足项"
      }
    ],
    "bullets": [
      "连续追问：围绕同一业务对象继续分析，核对条件变化，结论回到记录与口径。",
      "沉淀应用：将有价值的分析整理为报告或看板，区分临时探索与正式修改，草稿验证后再发布。",
      "延伸处置：在巡检演示方案中，将候选问题、人工复核、工单与复检关联；证据不足时补充材料，避免直接当作已确认缺陷。"
    ],
    "afterTable": "已有能力通过实际操作验证，尚未实现的交互通过原型走查，分别记录。分析后的处置与复用用于讨论业务衔接，不据此推断客户已完成生产落地。",
    "intro": "",
    "index": "05",
    "images": []
  },
  {
    "id": "poc-haier-evaluation",
    "title": "验证与验收",
    "body": "客户已有看板、下钻和告警时，进一步检查告警之后的分析与处理是否带来增量价值。参考供应链案例，将“核查告警—分析原因—形成建议与简报”作为可评价任务，以客户当前工作方式为基线。\n\n正式 POC 需共同明确业务效果、任务耗时、人工修改与方法复用的评价口径。以下为验证与交付要求，不代表已经达到的效果。",
    "table": {
      "columns": [
        "需要回答的问题",
        "验证与交付证据"
      ],
      "rows": [
        {
          "id": "poc-evaluation-1",
          "cells": [
            "结果是否可信",
            "与 BI 或既有报表对账；覆盖独立案例、反例与证据不足案例，保留失败记录"
          ]
        },
        {
          "id": "poc-evaluation-2",
          "cells": [
            "普通用户能否使用",
            "独立完成同一任务，记录耗时、人工修改、首个有效响应与完整分析时延"
          ]
        },
        {
          "id": "poc-evaluation-3",
          "cells": [
            "链路能否实际运行",
            "涉及定时或通知时，检查触发、未触发、去重、恢复、发送失败与实际送达"
          ]
        },
        {
          "id": "poc-evaluation-4",
          "cells": [
            "能否复用与交接",
            "由非原作者复用下一主题，交付配置、规则、测试材料与维护责任"
          ]
        }
      ]
    },
    "afterTable": "按约定范围逐项验收数据、指标与分析路径，列出生产差距。验收后共同决定转生产、补测或停止，未通过项明确责任人与日期。",
    "intro": "",
    "index": "06",
    "images": []
  },
  {
    "id": "poc-haier-delivery",
    "title": "产品体验优化",
    "body": "在 POC 中，我参与对客需求与场景梳理，将业务任务拆成可演示、可核查的分析路径，再把共性需求带回产品规划与体验设计。以某制造业任务为例：",
    "table": {
      "columns": ["场景问题", "设计优化", "验证重点"],
      "rows": [
        {
          "id": "poc-feedback-scope",
          "cells": [
            "生产效率指标口径不统一",
            "分析前确认对象、时间与计算口径",
            "口径能否修正，结果能否核查"
          ]
        },
        {
          "id": "poc-feedback-context",
          "cells": [
            "连续追问需要承接工厂、产线与时间条件",
            "明确追问时保留和切换的条件",
            "分析范围是否准确"
          ]
        },
        {
          "id": "poc-feedback-report",
          "cells": [
            "告警分析需要沉淀为可复用的报告",
            "区分临时追问与报告修改，支持保存复用",
            "修改是否可控，报告能否复用"
          ]
        }
      ]
    },
    "intro": "",
    "index": "07",
    "images": []
  }
]

  return {
    title: getProjectTitle(project, locale),
    tags: project.tags[locale],
    demoUrl: DATA_PILOT_DEMO_URL,
    heroImage: '/images/datapilot-application-dialogue.png',
    paragraphs: [
      'Data Agent是一款面向业务分析场景的自然语言数据产品。产品将业务数据、指标口径与语义知识加工为 AI 可理解的上下文，提升问数结果的准确性，并支持从查询结果继续生成报表、仪表盘等数据应用。',
      '本案例重点呈现多轮对话、人机交互与智能体回放孵化。围绕客户与用户问题，通过具体示例说明交互方案，将条件继承、业务澄清、执行反馈和证据回查串成一条连续任务；POC 与海外 SaaS 探索作为补充材料。',
      '核心负责 Agent 从问数到智能生成报告的完整链路体验，覆盖对客需求与场景梳理、产品需求规划、前端设计研发与验证，以及与后端研发的接口对接；以提升应用采纳率为核心目标。支持 4 家付费客户交付。',
    ],
    metadata: ['职责：产品需求规划 · 前端设计研发与验证 · 接口协作', '场景：客户生产分析', '目标：提升应用采纳率'],
    lead: '从业务场景出发，设计 AI 问答、应用生成与持续修改的完整体验，让用户看得懂结果、把得住修改范围',
    parts: {
      experience: { title: '产品体验设计', sections },
      narrative: { title: '对话体验设计', sections: createDataPilotNarrative(sections) },
      poc: { title: 'POC 场景验证', sections: pocSections },
      growth: { title: '海外 SaaS 探索', sections: growthSections },
    },
    labels: {
      back: '返回',
      demo: '体验交互原型',
      tabs: '案例内容切换',
      contents: '案例目录',
      navigation: '项目导航',
      previous: '上一个',
      next: '下一个',
      relatedIntro: '可观测产品孵化由交付问题延展而来，详见',
      relatedProject: 'Agent 可观测产品',
      scene: '用户场景',
      problem: '体验问题',
      solution: '解决思路',
    },
  }
}

const contentByLocale = { zh: createDataPilotContent('zh'),}

export function getDataPilotContent(locale: Locale) {
  return contentByLocale[locale]
}
