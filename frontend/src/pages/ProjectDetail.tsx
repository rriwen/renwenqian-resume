import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataPilotCaseStudy } from '../components/project/DataPilotCaseStudy'
import { StandardProjectDetail } from '../components/project/StandardProjectDetail'
import { getProjectDetail } from '../data/projectDetails'
import { getProjectBySlug, getProjectTitle } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, m } = useLanguage()
  const project = getProjectBySlug(slug)
  const detail = project ? getProjectDetail(project.slug, locale) : undefined

  useEffect(() => {
    document.title = project ? `${getProjectTitle(project, locale)} | REN WENQIAN` : m.home.title
  }, [project, locale, m.home.title])

  if (!project || !detail) {
    return (
      <main className="page-shell project-detail-page">
        <p style={{ margin: 'var(--space-2) 0 var(--paragraph-gap)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text)' }}>
          {m.workDetail.notFound}
        </p>
        <Link to="/" className="back-link project-detail-back-link">{m.workDetail.back}</Link>
      </main>
    )
  }

  if (project.slug === 'dataagent') {
    return <DataPilotCaseStudy key={project.slug} project={project} locale={locale} />
  }

  return <StandardProjectDetail key={project.slug} project={project} detail={detail} />
}
