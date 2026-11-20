import type { Locale } from '../../i18n/translations'
import type { ProjectDetailBlock } from '../projectDetails'

const DESIGN_PRACTICE_URL = 'https://design-md-reader-4x.vercel.app/'

/** 正文供页面与聊天共用；evidenceRequests 仅为页面上的待补材料说明。 */
export function getDesignEngineeringContent(_locale: Locale): ProjectDetailBlock {
  return {
    showCover: false,
    tags: ['AI 设计工作流', '组件化设计', '设计与代码协同'],
    paragraphs: [
      '这套方法将设计资产、规则映射、代码交付与项目应用串联起来，让设计判断进入 AI 辅助研发，并在实际使用中持续完善。',
    ],
    sections: [
      {
        id: 'context',
        legacyIds: ['architecture'],
        title: '方法概览',
        paragraphs: [
          '设计工程的核心是把视觉与交互判断整理为可复用的资产和规则，再连接到代码实现。AI 辅助开发中，组件选择、状态反馈和页面组织都需要明确依据。',
          '设计资产提供基础，规则映射说明如何使用，代码交付落实到界面，项目应用检验适用范围并反馈问题。我的实践围绕这四层展开。',
          '目标是让多次生成与修改遵循一致的设计规则；稳定性与效率收益仍待验证。',
        ],
        architecture: {
          title: '以设计基建支撑 AI 辅助研发',
          layers: [
            {
              id: 'assets',
              title: '设计资产',
              description: '可复用的基础',
              nodes: [
                { id: 'tokens', title: 'Design Token', description: '基础变量与使用规则' },
                { id: 'agent-ready', title: 'Agent Ready 组件库', description: '供 Agent 理解、选择与复用' },
              ],
            },
            {
              id: 'guidance',
              title: '规则映射',
              description: 'Agent 使用依据',
              nodes: [
                { id: 'code-connect', title: 'Code Connect', description: 'Figma 与代码组件映射' },
                { id: 'component-skill', title: '组件库 Skill', description: '组件调用与设计规范' },
                { id: 'design-md', title: 'DESIGN.md', description: '项目设计与交互约束' },
              ],
            },
            {
              id: 'delivery',
              title: '代码交付',
              nodes: [
                { id: 'ai-implementation', title: 'AI 辅助实现', description: '依据规范选择、组合组件' },
                { id: 'designer-delivery', title: '设计师参与交付', description: '设计判断、代码实现与检查' },
              ],
            },
            {
              id: 'applications',
              title: '项目应用',
              nodes: [
                { id: 'analytics', title: 'Data Agent' },
                { id: 'memory', title: '记忆插件' },
                { id: 'websites', title: '产品官网' },
              ],
            },
          ],
        },
        images: [],
      },
      {
        id: 'foundations',
        legacyIds: ['design-highlights', 'project-gallery'],
        title: '设计资产',
        paragraphs: [
          '我将基础视觉规范与共性交互整理为 Token 和组件资料，供后续实现复用。',
        ],
        subsections: [
          {
            id: 'design-tokens',
            title: 'Design Token：统一数值与使用语义',
            paragraphs: [
              '我按基础值、语义角色、组件使用三层组织 Token，让组件引用背景、边框、文字等语义，避免直接绑定色值。',
              '使用 OKLCH 建立色阶，以 rem 组织阅读与间距尺度，边框等细节保留 px；颜色调整后检查对比度和状态辨识。',
            ],
            evidenceRequests: [
              '请提供一组真实 Token：基础值、语义命名、组件引用与检查结果。',
            ],
            images: [],
          },
          {
            id: 'agent-ready-components',
            title: '组件语义：保留状态与使用判断',
            paragraphs: [
              '我整理 Prompt 输入、计划、思维链等组件的用途、属性、状态与代码示例，将执行过程的信息组织和状态表达沉淀为可复用判断。',
              'Agent Ready 是建设目标：让 Agent 找到、理解并复用组件。现有截图展示界面，实际读取与调用过程待补。',
              [
                { text: '相关资产见' },
                { text: '设计系统站点', href: 'http://originnext.oceanbase-ai.odcfront.alipay.net/' },
                { text: '。' },
              ],
            ],
            evidenceRequests: [
              '请提供计划组件或其他已有组件的状态定义、属性与调用示例。',
              '请提供一次 Agent 读取资料、调用组件及修正偏差的记录。',
            ],
            images: [
              { src: '/images/aidesignsystem-plan-component.jpg', caption: '计划组件：执行过程的信息组织与状态表达' },
              { src: '/images/aidesignsystem-chain-of-thought.jpg', caption: '思维链组件：过程信息的呈现方式' },
            ],
          },
        ],
        images: [],
      },
      {
        id: 'guidance',
        legacyIds: ['connections'],
        title: '规则映射',
        paragraphs: [
          '组件映射、调用方法与项目约束分别维护，开发时引用并检查。',
        ],
        subsections: [
          {
            id: 'code-connect',
            title: 'Code Connect：对应设计变体与代码属性',
            paragraphs: [
              '我梳理 Figma 组件、变体和状态与代码属性的对应关系，为实现提供依据；页面布局与业务交互仍需结合项目规则完成。',
            ],
            evidenceRequests: [
              '请提供真实组件的变体、属性与映射配置，注明完成梳理、已发布或已使用的阶段。',
            ],
            images: [],
          },
          {
            id: 'component-skill',
            title: '组件库 Skill：整理调用方法与约束',
            paragraphs: [
              '我将安装、属性、调用示例与交互约束整理为 Skill，用于 Data Agent、记忆插件及官网开发。',
            ],
            evidenceRequests: [
              '请提供 Skill 目录、一段代表性规则和使用记录，可与前文案例共用。',
            ],
            images: [],
          },
          {
            id: 'project-design-rules',
            title: 'DESIGN.md：记录项目中的判断与例外',
            paragraphs: [
              '我按设计原因、界面表现、实现位置和检查方式组织 DESIGN.md，记录项目中的组合规则与例外。Token 管数值，Skill 管调用，DESIGN.md 管项目约束。',
              '开发任务需明确引用文档，并检查偏差。规则冲突处理与更完整的自动检查仍待完善。',
              [
                { text: '规则组织与技术选择见' },
                { text: '《什么是 DESIGN.md》', href: DESIGN_PRACTICE_URL },
                { text: '。其中 Google 与 Vercel 的内容属于方法参照，不作为本项目的交付成果。' },
              ],
            ],
            images: [],
          },
        ],
        images: [],
      },
      {
        id: 'implementation',
        title: '代码交付',
        paragraphs: [
          '先明确任务与页面约束，再让 Agent 引用已有组件和规则完成实现。设计师参与组件选择、页面组织与结果检查，将设计判断落实到可运行界面。',
        ],
        subsections: [
          {
            id: 'implementation-review',
            title: '实现、检查与修正',
            paragraphs: [
              '代码侧检查组件与 Token 的使用，界面侧检查层级、状态、键盘操作和窄屏表现。发现问题后，修正实现或补充规则；自动检查不能替代视觉与交互判断。',
            ],
            evidenceRequests: [
              '请提供一次完整任务的输入、引用规则、代码或界面结果与检查记录，可复用下方项目材料。',
            ],
            images: [],
          },
        ],
        images: [],
      },
      {
        id: 'delivery',
        title: '项目应用',
        paragraphs: [
          '以下实践展示方法在不同场景中的应用：Data Agent 侧重规则协作，记忆插件侧重独立前端交付。',
        ],
        subsections: [
          {
            id: 'datapilot-design-collaboration',
            title: 'Data Agent：把界面偏差转化为共同规则',
            paragraphs: [
              '我用 DESIGN.md 整理数据、应用与对话模块的布局、组件状态和样式复用要求，供后续开发引用。',
              '我负责设计方向、组件反馈和界面检查，与研发确定复用方式。发现偏差后，分别修正局部代码或补充缺失规则。',
            ],
            listItems: [
              [{ text: '围绕任务组织界面。', bold: true }, { text: '列表与表格服务数据扫描，主面板保留阅读留白，用灰阶与边界组织层级，约束装饰性渐变和多层卡片。' }],
              [{ text: '区分控件的状态反馈。', bold: true }, { text: '菜单与表格行用浅底反馈，输入控件用边界提示；明确聚焦、选中、禁用、错误与加载，状态切换保持布局稳定。' }],
              [{ text: '同时检查代码与界面。', bold: true }, { text: '检查 Token 引用、结构、页面层级、状态与窄屏表现；自动检查之外保留人工判断。' }],
            ],
            closingParagraphs: [
              '具体修正过程待补充同一次任务的前后材料。',
            ],
            evidenceRequests: [
              '请提供一个真实界面偏差：所属模块、任务、修改前截图及影响。',
              '请提供同次修改的规则或代码、修改后截图、检查记录，并注明你与研发的分工。',
            ],
            images: [],
          },
          {
            id: 'code-delivery',
            title: '记忆插件：从视觉与内容规划到前端交付',
            paragraphs: [
              '在记忆插件项目中，我独立完成产品官网与记忆管理后台的视觉设计、内容规划和前端代码，使用 Skill 与组件库辅助实现，并检查结果。',
              '交付范围为官网与管理后台前端，具体版本与发布状态待补。',
            ],
            evidenceRequests: [
              '请提供官网、后台的真实截图或公开演示链接，注明版本与发布状态。',
              '请选一次前端交付，补充设计取舍、复用组件、代码片段与检查结果。',
            ],
            images: [],
          },
        ],
        images: [],
      },
    ],
    gallery: [],
  }
}
