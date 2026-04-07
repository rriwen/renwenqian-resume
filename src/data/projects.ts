export type Project = {
  id: number
  slug: string
  title: string
  image: string
}

export const projects: Project[] = [
  { id: 1, slug: 'karmaverse', title: 'Memory for OpenClaw', image: '/images/work-2.jpg' },
  { id: 2, slug: 'momo', title: 'OceanBase Datapilot', image: '/images/work-3.webp' },
  { id: 3, slug: 'coinos', title: 'AI Design System', image: '/images/work-5.webp' },
  { id: 5, slug: 'climate-energy', title: 'Database Ops platform', image: '/images/work-6.webp' },
  { id: 6, slug: 'lumina', title: 'Data Development Tools', image: '/images/work-7.webp' },
  { id: 4, slug: 'brc-launchpad', title: 'Design Agent (Demo)', image: '/images/work-4.webp' },
]

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  if (!slug) return undefined
  return projects.find((p) => p.slug === slug)
}
