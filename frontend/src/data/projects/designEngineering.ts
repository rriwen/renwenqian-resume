import type { Locale } from '../../i18n/translations'
import type { ProjectDetailBlock } from '../projectDetails'

const DESIGN_PRACTICE_URL = 'https://design-md-reader-4x.vercel.app/'

/** 正文与建设状态供页面和聊天共用；evidenceRequests 仅在页面展示。 */
export function getDesignEngineeringContent(_locale: Locale): ProjectDetailBlock {
  return {
    showCover: false,
    tags: ['Agent Ready 设计系统', '组件 API 对齐', 'AI 辅助开发'],
    paragraphs: [],
    sections: [
      {
        id: 'context',
        legacyIds: ['architecture'],
        title: '项目背景',
        paragraphs: [
          '团队已有基础组件库，但设计规范分散在不同文档中，难以被 Agent 统一获取和使用。面向 AI Native 组织转型，我们建设 Agent Ready 设计系统，将组件、设计知识与代码实现关联起来，让 Agent 能找到组件、理解使用规则、调用真实代码，并检查产出是否符合规范。',
        ],
        table: {
          columns: ['建设目标', '核心职责'],
          rows: [{ id: 'goals-and-role', cells: [
            '让不同角色借助 AI 产出的界面与代码遵循统一规范，复用已有设计能力。',
            '负责 Design Token、设计知识、DESIGN.md 与 Skill 建设，协同前端统一组件 API 和设计代码映射。',
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
                { id: 'component-rules', title: '正反例', status: 'existing', description: '已有实践 · 正反例材料待补' },
                { id: 'patterns', title: '组合模式', status: 'existing', description: '已有实践 · 组合模式材料待补' },
                { id: 'design-md', title: 'DESIGN.md · 规则载体', status: 'existing', span: 'full', description: '已有实践 · 设计规则与例外' },
              ],
            },
            {
              id: 'mapping', title: '代码映射',
              nodes: [
                { id: 'component-api', title: '组件 API 契约', status: 'existing', description: '已有梳理 · 与前端统一接口' },
                { id: 'code-connect', title: 'Code Connect 映射', status: 'existing', description: '映射已梳理 · 接入材料待补' },
              ],
            },
            {
              id: 'access', title: 'Agent 可见',
              nodes: [
                { id: 'index', title: '组件索引', status: 'existing', description: '已有实践 · 实现材料待补' },
                { id: 'skill', title: '设计规范 Skill', status: 'existing', description: '已有实践 · 任务与调用指引' },
                { id: 'tools', title: 'CLI', status: 'existing', span: 'full', description: '已有实践 · 接入材料待补' },
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
        id: 'foundations',
        legacyIds: ['design-highlights', 'project-gallery'],
        title: 'Design Token',
        paragraphs: [],
        subsections: [
          {
            id: 'design-tokens', title: 'Design Token', hideTitle: true,
            paragraphs: ['已有实践：按基础值、语义角色和组件使用组织 Token，让组件引用统一的颜色、字体与间距尺度。'],
            evidenceRequests: ['待补一组真实 Token：基础值、语义命名与组件引用。'],
            images: [],
          },


        ],
        images: [],
      },
      {
        id: 'guidance',
        legacyIds: ['connections', 'foundations-composition-patterns-title', 'agent-access-component-skill-title'],
        title: 'Design.md',
        paragraphs: ['说明组件什么时候用、如何组合，以及需要遵守的设计规则。'],
        subsections: [
          {
            id: 'component-documentation', title: '组件选择条件和用法',
            paragraphs: ['已有实践：整理组件选择条件、用途、属性、状态与调用示例。'],
            evidenceRequests: ['待补一份真实组件文档，包含适用场景、使用限制与示例。'],
            images: [],
          },
          {
            id: 'component-rules', title: '正反例',
            paragraphs: ['已有实践：整理组件使用的正反例，说明使用限制与交互约束。'],
            evidenceRequests: ['待补一组真实正反例及对应规则。'],
            images: [],
          },
          {
            id: 'project-design-rules', title: 'DESIGN.md',
            paragraphs: [
              '已有实践：以 DESIGN.md 记录项目级布局、样式复用与检查要求，引用具体组件规则。',
              [{ text: '相关实践：' }, { text: '《什么是 DESIGN.md》', href: DESIGN_PRACTICE_URL }, { text: '。文中的行业参照不作为个人交付成果。' }],
            ],
            evidenceRequests: ['待补一段实际规则及其对应界面，可与下方 Data Agent 案例共用。'],
            images: [],
          },
          {
            id: 'composition-patterns', title: '组合模式',
            paragraphs: ['已有实践：已整理组件组合模式，具体模式与组件结构待补。'],
            evidenceRequests: ['待补可复用的页面模式及对应组件结构。'],
            images: [],
          },
          {
            id: 'component-skill', title: '设计规范 Skill',
            paragraphs: ['已有实践：将安装、属性、调用示例与交互约束整理为 Skill，用于 Data Agent、记忆插件及官网开发。'],
            evidenceRequests: ['待补 Skill 目录、一段代表性指引和实际使用记录。'],
            images: [],
          },
        ],
        images: [],
      },
      {
        id: 'code-mapping',
        legacyIds: ['guidance-code-connect-title', 'foundations-agent-ready-components-title'],
        title: '代码映射',
        paragraphs: ['核心是与前端统一组件 API，让设计属性、变体与状态对应真实的代码接口。'],
        subsections: [
          {
            id: 'code-connect', title: '统一组件 API，再建立映射',
            paragraphs: [
              '已有实践：梳理 Figma 组件、变体和状态与代码属性的对应关系。',
              '待完善：与前端逐项对齐属性命名、类型、取值、默认值、事件及状态约束，再通过 Code Connect 表达映射。同时明确设计与代码的版本对应、废弃与迁移规则；覆盖范围和接入记录待补。',
            ],
            evidenceRequests: ['待补一组设计属性与前端 API 对照、映射配置及使用记录，注明双方分工与完成阶段。'],
            images: [],
          },
          {
            id: 'agent-ready-components', title: '基础组件库',
            paragraphs: ['已有实践：整理 Prompt 输入、计划、思维链等组件，将界面与状态表达沉淀为可复用实现。'],
            evidenceRequests: ['待补组件清单、状态定义与代码示例，注明独立建设和复用既有组件的范围。'],
            images: [
              { src: '/images/aidesignsystem-plan-component.jpg', caption: '计划组件：执行过程的信息组织与状态表达' },
              { src: '/images/aidesignsystem-chain-of-thought.jpg', caption: '思维链组件：过程信息的呈现方式' },
            ],
          },
        ],
        images: [],
      },
      {
        id: 'agent-access',
        legacyIds: ['guidance-component-skill-title'],
        title: 'CLI工具',
        paragraphs: ['通过组件索引发现资产，使用 CLI 查询设计知识与组件用法。'],
        subsections: [
          {
            id: 'component-index', title: '组件索引与项目上下文',
            paragraphs: ['已有实践：已建设组件索引，供 Agent 查找组件。索引结构、项目上下文范围与调用示例待补。'],
            evidenceRequests: ['待补索引结构、项目配置读取方式与一次查询结果。'],
            images: [],
          },

          {
            id: 'agent-tools', title: 'CLI 与 Registry',
            paragraphs: ['已有实践：已完成 CLI 接入，具体工具能力与调用记录待补。Registry 资产分发仍待建设。'],
            evidenceRequests: ['待补工具范围与接口方案；如已有实现，请提供命令或工具清单及调用结果。'],
            images: [],
          },
        ],
        images: [],
      },
      {
        id: 'delivery',
        legacyIds: ['implementation', 'implementation-implementation-review-title', 'implementation-agent-usage-evaluation-title'],
        title: '项目应用',
        paragraphs: [
          '以下通过 Data Agent 与 OceanBase 云控制台，展示设计工程方法在项目中的应用。',
        ],
        subsections: [
          {
            id: 'datapilot-design-collaboration',
            title: 'Data Agent：把界面偏差转化为共同规则',
            paragraphs: [
              '我用 DESIGN.md 整理数据、应用与对话模块的布局、组件状态和样式复用要求，供后续开发引用。',
              '我负责设计方向、组件反馈和界面检查，与研发确定复用方式。发现偏差后，分别修正局部代码或补充缺失规则。',
            ],
            evidenceRequests: [
              '请提供一个真实界面偏差：所属模块、任务、修改前截图及影响。',
              '请提供同次修改的规则或代码、修改后截图、检查记录，并注明你与研发的分工。',
            ],
            images: [],
          },
          {
            id: 'code-delivery',
            title: 'OceanBase 云控制台',
            paragraphs: [
              '具体实践、个人职责与交付范围待补。',
            ],
            evidenceRequests: [
              '请提供 OceanBase 云控制台的实际应用场景、个人职责与交付范围。',
              '请补充对应界面、规则或代码示例，以及检查记录与发布状态。',
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
