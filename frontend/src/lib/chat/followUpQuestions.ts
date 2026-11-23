import { projects } from '../../data/projects'
import type { ChatLine } from './thread'

const normalize = (text: string) => text.toLowerCase().replace(/[\s\p{P}]/gu, '')

/** Local recommendations keep completed replies and restored history immediately usable. */
export function followUpQuestions(history: ChatLine[]): string[] {
  const questions = history.filter((line) => line.role === 'user').map((line) => normalize(line.content))
  const latestQuestion = questions[questions.length - 1] ?? ''
  const answer = normalize(history[history.length - 1]?.content ?? '')
  const findProject = (text: string) => projects.find((project) =>
    [project.title, project.slug, project.navigationTitle?.zh,
      ...(project.slug === 'dataagent' ? ['DataPilot', 'Data Agent', '智能问数'] : []),
    ].some((name) => name && text.includes(normalize(name))))
  const project = findProject(latestQuestion) ?? findProject(answer)
  const candidates = [
    ...(project ? [
      `在${project.title}中，你主要负责哪些工作？`,
      `${project.title}最难的设计问题是怎么解决的？`,
      `${project.title}的设计效果如何验证？`,
      `回顾${project.title}，有哪些值得改进的地方？`,
    ] : []),
    ...(/擅长|优势|能力/.test(latestQuestion) ? ['能用一个具体项目说明你的设计优势吗？', '你如何与产品和研发协作？'] : []),
    '可以介绍一个你最有代表性的项目吗？',
    '你在 OceanBase 的主要工作是什么？',
    '你如何把复杂的业务需求转化为设计方案？',
    '你如何验证设计效果？',
    '你如何与产品和研发协作？',
    '你最擅长解决哪类设计问题？',
  ]
  const unique = [...new Set(candidates)]
  const unseen = unique.filter((question) => !questions.includes(normalize(question)))
  return [...unseen, ...unique.filter((question) => !unseen.includes(question))].slice(0, 2)
}
