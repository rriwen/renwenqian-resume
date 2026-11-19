import { getDataPilotContent } from './projects/dataPilot'
import { getDesignEngineeringContent } from './projects/designEngineering'
import { getDatabaseOpsFunnel, type ProjectFunnelData } from './projects/databaseOps'
import type { Locale } from '../i18n/translations'

export type ProjectDetailHighlight = {
  /** 列表项关键词，渲染为加粗 */
  keyword: string
  /** 关键词后的说明正文 */
  text: string
}

export type ProjectGalleryItem = {
  /** 配图 URL（如 `/images/xxx.gif`）；支持 jpg/webp/png 及 **GIF 动图** */
  src: string
  /** 配图下方说明（与 locale 一致的语言） */
  caption: string
  /** 在正文画廊中隐藏图注，仍保留图片按钮与全屏预览的说明。 */
  hideCaption?: boolean
  /** 透明配图直接融入页面，不显示画廊底色和边框。 */
  transparentBackground?: boolean
  /** 正文预览按比例裁去素材留白，全屏预览保留原图。 */
  sourceRegion?: { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number }
  previewCrop?: { aspectRatio: number; objectPosition: string }
}

/** 职责说明下的子条目（小标题较粗 + 正文） */
export type ProjectDetailNestedResponsibility = {
  title: string
  body: string
}

export type ProjectDetailResponsibilityItem = {
  title: string
  /** 主说明；可与 nested 并存 */
  body?: string
  nested?: ProjectDetailNestedResponsibility[]
}

/** 引言 + 职责列表（主层实心圆点、可选嵌套空心圆） */
export type ProjectDetailResponsibilities = {
  intro: string
  items: ProjectDetailResponsibilityItem[]
}

/** 正文片段，支持加粗、主题适配的警示色与外部参考链接。 */
export type ProjectDetailParagraphRun = { text: string; bold?: boolean; tone?: 'danger'; href?: string }

/** 普通字符串整段，或由片段拼接（用于段内局部强调） */
export type ProjectDetailParagraph = string | ProjectDetailParagraphRun[]

export type ProjectDetailTable = {
  columns: string[]
  /** null 表示被前一行的 rowSpan 覆盖。 */
  rows: { id: string; cells: (string | { text: string; rowSpan: number; groups?: { title: string; items: string[] }[] } | null)[] }[]
}

/** 从上到下展示设计基建、交付与应用。 */
export type ProjectArchitectureData = {
  title: string
  layers: {
    id: string
    title: string
    description?: string
    nodes: { id: string; title: string; description?: string }[]
  }[]
}

/** 设计决策内部的方案对比；保留元素 ID、配图和双语语料。 */
export type ProjectDetailComparison = {
  id: string
  title: string
  description?: string
  paragraphs: ProjectDetailParagraph[]
  options: {
    id: string
    title: string
    paragraphs: ProjectDetailParagraph[]
    listItems: ProjectDetailParagraph[]
    images: ProjectGalleryItem[]
  }[]
}

export type ProjectDetailSection = {
  /** 将摘要内容渲染在顶部概览，仍保留章节锚点。 */
  placement?: 'overview'
  hideTitle?: boolean
  id: string
  /** 正文重组时保留旧深链接，不额外增加目录项。 */
  legacyIds?: string[]
  title: string
  paragraphs: ProjectDetailParagraph[]
  table?: ProjectDetailTable
  architecture?: ProjectArchitectureData
  /** 章节内的小标题、正文与配图保持绑定，页面和聊天共用。 */
  subsections?: {
    id: string
    title: string
    hideTitle?: boolean
    paragraphs: ProjectDetailParagraph[]
    listItems?: ProjectDetailParagraph[]
    closingParagraphs?: ProjectDetailParagraph[]
    afterImagesParagraphs?: ProjectDetailParagraph[]
    mediaFirst?: boolean
    prototypeEmbed?: { url: string; title: string }
    table?: ProjectDetailTable
    funnel?: ProjectFunnelData
    comparison?: ProjectDetailComparison
    /** 待补的前后对比配图，仅在页面展示，不作为项目事实进入聊天语料。 */
    comparisonPlaceholder?: {
      before: { title: string; description: string }
      after: { title: string; description: string }
    }
    images?: ProjectGalleryItem[]
    /** 桌面端将配图并排展示，窄屏按原图比例堆叠。 */
    imagesLayout?: 'row'
    /** 原始过程材料默认折叠，使用此文案作为展开入口。 */
    imagesDisclosure?: string
    /** 桌面端左文右图，列宽为 2:1；窄屏按内容顺序堆叠。 */
    layout?: 'text-image'
  }[]
  images: ProjectGalleryItem[]
  imagesDisclosure?: string
}

