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
export type ProjectDetailParagraphRun = { text: string; bold?: boolean; tone?: 'danger'; href?: string; definition?: string; definitionTitle?: string }

/** 普通字符串整段，或由片段拼接（用于段内局部强调） */
export type ProjectDetailParagraph = string | ProjectDetailParagraphRun[]

export type ProjectDetailTable = {
  mergeDescriptions?: boolean
  columns: string[]
  /** null 表示被前一行的 rowSpan 覆盖。 */
  rows: { id: string; decision?: 'selected' | 'excluded'; illustration?: ProjectGalleryItem; cells: (string | { text: string; rowSpan: number; groups?: { title: string; items: string[] }[] } | null)[] }[]
}

/** 从上到下展示设计基建、交付与应用。 */
export type ProjectArchitectureData = {
  title: string
  sharedPractices?: string
  feedback?: string
  layers: {
    id: string
    title: string
    description?: string
    nodes: { id: string; title: string; description?: string; status?: 'existing' | 'planned'; span?: 'full' }[]
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

export type ProjectWorkflowData = {
  limitation?: { title: string; body: string }
  title: string
  steps: { title: string; body: string; branch?: { title: string; body: string } }[]
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
  workflow?: ProjectWorkflowData
  /** 章节内的小标题、正文与配图保持绑定，页面和聊天共用。 */
  subsections?: {
    id: string
    title: string
    hideTitle?: boolean
    paragraphs: ProjectDetailParagraph[]
    listItems?: ProjectDetailParagraph[]
    closingParagraphs?: ProjectDetailParagraph[]
    /** 待补证据清单，仅供页面展示，不进入聊天事实与媒体清单。 */
    evidenceRequests?: string[]
    /** 截图占位说明，仅供页面展示，不进入聊天事实与媒体清单。 */
    screenshotPlaceholder?: string
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
    imagesLayout?: 'row' | 'carousel'
    /** 原始过程材料默认折叠，使用此文案作为展开入口。 */
    imagesDisclosure?: string
    /** 桌面端左文右图，列宽为 2:1；窄屏按内容顺序堆叠。 */
    layout?: 'text-image'
  }[]
  images: ProjectGalleryItem[]
  imagesDisclosure?: string
}

export type ProjectDetailBlock = {
  hideOverviewMedia?: boolean
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
      "tags": [
        "产品设计",
        "AI 交互",
        "复杂流程设计"
      ],
      "paragraphs": [],
      "gallery": [],
      "sections": [
        {
          "id": "context",
          "title": "项目背景",
          "paragraphs": [
            "Text2SQL 面向在编辑器中编写和修改 SQL 的数据库开发者，通过自然语言辅助生成、纠错、改写与格式化，目标是降低将查询需求转成代码、再反复调整的成本。",
            "我主导产品设计，并通过 Dify 搭建工作流，完成技术实现探索。设计将 AI 融入原有编辑流程，以光标和选区明确操作对象，串联需求表达、生成控制与结果审阅。"
          ],
          "images": []
        },
        {
          id: 'workflow-exploration',
          title: '工作流探索',
          paragraphs: [
            '尝试用 Dify 搭建 Text2SQL Agent 工作流，探索从自然语言需求到 SQL 生成的实现路径。',
          ],
          workflow: {
            title: '单次请求的 SQL 生成流程',
            limitation: { title: '主要局限：', body: '缺少多轮澄清与连续修改。信息不足时，用户需要补全需求后重新输入；对结果不满意时，也无法沿着当前回答继续调整，只能重新发起请求。' },
            steps: [
              { title: '输入需求', body: '输入自然语言，发起一次 SQL 生成请求。' },
              { title: '信息抽取', body: '提取目标字段、条件字段、表名与问句骨架。',
                branch: { title: '需要澄清 → 重新输入', body: '本版本不支持多轮澄清。信息不足时，用户需补全需求并重新提交。' } },
              { title: '表与样例召回', body: '用字段和表名检索相关表 DDL，用问句骨架检索相似 SQL 样例。' },
              { title: '组装 Prompt', body: '将召回的表 DDL、样例及 SQL 方言要求填入提示词模板。' },
              { title: '生成并返回 SQL', body: '将原始需求与组装后的提示词交给模型，返回生成的 SQL。' },
              { title: '接受或不接受', body: '用户决定是否采用结果，无法继续追问修改本次回答。' },
            ],
          },
          images: [],
        },
        {
          "id": "contextual-entry",
          "title": "交互设计策略",
          "legacyIds": [
            "task-commands",
            "generation-feedback",
            "result-review"
          ],
          "paragraphs": [
            "围绕一次自然语言辅助编辑，将设计串成三个环节：问答前就近编辑、明确意图，问答中控制生成过程，问答后审阅改动。"
          ],
          "subsections": [
            {
              "id": "before",
              "imagesLayout": "carousel",
              "title": "问答前：明确对象与意图",
              "layout": "text-image",
              "paragraphs": [],
              "listItems": [
                [
                  {
                    "text": "就近编辑：",
                    "bold": true
                  },
                  {
                    "text": "在光标或选区上方唤起输入框，便于对照代码描述需求。为减少空间占用，输入框按需展开，支持关闭或 Esc 退出，随后继续编辑。"
                  }
                ],
                [
                  {
                    "text": "明确意图：",
                    "bold": true
                  },
                  {
                    "text": "用生成、纠错、改写、格式化指令提示能力范围，并以标签显示当前任务。分类增加了选择步骤，但能帮助用户判断可以做什么；具体要求仍用自然语言自由表达。"
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
                },
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
            },
            {
              "id": "during",
              "title": "问答中：让生成过程可控",
              "layout": "text-image",
              "paragraphs": [],
              "listItems": [
                [
                  {
                    "text": "生成控制：",
                    "bold": true
                  },
                  {
                    "text": "生成时显示处理状态，将发送按钮切换为终止，终止后回到输入状态。复用位置保持操作集中，同时更新按钮与状态提示，避免同一位置的动作变化造成混淆。"
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
            },
            {
              "id": "after",
              "title": "问答后：检查改动再采用",
              "layout": "text-image",
              "paragraphs": [],
              "listItems": [
                [
                  {
                    "text": "结果审阅：",
                    "bold": true
                  },
                  {
                    "text": "通过差异视图区分新增、删除与未变代码，由用户接受或忽略。多一步确认换来改动生效前的检查机会，优先保留修改控制；差异是否易于理解仍需验证。"
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
              ]
            }
          ],
          "images": []
        }
      ],
      "hideOverviewMedia": false
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
    "paragraphs": [],
    "gallery": [],
    "sections": [
      {
        "id": "context",
        "legacyIds": [
          "users-and-scope",
          "design-principles"
        ],
        "title": "项目背景",
        "paragraphs": [
          "数据开发与分析往往包含多个处理步骤，需要按照依赖关系协同执行。任务流编辑器通过节点与连线组织任务，让用户直观地创建、连接和配置流程。",
          "设计围绕画布操作、节点布局与连线反馈展开，在自由编排、操作习惯和首版实现成本之间做取舍，形成基础交互方案。"
        ],
        "images": []
      },
      {
        "id": "design-improvements",
        "legacyIds": [
          "canvas",
          "layout",
          "nodes-and-connections"
        ],
        "title": "设计方案",
        "paragraphs": [],
        "images": [],
        "subsections": [
          {
            "id": "canvas",
            "title": "画布操作",
            "paragraphs": [
              "采用空白区域拖拽移动画布，提供按钮、滚轮、触控板与快捷键缩放入口，兼顾完整流程浏览与局部节点编辑。缩放范围设为 50%–200%，平衡流程概览与文字可读性。"
            ],
            "images": [],
            "table": {
              "columns": [
                "操作方式",
                "说明"
              ],
              "rows": [
                {
                  "id": "buttons",
                  "cells": [
                    "放大缩小按钮",
                    "点击按钮，按固定比例缩放画布。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "放大缩小按钮示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 452,
                      "y": 2496,
                      "width": 175,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "wheel",
                  "cells": [
                    "滚轮滑动",
                    "通过鼠标滚轮缩放，需避免与画布移动操作冲突。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "滚轮滑动示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 452,
                      "y": 2575,
                      "width": 175,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "trackpad",
                  "cells": [
                    "触控板双指",
                    "沿用 Mac 软件常见的双指缩放手势。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "触控板双指示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 452,
                      "y": 2654,
                      "width": 175,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "shortcuts",
                  "cells": [
                    "快捷键",
                    "符合开发者的键盘操作习惯；方案增加 Shift 修饰键，与浏览器缩放快捷键区分。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "快捷键示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 452,
                      "y": 2733,
                      "width": 175,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                }
              ],
              "mergeDescriptions": true
            }
          },
          {
            "id": "layout",
            "title": "节点布局",
            "paragraphs": [
              "采用自由布局，让用户按任务关系放置节点；同时提供自动布局，整理分散的流程结构，在编排自由度与阅读清晰度之间取得平衡。"
            ],
            "images": [],
            "table": {
              "columns": [
                "布局方式",
                "说明与取舍"
              ],
              "rows": [
                {
                  "id": "free",
                  "cells": [
                    "自由布局",
                    "节点可自由放置，限制少、实现成本较低，作为首版方案。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "自由布局示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 454,
                      "y": 3006,
                      "width": 132,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  },
                  "decision": "selected"
                },
                {
                  "id": "automatic",
                  "cells": [
                    "自动布局",
                    "将分散节点按任务依赖关系自动整理，让流程结构更清晰，作为自由布局的补充。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "自动布局：整理分散节点",
                    "sourceRegion": {
                      "x": 271,
                      "y": 3330,
                      "width": 330,
                      "height": 120,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    },
                    "hideCaption": true
                  },
                  "decision": "selected"
                },
                {
                  "id": "grid",
                  "cells": [
                    "网格布局",
                    "按网格比例排布，移动时对齐网格，视觉更整齐，但会限制布局灵活度。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "网格布局示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 454,
                      "y": 3084,
                      "width": 132,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  },
                  "decision": "excluded"
                },
                {
                  "id": "fixed",
                  "cells": [
                    "固定布局",
                    "适用于流程结构固定的场景，难以覆盖任务流多样的依赖关系，首版不采用。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "固定布局示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 454,
                      "y": 3162,
                      "width": 132,
                      "height": 65,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  },
                  "decision": "excluded"
                }
              ],
              "mergeDescriptions": true
            }
          },
          {
            "id": "nodes-and-connections",
            "title": "节点与连线反馈",
            "paragraphs": [
              "区分节点的默认、悬停与选中状态，明确配置入口。连线以上进下出表达依赖关系，并定义拖拽、吸附、选中与重新连接的反馈，让当前操作对象和连接过程保持清晰。"
            ],
            "images": [],
            "table": {
              "columns": [
                "交互状态",
                "反馈规则"
              ],
              "rows": [
                {
                  "id": "port-default",
                  "cells": [
                    "连接桩默认态",
                    "节点上下显示连接桩，下方提供快速添加下游节点的按钮。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "连接桩默认态示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 322,
                      "y": 4675,
                      "width": 279,
                      "height": 32,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "port-hover",
                  "cells": [
                    "连接桩悬停态",
                    "连接桩高亮，提示可发起连线。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "连接桩悬停态示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 322,
                      "y": 4732,
                      "width": 279,
                      "height": 32,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "port-selected",
                  "cells": [
                    "连接桩选中态",
                    "按住连接桩，开始建立连接。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "连接桩选中态示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 343,
                      "y": 4789,
                      "width": 236,
                      "height": 32,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "drag",
                  "cells": [
                    "拖拽",
                    "拖拽过程中显示连接虚线，反馈当前连接方向。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "拖拽示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 343,
                      "y": 4846,
                      "width": 236,
                      "height": 71,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "snap",
                  "cells": [
                    "吸附",
                    "靠近上游或下游的连接桩时吸附，提示可连接目标。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "吸附示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 343,
                      "y": 4942,
                      "width": 236,
                      "height": 94,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "line-selected",
                  "cells": [
                    "连接线选中态",
                    "连接线突出显示，明确当前操作对象。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "连接线选中态示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 343,
                      "y": 5061,
                      "width": 236,
                      "height": 82,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "line-default",
                  "cells": [
                    "连接线默认态",
                    "使用弱化样式展示已有依赖关系。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "连接线默认态示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 343,
                      "y": 5169,
                      "width": 236,
                      "height": 82,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                },
                {
                  "id": "reconnect",
                  "cells": [
                    "重新连接",
                    "拖拽连接桩调整已有关系，过程中连接线变为虚线。"
                  ],
                  "illustration": {
                    "src": "/images/workflow-editor-design-article.png",
                    "caption": "重新连接示意",
                    "hideCaption": true,
                    "sourceRegion": {
                      "x": 343,
                      "y": 5257,
                      "width": 236,
                      "height": 82,
                      "sourceWidth": 892,
                      "sourceHeight": 6000
                    }
                  }
                }
              ],
              "mergeDescriptions": true
            }
          }
        ]
      },
      {
        "id": "delivery-and-next",
        "legacyIds": [
          "design-notes"
        ],
        "title": "项目小结",
        "paragraphs": [
          "项目形成了任务流编辑器的初版交互方案，覆盖画布移动与缩放、节点布局及连线操作。"
        ],
        "images": []
      }
    ]
  }
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
      tags: ['开发者工具', '交互设计', '体验优化'],
      paragraphs: [],
      sections: [
        {
          id: 'context',
          legacyIds: ['responsibilities'],
          title: '项目背景',
          paragraphs: [
            '随着功能持续增加，SQL 编辑器的布局与操作方式需要进一步梳理。结合开发者访谈和可用性测试，聚焦高频操作中的体验问题，持续优化 SQL 编写、查询与结果查看体验。',
            '我负责体验问题梳理、交互与界面设计、规范整理，并配合研发推进方案落地。',
          ],
          images: [],
        },
        {
          id: 'design-improvements',
          legacyIds: ['project-gallery'],
          title: '设计优化',
          paragraphs: [],
          subsections: [
            {
              id: 'editor-layout',
              title: '编辑器布局',
              paragraphs: ['梳理功能入口与内容区域，明确 SQL 编辑、执行操作和查询结果之间的信息层级，让日常开发任务有清晰的操作路径。'],
              images: [{ src: '/images/datadevelop-sql-editor.jpg', caption: 'SQL 编辑器布局' }],
            },
            {
              id: 'data-table',
              title: '数据表格交互',
              paragraphs: ['围绕查询结果的查看与数据操作，整理表格的交互规则，统一操作方式、状态与反馈，减少不同场景下的理解成本。'],
              images: [{ src: '/images/datadevelop-table-spec.jpg', caption: '数据表格重构交互细节' }],
            },
            {
              id: 'dark-mode',
              title: '暗黑模式',
              paragraphs: ['统一编辑器与数据表格的深色视觉规则，梳理背景、文字与状态色的层级，关注代码、数据和操作反馈的可读性。'],
              images: [{ src: '/images/datadevelop-darkmode.jpg', caption: '暗黑模式' }],
            },
            {
              id: 'intelligent-assistance',
              title: '智能辅助',
              paragraphs: [
                '将 AI 辅助融入 SQL 编辑场景，通过自然语言表达需求，辅助 SQL 编写与修改。设计围绕就近发起、任务指令和生成结果的处理展开，具体方案在独立案例中介绍。',
                [{ text: '查看 Text2SQL 项目', href: '/project/text2sql' }],
              ],
            },
          ],
          images: [],
        },
        {
          id: 'project-summary',
          title: '项目小结',
          paragraphs: ['围绕编辑器布局、数据表格与暗黑模式形成设计方案与交互规范，并结合用户反馈持续迭代；智能辅助作为 SQL 开发体验的延伸，在 Text2SQL 项目中进一步展开。'],
          images: [],
        },
      ],
      gallery: [],
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
