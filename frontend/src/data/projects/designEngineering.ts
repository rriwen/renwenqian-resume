import type { Locale } from '../../i18n/translations'
import type { ProjectDetailBlock } from '../projectDetails'

const DESIGN_PRACTICE_URL = 'https://design-md-reader-4x.vercel.app/'

/** 设计工程案例的页面、锚点与聊天语料共用此内容。 */
export function getDesignEngineeringContent(_locale: Locale): ProjectDetailBlock {

  return {
    showCover: false,
    tags: ['AI 设计工作流', '组件化设计', '设计与代码协同'],
    paragraphs: [
      '这项实践始于一个问题：AI 时代，设计师如何持续介入产品研发？我以设计工程化为基础，将设计变量、组件语义、设计与代码的映射，以及项目规则沉淀为可复用的资产，并通过实际代码交付探索这条路径。首先要解决的是，让 AI 稳定生成符合设计要求的页面。',
    ],
    sections: [
      {
        id: 'context',
        title: '背景与目标',
        paragraphs: [
          '在探索 AI 辅助产品研发时，设计师和研发遇到了共同问题：AI 生成的界面与前端代码难以遵循统一的设计标准，需要反复调试。随着多个 AI 产品并行迭代，组件选择、状态处理和页面规则都需要有可复用的依据，避免在每次任务中重新说明和纠偏。',
          '这里的稳定，是指多次生成、修改或切换页面后，仍能遵循一致的视觉、组件和交互规则。我先明确可复用的资产和约束，再推进设计与代码衔接、跨项目复用。设计师参与规则制定、实现判断和代码交付，并在具体产品中检验这些规则是否可用。',
        ],
        images: [],
      },
      {
        id: 'architecture',
        title: '全局架构',
        paragraphs: [
          '体系从上到下分为设计资产、规则映射、代码交付、项目应用四层。从统一变量与组件出发，通过使用规则和设计映射指导实现，最终应用于不同产品。',
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
          '我先将基础视觉规范和共性界面能力整理为可复用的资产：Design Token 统一基础变量，Agent Ready 组件库承载组件实现与使用语义，为后续生成提供一致的设计依据。',
        ],
        subsections: [
          {
            id: 'design-tokens',
            title: 'Design Token',
            paragraphs: [
              '统一颜色、字体、间距、圆角等基础变量，并定义命名、分层与使用规则。变量不仅记录具体数值，也表达使用意图，让设计和实现能够围绕同一套语义讨论，减少每次生成页面时重新定义基础样式的空间。',
              '在 AI 数据产品的重构实践中，以基础值、语义角色和组件使用三层组织 Token：组件引用背景、边框、文字等语义，避免直接依赖某个色值。使用 OKLCH 建立低饱和色阶，以 rem 组织阅读与间距尺度，边框等固定细节保留 px；一致性来自有限、共享的尺度，而不只是单位转换。颜色调整后仍需检查对比度与状态辨识。',
            ],
            images: [],
          },
          {
            id: 'agent-ready-components',
            title: 'Agent Ready 组件库',
            paragraphs: [
              '成熟组件库本身就包含属性、状态和使用示例。这里的 Agent Ready 强调这些知识如何进入 AI 辅助开发流程：让 Agent 理解组件解决什么问题、在当前任务中如何选择，以及如何结合项目约束复用现有实现。它是本项目的建设目标，需要由具体资料与使用过程来支撑。',
              '从 AI 产品的共性场景中抽象 Prompt 输入、计划、思维链等组件。组件资料同时描述用途、属性、状态、适用场景和代码示例，让 Agent 获得选择与复用依据，也让设计师和研发能够检查使用是否符合预期。',
              '计划与思维链组件体现了这类资产的重点：除视觉外，还需要说明执行过程中的信息组织与状态表达。组件的价值因此延伸到交互模式，让后续页面能够复用已经整理的设计判断。',
              [
                { text: '行业参照：' },
                { text: 'Storybook manifests', href: 'https://storybook.js.org/docs/ai/manifests' },
                { text: '将已有组件资料组织成 Agent 可读取的结构化上下文；' },
                { text: 'shadcn MCP', href: 'https://ui.shadcn.com/docs/mcp' },
                { text: '提供组件查询与安装入口。它们展示了组件知识进入任务流程的不同方式。本项目侧重组件语义与使用资料，并通过 Skill、DESIGN.md 和 Code Connect 将这些依据连接到实际开发。' },
              ],
              [
                { text: '相关资产见' },
                { text: '设计系统站点', href: 'http://originnext.oceanbase-ai.odcfront.alipay.net/' },
                { text: '。' },
              ],
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
          '为了让设计资产进入 AI 辅助研发流程，我进一步明确设计组件与代码的对应关系、组件的使用方法，以及当前项目需要遵守的规则。Code Connect、组件库 Skill 和 DESIGN.md 分别承接这三类信息，让设计师、研发与 Agent 在实现时使用同一套依据。',
        ],
        subsections: [
          {
            id: 'code-connect',
            title: 'Code Connect：设计与代码的对应关系',
            paragraphs: [
              '我梳理 Figma 组件、变体与交互状态，建立它们和代码组件的映射。关键工作是明确设计中的选择对应哪些组件和属性，使开发与 AI 辅助实现有可引用的代码依据，减少仅凭外观推测组件用法。',
              [
                { text: '行业参照：' },
                { text: 'Figma Code Connect', href: 'https://help.figma.com/hc/en-us/articles/42495296821911-Code-Connect-and-MCP' },
                { text: '将设计组件与实际代码用法关联。这里关注映射关系的建设，页面布局和业务交互仍由项目规则与实现工作共同处理。' },
              ],
            ],
            images: [],
          },
          {
            id: 'component-skill',
            title: '组件库 Skill：按规范使用组件',
            paragraphs: [
              '针对生成过程中反复调试的问题，我将前端组件与设计规范沉淀到 Skill 中，整理工程安装、组件属性、调用方式、代码示例与交互约束。设计师和研发在 AI 辅助开发时，可以引用这些资料，让 Agent 依据已有规范选择和组合组件。',
            ],
            images: [],
          },
          {
            id: 'project-design-rules',
            title: 'DESIGN.md：把设计判断写成共同规则',
            paragraphs: [
              '前期通过 AI 快速搭建页面后，大标题、卡片嵌套与组件状态逐渐在不同模块中分化。我将 DESIGN.md 按“为什么这样设计、界面如何表现、怎样实现、如何检查”组织，为设计师、研发与 Coding Agent 提供共同依据。Token 管数值，文档说明使用场景、取舍与例外。',
              '视觉规则从数据工作台的任务出发：用低饱和配色、灰阶与边界组织层级，列表和表格优先服务数据扫描，主面板保留阅读留白；明确禁止装饰性渐变、多层卡片等不适合当前任务的模式，减少 AI 根据通用样式自由发挥。',
              '交互规则细化到组件类型与状态：菜单项和表格行用浅底反馈悬停，输入控件用边界反馈可编辑位置，无边框图标按钮避免额外增加表面；聚焦、选中、禁用、错误和加载分别说明。状态变化不改变布局占位，也不依赖悬停作为唯一提示。',
              '规则同时标明 Token、基础样式与组件的实现位置，供开发和检查定位。Skill 负责组件调用方法，DESIGN.md 负责项目中的组合与约束；开发任务仍需明确引用文档，文件本身不会自动保证 Agent 遵守。',
              [
                { text: '完整实践见' },
                { text: '《什么是 DESIGN.md》', href: DESIGN_PRACTICE_URL },
                { text: '。文章中的 Google 与 Vercel 内容属于方法参照，项目规则取自实际产品约束；任务到版式的决策规则、冲突消解与更完整的自动检查仍是后续完善方向。' },
              ],
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
          '我将 Skill 与组件库应用于Data Agent、记忆插件及官网开发，参与页面与组件代码交付。在记忆插件项目中，独立完成产品官网与记忆管理后台的视觉设计、内容规划和前端代码，使设计工作延伸到可运行的产品实现。',
        ],
        subsections: [
          {
            id: 'code-delivery',
            title: '从规范到代码交付',
            paragraphs: [
              '在这些项目中，设计工作延伸到实现过程：以组件库和规则作为 AI 辅助实现的依据，参与组件选择、页面组织、代码实现与结果检查。设计师既建设可复用的基础，也在具体交付中判断生成结果是否符合设计要求。',
            ],
            images: [],
          },
          {
            id: 'datapilot-design-collaboration',
            title: 'Data Agent：让规则进入研发协作',
            paragraphs: [
              'Data Agent 的数据、应用与对话模块需要同时迭代。我以 DESIGN.md 约束工作台布局、组件状态和样式复用，将前端设计研发中的判断沉淀为后续任务的输入，减少每次新增页面时重新解释规范。',
              '协作围绕具体实现展开：我负责设计方向、组件反馈与界面检查，结合研发约束确定复用方式；研发与 Coding Agent 按规则引用 Token 和已有组件。检查发现偏差时，区分局部实现问题与规则缺失，分别修正代码或补充约束。',
              '检查同时覆盖代码和实际界面：代码侧关注 Token 引用与结构约束，页面侧关注层级、信息密度、交互状态及窄屏表现。已有结构检查不能替代视觉判断，协作收益也仍需通过真实修改记录与后续使用验证。',
              [
                { text: '规则组织与技术选择详见' },
                { text: 'DESIGN.md 实践文章', href: DESIGN_PRACTICE_URL },
                { text: '。' },
              ],
            ],
            comparisonPlaceholder: {
              before: { title: '待补：界面偏差与原实现', description: '选一个真实的菜单、输入框或图标按钮，展示状态不一致的界面和对应实现，说明给使用与维护带来的问题。' },
              after: { title: '待补：规则与实现修正', description: '提供对应 DESIGN.md 规则、Token 或组件修改，以及页面核查结果；如有协作记录或结构检查，附同一次修改的材料，不编造效率指标。' },
            },
            images: [],
          },
          {
            id: 'further-validation',
            title: '后续验证与规则迭代',
            paragraphs: [
              '这些应用构成了当前的实践基础。后续验证首先关注生成是否稳定：同类任务能否选对组件、遵守页面规则、完整处理状态；其次观察设计与代码衔接、跨项目复用，以及人工修改的原因与范围。需要持续将具体问题整理回组件资料和项目规则，判断哪些约束真正帮助了交付。',
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
