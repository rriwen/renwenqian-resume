import type { Locale } from '../i18n/translations'
import { getProjectGroups, projects, type Project } from './projects'

/** Alternate presentations share a canonical project and stay out of the chat corpus. */
export type ProjectView = {
  id: number
  slug: string
  sourceSlug: string
  title: Record<Locale, string>
}

export const projectViews: readonly ProjectView[] = [
  {
    id: -1,
    slug: 'databaseops-visual',
    sourceSlug: 'databaseops',
    title: { zh: '数据库运维平台', en: 'Database Operations' },
  },
]

export function getProjectViewBySlug(slug: string | undefined) {
  return projectViews.find(view => view.slug === slug)
}

/** Legacy view URLs are aliases only; navigation uses canonical project routes. */
export function getProjectNavigationGroups(items: readonly Project[] = projects) {
  return getProjectGroups(items)
}
