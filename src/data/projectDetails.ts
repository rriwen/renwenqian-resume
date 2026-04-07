import type { Locale } from '../i18n/translations'

export type ProjectDetailHighlight = {
  /** 列表项关键词，渲染为加粗 */
  keyword: string
  /** 关键词后的说明正文 */
  text: string
}

export type ProjectDetailBlock = {
  tags: string[]
  paragraphs: string[]
  /** 段落之后、外链之前的要点列表（关键词加粗） */
  highlightBullets?: ProjectDetailHighlight[]
  /** 要点列表之后、外链之前的一段补充说明 */
  afterHighlightBullets?: string
  /** 可选外链，展示为「查看站点」类 CTA */
  externalUrl?: string
  /** 详情页画廊，可为封面与其它作品图组合 */
  gallery: string[]
}

const details: Record<string, { en: ProjectDetailBlock; zh: ProjectDetailBlock }> = {
  karmaverse: {
    en: {
      tags: ['Memory Systems', 'Agent-Friendly', 'Product Design'],
      paragraphs: [
        'seekdb M0 is a lightweight memory plugin for OpenClaw, focused on solving hard-to-recall key information, high token use, and slow responses in long-running collaboration.',
        'It turns fragmented OpenClaw dialogues into searchable, reusable memory content—supporting intent and fact recall across long collaborations with lower token use and faster responses. It also automatically extracts experience from OpenClaw’s execution, validates and refines it over multiple rounds, and keeps OpenClaw’s working knowledge evolving.',
        'I owned product innovation exploration (one-click deployment, memory retrieval, experience validation, and related mechanisms), plus full-stack design and development for the marketing site and product surfaces—delivered end-to-end with AI-assisted coding.',
      ],
      highlightBullets: [
        {
          keyword: 'One-click deployment',
          text: 'Designed a Skills + prompt-based one-click rollout so users can enable memory capabilities without complex configuration.',
        },
        {
          keyword: 'Memory capture & retrieval',
          text: 'Built on existing database approaches—automatic capture and a retrievable memory architecture for intent and fact recall, with lower token use and faster responses.',
        },
        {
          keyword: 'Experience validation',
          text: 'Designed multi-round validation so the agent extracts distilled experience, cross-checks it, and refines from feedback—driving continuous evolution of working knowledge.',
        },
        {
          keyword: 'Full-stack design & development',
          text: 'End-to-end visual design, content planning, and front-end work for the marketing site and memory admin—using AI coding tools throughout.',
        },
      ],
      afterHighlightBullets:
        'The product was incubated and launched within about two weeks; it is now in public beta while we shape commercialization plans.',
      externalUrl: 'https://m0.seekdb.ai/',
      gallery: ['/images/work-5.webp', '/images/work-4.webp'],
    },
    zh: {
      tags: ['记忆系统', 'Agent 友好', '产品设计'],
      paragraphs: [
        'seekdb M0 是面向 OpenClaw 轻量级的记忆插件，核心解决 OpenClaw 在长周期协作中关键信息难回溯、token 消耗高、响应耗时的问题。',
        '支持将 OpenClaw 零散对话沉淀为可检索、可复用的记忆内容，支撑长周期协作中的意图与事实回溯，更低 token 消耗和响应时长；同时自动提取 OpenClaw 工作执行的经验并进行多轮验证和优化，驱动 OpenClaw 的工作经验持续迭代进化。',
        '我主要负责：产品创新探索（一键部署、记忆检索、经验验证机制等），官网及产品端界面的全栈设计与开发（全程 AI Coding）。',
      ],
      highlightBullets: [
        {
          keyword: '一键部署',
          text: '设计基于 Skills + 提示词的一键部署方案，用户无需复杂配置即可启用记忆能力；',
        },
        {
          keyword: '记忆沉淀与检索',
          text: '复用现有数据库方案，设计自动沉淀、可检索的记忆架构，支撑意图与事实回溯，同时降低 token 消耗与响应时长；',
        },
        {
          keyword: '经验验证机制',
          text: '设计多轮验证流程，让 Agent 自动提取已沉淀的经验并进行交叉验证、反馈优化，驱动工作经验的持续迭代进化；',
        },
        {
          keyword: '全栈设计开发',
          text: '全程使用 AI 编码工具完成官网和记忆管理平台的视觉设计、内容规划与前端开发。',
        },
      ],
      afterHighlightBullets:
        '产品已在两周内快速孵化上线，目前正在用户公测体验阶段和商业化规划阶段。',
      externalUrl: 'https://m0.seekdb.ai/',
      gallery: ['/images/work-5.webp', '/images/work-4.webp'],
    },
  },
  momo: {
    en: {
      tags: ['Web App', 'Data Product', 'B2B'],
      paragraphs: [
        'OceanBase Datapilot brings AI-assisted workflows into the database operator’s daily toolkit—bridging complex metadata, diagnostics, and natural-language intent.',
        'The project focused on progressive disclosure for expert users, consistent language across SQL and conversational entry points, and states that stay legible under load and partial failures.',
      ],
      gallery: ['/images/work-3.webp', '/images/work-6.webp', '/images/work-7.webp', '/images/work-2.jpg'],
    },
    zh: {
      tags: ['Web 应用', '数据产品', 'B 端'],
      paragraphs: [
        'OceanBase Datapilot 将 AI 辅助能力嵌入数据库运维与研发场景，连接复杂元数据、诊断流程与自然语言意图。',
        '设计侧强调对专家用户的渐进呈现、SQL 与对话入口的语言一致性，以及在负载与异常下仍清晰可辨的界面状态。',
      ],
      gallery: ['/images/work-3.webp', '/images/work-6.webp', '/images/work-7.webp', '/images/work-2.jpg'],
    },
  },
  coinos: {
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
      gallery: ['/images/work-5.webp', '/images/work-4.webp', '/images/work-6.webp', '/images/work-3.webp'],
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
          text: '制定设计规范（包括视觉、交互、文案、动效等），输出组件库与使用文档。',
        },
        {
          keyword: '多线落地',
          text: '推动设计系统在多条产品线中落地。',
        },
      ],
      afterHighlightBullets: '形成团队 AI 产品设计的标准化资产，在多条产品线中复用率超过 70%。',
      gallery: ['/images/work-5.webp', '/images/work-4.webp', '/images/work-6.webp', '/images/work-3.webp'],
    },
  },
  'climate-energy': {
    en: {
      tags: ['Ops Platform', 'Dashboards', 'Workflow'],
      paragraphs: [
        'Database Ops platform unifies change tickets, health signals, and approvals into one calm control surface for teams managing production risk.',
        'Emphasis on scan-friendly tables, decisive empty and error states, and flows that reduce context switching between monitoring and action.',
      ],
      gallery: ['/images/work-6.webp', '/images/work-7.webp', '/images/work-2.jpg', '/images/work-5.webp'],
    },
    zh: {
      tags: ['运维平台', '仪表盘', '工作流'],
      paragraphs: [
        '数据库运维管控平台将变更工单、健康信号与审批收敛为同一套克制的控制面，服务需要管理生产风险的团队。',
        '侧重可扫读的表格、明确的空态与错误态，以及减少在监控与操作之间来回切换的流程设计。',
      ],
      gallery: ['/images/work-6.webp', '/images/work-7.webp', '/images/work-2.jpg', '/images/work-5.webp'],
    },
  },
  lumina: {
    en: {
      tags: ['Developer Tools', 'IDE UX', 'Productivity'],
      paragraphs: [
        'Data Development Tools targets long sessions in editors and pipelines—where small friction compounds into hours lost each week.',
        'Work covered keyboard-first patterns, dense-but-readable panels, and feedback loops that make success and failure equally understandable.',
      ],
      gallery: ['/images/work-7.webp', '/images/work-3.webp', '/images/work-5.webp', '/images/work-6.webp'],
    },
    zh: {
      tags: ['开发者工具', 'IDE 体验', '效率'],
      paragraphs: [
        '数据开发工具面向编辑器与流水线中的长时间使用场景——细微阻力会在每周累积成可观的时间成本。',
        '设计涵盖键盘优先路径、信息密度与可读性的平衡，以及让成功与失败同样易于理解的反馈闭环。',
      ],
      gallery: ['/images/work-7.webp', '/images/work-3.webp', '/images/work-5.webp', '/images/work-6.webp'],
    },
  },
  'brc-launchpad': {
    en: {
      tags: ['Prototype', 'Design Agent', 'Demo'],
      paragraphs: [
        'Design Agent (Demo) prototypes how generative assistants sit beside the canvas—suggesting variants, constraints, and rationale without taking over the file.',
        'The demo prioritizes reversible actions, visible prompts, and a tight loop between “ask” and “inspect diff” so reviewers stay in control.',
      ],
      gallery: ['/images/work-4.webp', '/images/work-2.jpg', '/images/work-7.webp', '/images/work-5.webp'],
    },
    zh: {
      tags: ['原型', '设计智能体', '演示'],
      paragraphs: [
        'Design Agent（演示）探索生成式助手如何与画板并存——在建议方案、约束与依据的同时，不剥夺设计师对文件的掌控。',
        '演示强调可撤销操作、可见的提示词，以及「提问」与「查看差异」之间的紧凑闭环，便于评审者把握节奏。',
      ],
      gallery: ['/images/work-4.webp', '/images/work-2.jpg', '/images/work-7.webp', '/images/work-5.webp'],
    },
  },
}

export function getProjectDetail(slug: string, locale: Locale): ProjectDetailBlock | undefined {
  const row = details[slug]
  if (!row) return undefined
  return locale === 'zh' ? row.zh : row.en
}
