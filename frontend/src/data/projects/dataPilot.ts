import type { ProjectDetailTable } from '../projectDetails'
import type { Locale } from '../../i18n/translations'
import { getProjectBySlug, getProjectTitle } from '../projects'

export type DataPilotPart = 'experience' | 'poc' | 'growth'
export type DataPilotSection = {
  id: string
  group?: { id: string; title: string }
  groupIntro?: boolean
  continuationOf?: string
  index: string
  title: string
  intro: string
  body: string
  bodyEmphasis?: string
  qaExperience?: {
    decisions: { title: string; body: string }[]
    bridge?: string
    /** Illustrative UI only; excluded from personal facts and chat media. */
    mockup: {
      kind: 'start' | 'progress' | 'result'
      screenshotPlaceholder?: string[]
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
  afterTable?: string
  steps?: { title: string; detail: string }[]
  bullets?: string[]
  evolutionMedia?: { src?: string; caption: string }[]
  adoptionResult?: { before: number; after: number; label: string; beforeLabel: string; afterLabel: string; changeLabel: string }
  stats?: string[]
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
  const isZh = locale === 'zh'
  const project = getProjectBySlug('dataagent')!
  const sections: DataPilotSection[] = isZh
    ? [
  {
    "id": "overview",
    "index": "01",
    "title": "项目背景",
    "intro": "",
    "body": "做 Data Agent 的出发点，是让用户用业务语言提出问题，减少查找数据表、编写 SQL 和反复沟通取数的工作，把精力放在理解结果和继续分析上。对于不熟悉 SQL 的用户，也能从一句具体的问题开始。",
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
            "有数据分析需求的业务用户\nBI 数据分析师"
          ]
        },
        {
          "id": "design-goal",
          "cells": [
            "产品目标",
            "支持从问数到持续分析，让生成的报告可用于实际工作"
          ]
        },
        {
          "id": "evaluation",
          "cells": [
            "衡量标准",
            "回答准确性\n应用生成采纳率"
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
          "id": "design-challenge",
          "cells": [
            "设计挑战",
            "如何让用户问得清楚、分析接得上，并在结果有疑问时找到依据与原因"
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
    "title": "产品演进",
    "intro": "",
    "body": "内部 BI 人员访谈表明，用户不仅需要查到数据，还需要将多次分析整理成报告，并围绕结果继续追问。产品定位因此从满足单次取数的问数工具，逐步拓展为支持报告生成与持续分析的 Data Agent。\n\n随着能力从“回答问题”扩展到“生成报告、围绕报告继续分析”，交互形态也从基础对话、无限画布探索，演进为数据资产、报告与 AI 对话并列的三栏布局，让用户能够查数、阅读并继续分析。",
    "bullets": [
      "早期版本 - 简单问数：定位为自然语言问数工具，满足临时查数与查看趋势的需求。能力以单次查询和图表回答为主，采用基础对话承载结果与追问。多次结果分散在消息中，难以直接用于复盘和分享。",
      "中期探索 - 生成报告：从回答单个问题扩展到整理多次分析，支持生成可阅读、可分享的报告。交互探索无限画布，让内容脱离消息流、自由编排；内部测试与观察发现，过高的自由度增加了学习和操作成本。",
      "当前版本 - 持续对话：从生成报告进一步拓展为围绕结果持续分析，支持引用数据追问、沿用分析条件，并将分析转为定时任务。交互采用数据资产、报告与 AI 对话并列的三栏布局，让查数、阅读与继续分析衔接，各栏可按需展开或收起。"
    ],
    "designPlaceholder": "画布探索稿｜展示应用从聊天消息中独立出来后的完整画布，以及生成报表或看板的对话入口。",
    "evolutionMedia": [
      {
        "src": "/images/datapilot-ai-serial-execution.png",
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
    "id": "qa-overview",
    "bodyEmphasis": "算什么、怎么算、如何查",
    "group": {
      "id": "qa-experience",
      "title": "问答体验"
    },
    "groupIntro": true,
    "index": "",
    "title": "让用户看懂并核查 AI 的分析结果",
    "intro": "",
    "body": "产品接入数据库后，由 AI 整理数据含义、生成指标，支持问数分析与报表生成。设计围绕“算什么、怎么算、如何查”展开：用户可以先提问，缺少语义或指标时在对话中补齐，再确认计算口径、核对结果依据，让数据准备与分析任务连续完成。",
    "images": []
  },
  {
    "id": "qa-entry",
    "index": "",
    "title": "问答前：看懂指标含义，在提问时准确选用",
    "intro": "",
    "body": "同一个“完成率”可能按产品数量或任务数量计算。设计将指标含义、计算口径与依赖关系作为可复用的语义层资产，通过“查看关系—理解定义—提问选用”的路径，帮助用户选对指标，减少同名不同义带来的误解。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "方案",
          "body": "AI 语义加工生成指标，统一呈现含义与计算口径。先查看指标关系，再按需展开定义与依赖数据。输入问题时查找并选用指标，复用已有口径。"
        }
      ],
      "mockup": {
        "kind": "start",
        "screenshotPlaceholder": [
          "语义生成",
          "指标关系拓扑",
          "输入时选择指标"
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
      }
    },
    "steps": [
      {
        "title": "明确指标",
        "detail": "同一个“完成率”可能按产品数量或任务数量计算。设计将指标含义、计算口径与依赖关系作为可复用的语义层资产，通过“查看关系—理解定义—提问选用”的路径，帮助用户选对指标，减少同名不同义带来的误解。"
      }
    ],
    "screenshotBriefs": [
      "展示语义加工入口与生成的语义层资产，标出指标名称、含义及计算口径",
      "展示完成率与实际量、计划量的关系；选中节点后展开定义",
      "展示输入问题时的指标候选及说明，区分同名不同口径的指标"
    ]
  },
  {
    "id": "qa-execution",
    "index": "",
    "title": "问答中：补齐语义指标，再确认计算口径",
    "intro": "",
    "body": "用户直接提问时，数据可能尚未完成语义加工，或缺少明确指标。设计先检查准备状态，缺失时在对话流内提供语义加工入口，再让用户确认或修改本次指标，减少跳转与任务中断。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "方案",
          "body": "检查语义加工状态与可用指标，已有明确指标直接复用。缺少语义或指标时，在对话流内发起语义加工。展示生成的指标与计算口径，确认或修改后继续分析。"
        }
      ],
      "mockup": {
        "kind": "progress",
        "screenshotPlaceholder": [
          "检查语义与指标",
          "对话内语义加工",
          "确认指标并继续分析"
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
      }
    },
    "steps": [
      {
        "title": "确认指标",
        "detail": "用户直接提问时，数据可能尚未完成语义加工，或缺少明确指标。设计先检查准备状态，缺失时在对话流内提供语义加工入口，再让用户确认或修改本次指标，减少跳转与任务中断。"
      }
    ],
    "screenshotBriefs": [
      "展示准备状态检查：已加工且有指标时复用，缺失时提示补充",
      "展示对话中的语义加工入口、执行状态与生成指标，不跳出当前任务",
      "展示指标与计算口径的确认或修改界面，确认后接续原问题"
    ]
  },
  {
    "id": "qa-result",
    "index": "",
    "title": "问答后：从结果定位指标与计算依据",
    "intro": "",
    "body": "用户需要判断数字能否用于汇报，但不需要每次阅读完整执行记录。指标与计算依据关联到结果，默认保留简洁结论，核对时再展开；异常执行的深入排查交给调试人员。",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "问答体验"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "方案",
          "body": "从结果定位本次采用的指标与计算方式。按需展开数据来源与生成记录。保持业务阅读简洁，异常时进入排查路径。"
        }
      ],
      "mockup": {
        "kind": "result",
        "screenshotPlaceholder": [
          "追溯生成过程",
          "定位指标与计算方式"
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
      }
    },
    "steps": [
      {
        "title": "追溯依据",
        "detail": "用户需要判断数字能否用于汇报，但不需要每次阅读完整执行记录。指标与计算依据关联到结果，默认保留简洁结论，核对时再展开；异常执行的深入排查交给调试人员。"
      }
    ],
    "screenshotBriefs": [
      "展示结果数字的核查入口与对应指标",
      "展示该结果采用的计算口径、来源与记录，保留结果供对照"
    ]
  },
  {
    "id": "continuous-analysis-example",
    "index": "05",
    "title": "让一次分析延续为持续任务",
    "intro": "",
    "body": "内部用户测试与观察发现，追问指代是最容易产生误解的环节。以生产完成率分析为例，“为什么低”需要明确对应哪条产线、哪个时间段。设计优先让追问关联具体结果，并明确条件的作用范围，再通过“结果追问、上下文与记忆、定时任务”支持深入分析与周期更新。",
    "images": [],
    "designPlaceholder": "图 02｜连续问数故事板。四屏对应查看进度、定位产线、核查记录、切换夜班；用模拟数据标识代替真实数值，标注用户目标、AI 反馈与下一步入口。",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话"
    },
    "dialogue": {
      "decisions": [],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：从持续分析到周期更新",
        "frames": [
          {
            "title": "结果追问",
            "prompt": "为什么这部分完成率偏低",
            "response": "从当前结果对应区域发起追问",
            "fields": []
          },
          {
            "title": "上下文与记忆",
            "prompt": "只看夜班，仍看刚才那条产线",
            "response": "承接当前分析对象，仅调整本次筛选条件",
            "fields": []
          },
          {
            "title": "定时任务",
            "prompt": "每天更新这条产线昨天夜班的数据",
            "response": "将更新需求生成工作流",
            "fields": []
          }
        ],
        "note": "设计方案示意，不代表已验证的上线效果。"
      }
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "结果追问",
        "detail": "用户对报告某个区域的数据有疑问时，可直接发起追问，将该区域的数据自动带入对话，减少复制数据和重复描述，让阅读与分析衔接起来。"
      },
      {
        "title": "上下文与记忆",
        "detail": "连续分析需要保留当前条件，也需要复用个人偏好与业务知识。设计按信息用途区分短期上下文、个人分析偏好和业务知识引用，避免本次筛选条件影响后续任务。"
      },
      {
        "title": "定时任务",
        "detail": "用户需要每天更新数据、定期发送报告时，可将需求生成工作流。设计让用户看清执行时间、数据更新与推送步骤，把重复操作转为可检查的定时任务。"
      }
    ],
    "bodyEmphasis": "结果追问、上下文与记忆、定时任务"
  },
  {
    "id": "conversation",
    "index": "03",
    "title": "先明确“问哪部分”，再继续分析",
    "intro": "",
    "body": "针对追问指代易被误解的问题，设计从结果区域提供追问入口，自动带入所选数据。方案进一步展示引用对象与条件，供发送前核对；先明确“问哪部分”，再继续分析，减少仅凭对话历史猜测指代造成的偏差。",
    "images": [],
    "designPlaceholder": "待补设计截图：区域追问入口 / 数据带入对话 / 围绕数据分析",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "从所选结果发起追问，明确当前分析对象"
        },
        {
          "title": "1",
          "body": "展示引用对象与时间范围，避免指代不清"
        },
        {
          "title": "2",
          "body": "继续分析时保留原结果，不自动改写报告"
        }
      ],
      "visual": {
        "kind": "workspace",
        "caption": "方案示意：结果追问",
        "note": "设计方案示意；记忆存储、上下文组装、调度与推送实现由工程协作完成。",
        "frames": [
          {
            "title": "区域追问入口",
            "prompt": "为什么这部分完成率偏低",
            "response": "从当前结果对应区域发起追问",
            "fields": []
          },
          {
            "title": "数据带入对话",
            "prompt": "分析这部分数据",
            "response": "将区域数据自动带入对话",
            "fields": []
          },
          {
            "title": "围绕数据分析",
            "prompt": "继续分析原因",
            "response": "结合引用数据继续分析，并与报告对照",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示选中完成率数据后发起追问的入口",
      "展示对话中的引用卡片，标明产线、日期与指标",
      "展示新分析与原结果并列，区分追问与报告修改"
    ]
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "本次条件可纠正，长期偏好分开管理",
    "intro": "",
    "body": "“只看夜班”应沿用刚才的产线，但不应让以后所有任务都只查夜班。方案区分本次条件、个人偏好与业务知识引用，让用户看清沿用内容并纠正误解；指标口径来自共享定义，不作为个人偏好保存。",
    "images": [],
    "designPlaceholder": "待补设计截图：短期分析上下文 / 个人分析偏好 / 业务知识引用",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "本次上下文：展示沿用条件与本轮变化，支持纠正"
        },
        {
          "title": "1",
          "body": "个人偏好：单独管理常用维度与图表习惯"
        },
        {
          "title": "2",
          "body": "业务知识：引用统一指标定义，不重复保存为个人记忆"
        }
      ],
      "visual": {
        "kind": "context",
        "caption": "方案示意：上下文与记忆",
        "note": "设计方案示意；记忆存储、上下文组装、调度与推送实现由工程协作完成。",
        "frames": [
          {
            "title": "短期分析上下文",
            "prompt": "只看夜班，仍看刚才那条产线",
            "response": "承接当前分析对象，仅调整本次筛选条件",
            "fields": []
          },
          {
            "title": "个人分析偏好",
            "prompt": "趋势数据用折线图展示",
            "response": "将图表呈现习惯与当前筛选条件区分",
            "fields": []
          },
          {
            "title": "业务知识引用",
            "prompt": "这个完成率按什么计算",
            "response": "关联已有指标定义与计算口径",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示“只看夜班”前后的条件对照，标出沿用与变化",
      "展示产线被误解后的纠正过程，保留其余条件",
      "展示记忆分类与作用范围，区分任务条件、个人偏好和知识引用"
    ]
  },
  {
    "id": "applications",
    "index": "06",
    "title": "确认执行范围，再启用定时工作流",
    "intro": "",
    "body": "用户希望每天九点收到昨天夜班的结果，直接保存本次日期会让任务反复查询旧数据。方案沿用已确认的产线与指标，将“昨天”设为随执行日变化的范围，并在启用前核对更新步骤与推送对象。",
    "images": [],
    "designPlaceholder": "待补设计截图：生成工作流 / 配置定时与推送 / 查看执行状态",
    "group": {
      "id": "continuous-dialogue",
      "title": "持续对话"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "沿用分析条件，将更新与推送需求生成工作流"
        },
        {
          "title": "1",
          "body": "区分固定筛选与动态日期，预览下次取数范围"
        },
        {
          "title": "2",
          "body": "核对执行时间、接收对象与步骤后启用，保留执行状态"
        }
      ],
      "visual": {
        "kind": "branches",
        "caption": "方案示意：定时任务",
        "note": "设计方案示意；记忆存储、上下文组装、调度与推送实现由工程协作完成。",
        "frames": [
          {
            "title": "生成工作流",
            "prompt": "每天更新这条产线昨天夜班的数据",
            "response": "将更新需求生成工作流",
            "fields": []
          },
          {
            "title": "配置定时与推送",
            "prompt": "每天九点推送报告",
            "response": "分别配置执行时间、取数范围与推送对象",
            "fields": []
          },
          {
            "title": "查看执行状态",
            "prompt": "今天的报告更新了吗",
            "response": "查看工作流及各步骤的执行状态",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示从当前分析生成工作流，标出继承的产线与指标",
      "展示每天九点执行及“昨天夜班”的动态范围预览",
      "展示启用前确认页与执行记录，区分更新成功和推送成功"
    ]
  },
  {
    "id": "agent-troubleshooting-overview",
    "index": "",
    "title": "从异常回答到问题定位",
    "intro": "",
    "body": "以夜班有生产却查不到数据为例，最终回答无法说明偏差发生在哪。设计判断是将异常回答关联到本次实际执行记录，而不是依赖 AI 自我解释。业务用户反馈异常，实施与调试人员通过“找到步骤、核对依据、修正复测”检查条件与数据，判断问题是否修复。",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "找到步骤",
        "detail": "从异常回答进入本次执行记录，缩小排查范围"
      },
      {
        "title": "核对依据",
        "detail": "对照用户问题、查询条件与返回数据，判断偏差来源"
      },
      {
        "title": "修正复测",
        "detail": "修正后重新执行，对照前后条件与结果"
      }
    ],
    "bodyEmphasis": "找到步骤、核对依据、修正复测"
  },
  {
    "id": "agent-replay",
    "index": "07",
    "title": "从异常回答定位本次执行",
    "intro": "",
    "body": "用户确认夜班有生产，Agent 却回答“没有数据”。业务用户负责反馈异常，实施与调试人员检查本次执行。方案先呈现步骤与状态，再定位相关记录，避免所有用户直接面对完整日志。",
    "images": [],
    "designPlaceholder": "图 05｜异常回答与执行记录。展示回答入口、步骤概览与详情面板；选中查询步骤，对照用户所指夜班、实际查询日期与返回记录。标注模拟数据及记录缺失状态。",
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "从异常回答进入对应执行记录"
        },
        {
          "title": "1",
          "body": "保留原始问题与本次分析条件"
        },
        {
          "title": "2",
          "body": "按理解、查询、生成步骤缩小排查范围"
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：找到步骤",
        "note": "设计方案示意，不代表已验证的上线效果。",
        "frames": [
          {
            "title": "异常回答入口",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "执行步骤概览",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示业务侧异常反馈入口与关联回答",
      "展示调试侧步骤概览，选中查询步骤后定位本次记录"
    ]
  },
  {
    "intro": "",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "index": "07",
    "id": "agent-evidence",
    "title": "对照实际条件，不只看 AI 解释",
    "body": "夜班跨越两天，无数据可能来自日期范围理解有误，也可能没有匹配记录。方案将用户问题、实际查询条件与返回数据放在同一核对路径中；AI 解释只作辅助，记录缺失时明确提示。",
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "对照用户所指夜班与实际查询时间"
        },
        {
          "title": "1",
          "body": "按需展开相关步骤的输入和返回记录"
        },
        {
          "title": "2",
          "body": "标明记录来源与缺失状态，避免把推测当依据"
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：核对依据",
        "note": "设计方案示意，不代表已验证的上线效果。",
        "frames": [
          {
            "title": "查询条件核对",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "返回记录与来源",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示用户夜班意图与实际查询起止时间对照",
      "展示空结果、记录缺失两种不同状态及对应依据"
    ]
  },
  {
    "id": "accuracy",
    "index": "08",
    "title": "修正具体条件，再核对复测结果",
    "intro": "",
    "body": "发现夜班日期范围有误后，排查人员需要修正查询条件，再检查是否获得预期记录。方案区分查看历史记录与重新执行，保留前后条件供对照；重新执行成功不等于业务结果正确。",
    "images": [],
    "designPlaceholder": "图 06｜修正与复测对照。以夜班跨日查询为例，展示原日期范围、修正后的范围及两次执行结果，明确区分历史记录和复测记录；仅作为设计方案示意。",
    "group": {
      "id": "agent-troubleshooting",
      "title": "问题排查"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "明确本例修正的是查询时间范围"
        },
        {
          "title": "1",
          "body": "保留原记录，对照复测条件与返回数据"
        },
        {
          "title": "2",
          "body": "核对是否覆盖预期夜班，仍异常时继续排查"
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "方案示意：修正复测",
        "note": "设计方案示意，不代表已验证的上线效果。",
        "frames": [
          {
            "title": "修正查询条件",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "复测结果对照",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "展示历史查询的错误日期与修正后的查询范围",
      "展示原执行和复测结果对照，检查预期夜班记录是否返回"
    ]
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
    : [
  {
    "id": "overview",
    "index": "01",
    "title": "Project background",
    "intro": "",
    "body": "Data Agent started with a goal of letting users ask business questions in their own words, reducing table searches, SQL writing, and coordination so they can focus on interpreting results and continuing analysis. Users unfamiliar with SQL can start with a concrete question.",
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
            "Business users, BI data analysts with analysis needs"
          ]
        },
        {
          "id": "design-goal",
          "cells": [
            "Product goal",
            "Support querying and ongoing analysis so generated reports can be used in real work"
          ]
        },
        {
          "id": "evaluation",
          "cells": [
            "Evaluation",
            "Answer accuracy and application adoption"
          ]
        },
        {
          "id": "core-responsibilities",
          "cells": [
            "Core responsibilities",
            "Customer discovery, product planning, and scenario validation\nProduct design and frontend development"
          ]
        },
        {
          "id": "design-challenge",
          "cells": [
            "Design challenge",
            "Help users ask clear questions, continue their analysis, and find evidence and causes when results raise questions"
          ]
        }
      ]
    },
    "diagram": {
      "kind": "paths",
      "caption": "Data access paths · intended experience",
      "lanes": [
        {
          "title": "Before",
          "steps": [
            {
              "title": "Need data",
              "actor": "requester",
              "actorLabel": "Requester"
            },
            {
              "title": "Reports do not fit",
              "actor": "requester",
              "actorLabel": "Requester"
            },
            {
              "title": "Request BI support",
              "actor": "requester",
              "actorLabel": "Requester"
            },
            {
              "title": "BI accepts request",
              "actor": "bi",
              "actorLabel": "BI analyst"
            },
            {
              "title": "Find data sources",
              "actor": "bi",
              "actorLabel": "BI analyst"
            },
            {
              "title": "Query or build tables",
              "actor": "bi",
              "actorLabel": "BI analyst"
            },
            {
              "title": "Validate data",
              "actor": "bi",
              "actorLabel": "BI analyst"
            },
            {
              "title": "Deliver request",
              "actor": "bi",
              "actorLabel": "BI analyst"
            },
            {
              "title": "Receive data",
              "actor": "requester",
              "actorLabel": "Requester"
            }
          ],
          "processingLabel": "Repeated communication and manual work lengthen the path from request to data"
        },
        {
          "title": "After",
          "steps": [
            {
              "title": "Need data",
              "actor": "requester",
              "actorLabel": "Requester"
            },
            {
              "title": "Ask in natural language",
              "actor": "requester",
              "actorLabel": "Requester"
            },
            {
              "title": "AI provides results",
              "actor": "ai",
              "actorLabel": "AI",
              "detail": "Understand the question → Find data → Query and analyze → Generate results"
            },
            {
              "title": "Receive data",
              "actor": "requester",
              "actorLabel": "Requester"
            }
          ],
          "processingLabel": "Ask and get answers"
        }
      ]
    }
  },
  {
    "id": "product-evolution",
    "title": "Product evolution",
    "intro": "",
    "body": "Interviews with internal BI staff showed that users need not only data, but also reports assembled from multiple analyses and further exploration of the results. The product therefore evolved from a tool for individual data queries into a Data Agent supporting report generation and ongoing analysis.\n\nAs capabilities expanded from answering questions to generating reports and continuing analysis around them, interaction evolved from basic chat through free-form canvas exploration to three columns for data assets, reports, and AI conversation, supporting lookup, reading, and continued analysis.",
    "bullets": [
      "Early version - Simple queries: A natural-language data query tool for ad hoc questions and trends. Single queries and chart answers were delivered through basic chat. Results spread across messages were difficult to reuse for reviews and sharing.",
      "Mid-stage exploration - Report generation: Expand from individual answers to organizing multiple analyses into readable, shareable reports. A free-form canvas moved content out of the message stream, but internal testing and observation found that excessive freedom increased learning and operational costs.",
      "Current version - Ongoing dialogue: Expand beyond report generation to analysis around results, with data references, inherited conditions, and scheduled tasks. Three columns for data assets, reports, and AI conversation connect lookup, reading, and further analysis, with panels that expand or collapse as needed."
    ],
    "designPlaceholder": "Canvas exploration | Show the application outside the message stream, with the dialogue entry for generating a report or dashboard.",
    "evolutionMedia": [
      {
        "src": "/images/datapilot-ai-serial-execution.png",
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
    "id": "qa-overview",
    "bodyEmphasis": "what to calculate, how to calculate it, and how to verify it",
    "group": {
      "id": "qa-experience",
      "title": "Question-and-answer experience"
    },
    "groupIntro": true,
    "index": "",
    "title": "Help users understand and verify AI results",
    "intro": "",
    "body": "After connecting a database, AI organizes data meanings and generates metrics for querying and reporting. The design addresses what to calculate, how to calculate it, and how to verify it: users can ask first, complete missing semantic preparation within the conversation, confirm calculation rules, and inspect evidence without breaking the analysis task.",
    "images": []
  },
  {
    "id": "qa-entry",
    "index": "",
    "title": "Before: understand metrics and select the right one",
    "intro": "",
    "body": "Completion rate may refer to product quantities or task counts. Metric meanings, formulas, and dependencies form reusable semantic-layer assets. The design connects relationship exploration, definition review, and selection while asking, helping users distinguish metrics that share a name but differ in meaning.",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "Question-and-answer experience"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "Proposal",
          "body": "AI semantic preparation generates metrics with consistent descriptions and calculation rules. Review metric relationships, then expand definitions and dependent data as needed. Find and select metrics while asking to reuse existing definitions."
        }
      ],
      "mockup": {
        "kind": "start",
        "screenshotPlaceholder": [
          "Semantic generation",
          "Metric relationships",
          "Metric selection in questions"
        ],
        "title": "AI-generated production metrics",
        "subtitle": "Semantic processing · Metric relationships",
        "prompt": "Select a metric to inspect its meaning and calculation.",
        "label": "Proposed design · sample data",
        "caption": "Proposal: explore metric dependencies and inspect node calculations.",
        "items": [
          {
            "title": "Actual output",
            "detail": "Completed units; sum completed quantities in production records."
          },
          {
            "title": "Planned output",
            "detail": "Planned units; sum target quantities in production plans."
          },
          {
            "title": "Production completion",
            "detail": "Progress against plan; actual output ÷ planned output × 100%."
          }
        ],
        "footer": "Dependencies: actual output and planned output → production completion."
      }
    },
    "steps": [
      {
        "title": "Clarify metrics",
        "detail": "Completion rate may refer to product quantities or task counts. Metric meanings, formulas, and dependencies form reusable semantic-layer assets. The design connects relationship exploration, definition review, and selection while asking, helping users distinguish metrics that share a name but differ in meaning."
      }
    ],
    "screenshotBriefs": [
      "Show semantic preparation and generated semantic assets, identifying metric names, meanings, and calculation rules.",
      "Show completion rate relationships to actual and planned quantities; selecting a node expands its definition.",
      "Show metric candidates and descriptions while asking, distinguishing names shared by different definitions."
    ]
  },
  {
    "id": "qa-execution",
    "index": "",
    "title": "During: prepare semantic metrics and confirm calculation rules",
    "intro": "",
    "body": "When users ask directly, data may not have completed semantic preparation or may lack a clear metric. The design checks readiness first, offers semantic preparation within the conversation when needed, and lets users confirm or edit the current metric, reducing navigation and task interruptions.",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "Question-and-answer experience"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "Proposal",
          "body": "Check semantic preparation and available metrics, reusing clear existing metrics. Start semantic preparation in the conversation when semantics or metrics are missing. Show generated metrics and calculation rules, then continue analysis after confirmation or editing."
        }
      ],
      "mockup": {
        "kind": "progress",
        "screenshotPlaceholder": [
          "Check semantics and metrics",
          "Semantic processing in conversation",
          "Confirm metrics and continue"
        ],
        "title": "Generating a production progress report",
        "subtitle": "Execution progress",
        "prompt": "How did we do yesterday?",
        "label": "Proposed design · sample data",
        "caption": "Interactive proposal: adjust and confirm conditions, then inspect execution states.",
        "items": [
          {
            "title": "Confirm analysis scope",
            "detail": "Date, lines and metric confirmed",
            "state": "done"
          },
          {
            "title": "Retrieve production records",
            "detail": "Query completed",
            "state": "done"
          },
          {
            "title": "Organize charts and findings",
            "detail": "Generating report content",
            "state": "active"
          },
          {
            "title": "Report ready to read",
            "detail": "Waiting for generation to finish",
            "state": "pending"
          }
        ],
        "footer": "Execution details open on demand; confirmation requests stay within the task.",
        "scenarios": [
          {
            "title": "Running",
            "status": "Querying production records",
            "detail": "Scope: yesterday / all lines. Report not yet generated.",
            "action": "Wait for query completion"
          },
          {
            "title": "No data",
            "status": "No matching records",
            "detail": "Query complete, but no matching records; do not display a 0% completion rate.",
            "action": "Check dates and line scope"
          },
          {
            "title": "Query failed",
            "status": "Production query failed",
            "detail": "No data retrieved; no report conclusions generated.",
            "action": "Retry query"
          },
          {
            "title": "Report failed",
            "status": "Report generation failed",
            "detail": "Records are available for inspection, but the report is not complete.",
            "action": "Retry report generation"
          }
        ],
        "analysisFields": [
          {
            "label": "Metric",
            "options": [
              "Completion by units",
              "Completion by work orders"
            ]
          },
          {
            "label": "Time",
            "options": [
              "Yesterday",
              "Last 7 days"
            ]
          },
          {
            "label": "Scope",
            "options": [
              "All lines",
              "Line B"
            ]
          }
        ]
      }
    },
    "steps": [
      {
        "title": "Confirm metrics",
        "detail": "When users ask directly, data may not have completed semantic preparation or may lack a clear metric. The design checks readiness first, offers semantic preparation within the conversation when needed, and lets users confirm or edit the current metric, reducing navigation and task interruptions."
      }
    ],
    "screenshotBriefs": [
      "Show readiness checks for reusable metrics and missing semantic preparation",
      "Show in-conversation semantic processing, its status, and generated metrics without leaving the task",
      "Show confirmation or adjustment of metrics and formulas, followed by resuming the original question"
    ]
  },
  {
    "id": "qa-result",
    "index": "",
    "title": "After: trace results to metrics and calculation evidence",
    "intro": "",
    "body": "Users need to judge whether numbers can be used in reports without reading complete execution records every time. Metrics and calculation evidence are linked to results, keeping conclusions concise by default and expanding details for verification. Debugging staff handle deeper investigation of execution anomalies.",
    "images": [],
    "group": {
      "id": "qa-experience",
      "title": "Question-and-answer experience"
    },
    "qaExperience": {
      "decisions": [
        {
          "title": "Proposal",
          "body": "Locate the metric and calculation used from the result. Expand data sources and generation records as needed. Keep business reading concise, with a troubleshooting path for anomalies."
        }
      ],
      "mockup": {
        "kind": "result",
        "screenshotPlaceholder": [
          "Trace the generation process",
          "Locate metrics and calculations"
        ],
        "title": "Yesterday’s production completion",
        "subtitle": "By units · All production lines",
        "prompt": "Line B: 680 ÷ 1,000 × 100% = 68%.",
        "label": "Proposed design · sample data",
        "caption": "Proposal: read results first, then inspect records and calculations.",
        "items": [
          {
            "title": "Line A",
            "detail": "Completion",
            "value": 82
          },
          {
            "title": "Line B",
            "detail": "Completion",
            "value": 68
          },
          {
            "title": "Line C",
            "detail": "Completion",
            "value": 91
          }
        ],
        "footer": "Scope: yesterday / all lines. Metric: actual output ÷ planned output × 100% (quantity).",
        "verificationNote": "Proposal: preserve calculation rules; recalculate after refreshes or condition changes.",
        "sourceText": "Sample production records: line B completed 680 of 1,000 planned units, or 68%. Verification requires query records and retrieval time; no database is connected."
      }
    },
    "steps": [
      {
        "title": "Trace evidence",
        "detail": "Users need to judge whether numbers can be used in reports without reading complete execution records every time. Metrics and calculation evidence are linked to results, keeping conclusions concise by default and expanding details for verification. Debugging staff handle deeper investigation of execution anomalies."
      }
    ],
    "screenshotBriefs": [
      "Show a verification entry beside a result and its metric",
      "Show the formula, source, and records alongside the original result"
    ]
  },
  {
    "id": "continuous-analysis-example",
    "index": "05",
    "title": "From one analysis to an ongoing task",
    "intro": "",
    "body": "Internal user testing and observation identified follow-up references as a frequent source of misunderstanding. In production completion analysis, “why is it low” needs a clear line and time period. The design first links follow-ups to specific results and clarifies condition scope, then supports deeper analysis and recurring updates through result follow-ups, context and memory, and scheduled tasks.",
    "images": [],
    "designPlaceholder": "Figure 02 | Four screens for progress, line inspection, records and night-shift changes, with explicit simulated-data labels.",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    },
    "dialogue": {
      "decisions": [],
      "visual": {
        "kind": "sequence",
        "caption": "Proposal: from ongoing analysis to recurring updates",
        "frames": [
          {
            "title": "Result follow-ups",
            "prompt": "Why is completion low here?",
            "response": "Start from the relevant report region",
            "fields": []
          },
          {
            "title": "Context and memory",
            "prompt": "Show only the night shift",
            "response": "Retain the analysis object and change the current filter",
            "fields": []
          },
          {
            "title": "Scheduled tasks",
            "prompt": "Update yesterday’s data daily",
            "response": "Generate a workflow from the update request",
            "fields": []
          }
        ],
        "note": "Design proposal illustration, not validated production outcomes."
      }
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "Result follow-ups",
        "detail": "Users can ask about a specific report region and bring its data into the conversation automatically, reducing copying and repeated explanations."
      },
      {
        "title": "Context and memory",
        "detail": "Ongoing analysis uses current conditions, personal preferences, and business knowledge. Distinguish short-term context, personal analysis preferences, and references to business knowledge so temporary filters do not affect later tasks."
      },
      {
        "title": "Scheduled tasks",
        "detail": "Users who need daily data updates or recurring report delivery can generate a workflow from their request. Make timing, update steps, and delivery visible so repeated work becomes an inspectable scheduled task."
      }
    ],
    "bodyEmphasis": "result follow-ups, context and memory, and scheduled tasks"
  },
  {
    "id": "conversation",
    "index": "03",
    "title": "Clarify the referenced result before continuing",
    "intro": "",
    "body": "To address ambiguous follow-up references, the design offers an entry from the result area and carries selected data into the conversation. The proposal also shows the referenced object and conditions for review before sending, clarifying which part is being questioned before continuing analysis instead of guessing from chat history alone.",
    "images": [],
    "designPlaceholder": "Screenshots to add: Region entry / Data in dialogue / Follow-up analysis",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "Start a follow-up from the selected result to identify the current analysis object."
        },
        {
          "title": "1",
          "body": "Show the referenced object and time range to avoid ambiguity."
        },
        {
          "title": "2",
          "body": "Preserve the original result during further analysis without automatically rewriting the report."
        }
      ],
      "visual": {
        "kind": "workspace",
        "caption": "Proposal: Result follow-ups",
        "note": "Design proposal; memory storage, context assembly, scheduling, and delivery are implemented with engineering.",
        "frames": [
          {
            "title": "Region entry",
            "prompt": "Why is completion low here?",
            "response": "Start from the relevant report region",
            "fields": []
          },
          {
            "title": "Data in dialogue",
            "prompt": "Analyze this data",
            "response": "Bring region data into the conversation automatically",
            "fields": []
          },
          {
            "title": "Follow-up analysis",
            "prompt": "Investigate further",
            "response": "Analyze the referenced data alongside the report",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "Show a follow-up entry on selected completion data",
      "Show a reference card with the line, dates, and metric",
      "Show new analysis beside the original result and distinguish report editing"
    ]
  },
  {
    "id": "continuous-analysis-validation",
    "index": "04",
    "title": "Correct task conditions and separate lasting preferences",
    "intro": "",
    "body": "“Only the night shift” should retain the previous line without restricting all future tasks to night shifts. The proposal separates current conditions, personal preferences, and business knowledge references so users can see what carries forward and correct misunderstandings. Metric definitions come from shared knowledge rather than personal preferences.",
    "images": [],
    "designPlaceholder": "Screenshots to add: Short-term context / Personal preferences / Business knowledge references",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "Current context: show inherited conditions and changes in this turn, with correction controls."
        },
        {
          "title": "1",
          "body": "Personal preferences: manage common dimensions and chart habits separately."
        },
        {
          "title": "2",
          "body": "Business knowledge: reference shared metric definitions without duplicating them as personal memory."
        }
      ],
      "visual": {
        "kind": "context",
        "caption": "Proposal: Context and memory",
        "note": "Design proposal; memory storage, context assembly, scheduling, and delivery are implemented with engineering.",
        "frames": [
          {
            "title": "Short-term context",
            "prompt": "Show only the night shift",
            "response": "Retain the analysis object and change the current filter",
            "fields": []
          },
          {
            "title": "Personal preferences",
            "prompt": "Use line charts for trends",
            "response": "Separate presentation preferences from task filters",
            "fields": []
          },
          {
            "title": "Business knowledge references",
            "prompt": "How is completion calculated?",
            "response": "Reference the existing metric and calculation definition",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "Compare conditions before and after “only the night shift,” marking retained and changed values.",
      "Show correction of a misunderstood line while preserving other conditions.",
      "Show memory categories and scope, distinguishing task conditions, preferences, and knowledge references."
    ]
  },
  {
    "id": "applications",
    "index": "06",
    "title": "Review execution scope before enabling a schedule",
    "intro": "",
    "body": "Users want yesterday’s night-shift results at nine each day. Saving the current date would repeatedly query old data. The proposal retains confirmed lines and metrics, makes “yesterday” relative to the execution day, and reviews update steps and recipients before activation.",
    "images": [],
    "designPlaceholder": "Screenshots to add: Generate workflow / Schedule and delivery / Execution status",
    "group": {
      "id": "continuous-dialogue",
      "title": "Continuous dialogue experience"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "Reuse analysis conditions to generate a workflow for updates and delivery."
        },
        {
          "title": "1",
          "body": "Distinguish fixed filters from dynamic dates and preview the next query scope."
        },
        {
          "title": "2",
          "body": "Review execution time, recipients, and steps before activation, retaining execution status."
        }
      ],
      "visual": {
        "kind": "branches",
        "caption": "Proposal: Scheduled tasks",
        "note": "Design proposal; memory storage, context assembly, scheduling, and delivery are implemented with engineering.",
        "frames": [
          {
            "title": "Generate workflow",
            "prompt": "Update yesterday’s data daily",
            "response": "Generate a workflow from the update request",
            "fields": []
          },
          {
            "title": "Schedule and delivery",
            "prompt": "Send the report at nine every morning",
            "response": "Configure timing, query dates, and recipients separately",
            "fields": []
          },
          {
            "title": "Execution status",
            "prompt": "Has today’s report updated?",
            "response": "Inspect the workflow and its step statuses",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "Show a generated workflow with inherited line and metric",
      "Show daily timing and a preview of the relative night-shift range",
      "Show activation review and separate update and delivery statuses"
    ]
  },
  {
    "id": "agent-troubleshooting-overview",
    "index": "",
    "title": "From unexpected answers to issue diagnosis",
    "intro": "",
    "body": "When a night shift has production but a query finds no data, the final answer does not reveal where the discrepancy occurred. The design links unexpected answers to actual execution records rather than relying on AI explanations. Business users report anomalies; implementation and debugging staff locate steps, check evidence, and correct and retest conditions and data to assess whether the problem is resolved.",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "Troubleshooting"
    },
    "groupIntro": true,
    "steps": [
      {
        "title": "Locate steps",
        "detail": "Open the execution record from the unexpected answer to narrow the investigation"
      },
      {
        "title": "Check evidence",
        "detail": "Compare the question, query conditions, and returned data to identify the discrepancy"
      },
      {
        "title": "Correct and retest",
        "detail": "Execute again after correction and compare conditions and results"
      }
    ],
    "bodyEmphasis": "locate steps, check evidence, and correct and retest"
  },
  {
    "id": "agent-replay",
    "index": "07",
    "title": "Locate the execution behind an unexpected answer",
    "intro": "",
    "body": "Users confirm night-shift production, but the Agent answers “no data.” Business users report the anomaly while implementation and debugging staff inspect the execution. The proposal presents steps and states before locating relevant records, avoiding full logs for every user.",
    "images": [],
    "designPlaceholder": "Figure 05 | Unexpected answer, execution overview, and evidence panel. Compare the intended night shift, actual query dates, and returned records. Label simulated data and missing-record states.",
    "group": {
      "id": "agent-troubleshooting",
      "title": "Troubleshooting"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "Open the corresponding execution record from the unexpected answer."
        },
        {
          "title": "1",
          "body": "Retain the original question and analysis conditions."
        },
        {
          "title": "2",
          "body": "Narrow the investigation through interpretation, query, and generation steps."
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "Proposal: Locate steps",
        "note": "Design proposal illustration, not validated production outcomes.",
        "frames": [
          {
            "title": "Answer entry",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "Execution overview",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "Show the business-user feedback entry linked to the answer",
      "Show the debugging overview with the query step selected"
    ]
  },
  {
    "intro": "",
    "images": [],
    "group": {
      "id": "agent-troubleshooting",
      "title": "Troubleshooting"
    },
    "index": "07",
    "id": "agent-evidence",
    "title": "Check actual conditions rather than explanations alone",
    "body": "A night shift spans two days. No data may reflect a misinterpreted date range or genuinely unmatched records. The proposal brings the question, actual query conditions, and returned data into one verification path. AI explanations are supplementary, and missing records are explicitly identified.",
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "Compare the intended night shift with actual query timestamps."
        },
        {
          "title": "1",
          "body": "Expand inputs and returned records for relevant steps as needed."
        },
        {
          "title": "2",
          "body": "Identify record sources and missing evidence to avoid treating assumptions as facts."
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "Proposal: Check evidence",
        "note": "Design proposal illustration, not validated production outcomes.",
        "frames": [
          {
            "title": "Query conditions",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "Returned records and sources",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "Compare the intended night shift with actual query start and end times.",
      "Show distinct empty-result and missing-record states with their evidence."
    ]
  },
  {
    "id": "accuracy",
    "index": "08",
    "title": "Correct specific conditions and verify the new result",
    "intro": "",
    "body": "After finding an incorrect night-shift date range, debugging staff correct the query conditions and check whether expected records are returned. The proposal separates historical inspection from re-execution and preserves before-and-after conditions for comparison. Successful re-execution does not necessarily mean the business result is correct.",
    "images": [],
    "designPlaceholder": "Figure 06 | Correction and retest comparison for an overnight query: original and corrected date ranges alongside both execution results. Clearly separate historical and test records. Design proposal only.",
    "group": {
      "id": "agent-troubleshooting",
      "title": "Troubleshooting"
    },
    "dialogue": {
      "decisions": [
        {
          "title": "0",
          "body": "Make clear that this example corrects the query time range."
        },
        {
          "title": "1",
          "body": "Retain original records and compare retest conditions and returned data."
        },
        {
          "title": "2",
          "body": "Check coverage of the expected shift and continue investigating if anomalies remain."
        }
      ],
      "visual": {
        "kind": "sequence",
        "caption": "Proposal: Correct and retest",
        "note": "Design proposal illustration, not validated production outcomes.",
        "frames": [
          {
            "title": "Correct query conditions",
            "prompt": "",
            "response": "",
            "fields": []
          },
          {
            "title": "Compare retest results",
            "prompt": "",
            "response": "",
            "fields": []
          }
        ]
      }
    },
    "screenshotBriefs": [
      "Show original and corrected query dates",
      "Compare both runs and verify that expected shift records are returned"
    ]
  },
  {
    "id": "role",
    "index": "09",
    "title": "Current outcomes",
    "adoptionResult": {
      "before": 15,
      "after": 60,
      "label": "Application adoption rate",
      "beforeLabel": "Initially",
      "afterLabel": "After iteration",
      "changeLabel": "Up 45 percentage points"
    },
    "intro": "",
    "body": "I refined the question-answering and ongoing-dialogue experience, clarifying metric confirmation, reuse of analysis conditions, and the connection between follow-ups and report updates. As the overall product evolved, adoption of generated applications gradually increased from 15% to 60%.",
    "images": [],
    "bullets": [
      "Application adoption rate = applications published by users / applications created × 100%"
    ]
  }
]

  const growthSections: DataPilotSection[] = isZh
    ? [
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
    : [
        {
          id: 'growth-research', index: '01', title: 'Market background', intro: 'Overseas SaaS commercialization is still being explored',
          body: 'The Data Agent is ready for delivery, but its commercialization in the overseas SaaS market is still being explored. The question is not only whether it can generate results, but who the overseas users are, which scenarios show value most clearly, how users should start a trial, and whether they will move from trial to a payment discussion. I used competitor research, user scenarios, and customer feedback to narrow the audience and first task to validate first.',
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
      intro: isZh ? "验证Data Agent能否帮助业务人员追查生产进度" : "Validate analytics for investigating production progress",
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
      isZh ? 'Data Agent是一款面向业务分析场景的自然语言数据产品。产品将业务数据、指标口径与语义知识加工为 AI 可理解的上下文，提升问数结果的准确性，并支持从查询结果继续生成报表、仪表盘等数据应用。' : 'Data Agent supports natural-language analysis for business scenarios. It turns business data, metric definitions, and semantic knowledge into AI-readable context for more accurate answers, then supports continued creation of reports, dashboards, and other data applications.',
      isZh ? '本案例重点呈现多轮对话、人机交互与智能体回放孵化。围绕客户与用户问题，通过具体示例说明交互方案，将条件继承、业务澄清、执行反馈和证据回查串成一条连续任务；POC 与海外 SaaS 探索作为补充材料。' : 'This case focuses on multi-turn dialogue, human–AI interaction and Agent replay incubation, using concrete user questions to illustrate interaction proposals. POC and overseas SaaS exploration provide supplementary context.',
      isZh ? '核心负责 Agent 从问数到智能生成报告的完整链路体验，覆盖对客需求与场景梳理、产品需求规划、前端设计研发与验证，以及与后端研发的接口对接；以提升应用采纳率为核心目标。支持 4 家付费客户交付。' : 'Core responsibility covered the complete Agent experience from querying to intelligent report generation, including customer needs and scenarios, product requirements planning, frontend design and development, validation, and backend API integration, with application adoption as the primary goal. Supported delivery to 4 paying customers.',
    ],
    metadata: isZh ? ['职责：产品需求规划 · 前端设计研发与验证 · 接口协作', '场景：客户生产分析', '目标：提升应用采纳率'] : ['Role: product planning, frontend design and development, validation, API integration', 'Context: Customer manufacturing POC', 'Goal: application adoption'],
    lead: isZh ? '从自然语言问数到报告生成，围绕问答体验、持续分析与问题排查设计 AI 智能体体验' : 'Design an AI agent experience from natural-language questions to report generation, focusing on question answering, ongoing analysis, and troubleshooting.',
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
