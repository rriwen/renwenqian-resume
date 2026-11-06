import { projects, type Project } from '../../data/projects'

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, '')
const projectNames = (project: Project) => [project.title, project.titleEn, project.slug,
  ...(project.slug === 'dataagent' ? ['DataPilot', '智能问数'] : []),
  ...(project.slug === 'aidesignsystem' ? ['AI 设计系统', 'AI Design System', 'Agent Ready 组件库', 'Agent Ready Component Library', 'Design Token、Design Skill', 'Design Token & Design Skill'] : [])]

function shorten(text: string) {
  const limit = /[\p{Script=Han}]/u.test(text) ? 24 : 48
  const characters = Array.from(text)
  if (characters.length <= limit) return text
  const excerpt = characters.slice(0, limit).join('')
  return excerpt.replace(/\s+\S*$/, '').trimEnd() + '…'
}

/** Stable, local topic labels: opening history never needs an extra model request. */
export function conversationTitle(text: string): string {
  const question = text.trim().replace(/\s+/g, ' ')
  if (!question) return '新对话'
  const normalized = normalize(question)
    .split(normalize('Design Token、Design Skill')).join(normalize('Agent Ready 组件库'))
    .split(normalize('Design Token & Design Skill')).join(normalize('Agent Ready 组件库'))
  const subjects = projects.filter((project) => projectNames(project).some((name) => normalized.includes(normalize(name))))

  if (subjects.length) {
    const subject = subjects.map((project) => project.title).join('与')
    if (subjects.length > 1) return shorten(`${subject} · ${/对比|比较|区别|compare|versus|difference/i.test(question) ? '项目对比' : '项目概览'}`)
    const focus = projectNames(subjects[0]).reduce((value, name) => value.split(normalize(name)).join(''), normalized)
    const facets = [
      { pattern: /挑战|难点|困难|challenge|difficult/i, title: '挑战与解决思路' },
      { pattern: /职责|负责|分工|贡献|responsibilit|contribution|yourrole/i, title: '职责与贡献' },
      { pattern: /设计|决策|方案|design|decision/i, title: '设计思路' },
      { pattern: /成果|指标|效果|增长|采纳率|result|outcome|impact|metric/i, title: '项目成果' },
    ].filter(({ pattern }) => pattern.test(focus))
    return `${subject} · ${facets.length === 1 ? facets[0].title : facets.length > 1 ? '项目复盘' : '项目概览'}`
  }

  if (/自我介绍|介绍(?:一下|下)?(?:你自己|自己)|self.introduction|introduce yourself/i.test(question)) {
    return /岗位|适合|匹配|roles?|fit/i.test(question) ? '自我介绍与岗位匹配' : '个人背景介绍'
  }
  const topics: [RegExp, string][] = [
    [/工作经历|职业经历|职业发展|履历|work (?:history|experience)|career/i, '工作经历与职业亮点'],
    [/擅长|优势|强项|核心能力|strengths?|expertise/i, '擅长领域与核心能力'],
    [/项目经历|代表性.*项目|代表项目|做过.*项目|representative projects/i, '代表项目与设计成果'],
    [/联系|邮箱|电话|微信|合作|contact|e-?mail|collaborat/i, '联系方式与合作'],
    [/介绍.*(?:你的工作|工作内容)|职业背景|专业背景|professional background/i, '职业背景简介'],
    [/摄影|拍照|photograph/i, '摄影与创作'],
  ]
  const topic = topics.find(([pattern]) => pattern.test(question))
  if (topic) return topic[1]

  // Preserve unfamiliar subjects instead of inventing a generic or unrelated topic.
  const concise = question
    .replace(/^(?:(?:你好|您好)[，,！!。\s]*|(?:请|能否|可以|能不能|帮我|麻烦你|给我|你能)\s*|用(?:一句话|简短的话|\d+\s*(?:秒|句话|字))\s*|(?:简单|简要|详细)\s*|(?:介绍|解释|讲解|说说|谈谈|聊聊)(?:一下)?\s*)+/u, '')
    .replace(/^(?:please\s+)?(?:tell me about|explain|describe|summarize)\s+/i, '')
    .split(/[。！？!?\n]/u)[0]
    .replace(/[，,；;：:\s]+$/u, '')
    .replace(/[吗呢呀啊]$/u, '')
    .trim()
  return shorten(concise || question)
}
