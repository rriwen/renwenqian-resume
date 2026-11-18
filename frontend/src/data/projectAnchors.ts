import type { ProjectDetailBlock } from './projectDetails'
import type { Locale } from '../i18n/translations'

export function getProjectAnchors(detail: ProjectDetailBlock, _locale: Locale) {
  return [
    { id: 'project-overview', title: '项目概述' },
    ...(detail.responsibilities ? [{ id: 'responsibilities', title: '设计职责' }] : []),
    ...(detail.highlightBullets?.length ? [{ id: 'design-highlights', title: detail.highlightBulletsIntro || ('设计实践') }] : []),
    ...(detail.sections ?? []).filter(section => !section.hideTitle).map(({ id, title }) => ({ id, title })),
    ...(detail.gallery.length ? [{ id: 'project-gallery', title: '产品展示' }] : []),
  ]
}
