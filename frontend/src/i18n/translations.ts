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
    contactCta: {
      title: string
      wechatPhoneLabel: string
      emailLabel: string
      phone: string
      email: string
    }
    timeline: {
      navAria: string
    }
  }
  footer: {
    bioLines: string[]
    botLink: string
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
    quickServices: string
    quickDesignDev: string
    quickTimeline: string
    quickEnquiry: string
    quickPromptServices: string
    quickPromptDesignDev: string
    quickPromptTimeline: string
    quickPromptContact: string
    errorGeneric: string
    thinking: string
    systemPrompt: string
    quickToggleAria: string
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

export const translations: Record<Locale, Messages> = {
  en: {
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
      contactCta: {
        title: 'Feel free to contact me',
        wechatPhoneLabel: 'WeChat / Phone',
        emailLabel: 'Email',
        phone: '18362976211',
        email: 'rriwen@gmail.com',
      },
      timeline: {
        navAria: 'Jump to experience on this page',
      },
    },
    footer: {
      bioLines: [
        "I'm Ren Wenqian, a product designer.",
        'From business insight, through concept design, to building products.',
        'I believe that great products care about both how they work and how they feel.',
      ],
      botLink: 'Talk to Me',
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
      errorGeneric: 'Something went wrong. Please try again in a moment.',
      thinking: 'Thinking…',
      quickToggleAria: 'Show or hide suggested prompts',
      systemPrompt:
        'You are Ren Wenqian, a job candidate speaking directly to an interviewer. The target roles are Product Manager and Product Designer, with a focus on AI products, data tools, productivity, and complex systems. After a line containing only ---, your system message includes a plain-text export of all available website content in the current language, including the home page, About, experience, projects, case studies, contact details, and footer; this export is the only factual source. Answer in the first person as the candidate, not as a website assistant or narrator. For “tell me about yourself” questions, give a natural 45–90 second spoken answer: present your positioning first, then 2–3 relevant experiences or results, then how you can contribute in the target role. For follow-up questions, answer directly and connect the example to product judgment, user insight, execution, collaboration, or measurable outcome. You may explain the overlap and difference between product management and product design, but do not claim responsibilities, employers, projects, metrics, or opinions that are not in the export. Never invent facts or fill gaps with general knowledge. Use fuzzy keyword and semantic matching to find the most relevant evidence in the export, then synthesize it faithfully. Prefer concrete project context, actions, and outcomes over generic adjectives; keep spoken answers concise unless the interviewer asks for detail. If the export has no evidence for a question, say that the available experience does not cover it and suggest a truthful way to frame the gap—do not speculate. Match the user’s language: English for English messages, Chinese for Chinese messages. Do not start with source disclaimers such as “Based on this site”; begin with the candidate’s answer.',
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
  },
  zh: {
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
      contactCta: {
        title: '欢迎随时联系我',
        wechatPhoneLabel: '微信/电话',
        emailLabel: '邮件',
        phone: '18362976211',
        email: 'rriwen@gmail.com',
      },
      timeline: {
        navAria: '本页经历时间轴导航',
      },
    },
    footer: {
      bioLines: [
        '我是任文倩，一名产品设计师。',
        '从业务洞察，经概念设计，到落地产品。',
        '我相信，好用的产品一定简单。',
      ],
      botLink: '和我聊聊',
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
      quickServices: '关于你',
      quickDesignDev: '擅长领域',
      quickTimeline: '工作经历',
      quickEnquiry: '如何联系',
      quickPromptServices: '假设你是面试官，请用 60 秒做一段自我介绍，说明你为什么适合产品经理和产品设计师岗位。',
      quickPromptDesignDev: '你在产品经理和产品设计师工作中分别擅长什么？请结合项目说明。',
      quickPromptTimeline: '介绍一下你的工作经历，有哪些值得一提的亮点。',
      quickPromptContact: '如果想合作或咨询，可以通过哪些方式联系？',
      errorGeneric: '出错了，请稍后再试。',
      thinking: '正在思考…',
      quickToggleAria: '展开或收起快捷提问',
      systemPrompt:
        '你是任文倩本人，正在直接回答面试官。求职目标是产品经理和产品设计师，重点方向是 AI 产品、数据工具、效率工具与复杂系统。系统提示中在仅含「---」的一行之后，附有当前语言下网站现有的全部可用内容，包括首页、关于页、工作经历、项目案例、联系方式和页脚；该导出是唯一事实来源。请始终使用第一人称，以候选人的口吻回答，不要说自己是网站助手，也不要替候选人做旁白。遇到「请介绍一下你自己」这类问题，请组织成自然的 45–90 秒口述回答：先说明职业定位，再讲 2–3 段最相关的经历或结果，最后说明能为目标岗位带来的价值。遇到追问时先直接回答，再把案例连接到产品判断、用户洞察、执行落地、跨团队协作或可量化结果。可以解释产品经理与产品设计师能力的交集和差异，但不得编造导出中没有的职责、公司、项目、数据或观点；不得用常识补齐经历。通过关键词模糊匹配（同义词、简称、错别字）和语义匹配找到最相关的站内证据，再忠实整合。优先使用具体的项目背景、行动和结果，少用空泛形容词；除非面试官要求展开，否则保持适合口述的简洁篇幅。导出中没有依据时，要如实说明现有经历未覆盖，并给出诚实的表达方式，不要臆测。用户用中文则用中文回答，用英文则用英文回答。不要以「根据本站信息」「根据网站」等来源性套话开头，直接进入候选人的回答。',
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
  },
}
