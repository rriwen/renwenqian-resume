export type Project = {
  id: number
  slug: string
  title: string
  titleEn: string
  /** 封面图 URL（如 `/images/cover.gif`）；支持静态图与 GIF 动图 */
  image: string
}

export const projects: Project[] = [
  { id: 1, slug: 'dataagent', title: 'AI 智能问数', titleEn: 'DataAgent', image: '/images/datapilot-hero.png' },
  { id: 2, slug: 'agentops', title: 'Agent 可观测产品', titleEn: 'Agent Observability', image: '/images/work-6.webp' },
  { id: 3, slug: 'Memory', title: 'Agent 记忆插件', titleEn: 'Agent Memory Plugin', image: '/images/memory-m0-hero.jpg' },
  { id: 4, slug: 'aidesignsystem', title: 'AI 设计系统', titleEn: 'AI Design System', image: '/images/aidesignsystem-hero.jpg' },
  { id: 5, slug: 'datadevelop', title: '数据库开发工具', titleEn: 'Database Development Tools', image: '/images/datadevelop-hero.jpg' },
  { id: 6, slug: 'databaseops', title: '数据库运维平台', titleEn: 'Database Operations Platform', image: '/images/databaseops-hero.jpg' },
]

export function getProjectTitle(project: Project, locale: 'zh' | 'en') {
  return locale === 'zh' ? project.title : project.titleEn
}

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  if (!slug) return undefined
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string): { prev?: Project; next?: Project } {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  }
}
