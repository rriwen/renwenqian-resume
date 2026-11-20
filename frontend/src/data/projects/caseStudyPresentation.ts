import type { Locale } from '../../i18n/translations'

/** Short display introductions; full case copy remains in projectDetails. */
const introductions: Record<string, Record<Locale, string>> = {
  agentops: { zh: '从执行链路与结果回放入手，让 Agent 的运行过程可观察、可排查',},
  text2sql: { zh: '用自然语言辅助 SQL 编写与修改',},
  datadevelop: { zh: '围绕数据库开发任务，持续打磨 SQL 编辑与数据操作体验',},
  'workflow-editor': { zh: '通过可视化编排，组织数据任务的执行顺序与依赖关系',},
  aidesignsystem: { zh: '构建 Agent Ready 设计系统，让设计资产可理解、可调用、可检查',},
  Memory: { zh: '让 Agent 的经验可积累、可检索、可复用',},
  skills: { zh: '将组件用法与工程约束整理为可复用的 AI 协作规则',},
}
export const getCaseStudyIntroduction = (slug: string, locale: Locale) => introductions[slug]?.[locale]

/** Methods shown in the case header, independent of project categories. */
const methods: Record<string, string[]> = {
  dataagent: ['AI Native', '产品规划', '人机交互', '场景验证'],
  databaseops: ['复杂系统', '用户旅程', '埋点分析', '原型验证'],
  agentops: ['场景分析', '交互设计', '原型设计'],
  text2sql: ['产品设计', 'AI 交互', '复杂流程设计'],
  datadevelop: ['用户访谈', '可用性测试', '设计规范'],
  'workflow-editor': ['流程梳理', '交互设计', '方案对比'],
  aidesignsystem: ['Agent Ready', '组件 API 对齐', 'AI 辅助开发'],
  Memory: ['产品设计', '交互设计', 'AI 辅助开发'],
  'design-token': ['Design Token'],
  skills: ['Skill 编写', '组件复用', 'AI 辅助开发'],
  'design-md': ['DESIGN.md'],
}
export const getCaseStudyMethods = (slug: string, _locale: Locale): string[] =>
  methods[slug] ?? []
