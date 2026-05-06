export type Project = {
  id: number
  slug: string
  title: string
  /** 封面图 URL（如 `/images/cover.gif`）；支持静态图与 GIF 动图 */
  image: string
}

export const projects: Project[] = [
  { id: 1, slug: 'Memory', title: 'Memory for OpenClaw', image: '/images/memory-m0-hero.jpg' },
  { id: 2, slug: 'datapilot', title: 'OceanBase Datapilot', image: '/images/datapilot-hero.png' },
  { id: 3, slug: 'aidesignsystem', title: 'AI Design System', image: '/images/aidesignsystem-hero.jpg' },
  { id: 4, slug: 'databaseops', title: 'Database Ops platform', image: '/images/databaseops-hero.jpg' },
  { id: 5, slug: 'datadevelop', title: 'Data Development Tools', image: '/images/datadevelop-hero.jpg' },
]

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
