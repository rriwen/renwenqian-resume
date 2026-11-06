import type { ProjectDetailBlock } from './projectDetails'
import type { Locale } from '../i18n/translations'

export function getProjectAnchors(detail: ProjectDetailBlock, locale: Locale) {
  const zh = locale === 'zh'
  return [
    { id: 'project-overview', title: zh ? '项目概述' : 'Overview' },
    ...(detail.responsibilities ? [{ id: 'responsibilities', title: zh ? '设计职责' : 'Responsibilities' }] : []),
    ...(detail.highlightBullets?.length ? [{ id: 'design-highlights', title: detail.highlightBulletsIntro || (zh ? '设计实践' : 'Design approach') }] : []),
    ...(detail.sections ?? []).filter(section => !section.hideTitle).map(({ id, title }) => ({ id, title })),
    ...(detail.gallery.length ? [{ id: 'project-gallery', title: zh ? '产品展示' : 'Product gallery' }] : []),
  ]
}
