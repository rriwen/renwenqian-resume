import type { Locale } from '../../i18n/translations'
import type { ProjectDetailBlock } from '../projectDetails'

/** 设计工程案例的页面、锚点与聊天语料共用此内容。 */
export function getDesignEngineeringContent(locale: Locale): ProjectDetailBlock {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en

  return {
    showCover: false,
    tags: [t('AI 设计工作流', 'AI Design Workflow'), t('组件化设计', 'Component-Based Design'), t('设计与代码协同', 'Design–Code Collaboration')],
    paragraphs: [
      t(
        '这项实践始于一个问题：AI 时代，设计师如何持续介入产品研发？我以设计工程化为基础，将设计变量、组件语义、设计与代码的映射，以及项目规则沉淀为可复用的资产，并通过实际代码交付探索这条路径。首先要解决的是，让 AI 稳定生成符合设计要求的页面。',
        'This practice began with a question: how can designers participate throughout product development in the AI era? I used design engineering as the foundation, turning design variables, component semantics, design-to-code mappings, and project rules into reusable assets and applying them through code delivery. The first priority was helping AI consistently generate pages that meet design requirements.',
      ),
    ],
    sections: [
      {
        id: 'context',
        title: t('背景与目标', 'Context and goals'),
        paragraphs: [
          t(
            '在探索 AI 辅助产品研发时，设计师和研发遇到了共同问题：AI 生成的界面与前端代码难以遵循统一的设计标准，需要反复调试。随着多个 AI 产品并行迭代，组件选择、状态处理和页面规则都需要有可复用的依据，避免在每次任务中重新说明和纠偏。',
            'While exploring AI-assisted product development, designers and developers encountered the same problem: generated interfaces and frontend code did not consistently follow shared design standards and required repeated adjustments. As multiple AI products evolved in parallel, component selection, state handling, and page rules needed reusable references to avoid restating and correcting them in every task.',
          ),
          t(
            '这里的稳定，是指多次生成、修改或切换页面后，仍能遵循一致的视觉、组件和交互规则。我先明确可复用的资产和约束，再推进设计与代码衔接、跨项目复用。设计师参与规则制定、实现判断和代码交付，并在具体产品中检验这些规则是否可用。',
            'Consistency means following the same visual, component, and interaction rules across repeated generation, edits, and different pages. I started with reusable assets and explicit constraints, then worked on design-to-code alignment and reuse across projects. Designers participate in defining rules, making implementation decisions, and delivering code, with real products providing a way to assess those rules.',
          ),
        ],
        images: [],
      },
      {
        id: 'architecture',
        title: t('全局架构', 'Overall architecture'),
        paragraphs: [
          t(
            '体系从上到下分为设计资产、规则映射、代码交付、项目应用四层。从统一变量与组件出发，通过使用规则和设计映射指导实现，最终应用于不同产品。',
            'From top to bottom, the architecture consists of design assets, rules and mappings, code delivery, and product applications. Shared variables and components provide the starting point; usage rules and design mappings guide implementation across products.',
          ),
        ],
        architecture: {
          title: t('以设计基建支撑 AI 辅助研发', 'Design foundations for AI-assisted development'),
          layers: [
            {
              id: 'assets',
              title: t('设计资产', 'Design assets'),
              description: t('可复用的基础', 'Reusable foundations'),
              nodes: [
                { id: 'tokens', title: 'Design Token', description: t('基础变量与使用规则', 'Foundation variables and usage rules') },
                { id: 'agent-ready', title: t('Agent Ready 组件库', 'Agent Ready component library'), description: t('供 Agent 理解、选择与复用', 'For Agents to understand, select, and reuse') },
              ],
            },
            {
              id: 'guidance',
              title: t('规则映射', 'Rules and mappings'),
              description: t('Agent 使用依据', 'Guidance for Agents'),
              nodes: [
                { id: 'code-connect', title: 'Code Connect', description: t('Figma 与代码组件映射', 'Map Figma to code components') },
                { id: 'component-skill', title: t('组件库 Skill', 'Component-library Skill'), description: t('组件调用与设计规范', 'Component usage and design standards') },
                { id: 'design-md', title: 'DESIGN.md', description: t('项目设计与交互约束', 'Project design and interaction constraints') },
              ],
            },
            {
              id: 'delivery',
              title: t('代码交付', 'Code delivery'),
              nodes: [
                { id: 'ai-implementation', title: t('AI 辅助实现', 'AI-assisted implementation'), description: t('依据规范选择、组合组件', 'Select and compose components using guidelines') },
                { id: 'designer-delivery', title: t('设计师参与交付', 'Designer participation'), description: t('设计判断、代码实现与检查', 'Design decisions, implementation, and review') },
              ],
            },
            {
              id: 'applications',
              title: t('项目应用', 'Applications'),
              nodes: [
                { id: 'analytics', title: t('智能问数', 'AI analytics') },
                { id: 'memory', title: t('记忆插件', 'Memory plugin') },
                { id: 'websites', title: t('产品官网', 'Product websites') },
              ],
            },
          ],
        },
        images: [],
      },
      {
        id: 'foundations',
        legacyIds: ['design-highlights', 'project-gallery'],
        title: t('设计资产', 'Design assets'),
        paragraphs: [
          t(
            '我先将基础视觉规范和共性界面能力整理为可复用的资产：Design Token 统一基础变量，Agent Ready 组件库承载组件实现与使用语义，为后续生成提供一致的设计依据。',
            'I organized visual foundations and shared interface patterns into reusable assets. Design Tokens unify foundation variables, while the Agent Ready component library provides implementations and usage semantics, giving subsequent generation a consistent design reference.',
          ),
        ],
        subsections: [
          {
            id: 'design-tokens',
            title: 'Design Token',
            paragraphs: [
              t(
                '统一颜色、字体、间距、圆角等基础变量，并定义命名、分层与使用规则。变量不仅记录具体数值，也表达使用意图，让设计和实现能够围绕同一套语义讨论，减少每次生成页面时重新定义基础样式的空间。',
                'I unified foundation variables for color, typography, spacing, and radii, and defined their naming, layers, and usage rules. Variables describe intended use as well as values, giving design and implementation a shared vocabulary and reducing the need to redefine basic styles for each generated page.',
              ),
            ],
            images: [],
          },
          {
            id: 'agent-ready-components',
            title: t('Agent Ready 组件库', 'Agent Ready component library'),
            paragraphs: [
              t(
                '成熟组件库本身就包含属性、状态和使用示例。这里的 Agent Ready 强调这些知识如何进入 AI 辅助开发流程：让 Agent 理解组件解决什么问题、在当前任务中如何选择，以及如何结合项目约束复用现有实现。它是本项目的建设目标，需要由具体资料与使用过程来支撑。',
                'Mature component libraries already include properties, states, and usage examples. Here, Agent Ready describes how that knowledge supports AI-assisted development: helping an Agent understand what a component is for, select it for the current task, and reuse its implementation within project constraints. It is a goal for this project, supported by concrete documentation and usage practices.',
              ),
              t(
                '从 AI 产品的共性场景中抽象 Prompt 输入、计划、思维链等组件。组件资料同时描述用途、属性、状态、适用场景和代码示例，让 Agent 获得选择与复用依据，也让设计师和研发能够检查使用是否符合预期。',
                'I abstracted shared AI product scenarios into components such as prompt input, plans, and reasoning displays. Component documentation covers purpose, properties, states, usage scenarios, and code examples, giving Agents guidance for selection and reuse while helping designers and developers review the result.',
              ),
              t(
                '计划与思维链组件体现了这类资产的重点：除视觉外，还需要说明执行过程中的信息组织与状态表达。组件的价值因此延伸到交互模式，让后续页面能够复用已经整理的设计判断。',
                'Plan and reasoning components illustrate why these assets need more than visual specifications: they also describe how execution information and states are presented. The reusable asset includes an interaction pattern and the design decisions behind it.',
              ),
              [
                { text: t('行业参照：', 'Industry references: ') },
                { text: 'Storybook manifests', href: 'https://storybook.js.org/docs/ai/manifests' },
                { text: t('将已有组件资料组织成 Agent 可读取的结构化上下文；', ' organizes existing component documentation into structured context for Agents; ') },
                { text: 'shadcn MCP', href: 'https://ui.shadcn.com/docs/mcp' },
                { text: t('提供组件查询与安装入口。它们展示了组件知识进入任务流程的不同方式。本项目侧重组件语义与使用资料，并通过 Skill、DESIGN.md 和 Code Connect 将这些依据连接到实际开发。', ' provides component search and installation tools. These illustrate different ways to bring component knowledge into task workflows. This project focuses on component semantics and usage guidance, connecting them to development through Skill, DESIGN.md, and Code Connect.') },
              ],
              [
                { text: t('相关资产见', 'Related assets are available in the ') },
                { text: t('设计系统站点', 'design system site'), href: 'http://originnext.oceanbase-ai.odcfront.alipay.net/' },
                { text: t('。', '.') },
              ],
            ],
            images: [
              { src: '/images/aidesignsystem-plan-component.jpg', caption: t('计划组件：执行过程的信息组织与状态表达', 'Plan component: information structure and execution states') },
              { src: '/images/aidesignsystem-chain-of-thought.jpg', caption: t('思维链组件：过程信息的呈现方式', 'Reasoning component: presentation of process information') },
            ],
          },
        ],
        images: [],
      },
      {
        id: 'guidance',
        legacyIds: ['connections'],
        title: t('规则映射', 'Rules and mappings'),
        paragraphs: [
          t(
            '为了让设计资产进入 AI 辅助研发流程，我进一步明确设计组件与代码的对应关系、组件的使用方法，以及当前项目需要遵守的规则。Code Connect、组件库 Skill 和 DESIGN.md 分别承接这三类信息，让设计师、研发与 Agent 在实现时使用同一套依据。',
            'To bring design assets into AI-assisted development, I clarified design-to-code mappings, component usage, and project-specific rules. Code Connect, the component-library Skill, and DESIGN.md carry these three kinds of information, providing shared references for designers, developers, and Agents during implementation.',
          ),
        ],
        subsections: [
          {
            id: 'code-connect',
            title: t('Code Connect：设计与代码的对应关系', 'Code Connect: map design to code'),
            paragraphs: [
              t(
                '我梳理 Figma 组件、变体与交互状态，建立它们和代码组件的映射。关键工作是明确设计中的选择对应哪些组件和属性，使开发与 AI 辅助实现有可引用的代码依据，减少仅凭外观推测组件用法。',
                'I organized Figma components, variants, and interaction states and mapped them to code components. The key task was to clarify which components and properties correspond to design choices, providing code references for developers and AI-assisted implementation instead of leaving usage to visual interpretation.',
              ),
              [
                { text: t('行业参照：', 'Industry reference: ') },
                { text: 'Figma Code Connect', href: 'https://help.figma.com/hc/en-us/articles/42495296821911-Code-Connect-and-MCP' },
                { text: t('将设计组件与实际代码用法关联。这里关注映射关系的建设，页面布局和业务交互仍由项目规则与实现工作共同处理。', ' connects design components with real code usage. This work focuses on those mappings; page layout and product interactions also depend on project rules and implementation decisions.') },
              ],
            ],
            images: [],
          },
          {
            id: 'component-skill',
            title: t('组件库 Skill：按规范使用组件', 'Component-library Skill: use components consistently'),
            paragraphs: [
              t(
                '针对生成过程中反复调试的问题，我将前端组件与设计规范沉淀到 Skill 中，整理工程安装、组件属性、调用方式、代码示例与交互约束。设计师和研发在 AI 辅助开发时，可以引用这些资料，让 Agent 依据已有规范选择和组合组件。',
                'To address repeated adjustments during generation, I consolidated frontend components and design standards into a Skill, including setup instructions, component properties, usage, code examples, and interaction constraints. Designers and developers can reference these materials during AI-assisted development so Agents select and compose components using established guidelines.',
              ),
            ],
            images: [],
          },
          {
            id: 'project-design-rules',
            title: t('DESIGN.md：明确项目设计约束', 'DESIGN.md: define project design constraints'),
            paragraphs: [
              t(
                '组件正确并不意味着页面就符合预期。我将当前项目的页面结构、信息层级、布局、视觉规则、响应式要求与交互边界写入 DESIGN.md，让后续生成与修改引用同一份项目规则，并为人工检查提供依据。Skill 说明组件怎样使用，DESIGN.md 补充这些组件在当前项目中需要遵守什么。实际使用时，还需要在任务或工作流中明确要求读取和遵守文档。',
                'Correct components alone do not ensure an appropriate page. I documented the project’s page structure, information hierarchy, layout, visual rules, responsive requirements, and interaction boundaries in DESIGN.md, providing a shared reference for generation, changes, and human review. The Skill explains component usage; DESIGN.md adds the constraints of the current project. Tasks or workflows must also explicitly direct the Agent to read and follow the document.',
              ),
              [
                { text: t('行业参照：', 'Industry reference: ') },
                { text: t('Google Labs 的 design.md', 'Google Labs design.md'), href: 'https://github.com/google-labs-code/design.md' },
                { text: t('同样以文本记录可供 AI 使用的设计信息。这里将它作为文档方式的参照，具体规则来自项目自身。', ' also records design information in text for AI use. It serves as a reference for the document format; the actual rules come from the project.') },
              ],
            ],
            images: [],
          },
        ],
        images: [],
      },
      {
        id: 'delivery',
        title: t('项目应用', 'Project applications'),
        paragraphs: [
          t(
            '我将 Skill 与组件库应用于智能问数、记忆插件及官网开发，参与页面与组件代码交付。在记忆插件项目中，独立完成产品官网与记忆管理后台的视觉设计、内容规划和前端代码，使设计工作延伸到可运行的产品实现。',
            'I applied the Skill and component library to AI analytics, the memory plugin, and product websites, delivering page and component code. For the memory plugin, I independently delivered visual design, content planning, and frontend code for its website and administration interface, extending design work into running product implementations.',
          ),
        ],
        subsections: [
          {
            id: 'code-delivery',
            title: t('从规范到代码交付', 'From guidelines to code delivery'),
            paragraphs: [
              t(
                '在这些项目中，设计工作延伸到实现过程：以组件库和规则作为 AI 辅助实现的依据，参与组件选择、页面组织、代码实现与结果检查。设计师既建设可复用的基础，也在具体交付中判断生成结果是否符合设计要求。',
                'Across these projects, design work extends into implementation. The component library and guidelines inform AI-assisted development, while I participate in component selection, page structure, code implementation, and review. Designers build reusable foundations and assess whether generated results meet design requirements during delivery.',
              ),
            ],
            images: [],
          },
          {
            id: 'further-validation',
            title: t('后续验证与规则迭代', 'Further validation and guideline iteration'),
            paragraphs: [
              t(
                '这些应用构成了当前的实践基础。后续验证首先关注生成是否稳定：同类任务能否选对组件、遵守页面规则、完整处理状态；其次观察设计与代码衔接、跨项目复用，以及人工修改的原因与范围。需要持续将具体问题整理回组件资料和项目规则，判断哪些约束真正帮助了交付。',
                'These applications form the current practice base. Further validation should first examine generation consistency: whether comparable tasks select suitable components, follow page rules, and handle required states. It should then assess design-to-code alignment, reuse across projects, and the reasons and scope of human edits. Concrete issues can inform component documentation and project rules to establish which constraints actually help delivery.',
              ),
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
