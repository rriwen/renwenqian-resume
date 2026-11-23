import type { Locale } from '../../i18n/translations'
import type { ProjectDetailBlock } from '../projectDetails'


/** 正文与建设状态供页面和聊天共用；截图占位仅在页面展示。 */
export function getDesignEngineeringContent(_locale: Locale): ProjectDetailBlock {
  return {
    showCover: false,
    tags: ['Agent Ready', '设计系统建设', '设计工程落地'],
    paragraphs: [],
    sections: [
      {
        id: 'context',
        legacyIds: ['architecture'],
        title: '项目背景',
        paragraphs: [
          [
            { text: '随着产品经理、研发和设计师开始利用 Agent 开发页面，样式如何使用、组件如何组合、设计属性如何对应代码，都需要明确的依据。我负责建设 ' },
            { text: 'Agent Ready 设计系统', definitionTitle: '面向 AI Agent 使用的设计系统', definition: '将设计规则（样式、组件及用法等）整理为 Agent 可读取可理解可调用的资料，帮助它选择合适的组件、生成符合规范的界面，并依据规则检查结果。' },
            { text: '，将这些判断整理为语义 Token、设计规则与组件映射，再通过 Skill 和 CLI 接入开发过程，支持设计系统升级与界面交付。' },
          ],
        ],
        table: {
          columns: ['目标', '角色', '职责'],
          rows: [{ id: 'goals-and-role', cells: [
            '让不同角色通过 AI 复用设计系统，\n保持样式与组件使用一致',
            'Agent Ready 设计系统\n负责人',
            '建设 Token、DESIGN.md 与 Skill\n协同前端对齐 API，定义 CLI 交互',
          ] }],
        },
        architecture: {
          title: 'Agent Ready 设计系统',
          sharedPractices: '分发与维护 · 待建设：Registry、版本同步与迁移',
          feedback: '评估反馈 → 修正设计资产与设计知识（待建设）',
          layers: [
            {
              id: 'assets', title: '设计资产',
              nodes: [
                { id: 'tokens', title: 'Design Token', status: 'existing', description: '已有实践 · 基础值与语义' },
                { id: 'components', title: '基础组件库', status: 'existing', description: '已有实践 · 组件与状态' },
              ],
            },
            {
              id: 'knowledge', title: '设计知识',
              nodes: [
                { id: 'component-docs', title: '组件选择条件和用法', status: 'existing', description: '已有实践 · 用途、属性、状态与示例' },
                { id: 'component-rules', title: '正反例', status: 'existing', description: '已有实践 · 使用限制与正反例' },
                { id: 'patterns', title: '组合模式', status: 'existing', description: '已有实践 · 组件组合与布局规则' },
                { id: 'design-md', title: 'DESIGN.md', status: 'existing', span: 'full', description: '已有实践 · 设计规则与例外' },
              ],
            },
            {
              id: 'mapping', title: '代码映射',
              nodes: [
                { id: 'component-api', title: '组件 API 契约', status: 'existing', description: '已确认 · 与前端统一组件 API' },
                { id: 'code-connect', title: 'Code Connect 映射', status: 'existing', description: '映射方案已形成 · 尚未全面接入' },
              ],
            },
            {
              id: 'access', title: 'Agent 可见',
              nodes: [
                { id: 'index', title: '组件索引', status: 'existing', description: '已有实践 · 查找已有组件' },
                { id: 'skill', title: '设计规范 Skill', status: 'existing', description: '已有实践 · 任务与调用指引' },
                { id: 'tools', title: 'CLI', status: 'existing', span: 'full', description: '已有接入 · 设计负责规则与交互，研发负责实现' },
              ],
            },
            {
              id: 'quality', title: '质量评估',
              nodes: [
                { id: 'review', title: '界面和代码检查', status: 'existing', description: '已有实践 · 人工检查' },
                { id: 'tests', title: 'Agent 使用评估', status: 'planned', description: '待建设 · 组件选择、规则遵循与能力缺口' },
              ],
            },
          ],
        },
        images: [],
      },
      {
        id: 'foundations', legacyIds: ['design-highlights', 'project-gallery'],
        title: 'Design Token',
        paragraphs: ['原有 Token 沿用 Ant Design，设计师难以理解其语义与使用场景，仍习惯使用固定值；前端缺少统一的引用标准，Agent 开发页面时也难以判断该使用哪个 Token。我按「基础值—语义层—组件层」梳理 Token，明确样式用途、适用场景与组件映射，为设计师、前端和 Agent 建立共同的选择依据。'],
        subsections: [{
          id: 'design-tokens', title: 'Design Token', hideTitle: true,
          paragraphs: [],
          listItems: [
            [{ text: '颜色与空间：', bold: true }, { text: '使用 OKLCH 组织色阶，以有限的 px 阶梯统一尺寸与间距，并按需保留固定尺寸，各主题分别检查对比度、视觉层级与状态辨识度；' }],
            [{ text: '主题复用：', bold: true }, { text: '设计系统升级或切换主题时，集中调整语义映射，减少逐个修改组件样式的工作，这套机制用于编辑器深色模式和 Data Agent 多主题设计。' }],
            [{ text: '面向 AI：', bold: true }, { text: '通过背景、文字、边框等语义名称说明样式用途，让 Agent 根据使用位置与状态选择 Token，而非仅凭固定值判断。' }],
          ],
          mediaFirst: true,
          images: [{
            src: '/images/design-engineering-tokens.png',
            caption: 'OceanBase Design Tokens：语义颜色的变量名称、代码引用、值与预览',
            hideCaption: true,
          }],
        }], images: [],
      },
      {
        id: 'guidance',
        legacyIds: ['connections', 'foundations-composition-patterns-title', 'guidance-component-documentation-title', 'guidance-component-rules-title', 'guidance-composition-patterns-title'],
        title: 'DESIGN.md',
        paragraphs: ['通过 DESIGN.md 统一设计样式的复用规则：基础 Token 和图片资产通过文件引用，Markdown 文档重点说明组件用法与组合模式，让 Agent 按照统一规范组织界面。这套方式应用于官网、大会 Demo 等场景，帮助不同页面复用已有设计，保持样式与交互一致。'],
        subsections: [
          {
            id: 'project-design-rules', title: '统一设计规则', hideTitle: true,
            paragraphs: [],
            listItems: [
              [{ text: '组件选择和用法：', bold: true }, { text: '说明组件适用的任务、属性与状态，提供选择依据；' }],
              [{ text: '正反例与约束：', bold: true }, { text: '通过正反例说明使用限制，统一交互状态的表现，保持布局稳定；' }],
              [{ text: '组件组合模式：', bold: true }, { text: '以搜索、筛选、排序和操作按钮为例，按查找目标、条件复杂度与操作对象提供组合模式。统一操作关系，具体字段与按钮随业务调整。' }],
            ],
            screenshotPlaceholder: '组件选择、状态约束与组合模式的规则及对应界面', images: [],
          },
        ], images: [],
      },
      {
        id: 'code-mapping', legacyIds: ['guidance-code-connect-title', 'foundations-agent-ready-components-title', 'code-mapping-agent-ready-components-title'],
        title: '代码映射',
        paragraphs: ['设计组件库与前端组件库的分类、属性、取值不一致时，工程师往往需要先判断设计属性对应哪个代码属性，形成额外的语义转换，也增加了 Agent 理解组件调用方式的难度。因此，需要进一步建立设计组件与代码的映射。'],
        subsections: [
          {
            id: 'component-api', title: '统一 API',
            paragraphs: [
              '统一设计与代码的组件 API，让 Figma 中的属性与状态直接对应前端调用。',
            ],
            listItems: [
              [{ text: '难点：', bold: true }, { text: '前端基于 Ant Design 定制了部分 API，需兼容已有接口，尽量避免影响线上业务。' }],
              [{ text: '解决：', bold: true }, { text: '梳理全部组件分类和 API，在保留已有接口的前提下补齐定义，并与设计师、工程师共同确认，确保两端的属性、取值与状态一致。' }],
            ],
            images: [],
          },
          {
            id: 'code-connect', title: '设计与代码映射',
            paragraphs: [
              '基于已确认的 API，形成 Code Connect 映射方案，将 Figma 组件及其属性对应到代码组件与使用示例。',
              [{ text: '难点：', bold: true }, { text: '涉及多套组件库，逐一搭建与对齐的工作量大。' }],
              [{ text: '解决：', bold: true }, { text: '利用 Codex 连接 MCP，按约定的组件分类与 API 生成基础组件库，再由人工校验和调整，确保符合统一规范。' }],
            ],
            images: [],
          },
        ], images: [],
      },
      {
        id: 'skill-design',
        legacyIds: ['guidance-component-skill-title', 'agent-access-component-skill-title'],
        title: 'Skill 设计',
        paragraphs: ['有了设计规则与代码依据，还需要明确在开发的哪个阶段使用。我负责设计规范 Skill 的内容与使用指引，将 DESIGN.md、前端组件库和工程标准组织为实现前、实现中、完成后三个阶段，并将检查中发现的共性问题补充为规则与例外。'],
        subsections: [{
          id: 'skill-package', title: '从设计规范到开发指引', hideTitle: true,
          paragraphs: [],
          listItems: [
            [{ text: '实现前：', bold: true }, { text: '读取全局样式、组件选择条件与组合模式，先明确任务适用的设计规则和边界，再组织界面；' }],
            [{ text: '实现中：', bold: true }, { text: '关联已有组件实现与调用示例，使用与前端确认的 API 和语义 Token，将设计规则落实到代码；' }],
            [{ text: '完成后：', bold: true }, { text: '按工程标准与界面要求检查结果，区分规则缺失、表达不清和实现偏差，分别补充规则或修正代码。' }],
          ],
          images: [{
            src: '/images/design-engineering-skill-structure.svg',
            caption: 'Skill 文件结构：skill 下包含 skill.md 与 reference 文件夹；reference 下包含 Setup、General、Token、Component、Layout、Engineer 文件夹。',
            hideCaption: true,
          }],
        }], images: [],
      },
      {
        id: 'agent-access',
        legacyIds: ['agent-access-component-index-title'],
        title: 'CLI 工具',
        paragraphs: ['Skill 组织开发步骤，CLI 提供步骤中的按需查询入口，让 Agent 查找组件并获取规则与调用依据。我负责查询内容与交互定义，研发负责工具实现。'],
        subsections: [
          {
            id: 'agent-tools', title: '面向任务组织查询内容', hideTitle: true,
            paragraphs: [],
            listItems: [
              [{ text: '组件查找：', bold: true }, { text: '围绕任务组织查询入口，通过组件索引定位可复用的已有资产；' }],
              [{ text: '规则获取：', bold: true }, { text: '查询范围优先参考了 ' }, { text: 'Astryx CLI', href: 'https://astryx.atmeta.com/docs/cli' }, { text: '，涵盖组件搜索、设计规范阅读、主题管理等；' }],
              [{ text: '实现衔接：', bold: true }, { text: '将查询结果中的设计规则与组件 API、调用示例对应，作为后续实现的依据。' }],
            ],
            images: [],
          },
        ], images: [],
      },
      {
        id: 'delivery', legacyIds: ['implementation', 'implementation-implementation-review-title', 'implementation-agent-usage-evaluation-title'],
        title: '项目应用',
        paragraphs: ['这套 Agent Ready 设计系统已推动 5+ 团队面向 AI Native 组织转型落地，让产品、设计与研发通过 AI 复用统一的设计资产和规范，并在成熟产品与新产品中形成可落地的协作方式。'],
        subsections: [
          {
            id: 'code-delivery', title: 'OceanBase 云控制台',
            paragraphs: [
              'OceanBase 云控制台工程化程度较高，设计系统复用基础完善。通过设计规范 Skill，设计师可以借助 AI 使用已有组件完成前端需求，直接提交 PR，参与需求交付。',
              '这一实践将设计师的工作从方案交付延伸到前端实现，依托已有工程体系和共同规范推进协作。',
            ],
            images: [{ src: '/images/design-engineering-oceanbase-console.png', caption: 'OceanBase 云控制台实例工作台：容量资源与重点指标监控', hideCaption: true }],
          },
          {
            id: 'datapilot-design-collaboration', title: 'Data Agent',
            paragraphs: [
              'Data Agent 是从零到一建设的 AI Native 产品。我先通过全局 DESIGN.md 建立视觉方向、样式和交互状态的共同约束，再随产品开发逐步沉淀组件规则与组合模式。',
              '具体实现偏差通过代码调整解决，共性问题则沉淀为规则，为后续功能开发提供依据。',
            ],
            images: [{ src: '/images/design-engineering-data-agent.png', caption: 'Data Agent 工作台：数据资产、分析仪表盘与 Agent 对话并列展示', hideCaption: true }],
          },
        ], images: [],
      },
    ],
    gallery: [],
  }
}

/** CLI 交互演示数据，不进入项目事实与聊天语料。 */
export const designCliCommands = [
  ['search', '搜索组件、Hook、文档、模板与主题', 'search button'],
  ['component', '查询组件用法、属性与示例', 'component Button'],
  ['docs', '阅读 Token、布局和设计规范', 'docs tokens'],
  ['theme', '添加、切换与构建主题', 'theme --help'],
  ['build', '获取起始模板与页面搭建流程', 'build'],
  ['upgrade', '迁移代码与更新复制的组件', 'upgrade --help'],
] as const
