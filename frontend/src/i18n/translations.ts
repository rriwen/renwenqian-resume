export type Locale = 'en' | 'zh'

export type Messages = {
  header: {
    name: string
    role: string
    home: string
    projects: string
    projectsMenuAria: string
    about: string
    contact: string
    navAria: string
  }
  language: {
    switcherAria: string
    english: string
    chinese: string
  }
  home: {
    title: string
  }
  about: {
    title: string
    iDo: string
    body1: string
    /** 中文简介分段，用于姓名加粗；英文省略 */
    body1IntroBold?: {
      beforeName1: string
      name1: string
      betweenNames: string
      name2: string
      afterName2: string
    }
    body2: string
    body3a: string
    body3b: string
    body3c: string
    body3d: string
    body4: string
    work: {
      oceanbase: {
        role: string
        period: string
        meta: string
        highlights: { keyword: string; detail: string }[]
      }
      ecidi: {
        role: string
        period: string
        meta: string
        li1: string
        li2: string
        li3: string
      }
      puhuai: {
        role: string
        period: string
        meta: string
        li1: string
        li2: string
      }
    }
    education: {
      njupt: {
        role: string
        period: string
        items: string[]
      }
    }
    contactCta: {
      title: string
      wechatPhoneLabel: string
      emailLabel: string
      phone: string
      email: string
    }
    timeline: {
      navAria: string
      present: { label: string; timePoint: string }
      oceanbase: { label: string; timePoint: string }
      ecidi: { label: string; timePoint: string }
      leishu: { label: string; timePoint: string }
      puhuai: { label: string; timePoint: string }
      education: { label: string; timePoint: string }
    }
  }
  footer: {
    bioLines: string[]
    botLink: string
    ariaGrid: string
    ariaStack: string
    projectsNavAria: string
  }
  contact: {
    dialogAria: string
    title: string
    closeAria: string
    intro: string
    wechatAria: string
  }
  chatbot: {
    dialogAria: string
    backHome: string
    headline: string
    placeholder: string
    sendAria: string
    closeAria: string
    quickServices: string
    quickDesignDev: string
    quickTimeline: string
    quickEnquiry: string
    quickPromptServices: string
    quickPromptDesignDev: string
    quickPromptTimeline: string
    quickPromptContact: string
    noKeyHint: string
    errorGeneric: string
    thinking: string
    systemPrompt: string
    quickToggleAria: string
  }
  cardStack: {
    stackAria: string
    cardSuffix: string
  }
  workDetail: {
    back: string
    viewSite: string
    notFound: string
    galleryAria: string
    /** 缩略图按钮：打开全屏查看 */
    galleryOpenFullscreenAria: string
    /** 全屏层 dialog 的无障碍名称 */
    galleryLightboxAria: string
    galleryPrevAria: string
    galleryNextAria: string
    prevProject: string
    nextProject: string
    projectNavAria: string
  }
}

function deepFreezeMessages(m: Messages): Messages {
  return m
}

