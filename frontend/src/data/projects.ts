import type { Locale } from '../i18n/translations'

export const projectCategories = [
  { id: 'ai-products', label: { zh: 'AI 产品', en: 'AI Products' } },
  { id: 'data-tools', label: { zh: '数据工具', en: 'Data Tools' } },
  { id: 'design-systems', label: { zh: '设计工程化', en: 'Design Engineering' } },
] as const

export type ProjectCategory = (typeof projectCategories)[number]['id']

export type Project = {
  id: number
  slug: string
  title: string
  titleEn: string
  navigationTitle?: Partial<Record<Locale, string>>
  hiddenFromNavigation?: boolean
  category: ProjectCategory
  /** 封面图 URL（如 `/images/cover.gif`）；支持静态图与 GIF 动图 */
  image: string
  /** 项目标签随记录保存，调整排序不会错配。 */
  tags: Record<Locale, string[]>
}

export const projects: Project[] = [
  {
    navigationTitle: { zh: 'AI 智能问数' },
    id: 1, slug: 'dataagent', title: 'AI 智能问数', titleEn: 'DataAgent',
    category: 'ai-products',
    image: '/images/datapilot-hero.png',
    tags: { zh: ['AI Native', '用户增长', '商业化'], en: ['AI Native', 'Growth', 'Commercialization'] },
  },
  {
    navigationTitle: { zh: 'AgentOps', en: 'AgentOps' },
    id: 2, slug: 'agentops', title: 'Agent 可观测产品', titleEn: 'Agent Observability',
    category: 'ai-products',
    image: '/images/agentops-execution-trace.jpg',
    tags: { zh: ['Demo', '可观测性', '产品设计'], en: ['Demo', 'Observability', 'Product Design'] },
  },
  {
    id: 10, slug: 'text2sql', title: 'Text2SQL', titleEn: 'Text2SQL',
    category: 'ai-products', image: '/images/text2sql-interaction-design.png',
    tags: { zh: ['AI 辅助', 'SQL 编辑器', '产品界面设计'], en: ['AI Assistance', 'SQL Editor', 'Product UI Design'] },
  },
  {
    hiddenFromNavigation: true,
    id: 3, slug: 'Memory', title: 'Agent 记忆插件', titleEn: 'Agent Memory Plugin',
    category: 'ai-products',
    image: '/images/memory-m0-hero.jpg',
    tags: { zh: ['全栈设计'], en: ['Full-stack Design'] },
  },
  {
    id: 6, slug: 'databaseops', title: '数据库运维平台', titleEn: 'Database Operations Platform',
    category: 'data-tools',
    image: '/images/databaseops-hero.jpg',
    tags: { zh: ['工具应用', '数据库运维'], en: ['Tools', 'Database Operations'] },
  },
  {
    id: 5, slug: 'datadevelop', title: 'SQL 编辑器', titleEn: 'SQL Editor',
    category: 'data-tools',
    image: '/images/datadevelop-hero.jpg',
    tags: { zh: ['工具应用', '数据库开发'], en: ['Tools', 'Database Development'] },
  },
  {
    id: 11, slug: 'workflow-editor', title: '任务流编辑器', titleEn: 'Workflow Editor',
    category: 'data-tools', image: '/images/datadevelop-workflow.jpg',
    tags: { zh: ['任务编排', '复杂交互'], en: ['Workflow Orchestration', 'Complex Interactions'] },
  },
  {
    id: 4, slug: 'aidesignsystem', title: '设计工程化', titleEn: 'Design Engineering',
    category: 'design-systems',
    image: '/images/aidesignsystem-hero.jpg',
    tags: { zh: ['AI 设计工作流', '组件化设计', '设计与代码协同'], en: ['AI Design Workflow', 'Component-Based Design', 'Design–Code Collaboration'] },
  },
  {
    id: 7, slug: 'design-token', title: 'Design Token', titleEn: 'Design Token',
    category: 'design-systems', image: '/images/aidesignsystem-hero.jpg',
    tags: { zh: ['设计系统'], en: ['Design System'] },
  },
  {
    id: 8, slug: 'skills', title: 'Skills', titleEn: 'Skills',
    category: 'design-systems', image: '/images/aidesignsystem-skill-exploration.jpg',
    tags: { zh: ['设计工程', 'Skills'], en: ['Design Engineering', 'Skills'] },
  },
  {
    id: 9, slug: 'design-md', title: 'DESIGN.md', titleEn: 'DESIGN.md',
    category: 'design-systems', image: '/images/aidesignsystem-hero.jpg',
    tags: { zh: ['设计规范'], en: ['Design Guidelines'] },
  },
]

export function getProjectGroups(items: readonly Project[] = projects) {
  return projectCategories.map((category) => ({
    ...category,
    projects: items.filter((project) => project.category === category.id),
  }))
}

export function getProjectTitle(project: Project, locale: Locale) {
  return locale === 'zh' ? project.title : project.titleEn
}

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  if (!slug) return undefined
  const canonicalSlug = slug === 'ai-智能问数' ? 'dataagent' : slug
  return projects.find((p) => p.slug === canonicalSlug)
}

export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  }
}

export function getProjectNavigationTitle(project: Project, locale: Locale) {
  return project.navigationTitle?.[locale] ?? getProjectTitle(project, locale)
}