export type ProjectDetailBlock = {
  overviewPrototype?: { url: string; title: string; viewportWidth?: number }
  tags: string[]
  overviewFacts?: { label: string; value: string }[]
  demoUrl?: string
  paragraphs: ProjectDetailParagraph[]
  /** 默认展示项目封面；为 false 时概述后直接进入正文。 */
  showCover?: boolean
  /** 按章节绑定标题、正文与配图，页面与聊天共用。 */
  sections?: ProjectDetailSection[]
  /** 段落之后：结构化职责说明（引言 + 列表 + 可选嵌套小标题） */
  responsibilities?: ProjectDetailResponsibilities
  /** 职责说明之后、要点列表之前的补充段落 */
  afterResponsibilities?: string[]
  /** 段落之后、外链之前的要点列表（关键词加粗） */
  highlightBullets?: ProjectDetailHighlight[]
  /** 要点列表上方的小标题 */
  highlightBulletsIntro?: string
  /** 为 true 时要点列表渲染为有序列表（1. 2. 3.） */
  highlightBulletsOrdered?: boolean
  /** 要点列表之后、外链之前的一段补充说明 */
  afterHighlightBullets?: string
  /** 可选外链，展示为「查看站点」类 CTA */
  externalUrl?: string
  /** 详情页画廊，可为封面与其它作品图组合 */
  gallery: ProjectGalleryItem[]
}

export const DATABASE_OPS_PROTOTYPE_URL = 'https://oah5w3.axshare.com/#id=og53tu&p=%E2%91%A0_%E9%80%89%E6%8B%A9%E6%BA%90%E7%AB%AF-%E6%96%B0%E5%BB%BA-ob%E6%96%87%E6%A1%A3&c=1'

