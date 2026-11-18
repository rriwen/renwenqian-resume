import type { ProjectDetailTable } from '../projectDetails'
import type { Locale } from '../../i18n/translations'
import { getProjectBySlug, getProjectTitle } from '../projects'

export type DataPilotPart = 'experience' | 'poc' | 'growth'
export type DataPilotSection = {
  id: string
  legacyIds?: string[]
  group?: { id: string; title: string }
  groupIntro?: boolean
  tabLabel?: string
  dialogueExtension?: boolean
  continuationOf?: string
  index: string
  title: string
  intro: string
  body: string
  bodyEmphasis?: string
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
    tradeoff?: string
    decisions: { title: string; body: string }[]
    visual: {
      kind: 'sequence' | 'context' | 'workspace' | 'branches'
      caption: string
      note: string
      frames: { title: string; prompt: string; response: string; fields: { label: string; value: string; changed?: boolean }[] }[]
    }
  }
  diagram?: { kind: 'paths' | 'journey'; caption: string; lanes: { title: string; summary?: string; processingLabel?: string; steps: { title: string; detail?: string; response?: string; actor?: 'requester' | 'bi' | 'ai'; actorLabel?: string }[] }[] }
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
    "body": "Data Agent 面向有数据分析需求的业务用户和 BI 分析师。用户通过自然语言描述需求，由 AI 查询与分析数据，并生成报告、数字大屏、多维表格、仪表盘等智能应用；应用生成后，还可以继续通过对话追问、调整、更新数据，并持续使用应用。\n\n做 Data Agent 的出发点，是让用户用业务语言提出问题，减少查找数据表、编写 SQL 和反复沟通取数的工作，把精力放在理解结果和继续分析上。对于不熟悉 SQL 的用户，也能从一句具体的问题开始。",
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
            "客户需求、产品规划与场景验证\n产品设计和前端研发"
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
    evolutionRationale: [
      '形态选择最终落在灵活性和稳定性平衡的多栏工作台，减少用户组织节点的负担，让应用承接持续工作，并将后续设计重点转向分析条件的延续与修改范围的控制。',
    ],
    evolutionRationaleEmphasis: "多栏工作台",
    "intro": "",
    "body": "随着需求从临时查数延伸到生成并持续使用智能应用，产品先后探索了基础对话、无限画布与多栏工作台。结合内部用户测试和访谈，重点比较三种形态能否帮助用户组织分析结果、继续探索，并减少额外操作。",
    "designPlaceholder": "无限画布探索稿｜展示创建对话节点后生成多种图表、选择所需图表并结合对话节点继续生成应用的过程，标明选中对象及其与后续对话的关系。",
    "evolutionMedia": [
      {
        "src": "/images/datapilot-ai-serial-execution.png",
        "caption": "问数：在对话中查看结果与继续追问",
        title: '早期 · 基础对话',
        description: '以对话作为统一入口，将查询结果直接返回到消息中，优先降低临时取数的使用门槛。',
        tradeoffs: [
          { kind: 'advantage', text: '直接提问，无需学习查询语法' },
          { kind: 'problem', text: '结果分散在消息中，不便对照' },
          { kind: 'problem', text: '成果依附对话，难以更新复用' },
        ],
      },
      {
        "src": "/images/datapilot-infinite-canvas.png",
        "caption": "无限画布：选择图表继续对话，并汇总生成应用",
        title: '探索 · 无限画布',
        description: '为解决结果分散的问题，将图表呈现为可选择、组合的节点，支持分支追问与应用生成。',
        tradeoffs: [
          { kind: 'advantage', text: '选择图表追问，自由组合成果' },
          { kind: 'problem', text: '需理解并组织节点，操作成本高' },
          { kind: 'problem', text: '生成的应用缺少持续对话入口' },
        ],
      },
      {
        "src": "/images/datapilot-multicolumn-workbench.png",
        "caption": "持续对话：应用与 AI 对话并列展示",
        title: '当前 · 多栏工作台',
        description: '为降低理解学习成本，并承接应用生成后的工作，将数据、应用与对话分栏呈现，让用户围绕已有应用继续分析与调整。',
        tradeoffs: [
          { kind: 'advantage', text: '数据与应用同屏，边分析边核对' },
          { kind: 'advantage', text: '围绕当前应用追问，无需翻找对话' },
          { kind: 'advantage', text: '自由对话探索，已有应用持续可用' },
        ],
      }
    ],
    "images": [],
    "index": "02"
  },
  {
    "id": "qa-overview",
    "bodyEmphasis": "明确分析目标、确认计算口径，并核查结果依据",
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "groupIntro": true,
    "index": "",
    "title": "让用户看懂并核查 AI 的分析结果",
    "intro": "",
    "body": "为引导 AI 生成更准确的分析结果，用户需要在问答过程中明确分析目标、确认计算口径，并核查结果依据。需要只在影响结果的关键节点引入确认，其余信息按需展开，兼顾问答效率与结果可核查性。",
    "images": []
  },
  {
    "id": "qa-entry",
    "index": "",
    "title": "减少理解偏差，控制澄清成本",
    "intro": "",
    "body": "“看看上月生产情况”可能是了解整体进度，也可能是寻找落后产线。需要利用已有信息补齐范围，只追问会改变分析方向的关键分歧，避免把问数变成填写表单。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "分析范围可见可改",
          "body": ""
        },
        {
          "title": "已知条件直接复用",
          "body": ""
        },
        {
          "title": "只澄清关键分歧",
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
    "title": "同名指标，可能回答不同问题",
    "intro": "",
    "body": "同一句“完成率”，可能对应不同的业务定义。需要优先复用已有指标，缺失时在对话中生成候选口径，并根据用户澄清修正语义，确认后继续分析，减少配置跳转与理解成本。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "对话串联语义生成",
          "body": ""
        },
        {
          "title": "根据澄清修正语义",
          "body": ""
        },
        {
          "title": "确认口径后继续分析",
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
    "title": "生成完成，不等于结果可用",
    "intro": "",
    "body": "看到“完成率 96%”，用户还需要判断它对应哪些产线、哪个时间段，以及按什么计算。需要先呈现结论与图表，再提供核查依据，兼顾快速阅读与结果可信度。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "基础问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "结论与图表优先",
          "body": ""
        },
        {
          "title": "口径与来源就近可查",
          "body": ""
        },
        {
          "title": "标明数据覆盖范围",
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
    "body": "应用生成后工作还会继续。用户可围绕图表追问、调整，或在下一周期查看新数据。需要分别解决三个问题：追问如何关联已有结果，修改会影响哪些内容，以及再次使用时数据是否已更新。\n\n因此，将智能应用作为工作载体，保留图表、结论与分析设置，减少反复翻找对话与重新整理分析。以报告为例，围绕连续追问、修改应用、使用应用三个环节，让用户保留原结果继续探索，检查并发布修改后的版本，再复用分析设置、按周期更新数据；同时区分报告版本与数据更新状态，让后续工作可延续、修改可回退、数据时效可判断。",
    "images": [],
    "designPlaceholder": "待补设计截图：围绕报告追问 / 对话修改与版本管理 / 周期更新与数据时效",
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
            "response": "明确修改对象与关联影响，通过版本检查、发布与回滚控制变更。",
            "fields": []
          },
          {
            "title": "使用应用",
            "prompt": "",
            "response": "复用已保存的报告设置，按周期更新数据并呈现更新状态。",
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
        "detail": "明确修改对象与关联影响，通过版本检查、发布与回滚控制变更。"
      },
      {
        "title": "使用应用",
        "detail": "复用已保存的报告设置，按周期更新数据并呈现更新状态。"
      }
    ],
    "bodyEmphasis": "将智能应用作为工作载体"
  },
  {
    "id": "conversation",
    "index": "03",
    "title": "明确追问对象，保留探索空间",
    "intro": "",
    "body": "面对“这里为什么下降”“换个维度看看”这类追问，需要让用户看清 AI 正在分析哪个结果，并保留原结果作为比较基准。探索过程中产生的新图表先在对话中呈现，由用户决定是否写入报告，减少试探性提问对已有成果的影响。",
    "images": [],
    "designPlaceholder": "待补设计截图：引用图表继续追问 / 展开比较，保留原结果 / 选择结果加入报告",
    "group": {
      "id": "continuous-dialogue",
      "title": "多轮对话与持续使用"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "引用对象可见可改",
          "body": ""
        },
        {
          "title": "保留原结果作为比较基准",
          "body": ""
        },
        {
          "title": "探索结果按需写入报告",
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
    "title": "明确影响范围，让修改可控",
    "tabLabel": "修改应用",
    "intro": "",
    "body": "一句“改为只看夜班”可能只针对当前图表，也可能涉及整份报告。需要在执行前明确作用范围，修改后呈现图表、汇总与结论的关联变化，并提供版本检查与回退入口，让用户能够预判、核对和撤回修改。",
    "images": [],
    "group": {
      "id": "continuous-dialogue",
      "title": "多轮对话与持续使用"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "明确局部与整体修改范围",
          "body": ""
        },
        {
          "title": "标出关联内容的变化",
          "body": ""
        },
        {
          "title": "检查新版本，支持发布与回滚",
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
    "title": "区分运行与更新，让状态可判断",
    "intro": "",
    "body": "再次打开报告，用户需要判断当前看到的数据是否最新，以及一次更新是否真正生效。需要区分报告的保存版本、任务运行状态与数据更新时间；设置周期更新时预览具体取数范围，更新失败时保留已有结果并提供恢复入口。",
    "images": [],
    "designPlaceholder": "待补设计截图：重新打开并使用报告 / 对话建立周期更新 / 核对更新状态与数据时效",
    "group": {
      "id": "continuous-dialogue",
      "title": "多轮对话与持续使用"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "呈现已保存的分析设置",
          "body": ""
        },
        {
          "title": "预览周期任务的取数范围",
          "body": ""
        },
        {
          "title": "标明数据时效，失败可重试",
          "body": ""
        }
      ],
      "visual": {
        "kind": "context",
        "caption": "方案示意：使用应用",
        "note": "报告复用、对话更新、周期规则与时效反馈为设计方案；调度、取数与状态存储由工程协作实现。报告版本与数据更新记录分别处理，不推断历史数据快照能力。",
        "frames": [
          {
            "title": "重新打开并使用报告",
            "prompt": "查看这份报告的最新情况",
            "response": "呈现已保存的报告设置及数据更新时间，提供继续追问与更新入口。",
            "fields": []
          },
          {
            "title": "对话建立周期更新",
            "prompt": "每天九点更新昨天的生产数据",
            "response": "复用报告设置，确认执行周期与下一次具体取数范围。",
            "fields": []
          },
          {
            "title": "核对更新状态与数据时效",
            "prompt": "今天的数据更新了吗？",
            "response": "区分本次运行状态、最近成功更新时间与当前报告版本。",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示重新打开报告后的保存设置、数据更新时间，以及对话提问和刷新入口；临时探索不作为已保存状态恢复。",
      "展示通过对话创建周期任务，预览执行时间及下一次取数起止时间；周期规则为方案时明确标注，不编造业务班次。",
      "展示更新失败时保留的上次结果、本次运行状态、最近成功更新时间与重试入口；报告版本和数据更新记录分别呈现。未实现的反馈与恢复机制标注方案，不暗示版本回滚会恢复历史数据。"
    ],
    "tabLabel": "使用应用",
    "legacyIds": [
      "applications"
    ]
  },
  {
    "id": "agent-troubleshooting-overview",
    "index": "",
    "title": "从异常回答到问题定位",
    "intro": "",
    "body": "围绕结果不准、执行失败与等待过久，方案将异常关联到本次执行记录，帮助用户与实施人员定位原因、核对影响，再决定如何处理。",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "结果准确性",
        "detail": "结果有偏差，定位在哪一层"
      },
      {
        "title": "执行异常",
        "detail": "局部失败，哪些结果受影响"
      },
      {
        "title": "执行耗时",
        "detail": "等待太久，时间花在哪里"
      }
    ]
  },
  {
    "id": "agent-replay",
    "index": "07",
    "title": "结果有偏差，定位在哪一层",
    "intro": "",
    "body": "场景：上月华东销售额与业务报表不一致，查询包含退款订单，报表却采用净销售额。",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "tabLabel": "结果准确性",
    "dialogue": {
      "decisions": [
        {
          "title": "关联本次执行",
          "body": "从异常数字进入对应轮次，对照需求、查询条件与返回数据，定位偏差环节。"
        },
        {
          "title": "标出证据差异",
          "body": "突出退款处理等口径差异，SQL 按需展开；以实际记录为准，缺失依据不推断。"
        },
        {
          "title": "修正后独立复测",
          "body": "修正口径后另行发起查询，对比前后条件与结果；保留原记录，不将回放当作重跑。"
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：结果准确性",
        "note": "以下为问题排查交互方案，场景用于说明设计，不代表已上线或已验证效果；历史回放只读取记录，重新执行需单独发起，恢复能力需与工程共同验证。",
        "frames": [
          {
            "title": "异常数字与本次执行",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "退款口径与查询依据",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "修正前后的独立执行",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      },
      "tradeoff": "设计难点：结果合理也可能口径错误，需要沿执行证据定位偏差，而非只解释数字。"
    },
    "screenshotBriefs": [
      "展示华东销售额异常数字与对应执行记录，保留轮次、原问题和条件；示例数据标注模拟。",
      "对照包含退款与净销售额口径，展示实际查询条件、SQL 展开及证据缺失状态。",
      "展示单独发起复测的入口和两次执行的条件、结果差异；注明方案，不表现为回放自动重跑。"
    ],
    "designPlaceholder": "待补截图：异常数字与本次执行 / 退款口径与查询依据 / 修正前后的独立执行"
  },
  {
    "id": "agent-evidence",
    "index": "07",
    "title": "局部失败，哪些结果受影响",
    "intro": "",
    "body": "场景：渠道销售数据已获取，但目标表无访问权限，目标达成率无法计算，报告未完整生成。",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "tabLabel": "执行异常",
    "dialogue": {
      "decisions": [
        {
          "title": "标记影响范围",
          "body": "区分已完成、失败与未执行步骤，标出受影响的指标和报告内容。"
        },
        {
          "title": "按原因给出操作",
          "body": "说明缺失权限与所需资源，提供联系管理员或更换数据源的方向，技术详情按需展开。"
        },
        {
          "title": "明确恢复边界",
          "body": "修复后单独发起重试；仅在系统支持且数据有效时续跑，否则说明需重新取数，避免重复生成。"
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：执行异常",
        "note": "以下为问题排查交互方案，场景用于说明设计，不代表已上线或已验证效果；历史回放只读取记录，重新执行需单独发起，恢复能力需与工程共同验证。",
        "frames": [
          {
            "title": "失败步骤与受影响内容",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "权限原因与处理方向",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "修复后的重试范围",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      },
      "tradeoff": "设计难点：单步失败不等于全程失败，需要说明可用内容、影响范围与恢复条件。"
    },
    "screenshotBriefs": [
      "展示目标表权限不足的失败步骤及后续未执行状态，区分已获取的销售数据与不可用的达成率。",
      "展示缺失权限、资源名称和处理方向，不把联系管理员表现为自动授权。",
      "展示重试前可复用内容与需重新执行的步骤；续跑能力以实际机制为准，未实现时标注方案。"
    ]
  },
  {
    "id": "agent-latency",
    "index": "07",
    "title": "等待太久，时间花在哪里",
    "intro": "",
    "body": "场景：分析近一年所有门店的销售趋势，明细查询超时后反复重试，报告生成尚未开始。",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "tabLabel": "执行耗时",
    "dialogue": {
      "decisions": [
        {
          "title": "拆解实际耗时",
          "body": "展示各步耗时、当前状态与重试次数，不以虚构百分比表示完成进度。"
        },
        {
          "title": "定位等待原因",
          "body": "区分查询耗时、工具等待与重复重试；依据记录提示缩短时间范围或减少维度。"
        },
        {
          "title": "支持停止与调整",
          "body": "停止当前任务并保留执行记录，调整范围后另起任务，标明新结果范围，避免混淆。"
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：执行耗时",
        "note": "以下为问题排查交互方案，场景用于说明设计，不代表已上线或已验证效果；历史回放只读取记录，重新执行需单独发起，恢复能力需与工程共同验证。",
        "frames": [
          {
            "title": "分步耗时与重试次数",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "查询瓶颈与调整建议",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "停止任务与缩小范围",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      },
      "tradeoff": "设计难点：总时长难以预估，需要区分正常处理与重复等待，让用户判断是否干预。"
    },
    "screenshotBriefs": [
      "展示全年门店分析的步骤耗时和查询重试次数，报告生成标为未开始，模拟数据明确标记。",
      "展示查询超时记录及缩短时间范围、减少维度的调整建议；原因无依据时明确未知。",
      "展示停止状态、保留记录及调整范围后新发起的任务，注明停止与取消能力需结合实际接口验证。"
    ]
  },
  {
    "id": "accuracy",
    "index": "08",
    "title": "从单次回放到 AgentOps",
    "intro": "",
    "body": "智能体回放中的共性排查需求进一步沉淀为跨应用的 AgentOps Demo，支持执行筛选与链路核查，实际效果仍待验证。",
    "images": [],
    "designPlaceholder": "后续材料：AgentOps 跨应用排查的真实使用验证",
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "dialogue": {
      "decisions": [],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：产品孵化",
        "note": "Data Agent 智能体回放为交互设计方案，AgentOps 为产品 Demo；两者的排查效率与理解成本改善尚待真实使用验证。",
        "frames": []
      }
    },
    "related": true,
    "dialogueExtension": true
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
      "应用生成采纳率 = 用户发布应用数 / 创建应用数 × 100%"
    ]
  }
]

  const growthSections: DataPilotSection[] = [
        {
          id: 'growth-research', index: '01', title: '市场背景', intro: '',
          body: 'Data Agent的产品能力已经可以交付，但面向海外 SaaS 市场的商业化还在探索。当前需要验证的不是“能不能做出结果”，而是海外用户是谁、什么场景最容易感知价值、用户如何开始试用，以及是否愿意从试用进入付费讨论。竞品、用户场景和客户反馈被用于收敛优先验证的目标用户与首个任务。',
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

  const pocSections: DataPilotSection[] = [
    {
      id: "poc-validation", index: "01",
      title: "客户场景 POC",
      intro: "验证Data Agent能否帮助业务人员追查生产进度",
      body: "我参与客户 POC，围绕“生产进度落后，怎样定位工厂、产线和效率损失”组织案例。客户已有运营看板与日报，POC 聚焦从总览继续追查的业务价值：找到关注对象、核对指标口径，再回到具体记录。",
      images: [],
    },
    {
      id: "poc-haier-scope", index: "02",
      title: "场景取舍",
      intro: "优先验证生产进度，按数据条件展开 OEE 分析",
      body: "按业务价值、数据可用性与验证成本收敛范围：先验证生产进度，再按条件展开效率分析。",
      table: {"columns": ["候选场景", "已有条件", "POC 取舍"], "rows": [{"id": "poc-haier-scope-1", "cells": ["订单完成 / 负荷", "订单、工单、工厂与产线", "优先验证"]}, {"id": "poc-haier-scope-2", "cells": ["OEE 损失分析", "停机、扫描与检验记录", "先澄清班次与节拍"]}, {"id": "poc-haier-scope-3", "cells": ["质量追溯", "检验与不良记录", "核对工序、批次关联"]}, {"id": "poc-haier-scope-4", "cells": ["设备预测 / 过程控制", "数据与专业条件待补", "暂不纳入首轮"]}]},
      images: [],
    },
    {
      id: "poc-haier-metrics", index: "03",
      title: "数据准备",
      intro: "把行业指标转成客户可核对的口径",
      body: "将 OEE 拆解到客户的数据与计算规则，演示前列出缺失条件，确保结果能够与日报对照。",
      table: {"columns": ["分析维度", "关联数据", "待确认口径"], "rows": [{"id": "poc-haier-metrics-1", "cells": ["时间损失 · A", "停机、订单与时序工单", "计划生产时间、班次、停机分类"]}, {"id": "poc-haier-metrics-2", "cells": ["速度损失 · P", "生产扫描、工单与产线", "理想节拍、运行时间、产量单位"]}, {"id": "poc-haier-metrics-3", "cells": ["质量损失 · Q", "检验、不良数与下线量", "良品、返工、报废及检验范围"]}]},
      images: [],
    },
    {
      id: "poc-haier-task", index: "04",
      title: "演示设计",
      intro: "用一项连续任务展示分析价值",
      body: "保留日期、班次与当前产线，让追问能够继续、条件变化能够看见、异常结论能够回查。进度落后的原因仍需结合工单与排产核实。",
      steps: [{"title": "查看进度", "detail": "核对计划与实际"}, {"title": "定位产线", "detail": "保留日期与班次"}, {"title": "拆解损失", "detail": "对齐 OEE 口径"}, {"title": "核查记录", "detail": "回查停机与检验"}],
      images: [],
    },
    {
      id: "poc-haier-evaluation", index: "05",
      title: "验证标准",
      intro: "围绕同一业务任务检查可用性与可信度",
      body: "POC 围绕任务完成情况评价方案，记录结果核对、人工修改与求助位置，为下一轮迭代定位问题。",
      bullets: ["能否独立找到需要关注的工厂与产线", "能否与同一时间、同一口径的日报对照", "能否从损失指标回查停机或检验记录", "更换产线或班次后，分析路径能否复用"],
      images: [],
    },
    {
      id: "poc-haier-delivery", index: "06",
      title: "阶段产出",
      intro: "用具体应用承接客户评价",
      body: "已有应用承接客户演示与讨论。后续聚焦条件继承、结果回查和数据更新提示，指标口径与使用效果继续由业务人员验证。",
      table: {"columns": ["业务任务", "已有应用"], "rows": [{"id": "poc-haier-delivery-1", "cells": ["查看生产进度", "工厂线体生产运营看板"]}, {"id": "poc-haier-delivery-2", "cells": ["分析产能负荷", "产能负荷率综合分析"]}, {"id": "poc-haier-delivery-3", "cells": ["追查设备效率", "设备 OEE 综合效率看板"]}, {"id": "poc-haier-delivery-4", "cells": ["日常复盘", "工厂日报、线体运营大屏"]}]},
      images: [],
    },
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
    lead: '从自然语言问数到报告生成，围绕问答体验、持续分析与问题排查设计 AI 智能体体验',
    parts: {
      experience: { title: '产品体验设计', sections },
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
