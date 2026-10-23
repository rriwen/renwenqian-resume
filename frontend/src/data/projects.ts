import type { Locale } from '../i18n/translations'

export type Project = {
  id: number
  slug: string
  title: string
  titleEn: string
  /** 封面图 URL（如 `/images/cover.gif`）；支持静态图与 GIF 动图 */
  image: string
  /** 首页标签随项目保存，调整排序不会错配。 */
  tags: Record<Locale, string[]>
}

export const projects: Project[] = [
  {
    id: 1, slug: 'dataagent', title: 'AI 智能问数', titleEn: 'DataAgent',
    image: '/images/datapilot-hero.png',
    tags: { zh: ['AI Native', '用户增长', '商业化'], en: ['AI Native', 'Growth', 'Commercialization'] },
  },
  {
    id: 2, slug: 'agentops', title: 'Agent 可观测产品', titleEn: 'Agent Observability',
    image: '/images/work-6.webp',
    tags: { zh: ['Demo', '可观测性', '产品设计'], en: ['Demo', 'Observability', 'Product Design'] },
  },
  {
    id: 3, slug: 'Memory', title: 'Agent 记忆插件', titleEn: 'Agent Memory Plugin',
    image: '/images/memory-m0-hero.jpg',
    tags: { zh: ['全栈设计'], en: ['Full-stack Design'] },
  },
  {
    id: 4, slug: 'aidesignsystem', title: 'AI 设计系统', titleEn: 'AI Design System',
    image: '/images/aidesignsystem-hero.jpg',
    tags: { zh: ['设计系统', 'Agent UI'], en: ['Design System', 'Agent UI'] },
  },
  {
    id: 5, slug: 'datadevelop', title: '数据库开发工具', titleEn: 'Database Development Tools',
    image: '/images/datadevelop-hero.jpg',
    tags: { zh: ['工具应用', '数据库开发'], en: ['Tools', 'Database Development'] },
  },
  {
    id: 6, slug: 'databaseops', title: '数据库运维平台', titleEn: 'Database Operations Platform',
    image: '/images/databaseops-hero.jpg',
    tags: { zh: ['工具应用', '数据库运维'], en: ['Tools', 'Database Operations'] },
  },
]

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
