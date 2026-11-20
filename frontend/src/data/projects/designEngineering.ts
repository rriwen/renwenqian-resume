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
          '随着产品经理、研发和设计师开始利用 AI 开发界面，组件库的使用不再局限于熟悉规范的前端人员。即使使用同一套组件，不同角色仍可能在颜色、文字、间距、组件选择和组合方式上产生差异。',
          '我负责建设 Agent Ready 设计系统，将设计资产与规范面向 AI 输出，使 Agent 在开发过程中能够获取全局样式、组件使用条件和组合模式，为不同角色的产出提供共同依据。',
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
        paragraphs: ['按「基础值—语义层—组件层」组织 Token，集中管理颜色、文字与间距，通过组件对语义 Token 的引用统一视觉基础，让公共定义的调整全局生效，支持设计系统升级与多主题切换。'],
        subsections: [{
          id: 'design-tokens', title: 'Design Token', hideTitle: true,
          paragraphs: [
            [{ text: '主题复用：', bold: true }, { text: '保留组件结构，通过主题下的语义映射调整视觉表现，减少逐个修改组件样式的工作；这套机制用于编辑器深色模式和 Data Agent 多主题设计；' }],
            [{ text: '颜色与空间：', bold: true }, { text: '使用 OKLCH 组织颜色色阶，以有限的 px 阶梯统一内容相关尺度，并按需要保留固定尺寸；同时，每个主题分别检查对比度、层级与状态辨识度；' }],
            [{ text: '面向 AI：', bold: true }, { text: '对 AI 而言，背景、文字、边框等通过语义名称表达使用意图，为生成代码提供明确的引用依据。' }],
          ],
          screenshotPlaceholder: 'Token 语义映射、编辑器深色模式与 Data Agent 多主题对照',
          images: [],
        }], images: [],
      },
      {
        id: 'guidance',
        legacyIds: ['connections', 'foundations-composition-patterns-title', 'guidance-component-documentation-title', 'guidance-component-rules-title', 'guidance-composition-patterns-title'],
        title: 'DESIGN.md',
        paragraphs: ['以 DESIGN.md 为载体，将设计经验整理为 Agent 可读取、可执行的规则。按照「设计意图—表现规则—实现方式—检查要求」，组织全局样式、组件用法与组合模式，统一颜色、文字、间距、表面层级与主题规则，明确组件的选择条件、属性、状态和使用限制，以及多组件协作时的信息层级、布局与行为关系。'],
        subsections: [
          {
            id: 'project-design-rules', title: '统一设计规则', hideTitle: true,
            paragraphs: [
              [{ text: '组件选择条件和用法：', bold: true }, { text: '围绕组件的适用场景、属性与状态整理使用条件，让 Agent 根据任务选择已有组件，并明确组件的作用范围。' }],
              [{ text: '正反例与状态约束：', bold: true }, { text: '通过正反例说明使用限制，统一 Hover、Focus、Selected、Disabled、Loading 和 Error 等状态，保持状态变化时的尺寸与布局稳定，避免同类组件在不同页面中产生不同表现。' }],
              [{ text: '组合模式：', bold: true }, { text: '以工具栏为例，搜索、筛选、视图切换和操作按钮需要共同组织；除了单个组件的规范，还需明确操作主次、分组关系，以及筛选与批量操作的作用范围。' }],
            ],
            screenshotPlaceholder: '实际 DESIGN.md 规则片段与对应界面', images: [],
          },
        ], images: [],
      },
      {
        id: 'code-mapping', legacyIds: ['guidance-code-connect-title', 'foundations-agent-ready-components-title', 'code-mapping-agent-ready-components-title'],
        title: '代码映射',
        paragraphs: ['连接设计定义与代码实现，让设计中的组件、属性和状态对应到前端组件 API，并通过 Code Connect 映射方案提供代码调用依据，减少从设计到开发的理解偏差，帮助 Agent 复用已有组件。'],
        subsections: [
          {
            id: 'component-api', title: '统一 API',
            paragraphs: ['我与前端已确认组件 API，对齐属性命名、取值和状态约束，减少设计定义与实现方式之间的歧义，为组件复用提供共同依据。'],
            screenshotPlaceholder: '设计组件属性与前端 API 对照', images: [],
          },
          {
            id: 'code-connect', title: '设计与代码映射',
            paragraphs: [
              '基于已确认的 API，形成 Code Connect 映射方案，将 Figma 组件及其属性对应到代码组件与使用示例。',
            ],
            screenshotPlaceholder: 'Code Connect 映射方案与组件使用示例', images: [],
          },
        ], images: [],
      },
      {
        id: 'skill-design',
        legacyIds: ['guidance-component-skill-title', 'agent-access-component-skill-title'],
        title: 'Skill 设计',
        paragraphs: ['以设计规范 Skill 为入口，将 DESIGN.md 中的组件用法与约束、前端组件库使用方式和工程实现标准组织为面向开发任务的指引，让 Agent 在实现界面时同时获取设计规则与代码依据。我负责规则内容与使用指引建设，并将界面检查中发现的共性问题补充为规则和例外。'],
        subsections: [{
          id: 'skill-package', title: '从设计规范到开发指引', hideTitle: true,
          paragraphs: [
            [{ text: '组件用法与约束：', bold: true }, { text: '整合组件选择条件、属性、交互状态、正反例与组合模式，明确什么时候用、如何组合，以及需要遵循的使用限制。' }],
            [{ text: '前端组件库：', bold: true }, { text: '关联已有组件实现与调用示例，引导 Agent 使用与前端确认的组件 API，复用现有能力，并遵循统一的 Token 与样式规则。' }],
            [{ text: '工程实现标准：', bold: true }, { text: '整理代码组织、样式复用和界面检查要求，将设计规则落实到实现与检查环节，使生成结果符合项目既有的工程规范。' }],
          ],
          screenshotPlaceholder: '设计规范 Skill 目录、组件使用指引与工程标准片段',
          images: [],
        }], images: [],
      },
      {
        id: 'agent-access',
        legacyIds: ['agent-access-component-index-title'],
        title: 'CLI 工具',
        paragraphs: ['以组件索引与 CLI 连接设计系统和开发任务，让 Agent 按需查找已有资产、获取使用规则与代码依据，减少开发过程中对人工解释规范的依赖。我负责规则内容与交互定义，研发负责工具实现。'],
        subsections: [
          {
            id: 'agent-tools', title: '面向任务组织查询内容', hideTitle: true,
            paragraphs: [
              [{ text: '组件查找：', bold: true }, { text: '通过组件索引定位已有资产，围绕任务组织查询入口，帮助 Agent 先找到可复用的组件。' }],
              [{ text: '规则获取：', bold: true }, { text: '查询范围参考 ' }, { text: 'Astryx CLI', href: 'https://astryx.atmeta.com/docs/cli' }, { text: '，涵盖组件属性与用法、Token、主题、布局规范和组合模板，作为查询内容的组织依据，不代表当前工具已全部实现。' }],
              [{ text: '实现衔接：', bold: true }, { text: '将查询得到的设计规则与组件 API、调用示例保持对应，让 Agent 从理解用法进一步衔接到代码实现。' }],
            ],
            screenshotPlaceholder: 'CLI 实际查询：输入、返回的组件规则与使用示例', images: [],
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
            screenshotPlaceholder: 'OceanBase 云控制台需求界面与对应前端 PR', images: [],
          },
          {
            id: 'datapilot-design-collaboration', title: 'Data Agent',
            paragraphs: [
              'Data Agent 是从零到一建设的 AI Native 产品。我先通过全局 DESIGN.md 建立视觉方向、样式和交互状态的共同约束，再随产品开发逐步沉淀组件规则与组合模式。',
              '在数据、应用和对话模块中，我负责设计方向、组件反馈与界面检查，并与研发确定复用方式。具体实现偏差通过代码调整解决，共性问题则沉淀为规则，为后续功能开发提供依据。',
            ],
            screenshotPlaceholder: 'Data Agent 实际界面与沉淀的设计规范、组合模式', images: [],
          },
        ], images: [],
      },
    ],
    gallery: [],
  }
}
