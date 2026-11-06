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

const details: Record<string, { en: ProjectDetailBlock; zh: ProjectDetailBlock }> = {
  Memory: {
    en: {
      tags: ['Memory Systems', 'Agent-Friendly', 'Product Design'],
      paragraphs: [
        'seekdb M0 is a lightweight memory plugin for OpenClaw, shipped as a one-click deployment experience.',
        'Skills-based one-click deployment gives Agents retrievable, reusable memory—faster responses and lower token use than typical native setups—with automatic experience extraction and multi-round validation built in to keep Agents evolving.',
        'As the product designer, I was responsible for:',
      ],
      highlightBullets: [
        {
          keyword: 'Product design innovation',
          text: 'Designed a Skills-based one-click deployment flow so Agents can enable memory with zero configuration; designed a closed loop for OpenClaw work experience—automatic extraction, multi-round validation, and feedback-driven optimization—so Agent capabilities keep evolving.',
        },
        {
          keyword: 'Design & frontend delivery',
          text: 'Independently delivered the visual design, content, and frontend code for the product website and memory admin. Used AI-assisted development, Skills, and a reusable component library to implement pages and components. Completed design-to-launch in two weeks.',
        },
      ],
      afterHighlightBullets:
        'The product was incubated and went live within two weeks; it is now in public beta, and commercialization planning is underway.',
      externalUrl: 'https://m0.seekdb.ai/',
      gallery: [
        { src: '/images/memory-m0-admin.gif', caption: 'Memory management interaction.' },
        { src: '/images/memory-m0-experience-flow.png', caption: 'Experience accumulation logic.' },
      ],
    },
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
    zh: {
      showCover: false,
      overviewPrototype: { url: '/prototype/text2sql?embed=1', title: 'Text2SQL Demo', viewportWidth: 1280 },
      tags: ['AI 辅助', 'SQL 编辑器', '产品界面设计'],
      paragraphs: [
        'Text2SQL 将自然语言输入与 SQL 编辑结合起来，围绕生成、纠错、改写和格式化，为数据库开发提供 AI 辅助。用户可以在光标处发起请求，也可以选中已有 SQL，就当前代码描述修改需求。',
        '我负责产品界面设计，重点是让 AI 融入原有编辑流程：入口跟随编辑位置，指令明确当前任务，生成过程提供状态反馈与终止操作。这篇案例基于早期设计稿回顾关键决策；其中结果审阅部分保留了当时的方案探索。',
      ],
      gallery: [],
      sections: [
        {
          id: 'context',
          title: '设计背景：让 AI 接上正在进行的编辑任务',
          paragraphs: [
            '在 SQL 编辑器里，用户可能正准备写一段查询，也可能已经有了需要纠错或调整的语句。两类任务都需要表达意图，但起点不同：前者从光标位置开始，后者围绕一段明确的选区展开。',
            '设计需要回答三个问题：用户从哪里发起请求，如何知道 AI 正在处理什么任务，以及生成后如何判断是否采用。围绕这三个问题，方案把入口、输入、生成与结果处理串成连续流程，尽量减少在代码和辅助界面之间来回切换。',
          ],
          table: {
            columns: ['任务起点', '交互安排', '设计关注点'],
            rows: [
              { id: 'from-cursor', cells: ['从当前光标开始', '空行弱提示，唤起后在光标上方输入', '让入口容易发现，同时保持编辑区域简洁'] },
              { id: 'from-selection', cells: ['处理已有 SQL', '选中后出现操作入口，点击「编辑」在选区上方输入', '让请求位置与当前处理的代码建立联系'] },
              { id: 'review-change', cells: ['判断是否采用结果', '探索差异展示与接受／忽略操作', '在修改应用前留出审阅与判断的空间'] },
            ],
          },
          images: [],
        },
        {
          id: 'contextual-entry',
          title: '就近唤起：围绕光标与选区组织入口',
          paragraphs: [
            '入口采用渐进出现的方式：空行展示弱提示，选中 SQL 后再出现「编辑」和「添加到对话」。右键菜单与快捷键提供补充路径，让鼠标操作与键盘操作都能接入同一项能力。',
          ],
          subsections: [
            {
              id: 'inline-and-sidebar',
              title: '把局部编辑放在代码旁边',
              paragraphs: [
                '点击「编辑」或使用 ⌘K 唤起嵌入式输入框：没有选区时出现在光标上方，有选区时出现在选中 SQL 的最上方。输入位置随编辑对象变化，让用户在描述需求时仍能看到相关代码。',
                '「添加到对话」和 ⌘L 则提供侧边对话入口。这份稿件主要展开嵌入式编辑流程，侧边对话保留为另一条操作路径。就近输入的取舍是会占用部分编辑区域，因此方案同时提供清晰的关闭入口和 Esc 快捷键。',
              ],
            },
            {
              id: 'discoverability',
              title: '把操作提示放在需要它的时刻',
              paragraphs: [
                '选区浮动按钮通过悬停背景反馈可点击状态，发送和关闭图标在悬停时显示操作名称与快捷键。提示跟随空行、选区和悬停出现，使常用操作可发现，也避免让说明文字长期占据编辑器。',
              ],
            },
          ],
          images: [],
        },
        {
          id: 'task-commands',
          title: '明确意图：用任务指令辅助自然语言输入',
          paragraphs: [
            '一个开放输入框可以表达很多需求，也容易让人不确定从何开始。方案通过「/」菜单呈现 SQL 生成、SQL 纠错、SQL 改写、SQL 格式化四类任务，再由用户补充具体要求。',
            '选中的指令以标签持续回显，让当前任务类型在发送前保持可见。用户可以点击标签重新选择，也可以用 Delete 清除指令，避免任务切换后仍沿用旧的设置。',
            '菜单只在指令输入场景出现：继续输入其他文本时隐藏，正文中出现「/」也不触发。这样既保留快捷选择，也不打断正常输入。原稿还将「SQL 优化」调整为「SQL 改写」。回看这一命名，「改写」更贴近操作本身，也避免暗示每次改写都能带来性能提升。',
          ],
          images: [],
        },
        {
          id: 'generation-feedback',
          title: '过程可控：让等待有反馈，也能主动结束',
          paragraphs: [
            '发送请求后，输入区下方显示「AI 生成中…」，发送位置切换为终止按钮。状态信息解释当前进度，操作位置则承接用户此时最直接的需求：结束这次生成。',
            '终止后回到唤起状态，让用户重新组织请求。从等待到退出的路径保持在同一位置，用户可以根据当前任务主动结束这次生成。',
            '输入区同时提示 AI 内容的准确性与完整性限制。对这类代码辅助能力而言，提示是起点，后续还需要通过结果呈现帮助用户检查具体改动。',
          ],
          images: [],
        },
        {
          id: 'result-review',
          title: '结果方案探索：先看清变化，再决定是否采用',
          paragraphs: [
            '留存稿中的「生成结果」仍标注为待定，本节呈现当时的设计探索：把 AI 生成与用户采用分成两个步骤，让代码修改经过一次明确判断。',
          ],
          subsections: [
            {
              id: 'diff-and-decision',
              title: '用差异展示说明改了什么',
              paragraphs: [
                '方案以红色表示删除、绿色表示新增、灰色表示未变化的代码，并提供「接受」和「忽略」。接受后关闭面板，保留新增与未变化的代码；忽略后返回未发送状态。',
                '这种处理增加了一次审阅，却给用户留下判断修改范围的机会。设计要解决的不只是结果是否出现，还包括用户能否理解变化，并明确表达自己的选择。',
              ],
            },
            {
              id: 'failure-feedback',
              title: '区分无法生成与请求异常',
              paragraphs: [
                '当 AI 无法给出 SQL 时，原稿探索用多行注释说明原因；网络等问题导致无法返回内容时，则在输入区报错。前者解释内容层面的限制，后者反馈请求本身的异常，让两种失败具有不同的呈现位置。',
                '回看这部分方案，仍需验证原因说明是否适合进入代码区，以及红绿差异是否需要额外的符号与文字标记。',
              ],
            },
          ],
          images: [],
        },
        {
          id: 'delivery-and-reflection',
          title: '上线与回顾',
          paragraphs: [
            '项目已上线，我承担产品界面设计工作。留存设计稿记录了从入口发现、任务输入到生成控制的交互规则，以及结果审阅和异常反馈的探索；上线后的具体反馈与指标尚未纳入本案例。',
            '回看这次设计，核心思路是让自然语言操作依附于编辑任务：用光标与选区建立上下文，用指令标签表达意图，再通过状态反馈与结果审阅保留用户的判断空间。',
            '后续复盘可以围绕入口是否容易发现、指令是否容易理解、生成后的修改是否容易审阅展开，并结合结果采纳情况与失败原因评估体验。',
          ],
          images: [
            {
              src: '/images/text2sql-interaction-design.png',
              caption: 'Text2SQL 早期交互设计稿：入口、唤起、快捷指令、生成过程与结果方案；结果列在原稿中标注为「待定」。',
            },
          ],
          imagesDisclosure: '查看早期交互设计稿',
        },
      ],
    },
    en: {
      showCover: false,
      overviewPrototype: { url: '/prototype/text2sql?embed=1', title: 'Text2SQL Demo', viewportWidth: 1280 },
      tags: ['AI Assistance', 'SQL Editor', 'Product UI Design'],
      paragraphs: [
        'Text2SQL brings natural-language input into SQL editing, supporting generation, debugging, rewriting, and formatting. Users can start a request at the cursor or select existing SQL and describe a change in the context of that code.',
        'I was responsible for product UI design, focusing on fitting AI assistance into the existing editing workflow: contextual entry points, explicit task commands, generation feedback, and a stop action. This case study revisits an early design artifact; the result-review section retains the explorations documented at that stage.',
      ],
      gallery: [],
      sections: [
        {
          id: 'context',
          title: 'Context: connect AI to the editing task already in progress',
          paragraphs: [
            'In a SQL editor, users may be starting a query or working on a statement that needs debugging or adjustment. Both tasks require an expression of intent, but they begin differently: one at the cursor, the other with a specific code selection.',
            'The design addresses three questions: where to start a request, how to identify the task being requested, and how to decide whether to use the result. Entry, input, generation, and result handling form a continuous flow intended to reduce switching between code and assistance.',
          ],
          table: {
            columns: ['Starting point', 'Interaction', 'Design focus'],
            rows: [
              { id: 'from-cursor', cells: ['Start at the cursor', 'A subtle hint on empty lines; activation opens input above the cursor', 'Make assistance discoverable while keeping the editor clear'] },
              { id: 'from-selection', cells: ['Work on existing SQL', 'Selection reveals actions; Edit opens input above the selected code', 'Connect the request location to the code being edited'] },
              { id: 'review-change', cells: ['Decide whether to use a result', 'Explore a diff with accept and dismiss actions', 'Leave room to review changes before applying them'] },
            ],
          },
          images: [],
        },
        {
          id: 'contextual-entry',
          title: 'Contextual entry: organize assistance around the cursor and selection',
          paragraphs: [
            'Entry points appear progressively: a subtle hint on an empty line, then Edit and Add to chat actions when SQL is selected. Context menus and keyboard shortcuts offer additional routes for different working habits.',
          ],
          subsections: [
            {
              id: 'inline-and-sidebar',
              title: 'Keep local edits next to the code',
              paragraphs: [
                'Edit or ⌘K opens an inline input above the cursor when there is no selection, or above the selected SQL when there is one. The input follows the editing target so relevant code remains visible while the user describes a request.',
                'Add to chat and ⌘L provide entry to a side conversation. This artifact details the inline flow and retains the sidebar as an alternative route. Inline input occupies some editing space, so the design also provides a visible close action and an Esc shortcut.',
              ],
            },
            {
              id: 'discoverability',
              title: 'Show guidance when it is useful',
              paragraphs: [
                'Selection actions gain a background on hover, while send and close icons reveal their names and shortcuts. Hints appear with empty lines, selections, and hover states, keeping common actions discoverable without leaving instructions permanently in the editor.',
              ],
            },
          ],
          images: [],
        },
        {
          id: 'task-commands',
          title: 'Explicit intent: support natural language with task commands',
          paragraphs: [
            'An open input supports many requests but can leave users unsure where to start. A slash menu exposes four tasks—SQL generation, debugging, rewriting, and formatting—before users add their specific requirements.',
            'The selected command remains visible as a tag before sending. Users can click the tag to choose another task or clear it with Delete, avoiding an old command carrying over unnoticed.',
            'The command menu closes when other text is entered, and a slash within the request body does not trigger it. This preserves quick selection without interrupting normal typing. The original annotations also replace SQL optimization with SQL rewriting. In retrospect, rewriting names the operation more precisely without implying that every rewrite improves performance.',
          ],
          images: [],
        },
        {
          id: 'generation-feedback',
          title: 'Generation control: visible progress with a way to stop',
          paragraphs: [
            'After sending, a generating message appears below the input and the send action becomes a stop button. The status explains what is happening, while the same action position supports the immediate need to end generation.',
            'Stopping returns to the activated input state so the user can reformulate the request. The path from waiting to stopping stays in the same location, allowing users to end generation according to the needs of their current task.',
            'The input also communicates limits to the accuracy and completeness of AI content. For code assistance, this notice is a starting point: the result presentation still needs to help users inspect specific changes.',
          ],
          images: [],
        },
        {
          id: 'result-review',
          title: 'Result exploration: understand changes before accepting them',
          paragraphs: [
            'The retained artifact marks the result stage as undecided. This section presents the exploration at that time: separating AI generation from user acceptance, with an explicit decision before changes are applied.',
          ],
          subsections: [
            {
              id: 'diff-and-decision',
              title: 'Explain the change through a diff',
              paragraphs: [
                'The proposal uses red for removed code, green for additions, and gray for unchanged lines, alongside accept and dismiss actions. Accepting closes the panel and keeps new and unchanged code; dismissing returns to the unsent state.',
                'This adds a review step but gives users room to judge the scope of a modification. The concern is both whether a result appears and whether people can understand the change and express a clear choice.',
              ],
            },
            {
              id: 'failure-feedback',
              title: 'Distinguish generation limitations from request failures',
              paragraphs: [
                'When AI cannot produce SQL, the draft explores explaining the reason in a multiline comment. When a network or similar issue prevents a response, an error appears in the input area. These locations distinguish a content limitation from a failed request.',
                'Looking back, placing explanations in the code area and supplementing red-green differences with symbols or text still need evaluation.',
              ],
            },
          ],
          images: [],
        },
        {
          id: 'delivery-and-reflection',
          title: 'Launch and reflection',
          paragraphs: [
            'The product launched, and my role was product UI design. The retained artifact records entry points, task input, and generation control, alongside explorations of result review and failure feedback. Specific post-launch feedback and metrics have not yet been incorporated into this case study.',
            'The central idea was to anchor natural-language interaction to the editing task: establish context through the cursor and selection, express intent through command tags, and preserve user judgment through status feedback and result review.',
            'Further review could examine entry-point discovery, command comprehension, and the clarity of generated changes, alongside result acceptance and failure reasons.',
          ],
          images: [
            {
              src: '/images/text2sql-interaction-design.png',
              caption: 'Early Text2SQL interaction design: entry, activation, commands, generation, and result proposals. The result column is marked undecided in the original artifact.',
            },
          ],
          imagesDisclosure: 'View the early interaction design',
        },
      ],
    },
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
  "en": {
    "showCover": false,
    "tags": [
      "0 to 1",
      "Workflow orchestration",
      "Complex interactions"
    ],
    "paragraphs": [
      "A visual workflow editor for data development and analysis, using nodes and connections to express execution order and dependencies.",
      "The design establishes canvas, layout, node-state, and connection rules while balancing flexibility, familiar interactions, and the cost of an initial release."
    ],
    "gallery": [],
    "sections": [
      {
        "id": "context",
        "title": "From isolated tasks to visual orchestration",
        "paragraphs": [
          "Diverse sources and complex processing require integration, transformation, aggregation, and analysis to run in dependency order. A directed acyclic graph makes these relationships visible."
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "Workflow example: nodes and dependencies",
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
        "title": "Target users and initial scope",
        "paragraphs": [
          "Secondary research informed two user hypotheses: data developers combining source, transformation, and SQL tasks; and analysts combining queries, reports, and recurring schedules. Both need understandable, repeatable workflows."
        ],
        "images": []
      },
      {
        "id": "design-principles",
        "title": "Flexible composition with familiar operations",
        "paragraphs": [
          "The initial scope covers creating, connecting, and configuring tasks. Free positioning, automatic layout, and familiar input methods balance flexibility with a manageable first release."
        ],
        "images": []
      },
      {
        "id": "canvas",
        "title": "Decision 1: Familiar canvas controls",
        "paragraphs": [
          "Canvas exploration compared scrollbars, a hand tool, space-drag, wheel and trackpad gestures, and dragging empty space. Empty-space dragging was selected for panning.",
          "Zoom supports buttons, wheel, trackpad, and shortcuts. A 50%–200% range balances overview and readability; adding Shift distinguishes canvas shortcuts from browser zoom."
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "Canvas panning: input methods compared",
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
            "caption": "Canvas zoom: buttons, wheel, trackpad, and shortcuts",
            "sourceRegion": {
              "x": 198,
              "y": 2490,
              "width": 443,
              "height": 315,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          }
        ]
      },
      {
        "id": "layout",
        "title": "Decision 2: Free positioning with automatic layout",
        "paragraphs": [
          "A DAG has no fixed sequence, so fixed layouts were excluded. Free positioning was selected over grid layout for its lower initial implementation cost. Automatic layout helps reorganize scattered nodes while retaining composition flexibility."
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "Node layout alternatives",
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
            "caption": "Automatic node layout",
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
        "title": "Decision 3: Explicit node and connection states",
        "paragraphs": [
          "Comparisons with DMS and DolphinScheduler informed default, hover, selected, and configuration states.",
          "Top-to-bottom connections fit the editor layout. Dragging, snapping, selection, and reconnection feedback make dependency changes visible."
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "Node-state comparison with DMS and DolphinScheduler",
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
            "caption": "Top-to-bottom dependency connections",
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
            "caption": "Connection states: drag, snap, select, and reconnect",
            "sourceRegion": {
              "x": 198,
              "y": 4670,
              "width": 443,
              "height": 710,
              "sourceWidth": 892,
              "sourceHeight": 6000
            }
          }
        ]
      },
      {
        "id": "delivery-and-next",
        "title": "Initial output and next steps",
        "paragraphs": [
          "The initial interaction specification covers canvas movement and zoom, node layout, node states, and connections. The source article describes an early version, not a complete data-development lifecycle.",
          "Additional node types, versioning, batch operations, configuration checks, recommendations, and natural-language workflow generation remain future directions.",
          "Future validation could examine first-workflow completion, configuration and connection errors, and the effort required to organize complex workflows."
        ],
        "images": []
      },
      {
        "id": "design-notes",
        "title": "Design process notes",
        "paragraphs": [
          "The original article records input-method comparisons, layout tradeoffs, and detailed node and connection states."
        ],
        "images": [
          {
            "src": "/images/workflow-editor-design-article.png",
            "caption": "Original article: Designing a workflow editor from zero to one"
          }
        ],
        "imagesDisclosure": "Read the original design analysis"
      }
    ]
  }
},
  'design-token': {
    zh: { showCover: false, tags: ['设计系统'], paragraphs: ['内容准备中。'], gallery: [] },
    en: { showCover: false, tags: ['Design System'], paragraphs: ['Content in preparation.'], gallery: [] },
  },
  skills: {
    zh: {
      showCover: false,
      tags: ['设计工程', 'Skills'],
      paragraphs: ['将组件用法、工程安装与交互约束整理为 Skill，结合组件库应用于 AI 智能问数、记忆插件及官网开发，交付页面与组件代码。'],
      gallery: [
        { src: '/images/aidesignsystem-skill-exploration.jpg', caption: 'Skill 探索' },
        { src: '/images/aidesignsystem-design-agent.jpg', caption: '设计 Agent 搭建' },
      ],
    },
    en: {
      showCover: false,
      tags: ['Design Engineering', 'Skills'],
      paragraphs: ['Documented component usage, project setup, and interaction constraints in Skills, then applied them with the component library to AI analytics Q&A, the memory plugin, and product websites to deliver page and component code.'],
      gallery: [
        { src: '/images/aidesignsystem-skill-exploration.jpg', caption: 'Skill exploration' },
        { src: '/images/aidesignsystem-design-agent.jpg', caption: 'Design Agent setup' },
      ],
    },
  },
  'design-md': {
    zh: { showCover: false, tags: ['设计规范'], paragraphs: ['内容准备中。'], gallery: [] },
    en: { showCover: false, tags: ['Design Guidelines'], paragraphs: ['Content in preparation.'], gallery: [] },
  },
  databaseops: {
    en: {
      showCover: false,
      tags: ['Self-service UX', 'User journey mapping', 'Event instrumentation', '2022.01–2024.06'],
      paragraphs: [],
      sections: [
        {
          "id": "design-goals",
          placement: 'overview',
          hideTitle: true,
          "title": "Background and goals",
          paragraphs: [
            'OceanBase supports enterprise database configuration and operations. Expansion into SME and overseas markets calls for independent trials and core-task completion to support paid conversion and reduce technical support costs.',
            'The project focuses on new-user self-service, using end-to-end diagnosis to narrow the design scope to migration-task creation.',
          ],
          table: {
            columns: ['Item', 'Description'],
            rows: [
              { id: 'target-users', cells: ['Target users', 'First-time console users with basic database operations knowledge'] },
              { id: 'design-goal', cells: ['Design goal', 'Improve task completion and operating efficiency during data migration'] },
              { id: 'success-metrics', cells: ['Success metrics', 'Task completion target: 80%\nTime-on-task target: 5 minutes'] },
            ],
          },
          "images": []
        },
        {
          id: 'diagnosis',
          title: 'End-to-end experience diagnosis',
          paragraphs: [],
          subsections: [
            {
              id: 'target-users',
              title: '1. Target users',
              hideTitle: true,
              paragraphs: ['The end-to-end journey from product discovery to paid use was mapped around self-service needs in SME and overseas markets, identifying friction at three key stages.'],
            },
            {
              id: 'journey-map',
              title: '2. Journey map',
              hideTitle: true,
              paragraphs: [],
              listItems: [
                [
                  { text: 'Website discovery: ', bold: true },
                  { text: 'Unclear product information and trial entry points made it difficult for users to understand the product and start a trial;' },
                ],
                [
                  { text: 'Trial and ordering: ', bold: true },
                  { text: 'Disconnected steps and complex configuration made it difficult for users to progress from applying for a trial to getting it ready to use;' },
                ],
                [
                  { text: 'Data migration: ', bold: true },
                  { text: 'Interruptions in task creation and complex object configuration reduced independent task completion and operating efficiency.' },
                ],
              ],
              images: [{ src: '/images/databaseops-ux-map.jpg', caption: 'User experience map' }],
            },
          ],
          images: [],
        },
        {
          id: 'migration-analysis',
          title: 'Migration bottlenecks',
          paragraphs: ['Following the end-to-end diagnosis, optimization focused on the self-service data migration experience. Conversion across migration-task creation stages was analyzed using event instrumentation to identify the main drop-off points.'],
          subsections: [
            {
              id: 'instrumentation',
              mediaFirst: true,
              title: '1. Pinpoint the interaction problems',
              paragraphs: ['Analysis of the original creation flow, competitors, and frontline SA interviews identified two key barriers to independent task completion:'],
              listItems: [
                [
                  { text: 'Interruptions in task creation reduce completion: ', bold: true },
                  { text: 'Data-source preparation and account authorization required leaving the current flow. Repeated configuration on return increased the risk of task interruption and abandonment.' },
                ],
                [
                  { text: 'Complex object configuration increases time on task: ', bold: true },
                  { text: 'Selecting migration objects relied on wildcard rules, with insufficient guidance for filtering and aggregation. Users had to repeatedly search for instructions and experiment.' },
                ],
              ],
              funnel: getDatabaseOpsFunnel('en'),
              imagesLayout: 'row',
              images: [
                { src: '/images/databaseops-source-selection.png', caption: 'Original workflow: select data sources' },
                { src: '/images/databaseops-migration-scope.png', caption: 'Original workflow: select the migration scope' },
              ],
            },
          ],
          images: [],
        },
        {
          id: 'design-opportunities',
          title: 'Design opportunities',
          paragraphs: ['Translated the identified bottlenecks into design strategies, success metrics, and optimization approaches.'],
          table: {
            columns: ['Design strategy', 'Optimization approach', 'Metric'],
            rows: [
              { id: 'shorten-creation', cells: ['Connect core steps', 'Bring data-source preparation, saved configuration, and guidance into task creation', 'Task completion rate'] },
              { id: 'object-selection', cells: ['Optimize object selection', 'Offer selection methods for different experience levels and simplify rule configuration and filtering', 'Time on task'] },
            ],
          },
          images: [],
        },
        {
          id: 'interaction',
          title: 'Optimization 1: Connect core steps',
          paragraphs: [],
          subsections: [
            {
              id: 'continuous-setup',
              prototypeEmbed: { url: 'https://oah5w3.axshare.com/#id=hlu8jh&p=%E2%91%A0_%E9%80%89%E6%8B%A9%E7%9B%AE%E6%A0%87%E7%AB%AF-%E6%96%B0%E5%BB%BA-ob%E6%96%87%E6%A1%A3&c=1&sc=1', title: 'Interactive migration creation prototype' },
              hideTitle: true,
              title: '1. Connect the task flow and guide users at the point of need',
              paragraphs: [
                'Connect the full flow from data-source connection (source and target) → migration-type setup → migration-object selection. Integrate data-source preparation, configuration saving and reuse, and contextual guidance (such as allowlist configuration and account authorization) into task creation to reduce interruptions and repeated setup.',
              ],
              table: {
                columns: ['Design focus', 'Original friction', 'Design response'],
                rows: [
                  { id: 'in-flow-source', cells: ['Prepare sources in the flow', 'Users leave task creation to prepare connection information.', 'Offer existing and new data sources within the current step.'] },
                  { id: 'save-source', cells: ['Save configuration for reuse', 'Repeated entry increases the cost of configuring a source again.', 'Provide Save data-source information with a name and notes so the configuration can be reused later.'] },
                  { id: 'contextual-help', cells: ['Place guidance beside configuration', 'Permission requirements and connection constraints require repeated documentation searches.', 'Embed constraints, account authorization instructions, and precautions in a right-hand help panel.'] },
                ],
              },
              closingParagraphs: [
                'Explore stepper layouts to make better use of screen space, keeping task structure and progress clear while leaving more room for form configuration and help documentation.',
              ],
              comparison: {
                id: 'stepper-design',
                title: 'Stepper component optimization',
                description: 'Task structure and progress presentation',
                paragraphs: ['Compare progress visibility and space usage across horizontal and vertical layouts. These early animations retain the step names used during exploration.'],
                options: [
                  {
                    id: 'horizontal-stepper',
                    title: 'Horizontal stepper: bar-shaped nodes',
                    paragraphs: [],
                    listItems: [
                      'Uses little vertical space and follows a familiar top-to-bottom reading order.',
                      'Many steps or long labels can wrap and consume horizontal space.',
                    ],
                    images: [{ src: '/images/databaseops-stepper-horizontal.gif', caption: '' }],
                  },
                  {
                    id: 'vertical-stepper',
                    title: 'Vertical stepper: dot-shaped nodes',
                    paragraphs: [],
                    listItems: [
                      'Separates progress from content to focus attention on the current task.',
                      'Uses horizontal space and needs adaptation on narrow screens; step states must distinguish it from navigation.',
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
          title: 'Optimization 2: Redesign object selection',
          paragraphs: [
                'The original editor required users to write wildcard rules before they could select migration objects. This made knowledge of syntax a prerequisite, even for users who simply wanted to select visible objects.',
                'Three selection methods accommodate different levels of rule familiarity and existing object lists. Direct selection lowers the entry barrier; visual rules and file import support batch configuration.',
              ],
          subsections: [
            {
              id: 'structured-object-selection',
              prototypeEmbed: { url: 'https://oah5w3.axshare.com/#id=fm7s0q&p=%E2%91%A0_%E8%A7%84%E5%88%99%E5%8C%B9%E9%85%8D&c=1&sc=1', title: 'Interactive object-selection prototype' },
              mediaFirst: true,
              hideTitle: true,
              title: '2. Offer different paths through complex object selection',
              paragraphs: [],
              table: {
                columns: ['Interaction method', 'Users and task context', 'Design response'],
                rows: [
                  { id: 'transfer-selection', cells: ['Transfer-list selection', 'Users unfamiliar with rule syntax who want to select visible objects.', 'Select objects from the source list and move them into the selected list, making the selection explicit.'] },
                  { id: 'visual-rules', cells: ['Visual rule configuration', 'Users familiar with matching logic who need to select objects in batches.', 'Configure rules through a visual form, reducing the need to write wildcard syntax in an editor.'] },
                  { id: 'file-import', cells: ['File import', 'Users with a prepared object list who need batch configuration.', 'Import a file to reuse the prepared list and reduce repeated selection or entry.'] },
                ],
              },

            },
            {
              id: 'rule-filter-component',
              hideTitle: true,
              title: 'Rule-selection component',
              paragraphs: ['Beyond selecting database objects, migration also requires data filtering. A reusable rule-selection component organizes fields, operators, and values, with AND/OR conditions and nested groups to express complex filters.'],
              imagesDisclosure: 'Rule-selection component',
              images: [{ src: '/images/databaseops-rule-filter-component.png', caption: 'Data filtering: condition groups, nested rules, and interaction specifications' }],
            },
          ],
          images: [],
        },
        {
          id: 'outcomes',
          title: 'Validation results',
          paragraphs: [[{ text: 'Used ' }, { text: 'prototype', href: DATABASE_OPS_PROTOTYPE_URL }, { text: ' user testing to validate the migration creation flow, alongside event instrumentation to observe task completion after release.' }]],
          subsections: [
            {
              id: 'post-release-measurement',
              hideTitle: true,
              title: 'Validation results',
              paragraphs: [],
              listItems: [
                [{ text: 'Task completion increased from 16.8% to ' }, { text: '75%', bold: true }, { text: '.' }],
                'Time on task was affected by other factors and did not meet the target, but target users gave positive feedback on the object-selection interaction.',
              ],
            },
          ],
          images: [],
        },
      ],
      gallery: [],
    },
    zh: {
      showCover: false,
      tags: ['自助体验', '用户地图', '数据埋点', '2022.01–2024.06'],
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
              { id: 'target-users', cells: ['目标用户', '有一定数据库运维基础、首次接触控制台的新用户'] },
              { id: 'design-goal', cells: ['设计目标', '提高数据迁移环节的任务完成率和操作效率'] },
              { id: 'success-metrics', cells: ['衡量标准', '任务完成率目标：80%\n任务耗时目标：5 分钟'] },
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
                  { text: '创建流程易中断：', bold: true },
                  { text: '数据源准备与账号授权需要离开当前流程，返回后需重复配置，增加任务中断与放弃的风险。' },
                ],
                [
                  { text: '对象配置理解成本高：', bold: true },
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
                '串联“连接数据源（源端与目标端）→ 设置迁移类型 → 选择迁移对象”的完整链路，将数据源准备、配置保存与复用、帮助查阅（白名单配置、账号授权等）整合至任务创建流程，降低流程中断与重复配置成本。',
              ],
              table: {
                columns: ['设计重点', '原有卡点', '优化处理'],
                rows: [
                  { id: 'in-flow-source', cells: ['流程内准备数据源', '选择数据源时，仍需离开创建流程准备连接信息。', '在当前步骤提供「已有数据源 / 新建数据源」，将数据源准备纳入任务链路。'] },
                  { id: 'save-source', cells: ['保存配置供后续复用', '数据源信息需要重复填写，增加重新配置的成本。', '提供「保存数据源信息」，填写名称与备注，便于后续通过已有数据源复用配置。'] },
                  { id: 'contextual-help', cells: ['配置与引导并置', '权限要求与连接限制分散，用户需反复查找文档。', '在配置区右侧嵌入限制条件、账号授权与注意事项，支持配置过程中的即时查阅。'] },
                ],
              },
              closingParagraphs: [
                '为提升整体屏幕空间利用率，探索步骤条组件的布局优化，在清晰呈现任务结构与进度的同时，为表单配置和帮助文档保留更多展示空间。',
              ],
              comparison: {
                id: 'stepper-design',
                title: '步骤条组件优化',
                description: '任务结构与进度呈现',
                paragraphs: ['从进度识别与空间占用两个维度对比横向、纵向布局。以下动图展示早期探索方案，沿用该版本的步骤名称。'],
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
                '原流程依赖编辑器编写通配规则，用户需掌握规则语法后才能选择迁移对象。对于直接选择可见对象的场景，这一前置要求增加了理解与操作成本。',
                '根据用户的规则熟悉程度与已有对象清单，提供三种选择方式：直接勾选降低使用门槛，白屏规则配置与文件导入支持批量操作。',
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
                  { id: 'transfer-selection', cells: ['穿梭框勾选', '不熟悉规则语法、需要直接选择可见对象的用户。', '从源端列表勾选并移入已选列表，明确呈现选择范围。'] },
                  { id: 'visual-rules', cells: ['白屏规则配置', '了解匹配逻辑，需要按条件批量选择对象的用户。', '通过可视化表单配置规则，降低在编辑器中手写通配语法的负担。'] },
                  { id: 'file-import', cells: ['文件导入', '已有对象清单，需要批量配置的用户。', '通过导入文件复用已有准备材料，减少重复选择和录入。'] },
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
    en: {
      tags: ['Developer Tools', 'Design System', 'B2B SaaS'],
      paragraphs: [
        'Several standalone data development editors—table operations, pipeline orchestration, dashboards, and more—suffered from inconsistent interaction, heavy workflows, and dated visuals, hurting productivity and retention. Without stopping the business, we needed to systematically align the tool matrix, build a sustainable design system, and lift satisfaction and platform stickiness.',
      ],
      responsibilities: {
        intro: 'As an experience designer, I focused on:',
        items: [
          {
            title: 'Diagnosis & strategy',
            body:
              'Ran multiple rounds of developer usability tests and depth interviews to pinpoint gaps in table workflows, dark-mode coverage, pipeline orchestration, and more—then defined a refactor roadmap aimed at developer efficiency and platform stickiness.',
          },
          {
            title: 'Standardization & delivery',
            body:
              'Led a standardized editor experience overhaul: unified global layout and interaction patterns, deep interaction work on tables, pipelines, and dashboards, and a systematic, professional-grade dark mode.',
          },
          {
            title: 'Validation & iteration',
            body:
              'Combined feedback, usability tests, analytics, and AI-assisted insights into a validation loop so the tools keep gaining professionalism and ease of use.',
          },
        ],
      },
      afterResponsibilities: [
        'Satisfaction across the product matrix rose from 4.7 to 6.2 (out of 7), while the user base doubled.',
      ],
      gallery: [
        { src: '/images/datadevelop-sql-editor.jpg', caption: 'SQL editor' },
        { src: '/images/datadevelop-table-spec.jpg', caption: 'Data table redesign' },
        { src: '/images/datadevelop-workflow.jpg', caption: 'Task flow editor' },
        { src: '/images/datadevelop-darkmode.jpg', caption: 'Dark mode' },
      ],
    },
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
    en: {
      tags: ['Agent Operations', 'Observability', 'AI Product'],
      paragraphs: [
        'AgentOps is a workspace for operating AI Agents in production, from task visibility to debugging and iteration.',
        'The experience brings run status, execution context, and failure recovery into one workflow so teams can improve Agent reliability over time.',
      ],
      gallery: [{ src: '/images/work-6.webp', caption: 'AgentOps workspace concept' }],
    },
    zh: {
      tags: ['Agent 运维', '可观测性', 'AI 产品'],
      paragraphs: [
        'AgentOps 是面向 AI Agent 生产运行的工作台，覆盖任务可见性、调试和持续迭代。',
        '通过统一呈现运行状态、执行上下文和失败恢复路径，帮助团队持续提升 Agent 的稳定性与可控性。',
      ],
      gallery: [{ src: '/images/work-6.webp', caption: 'AgentOps 工作台概念' }],
    },
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
  return locale === 'zh' ? row.zh : row.en
}
