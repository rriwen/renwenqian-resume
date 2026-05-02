import type { Locale } from '../i18n/translations'

export type ProjectDetailHighlight = {
  /** 列表项关键词，渲染为加粗 */
  keyword: string
  /** 关键词后的说明正文 */
  text: string
}

export type ProjectGalleryItem = {
  src: string
  /** 配图下方说明（与 locale 一致的语言） */
  caption: string
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

/** 单行正文片段；bold 为 true 时渲染为加粗 */
export type ProjectDetailParagraphRun = { text: string; bold?: boolean }

/** 普通字符串整段，或由片段拼接（用于段内局部强调） */
export type ProjectDetailParagraph = string | ProjectDetailParagraphRun[]

export type ProjectDetailBlock = {
  tags: string[]
  paragraphs: ProjectDetailParagraph[]
  /** 段落之后：结构化职责说明（引言 + 列表 + 可选嵌套小标题） */
  responsibilities?: ProjectDetailResponsibilities
  /** 职责说明之后、要点列表之前的补充段落 */
  afterResponsibilities?: string[]
  /** 段落之后、外链之前的要点列表（关键词加粗） */
  highlightBullets?: ProjectDetailHighlight[]
  /** 为 true 时要点列表渲染为有序列表（1. 2. 3.） */
  highlightBulletsOrdered?: boolean
  /** 要点列表之后、外链之前的一段补充说明 */
  afterHighlightBullets?: string
  /** 可选外链，展示为「查看站点」类 CTA */
  externalUrl?: string
  /** 详情页画廊，可为封面与其它作品图组合 */
  gallery: ProjectGalleryItem[]
}

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
          keyword: 'Full-stack AI design & development',
          text: 'Solo end-to-end visual design, content planning, and front-end work for the marketing site and memory admin; used AI tools to compress design-to-launch to two weeks for a one-person full-stack delivery.',
        },
      ],
      afterHighlightBullets:
        'The product was incubated and went live within two weeks; it is now in public beta, and commercialization planning is underway.',
      externalUrl: 'https://m0.seekdb.ai/',
      gallery: [
        { src: '/images/work-5.webp', caption: 'Memory management interaction.' },
        { src: '/images/work-4.webp', caption: 'Experience accumulation logic.' },
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
          keyword: '全栈 AI 设计与开发',
          text: '独立完成产品官网与记忆管理后台的视觉设计、内容规划、前端开发；借助 AI 工具将设计到上线的周期压缩至 2 周，实现单人全栈快速交付。',
        },
      ],
      afterHighlightBullets:
        '产品在两周内快速孵化落地，目前已进入公测阶段、正在启动商业化规划。',
      externalUrl: 'https://m0.seekdb.ai/',
      gallery: [
        { src: '/images/work-5.webp', caption: '记忆管理交互' },
        { src: '/images/work-4.webp', caption: '经验沉淀逻辑' },
      ],
    },
  },
  datapilot: {
    en: {
      tags: ['Web App', 'Data Product', 'B2B'],
      paragraphs: [
        'OceanBase Datapilot brings AI-assisted workflows into the database operator’s daily toolkit—bridging complex metadata, diagnostics, and natural-language intent.',
        'The project focused on progressive disclosure for expert users, consistent language across SQL and conversational entry points, and states that stay legible under load and partial failures.',
      ],
      gallery: [
        { src: '/images/work-3.webp', caption: 'Conversational workspace — NL intent and assisted flows.' },
        { src: '/images/work-6.webp', caption: 'Diagnostics — signals, recommendations, and drill-down.' },
      ],
    },
    zh: {
      tags: ['Web 应用', '数据产品', 'B 端'],
      paragraphs: [
        'Datapilot 是面向业务团队的 AI 智能数据分析产品。公司希望基于现有的 Text2SQL 技术进行产品化落地，降低数据使用门槛的同时寻找产品商业化路径。初期产品技术方案仅靠提示词工程，AI 生成 SQL 的准确率仅 25%，远未达到可用标准，用户对结果缺乏信任，产品面临失败风险。',
      ],
      responsibilities: {
        intro: '我作为产品设计师主要负责：',
        items: [
          {
            title: '产品规划与立项',
            body: '参与技术可行性验证、产品设计优化到商业化探索的完整路线图规划，洞察市场空白，推动产品从 0 到 1 立项。',
          },
          {
            title: '技术共研与产品转译',
            body:
              '初期提示词效果不佳，通过对业务人员深度访谈和竞品分析，发现瓶颈在于技术术语与业务语义的鸿沟，因此提出引入「指标层」作为语义中介，并主导将这一技术方案转化为用户可理解的交互语言（如自然语言映射、指标层管理和推荐、结果解释）。',
          },
          {
            title: '产品体验设计和创新',
            nested: [
              {
                title: '解决 AI 黑盒问题',
                body:
                  '针对用户对 AI 生成结果不信任的痛点，主导设计 AI 执行过程可视化与分支管理交互，让用户能够查看 SQL 生成逻辑、理解每一步推理依据，并在必要时进行分支干预。',
              },
              {
                title: '设计验证',
                body:
                  '通过可用性测试与用户反馈收集，验证了可视化交互对信任建立的有效性，用户对结果的采纳率提升至 60% 以上。',
              },
              {
                title: '设计模式沉淀',
                body:
                  '形成了一套可复用的 AI 产品交互设计模式（执行过程可视化 + 分支管理 + 语义中介解释），为后续 AI 产品的设计提供参考框架。',
              },
            ],
          },
        ],
      },
      afterResponsibilities: [
        '通过客户拜访发现，指标层的配置过程仍存在理解成本与操作门槛，成为产品从「可用」走向「好用」的核心瓶颈。用户需要理解技术语义、手动映射字段，配置成本高，直接影响自助使用率。',
        '产品二期正在计划引入自然语言交互，用户通过对话式描述直接生成指标配置，降低学习成本与操作步骤；同时探索模板化配置、智能推荐等设计策略，进一步平滑上手体验，提升易用性体验。',
      ],
      gallery: [
        { src: '/images/work-3.webp', caption: '指标层管理' },
        { src: '/images/work-6.webp', caption: 'AI 对话交互模式' },
      ],
    },
  },
  aidesignsystem: {
    en: {
      tags: ['Design System', 'Interaction patterns', 'Iteration efficiency'],
      paragraphs: [
        'With multiple AI products (intelligent analytics Q&A, dev assistant, ops assistant, and more) iterating in parallel, the team hit the usual pain points—inconsistent design, reinventing patterns, and high delivery cost—without unified design assets and standards.',
        'I led the AI design system from 0 to 1: reusable components and interaction patterns that raise cross-product consistency and team iteration speed.',
      ],
      highlightBullets: [
        {
          keyword: 'Shared abstraction',
          text: 'Mapped common capabilities and interaction scenarios across AI products, abstracting core components and patterns such as prompt input, chain-of-thought display, and message cards.',
        },
        {
          keyword: 'Standards & documentation',
          text: 'Defined design standards (visual, interaction, copy, motion), and shipped a component library with usage docs.',
        },
        {
          keyword: 'Multi-product rollout',
          text: 'Drove adoption of the design system across multiple product lines.',
        },
      ],
      afterHighlightBullets:
        'It became standardized AI product design assets for the team, with reuse across product lines exceeding 70%.',
      gallery: [
        { src: '/images/work-5.webp', caption: 'Prompt input & message patterns — shared primitives.' },
        { src: '/images/work-4.webp', caption: 'Chain-of-thought and structured reasoning display.' },
        { src: '/images/work-6.webp', caption: 'Component coverage across AI product surfaces.' },
        { src: '/images/work-3.webp', caption: 'Docs and usage notes for adoption.' },
      ],
    },
    zh: {
      tags: ['设计系统', '交互模式', '迭代效率'],
      paragraphs: [
        '团队在多个 AI 产品（智能问数、开发助手、运维助手等）并行迭代过程中，面临设计不一致、重复造轮子、开发成本高等典型问题，缺乏统一的设计资产与规范。',
        '我主要负责：从 0 到 1 规划并建设 AI 设计系统，沉淀可复用的组件与交互模式，提升跨产品设计一致性及团队迭代效率。',
      ],
      highlightBullets: [
        {
          keyword: '共性抽象',
          text: '梳理各 AI 产品的共性能力与交互场景，抽象出 Prompt 输入、思维链展示、消息卡片等核心组件及对应交互模式。',
        },
        {
          keyword: '规范与文档',
          text: '制定部分核心组件交互规范（Prompt 输入、思维链展示、消息卡片等），输出组件库。',
        },
        {
          keyword: '多线落地',
          text: '形成团队 AI 产品设计的标准化资产，在多条产品线中复用率超过 70%。',
        },
      ],
      afterHighlightBullets: '近期，探索利用 Skill 提供组件约束和工程安装说明，能实现一句话搭建简单的 AI 对话应用。',
      gallery: [
        { src: '/images/work-5.webp', caption: 'Prompt 输入交互' },
        { src: '/images/work-4.webp', caption: '思维链与结构化推理' },
      ],
    },
  },
  databaseops: {
    en: {
      tags: ['Ops Platform', 'Self-service UX', 'Data migration'],
      paragraphs: [
        [
          { text: 'At the company level, the goal is a ' },
          { text: 'database ops platform', bold: true },
          {
            text:
              ' people can self-serve in roughly three steps within five minutes. In practice, ordering, data migration, dev change approval, and other core flows still leaned heavily on technical support—far from that bar.',
          },
        ],
        'As an experience designer, I focused on diagnosing the data-migration experience, rebuilding the core task flow, and moving self-service rates toward the company’s three-steps-five-minutes target.',
      ],
      highlightBullets: [
        {
          keyword: 'Diagnosis & opportunities',
          text:
            'Combined surveys, interviews, and analytics: self-service was only about 15%. Journey mapping for migration surfaced bottlenecks—hard-to-use object filtering, unclear step guidance, and inaccurate instructions.',
        },
        {
          keyword: 'Agile design & interaction rework',
          text:
            'Ran a design sprint: in one week we shipped a rebuilt core flow and high-fidelity prototypes (end-to-end steps, redesigned filtering), then tested immediately with users.',
        },
        {
          keyword: 'Cross-team rollout & measurement',
          text:
            'Worked closely with product and engineering to validate, break down, and ship iterations; tightened instrumentation to monitor impact and keep improving.',
        },
      ],
      afterHighlightBullets:
        'After iteration, self-service completion on the core chain rose from 15% to over 75%, much closer to the three-steps-five-minutes vision, and customer support effort dropped by roughly 20%.',
      gallery: [
        { src: '/images/work-6.webp', caption: 'Change list — dense table with clear hierarchy.' },
        { src: '/images/work-7.webp', caption: 'Health overview — signals and status at a glance.' },
        { src: '/images/work-2.jpg', caption: 'Approval path — gates before production risk.' },
        { src: '/images/work-5.webp', caption: 'Single control surface — tickets, signals, and actions.' },
      ],
    },
    zh: {
      tags: ['运维平台', '自助体验', '数据迁移'],
      paragraphs: [
        [
          { text: '公司层面致力于打造' },
          { text: '数据库运维平台', bold: true },
          {
            text:
              '的「三步五分钟」快速上手的自助化体验，然而用户下单、数据迁移、开发变更审批等平台核心链路操作仍大量依赖技术支持，与目标存在巨大差距。',
          },
        ],
        '我作为体验设计师，主要负责深度诊断平台自助率现状，定位数据迁移场景的体验瓶颈，重构核心任务流程，将用户自助率提升至符合公司「三步五分钟」目标的水平。',
      ],
      highlightBullets: [
        {
          keyword: '问题诊断与机会点挖掘',
          text:
            '通过梳理平台核心链路的用户体验地图，精准定位 3+ 核心瓶颈和卡点；综合运用问卷、用户访谈与埋点数据分析数据迁移场景，洞察自助率仅 15%，识别迁移对象过滤上手难、步骤引导混乱、操作指引不准确等卡点。',
        },
        {
          keyword: '敏捷设计与交互重构',
          text:
            '采用设计冲刺方法，一周内协同团队快速产出重构后的核心任务流程与高保真交互原型（包括步骤串联、对象过滤交互重构等），并组织 3+用户测试验证。',
        },
        {
          keyword: '协同推动与效果闭环',
          text:
            '紧密协同产品与研发团队，快速验证方案并拆解迭代、推动上线；通过细化埋点持续监控数据表现，驱动持续优化。',
        },
      ],
      afterHighlightBullets:
        '通过持续的迭代优化，核心任务链路的用户自助完成率从 15% 提升至 75% 以上，大幅接近「三步五分钟」目标，且客户技术支持成本显著降低约 20%。',
      gallery: [
        { src: '/images/work-6.webp', caption: '对象过滤交互重构' },
        { src: '/images/work-7.webp', caption: '帮助引导优化' },

      ],
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
        'Satisfaction across the product matrix rose from 4.8 to 6.2 (out of 7), while active users roughly doubled.',
      ],
      gallery: [
        { src: '/images/work-7.webp', caption: 'SQL editor' },
        { src: '/images/work-3.webp', caption: 'Data table redesign' },
        { src: '/images/work-5.webp', caption: 'Task flow editor' },
        { src: '/images/work-6.webp', caption: 'Dark mode' },
      ],
    },
    zh: {
      tags: ['开发者工具', '设计体系', 'B 端体验'],
      paragraphs: [
        '多个独立的数据开发编辑器（数据表操作、任务流编排、仪表盘等）存在交互不一致、操作繁琐、视觉陈旧问题，严重影响开发效率与用户留存。需要在不中断业务的前提下，系统性提升工具矩阵的体验一致性，构建可持续的设计体系，提升用户满意度与平台粘性。',
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
        '目前整个产品矩阵的用户满意度从 4.8 分大幅提升至 6.2 分（满分 7 分），驱动用户数实现翻倍增长。',
      ],
      gallery: [
        { src: '/images/work-7.webp', caption: 'SQL 编辑器' },
        { src: '/images/work-3.webp', caption: '数据表格重构' },
        { src: '/images/work-5.webp', caption: '任务流编辑器' },
        { src: '/images/work-6.webp', caption: '暗黑模式' },
      ],
    },
  },
  designagent: {
    en: {
      tags: ['Prototype', 'Design Agent', 'Demo'],
      paragraphs: [
        'Design Agent (Demo) prototypes how generative assistants sit beside the canvas—suggesting variants, constraints, and rationale without taking over the file.',
        'The demo prioritizes reversible actions, visible prompts, and a tight loop between “ask” and “inspect diff” so reviewers stay in control.',
      ],
      gallery: [
        { src: '/images/work-4.webp', caption: 'Canvas + assistant — variants beside the file.' },
        { src: '/images/work-2.jpg', caption: 'Visible prompts — exploring options without losing context.' },
        { src: '/images/work-7.webp', caption: 'Diff review — tight ask → inspect loop.' },
        { src: '/images/work-5.webp', caption: 'Constraints & rationale — why the suggestion fits.' },
      ],
    },
    zh: {
      tags: ['原型', '设计智能体', '演示'],
      paragraphs: [
        'Design Agent（演示）探索生成式助手如何与画板并存——在建议方案、约束与依据的同时，不剥夺设计师对文件的掌控。',
        '演示强调可撤销操作、可见的提示词，以及「提问」与「查看差异」之间的紧凑闭环，便于评审者把握节奏。',
      ],
      gallery: [
        { src: '/images/work-4.webp', caption: '画板与助手 — 方案与文件并排。' },
        { src: '/images/work-2.jpg', caption: '提示词可见 — 探索选项且不丢上下文。' },
        { src: '/images/work-7.webp', caption: '差异检视 — 提问到查看的紧凑闭环。' },
        { src: '/images/work-5.webp', caption: '约束与依据 — 说明方案为何成立。' },
      ],
    },
  },
}

export function getProjectDetail(slug: string, locale: Locale): ProjectDetailBlock | undefined {
  const row = details[slug]
  if (!row) return undefined
  return locale === 'zh' ? row.zh : row.en
}
