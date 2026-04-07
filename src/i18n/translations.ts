export type Locale = 'en' | 'zh'

export type Messages = {
  header: {
    name: string
    role: string
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
    skills: string[]
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
        body: string
      }
    }
    timeline: {
      navAria: string
      present: { label: string; timePoint: string }
      oceanbase: { label: string; timePoint: string }
      ecidi: { label: string; timePoint: string }
      puhuai: { label: string; timePoint: string }
      education: { label: string; timePoint: string }
    }
  }
  footer: {
    bio: string
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
      iDo: 'I Do',
      skills: ['Product Design', 'Web Design', 'Prototyping', 'Design System', 'User Story'],
      body1:
        "I'm Ren Wenqian—a product designer who understands AI, users, and data, and ships.",
      body2:
        'I lead AI product design for Agent memory plugins, intelligent analytics Q&A, and more: turning AI into user- and Agent-friendly features and interactions, using data to steer experience decisions, and building plugin tools to move faster.',
      body3a:
        'I own experience for database operations, data development tools, and related products. I built an experience measurement practice to find critical breakpoints, then refined information architecture and flows—raising self-service usage from 15% to ',
      body3b: ', lifting user satisfaction by ',
      body3c: ', and cutting technical support cost by ',
      body3d: '.',
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
          body: 'Vice President of the New Media Society: content planning, collateral design, and publishing for the university’s official new media channels.',
        },
      },
      timeline: {
        navAria: 'Jump to experience on this page',
        present: { label: 'Now', timePoint: '2026' },
        oceanbase: { label: 'OceanBase', timePoint: '2021' },
        ecidi: { label: 'ECIDI', timePoint: '2019' },
        puhuai: { label: 'Puhuai', timePoint: '2016' },
        education: { label: 'Education', timePoint: '2012' },
      },
    },
    footer: {
      bio: "I'm Ren Wenqian, a product designer. From business insight, through concept design, to building products. I believe that great products care about both how they work and how they feel.",
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
        'Introduce yourself briefly — what should visitors know about you and this site?',
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
        'You are the conversational assistant for Ren Wenqian’s portfolio site. She is a product designer with strong UX, design systems, and AI product experience (e.g. work at OceanBase / Ant Group). Answer clearly and concisely; stay factual and grounded in typical portfolio / résumé topics. If the user asks for personal contact, collaboration, or hiring, politely point them to the site’s Contact section. Match the user’s language: reply in English for English messages, in Chinese for Chinese messages.',
    },
    cardStack: {
      stackAria: 'Project stack',
      cardSuffix: 'project',
    },
    workDetail: {
      back: 'Back',
      viewSite: 'View the site',
      notFound: 'This project could not be found.',
      galleryAria: 'Project imagery',
    },
  }),
  zh: deepFreezeMessages({
    header: {
      name: 'REN WENQIAN',
      role: '产品设计师',
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
      iDo: '我做什么',
      skills: ['产品设计', '网页设计', '原型制作', '设计系统', '用户故事'],
      body1: '我是 任文倩，也可以叫我 泗澄，一名懂 AI、懂用户、懂数据、能落地的产品设计师。',
      body1IntroBold: {
        beforeName1: '我是 ',
        name1: '任文倩',
        betweenNames: '，也可以叫我 ',
        name2: '泗澄',
        afterName2: '，一名懂 AI、懂用户、懂数据、能落地的产品设计师。',
      },
      body2:
        '主导过 Agent 记忆插件、智能问数等 AI 产品设计，擅长把 AI 技术转化为对用户或 Agent 友好的产品功能和交互，用数据驱动体验决策，也自己造插件工具来提效。',
      body3a:
        '负责过数据库运维、数据开发工具等产品体验，通过搭建体验度量体系发现关键断点，针对性优化信息架构与操作流程，让产品自助使用率从15%提升到',
      body3b: '，用户满意度提高',
      body3c: '，技术支持成本降低',
      body3d: '。',
      work: {
        oceanbase: {
          role: '高级体验设计师',
          period: '2021/07 – 至今',
          meta: '蚂蚁集团 · OceanBase ,  负责 AI 产品探索落地和数据开发管控产品体验',
          highlights: [
            {
              keyword: 'AI 产品探索与落地',
              detail:
                '：主导多个 AI 产品从 0 到 1 孵化（OpenClaw 记忆插件、智能问数、SQL 生成补全），负责业务洞察与产品方案探索，快速将技术能力转化为对用户或 Agent 友好的功能。通过设计可视化执行过程建立用户信任并推动上线，核心场景下用户对生成结果的采纳率从 18% 提升至 60%；',
            },
            {
              keyword: 'AI 设计系统沉淀',
              detail:
                '：基于业务实践，沉淀团队 AI 产品设计资产与规范，包括 Prompt 输入、思维链、消息卡片等可复用组件及交互模式，在多条产品线中复用率超过 70%，显著提升跨产品设计一致性；',
            },
            {
              keyword: '数据开发产品体验',
              detail:
                '：通过用户访谈和行为数据定位体验瓶颈，针对数据变更、SQL 检查等核心场景，重构开发管控平台、变更工单审批、SQL 检查等交互流程并推动上线。核心链路用户自助率从 15% 提升至 75%，产品满意度从 4.8 分提升至 6.2 分（7 分制），并支撑用户规模实现翻倍增长；',
            },
            {
              keyword: '工具与跨团队协同',
              detail:
                '：推动内部设计工具链的 AI 化升级，自研团队提效插件，将前端还原设计稿、还原度验收等重复工作实现 AI 自动化，释放团队约 15% 的基础产能。',
            },
          ],
        },
        ecidi: {
          role: '产品设计师',
          period: '2019/09 – 2021/06',
          meta: '华东勘测设计研究院子公司， 负责云南省级智慧征迁平台产品设计',
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
          body: '新媒体社团副主席，负责官方新媒体平台内容策划、物料设计与发布；大学生创业计划竞赛（全国银奖、江苏省银奖），SmileGate 创意大赛（Logo 设计组二等奖）。',
        },
      },
      timeline: {
        navAria: '本页经历时间轴导航',
        present: { label: '当前', timePoint: '2026' },
        oceanbase: { label: 'OceanBase', timePoint: '2021' },
        ecidi: { label: '华东院', timePoint: '2019' },
        puhuai: { label: '浦槐', timePoint: '2016' },
        education: { label: '教育', timePoint: '2012' },
      },
    },
    footer: {
      bio: '我是任文倩，一名产品设计师。从业务洞察，经概念设计，到落地产品。我相信优秀的产品既要好用，也要有质感。',
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
      headline: '嘿！你好',
      placeholder: '输入你的消息…',
      sendAria: '发送',
      closeAria: '关闭对话',
      quickServices: '关于我',
      quickDesignDev: '擅长领域',
      quickTimeline: '工作经历',
      quickEnquiry: '如何联系',
      quickPromptServices: '简单介绍一下你自己，以及访客在这个网站可以了解你的哪些方面。',
      quickPromptDesignDev: '你在产品设计、用户体验等方面主要擅长哪些领域？',
      quickPromptTimeline: '介绍一下你的工作经历与时间线，有哪些值得一提的亮点。',
      quickPromptContact: '如果想合作、咨询或联系，可以通过哪些方式？网站上的联系入口在哪里？',
      noKeyHint:
        '请在项目根目录的 .env 中配置 VITE_DEEPSEEK_API_KEY=你的密钥，保存后重新运行 dev 或 build。配置完成后对话即可使用 DeepSeek。',
      errorGeneric: '出错了，请稍后再试。',
      thinking: '正在思考…',
      quickToggleAria: '展开或收起快捷提问',
      systemPrompt:
        '你是任文倩个人作品站的对话助手。她是产品设计师，擅长用户体验、设计系统、AI 产品化（例如在 OceanBase / 蚂蚁相关经历）。回答要简洁、专业、可信；内容围绕作品集与履历常见话题。若用户询问私人联系方式、合作或招聘，请礼貌引导其使用网站上的「联系」入口。根据用户语言回复：用户用中文则用中文，用户用英文则用英文。',
    },
    cardStack: {
      stackAria: '项目堆叠',
      cardSuffix: '项目',
    },
    workDetail: {
      back: '返回',
      viewSite: '查看站点',
      notFound: '未找到该项目。',
      galleryAria: '项目配图',
    },
  }),
}
