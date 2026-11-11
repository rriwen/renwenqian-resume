import { getProjectDetail, type ProjectGalleryItem } from '../../data/projectDetails'
import { getProjectTitle, projects } from '../../data/projects'
import { getDataPilotContent } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'

export type ChatProjectImage = {
  src: string
  caption: string
  projectTitle: string
  projectPath: string
}

const cache = new Map<Locale, ChatProjectImage[]>()

/** The prompt and renderer share the same catalogue of existing, contextual project figures. */
export function getChatProjectImages(locale: Locale): ChatProjectImage[] {
  const cached = cache.get(locale)
  if (cached) return cached
  const images: ChatProjectImage[] = []
  const seen = new Set<string>()
  for (const project of projects) {
    const projectTitle = getProjectTitle(project, locale)
    const add = (image: ProjectGalleryItem & { alt?: string }, context: string, anchor = '') => {
      // Cropped source sheets need their own renderer; do not mislabel the whole sheet as a detail.
      if (image.sourceRegion || !/^\/images\/[\w./-]+\.(?:png|jpe?g|webp|gif|svg)$/i.test(image.src)
        || /(?:占位|待补|准备中|概念|placeholder|concept)/i.test(image.caption)
        || seen.has(image.src)) return
      seen.add(image.src)
      images.push({
        src: image.src,
        caption: image.caption.trim() || image.alt?.trim() || context,
        projectTitle,
        projectPath: `/project/${project.slug}${anchor ? `#${anchor}` : ''}`,
      })
    }
    if (project.slug === 'dataagent') {
      // Growth exploration reuses experience screenshots as placeholders, including unmarked EN captions.
      for (const section of getDataPilotContent(locale).parts.experience.sections) {
        for (const image of section.images) add(image, section.title, section.id)
        for (const image of section.evolutionMedia ?? []) {
          if (image.src) add({ src: image.src, caption: image.caption }, section.title, section.id)
        }
      }
      continue
    }
    const detail = getProjectDetail(project.slug, locale)
    if (!detail) continue
    for (const section of detail.sections ?? []) {
      for (const image of section.images) add(image, section.title, section.id)
      for (const subsection of section.subsections ?? []) {
        for (const image of subsection.images ?? []) add(image, subsection.title, subsection.id)
        for (const option of subsection.comparison?.options ?? []) {
          for (const image of option.images) add(image, `${subsection.comparison!.title} · ${option.title}`, subsection.id)
        }
      }
    }
    for (const image of detail.gallery) add(image, projectTitle)
  }
  cache.set(locale, images)
  return images
}
