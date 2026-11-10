import type { Locale } from '../../i18n/translations'

/** Short display introductions; full case copy remains in projectDetails. */
const introductions: Record<string, Record<Locale, string>> = {
  agentops: { zh: '从执行链路与结果回放入手，让 Agent 的运行过程可观察、可排查', en: 'Make Agent execution observable and diagnosable through traces and replay' },
  text2sql: { zh: '将自然语言问数融入 SQL 编辑器，串联生成、执行与结果查看', en: 'Connect natural-language queries, SQL generation, execution, and results' },
  datadevelop: { zh: '围绕数据库开发任务，持续打磨 SQL 编辑与数据操作体验', en: 'Improve SQL editing and data operations around database development tasks' },
  'workflow-editor': { zh: '通过可视化编排，组织数据任务的执行顺序与依赖关系', en: 'Organize data tasks and dependencies through visual workflow orchestration' },
  aidesignsystem: { zh: '串联设计资产、规则映射与代码交付，探索设计师参与 AI 研发的方式', en: 'Connect design assets, rules, and code delivery to explore design in AI-assisted development' },
  Memory: { zh: '让 Agent 的经验可积累、可检索、可复用', en: 'Make Agent experience retrievable and reusable' },
  skills: { zh: '将组件用法与工程约束整理为可复用的 AI 协作规则', en: 'Turn component usage and engineering constraints into reusable AI collaboration rules' },
}
export const getCaseStudyIntroduction = (slug: string, locale: Locale) => introductions[slug]?.[locale]

/** Methods shown in the case header, independent of project categories. */
const methods: Record<string, [string[], string[]]> = {
  dataagent: [['场景验证', '交互设计', 'AI 辅助开发'], ['Scenario validation', 'Interaction design', 'AI-assisted development']],
  databaseops: [['用户旅程', '埋点分析', '原型验证'], ['User journeys', 'Funnel analysis', 'Prototype validation']],
  agentops: [['场景分析', '交互设计', '原型设计'], ['Scenario analysis', 'Interaction design', 'Prototyping']],
  text2sql: [['交互设计', '界面设计', '原型设计'], ['Interaction design', 'UI design', 'Prototyping']],
  datadevelop: [['用户访谈', '可用性测试', '设计规范'], ['User interviews', 'Usability testing', 'Design guidelines']],
  'workflow-editor': [['流程梳理', '交互设计', '方案对比'], ['Flow mapping', 'Interaction design', 'Design comparison']],
  aidesignsystem: [['Design Token', '组件映射', 'AI 辅助开发'], ['Design Token', 'Component mapping', 'AI-assisted development']],
  Memory: [['产品设计', '交互设计', 'AI 辅助开发'], ['Product design', 'Interaction design', 'AI-assisted development']],
  'design-token': [['Design Token'], ['Design Token']],
  skills: [['Skill 编写', '组件复用', 'AI 辅助开发'], ['Skill authoring', 'Component reuse', 'AI-assisted development']],
  'design-md': [['DESIGN.md'], ['DESIGN.md']],
}
export const getCaseStudyMethods = (slug: string, locale: Locale): string[] =>
  methods[slug]?.[locale === 'zh' ? 0 : 1] ?? []
