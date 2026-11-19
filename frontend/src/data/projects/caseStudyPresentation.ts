import type { Locale } from '../../i18n/translations'

/** Short display introductions; full case copy remains in projectDetails. */
const introductions: Record<string, Record<Locale, string>> = {
  agentops: { zh: '从执行链路与结果回放入手，让 Agent 的运行过程可观察、可排查',},
  text2sql: { zh: '用自然语言辅助 SQL 编写与修改',},
  datadevelop: { zh: '围绕数据库开发任务，持续打磨 SQL 编辑与数据操作体验',},
  'workflow-editor': { zh: '通过可视化编排，组织数据任务的执行顺序与依赖关系',},
  aidesignsystem: { zh: '串联设计资产、规则映射与代码交付，探索设计师参与 AI 研发的方式',},
  Memory: { zh: '让 Agent 的经验可积累、可检索、可复用',},
  skills: { zh: '将组件用法与工程约束整理为可复用的 AI 协作规则',},
}
export const getCaseStudyIntroduction = (slug: string, locale: Locale) => introductions[slug]?.[locale]

/** Methods shown in the case header, independent of project categories. */
const methods: Record<string, string[]> = {
  dataagent: ['AI Native', '产品规划', '人机交互', '场景验证'],
  databaseops: ['用户旅程', '埋点分析', '原型验证'],
  agentops: ['场景分析', '交互设计', '原型设计'],
  text2sql: ['交互设计', '界面设计', '原型设计'],
  datadevelop: ['用户访谈', '可用性测试', '设计规范'],
  'workflow-editor': ['流程梳理', '交互设计', '方案对比'],
  aidesignsystem: ['Design Token', '组件映射', 'AI 辅助开发'],
  Memory: ['产品设计', '交互设计', 'AI 辅助开发'],
  'design-token': ['Design Token'],
  skills: ['Skill 编写', '组件复用', 'AI 辅助开发'],
  'design-md': ['DESIGN.md'],
}
export const getCaseStudyMethods = (slug: string, _locale: Locale): string[] =>
  methods[slug] ?? []
