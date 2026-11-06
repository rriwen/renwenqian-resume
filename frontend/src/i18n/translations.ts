import { interviewSystemPrompts } from '../lib/chat/interviewPrompt'

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
    greeting: string
    description: string
  }
  experiments: {
    title: string
    placeholder: string
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
    dismiss: string
    closeAria: string
    intro: string
    wechatAria: string
  }
  chatbot: {
    dialogAria: string
    backHome: string
    placeholder: string
    sendAria: string
    stop: string
    stopped: string
    interrupted: string
    generating: string
    history: string
    historyLocal: string
    historyEmpty: string
    closeHistory: string
    deleteConversation: string
    deleteConversationConfirm: string
    deleteConversationError: string
    deleteAction: string
    cancelDelete: string
    storageError: string
    queued: string
    contextRemaining: string
    contextEstimated: string
    contextTrimmed: string
    contextTooLong: string
    quickServices: string
    quickDesignDev: string
    quickTimeline: string
    quickProjects: string
    quickPromptServices: string
    quickPromptDesignDev: string
    quickPromptTimeline: string
    quickPromptProjects: string
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
      name: 'SICHENG',
      role: 'Product Designer',
      home: 'New chat',
      projects: 'Projects',
      projectsMenuAria: 'Project list',
      about: 'Resume',
      contact: 'Contact',
      navAria: 'Primary navigation',
    },
    language: {
      switcherAria: 'Language',
      english: 'English',
      chinese: '简体中文',
    },
    home: {
      title: 'SICHENG | Product Designer',
      greeting: "Hi, I'm Sicheng",
      description: 'AI product designer focused on AI products, productivity tools and complex systems.',
    },
    experiments: {
      title: 'Experiments',
      placeholder: 'Coming soon.',
    },
    about: {
      title: 'Resume | SICHENG',
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
        "I'm Sicheng, a product designer.",
        'From business insight, through concept design, to building products.',
        'I believe that great products care about both how they work and how they feel.',
      ],
      botLink: 'Talk to Me',
    },
    contact: {
      dialogAria: 'Contact',
      title: 'Feel free to reach out',
      dismiss: 'Got it',
      closeAria: 'Close',
      intro: 'Feel free to contact me at any time! I typically reply within one day.',
      wechatAria: 'WeChat 18362976211',
    },
    chatbot: {
      dialogAria: 'Chat assistant',
      backHome: 'Back',
      placeholder: 'Type your message...',
      sendAria: 'Send message',
      stop: 'Stop generating',
      stopped: 'Stopped',
      contextRemaining: 'Context remaining',
      contextEstimated: 'estimated',
      contextTrimmed: 'Earlier messages are outside context but remain in your history.',
      contextTooLong: 'Input too long. Shorten it or start a new conversation.',
      interrupted: 'This response was interrupted. Saved content is shown above.',
      generating: 'Generating…',
      history: 'Chat history',
      historyLocal: 'Saved in this browser',
      historyEmpty: 'Your conversations will appear here.',
      closeHistory: 'Close chat history',
      deleteConversation: 'Delete conversation',
      deleteConversationConfirm: 'Delete this conversation?',
      deleteConversationError: 'Could not delete this conversation. Please try again.',
      deleteAction: 'Delete',
      cancelDelete: 'Cancel',
      storageError: 'Chat history could not be saved in this browser. You can keep chatting on this page.',
      queued: 'Sending after this reply: ',
      quickServices: 'About me',
      quickDesignDev: 'Areas of expertise',
      quickTimeline: 'Work experience',
      quickProjects: 'Project experience',
      quickPromptServices:
        'Briefly introduce yourself.',
      quickPromptDesignDev:
        'What are your areas of expertise? Please explain with examples from your projects.',
      quickPromptTimeline:
        'Tell me about your work history and timeline, and the highlights worth remembering.',
      quickPromptProjects:
        'Tell me about your most representative projects, including the context, your responsibilities, key design decisions, and outcomes.',
      errorGeneric: 'Something went wrong. Please try again in a moment.',
      thinking: 'Thinking…',
      quickToggleAria: 'Show or hide suggested prompts',
      systemPrompt: interviewSystemPrompts.en,
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
      name: '泗澄',
      role: '产品设计师',
      home: '新对话',
      projects: '项目',
      projectsMenuAria: '项目列表',
      about: '关于我',
      contact: '联系',
      navAria: '主导航',
    },
    language: {
      switcherAria: '语言',
      english: 'English',
      chinese: '简体中文',
    },
    home: {
      title: '泗澄 | 产品设计师',
      greeting: '你好，我是泗澄',
      description: 'AI 产品设计师，专注 AI 产品、效率工具和复杂系统',
    },
    experiments: {
      title: '一些尝试',
      placeholder: '内容准备中。',
    },
    about: {
      title: '关于我 | 泗澄',
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
        '我是泗澄，一名产品设计师。',
        '从业务洞察，经概念设计，到落地产品。',
        '我相信，好用的产品一定简单。',
      ],
      botLink: '和我聊聊',
    },
    contact: {
      dialogAria: '联系',
      title: '欢迎随时联系',
      dismiss: '我知道了',
      closeAria: '关闭',
      intro: '欢迎随时联系我。',
      wechatAria: '18362976211',
    },
    chatbot: {
      dialogAria: '对话助手',
      backHome: '返回',
      placeholder: '输入你的问题…',
      sendAria: '发送',
      stop: '停止生成',
      stopped: '已终止',
      contextRemaining: '上下文剩余',
      contextEstimated: '估算',
      contextTrimmed: '较早内容已移出上下文，历史仍保留。',
      contextTooLong: '输入过长，请缩短或新建对话。',
      interrupted: '上次回复已中断，已保存的内容保留在上方。',
      generating: '生成中…',
      history: '历史对话',
      historyLocal: '保存在当前浏览器',
      historyEmpty: '开始聊天后，对话会显示在这里。',
      closeHistory: '关闭历史对话',
      deleteConversation: '删除对话',
      deleteConversationConfirm: '删除这条对话？',
      deleteConversationError: '删除失败，请重试。',
      deleteAction: '删除',
      cancelDelete: '取消',
      storageError: '无法在此浏览器保存历史记录，你仍可在当前页面继续聊天。',
      queued: '本次回复结束后发送：',
      quickServices: '关于我',
      quickDesignDev: '擅长领域',
      quickTimeline: '工作经历',
      quickProjects: '项目经历',
      quickPromptServices: '简单介绍下你自己',
      quickPromptDesignDev: '你擅长的领域是什么？请结合项目说明',
      quickPromptTimeline: '介绍一下你的工作经历，有哪些值得一提的亮点。',
      quickPromptProjects: '介绍一下你最有代表性的项目经历，包括项目背景、你的职责、关键设计决策和最终成果。',
      errorGeneric: '出错了，请稍后再试。',
      thinking: '正在思考…',
      quickToggleAria: '展开或收起快捷提问',
      systemPrompt: interviewSystemPrompts.zh,
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