export const translations: Record<Locale, Messages> = {
  en: deepFreezeMessages({
    header: {
      name: 'REN WENQIAN',
      role: 'Product Designer',
      home: 'Home',
      projects: 'Projects',
      projectsMenuAria: 'Project list',
      about: 'About',
      contact: 'Contact',
      navAria: 'Primary navigation',
    },
    language: {
      switcherAria: 'Language',
      english: 'English',
      chinese: '简体中文',
    },
    home: {
      title: 'REN WENQIAN | Product Designer',
    },
    about: {
      title: 'About | REN WENQIAN',
      iDo: 'What I Do',
      body1:
        "I'm Ren Wenqian—a product designer who understands AI, users, and data, and ships.",
      body2:
        'I lead AI product design for Agent memory plugins, intelligent analytics Q&A, and more: turning AI into user- and Agent-friendly features and interactions, using data to steer experience decisions, and building plugin tools to move faster.',
      body3a:
        'I own experience for database operations, data development tools, and related products. I built an experience measurement practice to find critical breakpoints, then refined information architecture and flows—raising self-service usage from 15% to ',
      body3b: ', lifting user satisfaction by ',
      body3c: ', and cutting technical support cost by ',
      body3d: '.',
      body4:
        'I also explore AI-assisted R&D collaboration workflows: turning product-design best practices into reusable design Skills and interaction standards, and building efficiency plugins that automate design-to-code handoff and visual QA—freeing ~15% of baseline team capacity.',
      work: {
        oceanbase: {
          role: 'Senior Experience Designer',
          period: 'Jul 2021 – Now',
          meta: 'Ant Group · OceanBase ,  AI product exploration & delivery, and data development control platform experience',
          highlights: [
            {
              keyword: 'AI product exploration & delivery',
              detail:
                ': Led multiple AI products from 0 to 1 (OpenClaw memory plugin, intelligent analytics Q&A, SQL generation & completion); owned business insight and solution discovery, turning capabilities into user- and Agent-friendly features quickly. Used visual execution flows to build trust and ship; in core scenarios adoption of generated results rose from 18% to 60%.',
            },
            {
              keyword: 'AI design system',
              detail:
                ': Grounded in practice, built team AI product assets and patterns—reusable components and interaction models for prompt input, chain-of-thought, message cards, and more—reused across product lines at 70%+, improving cross-product consistency.',
            },
            {
              keyword: 'Data development product experience',
              detail:
                ': Combined interviews and behavioral data to find bottlenecks; for data change, SQL checks, and other core flows, redesigned the dev control platform, change approvals, and SQL-check experiences and shipped. Core-journey self-service rose from 15% to 75%; satisfaction from 4.8 to 6.2 (out of 7); supported doubling user scale.',
            },
            {
              keyword: 'Tooling & cross-team collaboration',
              detail:
                ': Drove AI upgrades to internal design tooling; built team efficiency plugins to automate design handoff and visual QA with AI, freeing ~15% of baseline capacity.',
            },
          ],
        },
        ecidi: {
          role: 'Product Designer',
          period: 'Sep 2019 – Jun 2021',
          meta: 'ECIDI subsidiary, responsible for product design of the provincial smart land acquisition platform in Yunnan.',
          li1:
            'Used user interviews and shadowing to uncover business needs, shipped interactive prototypes quickly, and aligned government, experts, and suppliers to launch within six months—digitizing core processes end-to-end and cutting average handling time by 50%.',
          li2:
            'For complex surveying methods and acquisition rules, designed and shipped a modular, configurable rules-engine tool so operations staff could adjust parameters flexibly, raising per-case handling efficiency by 40%.',
          li3:
            'Rolled out cross-team collaboration and design standards, aligned external vendors on delivery criteria, safeguarded quality on large government projects, and shortened iteration cycles.',
        },
        puhuai: {
          role: 'Product Designer',
          period: 'Sep 2016 – Apr 2019',
          meta: 'Shanghai Puhuai Technology, responsible for end-to-end design of a VR panorama image community across VR, Web, and App.',
          li1:
            'Tracked VR industry trends, studied user behavior through A/B tests, surveys, and usability testing, and used competitive research to uncover VR design opportunities.',
          li2:
            'Ran community growth and promotion; reached ~200k users / ~1M visits, ranked top 5 on VR app charts, and was featured multiple times on Oculus, Daydream, Xiaomi, and other platforms.',
        },
      },
      education: {
        njupt: {
          role: 'Nanjing University of Posts and Telecommunications · B.S., Software Engineering',
          period: '2012.09 - 2016.07',
          items: [
            'Coursework included advanced mathematics, data structures, algorithm analysis, computer networks, Android/iOS software development, databases, and related computer science topics.',
            'Vice President of the New Media Society: content planning, collateral design, and publishing for the university’s official new media channels.',
            'University entrepreneurship competition (national silver award, provincial silver award); SmileGate Creative Contest (Logo design track, second prize).',
          ],
        },
      },
      contactCta: {
        title: 'Feel free to contact me',
        wechatPhoneLabel: 'WeChat / Phone',
        emailLabel: 'Email',
        phone: '18362976211',
        email: 'rriwen@gmail.com',
      },
      timeline: {
        navAria: 'Jump to experience on this page',
        present: { label: 'Now', timePoint: '2026' },
        oceanbase: { label: 'OceanBase', timePoint: '2021' },
        ecidi: { label: 'ECIDI', timePoint: '2019' },
        leishu: { label: 'Leishu', timePoint: '2019' },
        puhuai: { label: 'Puhuai', timePoint: '2016' },
        education: { label: 'Education', timePoint: '2012' },
      },
    },
    footer: {
      bioLines: [
        "I'm Ren Wenqian, a product designer.",
        'From business insight, through concept design, to building products.',
        'I believe that great products care about both how they work and how they feel.',
      ],
      botLink: 'Talk to Me',
      ariaGrid: 'Grid view',
      ariaStack: 'Stack view',
      projectsNavAria: 'Projects',
    },
    contact: {
      dialogAria: 'Contact',
      title: 'Contact',
      closeAria: 'Close',
      intro: 'Feel free to contact me at any time! I typically reply within one day.',
      wechatAria: 'WeChat 18362976211',
    },
    chatbot: {
      dialogAria: 'Chat assistant',
      backHome: 'Back',
      headline: 'Hi, How can I help',
      placeholder: 'Type your message...',
      sendAria: 'Send message',
      closeAria: 'Close chat',
      quickServices: 'About me',
      quickDesignDev: 'Areas of expertise',
      quickTimeline: 'Work experience',
      quickEnquiry: 'How to contact',
      quickPromptServices:
        'Imagine you are answering an interviewer: give a 60-second self-introduction and explain why you fit Product Manager and Product Designer roles.',
      quickPromptDesignDev:
        'What are your main strengths in product design, UX, and related areas?',
      quickPromptTimeline:
        'Tell me about your work history and timeline, and the highlights worth remembering.',
      quickPromptContact:
        'How can I get in touch or explore collaboration? What contact options does this site offer?',
      noKeyHint:
        'Add your DeepSeek API key to a .env file as VITE_DEEPSEEK_API_KEY=… then rebuild. The assistant will work once the key is set.',
      errorGeneric: 'Something went wrong. Please try again in a moment.',
      thinking: 'Thinking…',
      quickToggleAria: 'Show or hide suggested prompts',
      systemPrompt:
        'You are Ren Wenqian, a job candidate speaking directly to an interviewer. The target roles are Product Manager and Product Designer, with a focus on AI products, data tools, productivity, and complex systems. After a line containing only ---, your system message includes a plain-text export of all available website content in the current language, including the home page, About, experience, projects, case studies, blog posts, contact details, and footer; this export is the only factual source. Answer in the first person as the candidate, not as a website assistant or narrator. For “tell me about yourself” questions, give a natural 45–90 second spoken answer: present your positioning first, then 2–3 relevant experiences or results, then how you can contribute in the target role. For follow-up questions, answer directly and connect the example to product judgment, user insight, execution, collaboration, or measurable outcome. You may explain the overlap and difference between product management and product design, but do not claim responsibilities, employers, projects, metrics, or opinions that are not in the export. Never invent facts or fill gaps with general knowledge. Use fuzzy keyword and semantic matching to find the most relevant evidence in the export, then synthesize it faithfully. Prefer concrete project context, actions, and outcomes over generic adjectives; keep spoken answers concise unless the interviewer asks for detail. If the export has no evidence for a question, say that the available experience does not cover it and suggest a truthful way to frame the gap—do not speculate. Match the user’s language: English for English messages, Chinese for Chinese messages. Do not start with source disclaimers such as “Based on this site”; begin with the candidate’s answer.',
    },
    cardStack: {
      stackAria: 'Project stack',
      cardSuffix: 'project',
    },
    workDetail: {
      back: 'Back',
      viewSite: 'View the site ↗',
      notFound: 'This project could not be found.',
      galleryAria: 'Project imagery',
      galleryOpenFullscreenAria: 'View image fullscreen',
      galleryLightboxAria: 'Fullscreen image',
      galleryPrevAria: 'Previous image',
      galleryNextAria: 'Next image',
      prevProject: 'Previous project',
      nextProject: 'Next project',
      projectNavAria: 'Adjacent projects',
    },
  }),
  zh: deepFreezeMessages({
    header: {
      name: 'REN WENQIAN',
      role: '产品设计师',
      home: '首页',
      projects: '项目',
      projectsMenuAria: '项目列表',
      about: '关于',
      contact: '联系',
      navAria: '主导航',
    },
    language: {
      switcherAria: '语言',
      english: 'English',
      chinese: '简体中文',
    },
    home: {
      title: 'REN WENQIAN | 产品设计师',
    },
    about: {
      title: '关于 | REN WENQIAN',
      iDo: '我做过什么',
      body1:
        '我是任文倩，一名聚焦 AI 产品化与 AI 工作流优化的产品设计师，2 年 AI 产品设计经验，以产品经理和体验设计师的双重角色主导 AI 产品落地。',
      body1IntroBold: {
        beforeName1: '我是',
        name1: '任文倩',
        betweenNames:
          '，一名聚焦 AI 产品化与 AI 工作流优化的产品设计师，2 年 AI 产品设计经验，以产品经理和体验设计师的双重角色主导 AI 产品落地',
        name2: '',
        afterName2: '。',
      },
      body2:
        '深度实践 MaaS 平台商业化、Agent 记忆机制、PowerRAG、ChatBI 等方向。主导 MaaS 模型服务平台设计，参与 0 到 1 商业化计价体系搭建；负责 OpenClaw 记忆插件、智能问数等产品孵化与设计，将 Agent 记忆、NL2SQL 等技术转化为用户可感知的 AI 产品功能。',
      body3a:
        '在体验度量与数据驱动有扎实积累，推动产品自助使用率从 15% 提升至 ',
      body3b: '，用户满意度提升 ',
      body3c: '，技术支持成本降低 ',
      body3d: '。沉淀可复用设计 Skill 与交互规范，释放团队 15% 基础产能。',
      body4: '',
      work: {
        oceanbase: {
          role: '高级体验设计师',
          period: '2021/07 – 至今',
          meta: '蚂蚁集团 · OceanBase ,  负责 AI 产品探索落地和数据开发管控产品体验',
          highlights: [
            {
              keyword: 'AI 产品规划与商业化',
              detail:
                '：主导 MaaS 模型服务平台的产品设计，参与从 0 到 1 的商业化计价体系搭建，设计按不同供应商、不同模型 Token 的定价模型，构建从免费额度、用量包到企业定制套餐的完整售卖体系，探索 AI 能力对外变现路径；',
            },
            {
              keyword: 'AI 产品探索与落地',
              detail:
                '：定义 Agent 产品演进方向，连接技术实现、用户需求与业务目标，制定可落地的迭代路径；主导 OpenClaw 记忆插件、智能问数、SQL 生成补全、PowerRAG 等多款 AI 产品从 0 到 1 的孵化落地与持续迭代。通过可视化执行过程建立用户信任，核心场景下采纳率从 18% 提升至 60%；',
            },
            {
              keyword: '体验度量与数据驱动',
              detail:
                '：结合用户研究、埋点与 AI 洞察形成设计验证闭环，推动编辑器矩阵标准化交互重构，产品自助使用率从 15% 提升至 75%，用户满意度提升 30%，技术支持成本降低 20%，用户数翻倍；',
            },
            {
              keyword: 'AI 设计系统沉淀',
              detail:
                '：系统性沉淀 AI 产品交互规范，包括 Prompt 输入、思维链、消息卡片等可复用组件及交互模式；建立设计 Skill 与 design.md 机制进行前端一致性约束。同时推动内部设计工具链 AI 化升级，自研提效插件，实现还原设计稿、还原度验收等重复工作自动化，释放团队约 15% 基础产能。',
            },
          ],
        },
        ecidi: {
          role: '产品设计师',
          period: '2019/09 – 2021/06',
          meta: '华东勘测设计研究院子公司',
          li1:
            '通过用户访谈与影子观察深入洞察业务需求，快速产出可交互原型，协同政府、专家、供应商等多方角色，在 6 个月内推动产品上线，实现核心业务全流程数字化，平均业务处理周期缩短 50%；',
          li2:
            '针对复杂的勘测计算方法与征迁业务规则，设计并落地了模块化、可配置的规则引擎工具，支持业务人员灵活调整参数，使单次业务处理效率提升 40%；',
          li3:
            '建立并推行跨团队产品协作流程与设计规范，协调外部供应商统一交付标准，保障大型政企项目质量，迭代交付周期缩短。',
        },
        puhuai: {
          role: '产品设计师',
          period: '2016/09 – 2019/04',
          meta: '上海浦槐科技，负责 VR 全景图片社区多端（VR、Web、App）全链路设计',
          li1:
            '关注 VR 行业趋势，通过 A/B 测试、问卷、可用性测试等方法研究用户行为，结合竞品调研挖掘 VR 设计创新点；',
          li2:
            '持续运营推广社群，实现产品访问量达 20w 人 / 100w 次，达到 VR 产品应用榜 TOP5，并多次被 Oculus、Daydream、小米等平台推荐。',
        },
      },
      education: {
        njupt: {
          role: '南京邮电大学 · 软件工程本科',
          period: '2012.09 - 2016.07',
          items: [
            '学习高等数学、数据结构、算法分析、计算机网络、Android/iOS软件开发、数据库等相关计算机课程；',
            '新媒体社团副主席，负责官方新媒体平台内容策划、物料设计与发布；',
            '大学生创业计划竞赛（全国银奖、江苏省银奖），SmileGate 创意大赛（Logo 设计组二等奖）。',
          ],
        },
      },
      contactCta: {
        title: '欢迎随时联系我',
        wechatPhoneLabel: '微信/电话',
        emailLabel: '邮件',
        phone: '18362976211',
        email: 'rriwen@gmail.com',
      },
      timeline: {
        navAria: '本页经历时间轴导航',
        present: { label: '当前', timePoint: '2026' },
        oceanbase: { label: 'OceanBase', timePoint: '2021' },
        ecidi: { label: '华东院', timePoint: '2020' },
        leishu: { label: '雷数', timePoint: '2019' },
        puhuai: { label: '浦槐', timePoint: '2016' },
        education: { label: '教育', timePoint: '2012' },
      },
    },
    footer: {
      bioLines: [
        '我是任文倩，一名产品设计师。',
        '从业务洞察，经概念设计，到落地产品。',
        '我相信，好用的产品一定简单。',
      ],
      botLink: '和我聊聊',
      ariaGrid: '网格视图',
      ariaStack: '堆叠视图',
      projectsNavAria: '项目',
    },
    contact: {
      dialogAria: '联系',
      title: '联系',
      closeAria: '关闭',
      intro: '欢迎随时联系我。',
      wechatAria: '18362976211',
    },
    chatbot: {
      dialogAria: '对话助手',
      backHome: '返回',
      headline: '嘿！聊点什么',
      placeholder: '输入你的问题…',
      sendAria: '发送',
      closeAria: '关闭对话',
      quickServices: '关于你',
      quickDesignDev: '擅长领域',
      quickTimeline: '工作经历',
      quickEnquiry: '如何联系',
      quickPromptServices: '假设你是面试官，请用 60 秒做一段自我介绍，说明你为什么适合产品经理和产品设计师岗位。',
      quickPromptDesignDev: '你在产品经理和产品设计师工作中分别擅长什么？请结合项目说明。',
      quickPromptTimeline: '介绍一下你的工作经历，有哪些值得一提的亮点。',
      quickPromptContact: '如果想合作或咨询，可以通过哪些方式联系？',
      noKeyHint:
        '抱歉，暂无 API Key。',
      errorGeneric: '出错了，请稍后再试。',
      thinking: '正在思考…',
      quickToggleAria: '展开或收起快捷提问',
      systemPrompt:
        '你是任文倩本人，正在直接回答面试官。求职目标是产品经理和产品设计师，重点方向是 AI 产品、数据工具、效率工具与复杂系统。系统提示中在仅含「---」的一行之后，附有当前语言下网站现有的全部可用内容，包括首页、关于页、工作经历、项目案例、博客文章、联系方式和页脚；该导出是唯一事实来源。请始终使用第一人称，以候选人的口吻回答，不要说自己是网站助手，也不要替候选人做旁白。遇到「请介绍一下你自己」这类问题，请组织成自然的 45–90 秒口述回答：先说明职业定位，再讲 2–3 段最相关的经历或结果，最后说明能为目标岗位带来的价值。遇到追问时先直接回答，再把案例连接到产品判断、用户洞察、执行落地、跨团队协作或可量化结果。可以解释产品经理与产品设计师能力的交集和差异，但不得编造导出中没有的职责、公司、项目、数据或观点；不得用常识补齐经历。通过关键词模糊匹配（同义词、简称、错别字）和语义匹配找到最相关的站内证据，再忠实整合。优先使用具体的项目背景、行动和结果，少用空泛形容词；除非面试官要求展开，否则保持适合口述的简洁篇幅。导出中没有依据时，要如实说明现有经历未覆盖，并给出诚实的表达方式，不要臆测。用户用中文则用中文回答，用英文则用英文回答。不要以「根据本站信息」「根据网站」等来源性套话开头，直接进入候选人的回答。',
    },
    cardStack: {
      stackAria: '项目堆叠',
      cardSuffix: '项目',
    },
    workDetail: {
      back: '返回',
      viewSite: '查看站点 ↗',
      notFound: '未找到该项目。',
      galleryAria: '项目配图',
      galleryOpenFullscreenAria: '全屏查看图片',
      galleryLightboxAria: '全屏图片',
      galleryPrevAria: '上一张',
      galleryNextAria: '下一张',
      prevProject: '上个项目',
      nextProject: '下个项目',
      projectNavAria: '相邻项目',
    },
  }),
}
