import type { ReactNode } from 'react'
import type { ProjectGalleryItem } from '../../data/projectDetails'
import { ProjectGallery } from './ProjectGallery'

/** Shared exhibition frame; the original image remains available in the lightbox. */
export function CaseStudyMediaFrame({ children, index = 0, item }: { children: ReactNode; index?: number; item?: ProjectGalleryItem }) {
  const palette = item ? Array.from(item.src).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4 : index % 4
  return <div className={`case-study-media case-study-media--${palette}`}>{children}</div>
}

export function CaseStudyGallery({ items }: { items: ProjectGalleryItem[] }) {
  return <ProjectGallery items={items} layout="stacked" imageFrame={CaseStudyMediaFrame} />
}

export function CaseStudyPlaceholder({ title }: { title: string }) {
  return <CaseStudyMediaFrame><div className="case-study-placeholder" role="img" aria-label={`${title} · 配图待补`}><span>{title}</span><small>配图待补</small></div></CaseStudyMediaFrame>
}