const details: Record<string, {zh: ProjectDetailBlock }> = {
  Memory: {
    zh: {
      tags: ['记忆系统', 'Agent 友好', '产品设计'],
      paragraphs: [
        'seekdb M0 是面向 OpenClaw 一键部署的轻量级记忆插件产品。',
        '产品通过一键部署（基于 Skills）让 Agent 获得可检索、可复用的记忆能力，相比原生方案响应更快、token 消耗更低；同时内置经验自动提取与多轮验证机制，驱动 Agent 持续进化。',
        '我作为产品设计师负责：',
      ],
      highlightBullets: [
        {
          keyword: '产品设计创新探索',
          text: '设计基于 Skills 的一键部署流程方案，让 Agent 零配置启用记忆能力；设计「 OpenClaw 工作经验自动提取 → 多轮验证 → 反馈优化」的闭环机制，驱动 Agent 持续进化。',
        },
        {
          keyword: '设计与前端交付',
          text: '独立完成产品官网与记忆管理后台的视觉设计、内容规划和前端代码；结合 AI 辅助开发，使用 Skill 与组件库完成页面和组件实现，在 2 周内完成从设计到上线的交付。',
        },
      ],
      afterHighlightBullets:
        '产品在两周内快速孵化落地，目前已进入公测阶段、正在启动商业化规划。',
      externalUrl: 'https://m0.seekdb.ai/',
      gallery: [
        { src: '/images/memory-m0-admin.gif', caption: '记忆管理交互' },
        { src: '/images/memory-m0-experience-flow.png', caption: '经验沉淀逻辑' },
      ],
    },
  },
  text2sql: {
    "zh": {
      "showCover": false,
      "overviewPrototype": {
        "url": "/prototype/text2sql?embed=1",
        "title": "Text2SQL 交互演示",
        "viewportWidth": 1280
      },
      "demoUrl": "/prototype/text2sql",
      "tags": [
        "AI 辅助",
        "SQL 编辑器",
        "产品界面设计"
      ],
      "paragraphs": [
        "面向 SQL 编写与修改场景，我负责产品界面设计，重点是就近操作、意图表达与生成控制。",
        "本地原型基于早期稿制作，AI 回复与查询结果均为模拟。选中代码点击「编辑」，或按 ⌘K 体验。"
      ],
      "gallery": [],
      "sections": [
        {
          "id": "context",
          "title": "设计背景",
          "paragraphs": [
            "用户既要说清怎么改，也要知道改哪段、是否采用。方案围绕光标与选区组织输入，让自然语言请求与代码保持联系。"
          ],
          "images": []
        },
        {
          "id": "contextual-entry",
          "title": "就近编辑",
          "paragraphs": [],
          "subsections": [
            {
              "id": "inline-and-sidebar",
              "title": "输入跟随对象",
              "paragraphs": [
                [
                  {
                    "text": "就近输入：",
                    "bold": true
                  },
                  {
                    "text": "输入框跟随光标或选区，让用户描述需求时仍能参照代码。局部修改使用「编辑」，侧边对话保留为另一条路径。"
                  }
                ],
                [
                  {
                    "text": "设计取舍：",
                    "bold": true
                  },
                  {
                    "text": "就近操作会占用编辑空间，因此提供关闭入口与 Esc 退出。"
                  }
                ]
              ],
              "images": [
                {
                  "src": "/images/text2sql-interaction-design.png",
                  "caption": "早期稿局部：输入框位于选中 SQL 的上方，描述需求时仍保留代码参照。",
                  "sourceRegion": {
                    "x": 3210,
                    "y": 1540,
                    "width": 1530,
                    "height": 660,
                    "sourceWidth": 14000,
                    "sourceHeight": 5120
                  },
                  "hideCaption": true
                }
              ],
              "layout": "text-image",
              "hideTitle": true
            },
            {
              "id": "discoverability",
              "title": "入口按需出现",
              "paragraphs": [
                "空行提示、选区入口与快捷键减少常驻控件，也使首次发现更依赖提示，需进一步验证。"
              ]
            }
          ],
          "images": []
        },
        {
          "id": "task-commands",
          "title": "明确意图",
          "paragraphs": [],
          "images": [],
          "subsections": [
            {
              "id": "design-decision",
              "title": "明确意图",
              "hideTitle": true,
              "layout": "text-image",
              "paragraphs": [
                [
                  {
                    "text": "辅助表达：",
                    "bold": true
                  },
                  {
                    "text": "「/」菜单提供生成、纠错、改写和格式化，指令以标签回显，可切换或清除；具体需求仍用自然语言补充。"
                  }
                ],
                [
                  {
                    "text": "设计取舍：",
                    "bold": true
                  },
                  {
                    "text": "任务选择增加了一步操作。正文输入时收起菜单，避免打断；将「优化」改为「改写」，避免暗示性能提升。"
                  }
                ]
              ],
              "images": [
                {
                  "src": "/images/text2sql-interaction-design.png",
                  "caption": "早期稿局部：四类任务作为输入辅助；选中后以标签回显，仍由用户补充具体需求。",
                  "sourceRegion": {
                    "x": 5820,
                    "y": 380,
                    "width": 1500,
                    "height": 760,
                    "sourceWidth": 14000,
                    "sourceHeight": 5120
                  },
                  "hideCaption": true
                }
              ]
            }
          ]
        },
        {
          "id": "generation-feedback",
          "title": "生成控制",
          "paragraphs": [],
          "images": [],
          "subsections": [
            {
              "id": "design-decision",
              "title": "生成控制",
              "hideTitle": true,
              "layout": "text-image",
              "paragraphs": [
                "生成时显示状态，发送按钮切换为终止。结束后回到输入状态，便于调整请求。",
                [
                  {
                    "text": "控制边界：",
                    "bold": true
                  },
                  {
                    "text": "终止操作让等待可控，内容正确性仍需通过结果审阅判断。"
                  }
                ]
              ],
              "images": [
                {
                  "src": "/images/text2sql-interaction-design.png",
                  "caption": "早期稿局部：生成状态与终止按钮位于同一输入区域，等待和退出保持连续。",
                  "sourceRegion": {
                    "x": 8730,
                    "y": 380,
                    "width": 1530,
                    "height": 610,
                    "sourceWidth": 14000,
                    "sourceHeight": 5120
                  },
                  "hideCaption": true
                }
              ]
            }
          ]
        },
        {
          "id": "result-review",
          "title": "结果审阅",
          "paragraphs": [
            "以下为早期稿中标注「待定」的方案探索。"
          ],
          "subsections": [
            {
              "id": "diff-and-decision",
              "title": "确认修改",
              "paragraphs": [
                [
                  {
                    "text": "先看变化：",
                    "bold": true
                  },
                  {
                    "text": "用颜色区分删除、新增与未变代码，由用户选择接受或忽略。"
                  }
                ],
                [
                  {
                    "text": "设计取舍：",
                    "bold": true
                  },
                  {
                    "text": "增加一次确认，留出检查改动的机会。仍需验证差异是否易懂，并用符号与文字补充颜色区分。"
                  }
                ]
              ],
              "images": [
                {
                  "src": "/images/text2sql-interaction-design.png",
                  "caption": "结果方案探索：删除、新增与未变化代码分开呈现，接受或忽略由用户决定。原稿此部分标注为「待定」。",
                  "sourceRegion": {
                    "x": 11430,
                    "y": 380,
                    "width": 2200,
                    "height": 780,
                    "sourceWidth": 14000,
                    "sourceHeight": 5120
                  },
                  "hideCaption": true
                }
              ],
              "layout": "text-image",
              "hideTitle": true
            },
            {
              "id": "failure-feedback",
              "title": "区分失败原因",
              "paragraphs": [
                "方案用代码注释解释无法生成的原因，在输入区反馈请求异常。注释可能与可执行内容混淆，呈现位置与重试方式仍需验证。"
              ]
            }
          ],
          "images": []
        },
        {
          "id": "delivery-and-reflection",
          "title": "交付与回顾",
          "paragraphs": [
            "项目已上线。本案例基于早期设计稿回顾，结果审阅与异常反馈保留探索边界，尚未收录上线反馈与效果指标。",
            "后续重点验证入口发现、指令理解与改动审阅，判断这些取舍是否有效。"
          ],
          "images": []
        }
      ]
    }
  },
  'workflow-editor': {
  "zh": {
    "showCover": false,
    "tags": [
      "从 0 到 1",
      "任务编排",
      "复杂交互"
    ],
    "paragraphs": [
      "面向数据开发与分析场景，将分散的数据处理任务组织为可视化任务流，通过节点与连线表达执行顺序和依赖关系，支持任务的编排与周期调度。",
      "设计围绕画布操作、节点排版、节点状态与连线反馈展开，在自由编排、操作习惯与首版实现成本之间建立取舍，形成任务流编辑器的基础交互规范。"
    ],
    "gallery": [],
    "sections": [
      {
        "id": "context",
        "title": "从分散执行到可视化编排",
        "paragraphs": [
          "多样化的数据来源、持续增长的数据规模与复杂业务流程，使单次 SQL 执行和手动处理难以覆盖完整的数据工作。数据集成、清洗、聚合与分析需要按照依赖关系协同执行。",
          "任务流以有向无环图（DAG）组织节点与依赖关系。编辑器的核心设计问题，是让用户既能理解完整流程，也能顺畅地创建、连接和配置单个任务。"
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "任务流示例：用节点与连线表达任务依赖",
            "sourceRegion": {
              "x": 198,
              "y": 296,
              "width": 442,
              "height": 148,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          }
        ]
      },
      {
        "id": "users-and-scope",
        "title": "目标用户与首版范围",
        "paragraphs": [
          "原方案基于二手资料提出两类目标用户假设：数据开发者与数据分析师。两者对编程和工具的熟悉程度不同，但都需要将多步数据处理组织为可重复执行的流程。"
        ],
        "images": [],
        "table": {
          "columns": [
            "用户",
            "典型任务",
            "设计关注点"
          ],
          "rows": [
            {
              "id": "row-0",
              "cells": [
                "数据开发者",
                "连接数据源，组合数据转换与 SQL 节点，配置周期调度",
                "灵活编排任务关系，快速完成节点配置"
              ]
            },
            {
              "id": "row-1",
              "cells": [
                "数据分析师",
                "查询和分析数据，生成报表，并周期性获取业务结果",
                "清晰理解流程结构，沿用熟悉的编辑操作"
              ]
            }
          ]
        }
      },
      {
        "id": "design-principles",
        "title": "设计目标：自由编排，降低学习成本",
        "paragraphs": [
          "首版以完成核心编排操作为范围，优先建立可扩展的画布、节点与连线规则。节点类型扩展、版本管理、批量操作及智能辅助作为后续方向。"
        ],
        "images": [],
        "table": {
          "columns": [
            "目标",
            "对应设计"
          ],
          "rows": [
            {
              "id": "row-0",
              "cells": [
                "自由灵活",
                "允许自由放置节点，并通过自动布局整理结构"
              ]
            },
            {
              "id": "row-1",
              "cells": [
                "符合习惯",
                "结合常见编辑器操作，支持鼠标、触控板与快捷键"
              ]
            },
            {
              "id": "row-2",
              "cells": [
                "最小可用",
                "优先覆盖创建、连接、配置的基础交互，保留后续扩展空间"
              ]
            }
          ]
        }
      },
      {
        "id": "canvas",
        "title": "设计一：让画布操作符合使用习惯",
        "paragraphs": [
          "画布需要同时支持浏览完整流程与编辑局部节点。方案比较了滚动条、抓手模式、空格拖拽、滚轮或触控板滑动，以及空白区域拖拽等方式。",
          "结合常见任务流编辑器的操作模式，选择空白区域拖拽作为画布移动方式；缩放保留按钮、滚轮、触控板及快捷键入口，适配不同输入习惯。"
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "画布移动：多种输入方式与操作习惯比较",
            "sourceRegion": {
              "x": 29,
              "y": 1755,
              "width": 784,
              "height": 635,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          },
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "画布缩放：按钮、滚轮、触控板与快捷键",
            "sourceRegion": {
              "x": 198,
              "y": 2490,
              "width": 443,
              "height": 315,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          }
        ],
        "table": {
          "columns": [
            "关键约束",
            "设计处理",
            "取舍原因"
          ],
          "rows": [
            {
              "id": "row-0",
              "cells": [
                "缩放后仍需看清节点",
                "将缩放范围限定为 50%–200%",
                "兼顾流程概览与节点文字的可读性"
              ]
            },
            {
              "id": "row-1",
              "cells": [
                "避免与浏览器快捷键冲突",
                "缩放快捷键增加 Shift 修饰键",
                "保留快捷操作，同时区分页面与画布缩放"
              ]
            }
          ]
        }
      },
      {
        "id": "layout",
        "title": "设计二：自由布局与自动整理结合",
        "paragraphs": [
          "DAG 没有固定的流程结构，固定布局难以覆盖不同任务的依赖关系，因此不作为首版方案。",
          "在自由布局与网格布局之间，首版选择实现成本相对较低的自由布局，允许用户按任务关系放置节点。同时提供自动布局，将分散节点重新整理为便于阅读的结构，平衡编排自由度与流程可读性。"
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "节点排版：自由排版、网格布局与固定布局",
            "sourceRegion": {
              "x": 198,
              "y": 3000,
              "width": 443,
              "height": 238,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          },
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "自动布局：整理分散节点",
            "sourceRegion": {
              "x": 271,
              "y": 3330,
              "width": 330,
              "height": 120,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          }
        ]
      },
      {
        "id": "nodes-and-connections",
        "title": "设计三：用状态反馈建立编排规则",
        "paragraphs": [
          "节点不仅承载任务信息，也提供创建下游节点、配置属性和建立依赖关系的操作入口。通过对比 DMS 与 DolphinScheduler，明确节点默认、悬停、选中及配置入口等交互状态。",
          "结合编辑器整体布局，连线采用上进下出的方向表达依赖关系，并分别定义连接点与连接线在拖拽、吸附、选中和重新连接时的反馈。"
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "节点状态：与 DMS、DolphinScheduler 的交互比较",
            "sourceRegion": {
              "x": 29,
              "y": 3610,
              "width": 784,
              "height": 650,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          },
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "连线方向：上进下出的依赖关系",
            "sourceRegion": {
              "x": 198,
              "y": 4350,
              "width": 442,
              "height": 245,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          },
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "连接点与连线：拖拽、吸附、选中和重新连接",
            "sourceRegion": {
              "x": 198,
              "y": 4670,
              "width": 443,
              "height": 710,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          }
        ],
        "table": {
          "columns": [
            "操作环节",
            "设计处理",
            "预期作用"
          ],
          "rows": [
            {
              "id": "row-0",
              "cells": [
                "识别与选择节点",
                "区分默认、悬停、选中状态，并提供节点属性配置入口",
                "让当前操作对象和配置上下文保持清晰"
              ]
            },
            {
              "id": "row-1",
              "cells": [
                "建立依赖关系",
                "连接点提供拖拽与吸附反馈",
                "明确可连接目标与连接过程"
              ]
            },
            {
              "id": "row-2",
              "cells": [
                "调整已有关系",
                "区分连接线的选中、取消选中与重新连接状态",
                "让流程修改过程可见、可理解"
              ]
            }
          ]
        }
      },
      {
        "id": "delivery-and-next",
        "title": "阶段产出与后续方向",
        "paragraphs": [
          "项目形成了任务流编辑器的初版交互方案，覆盖画布移动与缩放、节点排版、节点状态及连线操作。原文记录该版本仍处于初始阶段，并非完整数据开发闭环。",
          "后续方向包括扩展节点类型、版本管理与批量操作，以及配置检查、节点推荐和自然语言生成任务流等智能辅助能力。这些内容属于规划方向，不作为已交付成果。",
          "后续验证可围绕首次创建任务流的完成情况、节点配置与连线错误，以及复杂流程的整理效率展开，检验自由布局与自动整理是否能兼顾易用性和灵活性。"
        ],
        "images": []
      },
      {
        "id": "design-notes",
        "title": "设计过程记录",
        "paragraphs": [
          "原始文章保留了输入方式比较、布局方案取舍，以及节点与连线的状态细节，可展开查阅。"
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "原始文章：从零到一，任务流编辑器设计分析"
          }
        ],
        "imagesDisclosure": "查看原始设计分析"
      }
    ]
  },
},
  'design-token': {
    zh: { showCover: false, tags: ['设计系统'], paragraphs: ['内容准备中。'], gallery: [] },
  },
  skills: {
    zh: {
      showCover: false,
      tags: ['设计工程', 'Skills'],
      paragraphs: ['将组件用法、工程安装与交互约束整理为 Skill，结合组件库应用于 Data Agent、记忆插件及官网开发，交付页面与组件代码。'],
      gallery: [
        { src: '/images/aidesignsystem-skill-exploration.jpg', caption: 'Skill 探索' },
        { src: '/images/aidesignsystem-design-agent.jpg', caption: '设计 Agent 搭建' },
      ],
    },
  },
  'design-md': {
    zh: { showCover: false, tags: ['设计规范'], paragraphs: ['内容准备中。'], gallery: [] },
  },
  databaseops: {
    zh: {
      showCover: false,
      tags: ['2023.01-2024.06', '自助体验', '用户地图', '数据埋点'],
      paragraphs: [],
      sections: [
        {
          "id": "design-goals",
          placement: 'overview',
          hideTitle: true,
          "title": "背景和目标",
          paragraphs: [
            'OceanBase 数据库运维平台支持企业完成数据库配置与运维。随着业务向中小企业和海外市场拓展，平台需要帮助用户自主完成试用与核心任务，促进付费转化，并降低技术支持成本。',
            '本次设计围绕新用户自助体验展开，通过全链路诊断，将优化重点收敛至迁移任务创建流程。',
          ],
          table: {
            columns: ['项目', '说明'],
            rows: [
              { id: 'target-users', cells: ['目标用户', '有数据库运维基础、首次试用的新用户'] },
              { id: 'design-goal', cells: ['设计目标', '提升数据迁移环节的任务自助率'] },
              { id: 'success-metrics', cells: ['衡量标准', '任务完成率(80%) & 耗时(5min)'] },
            ],
          },
          "images": []
        },
        {
          id: 'diagnosis',
          title: '全链路体验诊断',
          paragraphs: [],
          subsections: [
            {
              id: 'target-users',
              title: '1. 目标用户',
              hideTitle: true,
              paragraphs: ['面向中小企业和海外市场的自助使用需求，梳理从产品了解到付费使用的完整链路，识别三个关键阶段的体验问题。'],
            },
            {
              id: 'journey-map',
              title: '2. 体验地图',
              hideTitle: true,
              paragraphs: [],
              listItems: [
                [
                  { text: '官网了解：', bold: true },
                  { text: '产品信息与试用入口不清晰，用户难以快速了解产品并进入试用；' },
                ],
                [
                  { text: '试用下单：', bold: true },
                  { text: '流程衔接不畅、配置门槛高，用户难以顺利完成从申请到开通的准备过程；' },
                ],
                [
                  { text: '数据迁移：', bold: true },
                  { text: '任务创建流程易中断，对象配置理解成本高，影响用户自助完成任务的成功率与操作效率。' },
                ],
              ],
              images: [{ src: '/images/databaseops-ux-map.jpg', caption: '用户体验地图' }],
            },
          ],
          images: [],
        },
        {
          id: 'migration-analysis',
          title: '迁移卡点定位',
          paragraphs: ['在全链路诊断的基础上，优化重点聚焦数据迁移环节的自助体验。通过数据埋点分析迁移任务创建各阶段的转化情况，定位主要流失环节。'],
          subsections: [
            {
              id: 'instrumentation',
              mediaFirst: true,
              title: '1. 问题具体细化定位',
              paragraphs: ['结合原有创建流程分析、竞品分析与一线 SA 访谈，进一步归纳影响用户自助完成任务的两类关键问题：'],
              listItems: [
                [
                  { text: '创建流程易中断', bold: true },
                  { text: '数据源准备与账号授权需要离开当前流程，返回后需重复配置，增加任务中断与放弃的风险。' },
                ],
                [
                  { text: '对象配置理解成本高', bold: true },
                  { text: '迁移对象选择依赖通配规则，过滤与汇聚操作缺少有效引导，增加文档查阅与操作试错成本。' },
                ],
              ],
              funnel: getDatabaseOpsFunnel('zh'),
              imagesLayout: 'row',
              images: [
                { src: '/images/databaseops-source-selection.png', caption: '原流程：选择数据源' },
                { src: '/images/databaseops-migration-scope.png', caption: '原流程：选择迁移范围' },
              ],
            },
          ],
          images: [],
        },
        {
          id: 'design-opportunities',
          title: '设计机会',
          paragraphs: ['基于前述卡点，将设计目标转化为具体的设计策略、衡量指标与优化思路。'],
          table: {
            columns: ['设计策略', '优化思路', '衡量指标'],
            rows: [
              { id: 'shorten-creation', cells: ['串联核心步骤', '将数据源准备、配置保存与帮助引导纳入创建流程', '任务完成率'] },
              { id: 'object-selection', cells: ['优化选择对象', '提供分层选择方式，降低规则配置与过滤操作成本', '任务耗时'] },
            ],
          },
          images: [],
        },
        {
          id: 'interaction',
          title: '优化一：串联核心步骤',
          paragraphs: [],
          subsections: [
            {
              id: 'continuous-setup',
              prototypeEmbed: { url: 'https://oah5w3.axshare.com/#id=hlu8jh&p=%E2%91%A0_%E9%80%89%E6%8B%A9%E7%9B%AE%E6%A0%87%E7%AB%AF-%E6%96%B0%E5%BB%BA-ob%E6%96%87%E6%A1%A3&c=1&sc=1', title: '迁移创建流程交互原型' },
              hideTitle: true,
              title: '1. 串联任务步骤，在操作卡点提供引导',
              paragraphs: [
                '弱化创建项目、预检查等可由系统完成的步骤，让用户聚焦“连接数据源（源端与目标端）→ 设置迁移类型 → 选择迁移对象”的核心任务链路。',
                '将数据源准备、配置保存与复用、帮助查阅（白名单配置、账号授权等）整合至当前流程，降低流程中断与重复配置成本。',
              ],
              table: {
                columns: ['设计重点', '原有卡点', '优化处理'],
                rows: [
                  { id: 'in-flow-source', cells: ['流程内准备数据源', '选择数据源时，仍需离开创建流程准备连接信息。', '在当前步骤提供「已有数据源 / 新建数据源」，将数据源准备纳入任务链路。'] },
                  { id: 'save-source', cells: ['保存配置供后续复用', '数据源信息需要重复填写，增加重新配置的成本。', '提供「保存」，填写名称与备注，便于后续通过已有数据源复用配置。'] },
                  { id: 'contextual-help', cells: ['配置与引导并置', '权限要求与连接限制分散，用户需反复查找文档。', '嵌入限制条件、账号授权与注意事项等帮助内容，支持即时查阅。'] },
                ],
              },
              closingParagraphs: [
                '为提升整体屏幕空间利用率，探索步骤条组件的布局优化，在清晰呈现任务结构与进度的同时，为表单配置和帮助文档保留更多展示空间。',
              ],
              comparison: {
                id: 'stepper-design',
                title: '步骤条组件优化',
                description: '任务结构与进度呈现',
                paragraphs: ['从进度识别与空间占用两个维度对比横向、纵向布局。'],
                options: [
                  {
                    id: 'horizontal-stepper',
                    title: '横向步骤条：条形节点',
                    paragraphs: [],
                    listItems: [
                      '纵向空间占用较少，符合自上而下的阅读顺序。',
                      '步骤数量或名称长度增加时易换行，对可用横向空间要求较高。',
                    ],
                    images: [{ src: '/images/databaseops-stepper-horizontal.gif', caption: '' }],
                  },
                  {
                    id: 'vertical-stepper',
                    title: '纵向步骤条：点状节点',
                    paragraphs: [],
                    listItems: [
                      '进度与内容分区清晰，便于聚焦当前任务。',
                      '占用横向空间，窄屏需调整布局；需强化步骤状态以区别普通导航。',
                    ],
                    images: [{ src: '/images/databaseops-stepper-vertical.gif', caption: '' }],
                  },
                ],
              },
            },
          ],
          images: [],
        },
        {
          id: 'object-selection',
          title: '优化二：重构对象选择交互',
          paragraphs: [
                '原流程仅依赖编写通配规则，用户需掌握规则语法后才能选择迁移对象，增加了理解与操作成本。因此，根据已有数据范围清单及用户对规则熟悉程度和习惯，提供三种选择方式：直接勾选降低使用门槛，白屏规则配置与文件导入支持批量操作。',
              ],
          subsections: [
            {
              id: 'structured-object-selection',
              prototypeEmbed: { url: 'https://oah5w3.axshare.com/#id=fm7s0q&p=%E2%91%A0_%E8%A7%84%E5%88%99%E5%8C%B9%E9%85%8D&c=1&sc=1', title: '对象选择交互原型' },
              mediaFirst: true,
              hideTitle: true,
              title: '2. 分层组织对象选择，兼顾不同经验的用户',
              paragraphs: [],
              table: {
                columns: ['交互方式', '适用用户与场景', '设计处理'],
                rows: [
                  { id: 'transfer-selection', cells: ['穿梭框勾选', '面向不熟悉规则语法、需要逐项确认迁移对象的用户，', '通过浏览、勾选源端对象并移入已选列表，直观看到迁移范围，无需先学习通配规则。'] },
                  { id: 'visual-rules', cells: ['白屏规则配置', '面向了解匹配逻辑、需要按命名规则批量选择对象的用户，', '通过表单配置匹配与排除条件，减少逐项勾选和在编辑器中手写规则的负担。'] },
                  { id: 'file-import', cells: ['文件导入', '面向已有迁移对象清单、需要批量复用配置的用户，', '通过上传包含源端与目标端映射关系的文件导入对象，减少重复选择与录入，降低遗漏和配置不一致的风险。'] },
                ],
              },

            },
            {
              id: 'rule-filter-component',
              hideTitle: true,
              title: '规则选择组件',
              paragraphs: ['除了选择数据库对象，迁移任务还需要进一步配置数据过滤条件。由此沉淀规则选择组件，将字段、运算符与取值组织为可视化条件，支持“且 / 或”逻辑切换与条件分组，便于表达复杂筛选规则。'],
              imagesDisclosure: '规则选择组件',
              images: [{ src: '/images/databaseops-rule-filter-component.png', caption: '数据过滤：条件组合、规则嵌套与交互规范' }],
            },
          ],
          images: [],
        },
        {
          id: 'outcomes',
          title: '验证结果',
          paragraphs: [[{ text: '通过' }, { text: '原型', href: DATABASE_OPS_PROTOTYPE_URL }, { text: '用户测试验证迁移创建流程，并通过数据埋点观察上线后的任务完成情况。' }]],
          subsections: [
            {
              id: 'post-release-measurement',
              hideTitle: true,
              title: '验证结果',
              paragraphs: [],
              listItems: [
                [{ text: '任务完成率由 16.8% 提升至 ' }, { text: '75%', bold: true }, { text: '。' }],
                '任务耗时受其他因素影响，未达到预期目标；目标用户对对象选择交互给予正向反馈。',
              ],
            },
          ],
          images: [],
        },
      ],
      gallery: [],
    },
  },
  datadevelop: {
    zh: {
      tags: ['开发者工具', '设计体系', 'B 端体验'],
      paragraphs: [
        '数据开发工具涵盖 SQL 编辑器、任务流编辑器和仪表盘编辑器，帮助用户完成数据查询、任务编排与可视化分析。随着功能增加，不同编辑器的操作体验不一致、复杂任务学习成本高等问题逐渐突显。 希望通过编辑器核心交互持续的优化和智能辅助，提升操作效率和满意度。',
      ],
      responsibilities: {
        intro: '我作为体验设计师主要负责：',
        items: [
          {
            title: '体验诊断与策略制定',
            body:
              '通过多轮开发者可用性测试与深度访谈，精准识别数据表格操作、暗黑模式适配、任务流编排等核心体验短板，制定以「提升开发效率与平台粘性」为目标的重构路线图。',
          },
          {
            title: '设计标准化与方案实施',
            body:
              '主导编辑器体验的标准化重构，统一全局布局与交互模式，深度优化数据表、任务流、仪表盘等核心模块的交互设计，并完成专业级暗黑模式的体系化搭建。',
          },
          {
            title: '数据验证与持续迭代',
            body:
              '结合用户反馈、可用性测试、埋点数据及 AI 洞察分析，形成设计验证闭环，确保持续提升工具的专业性与易用性。',
          },
        ],
      },
      afterResponsibilities: [
        '产品矩阵的用户满意度从 4.7 分提升至 6.2 分（满分 7 分），产品用户规模翻倍。',
      ],
      gallery: [
        { src: '/images/datadevelop-sql-editor.jpg', caption: 'SQL 编辑器布局' },
        { src: '/images/datadevelop-table-spec.jpg', caption: '数据表格重构交互细节' },
        { src: '/images/datadevelop-workflow.jpg', caption: '任务流编辑器画布细节' },
        { src: '/images/datadevelop-darkmode.jpg', caption: '暗黑模式' },
      ],
    },
  },
  agentops: {
  "zh": {
    "tags": [
      "Agent 可观测",
      "产品孵化",
      "AI 交互设计"
    ],
    "overviewFacts": [
      {
        "label": "目标用户",
        "value": "内部参与 Agent 排查的\n研发与平台人员"
      },
      {
        "label": "主要职责",
        "value": "能力规划、需求拆解\n回放交互设计"
      },
      {
        "label": "设计挑战",
        "value": "让复杂执行过程易于理解\n同时保留排查所需细节"
      }
    ],
    "demoUrl": "https://aiops-phi.vercel.app/",
    "paragraphs": [],
    "showCover": false,
    "sections": [
      {
        "id": "project-origin",
        "title": "项目背景",
        "paragraphs": [
          "项目起源于 Data Agent 客户 POC 中的排查困难：Agent 执行异常后，仅凭最终回答难以判断原因。早期接入 OpenObserve 查看技术记录，但仍需手动串联信息，才能还原执行经过。",
          "随着多个内部 AI 应用出现类似需求，项目逐步扩展为跨应用的 Agent 可观测产品，支持从异常结果回溯执行过程、核查问题依据。"
        ],
        "images": [],
        "legacyIds": [
          "openobserve-learning",
          "shared-product-need",
          "product-preview",
          "project-gallery"
        ]
      },
      {
        "id": "decision-investigation-path",
        "title": "定位执行",
        "paragraphs": [
          "以“生成销售日报并定位退款波动”这一示例任务为例，任务未能完成最新数据查询，最终返回了上一周期摘要。排查从拓扑中的应用与 Agent 关系入手，先确定排查对象，再进入具体执行记录（Trace）。"
        ],
        "images": [],
        "subsections": [
          {
            "id": "design-decisions",
            "title": "设计取舍",
            "hideTitle": true,
            "layout": "text-image",
            "paragraphs": [
              [
                {
                  "text": "先看关系，缩小范围：",
                  "bold": true
                },
                {
                  "text": "拓扑展示应用、Agent 与模型、工具等节点的关联。选中 Agent 后突出相关节点，帮助用户聚焦排查对象，减少在无关信息之间切换。"
                }
              ],
              [
                {
                  "text": "从运行概况进入具体执行：",
                  "bold": true
                },
                {
                  "text": "节点详情集中展示调用、延时与异常 Trace，并提供追踪和日志入口。用户先观察运行情况，再核查具体记录；拓扑关系用于导航，异常原因仍需结合执行详情判断。"
                }
              ]
            ],
            "images": [
              {
                "src": "/images/agentops-topology.jpg",
                "hideCaption": true,
                "caption": "拓扑中的 Agent 节点详情展示调用、延时与异常 Trace，衔接追踪和日志核查。"
              }
            ]
          }
        ]
      },
      {
        "id": "decision-execution-structure",
        "title": "理解过程",
        "paragraphs": [
          "进入这条执行后，可以看到日报规划、SQL 生成、查询、重试和降级摘要等步骤。每个步骤对应一条 Span 记录。此时需要回答的是：失败发生在什么位置，前后还执行了什么？"
        ],
        "images": [],
        "subsections": [
          {
            "id": "design-decisions",
            "title": "设计取舍",
            "hideTitle": true,
            "layout": "text-image",
            "paragraphs": [
              [
                {
                  "text": "结构与耗时放在一起：",
                  "bold": true
                },
                {
                  "text": "默认 Trace 图将步骤树与时间轴并列，用层级说明调用关系，用时间条说明先后与耗时。用户可以沿着同一条记录，在整体过程和具体步骤之间切换。"
                }
              ],
              [
                {
                  "text": "完整信息与阅读负担之间的取舍：",
                  "bold": true
                },
                {
                  "text": "保留展开收起、展示层级和搜索入口，帮助用户控制关注范围；火焰图与拓扑图作为其他观察方式。当前界面仍有较多底层技术节点，如何让任务主线更突出，是需要继续验证的问题。"
                }
              ]
            ],
            "images": [
              {
                "src": "/images/agentops-execution-trace.jpg",
                "hideCaption": true,
                "caption": "Demo · Span 树、时间轴与展示层级，共同呈现一次执行内部的步骤关系。"
              }
            ]
          }
        ]
      },
      {
        "id": "decision-failure-context",
        "title": "核查异常",
        "paragraphs": [
          "在示例中选中失败的 sql.query 步骤，右侧展开详情，执行树和时间轴仍然保留。用户可以查看错误、属性、事件、链接，并进入相关日志。"
        ],
        "images": [],
        "subsections": [
          {
            "id": "design-decisions",
            "title": "设计取舍",
            "hideTitle": true,
            "layout": "text-image",
            "paragraphs": [
              [
                {
                  "text": "证据不脱离执行过程：",
                  "bold": true
                },
                {
                  "text": "详情在侧面展开，让用户查看局部依据时仍能对照前后步骤，避免离开链路后失去排查位置。"
                }
              ],
              [
                {
                  "text": "同时检查失败与后续影响：",
                  "bold": true
                },
                {
                  "text": "查询后的重试、快照读取与降级摘要仍在同一链路中。用户需要确认哪些步骤失败、后续使用了什么数据，以及最终返回了什么，不能仅凭“有输出”判断任务成功。"
                }
              ]
            ],
            "images": [
              {
                "src": "/images/agentops-error-inspector.jpg",
                "hideCaption": true,
                "caption": "Demo · 在执行上下文中查看错误详情，关联查询异常、重试与后续降级路径。"
              }
            ]
          }
        ]
      },
      {
        "id": "validation-and-datapilot",
        "title": "当前阶段",
        "paragraphs": [
          "目前已有产品 MVP，覆盖应用与 Agent 概览、执行筛选、步骤时间轴和详情核查，待内部验证。"
        ],
        "images": [],
        "legacyIds": [
          "customer-replay"
        ]
      }
    ],
    "gallery": []
  }
},
}

export function getProjectDetail(slug: string, locale: Locale): ProjectDetailBlock | undefined {
  if (slug === 'aidesignsystem') return getDesignEngineeringContent(locale)
  if (slug === 'dataagent') {
    const content = getDataPilotContent(locale)
    return {
      tags: content.tags,
      paragraphs: content.paragraphs,
      externalUrl: content.demoUrl,
      gallery: Object.values(content.parts).flatMap((part) => part.sections.flatMap((section) => section.images)),
    }
  }
  const row = details[slug]
  if (!row) return undefined
  return row.zh
}
